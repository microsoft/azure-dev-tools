#!/usr/bin/env node
import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, mkdir, readFile, readdir, realpath, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { gunzipSync } from "node:zlib";

const MINIMUM_TOOLKIT_VERSION = "0.1.0";

const HELP = `Generate toolkit modules/build around a host-owned entry (Node >=22).

For canvas authoring, invoke the GitHub Copilot app's installed create-canvas
skill first. It is the source of truth. At its customization step, pass the
native extension.mjs to this command. The native file is not modified. The copy
in src/extension.mjs is connected with attachToolkit when its single
createCanvas(...) call is recognized; otherwise it is copied unchanged (NOT
CONNECTED). npm run build checks registration, then installs dist/ into the
native extension directory.

Usage:
  node setup-toolkit.mjs --name my-canvas --scaffold /native/my-canvas/extension.mjs \\
    --output /existing/parent/new-app

Options:
  --name             Lowercase kebab-case name, 1-64 characters.
  --scaffold         Host-owned extension.mjs in a directory containing only that file.
  --output           New directory; parent must exist. Never overwritten.
  --toolkit-version  Optional exact published toolkit version; no tags or ranges.
  --toolkit-tarball  Optional trusted local npm-pack archive, including prereleases.
  --template          counter (default) or azure-resource-groups. Azure needs the full installed plugin.
  --help             Show this help without creating files.

No install, login, publication, activation, or global configuration changes.
Every output destination must be new; reruns always refuse, including identical
outputs. All input/collision checks precede writes. No arbitrary source rewriting.
Choose at most one toolkit source. Without one, setup runs
npm view @microsoft/canvas-toolkit@latest version and pins that exact version
(${MINIMUM_TOOLKIT_VERSION} or newer). npm install resolves it later and must succeed before building. Both modes need
the public /build export. Local archives are copied, not linked to their source.

Local development installs (npm run dev:canvas-authoring in the source repo)
add scripts/dev-source.json. Then the local toolkit tarball it names replaces
--toolkit-version or a missing source; an explicit --toolkit-tarball still wins.
Setup prints one "canvas-authoring provenance:" line in every mode.
`;

function isPinnedVersion(version) {
    return typeof version === "string" && version.length <= 128
        && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(version);
}

function parseArgs(args, devSource) {
    const options = {};
    for (let i = 0; i < args.length; i++) {
        const key = args[i];
        if (!["--name", "--scaffold", "--output", "--toolkit-tarball", "--toolkit-version", "--template"].includes(key)) {
            throw new Error("Unknown option: " + key);
        }
        if (Object.hasOwn(options, key)) throw new Error("Duplicate option: " + key);
        const value = args[++i];
        if (!value || value.startsWith("--") || /[\x00-\x1f\x7f]/.test(value)) {
            throw new Error("Expected a non-empty value without control characters for " + key);
        }
        options[key] = value;
    }
    for (const key of ["--name", "--scaffold", "--output"]) {
        if (!options[key]) throw new Error("Required option: " + key);
    }
    if (options["--toolkit-version"] && options["--toolkit-tarball"]) {
        throw new Error("Provide at most one of --toolkit-version or --toolkit-tarball.");
    }
    if (options["--toolkit-version"] && !isPinnedVersion(options["--toolkit-version"])) {
        throw new Error("--toolkit-version requires an exact SemVer version, not a tag, range, URL, or path.");
    }
    return options;
}

// SemVer precedence for release cores; any prerelease sorts below its release.
function atLeast(version, minimum) {
    const parse = value => {
        const [core, prerelease] = value.split("+")[0].split(/-(.*)/s);
        return { core: core.split(".").map(Number), prerelease: prerelease !== undefined };
    };
    const a = parse(version);
    const b = parse(minimum);
    for (let i = 0; i < 3; i++) if (a.core[i] !== b.core[i]) return a.core[i] > b.core[i];
    return !a.prerelease || b.prerelease;
}

async function npmCli(env) {
    const directories = [path.dirname(process.execPath), ...(env.PATH ?? env.Path ?? "").split(path.delimiter)].filter(Boolean);
    const candidates = [env.npm_execpath, ...directories.flatMap(directory => [
        path.join(directory, "node_modules/npm/bin/npm-cli.js"),
        path.resolve(directory, "../lib/node_modules/npm/bin/npm-cli.js"),
        ...(process.platform === "win32" ? [] : [path.join(directory, "npm")]),
    ])].filter(Boolean);
    for (const candidate of candidates) {
        try {
            const cli = await realpath(candidate);
            // Run npm's JavaScript entry with Node, never npm.cmd or a shell.
            if (path.basename(cli) === "npm-cli.js" && (await stat(cli)).isFile()) return cli;
        } catch (error) {
            if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error;
        }
    }
    throw new Error("Cannot locate npm. Pass --toolkit-version or --toolkit-tarball.");
}

