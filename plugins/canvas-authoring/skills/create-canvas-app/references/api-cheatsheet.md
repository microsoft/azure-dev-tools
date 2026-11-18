# Toolkit API cheat sheet

Read this page and `SKILL.md` before you write code; you need no other
reference for a typical resource canvas. It lists the rules, the starter
pattern, and the signatures that canvases use most. The public types in
`node_modules/@microsoft/canvas-toolkit/src/*.d.ts` are the full contract.
Read a `.d.ts` file only when a signature is not here.

## Rules

- Design for ~480px (one-third panel) first; it must also look good at half and full width. The toolkit
  components adapt to their panel width with container queries; do not add
  viewport `@media` layout rules.
- Use toolkit components for the frame, list, details, filters, empty states,
  messages, dialogs, and buttons. No raw `<h1>`, `<ul>`, `<input>`,
  `<dialog>`, `<button>`, or status `<p>`.
- Show the resource-type icon in the `CanvasHeader` `icon` and each
  `ListDetail` item `icon` (see Azure icons).
- The panel loads the Azure CLI profile on open. No "Reload profile" or "Load
  profile" button: the picker uses `refreshOnFocus: true`, the footer shows
  `Azure CLI: <account>`, and a failed load shows "Sign in to Azure".
- Never auto-select a subscription. Read resources only after the user acts.
- Use `armId()` for ARM ID inputs; compare IDs case-insensitively.
- Parse ARM times with `armDate()` (no zone suffix means UTC).
- Use `runArmOperation()` for start, stop, restart, and other long-running
  operations. Take API versions from
  [Azure resource operations](azure-operations.md).
- Mark write actions `effect: "write"` and confirm destructive ones in a
  `Dialog` with a typed name.
- Never turn a failure into an empty success. Throw `AuthError` or
  `InputError`; the UI shows `error.message`.
- The generated canvas has no test or smoke suite. Do not add one.

## Starter pattern (`azure-resource-groups`)

| File | Change |
|---|---|
| `src/resource-groups.mjs` | Rename for your resource. Export `readX(context, { signal, httpClient })` that uses `listArm` and returns small projected rows (`{ id, name, location, ... }`), never raw ARM payloads. |
| `src/domain.mjs` | Add an entry to `contracts` (`input`, `description`) and a matching function in `handlers`. Handlers patch `store` and return `store.snapshot()`. Keep `get_state`, `reload_profile`, `select_subscription`, and `cancel`. |
| `src/browser/app.mjs` | Call an action with `await act("name", input)`; it re-renders with the returned state. Map rows to `ListDetail` items and render details in its children function. |
| `src/canvas.mjs` | Change the `description` and the header icon type. Agent actions come from `contracts` automatically. |

## Actions and validation (`@microsoft/canvas-toolkit/actions`)

| Signature | Example |
|---|---|
| `str({ min = 0, max = 2048, pattern?, format?, flags?, ignoreCase? })` | `name: str({ min: 1, max: 260 })`; `str({ pattern: "^ab$", ignoreCase: true })` |
| `int({ min?, max? })`, `num({ min?, max? })`, `bool()` | `top: int({ min: 1, max: 200 })` |
| `enum_(...values)` | `action: enum_("start", "stop", "restart")` |
| `guid()` | `subscriptionId: guid()` |
| `armId({ provider?, type? })` | `appId: armId({ provider: "Microsoft.App", type: "containerApps" })` |
| `arr(items, { min?, max?, unique? })` | `ids: arr(guid(), { max: 20, unique: true })` |
| `obj(props, { required = [], open = false })` | `obj({ name: str() }, { required: ["name"] })` (unknown keys fail) |
| `oneOf(...schemas)`, `constant(value)`, `empty()` | `input: empty()` for an action with no input |
| `validate(schema, value, at?)` | Throws `InputError` (`code: "invalid_input"`, `path`). |
| `defineActions({ name: { input, run, effect, description } })` | `actions.dispatch("start_app", input, ctx)` validates, then runs. |

`effect` is `"read"` or `"write"`. It describes the action. It does not
approve a cloud change.

