---
name: azure-functions-assess
description: "Placeholder. Assess an Azure Functions project or Function App for unsupported or end-of-life runtimes, deprecated programming models, extension bundles, hosting plans, and code or configuration that should move to a supported target. Read-only. Use when the Azure Functions canvas asks for an AI assessment, or when the user asks to assess migration needs."
---

# Assess Azure Functions

Placeholder. The owner writes the full workflow. Do not treat this file as
complete guidance. Reply in the user's language unless they request another
language.

## Scope

This skill is read-only. Do not edit files, do not change Azure resources, and
do not run commands that change state. Do not read, print, or send secret
values. For `local.settings.json` and app settings, report key names only.

Assess these areas:

1. Runtime and language versions that are unsupported or have an end-of-life date.
2. Programming models that are deprecated (for example, the .NET in-process model,
   the Python v1 model, and the Node.js v3 model).
3. Functions host version and extension bundle ranges in `host.json`.
4. Hosting plans and SKUs that are retired or scheduled for retirement.
5. Code and configuration that should change before or during a migration.

## Lifecycle dates

Use the lifecycle data for end-of-life dates. Each entry has an official
source. This skill and the canvas use the same data.

1. Read the published copy:
   `https://raw.githubusercontent.com/microsoft/azure-dev-tools/main/data/azure-functions/lifecycle.json`.
2. Compare its `checkedOn` with the bundled
   [lifecycle.json](references/lifecycle.json). Use the file with the later
   date. If you cannot read the published copy, use the bundled file.
3. Say which file you used and its `checkedOn` date.

- Language versions: the live source is the Azure `functionAppStacks` API
  (`GET https://management.azure.com/providers/Microsoft.Web/functionAppStacks?api-version=2023-12-01`,
  which needs `az login` but no subscription). When you can read it, prefer it
  to the snapshot, and say which one you used.
- Programming models, host versions, extension bundles, and hosting plans:
  the API does not give these. Use the file, and check the linked source page
  when a date is near or when `checkedOn` is old.
- A null `end` means that no official date is confirmed. Do not invent a date.

To update the file, change the dates, the sources, and `checkedOn` together.
Do not change the published copy from this skill.

TODO(owner): add the rule catalog for code and configuration changes in each area.

## Output contract

Return each finding as one object that matches the schema in
[finding-schema.json](references/finding-schema.json).

- Give evidence for each finding: a file and line, or an Azure resource property.
- Set `deadline` only when an official source gives a date. Otherwise set it to null.
- Set `remediation.type` to `update-scenario` only when an `available` scenario in
  `azure-functions-update/references/scenarios.json` applies to the finding, and set
  `remediation.scenarioId` to its `id`.

When the Azure Functions canvas started this assessment, send the
findings back to the canvas with `invoke_canvas_action`, action
`submit_findings`, and input `{ "requestId": "<exact requestId from the panel prompt>", "findings": [ ... ] }`. Check `get_state` first: `ai.requestId`, target and target revision must still match. Stop on a stale request or rejected report. Do not send more than
50 findings. Put the most severe findings first. When no canvas started the
assessment, show the findings in chat as a table, with the most severe first.

TODO(owner): define how to assess a deployed Function App together with its source.
