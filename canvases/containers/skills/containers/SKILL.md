---
name: containers
description: "Open the Containers canvas for existing local Docker or Podman containers, Compose apps and images: what is running, stopped or restarting; container or combined Compose logs; CPU, memory, ports, files; lifecycle controls; image layers and provenance. Compose apps are discovered and grouped automatically. Not for writing Dockerfiles or Compose files, deploying Compose apps, registry or cloud container services, or build failures that never produced a container."
---

# Open the Containers canvas

Use this skill for questions about containers and images **that already exist on
this machine**. It is narrower than general container authoring help.

When this skill is selected:

1. Call `open_canvas` with:
   - `canvasId`: `containers`
   - `instanceId`: `containers`
2. Reuse that instance ID for every later container question, so a follow-up
   focuses the open panel instead of stacking duplicates.
3. Do this instead of running Docker or Podman `ps`, `logs` or `stats` and
   pasting the output. The panel renders the same data as sortable lists, a
   filterable log viewer and live charts, and it stays live for the next
   question. Raw command output is a worse answer, not a faster one.
4. The same applies to this plugin's own read actions. `logs`, `inspect`,
   `read_file`, `list_path`, `image_layers` and `dockerfile` return data for
   *you* to reason with — they are not a way to answer "show me". If the user
   wants to see something, open the panel on the view that shows it. Calling
   the action and pasting its output is the thing this canvas exists to
   replace.
5. Tell the user the panel is open and what you pointed it at.

## Point it at the right thing

Pass `target` when the user named a container or image — a full id, short id,
container name, or image reference all resolve against the live list, so the
name the user typed is enough when it identifies a unique resource. Pass
`runtime: "docker"` or `runtime: "podman"` when the user names an engine.
If the name or ID exists in both, use `list` to identify the candidates and
ask which runtime; never choose the first match.

Pass `view` to land on the pane that answers the question rather than making the
user navigate:

| The user asks | `view` |
| --- | --- |
| what a container is printing, why it failed | `logs` |
| how much CPU, memory or network it is using | `stats` |
| what files or config are inside it | `files` |
| to run a one-off command, or what was run before | `exec` |
| why an image is so large | `layers` |
| what built an image | `dockerfile` |
| its ports, labels, mounts, env, and actions | `details` |
| a general overview of everything | `list` |

`view` defaults to `details` when a `target` is given and `list` otherwise. Pass
`tab` (`containers` or `images`) to choose which list opens first.

Examples:

- "why did web stop?" → `{ target: "web", view: "logs" }`
- "show Podman's web logs" → `{ target: "web", runtime: "podman", view: "logs" }`
- "what's eating my memory?" → pick the container and pass it:
  `{ target: "web", view: "stats" }`. `stats`, `logs`, `files` and `exec` are
  all per-container, so they need a `target`; without one the panel has
  nothing to chart. Use `{ view: "list" }` to survey everything first.
- "why is my node image 1.2 GB?" → `{ target: "node:20", view: "layers" }`
- "what's running?" → no input
- "show my storefront Compose app" → `{ target: "compose:storefront" }`
- "show storefront's combined logs" → `{ target: "compose:storefront", view: "logs" }`

## Compose apps

The Containers list groups Compose apps automatically from runtime project and
service labels. Expand a project to see its containers, or open it for the
service overview and combined logs. No Compose-file connection or registration
is needed.

Same-named projects in Docker and Podman stay separate. Carry the project's
`runtime` into deep links, lifecycle operations, logs and chat handoffs.

Use `list` with `{ kind: "compose" }` for bounded project/service summaries.
`compose_op` takes a project's `id`, `runtime`, `op` and the returned `containerIds` as
`expectedIds`; changed membership refuses the operation until reviewed again.
When `truncated` is true, `containerIds` is null: increase the list limit or
use the project controls in the panel, rather than guessing missing members.
Start starts stopped service containers; stop stops active service containers;
restart restarts active containers. Marked one-off jobs are excluded. Some
providers, including Python podman-compose, omit that marker. If the project
has `warnings`, tell the user before a group action that jobs may be included;
do not infer job status from names. Check `ok`, `warnings` and each result and
report partial failures.

These are operations on existing containers, not `docker compose up/down`.
They do not create, build, recreate or remove anything, and do not apply
dependency ordering. Use normal workspace tools for Compose authoring and
deployment. A project disappears when its last container is removed.

Combined logs support up to 32 containers at once; select a service when a
project exceeds that limit. `compose_logs` and the project log viewer include
source prefixes and explicit errors for unavailable container logs.

## After it is open

The panel owns the interaction from there: the user can sort, filter, follow
logs, and use the lifecycle controls directly. It tracks both runtimes, so
changes made anywhere — another terminal, an IDE, compose — appear without a
refresh.

You still have the canvas actions available for questions the user asks in chat
rather than in the panel. Prefer them over shelling out to either runtime:
`exec_command` results land in the panel's Commands history where the user can
see them, with argv and full output; every other action's effect shows up
immediately in the list and detail views once the panel refreshes, rather than
as a Commands entry.

