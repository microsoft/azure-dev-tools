# Canvas authoring (design preview)

A skills-only toolkit companion to the GitHub Copilot app's installed
`create-canvas` skill. **That live skill is the source of truth for canvas apps.**
Our `create-canvas-app` skill invokes it first and follows its native scaffold
workflow, then adds toolkit-specific help at the customization/build step.
It returns to the host workflow for verification rather than defining a competing
authoring standard.

Our contribution is practical package provenance, shared validated actions/state,
compatible toolkit server/UI integration, and Node/browser esbuild asset closure.
The bundled [toolkit reference](skills/create-canvas-app/references/toolkit.md)
ships with this plugin. No host skill text or machine-specific skill path is
copied here. If the app's skill is unavailable, the companion reports the missing
prerequisite; package/build advice alone does not imply native activation.

The standalone generator in `microsoft/azure-dev-tools` at
`scripts/create-canvas.mjs` remains an **optional experimental toolkit/build
reference**, not the default workflow or a replacement for the host's native
scaffold. No marketplace entry, extension process, MCP server, npm scaffolder
package, or release payload is included in this plugin.

## Try the proposed design

Use the GitHub Copilot app with its installed `create-canvas` skill and Node >=22
(Node 24 recommended for the toolkit). Before merge, use a clean checkout of the
reviewed PR commit and load this plugin locally with the supported `--plugin-dir`
option:

```sh
copilot --plugin-dir /path/to/reviewed-checkout/plugins/canvas-authoring
```

After merge and approval, direct plugin installation will be:

```sh
copilot plugin install microsoft/azure-dev-tools:plugins/canvas-authoring
```

That installs **instructions only**, not the app's `create-canvas` skill, a
generated extension, npm dependencies, or the optional generator. Ask the agent
to add toolkit actions/state/UI or build setup to a canvas. The companion starts
by invoking the installed host skill; toolkit guidance supplements its workflow.

### Toolkit distribution is a prerequisite

The inspected toolkit is private `@microsoft/canvas-toolkit` 0.1.0, not a public
npm release. This prototype intentionally requires a trusted local npm tarball
of that version. Its API and eventual distribution contract still need review.
With permission to use a toolkit checkout, pack it into an existing private
directory outside either repository (this is packaging, not publishing):

```sh
npm pack /path/to/approved/canvas-toolkit --ignore-scripts --pack-destination /private/existing-directory
```

For the app established by the host workflow, copy that approved tarball to
`vendor/canvas-toolkit.tgz`, declare the relative `file:` dependency, and use the
normal npm install/lockfile/build/test loop in the bundled toolkit reference.
No Azure integration is required.

## Optional experimental generator

Use the generator only when explicitly choosing to inspect or try its standalone
toolkit/build example. Do not run it as a second scaffold over the host-created
canvas. Compare/adapt its toolkit/build pieces during customization; its embedded
host wiring is an example, **not** the source of truth for the current runtime.

The script is outside the installed plugin, in the `microsoft/azure-dev-tools`
repository. Before merge, use a clean checkout of a reviewed branch/commit,
confirm the origin and full commit SHA, and inspect the local script before
execution. A future single-file download must pin a reviewed full commit SHA
and be saved and inspected; never pipe a moving URL into execution. There is no
released immutable script URL in this PR.

Run from that reviewed checkout into a new private directory:

```sh
node scripts/create-canvas.mjs --name my-canvas \
  --output /private/existing-directory/my-canvas \
  --toolkit-tarball /private/existing-directory/microsoft-canvas-toolkit-0.1.0.tgz
cd /private/existing-directory/my-canvas
npm install
npm run build
npm test
```

The script uses only Node built-ins, embeds its complete template, refuses
existing destinations, and never installs, logs in, publishes, or activates
anything. The tarball is copied into `vendor/canvas-toolkit.tgz`; no absolute or
sibling-checkout dependency remains. `npm install` creates the lockfile through
the normal npm workflow. Keep it and use `npm ci` thereafter. Private tarballs
are ignored by Git; do not publish them or the bundles without release approval.

### What the optional example demonstrates

- Plain JS, a host-themed counter, and one validated action/state path shared
  by UI buttons and agent actions. State is ephemeral and shared across panels
  in one provider process; provider restart resets it.
- Toolkit server on secret-prefixed loopback URLs, same-origin requests,
  strict script CSP, and bounded request bodies. Styles permit inline host
  theme injection. No Azure calls, login, telemetry, prompt forwarding, framework,
  or Claude support.
- Separate esbuild Node ESM and browser builds. Toolkit/npm code is bundled;
  the exact `@github/copilot-sdk/extension` import is host-provided and external.
  Shared UI CSS is bundled via its public export. HTML is copied explicitly.
- The entire `dist/` folder is the runtime artifact, with `extension.mjs` at
  its root. It needs neither npm nor this plugin/source checkout to run.
  Use the installed host skill for scope, authoring, and activation/verification;
  this example does not define those contracts. No automatic reload is provided.

The small embedded template is intentionally the only template source. It trades
some editing convenience for a genuinely single-file scaffolder. This is not a
general-purpose release builder: new static assets need explicit build copies
and server routes; native dependencies and dynamic asset lookups need their own
build decisions. Do not assume arbitrary npm packages are bundle-safe.

## Contributor checks

No root package installation is required:

```sh
node --test tests/create-canvas.test.mjs
```

The real dependency integration check is opt-in, uses a temporary directory
outside the repo, runs npm install/build/tests, and exercises a relocated
artifact. Add `CANVAS_BROWSER` to exercise a real Chromium browser under CSP;
without it the browser check is explicitly skipped:

```sh
CANVAS_TOOLKIT_TARBALL=/private/approved-toolkit.tgz \
CANVAS_BROWSER=/path/to/chrome \
node --test tests/canvas-integration.test.mjs
```

The integration runner invokes npm's JavaScript CLI with Node, not a shell or
`npm.cmd`. For a nonstandard npm layout, set `npm_execpath` to `bin/npm-cli.js`.

To check discovery without changing installed plugins, use a temporary
`COPILOT_HOME` for both commands:

```sh
COPILOT_HOME=/private/temporary-config copilot --plugin-dir /absolute/plugin-path plugin list --json
COPILOT_HOME=/private/temporary-config copilot --plugin-dir /absolute/plugin-path skill list --json
```

Check that `canvas-authoring` and its `create-canvas-app` skill are enabled.
This verifies plugin discovery, not availability of the app-shipped prerequisite
in every CLI environment or end-to-end host activation.

Release, licensing, and public toolkit distribution review remain prerequisites;
see `docs/release-process.md` in `microsoft/azure-dev-tools`. This draft does not
approve publication of the toolkit or any generated canvas.
