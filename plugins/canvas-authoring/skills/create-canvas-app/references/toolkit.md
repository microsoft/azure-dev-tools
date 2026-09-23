# Toolkit integration reference

Use at the installed `create-canvas` skill's customization/build step, after its
native scaffold. The live host skill owns canvas authoring and verification;
these are toolkit integration examples, not a second extension skeleton.

## Deterministic setup and the host-owned adapter

Run the bundled [setup command](../scripts/setup-toolkit.mjs) as directed in
[SKILL.md](../SKILL.md). It generates all package/domain/server/UI/build/check
files in a new source app and copies the native entry byte-for-byte. It never
rewrites the original host scaffold. The one host-specific customization is
an import plus wrapping the copied native declaration:

```js
import { attachToolkit } from "./toolkit.mjs";
// Existing createCanvas(nativeOptions) becomes createCanvas(attachToolkit(nativeOptions)).
// Keep the original nativeOptions and joinSession wiring.
```

The adapter replaces demo actions/open, forwards the full context, preserves
native metadata, and chains native close after toolkit cleanup. Do not apply it
over custom business callbacks. Conflicting shutdown listeners and incompatible
registrations are explicit errors, not silently rewritten code.

`npm run build` runs the generated readiness check. `npm run check` reruns it
without rebuilding. The check executes the emitted host entry with a test-only
SDK registration seam and exercises its actual toolkit action/open/close path;
an unused import fails. This is trusted code execution, not a sandbox and not
native-host acceptance. The seam stays outside `dist/`. Return to the installed
host skill after this check rather than treating it as host activation.

## Dependency provenance

Use Node >=22 (24 recommended) and a toolkit release with the public `/build`
export. `--toolkit-version` pins an exact published version; setup performs no
registry request and `npm install` must resolve it before building. Tags, ranges,
URLs and aliases are refused. Bundled guide provenance is **not** public npm
availability or a release approval.

Alternatively, `--toolkit-tarball` accepts an approved local npm-pack archive,
including a prerelease. That mode copies the archive and declares:

```json
{
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "dependencies": {
    "@microsoft/canvas-toolkit": "file:vendor/canvas-toolkit.tgz"
  },
  "devDependencies": {
    "esbuild": "0.28.2"
  }
}
```

The setup command creates this source app manifest; it does not merge existing
package/lockfiles. For later host-guided customization, keep the same boundary.
Do not install or bundle `@github/copilot-sdk/extension`. Keep the private
tarball out of public commits; include it only in approved private source
transfers so the relative dependency stays usable. Registry mode needs no
vendored toolkit archive. Do not use absolute paths,
sibling-checkout dependencies, `latest`, or an assumed registry release.
Inspect the approved package's README, export map, and any exported types when
using additional APIs; do not import its internal modules.

## One validated domain for both callers

The `/actions` export provides `defineActions`, strict object schemas (`obj`,
`empty`), value schemas such as `int`, and `InputError`. `/state` provides the
optional `createViewStore`. For example, a `domain.mjs` module can contain:

```js
import { defineActions, empty, InputError, int, obj } from "@microsoft/canvas-toolkit/actions";
import { createViewStore } from "@microsoft/canvas-toolkit/state";

export const store = createViewStore({ initial: { count: 0 } });
export const actions = defineActions({
    get_state: {
        input: empty(),
        run: () => store.snapshot(),
    },
    set_count: {
        input: obj({ count: int({ min: 0, max: 1000 }) }, { required: ["count"] }),
        effect: "write",
        run: ({ count }) => {
            store.patch({ count });
            return store.snapshot();
        },
    },
});

export async function dispatch(name, input) {
    try {
        return await actions.dispatch(name, input);
    } catch (error) {
        if (error instanceof InputError) error.statusCode = 400;
        throw error;
    }
}
```

Use `actions.names` and `actions.schema(name)` when adapting the native
scaffold's action metadata. Both agent handlers and UI requests must call this
same `dispatch`, never mutate a second copy of state. `effect: "write"` is
metadata, not authorization or confirmation; protect real mutations separately.
Preserve errors at each boundary according to the live host contract.

`store.snapshot()` returns `{ version, model }`; browser renders can discard
older versions. `store.subscribe(listener)` returns an unsubscribe function.
This store is **not durable persistence**. Choose state ownership and lifetime
through the host skill before deciding where to construct or persist it.

## Toolkit server and UI assets

Prefer `/server`'s `startCanvasServer` where compatible with the host workflow.
For the domain above, the toolkit-specific server adapter can be:

