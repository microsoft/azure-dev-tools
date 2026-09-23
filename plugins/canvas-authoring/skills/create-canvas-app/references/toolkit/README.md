# Microsoft Canvas Toolkit

`@microsoft/canvas-toolkit` provides shared APIs, UI components, and developer
tools for building Copilot canvas extensions. Azure is one integration, not a
requirement for using the shared UI.

See [License](#license) for licensing and attribution.
There is no root package export; import one of the entry points below.

## Start here

**[Build your first Azure canvas](quickstart.md)** with one copyable agent
prompt, the host's native scaffold, and a small read-only resource-group
example. The guide covers scope selection, shared UI/agent actions, theming,
bundling, and checking the result in the actual host. It is included in the
installed package, so neither the guide nor its example requires a source checkout.

Already have a canvas? Choose an [entry point](#entry-points) below.
For focused credential/client integration, use the
[authentication examples](examples/README.md).

## Setup and exports

Use Node.js 22 or newer (Node.js 24 recommended). Install the toolkit in your
application:

```bash
npm install @microsoft/canvas-toolkit
```

To install from a downloaded package tarball instead, use its local path:

```bash
npm install /path/to/microsoft-canvas-toolkit-<version>.tgz
```

Retain your application's lockfile for reproducible package and dependency
versions. The canvas host's extension SDK is not a toolkit runtime dependency.
The Azure CLI authentication source requires Azure CLI 2.61 or newer.

The [quickstart](quickstart.md), [authentication guide](auth.md), and
[read-only examples](examples/README.md) are included in the package.
They do not require access to a source repository.

### Entry points

| Entry point | Exports or content |
| --- | --- |
| `@microsoft/canvas-toolkit/build` | Typed `prepareCanvasUiAssets(outDir)`; Node-only build-time copying and bundler import boundaries for shared UI assets |
| `@microsoft/canvas-toolkit/server` | `startCanvasServer`; the loopback HTTP server every canvas needs (secret path prefix, Host/Origin gate, locked-down CSP, bounded JSON, SSE change stream, static asset allowlist) |
| `@microsoft/canvas-toolkit/actions` | `defineActions`, `validate`, `InputError`, and JSON-Schema builders (`str`, `int`, `bool`, `num`, `enum_`, `constant`, `arr`, `obj`, `oneOf`, `empty`, `guid`); the shared input-validation gate |
| `@microsoft/canvas-toolkit/state` | Optional `createViewStore`; a tiny versioned, observable view-model store |
| `@microsoft/canvas-toolkit/session` | `createSessionBridge`; the safe UI→agent bridge (named server-built prompts, no raw prompt text from the iframe) |
| `@microsoft/canvas-toolkit/auth` | `createAzureAuthSession`, `AuthError`; session-based CLI or explicit `TokenCredential` authentication |
| `@microsoft/canvas-toolkit/azure` | Optional `createArmClient`, `createPipelineRequest`, `listArm` |
| `@microsoft/canvas-toolkit/subscriptions` | Pure `normalizeSubscriptionScope`, `SubscriptionError`; no CLI discovery |
| `@microsoft/canvas-toolkit/testing` | `createTestAzureAuthSession` with an isolated CLI-source factory; typed hermetic testing, not production authentication configuration |
| `@microsoft/canvas-toolkit/icons` | `iconForType`, `GENERIC_ICON`, `BY_TYPE`, `azureIconAssets` |
| `@microsoft/canvas-toolkit/ui` | `canvasUiAssets` |
| `@microsoft/canvas-toolkit/ui/icons` | `createIcon`, `hydrateIcons` |
| `@microsoft/canvas-toolkit/ui/locations` | `formatAzureLocation` (display-only browser module) |
| `@microsoft/canvas-toolkit/ui/visual-profiles` | Typed metadata and lookup for opt-in visual profiles |
| `@microsoft/canvas-toolkit/ui/styles.css` | Shared CSS primitives |
| `@microsoft/canvas-toolkit/ui/profiles/coreai-azure.css` | Opt-in generated CoreAI Azure compatibility profile |
| `@microsoft/canvas-toolkit/ui/subscription-picker` | `createSubscriptionPicker` (browser module) |
| `@microsoft/canvas-toolkit/ui/azure-subscription-picker` | `createAzureSubscriptionPicker` (Azure-backed selector) |
| `@microsoft/canvas-toolkit/ui/subscription-picker.css` | Subscription picker styles |
| `@microsoft/canvas-toolkit/commands` | `createCommandLog`; server-side, DOM-free, redaction-safe command-activity record log |
| `@microsoft/canvas-toolkit/ui/commands-log` | `createCommandsLog` (browser module); the read-only command-activity panel |
| `@microsoft/canvas-toolkit/ui/commands-log.css` | Command-activity panel styles |

## Canvas skeleton

Every canvas is an untrusted iframe plus a trusted Node extension that cannot
share memory, so the extension serves a tiny same-origin HTTP API the iframe
calls. These four primitives are that skeleton — the runtime floor every canvas
needs — so a canvas gets the secure transport and validation layer without
hand-rolling ~110 lines of server/CSRF/SSE plumbing per extension. The server
and actions stand alone; the state store and session bridge are optional.

- **`server` — `startCanvasServer(options)`.** The loopback server. Binds to
  `127.0.0.1` on an ephemeral port (never the network), mints a per-launch
  secret path prefix (unguessable URL, constant-time compared), enforces strict
  Host/Origin + same-origin-POST checks, sets a locked-down CSP (`script-src
  'self'`) and safety headers, parses bounded JSON, and exposes
  `POST {prefix}api/action` → your `dispatch(name, input)`, `GET
  {prefix}api/state` → your `model()`, and `GET {prefix}events` → an SSE change
  stream driven by your `subscribe(notify)`. Static files come from an
  exact-match `assets` allowlist; dynamic endpoints a static asset can't serve
  (e.g. an OAuth redirect, or extra POST routes) use `routes`. Returns
  `{ url, origin, port, close }`. Because the CSP is `script-src 'self'`, the
  iframe's client JS must be a same-origin asset (`<script src="app.js">`), not
  inline. It is deliberately unopinionated about state — pass any
  `dispatch`/`model`/`subscribe`.

- **`actions` — `defineActions(...)` + `validate` + schema builders.** The
  single shared gate every canvas puts in front of its handlers so "validate
  the input" is done once, correctly, instead of re-implemented per canvas.
  Objects are strict by default (`additionalProperties: false`) to blunt
  mass-assignment, and the builders emit plain JSON-Schema so the same schema
  can be published to the host's action registry. Validation is not
  authorization — keep scope binding and confirmation in the handler. A failed
  input raises a serializable `InputError` (`code: "invalid_input"`).

- **`state` — `createViewStore(...)` (optional).** A tiny versioned, observable
  view-model store so a canvas doesn't hand-roll one. Every committed change
  bumps `version` (so the UI can drop stale optimistic updates and human/agent
  races), and subscribers are notified fire-and-forget after a change so the
  server can push an SSE `change`. Not a database, router, or reducer — bring
  your own persistence and handlers. The server and actions work without it.

- **`session` — `createSessionBridge(session, ...)`.** The safe UI→agent
  direction. The untrusted iframe must never hand raw prompt text to the agent
  (prompt injection); instead the canvas registers named prompt *builders*
  server-side, the browser names one and passes validated params, and the
  prompt string is constructed out of the view's reach. The trigger comes from
  the click; the words come from the extension.

## Azure access

Create an owned session from `@microsoft/canvas-toolkit/auth`, load its JSON-safe metadata,
and bind an explicit subscription/tenant/cloud context. The default source is
the installed Azure CLI; a partner can instead inject a `TokenCredential` with
caller-supplied identity metadata. The implementation uses released
`@azure/identity` 4.13.3 and `@azure/core-process` 1.0.0 on Node 22 or newer, not a
custom MSAL/token store or automatic credential chain.

```js
import { createAzureAuthSession } from "@microsoft/canvas-toolkit/auth";

const auth = createAzureAuthSession();
await auth.reloadProfile();
const context = auth.bindSubscription({
    subscriptionId,
    tenantId,
    cloud: "AzureCloud",
});
// Standard SDK clients receive context.credential.
// Custom HTTP clients retain an SDK-cached callback, not a fixed token:
const getToken = context.getBearerTokenProvider(
    "https://storage.azure.com/.default",
);
// Use context only for this generation; dispose auth when its owner ends.
```

Authentication is separate from resource scope: a tenant-only identity with zero
subscriptions can be connected. `bindTenant({ tenantId, cloud, accountName? })`
supports that case without inventing a subscription. Public Azure, Azure
Government, Azure China, macOS, Windows, and Linux are support targets, not proof
of completed live qualification.

`reloadProfile()` reads local metadata; `refreshFromAzure()` is a separate,
explicit CLI server refresh that may rewrite the shared profile and retain
stale accounts with warnings. External CLI changes need manual refresh in v1;
there are no watchers. `connect()` is explicit login, never an automatic
fallback. No default subscription/cloud/configuration changes are performed.

Keep clients tied to the session generation. Subscribe to explicit lifecycle
changes, cancel your requests and retire SDK clients on invalidation, then
rebind from the new snapshot. Local `disconnect()` is not CLI logout or token
revocation. `dispose()` ends the session's lifetime; dispose caller-owned
credentials/clients separately when their SDK requires it.

`@microsoft/canvas-toolkit/azure` is optional: `createArmClient(context)` uses the bound
cloud endpoint/audience and checks context validity for each request;
`listArm(context, path, options)` exposes incomplete paging rather than silently
claiming completion. Partners may use their own SDK/HTTP clients instead.
Both optional ARM APIs accept a per-client/listing `httpClient` implementing the
standard Azure SDK transport contract. No global HTTP override is exported.

Read [the auth guide](auth.md) for exact session and injected source shapes,
callback cancellation, safe errors, lifetime requirements, and
the [migration from global APIs](auth.md#migrating-earlier-examples).
The [read-only examples](examples/README.md) demonstrate SDK and custom HTTP
clients with explicit scope and no automatic sign-in.

## Subscription metadata and scope

`createAzureAuthSession()` owns metadata, identity, lifecycle, and scope
validation. Return its JSON-safe snapshot through the canvas's existing
authenticated transport; keep selection, persistence and resource-query state
outside the session.

```js
import { createAzureAuthSession } from "@microsoft/canvas-toolkit/auth";

const auth = createAzureAuthSession();
// Behind your existing authenticated, same-origin HTTP route:
const snapshot = await auth.reloadProfile();
// Return this JSON-safe snapshot, or a non-2xx response containing only the
// safe AuthError fields. Never serialize raw CLI failures.
// Dispose auth when the route's server owner ends, not after each request.
```

Account metadata contains only `{ id, name, tenantId, tenantName, cloud,
isDefault, state, accountName }`, never credentials or tokens. Subscription and
tenant IDs are normalized to lowercase. Supported cloud names are
`AzureCloud`, `AzureUSGovernment`, and `AzureChinaCloud`. Unknown clouds are
rejected. The handle's `cloud` is the name string; its `environment` holds
immutable `{ name, resourceManager, armResource, authority }` metadata.
Discovery alone does not prove token acquisition or live cloud access.

`auth.resolveScope({ tenantId, subscriptionIds, cloud })` validates the loaded
snapshot without implicit CLI/network discovery. It rejects cross-tenant/cloud,
missing, disabled, or ambiguous subscription selections and returns
`{ tenantId, cloud, subscriptionIds, tenantName, subscriptions: [{ id, name }] }`.
Reload explicitly when external CLI metadata changes.

`@microsoft/canvas-toolkit/subscriptions` exports only `normalizeSubscriptionScope` and
`SubscriptionError`. The pure helper checks `{ tenantId, subscriptionIds, cloud }`
without contacting Azure: GUID tenant/subscription IDs, 1-1000 unique
subscription IDs (case-insensitive), and an exact supported cloud name. It returns
those fields with lowercase IDs; structural validation does not establish access.
The previous `createSubscriptionProvider` discovery factory is removed; use the
session instead. Session failures expose safe `AuthError` fields, not raw
SDK/CLI output or empty success results.

## Shared UI

`canvasUiAssets` maps the shared stylesheet, icon module, and subscription picker
assets to `[file URL, content type]` pairs for the consumer's server. Mount those exact
assets under its existing same-origin route, load the stylesheet, and apply
`class="canvas-ui"` to opt into typography and controls.

The CSS includes `.canvas-header`, button styles, and `.canvas-list` row
primitives. `hydrateIcons()` replaces marked elements such as
`<span data-canvas-icon="refresh"></span>` with decorative SVGs.
Consumers still implement accessible labels, keyboard interaction, and state.

### Packaging shared UI

Use the Node-only build helper before bundling your provider and browser entry:

```js
import { prepareCanvasUiAssets } from "@microsoft/canvas-toolkit/build";

const ui = await prepareCanvasUiAssets("dist");
// ui.nodeImport:
// { specifier: "@microsoft/canvas-toolkit/ui", path: "./assets/toolkit/ui.mjs" }
// ui.browserImports includes:
// { "@microsoft/canvas-toolkit/ui/azure-subscription-picker":
//     "./canvas-ui/azure-subscription-picker.mjs", ... }
// ui.files: sorted emitted paths relative to dist, with slash separators.
```

The helper copies **every `canvasUiAssets` file plus its owning `ui.mjs`** into
`dist/assets/toolkit/`, byte-for-byte and preserving the module-relative layout:
`ui/styles.css`, `ui/subscription-picker.mjs`, `icons/Subscription.svg`, and
the other allowlisted assets. It uses Node builtins, not a bundler, scaffolder,
Azure client, or runtime dependency. Import it from your build script only.
The emitted UI files do not need the toolkit package, `node_modules`, or package
metadata at runtime.

There are **two different path spaces**:

- **Node filesystem:** rewrite `ui.nodeImport.specifier` to `ui.nodeImport.path`
  and mark it external. Emit the provider at the **`outDir` root** so its
  import resolves to `assets/toolkit/ui.mjs`. Do not bundle that owning module.
- **Browser URLs:** rewrite each `ui.browserImports` key to its value and mark
  it external. These are server allowlist URLs, **not filesystem paths**.
  Serve the ESM browser entry at the **canvas URL root** (for example,
  `{secret-prefix}/app.js`), and spread the full `canvasUiAssets` map into
  `startCanvasServer` as shown below. Never serve them outside the secret prefix.

For example, with esbuild as an application-owned **dev dependency**:

```js
import { build } from "esbuild";
import { prepareCanvasUiAssets } from "@microsoft/canvas-toolkit/build";

const outDir = "dist";
const ui = await prepareCanvasUiAssets(outDir);
const boundaries = imports => ({
    name: "canvas-ui-boundaries",
    setup(builder) {
        builder.onResolve(
            { filter: /^@microsoft\/canvas-toolkit\/ui(?:\/|$)/ },
            ({ path }) => imports[path]
                ? { path: imports[path], external: true }
                : undefined,
        );
    },
});
await build({
    entryPoints: ["src/extension.mjs"], outfile: `${outDir}/extension.mjs`,
    bundle: true, platform: "node", format: "esm",
    external: ["@github/copilot-sdk"], // Retain the native scaffold's host SDK boundary.
    plugins: [boundaries({ [ui.nodeImport.specifier]: ui.nodeImport.path })],
});
await build({
    entryPoints: ["src/app.js"], outfile: `${outDir}/app.js`,
    bundle: true, platform: "browser", format: "esm",
    plugins: [boundaries(ui.browserImports)],
});
```

Keep the scaffold's other build settings and provider dependency handling.
Public JS UI exports represented in `canvasUiAssets` are externalized; other
exports, such as visual-profile metadata, can bundle normally. **CSS is not
externalized**: either load the copied styles through the allowlist or bundle
CSS normally and serve/link the resulting stylesheet (for example `app.css`).
The helper does not copy your HTML, app code, or the separate `azureIconAssets`
catalog, and does not configure the host SDK or server.

Relative paths are resolved from the build process's working directory.
Use an owned output directory with no concurrent writers. Missing or unsafe
source files, symlink output paths, non-directory parents, and existing files
with different bytes reject the promise. Identical existing files are accepted;
unrelated files are left alone. The helper never cleans the output root. After
upgrading the toolkit, rebuild in a fresh directory or explicitly clean only
your owned outputs. An I/O failure can leave partial output; do not ship a failed
build.

Do not flatten the picker into `app.js`: its
`new URL("../icons/Subscription.svg", import.meta.url)` must resolve from
`{secret-prefix}/canvas-ui/subscription-picker.mjs` to
`{secret-prefix}/icons/Subscription.svg`. Test a relocated emitted directory,
including actual SVG decoding, not only that the browser JavaScript loaded.

### Styling and themes

Serve the full `canvasUiAssets` map with `startCanvasServer`:

```js
import { startCanvasServer } from "@microsoft/canvas-toolkit/server";
import { canvasUiAssets } from "@microsoft/canvas-toolkit/ui";

const server = await startCanvasServer({
    dispatch: actions.dispatch,
    assets: new Map([
        ...canvasUiAssets,
        ["", new URL("./index.html", import.meta.url)],
        ["app.js", new URL("./app.js", import.meta.url)],
    ]),
});
// Close server when its owner ends.
```

In your `index.html`, load scripts and styles from that same token-scoped origin:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Resources</title>
  <link rel="stylesheet" href="./canvas-ui/styles.css">
</head>
<body class="canvas-ui">
  <header class="canvas-header">
    <h1>Resources</h1>
    <button class="secondary-button" type="button" id="refresh">
      <span data-canvas-icon="refresh" aria-hidden="true"></span>
      Refresh
    </button>
  </header>
  <main id="content"></main>
  <script type="module" src="./app.js"></script>
</body>
</html>
```

Your `app.js` can import `hydrateIcons` from `./canvas-ui/icons.mjs` and call
`hydrateIcons(document)`. Keep scripts external: the server's CSP does not allow
inline scripts or event-handler attributes.

The stylesheet maps available host CSS variables to `--canvas-bg`,
`--canvas-fg`, `--canvas-muted`, `--canvas-border`, `--canvas-accent`, and
`--canvas-focus`, with light/dark fallbacks. It does not install a host theme
bridge or expose a theme-switching JavaScript API. Host token injection and
theme changes remain the host's responsibility. Preserve the document's
`rem` base; use the shipped typography and control styles instead of resetting
the root font size. Test keyboard focus, forced colors, reduced motion, and
narrow layouts in your target host. CSS alone does not provide accessible
interaction or authorization.

### Optional visual profiles

Named visual profiles layer over the shared stylesheet without changing its
defaults. For `coreai-azure`, load `./canvas-ui/profiles/coreai-azure.css` after
`./canvas-ui/styles.css` and add `canvas-profile-coreai-azure` alongside
`canvas-ui` on the root element or body. `canvasUiAssets` includes the stylesheet;
`COREAI_AZURE_VISUAL_PROFILE` from
`@microsoft/canvas-toolkit/ui/visual-profiles` exposes its ID, class name, and
asset path.

This toolkit-native compatibility layer does not bundle an upstream UI library
or font binaries. Aptos and Aptos Mono are used only when installed locally,
with host and system font fallbacks. It needs no additional runtime dependency
or network request.

### Azure location labels

`formatAzureLocation(location)` returns an English display name for a recognized
public Azure region ID, matching case-insensitively without trimming. It is a
pure, dependency-free browser module: no Azure calls, authentication, inventory,
or DOM access. Its static lookup uses the **Region** and **Programmatic name**
columns of Microsoft's [public Azure regions list](https://learn.microsoft.com/en-us/azure/reliability/regions-list),
verified on 2026-09-16. This snapshot is not a location availability or validation
API; it does not enumerate sovereign clouds, extended locations, or every future
region. Add entries only after verifying their programmatic name and label.

Unknown, custom, extended, and other unlisted locations return the exact original
string; there is no inferred capitalization, spacing, suffix handling, or
normalization. `null`, `undefined`, empty strings, and non-string values also pass
through unchanged so consumers retain their own missing-value behavior.

```js
import { formatAzureLocation } from "@microsoft/canvas-toolkit/ui/locations";

formatAzureLocation("westeurope"); // "West Europe"
formatAzureLocation("eastus2"); // "East US 2"
formatAzureLocation("westus3"); // "West US 3"
formatAzureLocation("custom-location"); // "custom-location"
```

For direct iframe imports, mount the complete `canvasUiAssets` map behind the
existing same-origin, token-scoped route and import
`{ formatAzureLocation } from "./canvas-ui/locations.mjs"`. The asset is served as
`text/javascript; charset=utf-8`; no build step or separate data file is needed.

Apply the helper only while rendering labels, consistently in rows and detail
fields. Preserve raw locations in resources, queries, filters, sort keys, exports,
and handoff data. The result is text, not sanitized HTML: keep the consumer's
existing escaping or use `textContent`, including for unknown location values.

### Subscription picker

For Azure canvases, use the [Azure subscription selector](#azure-subscription-selector)
below. `createSubscriptionPicker` is the lower-level DOM primitive it builds on;
consumers should not repeat Azure account normalization or refresh logic.

The browser-native component owns its modal dialog, keyboard interaction, draft
selection, and applied summary button. It has no framework dependency and does
not fetch Azure data, authenticate, or persist scope. The consumer supplies
subscriptions and implements `onApply`; successful completion is the commit boundary.

Mount all entries from `canvasUiAssets` behind the canvas's existing same-origin,
token-scoped route. In addition to `styles.css` and `icons.mjs`, this includes:

- `canvas-ui/profiles/coreai-azure.css` (optional named visual profile)
- `canvas-ui/subscription-picker.mjs`
- `canvas-ui/azure-subscription-picker.mjs` (the Azure-backed wrapper)
- `canvas-ui/subscription-picker.css`
- `icons/Subscription.svg` (the existing `src/icons/Subscription.svg` asset)

The module imports `./icons.mjs` and resolves its mark with
`new URL("../icons/Subscription.svg", import.meta.url)`. This points to the real
asset in the package and stays inside the server's token directory. Mounting the
complete asset map provides this icon route; no external image request is needed.
Use `@microsoft/canvas-toolkit/ui/subscription-picker` with a bundler, or the served URL
shown below for a direct browser import. Load both stylesheets; the component uses
shared `--canvas-*` aliases for documented canvas theme tokens, with `canvas-subscription-picker`-prefixed
selectors to avoid consumer CSS collisions.

```html
<link rel="stylesheet" href="./canvas-ui/styles.css">
<link rel="stylesheet" href="./canvas-ui/subscription-picker.css">
<button id="scope" type="button">Choose subscriptions</button>
```

```js
import { createSubscriptionPicker } from "./canvas-ui/subscription-picker.mjs";

const picker = createSubscriptionPicker({
    id: "resource-scope", // unique within this document; no whitespace
    trigger: document.getElementById("scope"),
    selectionMode: "multiple",
    singleGroup: true,
    onApply: async items => {
        await saveScope(items.map(item => item.key)); // consumer-owned operation
    },
});
picker.setState({
    subscriptions: [{
        key: "principal:cloud:subscription", // caller-owned opaque identity
        id: "00000000-0000-0000-0000-000000000001",
        name: "Development",
        tenantId: "00000000-0000-0000-0000-000000000002",
        tenantName: "Contoso",
        cloud: "AzureCloud",
        isDefault: true,
    }],
    selectedKeys: ["principal:cloud:subscription"],
    loading: false,
    error: null,
});
// Only explicit first-entry confirmation shows the default card:
picker.open({ confirmDefault: true });
// Later trigger clicks, or picker.open(), open the subscription list directly.
// On teardown:
// picker.destroy();
```

`createSubscriptionPicker(options)` accepts:

| Option | Behavior |
| --- | --- |
| `document` | Defaults to `globalThis.document`; injectable for tests |
| `id` | Required, unique, nonempty string without whitespace; used verbatim for the dialog ID and to namespace prefixed internal control IDs |
| `trigger` | Optional existing button from the document; otherwise creates an unmounted button for the caller to append |
| `mount` | Optional dialog container; defaults to `document.body` |
| `selectionMode` | `"multiple"` (checkboxes, default) or `"single"` (native radios) |
| `singleGroup` | Defaults to `false`; when true, selected items must share a case-insensitive `tenantId` and exact `cloud` |
| `onApply(items)` | Required callback receiving snapshots of selected item objects; may return a promise |
| `onRefresh()` | Optional async callback enabling a Refresh subscriptions button inside the picker; update candidates with `setState` and reject on failure |
| `onCancel()` | Optional notification on Cancel, close button, Escape, outside dismissal, or `close({ cancelled: true })`; not called on plain `close()`, successful Apply, or destroy |
| `onOpenChange(open)` | Optional notification of actual open/close transitions, including closing during destroy |

Each subscription has required string `key`, `id`, `name`, and `tenantId` fields.
Optional fields are `tenantName`, `cloud`, `isDefault`, `disabled`, and
`disabledReason`. `key` must be unique and nonempty. Keys are never normalized or
derived from subscription IDs: the consumer must distinguish principals and clouds.
Tenant grouping uses `[tenantId.toLowerCase(), cloud ?? ""]`, independent of keys.

The controller exposes `{ trigger, dialog, setState, open, close, destroy, isOpen }`.
`setState({ subscriptions, selectedKeys, loading, error, refreshDisabledReason })` is a partial update;
`selectedKeys` accepts an array or Set of opaque strings, and `subscriptions: []`
explicitly clears the available candidates. `error` accepts an Error, message,
or `null` to clear. While open, updates preserve the draft and search query,
including during account refresh. `selectedKeys` updates the applied selection,
not the open draft. Removed or disabled draft keys remain selected and block
Apply with an explanation; **Clear selection** explicitly removes them.
`refreshDisabledReason` disables refresh with an explanatory tooltip; pass `null`
to enable it again. Use this when a consumer must keep a pending request's
candidate snapshot fixed.

- **Entry:** `open()` is idempotent. `open({ confirmDefault: true })` shows the
  default card only when exactly one enabled default candidate exists and loading
  is false. Continue submits that one item; Choose subscriptions opens the list.
- **Selection:** Apply requires at least one available, enabled subscription.
  Search matches subscription/tenant names and IDs (and cloud). Select all acts on
  enabled search matches; Clear selection clears those matches without losing
  selections hidden by search. In single/group-constrained mode or when selected
  items become unavailable, Clear selection clears the entire draft for recovery.
  In single-group mode, incompatible rows cannot be added and show a visible
  explanation; clear the draft before switching tenant/cloud. Mixed selections are never silently
  cleared, including in single mode.
- **Commit:** Draft changes do not alter the summary until `onApply` succeeds.
  Rejection keeps the dialog open with an inline error. Pending Apply disables
  editing and dismissal, including `close()`, to prevent duplicate requests.
  Candidates are validated again after completion in case refresh removed or
  disabled them. The summary shows one icon pill: a name for one selection, a count
  for multiple, or “Choose subscriptions” for none, plus Change and a chevron.
- **Refresh:** The picker owns pending/error feedback and duplicate prevention.
  Refresh keeps search and draft selection intact and never applies scope.
  Editing and dismissal are disabled until the callback settles; failures appear
  inline and can be retried. The consumer owns account discovery and supplies
  refreshed candidates and any external error state through `setState`.
- **Accessibility:** Native modal focus containment and Escape behavior, explicit
  labels and live counts/errors, arrow-key row navigation, CSS name truncation with
  full accessible text/title, and focus restoration on close. Dismissal requires
  both pointer-down and click outside the dialog, not a drag that started inside.
- **Disposal:** `destroy()` removes listeners and the dialog, removes an owned
  trigger or restores the supplied trigger's original content/modified attributes,
  and ignores late async results. It cannot cancel work already started by the
  consumer's callback. Other controller methods become no-ops after disposal.
  The consumer retains control of an existing trigger's disabled state.

Plain `close()` dismisses without reporting cancellation, so consumers can replace
a manually opened picker with an agent request or dismiss a stale request. Use
`close({ cancelled: true })` only to explicitly report cancellation. Both forms
are ignored while Apply or Refresh is pending. On every close, `isOpen` becomes false and
the summary is updated before focus restoration and `onOpenChange(false)`.
Focus restoration happens **before** that callback, allowing the consumer to
update state or focus its own editor without the picker stealing focus afterward.

### Azure subscription selector

The toolkit owns both sides of subscription selection:

- `createAzureAuthSession()` owns the shared auth snapshot, explicit reload and
  server refresh, and server-side `resolveScope()` validation. Return its
  JSON-safe metadata through the canvas's existing authenticated transport.
  See [subscription metadata and scope](#subscription-metadata-and-scope) above.
- `createAzureSubscriptionPicker()` owns account-to-option normalization, disabled
  and ambiguous accounts, missing selected subscriptions, draft selection,
  single-tenant/cloud/principal validation, sign-in guidance, refresh and errors.
  The consumer mounts it, connects a JSON transport, and receives a selected scope.

Browser-side (serve the full `canvasUiAssets` map and load both shared stylesheets):

```js
import { createAzureSubscriptionPicker } from "./canvas-ui/azure-subscription-picker.mjs";

const picker = createAzureSubscriptionPicker({
    id: "scope-picker",
    trigger: document.getElementById("scope"),
    statusMount: document.getElementById("scope-status"),
    // postJson is your existing HTTP helper, not an Azure-specific callback.
    transport: () => postJson("./api/subscriptions", {}),
    onApply: async scope => {
        await saveScope(scope); // validate with resolveScope on the server
        picker.setState({ scope });
    },
});
picker.setState({ accounts: initialAccounts, scope: currentScope });
```

`transport()` resolves to `{ accounts, error?, revision? }`; the session's
JSON-safe snapshot can be returned directly. The picker applies
refreshed metadata without committing scope or running a resource query; transport
rejections are shown inline. `error` can be a safe message or `{ code, message }`.
The optional `statusMount` receives toolkit-owned sign-in/error feedback; otherwise
the returned `status` element can be mounted by the consumer.

`onApply(scope)` receives `{ tenantId, tenantName, cloud, subscriptionIds,
subscriptions: [{ id, name }], selectedKeys }`, after Azure selection validation.
The callback must finish committing scope before resolving. Push committed scope
back through `setState` so subsequent metadata refreshes retain it. Browser
validation is selection guidance, not authorization: use the session's
`resolveScope` on the server before running operations in that scope. Start any
follow-on UI action that requires a closed dialog from `onOpenChange(false)`,
not from inside Apply.

`setState` accepts `{ accounts, scope, error, loading, selectedKeys,
refreshDisabledReason, revision }` as partial updates. Normally `scope` determines
the applied summary. Supply `selectedKeys` for a fixed server-side confirmation
request (opaque `account.key` values are preserved); pass `selectedKeys: undefined`
to resume deriving selection from scope. A refresh-disabled reason prevents
changing that fixed candidate snapshot. If using revisions, push and return values
from the same monotonic sequence so stale refresh responses cannot replace newer
state. Open drafts and search survive metadata updates; stale selected keys require
explicit clearing.

The controller exposes `trigger`, `dialog`, `status`, `setState`, `open`, `close`,
`destroy` and `isOpen`. It supports the low-level picker's mounting and lifecycle
options, but owns `singleGroup`, `onRefresh`, and Azure validation itself.
It never receives credentials, signs in, or calls Azure directly.

## Commands log

A command log records the real operations a canvas runs on the user's behalf
(az CLI, ARM/REST, data-plane calls) so an engineer can see what the tool did.

- **`commands` — `createCommandLog(options)` (server-side, DOM-free).** Owns the
  record lifecycle only: `start`/`end`/`wrap` an operation, `list`, `clear`. It
  is a bounded newest-first ring buffer (`limit`, default 50) and is
  redaction-safe — pass `redact` to strip secrets (bearer tokens, keys,
  connection strings) from any logged text *before* it is stored, so a token can
  never reach the feed. `onChange` fires after every mutation with a fresh copy,
  which you wire to your SSE broadcast. The caller decides how to surface it
  (SSE snapshot, per-instance state, etc.).

- **`ui/commands-log` — `createCommandsLog(options)` (browser module).** The
  read-only panel that renders those records. It builds every node
  programmatically and inserts command text via `textContent`, so a logged
  command can never inject markup — the DOM does the escaping. The caller owns
  fetching/subscribing to state and calling `render()`. Load
  `ui/styles.css` and `ui/commands-log.css` in the consuming document.

## Azure resource icons

`@microsoft/canvas-toolkit/icons` owns the resource-type mapping and the bundled SVGs in
`src/icons/`. It does not depend on any example extension. These service marks
are separate from the general UI glyphs exported by `@microsoft/canvas-toolkit/ui/icons`.

```js
import { iconForType, azureIconAssets } from "@microsoft/canvas-toolkit/icons";

const key = iconForType("Microsoft.Web/sites", "functionapp,linux");
// key === "FunctionApp"

const staticFiles = new Map(azureIconAssets);
// "icons/FunctionApp.svg" -> [file URL, "image/svg+xml"]
```

Mount `azureIconAssets` alongside the canvas's other static assets, behind its
existing same-origin, token-scoped HTTP route. The file URLs are for the server
to read, not for the iframe to navigate to. Render the key as a relative image:

```html
<img src="./icons/FunctionApp.svg" alt="" aria-hidden="true">
```

`iconForType(type, kind)` is case-insensitive. It distinguishes Function Apps,
Logic Apps, Web Apps, Cosmos DB variants, and Foundry workspaces using `kind`
where ARM `type` is insufficient. Unknown types return `GENERIC_ICON`.
`BY_TYPE` exposes the direct type-to-key mappings; `azureIconAssets` also includes
kind-specific and catalog-only icons. Unknown asset routes are not registered.

SVGs stay in separate images so repeated icons do not introduce duplicate
gradient IDs into the document. The SVG bytes and mapping are packaged under
`src/`; no Azure request or external CDN is needed to obtain an icon.

## License

The toolkit is licensed under the [MIT License](LICENSE), following the Azure
extensions for VS Code. This includes the code, documentation, and bundled SVGs.
Include the copyright and permission notice when redistributing copies or
substantial portions of the software. Dependencies retain their own licenses.
This license applies to the toolkit package, not the entire source repository.

### Azure icon attribution

The service SVGs are from
[`microsoft/vscode-azureresourcegroups/resources/azureIcons`](https://github.com/microsoft/vscode-azureresourcegroups/tree/57d3edabac6881b1f3653e729b1611835bec8f7e/resources/azureIcons).
`Generic.svg` is the same repository's
[`resources/resource.svg`](https://github.com/microsoft/vscode-azureresourcegroups/blob/57d3edabac6881b1f3653e729b1611835bec8f7e/resources/resource.svg).
The type/kind disambiguation is adapted from
[`@microsoft/vscode-azureresources-api`'s `getAzExtResourceType`](https://github.com/microsoft/vscode-azureresourcegroups/blob/57d3edabac6881b1f3653e729b1611835bec8f7e/api/src/getAzExtResourceType.ts).

These upstream files are [MIT-licensed](https://github.com/microsoft/vscode-azureresourcegroups/blob/57d3edabac6881b1f3653e729b1611835bec8f7e/LICENSE.md).
Copyright (c) Microsoft Corporation. All rights reserved.
The copyright and MIT permission notice are retained in [LICENSE](LICENSE).

### Trademarks

Microsoft and Azure names, logos, and icons may be trademarks of Microsoft.
MIT licensing does not grant trademark rights. Use of Microsoft marks must
follow the [Microsoft Trademark and Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks)
and must not imply Microsoft sponsorship or endorsement.

## Testing your integration

Use an [injected credential](auth.md#explicit-credential-injection) and a
per-client fake HTTP transport for automated tests. The [examples](examples/README.md)
export functions that accept these dependencies without invoking the CLI.
For CLI-source tests, `@microsoft/canvas-toolkit/testing` exposes
`createTestAzureAuthSession` with an isolated source factory. Do not use that
test seam as production authentication configuration.

Do not use a developer's real identity or launch interactive sign-in from
ordinary tests. Live examples require explicit opt-in and a dedicated scope.
Use mocked tests for deterministic API behavior and live checks for the
authentication, permissions, and connectivity required by your application.
