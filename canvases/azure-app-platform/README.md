# Azure App Platform

Create, assemble, and operate multi-tier agentic apps centered on
**ACA Sandboxes** and **AI Gateway**. Azure App Platform keeps each app in an
isolated Git worktree and shows its components on an evidence-backed App Map.

## Install

In GitHub Copilot, open **Customize → Plugins** and install **Azure App
Platform** from the **awesome-copilot** marketplace. If the marketplace is
missing, add it first:

```sh
copilot plugin marketplace add github/awesome-copilot
copilot plugin install azure-app-platform@awesome-copilot
```

Reopen Copilot and start a new chat. The plugin includes its templates and
browser assets; no `npm install` or build step is needed.

## Try it

Ask in chat:

> open Azure App Platform

On **Home**, choose **Create a new app**, pick a starter template, describe
the app, and review it. The canvas creates the app in a new Git worktree.

## What you can do

- **Create a new app:** start from **Sandboxes & AI Gateway**, **Sandboxes
  Minimal**, App Service Builder starters, a reference sample, or an empty app.
- **Open an app:** reopen an app worktree from **Home** or **Open**.
- **Assemble existing projects:** map source folders and compatible Azure
  resources into one `azure-app.yaml` manifest.
- **Build, Connect, Run, Observe, Deploy:** edit components, select the
  gateway, model, and sandbox, invoke the agent with documents, inspect the
  **App Map** and **Logs**, and deploy.

## Why use it

- **Isolated tool execution:** run untrusted tools and documents in ACA
  Sandboxes, separate from the agent. Local process simulation lets you
  develop before cloud sandboxes are configured.
- **Governed shared access:** route model and tool calls through AI Gateway so
  that policy, rate limits, and credentials stay in one place.

## Delete a local app

Choose **Delete app** from an app's actions or from **App settings**. Stop the
app first. Deletion removes the local worktree and its canvas-created branch,
including uncommitted changes and untracked files. It does not remove Azure
resources, source repositories, or cloud deployments.
