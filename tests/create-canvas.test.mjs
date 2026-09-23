import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { gunzipSync, gzipSync } from "node:zlib";
import { scaffold } from "../scripts/create-canvas.mjs";
import { npmCommand } from "./npm-command.mjs";
import { hostEntry } from "./host-entry-fixture.mjs";

const script = fileURLToPath(new URL("../plugins/canvas-authoring/skills/create-canvas-app/scripts/setup-toolkit.mjs", import.meta.url));

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
    const root = await realpath(await mkdtemp(path.join(tmpdir(), "canvas-cli-test-")));
    t.after(() => rm(root, { recursive: true, force: true }));
    const tarball = path.join(root, "toolkit.tgz");
    await writeFile(tarball, archive());
    const native = path.join(root, "native/extension.mjs");
    await mkdir(path.dirname(native));
    await writeFile(native, hostEntry("my-canvas"));
    const args = (output = path.join(root, "app"), name = "my-canvas") => [
        "--name", name, "--scaffold", native, "--output", output, "--toolkit-tarball", tarball,
    ];
    return { root, tarball, native, args };
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

test("bundled command runs without source checkout and reports remaining wiring", async t => {
    const { root, args } = await fixture(t);
    const downloaded = path.join(root, "standalone.mjs");
    await writeFile(downloaded, await readFile(script));
    const before = await inventory(root);
    const help = execFileSync(process.execPath, [downloaded, "--help"], { cwd: root, encoding: "utf8" });
    assert.match(help, /No install, login/);
    assert.match(help, /Generate toolkit modules\/build/);
    assert.match(help, /create-canvas\nskill first/);
    assert.deepEqual(await inventory(root), before);
    const result = execFileSync(process.execPath, [downloaded, ...args()], { cwd: root, encoding: "utf8" });
    assert.match(result, /NOT READY.*host entry is unchanged/);
    assert.equal(JSON.parse(await readFile(path.join(root, "app/package.json"))).name, "my-canvas");
});

