# Build your first Azure canvas

Build a small **Resource groups** canvas: choose one subscription, list its
resource groups, and refresh the same view from either the UI or the agent.
This is a read-only learning scenario, not a resource-management framework.

## Start with your agent

Give your agent this guide and paste:

```text
Build a read-only Resource groups canvas using @microsoft/canvas-toolkit.
Follow its quickstart.md. Use the installed create-canvas-app companion if
available; otherwise invoke the host's create-canvas skill and follow this
guide at its customization step. Keep the host skill authoritative for native
scaffolding, registration, lifecycle and verification.

Start in a new source-app directory. First open the generated demo in the
actual host. Then add explicit subscription selection, the toolkit's
examples/resource-groups.mjs reader, and a themed list with loading, empty,
error and cancellation states. UI and agent calls must use the same validated
actions and state. Keep tokens server-side and never sign in or query on open.
Build a self-contained artifact, verify it in the host, and show me how to
change the displayed fields. Do not create or modify Azure resources.
```

The agent should handle build configuration and wiring, not ask you to choose
every library or write esbuild configuration. You supply the scenario, confirm
the new project location, and choose the Azure account/subscription.

### What you need

- A canvas-capable GitHub Copilot host with its installed `create-canvas` skill.
  If that skill is unavailable, report the prerequisite; do not guess the
  host's SDK or substitute a browser tab for native verification.
