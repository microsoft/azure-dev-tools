# Azure Functions: user guide

Create a Function App, try it locally, deploy it, or improve an existing app.
Start with the [README](../README.md) for installation.

The canvas uses the shared canvas-toolkit header, navigation, cards, notices,
folder fields, composer and footer. Task history, project selection, approvals
and asynchronous work remain owned by Azure Functions. The standalone package
includes the same-origin toolkit runtime and styles; opening it does not fetch
UI code or require a customer dependency install.

Ask **Open Azure Functions canvas**. It opens Home without scanning your
project, running your app or starting a deployment. Choose a task on Home, open the hamburger
menu (**Browse**) for grouped tasks. **Jump to** (Ctrl+J or Command+J) offers
searchable **Quick actions** and **Ask Copilot** groups, including
**Check prerequisites**, **Run** and **Deploy** task/report shortcuts.
Open the current source project in VS Code, copy a verified local HTTP function
URL without calling it, or copy the last local test response. Ask Copilot to
explain a current error, prepare a sample function test, or propose a finding fix.
Choose the relevant function, error or finding when more than one is available.
Unavailable actions explain the missing context. Copilot receives bounded,
redacted context for advice only; tests, file changes and deployment remain
separate reviewed actions. No new resource or full-text cloud-log index is added.
The Copilot communication signal and functional loading spinners keep animating
when reduced motion is enabled. Entrance/exit transitions, progress sweeps and
completion artwork remain reduced; approval and answer waiting states stay
static. High-contrast mode retains the text pill without its gradient signal.
The signal follows this canvas's accepted requests through queued, working,
waiting and finished states. Other chat requests and subagent activity do not
start it. A disconnected or uncertain delivery stays unknown; it is not
automatically retried.
The current project or app selector sits beside Azure Functions in the header,
separated by a slash when there is room. At narrower widths, **Jump to** becomes
icon-only to keep the selected app visible; its tooltip and keyboard shortcut
remain available.
Long names are truncated to keep the header on one row. Select the name to see
the three most recently used local or GitHub apps. Choosing a recent app uses
the existing selection guards; GitHub apps recheck access and their saved
workspace before selection, without preparing another checkout or silently
opening the source as local files. GitHub source remains available in Open function app
and Modernize, not local-only Run or Deploy.
Home also shows **Recent apps** below the main tasks, using the same saved
Local and GitHub history. The two most recent apps appear first. **View more**
reveals the remaining saved apps in place; **View less** returns to two without
removing history. A fresh page starts with two again.
Select an app to open its source dialog in Open function app,
without an extra confirmation card. Local apps prepare the saved folder:
**Open** confirms the folder and runs its checks; closing the dialog leaves
the current app unchanged. GitHub apps recheck access, branch and workspace before
selection; scanning remains separate. Missing folders and stale GitHub references
show an error without replacing the current app. Choose its current location
through **Change app**. Merely opening Home does not add history, and reopening
does not install, run, deploy or publish. Azure apps still use Monitor's existing
selection flow; they are not added to the Local/GitHub history.
Source badges distinguish Local and GitHub entries, and **Current** identifies
the selected app. Each app's overflow menu offers **Remove from recents**:
this removes only that saved shortcut, not its files or the current selection.
**Change app** opens source details without leaving the task; **Change project**
reveals the existing folder or repository controls in the same dialog.
Switching between Open function app, Run and Deploy keeps project configuration in that
header dialog and preserves unsubmitted task drafts.
In Run and Deploy, the dialog offers **Local / GitHub / Azure**. Local shows the
current folder controls. GitHub and Azure explain the task boundary and offer an
explicit button to continue to Open function app's repository chooser or Monitor's deployed-app
chooser. They do not become direct Run or Deploy targets. Switching these tabs
does not navigate, apply a target, scan, run or deploy; local inputs are retained.
Azure's handoff requires a separate confirmation before leaving Run/Deploy.
**Keep editing** preserves the dialog, drafts and focus. **Continue to Monitor**
discards unsubmitted project-folder, request and deployment inputs when the page
changes; the selected local project remains unchanged.
The right-aligned **+ Create a function app** split action and **Create a function app** in the app menu open
the same creation setup without creating files. Drafts and the selected project
are retained; generation, installation, running and deployment remain separate
reviewed actions. Below 600 pixels of available canvas width, **Create a function app** shows
only **+**, retaining its accessible name and tooltip. Both split segments stay
on the header row; the dropdown uses a small **Open from** heading and compact
**Local / GitHub / Azure** rows with computer, GitHub and Azure icons, using the
existing source controls. In Run and Deploy, a choice opens
the same dialog with that source selected and retains the explicit handoffs
above. Elsewhere, Local and GitHub open the existing Open function app or Scan source
chooser; leaving the Build page for Azure requires the same **Keep editing /
Continue to Monitor** review. In Monitor, Azure opens the deployed-app selector;
Local and GitHub return to Scan's source chooser rather than becoming Monitor
targets. Opening a menu or source chooser does not apply a resource or start
scanning, creation, running or deployment.
**Close** or Escape dismisses the dialog without applying a draft, scanning,
running, or deploying. **Browse > Change project** opens the same dialog when a
project is selected, without navigating away from the current task.
The dialog fills the screen in panels 600 pixels wide
or narrower. Confirming a folder retains its existing open/scan behavior;
switching remains unavailable while the canvas owns an active run or change.
Without a selected project, the existing source chooser stays in the task.
The Azure app selector still refers to a deployed resource, not a local project.
The **Subscription** picker also fills the canvas viewport at 600 pixels wide
or narrower, in both deployment settings and the Azure app selector. Its list
scrolls within the dialog while the title, close button and confirmation actions
remain reachable. Wider panels keep the centered dialog. Selecting a subscription
is a draft until **Apply**; **Cancel** or Escape leaves the current scope unchanged.
When a subscription selector first appears without a selected target, it uses
the active Azure CLI subscription if that subscription is available in the
current profile. The Azure app selector loads that subscription's Function Apps
through its normal selection flow. Existing deployment settings, selected apps
and manual subscription choices are retained on refresh and navigation. An
unknown or unavailable active subscription leaves the picker unselected; choose
an available subscription manually or refresh the profile. This does not change
the CLI's active account, run an app, or approve a deployment.
Browse stays beside the task when at least 1180 pixels of shell space are
available, filling the panel height with a contrasting background.
The expanded sidebar has an icon beside each destination and a collapse icon at
its top right: a left-sidebar outline with a left-pointing arrow. Collapse it to
restore the hamburger in the header. In a narrow panel,
hover or focus Browse for a temporary preview, or select it to keep the same
preview open until Close, Escape, or an outside interaction. Only the expanded/collapsed
preference is saved for this panel in this browser tab; navigation history
remains separate, and Back does not undo operations.
Back and Forward wait for the restored task to appear, not just for its API
response. An earlier state read arriving during that transition does not replace
the remaining history. If the display cannot finish updating, the canvas reports
the error instead of leaving navigation disabled indefinitely.
Button names below use the English UI;
use **Translate** in the footer to change the display language.
Opening or reloading Home does not automatically focus its first task.
Use Tab to reach a task, then arrow keys or Home/End to move between tasks.

