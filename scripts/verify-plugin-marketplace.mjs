import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const canvasProducts = ["azure-functions-hosted-skills", "azure-resources-query"];
const builderProduct = "canvas-authoring";
const packages = {
  "azure-functions-hosted-skills": {
    path: "canvases/azure-functions-hosted-skills",
    manifest: ".github/plugin/plugin.json",
    skills: [
      "./skills/azure-functions-hosted-skills-canvas/",
      "./skills/azure-functions-hosted-skills-github-daily-digest/",
    ],
    extension: "azure-functions-hosted-skills",
    version: "0.5.1",
    sha: "2bb835480969ebf35f4d414b60c084590efb9ff6",
  },
  "azure-resources-query": {
    path: "canvases/azure-resources-query",
    manifest: ".github/plugin/plugin.json",
    skills: ["./skills/azure-resources-query/"],
    extension: "azure-resources-query",
    version: "0.1.1",
    sha: "be9551d7c65df8e728edb2bcf896a08d5b193269",
  },
  "canvas-authoring": {
    path: "plugins/canvas-authoring",
    manifest: "plugin.json",
    skills: ["./skills/create-canvas-app/"],
    version: "0.1.0",
    sha: "23aa6b19a50aca470c759f04f5c657481f6e2d6a",
    receipt: "docs/canvas-authoring/SHA256SUMS",
    receiptSha256: "c5115fad1923e904a6b7b60caf590536ebbaab196e9e50cc2d84ecb4ceb4abc2",
  },
};
const products = Object.keys(packages);

