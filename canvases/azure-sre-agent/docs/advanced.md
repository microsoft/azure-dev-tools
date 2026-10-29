# Azure SRE Agent: alternative installation and operational notes

Diagnose failing Azure applications with an existing Azure SRE Agent.

The Apps tab is temporarily hidden.

## Read an investigation

Selecting a thread collapses **Threads** to a compact navigation row so messages
and the composer have the available panel space. Open **Threads** to browse again;
**Back to thread** returns without selecting another investigation. Search,
filters, sorting and unsent drafts are retained while browsing and during state
updates. Drafts stay with their agent, subscription and thread when you switch
investigations. On narrow panels the picker and conversation use one pane at a
time; wider panels can show both while the picker is open.

On wide panels, drag the divider or focus it and use Left/Right arrows to resize
the list. Home and End use its limits; Shift plus an arrow makes a larger step.
The investigation keeps a readable minimum width.

Use the toggle beside **Threads** to hide the list. Move away from the toggle,
then hover or focus it to preview the list over the investigation without
moving the detail. Moving both pointer and focus outside closes the preview;
click the toggle to keep the list open. A pinned wide list stays open when you
select another thread. On narrow panels, **All threads** returns to the list;
selecting a thread or **Back to thread** returns to its content with its draft intact.

Thread navigation, footer wrapping and state changes recalculate the available
conversation height. Short windows retain a readable transcript minimum; narrow
panels keep thread facts compact and expose the full Copilot chat title on hover.

Use **Write a message** in the selected investigation's header to scroll to and
focus its existing message editor. The editor stays below the timeline as you
scroll back to the investigation. Navigation keeps your unsent text and selection;
it does not send the draft. The button is hidden without a selected investigation
and disabled while the editor is unavailable or read-only.

Opening a thread does not connect it to Copilot chat, send a message or authorize
an execution. Those actions keep their existing separate controls and permission checks.

### Search and filter

Open **Threads**, choose **Search Threads**, and type a title fragment such as
`checkout`. Matching loaded rows update immediately. **Clear** removes the search
without resetting filters. External agents also offer **Search agent**, an
explicit request for the latest 25 title matches.

**Filter** opens status, thread-type, and reported-source choices. **Complete**
requires observed completion; a finished reply or missing status does not qualify.
Sources come only from reported source/origin fields, not inferred provider names.
**Reset filters** clears those three choices, retaining search and sorting.
Escape closes Filter and returns focus to its button.

Even when no rows match, the selected investigation remains open with its evidence,
scroll position, connected chat, pending approvals, and unsent draft. Use
**Back to thread** on a narrow panel to compare the detail before and after.

## Review selected-agent approvals

Select the SRE Agent, then open **Approvals** to review execution gates across
its waiting threads without switching investigations. **Load more** checks
additional listed queue threads. Counts distinguish visible execution gates,
listed threads and the historical lower bound observed during this session.
Incomplete scans, failed detail reads and unsupported approval types stay
visible; they do not prove there are no further approvals.

**Review command** shows the exact command and scope before a separate action.
Execution actions are disabled unless the provider was started with
`ALLOW_WRITES=true`. An enabled action still requires native confirmation,
then fresh queue, complete raw thread, exact command and current caller checks
before one authorization or cancellation POST. A changed selection, command or
caller requires another review. Caller verification uses the selected
subscription, tenant and fresh Entra user, not a cached identity or default
subscription. An unavailable identity refuses the action. A submission receipt
does not prove the investigation resumed. Connector consent, durable access,
Teams publishing and evidence sharing remain separate.

In a canvas-capable host, `scan_approvals` provides a bounded, read-only summary
and gate handles. `review_execution_approval` returns the exact command for one
gate; neither action authorizes it. Legacy `list_execution_gates` still describes
the current investigation rather than the selected-agent inbox.

## Stay in standalone Copilot CLI

