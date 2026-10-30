param(
    [Parameter(Mandatory=$true)] [string] $AppName,
    [string] $SubscriptionId,
    [string] $ResourceGroup
)

$ErrorActionPreference = 'Continue'

$script:Errors = [System.Collections.Generic.List[object]]::new()

# Record a failed step. The final JSON output includes every recorded error, so
# a failed Azure call never looks like an empty, healthy result.
function Add-ScriptError([string] $Step, [string] $Message) {
    if ([string]::IsNullOrWhiteSpace($Message)) { $Message = 'The command failed and wrote no error output.' }
    $text = $Message.Trim()
    if ($text.Length -gt 2000) { $text = $text.Substring(0, 2000) }
    $script:Errors.Add([pscustomobject]@{ step = $Step; error = $text })
}

# Run one az command from an argument array. Do not build a command string.
function Invoke-AzJson([string] $Step, [string[]] $AzArgs) {
    $output = & az @AzArgs -o json 2>&1
    $exitCode = $LASTEXITCODE
    $stdout = @($output | Where-Object { $_ -isnot [System.Management.Automation.ErrorRecord] }) -join "`n"
    $stderr = @($output | Where-Object { $_ -is [System.Management.Automation.ErrorRecord] } | ForEach-Object { $_.ToString() }) -join "`n"
    if ($exitCode -ne 0) { Add-ScriptError $Step $stderr; return $null }
    if ([string]::IsNullOrWhiteSpace($stdout)) { return $null }
    try { return $stdout | ConvertFrom-Json } catch {
        Add-ScriptError $Step ('The command output is not valid JSON: ' + $_.Exception.Message)
        return $null
    }
}

function Write-Failure([string] $Message) {
    [pscustomobject]@{ error = $Message; appName = $AppName; errors = @($script:Errors) } | ConvertTo-Json -Depth 5
}

function Redact-Setting([string] $name, $value) {
    if ($name -match 'CONNECTION|Storage|KEY|SECRET|INSIGHTS|TOKEN|PASSWORD|SAS|ACCOUNT') { return '***redacted***' }
    return $value
}

# Do not change the user's Azure CLI state. The script does not run
# 'az account set', 'az config set', or 'az extension add'. It passes the
# subscription to each command instead.
if ($SubscriptionId) {
    $resolvedSubscription = Invoke-AzJson 'subscription' @('account', 'show', '--subscription', $SubscriptionId, '--query', 'id')
    if (-not $resolvedSubscription) {
        Write-Failure 'Subscription not found or not accessible'
        exit 1
    }
    $SubscriptionId = [string]$resolvedSubscription
}

$resource = $null
& az extension show --name resource-graph -o none 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    $where = "type =~ 'microsoft.web/sites' and name =~ '$AppName'"
    if ($ResourceGroup) { $where += " and resourceGroup =~ '$ResourceGroup'" }
    $query = "Resources | where $where | project name, id, resourceGroup, subscriptionId, location, kind, properties"
    $graphArgs = @('graph', 'query', '-q', $query)
    if ($SubscriptionId) { $graphArgs += @('--subscriptions', $SubscriptionId) }
    $graph = Invoke-AzJson 'resource-graph' $graphArgs
    if ($graph -and $graph.data -and @($graph.data).Count -gt 0) { $resource = @($graph.data)[0] }
} else {
    Add-ScriptError 'resource-graph' "The Azure CLI resource-graph extension is not installed. The script does not install extensions, so it used 'az resource list' in the selected or default subscription. To search all subscriptions, install the extension with 'az extension add --name resource-graph' and run the script again."
}

if (-not $resource) {
    $listArgs = @('resource', 'list', '--name', $AppName, '--resource-type', 'Microsoft.Web/sites')
    if ($ResourceGroup) { $listArgs += @('--resource-group', $ResourceGroup) }
    if ($SubscriptionId) { $listArgs += @('--subscription', $SubscriptionId) }
    $list = Invoke-AzJson 'resource-list' $listArgs
    if ($list -and @($list).Count -gt 0) { $resource = @($list)[0] }
}

if (-not $resource) {
    Write-Failure 'Function App not found'
    exit 1
}

$SubscriptionId = $resource.subscriptionId
$ResourceGroup = $resource.resourceGroup
$ResourceId = $resource.id
$sub = @('--subscription', $SubscriptionId)

$siteUrl = 'https://management.azure.com' + $ResourceId + '?api-version=2023-12-01'
$site = Invoke-AzJson 'site' @('rest', '--method', 'get', '--url', $siteUrl)
if (-not $site) { $site = Invoke-AzJson 'site-fallback' (@('functionapp', 'show', '-g', $ResourceGroup, '-n', $AppName) + $sub) }

