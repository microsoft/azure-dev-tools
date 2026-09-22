# Canvas authoring (design preview)

A skills-only Copilot plugin plus a [standalone Node scaffolder](../../scripts/create-canvas.mjs).
The plugin teaches an agent the workflow; the script creates an independently
buildable app. Neither installs or starts the other. No marketplace entry,
extension process, MCP server, npm scaffolder package, or release payload is
included here.

## Try the proposed design

Use Node >=22 (Node 24 recommended) and a canvas-capable Copilot host. Before
merge, use a clean checkout of the reviewed PR commit, inspect the script, and
load this plugin locally with the supported `--plugin-dir` option:

```sh
copilot --plugin-dir /path/to/reviewed-checkout/plugins/canvas-authoring
```

After merge and approval, direct plugin installation will be:

```sh
copilot plugin install microsoft/azure-dev-tools:plugins/canvas-authoring
```

That installs **instructions only**, not a generated extension or the scaffolder.
The standalone script is at the repository root, not in the installed plugin.
For now run it from the reviewed checkout. A future single-file download must
pin a reviewed full commit SHA; there is no released immutable URL in this PR.

### Toolkit distribution is a prerequisite

The inspected toolkit is private `@microsoft/canvas-toolkit` 0.1.0, not a public
npm release. This prototype intentionally requires a trusted local npm tarball
of that version. Its API and eventual distribution contract still need review.
With permission to use a toolkit checkout, pack it into a private directory
outside either repository (this is packaging, not publishing):

```sh
npm pack /path/to/approved/canvas-toolkit --ignore-scripts --pack-destination /private/existing-directory
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

## Generated app contract

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
  Installation scope is an explicit user choice; no watch/automatic reload
  claim is made.

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
CLI discovery alone is not an end-to-end host activation test.

Release, licensing, and public toolkit distribution review remain prerequisites;
see [the repository release process](../../docs/release-process.md). This draft
does not approve publication of the toolkit or any generated canvas.
