#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 -a <app-name> [-s <subscription-id-or-name>] [-g <resource-group>] [-H <hours>]" >&2
}

APP_NAME=""
SUBSCRIPTION_ID=""
RESOURCE_GROUP=""
HOURS="24"

while getopts ":a:s:g:H:h" opt; do
  case "$opt" in
    a) APP_NAME="$OPTARG" ;;
    s) SUBSCRIPTION_ID="$OPTARG" ;;
    g) RESOURCE_GROUP="$OPTARG" ;;
    H) HOURS="$OPTARG" ;;
    h) usage; exit 0 ;;
    *) usage; exit 2 ;;
  esac
done

if [[ -z "$APP_NAME" ]]; then
  usage
  exit 2
fi

PYTHON_BIN="${PYTHON_BIN:-}"
if [[ -z "$PYTHON_BIN" ]]; then
  for candidate in python3 python; do
    if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -c 'import json' >/dev/null 2>&1; then
      PYTHON_BIN="$candidate"
      break
    fi
  done
fi
if [[ -z "$PYTHON_BIN" ]] || ! "$PYTHON_BIN" -c 'import json' >/dev/null 2>&1; then
  echo "A working python3 or python executable is required for JSON shaping" >&2
  exit 2
fi

TMP_DIR="$(mktemp -d)"
ERRORS_FILE="$TMP_DIR/errors.jsonl"
: > "$ERRORS_FILE"
trap 'rm -rf "$TMP_DIR"' EXIT

# Record a failed step. The final JSON output includes every recorded error, so
# a failed Azure call never looks like an empty, healthy result.
record_error() {
  "$PYTHON_BIN" -c 'import json,sys; print(json.dumps({"step": sys.argv[1], "error": sys.argv[2].strip()[:2000] or "The command failed and wrote no error output."}))' "$1" "${2:-}" >> "$ERRORS_FILE"
}

# Usage: az_json <step> <az arguments...>. Prints the JSON output. On failure,
# prints nothing and records the Azure CLI error for the step.
az_json() {
  local step="$1"
  shift
  local err_file out
  err_file="$(mktemp "$TMP_DIR/az-stderr.XXXXXX")"
  if out="$(az "$@" -o json 2>"$err_file")"; then
    printf '%s' "$out"
  else
    record_error "$step" "$(cat "$err_file")"
  fi
  rm -f "$err_file"
}

json_get() {
  "$PYTHON_BIN" -c 'import json,sys
text=sys.stdin.read().strip()
try:
    cur=json.loads(text) if text else None
except ValueError:
    cur=None
for p in (sys.argv[1].split(".") if sys.argv[1] else []):
    if cur in (None, ""):
        cur=None; break
    cur = cur[int(p)] if isinstance(cur, list) else cur.get(p)
print("" if cur is None else cur)' "$1"
}

# Usage: first_row <key>. Prints the first row of a JSON list as JSON, or null.
# Use key "data" for Resource Graph output and "" for a plain list.
first_row() {
  "$PYTHON_BIN" -c 'import json,sys
text=sys.stdin.read().strip()
try:
    data=json.loads(text) if text else None
except ValueError:
    data=None
rows=data.get(sys.argv[1]) if sys.argv[1] and isinstance(data, dict) else data
print(json.dumps(rows[0] if isinstance(rows, list) and rows else None))' "$1"
}

emit_failure() {
  "$PYTHON_BIN" -c 'import json,sys
with open(sys.argv[3], encoding="utf-8") as f:
    errors=[json.loads(line) for line in f if line.strip()]
print(json.dumps({"error": sys.argv[1], "appName": sys.argv[2], "errors": errors}, indent=2))' "$1" "$APP_NAME" "$ERRORS_FILE"
}

log_analytics_query() {
  local step="$1"
  local workspace_id="$2"
  local kql="$3"
  if [[ -z "$workspace_id" ]]; then
    echo "null"
    return
  fi
  local body
  body="$(mktemp "$TMP_DIR/la-query.XXXXXX")"
  "$PYTHON_BIN" -c 'import json,sys; open(sys.argv[1],"w",encoding="utf-8").write(json.dumps({"query":sys.argv[2]}))' "$body" "$kql"
  local result
  result="$(az_json "log-analytics:$step" rest --method post --url "https://api.loganalytics.io/v1/workspaces/${workspace_id}/query" --body "@$body" --headers "Content-Type=application/json")"
  rm -f "$body"
  if [[ -z "$result" ]]; then
    echo "null"
    return
  fi
  printf '%s' "$result" | "$PYTHON_BIN" -c 'import json,sys; data=json.loads(sys.stdin.read() or "null") or {}; tables=data.get("tables") or []; print(json.dumps((tables[0].get("rows") if tables else None)))'
}

