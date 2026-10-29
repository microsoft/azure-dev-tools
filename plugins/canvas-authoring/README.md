# Canvas authoring plugin

Create a canvas app with the Microsoft Canvas Toolkit.

## What you can do

- Turn an app idea into a canvas project with guided setup.
- Build interfaces with reusable components that match Copilot's theme.
- Share actions and state between the canvas and your agent.
- Connect to Azure with authentication, subscription selection and read-only resource access.

## Install

If your GitHub Copilot host shows the **awesome-copilot** marketplace, open
**Customize → Plugins** and install **canvas-authoring**. Its
[listed 0.1.1 package](https://github.com/microsoft/azure-dev-tools/tree/a6d394bbaa6fb1dc0151257a85cbac0de772b138/plugins/canvas-authoring)
is a skill-only companion, not a canvas extension. If the marketplace is
missing, add it first:

```sh
copilot plugin marketplace add github/awesome-copilot
copilot plugin install canvas-authoring@awesome-copilot
```

For an approved local export, run:

```sh
copilot --plugin-dir "<export-directory>/plugins/canvas-authoring"
```

Install the exported plugin, not this source folder.

You need a canvas-capable Copilot host with the native `create-canvas` skill,
Node.js 22+, and an available toolkit package; the Azure starter also needs
Azure CLI and subscription read access. See [requirements](#requirements).

## Try it

Ask your agent to **Build a read-only Azure canvas that lists resource
groups. Use the native create-canvas skill and the create-canvas-app
companion's Azure starter.** Choose a compatible toolkit package and project
location when prompted. For a non-Azure example, ask for the counter starter.

## Prompts to try

> Use the native create-canvas skill and the create-canvas-app companion to build a counter canvas.

> Build a read-only Azure canvas that lists resource groups. Use the native create-canvas skill and the create-canvas-app companion's Azure starter.

## Requirements

- A canvas-capable GitHub Copilot host with its installed `create-canvas` skill.
  The plugin does not replace or install that host skill.
- Node.js 22+ (24 recommended) and npm.
- The exact `@microsoft/canvas-toolkit@0.1.0-preview.2` release exporting
  `@microsoft/canvas-toolkit/build`, once published, or an approved local
  `.tgz` containing that API. Do not treat a missing `/build` export as success.
- For live Azure reads: Azure CLI 2.61+ and permission to read the subscription.

## Usage data

The plugin includes a background extension only for skill-usage telemetry.
It does not add a canvas, tools or hooks.

Usage telemetry is enabled by default to help improve this plugin. It sends
basic skill-usage data and, when available, your numeric GitHub user ID to the
[usage metrics service](https://canvas-metrics-pilot-0b8944-add3hsghhddcbxe9.b01.azurefd.net/api/events).
Prompts, tool inputs/outputs and credentials are excluded.

You can [disable usage telemetry](https://github.com/microsoft/azure-dev-tools#disable-usage-telemetry).
Copilot's own telemetry is separate.

## Create an app

The agent creates the native scaffold, generates the source app, and connects
the copied host entry. You choose the project location and toolkit package.

Setup accepts one exact npm version or one local tarball. It does not install
dependencies or contact Azure, and it refuses existing output directories
rather than overwriting files. For command-line setup, see the
[skill instructions](skills/create-canvas-app/SKILL.md).

## Build and run

In the generated app:

```sh
npm install
npm run build
npm test
npm run smoke
```

`smoke` is available in the Azure starter. It uses installed Chrome, or the
executable specified by `CANVAS_BROWSER`, with labelled synthetic data.
Keep `package-lock.json` and use `npm ci` for later installs.

Follow the generated README and host skill to install the complete `dist/`
directory and reload the provider. A browser refresh does not load rebuilt
provider code; a build-ID warning indicates a mismatch.

The Azure app does nothing until you act: load the CLI profile, select a
subscription, then choose **List resource groups**. It never signs in, chooses
a subscription, or writes Azure resources automatically. Browser checks do not
replace trying the app in the native host with your Azure account.

## Customize

Start with the generated README's source map and the
[Azure quickstart](skills/create-canvas-app/references/toolkit/quickstart.md).
Keep the shared UI/agent actions, explicit scope and cancellation when changing
the reader or display. The [integration reference](skills/create-canvas-app/references/toolkit.md)
covers the host adapter and build settings.

Toolkit guides are included in the plugin and generated from the toolkit
sources. Their [provenance](skills/create-canvas-app/references/toolkit/provenance.json)
records versions and checksums; it does not establish npm availability.
