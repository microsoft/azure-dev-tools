# __CANVAS_NAME__

A read-only Azure resource-group canvas. Each panel has its own subscription,
results and pending request.

## Build and install

Setup connects `src/extension.mjs` with `attachToolkit` when it recognizes the
native `createCanvas(...)` call. If setup printed `NOT CONNECTED`, add
`import { attachToolkit } from "./toolkit.mjs";` and wrap the options as
`createCanvas(attachToolkit(nativeOptions))`.

```sh
npm install
npm run build
```

`npm run build` bundles `dist/`, checks the host registration with a test SDK
adapter, and copies `dist/` into the native extension directory from setup
(`canvasInstallDir` in `package.json`). Then reload the extension provider and
open the canvas. A panel refresh does not restart the provider; the UI warns
when its files and provider have different build IDs.
`npm run check` repeats only the registration check on the current `dist/`.

## Use

With Azure CLI 2.61+ and an existing login, the panel loads the local profile
when it opens. Select a subscription, then **List resource groups**. If the
profile does not load, the panel shows **Sign in to Azure** with `az login`.
Agent actions: `reload_profile`, `select_subscription`,
`list_resource_groups`, `cancel`, `get_state`. The app never writes Azure
resources. Listings are limited to 200 rows / 10 pages.

## Customize

| File | Purpose |
| --- | --- |
| `src/browser/app.mjs` | UI: `CanvasShell`, `CanvasHeader`, `CanvasFooter`, `ListDetail`, `FilterToolbar`, `DetailPanel`, `Blankslate`, `MessageBar`, the subscription picker and resource icons. |
| `src/resource-groups.mjs` | Azure reader. Replace it with your resource reader. |
| `src/domain.mjs` | Shared UI/agent actions, scope, cancellation and stale-result checks. |
| `src/canvas.mjs` | Per-panel server, transport and assets. |
| `src/toolkit.mjs`, `scripts/` | Adapter, build and registration check. Do not edit. |

Use toolkit components for new controls. Do not hand-build headings, lists,
inputs, buttons or alerts.
