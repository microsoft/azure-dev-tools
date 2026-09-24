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

## Build canvas apps

`canvas-authoring` at `plugins/canvas-authoring/plugin.json` is **skill-only**:
it contains one `create-canvas-app` companion skill and no extension or
canvas. It supplies toolkit setup and counter or read-only Azure resource-group
starters to a canvas-capable GitHub Copilot host that **already provides the
native `create-canvas` skill**. It neither replaces that skill nor installs a
running app. Follow the [builder README](../plugins/canvas-authoring/README.md)
only after the release hold is lifted. A compatible published
`@microsoft/canvas-toolkit` with `@microsoft/canvas-toolkit/build` is also
required. Canonical npmjs.org publishes `0.1.0-preview.2` with that export;
corporate npm mirrors may not yet serve it. The earlier `0.1.0-preview.1`
lacks `/build`. Do not treat a successful plugin install as proof that an app
can build or that native activation was verified.

## Production release gate

The canvas packages must preserve their independently reviewed public source
bytes. The separately reviewed builder comes from approved source merge
`23aa6b19a50aca470c759f04f5c657481f6e2d6a` (export receipt
`332cafd2605df299bd4159655b746baeb75a3e7e0392d473e2bae3d2d5c6a7ab`);
the production builder retains 22/26 source files byte-for-byte. Its four
disclosed documentation/provenance overlays are
`plugins/canvas-authoring/README.md` (release hold and toolkit version),
`skills/create-canvas-app/references/toolkit/README.md` (toolkit pin),
`skills/create-canvas-app/references/toolkit/provenance.json` (matching
README checksum), and `skills/create-canvas-app/references/toolkit/quickstart.md`
(release hold and toolkit version), with the latter three paths relative to
`plugins/canvas-authoring/`. All 26 production plugin bytes are covered by
`docs/canvas-authoring/SHA256SUMS`. The marketplace is a proposed production
catalog until the approved product PRs merge and **all three** immutable
version tags are published. The test fixture in
`test/fixtures/marketplace.candidate.json` exercises the three-product shape,
not an installation catalog.

Entries use same-repository `canvases/<product>` or
`plugins/canvas-authoring` paths. This is a **mutable marketplace channel**,
not an immutable pin: later marketplace checkouts follow the then-current
production default branch, and `version` is display metadata. After merging
the reviewed product PRs and publishing the real production immutable release
tags, run
`node --test test/plugin-marketplace.test.mjs` and
`node scripts/verify-plugin-marketplace.mjs`. The validator
requires one source-qualified immutable version tag per product, checks
each tag's source fragment against its independently reviewed full source
SHA, and checks that HEAD's package tree equals its tag. The two canvas
tags must share their approved two-product merge commit; the builder tag must
point to a **separate descendant** builder release commit included in HEAD.
The canvas checks require their extension and every companion skill
(including both Hosted Skills skills). The builder check requires one skill,
no extension/canvas, and all 26 files matching its pinned production checksum
receipt. Build-input provenance and the documented safety overlays
remain separate release PR review facts; a source-qualified tag name alone
does not prove the build's origin.
**The default validator intentionally fails before real production release
tags exist.** Pre-tag tests with temporary *local-only* tags in a disposable
clone are synthetic candidate qualification, not release verification; never
push those refs or present the result as a published install.
The `production-marketplace-release` pull-request check is always present.
For marketplace, product, verifier, and related release-file changes, it runs
the marketplace tests and then this unmodified strict validator with complete
Git history and fetched tags. An unrelated PR skips checkout and verification
but still reports a successful check; a failed changed-files lookup cannot
skip the gate. Relevant PRs are expected to fail until the approved product
PRs merge and all three real production tags exist; rerun after tag
publication. No candidate manifest or temporary tags satisfy this CI gate.
An administrator must require `production-marketplace-release` on protected
release branches; the workflow alone does not enforce merging policy.

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