# Do not change the user's Azure CLI state. The script does not run
# 'az account set', 'az config set', or 'az extension add'. It passes the
# subscription to each command instead.
if [[ -n "$SUBSCRIPTION_ID" ]]; then
  RESOLVED_SUBSCRIPTION="$(az_json subscription account show --subscription "$SUBSCRIPTION_ID" --query id | json_get "")"
  if [[ -z "$RESOLVED_SUBSCRIPTION" ]]; then
    emit_failure "Subscription not found or not accessible"
    exit 1
  fi
  SUBSCRIPTION_ID="$RESOLVED_SUBSCRIPTION"
fi

RESOURCE_JSON="null"
if az extension show --name resource-graph -o none >/dev/null 2>&1; then
  WHERE="type =~ 'microsoft.web/sites' and name =~ '$APP_NAME'"
  if [[ -n "$RESOURCE_GROUP" ]]; then
    WHERE="$WHERE and resourceGroup =~ '$RESOURCE_GROUP'"
  fi
  QUERY="Resources | where $WHERE | project name, id, resourceGroup, subscriptionId, location, kind, properties | take 1"
  GRAPH_ARGS=(graph query -q "$QUERY")
  if [[ -n "$SUBSCRIPTION_ID" ]]; then
    GRAPH_ARGS+=(--subscriptions "$SUBSCRIPTION_ID")
  fi
  GRAPH_JSON="$(az_json resource-graph "${GRAPH_ARGS[@]}")"
  RESOURCE_JSON="$(printf '%s' "$GRAPH_JSON" | first_row data)"
else
  record_error "resource-graph" "The Azure CLI resource-graph extension is not installed. The script does not install extensions, so it used 'az resource list' in the selected or default subscription. To search all subscriptions, install the extension with 'az extension add --name resource-graph' and run the script again."
fi

if [[ "$RESOURCE_JSON" == "null" ]]; then
  LIST_ARGS=(resource list --name "$APP_NAME" --resource-type Microsoft.Web/sites)
  if [[ -n "$RESOURCE_GROUP" ]]; then
    LIST_ARGS+=(--resource-group "$RESOURCE_GROUP")
  fi
  if [[ -n "$SUBSCRIPTION_ID" ]]; then
    LIST_ARGS+=(--subscription "$SUBSCRIPTION_ID")
  fi
  LIST_JSON="$(az_json resource-list "${LIST_ARGS[@]}")"
  RESOURCE_JSON="$(printf '%s' "$LIST_JSON" | first_row "")"
fi

if [[ "$RESOURCE_JSON" == "null" || -z "$RESOURCE_JSON" ]]; then
  emit_failure "Function App not found"
  exit 1
fi

SUBSCRIPTION_ID="$(printf '%s' "$RESOURCE_JSON" | json_get subscriptionId)"
RESOURCE_GROUP="$(printf '%s' "$RESOURCE_JSON" | json_get resourceGroup)"
RESOURCE_ID="$(printf '%s' "$RESOURCE_JSON" | json_get id)"
SUB=(--subscription "$SUBSCRIPTION_ID")

SITE_JSON="$(az_json site rest --method get --url "https://management.azure.com${RESOURCE_ID}?api-version=2023-12-01")"
if [[ -z "$SITE_JSON" || "$SITE_JSON" == "null" ]]; then
  SITE_JSON="$(az_json site-fallback functionapp show -g "$RESOURCE_GROUP" -n "$APP_NAME" "${SUB[@]}")"
fi
PLAN_ID="$(printf '%s' "$SITE_JSON" | "$PYTHON_BIN" -c 'import json,sys; text=sys.stdin.read().strip(); s=(json.loads(text) if text else None) or {}; print((s.get("properties") or {}).get("serverFarmId") or s.get("serverFarmId") or "")')"
PLAN_JSON="null"
if [[ -n "$PLAN_ID" ]]; then
  PLAN_JSON="$(az_json plan rest --method get --url "https://management.azure.com${PLAN_ID}?api-version=2023-12-01")"
fi
HEALTH_JSON="$(az_json resource-health rest --method get --url "https://management.azure.com${RESOURCE_ID}/providers/Microsoft.ResourceHealth/availabilityStatuses/current?api-version=2022-10-01")"
FUNCS_JSON="$(az_json functions functionapp function list -g "$RESOURCE_GROUP" -n "$APP_NAME" "${SUB[@]}")"
METRICS_JSON="$(az_json metrics monitor metrics list --resource "$RESOURCE_ID" --metric "InstanceCount,CpuPercentage,AverageMemoryWorkingSet,OnDemandFunctionExecutionCount,OnDemandFunctionExecutionUnits,AlwaysReadyFunctionExecutionCount,AlwaysReadyFunctionExecutionUnits,AlwaysReadyUnits" --interval PT1H --aggregation Average Total)"
ACTIVITY_JSON="$(az_json activity-log monitor activity-log list --resource-id "$RESOURCE_ID" --offset "${HOURS}h" --max-events 20 "${SUB[@]}")"