```js
import { startCanvasServer } from "@microsoft/canvas-toolkit/server";
import { dispatch, store } from "./domain.mjs";

export function startView(assets) {
    return startCanvasServer({
        dispatch,
        model: store.snapshot,
        subscribe: store.subscribe,
        assets,
        maxBody: 4096,
    });
}
```

`assets` is an explicit allowlist of `[route, fileURL]` entries, or entries with
`[fileURL, contentType]` values. Resolve URLs relative to their **emitted** owning
module. The server provides secret-prefixed loopback URLs, origin checks, CSP,
bounded JSON bodies, and SSE. It returns `{ url, port, origin, close }`; integrate
that handle into the native scaffold's lifecycle rather than creating a second
provider. If a toolkit assumption conflicts with the live host contract, surface
the conflict instead of relaxing protections or treating the example as authority.

The server's default relative routes are `api/state`, `api/action`, and `events`.
The browser posts `{ name, input }` as JSON to `api/action`, renders snapshots,
and refreshes on SSE `change` events. Keep URLs relative to the served page so
the secret prefix is retained.

For shared styles, import the public CSS export in the browser entry:

```js
import "@microsoft/canvas-toolkit/ui/styles.css";
```

Use the stylesheet's `canvas-ui` body class and, for example, `primary-button`
and `secondary-button`. Link the emitted CSS in the HTML; a JS import alone
does not load esbuild's CSS output. The stylesheet consumes host semantic theme
tokens; the installed host skill defines that contract. The `/ui` export's
`canvasUiAssets` map is another way to identify shared assets when needed, but
its module-relative URLs must survive copying/bundling. Do not import the
Node-facing asset map into browser code or copy the entire kit indiscriminately.

Azure auth/subscription helpers are opt-in. None is needed for this generic
actions/state/server/UI path.

## Build and check the app

The public `@microsoft/canvas-toolkit/build` export provides
`prepareCanvasUiAssets(outDir)`. It copies the public UI asset closure and returns
`nodeImport`, `browserImports`, and `files`. The generated build uses those
descriptors for its bundler; asset-copy rules are owned by the toolkit, not
reimplemented in each app. Older tarballs without `/build` fail setup preflight;
an incompatible registry package fails the build after installation.

Provider modules must be emitted at `outDir` root and the browser entry served
at the canvas URL root. The preserved Node map owns module-relative file URLs;
its allowlisted browser routes own the corresponding URL layout. CSS may remain
bundled. Do not inline or rewrite the toolkit SVG source as a general workaround.

Use the source app's declared build dependencies. Configure esbuild with
`bundle: true` and `format: "esm"`:

| Build | Platform / target | Runtime boundary |
| --- | --- | --- |
| Provider | `node` / `node22` | Leave exactly `@github/copilot-sdk/extension` external, plus Node built-ins and explicitly emitted local modules. Bundle used toolkit/npm code. |
| Browser | `browser` / `es2022` | No Node or host SDK imports. Bundle browser JS and all imported CSS separately. |

Do not externalize all npm packages. Keep the host-prescribed entrypoint and
registration from the native scaffold; the build is not a new runtime standard.
Copy HTML and static files, preserve module-relative asset paths (including any
separate toolkit asset modules), and serve only the intended allowlisted assets.
The bundled setup now does this for `canvasUiAssets`: it preserves the Node asset
map and browser UI modules, copies their relative dependencies, and mounts the
map through the toolkit server. Public browser UI imports resolve to those
same-origin modules instead of being flattened into `app.js`. This matters for
the subscription SVG: esbuild does not copy `new URL(..., import.meta.url)`
assets automatically, and moving the owning module changes their URL.

Keep these generated build/server defaults. Build readiness fetches every
allowlisted toolkit UI asset and checks its content type and nonempty bytes.
Browser tests must additionally call `decode()` on images, require positive
`naturalWidth`, and fail on same-origin image/script/stylesheet HTTP errors;
working buttons and no JavaScript exceptions do not prove asset completeness.

Check esbuild's metafile for unexpected external dependencies. Native modules,
dynamic imports, CommonJS dependencies, and runtime file lookups may need explicit
handling; do not assume every npm dependency is bundle-safe.

Run `npm install`, retain `package-lock.json`, then the app's `npm run build` and
`npm test`; use `npm ci` for later installs. Test the complete emitted artifact
without source checkout, skill, or repo-local `node_modules` access. Validate
shared UI/agent state, invalid inputs, assets, and browser behavior under CSP.
These checks complement, not replace, the host skill's native verification.
Never describe unit tests or top-level browser checks as host activation.
