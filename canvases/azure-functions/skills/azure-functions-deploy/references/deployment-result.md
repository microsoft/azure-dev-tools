# Verified deployment result and resource links

Read this contract before handing off deployment. Freeze the destination during
planning, then inspect result identity only after the chosen deployment engine
completes. This does not approve deployment, a retry, or a runtime test. Keep the
user's existing deployment, file-change and test approvals separate.

## Freeze the destination before execution

Record the user-approved subscription ID, tenant ID and Azure cloud for this
deployment. Inspect `az cloud show --query name --output json` and
`az account show --subscription <subscription-id> --query
"{id:id,tenantId:tenantId,environmentName:environmentName}" --output json`.
Stop on a mismatch; do not change account, subscription or cloud automatically.
Keep the exact environment, service and deployment working directory when using
azd. Do not substitute the current canvas picker or another available app.

When a canvas request supplies an instance ID and `hostedDeployment.runId`,
read that instance's Build state and report the approved scope **during plan,
before run**, using `report_deployment_progress`:

```json
{
  "runId": "<the active run ID>",
  "phase": "plan",
  "step": "Review deployment destination",
  "status": "waiting",
  "deploymentScope": {
    "subscriptionId": "<approved subscription GUID>",
    "tenantId": "<verified tenant GUID>",
    "cloud": "AzureCloud"
  }
}
```

The supported clouds are `AzureCloud`, `AzureUSGovernment` and `AzureChinaCloud`.
This scope is frozen for the run. A changed destination needs a new reviewed plan.
Before each write or cloud operation, recheck the active run and selected project.
Stop on stale state or a rejected report. Do not create a canvas run or invent an
instance ID for a standalone chat deployment.

## Verify identity and provide the resource link

Use authoritative deployment outputs to identify the exact Function App. With
azd, read `azd show --environment <environment> --output json --no-prompt` in
the deployment directory. Its `services` object maps each exact service name to
`target.resourceIds`. Require an unambiguous deployed service/resource; never
take the first match or infer a resource group from an environment naming pattern.
Do not pass a positional resource argument to `azd show`, which can read settings.
For another deployment engine, use its actual resource ID output.

Read only that resource:

```text
az resource show --ids <resource-id> --subscription <approved-subscription-id> --query "{id:id,kind:kind,tags:tags}" --output json
```

Require the returned ID to match the output, its subscription to match the frozen
destination, and `kind` to include `functionapp`. Check any azd environment/service
tags against the selected environment/service. Recheck cloud/account context
after lookup. Use bounded read-only calls; do not read settings, keys or full
environment dumps to construct a link.

Present the **Function App in Azure Portal** separately from the app's HTTP/chat
endpoint. Choose the Portal host only from the verified cloud:

| Cloud | Portal host |
| --- | --- |
| AzureCloud | `https://portal.azure.com` |
| AzureUSGovernment | `https://portal.azure.us` |
| AzureChinaCloud | `https://portal.azure.cn` |

Append `/#resource<resource-id>/overview`, URL-encoding each resource ID path
segment while preserving `/` separators. Do not infer the cloud from a resource
ID or hostname. Never append credentials or keys. A resource group link is
optional and requires its own verified identity; the Function App link suffices.

Missing/ambiguous output, denied access, unsupported cloud, scope changes or
timeout mean **deployment completed, resource link unverified**, not a failed
deployment or a healthy runtime. Explain the blocker and how to inspect the exact
deployment. Do not redeploy, switch scope or invent a resource/link to compensate.

For a canvas-bound Hosted Skills run, send final `phase: "verify"`,
`status: "done"`, `final: true` and the actual `resourceId` only after the
deployment and separately approved required verification succeed. The canvas
independently verifies the resource against the scope frozen during plan. A link
lookup failure preserves the reported deployment outcome with an explicit
unverified-link notice. Never suppress the actual deployment or runtime outcome.
If still waiting for required verification, report waiting rather than final
success. If the actual resource ID is unavailable, keep canvas verification
waiting and state that deployment completed but its target identity remains
unverified; do not invent an ID to finish the run. Standalone chat deployments
return the verified Portal link directly;
they do not silently update an unrelated canvas.
