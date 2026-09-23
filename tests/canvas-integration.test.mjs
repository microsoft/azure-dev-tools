import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { register } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { scaffold } from "../scripts/create-canvas.mjs";
import { npmCommand } from "./npm-command.mjs";
import { hostEntry } from "./host-entry-fixture.mjs";

const exec = promisify(execFile);
const tarball = process.env.CANVAS_TOOLKIT_TARBALL;

test("real toolkit install, tests, and relocated runtime artifact", { skip: !tarball, timeout: 180_000 }, async t => {
    const root = await realpath(await mkdtemp(path.join(tmpdir(), "canvas-real-test-")));
    t.after(() => rm(root, { recursive: true, force: true }));
    const native = path.join(root, "native/extension.mjs");
    await mkdir(path.dirname(native));
    await writeFile(native, hostEntry("counter-demo"));
    const source = await scaffold(["--name", "counter-demo", "--scaffold", native, "--output", path.join(root, "source"), "--toolkit-tarball", await realpath(tarball)]);
    const npm = await npmCommand();
    const env = { ...process.env };
    // Nested test runners must report their own failures and TAP output.
    delete env.NODE_TEST_CONTEXT;
    for (const args of [["install", "--no-audit", "--no-fund"], ["ci", "--no-audit", "--no-fund"]]) {
        const result = await exec(npm.file, [...npm.args, ...args], { cwd: source, env, timeout: 120_000 });
        t.diagnostic(result.stdout.trim());
    }
    for (const entry of [hostEntry("counter-demo"), hostEntry("counter-demo", { unusedImport: true }),
        hostEntry("counter-demo", { connected: true }).replace('id: "counter-demo"', 'id: "unexpected"'),
        hostEntry("counter-demo", { connected: true }).replace("createCanvas(attachToolkit(native))", "attachToolkit(native)"),
        hostEntry("counter-demo", { connected: true }).replace("const native = {", 'process.once("SIGINT", () => process.exit(0));\nconst native = {'),
        hostEntry("counter-demo", { connected: true }) + '\nprocess.once("SIGTERM", () => process.exit(0));\n']) {
        await writeFile(path.join(source, "src/extension.mjs"), entry);
        await assert.rejects(exec(npm.file, [...npm.args, "run", "build"], { cwd: source, env, timeout: 30_000 }),
            error => /Toolkit registration check failed/.test(error.stderr));
        assert.equal(await readFile(path.join(source, "src/extension.mjs"), "utf8"), entry);
        assert.equal(await readFile(native, "utf8"), hostEntry("counter-demo"));
    }
    await writeFile(path.join(source, "src/extension.mjs"), hostEntry("counter-demo", { connected: true }));
    for (const args of [["run", "build"], ["run", "check"], ["test"]]) {
        const result = await exec(npm.file, [...npm.args, ...args], { cwd: source, env, timeout: 30_000 });
        t.diagnostic(result.stdout.trim());
        if (args[0] === "test") assert.match(result.stdout, /# pass 2/);
    }
    const lock = JSON.parse(await readFile(path.join(source, "package-lock.json")));
    assert.equal(lock.packages[""].dependencies["@microsoft/canvas-toolkit"], "file:vendor/canvas-toolkit.tgz");
    const artifact = path.join(root, "isolated");
    await cp(path.join(source, "dist"), artifact, { recursive: true });
    const seam = path.join(root, "seam");
    await mkdir(seam);
    for (const file of ["host-loader.mjs", "host-double.mjs"]) {
        await cp(path.join(source, "scripts", file), path.join(seam, file));
    }
    // Remove the app, vendor archive, and node_modules before importing the build.
    await rm(source, { recursive: true });
    register(pathToFileURL(path.join(seam, "host-loader.mjs")));
    await import(pathToFileURL(path.join(artifact, "extension.mjs")));
    const { registrations } = await import(pathToFileURL(path.join(seam, "host-double.mjs")));
    const { app } = await import(pathToFileURL(path.join(artifact, "toolkit.mjs")));
    assert.equal(registrations.length, 1);
    assert.deepEqual(registrations[0].tools, []);
    const definition = registrations[0].canvases[0];
    assert.equal(definition.displayName, "Native title");
    assert.equal(globalThis.nativeSession.sessionId, "toolkit-check");
    t.after(() => app.close());
    const ctx = { instanceId: "isolated-panel", input: {}, host: { capabilities: { "canvas-renderer": true } } };
    await assert.rejects(definition.open({ ...ctx, input: { unexpected: true } }), { code: "invalid_input" });
    const { url } = await definition.open(ctx);
    const origin = new URL(url).origin;
    const invoke = (name, input) => definition.actions.find(action => action.name === name).handler({ ...ctx, input });
    const post = (input, originHeader = origin) => fetch(new URL("api/action", url), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(originHeader ? { Origin: originHeader } : {}) },
        body: JSON.stringify(input),
    });
    for (const asset of ["", "app.js", "app.css", "canvas-ui/azure-subscription-picker.mjs", "canvas-ui/subscription-picker.mjs", "icons/Subscription.svg"]) {
        const response = await fetch(new URL(asset, url));
        assert.equal(response.status, 200);
        assert.match(response.headers.get("content-security-policy"), /script-src 'self'/);
        assert.ok((await response.text()).length > 100);
    }
    assert.equal((await fetch(new URL("not-allowed", url))).status, 404);
    assert.equal((await fetch(origin)).status, 404);
    assert.equal((await post({ name: "increment", input: { amount: 1 } }, "https://example.invalid")).status, 403);
    assert.equal((await post({ name: "increment", input: { amount: 1 } }, "")).status, 403);
    const invalid = await post({ name: "increment", input: { amount: "1" } });
    assert.equal(invalid.status, 400);
    assert.equal((await invalid.json()).error.code, "invalid_input");
    await assert.rejects(invoke("increment", { amount: "1" }), { code: "invalid_input" });
    assert.equal((await post({ name: "get_state", input: { huge: "x".repeat(5000) } })).status, 413);
    assert.equal((await invoke("get_state", {})).model.count, 0);

    const abort = new AbortController();
    const events = await fetch(new URL("events", url), { signal: abort.signal });
    const reader = events.body.getReader();
    assert.match(new TextDecoder().decode((await reader.read()).value), /event: change/);
    await invoke("increment", { amount: 2 });
    assert.match(new TextDecoder().decode((await reader.read()).value), /event: change/);
    abort.abort();

    await t.test("real browser UI, agent synchronization, and CSP", { skip: !process.env.CANVAS_BROWSER }, async () => {
        await browserCheck(process.env.CANVAS_BROWSER, root, url, invoke);
    });
    await definition.onClose(ctx);
    assert.equal(globalThis.nativeCloseContext, ctx);
    await assert.rejects(fetch(url));
    await assert.rejects(invoke("get_state", {}), /Open the canvas/);
});

