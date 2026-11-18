# Toolkit integration reference

This page covers the companion's host adapter and build settings. For general
APIs, use the bundled [toolkit reference](toolkit/README.md); those guides are
assembled when the plugin is exported.

## Connect the native scaffold

The [setup command](../scripts/setup-toolkit.mjs) copies the host entry without
editing the original. In the copied `src/extension.mjs`, add:

```js
import { attachToolkit } from "./toolkit.mjs";
```

Wrap the existing declaration as `createCanvas(attachToolkit(nativeOptions))`.
Keep its metadata, full host context and surrounding session wiring. The
adapter replaces the scaffold's demo actions/open callback and runs the native
close callback after toolkit cleanup. Do not attach it over custom business
callbacks or competing shutdown handlers without adapting their ownership.

`npm run build` includes the registration check; `npm run check` repeats it
without building. It executes the emitted entry with a test SDK adapter and
checks action/open/close behavior. Missing hookup, unused imports and conflicting
shutdown handlers fail. The adapter used by the test stays outside `dist/`.
Native activation is a separate check owned by the installed host skill.

## Choose the toolkit dependency

Use one exact npm version with `/build`, or a local tarball. Setup is offline;
registry mode resolves the chosen version during `npm install`. Local mode
copies the archive to `vendor/canvas-toolkit.tgz` and uses
`file:vendor/canvas-toolkit.tgz`. Keep the lockfile, avoid absolute dependencies,
and do not commit private tarballs.

Bundled guide versions and checksums do not establish npm availability.
An unavailable version must fail installation, not trigger a source fallback.

## Reuse the public APIs

For signatures and one-line examples, read the
[toolkit API cheat sheet](api-cheatsheet.md) first.

| API | Guidance |
| --- | --- |
| `@microsoft/canvas-toolkit/actions` | [Validate inputs once](toolkit/README.md#canvas-skeleton); UI requests and host actions call the same dispatch. |
| `@microsoft/canvas-toolkit/state` | The optional store is in-memory, not durable persistence. Choose ownership through the host lifecycle. |
| `@microsoft/canvas-toolkit/server` | [Serve the app](toolkit/README.md#canvas-skeleton) through the shared loopback transport, with an explicit asset allowlist. |
| `@microsoft/canvas-toolkit/ui/styles.css` | [Use shared styles](toolkit/README.md#styling-and-themes) and link the emitted CSS from HTML. |
| `@microsoft/canvas-toolkit/ui/dom` | Mount toolkit controls in plain-JavaScript views with `mountCanvasComponent`; load `ui/styles.css`, then `ui/base.css`. Use `ui/react` in React apps. Use the component for each need in the table below; see the [component guide](toolkit/ui-components.md). |
| `@microsoft/canvas-toolkit/ui/azure-subscription-picker` | `createAzureSubscriptionPicker` for subscription selection. Its trigger must be a button. Pass `refreshOnFocus: true`; do not add a "Reload profile" button. |
| `@microsoft/canvas-toolkit/ui/theme` | `readCanvasTheme` and `observeCanvasTheme` for renderers that cannot use CSS tokens. Otherwise rely on `--canvas-*` tokens. |
| `@microsoft/canvas-toolkit/telemetry` | Product-usage helpers. The starters omit them: the public collector is release-owned and always on. Add usage metadata and instrumentation only for a registered product canvas. |
| Azure auth/subscriptions | [Bind explicit scope](toolkit/auth.md) and keep credentials in Node. These helpers are optional for non-Azure apps. |

### Components for common needs

| Need | Component |
| --- | --- |
| Page frame, header, footer | `CanvasShell`, `CanvasHeader`, `CanvasFooter` |
| Resource list and details | `ListDetail`, `DetailPanel`, `KeyValueList`, `Badge` |
| Filter, empty state, status | `FilterToolbar`, `Blankslate`, `MessageBar`, `Spinner` |
| Actions and typed-name confirm | `Button`, `Dialog`, `FormField`, `TextInput` |
| Azure resource-type icon | `iconForType`, `azureIconAssets` (`@microsoft/canvas-toolkit/icons`) |

Do not hand-build these parts with raw `<h1>`, `<ul>`, `<input>`, or status
`<p>` elements. For Azure lifecycle calls, see
[Azure resource operations](azure-operations.md).

`effect: "write"` describes an action; it does not authorize a cloud mutation.
Keep errors visible and discard results from cancelled or invalidated contexts.

## Preserve the build layout

The generated build uses
[`prepareCanvasUiAssets`](toolkit/README.md#packaging-shared-ui) to copy shared
UI files and supply bundler paths. Keep these settings when customizing:

| Output | Required boundary |
| --- | --- |
| Node provider | Emit at the `dist/` root. Keep `@github/copilot-sdk/extension` external, along with Node built-ins and explicitly emitted local modules. Bundle other used npm code. |
| Browser entry | Serve at the canvas URL root. No Node or host SDK imports; link compiled CSS separately. |
| Shared UI | Preserve the helper's `nodeImport` filesystem path and `browserImports` URL paths. Mount the full `canvasUiAssets` map through the server. |
| Azure icons | The build calls `prepareAzureIconAssets` to copy `dist/icons/*.svg`. Mount `...azureIconAssets` through the server. |
| App assets | Copy HTML and custom assets into `dist/` and add their server routes. The helper only copies toolkit UI assets. |

Do not externalize all dependencies or flatten asset-owning modules: esbuild
does not copy `new URL(..., import.meta.url)` assets automatically. Preserve
same-origin URLs under the canvas prefix and the existing CSP. Native modules,
dynamic imports and runtime file lookups may need additional build handling.

Check a relocated `dist/` without source dependencies. Asset checks should
include successful image decoding and HTTP errors, not just working buttons.
Reload the provider after rebuilding; a panel refresh alone does not replace it.
