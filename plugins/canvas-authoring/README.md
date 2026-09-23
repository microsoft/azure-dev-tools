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

### Create an Azure canvas

Try the agent prompt: **"Build a read-only Azure canvas that lists resource
groups. Use the installed native create-canvas skill, this toolkit companion,
and an approved toolkit version."**

The [Azure quickstart](skills/create-canvas-app/references/toolkit/quickstart.md)
and [small reader](skills/create-canvas-app/references/toolkit/examples/resource-groups.mjs)
are bundled snapshots of the canonical toolkit sources, with provenance hashes.
`scripts/sync-toolkit-guides.mjs` copies their link dependencies and records
hashes; do not maintain separately edited guides here.

The agent selects `--template azure-resource-groups` to generate auth, explicit
subscription scope, a bounded read-only query, cancellation and shared UI/agent
state. The user then customizes the useful part rather than rebuilding that
plumbing. The generic counter remains the default for non-Azure work.

The Azure starter opens in live mode without automatic profile reads, sign-in or
queries. Load an existing CLI profile, explicitly select a subscription, then
request the read. Its smoke command uses labelled synthetic data instead.

## Deterministic command and explicit integration boundary

Use Node >=22 (24 recommended). From the installed skill's directory:

```sh
node scripts/setup-toolkit.mjs --name my-canvas \
  --scaffold /path/to/native/my-canvas/extension.mjs \
  --output /path/to/existing-parent/new-source-app \
  --toolkit-version "$TOOLKIT_VERSION"
```

Add `--template azure-resource-groups` for the Azure starter. That preset requires
the full plugin; its templates are packaged beside the command. The default
counter remains embedded in the standalone command. Both require an approved
toolkit package that exports `@microsoft/canvas-toolkit/build`.

Set `TOOLKIT_VERSION` to an approved exact compatible published version; tags,
ranges, aliases and URLs are rejected. No default registry version is assumed.
Alternatively replace the version option with
`--toolkit-tarball /path/to/approved-toolkit.tgz`. Exactly one source is required.
Generation is offline: registry mode writes the exact dependency, and `npm install`
resolves it later. An unavailable version fails installation; there is no fallback.

The published `0.1.0-preview.1` does not include `/build` and cannot build these
starters. Use an approved local candidate containing the helper until a newer
release includes it.

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

Toolkit UI assets are handled through the toolkit's public build helper, including
the subscription SVG. Asset-owning browser modules retain their relative layout;
the runtime keeps all requests inside the canvas URL prefix. Build readiness
checks every public UI asset, and the real-browser suite decodes both picker
images. This prevents a working picker with an unnoticed 404 icon.

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

For the Azure UI, `npm run smoke` is the focused browser path. It uses installed
Google Chrome (or the executable in `CANVAS_BROWSER`), never downloads a browser,
and checks decoded icons, build identity, explicit selection and UI/agent state
in a sandboxed iframe. Use `npm test` for domain/server behavior changes; do not
run unrelated repository sweeps for ordinary iteration on a generated app.

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
After rebuilding, reload the extension provider and then reopen the panel.
The footer and `get_state` expose a deterministic build ID. A browser warning
identifies files/provider mismatches; refreshing only the panel is not a provider
restart.

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

### Toolkit dependency and provenance

Registry mode keeps the chosen version pinned in `package.json`, without a
vendored archive. Keep `package-lock.json` and use `npm ci` for subsequent installs.
The plugin does not publish packages or select `latest`. Update bundled guide
snapshots when adopting toolkit API changes; their recorded source version is
not proof that any package version is available from npm.

For local development before publication, use an explicitly approved tarball:

```sh
npm pack /path/to/approved/canvas-toolkit --ignore-scripts --pack-destination /private/existing-directory
```

Setup copies the archive to ignored `vendor/canvas-toolkit.tgz` and declares a
relative `file:` dependency. Keep the normal npm lockfile and use `npm ci`
thereafter. Include the archive only in approved private source transfers, never
public commits. Working local bundles are not redistribution approval.

Both starters share validated actions/state between UI and agent. The counter
is shared per provider; Azure scope/results are isolated per panel. State is
deliberately ephemeral, not durable document storage. Server/UI helpers provide
loopback/origin/CSP protections and host-themed CSS. Automatic login, cloud
writes, telemetry, UI frameworks and raw prompt forwarding are absent.

## Contributor checks and current limitations

```sh
node --test tests/create-canvas.test.mjs
CANVAS_TOOLKIT_TARBALL=/private/approved-toolkit.tgz \
CANVAS_BROWSER=/path/to/chrome \
node --test tests/canvas-integration.test.mjs tests/azure-starter.test.mjs
```

Once a compatible release exists, the Azure integration can use it directly:
set `CANVAS_TOOLKIT_VERSION` to its exact version instead of
`CANVAS_TOOLKIT_TARBALL`, then run `tests/azure-starter.test.mjs`.

The command tests also install a pinned prerelease from a loopback registry
fixture, without contacting npm or publishing anything. That proves npm
dependency resolution, not public registry availability or a working toolkit.
The integration runner uses a real approved kit in a temporary source app,
installs/locks/builds/tests, checks negative wiring cases, relocates the build,
deletes source/dependencies, then exercises the emitted host entry through an
isolated test SDK seam and real Chromium under CSP. Without the environment
options, real-kit/browser checks are explicitly skipped. For nonstandard npm
layouts, set `npm_execpath` to your npm installation's `bin/npm-cli.js`.

The checked-in host registration fixture is **not a fresh native scaffold**.
The Azure integration generates, installs and builds the preset, then runs its
focused smoke in a sandboxed browser. These checks use synthetic data and a test
SDK seam, not native-host UI or live Azure authorization. Return to the installed
host skill for actual activation. A fresh-builder trial is a separate adoption
check, not something a passing package test establishes.

To verify plugin resources/discovery without changing installed plugins:

```sh
COPILOT_HOME=/private/temporary-config copilot --plugin-dir /absolute/plugin-path plugin list --json
COPILOT_HOME=/private/temporary-config copilot --plugin-dir /absolute/plugin-path skill list --json
```

Look for enabled `canvas-authoring` and `create-canvas-app`. CLI discovery does
not prove the app-shipped prerequisite exists in every standalone CLI.
Publishing and merge decisions are outside this local prototype; nothing was
published, merged, or installed at user scope.