// Uses the caller's npm configuration (registry, proxy, CA), like the later npm install.
export async function resolveLatestToolkitVersion({ env = process.env } = {}) {
    let version;
    try {
        const { stdout } = await promisify(execFile)(process.execPath,
            [await npmCli(env), "view", "@microsoft/canvas-toolkit@latest", "version", "--json"],
            { env, timeout: 60_000, maxBuffer: 1024 * 1024 });
        version = JSON.parse(stdout);
    } catch (error) {
        throw new Error("Cannot resolve the latest @microsoft/canvas-toolkit from npm. "
            + "Check npm access, or pass --toolkit-version or --toolkit-tarball.", { cause: error });
    }
    if (!isPinnedVersion(version)) throw new Error("npm returned an invalid @microsoft/canvas-toolkit version: " + JSON.stringify(version));
    if (!atLeast(version, MINIMUM_TOOLKIT_VERSION)) {
        throw new Error("The latest published @microsoft/canvas-toolkit is " + version + ", but this skill needs "
            + MINIMUM_TOOLKIT_VERSION + " or newer. Pass --toolkit-version or --toolkit-tarball.");
    }
    return version;
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
    if (manifest?.name !== "@microsoft/canvas-toolkit" || !isPinnedVersion(manifest.version)) {
        throw new Error("Expected an npm-pack archive of @microsoft/canvas-toolkit with an exact SemVer version.");
    }
    if (!manifest.exports?.["./build"]) {
        throw new Error("This starter requires a toolkit candidate with the public /build export. Supply an updated approved tarball.");
    }
    return manifest;
}

async function optionalJson(url) {
    try {
        return JSON.parse(await readFile(fileURLToPath(url), "utf8"));
    } catch (error) {
        if (error.code === "ENOENT") return undefined;
        throw new Error("Cannot read " + fileURLToPath(url) + ": " + error.message);
    }
}

// Written only by the source repository's dev:canvas-authoring command; never published.
async function readDevSource() {
    const dev = await optionalJson(new URL("./dev-source.json", import.meta.url));
    if (dev === undefined) return undefined;
    if (dev?.mode !== "local-dev" || typeof dev.toolkit?.tarball !== "string" || !path.isAbsolute(dev.toolkit.tarball)) {
        throw new Error("Invalid scripts/dev-source.json; rerun npm run dev:canvas-authoring or remove the local install.");
    }
    return dev;
}

export async function provenance(args, { resolveLatest = resolveLatestToolkitVersion } = {}) {
    const dev = await readDevSource();
    const options = parseArgs(args, dev);
    const plugin = await optionalJson(new URL("../../../plugin.json", import.meta.url));
    const skill = dev
        ? { source: "local-dev", version: plugin?.version ?? "unknown", ...dev.skill }
        : { source: "installed", version: plugin?.version ?? "unknown" };
    let toolkit;
    if (options["--toolkit-tarball"]) {
        toolkit = { source: "tarball", tarball: options["--toolkit-tarball"] };
    } else if (dev) {
        toolkit = { source: "local-dev", tarball: dev.toolkit.tarball };
        if (options["--toolkit-version"]) toolkit.replacedVersion = options["--toolkit-version"];
    } else if (options["--toolkit-version"]) {
        toolkit = { source: "npm", version: options["--toolkit-version"] };
    } else {
        toolkit = { source: "npm", version: await resolveLatest(), resolved: "latest" };
    }
    return { options, skill, toolkit };
}

export function formatProvenance({ skill, toolkit }) {
    const skillText = [skill.source, skill.version, skill.branch, skill.gitSha?.slice(0, 12), skill.dirty ? "dirty" : ""].filter(Boolean).join(" ");
    const toolkitText = [toolkit.source, toolkit.version, toolkit.resolved ? "(" + toolkit.resolved + ")" : "", toolkit.sha256?.slice(0, 12),
        toolkit.replacedVersion ? "(replaced --toolkit-version " + toolkit.replacedVersion + ")" : ""].filter(Boolean).join(" ");
    return "canvas-authoring provenance: skill " + skillText + "; toolkit " + toolkitText + "\n";
}

