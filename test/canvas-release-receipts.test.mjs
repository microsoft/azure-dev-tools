import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
function taggedSnapshot(name, version) {
  const tags = execFileSync("git", ["tag", "-l", `${name}-v${version.replaceAll(".", "-")}-*`], {
    cwd: root, encoding: "utf8",
  }).trim().split("\n").filter(Boolean);
  assert.equal(tags.length, 1, `${name}: expected one historical immutable tag`);
  const tag = tags[0];
  return {
    read: (path) => execFileSync("git", ["show", `${tag}:${path}`], { cwd: root }),
    files: (path) => execFileSync("git", ["ls-tree", "-r", "--name-only", tag, "--", path], {
      cwd: root, encoding: "utf8",
    }).trimEnd().split("\n"),
  };
}

const versions = {
  "azure-functions-hosted-skills": "0.5.2",
  "azure-resources-query": "0.1.2",
};

test("canvas-authoring 0.1.1 receipt covers the skill-only package and its toolkit provenance", () => {
  const packagePath = "plugins/canvas-authoring/";
  const snapshot = taggedSnapshot("canvas-authoring", "0.1.1");
  const manifest = JSON.parse(snapshot.read(`${packagePath}plugin.json`));
  assert.equal(manifest.version, "0.1.1");
  if (manifest.skills !== undefined) {
    assert.deepEqual(manifest.skills, ["./skills/create-canvas-app/"]);
  }
  assert.ok(!Object.hasOwn(manifest, "extensions") && !Object.hasOwn(manifest, "canvases"));
  const receipt = "docs/canvas-authoring/SHA256SUMS";
  const entries = snapshot.read(receipt).toString("utf8").trimEnd().split("\n").map((line) => {
    const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
    assert.ok(match, `${receipt}: malformed line`);
    return { hash: match[1], path: `${packagePath}${match[2]}` };
  });
  const files = snapshot.files(packagePath);
  assert.equal(entries.length, 26);
  assert.deepEqual(entries.map(({ path }) => path).sort(), files.sort());
  assert.deepEqual(
    files.filter((path) => /\/skills\/[^/]+\/SKILL\.md$/.test(path)),
    [`${packagePath}skills/create-canvas-app/SKILL.md`],
  );
  for (const { hash, path } of entries) {
    assert.equal(createHash("sha256").update(snapshot.read(path)).digest("hex"), hash, path);
  }
  const toolkitPath = `${packagePath}skills/create-canvas-app/references/toolkit/`;
  const provenance = JSON.parse(snapshot.read(`${toolkitPath}provenance.json`));
  const checksums = provenance.files;
  assert.ok(checksums && typeof checksums === "object", "toolkit provenance checksums missing");
  for (const [name, hash] of Object.entries(checksums)) {
    assert.equal(createHash("sha256").update(snapshot.read(`${toolkitPath}${name}`)).digest("hex"), hash);
  }
});

for (const [name, version] of Object.entries(versions)) {
  test(`${name} ${version} metadata and checksum receipts cover every package file`, () => {
    const packagePath = `canvases/${name}/`;
    const snapshot = taggedSnapshot(name, version);
    const metadata = JSON.parse(snapshot.read(`${packagePath}.github/plugin/plugin.json`));
    const packageJson = JSON.parse(snapshot.read(`${packagePath}package.json`));
    const release = JSON.parse(snapshot.read(`${packagePath}release.json`));
    const checksums = JSON.parse(snapshot.read(`${packagePath}checksums.json`));
    assert.equal(metadata.version, version);
    assert.equal(packageJson.version, version);
    assert.equal(release.version, version);
    if (name === "azure-functions-hosted-skills") {
      assert.equal(
        JSON.parse(snapshot.read(`${packagePath}extensions/${name}/studio-package.json`)).version,
        version,
      );
    }

    const receipt = name === "azure-resources-query"
      ? "docs/azure-resources-query/SHA256SUMS"
      : `${packagePath}SHA256SUMS`;
    const entries = snapshot.read(receipt).toString("utf8").trimEnd().split("\n").map((line) => {
      const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
      assert.ok(match, `${receipt}: malformed line`);
      return { hash: match[1], path: name === "azure-resources-query"
        ? match[2] : `${packagePath}${match[2]}` };
    });
    const files = snapshot.files(packagePath).filter((path) => path !== `${packagePath}SHA256SUMS`);
    assert.deepEqual(entries.map(({ path }) => path).sort(), files.sort());
    assert.deepEqual(
      Object.keys(checksums).sort(),
      [...release.files, "release.json"].sort(),
    );
    for (const { hash, path } of entries) {
      const actual = createHash("sha256").update(snapshot.read(path)).digest("hex");
      assert.equal(actual, hash, `${path}: receipt mismatch`);
      const local = path.slice(packagePath.length);
      if (local in checksums) assert.equal(actual, checksums[local], `${path}: checksums.json mismatch`);
    }
  });
}
