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
and runs bundled deterministic toolkit setup at its customization/build step.
The command preserves the native entry and generates toolkit/build plumbing;
one explicit host-owned adapter hookup is required and checked before readiness.
It does not replace the host's native scaffold. Choose an exact published
toolkit version or an explicitly approved local tarball. The Azure starter
includes subscription scope, read-only resource groups, asset packaging and a
focused browser smoke. No generated canvas or private toolkit payload is
distributed here.

## Get involved

Watch this repository for updates and see [CONTRIBUTING.md](CONTRIBUTING.md)
to contribute. For help or feedback, see [SUPPORT.md](SUPPORT.md). To report
a security vulnerability, follow [SECURITY.md](SECURITY.md). This repository
is licensed under the [MIT License](LICENSE).