async function safePath(value) {
    if (value.split(/[/\\]/).some(part => part === "..")) throw new Error("Path must not contain '..' path segments.");
    const absolute = path.resolve(value);
    let current = path.parse(absolute).root;
    for (const part of absolute.slice(current.length).split(path.sep).filter(Boolean)) {
        current = path.join(current, part);
        if ((await lstat(current)).isSymbolicLink()) throw new Error("Symlink paths are not supported: " + current);
    }
    return absolute;
}

export async function scaffold(args, dependencies) {
    return (await scaffoldWithProvenance(args, dependencies)).destination;
}

export async function scaffoldWithProvenance(args, dependencies) {
    const { options: requestedOptions, skill, toolkit } = await provenance(args, dependencies);
    const options = { ...requestedOptions };
    if (toolkit.source === "local-dev") {
        delete options["--toolkit-version"];
        options["--toolkit-tarball"] = toolkit.tarball;
    } else if (toolkit.source === "npm") {
        options["--toolkit-version"] = toolkit.version;
    }
    const name = options["--name"];
    const preset = options["--template"] ?? "counter";
    if (!["counter", "azure-resource-groups"].includes(preset)) throw new Error("Unknown template: " + preset);
    if (name.length > 64 || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)
        || /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(name)) {
        throw new Error("Invalid name: use 1-64 lowercase kebab-case characters, starting with a letter; no device names.");
    }
    const output = options["--output"];
    if (output.split(/[/\\]/).some(part => part === "..")) throw new Error("Output must not contain '..' path segments.");
    const requested = path.resolve(output);
    const parent = await safePath(path.dirname(requested));
    const destination = path.join(parent, path.basename(requested));
    try {
        await lstat(destination);
        throw new Error("Destination already exists; refusing to overwrite: " + destination);
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    const native = await safePath(options["--scaffold"]);
    if (path.basename(native) !== "extension.mjs" || !(await lstat(native)).isFile()) {
        throw new Error("--scaffold must name a regular extension.mjs file.");
    }
    const nativeFiles = await readdir(path.dirname(native));
    if (nativeFiles.length !== 1 || nativeFiles[0] !== "extension.mjs") {
        throw new Error("Scaffold directory must contain only extension.mjs; existing package, lockfile, or customized project is not supported.");
    }
    if ((await lstat(native)).size > 1024 * 1024) throw new Error("Host entry exceeds 1 MiB.");
    const nativeBytes = await readFile(native);
    if (!nativeBytes.length || nativeBytes.includes(0)) throw new Error("Host entry must be non-empty JavaScript text.");
    let archive;
    if (options["--toolkit-tarball"]) {
        const tarball = await safePath(options["--toolkit-tarball"]);
        const stat = await lstat(tarball);
        if (!stat.isFile() || stat.size > 32 * 1024 * 1024 || !tarball.endsWith(".tgz")) {
            throw new Error("Toolkit must be a regular .tgz file no larger than 32 MiB.");
        }
        archive = await readFile(tarball);
        toolkit.version = toolkitManifest(archive).version;
        toolkit.sha256 = createHash("sha256").update(archive).digest("hex");
    }
    const sources = { ...template };
    if (preset === "azure-resource-groups") {
        for (const file of [
            "package.json", "README.md", "src/domain.mjs", "src/canvas.mjs",
            "src/browser/app.mjs", "src/browser/app.css", "src/browser/index.html",
            "scripts/check-entry.mjs",
        ]) {
            const source = await safePath(fileURLToPath(new URL("../templates/azure-resource-groups/" + file, import.meta.url)));
            if (!(await lstat(source)).isFile()) throw new Error("Expected a regular template file: " + file);
            sources[file] = await readFile(source, "utf8");
        }
        const reader = await safePath(fileURLToPath(new URL("../references/toolkit/examples/resource-groups.mjs", import.meta.url)));
        sources["src/resource-groups.mjs"] = await readFile(reader, "utf8");
    }
    const files = new Map(Object.entries(sources).map(([file, content]) => [
        file, Buffer.from(content.replaceAll("__CANVAS_NAME__", name).replaceAll("__CANVAS_TEMPLATE__", preset).trimStart()),
    ]));
    const manifest = JSON.parse(files.get("package.json").toString("utf8"));
    if (options["--toolkit-version"]) manifest.dependencies["@microsoft/canvas-toolkit"] = options["--toolkit-version"];
    manifest.canvasInstallDir = path.dirname(native);
    files.set("package.json", Buffer.from(JSON.stringify(manifest, null, 2) + "\n"));
    const connected = connectEntry(nativeBytes.toString("utf8"));
    files.set("src/extension.mjs", connected ? Buffer.from(connected) : nativeBytes);
    if (archive) files.set("vendor/canvas-toolkit.tgz", archive);
    if (skill.source === "local-dev") {
        files.set("canvas-authoring-provenance.json", Buffer.from(JSON.stringify({ skill, toolkit }, null, 2) + "\n"));
    }
    // Exclusive creation also refuses a destination created after the first check.
    await mkdir(destination);
    try {
        for (const [file, content] of files) {
            const target = path.join(destination, file);
            await mkdir(path.dirname(target), { recursive: true });
            await writeFile(target, content, { flag: "wx" });
        }
    } catch (error) {
        throw new Error("Scaffold failed; inspect the partial directory before removing or retrying: " + destination, { cause: error });
    }
    return { destination, skill, toolkit, connected: Boolean(connected) };
}

