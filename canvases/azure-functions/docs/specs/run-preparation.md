# Local Run and Invoke

This specification records the behavior approved for issue #568.
It applies to the Azure Functions canvas's local app workflow. It does not
authorize cloud deployment or change the Hosted Skills workflow.
Python selection and bootstrap have a separate specification in this directory.
Preserve subprocess, credential, package-index and environment-ownership
portability boundaries.

## RUN-001: Start from the requested operation

1. Opening Run, selecting an app or inspecting its environment is read-only.
   It must not install dependencies, change files, start services or send input.
2. Run starts the selected app's Host. It sends no test input.
3. Invoke starts a stopped Host when needed, then sends the selected function's
   test input once. A running, owned and verified Host is reused.
4. Required preparation is part of Run or Invoke. The user must not complete a
   separate Local preparation or Apply workflow first.
5. Run and Invoke automatically perform supported required preparation and
   applicable fallback. There is no routine Approve and run or Approve and
   invoke step for dependencies, builds or local services.
6. The user's entry route determines the settings rule. Create a function
   needs no settings confirmation or backup, even when its generated settings
   file already exists. Open an existing requires confirmation and backup
   before changing an existing `local.settings.json`. Opening a previously
   created app through Open an existing uses the existing-app rule. Template
   metadata does not grant permission or change this rule.
7. The existing-settings confirmation says only that the current settings
   prevent local startup and asks to back up and update that file. Show the
   necessary setting changes, not unrelated dependency commands or a
   "No settings changes needed" section. No confirmation is shown when the
   existing file needs no change.
8. Confirmation is bound to the app, project revision, source, settings and
   exact proposed update. Preserve unrelated settings and comments. Save and
   verify the original file before updating it; backup failure prevents the
   update. Keep the backup local, protected and excluded from Git and
   deployment. Never expose its secret contents in logs or model context.
   Store each backup with a unique name under the app's
   `.local-settings-backups/` directory; do not overwrite prior backups.
   Missing settings may be created automatically with safe exclusions.
9. Confirmation continues the original Run or Invoke without another click.
   Replaced confirmations, external edits and duplicate submissions cannot
   start or send work using old authority. Required dependencies, builds, safe
   exclusions and missing local Blob containers use supported bounded
   preparation. Local services use the verified runtime definition and its
   applicable product-use notice.
10. Accepted preparation and startup return an operation ID without waiting for
   the Host or invocation result. The canvas tracks the same owned operation
   through progress, failure and completion. Reloading or reconnecting must not
   start another Host, repeat a settings update or send the input again.

## RUN-002: Multiple functions and shared services

The selector lists each function with its trigger type. HTTP shows method,
route, query, headers and body. Timer shows test input and separate schedule
controls. Queue shows its message. Blob/Event Grid shows sample-file controls.
Existing Event Hubs, Service Bus and Durable support remains available.
Unsupported local bindings use explicit VS Code guidance, not a substitute
trigger or cloud service.

Run starts one shared app Host, not a Host per selected function. All listeners
can start. Timers and existing events can invoke other functions independently
of a test. Invoke sends test input only to the selected function or its binding;
it does not guarantee that the app's other functions stay idle.
Preparation must identify failures in services required by any app binding.

Valid explicit HTTP methods and per-function message, route and header drafts
survive rerenders and ordinary stop/start. Omitted methods prefer POST when
supported. With no explicit selection, initial HTTP function selection prefers
a POST-capable function over a GET-only function. Preserve trusted explicit
test requests, Durable starter selection and non-HTTP trigger selection.
GET-only functions remain GET-only; do not change their bindings or send POST
to them. Source-derived examples do not change bindings or send input.
Read `.http` examples in the selected app's source folders as well as root
`test.http` files. For example, the TypeScript HTTP starter keeps its POST
JSON body in `src/functions/test.http`. Match the example's local URL and
method to the selected function. Do not copy examples from another app or
include credentials. An edited example changes the source revision; preserve
the user's existing request draft.
The frozen invocation is checked against the Host's actual index after startup.
Keeping a draft does not retain authority over an old app or run.
Invoke remains available for a valid supported selection before Run. It starts
the Host when needed, completes preparation and verifies readiness before
sending once. This is not permission to send while startup is still pending.

## RUN-003: Progress, errors and cancellation

