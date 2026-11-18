---
name: create-canvas-app
description: Create or build a new Azure-related Copilot canvas with the host's native create-canvas skill and Microsoft Canvas Toolkit. Use only for a new Azure canvas. Do not use for existing or generic canvases, Azure CLI or resource work, or requests to run, open, install, test, debug, review, explain, or customize.
---

# Azure canvas toolkit companion

## Invocation boundary

Use this companion only when the user asks to **create or build a new
Azure-related canvas**. The request must require both a new canvas and Azure
behavior such as authentication, subscription scope, or resource reads.

Do not invoke this companion:

- To run, open, install, test, debug, review, explain, or customize an existing
  Azure canvas.
- To create or build a generic or non-Azure canvas.
- For Azure CLI commands, resource lookup, deployment, configuration, or other
  ordinary Azure work that does not create a new canvas.
- For documentation, architecture-only work, ordinary code that uses the word
  canvas, or a request that says not to build.

If the user explicitly invokes `create-canvas-app` by name outside this scope,
do not start generation. Explain that this companion is for new Azure canvases.
For a new generic canvas, invoke only the native host `create-canvas` workflow.
For an existing canvas or an explanation/review request, use the relevant
project files or toolkit references without scaffolding a new app.

## Existing canvases

Do not spend tool calls on an existing-canvas search. When the user clearly
asks to build a canvas, build it. If the canvas list already in your context
has a canvas that covers the request (for example `azure-container-apps` or
`azure-resources-query`), name it in the final summary under Limitations. Ask
first only when the request is unclear about building a new canvas.

## One phased host workflow

This `create-canvas-app` companion is already active. Do not invoke it again.
Load the host's `create-canvas` instructions once with
`skill({ skill: "create-canvas" })`. The host skill owns native scaffolding,
SDK registration, lifecycle, activation, and provider reload. If it is
unavailable, report that the required app skill is missing and stop.

Speed matters. Target about 15 to 20 tool calls for a resource canvas. The
generated canvas does not get its own tests: do not write or run test files,
smoke scripts, Playwright, or headless browser checks for it. The build check
and one real use in the native host are the verification.

- **A. Native scaffold:** Create the native scaffold with the host
  `create-canvas` instructions (`extensions_manage` `scaffold`). If
  `extensions_manage` is a deferred tool, load it and `extensions_reload` with
  one tool search. The scaffold directory is also the install directory.
- **B. Toolkit application:** Read only the
  [toolkit API cheat sheet](references/api-cheatsheet.md) before you write
  code. It has the component props, validators, auth, ARM, and UI rules. Do
  not read the other references or search `node_modules` unless the cheat
  sheet does not answer a specific question. Generate, customize, and build
  with the commands in section 1.
- **C. Native verification:** Reload the provider, open the canvas, and use
  its main action once on real data (section 2).

Do not create a second scaffold, provider, registration, or lifecycle. Do not
use todo tables, `list_canvas_capabilities`, or `jq` passes over large tool
output; they add turns without new evidence.

Give the user a one-sentence progress update when each phase starts and
ends: the phase, the result, and the next step.

## 1. Generate, customize, and build

Put the source project in the current working directory or the session
directory, for example `./my-canvas-source`, unless the user names a path.
Setup does not create a Git repository; do not run `git init`.

One command generates the project and installs dependencies. Run it from this
skill directory:

```sh
node scripts/setup-toolkit.mjs --name my-canvas \
  --scaffold "<native-scaffold>/extension.mjs" \
  --output "<cwd>/my-canvas-source" --template azure-resource-groups \
  && cd "<cwd>/my-canvas-source" && npm install --no-audit --no-fund
```

Setup pins the latest published `@microsoft/canvas-toolkit`. Do not add
`--toolkit-version` or `--toolkit-tarball` unless the user asks for a specific
version or a local tarball. Setup copies the Azure starter and connects `src/extension.mjs` with
`attachToolkit`. If it prints `NOT CONNECTED`, wrap the native `createCanvas`
options as `createCanvas(attachToolkit(options))` and import `attachToolkit`
from `./toolkit.mjs`.

Customize only these files, using the starter as the pattern:

- `src/resource-groups.mjs`: rename and replace it with your ARM reader.
- `src/domain.mjs`: your actions, scope, and state. Keep the profile,
  subscription, cancel, and `get_state` actions.
- `src/browser/app.mjs`: your list, details, filters, and actions.
- `src/canvas.mjs`: the canvas description and resource icon.