// Wrap the single native createCanvas(...) call with attachToolkit. Returns null when the
// entry has another shape; the caller then leaves it unchanged for a manual edit.
export function connectEntry(source) {
    if (source.includes("attachToolkit")) return null;
    const sdkImport = /^import\s*\{[^}]*\bcreateCanvas\b[^}]*\}\s*from\s*["']@github\/copilot-sdk\/extension["'];?[ \t]*$/m.exec(source);
    const calls = [...source.matchAll(/\bcreateCanvas\s*\(/g)];
    if (!sdkImport || calls.length !== 1) return null;
    const open = calls[0].index + calls[0][0].length;
    let depth = 1;
    let index = open;
    while (index < source.length && depth > 0) {
        const char = source[index];
        const next = source[index + 1];
        if (char === "/" && next === "/") index = source.indexOf("\n", index);
        else if (char === "/" && next === "*") index = source.indexOf("*/", index) + 1;
        else if (char === "\"" || char === "'" || char === "`") {
            for (index++; index < source.length && source[index] !== char; index++) {
                if (source[index] === "\\") index++;
                else if (char === "`" && source[index] === "$" && source[index + 1] === "{") return null;
            }
        } else if (char === "(") depth++;
        else if (char === ")") depth--;
        if (index < 0) return null;
        index++;
    }
    if (depth !== 0) return null;
    const close = index - 1;
    const end = sdkImport.index + sdkImport[0].length;
    return source.slice(0, end) + '\nimport { attachToolkit } from "./toolkit.mjs";'
        + source.slice(end, open) + "attachToolkit(" + source.slice(open, close) + ")" + source.slice(close);
}

const template = {
    "package.json": String.raw`{
  "name": "__CANVAS_NAME__",
  "version": "0.1.0",
  "canvasTemplate": "__CANVAS_TEMPLATE__",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "build": "node scripts/build.mjs",
    "check": "node scripts/check.mjs"
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
import { readFile } from "node:fs/promises";
import { startCanvasServer } from "@microsoft/canvas-toolkit/server";
import { canvasUiAssets } from "@microsoft/canvas-toolkit/ui";
import { createDomain } from "./domain.mjs";

const buildInfo = JSON.parse(await readFile(new URL("./build.json", import.meta.url), "utf8"));

export function createApp() {
    const { store, actions } = createDomain();
    const servers = new Map();
    let stopped = false;
    const dispatch = async (name, input) => {
        try {
            return { ...await actions.dispatch(name, input), build: buildInfo };
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
                    model: () => ({ ...store.snapshot(), build: buildInfo }),
                    subscribe: store.subscribe,
                    maxBody: 4096,
                    assets: [
                        ["", new URL("./web/index.html", import.meta.url)],
                        ["app.js", new URL("./web/app.js", import.meta.url)],
                        ["app.css", new URL("./web/app.css", import.meta.url)],
                        ["build.json", new URL("./build.json", import.meta.url)],
                        ...canvasUiAssets,
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
    "src/toolkit.mjs": String.raw`import { CanvasError } from "@github/copilot-sdk/extension";
import { createApp } from "./canvas.mjs";

export const app = createApp();
let attached = false;
export function attachToolkit(native) {
    if (attached) throw new Error("This demo supports one toolkit canvas declaration.");
    if (!native || native.id !== "__CANVAS_NAME__" || typeof native.open !== "function"
        || typeof native.onClose !== "function" || !Array.isArray(native.actions)) {
        throw new Error("Expected the host-owned __CANVAS_NAME__ declaration with actions, open, and onClose.");
    }
    for (const signal of ["SIGTERM", "SIGINT", "disconnect"]) {
        if (process.listenerCount(signal)) {
            throw new Error("Existing " + signal + " handler: custom shutdown ownership requires host-guided integration.");
        }
    }
    attached = true;
    for (const [signal, handler] of shutdownHandlers) process.once(signal, handler);
    return {
        ...native,
        inputSchema: app.definition.inputSchema,
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
        open: ctx => app.definition.open(ctx),
        async onClose(ctx) {
            try {
                await app.definition.onClose(ctx);
            } finally {
                await native.onClose(ctx);
            }
        },
    };
}

let stopping;
function stop(code) {
    stopping ??= app.close().then(() => process.exit(code), error => {
        console.error(error);
        process.exit(1);
    });
}
const shutdownHandlers = new Map([
    ["SIGTERM", () => stop(0)], ["SIGINT", () => stop(0)], ["disconnect", () => stop(0)],
]);
export function assertShutdownOwnership() {
    for (const [signal, handler] of shutdownHandlers) {
        const listeners = process.listeners(signal);
        if (listeners.length !== 1 || listeners[0] !== handler) {
            throw new Error("Conflicting " + signal + " handlers: integrate shutdown ownership explicitly before activation.");
        }
    }
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
    <div id="app"></div>
</body>
</html>
`,
    "src/browser/app.mjs": String.raw`import "@microsoft/canvas-toolkit/ui/styles.css";
import "@microsoft/canvas-toolkit/ui/base.css";
import {
    Button, CanvasFooter, CanvasHeader, CanvasShell, MessageBar, createElement as h, mountCanvasComponent,
} from "@microsoft/canvas-toolkit/ui/dom";
import "./app.css";

let version = -1;
let pending = 0;
let fileBuild;
const view = { count: 0, build: null, ready: false, connection: "Connecting...", error: null };
const run = (name, input) => () => act(name, input);

function App({ count, build, ready, connection, error, stale }) {
    const busy = !ready || pending > 0;
    return h(CanvasShell, {
        className: "counter-shell",
        header: h(CanvasHeader, {
            title: "__CANVAS_NAME__",
            actions: h("span", { className: "ct-actions" },
                h(Button, { id: "reset", appearance: "secondary", disabled: busy, onClick: run("reset", {}) }, "Reset"),
                h(Button, { id: "increment", appearance: "primary", disabled: busy || count >= 1000,
                    onClick: run("increment", { amount: 1 }) }, "Add one")),
        }),
        footer: h(CanvasFooter, { version: h("span", { id: "build" }, build ? "Build " + build.id : "Build loading...") },
            h("span", { id: "connection", role: "status" }, connection),
            h("span", { className: "counter-note" }, "Provider restart resets the count.")),
    }, h("div", { className: "counter-content" },
        stale ? h(MessageBar, { id: "stale", intent: "warning", title: "This canvas was updated." },
            "Ask Copilot to reload extensions, then reopen this canvas.") : null,
        error ? h(MessageBar, { id: "error", intent: "error" }, error.message) : null,
        h("p", { className: "counter-label" }, "You and the agent share this counter."),
        h("output", { id: "count", className: "counter-value", "aria-live": "polite" }, String(count))));
}

const app = mountCanvasComponent(document.getElementById("app"), App, view);
function update(next) {
    Object.assign(view, next);
    app.update({ ...view });
}
function showError(error) { update({ error: { message: error.message } }); }
function render(snapshot) {
    if (snapshot.version < version) return;
    version = snapshot.version;
    const stale = fileBuild && fileBuild.id !== snapshot.build.id;
    update({ count: snapshot.model.count, build: snapshot.build, ready: true,
        error: null, stale: Boolean(stale) });
}
async function request(route, options) {
    const response = await fetch(new URL(route, location.href), options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message ?? "Request failed: " + response.status);
    return result;
}
async function refresh() {
    try { render(await request("api/state")); }
    catch (error) { update({ ready: false }); showError(error); }
}
async function act(name, input) {
    pending++;
    update({ error: null });
    try {
        render(await request("api/action", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, input }),
        }));
    } catch (error) {
        showError(error);
    } finally {
        pending--;
        update({});
    }
}
const events = new EventSource(new URL("events", location.href));
events.addEventListener("change", refresh);
events.onopen = () => update({ connection: "Connected" });
events.onerror = () => update({ ready: false, connection: "Connection lost; reconnecting..." });
window.addEventListener("pagehide", () => { events.close(); app.dispose(); });
try {
    fileBuild = await request("build.json");
    await refresh();
} catch (error) {
    showError(error);
}
`,
    "src/browser/app.css": String.raw`html, body, #app { height: 100%; margin: 0; }
