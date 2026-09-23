import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { test } from "node:test";
import path from "node:path";
import { promisify } from "node:util";
import { scaffold } from "../scripts/create-canvas.mjs";
import { npmCommand } from "./npm-command.mjs";
import { hostEntry } from "./host-entry-fixture.mjs";

const tarball = process.env.CANVAS_TOOLKIT_TARBALL;
const version = process.env.CANVAS_TOOLKIT_VERSION;
if (tarball && version) throw new Error("Choose CANVAS_TOOLKIT_TARBALL or CANVAS_TOOLKIT_VERSION, not both.");
const exec = promisify(execFile);

test("installed toolkit builds the Azure preset and its focused browser smoke", { skip: !tarball && !version, timeout: 180_000 }, async t => {
    const root = await realpath(await mkdtemp(path.join(tmpdir(), "azure-starter-")));
    t.after(() => rm(root, { recursive: true, force: true }));
    const native = path.join(root, "native/extension.mjs");
    await mkdir(path.dirname(native));
    const original = hostEntry("azure-lesson");
    await writeFile(native, original);
    const source = await scaffold([
        "--name", "azure-lesson", "--scaffold", native,
        "--output", path.join(root, "source"),
        ...(version ? ["--toolkit-version", version] : ["--toolkit-tarball", await realpath(tarball)]),
        "--template", "azure-resource-groups",
    ]);
    assert.equal(await readFile(path.join(source, "src/extension.mjs"), "utf8"), original);
    await writeFile(path.join(source, "src/extension.mjs"), hostEntry("azure-lesson", { connected: true }));
    const npm = await npmCommand();
    const env = { ...process.env };
    delete env.NODE_TEST_CONTEXT;
    for (const args of [["install", "--no-audit", "--no-fund"], ["run", "build"], ["test"]]) {
        const result = await exec(npm.file, [...npm.args, ...args], { cwd: source, env, timeout: 120_000 });
        t.diagnostic(result.stdout.trim());
    }
    const identity = JSON.parse(await readFile(path.join(source, "dist/build.json"), "utf8"));
    assert.equal(identity.name, "azure-lesson");
    assert.equal(identity.template, "azure-resource-groups");
    assert.match(identity.id, /^[a-f0-9]{12}$/);
    assert.equal(await readFile(native, "utf8"), original);
    const browser = await readFile(path.join(source, "dist/web/app.js"), "utf8");
    assert.match(browser, /\.\/canvas-ui\/azure-subscription-picker\.mjs/);
    assert.doesNotMatch(browser, /data:image\/svg\+xml;base64/);
    await t.test("sandboxed browser smoke", { skip: !process.env.CANVAS_BROWSER }, async () => {
        const result = await exec(npm.file, [...npm.args, "run", "smoke"], { cwd: source, env, timeout: 30_000 });
        assert.match(result.stdout, /"passed":true/);
        assert.match(result.stdout, /"data":"synthetic"/);
        t.diagnostic(result.stdout.trim());
    });
});
