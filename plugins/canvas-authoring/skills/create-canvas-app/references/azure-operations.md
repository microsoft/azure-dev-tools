# Azure resource operations

Use this reference for common ARM lifecycle operations. Do not fetch docs to
find these API versions again. For an operation that is not in this table,
open its Microsoft Learn REST page and use the default (latest stable)
version that the page shows. Do not guess an API version.

Versions were verified on Microsoft Learn in November 2026. Each version is
the default moniker for that service. Use the same version for all operations
on one resource type.

## Lifecycle operations

All paths start with
`/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers`.

| Resource | Operation | Method and path suffix | `api-version` | Success responses |
|---|---|---|---|---|
| Container App | List apps in group | `GET /Microsoft.App/containerApps` | `2026-07-01` | 200 (paged) |
| Container App | Start | `POST /Microsoft.App/containerApps/{name}/start` | `2026-07-01` | 200, 202 + `Location` |
| Container App | Stop | `POST /Microsoft.App/containerApps/{name}/stop` | `2026-07-01` | 200, 202 + `Location` |
| Container App | List revisions | `GET /Microsoft.App/containerApps/{name}/revisions` | `2026-07-01` | 200 (paged) |
| Container App | Restart revision | `POST /Microsoft.App/containerApps/{name}/revisions/{revision}/restart` | `2026-07-01` | 200 |
| Web/Function App | Start | `POST /Microsoft.Web/sites/{name}/start` | `2026-08-01` | 200 |
| Web/Function App | Stop | `POST /Microsoft.Web/sites/{name}/stop` | `2026-08-01` | 200 |
| Web/Function App | Restart | `POST /Microsoft.Web/sites/{name}/restart` | `2026-08-01` | 200 |
| Virtual machine | Start | `POST /Microsoft.Compute/virtualMachines/{name}/start` | `2026-04-01` | 200, 202 + `Location` |
| Virtual machine | Restart | `POST /Microsoft.Compute/virtualMachines/{name}/restart` | `2026-04-01` | 200, 202 + `Location` |
| Virtual machine | Deallocate | `POST /Microsoft.Compute/virtualMachines/{name}/deallocate` | `2026-04-01` | 200, 202 + `Location` |
| AKS cluster | Start | `POST /Microsoft.ContainerService/managedClusters/{name}/start` | `2026-08-01` | 202 + `Location`, 204 |
| AKS cluster | Stop | `POST /Microsoft.ContainerService/managedClusters/{name}/stop` | `2026-08-01` | 202 + `Location`, 204 |

Read operations across resource types can also use Azure Resource Graph. If the
user wants an inventory, first offer the built-in `azure-resources-query`
canvas (see the existing-canvas check in `SKILL.md`).

## Resource ID casing

ARM does not return resource IDs in one consistent case. A list call can
return `/resourceGroups/rg/providers/Microsoft.App/containerApps/web` and a GET
or Resource Graph call can return `/resourcegroups/rg/providers/microsoft.app/containerapps/web`.

- Validate ID inputs with `armId({ provider, type })`. It accepts any segment
  casing. Do not write `str({ pattern })` with a case-sensitive ARM ID regex.
- Compare IDs with `a.toLowerCase() === b.toLowerCase()`.
- After a match, keep the listed row's ID as the canonical value in state.

```js
import { armId, obj } from "@microsoft/canvas-toolkit/actions";

const input = obj({ appId: armId({ provider: "Microsoft.App", type: "containerApps" }) });
const sameId = (a, b) => a.toLowerCase() === b.toLowerCase();
const selectApp = (rows, appId) => rows.find(row => sameId(row.id, appId))?.id;
```

## Timestamps

ARM and data-plane responses often return times with no zone suffix, for
example `lastModifiedTimeUtc: "2026-11-11T18:04:12.123"`. The values are UTC.
`new Date()` parses an ISO date-time with no zone as local time, so the shown
time is wrong by the local offset.

- Treat an ISO date-time with no `Z` and no `+hh:mm` or `-hh:mm` offset as UTC.
- Convert on the server or in one browser helper, not in each renderer.
- Show the value with `toLocaleString()`. Keep the raw string for copy and
  details.

```js
const ZONE = /(?:Z|[+-]\d\d:?\d\d)$/i;
const armDate = value => value ? new Date(ZONE.test(value) ? value : `${value}Z`) : null;

armDate("2026-11-11T18:04:12.123")?.toLocaleString(); // UTC, shown in local time
```

## Calls with the toolkit

Bind a subscription first (`auth.bindSubscription(...)`), then use
`@microsoft/canvas-toolkit/azure`. `listArm` follows `nextLink` and reports
incomplete paging. `createArmClient` checks every request, including poll
URLs, against the bound cloud endpoint and subscription. Use only
caller-supplied names that you validated, and encode each path segment.

```js
import { createArmClient, createPipelineRequest, listArm } from "@microsoft/canvas-toolkit/azure";

const CONTAINER_APPS = "2026-07-01";
const appPath = (rg, name) =>
    `/subscriptions/${context.subscriptionId}/resourceGroups/${encodeURIComponent(rg)}` +
    `/providers/Microsoft.App/containerApps/${encodeURIComponent(name)}`;

for await (const revision of listArm(context, `${appPath(rg, app)}/revisions?api-version=${CONTAINER_APPS}`, { signal })) {
    // Project only the fields that the UI needs.
}
```

## Long-running operations

A lifecycle `POST` can complete at once (200 or 204) or return 201 or 202.
An accepted response has an `Azure-AsyncOperation` or `Location` header, and
sometimes `Retry-After`. Do not report success when you receive the 202. Use
the toolkit helper; do not write your own poll loop.

```js
import { runArmOperation } from "@microsoft/canvas-toolkit/azure";

export async function stopApp(context, rg, app, signal) {
    try {
        await runArmOperation(context, `${appPath(rg, app)}/stop?api-version=${CONTAINER_APPS}`, { signal });
        return { busy: false };
    } catch (error) {
        if (error.code === "http-error" && error.status === 409) return { busy: true }; // another operation runs
        throw error; // AuthError: operation-failed, operation-timeout, cancelled, signed-out, forbidden
    }
}
```

`runArmOperation(context, path, { method = "POST", body, signal, timeoutMs = 600000, pollIntervalMs = 5000, httpClient })`:

- Sends the request. A 200 or 204 returns at once.
- On 201 or 202, polls `Azure-AsyncOperation` first, then `Location`. It
  waits for `Retry-After` (at most 60 s), else `pollIntervalMs`.
- An `Azure-AsyncOperation` body ends at `Succeeded`, `Failed`, or `Canceled`.
  A `Location` poll ends at the first non-202 response.
- Returns `{ status: "Succeeded", httpStatus, body }`. Throws `AuthError` with
  `operation-failed` (read `error.operationStatus`), `operation-timeout`,
  `cancelled`, or an HTTP code with `error.status`.
- Accepts only status URLs on the bound Resource Manager host.

Rules for lifecycle actions:

- Mark each such tool `mutates: true` and gate it behind an explicit user
  confirmation in the canvas. Stop, deallocate, and delete use a destructive
  confirmation where the user types the resource name (see the component map
  in `toolkit.md`).
- Show a pending state while the operation runs, then reread the resource and
  show its real state. Do not show success from the request alone.
- Pass an `AbortSignal` and cancel polling when the panel closes or the scope
  changes.
- Show safe error text. Check `error.status === 409`, not the message text. A
  409 usually means another operation is in progress; tell the user to wait
  and refresh.
