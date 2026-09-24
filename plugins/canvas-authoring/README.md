# Canvas authoring plugin

Create a canvas app with the Microsoft Canvas Toolkit. This plugin adds toolkit
setup and a counter or read-only Azure resource-group starter to the host's
native `create-canvas` workflow.

## Requirements

- A canvas-capable GitHub Copilot host with its installed `create-canvas` skill.
  The plugin does not replace or install that host skill.
- Node.js 22+ (24 recommended) and npm.
- A compatible toolkit version that exports `@microsoft/canvas-toolkit/build`,
  or a local `.tgz` containing that API.
- For live Azure reads: Azure CLI 2.61+ and permission to read the subscription.

## Install

**Release hold:** This builder is an unreleased candidate, not a released plugin.
Do not run the command below against the current production branch. First
require an approved production merge, a verified source-qualified immutable
product tag and installation target, and a compatible published toolkit
version with `@microsoft/canvas-toolkit/build`. The currently published
`0.1.0-preview.1` does not include that export.

Once those gates are complete, install from the approved distribution:

```sh
copilot plugin install microsoft/azure-dev-tools:plugins/canvas-authoring
```

To try a local export instead:

```sh
copilot --plugin-dir "<export-directory>/plugins/canvas-authoring"
```

Use the **exported plugin**, not the source folder `build/canvas-authoring/`.
This page describes the installed plugin; its bundled documentation links
resolve after export. Installing it adds a skill, not a running canvas app.

## Create an app

Ask your agent:

```text
Build a read-only Azure canvas that lists resource groups.
Use the native create-canvas skill and the create-canvas-app companion's
Azure starter. Help me choose a compatible toolkit version.
```

The agent creates the native scaffold, generates the source app, and connects
the copied host entry. You choose the project location and toolkit package.
For a non-Azure example, ask for the counter starter.

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
