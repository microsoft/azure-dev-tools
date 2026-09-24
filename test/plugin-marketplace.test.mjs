import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  verifyCombinedReleaseCommits,
  verifyMarketplace,
  verifyPlugin,
  verifyPreviousReleaseCommits,
  verifyTagSource,
} from "../scripts/verify-plugin-marketplace.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/marketplace.candidate.json", import.meta.url)));

function modified(update) {
  const manifest = structuredClone(fixture);
  update(manifest);
  return manifest;
}

test("requires release tags for full verification, then checks all three plugins", () => {
  const tags = fixture.plugins.map(({ name, version }) =>
    execFileSync("git", ["tag", "-l", `${name}-v${version.replaceAll(".", "-")}-*`], {
      encoding: "utf8",
    }).trim());
  if (tags.some((tag) => !tag)) {
    assert.throws(() => verifyMarketplace(fixture), /expected exactly one reviewed immutable release tag/);
    return;
  }
  const results = verifyMarketplace(fixture);
  assert.equal(results.length, 3);
  assert.match(results[0], /azure-functions-hosted-skills@0\.5\.2 azure-functions-hosted-skills-v0-5-2-/);
  assert.match(results[1], /azure-resources-query@0\.1\.2 azure-resources-query-v0-1-2-/);
  assert.match(results[2], /canvas-authoring@0\.1\.1 canvas-authoring-v0-1-1-/);
});

test("rejects missing products and duplicate entries", () => {
  assert.throws(() => verifyMarketplace(modified((m) => m.plugins.pop())), /exactly the two Azure canvas plugins and the skill-only builder/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[1] = structuredClone(m.plugins[0]);
  })), /exactly the two Azure canvas plugins and the skill-only builder/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins.push({ name: "unapproved-plugin", version: "1.0.0", source: "canvases/unapproved-plugin" });
  })), /exactly the two Azure canvas plugins and the skill-only builder/);
});

test("rejects remote, moving, and cross-product sources", () => {
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = {
      source: "github", repo: "microsoft/azure-dev-tools",
      ref: "main", path: "canvases/azure-functions-hosted-skills",
    };
  })), /own repo-relative path/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = {
      source: "github", repo: "example/not-azure-dev-tools",
      sha: "0".repeat(40), path: "canvases/azure-functions-hosted-skills",
    };
  })), /own repo-relative path/);
  assert.throws(() => verifyPlugin({
    name: "canvas-authoring", version: "0.1.1", source: "canvases/canvas-authoring",
  }), /own repo-relative path/);
});

test("rejects mismatched package versions and paths before checking tags", () => {
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].version = "0.5.1";
  })), /versions must match/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = "canvases/azure-resources-query";
  })), /own repo-relative path/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[2].version = "0.1.0";
  })), /versions must match/);
});

test("unreviewed versions fail before a tag lookup", () => {
  assert.throws(() => verifyPlugin({
    name: "azure-resources-query",
    version: "0.1.0",
    source: "canvases/azure-resources-query",
  }), /expected a reviewed product and version/);
  assert.throws(() => verifyPlugin({
    name: "canvas-authoring",
    version: "0.1.0",
    source: "plugins/canvas-authoring",
  }), /expected a reviewed product and version/);
});

test("target tags must identify the independently reviewed patch source merge", () => {
  for (const [name, version, suffix] of [
    ["azure-functions-hosted-skills", "0.5.2", "8af10f8"],
    ["azure-resources-query", "0.1.2", "8af10f8"],
    ["canvas-authoring", "0.1.1", "8af10f8"],
  ]) {
    assert.doesNotThrow(() => verifyTagSource(
      name, version, `${name}-v${version.replaceAll(".", "-")}-${suffix}`,
    ));
    assert.throws(() => verifyTagSource(
      name, version, `${name}-v${version.replaceAll(".", "-")}-deadbeef`,
    ), /does not identify the reviewed source commit/);
  }
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.name = "azure-dev-tools";
    m.plugins[0].version = "0.5.1";
  })), /versions must match/);
});

test("three patch tags share one new commit and old tags retain exact historical commits", () => {
  assert.doesNotThrow(() => verifyCombinedReleaseCommits(["abc", "abc", "abc"]));
  assert.throws(() => verifyCombinedReleaseCommits(["abc", "abc", "def"]), /same reviewed production merge/);
  assert.throws(() => verifyCombinedReleaseCommits(["abc"]), /same reviewed production merge/);
  assert.throws(() => verifyCombinedReleaseCommits(["abc", "abc"]), /same reviewed production merge/);
  const previous = {
    "azure-functions-hosted-skills-v0-5-1-2bb8354": "cc59516eba4d6eecda9ff7c9f0191fe2117167af",
    "azure-resources-query-v0-1-1-be9551d": "cc59516eba4d6eecda9ff7c9f0191fe2117167af",
    "canvas-authoring-v0-1-0-23aa6b1": "180136488727f011e8001321c29150a005f89fe0",
  };
  assert.doesNotThrow(() => verifyPreviousReleaseCommits(previous));
  assert.throws(() => verifyPreviousReleaseCommits({
    ...previous, "canvas-authoring-v0-1-0-23aa6b1": previous["azure-resources-query-v0-1-1-be9551d"],
  }), /moved or are missing/);
  assert.throws(() => verifyPreviousReleaseCommits({
    ...previous, "canvas-authoring-v0-1-0-23aa6b1": undefined,
  }), /moved or are missing/);
});