Run and Invoke open Logs and results before preparation. Confirmation and execution
keep that panel open unless the user closes it. Later events do not force it
open again. Preparation logs are retained through Host startup.
Open in VS Code, Run help, results and deployment navigation remain available.

Show inspection, settings confirmation when required, preparation, Host
readiness and invocation separately.
Readiness requires an owned live worker, verified Host status and a nonempty
function index. A printed URL is not readiness.

A required Docker executable, engine, image or capacity failure stops the
operation and reports its cause. No automatic Docker installation, sign-in,
policy change, cloud substitution or test resend is allowed.
Docker is required only by bindings that need Docker-backed services.
Read-only Check again does not restart or send.

Overlapping read-only checks for the same project revision and selected app
share the in-flight preparation. Opening Run while that check is active must
not produce "The Run target changed" or fail a newer Run request. This is not
a persistent readiness cache: later operations still check current files.
A real project or app change invalidates the old check, waits for its owned
inspection to settle and rejects its late result. An old failure must not
replace the new app's state.

Cancel at the settings confirmation does not update the settings, start the
Host or send input. Cancellation during
preparation stops new work after in-flight work settles; it is not rollback.
Keep applied changes and report partial results. Stop shuts down only the owned
Host and then releases managed service leases. Borrowed services, images and
saved data are kept. Failed cleanup retains ownership and permits Stop retries.
Leaving Run must resolve pending work and stop the owned Host before navigation.
Reset and target changes cannot bypass an active operation.

## RUN-004: Invocation evidence

Host readiness, request acceptance and completed execution are different results.
HTTP shows the actual transport response. Durable observation uses the retained
instance receipt. Blob and Event Hubs use their existing correlated output proof.
Queue and Timer acceptance alone does not prove completion. Generic correlated
completion for these triggers is not established by this specification.
Show accepted, processing, failed or unknown honestly when complete evidence
is absent. Do not report another function, an earlier event or enqueue as this
request's completion. Unknown delivery must never trigger an automatic resend.

## RUN-005: Automatic preparation and existing-settings confirmation

Inspection covers the selected app and all required bindings, not only the
selected function. Run and Invoke use the same rules. Ordinary preparation is
automatic. A settings confirmation is a pre-start check, not a report of a
Host failure. Only Open an existing updates to an existing settings file need
that confirmation and backup; Create a function needs neither.

| Condition found before startup | Automatic action or settings update | Boundary |
| --- | --- | --- |
| Worker setting differs from the app's language | Set `FUNCTIONS_WORKER_RUNTIME` to the detected app worker | Confirm and back up an existing file only for Open an existing. Do not change the app's language or source. |
| `local.settings.json` or required local binding settings are missing | Create the local settings file or add the missing keys | Keep unrelated settings and comments. Do not change Azure app settings. |
| An existing connection setting differs from the verified local service | Replace the specific connection key | Include the replacement in the existing-settings confirmation when required. Do not use the old cloud connection as a fallback. |
| Identity-based connection keys conflict with a local connection | Remove the conflicting `<connection>__...` keys | Include the removals in the existing-settings confirmation when required. Do not remove unrelated identity settings. |
| Declared dependencies or required build outputs are not ready | Restore declared dependencies and run the supported language build automatically | Show progress and retain command output in logs, not a routine approval. Reuse verified dependencies. Do not install a global SDK or add a new dependency declaration. |
| A newly created local settings file needs exclusion from Git or deployment | Add `local.settings.json` to the necessary `.gitignore` and `.funcignore` files | Keep existing exclusions. Optional VS Code debug files and canvas markers are not readiness requirements. |
| Supported local Blob/Event Grid input or output containers are missing | Check local storage and create only missing required containers automatically | Use the verified local storage profile. Keep existing containers and data. Defer creation until storage is ready. |
| The required canvas-local Azurite package is missing | Install the supported pinned package in the canvas-owned location automatically | Retain progress and failures. Do not replace a user's global installation or change a borrowed service. |

An existing-settings confirmation must cover every required replacement and
removal. A declined or stale confirmation cannot authorize a settings write,
Host startup or test send. An automatic step must not bypass blocked input,
ownership, authentication or policy boundaries. Report unresolved failures
with the necessary recovery action, not another general preparation approval.