The canvas shows a status pill below the header: **Sending to Copilot...**,
**Waiting for Copilot...**, **Queued in Copilot...**, or **Copilot is working...**,
according to the tracked stage of a correlated request.
A queued canvas request stays visibly queued even if an older tracked turn is
still working. **Waiting for Copilot...** means delivery was accepted but its
start or queue position has not yet been observed; it does not mean Copilot
is waiting for your answer.
If a queued message disappears before its start is observed, its status becomes
unknown; queue removal alone does not prove completion or cancellation.
The neutral pill sits over a transparent row-wide wash, beneath a thin animated
brand-colored line. Its neighboring highlight is derived in OKLCH at a hue offset
of -45 degrees, with gamut mapping and an anchor contrast of at least 3:1 against
the surface. The body reserves space and scrolls beneath the wash; the header
and expanded sidebar do not move. The row animates in and out.
Dismiss hides the current request without cancelling it. A new request or a new
question or approval brings the pill back.
Reported root-request questions stop the animation and show **Your answer needed in Copilot chat**,
with a static attention icon, an attention-colored border and a tinted background.
The text and icon remain visible in high-contrast mode; this state does not flash or pulse.
Approvals show **Copilot needs your approval in chat**. The pill animation stops when the response
is idle; this does not mean a deployment or workflow succeeded. Workflow progress
and verified outcomes remain in their task view. Unrelated chat activity and an
open display connection do not activate the border. Lost tracking shows an
unknown state rather than assuming completion or resending the request.
Reduced-motion settings keep the pill gradient static.
Background runs and deployments remain independent:
they can continue after Copilot finishes, without keeping the host pill animated.
Request tracking uses the admitted message ID: current native runtime queue rows
and consumed user events carry it in `messageId`, separately from their envelope
`id`. Older SDK shapes without `messageId` retain their `id` compatibility; an
explicit invalid `messageId` never falls back to an unrelated envelope ID.
Only consumed requests in the current tracking epoch can become active. A
session idle event does not settle a different pending request.

For a status mismatch, request `get_state` with `includeActivityDiagnostics: true`.
This diagnostic read does not create activity or bind a new conversation root.
The optional `hostActivityDiagnostics` result contains the loaded entry's version,
entry revision and source/emitted mode, observer configuration and received-event
count, queue-read availability, tracked statuses,
and the most recent 64 diagnostic events. Message and question identifiers are
salted per provider launch; prompts, answers, tool arguments, queue text, URLs and
raw errors are not retained. The trace is memory-only and is not sent to telemetry.
Queue evidence includes item and steering counts, at most 100 rows of salted
allowlisted identifiers, and identifier value types. User-message evidence includes
the salted event ID, chronological parent, optional identifier fields and delivery
category. A chronological parent is not a causal link. Other diagnostic
candidates such as `interactionId` and `requestId` do not authorize message
correlation. The observed native `messageId` fields are not declared in the
repository's pinned generated SDK types; both observed and older shapes are
covered by isolated regression fixtures. Compare these with the admission token to distinguish an
empty snapshot from an identifier mismatch without retaining message content.
Match its `activityId` and `revision` to the pill element's `data-activity-id` and
`data-revision` when inspecting an isolated browser. Record the actual registered
provider alongside the result; an entry revision is not proof of the full source
dependency closure.

Check a normal canvas help request first: sending, accepted, queued if applicable,
then working once its user message is consumed. A correlated question or
elicitation should show **Your answer needed in Copilot chat** until its matching
completion, then resume. Finish or cancel normally; do not resend to diagnose a
stale pill. A received question can be excluded because it belongs to a subagent,
has no current root, or is not bound to this canvas's real provider actions.
If native chat shows a question but a trace covering that interval contains no
corresponding received event, native host forwarding still needs qualification.
An older event may have fallen outside the bounded trace. Passive observation does
not install an answer handler or take question ownership away from chat.
Host-driven activity requires an observed canvas handler; it is not a global
Copilot status monitor. Missing lifecycle events and reconnect history cannot
prove that a response finished.

**Project health** checks local project files with deterministic rules. Its
summary appears in an inline warning message bar; **Review findings** opens the
findings. No findings means no warning, not a guarantee of runtime health.
Scanning and other short notices use the same message-bar pattern, including
stale check data, cached templates and unsupported local event sources.
Findings, test responses, progress and approval reviews keep their detailed
views. Azure app health and **Resource Health** remain separate checks.