async function browserCheck(executable, root, url, invoke) {
    const browser = spawn(executable, [
        "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
        "--disable-background-networking", "--disable-extensions",
        "--remote-debugging-port=0", "--user-data-dir=" + path.join(root, "browser-profile"), "about:blank",
    ], { stdio: ["ignore", "ignore", "pipe"] });
    const exited = new Promise(resolve => browser.once("close", resolve));
    let socket;
    try {
        const endpoint = await new Promise((resolve, reject) => {
            let stderr = "";
            const timer = setTimeout(() => reject(new Error("Browser DevTools startup timed out: " + stderr)), 20_000);
            const finish = callback => value => { clearTimeout(timer); callback(value); };
            browser.once("error", finish(reject));
            browser.once("exit", finish(() => reject(new Error("Browser exited before DevTools was ready: " + stderr))));
            browser.stderr.on("data", chunk => {
                stderr = (stderr + chunk).slice(-8000);
                const match = /DevTools listening on (ws:\/\/[^\s]+)/.exec(stderr);
                if (match) finish(resolve)(new URL(match[1]).origin.replace("ws:", "http:"));
            });
        });
        const targets = await (await fetch(endpoint + "/json/list")).json();
        const target = targets.find(item => item.type === "page");
        assert.ok(target, "Chromium has a page target");
        socket = new WebSocket(target.webSocketDebuggerUrl);
        await once(socket, "open", { signal: AbortSignal.timeout(10_000) });
        let sequence = 0;
        const pending = new Map();
        socket.addEventListener("message", event => {
            const message = JSON.parse(event.data);
            const item = pending.get(message.id);
            if (!item) return;
            pending.delete(message.id);
            clearTimeout(item.timer);
            if (message.error) item.reject(new Error(JSON.stringify(message.error)));
            else item.resolve(message.result);
        });
        const send = (method, params = {}) => new Promise((resolve, reject) => {
            const id = ++sequence;
            const timer = setTimeout(() => {
                pending.delete(id);
                reject(new Error("DevTools timeout: " + method));
            }, 10_000);
            pending.set(id, { resolve, reject, timer });
            socket.send(JSON.stringify({ id, method, params }));
        });
        const evaluate = async expression => {
            const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
            if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
            return result.result.value;
        };
        const waitFor = async expression => {
            for (let attempt = 0; attempt < 100; attempt++) {
                if (await evaluate(expression)) return;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            throw new Error("Browser condition timed out: " + expression);
        };
        await send("Page.enable");
        await send("Page.addScriptToEvaluateOnNewDocument", {
            source: "window.violations=[];window.addEventListener('securitypolicyviolation',e=>window.violations.push(e.violatedDirective));",
        });
        await send("Page.navigate", { url });
        await waitFor("document.querySelector('#connection')?.textContent === 'Connected' && !document.querySelector('#increment').disabled");
        assert.equal(await evaluate("document.querySelector('#count').textContent"), "2");
        await evaluate("document.querySelector('#increment').click()");
        await waitFor("document.querySelector('#count').textContent === '3'");
        assert.equal((await invoke("get_state", {})).model.count, 3);
        await invoke("increment", { amount: 4 });
        await waitFor("document.querySelector('#count').textContent === '7'");
        await evaluate("document.querySelector('#reset').click()");
        await waitFor("document.querySelector('#count').textContent === '0'");
        assert.equal((await invoke("get_state", {})).model.count, 0);
        assert.equal(await evaluate("document.querySelector('#error').hidden"), true);
        assert.equal(await evaluate("getComputedStyle(document.querySelector('main')).paddingTop"), "24px");
        assert.notEqual(await evaluate("getComputedStyle(document.querySelector('#increment')).backgroundColor"), "rgba(0, 0, 0, 0)");
        const images = await evaluate(`(async () => {
            const { createAzureSubscriptionPicker } = await import(new URL("canvas-ui/azure-subscription-picker.mjs", location.href));
            const picker = createAzureSubscriptionPicker({
                id: "asset-check", transport: async () => ({ accounts: [] }), onApply: async () => {},
            });
            document.body.append(picker.trigger);
            const images = [...document.querySelectorAll("img")];
            await Promise.all(images.map(image => image.decode()));
            return images.map(image => ({
                loaded: image.complete && image.naturalWidth > 0,
                scoped: new URL(image.src).pathname.startsWith(location.pathname),
            }));
        })()`);
        assert.equal(images.length, 2);
        assert.ok(images.every(image => image.loaded && image.scoped),
            "Generated starter must serve both decoded subscription icons inside its secret prefix.");
        await evaluate("document.documentElement.style.setProperty('--background-color-default','#123456')");
        assert.equal(await evaluate("getComputedStyle(document.body).backgroundColor"), "rgb(18, 52, 86)");
        assert.deepEqual(await evaluate("window.violations"), []);
        await evaluate("const s=document.createElement('script');s.textContent='window.inlineScriptRan=true';document.body.append(s)");
        await waitFor("window.violations.length > 0");
        assert.equal(await evaluate("window.inlineScriptRan === true"), false);
        await send("Page.reload");
        await waitFor("document.querySelector('#connection')?.textContent === 'Connected' && !document.querySelector('#increment').disabled");
        assert.equal(await evaluate("document.querySelector('#count').textContent"), "0");
    } finally {
        socket?.close();
        if (browser.exitCode === null && browser.signalCode === null) browser.kill("SIGTERM");
        const timer = setTimeout(() => browser.kill("SIGKILL"), 5000);
        timer.unref();
        await exited;
        clearTimeout(timer);
    }
}