- Node.js 22+ (24 recommended), npm, and the toolkit installed using the
  [package setup instructions](README.md#setup-and-exports). A supplied local
  toolkit tarball works too. Keep the generated application's lockfile.
- For the Azure step, Azure CLI 2.61+ on the provider's PATH and an account
  allowed to read resource groups in the chosen subscription. Sign in
  explicitly with `az login` if needed; the example never signs in for you.

This guide ships at `node_modules/@microsoft/canvas-toolkit/quickstart.md`.
All links below stay within the package. It does not require repository build
scripts, another app's source, or a new scaffolding tool.

## 1. Get the smallest canvas running

The installed `create-canvas-app` companion, when available, invokes the
host's `create-canvas` skill and supplies deterministic toolkit setup at its
customization/build step. Follow that installed version's instructions and
generated README; do not copy a setup script from an unrelated example.
Without the companion, use the host skill and the contracts in this guide.

Keep the native scaffold and SDK wiring. Separate Node extension code from
browser code, use the toolkit's public exports, and keep the host SDK
host-provided. Do not install a competing SDK runtime into the emitted app.
Build and open the generated demo before adding Azure, so host/build problems
are not confused with authentication problems.

**Checkpoint:** the actual host registers the canvas, opens its panel, and
an agent action updates that same panel. Generated files, a build success,
or a standalone browser page alone do not establish this.

## 2. Add explicit Azure scope

Create one `createAzureAuthSession()` per owned app/controller lifetime, not
per request. Explicitly load the local profile with `reloadProfile()` and
return only its JSON-safe snapshot to the UI. Loading metadata is not an
Azure resource query or proof of access.

Use the [Azure subscription selector](README.md#azure-subscription-selector)
with `selectionMode: "single"`. Its `transport` calls your same-origin metadata
action; `onApply` calls your shared `select_subscription` action. Feed changes
back with `picker.setState(...)`. On the server, validate against the loaded
session using `auth.resolveScope(...)` and bind the selected subscription with
`auth.bindSubscription({ subscriptionId, tenantId, cloud })`.

Do not pick `accounts[0]`, change the CLI default, or treat a GUID as evidence
of permission. Keep no selection, signed-out, tenant-only, disabled
subscription, and a successful empty Azure result distinct.

Use terminal sign-in for this first lesson. After an external account change,
the user explicitly reloads the profile and selects again. In-panel sign-in
and refresh-from-Azure can be added later using the [authentication
guide](auth.md); they are not required to get the first read working.

## 3. Reuse the small Azure reader

Copy [resource-groups.mjs](examples/resource-groups.mjs) from the installed
package's `examples` directory into your app's server-side source. It uses
only public toolkit imports; it is example source, not a new package export.
Given a bound context, its `readResourceGroups(context, { signal })`:

- performs a read-only, cloud-aware ARM resource-group listing;
- follows continuation pages, projecting only `id`, `name`, and `location`;
- returns an empty array only for a successful empty listing;
- rejects invalidated contexts, cancellation, invalid data, failed pages,
  and the lesson's 200-row / 10-page bounds rather than claiming completeness.

The fixed API version is for this resource-group operation, not a version to
reuse for every Azure service. The optional `httpClient` argument supports
hermetic tests; production callers normally omit it. Importing the example
does not authenticate, read a CLI profile, or contact Azure.

### One action path, two callers

Use [shared actions and state](README.md#canvas-skeleton). The following is
the action contract to implement in the generated app, not a list of
preinstalled toolkit or host actions:

| App action | Input / behavior |
| --- | --- |
| `get_state` | Empty strict object; return JSON-safe scope, status, and bounded rows without Azure I/O. |
| `reload_profile` | Empty strict object; load local metadata, invalidate old scope/results, and publish the new snapshot. Never run the resource query. |
| `select_subscription` | Required subscription ID, tenant ID and supported cloud; validate/bind on the server, cancel old work, and clear old results. No automatic query. |
| `list_resource_groups` | Empty strict object; require the selected context, set loading, call `readResourceGroups` with an owned abort signal, then commit rows only if the context/request is still current. |
| `cancel` | Empty strict object; abort this app's request and publish cancellation, not a successful empty list. |

Define the input schemas once with `defineActions` and its schema builders.
Publish those schemas to the native host actions. Both host handlers and the
UI's `POST api/action` must call that same registry's `dispatch`; do not create
a second Azure implementation for chat.

Keep the selected context and `AbortController` out of serialized state.
Subscribe to authentication lifecycle changes, cancel obsolete work, and
reject stale completions before updating the view. Keep `AuthError`'s safe
fields for expected failures; report unexpected failures with a bounded,
non-sensitive message, never raw SDK/CLI output or a success-shaped `[]`.
The [auth guide](auth.md) specifies context ownership and safe errors.

## 4. Render the shared view

Pass the registry's dispatch and the app's model/subscription functions to
`startCanvasServer`. Serve the full `canvasUiAssets` map along with your HTML
and compiled browser JavaScript. Load the shared stylesheet and use
`class="canvas-ui"` as described in [styling and themes](README.md#styling-and-themes).
The subscription selector also needs its stylesheet.

Render a heading, selected subscription, **List resource groups** / **Cancel**
controls, status, and a simple list. Use `textContent` for Azure values, label
controls, preserve visible keyboard focus, and announce changing status.
Use `formatAzureLocation` only for display; keep raw IDs and locations in state.

The browser reads the same state the agent sees. Subscribe to the server's
SSE change notifications and refresh the model; a chat action must update the
open panel without asking the user to reload. Keep credentials and all Azure
calls in Node, not in the iframe. Use same-origin script assets rather than
inline scripts or CDN dependencies.

`createViewStore` is in-memory, not durable storage. On close, cancel owned
requests, unsubscribe listeners, destroy the browser picker, close the server,
and dispose the owned auth session using the host scaffold's lifecycle.
Do not introduce competing process-shutdown handlers.

## 5. Build and verify the complete path

Use the generated app's build commands. With the toolkit companion these are:

```sh
npm install
npm run build
npm test
```

Use `npm ci` after the lockfile exists. Keep Node and browser bundles separate,
the host SDK external, and all runtime assets in the emitted directory.
Test a relocated copy with no access to the source app's dependencies.
Do not use monorepo packaging commands in an independent application.

**Keep asset-owning UI modules and their relative files together.** Bundlers such
as esbuild do not automatically copy assets referenced with
`new URL(..., import.meta.url)`. Flattening the subscription picker into a
different browser file can move its SVG request outside the canvas URL prefix.
Use the supported [shared UI build helper](README.md#packaging-shared-ui):

```js
import { prepareCanvasUiAssets } from "@microsoft/canvas-toolkit/build";
const ui = await prepareCanvasUiAssets("dist");
```

Use `ui.nodeImport` to rewrite and externalize the provider's
`@microsoft/canvas-toolkit/ui` import; emit the provider at the `dist` root.
Use `ui.browserImports` to rewrite and externalize the listed browser JS imports;
serve the browser entry at the canvas URL root, such as `{secret-prefix}/app.js`.
Those values are **server URL paths**, not disk paths. CSS can bundle normally.
Spread the full `canvasUiAssets` into the server allowlist; the helper copies the
files but does not configure the server or copy your application's own files.
It needs no package at runtime and does not clean output or overwrite conflicting
files. Keep the native scaffold's other build settings.

Preserve that module layout and check actual image decoding (`complete` and
positive `naturalWidth`). Fail on image/script/stylesheet HTTP errors, not just
JavaScript exceptions.

Then return to the native host skill for activation and check:

| Try | Expected result |
| --- | --- |
| Open before sign-in or scope selection | Useful setup/selection state; no automatic login or resource query. |
| Select a subscription and click **List resource groups** | Explicit read; names/locations appear, or an honest empty/error state. |
| Ask the agent to refresh that panel | Same selected scope and action; visible UI update, no second query just for chat. |
| Cancel or change identity during a read | Old results cannot overwrite the new state. |
| Use keyboard, a narrow panel, and a different host theme | Usable controls, readable status, no clipped content. |
| Close and reopen | Owned work is stopped; a fresh ephemeral view is not mistaken for persisted state. |

Keep fixture evidence and live-Azure evidence separate. A fixture verifies
behavior without proving the user's account, network, host or permissions.

## 6. Make it your own

Start with a display-only change: add a location filter over the completed
resource-group list. Preserve raw values, show both displayed and loaded
counts, and do not claim that a local filter narrows the Azure query.

Next, change the read operation in your app's copied reader while retaining
the shared auth, scope, action, state and UI structure. Choose the target
service's actual API version/SDK, permissions, paging rules and projection.
For larger inventories, add a paged view rather than removing safety bounds.
Resource writes are a separate design requiring explicit authorization and
confirmation; changing an action's label does not supply either.

Give the next builder the app README with its setup, commands, source map and
known limits, plus the complete emitted artifact. An installed bundle helps
someone try the app; readable source and one customization exercise help
them learn to build.

## If you get stuck

| Symptom | First check |
| --- | --- |
| Native authoring skill is missing | Use a host with `create-canvas`; do not invent an SDK registration format. |
| Demo works but subscriptions do not load | Check Azure CLI availability from the provider, explicit sign-in, and profile reload. |
| Subscriptions load but Azure read fails | Check selected identity/scope, RBAC and network; metadata is not access proof. |
| Browser works but the host panel is blank | Inspect the actual emitted assets, native registration and CSP; do not loosen CSP as a workaround. |
| Agent action succeeds but UI stays stale | Trace the shared dispatch, state notification and browser subscription, not a second fetch path. |
| Closing the panel leaves work running | Check ownership of requests, listeners, server and auth session against the host lifecycle. |