This extension registers `sre_personal_*` tools separately from its canvas.
Use those native tools for personal diagnostics, queries, Teams and evidence,
including in canvas-capable hosts; they are not `invoke_canvas_action` actions.
The panel's Private Connectors and query controls use their own HTTP routes.
In a compatible standalone Copilot CLI extension runtime, Copilot can invoke
them directly without Azure MCP. Start with `sre_personal_get_diagnostics_context`;
personal source setup, query preparation and bounded reads use the same
conversation-bound tools and native permissions as the app. Do not execute an
unprepared draft or bypass a declined confirmation.

The terminal has no visual panel, inline query buttons or app editor.
Without a canvas renderer, `open_canvas`, `invoke_canvas_action` and `ask_agent`
are not offered. Selecting an SRE Agent, connecting its investigation and
canvas-based SRE actions require a canvas-capable host; app connections do not
transfer to a CLI conversation. Personal tools are not standalone SRE thread
read/send tools. Registered-provider execution also needs the host's actual
native execute capability; an older SDK without it fails explicitly.

Isolated native testing used Copilot CLI 1.0.91 and the installed SDK over
stdio. Headless sessions registered the personal tools and refused missing
`open_canvas`; renderer-capable sessions exercised approved synthetic
context/source callbacks and rejected unprepared reads and unapproved writes.
The configured model was `qualification-no-model`, with zero model requests.
This proves runtime registration and those callbacks, not a particular model's
tool selection, real Azure queries, provider consent or Teams delivery.

