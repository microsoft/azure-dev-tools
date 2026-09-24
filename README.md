# Azure Developer Tools

Azure Developer Tools is a home for tools that help developers work with Azure
through GitHub Copilot.

## Install full plugins (primary)

After this repository's marketplace is approved and published, open GitHub
Copilot App **Customize → Plugins**, use the marketplace gear to add
`microsoft/azure-dev-tools` once. The proposed catalog contains Azure
Functions Hosted Skills, Azure Resources Query, and a separate skill-only
Canvas Authoring companion. CLI install IDs are
`<product>@azure-dev-tools`. Restart Copilot and check the installed skills;
open a canvas only for the two canvas plugins. Access to this repository is
required. App installation from this marketplace has not yet been verified.
Installing a canvas plugin does not display its panel automatically: ask
Copilot **"Open Azure Resources Query"** or **"Open Azure Functions Hosted
Skills"** after installation. Canvas Authoring is skill-only; use the
host's native `create-canvas` workflow instead of looking for a builder panel.
See [full-plugin installation and verification
guidance](docs/plugin-marketplace.md) for CLI commands and release status.

## Canvas packages

| Canvas | Package location | Status |
| --- | --- | --- |
| **Azure Functions Hosted Skills** | [`canvases/azure-functions-hosted-skills/`](canvases/azure-functions-hosted-skills/) | Release pending approval |
| **Azure Resources Query** | [`canvases/azure-resources-query/`](canvases/azure-resources-query/) ([install](docs/azure-resources-query/)) | Release pending approval |

The marketplace follows this repository's current default branch, not a
pinned release. Package READMEs retain the reviewed public distribution links
and document prerequisites and a canvas-only URL fallback; that fallback
does not install companion skills. Do not treat a proposed package as released
until the approved production merge and version tags are verified.

## Build canvas apps

The proposed [`canvas-authoring` marketplace entry](plugins/canvas-authoring/)
adds one `create-canvas-app` companion skill to the host's **native**
`create-canvas` workflow. It has no extension or preinstalled canvas. The
counter and read-only Azure resource-group starters help you create an app,
but the native host skill must already be installed. This is a review
candidate with [checksums](docs/canvas-authoring/SHA256SUMS), **not a released
marketplace install**. Publication requires a
separately approved builder release tag and a compatible published
`@microsoft/canvas-toolkit` with its `/build` export. Canonical npmjs.org
publishes `0.1.0-preview.2` with that export; a corporate mirror may lag.
The earlier `0.1.0-preview.1` does not have it. See the
[marketplace release gates](docs/plugin-marketplace.md#production-release-gate).

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
