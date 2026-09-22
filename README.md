# Azure Developer Tools

Azure Developer Tools is a home for tools that help developers work with Azure
through GitHub Copilot.

## Coming soon

| Canvas | Package location | Status |
| --- | --- | --- |
| **Azure Functions Hosted Skills** | [`canvases/azure-functions-hosted-skills/`](canvases/azure-functions-hosted-skills/) | Planned |
| **Azure SRE Agent** | [`canvases/azure-sre-agent/`](canvases/azure-sre-agent/) | Planned |

These package locations are scaffolds only. No canvas packages are available
to install yet.

## Canvas authoring design preview

[`plugins/canvas-authoring/`](plugins/canvas-authoring/) proposes a skills-only
toolkit companion to the GitHub Copilot app's installed `create-canvas` skill,
the source of truth for canvas authoring. The companion invokes that skill first
and supplements its customization/build step with toolkit integration guidance.
A standalone generator remains an optional experimental build reference, not a
replacement for the host's native scaffold. Toolkit use requires an explicitly
approved local tarball; public distribution and release approval remain
unresolved. No generated canvas or private toolkit payload is distributed here.

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
