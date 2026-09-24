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
  "canvases/azure-cost-health-check/README.md",
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

test("production catalog matches installable plugins in order and leaves planned entry unlinked", () => {
  const readme = readFileSync(new URL("README.md", root), "utf8");
  const rows = readme.split("\n").filter((line) => line.startsWith("| **"));
  const expected = [
    ["Azure Functions Hosted Skills", "canvases/azure-functions-hosted-skills/", "azure-functions-hosted-skills", "Production package"],
    ["Azure Resources Query", "canvases/azure-resources-query/", "azure-resources-query", "Production package"],
    ["Canvas Toolkit (Canvas Authoring)", "plugins/canvas-authoring/", "canvas-authoring", "Production package"],
    ["Azure Cost Health Check", "canvases/azure-cost-health-check/", "azure-cost-health-check", "Candidate package"],
  ];
  assert.equal(rows.length, expected.length + 1);
  for (const [index, [label, path, name, linkLabel]] of expected.entries()) {
    assert.ok(rows[index].startsWith(`| **${label}** |`), `catalog order: ${label}`);
    assert.ok(rows[index].includes(`[${linkLabel}](${path})`), `${label}: package path`);
    assert.ok(existsSync(new URL(path, root)), `${label}: missing package`);
    assert.equal(manifest.plugins[index].name, name);
    if (index < 3) {
      const { version } = manifest.plugins[index];
      const tagPath = `${name}-v${version.replaceAll(".", "-")}-[0-9a-f]{7,40}/${path.slice(0, -1)}`;
      assert.match(
        readme,
        new RegExp(`https://github\\.com/microsoft/azure-dev-tools/tree/${tagPath}`),
        `${label}: expected a source-qualified private patch tag destination`,
      );
    } else {
      assert.match(rows[index], /Release candidate; immutable tag and App installation pending/);
    }
  }
  assert.match(rows[2], /Skill-only plugin; no canvas/);
  assert.equal(rows[expected.length], "| **Azure SRE Agent** | Planned | — | **COMING SOON** |");
  assert.deepEqual(manifest.plugins.map(({ name }) => name), expected.map(([, , name]) => name));
});

test("Cost Health package uses the reviewed Agent Plugins layout without a false release claim", () => {
  const path = "canvases/azure-cost-health-check/";
  const plugin = JSON.parse(readFileSync(new URL(`${path}.github/plugin/plugin.json`, root)));
  const release = JSON.parse(readFileSync(new URL(`${path}release.json`, root)));
  const readme = readFileSync(new URL(`${path}README.md`, root), "utf8");
  assert.equal(plugin.name, "azure-cost-health-check");
  assert.equal(plugin.version, "0.4.3");
  assert.deepEqual(plugin.skills, ["./skills/azure-cost-health-check/"]);
  assert.equal(plugin.extensions["com.github.copilot"].logo, "assets/preview.png");
  assert.equal(release.plugin.extension.entry,
    "com.github.copilot/extensions/azure-cost-health-check/extension.mjs");
  assert.match(readme, /com\.github\.copilot\/extensions\/azure-cost-health-check/);
  assert.match(readme, /if the .*latest.* tag is\s+available/i);
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

test("Hosted customer guide retains its install, launch, and first-run instructions", () => {
  const readme = readFileSync(new URL("canvases/azure-functions-hosted-skills/README.md", root), "utf8");
  assert.match(readme, /Build and run Hosted Skills in a local Azure Function App/);
  for (const heading of ["Install", "Prerequisites", "First local run", "Invoke an existing Azure Function App"]) {
    assert.ok(readme.includes(`## ${heading}\n`), `Hosted guide missing ${heading}`);
  }
  assert.match(readme, /Open Azure Functions Hosted Skills canvas/);
  assert.match(readme, /https:\/\/github\.com\/microsoft\/azure-dev-tools\/blob\/azure-functions-hosted-skills-latest\/canvases\/azure-functions-hosted-skills\/README\.md/);
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