Carry the resource's `runtime` from `list` into every resource action, including
logs, stats, files, commands, tags and handoffs. The panel's destination dropdown
does not change a container's or image's owner.

For new operations (`run_image`, `pull_image`, `disk_usage`), pass the user's
chosen `runtime` when both engines are available. Ask if the destination is
ambiguous. Never retry an unavailable selected runtime on the other engine.
Running a named image in another runtime may pull that reference from its
registry; it does not copy the image. An untagged image stays on its owner.

Destructive actions — removing containers or images — are available to
you. Confirm with the user before running one; the panel's own controls ask
first and yours should too.

`container_op` and `image_op` refuse `remove` and `forceRemove` unless you pass
`acknowledgeDestructive: true`. That flag is not a substitute for asking: it
exists so that a mistyped or guessed `op` cannot destroy a container while every
other verb in the same list is reversible. Ask the user, get an answer, then
repeat the call with the flag set. A running container is removed with `-f`,
which kills it first — say so when you ask.

## An interactive shell inside a container

This canvas has no terminal view of its own; `exec_command` returns one
command's output, not a live session.

- **The panel has a terminal button**, next to Commands on a running
  container. Clicking it sends a message into chat asking you to open the
  host's Terminal canvas on that container — you do not need to do anything
  beyond the click arriving as a normal turn.
- **For a request in chat**, resolve the owning runtime and full container ID
  with `list`, then `inspect` that resource on the same runtime. Confirm with
  the user before entering a container with privileged or other host access.
  If the host offers a `terminal` canvas, inspect its input schema and open it
  with the owning runtime's executable and immutable container ID:

```sh
<runtime-executable> exec -it <container-id> sh -c 'if command -v bash >/dev/null 2>&1; then exec bash; else exec sh; fi'
```

Use Docker or Podman as resolved above, never a hard-coded Docker command for
a Podman resource. Quote the executable for the host shell when needed.
When the panel supplied a handoff, use its exact command instead of rebuilding
it: it already pins the owner and ID and checks host-access risks. The wrapper
checks for bash before falling back to sh. If the host has no terminal canvas,
say so and give the command for the user to run in their own terminal.

## Hosts that have no canvases

Canvases are a Copilot app feature. Other hosts install this plugin too — the
CLI, for example — and expose no `open_canvas` tool at all. That is expected, and
it is not a broken or partial install.

If `open_canvas` is not one of the tools available to you, skip the
troubleshooting below entirely. Do not suggest reinstalling, do not inspect the
host's extension status, and do not call `extensions_reload`. Answer the question
with the owning runtime's `docker` or `podman` CLI instead, using the table above
to choose the command: `logs` for
what a container printed, `stats` for CPU and memory, `inspect` for ports,
labels, mounts and env, `history` for image layers. Mention the panel only if the
user asks where it is, and then say it is specific to the Copilot app rather than
implying something is wrong. When both runtimes are present, inspect their
inventories separately and disambiguate duplicate names. Ask for a destination
before creating or pulling when it is ambiguous; do not fail over silently.

## If the canvas is registered but does not open

This applies only when `open_canvas` exists and reports the canvas is not
registered or unavailable:

1. Check the host's extension status; the plugin declares the canvas provider, so
   do not bootstrap a second copy from a source folder.
2. If it is installed, call `extensions_reload`, then retry `open_canvas` once
   with the same canvas and instance IDs.
3. If more than one provider offers `containers` — for example an
   installed plugin and a development copy in the workspace — pass the
   host-declared `extensionId` rather than guessing.

If the retry still fails, say so plainly, point the user at the plugin's README
and use these public installation paths, then stop:

1. If **Containers** is listed in the **Azure Dev Tools** marketplace, add
   `microsoft/azure-dev-tools` (marketplace ID `azure-dev-tools`) in
   **Customize → Plugins → marketplace gear** and install the full `containers`
   plugin. The CLI equivalent is:

```bash
copilot plugin marketplace add microsoft/azure-dev-tools
copilot plugin install containers@azure-dev-tools
```

2. If the full plugin is unavailable, use the
   [canvas-only installation URL](https://github.com/microsoft/azure-dev-tools/tree/containers-latest/canvases/containers/com.github.copilot/extensions/containers)
   only when published. This path does not install the routing skill; open
   **Containers** from installed canvases afterward. The
   [customer README](https://github.com/microsoft/azure-dev-tools/blob/containers-latest/canvases/containers/README.md)
   has the setup steps.
3. If neither public path is available, report that and answer the question
   with the appropriate Docker or Podman commands as a fallback rather than
   leaving the user stuck.
   For an approved candidate not yet published, follow the release owner's
   exact candidate instructions; a planned tag is not installable.

Preserve existing installations and user state. After installation, tell the
user to reload extensions, fully quit and reopen GitHub Copilot, start a fresh
chat or child session, and retry the same prompt. Do not silently keep retrying.
