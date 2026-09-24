import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const verifier = "scripts/verify-plugin-marketplace.mjs";
const products = [
  "canvases/azure-functions-hosted-skills",
  "canvases/azure-resources-query",
  "plugins/canvas-authoring",
];
const pixel = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL/nwAAAABJRU5ErkJggg==",
  "base64",
);

test("legacy tagged receipts stay historical while each product's docs change on main", () => {
  const checkout = mkdtempSync(join(tmpdir(), "marketplace-docs-"));
  const clone = join(checkout, "repo");
  const git = (...args) => execFileSync("git", ["-C", clone, ...args], {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  }).trim();
  const verify = () => execFileSync("node", [realpathSync(join(clone, verifier))], {
    cwd: clone, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    execFileSync("git", ["clone", "--quiet", "--local", "--no-hardlinks", root, clone]);
    copyFileSync(join(root, verifier), join(clone, verifier));
    git("config", "user.name", "Release policy test");
    git("config", "user.email", "release-policy@example.invalid");

    for (const path of products) {
      const readme = join(clone, path, "README.md");
      writeFileSync(readme, `${readFileSync(readme, "utf8")}\nDocumentation-only update.\n`);
      const image = join(clone, path, "docs", "mutable-test.png");
      mkdirSync(join(clone, path, "docs"), { recursive: true });
      writeFileSync(image, pixel);
      git("add", "--", path);
      git("commit", "--quiet", "-m", `Test mutable documentation in ${path}`);
      assert.doesNotThrow(verify, path);

      rmSync(image);
      git("add", "--", path);
      git("commit", "--quiet", "-m", `Test documentation image removal in ${path}`);
      assert.doesNotThrow(verify, path);
    }

    const runtime = join(clone, products[1], "extensions/azure-resources-query/extension.mjs");
    const originalRuntime = readFileSync(runtime);
    writeFileSync(runtime, Buffer.concat([originalRuntime, Buffer.from("\n// Tampered runtime\n")]));
    git("add", "--", products[1]);
    git("commit", "--quiet", "-m", "Test protected runtime tampering");
    assert.notEqual(git("rev-parse", `HEAD:${products[1]}/extensions/azure-resources-query/extension.mjs`),
      git("rev-parse", "azure-resources-query-v0-1-2-8af10f8:canvases/azure-resources-query/extensions/azure-resources-query/extension.mjs"));
    assert.throws(verify, /immutable package files differ from the reviewed release tag/);

    writeFileSync(runtime, originalRuntime);
    const unreviewed = join(clone, products[1], "extensions/azure-resources-query/unreviewed.mjs");
    writeFileSync(unreviewed, "export const unreviewed = true;\n");
    git("add", "--", products[1]);
    git("commit", "--quiet", "-m", "Test protected file addition");
    assert.throws(verify, /immutable package files differ from the reviewed release tag/);

    rmSync(unreviewed);
    const receipt = join(clone, "docs/azure-resources-query/SHA256SUMS");
    writeFileSync(receipt, `${readFileSync(receipt, "utf8")}\n`);
    git("add", "--", products[1], "docs/azure-resources-query/SHA256SUMS");
    git("commit", "--quiet", "-m", "Test historical receipt tampering");
    assert.throws(verify, /current checksum receipt differs from immutable release tag/);
  } finally {
    rmSync(checkout, { recursive: true, force: true });
  }
});
