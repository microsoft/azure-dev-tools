---
name: create-canvas-app
description: Add @microsoft/canvas-toolkit to a GitHub Copilot canvas using the app's installed create-canvas skill first. A companion for validated actions/state, shared UI, approved package dependencies, and Node/browser esbuild setup; not a replacement canvas-authoring workflow.
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

## Toolkit customization

Read the bundled [toolkit reference](references/toolkit.md) and apply only the
pieces the app needs:

1. **Establish dependency provenance.** This preview requires an explicitly
   approved local `@microsoft/canvas-toolkit` 0.1.0 npm-pack tarball. Public npm
   distribution is unresolved. Keep a private copy under the app's `vendor/`
   with a relative `file:` dependency; never assume `latest` or publish the kit.
2. **Share domain behavior.** Use public actions/state exports so UI requests and
   agent handlers reach the same validated dispatch and state. `createViewStore`
   is in-memory view state, not durable persistence; defer storage/lifetime to
   the host skill. Do not forward raw prompts.
3. **Reuse compatible toolkit pieces.** Prefer `startCanvasServer` over
   hand-rolled transport where it satisfies the current host contract. Use the
   shared UI/CSS exports without duplicating host theme rules. Azure integrations
   are opt-in, never prerequisites for a generic canvas.
4. **Close the build boundary.** Separate Node and browser bundles, leave the
   exact host SDK import external, and include every CSS/static asset. Install
   declared dependencies, retain the normal npm lockfile, and run the app's
   build/tests. Check the relocated artifact and real browser separately from
   the host skill's native verification; report what actually ran.

The standalone generator described in the [plugin README](../../README.md) is
an **optional experimental toolkit/build reference**, not the default workflow
or a replacement for the native scaffold. This plugin installs guidance only.

Keep private tarballs and generated bundles out of public commits. A working
local build is not approval to redistribute its dependencies.