function git(...args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function requireFile(sha, path) {
  git("cat-file", "-e", `${sha}:${path}`);
}

function fileAt(sha, path) {
  return execFileSync("git", ["show", `${sha}:${path}`], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function packageFiles(sha, path) {
  return git("ls-tree", "-r", "--name-only", sha, "--", path)
    .split("\n").filter(Boolean).map((file) => file.slice(path.length + 1));
}

function releaseTagFor(name, version) {
  const tags = git("tag", "-l", `${name}-v${version.replaceAll(".", "-")}-*`)
    .split("\n").filter(Boolean);
  if (tags.length !== 1) {
    throw new Error(`${name}@${version}: expected exactly one reviewed immutable release tag`);
  }
  return tags[0];
}

export function verifyCombinedReleaseCommits(commits) {
  if (commits.length !== canvasProducts.length || new Set(commits).size !== 1) {
    throw new Error("Canvas release tags must point to the same reviewed production merge commit");
  }
}

export function verifyMarketplace(manifest) {
  if (!manifest.name || !/^[a-z][a-z0-9-]*$/.test(manifest.name)) {
    throw new Error("Marketplace must have a kebab-case name");
  }
  if (manifest.owner?.name !== "Microsoft" || !Array.isArray(manifest.plugins)) {
    throw new Error("Marketplace must have the Microsoft owner and a plugins array");
  }
  const names = manifest.plugins.map(({ name }) => name);
  if (names.length !== products.length || new Set(names).size !== products.length ||
      products.some((name) => !names.includes(name))) {
    throw new Error("Marketplace must contain exactly the two Azure canvas plugins and the skill-only builder");
  }
  if (manifest.plugins.some(({ name, version }) => version !== packages[name].version)) {
    throw new Error("Marketplace versions must match the three reviewed source releases");
  }

  const results = manifest.plugins.map(verifyPlugin);
  if (manifest.name === "azure-dev-tools") {
    const commits = canvasProducts.map((name) =>
      git("rev-parse", `${releaseTagFor(name, packages[name].version)}^{commit}`));
    verifyCombinedReleaseCommits(commits);
    const builderCommit = git("rev-parse", `${releaseTagFor(builderProduct, packages[builderProduct].version)}^{commit}`);
    if (builderCommit === commits[0]) {
      throw new Error("Builder release tag must identify a separate reviewed product commit");
    }
    try {
      git("merge-base", "--is-ancestor", commits[0], builderCommit);
    } catch {
      throw new Error("Builder release commit must descend from the two canvas release commit");
    }
    try {
      git("merge-base", "--is-ancestor", builderCommit, "HEAD");
    } catch {
      throw new Error("Refresh this branch onto the reviewed builder release commit");
    }
  }
  return results;
}

export function verifyTagSource(name, version, tag) {
  const product = packages[name];
  if (!product || version !== product.version || !/^[0-9a-f]{40}$/.test(product.sha)) {
    throw new Error(`${name}@${version}: no independently reviewed source release`);
  }
  const base = `${name}-v${version.replaceAll(".", "-")}-`;
  const suffix = tag.startsWith(base) ? tag.slice(base.length) : "";
  if (!/^[0-9a-f]{7,40}$/.test(suffix) ||
      !product.sha.startsWith(suffix)) {
    throw new Error(`${name}@${version}: tag does not identify the reviewed source commit`);
  }
}

export function verifyPlugin({ source, name, version }) {
  const product = packages[name];
  if (!product || version !== product.version) {
    throw new Error(`${name}: expected a reviewed product and version`);
  }
  const path = product.path;
  if (source !== path) {
    throw new Error(`${name}: source must use its own repo-relative path`);
  }
  const releaseTag = releaseTagFor(name, version);
  verifyTagSource(name, version, releaseTag);
  const revision = "HEAD";
  if (git("rev-parse", `${revision}:${path}`) !==
      git("rev-parse", `${releaseTag}:${path}`)) {
    throw new Error(`${name}@${version}: current package bytes differ from ${releaseTag}`);
  }

  try {
    const packageManifest = JSON.parse(fileAt(revision, `${path}/${product.manifest}`));
    if (packageManifest.name !== name || packageManifest.version !== version) {
      throw new Error("plugin metadata differs from marketplace entry");
    }
    const files = packageFiles(revision, path);
    if (product.extension) {
      requireFile(revision, `${path}/extensions/${product.extension}/extension.mjs`);
      if (packageManifest.extensions !== "./extensions" ||
          !Array.isArray(packageManifest.skills) ||
          packageManifest.skills.length !== product.skills.length ||
          product.skills.some((skill) => !packageManifest.skills.includes(skill))) {
        throw new Error("extension or skills differ from marketplace entry");
      }
    } else if (Object.hasOwn(packageManifest, "extensions") ||
               Object.hasOwn(packageManifest, "canvases") ||
               files.some((file) => /^(extensions|canvases)\//.test(file)) ||
               files.filter((file) => /^skills\/[^/]+\/SKILL\.md$/.test(file)).length !== 1 ||
               (packageManifest.skills !== undefined &&
                (!Array.isArray(packageManifest.skills) ||
                 packageManifest.skills.length !== 1 ||
                 packageManifest.skills[0] !== product.skills[0]))) {
      throw new Error("builder must contain one skill and no extension or canvas");
    }
    for (const skill of product.skills) {
      if (!/^\.\/skills\/[a-z0-9-]+\/$/.test(skill)) {
        throw new Error(`invalid skill path: ${skill}`);
      }
      requireFile(revision, `${path}/${skill.slice(2)}SKILL.md`);
    }
    if (product.receipt) {
      const receipt = fileAt(revision, product.receipt);
      if (createHash("sha256").update(receipt).digest("hex") !== product.receiptSha256) {
        throw new Error("builder production checksum receipt differs from reviewed candidate");
      }
      const entries = receipt.toString("utf8").trimEnd().split("\n").map((line) => {
        const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
        if (!match) throw new Error(`invalid checksum receipt entry: ${line}`);
        return { hash: match[1], file: match[2] };
      });
      if (entries.length !== 26 ||
          new Set(entries.map(({ file }) => file)).size !== files.length ||
          entries.length !== files.length ||
          entries.some(({ file }) => !files.includes(file))) {
        throw new Error("builder checksum receipt must cover exactly the 26 plugin files");
      }
      for (const { hash, file } of entries) {
        if (createHash("sha256").update(fileAt(revision, `${path}/${file}`)).digest("hex") !== hash) {
          throw new Error(`builder file differs from checksum receipt: ${file}`);
        }
      }
    }
  } catch (error) {
    throw new Error(`${name}@${version} (${revision}): ${error.message}`, { cause: error });
  }
  return `${name}@${version} ${releaseTag}`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const path = resolve(process.argv[2] ?? ".github/plugin/marketplace.json");
  try {
    for (const result of verifyMarketplace(JSON.parse(readFileSync(path, "utf8")))) {
      console.log(result);
    }
  } catch (error) {
    console.error(`Marketplace verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}
