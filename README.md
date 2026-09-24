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
| **Azure Functions Hosted Skills** | Canvas with skills | [Immutable release](https://github.com/Azure/azure-dev-tools/tree/azure-functions-hosted-skills-v0-5-1-2bb8354/canvases/azure-functions-hosted-skills) | Pending production approval and tags |
| **Azure Resources Query** | Canvas with skill | [Immutable release](https://github.com/Azure/azure-dev-tools/tree/azure-resources-query-v0-1-1-be9551d/canvases/azure-resources-query) | Pending production approval and tags |
| **Canvas Toolkit (Canvas Authoring)** | Skill-only plugin; no canvas | [Immutable release](https://github.com/Azure/azure-dev-tools/tree/canvas-authoring-v0-1-0-23aa6b1/plugins/canvas-authoring) | Pending production approval and tags |
| **Azure SRE Agent** | Planned | — | **COMING SOON** |

After this repository's marketplace is approved and published, open GitHub
Copilot App **Customize → Plugins**, add `microsoft/azure-dev-tools` once, and
select a released plugin from the `azure-dev-tools` marketplace. Its CLI
install ID is `<product>@azure-dev-tools`. Access to this repository is
required. Private marketplace and native App installation have not yet been
verified; the authoring companion does not open a canvas panel. See
[full-plugin installation and verification guidance](docs/plugin-marketplace.md)
for release status. The marketplace follows this repository's default branch,
not a pinned release. Do not treat a production package as released until its
approved merge and version tags are verified.

The [Canvas Toolkit authoring candidate](plugins/canvas-authoring/) and its
[26-file checksum receipt](docs/canvas-authoring/SHA256SUMS) are available for
review, **not private production installation**. This skill-only companion
adds toolkit setup and a read-only Azure starter to the native `create-canvas`
workflow. It requires `@microsoft/canvas-toolkit@0.1.0-preview.2` for `/build`;
the older `0.1.0-preview.1` lacks that export. Its production distribution
requires a separately approved merge, source-qualified tag, and install
verification.

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