For SRE thread operations without a renderer, the separate official
[Azure MCP Server CLI setup](https://learn.microsoft.com/azure/developer/azure-mcp-server/how-to/github-copilot-cli)
is an option, not a prerequisite for personal tools: start `copilot`, run `/mcp add`, and configure the documented local
server `npx -y @azure/mcp@latest server start`. Run `/mcp show`, then ask:

```text
Show details for SRE Agent <agent> in resource group <group> and subscription <subscription>.
Get thread <thread-id> on that SRE Agent.
```

When you intend a write, ask **Send the message "Summarize the current
investigation" to that thread** and review the host confirmation. The
[official SRE tools](https://learn.microsoft.com/azure/developer/azure-mcp-server/tools/azure-sre-agent)
provide thread reads and message sends, not this canvas's conversation connection.
Supply the target agent/subscription/thread in your CLI conversation; an app
selection or connected investigation does not transfer to it. Setup does not require
automatic approvals or yolo mode.

## Install the full plugin

In GitHub Copilot, open **Customize → Plugins** and install **Azure SRE Agent**
from the **awesome-copilot** marketplace. If the marketplace is missing, open
**Customize → Plugins → marketplace gear** and add `github/awesome-copilot`
(marketplace ID `awesome-copilot`). The full plugin includes both the canvas and its
`azure-sre-agent-canvas` routing skill.

Fully quit and reopen GitHub Copilot, start a fresh chat, and try this exact
prompt:

```text
Open SRE Agent Canvas
```

Confirm the canvas opens and the routing skill appears in your host; a
marketplace listing alone does not prove App registration or prompt routing.
The marketplace follows the current public catalog, not an exact version pin.
If the plugin is not listed, use a published versioned tag for the full plugin
below, or the canvas-only fallback at the end.

## Optional: pin the full plugin to an exact release

For a reproducible 0.2.7 full-plugin install after its production tag is
published, use the versioned and source-qualified tag. In a terminal with Git
and Copilot CLI, run:

```bash
SRE_TAG=$(git ls-remote --refs --tags https://github.com/microsoft/azure-dev-tools.git 'refs/tags/azure-sre-agent-v0-2-7-*' | awk '{sub(/^refs\/tags\//, "", $2); print $2}')
if [ "$(printf '%s\n' "$SRE_TAG" | grep -c '^azure-sre-agent-v0-2-7-')" -eq 1 ]; then
  git clone --depth 1 --branch "$SRE_TAG" https://github.com/microsoft/azure-dev-tools.git azure-sre-agent-plugin &&
    copilot plugin install ./azure-sre-agent-plugin/canvases/azure-sre-agent
else
  echo "Expected exactly one published SRE 0.2.7 tag" >&2
fi
```

If the versioned tag has not been published or more than one matches, stop
and check the published release tags. The `azure-sre-agent-latest` tag can
move and does not pin a version. This checkout includes the canvas and routing
skill without relying on the current marketplace listing. Fully quit and
reopen GitHub Copilot, start a fresh chat, and retry the prompt above. If
your host does not expose CLI-installed plugins, check its plugin status.
The CLI currently warns that local-path plugin installation may be
deprecated in a future version.

## Canvas-only fallback

If the full plugin is unavailable and the production `latest` tag is published,
go to **Customize → Canvases → Install from gist/URL**, paste the
[Azure SRE Agent canvas-only URL](https://github.com/microsoft/azure-dev-tools/tree/azure-sre-agent-latest/canvases/azure-sre-agent/com.github.copilot/extensions/azure-sre-agent),
and install. This URL uses the movable `latest` tag and installs the canvas
only, **not** the `azure-sre-agent-canvas` routing skill. Fully quit and reopen
GitHub Copilot. If the prompt above does not route, open **Azure SRE Agent**
from your installed canvases. Do not install a second provider to work around
a missing canvas.

## Customize skill-load errors

`Skill description must be at most 1024 characters` refers to the decoded
frontmatter description, not the length of the whole `SKILL.md`. Detailed routing
instructions belong in the body.

The full plugin declares `skills/azure-sre-agent-canvas/SKILL.md`.
A Customize error naming `.github/skills/sre-agent-studio-router/SKILL.md`
instead names the old workspace router. Current source uses
`.github/skills/azure-sre-agent-router/SKILL.md`; neither workspace path is
installed by the marketplace plugin. Check the failing path and host-discovered
skill source before making changes. Preserve any local edits. For a retained
legacy copy, move its existing description text into its body and use a short
description; do not delete or replace the file just because its name is old.

## Prerequisites

- A Copilot host that supports the installation path you choose and Node 22
  or later.
- [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
  installed and signed in with `az login`.
- Access to an Azure subscription containing an existing Azure SRE Agent, with
  permission to view and use it. This plugin does not create the agent resource.

If the canvas reports `fetch failed`, a network restriction may be preventing
access to Azure or the agent endpoint. Check your VPN and network connection,
then retry. This error alone does not establish that your Azure login or RBAC
needs changing.

The subscription picker reads the CLI's cached subscription identities separately
from external-agent connectivity. It accepts `cloudName` from current Azure CLI
versions and the older `environmentName`/`cloud` fields, while still requiring a
valid subscription, tenant and account identity. Connecting an external agent
does not select an Azure subscription or replace that profile.

## Use and safety

### Existing Kusto MCP connections

SRE personal diagnostics are a separate, conversation-local catalog. A source
missing from that catalog does not mean an existing host MCP connection was
deleted or disconnected. Keep the provider, endpoint, database and exact KQL
already selected for the request. Adding an SRE personal source or changing
consent is separate setup, not an automatic repair.

A source-test timeout is a failure of the attempted target, not permission
to use a sample or different endpoint. Failed tests invalidate that source's
pending drafts and reads; late results cannot restore readiness. Other sources
remain unchanged. Review a target change explicitly and approve any later
read separately. Registration, testing, use in this chat, and evidence sharing
remain distinct operations.

### SRE investigations

You can also ask:

```text
Investigate this failure
Investigate issues in <yourappname>
Investigate why Function App orders-api returns 503 after deployment
```

Choose your subscription and SRE Agent in **Azure Configuration** (subscription
changes take effect immediately; choose **Done** when finished), then open
**Apps** to diagnose a failing resource. Select a thread in **Threads** to
inspect its evidence and status in **Active thread**. Choose
**Connect This Thread** before SRE follow-ups in the same Copilot conversation,
then **Disconnect** when finished. Try **Summarize the current investigation**
to read existing evidence; **Ask my SRE Agent to continue the investigation**
sends a real message. Browsing another thread does not change the connection:
use **Switch to This Thread** deliberately. If you need a
new conversation, choose **New thread**, edit the draft, and **Send** before
connecting it. Creating a thread and sending messages are writes.

The connection is saved in this Copilot session's workspace, keyed by the
conversation ID, not by panel ID or user home. It stores the canonical agent
resource/endpoint, thread ID and label, real incident ID if supplied, tenant,
cloud and an opaque caller-account binding, not transcripts or credentials.
Panels in the same conversation synchronize through the provider's state
events. If session storage is unavailable, connection changes fail explicitly.
URL-backed thread selection is independent of this record.

An explicit canvas open accepts `agentReference` (the exact agent resource ID,
supported Portal URL or external base endpoint) and an optional `threadId`.
Reusing a panel hydrates that agent and existing thread together, rechecks the
Azure tenant/account, and discards superseded requests. It does not create an
investigation, connect Copilot follow-ups or replace saved agent preferences.
Use `investigate` only for an approved new investigation; its optional
`agentReference` overrides stale panel selection and its result names the
actual agent/subscription/thread target. Repair navigation by opening that
target, never by repeating creation.

Supported resource links include Azure Portal `#resource` and SRE Agent blade
links, SRE Portal resource and `/overview` links, `/views/incidents`,
`/views/builder/responsePlans`, and `/views/thread/<threadId>`. SRE page fragments
use the same `/views/...` routes. Registered external-agent links preserve
their `agentUrl` and supported thread fragment. Tracking query parameters do
not change the resource; conflicting targets, unsupported routes, invalid
encoding and non-Microsoft hosts fail explicitly. A tenant-qualified Azure
Portal link must match the selected CLI tenant.
Tenant domain aliases without an authoritative CLI tenant-ID match remain
unsupported; they must not select a different tenant implicitly.

Thread status is distinct from a completed tool or reply. Current running
execution evidence, incomplete replies and current human gates take precedence
over a terminal investigation summary. An unresolved historical gate conflicting
with that summary is **Status unknown**. A failed status read retains the
transcript but reports **Status unavailable** until a fresh read succeeds.
`ask_agent.completed` describes the reply, not the investigation lifecycle;
read the returned thread activity for its current state. Explicit follow-ups
and app diagnoses freeze the selected target and reject a changed caller or
selection before sending. A late result still reports its original target
without replacing a newer panel selection.

`focus_thread`, `unfocus_thread` and `ask_agent` keep their existing action
schemas. A new panel in the same conversation restores an unselected agent
and thread from the validated conversation connection, without changing saved
agent preferences or reconnecting chat. It can then disconnect and explicitly
reconnect that thread. An already-selected panel keeps its own selection;
unavailable connected targets report an error instead of restoring another agent.
Opening a connected external investigation uses its agent-level Portal link
and the current connected thread, not an older thread fragment stored in the
link. Conflicting thread IDs in user-supplied links still fail explicitly.
The native `get_connected_thread` action reads the connection without
changing selection, including when another agent is being browsed. It
revalidates the tenant/account and the exact thread. Resolved investigations
remain connected. Deleted/inaccessible/unavailable targets retain their name
and error; fresh reads can recover them, but never select a replacement.
Switch/disconnect affects later requests; an already-sent operation keeps its
original target and cannot overwrite a later selection. Short follow-ups use
prior SRE conversation context; ambiguous intent needs clarification. The
extension does not intercept all chat, send automatically, or approve actions.

Active-thread replies, scheduled-task descriptions and expanded instructions,
and tool/query result prose share the host's body typography. Callout borders
and surfaces distinguish tasks and tools; role labels stay muted and only card
titles use semibold. Author-supplied Markdown emphasis, headings and tables are
preserved. Code and queries use the host's monospace font. The canvas consumes
the documented `--font-sans`, `--font-mono`, `--text-body-medium`,
`--leading-body-medium` and `--font-weight-semibold` tokens with portable
fallbacks; it does not require host-internal styles or downloaded fonts.

Incident, investigation and scheduled-run transcripts use the same bounded
user-facing artifact preview, including external agents. MCP cards expand to
show supplied parameters and historical results, with sensitive fields removed
and explicit missing-content, truncation and omission notices. Tabular previews
show at most 20 rows, 12 columns and 256 characters per cell. Other parameter
and result previews are limited to 4,000 characters; transcript artifacts share
a 64,000-character envelope. Model actions still use the separate 40-message,
14,000-character text-budget projection, not this UI envelope.

Supplied KQL retains its exact line endings and target metadata when complete.
**Copy** copies the displayed query; **Open in chat** prepares an origin-bound
personal explanation draft without running it, reconnecting chat or sending
evidence to SRE. Queries beyond the 6,000-character preview limit, redacted or
otherwise incomplete sources stay non-runnable until a complete replacement
is explicitly reviewed. The card reports displayed/original character counts
and the source query's SHA-256; clipped target metadata is not forwarded as a
usable target. Personal query execution, source access and evidence sharing
retain their separate existing approvals. No Explorer is invented when a
qualified handoff is unavailable.

Supplied `fileWriteResult` and `readFileResult` artifacts expand in the thread
with their actual field names and bounded contents, including plan/memory text
and diff data when the service supplies them. Text is escaped and displayed as
data; no source HTML executes. **Copy** copies only the displayed field. Each
field is capped at 8,000 characters, each artifact at 12,000 characters and 20
fields, within the shared transcript envelope. Redacted, unavailable and
truncated previews are explicitly labeled. These are SRE artifacts, not local
workspace files. The canvas does not infer a download endpoint, a file Portal
link or missing contents, and expansion/copy neither fetches larger content
nor edits, publishes or shares the artifact.

For an external or shared SRE Agent, paste its `sre.azure.com` share link or
Azure resource ID in the **External URL or Resource ID** tab and choose
**Connect to agent**. Use the star beside the current connection or a native
agent row in the picker to save/remove **Favorites** without connecting;
select the saved agent row later to reconnect without repeating the lookup.
**By subscription** contains native discovery only. Switching tabs preserves
the current connection, investigation, and entered reference.
Ordinary Azure portal resource links and encoded ARM IDs open the matching
known subscription's discovery without connecting an arbitrary agent.
Metadata alone does not prove access. If discovery cannot list the exact
resource, use **Connect by resource ID** for a resource-scoped share.

**Automation** uses the connected agent's authenticated, read-only
`GET /api/v1/scheduledtasks` and `GET /api/v1/httptriggers` collections.
External connections read both at connection time; **Refresh Automation** reads
both on native or external connections. The two collections report failures
independently: an unread, denied, or unreachable collection is unavailable,
not empty, and does not disconnect a working thread. Details show supplied
schedule, last/next execution time, and execution count; missing values remain
**Not provided**. Trigger URLs, invocation controls, and run history are not exposed.

The canvas uses your Azure CLI identity. Its read and write actions are
registered; mutating operations require an explicit action or host
confirmation. One-time execution authorization is separate from durable role
assignment. Delegated private-connector mutations require
`ALLOW_PRIVATE_CONNECTORS=true` and must not be used for production or
multi-user private connector isolation without verified per-invocation
ownership.

If the canvas is missing, fully quit and reopen GitHub Copilot, start a fresh
chat, and retry the exact prompt. Check plugin and extension status rather
than installing a second provider; reinstall via the same path you chose
(canvas extension or full plugin). If agents do not appear, check
`az account show`, your selected subscription, and your agent permissions.