Do not rewrite an existing settings file merely to normalize its format.
Malformed, encrypted, duplicate-key, case-conflicting or non-string settings
are blocked cases under RUN-006, not automatically repairable settings.

Python interpreter selection, uv preference and Python/pip fallback have a
separate specification. Run and Invoke use that supported automatic fallback;
this specification does not introduce another bootstrap policy.

## RUN-006: Other errors and recovery

Report the stage that failed and the available cause. Failures of a requested
Run or Invoke, including inspection failures before a subprocess starts,
remain in Logs and results.
Do not report failure as an empty successful result. Keep drafts, approved
changes and partial results. Logs must retain the existing secret and path
redaction.

### Blocked during inspection

| Condition | User recovery | What the canvas must not do |
| --- | --- | --- |
| No app selected in a multi-app workspace, or ambiguous project/build output | Select the exact Function App or use Open in VS Code to resolve its build configuration | Guess an app, language, framework or output folder |
| Core Tools v4 or a required language/build tool is missing or incompatible | Use Check prerequisites or Run help; install or repair the tool separately, then inspect again | Automatically install a global tool, sign in or change machine policy |
| Settings are invalid, encrypted, unsafe, case-conflicting or have unsupported value types | Open the preserved file in VS Code and correct its format or use a valid unencrypted local file | Replace the file with defaults or discard its values |
| Process environment overrides a required connection or identity setting | Correct the environment outside the canvas; make the corrected environment available to the execution host, then inspect again | Rewrite the process environment or assume a file change overrides it |
| An existing Python environment, dependency marker or prior Run lock cannot be verified | Repair or select the environment in VS Code; for an ownership lock, stop the owning run or inspect the exact app's processes if its session was lost | Delete an unverified environment or lock, kill another process, or claim orphan recovery |
| Unsupported binding, custom runtime or parent package workspace | Use VS Code and the matching test service or the owning package workspace | Substitute a different trigger, run an app-level install from the wrong workspace, or use Azure as a local fallback |
| Docker, its engine, a required image, capacity or a service configuration is unavailable | Follow the reported cause and relevant Run help guide; repair the external prerequisite, then inspect again | Install Docker, bypass policy, authenticate, or silently use another runtime/image/service |
| Existing storage or emulator access/health cannot be verified, or retained resources/ports conflict | Inspect the reported service, credentials or ownership; resolve the conflict and inspect again | Treat denied access as readiness, stop a borrowed service, delete saved data or replace a retained resource to bypass the conflict |

Check again performs only bounded read-only inspection. It is shown for
preparation inspection failures; Check prerequisites and Run help remain the
tool guidance routes. A successful check does not approve writes, start the
Host or send input. After the cause is resolved, Run or Invoke is a separate
explicit action, with a new settings confirmation only if required.

### Failure during preparation, settings update or startup

| Condition | Operation result and recovery |
| --- | --- |
| Package registry, proxy, certificate, restore or build failure | Use an applicable supported fallback automatically. If it also fails, or none applies, report the failed stage and recovery action. Keep settings and exclusions already applied. Correct the cause, then explicitly request Run or Invoke again. No unlimited retry, test resend or package-index policy bypass. |
| Existing-settings backup fails or cannot be verified | Report the backup failure and keep the original settings unchanged. Do not start or send with the unapproved update. Resolve the local file or permission cause before requesting a new update. |
| Source, dependencies, settings, environment, allocation or confirmation changed after inspection | Reject stale authority before the next affected step. Keep external edits and completed changes. Inspect the current app and request a new operation, with settings confirmation only if required. |
| Local image pull, container/service startup, health or Blob creation fails | Report the actual failed stage. Keep partial resources and ownership until cleanup is confirmed. Resolve the cause and any owned cleanup before a new Run or Invoke. No cloud substitution. |
| Host exits, times out, has no usable active function index, or its worker/identity cannot be verified | Report startup failure; Invoke sends no test input. Use logs or VS Code to diagnose. Stop any retained owned runtime before requesting another operation. A printed URL is not success. |
| Stop or lease release is unconfirmed | Keep ownership and the Stop action available. Retry the owning Stop or inspect the exact remaining resources using the reported guidance. Block another Run, Reset and departure until cleanup is confirmed. Do not claim rollback or full cleanup. |

### Invalid input, execution failure and unknown delivery

