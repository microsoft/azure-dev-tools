# Lifecycle data and rule data

The rule-based checks and the Functions skills use two data files. The rule code has no
copy of the values in these files. When a value changes, update only the data
file. Do not change the rule code.

To see which check uses which value, read [checks.md](checks.md). It lists
every check and its data entry.

## What to update, and where

All paths are relative to `canvases/azure-functions`.

| When this changes | Update this file | Update this field | Official source | `data:check` compares it |
|---|---|---|---|---|
| End of support for the .NET in-process model | `skills/azure-functions-assess/references/lifecycle.json` | `programmingModels.dotnet-in-process.end` | [Migrate to the isolated worker model](https://learn.microsoft.com/azure/azure-functions/migrate-dotnet-to-isolated-model) | Yes |
| End of support for other programming models (Node.js v3, Python v1) | `lifecycle.json` | `programmingModels.<id>` | The `source` of the entry | No |
| Retirement of a hosting plan (Linux Consumption) | `lifecycle.json` | `hostingPlans.linux-consumption.end` | [Linux Consumption retirement](https://learn.microsoft.com/azure/azure-functions/consumption-plan) | Yes |
| The host-version-specific Linux Consumption stop date (apps still on runtime `~3`) | `lifecycle.json` | `hostingPlans.linux-consumption.runtimeStop` | [Linux Consumption retirement](https://learn.microsoft.com/azure/azure-functions/consumption-plan) | No |
| End of support for a Functions host version | `lifecycle.json` | `hostVersions.<version>` | [Runtime versions](https://learn.microsoft.com/azure/azure-functions/functions-versions) | `~1` only |
| A new extension bundle major version | `lifecycle.json` and `skills/azure-functions-doctor/references/rule-data.json` | `extensionBundles` and `extensionBundle.range` | [Bundle index](https://cdn.functions.azure.com/public/ExtensionBundles/Microsoft.Azure.Functions.ExtensionBundle/index.json) | Yes |
| Language version end-of-life dates | Nothing. The panel reads the Azure `functionAppStacks` API. Update `lifecycle.json` `languageVersions` only to refresh the offline fallback. | `languageVersions.versions.<language>` | `functionAppStacks` API | No |
| A deprecated app setting | `rule-data.json` | `deprecatedSettings.settings` | [App settings reference](https://learn.microsoft.com/azure/azure-functions/functions-app-settings) | Yes |
| The Flex Consumption setting table | `rule-data.json` | `deprecatedSettings.flexConsumption` | [Flex Consumption plan deprecations](https://learn.microsoft.com/azure/azure-functions/functions-app-settings#flex-consumption-plan-deprecations) | Yes |
| Application Insights setting names | `rule-data.json` | `applicationInsights` | [App settings reference](https://learn.microsoft.com/azure/azure-functions/functions-app-settings) | Yes |
| Python package names or `.funcignore` exclusions | `rule-data.json` | `python`, `pythonWorkerPackage` | [Python developer reference](https://learn.microsoft.com/azure/azure-functions/functions-reference-python) | Yes |
| The Go worker minimum Go version | `rule-data.json` | `go.minimumVersion` | [Go worker go.mod](https://github.com/Azure/azure-functions-golang-worker/blob/main/go.mod) | Yes |
| An update scenario is added, or a planned scenario becomes available | `skills/azure-functions-update/references/scenarios.json` | `scenarios[].status`, `reference`, `skill`, `from` | The `azure-functions-update` reference file, or the external skill | No. `check-catalog.test.mjs` checks it against `docs/checks.md` and the update skill |
| File names that can contain secrets | `rule-data.json` | `secretFiles.files` | No full source (`heuristic`) | No. Review it when it is `STALE` |
| The recommended `WEBSITE_RUN_FROM_PACKAGE` value per hosting plan | `rule-data.json` | `deploymentMethod.recommended` | [Zip deploy for Azure Functions](https://learn.microsoft.com/azure/azure-functions/deployment-zip-push) | Yes |

After each change:

1. Set `checkedOn` to today in the entry that you changed and at the top of the file.
2. Run `npm run data:check` and `npm test`.
3. Merge the change, then copy the file to `microsoft/azure-dev-tools` (see
   [Update the data](#update-the-data)).

Existing apps get the new value from the published copy within 24 hours. They
do not need a plugin update.

| File | Content | Used by |
|---|---|---|
| `skills/azure-functions-assess/references/lifecycle.json` | End-of-life dates: programming models, host versions, extension bundles, hosting plans, and the language fallback | Project health and Azure app assessment, `azure-functions-assess` |
| `skills/azure-functions-doctor/references/rule-data.json` | Rule values: deprecated app settings, the Flex Consumption setting list, the extension bundle range, Application Insights setting names, Python package names and `.funcignore` exclusions, the Go minimum version, secret file names, and the recommended `WEBSITE_RUN_FROM_PACKAGE` value per hosting plan | Project health and Azure app assessment, `azure-functions-doctor` |

Each `rule-data.json` entry has these fields:

- `source`: the official page or file that gives the value
  (`https://learn.microsoft.com` or `https://github.com`).
- `checkedOn`: the date that a maintainer last compared the value with the
  source.
- `kind`: `official` (the source gives the full value) or `heuristic` (no
  source gives the full value, so a maintainer must review it on a schedule).

## Where the panel gets the data

| Part | Source | Refresh |
|---|---|---|
| Language versions | Azure `functionAppStacks` API, live | Every 7 days |
| Programming models, host versions, extension bundles, hosting plans, and the language fallback | Published copy of `lifecycle.json` | Every 24 hours |
| Rule values | Published copy of `rule-data.json` | Every 24 hours |
| All parts, when a source is not available | The copy in the plugin | Plugin release |

The published copies are at:

- `https://raw.githubusercontent.com/microsoft/azure-dev-tools/main/data/azure-functions/lifecycle.json`
- `https://raw.githubusercontent.com/microsoft/azure-dev-tools/main/data/azure-functions/rule-data.json`

- The panel uses a published copy only when its `checkedOn` is the same as or
  later than the copy in the plugin.
- HTTP 404 is normal before the first publication. The panel then uses the
  copy in the plugin and shows no error.
- The panel validates each file before it uses it (`validateLifecycleData` in
  `src/shared/lifecycle.mjs` and `validateRuleData` in
  `src/shared/rule-data.mjs`). A file that is not valid is not used, and the
  panel shows the error.
- To test a new file, set `AZURE_FUNCTIONS_LIFECYCLE_URL` or
  `AZURE_FUNCTIONS_RULE_DATA_URL` to an `https` URL before you start the app.
- The assessment page shows the source and the `checkedOn` date of each
  file. The chip shows a warning when the date is more than 90 days old.

## How you know that an update is necessary

- **Weekly check.** The `Azure Functions data check` workflow
  (`.github/workflows/azure-functions-data-check.yml`) runs
  `npm run data:check` each Monday. When an item is `DIFF`, `NOT FOUND`,
  `ERROR`, or `STALE`, it opens or updates one issue with the label
  `azure-functions-data`. You can also start it by hand.
- **Age.** An entry or a file that was checked more than 90 days ago is
  `STALE`. Review `heuristic` entries when they are `STALE`, because no
  source can show a difference for them.
- **Panel.** The data chip on the assessment page shows a warning after 90
  days.

The age check does not make pull request checks fail. A date-based failure
would block unrelated pull requests.

## Update the data

1. Run `npm run data:check` in `canvases/azure-functions`. It compares
   the files with the official pages, the extension bundle index, and the Go
   worker `go.mod`. It changes no file. (`npm run lifecycle:check` is the same
   command.)
2. For each `DIFF` or `NOT FOUND`, read the source and change the entry. Keep
   an official source for each entry.
3. Set `checkedOn` to today for each entry that you checked, and for the file.
4. Run `npm test` in `canvases/azure-functions`.
5. Merge the change in this repository.
6. Copy the same files to `data/azure-functions/` in
   `microsoft/azure-dev-tools` with a pull request. The repository rules for
   review apply.

Do not add a date that no official source gives. Use `null` instead.

## Add a rule that uses a new value

1. Add the value to `rule-data.json` as a new entry with `kind`, `checkedOn`,
   and `source`.
2. Add the entry name to `RULE_DATA_ENTRIES` and a validation function to
   `CHECKS` in `src/shared/rule-data.mjs`.
3. Read the value from `lifecycle.rules` in the rule. Do not copy the value
   into the rule code.
4. If a machine-readable source exists, add a comparison to
   `src/tools/check-data.mjs`.
