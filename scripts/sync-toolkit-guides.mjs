import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.argv[2]) throw new Error("Pass the approved toolkit package directory (source or installed package).");
const source = await realpath(process.argv[2]);
const destination = fileURLToPath(new URL("../plugins/canvas-authoring/skills/create-canvas-app/references/toolkit/", import.meta.url));
const pkg = JSON.parse(await readFile(path.join(source, "package.json"), "utf8"));
if (pkg.name !== "@microsoft/canvas-toolkit") throw new Error("Expected @microsoft/canvas-toolkit.");
const pending = ["quickstart.md", "README.md", "auth.md", "examples/README.md", "LICENSE"];
const hashes = {};
while (pending.length) {
    const name = pending.shift();
    if (Object.hasOwn(hashes, name)) continue;
    if (!/^(README\.md|auth\.md|quickstart\.md|LICENSE|examples\/|src\/)/.test(name)
        || path.isAbsolute(name) || name.split(path.sep).some(part => part.startsWith("."))) {
        throw new Error("Unexpected documentation dependency: " + name);
    }
    const input = await realpath(path.join(source, name));
    if (!input.startsWith(source + path.sep)) throw new Error("Documentation link escapes the package: " + name);
    const content = await readFile(input);
    await mkdir(path.dirname(path.join(destination, name)), { recursive: true });
    await copyFile(input, path.join(destination, name));
    hashes[name.split(path.sep).join("/")] = createHash("sha256").update(content).digest("hex");
    if (!name.endsWith(".md")) continue;
    const markdown = content.toString("utf8").replace(/```[\s\S]*?```/g, "");
    for (const match of markdown.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
        const target = match[1].split("#")[0];
        if (!target || /^[a-z]+:/i.test(target)) continue;
        pending.push(path.normalize(path.join(path.dirname(name), decodeURIComponent(target))));
    }
}
await writeFile(path.join(destination, "provenance.json"), JSON.stringify({
    package: pkg.name, version: pkg.version, files: hashes,
}, null, 2) + "\n");
console.log("Synced " + Object.keys(hashes).length + " canonical files; edit toolkit sources, not these generated copies.");