ARM ID casing changes between list and GET calls. Use `armId()` for ID inputs,
compare IDs case-insensitively, and keep the listed row's ID. See
[Resource ID casing](azure-operations.md#resource-id-casing).

## Auth (`@microsoft/canvas-toolkit/auth`)

| Signature | Notes |
|---|---|
| `createAzureAuthSession({ source })` | Returns `getState()`, `reloadProfile()`, `refreshFromAzure()`, `connect(...)`, `disconnect()`, `subscribe(fn)`, `bindSubscription(...)`, `bindTenant(...)`, `dispose()`. |
| `session.bindSubscription({ subscriptionId, tenantId, cloud })` | Returns an `AzureAuthContext`. Call it after the user selects a scope. |
| `AzureAuthContext` | `tenantId`, `subscriptionId`, `cloud` (`"AzureCloud"`, `"AzureUSGovernment"`, `"AzureChinaCloud"`), `environment.resourceManager`, `accountName`, `credential`, `assertActive()`, `invalidateTokens()`. |
| `AzureAuthState` | `status`, `revision`, `identity`, `cloud`, `accounts[]`, `tenants[]`, `error`, `warnings`, `freshness`. |
| `AuthError` | `code`, `message`, `remedy`, `status?` (HTTP status), `operationStatus?`, `toJSON()` (safe for the UI). |

## ARM calls (`@microsoft/canvas-toolkit/azure`)

| Signature | Example |
|---|---|
| `listArm(context, path, { signal?, maxPages = 50, httpClient? })` | `for await (const app of listArm(ctx, path, { signal })) rows.push(project(app));` |
| `listArm(...).byPage()` | Yields `{ value, nextLink }` pages. |
| `runArmOperation(context, path, { method = "POST", body?, signal?, timeoutMs = 600000 })` | `await runArmOperation(ctx, \`${appPath}/stop?api-version=2026-07-01\`, { signal });` |
| `createArmClient(context, { httpClient? })` | `client.sendRequest(createPipelineRequest({ url, method: "GET", abortSignal }))` for a single read. |

Error codes on `AuthError` from these helpers:

| Code | Meaning |
|---|---|
| `signed-out` (401), `forbidden` (403), `http-error` | HTTP failure. Read `error.status`, for example `error.status === 409`. Do not parse the message. |
| `operation-failed` | The long-running operation ended `Failed` or `Canceled`. Read `error.operationStatus`. |
| `operation-timeout`, `cancelled` | The poll exceeded `timeoutMs`, or the signal aborted. |
| `invalid-response`, `invalid-url`, `paging-cycle`, `paging-limit`, `request-failed` | Bad data, an unsafe URL, or a network failure. |

See [Azure resource operations](azure-operations.md) for API versions.

ARM times with no zone suffix, such as `lastModifiedTimeUtc`, are UTC. Parse them
with `armDate()` from [Timestamps](azure-operations.md#timestamps), not with
`new Date(value)` directly.

## Server (`@microsoft/canvas-toolkit/server`)

| Signature | Notes |
|---|---|
| `startCanvasServer(options)` | Loopback server with a secret path, CSP, and JSON body limits. The starter shows the full options. |
| `canvasUiAssets` | Pass this asset map to the server so that toolkit CSS and icons load. |

## Azure icons (`@microsoft/canvas-toolkit/icons`)

| Signature | Example |
|---|---|
| `iconForType(type, kind?) -> key` | Case-insensitive; returns `GENERIC_ICON` (`"Generic"`) when unmapped. `iconForType("Microsoft.App/containerApps")` is `"ContainerApps"`. |
| `azureIconAssets` | Map of `icons/<Key>.svg` routes. Spread it into the server `assets`: `[...azureIconAssets, ...canvasUiAssets]`. |
| `prepareAzureIconAssets(outDir)` | From `@microsoft/canvas-toolkit/build`. Copies the SVGs to `outDir/icons/` for a bundled provider. The generated build already calls it. |

Render: `h("img", { src: `icons/${iconForType(type, kind)}.svg`, alt: "", width: 16, height: 16 })`
as the `CanvasHeader` `icon` and each `ListDetail` item `icon`. `iconForType`
is safe to import in the browser bundle.

## UI (`@microsoft/canvas-toolkit/ui/dom`)

`ui/dom` exports the React components plus `createElement as h`, `useState`,
`useEffect`, `useRef`, and `mountCanvasComponent(container, Component, props)`.
The mount returns `{ update(props), dispose() }`. Load `ui/styles.css`, then
`ui/base.css`.

| Component | Main props | Example |
|---|---|---|
| `CanvasShell` | `header`, `footer`, `navigation?`, `detailPanel?`, children | `h(CanvasShell, { header, footer }, content)` |
| `CanvasHeader` | `title`, `context?`, `actions?`, `primaryAction?` | `h(CanvasHeader, { title: "Container Apps", actions })` |
| `CanvasFooter` | `links?`, `language?`, `version?`, children | `h(CanvasFooter, { version: "Build 1a2b" }, statusSpan)` |
| `ListDetail` | `title`, `items: [{ value, title, description?, meta?, icon? }]`, `selectedValue?`, `onSelect(e, { value })`, `filters?`, `emptyMessage?`, children `(value) => node` | `h(ListDetail, { title: "Apps", items }, value => h(Details, { value }))` |
| `DetailPanel` | `title`, `status?`, `statusTone?` (`neutral`, `success`, `warning`, `danger`), `actions?`, `footer?`, `onClose?` | `h(DetailPanel, { title: app.name, status: "Running", actions })` |
| `KeyValueList` | `items: [{ label, value }]` | `h(KeyValueList, { items: [{ label: "Location", value: "West US" }] })` |
| `FilterToolbar` | `search?`, `facets: [{ id, label, options: [{ value, label }] }]`, `values`, `onFiltersChange(e, { values })`, `resultCount?` | `h(FilterToolbar, { facets, values, onFiltersChange: (_e, d) => set(d.values) })` |
| `Table` family | `Table`, `TableHeader`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell` (native table attributes) | `h(Table, null, h(TableHeader, null, row), h(TableBody, null, rows))` |
| `Dialog` | `open`, `onOpenChange(e, { open })`, `title`, `subtitle?`, `actions`, `size?` | `h(Dialog, { open, title: "Stop app?", actions, onOpenChange })` |
| `FormField` | `label`, `hint?`, `error?`, `required?`, child control | `h(FormField, { label: "Type the app name" }, input)` |
| `TextInput` | native input props, `onChange(e, { value })` | `h(TextInput, { value, onChange: (_e, d) => setValue(d.value) })` |
| `Select` | native select props, `onChange(e, { value })` | `h(Select, { value, onChange }, options)` |
| `Button` | `appearance`: `primary`, `secondary`, `subtle`, `transparent`, `danger`; `icon?`; `size?` | `h(Button, { appearance: "danger", disabled: typed !== name }, "Stop")` |
| `MessageBar` | `intent`: `info`, `success`, `warning`, `error`; `title?`; `actions?` | `h(MessageBar, { intent: "error" }, error.message)` |
| `Blankslate` | `title`, `action?`, children | `h(Blankslate, { title: "No apps", action: button }, "Text")` |
| `Spinner`, `Badge` | `label`, `size`; `appearance` (`filled`, `tint`, `outline`, default `tint`), `color` (default `informative`; also `success`, `warning`, `danger`) | `h(Spinner, { label: "Stopping..." })` |

Layout notes from the starter:

- Put header buttons in `CanvasHeader.actions`. Use `secondary` for actions
  next to the subscription picker, and `primary` for one main action.
- Give each footer status item its own element and a separator style, as in
  the starter's `app.css`.
- Keep the list pane 260–360 px wide and remove its outer start padding, so
  that two filter facets fit on one line.

## Other UI modules

| Import | Signature |
|---|---|
| `ui/azure-subscription-picker` | `createAzureSubscriptionPicker({ transport, onApply, statusMount?, selectionMode?, id?, refreshOnFocus? })` returns `{ trigger, dialog, status, setState(state), open(), close(), destroy() }`. `transport` resolves `{ accounts, error, revision }`. Mount `trigger` with `DomContent`. |
| `refreshOnFocus` | `true` or `{ debounceMs }` (default 500). Re-reads the transport on window focus or when the tab becomes visible. Skips while busy, disabled or open. Use it instead of a "Reload profile" button. |
| Signed-out state | `h(Blankslate, { title: "Sign in to Azure", action: checkAgain }, h(CodeBlock, { title: "Terminal", actions: copy }, "az login"), hint)`. Add an install hint (`aka.ms/installazurecli`). |
| `ui/locations` | `formatAzureLocation("westus")` returns `"West US"`. |