- [Choose a local project or GitHub repository](#choose-your-project)
- [Create and customize an app](#create-and-customize-an-app)
- [Run locally](#run-locally)
- [Deploy to Azure](#deploy-to-azure)
- [Check and modernize an existing app](#check-and-modernize-an-existing-app)
- [Open or monitor an app](#open-or-monitor-an-app)
- [Troubleshooting and recovery](#troubleshooting)

## Prerequisites

The subscription picker reads the current Azure CLI profile without signing in.
If that profile is confirmed signed out, **Sign in to Azure** starts the shared
Azure CLI sign-in flow only when selected. Complete any browser, MFA or system
dialog prompts. Sign-in may update the machine's CLI profile; it does not change
the canvas project, select a subscription, run an app or deploy anything.
Confirmed success refreshes the available subscriptions; choose one explicitly.
While sign-in is pending, complete it or use **Cancel sign-in** before changing
the app or scope. Cancellation does not undo CLI profile changes already made.
After a cancelled, failed or uncertain attempt, refresh subscriptions to inspect
the current profile before retrying. Missing CLI, access errors and an empty
signed-in profile are not treated as signed out.

Install the plugin in the GitHub Copilot app; a separate Copilot CLI
installation is not required. The tools below are needed only for the
tasks that use them, not to open the canvas.

| Task | Required tools |
|---|---|
| Create from a template or deploy | Azure Developer CLI (`azd`); deployment also needs Azure access |
| Run an app locally | Azure Functions Core Tools 4 (`func`), plus the app's language dependencies |
| Use GitHub source | Git, GitHub CLI (`gh`) signed in, and access to the repository |
| Check an app in Azure | Azure CLI (`az`), signed in to an account with access to the app |
| Open the project in VS Code | VS Code and its `code` command |

Tool versions are checked in the background when the canvas first opens.
Successful checks and initial checking show no banner. Missing or unverifiable
tools relevant to the current task show one warning with **View report**.
Read-only local review does not warn about unrelated runtime or deployment tools.
Open **Check prerequisites** through **Jump to**, **Browse**, or the warning.
During a task, prerequisites open in a
non-modal docked panel without leaving your task or clearing its inputs.
It docks on the right above 900px and along the bottom at 900px or below,
leaving the current task usable. Drag its edge to resize; its width and height
are remembered separately. With the separator focused, Left/Up grows the panel
and Right/Down shrinks it (16px, or 40px with Shift).
Use the trigger again, **Close**, or Escape to dismiss it and continue.
From Home, **Browse > Check prerequisites** opens the standalone page.
The report distinguishes **Not found** from **Failed to run**. It shows the
selected executable path for each detected tool. A failed version check shows
the reason (including timeout, permission, exit code or signal when known);
expand **Failure details** for bounded, redacted command output. Failure does
not mean the tool needs reinstalling, and **Install** appears only for an
undetected executable. The extension's PATH may differ from your terminal's.
For **Failed to run**, **Update or repair this tool** opens its official setup
instructions. Update to the latest stable version and check again. This is
guidance, not a claim that the installed version is outdated or caused the
failure; permissions, PATH, proxy or other environment issues may remain.
The canvas does not download or run an update automatically.
Use **Check again** after fixing detection or execution. **Help with setup**
shares the selected path and failure details with Copilot for a reviewed plan,
not automatic installation or changes to macOS security settings.
A tool version check does not verify Azure sign-in or project configuration.
Results are shared for five minutes across task entry, project/app selection
and returning to the canvas. Explicit Create, Start, Deploy, migration and Azure
assessment requests refresh detection in the background; verified creation,
migration and fix completion also refresh it. These checks never start those
operations. Concurrent requests share the same check. Iframe reloads, display
reconnects and history navigation do not force a refresh. A fresh provider
runtime checks again; Reset Canvas retains the cache.
The report runs `func --version`, `azd version` and `az version -o json`
on the extension's execution host. Command discovery may also read `npm prefix -g`.
It does not install tools, execute project scripts, sign in, or change Azure.
**Jump to > Run** and **Deploy** open the corresponding task pages for review;
they do not start a host or deployment.
Missing build or runtime tools do not prevent a read-only local rule check.
GitHub CLI is used directly for GitHub repository, branch and folder metadata;
it is not a Copilot CLI dependency. Git is used to verify the isolated App
checkout. Neither `gh` nor Git is needed for local rule checks, template
browsing or checking a deployed app. VS Code is optional unless you choose
**Open in VS Code**.
If you install a tool while Copilot is open and it remains undetected, restart
Copilot so it picks up the updated environment.

Errors appear in message boxes with **Ask Copilot**. Select it to send the
displayed error and current task context to Copilot for an explanation and
next steps. Hover or focus **Ask Copilot** to see a tooltip explaining that
the response appears in the host chat. Logs, deployment inputs and settings are not attached. This does
not approve installation, file changes, retries or deployment. While sending,
the button shows **Sending…** and prevents duplicate clicks. Only after Copilot
accepts the message, a separate, neutral handoff notification says **Message
sent to Copilot**. Its CrossReference icon marks the destination, not a resolved
error or a ready response. The notification closes after eight seconds, pauses
while hovered or focused, and supports Escape or its dismiss button. Keyboard
focus stays on the sender. The original error stays visible and its sender
remains unavailable to prevent duplicates. If delivery cannot be confirmed,
the error box keeps actionable guidance instead of a success notification.
The canvas does not retry or open another application automatically.

Sign in from your terminal with `az login` before checking Azure apps. The
canvas uses that sign-in and lets you select the subscription; it does not
sign in for you.

## Choose your project

After generating a new project from a template, the canvas adds
`local.settings.json` to the generated `.gitignore` before the initial health
check if the existing patterns do not already exclude it. Other ignore rules
are preserved. Opening an existing project does not make this change.

When updating or scanning an app, use **Choose project** if no project is selected,
or **Change app** from the current project's menu, to open the project dialog. Its source tabs offer
**Local** for files on the machine running Copilot and **GitHub** for a repository.
Modernize also offers **Azure** to check a deployed app; Monitor opens the deployed-app selector directly.
The dialog shows the selected source's fields immediately, without a second **Change project** step.
Azure assessment does not download the app's Git source or prepare a source update.

### Local

The current session workspace is the default. To use another folder, use
the folder picker or enter an absolute path, such as
`C:\projects\my-functions` on Windows or `/projects/my-functions` on Linux.
Quoted paths, UNC paths and `file:///` URIs are also accepted.

Select the project folder, not an individual source file. Nested Function Apps
can be discovered; **Run and test** asks you to choose if it finds several.
Folder drag and drop is not supported.

### GitHub

1. Select **GitHub** and enter `owner/repository`, or use **Load repositories** under **Advanced**.
2. Choose the source branch. The repository's actual default branch is the initial choice, not necessarily `main`.
3. Leave the folder at the repository root, or choose a repository-relative subfolder under **Advanced**.
4. Select **Open repository** and review any Copilot permission request.

Copilot prepares an isolated working copy in an App session for that repository.
Your existing project is not switched to another branch. Reopening the same
workspace keeps your local edits and commits; it does not reset or synchronize them.

For an existing app, select **Scan your app** to check it. Scan and
**Open in VS Code** use the repository root or chosen folder unless you
explicitly select a Function App. Discovering an app does not select it for you.
Scanning does not run repository scripts, install dependencies, edit files or publish changes.

You can plan and make approved local changes without push permission.
Publishing needs push access and separate approval; no fork is created automatically.
GitHub access here uses the host's GitHub CLI sign-in, not a function's
GitHub connector credentials.

### Create a new repository

This option is available in **Create a function app**. Choose **GitHub → New
repository**, enter the owner/name and default branch, choose **Private** or
**Public**, and select README initialization. Select **Review repository
creation**, check the settings, then confirm.

Creating the repository does not create the Function App or deploy it.
Open the new repository and continue with app creation.

## Create and customize an app

Choose **Create a function app**, then an event or starter from the official Azure
Functions template catalog. All choices lead to **Set up your function app**.
The **Local / GitHub** tabs appear when choosing the new app's save destination,
not on the initial function-kind screen or other creation questions.
Choosing a kind does not change your source or create anything.

1. **Check the configuration.** Python is the default unless you have a saved
   language choice. Use **Change configuration** to change the type, language,
   infrastructure or starter. Changes take effect immediately; **Close** or
   Escape collapses the editor without discarding them. Valid language and
   infrastructure choices are saved across sessions. Unsupported choices are
   highlighted for you to correct. On entering Hosted Skills, an unsupported
   saved language is replaced only when the catalog offers exactly one language.
   Later edits, including cleared choices, are preserved on reload and catalog refresh.
   Hosted Skills also offers **Open Hosted Skills canvas** for its dedicated
   model/tool configuration UI. The link opens a uniquely registered provider
   without submitting this form or transferring its draft. The dedicated
   canvas retains its own startup and local-workspace behavior.
   You can keep using the skill-led flow here; an unavailable or ambiguous
   provider is reported explicitly, without installing or enabling anything.
2. **Customize with AI (optional).** Describe what to add, such as validation
   or unit tests. Copilot can prefill instructions you already supplied; you can
   edit them before creating. **Refine with Copilot** suggests clearer
   instructions and asks a short question in chat only when a material detail is
   missing. Edit the suggestion, then choose **Use suggestion** or **Keep
   original**. Refinement never creates files, installs dependencies, runs the
   app or deploys. Editing your instructions or configuration makes an earlier
   suggestion stale; keep the original and refine again. After uncertain chat
   delivery, check chat before retrying. Keeping the original abandons that
   suggestion's tracking, not a confirmed cancellation of chat.
   Hosted Skills labels this **Customize with AI**, without
   the optional qualifier, and expands the input when you enter Hosted Skills,
   including after Reset Canvas. You can still collapse it; ordinary form
   and locale refreshes respect that choice. Other templates retain their
   disclosure behavior. Trigger-only customization remains supported.
3. **Choose the project location.** Select **Edit** to type an absolute parent
   folder path, or **Browse…** to pick one on the extension's machine. Check the
   suggested project name; it stops updating once you edit or clear it.
4. **Select Create.** The canvas uses `azd` to scaffold the starter in a new
   project-name subfolder. With nonblank instructions or a selected Hosted Skills
   trigger, it also sends a customization
   request to chat. There is no separate review screen; review Copilot's proposed
   changes and approval requests in chat.

Folder and name are required. Names use 2-40 ASCII letters, digits or hyphens,
start with a letter, and retain their capitalization. These rules also apply to
new app folders in GitHub; they do not check Azure resource-name availability.
The destination must be new or empty.

After creation finishes, a centered code-window illustration confirms that the
function app project files are ready locally. A compact badge above the heading names
the created project and its language when available, without a redundant task
heading above the completed view. The illustration and its animated parts scale
together from 160px on narrow screens to 280px when there is room, with a
viewport-height cap for short windows. Its brief
success animation pops in the window, builds the code lines, reveals the check
badge, then sparkles. It starts automatically and respects **Reduce motion**.
**Run locally** opens the
existing Run workflow; **Open in VS Code** opens the selected created project.
Neither action runs automatically, and creation does not mean the host is
running or the app is deployed to Azure. Local/GitHub source tabs remain
available during setup, but are not shown on this local success result.
Process output appears below the actions only when the created project's local
host has activity or logs. Creation progress and failures remain separate.

To start another app, use **Home → Create a function app** or **Browse → Create a
function app**. Leaving the result does not delete files or start another operation;
explicitly choosing Create again returns to setup.

Folder edits need no Apply or Cancel. Draft fields survive reloads, including
cleared values. A new explicit preparation replaces only the fields it supplies.
Older drafts retain their selected starter while the catalog loads.
**Create** requires filled fields and supported catalog choices;
an open editor does not block it, but an active operation or folder picker does.

Setup, existing-project selection and local assessment share one folder field:
a label, path, Browse and, where needed, Open. Errors appear beside the field;
Browse selection retains each workflow's existing open or scan behavior.

**Hosted Skills** first asks an optional trigger question to guide customization,
not select a different template. A selected trigger is customization input even
when the additional instructions are blank. Skipping the trigger with no instructions
creates only the trusted starter, without requesting AI customization.
Its primary path is **Create → Review Hosted Skill → Deploy → Verify behavior**,
not the generic local HTTP request form. The creation result opens a file-review
page with the agent's reported customization summary (when available), **Open in
VS Code**, and **Continue to deployment**. Inspect the current `.agent.md`,
`agents.config.yaml` and `mcp.json` files for instructions, triggers, model and tool
configuration. A reported summary is not a fresh file scan or runtime proof.
Existing Hosted Skills apps also use this review page in place of **Run locally**.
Creation, customization completion and opening review do not prepare or start a
generic local runtime, install dependencies or require a local HTTP test example.
Any already-owned local host retains its controls until it is stopped.

**Continue to deployment** opens the existing Hosted Skills planning flow.
**Plan deployment in chat** uses `azure-functions-hosted-skills` to collect
settings, check model/quota and request approval; neither navigation nor planning
authorizes deployment. Model and connector operations still require their cloud
dependencies. After approval, verify the deployed trigger and actual output:
enabled interactive endpoints for chat/API skills, admin invocation and
Application Insights for background skills. Do not add debug endpoints just to
test background skills; side-effecting invocation needs its own approval, and
an accepted request is not completed execution. Only verified deployment and
runtime completion may produce the deployment-success result.
**AI agents** includes Copilot SDK quickstarts
and Agent Framework examples.

Creation does not run tests, install language dependencies, deploy or open an
editor. Run and deploy are separate actions; use **Open in VS Code** to inspect
the project. When **Your response is needed** appears, answer or approve in chat.
The standard warning MessageBar, **Action required in chat**, marks a paused customization:
no spinner or progress bar runs while it waits. Active work uses a spinner
with the current step, not an estimated percentage. Expand **View full plan**
or **Your original request** to read the full text; approvals remain in chat.

**Cancel customization** requests a stop for that creation run. **Cancellation
requested** remains until the agent confirms its writes and in-flight tools have
stopped. If blocked, stop that run in chat. Unconfirmed delivery is not retried
automatically. Cancellation affects neither unrelated chat work nor deployment.
Files are kept after cancellation or failure; retries never overwrite a nonempty
folder.

For a GitHub destination, open the repository as described above, choose a
**Trusted template** and **New app folder name**, then select **Review changes
in App**. Review and approve the creation plan in that repository's App session.
Publishing the result is a separate step.

## Run locally

Open **Run and test** for the selected project. The action row appears below
the app fields; select an app first only when the workspace contains
more than one. Opening the page does not install or run anything. Prerequisite
checks still run on startup; use **Browse → Check prerequisites** for a separate
tool review without leaving the task.

The action row places **Send** immediately before **Stop** when the host is running.
Before startup, the labeled outline-triangle **Run** button uses primary styling
and Send stays hidden. The single VS Code icon button uses the branded logo,
secondary styling, an accessible name and a tooltip. It opens the selected project
for editing and debugging.
The question-mark **Run help** button opens setup details on demand.
**Setup guides**, inside Run help, opens optional documentation:
the VS Code development guide and setup guides for Azurite, Service Bus,
Event Hubs and Cosmos DB emulators. Choose only the guides relevant to your
app's bindings. The guides do not install tools, start code or deploy anything.
The rocket **Ready to deploy** action uses secondary styling, aligned
to the right. It opens
deployment configuration, not deployment itself, and is not a readiness check.
When the action row is narrower than 480px, Run/Stop and Ready to deploy show
only their icons. Accessible names and tooltips remain; labels return when
the row has room, including after resizing a docked panel.
**Open function app** remains available through **Browse**, rather than a separate
button below Run output.
A startup failure keeps its actual error; the event-source warning appears
only when the selected app has triggers this screen cannot run.

Run switches to a labeled red square **Stop** button with a matching red outline in the
same button while a local run
is starting, running or still owns processes after a failure. Stop only affects
that owned run; it remains disabled while stopping. The status badge sits at the
right above the terminal, not in the action row. Running confirms host
availability, not function results; that clarification stays in Run help
instead of a success banner. Idle and stopped states do not add a URL hint or
retain a stopped progress disclosure. Startup/cleanup progress and
actionable errors remain visible.

Leaving **Run** through Home, task navigation, or canvas Back/Forward does not
ask for confirmation or stop the app. Keeping a local app running for testing
is normal. Other task views show a non-blocking **Local app running in the
background** reminder with **Stop app**, which uses the same owned Stop action
as Run. Starting, stopping, and unconfirmed process states use accurate copy;
Stop stays disabled while stopping or when the display cannot verify its target.
The reminder clears after confirmed shutdown. Task navigation within Build
preserves invocation drafts, including when a Stop is pending or fails.

The existing **Change app** dialog explains that the local app must be stopped
before changing apps and provides **Stop app** without stacking another dialog.
Opening it is read-only. Selecting or replacing an app retains the existing
stopped-run guard and source-change reviews. Stop never selects another app
automatically. Failed, timed-out, disconnected, or changed-run Stop requests
surface the actual error and never stop a replacement run or replay an operation.

The reminder covers this canvas's owned run, not native panel/session
closure, switching conversations, or closing the desktop app. The public host
contract has no cancellable pre-close hook for this panel. There is no
stop-on-unload handler, beacon, or automatic stop added by this feature.

**Stop stops the app, not storage.** Run reuses a healthy Azurite service set
on ports 10000-10002, or starts Azurite if all three ports are free. An incomplete
or occupied service set is an error; the canvas never replaces it. Azurite
started by the canvas stays running across app Stop, reset and subsequent Run.
Its process handle, data location and active run consumers are tracked separately
from each app controller. Stopping or resetting never deletes storage data.
Storage is started only by an approved Run, never by opening the panel.

Owned app shutdown is bounded. Unix uses the owned detached process group,
with a forced signal after an orderly grace period and a bounded group-status
check using built-in `ps` group/status metadata only. Exited, unreaped zombies
cannot run workers and do not block completion; stopped or halted live processes
still do. Only the owned group's statuses determine its completion; malformed
rows, unavailable inspection or an unknown owned status keep shutdown unconfirmed.
Permission denial alone is never interpreted as exit. Once no live group
members are observed, that group ID is never signalled again.
Windows uses the maintained process-tree helper (`taskkill /pid /t /f`),
checks its exit status, then waits for the owned command and inherited output
pipes to close. A successful signal request alone is not completion. Neither
mechanism is containment for arbitrary processes that detach from the tree.

If the wrapper has already exited before Stop, its old PID/PPID, group ID or
listening port is not authority to kill another process. The canvas reports
that workers **may remain** and shutdown is unconfirmed; it does not claim
residual workers were detected. Review this app's processes in Windows Task
Manager, macOS Activity Monitor or your OS process manager and clean up any
verified residuals manually. The failed state, app lock and port reservation
are retained; another Stop cannot reconstruct lost ownership. This explicit
notification is the supported fallback, not automatic orphan recovery.
Other partial failures keep Stop available for retry and never stop storage.

Preparation commands have a separate, existing completion contract: a completed
command is removed from the preparation list regardless of its exit code.
Nonzero results retain the original error; cancellation joins already-observed
completion rather than trying to stop a dead wrapper. A still-running command
must be stopped before interrupted cleanup releases it. Command completion is
not proof that arbitrary detached descendants exited; that existing limitation
also applies to successful installation/build commands. Functions-host ownership
is separate and is not released merely because its wrapper closed.

There is no general Stop storage action: another app outside the canvas may use
the same emulator, so exclusive ownership cannot be established. Closing a
controller does not stop storage. The registry lasts for the extension process;
after a host restart/reload, surviving healthy storage is reused as external,
not reclaimed by guessing from a PID, port or data path. Storage survival across
canvas/extension teardown, an operating-system shutdown or host process-tree
teardown is not guaranteed or required.
This is a local development process, not an installed system service.

Python dependency restoration prefers an already installed `uv`, using
`uv pip install --python <selected-app .venv interpreter> -r requirements.txt`.
If `uv` is not found, Run uses that same environment's `python -m pip install`
as before. Run never installs `uv` automatically or changes dependency declarations.
The activity output identifies the selected tool. A failed uv check or restore
is reported as an error, not silently retried with pip. Both paths use the
existing package-index, proxy and certificate environment.
A matching dependency marker still reuses the prepared environment without
another restore. Deployment and VS Code debug tasks retain their own setup paths.

Local preparation starts as a single-line status showing the current task.
Its spinner becomes a chevron on hover or keyboard focus; touch devices show
the chevron directly. Open the row to see four tasks and live output:
local settings, dependencies/build, local storage, and starting/verifying the
host. Checkmarks follow completed work; reused dependencies or storage say
**Already available**. While open, the header keeps a downward chevron and the
spinner appears beside the active task; collapsing moves it back to the status
line. Waiting for process completion without an active task is shown separately,
not assigned to a completed or unreported task.
One functional spinner represents pending work, with no
percentage or estimated finish time. Text changes only when the task changes,
not on a timer. Once the worker and function index are verified, the row reads
**Local host ready · 4 tasks complete** and can be expanded again.
A failure or unconfirmed stop never becomes
completion, and lost display access shows last-known tasks without an activity
animation. The small functional spinner remains available under reduced motion;
it does not imply recent output or runtime health.

The Run action row follows the app fields, with Send immediately before Stop,
then the available log action, VS Code, Run help and Ready to deploy.
The task progress disclosure appears during startup, running and shutdown.
Confirmed stopped and idle states hide it; requesting Stop alone does not.
A confirmed stop briefly announces **Local host stopped.** and returns the action
to Run. Reopening the page does not replay that announcement.
Settled failures remain visible in the error message and logs.

**Send**, to the left of Stop below the app fields, opens the **Logs and results** side panel with the current request
at the top. Each request keeps its own response status, timing and literal body;
later output or an older response cannot replace the newest request's result.
HTTP response status and duration share one compact request header. **Host running**
describes the local host, not a pending request.
The last 20 requests are retained for the current local run, newest first.
Valid JSON is indented for display without changing number tokens, keys or
escaped strings; plain text is shown as received. Deeply nested JSON stays
unformatted. The copy icon and **Copy** label copy that request's original body, not the
formatted view, and never sends another request. Clipboard denial is reported.
Older results collapse when a new request arrives unless you opened, focused,
selected text in or scrolled them for reading. Those reading choices survive
later updates for the retained result.
The log icon in the Run toolbar appears only when the panel is hidden and logs
or results are available. It reopens existing output without sending again.
The header's **Expand logs and results** button fills the canvas with the panel.
The dock's resize edge highlights on hover, keyboard focus and while dragging.
When both results and raw logs are visible, drag their divider to adjust the
space between them. With the divider focused, use Up/Down (Shift for larger
steps) or Home/End. The split stays in this panel across updates and size
changes; collapsing logs removes the divider and frees space for results.
**Restore panel size** or Escape returns to the dock without stopping the host,
resending a request or changing the saved dock size. Closing the panel clears
the expanded view; the next open uses the normal dock.
Raw host output starts expanded before a response is available, then defaults
to collapsed so the result has room. Explicitly opening, reading or scrolling
the logs preserves that choice for the current run.
Expand **Raw output** for chronological host logs. **Jump to latest** appears
when you scroll away from the bottom. Opening the panel or raw output, resizing
the expanded view, and incoming updates return the logs to the latest output
without moving keyboard focus.
Preparation logs are available in the expandable status row only while the panel
is closed. Opening the panel hides that inline log, leaving preparation task
status available; closing restores the inline log with the current history.
The panel docks on the right, or below the form on
narrow screens and can be resized. **Close** only hides the panel; the app and
any in-flight request continue. Use **Stop** in the Run toolbar to stop the owned
app without closing its output. If stopping fails, ownership and the Stop action
remain available for retry. The log icon reopens retained output. There is no
separate startup-output button below the form. **Send** opens the panel again; **Commands**
also shows request results above startup and host logs. Escape, navigation and switching detail panels
only dismiss the view; they never implicitly stop an app. Late output does not
force a dismissed panel open.
Queue acceptance still does not certify that a consumer processed the message.
A missing response or disconnected display shows an unconfirmed outcome,
not successful completion. Check the existing request before retrying.

### Start the app

A short warning beside the controls explains that Start may install dependencies
and run project scripts. Open **Run help** to review setup and affected files,
then select **Start** only for a project you trust.
Start may download dependencies and run the project's build and startup scripts.
It also creates missing VS Code debug files and `local.settings.json`, adds
local-only ignore entries, and prepares Azurite when needed. Existing settings
and debug files are kept. SDKs, Core Tools and VS Code extensions are not
installed automatically.

| Language | Local preparation |
|---|---|
| Python | Create or reuse `.venv` and install the app's requirements. |
| JavaScript / TypeScript | Use the project's package manager and lockfile; build TypeScript if required. |
| C# | Restore and build the app, then start Functions from its build output. |
| Java | Use the installed JDK and Maven to package the app, then start its generated Functions app. |
| PowerShell | Use the app's managed-dependency configuration. |
| Go | Use the installed preview tools; support depends on the app model and Core Tools version. |

Watch **Startup logs** on this page. Logs remain available after a failure;
scroll up to inspect earlier output, or open **Commands** for more detail.
Wait for the running status and function list before sending a request.
A printed URL alone does not mean the host is ready.

Missing local storage settings use Azurite (`UseDevelopmentStorage=true`).
An existing compatible emulator can be reused, or one is started for this run;
Azurite may be downloaded if needed. A reused emulator can contain existing
messages or blobs. Settings that point to cloud storage are kept, but require
manual review in VS Code before local startup.
Python trigger discovery ignores commented decorators and multiline string
examples; those do not require connection settings. Each Run inspects the saved
source again. A failed startup message remains until a new Run begins.

### Send a test request

After an approved customization, **Run and test** keeps the selected app,
language and bindings. The agent can hand off a small synthetic HTTP example
bound to that customization's source revision and exact function. After you
choose **Run**, the canvas checks it against the owned host's actual function
index and fills the function, method, route placeholders, query, safe headers
and **Message / JSON body**. JSON request bodies never go in **Route parameters**.
The host supplies the actual route; no endpoint is guessed.
**Run** still approves local startup; **Send** separately sends the test.

Your edited inputs and explicit function choice are not replaced by a late
example, status updates or navigation. Changed source, another app, reset or
a new customization invalidates old examples. If the function is ambiguous,
choose it explicitly; if no example is available, the canvas says which input
still needs review rather than inventing an application payload. No settings,
credentials or recorded request bodies are used for examples.

Once the app is running, select a function and fill in its request:

| Function | What you can send |
|---|---|
| HTTP | Choose the method, fill in route or query parameters and headers, and enter JSON or leave the body empty. Select **Send**. |
| Azure Storage Queue | Enter a message and select **Send**. It is sent to the binding's queue in Azurite. |
| Other event sources | Test from VS Code or the event source's own tools; this screen does not provide a sender. |

HTTP tests initially select POST when the function supports it; otherwise they
select the first advertised method. You can still choose GET when available.
Your choice stays selected during status and log updates while it remains valid.
An omitted method in a customization test example also defaults to POST.
Run's prepared invocation and request history use the selected method, not a
separate GET default. Body, header, route and query drafts are not changed by
method selection. Restarting the same endpoint or navigating between tasks
keeps an explicit method choice. Replacing a running host, selecting another
function, changing its URL, resetting the canvas, or opening a new app/project
revision resets the method to that function's default. Replacing the host
does not clear the request-body draft. Only supported methods are offered,
and changing the selection never sends a request.

Queue success means the message was enqueued, not that the function processed it.
Check the startup logs and the app's output to verify processing.
Starting the host does not automatically send an HTTP request or queue message.

Select **Stop** when finished. It stops processes started for this run, not
another app's emulator.

### If local startup or debugging needs more setup

Select **Open in VS Code** and use its Run and Debug view. Missing debug files
are prepared when you approve **Start**; existing files may need your own updates.
See the [VS Code guide](https://learn.microsoft.com/azure/azure-functions/functions-develop-vs-code).
For Java, replace `<function_build_path>` if it appears in the generated debug task.

Azurite emulates Storage Blob, Queue and Table, not every Azure event source.
For an unsupported source, use VS Code with the matching emulator:

| Emulator | Setup guide |
|---|---|
| Azurite | [Azure Storage emulator](https://learn.microsoft.com/azure/storage/common/storage-install-azurite) |
| Service Bus | [Service Bus emulator](https://learn.microsoft.com/azure/service-bus-messaging/overview-emulator) |
| Event Hubs | [Event Hubs emulator](https://learn.microsoft.com/azure/event-hubs/overview-emulator) |
| Cosmos DB | [Cosmos DB emulator](https://learn.microsoft.com/azure/cosmos-db/emulator) |

These have separate OS, container and API requirements and are not installed
automatically by the canvas. A failed local run does not prevent you from
reviewing deployment settings.

## Deploy to Azure

You can select **Ready to deploy** before running locally or after
a failed test. Opening the settings does not deploy. Review the subscription,
environment, location, template inputs, and cost acknowledgment, then select
**Deploy**. Deployment runs `azd up` and can create or update billable Azure
resources. Use **Stop** on the deployment page to request cancellation.

**Deploy** immediately changes to **Preparing deployment...** and locks the
reviewed inputs while settings and the deployment snapshot are checked. This is
preparation, not evidence that Azure deployment has started. State refreshes and
reopening the page retain the pending state; repeated activation does not submit
another deployment. A preparation rejection restores the form for review and
explicit retry. A lost response or unknown deployment outcome must be checked
before another deployment; recovering the display never retries it.

The deployment form uses one required acknowledgment for resource changes and
potential charges. Tool checks still run before deployment; use
**Browse > Check prerequisites** for setup help when a required tool is missing.

After a standard deployment fails, its message box explains the next step in
plain language and offers **Deploy with AI**. Expand **Error details** for the
safe technical failure context. **Deploy with AI** sends Copilot a request to review the
error and propose a recovery/deployment plan in chat, not to deploy or retry.
Changes, installation, sign-in and deployment still require separate approval.
The deployment log and settings remain available. Failure does not imply rollback
or that retry is safe. Unconfirmed chat delivery asks you to check chat rather
than sending again. This action is absent before deployment, while running,
after success or cancellation, and for another project's result.

### Recover a publishing-target failure

For a recognized azd target-discovery failure, **Recover publishing** retains the
original failed run. **Check existing resources** performs read-only checks for
up to 60 seconds. It requires an identifiable successful ARM deployment from
that run, the unchanged project and deployment snapshot, the original Azure
scope and environment, one Function service without azd hooks, and a unique
service-tagged Function App. It does not assume delayed tag visibility was the
cause. Missing targets, ambiguity, access errors and unsupported evidence stop
with separate outcomes; absent azd phase headings remain unknown.

Only verified recovery offers **Retry publishing to existing resources**.
Review and select its separate acknowledgment to run
`azd deploy <service> --environment <environment> --no-prompt` in the original
deployment snapshot. It does not repeat `azd up` or provisioning. Changing form
values, source, scope or snapshot invalidates recovery. **Stop** stops owned
local work and read-only waits; previously submitted Azure operations may continue.

If publishing may already have started, **Verify an existing publish** checks
publication history and the snapshot's expected function names independently.
Each failed run permits only one approved publish attempt; an uncertain result
must be reconciled rather than made retryable by another discovery check.
Copilot can request the same read-only check with
`reconcile_standard_deployment` using this standard run's exact `runId`,
`projectRevision` and `inputsRevision`; it cannot report a claimed success.
Missing publication evidence or unconfirmed function registration keeps the
outcome unknown. The original failure remains available after reconciliation.
Publication completion, function registration and actual invocation are separate:
recovery never invokes a function or runs a test. Unsupported deployment-history
APIs require investigation rather than a blind retry.

For Hosted Skills apps, **Plan deployment in chat** starts planning in
chat instead of showing the standard deployment form. Copilot collects
settings, checks model access and quota, and reviews resources and costs with
you before asking for approval to provision or deploy.

**Cancel deployment** uses the same cooperative stop flow as AI customization.
It is available while planning, waiting for approval, deploying or verifying.
The panel first shows **Cancellation requested** and waits for Copilot to
confirm that this run's in-flight work has stopped or settled. It does not stop
unrelated chat work, delete files or Azure resources, or roll back Azure changes.
An unconfirmed delivery remains pending and is not automatically retried.
After confirmation, the panel shows a cancelled notice and permits a new plan.
Check existing Azure operations and resources before approving another deployment.
Late progress or success reports cannot complete a cancelled run.

### Template inputs

Deployment inputs come from the project's `azure.yaml` and infrastructure
files. Required values and allowed choices are checked before `azd` starts;
blank optional values use the template defaults.

| Infrastructure | Input inspection |
|---|---|
| Bicep | Uses the installed Bicep compiler without restoring modules. If referenced modules are missing, restore them in a terminal, then select **Reload deployment settings**. An existing ARM JSON entry is also supported. |
| Terraform | Install [terraform-config-inspect](https://github.com/hashicorp/terraform-config-inspect) and add it to PATH. Inspection reads configuration; it does not run Terraform. |

If inspection fails, resolve the reported dependency or configuration error
and select **Reload deployment settings** above the fields. This rereads the
project configuration without deploying. Changes to infrastructure files require a
fresh input review before deployment.

Reloading keeps unsent template input drafts, including secrets, in the current
panel while inspection is loading or fails. When fields change, only drafts
whose name, type, security, binding and validation rules still match are kept.
Changed or new fields need review; removed fields are listed, and the cost
acknowledgment must be selected again. Selecting another project, selecting the
same project again, resetting the canvas or reloading the panel clears these
template drafts. Values are not stored in browser storage or the canvas model.

Successful deployment centers a theme-aware rocket illustration, an accessible
completion message, compact destination tags, and how to find the app in Azure.
The illustration and its subtle stars/flame scale together from 160 to 280 pixels,
with a height cap for shorter windows. The celebration plays once for less than
five seconds, then stays still without playback controls. Reduced-motion
preferences keep a complete static illustration; changing the preference or
receiving an unrelated update does not replay the celebration.
The redundant task heading is hidden only on completion. A direct
resource link requires a reported Function App resource ID and matching
subscription/cloud context; otherwise the panel offers the known cloud's
portal or finding instructions without guessing an app address. Deployment
completion does not verify the app's runtime health.
After a standard deployment succeeds, the canvas reads `azd show --environment
<environment> --output json` in that deployment's isolated snapshot. For one
unambiguous Functions service, it checks the exact returned resource with a
read-only Azure lookup before enabling the direct Function App link. The link
keeps the deployment's subscription and cloud, even if the settings selection
later changes. Missing or ambiguous resources, denied reads, changed scope, and
lookup timeouts retain deployment success but show an unverified-link notice
and the existing Portal/find-app guidance. No retry or redeployment starts.
The lookup does not read application settings or keys.
Hosted Skills keeps its separate planning, approval and deployment reports.
During planning, the agent reports the approved subscription, tenant and Azure
cloud with `deploymentScope`. That destination is frozen for the run rather
than borrowed from the standard deployment form. After a final verified
deployment report, the canvas independently checks the exact Function App
resource ID and frozen scope before offering its direct link. Denied or
unavailable link verification retains the reported deployment completion and
shows the known cloud's Portal or finding guidance; it never starts another
deployment. Changing projects invalidates the old result.
The standalone `azure-functions-deploy` and `azure-functions-hosted-skills`
skills also require a verified cloud-correct Function App Portal link in chat,
separately from app/chat endpoints and connector authorization links. A
standalone deployment does not create or update an unrelated canvas run.
Standard deployment shows three tasks: preparing Azure resources, packaging
the app, and deploying the app. These follow reported `azd` milestones, not a
percentage. Completed milestones do not confirm process success: the checklist
collapses only after a successful deployment exit. If `azd` omits a phase, its
task says **Not reported**, even when the overall deployment succeeds.
The same compact status row opens the task checklist and live command output;
expanding it starts no extra deployment or health check.
Hosted Skills keeps its separate agent-reported planning and approval flow.
The Azure resource or Portal destination is the primary completion action.
**Back to Home** opens the task chooser without resetting the selected project
or deployment result. Select **Deploy** through **Browse** to review settings
for another deployment. Reopening settings does not accept charges or start
deployment.

Deployment input overrides do not rewrite your original infrastructure files.
Use the secure input fields for secrets, not ordinary text fields or chat.
Some secret objects and computed file inputs need manual setup.

Use **Commands** to see deployment output and errors. A failed or cancelled
deployment is not shown as successful. Reviewing settings after a deployment
does not deploy again.

## Check and modernize an existing app

Choose **Modernize a function app → Scan your app**, then choose your target:

| Target | How to check it |
|---|---|
| Local | Use the current workspace or choose an absolute folder, then select **Open**. |
| GitHub | Choose the repository and branch, select **Open repository**, then **Scan your app**. |
| Azure | Select a subscription and Function App from the list. |

Findings show detected runtime, programming-model, lifecycle and configuration
issues. For local source, use **Change project** to select another project;
**Keep current project** returns to the existing results without changing it.

Local and GitHub checks inspect source without changing it. Azure checks read
the deployed app; they are not a way to recover its source repository.
Missing telemetry or denied access is not proof that an app is healthy.

| Check | Use it for |
|---|---|
| **Scan your app** | Known runtime, lifecycle, programming-model, and configuration rules. No AI is needed. |
| **AI Assisted** | A broader read-only assessment of the selected local project or Azure app. Select **Assess with AI** to send the request to chat. |
| **Deep Review** | A read-only review of trusted local or GitHub source and configuration. See below. |

The checks do not change files or Azure resources. See the
[check catalog](checks.md) for deterministic rules and the
[lifecycle data guide](lifecycle-data.md) for their data sources.

Windows Consumption is reported as a legacy hosting-plan recommendation,
not an end-of-life date. Linux Consumption retirement is a separate finding.
Moving a Windows app to Flex Consumption also requires moving it to Linux.

### Review source and configuration

Open **Deep Review** from **Jump to**, or choose it after opening a source
project. Review the source-trust notice, then select **I trust this project.
Continue** to start the AI review in chat.

Copilot reviews source and configuration for issues that the quick rules may
not cover. Findings return to the canvas. This can take longer and use more
AI tokens than a quick rule check.

Use this only for projects you trust. The review does not authorize edits,
project scripts or dependency installation. It reviews files on disk, not
deployed source in Azure. Treat findings as review input, not a guarantee
that the app has no issues.

### Act on findings

1. Select the findings you want to address and choose **Review proposed plan**.
2. Choose **Fix one at a time** or **Fix selected together** to request a plan in chat.
3. Review and approve the plan before Copilot changes files.
4. Follow **Agent progress**; open **Commands** for detailed activity.

After completion, return to Findings and scan again before selecting the next
change. A completed fix is not a fresh scan.

For a specific migration, use **Plan a supported change** in local results.
Review the scenario and its plan before approving changes. **Browse upgrade
options** is only a catalog: opening it does not start a migration, and
scenarios marked planned cannot run.

For Azure findings, remediation provides guidance rather than changing
deployed resources. A finding with a supported update scenario has a fix
badge; other findings may require manual work or an additional upgrade skill.

### Publish your changes

After a source fix, choose **Create PR** on the completion screen to ask
Copilot for PR assistance, or **Open in VS Code** to inspect the result yourself.
Neither action starts automatically.

For GitHub source, PR assistance continues in the selected repository's App
session. Review the diff, target branch and checks there. Approve a local
commit separately, then approve push and PR creation. **Review push and PR**
in the GitHub source controls also starts this publishing review.
The selected source branch is the PR base; changes use a separate working branch.

If publishing is not confirmed, check the existing request and GitHub operation
history before retrying. Lack of push access does not prevent local fixes.

## Open or monitor an app

**Open function app** selects a local function app project or GitHub source,
then offers **Add function** and **Customize with AI**. AI customization sends
an edit request to chat for review. Copilot checks the app's programming model,
binding extension, and hosting plan before proposing changes.
The **Open in VS Code** icon action has a tooltip and accessible name. It opens
the selected local project or verified GitHub worktree/app without applying the
Add function draft.

If a preview cannot provide complete file contents, editing and Add are blocked
with a restart message instead of showing an empty editor. Reopening a canvas
does not reload an already running backend. Before restarting Copilot, keep a
copy of the draft's function names and settings, then review the list again.

**Add function** uses item templates, not the whole-app starter catalog used by
Create. Choose a template, enter a unique function name and binding settings,
then select **Add to list**. Repeat **Add another function** to prepare a batch
(up to 30 functions). Edit or remove individual drafts, then select **Review
changes**. Only **Add N functions** writes the reviewed files. This does not
install dependencies, run project scripts, start a host, deploy, commit or
publish. Connection fields accept setting names, never secret values.
Blob, Queue and Table storage connection fields default to `AzureWebJobsStorage`
instead of the template's connection name. You can choose a different setting
name; existing drafts and app settings are not rewritten. This default does not
configure a storage account or grant access.
Review shows editable **complete final file contents**, including existing
source when appending functions. Source edits remain in the panel until you
select **Review source edits**, then separately **Add N functions**. Re-review
replaces the prior approval revision and permits changes only to files already
in that batch; paths cannot be added or renamed. Returning to function settings
and generating a new review regenerates the source previews. Edits are not
compiled or run during review. A changed app, target, or reviewed input still
requires a fresh batch review before any write.

Python v2 supports the main `function_app.py`, a new Blueprint, or an existing
Blueprint. Multiple functions can share a Blueprint. Review includes the import
and `app.register_functions(...)` when registration is needed; an existing
recognized registration is retained. Nonstandard Python object/import layouts
and Durable Python apps require VS Code rather than guessed source rewrites.

Node v4 item templates come from a commit-pinned official VS Code Azure
Functions source, because the verified Functions CDN catalogs do not contain
that programming model. Python v2 and legacy script templates use the official
extension-bundle CDN. Java uses the same pinned upstream snapshot. C# templates
come from the official Core Tools feed's matching item package; review requires
an installed .NET SDK and invokes it only against an isolated temporary
template folder, with all template post-actions removed. Package-reference
changes are included in review; dependency restore remains a separate Run
operation. Only missing dependencies for the selected C# templates are resolved to exact
stable package versions during review, not during catalog discovery.
The public template cache includes source and version information;
using an older verified cache after a fetch failure shows a warning. A missing
or mismatched catalog is an error, never a fallback to another programming model.

The Node v4 and Java snapshot is
[`a311e6f9`](https://github.com/microsoft/vscode-azurefunctions/commit/a311e6f9a6ce639b1fe74b259ff1b43bf69eef66).
This refresh includes the Blob metadata, Event Hub connection, Durable Entity
and MCP registration fixes in the Node template payload. The Java payload is
unchanged. Cache entries from the previous snapshot are not used for this pin.
Only template data is imported, not the upstream extension's command logic.
The installed Functions SDK check for MCP Resource and Prompt remains separate
work.

Node additions honor the app's entry point, TypeScript output layout and
supported VS Code function subpath. A single brace group preserves its shared
prefix and suffix. For example, with TypeScript `outDir` set to `dist` and
`rootDir` set to `.`, `dist/src/{index.js,functions/*.js}` adds a source file
in `src/functions` without changing the existing entry,
`package.json` or `tsconfig.json`. Node v4 item templates support `.js` runtime
entries and `.ts` TypeScript source files. Other module extensions, malformed
patterns and multiple function folders require VS Code rather than an unloaded
source file. Review remains read-only until the separate **Add** confirmation.
Ambiguous layouts and custom .NET project
or centrally managed package configurations require VS Code. Go item creation
is unsupported, matching the upstream extension.

For a monorepo, select the app explicitly. GitHub additions require the selected
app's verified isolated App worktree and change branch; they never write to the
source branch or this canvas session's unrelated project. Publishing retains
its separate review. If the selected target or a reviewed file changes, review
the batch again. A failed apply retains the actual file receipt, including
uncompleted or uncertain files; it does not automatically retry or roll back.

Task labels use **function app** for the whole app; **function app project**
identifies source files, not an already provisioned Azure resource. Individual
functions and runtime or dependency updates retain their own terminology.
Creation, file edits, local execution, and deployment remain separate actions.

**Monitor a deployed app** opens the Azure app list, health signals, and
diagnosis. Select a subscription and app, then use **Overview**, **Health**,
**Diagnose**, and **Findings**. **Back to list** keeps the last check summary;
refresh or recheck when you need current results. Navigation alone does not
change an app.

## Navigation and reset

**Jump to** opens the job list. Ctrl+J on Windows/Linux or Command+J on macOS
opens it from the keyboard. The header arrows return to earlier views
without repeating an operation. **Commands** shows progress and logs beside
the current job, or below it in a narrow window. Use **Translate** in the
footer to choose a language; the selection is saved for future sessions.

**Reset Canvas** in the footer offers reset and an optional
**Ask the agent to investigate** action. If you stop a prompt in the main chat,
use Reset Canvas to discard its remaining request tracking. Reset clears
the selection, inputs, results, logs and navigation, then returns Home.
It keeps project files, Azure resources, storage data, saved preferences and recent folders. Old progress,
findings and completion reports are rejected; no prompt is resent.
Reset does not stop chat, terminate a process, undo files or confirm that
an external operation stopped.

Read-only scans and prerequisite probes do not block Reset. Earlier scan results
cannot repopulate the cleared canvas. A completed local Health Check also updates
the selected project's health banner, including zero findings or a scan failure;
results for another project cannot replace the current project's summary.

If Reset is blocked, finish or stop the active operation, or optionally use **Ask the
agent to investigate**. An open folder picker, local host, app creation or
deployment can keep Reset unavailable. Investigating does not grant permission
to stop processes; review any proposed stop separately.

For an unconfirmed GitHub operation, expand **GitHub operations** and select
**Reconcile actual state** before retrying. A repository or remote branch may
already exist even if the response was lost. Reset does not delete them.

If the display disconnects, select **Reconnect display** in the inline warning
MessageBar, or press **Alt+Shift+R** while focus is inside the canvas. An open
dialog uses the same MessageBar without discarding its inputs. This reads
the latest app status without discarding requests or inputs. A blocked action
returns you to this reconnect control instead of asking AI to fix the connection.
If reconnection fails, the notice keeps the error and lets you try reconnecting
again; it does not retry an app operation. Already accepted requests remain
tracked until they settle.

The header Home action only changes the display and retains tracking.
Neither action restarts the provider, repeats work or changes Azure/sign-in.
Display connection and recovery messages appear below the task heading, aligned
with the task content on both pages.

## Troubleshooting

If the canvas cannot initialize, an independent recovery notice offers **Reload
display** and **Home**. Home only changes the display; it does not reset requests,
stop processes, repeat work or change Azure resources. If reloading still fails,
restart Copilot to reload the extension. Review outstanding operations before a
host restart; restarting is not confirmation that external work was cancelled.
Recovery loads independently of the page's module graph. The page entry remains
a static module, so document loading still waits for its controls to initialize.

The provider captures its HTML, scripts, styles and other static assets when its
server module loads. Running providers and newly opened panels from that provider
keep those same bytes even if source files change. Rebuild as appropriate and
explicitly reload the provider to review new code; reopening a panel alone does
not update the loaded provider.

| Problem | What to do |
|---|---|
| A required tool is missing | Open **Check prerequisites**, use **Help with setup**, then **Check again** after installing it. |
| No templates match | Change the selected language, infrastructure, or starter. Use **Reload list** if loading failed. |
| The destination folder is not empty | Choose a new app name or another location. Existing files are not overwritten. |
| The local host cannot start | Check **Commands**, language dependencies, build output, and required emulators in VS Code. |
| Java is installed but is not detected | Check JDK and Maven availability in a terminal, then restart Copilot after updating the environment. |
| **Send** is unavailable | Wait for the running status and choose a supported HTTP or Queue function. Check **Startup logs** if startup failed. |
| Go fails before running your function | Check the worker-start error in **Startup logs** and your Core Tools preview support; use VS Code for further diagnosis. |
| A GitHub repository is missing or cannot be opened | Check `gh auth status` and repository access. You can enter `owner/repository` directly if it is not listed. |
| A GitHub operation has an unknown outcome | Use **GitHub operations → Reconcile actual state** before retrying, so an existing repository, push or PR is not repeated. |
| An Azure app is missing or access is denied | Check `az login`, the selected subscription, and your permissions, then refresh the app list. The canvas does not grant access. |
| Deployment inputs cannot be read | Resolve the reported Bicep or Terraform inspection error, then select **Reload deployment settings**. |
| An AI creation message was deleted before it started | Use **Back to inputs** on the progress card to retry. This does not cancel chat messages or delete generated files. |

## Data and privacy

Azure checks use your Azure CLI sign-in. Runtime checks read the relevant app
settings; local rule checks inspect setting names rather than secret values.
Health signals come from Azure Resource Health and Application Insights for
the last 24 hours. Missing telemetry or access is not evidence of a healthy app.

Templates come from the official Azure Functions catalog. Lifecycle and rule
data ship with the plugin and can be refreshed from published sources. When a
refresh fails, the panel identifies the fallback data and the failure.

The plugin sends usage telemetry, including action and skill names,
outcomes, durations and, when available, your numeric GitHub user ID. It does
not send project paths, resource IDs, prompts, setting values, or text you
type as usage telemetry. AI reviews separately read the project context
needed for the requested task.
