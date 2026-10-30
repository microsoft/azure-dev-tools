# Azure Functions checks

This file lists every check that the Azure Functions canvas and its skills do.
Use it to find what is checked, how it is checked, and where its values are.

- **Subject-matter experts:** read the rows for your area (for example,
  Python). Look for checks that are missing or wrong. Then sign the review
  table at the end.
- **Maintainers:** when you add, remove, or rename a check, change this file
  in the same pull request. The test `test/unit/check-catalog.test.mjs` fails
  when this file and the code or the skills do not agree. The message tells
  you what to change. The repository skill `azure-functions-checks-sync`
  gives the steps.

## How to read a row

A check can be done in two ways. A row shows which ways apply. The JSON files
hold only values. They do not hold checks.

| Column | What it tells you | Where it is written |
|---|---|---|
| **Code rule** | A fixed rule in code. It runs with no AI, each time the user scans or checks an app. `-` means that no code rule exists. | `src/shared/local-rules.mjs` and `src/shared/project-checks.mjs` (local project), `src/shared/azure-rules.mjs` (Function App in Azure). Search for the ID. |
| **Code rule runs on** | `Local`: on a local project folder. `Azure`: on a Function App in Azure. | - |
| **AI checklist (doctor)** | A checklist item that the AI agent follows when the user clicks **Deep check with AI**. It runs only on a local project. `-` means that no checklist item exists. | `skills/azure-functions-doctor/references/*.md`. Search for the ID. |
| **Values (JSON)** | The data entry that the code rule reads, for example dates or setting names. `-` means that the rule has no values that go out of date. | `lifecycle#...` is `skills/azure-functions-assess/references/lifecycle.json`. `rule-data#...` is `skills/azure-functions-doctor/references/rule-data.json`. [lifecycle-data.md](lifecycle-data.md) tells you how to update them. |

Examples:

| Row | Meaning |
|---|---|
| `config.no-host-json` · Local · `CF-001` · - | The code rule checks it on each scan. The AI checklist also has it. |
| `go.version` · Local · `GO-009` · `rule-data#go` | The code rule checks it. The minimum Go version is in `rule-data.json`, not in the code. |
| - · - · `PY-002` · - | Only the AI checks it, and only in **Deep check with AI**. |
| `health.not-running` · Azure · - · - | Only the code rule checks it, on a Function App in Azure. |

A `*` in a rule ID is a variable part, for example a language version or a
file name. **Assess with AI** uses the `azure-functions-assess` skill. It has
no fixed checklist IDs, so it is not in the table.

## Checks

