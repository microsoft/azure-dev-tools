---
name: create-canvas-app
description: Build a canvas with @microsoft/canvas-toolkit using the installed create-canvas skill first. Includes an Azure starter with explicit subscription scope, read-only resource groups, shared UI/agent state, safe asset packaging, and a focused browser smoke.
---

# Canvas toolkit companion

**First action:** invoke the GitHub Copilot app's installed `create-canvas`
skill through the host's skill mechanism: `skill({ skill: "create-canvas" })`.
If it is already active, continue that invocation rather than invoking it again.

That live skill is the **source of truth** for canvas authoring: scope, SDK
guidance, native scaffolding, entrypoint/registration, lifecycle, transport,
theming, storage/lifetime, reload, and host verification. Follow its workflow,
including its **native scaffold step**. Do not copy its text, hardcode its
installation path, or replace its scaffold with this repository's generator.
Apply this companion at the host workflow's customization/build step, then
return to that workflow for verification.

If `create-canvas` is unavailable, report that the required app skill is missing.
Do not invent a replacement SDK/lifecycle workflow or claim native activation.
Package-only toolkit/build guidance can still be useful, but is not a substitute.

## Azure first-app path

For an Azure canvas, choose `--template azure-resource-groups` in setup rather
than generating a counter and rebuilding the Azure wiring manually. The preset
includes auth, explicit subscription selection, the bounded reader, cancellation,
shared UI/agent state, and the picker. Follow the bundled
[Azure quickstart](references/toolkit/quickstart.md) to customize it. Its
[resource-group reader](references/toolkit/examples/resource-groups.mjs) is a small,
read-only customization using public toolkit imports. The guide and example are
available before installing npm dependencies; do not make the user find this
repository or invent another scaffolder.

Keep native authoring and activation owned by `create-canvas`. Use explicit
Azure scope, one action/state path for UI and agent, visible failures, bounded
results and cancellation. Test with clearly labelled synthetic fixtures before
any live read; never substitute fixture results for real Azure data. No automatic
login, resource query on open, cloud writes, or publication.

The Azure preset supplies the SDK build dependencies, including the optional
`supports-color` import needed by this inspected SDK graph. Do not relax the
external-dependency check or assume the host supplies arbitrary npm modules.
Live mode is the default but performs no discovery or query on open. Synthetic
mode is explicit (`{"mode":"fixture"}`) and is what the smoke check uses.

## Deterministic toolkit setup at customization

Read the bundled [toolkit reference](references/toolkit.md). Use the
[setup command](scripts/setup-toolkit.mjs) at the host workflow's
customization/build step, before adding custom business behavior:

1. **Establish inputs.** Use a user/release-approved exact published
   `@microsoft/canvas-toolkit` version with the public `/build` export.
   An explicitly approved local npm-pack tarball is also supported. Never use
   a tag/range, assume an unverified version exists, publish the kit, or
   silently switch sources after an install failure. Use
   the host-created `extension.mjs` from a directory containing only that file,
   its canvas ID as the name, and a **new, separate source-app directory**.
   Existing projects/package/lockfiles and symlink paths are refused, not merged.
2. **Run the bundled script.** From this installed skill's directory, substituting
   confirmed absolute paths (resolve OS path aliases before use):

   ```sh
   node scripts/setup-toolkit.mjs --help
   node scripts/setup-toolkit.mjs --name my-canvas \
     --scaffold /path/to/native/my-canvas/extension.mjs \
     --output /path/to/existing-parent/new-source-app \
     --toolkit-version "$TOOLKIT_VERSION"
   ```

   Set `TOOLKIT_VERSION` to the approved compatible published version, or
   replace that option with `--toolkit-tarball /path/to/approved-toolkit.tgz`.
   Choose exactly one source. Add `--template azure-resource-groups` for Azure requests. Omit it for the
   generic counter. The Azure preset requires the full installed plugin because
   its templates and canonical reader ship beside the command.

   This uses only bundled code and Node built-ins, not a download/bootstrap.
   It copies the native entry unchanged to `src/extension.mjs`, generates the
   toolkit modules/assets/package/build/checks, and pins the exact npm dependency
   or copies the tarball to a relative `vendor/` dependency. Registry availability
   is checked by `npm install`, not by this offline generator; build requires
   the installed public `/build` export. Original scaffold files remain untouched.
   All predictable validation happens before output creation. Reruns refuse
   any existing destination, including identical output.
3. **Connect the host declaration.** Follow the generated README: add
   `import { attachToolkit } from "./toolkit.mjs";` to the copied entry and
   wrap the existing options as `createCanvas(attachToolkit({ ... }))`.
   Keep the native options and surrounding session wiring; forward host context
   unchanged. The adapter replaces only demo actions/open and chains native
   close after toolkit cleanup. The live host skill must review this hookup.
   Custom actions/open or competing shutdown handlers need explicit integration,
   not an automated rewrite. Do not use the setup command as a second provider.
4. **Build and prove connection.** In the generated source app:

   ```sh
   npm install
   npm run build
   npm test
   ```

   For the Azure UI path use `npm run smoke`: one sandboxed Chrome check with
   synthetic data, decoded icons, build identity and UI/agent synchronization.
   It uses installed Chrome, or `CANVAS_BROWSER` for an explicit executable;
   do not download/install a browser automatically. Keep iteration checks scoped
   to the generated app, not unrelated repository-wide suites.

   Keep the lockfile; later use `npm ci`. Build runs `npm run check`'s registration
   check against the **emitted host entry**, not merely a toolkit import. Missing
   hookup, unused imports, incompatible registration, or conflicting shutdown
   ownership fail readiness. This executes trusted source using a test SDK seam,
   not native-host activation or a sandbox. Source generation alone is NOT READY.
5. **Customize and return.** Modify shared domain actions/state and UI as needed;
   use the reference for public APIs. `createViewStore` is not durable persistence;
   defer storage/lifetime to the host skill. Azure integrations are opt-in, not
   prerequisites. No raw prompt forwarding. Keep Node/browser bundles separate,
   the host SDK external, and all assets in `dist/`. Check the relocated artifact
   and real browser, then return to the live host skill for installation/verification
   in the chosen scope. Do not copy source dependencies into the runtime artifact.
   Reload the provider before reopening the panel. The footer and `get_state`
   expose a build ID; a mismatch with served files means the provider is stale.
   Never claim a panel refresh alone activated a rebuilt provider.

Keep the generated toolkit asset-copy and module-boundary rules when adding UI
components. They preserve relative icon URLs and automatically expose only the
public asset map under the canvas URL prefix. Build readiness checks every asset.
Browser verification must check successful image decoding and fail on missing
same-origin images/scripts/styles; clicking controls alone is insufficient.

The [plugin README](../../README.md) explains supported inputs and limitations.
Installation only supplies the companion; it never executes setup automatically.

Keep private tarballs and generated bundles out of public commits. A working
local build is not approval to redistribute its dependencies.
