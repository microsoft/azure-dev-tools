param(
    [Parameter(Mandatory=$true)] [string] $AppName,
    [string] $SubscriptionId,
    [string] $ResourceGroup,
    [int] $Hours = 24
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

function Invoke-LogAnalyticsRest([string] $Step, [string] $WorkspaceCustomerId, [string] $Kql) {
    if (-not $WorkspaceCustomerId) { return $null }
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("la-query-{0}.json" -f ([guid]::NewGuid().ToString('N')))
    try {
        @{ query = $Kql } | ConvertTo-Json -Compress | Set-Content -Path $tmp -Encoding utf8
        $result = Invoke-AzJson "log-analytics:$Step" @('rest', '--method', 'post', '--url', "https://api.loganalytics.io/v1/workspaces/$WorkspaceCustomerId/query", '--body', "@$tmp", '--headers', 'Content-Type=application/json')
        if ($result -and $result.tables -and @($result.tables).Count -gt 0) { return @($result.tables)[0].rows }
        return $null
    } finally {
        Remove-Item -Path $tmp -ErrorAction SilentlyContinue
    }
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

$healthUrl = 'https://management.azure.com' + $ResourceId + '/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2022-10-01'
$health = Invoke-AzJson 'resource-health' @('rest', '--method', 'get', '--url', $healthUrl)

$funcs = Invoke-AzJson 'functions' (@('functionapp', 'function', 'list', '-g', $ResourceGroup, '-n', $AppName) + $sub)
$functionSummary = @($funcs | ForEach-Object {
    $binding = $_.config.bindings | Where-Object { $_.direction -eq 'In' } | Select-Object -First 1
    [pscustomobject]@{ function=($_.name -replace '^.*/',''); trigger=$binding.type; disabled=$_.isDisabled }
})
$triggerCounts = @($functionSummary | Group-Object trigger, disabled | ForEach-Object {
    [pscustomobject]@{ trigger=$_.Group[0].trigger; disabled=$_.Group[0].disabled; count=$_.Count }
} | Sort-Object trigger, disabled)

$metricNames = 'InstanceCount,CpuPercentage,AverageMemoryWorkingSet,OnDemandFunctionExecutionCount,OnDemandFunctionExecutionUnits,AlwaysReadyFunctionExecutionCount,AlwaysReadyFunctionExecutionUnits,AlwaysReadyUnits'
$metricsRaw = Invoke-AzJson 'metrics' @('monitor', 'metrics', 'list', '--resource', $ResourceId, '--metric', $metricNames, '--interval', 'PT1H', '--aggregation', 'Average', 'Total')
$metrics = @()
if ($metricsRaw -and $metricsRaw.value) {
    $metrics = @($metricsRaw.value | ForEach-Object {
        $totals = @()
        $averages = @()
        foreach ($series in $_.timeseries) {
            foreach ($point in $series.data) {
                if ($null -ne $point.total) { $totals += [double]$point.total }
                if ($null -ne $point.average) { $averages += [double]$point.average }
            }
        }
        [pscustomobject]@{
            name = $_.name.value
            unit = $_.unit
            totalSum = if ($totals.Count) { ($totals | Measure-Object -Sum).Sum } else { $null }
            averageMax = if ($averages.Count) { ($averages | Measure-Object -Maximum).Maximum } else { $null }
            nonZeroTotalBucketCount = @($totals | Where-Object { $_ -ne 0 }).Count
            nonZeroAverageBucketCount = @($averages | Where-Object { $_ -ne 0 }).Count
        }
    })
}

$activityRaw = Invoke-AzJson 'activity-log' (@('monitor', 'activity-log', 'list', '--resource-id', $ResourceId, '--offset', "$($Hours)h", '--max-events', '20') + $sub)
$activity = @($activityRaw | ForEach-Object {
    [pscustomobject]@{
        time = $_.eventTimestamp
        operation = $_.operationName.value
        status = $_.status.value
        caller = $_.caller
        level = $_.level
        correlationId = $_.correlationId
    }
})

$aiResourceId = $null
if ($site.tags) { $aiResourceId = $site.tags.'hidden-link: /app-insights-resource-id' }
$workspaceResourceId = $null
$workspaceCustomerId = $null
if ($aiResourceId) {
    $ai = Invoke-AzJson 'application-insights' @('resource', 'show', '--ids', $aiResourceId)
    $workspaceResourceId = $ai.properties.WorkspaceResourceId
    if (-not $workspaceResourceId) { $workspaceResourceId = $ai.properties.workspaceResourceId }
    if ($workspaceResourceId) {
        $workspace = Invoke-AzJson 'log-analytics-workspace' @('monitor', 'log-analytics', 'workspace', 'show', '--ids', $workspaceResourceId)
        $workspaceCustomerId = $workspace.customerId
    }
}

$telemetry = $null
if ($workspaceCustomerId) {
    $telemetry = [pscustomobject]@{
        workspaceResourceId = $workspaceResourceId
        tableCounts7d = Invoke-LogAnalyticsRest 'table-counts' $workspaceCustomerId "union withsource=TableName AppRequests, AppExceptions, AppTraces, AppDependencies | where TimeGenerated > ago(7d) | summarize Count=count(), Latest=max(TimeGenerated) by TableName | order by TableName"
        requests = Invoke-LogAnalyticsRest 'requests' $workspaceCustomerId "AppRequests | where TimeGenerated > ago($($Hours)h) | summarize Count=count(), Failed=countif(Success == false), AvgDurationMs=avg(DurationMs), P95DurationMs=percentile(DurationMs,95), Latest=max(TimeGenerated) by OperationName | order by Count desc | take 30"
        exceptions = Invoke-LogAnalyticsRest 'exceptions' $workspaceCustomerId "AppExceptions | where TimeGenerated > ago($($Hours)h) | summarize Count=count(), Latest=max(TimeGenerated) by OperationName, ProblemId, Type, OuterMessage | order by Count desc | take 20"
        errorTraces = Invoke-LogAnalyticsRest 'error-traces' $workspaceCustomerId "AppTraces | where TimeGenerated > ago($($Hours)h) | where SeverityLevel >= 2 | summarize Count=count(), Latest=max(TimeGenerated) by SeverityLevel, Message | order by Count desc | take 20"
        dependencies = Invoke-LogAnalyticsRest 'dependencies' $workspaceCustomerId "AppDependencies | where TimeGenerated > ago($($Hours)h) | summarize Count=count(), Failed=countif(Success == false), AvgDurationMs=avg(DurationMs), P95DurationMs=percentile(DurationMs,95), Latest=max(TimeGenerated) by Type, Target, Name | order by Failed desc, Count desc | take 20"
    }
}

[pscustomobject]@{
    resource = [pscustomobject]@{
        id = $ResourceId
        name = $AppName
        resourceGroup = $ResourceGroup
        subscriptionId = $SubscriptionId
        location = $site.location
        kind = $site.kind
    }
    currentStatus = [pscustomobject]@{
        enabled = $site.properties.enabled
        state = $site.properties.state
        availabilityState = $site.properties.availabilityState
        runtimeAvailabilityState = $site.properties.runtimeAvailabilityState
        planStatus = $plan.properties.status
    }
    resourceHealth = if ($health) { [pscustomobject]@{ availabilityState=$health.properties.availabilityState; summary=$health.properties.summary; reasonType=$health.properties.reasonType; reportedTime=$health.properties.reportedTime; title=$health.properties.title } } else { $null }
    triggers = [pscustomobject]@{ counts=$triggerCounts; functions=$functionSummary }
    metrics = $metrics
    applicationInsights = $telemetry
    activityLog = $activity
    gaps = [pscustomobject]@{
        applicationInsightsResourceFound = [bool]$aiResourceId
        workspaceFound = [bool]$workspaceCustomerId
        resourceHealthReturned = [bool]$health
    }
    errors = @($script:Errors)
} | ConvertTo-Json -Depth 30