Then one command builds, checks the registration, and installs `dist/` into
the native scaffold directory:

```sh
npm run build
```

Do not edit `src/toolkit.mjs` or `scripts/`. Do not copy `dist/` by hand. If
the build fails, fix the reported cause and rebuild.

## 2. Verify in the native host

Run the host tools in sequence, not in parallel. Each step depends on the
result of the step before it:

- Wait for `extensions_reload` to finish before you call `extensions_manage`
  `inspect` or `open_canvas`.
- Wait for `open_canvas` to return before you call `invoke_canvas_action` on
  that instance.
- Do not put two of these calls in the same parallel batch. If a call fails
  because an earlier step was not complete, run the earlier step to completion,
  then retry once.

Then:

1. Call `extensions_reload`. A panel refresh does not load rebuilt provider
   code. After every rebuild, also later fixes, call `extensions_reload`
   yourself and then `open_canvas` again. Do not ask the user to do it; if
   you skip it, the panel shows "This canvas was updated."
2. Call `open_canvas` with the canvas ID. The panel loads the Azure CLI
   profile by itself.
3. Call `invoke_canvas_action` for `reload_profile`. It returns the accounts
   and subscriptions, and joins the load that the panel started. Then call
   `select_subscription` with one of them, then the main list action once.
   Each action returns the new state; do not call `get_state` between them.
4. Compare the build ID in the result with the build output. If you could not
   do a step, report it as unverified.

Installation, provider reload, publication, Azure sign-in, and cloud mutations
remain separate user decisions. Read resources only for the main action, and
never run a write action without the user's approval.

## 3. Rules that the cheat sheet expands

- Design for ~480px (one-third panel) first; it must also look good at half and full width.
- One validated action registry and one state model for UI and agent callers.
  No raw prompt forwarding or chat-only paths.
- Use toolkit components (`CanvasShell`, `CanvasHeader`, `CanvasFooter`,
  `ListDetail`, `DetailPanel`, `FilterToolbar`, `Blankslate`, `MessageBar`,
  `Dialog`, `Button`) and `createAzureSubscriptionPicker`. Do not hand-build
  them with raw `<h1>`, `<ul>`, `<input>`, `<dialog>`, `<button>`, or status
  `<p>` elements.
- Show the resource-type icon with `iconForType` and `azureIconAssets` in the
  header and in each list item.
- Load the Azure CLI profile when the panel opens. Do not add a "Reload
  profile" or "Load profile" button; use `refreshOnFocus: true` and the "Sign
  in to Azure" empty state.
- Never auto-select a subscription or read resources before the user acts.
- Validate ARM IDs with `armId(...)`; compare them case-insensitively.
- ARM times with no zone suffix are UTC; see
  [Timestamps](references/azure-operations.md#timestamps).
- Lifecycle actions use the API versions and long-running-operation helper in
  [Azure resource operations](references/azure-operations.md). Do not search
  the web for API versions.
- Never turn authentication, access, network, or cancellation failures into an
  empty success result.

Read these only for a question the cheat sheet does not answer:
[shared UI components](references/toolkit/ui-components.md),
[Azure authentication](references/toolkit/auth.md),
[toolkit package and server](references/toolkit/README.md),
[adapter and build](references/toolkit.md).

Do not add product telemetry by default. If the user requests it, follow
[Product-usage telemetry](references/toolkit/README.md#product-usage-telemetry).

For new SVG artwork, use
the `create-spot-illustration` skill.

## Final response contract

Finish with a handoff that uses these headings, in this order. Keep each
section short, but do not leave one out. Write "None" or "Not done" when a
section has no content.

1. **Built:** the features, actions, and states of the canvas, and the
   toolkit source (version or tarball) that it uses.
2. **Open and use:** the `canvasId`, how to open it, and its main actions (UI
   and agent action names) with the first useful action.
3. **Source:** the source project path and the native scaffold (install)
   path. To change the canvas: edit, `npm run build`, then reload.
4. **Checks:** `npm run build` and its result. The generated canvas has no
   test or smoke suite.
5. **Native verification:** evidence for provider reload, native open, the
   main action, and the build ID, or `unavailable` with the reason.
6. **Not verified:** what you did not prove, for example write actions or
   sign-in.
7. **Limitations:** known gaps, for example per-panel state or read-only
   scope, and any existing canvas that already covers the request.

Do not report only that files were generated.
