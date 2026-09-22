#!/usr/bin/env node
import { lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const HELP = `Create an optional experimental toolkit/build example (Node >=22).

For canvas authoring, invoke the GitHub Copilot app's installed create-canvas
skill first. It is the source of truth; this example does not replace its
native scaffold or define the current host runtime contract.

Usage:
  node create-canvas.mjs --name my-canvas --output /existing/parent/new-app \\
    --toolkit-tarball /approved/canvas-toolkit-0.1.0.tgz

Options:
  --name             Lowercase kebab-case name, 1-64 characters.
  --output           New directory; parent must exist. Never overwritten.
  --toolkit-tarball   Trusted local npm-pack archive of @microsoft/canvas-toolkit 0.1.0.
  --help             Show this help without creating files.

No install, login, publication, activation, or global configuration changes.
The toolkit is not publicly distributed yet. Review the archive's provenance
before use. It is copied into the app, not linked to its original location.
`;

function parseArgs(args) {
    const options = {};
    for (let i = 0; i < args.length; i++) {
        const key = args[i];
        if (!["--name", "--output", "--toolkit-tarball"].includes(key)) {
            throw new Error("Unknown option: " + key);
        }
        if (Object.hasOwn(options, key)) throw new Error("Duplicate option: " + key);
        const value = args[++i];
        if (!value || value.startsWith("--") || /[\x00-\x1f\x7f]/.test(value)) {
            throw new Error("Expected a non-empty value without control characters for " + key);
        }
        options[key] = value;
    }
    for (const key of ["--name", "--output", "--toolkit-tarball"]) {
        if (!options[key]) throw new Error("Required option: " + key);
    }
    return options;
}

// Inspect npm's tar header/manifest without extracting or executing its contents.
function toolkitManifest(archive) {
    const tar = gunzipSync(archive, { maxOutputLength: 64 * 1024 * 1024 });
    let manifest;
    let offset = 0;
    while (offset + 512 <= tar.length) {
        const header = tar.subarray(offset, offset + 512);
        if (header.every(byte => byte === 0)) break;
        const text = (start, length) => header.subarray(start, start + length).toString("utf8").replace(/\0.*$/s, "");
        const sizeText = text(124, 12).trim();
        if (!/^[0-7]+$/.test(sizeText)) throw new Error("Invalid tar entry size.");
        const size = Number.parseInt(sizeText, 8);
        const checksum = [...header].reduce((sum, byte, index) => sum + (index >= 148 && index < 156 ? 32 : byte), 0);
        if (checksum !== Number.parseInt(text(148, 8).trim(), 8)) throw new Error("Invalid tar header checksum.");
        const start = offset + 512;
        if (!Number.isSafeInteger(size) || start + size > tar.length) throw new Error("Truncated toolkit archive.");
        const name = [text(345, 155), text(0, 100)].filter(Boolean).join("/");
        if (name === "package/package.json") {
            if (manifest || !["", "0"].includes(text(156, 1)) || size > 1024 * 1024) {
                throw new Error("Expected one regular package/package.json.");
            }
            manifest = JSON.parse(tar.subarray(start, start + size).toString("utf8"));
        }
        offset = start + Math.ceil(size / 512) * 512;
    }
    if (manifest?.name !== "@microsoft/canvas-toolkit" || manifest.version !== "0.1.0") {
        throw new Error("Expected an npm-pack archive of @microsoft/canvas-toolkit 0.1.0.");
    }
}

export async function scaffold(args) {
    const options = parseArgs(args);
    const name = options["--name"];
    if (name.length > 64 || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)
        || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(name)) {
        throw new Error("Invalid name: use 1-64 lowercase kebab-case characters, starting with a letter; no device names.");
    }
    const output = options["--output"];
    if (output.split(/[/\\]/).some(part => part === "..")) throw new Error("Output must not contain '..' path segments.");
    const requested = path.resolve(output);
    const parent = await realpath(path.dirname(requested));
    const destination = path.join(parent, path.basename(requested));
    try {
        await lstat(destination);
        throw new Error("Destination already exists; refusing to overwrite: " + destination);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    const tarball = path.resolve(options["--toolkit-tarball"]);
    const stat = await lstat(tarball);
    if (!stat.isFile() || stat.size > 32 * 1024 * 1024 || !tarball.endsWith(".tgz")) {
        throw new Error("Toolkit must be a regular .tgz file no larger than 32 MiB.");
    }
    const archive = await readFile(tarball);
    toolkitManifest(archive);
    // Exclusive creation also refuses a destination created after the first check.
    await mkdir(destination);
    try {
        for (const [file, content] of Object.entries(template)) {
            const target = path.join(destination, file);
            await mkdir(path.dirname(target), { recursive: true });
            await writeFile(target, content.replaceAll("__CANVAS_NAME__", name).trimStart(), { flag: "wx" });
        }
        await mkdir(path.join(destination, "vendor"));
        // Write the validated bytes, not a second read of a potentially changed source.
        await writeFile(path.join(destination, "vendor/canvas-toolkit.tgz"), archive, { flag: "wx" });
    } catch (error) {
        throw new Error("Scaffold failed; inspect the partial directory before removing or retrying: " + destination, { cause: error });
    }
    return destination;
}

const template = {
    "package.json": String.raw`{
  "name": "__CANVAS_NAME__",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "build": "node scripts/build.mjs",
    "test": "node --test tests/app.test.mjs"
  },
  "dependencies": {
    "@microsoft/canvas-toolkit": "file:vendor/canvas-toolkit.tgz"
  },
  "devDependencies": {
    "esbuild": "0.28.2"
  }
}
`,
    ".gitignore": String.raw`node_modules/
dist/
vendor/*.tgz
*.log
`,
    "src/domain.mjs": String.raw`import { defineActions, empty, int, obj, validate } from "@microsoft/canvas-toolkit/actions";
import { createViewStore } from "@microsoft/canvas-toolkit/state";

export function createDomain() {
    const store = createViewStore({ initial: { count: 0 } });
    const actions = defineActions({
        get_state: {
            description: "Read the shared counter.",
            input: empty(),
            run: () => store.snapshot(),
        },
        increment: {
            description: "Increase the shared counter by 1 to 10, up to 1000.",
            input: obj({ amount: int({ min: 1, max: 10 }) }, { required: ["amount"] }),
            effect: "write",
            run: ({ amount }) => {
                const count = store.model().count + amount;
                validate(int({ min: 0, max: 1000 }), count, "count");
                store.patch({ count });
                return store.snapshot();
            },
        },
        reset: {
            description: "Reset the shared counter to zero.",
            input: empty(),
            effect: "write",
            run: () => {
                store.patch({ count: 0 });
                return store.snapshot();
            },
        },
    });
    return { store, actions };
}
`,
    "src/canvas.mjs": String.raw`import { empty, InputError, validate } from "@microsoft/canvas-toolkit/actions";
import { startCanvasServer } from "@microsoft/canvas-toolkit/server";
import { createDomain } from "./domain.mjs";

export function createApp() {
    const { store, actions } = createDomain();
    const servers = new Map();
    let stopped = false;
    const dispatch = async (name, input) => {
        try {
            return await actions.dispatch(name, input);
        } catch (error) {
            if (error instanceof InputError) error.statusCode = 400;
            throw error;
        }
    };
    const definition = {
        id: "__CANVAS_NAME__",
        displayName: "__CANVAS_NAME__",
        description: "A shared, ephemeral counter controlled by you and the agent.",
        inputSchema: empty(),
        actions: actions.names.map(name => ({
            name,
            description: actions.description(name),
            inputSchema: actions.schema(name),
            handler: ctx => {
                if (stopped || !servers.has(ctx.instanceId)) throw new Error("Open the canvas before invoking actions.");
                return dispatch(name, ctx.input);
            },
        })),
        async open(ctx) {
            validate(empty(), ctx.input ?? {});
            if (stopped) throw new Error("The canvas provider has stopped.");
            let pending = servers.get(ctx.instanceId);
            if (!pending) {
                pending = startCanvasServer({
                    dispatch,
                    model: store.snapshot,
                    subscribe: store.subscribe,
                    maxBody: 4096,
                    assets: [
                        ["", new URL("./web/index.html", import.meta.url)],
                        ["app.js", new URL("./web/app.js", import.meta.url)],
                        ["app.css", new URL("./web/app.css", import.meta.url)],
                    ],
                });
                servers.set(ctx.instanceId, pending);
            }
            try {
                return { title: "__CANVAS_NAME__", url: (await pending).url };
            } catch (error) {
                if (servers.get(ctx.instanceId) === pending) servers.delete(ctx.instanceId);
                throw error;
            }
        },
        async onClose(ctx) {
            const pending = servers.get(ctx.instanceId);
            if (pending) {
                servers.delete(ctx.instanceId);
                await (await pending).close();
            }
        },
    };
    return {
        definition,
        async close() {
            stopped = true;
            const pending = [...servers.values()];
            servers.clear();
            const results = await Promise.allSettled(pending.map(async server => (await server).close()));
            const failures = results.filter(result => result.status === "rejected").map(result => result.reason);
            if (failures.length) throw new AggregateError(failures, "Canvas teardown failed.");
        },
    };
}
`,
    "src/extension.mjs": String.raw`import { CanvasError, createCanvas, joinSession } from "@github/copilot-sdk/extension";
import { createApp } from "./canvas.mjs";

const app = createApp();
let stopping;
function stop(code) {
    stopping ??= app.close().then(() => process.exit(code), error => {
        console.error(error);
        process.exit(1);
    });
}
process.once("SIGTERM", () => stop(0));
process.once("SIGINT", () => stop(0));
process.once("disconnect", () => stop(0));

try {
    await joinSession({
        canvases: [createCanvas({
            ...app.definition,
            actions: app.definition.actions.map(action => ({
                ...action,
                async handler(ctx) {
                    try {
                        return await action.handler(ctx);
                    } catch (error) {
                        throw new CanvasError(error.code ?? "action_failed", error.message);
                    }
                },
            })),
        })],
    });
} catch (error) {
    await app.close();
    throw error;
}
`,
    "src/browser/index.html": String.raw`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>__CANVAS_NAME__</title>
    <link rel="stylesheet" href="./app.css">
    <script type="module" src="./app.js"></script>
</head>
<body class="canvas-ui">
    <main>
        <h1>__CANVAS_NAME__</h1>
        <p>You and the agent share this counter. Provider restart resets it.</p>
        <p class="counter" aria-live="polite">Count: <output id="count">0</output></p>
        <div class="controls">
            <button id="increment" class="primary-button" disabled>Add one</button>
            <button id="reset" class="secondary-button" disabled>Reset</button>
        </div>
        <p id="error" role="alert" hidden></p>
        <p id="connection" role="status">Connecting...</p>
    </main>
</body>
</html>
`,
    "src/browser/app.mjs": String.raw`import "@microsoft/canvas-toolkit/ui/styles.css";
import "./app.css";

const count = document.querySelector("#count");
const errorBox = document.querySelector("#error");
const connection = document.querySelector("#connection");
const increment = document.querySelector("#increment");
const reset = document.querySelector("#reset");
let version = -1;
let busy = false;
let currentCount = 0;

function controls() {
    increment.disabled = busy || version < 0 || currentCount >= 1000;
    reset.disabled = busy || version < 0;
}
function showError(error) {
    errorBox.textContent = error.message;
    errorBox.hidden = false;
}
function render(snapshot) {
    if (snapshot.version < version) return;
    version = snapshot.version;
    currentCount = snapshot.model.count;
    count.textContent = String(currentCount);
    controls();
}
async function request(route, options) {
    const response = await fetch(new URL(route, location.href), options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message ?? "Request failed: " + response.status);
    return result;
}
async function refresh() {
    try {
        render(await request("api/state"));
    } catch (error) {
        showError(error);
    }
}
async function act(name, input) {
    busy = true;
    controls();
    errorBox.hidden = true;
    try {
        render(await request("api/action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, input }),
        }));
    } catch (error) {
        showError(error);
    } finally {
        busy = false;
        controls();
    }
}
increment.addEventListener("click", () => act("increment", { amount: 1 }));
reset.addEventListener("click", () => act("reset", {}));
const events = new EventSource(new URL("events", location.href));
events.addEventListener("change", refresh);
events.onopen = () => { connection.textContent = "Connected"; };
events.onerror = () => { connection.textContent = "Connection lost; reconnecting..."; };
window.addEventListener("pagehide", () => events.close());
await refresh();
`,
    "src/browser/app.css": String.raw`main { max-width: 42rem; margin: 0 auto; padding: 24px; }
h1 { font-size: var(--text-title-large, 26px); line-height: var(--leading-title-large, 32px); }
p { color: var(--canvas-muted); }
.counter { color: var(--canvas-fg); font-size: 24px; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; }
#error { color: var(--canvas-danger); }
`,
    "scripts/build.mjs": String.raw`import { build } from "esbuild";
import { isBuiltin } from "node:module";
import { copyFile, lstat, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
try {
    const stat = await lstat(output);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("dist must be a regular directory.");
} catch (error) {
    if (error.code !== "ENOENT") throw error;
}
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "web"), { recursive: true });
const host = "@github/copilot-sdk/extension";
const common = {
    absWorkingDir: root,
    bundle: true,
    format: "esm",
    metafile: true,
    logLevel: "warning",
    legalComments: "eof",
};
const node = {
    ...common,
    platform: "node",
    target: "node22",
    banner: { js: 'import { createRequire as __createRequire } from "node:module";\nconst require = __createRequire(import.meta.url);' },
};
const results = await Promise.all([
    build({ ...node, entryPoints: ["src/extension.mjs"], outfile: "dist/extension.mjs", external: [host, "./canvas.mjs"] }),
    build({ ...node, entryPoints: ["src/canvas.mjs"], outfile: "dist/canvas.mjs", external: [host] }),
    build({ ...common, platform: "browser", target: "es2022", entryPoints: ["src/browser/app.mjs"], outfile: "dist/web/app.js" }),
]);
for (const [index, result] of results.entries()) {
    for (const artifact of Object.values(result.metafile.outputs)) {
        for (const imported of artifact.imports) {
            if (!imported.external) continue;
            const allowed = index < 2 && (isBuiltin(imported.path)
                || (index === 0 && [host, "./canvas.mjs"].includes(imported.path)));
            if (!allowed) throw new Error("Unexpected runtime dependency: " + imported.path);
        }
    }
}
await copyFile(path.join(root, "src/browser/index.html"), path.join(output, "web/index.html"));
`,
    "tests/app.test.mjs": String.raw`import assert from "node:assert/strict";
import { test } from "node:test";
import { createDomain } from "../src/domain.mjs";
import { createApp } from "../dist/canvas.mjs";

test("strict shared actions and counter bounds", async () => {
    const { actions, store } = createDomain();
    assert.deepEqual(await actions.dispatch("increment", { amount: 2 }), { version: 1, model: { count: 2 } });
    for (const input of [{ amount: 0 }, { amount: 11 }, { amount: "1" }, { amount: 1, extra: true }]) {
        await assert.rejects(actions.dispatch("increment", input), { code: "invalid_input" });
    }
    await assert.rejects(actions.dispatch("unknown", {}), { code: "invalid_input" });
    store.patch({ count: 1000 });
    await assert.rejects(actions.dispatch("increment", { amount: 1 }), { code: "invalid_input" });
    assert.equal(store.model().count, 1000);
    assert.equal((await actions.dispatch("reset", {})).model.count, 0);
});

test("built canvas shares UI/agent state and closes its servers", async t => {
    const app = createApp();
    t.after(() => app.close());
    const ctx = { instanceId: "test-panel", input: {} };
    const [opened, reopened] = await Promise.all([app.definition.open(ctx), app.definition.open(ctx)]);
    assert.equal(opened.url, reopened.url);
    const origin = new URL(opened.url).origin;
    assert.equal(new URL(opened.url).hostname, "127.0.0.1");
    const page = await fetch(opened.url);
    assert.match(page.headers.get("content-security-policy"), /script-src 'self'/);
    assert.match(await page.text(), /app.css/);
    const action = app.definition.actions.find(item => item.name === "increment");
    await action.handler({ ...ctx, input: { amount: 3 } });
    const posted = await fetch(new URL("api/action", opened.url), {
        method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify({ name: "increment", input: { amount: 1 } }),
    });
    assert.equal(posted.status, 200);
    assert.equal((await posted.json()).model.count, 4);
    const other = await app.definition.open({ instanceId: "other-panel", input: {} });
    assert.equal((await (await fetch(new URL("api/state", other.url))).json()).model.count, 4);
    await app.definition.onClose(ctx);
    await assert.rejects(fetch(opened.url));
    await app.definition.onClose(ctx);
    assert.equal((await fetch(other.url)).status, 200);
    await app.close();
    await assert.rejects(fetch(other.url));
    await assert.rejects(app.definition.open(ctx), /stopped/);
});
`,
    "README.md": String.raw`# __CANVAS_NAME__

This is an optional experimental toolkit/build example, not the default canvas
authoring workflow. First invoke the GitHub Copilot app's installed create-canvas
skill through the host skill mechanism. It is the source of truth: follow its
native scaffold and use this example only as a toolkit/build reference during
customization, not as a replacement skeleton. If that skill is unavailable,
report the missing prerequisite; package/build checks are not native activation.

An ephemeral counter shared by the browser and agent in one Copilot provider
process. Browser reload preserves the count; provider restart resets it. All
panels share it. This is a demo, not durable document storage.

## Build

Node >=22 (24 recommended) and the approved toolkit tarball copied into vendor/
are required. Toolkit public distribution is unresolved; this app does not
assume a public npm release. The tarball is private input, ignored by Git.

    npm install
    npm run build
    npm test

Keep the generated package-lock.json; subsequent installs use npm ci. The
relative file dependency keeps builds independent of the scaffolder, plugin,
and toolkit checkout. To transfer the source app privately, include vendor/.
Never commit/publish a private tarball or bundle without distribution approval.

## Use with the host workflow

The installed create-canvas skill owns scope, SDK guidance, native scaffolding,
registration, lifecycle, transport/theming, storage/lifetime, and host verification.
Return to its live workflow for activation; the wiring here is a reference
example and must not override that guidance.

The whole dist/ artifact contains bundled toolkit code and browser assets, with no
runtime npm installation or source checkout dependency. The canvas-capable host
provides @github/copilot-sdk/extension; do not install or bundle that SDK.

This demo exposes get_state with {}, increment with {"amount":1}, and reset
with {}. Its UI buttons call the same validated actions.

There is no watch command or automatic host reload. npm test requires npm run
build first; it covers domain and emitted-server behavior, not real browser
rendering or native-host activation.

## Customize

- src/domain.mjs: strict schemas, shared state, and action handlers.
- src/canvas.mjs: public toolkit server and host-facing declaration.
- src/extension.mjs: host registration and shutdown.
- src/browser/: framework-free UI using public toolkit CSS and host tokens.
- scripts/build.mjs: separate Node/browser bundles and explicit static copies.

New static assets need both a build copy and an allowlisted server route. Do
not relax script CSP or add inline handlers to fix asset-loading mistakes.
The toolkit state helper is not durable persistence; follow the host skill's
storage/lifetime guidance before replacing the demo.
No Azure access, telemetry, prompt forwarding, or cloud mutations are included.
`,
    "AGENTS.md": String.raw`# App development

First invoke the GitHub Copilot app's installed create-canvas skill through the
host skill mechanism (or continue it if already active). It is the source of
truth for canvas apps, including native scaffolding and host verification.
This optional experimental generator supplies a toolkit/build reference only;
do not substitute its skeleton for the live skill's workflow. If the skill is
missing, report the prerequisite and do not claim native activation.

Read README.md. Use Node >=22. After source changes run npm run build and npm test.
UI and agent actions must use the same domain schemas, dispatch, and state.
Preserve loopback/origin/CSP protections and the exact host SDK external.
Keep browser imports free of Node and host SDK code. Preserve all emitted assets.
Do not install/activate without explicit scope; no implicit user/global installs.
No console.log in provider code: stdout belongs to host RPC. Errors go to the
caller, UI, or stderr; do not turn failures into successful results.
Keep package-lock.json. Do not commit private vendor tarballs or generated bundles.
`,
};

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        if (process.argv.slice(2).includes("--help")) {
            process.stdout.write(HELP);
        } else {
            const destination = await scaffold(process.argv.slice(2));
            process.stdout.write("Created " + destination + "\nNext: inspect the app, then run npm install, npm run build, and npm test there.\n");
        }
    } catch (error) {
        process.stderr.write("create-canvas: " + error.message + (error.cause ? "\nCause: " + error.cause.message : "") + "\n");
        process.exitCode = 1;
    }
}
