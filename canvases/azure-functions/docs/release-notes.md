# Azure Functions release notes

## 0.1.5

- **Build and edit functions.** Improve the Build screen and Add function flow.
- **Review Timer schedules.** Improve schedule editing and invocation results.
- **Recover local startup.** Use another available port when port 7071 is busy
  and improve startup failure recovery without stopping unrelated services.
- **Follow deployment progress.** Improve the deployment flow and status display.

## 0.1.4

- **Run without a separate Apply step.** Run and Invoke prepare required
  settings, dependencies, and supported local services. Changes to existing
  settings still require confirmation and a backup.
- **Invoke a stopped app.** Invoke starts the local Functions host when needed
  and sends the input once the app is ready.
- **Use Python installed with uv.** Detect uv-managed interpreters and fall
  back to Python/pip when uv is unavailable or fails.
- **Recover missing deployment modules.** Restore missing Bicep modules during
  deployment preparation. Use the CLI default subscription without replacing
  a manual selection.
- **Install customer documentation only.** Keep design specifications and
  maintainer guides out of the plugin. Include prerequisites, release notes,
  and screenshots for users.

## 0.1.2

- **Return to recent apps.** Open recent local and GitHub projects from Home
  or the compact app selector.
- **Open templates in repository subfolders.** Select the app folder instead
  of requiring the repository root.
- **Try local triggers and edit Timer schedules.** Prepare trigger-specific
  test inputs before invocation and change Timer schedules during creation
  or when editing an existing app.
