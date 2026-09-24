import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packages = {
  "azure-functions-hosted-skills": {
    path: "canvases/azure-functions-hosted-skills",
    manifest: ".github/plugin/plugin.json",
    skills: [
      "./skills/azure-functions-hosted-skills-canvas/",
      "./skills/azure-functions-hosted-skills-github-daily-digest/",
    ],
    extension: "azure-functions-hosted-skills",
    version: "0.5.2",
    sha: "8af10f8408f69f45fb5137e9b8f5d746f40bc85e",
    receipt: "canvases/azure-functions-hosted-skills/SHA256SUMS",
    receiptSha256: "390ed2a003358a9e9125ec7bf593abaae87e3ff13207a298881b8e997ca76873",
    receiptCount: 48,
  },
  "azure-resources-query": {
    path: "canvases/azure-resources-query",
    manifest: ".github/plugin/plugin.json",
    skills: ["./skills/azure-resources-query/"],
    extension: "azure-resources-query",
    version: "0.1.2",
    sha: "8af10f8408f69f45fb5137e9b8f5d746f40bc85e",
    receipt: "docs/azure-resources-query/SHA256SUMS",
    receiptSha256: "789c6e79c18ebbb988af24b97b63d8ced12267c62623c460a4bc822d0fea68cb",
    receiptPrefix: "canvases/azure-resources-query/",
    receiptCount: 98,
  },
  "canvas-authoring": {
    path: "plugins/canvas-authoring",
    manifest: "plugin.json",
    skills: ["./skills/create-canvas-app/"],
    version: "0.1.1",
    sha: "8af10f8408f69f45fb5137e9b8f5d746f40bc85e",
    receipt: "docs/canvas-authoring/SHA256SUMS",
    receiptSha256: "d66a82894955dcac9ea072143524c718ea49728d3c947224acdb5fa30fe63c02",
    receiptCount: 26,
  },
};
const products = Object.keys(packages);
const previousTags = {
  "azure-functions-hosted-skills-v0-5-1-2bb8354": "cc59516eba4d6eecda9ff7c9f0191fe2117167af",
  "azure-resources-query-v0-1-1-be9551d": "cc59516eba4d6eecda9ff7c9f0191fe2117167af",
  "canvas-authoring-v0-1-0-23aa6b1": "180136488727f011e8001321c29150a005f89fe0",
};

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
  if (commits.length !== products.length || new Set(commits).size !== 1) {
    throw new Error("Combined patch release tags must point to the same reviewed production merge commit");
  }
}

export function verifyPreviousReleaseCommits(commits) {
  if (Object.keys(commits).length !== Object.keys(previousTags).length ||
      Object.entries(previousTags).some(([tag, expected]) => commits[tag] !== expected)) {
    throw new Error("Prior immutable release tags moved or are missing");
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
    const commits = products.map((name) =>
      git("rev-parse", `${releaseTagFor(name, packages[name].version)}^{commit}`));
    verifyCombinedReleaseCommits(commits);
    verifyPreviousReleaseCommits(Object.fromEntries(Object.keys(previousTags).map((tag) =>
      [tag, git("rev-parse", `${tag}^{commit}`)])));
    try {
      git("merge-base", "--is-ancestor", previousTags["canvas-authoring-v0-1-0-23aa6b1"], commits[0]);
    } catch {
      throw new Error("Combined patch release must descend from the prior builder release commit");
    }
    try {
      git("merge-base", "--is-ancestor", commits[0], "HEAD");
    } catch {
      throw new Error("Refresh this branch onto the reviewed combined patch release commit");
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
      if (!receipt.equals(fileAt(releaseTag, product.receipt))) {
        throw new Error("current checksum receipt differs from immutable release tag");
      }
      if (createHash("sha256").update(receipt).digest("hex") !== product.receiptSha256) {
        throw new Error("production checksum receipt differs from reviewed candidate");
      }
      const entries = receipt.toString("utf8").trimEnd().split("\n").map((line) => {
        const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
        if (!match) throw new Error(`invalid checksum receipt entry: ${line}`);
        if (!match[2].startsWith(product.receiptPrefix ?? "")) {
          throw new Error(`invalid checksum receipt path: ${match[2]}`);
        }
        return { hash: match[1], file: match[2].slice((product.receiptPrefix ?? "").length) };
      });
      const expectedFiles = files.filter((file) => file !== "SHA256SUMS");
      if (entries.length !== product.receiptCount ||
          new Set(entries.map(({ file }) => file)).size !== expectedFiles.length ||
          entries.length !== expectedFiles.length ||
          entries.some(({ file }) => !expectedFiles.includes(file))) {
        throw new Error(`checksum receipt must cover exactly the ${product.receiptCount} plugin files`);
      }
      for (const { hash, file } of entries) {
        if (createHash("sha256").update(fileAt(revision, `${path}/${file}`)).digest("hex") !== hash) {
          throw new Error(`plugin file differs from checksum receipt: ${file}`);
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
