#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: $0 -a <app-name> [-s <subscription-id-or-name>] [-g <resource-group>]" >&2
}

APP_NAME=""
SUBSCRIPTION_ID=""
RESOURCE_GROUP=""

while getopts ":a:s:g:h" opt; do
  case "$opt" in
    a) APP_NAME="$OPTARG" ;;
    s) SUBSCRIPTION_ID="$OPTARG" ;;
    g) RESOURCE_GROUP="$OPTARG" ;;
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
WEB_CONFIG_JSON="$(az_json web-config rest --method get --url "https://management.azure.com${RESOURCE_ID}/config/web?api-version=2023-12-01")"
SETTINGS_JSON="$(az_json app-settings functionapp config appsettings list -g "$RESOURCE_GROUP" -n "$APP_NAME" "${SUB[@]}")"
FUNCS_JSON="$(az_json functions functionapp function list -g "$RESOURCE_GROUP" -n "$APP_NAME" "${SUB[@]}")"
VNET_JSON="$(az_json vnet-integration webapp vnet-integration list -g "$RESOURCE_GROUP" -n "$APP_NAME" "${SUB[@]}")"
PRIVATE_ENDPOINTS_JSON="$(az_json private-endpoints network private-endpoint-connection list -g "$RESOURCE_GROUP" -n "$APP_NAME" --type Microsoft.Web/sites "${SUB[@]}")"
RELATED_JSON="$(az_json related-resources resource list -g "$RESOURCE_GROUP" "${SUB[@]}" --query '[].{name:name,type:type,location:location,sku:sku.name}')"

printf '%s' "$SITE_JSON" > "$TMP_DIR/site.json"
printf '%s' "$PLAN_JSON" > "$TMP_DIR/plan.json"
printf '%s' "$WEB_CONFIG_JSON" > "$TMP_DIR/webConfig.json"
printf '%s' "$SETTINGS_JSON" > "$TMP_DIR/settings.json"
printf '%s' "$FUNCS_JSON" > "$TMP_DIR/functions.json"
printf '%s' "$VNET_JSON" > "$TMP_DIR/vnet.json"
printf '%s' "$PRIVATE_ENDPOINTS_JSON" > "$TMP_DIR/privateEndpoints.json"
printf '%s' "$RELATED_JSON" > "$TMP_DIR/related.json"

"$PYTHON_BIN" - "$TMP_DIR" "$APP_NAME" "$RESOURCE_GROUP" "$SUBSCRIPTION_ID" "$RESOURCE_ID" <<'PY'
import json, os, re, sys

base, app_name, resource_group, subscription_id, resource_id = sys.argv[1:6]

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
plan = load("plan.json", None)
web = load("webConfig.json", {}) or {}
settings_raw = load("settings.json", []) or []
funcs = load("functions.json", []) or []
vnet = load("vnet.json", None)
private_endpoints = load("privateEndpoints.json", []) or []
related = load("related.json", []) or []

wanted = {
    "FUNCTIONS_EXTENSION_VERSION", "FUNCTIONS_WORKER_RUNTIME",
    "APPLICATIONINSIGHTS_CONNECTION_STRING", "APPINSIGHTS_INSTRUMENTATIONKEY",
    "AzureWebJobsStorage", "AzureWebJobsStorage__accountName", "AzureWebJobsStorage__credential",
    "WEBSITE_RUN_FROM_PACKAGE", "WEBSITE_CONTENTSHARE", "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
}
secret_re = re.compile(r"CONNECTION|Storage|KEY|SECRET|INSIGHTS|TOKEN|PASSWORD|SAS|ACCOUNT", re.I)
settings = []
for item in settings_raw:
    name = item.get("name")
    if name not in wanted:
        continue
    value = item.get("value")
    settings.append({
        "name": name,
        "hasValue": value not in (None, ""),
        "value": "***redacted***" if secret_re.search(name or "") else value,
    })

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

props = site.get("properties") or {}
web_props = web.get("properties") or {}
plan_props = (plan or {}).get("properties") or {}
output = {
    "resource": {
        "id": resource_id,
        "name": app_name,
        "resourceGroup": resource_group,
        "subscriptionId": subscription_id,
        "location": site.get("location"),
        "kind": site.get("kind"),
        "defaultHostName": props.get("defaultHostName"),
        "hostNames": props.get("hostNames"),
    },
    "app": {
        "enabled": props.get("enabled"),
        "state": props.get("state"),
        "sku": props.get("sku"),
        "functionAppConfig": props.get("functionAppConfig"),
        "lastModifiedTimeUtc": props.get("lastModifiedTimeUtc"),
    },
    "plan": None if not plan else {
        "id": plan.get("id"),
        "name": plan.get("name"),
        "sku": plan.get("sku"),
        "status": plan_props.get("status"),
        "location": plan.get("location"),
        "reserved": plan_props.get("reserved"),
        "zoneRedundant": plan_props.get("zoneRedundant"),
    },
    "network": {
        "virtualNetworkSubnetId": props.get("virtualNetworkSubnetId"),
        "publicNetworkAccess": props.get("publicNetworkAccess"),
        "httpsOnly": props.get("httpsOnly"),
        "minTlsVersion": web_props.get("minTlsVersion"),
        "ftpsState": web_props.get("ftpsState"),
        "vnetRouteAllEnabled": props.get("vnetRouteAllEnabled"),
        "vnetContentShareEnabled": props.get("vnetContentShareEnabled"),
        "vnetImagePullEnabled": props.get("vnetImagePullEnabled"),
        "vnetIntegration": vnet,
        "privateEndpointConnectionCount": len(private_endpoints) if isinstance(private_endpoints, list) else 0,
    },
    "identity": site.get("identity"),
    "selectedSettings": settings,
    "triggers": {"counts": trigger_counts, "functions": functions},
    "relatedResources": related,
    "errors": errors,
}
print(json.dumps(output, indent=2))
PY