| Area | Check | Code rule | Code rule runs on | AI checklist (doctor) | Values (JSON) |
|---|---|---|---|---|---|
| Runtime | `host.json` is missing | `config.no-host-json` | Local | `CF-001` | - |
| Runtime | `host.json` is not valid JSON | `config.host-json-invalid` | Local | `CF-002` | - |
| Runtime | `host.json` version is not 2.0 | `runtime.host-json-version` | Local | `CF-003` | `lifecycle#hostVersions` |
| Runtime | `AzureFunctionsVersion` in `.csproj` is out of support | `runtime.functions-version` | Local | `RT-002` | `lifecycle#hostVersions` |
| Runtime | `FUNCTIONS_EXTENSION_VERSION` is out of support or ends soon | `runtime.extension-version` | Azure | `RT-002` | `lifecycle#hostVersions` |
| Runtime | The runtime is pinned to one minor version | `runtime.extension-pinned` | Azure | - | - |
| Runtime | Extension bundle version is out of support or old | `bundle.v*` | Local | `RT-004` | `lifecycle#extensionBundles`, `rule-data#extensionBundle` |
| Configuration | `FUNCTIONS_WORKER_RUNTIME` is missing | `config.worker-runtime-missing` | Local | `AS-001` | - |
| Configuration | `AzureWebJobsStorage` is missing | `config.storage-missing` | Local | `AS-002` | - |
| Configuration | A deprecated app setting, or a setting that Flex Consumption does not use | `config.deprecated-setting.*` | Local, Azure | `AS-003` | `rule-data#deprecatedSettings` |
| Configuration | `WEBSITE_RUN_FROM_PACKAGE` is missing on a plan that needs it | `config.run-from-package.missing` | Azure | - | `rule-data#deploymentMethod` |
| Configuration | `WEBSITE_RUN_FROM_PACKAGE` is set to `1` on Linux Consumption, which does not use it | `config.run-from-package.wrong-on-linux-consumption` | Azure | - | `rule-data#deploymentMethod` |
| Configuration | Application Insights uses the instrumentation key | `monitoring.instrumentation-key` | Azure | `AS-006` | `rule-data#applicationInsights` |
| Configuration | Identity-based connection settings have the wrong shape | - | - | `AS-007` | - |
| Configuration | Durable Functions triggers with no `extensions.durableTask` | `config.durable-task-missing` | Local | `AS-008` | - |
| Configuration | Binding type is not valid | - | - | `DP-002` | - |
| Configuration | Entry point does not resolve | - | - | `DP-003` | - |
| Configuration | Binding connection setting is not defined | - | - | `DP-004` | - |
| Configuration | Retry configuration | - | - | `DP-008` | - |
| Packaging | Dependencies are too large | - | - | `DP-005` | - |
| Packaging | Test or development code is in the deployment package | - | - | `PF-006` | - |
| Packaging | Deployment package is too large | - | - | `PF-008` | - |
| .NET | .NET version is out of support or ends soon | `language.*` | Local, Azure | `RT-003` | `lifecycle#languageVersions` |
| .NET | In-process model support ends | `model.*` | Local | `CS-002` | `lifecycle#programmingModels` |
| .NET | In-process model support ends (Function App) | `model.dotnet-in-process` | Azure | `CS-002` | `lifecycle#programmingModels` |
| .NET | Blocking `Task` use | - | - | `CS-001` | - |
| .NET | No `CancellationToken` | - | - | `CS-003` | - |
| .NET | A client is created for each call | - | - | `CS-004` | - |
| .NET | Worker SDK and extension versions | - | - | `CS-005` | - |
| .NET | An isolated worker project on `Azure.Functions.Sdk` and a modern .NET TFM has the `ExecutionContext` global alias | - | - | `CS-006` | - |
| .NET | A migrated project's target framework is not one that the update scenario validated | - | - | `MG-001` | - |
| Node.js | Node.js version is out of support or ends soon | `language.*` | Local, Azure | `RT-003` | `lifecycle#languageVersions` |
| Node.js | Programming model v3 | `model.*` | Local | `JS-001` | `lifecycle#programmingModels` |
| Node.js | Floating promises | - | - | `JS-002` | - |
| Node.js | Dependencies are missing from the deployment package | - | - | `JS-003` | - |
| Node.js | TypeScript output | - | - | `JS-004` | - |
| Node.js | ESM and CommonJS do not agree | - | - | `JS-005` | - |
| Node.js | A client is created for each call | - | - | `JS-006` | - |
| Python | Python version is out of support or ends soon | `language.*` | Azure | `RT-003` | `lifecycle#languageVersions` |
| Python | Programming model v1 | `model.*` | Local | `PY-001` | `lifecycle#programmingModels` |
| Python | Blocking operations | - | - | `PY-002` | - |
| Python | `requirements.txt` problems | - | - | `PY-003` | - |
| Python | A client is created for each call | - | - | `PY-004` | - |
| Python | Worker indexing flag | - | - | `PY-005` | - |
| Python | Worker extensions | - | - | `PY-006` | - |
| Python | `requirements.txt` does not list `azure-functions` | `python.functions-package-missing` | Local | `PY-007` | `rule-data#python` |
| Python | A Blueprint is not registered | `python.blueprint-unregistered.*` | Local | `PY-008` | - |
| Python | `requirements.txt` lists the platform-managed worker package | `python.worker-package` | Local | `PY-009` | `rule-data#pythonWorkerPackage` |
| Python | Native dependencies are not compatible | - | - | `PY-010` | - |
| Python | Dependency files do not agree | - | - | `DP-006` | - |
| Python | `.funcignore` does not exclude test and local files | `python.deploy-exclusions` | Local | `PF-006` | `rule-data#python` |
| Java | Java version is out of support or ends soon | `language.*` | Azure | `RT-003`, `JV-002` | `lifecycle#languageVersions` |
| Java | Maven or Gradle plugin compatibility | - | - | `JV-001` | - |
| Java | A client is created for each call | - | - | `JV-003` | - |
| Java | App name and deployment metadata | - | - | `JV-004` | - |
| PowerShell | PowerShell version is out of support or ends soon | `language.*` | Azure | `RT-003` | `lifecycle#languageVersions` |
| PowerShell | Managed dependencies | - | - | `PS-001` | - |
| PowerShell | `profile.ps1` startup cost | - | - | `PS-002` | - |
| PowerShell | A module is installed in a function call | - | - | `PS-003` | - |
| Go | `go.mod` Go version is lower than the worker needs | `go.version` | Local | `GO-009` | `rule-data#go` |
| Go | `FUNCTIONS_WORKER_RUNTIME` is not `native` | `go.worker-runtime` | Local | `GO-004` | `rule-data#go` |
| Go | Goroutine panic safety | - | - | `GO-001` | - |
| Go | Worker module pinning | - | - | `GO-002` | - |
| Go | A client is created for each call | - | - | `GO-003` | - |
| Go | Indexing model conflict | - | - | `GO-005` | - |
| Go | Extension activation | - | - | `GO-006` | - |
| Go | Context propagation | - | - | `GO-007` | - |
| Go | Startup cost | - | - | `GO-008` | - |
| Go | Feature that the Go worker does not support | - | - | `GO-010` | - |
| Hosting | Linux Consumption plan retires | `hosting.linux-consumption` | Local, Azure | - | `lifecycle#hostingPlans` |
| Hosting | Windows Consumption is a legacy plan with no announced retirement date | `hosting.windows-consumption.legacy` | Azure | - | `lifecycle#hostingPlans` |
| Hosting | Linux Consumption app on runtime ~3 stops running | `hosting.linux-consumption.runtime-stop` | Azure | - | `lifecycle#hostingPlans` |
| Hosting | Azure Files content settings | - | - | `AS-004` | - |
| Hosting | Flex Consumption deployment storage | - | - | `ST-008` | - |
| Hosting | Scale limit | - | - | `PF-005` | - |
| Hosting | Host storage uses ADLS (HNS) | - | - | `ST-002` | - |
| Hosting | More than one app shares the host storage account | - | - | `ST-003` | - |
| Hosting | Host ID collision | - | - | `ST-004` | - |
| Hosting | Storage lifecycle policy | - | - | `ST-005` | - |
| Hosting | Storage is in another region | - | - | `ST-006` | - |
| Hosting | Azure Files mount use | - | - | `ST-007` | - |
| App status | The Function App is not running | `health.not-running` | Azure | - | - |
| App status | The host reports no functions | `health.no-functions` | Azure | - | - |
| Security | A secret file is not in `.gitignore` | `security.secret-file.*` | Local | `SC-005` | `rule-data#secretFiles` |
| Security | Secrets in source code | - | - | `SC-001`, `SC-109` | - |
| Security | Anonymous HTTP trigger on sensitive data | - | - | `SC-002` | - |
| Security | CORS allows all origins | - | - | `SC-003` | - |
| Security | HTTPS Only is off | `config.https-only` | Azure | `SC-004` | - |
| Security | FTP or FTPS is on | - | - | `SC-006` | - |
| Security | TLS version is old | - | - | `SC-008` | - |
| Security | Input validation | - | - | `SC-009` | - |
| Security | Admin endpoint isolation | - | - | `SC-010` | - |
| Code quality | A client is created for each call | - | - | `CQ-001` | - |
| Code quality | State is kept in memory | - | - | `CQ-002` | - |
| Code quality | Long synchronous work | - | - | `CQ-003` | - |
| Code quality | Background work outlives the call | - | - | `CQ-004` | - |
| Code quality | Idempotency | - | - | `CQ-005` | - |
| Code quality | Blocking calls | - | - | `CQ-006` | - |
| Code quality | Structured error handling | - | - | `CQ-007` | - |
| Code quality | Output binding error strategy | - | - | `CQ-008` | - |
| Event-driven | Poison and dead-letter handling | - | - | `EH-003` | - |
| Event-driven | Event Hubs checkpoint delay | - | - | `EH-004` | - |
| Event-driven | At-least-once delivery needs idempotency | - | - | `EH-005` | - |
| Supply chain | Side effects when a module loads | - | - | `SC-101` | - |
| Supply chain | Fetch, then run | - | - | `SC-102` | - |
| Supply chain | Silent error suppression around suspicious code | - | - | `SC-103` | - |
| Supply chain | Hardcoded command-and-control URLs or IPs | - | - | `SC-104` | - |
| Supply chain | Credential collection | - | - | `SC-105` | - |
| Supply chain | Persistence installation | - | - | `SC-106` | - |
| Supply chain | Lateral movement | - | - | `SC-107` | - |
| Supply chain | Anti-analysis or sandbox evasion | - | - | `SC-108` | - |
| Supply chain | Suspicious version downgrade or pin | - | - | `SC-110` | - |

