# Azure Developer Tools

Azure Developer Tools is a home for tools that help developers work with Azure
through GitHub Copilot.

## Install full plugins (primary)

After this repository's marketplace is approved and published, open GitHub
Copilot App **Customize → Plugins**, use the marketplace gear to add
`microsoft/azure-dev-tools` once, and install Azure Functions Hosted Skills or
Azure Resources Query from the `azure-dev-tools` marketplace. Their CLI
install IDs are `<product>@azure-dev-tools`. Restart Copilot, open the canvas,
and check that its companion skills are available. Access to this repository
is required. App installation from this marketplace has not yet been
verified. See [full-plugin installation and verification
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

## Canvas authoring companion (release candidate)

[`plugins/canvas-authoring/`](plugins/canvas-authoring/) is a separate,
skills-only builder proposal with a counter and read-only Azure resource-group
starter. It adds toolkit setup to the host's native `create-canvas` workflow;
it is not an installed canvas app or a marketplace product. The proposed
payload and its [checksums](docs/canvas-authoring/SHA256SUMS) are available for
review, **not installation**. The production candidate depends on the
two-product promotion above and must receive its own approval, merge,
source-qualified immutable product tag, and install verification before any
install instructions apply. The compatible toolkit
`@microsoft/canvas-toolkit@0.1.0-preview.2` now provides `/build`; the older
`0.1.0-preview.1` does not. The default package mirror may lag npmjs.org.

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
