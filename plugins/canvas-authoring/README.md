# Canvas toolkit companion (design preview)

The app's installed **`create-canvas` skill is the source of truth** for canvas
apps. This plugin invokes it first, follows its native scaffold workflow, then
runs bundled deterministic toolkit setup at its customization/build step.
The host skill still owns scope, native wiring, lifecycle, and verification.
If that skill is missing, report the prerequisite; this is not a replacement.

## Use the companion

Before merge, load the reviewed plugin from a clean checkout:

```sh
copilot --plugin-dir /path/to/reviewed-checkout/plugins/canvas-authoring
```

After merge and approval:

```sh
copilot plugin install microsoft/azure-dev-tools:plugins/canvas-authoring
```

Installation only supplies instructions and the bundled script. It does not
execute setup, install dependencies, activate an extension, or install the
app-shipped prerequisite. No marketplace or npm scaffolder package is required.

The [skill](skills/create-canvas-app/SKILL.md) contains the normal workflow.
The [toolkit reference](skills/create-canvas-app/references/toolkit.md) describes
public APIs and build boundaries. All skill links and executable resources ship
inside this plugin; no source checkout or network bootstrap is needed.

## Deterministic command and explicit integration boundary

Use Node >=22 (24 recommended). From the installed skill's directory:

```sh
node scripts/setup-toolkit.mjs --name my-canvas \
  --scaffold /path/to/native/my-canvas/extension.mjs \
  --output /path/to/existing-parent/new-source-app \
  --toolkit-tarball /path/to/approved-toolkit.tgz
```

The repository's `scripts/create-canvas.mjs` is only a convenience wrapper for
the same bundled implementation and options. It is no longer a standalone
whole-app generator: `--scaffold` is required. Do not download that wrapper alone.

Setup reads a regular `extension.mjs` from a directory containing only that file.
It does **not** parse/rewrite arbitrary native source or claim compatibility with
every host version. It copies the entry unchanged into a new buildable source
app; the **original native directory is never changed**.

| Ownership | Files |
| --- | --- |
| Host skill | Original native scaffold and copied `src/extension.mjs`; current registration/session contract |
| Setup command | `src/toolkit.mjs`, domain/server/browser modules, assets, package manifest, esbuild, starter tests, readiness checks, developer notes, private vendor copy |
| Native verification | Host skill after build; not the generated registration test seam |

The host skill makes one explicit import and wrapper change in the copied entry:

```js
import { attachToolkit } from "./toolkit.mjs";
// Wrap the existing createCanvas options with attachToolkit:
// createCanvas(attachToolkit(nativeOptions))
```

The generated README has the exact hookup. Keep native options and surrounding
`joinSession` wiring. The adapter deliberately replaces the demo actions/open,
preserves metadata and full host context, and chains native close after toolkit
cleanup. Custom business callbacks or competing signal handlers require explicit
host-guided integration, not automatic replacement. There is only one provider.

Setup reports **NOT READY** until that hookup is complete. Run:

```sh
npm install
npm run build
npm test
```

Build invokes the registration readiness check; `npm run check` reruns it. It
executes the **emitted host entry**, captures actual SDK construction/registration,
and exercises toolkit behavior and teardown. An unused import, missing wrapper,
wrong canvas identity, skipped SDK constructor, or conflicting shutdown handlers
fails. This executes trusted source code and is not a sandbox.

The source app is separate from the host install location so npm dependencies
never become runtime requirements. The complete `dist/` contains ESM provider
modules and separate browser JS/CSS/HTML. Toolkit dependencies are bundled; the
exact `@github/copilot-sdk/extension` import remains host-provided. The native
skill governs artifact installation/activation. No automatic reload/watch.

### Safety and reruns

All predictable input/config/collision checks happen before creating output.
Existing destinations are always refused, even byte-identical reruns. This
preserves edited source, package manifests, and lockfiles. No merge/overwrite mode.
Native directories with package/lock/config/custom companion files are refused.
Use canonical paths: symlinks in input/output ancestors are rejected, including
OS aliases such as `/tmp` on macOS (use its resolved `/private/tmp` path).

Unknown host source is copied, never rewritten or executed by setup. The live
host skill reviews the adapter change, and readiness refuses incompatible
registration; generation alone never proves a working host canvas. Unexpected
I/O failure reports the partial, newly created output directory for inspection;
the command never deletes user files to recover.

### Toolkit distribution remains a prerequisite

The inspected `@microsoft/canvas-toolkit` 0.1.0 is private, not npm-published.
Supply an explicitly approved local npm-pack tarball; no `latest`, fabricated
registry release, or private package bytes are included in the plugin.

```sh
npm pack /path/to/approved/canvas-toolkit --ignore-scripts --pack-destination /private/existing-directory
```

Setup copies the archive to ignored `vendor/canvas-toolkit.tgz` and declares a
relative `file:` dependency. Keep the normal npm lockfile and use `npm ci`
thereafter. Include the archive only in approved private source transfers, never
public commits. Working local bundles are not redistribution approval.

The generated counter shares validated actions/state between UI and agent. State
is deliberately ephemeral; the toolkit store is not durable storage. Server/UI
helpers provide loopback/origin/CSP protections and host-themed CSS. Azure APIs,
login, cloud writes, telemetry, frameworks, and raw prompt forwarding are absent.

## Contributor checks and current limitations

```sh
node --test tests/create-canvas.test.mjs
CANVAS_TOOLKIT_TARBALL=/private/approved-toolkit.tgz \
CANVAS_BROWSER=/path/to/chrome \
node --test tests/canvas-integration.test.mjs
```

The integration runner uses a real approved kit in a temporary source app,
installs/locks/builds/tests, checks negative wiring cases, relocates the build,
deletes source/dependencies, then exercises the emitted host entry through an
isolated test SDK seam and real Chromium under CSP. Without the environment
options, real-kit/browser checks are explicitly skipped. For nonstandard npm
layouts, set `npm_execpath` to your npm installation's `bin/npm-cli.js`.

The host registration fixture is **not a fresh native scaffold**. The native
guide/scaffold/reload tools were unavailable during this revision; the installed
skill and SDK documentation were read, but native activation was not performed.
Protocol-seam and top-level browser tests do not prove sandboxed-host activation.

To verify plugin resources/discovery without changing installed plugins:

```sh
COPILOT_HOME=/private/temporary-config copilot --plugin-dir /absolute/plugin-path plugin list --json
COPILOT_HOME=/private/temporary-config copilot --plugin-dir /absolute/plugin-path skill list --json
```

Look for enabled `canvas-authoring` and `create-canvas-app`. CLI discovery does
not prove the app-shipped prerequisite exists in every standalone CLI.
Public toolkit distribution, licensing, and repository release approvals remain
unresolved; see `docs/release-process.md` in `microsoft/azure-dev-tools`.