## Update scenarios

A finding can have an update scenario. **Start update** in Build, and
**Update** on a project health or Azure app assessment finding, start the scenario. The Build
**Migration** list shows these rows.

- The source of truth is
  `skills/azure-functions-update/references/scenarios.json`. The canvas
  reads it. Do not add a scenario in code.
- **Status:**
  - `available`: the reference file of `azure-functions-update` gives the
    steps, and the scenario table in its SKILL.md links the file.
  - `planned`: the list shows it, but the user cannot start it.
  - `external`: a skill in another plugin does the migration. Build asks
    the agent to use that skill. If the skill is not loaded, the agent tells
    the user how to install or update the plugin.
- **Applies when** names the project facts. `programmingModel` and
  `hostingPlan` values are keys in `lifecycle.json`. `extensionBundle` is the
  major version in `host.json`, and its values are keys of
  `extensionBundles` in `lifecycle.json`. A comma means "any of". `-` means
  that the canvas does not detect it; the user selects it.
- A project health or Azure app assessment finding gets an update route only from the `available` or
  `external` scenario that applies.
- A scenario can have `validatedFrameworks`: the target frameworks that its
  Definition of done has actual build/test/E2E evidence for. Add a framework
  here only after the reference file's `frameworkRevalidationSection` actually
  ran and passed for it; a framework that a separate tool changed is not
  evidence by itself. When a scenario also has `frameworkRevalidationSection`,
  `azure-functions-doctor`'s `MG-001` flags a migrated project whose current
  target framework is not in that list, and points to that section of the
  reference file. This covers a framework change that a separate tool makes
  outside this scenario. The Definition of done IDs and their text stay only
  in the reference file; `MG-001` does not repeat them.

