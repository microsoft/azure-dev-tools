# Kusto Workbench: alternative installation and usage notes

Ask Copilot telemetry questions against Azure Data Explorer or Log Analytics,
then review bounded read-only query evidence in the canvas.

## Install the full plugin

In GitHub Copilot, open **Customize → Plugins** and install **Kusto Workbench**
from the **awesome-copilot** marketplace. If the marketplace is missing, open
**Customize → Plugins → marketplace gear** and add `github/awesome-copilot`
(marketplace ID `awesome-copilot`). The full plugin includes the canvas and its
`kusto-workbench` routing skill.

Fully quit and reopen GitHub Copilot, start a fresh chat, and try:

```text
Open Kusto Workbench
```

Confirm that the canvas opens and the routing skill appears in your host. The
marketplace follows the current public catalog, not an exact version pin.

## Optional: pin the full plugin to an exact release

For a reproducible 0.1.0 full-plugin install after its production tag is
published, use the versioned and source-qualified tag:

```bash
KUSTO_TAG=$(git ls-remote --refs --tags https://github.com/microsoft/azure-dev-tools.git 'refs/tags/kusto-workbench-v0-1-0-*' | awk '{sub(/^refs\/tags\//, "", $2); print $2}')
if [ "$(printf '%s\n' "$KUSTO_TAG" | grep -c '^kusto-workbench-v0-1-0-')" -eq 1 ]; then
  git clone --depth 1 --branch "$KUSTO_TAG" https://github.com/microsoft/azure-dev-tools.git kusto-workbench-plugin &&
    copilot plugin install ./kusto-workbench-plugin/canvases/kusto-workbench
else
  echo "Expected exactly one published Kusto Workbench 0.1.0 tag" >&2
fi
```

If the versioned tag is missing or more than one tag matches, stop and check
the published release tags. The `kusto-workbench-latest` tag can move and does
not pin a version. Fully quit and reopen GitHub Copilot after installation.

## Canvas-only fallback

If the full plugin is unavailable and the production `latest` tag is published,
go to **Customize → Canvases → Install from gist/URL**, paste the
[Kusto Workbench canvas-only URL](https://github.com/microsoft/azure-dev-tools/tree/kusto-workbench-latest/canvases/kusto-workbench/com.github.copilot/extensions/kusto-workbench),
and install. This installs the canvas only, not the routing skill. Fully quit
and reopen GitHub Copilot, then open **Kusto Workbench** from installed canvases.

## Prerequisites

- A canvas-capable GitHub Copilot host and Node 22 or later.
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
  installed and signed in with `az login`.
- Read access to the Azure Data Explorer database or Log Analytics workspace
  that you select.
- Public Azure. Sovereign clouds, Fabric, and MFA-specific clusters are not
  qualified.

Opening the canvas reads cached Azure CLI account metadata. It does not request
an access token or query Azure until you choose a source or run an action that
needs Azure.

## Use and safety

Kusto Workbench accepts read-only KQL. It blocks user-authored management
commands, remote entities, external sources, plugins, callouts, impersonation,
and request-option overrides. Azure permissions and service restrictions still
apply.

Queries have a 30-second deadline, a 1 MiB response limit, one result table,
100 columns, and 500 displayed rows. An extra row marks the result as
truncated. Schema, result rows, credentials, and raw service errors are not
saved.

**Investigations** keep Copilot's answer, charts, and supporting query evidence
together while the panel is open. They remain throwaway unless you explicitly
copy useful KQL into the Query Editor and save the workbook.

Use **Data Sources** to select an Azure Data Explorer cluster and database or a
Log Analytics workspace when prompted. Discovery uses only the explicitly
selected Azure CLI tenant and account scope. You can also enter a known public
cluster URL, workspace resource ID, Data Explorer link, or exact workspace ID.

The optional **Query Editor** keeps query tabs, charts, and transient results
while the panel is open. **Save workbook** writes query, target, and chart
definitions to the session-visible
`files/kusto-workbooks/<documentId>.json` file.

For contributor setup, tests, package checks, and implementation boundaries,
see [development notes](development.md).
