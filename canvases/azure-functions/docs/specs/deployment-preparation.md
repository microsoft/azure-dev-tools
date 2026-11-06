# Deployment preparation

## What happens when Deploy opens

The canvas reads the selected project's deployment inputs. This does not start
an Azure deployment. Bicep preparation can restore required modules once under
the [Bicep recovery contract](bicep-recovery.md).

The subscription selector uses the current Azure CLI default when no target or
manual choice exists. This must work while deployment inputs are still loading.
The compiler does not need the subscription selection, so these two read-only
checks do not block each other.

## Selection rules

Use only a unique, enabled AzureCloud default in the verified current account
snapshot. The server validates the profile revision and selected identity.
Do not use the first row as a fallback, sign in, switch cloud or change the CLI
default.

A manual choice has priority over automatic initialization, including while
input inspection runs. Completion or failure of inspection must not replace
that choice. Refresh and navigation keep the existing choice. Reset permits
new initialization when the selector next becomes visible.

## Errors and deployment approval

Show an unavailable or stale account explicitly. Keep the existing fields and
drafts while deployment inputs load or fail. Reload deployment settings reads
the infrastructure again; it is not an account refresh or a deployment retry.

Input preparation, successful module restore and subscription initialization
do not grant deployment approval. Deployment still requires its separate
confirmation and current project/input revisions. No preparation error starts
Azure provisioning or repeats an earlier deployment.

## Regression proof

Hold input inspection at a controlled boundary. Open Deploy and observe the
validated CLI default before releasing inspection. Choose another subscription,
complete inspection and observe that the manual choice remains. Verify that
no deployment started. Separately cover stale profiles and overlapping manual
and automatic choices.