| Scenario | Status | Applies when | Reference or skill |
|---|---|---|---|
| `dotnet-isolated` | available | `programmingModel=dotnet-in-process` | `references/dotnet-isolated.md` |
| `node-v4` | planned | `programmingModel=node-v3` | - |
| `python-v2` | available | `programmingModel=python-v1` | `references/python-model-v2.md` |
| `python-blob-sdk` | available | - | `references/python-blob-sdk.md` |
| `python-http-streaming` | available | - | `references/python-http-streaming.md` |
| `bundles-v4` | available | `extensionBundle=1,2,3` | `references/bundles-v4.md` |
| `durable-extension` | available | - | `references/durable-v2.md` |
| `flex-consumption` | external | `hostingPlan=linux-consumption` | `azure-upgrade` in `azure@azure-skills` |
| `windows-consumption-to-flex` | external | `hostingPlan=windows-consumption` | `azure-upgrade` in `azure@azure-skills` |

Both Consumption-to-Flex scenarios use Azure Skills directly. The Windows
scenario includes a move to Linux and needs a compatibility assessment.
The Windows Health Check finding remains a recommendation with no retirement
date. Do not copy the external skill's migration steps into this skill.

To add a scenario or make a planned scenario available:

1. Write the steps in `skills/azure-functions-update/references/<name>.md`.
   Follow "To add a scenario" in the update SKILL.md: official sources,
   prerequisites, steps, and a "Definition of done" table with stable IDs.
   A support reference (for example `extensions.md` for `bundles-v4`) is
   linked from the SKILL.md text, not from the scenario table.
2. Link the file in the scenario table of
   `skills/azure-functions-update/SKILL.md`.
3. In `scenarios.json`, set `status` to `available` and `reference` to the
   file. Add `from` if the canvas can detect it.
4. Change the row in this table.
5. Optional: add the `scenario.<id>.title` and `scenario.<id>.summary`
   translations in `src/ui/locales/`. Without them, the list shows the
   English text from `scenarios.json`.

## Reviews

A subject-matter expert signs a row after a review of the checks for the area.
Write the GitHub user name and the date (YYYY-MM-DD).

| Area | Reviewer | Reviewed on |
|---|---|---|
| Runtime, configuration, packaging | - | - |
| .NET | - | - |
| Node.js | - | - |
| Python | - | - |
| Java | - | - |
| PowerShell | - | - |
| Go | - | - |
| Hosting and app status | - | - |
| Security and supply chain | - | - |
| Code quality and event-driven | - | - |
