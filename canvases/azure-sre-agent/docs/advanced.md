# Azure SRE Agent: alternative installation and operational notes

Diagnose failing Azure applications with an existing Azure SRE Agent.

## Stay in standalone Copilot CLI

This extension registers `sre_personal_*` tools separately from its canvas.
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

When the **Azure Dev Tools** marketplace lists **Azure SRE Agent** in GitHub
Copilot, go to **Customize → Plugins → marketplace gear**, add
`microsoft/azure-dev-tools` (marketplace ID `azure-dev-tools`), and install
**Azure SRE Agent**. The full plugin includes both the canvas and its
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

`focus_thread`, `unfocus_thread` and `ask_agent` keep their existing action
schemas. The native `get_connected_thread` action reads the connection without
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
