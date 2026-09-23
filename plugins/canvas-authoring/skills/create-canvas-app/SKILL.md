---
name: create-canvas-app
description: Add @microsoft/canvas-toolkit to a GitHub Copilot canvas using the app's installed create-canvas skill first, then the bundled deterministic toolkit setup command. Generates actions/state/server/UI and esbuild plumbing; the native skill owns host wiring and verification.
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

## Deterministic toolkit setup at customization

Read the bundled [toolkit reference](references/toolkit.md). Use the
[setup command](scripts/setup-toolkit.mjs) at the host workflow's
customization/build step, before adding custom business behavior:

1. **Establish inputs.** This preview requires an explicitly
   approved local `@microsoft/canvas-toolkit` 0.1.0 npm-pack tarball. Public npm
   distribution is unresolved; never assume `latest` or publish the kit. Use
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
     --toolkit-tarball /path/to/approved-toolkit.tgz
   ```

   This uses only bundled code and Node built-ins, not a download/bootstrap.
   It copies the native entry unchanged to `src/extension.mjs`, generates the
   toolkit modules/assets/package/build/checks, and copies the tarball to a
   relative `vendor/` dependency. Original scaffold files remain untouched.
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

The [plugin README](../../README.md) explains supported inputs and limitations.
Installation only supplies the companion; it never executes setup automatically.

Keep private tarballs and generated bundles out of public commits. A working
local build is not approval to redistribute its dependencies.
