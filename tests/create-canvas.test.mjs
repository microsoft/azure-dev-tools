import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { gunzipSync, gzipSync } from "node:zlib";
import { scaffold } from "../scripts/create-canvas.mjs";
import { npmCommand } from "./npm-command.mjs";

const script = fileURLToPath(new URL("../scripts/create-canvas.mjs", import.meta.url));

// Manifest-only fixture for CLI tests, never used as proof of a working toolkit.
function archive(manifest = { name: "@microsoft/canvas-toolkit", version: "0.1.0" }) {
    const body = Buffer.from(JSON.stringify(manifest));
    const header = Buffer.alloc(512);
    header.write("package/package.json");
    header.write(body.length.toString(8).padStart(11, "0") + "\0", 124);
    header.write("0", 156);
    header.fill(32, 148, 156);
    const checksum = header.reduce((sum, byte) => sum + byte, 0);
    header.write(checksum.toString(8).padStart(6, "0") + "\0 ", 148);
    const padded = Buffer.alloc(Math.ceil(body.length / 512) * 512);
    body.copy(padded);
    return gzipSync(Buffer.concat([header, padded, Buffer.alloc(1024)]));
}

async function fixture(t) {
    const root = await mkdtemp(path.join(tmpdir(), "canvas-cli-test-"));
    t.after(() => rm(root, { recursive: true, force: true }));
    const tarball = path.join(root, "toolkit.tgz");
    await writeFile(tarball, archive());
    const args = (output = path.join(root, "app"), name = "my-canvas") => [
        "--name", name, "--output", output, "--toolkit-tarball", tarball,
    ];
    return { root, tarball, args };
}

async function inventory(root, prefix = "") {
    const result = {};
    for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
        const name = path.join(prefix, entry.name);
        if (entry.isDirectory()) Object.assign(result, await inventory(root, name));
        else result[name] = await readFile(path.join(root, name), "base64");
    }
    return result;
}

test("help runs with only the downloaded file and creates nothing", async t => {
    const { root, args } = await fixture(t);
    const downloaded = path.join(root, "standalone.mjs");
    await writeFile(downloaded, await readFile(script));
    const before = await inventory(root);
    assert.match(execFileSync(process.execPath, [downloaded, "--help"], { cwd: root, encoding: "utf8" }), /No install, login/);
    assert.deepEqual(await inventory(root), before);
    assert.match(execFileSync(process.execPath, [downloaded, ...args()], { cwd: root, encoding: "utf8" }), /Created/);
    assert.equal(JSON.parse(await readFile(path.join(root, "app/package.json"))).name, "my-canvas");
});

test("deterministic portable output and build contract", async t => {
    const { root, tarball, args } = await fixture(t);
    const first = await scaffold(args(path.join(root, "app with spaces")));
    const second = await scaffold(args(path.join(root, "second")));
    assert.deepEqual(await inventory(first), await inventory(second));
    assert.deepEqual(await readFile(path.join(first, "vendor/canvas-toolkit.tgz")), await readFile(tarball));
    const pkg = JSON.parse(await readFile(path.join(first, "package.json")));
    assert.equal(pkg.name, "my-canvas");
    assert.equal(pkg.private, true);
    assert.deepEqual(pkg.dependencies, { "@microsoft/canvas-toolkit": "file:vendor/canvas-toolkit.tgz" });
    assert.equal(pkg.engines.node, ">=22");
    assert.equal(pkg.devDependencies.esbuild, "0.28.2");
    assert.ok(!Object.hasOwn(pkg.dependencies, "@github/copilot-sdk"));
    const files = await inventory(first);
    assert.ok(!Object.hasOwn(files, "package-lock.json"));
    assert.ok(!Object.keys(files).some(file => file.includes("node_modules")));
    for (const file of Object.keys(files).filter(file => file.endsWith(".mjs"))) {
        execFileSync(process.execPath, ["--check", path.join(first, file)]);
    }
    assert.match(await readFile(path.join(first, "scripts/build.mjs"), "utf8"), /external: \[host, "\.\/canvas\.mjs"\]/);
    assert.match(await readFile(path.join(first, "src/browser/app.mjs"), "utf8"), /@microsoft\/canvas-toolkit\/ui\/styles\.css/);
});

