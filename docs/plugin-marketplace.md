# Install Azure canvas plugins

## Full-plugin install (primary)

Once this repository's marketplace is approved and published, in GitHub
Copilot App open **Customize → Plugins**, use the gear beside the marketplace
dropdown to add `microsoft/azure-dev-tools`, then select the
`azure-dev-tools` marketplace. Install `azure-functions-hosted-skills` and/or
`azure-resources-query` separately. Access to this repository is required.
Restart Copilot, open the canvas, and verify its companion skills appear.
[GitHub's App guide](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app#adding-plugins)
documents the registration workflow, but **this marketplace's App install has
not yet been verified**.

The equivalent full-plugin CLI commands, after marketplace publication, are:

```shell
copilot plugin marketplace add microsoft/azure-dev-tools
copilot plugin marketplace browse azure-dev-tools
copilot plugin install azure-functions-hosted-skills@azure-dev-tools
copilot plugin install azure-resources-query@azure-dev-tools
copilot plugin list
copilot skill list
```

## Production release gate

The two package exports must match their reviewed public source bytes before
the production PR is approved. The marketplace manifest is a proposed
production catalog until the approved PR is merged and its two immutable
version tags are published. The test fixture in
`test/fixtures/marketplace.candidate.json` exercises the two-product shape;
it is not an installation catalog.

Entries use same-repository `canvases/<product>` paths. This is a **mutable
marketplace channel**, not an immutable pin: later marketplace checkouts
follow the then-current production default branch, and `version` is display
metadata. After merging and publishing the real production immutable release
tags, run
`node --test test/plugin-marketplace.test.mjs` and
`node scripts/verify-plugin-marketplace.mjs`. The validator
requires a unique version tag per product, checks that the current package
tree exactly matches it, checks each tag's source fragment against its
independently reviewed full source SHA, and verifies `plugin.json`, the
extension, and all expected skills (including both Hosted Skills companions).
The two distinct version tags can point to one approved production PR
merge commit; the validator requires both to resolve to that same commit
and the marketplace branch to include it. Build-input provenance remains a
separate release PR review fact; a source-qualified tag name alone does not
prove the build's origin.
**The default validator intentionally fails before real production release
tags exist.** Pre-tag tests with temporary *local-only* tags in a disposable
clone are synthetic candidate qualification, not release verification; never
push those refs or present the result as a published install.

After publication, check the actual GitHub-hosted marketplace with fresh, isolated
`HOME`, `COPILOT_HOME`, and `COPILOT_CACHE_HOME` directories. Confirm that each
installed plugin contains its `extensions/<product>` directory and all
declared skills, and compare installed package bytes to the reviewed immutable
tag; an `install` success message alone is insufficient. In CLI 1.0.84-5, a
local-directory marketplace with a remote SHA-pinned plugin source can report
success while leaving no plugin or skill installed. Do not use a personal
profile for smoke tests or mistake that local test for remote App verification.

## Fallbacks

For a reproducible full-plugin CLI install, check out the exact published
source-qualified production version tag in `microsoft/azure-dev-tools` and
install its local `./canvases/<product>` directory with
`copilot plugin install`. The byte-identical package READMEs retain public
source-repository links; those links do not identify private production tags.
Direct CLI installs currently warn that this form may be deprecated in a
future release.
The separate App **Customize → Canvases → Install from gist/URL** path is a
canvas-only fallback: it installs an extension, not its plugin skills.