| Condition | Operation result and recovery |
| --- | --- |
| Invalid method, route/body/header input, unsupported selection or old run ID | Reject the request before the affected transport. Correct the draft or use the current app/run. Do not guess a method or send to a different function. |
| HTTP returns an error response | Show the actual status and response for that request. Diagnose the function or request through its response and logs. An HTTP response proves a response was received, not that the business operation succeeded. |
| Transport fails or times out without a confirmed response | Show failed or unknown according to the available delivery evidence. The request may have reached the function. Check its result before an explicit new submission; do not resend automatically. |
| Queue, Timer or another asynchronous operation is accepted without correlated completion evidence | Show acceptance and unconfirmed/processing/unknown execution as supported by the transport. Inspect execution evidence; do not mark another function's log as this request's success. |
| Durable status observation fails after a starter receipt was retained | Keep the original instance receipt and reconcile that instance. Do not submit the starter again merely to obtain a status. |
| The owned Host, function index, app or settings changed before a later Invoke | Reject use of the old authority. Stop and inspect the current app, then request a new operation with settings confirmation only if required. |
| Panel reloads or communication state becomes unknown during an operation | Recover the retained operation and request result when available. Do not restart, reapprove, resend or announce a stop solely because the display changed. Unknown state is not permission to retry. |

These recovery instructions do not authorize a deployment, machine-policy
change, external authentication or data deletion. Ask the user before a
separate action that needs permission. Cancellation and reset retain the
boundaries in RUN-003; neither is an implicit rollback.

## Verification boundaries

| Controlled state | Action | Observable result |
| --- | --- | --- |
| Usable app, stopped Host | Run directly | Owned Host ready with an actual nonempty index; no test request |
| Usable app, stopped Host | Invoke directly | Host verified, selected request sent once, actual result recorded |
| Create-route app with generated settings needing changes and missing dependencies | Run or Invoke directly | Automatic settings/dependency preparation without confirmation or backup; original operation continues |
| Open-existing app with ready settings but missing dependencies | Run or Invoke directly | Dependencies prepared without settings confirmation or backup |
| Open-existing app with wrong worker and conflicting identity keys | Confirm the specific settings update | Original bytes retained in a protected backup; unrelated values/comments preserved; original operation continues |
| Open-existing settings needing an update, backup write fails | Confirm the update | Original file unchanged; explicit failure; no Host startup or test send |
| Previously created app reopened through Open an existing | Confirm a required settings update | Existing-app confirmation and backup apply regardless of template metadata |
| New local settings and existing exclusion files | Run or Invoke directly | Settings created and excluded from Git/deployment; existing exclusions retained |
| Supported primary preparation fails, fallback succeeds | Run or Invoke directly | Fallback progress retained; Host becomes ready without another approval |
| Preparation and applicable fallback fail after settings were applied | Inspect result, then explicitly request another Invoke after correcting the cause | Failure and logs retained; no automatic send; preserved settings are reused |
| Open-existing app needing settings changes | Cancel the settings confirmation | Settings unchanged, no Host started, no test input sent |
| Source or settings changed after settings confirmation was requested | Confirm the old update | Explicit stale failure; no startup or test send |
| Required Docker unavailable or startup fails | Run or Invoke | Explicit failure and logs; no successful invocation |
| Active preparation or startup | Cancel, Stop, duplicate click or navigation | No new send; ownership and partial results remain explicit |
| Mixed triggers and edited drafts | Switch functions, rerender and stop/start | Correct trigger inputs, retained valid drafts, shared Host |
| GET-only and POST-capable HTTP functions, no explicit selection | Open Run and inspect selection, then Invoke | POST-capable function selected and POST sent once after verified readiness |
| Explicit GET-only function choice | Rerender, then Invoke | Choice retained; GET sent, binding unchanged |
| Broker or Timer accepts input without completion evidence | Invoke | Acceptance is shown, not completed execution; no automatic retry |

Use controller tests for route-specific confirmation and state safety,
filesystem tests for backup bytes and failed-write preservation, the real runtime with
controlled process/transport boundaries for readiness and sending, and browser
tests for settings confirmation, keyboard, drafts, logs and layout. Repeat affected browser
checks with fresh emitted assets under CSP. Synthetic tests do not certify a
native host, real Docker engine or live Azure resources.
