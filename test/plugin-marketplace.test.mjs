import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  verifyCombinedReleaseCommits,
  verifyMarketplace,
  verifyPlugin,
  verifyTagSource,
} from "../scripts/verify-plugin-marketplace.mjs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/marketplace.candidate.json", import.meta.url)));

function modified(update) {
  const manifest = structuredClone(fixture);
  update(manifest);
  return manifest;
}

test("requires release tags for full verification, then checks both plugins", () => {
  const tags = fixture.plugins.map(({ name, version }) =>
    execFileSync("git", ["tag", "-l", `${name}-v${version.replaceAll(".", "-")}-*`], {
      encoding: "utf8",
    }).trim());
  if (tags.some((tag) => !tag)) {
    assert.throws(() => verifyMarketplace(fixture), /expected exactly one reviewed immutable release tag/);
    return;
  }
  const results = verifyMarketplace(fixture);
  assert.equal(results.length, 2);
  assert.match(results[0], /azure-functions-hosted-skills@0\.5\.1 azure-functions-hosted-skills-v0-5-1-2bb8354/);
  assert.match(results[1], /azure-resources-query@0\.1\.1 azure-resources-query-v0-1-1-be9551d/);
});

test("rejects missing products and duplicate entries", () => {
  assert.throws(() => verifyMarketplace(modified((m) => m.plugins.pop())), /exactly the two/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[1] = structuredClone(m.plugins[0]);
  })), /exactly the two/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins.push({ name: "unapproved-plugin", version: "1.0.0", source: "canvases/unapproved-plugin" });
  })), /exactly the two/);
});

test("rejects moving refs and sources outside this repository", () => {
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = {
      source: "github", repo: "microsoft/azure-dev-tools",
      ref: "main", path: "canvases/azure-functions-hosted-skills",
    };
  })), /repo-relative path or a full public commit SHA/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = {
      source: "github", repo: "example/not-azure-dev-tools",
      sha: "0".repeat(40), path: "canvases/azure-functions-hosted-skills",
    };
  })), /repo-relative path or a full public commit SHA/);
});

test("rejects mismatched package version, path, or commit", () => {
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].version = "0.5.0";
  })), /exactly one reviewed immutable release tag/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = "canvases/azure-resources-query";
  })), /repo-relative path or a full public commit SHA/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.plugins[0].source = {
      source: "github", repo: "microsoft/azure-dev-tools",
      sha: "0".repeat(40), path: "canvases/azure-functions-hosted-skills",
    };
  })), /azure-functions-hosted-skills@0.5.1/);
});

test("repo-relative source fails closed without a matching real version tag", () => {
  assert.throws(() => verifyPlugin({
    name: "azure-resources-query",
    version: "0.1.0",
    source: "canvases/azure-resources-query",
  }), /exactly one reviewed immutable release tag/);
});

test("target tags must identify each independently reviewed source commit", () => {
  assert.doesNotThrow(() => verifyTagSource(
    "azure-functions-hosted-skills", "0.5.1",
    "azure-functions-hosted-skills-v0-5-1-2bb83548",
  ));
  assert.doesNotThrow(() => verifyTagSource(
    "azure-resources-query", "0.1.1", "azure-resources-query-v0-1-1-be9551d7",
  ));
  assert.throws(() => verifyTagSource(
    "azure-resources-query", "0.1.1", "azure-resources-query-v0-1-1-deadbeef",
  ), /does not identify the reviewed source commit/);
  assert.throws(() => verifyTagSource(
    "azure-resources-query", "0.1.1", "azure-resources-query-v0-1-1-be9",
  ), /does not identify the reviewed source commit/);
  assert.throws(() => verifyMarketplace(modified((m) => {
    m.name = "azure-dev-tools";
    m.plugins[0].version = "0.5.0";
  })), /versions must match/);
});

test("distinct product tags may share exactly one combined public merge commit", () => {
  assert.doesNotThrow(() => verifyCombinedReleaseCommits(["abc", "abc"]));
  assert.throws(() => verifyCombinedReleaseCommits(["abc", "def"]), /same reviewed production merge/);
  assert.throws(() => verifyCombinedReleaseCommits(["abc"]), /same reviewed production merge/);
});
