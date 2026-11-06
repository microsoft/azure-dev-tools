# Bicep module recovery

Related issue: #577.

## Contract

Deployment input inspection first runs the installed Bicep compiler with
`build --stdout --no-restore`. Cached projects need no recovery.
Missing modules can cause BCP190 and dependent BCP104 or BCP062 errors in the
same compilation. These errors permit one recovery attempt, including when
only the dependent errors are reported. Other module-load errors or an
unclassified compilation failure also permit that attempt. A definite
unrelated compiler error, such as BCP037 without a module error, does not.
Cancellation, a missing executable or a terminated compiler does not start
restore. A mixed module/configuration failure still fails if reinspection
reports an error.

A user-selected Deploy task or Reload deployment settings operation in the
panel authorizes one bounded module restore as part of that preparation.
An explicitly confirmed Deploy operation also permits this preparation.
Opening Home, read-only model actions, and display-history restoration do not
authorize downloads. An unapproved inspection reports that the user must reload
deployment settings in the panel. Azure resource creation and update retain
their separate deployment confirmation and input-revision checks.

## Recovery

- Use the actual entry from `azure.yaml` (`infra.path` and `infra.module`).
  Retain project containment and file-loading checks.
- Use the same installed compiler, working directory and captured environment
  for inspection, restore and reinspection. Keep the user's cache, proxy,
  certificate and authentication configuration.
- Run `restore <entry>` once without force refresh, with a 120-second limit.
  Reinspect with `--no-restore`, with a 60-second limit per compilation.
  Do not install a compiler, sign in, change source files, or clear caches.
- Check operation ownership and infrastructure inputs before commands and
  after restore. Changed inputs require review; old results cannot update a
  new project. Concurrent input operations cannot start another restore.
- Cancellation prevents further commands or deployment. Finish the owned
  inspection before completing shutdown or a project change. Keep downloaded
  cache entries; cancellation does not imply cache rollback.

## User experience and diagnostics

Keep the existing UI. Recovery uses the existing settings-loading state.
Successful recovery does not add a message, control, or approval dialog.
Keep subscription, environment, location and parameter drafts.
Settings preparation does not start deployment.

Keep a bounded record in the existing **Commands** panel for the selected project:
initial compilation, authorization, restore, recompilation, cancellation and
stale inputs. Each command record identifies its stage, safe command shape,
project-relative entry, exit code when available, operation ID and timestamp.
Compiler errors include their BCP code, project-relative file, line, column
and bounded redacted message. Preserve the initial failure even when recovery
succeeds. The error card names the remaining BCP codes and points to the log.

Never record source literals, absolute or outside-project paths, registry
URLs, credentials, raw command output or raw exceptions. Redact quoted
compiler values as well as credential-bearing text. Usage telemetry must not
receive compiler diagnostics. The model must not receive raw payloads.

If recovery cannot complete, use the existing error surface with a safe cause
and next action. No automatic loop or success fallback. UI changes require a
shared image before implementation.

## Acceptance

Through the production command boundary, verify cold and warm caches, an
alternative infrastructure entry, denied authorization, cancellation, restore
failure, unrelated and mixed compiler errors, failed reinspection, changed
inputs and concurrent requests. Observe cache files, returned input metadata,
preserved source files, state transitions and absence of deployment.

Verify panel authorization and continuation against the built package as well
as source. Real-registry and OS-specific checks must be identified separately
from controlled command fixtures; a fixture does not prove live registry access.
