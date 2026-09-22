# Toolkit integration reference

Use at the installed `create-canvas` skill's customization/build step, after its
native scaffold. The live host skill owns canvas authoring and verification;
these are toolkit integration examples, not a second extension skeleton.

## Dependency provenance

This preview targets the inspected public exports of private
`@microsoft/canvas-toolkit` 0.1.0 (Node >=22; 24 recommended). "Public exports"
means the package's export map, **not** public npm availability. Obtain an
explicitly approved local npm-pack tarball, copy it into the app, and declare:

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

Merge these fields into the source app's package manifest, not the host SDK.
Do not install or bundle `@github/copilot-sdk/extension`. Keep the private
tarball out of public commits; include it only in approved private source
transfers so the relative dependency stays usable. Do not use absolute paths,
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
Check esbuild's metafile for unexpected external dependencies. Native modules,
dynamic imports, CommonJS dependencies, and runtime file lookups may need explicit
handling; do not assume every npm dependency is bundle-safe.

Run `npm install`, retain `package-lock.json`, then the app's `npm run build` and
`npm test`; use `npm ci` for later installs. Test the complete emitted artifact
without source checkout, skill, or repo-local `node_modules` access. Validate
shared UI/agent state, invalid inputs, assets, and browser behavior under CSP.
These checks complement, not replace, the host skill's native verification.
Never describe unit tests or top-level browser checks as host activation.