.counter-shell { min-height: 100dvh; }
.counter-shell > .ct-header { padding: 8px 16px; border-bottom: 1px solid var(--canvas-border); }
.counter-shell > .ct-main { flex: 1; min-height: 0; overflow: auto; }
.counter-content { display: grid; gap: 12px; align-content: start; max-width: 42rem; box-sizing: border-box; margin: 0 auto; padding: 24px; }
.counter-label { margin: 0; color: var(--canvas-muted); }
.counter-value { color: var(--canvas-fg); font-size: var(--text-title-large, 26px); line-height: var(--leading-title-large, 32px); }
.counter-note { color: var(--canvas-muted); }
`,
    "scripts/build.mjs": String.raw`import { build } from "esbuild";
import { createHash } from "node:crypto";
import { isBuiltin } from "node:module";
import { copyFile, cp, lstat, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prepareAzureIconAssets, prepareCanvasUiAssets } from "@microsoft/canvas-toolkit/build";

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
const ui = await prepareCanvasUiAssets(output);
await prepareAzureIconAssets(output);
const uiModule = ui.nodeImport.path;
const browserExternals = new Set(Object.values(ui.browserImports));
// Optional native modules that Azure SDK proxy support loads only when installed.
const optionalNative = ["kerberos"];
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
    plugins: [{
        name: "toolkit-asset-module",
        setup(api) {
            api.onResolve({ filter: /^@microsoft\/canvas-toolkit\/ui$/ }, () => ({ path: uiModule, external: true }));
        },
    }],
};
const results = await Promise.all([
    build({ ...node, entryPoints: ["src/extension.mjs"], outfile: "dist/extension.mjs", external: [host, "./toolkit.mjs", ...optionalNative] }),
    build({ ...node, entryPoints: ["src/toolkit.mjs"], outfile: "dist/toolkit.mjs", external: [host, "./canvas.mjs", ...optionalNative] }),
    build({ ...node, entryPoints: ["src/canvas.mjs"], outfile: "dist/canvas.mjs", external: [host, ...optionalNative] }),
    build({
        ...common, platform: "browser", target: "es2022", entryPoints: ["src/browser/app.mjs"], outfile: "dist/web/app.js",
        plugins: [{
            name: "toolkit-browser-assets",
            setup(api) {
                api.onResolve({ filter: /^@microsoft\/canvas-toolkit\/ui\// }, args => {
                    const route = ui.browserImports[args.path];
                    return route ? { path: route, external: true } : undefined;
                });
            },
        }],
    }),
]);
for (const [index, result] of results.entries()) {
    for (const artifact of Object.values(result.metafile.outputs)) {
        for (const imported of artifact.imports) {
            if (!imported.external) continue;
            const allowed = (index === 3 && browserExternals.has(imported.path)) || (index < 3 && (isBuiltin(imported.path)
                || optionalNative.includes(imported.path)
                || (index < 2 && imported.path === host)
                || (index === 0 && imported.path === "./toolkit.mjs")
                || (index === 1 && imported.path === "./canvas.mjs")
                || imported.path === uiModule));
            if (!allowed) throw new Error("Unexpected runtime dependency: " + imported.path);
        }
    }
}
await copyFile(path.join(root, "src/browser/index.html"), path.join(output, "web/index.html"));
async function artifactFiles(directory, prefix = "") {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const relative = prefix + entry.name;
        if (entry.isDirectory()) files.push(...await artifactFiles(path.join(directory, entry.name), relative + "/"));
        else if (entry.isFile()) files.push(relative);
        else throw new Error("Unexpected emitted asset: " + relative);
    }
    return files.sort();
}
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const identity = { name: pkg.name, version: pkg.version, template: pkg.canvasTemplate };
const digest = createHash("sha256").update(JSON.stringify(identity) + "\0");
for (const file of await artifactFiles(output)) {
    digest.update(file + "\0").update(await readFile(path.join(output, file)));
}
await writeFile(path.join(output, "build.json"), JSON.stringify({
    id: digest.digest("hex").slice(0, 12), ...identity,
}) + "\n");
try {
    const { stdout } = await promisify(execFile)(process.execPath, ["scripts/check.mjs"], { cwd: root, timeout: 20000 });
    process.stdout.write(stdout);
} catch (error) {
    throw new Error("Toolkit registration check failed; do not activate dist. Connect the host entry using README.md.\n" + (error.stderr ?? error.message));
}
// Install into the native extension directory recorded by setup, so build is also install.
let installed = "";
if (pkg.canvasInstallDir) {
    const target = pkg.canvasInstallDir;
    const relative = path.relative(root, target);
    if (!path.isAbsolute(target) || !relative.startsWith("..")) throw new Error("canvasInstallDir must be an absolute path outside the project.");
    const entries = await readdir(target);
    if (!entries.includes("extension.mjs")) throw new Error("canvasInstallDir must be the native extension directory with extension.mjs: " + target);
    await cp(output, target, { recursive: true, force: true });
    installed = "Installed dist into " + target + ". ";
}
process.stdout.write("Built dist (build " + JSON.parse(await readFile(path.join(output, "build.json"), "utf8")).id + "). " + installed
    + "Reload the extension provider, then open the canvas; a panel refresh alone does not reload provider code.\n");
