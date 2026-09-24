import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL(".github/plugin/marketplace.json", root), "utf8"));
const customerDocs = [
  "README.md",
  "docs/plugin-marketplace.md",
  "docs/azure-resources-query/README.md",
  "canvases/azure-functions-hosted-skills/README.md",
  "canvases/azure-resources-query/README.md",
  "canvases/azure-functions-hosted-skills/skills/azure-functions-hosted-skills-canvas/SKILL.md",
  "canvases/azure-functions-hosted-skills/skills/azure-functions-hosted-skills-github-daily-digest/SKILL.md",
];

test("customer installation docs identify the production repository, not public staging", () => {
  for (const path of customerDocs) {
    const content = readFileSync(new URL(path, root), "utf8");
    const owners = [...content.matchAll(/\b([A-Za-z][\w-]*)\/azure-dev-tools\b/gi)]
      .map((match) => match[1].toLowerCase());
    assert.ok(owners.length > 0, `${path}: missing production repository destination`);
    assert.deepEqual([...new Set(owners)], ["microsoft"], `${path}: wrong repository owner`);
  }
});

test("production catalog navigates to three local packages in order and leaves planned entry unlinked", () => {
  const readme = readFileSync(new URL("README.md", root), "utf8");
  const rows = readme.split("\n").filter((line) => line.startsWith("| **"));
  const expected = [
    ["Azure Functions Hosted Skills", "canvases/azure-functions-hosted-skills/"],
    ["Azure Resources Query", "canvases/azure-resources-query/"],
    ["Canvas Toolkit (Canvas Authoring)", "plugins/canvas-authoring/"],
  ];
  assert.equal(rows.length, 4);
  for (const [index, [label, path]] of expected.entries()) {
    assert.ok(rows[index].startsWith(`| **${label}** |`), `catalog order: ${label}`);
    assert.ok(rows[index].includes(`[Production package](${path})`), `${label}: production path`);
    assert.ok(existsSync(new URL(path, root)), `${label}: missing package`);
    const { name, version } = manifest.plugins[index];
    const tagPath = `${name}-v${version.replaceAll(".", "-")}-[0-9a-f]{7,40}/${path.slice(0, -1)}`;
    assert.match(
      readme,
      new RegExp(`https://github\\.com/microsoft/azure-dev-tools/tree/${tagPath}`),
      `${label}: expected a source-qualified private patch tag destination`,
    );
  }
  assert.match(rows[2], /Skill-only plugin; no canvas/);
  assert.equal(rows[3], "| **Azure SRE Agent** | Planned | — | **COMING SOON** |");
  assert.deepEqual(manifest.plugins.map(({ name }) => name), [
    "azure-functions-hosted-skills",
    "azure-resources-query",
    "canvas-authoring",
  ]);
});

test("current builder install and bundled quickstart do not claim an active release hold", () => {
  const readme = readFileSync(new URL("plugins/canvas-authoring/README.md", root), "utf8");
  const quickstart = readFileSync(new URL(
    "plugins/canvas-authoring/skills/create-canvas-app/references/toolkit/quickstart.md", root,
  ), "utf8");
  for (const [path, content] of [["builder README", readme], ["toolkit quickstart", quickstart]]) {
    assert.doesNotMatch(content, /\brelease hold\b|\bunreleased candidate\b/i, path);
    assert.match(content, /microsoft\/azure-dev-tools/, `${path}: private production destination`);
  }
});

test("new canvas patch tags retain production support documentation", () => {
  for (const [name, version] of [
    ["azure-functions-hosted-skills", "0-5-2"],
    ["azure-resources-query", "0-1-2"],
  ]) {
    const tags = execFileSync("git", ["tag", "-l", `${name}-v${version}-*`], {
      cwd: root,
      encoding: "utf8",
    }).trim().split("\n").filter(Boolean);
    if (!tags.length) continue;
    assert.equal(tags.length, 1, `${name}: one new immutable tag required`);
    const taggedDoc = execFileSync("git", [
      "show", `${tags[0]}:docs/azure-resources-query/README.md`,
    ], { cwd: root, encoding: "utf8" });
    assert.match(taggedDoc, /microsoft\/azure-dev-tools/);
    assert.doesNotMatch(taggedDoc, /\bAzure\/azure-dev-tools\b/i);
  }
});
