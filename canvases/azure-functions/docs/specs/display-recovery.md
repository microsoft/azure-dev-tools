# Progress and display recovery

## Normal waiting is not a connection failure

Template creation, app inspection and local preparation can take time.
Keep their normal progress in the task and logs. Elapsed time alone must not
show a warning or ask the user to reconnect.

After destination and template validation, panel creation returns an accepted
operation ID, or the AI creation run ID, without waiting for initialization.
The server retains the work and reports completion or failure through state.
Acceptance is not success. Do not initialize the template twice, send the AI
request twice or release Reset while the owned work is still active.
The creation result becomes complete only after its file preparation finishes.

For another action whose HTTP response is still pending, check current server
state at the response deadline. If the display is verified and the exact action
is still tracked, keep waiting without a warning. A delayed response must not
cancel backend work.

## When a warning is needed

Show a warning for an actual response loss, an unresponsive state read,
an event-stream failure or an unconfirmed action outcome. Keep the existing
display-epoch fence. A successful state read alone cannot remove that fence
or authorize a retry.

Reconnect reads current state and reconciles accepted pending work. It does
not reset the app, stop a process, restart creation, resend input or deploy.
Once the display is verified and pending recovery is complete, remove the
old warning. Keep operation failures on their own task error surface.

## Regression proof

Use a controlled clock for deadlines and explicit gates for pending work.
Verify that an accepted action remains quiet beyond the response deadline,
then complete it and observe its actual saved result. For template creation,
observe the accepted response before releasing initialization and the completed
files afterward. Separately verify that an undelivered request and a real
disconnect still require reconciliation. Do not use fixed browser sleeps.