test("deterministic portable output and build contract", async t => {
    const { root, tarball, native, args } = await fixture(t);
    const first = await scaffold(args(path.join(root, "app with spaces")));
    const second = await scaffold(args(path.join(root, "second")));
    assert.deepEqual(await inventory(first), await inventory(second));
    assert.deepEqual(await readFile(path.join(first, "vendor/canvas-toolkit.tgz")), await readFile(tarball));
    assert.deepEqual(await readFile(path.join(first, "src/extension.mjs")), await readFile(native));
    assert.equal(await readFile(native, "utf8"), hostEntry("my-canvas"));
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
    assert.deepEqual(Object.keys(files).sort(), [
        ".gitignore", "AGENTS.md", "README.md", "package.json", "scripts/build.mjs", "scripts/check-entry.mjs",
        "scripts/check.mjs", "scripts/host-double.mjs", "scripts/host-loader.mjs", "src/browser/app.css",
        "src/browser/app.mjs", "src/browser/index.html", "src/canvas.mjs", "src/domain.mjs",
        "src/extension.mjs", "src/toolkit.mjs", "tests/app.test.mjs", "vendor/canvas-toolkit.tgz",
    ].sort());
    assert.match(await readFile(path.join(first, "src/browser/app.mjs"), "utf8"), /@microsoft\/canvas-toolkit\/ui\/styles\.css/);
    for (const file of ["README.md", "AGENTS.md"]) {
        const guidance = await readFile(path.join(first, file), "utf8");
        assert.match(guidance, /First invoke the GitHub Copilot app's installed create-canvas/);
        assert.match(guidance, /source of\s+truth/);
        assert.match(guidance, /native scaffold/);
        assert.match(guidance, /attachToolkit/);
    }
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
    assert.deepEqual((await readdir(root)).sort(), ["native", "toolkit.tgz"]);
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
    assert.deepEqual((await readdir(root)).sort(), ["native", "toolkit.tgz"]);
});

test("refuses symlink toolkit inputs", async t => {
    const { root, tarball, args } = await fixture(t);
    const link = path.join(root, "linked.tgz");
    await symlink(tarball, link);
    const input = args();
    input[input.length - 1] = link;
    await assert.rejects(scaffold(input), /Symlink paths/);
});

test("all predictable input/config failures leave native source and destination untouched", async t => {
    const { root, native, tarball, args } = await fixture(t);
    for (const name of ["package.json", "package-lock.json", "npm-shrinkwrap.json", "custom.mjs"]) {
        const collision = path.join(path.dirname(native), name);
        await writeFile(collision, "user-owned");
        const before = await inventory(root);
        await assert.rejects(scaffold(args()), /must contain only extension.mjs/);
        assert.deepEqual(await inventory(root), before);
        await rm(collision);
    }
    const existing = path.join(root, "configured");
    await mkdir(existing);
    await writeFile(path.join(existing, "package.json"), '{"private":true}');
    await writeFile(path.join(existing, "package-lock.json"), '{"lockfileVersion":3}');
    const before = await inventory(root);
    await assert.rejects(scaffold(args(existing)), /already exists/);
    assert.deepEqual(await inventory(root), before);
    const invalid = args();
    invalid[3] = tarball;
    await assert.rejects(scaffold(invalid), /regular extension.mjs/);
    assert.deepEqual(await inventory(root), before);
});

test("symlink ancestors and native entry links cannot escape preflight", async t => {
    const { root, native, args } = await fixture(t);
    const link = path.join(root, "linked-parent");
    await symlink(path.dirname(native), link, "dir");
    await assert.rejects(scaffold(args(path.join(link, "new-app"))), /Symlink paths/);
    const linkedInput = args();
    linkedInput[3] = path.join(link, "extension.mjs");
    await assert.rejects(scaffold(linkedInput), /Symlink paths/);
    await rm(link);
    const original = await readFile(native);
    await rm(native);
    const target = path.join(root, "source.mjs");
    await writeFile(target, original);
    await symlink(target, native);
    await assert.rejects(scaffold(args()), /Symlink paths/);
    assert.deepEqual(await readFile(target), original);
    assert.deepEqual((await readdir(root)).sort(), ["native", "source.mjs", "toolkit.tgz"]);
});

test("reruns refuse identical or edited output rather than overwrite any content", async t => {
    const { root, args } = await fixture(t);
    const app = await scaffold(args());
    let before = await inventory(root);
    await assert.rejects(scaffold(args()), /already exists/);
    assert.deepEqual(await inventory(root), before);
    await writeFile(path.join(app, "src/extension.mjs"), "// user change\n");
    before = await inventory(root);
    await assert.rejects(scaffold(args()), /already exists/);
    assert.deepEqual(await inventory(root), before);
});

test("a copied installable plugin owns every resource needed for setup", async t => {
    const { root, args, native } = await fixture(t);
    const installed = path.join(root, "plugin");
    await cp(new URL("../plugins/canvas-authoring/", import.meta.url), installed, { recursive: true });
    const localScript = path.join(installed, "skills/create-canvas-app/scripts/setup-toolkit.mjs");
    execFileSync(process.execPath, [localScript, ...args()], { cwd: installed });
    assert.deepEqual(await readFile(path.join(root, "app/src/extension.mjs")), await readFile(native));
    await rm(installed, { recursive: true });
    assert.ok((await readFile(path.join(root, "app/scripts/build.mjs"), "utf8")).length > 0);
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
    assert.match(manifest.description, /companion.*installed create-canvas skill/);
    const skill = await readFile(new URL("skills/create-canvas-app/SKILL.md", plugin), "utf8");
    assert.match(skill, /^---\nname: create-canvas-app\ndescription: .+\n---/);
    assert.doesNotMatch(skill, /curl.+\|\s*(sh|bash|node)/);
});

test("companion invokes the installed host skill first without a parallel lifecycle", async () => {
    const skill = await readFile(new URL("../plugins/canvas-authoring/skills/create-canvas-app/SKILL.md", import.meta.url), "utf8");
    const body = skill.replace(/^---\n[\s\S]*?\n---\n/, "").trim();
    assert.match(body, /^# Canvas toolkit companion\n\n\*\*First action:\*\* invoke/);
    assert.match(body, /skill\(\{ skill: "create-canvas" \}\)/);
    assert.match(body, /already active/);
    assert.match(body, /source of truth/);
    assert.match(body, /including its \*\*native scaffold step\*\*/);
    assert.match(body, /customization\/build step/);
    assert.match(body, /return to that workflow for verification/);
    assert.match(body, /unavailable, report that the required app skill is missing/);
    assert.match(body, /node scripts\/setup-toolkit\.mjs --name/);
    assert.match(body, /--scaffold \/path\/to\/native/);
    assert.match(body, /Source generation alone is NOT READY/);
    assert.match(body, /attachToolkit/);
    assert.doesNotMatch(body, /extensions_manage|extensions_reload|open_canvas|invoke_canvas_action|joinSession/);
    assert.doesNotMatch(body, /node .*create-canvas\.mjs|\/Users\/|\/Applications\/|\.github\/extensions\//);
});

test("plugin-local references ship independently and contain toolkit-only examples", async t => {
    const { root } = await fixture(t);
    const plugin = path.join(root, "installed-plugin");
    await cp(new URL("../plugins/canvas-authoring/", import.meta.url), plugin, { recursive: true });
    const pluginRoot = await realpath(plugin);
    for (const file of Object.keys(await inventory(plugin)).filter(file => file.endsWith(".md"))) {
        const content = await readFile(path.join(plugin, file), "utf8");
        assert.doesNotMatch(content, /\/Users\/|\/Applications\//);
        for (const [, href] of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
            if (/^(https?:|#)/.test(href)) continue;
            const resolved = await realpath(path.resolve(plugin, path.dirname(file), href.split("#")[0]));
            assert.ok(resolved.startsWith(pluginRoot + path.sep), file + " links outside the installed plugin: " + href);
        }
        for (const [, language, code] of content.matchAll(/```(js|json)\n([\s\S]*?)```/g)) {
            if (language === "json") JSON.parse(code);
            else execFileSync(process.execPath, ["--check", "--input-type=module"], { input: code });
        }
    }
    const reference = await readFile(path.join(plugin, "skills/create-canvas-app/references/toolkit.md"), "utf8");
    for (const exported of ["actions", "state", "server", "ui/styles.css"]) {
        assert.ok(reference.includes("@microsoft/canvas-toolkit/" + exported));
    }
    assert.match(reference, /file:vendor\/canvas-toolkit\.tgz/);
    assert.match(reference, /not\*\* public npm availability/);
    assert.match(reference, /not durable persistence/);
    assert.match(reference, /Azure auth\/subscription helpers are opt-in/);
    assert.match(reference, /@github\/copilot-sdk\/extension` external/);
    assert.doesNotMatch(reference, /extensions_manage|extensions_reload|open_canvas|invoke_canvas_action/);
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
