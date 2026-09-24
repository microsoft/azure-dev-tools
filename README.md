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

## Planned

Azure SRE Agent is planned; no package or installation asset is available in
this repository.

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