`,
    "scripts/host-loader.mjs": String.raw`// Test-only SDK seam. Never part of dist or a substitute for the native host.
export function resolve(specifier, context, nextResolve) {
    if (specifier === "@github/copilot-sdk/extension") {
        return { url: new URL("./host-double.mjs", import.meta.url).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
}
`,
    "scripts/host-double.mjs": String.raw`// Captures actual emitted-entry registration without a native host session.
export const registrations = [];
const constructed = new WeakSet();
export class CanvasError extends Error {
    constructor(code, message) { super(message); this.code = code; }
}
export function createCanvas(definition) {
    constructed.add(definition);
    return definition;
}
export async function joinSession(options) {
    if (!Array.isArray(options?.canvases) || options.canvases.some(canvas => !constructed.has(canvas))) {
        throw new Error("Every registered canvas must be constructed through SDK createCanvas.");
    }
    registrations.push(options);
    return { sessionId: "toolkit-check", workspacePath: process.cwd() };
}
`,
    "scripts/check.mjs": String.raw`import { register } from "node:module";
register("./host-loader.mjs", import.meta.url);
await import("./check-entry.mjs");
`,
    "scripts/check-entry.mjs": String.raw`import assert from "node:assert/strict";
import { registrations } from "./host-double.mjs";
import { app, assertShutdownOwnership } from "../dist/toolkit.mjs";
import { canvasUiAssets } from "../dist/assets/toolkit/ui.mjs";

// Import the emitted HOST entry, not a parallel toolkit test provider.
await import("../dist/extension.mjs");
assertShutdownOwnership();
assert.equal(registrations.length, 1, "Expected one host joinSession registration.");
const canvases = registrations[0].canvases;
assert.equal(canvases?.length, 1, "Expected one canvas in the host registration.");
export const canvas = canvases[0];
assert.equal(canvas.id, "__CANVAS_NAME__");
assert.deepEqual(canvas.actions.map(action => action.name), ["get_state", "increment", "reset"],
    "Host entry is not connected. Import attachToolkit and wrap its native createCanvas declaration.");

const ctx = { sessionId: "toolkit-check", extensionId: "test:__CANVAS_NAME__",
    canvasId: "__CANVAS_NAME__", instanceId: "check-panel", input: {},
    host: { capabilities: { "canvas-renderer": true } } };
const originalOpen = app.definition.open;
const originalClose = app.definition.onClose;
const increment = app.definition.actions.find(action => action.name === "increment");
const originalIncrement = increment.handler;
let openContext;
let closeContext;
let actionContext;
app.definition.open = input => { openContext = input; return originalOpen(input); };
app.definition.onClose = input => { closeContext = input; return originalClose(input); };
increment.handler = input => { actionContext = input; return originalIncrement(input); };
try {
    const invoke = (name, input) => canvas.actions.find(action => action.name === name).handler({ ...ctx, input });
    const { url } = await canvas.open(ctx);
    assert.equal(openContext, ctx, "Host open context was not forwarded intact.");
    assert.equal((await fetch(url)).status, 200);
    for (const [route, [, mime]] of canvasUiAssets) {
        const response = await fetch(new URL(route, url));
        assert.equal(response.status, 200, "Missing toolkit asset: " + route);
        assert.equal(response.headers.get("content-type"), mime, route);
        assert.ok((await response.arrayBuffer()).byteLength > 0, route);
    }
    assert.equal((await invoke("increment", { amount: 2 })).model.count, 2);
    assert.equal(actionContext.host, ctx.host, "Host action context was not forwarded intact.");
    assert.equal(actionContext.instanceId, ctx.instanceId);
    assert.equal((await (await fetch(new URL("api/state", url))).json()).model.count, 2);
    await assert.rejects(invoke("increment", { amount: "1" }), { code: "invalid_input" });
    assert.equal((await invoke("reset", {})).model.count, 0);
    await canvas.onClose(ctx);
    assert.equal(closeContext, ctx, "Host close context was not forwarded intact.");
    await assert.rejects(fetch(url));
    console.log("Toolkit registration ready (test SDK seam, not native-host activation).");
} finally {
    app.definition.open = originalOpen;
    app.definition.onClose = originalClose;
    increment.handler = originalIncrement;
    await app.close();
}
`,
    "README.md": String.raw`# __CANVAS_NAME__

A counter shared by the UI and agent. All panels in one provider share the
count; browser reload keeps it and provider restart resets it.

## Connect the host entry

Setup connects the copied src/extension.mjs when it recognizes the single
native createCanvas(...) call. If setup printed NOT CONNECTED, add:

    import { attachToolkit } from "./toolkit.mjs";

Wrap the existing declaration as createCanvas(attachToolkit(nativeOptions)).
Keep its metadata, full context and surrounding session wiring. The adapter
replaces demo callbacks and runs native close after toolkit cleanup. Customized
callbacks or competing shutdown handlers need explicit integration.
The native extension.mjs is replaced only when npm run build installs dist/.

## Build and install

Use Node.js 22+ (24 recommended) and a toolkit package with /build.

    npm install
    npm run build

Keep package-lock.json and use npm ci for later installs. Local package mode
needs vendor/canvas-toolkit.tgz; do not commit private tarballs.

Build checks the emitted entry using a test SDK adapter; an unused import or
missing connection fails. npm run check repeats that check without rebuilding.
After the check, build copies the whole dist/ directory into canvasInstallDir
(the native extension directory recorded in package.json). Then reload the
provider and open the panel. dist/ contains bundled toolkit code and assets; only
@github/copilot-sdk/extension is host-provided. There is no automatic watch or
reload. A panel refresh does not replace the provider.

Try get_state with {}, increment with {"amount":1}, and reset with {}.
The buttons call those same actions.

## Customize

- src/domain.mjs: validated actions and shared state.
- src/browser/: UI and toolkit styles.
- src/canvas.mjs: toolkit server, assets and canvas behavior.
- src/toolkit.mjs: native adapter and shutdown.
- scripts/build.mjs: Node/browser builds and asset copying.

Keep the generated toolkit asset layout. New app assets need a build copy and
an allowlisted server route. Check images in a real browser as well as controls;
do not relax CSP to fix loading errors. State is temporary, not durable storage.
The counter includes no Azure access, telemetry or prompt forwarding.
`,
    "AGENTS.md": String.raw`# App development

First invoke the GitHub Copilot app's installed create-canvas skill through the
host skill mechanism (or continue it if already active). It is the source of
truth for canvas apps, including native scaffolding and host verification.
Setup connects the copied host entry with attachToolkit when it can. If it printed
NOT CONNECTED, read README.md for the attachToolkit import/wrapper.
Do not replace joinSession or invent a second provider. If the skill is missing,
report the prerequisite and do not claim native activation.

Use Node >=22. After source changes run npm run build (it also installs dist).
UI and agent actions must use the same domain schemas, dispatch, and state.
Preserve loopback/origin/CSP protections and the exact host SDK external.
Keep browser imports free of Node and host SDK code. Preserve all emitted assets.
Build installs only into canvasInstallDir; no other user/global installs.
No console.log in provider code: stdout belongs to host RPC. Errors go to the
caller, UI, or stderr; do not turn failures into successful results.
Keep package-lock.json. Do not commit private vendor tarballs or generated bundles.
`,
};

export async function main(args = process.argv.slice(2)) {
    try {
        if (args.length === 1 && args[0] === "--help") {
            process.stdout.write(HELP);
        } else {
            const { destination, skill, toolkit, connected } = await scaffoldWithProvenance(args);
            process.stdout.write(formatProvenance({ skill, toolkit }));
            process.stdout.write("Created toolkit source app: " + destination + "\n" + (connected
                ? "Connected src/extension.mjs with attachToolkit. Next: npm install, customize, npm run build (also installs dist), reload, open.\n"
                : "NOT CONNECTED: src/extension.mjs is unchanged. Wrap its createCanvas options with attachToolkit (see README.md), then npm install and npm run build.\n"));
        }
    } catch (error) {
        process.stderr.write("setup-toolkit: " + error.message + (error.cause ? "\nCause: " + error.cause.message : "") + "\n");
        process.exitCode = 1;
    }

}

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