AI_RESOURCE_ID="$(printf '%s' "$SITE_JSON" | "$PYTHON_BIN" -c 'import json,sys; s=json.loads(sys.stdin.read() or "null") or {}; print((s.get("tags") or {}).get("hidden-link: /app-insights-resource-id") or "")')"
WORKSPACE_RESOURCE_ID=""
WORKSPACE_CUSTOMER_ID=""
if [[ -n "$AI_RESOURCE_ID" ]]; then
  AI_JSON="$(az_json application-insights resource show --ids "$AI_RESOURCE_ID")"
  WORKSPACE_RESOURCE_ID="$(printf '%s' "$AI_JSON" | "$PYTHON_BIN" -c 'import json,sys; a=json.loads(sys.stdin.read() or "null") or {}; p=a.get("properties") or {}; print(p.get("WorkspaceResourceId") or p.get("workspaceResourceId") or "")')"
  if [[ -n "$WORKSPACE_RESOURCE_ID" ]]; then
    WORKSPACE_JSON="$(az_json log-analytics-workspace monitor log-analytics workspace show --ids "$WORKSPACE_RESOURCE_ID")"
    WORKSPACE_CUSTOMER_ID="$(printf '%s' "$WORKSPACE_JSON" | "$PYTHON_BIN" -c 'import json,sys; print((json.loads(sys.stdin.read() or "null") or {}).get("customerId") or "")')"
  fi
fi

TABLE_COUNTS_JSON="$(log_analytics_query table-counts "$WORKSPACE_CUSTOMER_ID" "union withsource=TableName AppRequests, AppExceptions, AppTraces, AppDependencies | where TimeGenerated > ago(7d) | summarize Count=count(), Latest=max(TimeGenerated) by TableName | order by TableName")"
REQUESTS_JSON="$(log_analytics_query requests "$WORKSPACE_CUSTOMER_ID" "AppRequests | where TimeGenerated > ago(${HOURS}h) | summarize Count=count(), Failed=countif(Success == false), AvgDurationMs=avg(DurationMs), P95DurationMs=percentile(DurationMs,95), Latest=max(TimeGenerated) by OperationName | order by Count desc | take 30")"
EXCEPTIONS_JSON="$(log_analytics_query exceptions "$WORKSPACE_CUSTOMER_ID" "AppExceptions | where TimeGenerated > ago(${HOURS}h) | summarize Count=count(), Latest=max(TimeGenerated) by OperationName, ProblemId, Type, OuterMessage | order by Count desc | take 20")"
ERROR_TRACES_JSON="$(log_analytics_query error-traces "$WORKSPACE_CUSTOMER_ID" "AppTraces | where TimeGenerated > ago(${HOURS}h) | where SeverityLevel >= 2 | summarize Count=count(), Latest=max(TimeGenerated) by SeverityLevel, Message | order by Count desc | take 20")"
DEPENDENCIES_JSON="$(log_analytics_query dependencies "$WORKSPACE_CUSTOMER_ID" "AppDependencies | where TimeGenerated > ago(${HOURS}h) | summarize Count=count(), Failed=countif(Success == false), AvgDurationMs=avg(DurationMs), P95DurationMs=percentile(DurationMs,95), Latest=max(TimeGenerated) by Type, Target, Name | order by Failed desc, Count desc | take 20")"

printf '%s' "$SITE_JSON" > "$TMP_DIR/site.json"
printf '%s' "$PLAN_JSON" > "$TMP_DIR/plan.json"
printf '%s' "$HEALTH_JSON" > "$TMP_DIR/health.json"
printf '%s' "$FUNCS_JSON" > "$TMP_DIR/functions.json"
printf '%s' "$METRICS_JSON" > "$TMP_DIR/metricsRaw.json"
printf '%s' "$ACTIVITY_JSON" > "$TMP_DIR/activityRaw.json"
printf '%s' "$TABLE_COUNTS_JSON" > "$TMP_DIR/tableCounts.json"
printf '%s' "$REQUESTS_JSON" > "$TMP_DIR/requests.json"
printf '%s' "$EXCEPTIONS_JSON" > "$TMP_DIR/exceptions.json"
printf '%s' "$ERROR_TRACES_JSON" > "$TMP_DIR/errorTraces.json"
printf '%s' "$DEPENDENCIES_JSON" > "$TMP_DIR/dependencies.json"

