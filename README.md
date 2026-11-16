# Azure Developer Tools

GitHub Copilot plugins for Azure development. Review cost health, create and
run Azure Functions apps, build Hosted Skills, query Azure resources, diagnose
apps with SRE Agent, browse Azure Storage, author canvas apps, and operate
local containers.

## Plugins

| Plugin | What it does |
| --- | --- |
| [Azure Cost Health Check](canvases/azure-cost-health-check/) | Review spend, forecasts, budgets, alerts, recommendations, and AI billing. |
| [Azure Functions](canvases/azure-functions/) | Create, edit, review, run, deploy, and modernize Function Apps, with optional AI help. |
| [Azure Functions Hosted Skills](canvases/azure-functions-hosted-skills/) | Build and run local Hosted Skills or invoke supported functions in an existing Function App. |
| [Azure Resources Query](canvases/azure-resources-query/) | Find and inspect Azure resources with read-only Resource Graph queries. |
| [Azure SRE Agent](canvases/azure-sre-agent/) | Connect to your SRE Agent, diagnose failing apps, and investigate incident threads. |
| [Azure Storage](canvases/azure-storage/) | Browse blobs, inspect statistics, download files, and plan storage transfers with Copilot. |
| [Canvas Authoring](plugins/canvas-authoring/) | Add toolkit setup and starter apps to the native `create-canvas` workflow. Skill-only plugin, with no canvas panel. |
| [Containers](canvases/containers/) | Browse and operate local Docker or Podman containers and images. |

Each product README lists its prerequisites, safe prompts, first-run
workflow, version-pinned installation options, release notes, and
product-specific safety behavior.

## Install a plugin

Add the production marketplace once:

```sh
copilot plugin marketplace add microsoft/azure-dev-tools
```

Then install the plugin you need:

```sh
copilot plugin install azure-cost-health-check@azure-dev-tools
copilot plugin install azure-functions@azure-dev-tools
copilot plugin install azure-functions-hosted-skills@azure-dev-tools
copilot plugin install azure-resources-query@azure-dev-tools
copilot plugin install azure-sre-agent@azure-dev-tools
copilot plugin install azure-storage@azure-dev-tools
copilot plugin install canvas-authoring@azure-dev-tools
copilot plugin install containers@azure-dev-tools
```

You can also open GitHub Copilot **Customize > Plugins**, use the marketplace
gear to add `microsoft/azure-dev-tools` (marketplace ID `azure-dev-tools`), and
select a plugin. Fully quit and reopen GitHub Copilot after installation, then
start a fresh chat.

The marketplace follows this repository's default branch. For a reproducible,
version-pinned install, use the immutable release tag listed in the product
README.

Native App marketplace installation has not been verified for every product;
a source package or direct CLI install alone does not establish that the
native listing is live.

## Start with a useful prompt

| Plugin | Try |
| --- | --- |
| Azure Cost Health Check | *Open Azure Cost Health Check in real mode for my subscription.* |
| Azure Functions | *Open Azure Functions canvas so I can create a Python HTTP function app project without AI customization.* |
| Azure Functions Hosted Skills | *Open Azure Functions Hosted Skills canvas so I can try a daily GitHub repository digest for octocat/Hello-World with the Timer trigger.* |
| Azure Resources Query | *Show my Function Apps in Development.* |
| Azure SRE Agent | *My app is failing. Open SRE Agent Canvas so I can investigate it.* |
| Azure Storage | *Open Azure Storage canvas.* |
| Canvas Authoring | *Use the native create-canvas skill and the create-canvas-app companion to build a counter canvas.* |
| Containers | *Open Containers canvas.* |

## Disable usage telemetry

For plugins whose **Usage data** notice links here, disable usage telemetry
with these steps. Update older plugin versions first.

1. Create `~/.copilot/canvases/telemetry.json` (Windows:
   `%USERPROFILE%\.copilot\canvases\telemetry.json`), including any missing
   folders. If `COPILOT_HOME` is configured, use
   `<COPILOT_HOME>/canvases/telemetry.json` instead.
2. Save:

   ```json
   {
     "enabled": false
   }
   ```

3. Fully quit and reopen GitHub Copilot or Claude Desktop, whichever runs
   the plugin, then start a fresh session.

## Get involved

See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute. For help or feedback, see
[SUPPORT.md](SUPPORT.md). To report a security vulnerability, follow
[SECURITY.md](SECURITY.md). This repository is licensed under the
[MIT License](LICENSE).
