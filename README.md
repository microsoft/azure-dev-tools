# Azure Developer Tools

Azure Developer Tools is a home for tools that help developers work with Azure
through GitHub Copilot.

## Install full plugins (primary)

The first three plugins are available from their immutable public release
tags. Check out the linked tag and follow the package README to install the
full plugin, including its skills. The authoring companion is a skill-only
product, not a running canvas. Private marketplace registration and native
App installation have separate release gates.

| Plugin | Type | Installable public package | Production status |
| --- | --- | --- | --- |
| **Azure Functions Hosted Skills** | Canvas with skills | [Immutable release](https://github.com/Azure/azure-dev-tools/tree/azure-functions-hosted-skills-v0-5-1-2bb8354/canvases/azure-functions-hosted-skills) | Production package merged; private tags pending |
| **Azure Resources Query** | Canvas with skill | [Immutable release](https://github.com/Azure/azure-dev-tools/tree/azure-resources-query-v0-1-1-be9551d/canvases/azure-resources-query) | Production package merged; private tags pending |
| **Canvas Toolkit (Canvas Authoring)** | Skill-only plugin; no canvas | [Immutable release](https://github.com/Azure/azure-dev-tools/tree/canvas-authoring-v0-1-0-23aa6b1/plugins/canvas-authoring) | Production package merged; marketplace and private tag pending |
| **Azure SRE Agent** | Planned | — | **COMING SOON** |

After this repository's marketplace is approved and published, open GitHub
Copilot App **Customize → Plugins**, use the marketplace gear to add
`microsoft/azure-dev-tools` once, and select a released plugin from the
`azure-dev-tools` marketplace. CLI install IDs are
`<product>@azure-dev-tools`. Access to this repository is required. Restart
Copilot and check the installed skills. Installing a canvas plugin does not
display its panel automatically: ask Copilot **"Open Azure Functions Hosted
Skills"** or **"Open Azure Resources Query"**. The authoring companion does
not open a panel; use the host's native `create-canvas` workflow instead.
Private marketplace and native App installation have not yet been verified.
See [installation and release guidance](docs/plugin-marketplace.md). The
marketplace follows this repository's default branch, not a pinned release.
Do not treat a private production plugin as released until its immutable tag
and installation target are verified.

## Build canvas apps

The [`canvas-authoring` production package](plugins/canvas-authoring/) and
its [26-file checksum receipt](docs/canvas-authoring/SHA256SUMS) are available
for review; private marketplace installation still awaits its approved
catalog merge, source-qualified tag, and install verification. Its one
`create-canvas-app` companion skill adds toolkit setup and counter or
read-only Azure resource-group starters to the host's **native**
`create-canvas` workflow. The host skill must already be installed; this
plugin contains no extension or preinstalled canvas. Canonical npmjs.org
publishes `@microsoft/canvas-toolkit@0.1.0-preview.2` with the required
`/build` export; a corporate mirror may lag. The earlier
`0.1.0-preview.1` lacks it. See the
[marketplace release gates](docs/plugin-marketplace.md#production-release-gate).

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
