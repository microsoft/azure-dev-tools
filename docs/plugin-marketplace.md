# Install Azure canvas plugins

## Full-plugin install (primary)

Once this repository's marketplace is approved and published, in GitHub
Copilot App open **Customize → Plugins**, use the gear beside the marketplace
dropdown to add `microsoft/azure-dev-tools`, then select the
`azure-dev-tools` marketplace. Install `azure-functions-hosted-skills`,
`azure-resources-query`, or `canvas-authoring` separately **after each
product's release gates pass**. Access to this repository is required.
Restart Copilot and verify the installed skills; open a canvas for the first
two products only. Installation does not automatically display a panel: ask
Copilot **"Open Azure Resources Query"** or **"Open Azure Functions Hosted
Skills"**. The builder entry is skill-only: use the host's native
`create-canvas` workflow instead of expecting a builder canvas.
[GitHub's App guide](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app#adding-plugins)
documents the registration workflow, but **this marketplace's App install has
not yet been verified**.

The equivalent full-plugin CLI commands, after marketplace publication, are:

```shell
copilot plugin marketplace add microsoft/azure-dev-tools
copilot plugin marketplace browse azure-dev-tools
copilot plugin install azure-functions-hosted-skills@azure-dev-tools
copilot plugin install azure-resources-query@azure-dev-tools
copilot plugin install canvas-authoring@azure-dev-tools
copilot plugin list
copilot skill list
```

Use this repository's [production package catalog](../README.md) or the
source-qualified production tag when following install instructions. The
earlier immutable canvas package READMEs retain public
source-distribution links, **not** this repository's
production installation target. Native App installation from this
marketplace has not yet been verified.

## Build canvas apps

`canvas-authoring` at `plugins/canvas-authoring/plugin.json` is **skill-only**:
it contains one `create-canvas-app` companion skill and no extension or
canvas. It supplies toolkit setup and counter or read-only Azure resource-group
starters to a canvas-capable GitHub Copilot host that **already provides the
native `create-canvas` skill**. It neither replaces that skill nor installs a
running app. Follow the [builder README](../plugins/canvas-authoring/README.md)
after its source-qualified production patch tag is published. A compatible
published `@microsoft/canvas-toolkit` with `@microsoft/canvas-toolkit/build`
is also required. Canonical npmjs.org publishes `0.1.0-preview.2` with that
export; corporate npm mirrors may not yet serve it. The earlier `0.1.0-preview.1`
lacks `/build`. Do not treat a successful plugin install as proof that an app
can build or that native activation was verified.

## Production release gate

The canvas patches must match their independently reviewed source exports
and checksum receipts. The original separately reviewed builder came from
approved source merge
`23aa6b19a50aca470c759f04f5c657481f6e2d6a` (export receipt
`332cafd2605df299bd4159655b746baeb75a3e7e0392d473e2bae3d2d5c6a7ab`);
the production builder retains 22/26 source files byte-for-byte. Its four
disclosed documentation/provenance overlays are
`plugins/canvas-authoring/README.md` (release hold and toolkit version),
`skills/create-canvas-app/references/toolkit/README.md` (toolkit pin),
`skills/create-canvas-app/references/toolkit/provenance.json` (matching
README checksum), and `skills/create-canvas-app/references/toolkit/quickstart.md`
(release hold and toolkit version), with the latter three paths relative to
`plugins/canvas-authoring/`. The original product PRs and marketplace
catalog are merged and their immutable tags published. This patch release
replaces the obsolete builder release hold and corrects the canvas packages'
production install destinations using separately reviewed source exports;
its three new immutable tags must not be published before merge. Each
builder version's 26 plugin bytes have their own pinned receipt in
`docs/canvas-authoring/SHA256SUMS`. Native marketplace/App installation
remains unverified. The test fixture in
`test/fixtures/marketplace.candidate.json` exercises the three-product shape,
not an installation catalog.

Entries use same-repository `canvases/<product>` or
`plugins/canvas-authoring` paths. This is a **mutable marketplace channel**,
not an immutable pin: later marketplace checkouts follow the then-current
production default branch, and `version` is display metadata. Run
`node --test test/plugin-marketplace.test.mjs` and
`node scripts/verify-plugin-marketplace.mjs`. The validator
requires one source-qualified immutable version tag per product, checks
each tag's source fragment against its independently reviewed full source
SHA, and checks that HEAD's package tree equals its tag. The three new patch
tags must share the same approved hotfix merge commit, descending from the
original builder release. The original two canvas tags must still identify
the original #6 commit and the original builder tag must still identify its
separate #7 descendant commit.
The canvas checks require their extension and every companion skill
(including both Hosted Skills skills). The builder check requires one skill,
no extension/canvas, and all 26 files matching its pinned production checksum
receipt. Build-input provenance and the documented safety overlays
remain separate release PR review facts; a source-qualified tag name alone
does not prove the build's origin.
**The default validator fails closed without real production release
tags.** Pre-tag tests with temporary *local-only* tags in a disposable
clone are synthetic candidate qualification, not release verification; never
push those refs or present the result as a published install.

After publication, check the actual GitHub-hosted marketplace with fresh, isolated
`HOME`, `COPILOT_HOME`, and `COPILOT_CACHE_HOME` directories. Confirm that each
installed canvas plugin contains its `extensions/<product>` directory and
declared skills; the builder must contain only its companion skill, **not**
an extension. Compare installed package bytes to the reviewed immutable
tag; an `install` success message alone is insufficient. In CLI 1.0.84-5, a
local-directory marketplace with a remote SHA-pinned plugin source can report
success while leaving no plugin or skill installed. Do not use a personal
profile for smoke tests or mistake that local test for remote App verification.

## Fallbacks

For a reproducible full-plugin CLI install, check out the exact published
source-qualified production version tag in `microsoft/azure-dev-tools` and
install its local `./canvases/<product>` or `./plugins/canvas-authoring`
directory with
`copilot plugin install`. The byte-identical package READMEs retain public
source-repository links; those links do not identify private production tags.
Direct CLI installs currently warn that this form may be deprecated in a
future release.
The separate App **Customize → Canvases → Install from gist/URL** path is a
canvas-only fallback for the first two products: it installs an extension,
not its plugin skills, and cannot install the builder.
