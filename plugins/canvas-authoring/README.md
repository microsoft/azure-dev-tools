# Canvas authoring plugin

Create new Azure-related canvas apps with the Microsoft Canvas Toolkit and
editable SVG spot illustrations.

## What you can do

- Turn a new Azure canvas idea into a project with guided setup.
- Build interfaces with reusable components that match Copilot's theme.
- Share actions and state between the canvas and your agent.
- Connect to Azure with authentication, subscription selection and read-only resource access.
- Create editable spot illustrations from bundled or supplied style references.

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

App creation needs a canvas-capable Copilot host with the native `create-canvas`
skill, Node.js 22+, and an available toolkit package. Illustration creation
needs skill support and local SVG/browser tools, not Azure or a toolkit install.
See [requirements](#requirements).

## Try it

Ask your agent to **Build a new read-only Azure canvas that lists resource
groups. Use the native create-canvas skill and the create-canvas-app
companion's Azure starter.** Choose a compatible toolkit package and project
location when prompted.

## Prompts to try

> Build a new read-only Azure canvas that lists resource groups. Use the native create-canvas skill and the create-canvas-app companion's Azure starter.

The companion does not activate for generic canvas creation or for requests to
run, open, install, test, debug, review, explain, or customize an existing
canvas. Use the native `create-canvas` skill directly for a new generic canvas.

> Use create-spot-illustration to make four SVG options for investigating incidents. Match the bundled style and use incident records, not charts. Show all four before I choose.

## Requirements

For illustrations, use a host with skill support and local SVG/browser tools.
The [illustration skill](skills/create-spot-illustration/SKILL.md) includes
three editable SVG examples. It creates four options before selection.
In this repository, the Toolkit workbench's **Spot illustrations** mode shows
the options together for review. The workbench is not part of this plugin.
You can supply your own samples as style context;
redistributing them requires reuse permission. Animation is optional, plays
once by default, and must respect reduced-motion settings.

For app creation:

- A canvas-capable GitHub Copilot host with its installed `create-canvas` skill.
  The plugin does not replace or install that host skill.
- Node.js 22+ (24 recommended) and npm.
- An exact compatible published version of `@microsoft/canvas-toolkit`
  exporting `@microsoft/canvas-toolkit/build`, or an approved local `.tgz`
  containing that API. Confirm the exact version before setup. Do not treat a
  missing `/build` export as success.
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

For a new Azure canvas, one agent follows one phased workflow. It first creates
the native scaffold, then applies the toolkit starter and runs the generated
checks, and finally continues the native install, reload, open, and verification
steps. Skills supply instructions; they do not run as nested processes. You
choose the project location and toolkit package.

Setup accepts one exact npm version or one local tarball. It does not install
dependencies or contact Azure, and it refuses existing output directories
rather than overwriting files. The setup command still supports the counter
starter for development, tests, or an explicit manual setup choice. Counter
support does not make generic canvas requests a trigger for this companion. For
command-line setup, see the [skill instructions](skills/create-canvas-app/SKILL.md).

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
