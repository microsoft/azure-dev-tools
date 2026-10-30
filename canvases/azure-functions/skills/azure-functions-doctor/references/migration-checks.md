# Migration Doctor Checks

Load this file only for a project whose detected programming model already
matches a migrated state that `azure-functions-update` tracks (for example,
`dotnet-isolated`). Detect the programming model the same way you do for every
analysis (see `SKILL.md`, step 2).

## Update scenario drift

| ID | Check | Fail | Warning |
|----|-------|------|---------|
| `MG-001` | A migrated project's current target framework is a framework that the matching update scenario validated | - | The framework is not in `validatedFrameworks` |

### MG-001

`azure-functions-update`'s scenarios test their Definition of done only against
the target frameworks in `validatedFrameworks`, in
[scenarios.json](../../azure-functions-update/references/scenarios.json). A
separate tool (for example, a `.NET` upgrade agent) can change the project's
target framework without going through that scenario. When it does, build,
test, host start, and end-to-end evidence for the new framework does not
exist yet.

1. For a C# project, read `<TargetFramework>` (or `<TargetFrameworks>`) from
   the Functions project file.
2. In `scenarios.json`, find the scenario whose completed state matches the
   detected programming model (`dotnet-isolated` for the isolated worker
   model). Read its `validatedFrameworks`.
3. If the project's framework is not in that list, and the scenario has a
   `frameworkRevalidationSection`, report a `recommended` finding. Point the
   user to that section in the scenario's `reference` file. Do not restate
   the section's steps or the Definition of done IDs here: read them from the
   reference file when you act on the finding.
4. Skip this check when the scenario has no `validatedFrameworks`, or has
   `validatedFrameworks` but no `frameworkRevalidationSection`.