test("rejects malformed options and hostile names without creating output", async t => {
    const { root, args } = await fixture(t);
    for (const name of ["../escape", "a/b", "<script>", "x';process.exit()//", "Upper", "-bad", "a--b", "a-", "\u00e9", "a".repeat(65), "con", "nul", "com1"]) {
        await assert.rejects(scaffold(args(path.join(root, "output"), name)), /Invalid name/);
    }
    for (const input of [[], ["--name"], [...args(), "--wat", "x"], [...args(), "--name", "again"],
        ["--name", "ok\nbad", "--output", "x", "--toolkit-tarball", "x"]]) {
        await assert.rejects(scaffold(input));
    }
    assert.deepEqual((await readdir(root)).sort(), ["toolkit.tgz"]);
});

test("refuses existing, symlink, traversal, and missing-parent destinations", async t => {
    const { root, args } = await fixture(t);
    const existing = await scaffold(args());
    const before = await inventory(existing);
    await assert.rejects(scaffold(args()), /already exists/);
    await assert.rejects(scaffold(args(path.join(root, "toolkit.tgz"))), /already exists/);
    await assert.rejects(scaffold(args(root + "/../escape")), /path segments/);
    await assert.rejects(scaffold(args(root + "/bad\npath")), /control characters/);
    await assert.rejects(scaffold(args(path.join(root, "missing", "app"))), { code: "ENOENT" });
    const link = path.join(root, "linked");
    await symlink(existing, link, "dir");
    await assert.rejects(scaffold(args(link)), /already exists/);
    const broken = path.join(root, "broken");
    await symlink(path.join(root, "absent"), broken, "dir");
    await assert.rejects(scaffold(args(broken)), /already exists/);
    assert.deepEqual(await inventory(existing), before);
});

test("rejects invalid or wrong toolkit archives before creating output", async t => {
    const { root, tarball, args } = await fixture(t);
    const badHeader = gunzipSync(archive());
    badHeader[0] ^= 1;
    for (const bytes of [Buffer.from("not gzip"), archive({ name: "different", version: "0.1.0" }),
        archive({ name: "@microsoft/canvas-toolkit", version: "9.0.0" }),
        gzipSync(badHeader), gzipSync(gunzipSync(archive()).subarray(0, 520))]) {
        await writeFile(tarball, bytes);
        await assert.rejects(scaffold(args()));
    }
    assert.deepEqual((await readdir(root)).sort(), ["toolkit.tgz"]);
});

test("refuses symlink toolkit inputs", async t => {
    const { root, tarball, args } = await fixture(t);
    const link = path.join(root, "linked.tgz");
    await symlink(tarball, link);
    const input = args();
    input[input.length - 1] = link;
    await assert.rejects(scaffold(input), /regular .tgz/);
});

test("concurrent scaffolds cannot overwrite one another", async t => {
    const { args } = await fixture(t);
    const results = await Promise.allSettled([scaffold(args()), scaffold(args())]);
    assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
    assert.equal(results.filter(result => result.status === "rejected").length, 1);
});

test("skills-only Agent Plugins manifest and discovery layout", async () => {
    const plugin = new URL("../plugins/canvas-authoring/", import.meta.url);
    const manifest = JSON.parse(await readFile(new URL("plugin.json", plugin)));
    assert.deepEqual(Object.keys(manifest).sort(), ["$schema", "description", "name", "version"]);
    assert.equal(manifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
    assert.equal(manifest.name, "canvas-authoring");
    assert.equal(manifest.version, "0.1.0");
    const skill = await readFile(new URL("skills/create-canvas-app/SKILL.md", plugin), "utf8");
    assert.match(skill, /^---\nname: create-canvas-app\ndescription: .+\n---/);
    assert.doesNotMatch(skill, /curl.+\|\s*(sh|bash|node)/);
});

test("npm launcher uses Node plus CLI JS, including Windows paths with spaces", async t => {
    const { root } = await fixture(t);
    const install = path.join(root, "Node install");
    const cli = path.join(install, "node_modules/npm/bin/npm-cli.js");
    await mkdir(path.dirname(cli), { recursive: true });
    await writeFile(cli, "// npm CLI discovery fixture\n");
    for (const platform of ["win32", "darwin"]) {
        const node = path.join(install, platform === "win32" ? "node.exe" : "node");
        assert.deepEqual(await npmCommand({ node, env: {}, platform }), {
            file: node, args: [await realpath(cli)],
        });
    }
    const node = path.join(root, "separate-node");
    assert.deepEqual(await npmCommand({ node, env: { npm_execpath: cli }, platform: "win32" }), {
        file: node, args: [await realpath(cli)],
    });
    await assert.rejects(npmCommand({ node, env: {}, platform: "win32" }), /Cannot locate npm-cli/);
});
