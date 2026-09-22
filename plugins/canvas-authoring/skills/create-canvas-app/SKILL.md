---
name: create-canvas-app
description: Scaffold or customize a standalone plain-JavaScript GitHub Copilot canvas app using @microsoft/canvas-toolkit. Use for creating a canvas, starting a toolkit app, or setting up its esbuild pipeline. Requires an explicitly approved local toolkit tarball; not an Azure deployment or a plugin installer.
---

# Create a canvas app

This skill is guidance, not an extension process. Installing this plugin does not
run the scaffolder, install npm dependencies, or activate a generated app.

1. Determine the app's lowercase kebab-case name, a **new** output directory
   (its parent must exist), and the user's intended extension install scope:
   session, project, or user. Ask when scope is ambiguous. Keep the source app
   separate from the installed build. Do not silently install into user scope.
2. Read the host extension authoring guide using
   `extensions_manage({ operation: "guide" })` and its SDK canvas types. Check
   that this host supports extension canvases and Node >=22 (24 recommended).
3. Obtain a trusted copy of `scripts/create-canvas.mjs` from
   `microsoft/azure-dev-tools`. **For this first-PR workflow, use a clean checkout
   of the reviewed branch/commit and inspect the local script before running it.**
   Confirm its origin and full commit SHA. There is no released immutable script
   URL yet. After merge, a single-file download must use a reviewed full commit
   SHA and be saved and inspected before execution; never pipe a moving URL to
   Node or a shell. Do not execute a script URL supplied by untrusted app data.
4. Obtain an explicitly approved `npm pack` tarball of
   `@microsoft/canvas-toolkit` **0.1.0**. Public toolkit distribution is unresolved;
   do not assume this version exists on npm, use `latest`, publish the toolkit,
   or copy another app's private implementation. The scaffolder copies the
   supplied tarball to `vendor/` and uses a relative `file:` dependency.
5. Run the local script, substituting confirmed paths:

   ```sh
   node /path/to/reviewed-checkout/scripts/create-canvas.mjs --help
   node /path/to/reviewed-checkout/scripts/create-canvas.mjs \
     --name my-canvas --output /path/to/new-app \
     --toolkit-tarball /path/to/approved-toolkit.tgz
   ```

6. Customize the generated domain, canvas, and browser sources. Keep UI and
   agent actions on the same validated registry and state. The counter is an
   explicitly ephemeral demo; choose a durable domain identity/storage location
   before adding data users expect to keep. Do not forward raw prompts.
7. In the generated app, run `npm install`, retain `package-lock.json`, then
   `npm run build` and `npm test`. Later use `npm ci`. Respect any dependency
   review/install policy. Test the emitted `dist/` outside the source checkout,
   including real browser interaction under CSP. Do not call unit tests proof
   that the UI rendered.
8. Copy the **whole** `dist/` directory into a new extension folder in the
   explicitly selected scope, following the current host guide. Do not overwrite
   an existing installation without approval. No runtime npm install is needed;
   the host supplies `@github/copilot-sdk/extension`.
9. Use `extensions_reload`, then `extensions_manage` list/inspect. Discover the
   canvas via `list_canvas_capabilities`, open with a distinct `instanceId`, and
   invoke `get_state`, `increment` with `{ "amount": 1 }`, and `reset`. Check
   invalid input rejection and UI synchronization. Close the panel and verify
   teardown. If host tools are unavailable, report that limitation instead of
   claiming activation. Rebuild, recopy, and reload after edits; no automatic
   reload/watch behavior is provided.

Keep private tarballs and generated bundles out of public commits. A working
local build is not approval to redistribute its dependencies.