"$PYTHON_BIN" - "$TMP_DIR" "$APP_NAME" "$RESOURCE_GROUP" "$SUBSCRIPTION_ID" "$RESOURCE_ID" "$WORKSPACE_RESOURCE_ID" "$WORKSPACE_CUSTOMER_ID" <<'PY'
import json, os, sys

base, app_name, resource_group, subscription_id, resource_id, workspace_resource_id, workspace_customer_id = sys.argv[1:8]

with open(os.path.join(base, "errors.jsonl"), encoding="utf-8") as f:
    errors = [json.loads(line) for line in f if line.strip()]

def load(name, default=None):
    path = os.path.join(base, name)
    try:
        with open(path, encoding="utf-8") as f:
            text = f.read().strip()
    except OSError as error:
        errors.append({"step": name, "error": str(error)})
        return default
    try:
        return json.loads(text) if text else default
    except ValueError as error:
        errors.append({"step": name, "error": "The command output is not valid JSON: " + str(error)})
        return default

site = load("site.json", {}) or {}
plan = load("plan.json", {}) or {}
health = load("health.json", None)
funcs = load("functions.json", []) or []
metrics_raw = load("metricsRaw.json", {}) or {}
activity_raw = load("activityRaw.json", []) or []

functions = []
for func in funcs:
    bindings = ((func.get("config") or {}).get("bindings") or [])
    binding = next((b for b in bindings if b.get("direction") == "In"), {})
    functions.append({
        "function": (func.get("name") or "").split("/")[-1],
        "trigger": binding.get("type"),
        "disabled": func.get("isDisabled"),
    })
counts = {}
for func in functions:
    key = (func.get("trigger"), func.get("disabled"))
    counts[key] = counts.get(key, 0) + 1
trigger_counts = [
    {"trigger": trigger, "disabled": disabled, "count": count}
    for (trigger, disabled), count in sorted(counts.items(), key=lambda x: (str(x[0][0]), str(x[0][1])))
]

metrics = []
for metric in metrics_raw.get("value") or []:
    totals, averages = [], []
    for series in metric.get("timeseries") or []:
        for point in series.get("data") or []:
            if point.get("total") is not None:
                totals.append(float(point["total"]))
            if point.get("average") is not None:
                averages.append(float(point["average"]))
    metrics.append({
        "name": (metric.get("name") or {}).get("value"),
        "unit": metric.get("unit"),
        "totalSum": sum(totals) if totals else None,
        "averageMax": max(averages) if averages else None,
        "nonZeroTotalBucketCount": len([x for x in totals if x != 0]),
        "nonZeroAverageBucketCount": len([x for x in averages if x != 0]),
    })

activity = [{
    "time": item.get("eventTimestamp"),
    "operation": (item.get("operationName") or {}).get("value"),
    "status": (item.get("status") or {}).get("value"),
    "caller": item.get("caller"),
    "level": item.get("level"),
    "correlationId": item.get("correlationId"),
} for item in activity_raw]

telemetry = None
if workspace_customer_id:
    telemetry = {
        "workspaceResourceId": workspace_resource_id or None,
        "tableCounts7d": load("tableCounts.json", None),
        "requests": load("requests.json", None),
        "exceptions": load("exceptions.json", None),
        "errorTraces": load("errorTraces.json", None),
        "dependencies": load("dependencies.json", None),
    }

props = site.get("properties") or {}
plan_props = plan.get("properties") or {}
health_props = (health or {}).get("properties") or {}
output = {
    "resource": {
        "id": resource_id,
        "name": app_name,
        "resourceGroup": resource_group,
        "subscriptionId": subscription_id,
        "location": site.get("location"),
        "kind": site.get("kind"),
    },
    "currentStatus": {
        "enabled": props.get("enabled"),
        "state": props.get("state"),
        "availabilityState": props.get("availabilityState"),
        "runtimeAvailabilityState": props.get("runtimeAvailabilityState"),
        "planStatus": plan_props.get("status"),
    },
    "resourceHealth": None if not health else {
        "availabilityState": health_props.get("availabilityState"),
        "summary": health_props.get("summary"),
        "reasonType": health_props.get("reasonType"),
        "reportedTime": health_props.get("reportedTime"),
        "title": health_props.get("title"),
    },
    "triggers": {"counts": trigger_counts, "functions": functions},
    "metrics": metrics,
    "applicationInsights": telemetry,
    "activityLog": activity,
    "gaps": {
        "applicationInsightsResourceFound": bool((site.get("tags") or {}).get("hidden-link: /app-insights-resource-id")),
        "workspaceFound": bool(workspace_customer_id),
        "resourceHealthReturned": bool(health),
    },
    "errors": errors,
}
print(json.dumps(output, indent=2))
PY