$planId = $site.properties.serverFarmId
if (-not $planId) { $planId = $site.serverFarmId }
$plan = if ($planId) {
    $planUrl = 'https://management.azure.com' + $planId + '?api-version=2023-12-01'
    Invoke-AzJson 'plan' @('rest', '--method', 'get', '--url', $planUrl)
} else { $null }

$webConfigUrl = 'https://management.azure.com' + $ResourceId + '/config/web?api-version=2023-12-01'
$webConfig = Invoke-AzJson 'web-config' @('rest', '--method', 'get', '--url', $webConfigUrl)

$settingsRaw = Invoke-AzJson 'app-settings' (@('functionapp', 'config', 'appsettings', 'list', '-g', $ResourceGroup, '-n', $AppName) + $sub)
$settingsWanted = @(
    'FUNCTIONS_EXTENSION_VERSION',
    'FUNCTIONS_WORKER_RUNTIME',
    'APPLICATIONINSIGHTS_CONNECTION_STRING',
    'APPINSIGHTS_INSTRUMENTATIONKEY',
    'AzureWebJobsStorage',
    'AzureWebJobsStorage__accountName',
    'AzureWebJobsStorage__credential',
    'WEBSITE_RUN_FROM_PACKAGE',
    'WEBSITE_CONTENTSHARE',
    'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
)
$settings = @($settingsRaw | Where-Object { $settingsWanted -contains $_.name } | ForEach-Object {
    [pscustomobject]@{ name=$_.name; hasValue=($null -ne $_.value -and $_.value -ne ''); value=(Redact-Setting $_.name $_.value) }
})

$funcs = Invoke-AzJson 'functions' (@('functionapp', 'function', 'list', '-g', $ResourceGroup, '-n', $AppName) + $sub)
$functionSummary = @($funcs | ForEach-Object {
    $binding = $_.config.bindings | Where-Object { $_.direction -eq 'In' } | Select-Object -First 1
    [pscustomobject]@{ function=($_.name -replace '^.*/',''); trigger=$binding.type; disabled=$_.isDisabled }
})
$triggerCounts = @($functionSummary | Group-Object trigger, disabled | ForEach-Object {
    [pscustomobject]@{ trigger=$_.Group[0].trigger; disabled=$_.Group[0].disabled; count=$_.Count }
} | Sort-Object trigger, disabled)

$vnetIntegration = Invoke-AzJson 'vnet-integration' (@('webapp', 'vnet-integration', 'list', '-g', $ResourceGroup, '-n', $AppName) + $sub)
$privateEndpoints = Invoke-AzJson 'private-endpoints' (@('network', 'private-endpoint-connection', 'list', '-g', $ResourceGroup, '-n', $AppName, '--type', 'Microsoft.Web/sites') + $sub)
$relatedResources = Invoke-AzJson 'related-resources' (@('resource', 'list', '-g', $ResourceGroup, '--query', '[].{name:name,type:type,location:location,sku:sku.name}') + $sub)

[pscustomobject]@{
    resource = [pscustomobject]@{
        id = $ResourceId
        name = $AppName
        resourceGroup = $ResourceGroup
        subscriptionId = $SubscriptionId
        location = $site.location
        kind = $site.kind
        defaultHostName = $site.properties.defaultHostName
        hostNames = $site.properties.hostNames
    }
    app = [pscustomobject]@{
        enabled = $site.properties.enabled
        state = $site.properties.state
        sku = $site.properties.sku
        functionAppConfig = $site.properties.functionAppConfig
        lastModifiedTimeUtc = $site.properties.lastModifiedTimeUtc
    }
    plan = if ($plan) { [pscustomobject]@{ id=$plan.id; name=$plan.name; sku=$plan.sku; status=$plan.properties.status; location=$plan.location; reserved=$plan.properties.reserved; zoneRedundant=$plan.properties.zoneRedundant } } else { $null }
    network = [pscustomobject]@{
        virtualNetworkSubnetId = $site.properties.virtualNetworkSubnetId
        publicNetworkAccess = $site.properties.publicNetworkAccess
        httpsOnly = $site.properties.httpsOnly
        minTlsVersion = $webConfig.properties.minTlsVersion
        ftpsState = $webConfig.properties.ftpsState
        vnetRouteAllEnabled = $site.properties.vnetRouteAllEnabled
        vnetContentShareEnabled = $site.properties.vnetContentShareEnabled
        vnetImagePullEnabled = $site.properties.vnetImagePullEnabled
        vnetIntegration = $vnetIntegration
        privateEndpointConnectionCount = @($privateEndpoints).Count
    }
    identity = $site.identity
    selectedSettings = $settings
    triggers = [pscustomobject]@{ counts=$triggerCounts; functions=$functionSummary }
    relatedResources = $relatedResources
    errors = @($script:Errors)
} | ConvertTo-Json -Depth 30
