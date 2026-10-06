import { createRequire as __canvasCreateRequire } from "node:module";
const require = __canvasCreateRequire(import.meta.url);

// canvases/azure-sre-agent/src/personal-diagnostics-transport.mjs
import { KustoDataClient, KustoConnectionStringBuilder, ClientRequestProperties, KustoCloudSettings } from "./kusto-sdk.mjs";
import { LogsQueryClient } from "./logs-sdk.mjs";
import { NamespaceKustoClient, NamespaceLogsClient } from "./connectors-sdk.mjs";

// canvases/azure-sre-agent/src/personal-source-catalog.mjs
import { createHash } from "node:crypto";

// canvases/azure-sre-agent/src/personal-kusto-endpoints.mjs
function normalizePersonalKustoEndpoint(value, cloud) {
  const suffix = {
    AzureCloud: ".kusto.windows.net",
    AzureUSGovernment: ".kusto.usgovcloudapi.net",
    AzureChinaCloud: ".kusto.chinacloudapi.cn"
  }[cloud];
  const invalid = () => Object.assign(new Error("Use an HTTPS Data Explorer engine endpoint, or a supported public ADX cluster link, in the pinned Azure cloud without credentials, encoded separators, query parameters or extra paths."), { code: "invalid_endpoint" });
  if (!suffix || typeof value !== "string" || value.length > 256 || /[\s\\%?#]/.test(value.trim())) throw invalid();
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw invalid();
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash) throw invalid();
  if (url.hostname === "dataexplorer.azure.com") {
    if (cloud !== "AzureCloud") throw invalid();
    const match = /^https:\/\/dataexplorer\.azure\.com\/clusters\/([a-z0-9.-]+)\/?$/i.exec(value.trim());
    if (!match) throw invalid();
    const cluster = match[1].toLowerCase();
    if (cluster.endsWith(suffix)) url = new URL(`https://${cluster}`);
    else {
      if (cluster !== "help" && !/^[a-z0-9-]+\.[a-z0-9-]+$/.test(cluster)) throw invalid();
      url = new URL(`https://${cluster}${suffix}`);
    }
  } else if (!/^https:\/\/[a-z0-9.-]+\/?$/i.test(value.trim())) throw invalid();
  if (!url.hostname.endsWith(suffix) || url.hostname.length <= suffix.length || url.pathname !== "/" || !url.hostname.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) throw invalid();
  return url.origin;
}

// canvases/azure-sre-agent/src/personal-source-catalog.mjs
var PERSONAL_CLOUDS = Object.freeze({
  AzureCloud: { arm: "https://management.azure.com", logs: "https://api.loganalytics.io", kusto: "https://kusto.kusto.windows.net", kustoSuffix: ".kusto.windows.net", authority: "login.microsoftonline.com" },
  AzureUSGovernment: { arm: "https://management.usgovcloudapi.net", logs: "https://api.loganalytics.us", kustoSuffix: ".kusto.usgovcloudapi.net", authority: "login.microsoftonline.us" },
  AzureChinaCloud: { arm: "https://management.chinacloudapi.cn", logs: "https://api.loganalytics.azure.cn", kustoSuffix: ".kusto.chinacloudapi.cn", authority: "login.chinacloudapi.cn" }
});
var GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var NAMESPACE = /^\/subscriptions\/[0-9a-f-]{36}\/resourceGroups\/[a-z0-9_.()-]+\/providers\/Microsoft\.Web\/connectorGateways\/[a-z0-9_-]+$/i;
var RESOURCE = /^\/subscriptions\/[0-9a-f-]{36}\/resourceGroups\/[a-z0-9_.()-]+\/providers\/[a-z0-9.]+\/[a-z0-9_./()-]+$/i;
var SOURCE_FIELDS = ["id", "name", "kind", "transport", "clusterUrl", "database", "workspaceId", "resourceId", "namespaceId", "connectionId", "tenantId", "cloud", "accountId", "providerAccount"];
function personalError(code, message, recovery) {
  const error = new Error(message);
  error.code = code;
  if (recovery) error.recovery = recovery;
  return error;
}
function safeText(value, limit = 240) {
  return String(value ?? "").replace(/\b(?:Bearer|Basic)\s+[^\s"'<>]+/gi, "[credential redacted]").replace(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, "[token redacted]").replace(/([?&](?:sig|token|access_token|code|(?:api[-_]?|access[-_]?)?key|secret|password|client_secret)=)[^&#\s]*/gi, "$1[redacted]").replace(/\b((?:password|secret|(?:api|access|subscription)[-_]?key|access[-_]?token|connectionstring)["']?\s*[:=]\s*["']?)[^\s,;"'}]+/gi, "$1[redacted]").replace(/https?:\/\/[^/\s@]+:[^/\s@]+@/gi, "https://[redacted]@").slice(0, limit);
}
function string(value, name, limit = 256) {
  if (typeof value !== "string" || !value.trim() || value.length > limit || /[\u0000-\u001f]/.test(value)) {
    throw personalError("invalid_source", `A valid ${name} is required.`);
  }
  if (safeText(value, limit) !== value) throw personalError("secret_reference", `${name} must not contain credentials.`);
  return value.trim();
}
function normalizeIdentity(identity) {
  if (!identity || !GUID.test(identity.tenantId) || !GUID.test(identity.objectId) || !PERSONAL_CLOUDS[identity.cloud]) {
    throw personalError("identity_required", "An explicit signed-in user, tenant and supported Azure cloud are required.", "Sign in with the intended user and tenant.");
  }
  return Object.freeze({
    tenantId: identity.tenantId.toLowerCase(),
    cloud: identity.cloud,
    objectId: identity.objectId.toLowerCase(),
    accountId: string(identity.accountId, "account ID"),
    displayName: safeText(identity.displayName || identity.accountId, 120)
  });
}
var identityKey = (identity) => [identity.cloud, identity.tenantId.toLowerCase(), identity.objectId.toLowerCase(), identity.accountId].join("|");
function sanitizePersonalError(error) {
  return personalError(safeText(error?.code || "personal_diagnostics_failed", 64), safeText(error?.message || "The personal source operation failed.", 400), error?.recovery ? safeText(error.recovery, 400) : void 0);
}
function validateNamespaceId(value) {
  const id = string(value, "namespace resource ID", 512);
  if (!NAMESPACE.test(id)) throw personalError("invalid_namespace", "Choose an explicit Microsoft.Web/connectorGateways ARM resource ID.");
  return id;
}
function validateResourceId(value) {
  const id = string(value, "resource ID", 1024);
  if (!RESOURCE.test(id) || id.includes("..") || id.includes("//")) throw personalError("invalid_resource", "A full, unambiguous Azure resource ID is required.");
  return id;
}
function validatePersonalConnectionRuntimeUrl({ runtimeUrl, cloud, connectorName }) {
  let runtime;
  try {
    runtime = new URL(runtimeUrl);
  } catch {
    throw personalError("runtime_contract_unverified", "The verified connection has no supported runtime URL.");
  }
  const gateway = runtime.hostname.endsWith(".logic.azure.com") && /^\/api\/connectorGateways\/[a-z0-9_-]+\/connections\/[a-z0-9_-]+\/?$/i.test(runtime.pathname);
  const apim = /^[a-z0-9-]+\.azure-apihub\.net$/i.test(runtime.hostname) && /^\/apim\/[a-z0-9_-]+\/[a-z0-9_-]+\/?$/i.test(runtime.pathname) && runtime.pathname.split("/")[2].toLowerCase() === String(connectorName).toLowerCase();
  if (runtime.protocol !== "https:" || runtime.username || runtime.password || runtime.port || runtime.search || runtime.hash || cloud !== "AzureCloud" || !gateway && !apim) {
    throw personalError("runtime_contract_unverified", "The connection runtime URL/cloud contract has not been qualified.", "Use a verified namespace or SDK APIM runtime URL without credentials, or choose a direct diagnostic source.");
  }
  runtime.pathname = runtime.pathname.replace(/\/$/, "");
  return runtime;
}
function normalizeSource(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw personalError("invalid_source", "A diagnostic source is required.");
  if (Object.keys(input).some((key) => /token|secret|password|credential|api.?key/i.test(key))) {
    throw personalError("secret_reference", "Save nonsecret resource references only, never credentials.");
  }
  const source = {};
  for (const field of SOURCE_FIELDS) if (input[field] !== void 0 && input[field] !== "") source[field] = string(input[field], field, field.endsWith("Id") ? 1024 : 256);
  if (!["kusto", "logs", "appInsights", "metrics"].includes(source.kind) || !["direct", "namespace"].includes(source.transport)) {
    throw personalError("invalid_source", "Choose a supported diagnostic source and transport.");
  }
  if (!GUID.test(source.tenantId) || !PERSONAL_CLOUDS[source.cloud]) throw personalError("invalid_source", "Pin the source to a tenant and supported Azure cloud.");
  source.tenantId = source.tenantId.toLowerCase();
  source.name = string(source.name, "source name", 120);
  if (source.clusterUrl) {
    source.clusterUrl = normalizePersonalKustoEndpoint(source.clusterUrl, source.cloud);
  }
  if (source.kind === "kusto") {
    if (!source.clusterUrl || !source.database) throw personalError("invalid_source", "Enter the cluster URL and a known database; enumeration is not required.");
    if (/["'\\;\r\n]/.test(source.database) || source.database.length > 128) throw personalError("invalid_source", "The database name contains unsupported characters.");
  }
  if (source.workspaceId && !GUID.test(source.workspaceId)) throw personalError("invalid_source", "Use the Log Analytics workspace GUID.");
  if (source.workspaceId) source.workspaceId = source.workspaceId.toLowerCase();
  if (source.resourceId) source.resourceId = validateResourceId(source.resourceId);
  if (["logs", "appInsights"].includes(source.kind) && !source.workspaceId && !source.resourceId) throw personalError("invalid_source", "Choose an explicit workspace or resource.");
  if (source.kind === "metrics" && !source.resourceId) throw personalError("invalid_source", "Metrics require an explicit resource.");
  if (source.kind === "kusto") {
    delete source.workspaceId;
    delete source.resourceId;
  } else {
    delete source.clusterUrl;
    delete source.database;
  }
  if (source.kind === "metrics") delete source.workspaceId;
  if (source.transport === "namespace") {
    source.namespaceId = validateNamespaceId(source.namespaceId);
    const connection = string(source.connectionId, "connection ID", 1024);
    const name = connection.startsWith("/") ? connection.slice(`${source.namespaceId}/connections/`.length) : connection;
    if (connection.startsWith("/") && !connection.toLowerCase().startsWith(`${source.namespaceId}/connections/`.toLowerCase()) || !/^[a-z0-9_-]{1,128}$/i.test(name)) {
      throw personalError("invalid_connection", "The connection must belong to the selected namespace.");
    }
    source.connectionId = `${source.namespaceId}/connections/${name}`;
  } else {
    delete source.namespaceId;
    delete source.connectionId;
  }
  return Object.freeze(source);
}
function assertSourceIdentity(source, identity) {
  if (source.tenantId.toLowerCase() !== identity.tenantId || source.cloud !== identity.cloud || source.accountId && source.accountId !== identity.accountId) {
    throw personalError("identity_mismatch", "This source belongs to a different account, tenant or cloud.", "Change account or save a source for the current identity.");
  }
}
function bindPersonalCredential(credential, identity, audience, clock = Date.now) {
  if (!credential || typeof credential.getToken !== "function") throw personalError("credential_required", "The explicit-user credential provider returned no TokenCredential.");
  const resource = audience.replace(/\/$/, "");
  const publicArm = identity.cloud === "AzureCloud" && ["https://management.azure.com", "https://management.core.windows.net"].includes(resource);
  const permitted = publicArm ? ["https://management.azure.com", "https://management.core.windows.net"] : [resource];
  return Object.freeze({
    async getToken(scopes, options) {
      const requested = Array.isArray(scopes) ? scopes : [scopes];
      const expected = requested[0];
      if (requested.length !== 1 || !permitted.some((value) => expected === `${value}/.default`)) throw personalError("audience_mismatch", "An SDK requested an audience outside the approved source.");
      const token = await credential.getToken(expected, options);
      let claims;
      try {
        claims = JSON.parse(Buffer.from(token.token.split(".")[1], "base64url").toString("utf8"));
      } catch {
        throw personalError("identity_unverified", "The credential did not provide verifiable Azure user-token claims.", "Use the supported explicit-user authentication provider.");
      }
      let issuer;
      try {
        issuer = typeof claims.iss === "string" ? new URL(claims.iss) : null;
      } catch {
        issuer = null;
      }
      const authority = PERSONAL_CLOUDS[identity.cloud].authority;
      const issuerAllowed = issuer && (issuer.hostname === authority || identity.cloud === "AzureCloud" && issuer.hostname === "sts.windows.net");
      if (String(claims.tid).toLowerCase() !== identity.tenantId || String(claims.oid).toLowerCase() !== identity.objectId || claims.idtyp === "app" || typeof claims.scp !== "string" || !claims.scp || typeof claims.aud !== "string" || !permitted.includes(claims.aud.replace(/\/$/, "")) || !issuerAllowed || !issuer.pathname.toLowerCase().includes(identity.tenantId) || !Number.isFinite(claims.exp) || claims.exp * 1e3 <= Number(clock()) || claims.nbf && claims.nbf * 1e3 > Number(clock()) + 3e4) {
        throw personalError("identity_mismatch", "The acquired token does not match the approved user, tenant, cloud and audience.", "Sign in with the intended user; application and shared credentials are not personal authentication.");
      }
      return token;
    }
  });
}
async function readBoundedPersonalJson(response) {
  if (!response.ok) throw personalError(response.status === 404 ? "connection_deleted" : response.status === 403 ? "access_denied" : "catalog_request_failed", `Namespace metadata request failed (HTTP ${response.status}).`, "Check namespace access, sign-in and the cloud resource in Azure Portal.");
  const reader = response.body?.getReader();
  if (!reader) return response.json();
  let size = 0;
  const chunks = [];
  for (; ; ) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1024 * 1024) {
      await reader.cancel();
      throw personalError("catalog_too_large", "The namespace metadata exceeds the bounded catalog limit.", "Select a smaller explicitly scoped namespace.");
    }
    chunks.push(Buffer.from(value));
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw personalError("catalog_contract_unverified", "The namespace returned an unsupported metadata response.");
  }
}

// canvases/azure-sre-agent/src/personal-diagnostics-transport.mjs
var PERSONAL_LIMITS = Object.freeze({ queryChars: 16e3, rows: 100, columns: 32, cellChars: 1e3, resultBytes: 65536, timeoutMs: 3e4, tables: 30, sources: 20, drafts: 100, runs: 100 });
var IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]{0,127}$/;
var FORBIDDEN = /\b(?:cluster|database|workspace|app|resource|externaldata|external_table|http_request|http_request_post|sql_request|cosmosdb_sql_request|materialized_view|stored_query_result|macro-expand|invoke|evaluate|execute|restrict|set|declare)\b/i;
var LOG_BUILTINS = new Set("ago now datetime timespan time date bin bin_at bin_auto count countif dcount dcountif sum sumif avg avgif min max percentile percentiles arg_max arg_min make_list make_set tostring toint tolong todouble tobool todatetime todecimal totimespan dynamic parse_json bag_keys bag_has_key array_length array_index_of array_concat coalesce iff iif case isnull isnotnull isempty isnotempty isfinite not strcat strcat_array strlen substring split trim trim_start trim_end tolower toupper replace_string extract extract_all replace_regex format_datetime format_timespan datetime_diff datetime_add startofday startofhour startofweek endofday round floor ceiling abs sqrt pow log exp hash md5 has_any_index indexof format_bytes pack bag_pack bag_merge gettype toscalar materialize range table".split(" "));
function maskKql(query) {
  let masked = "", index = 0;
  while (index < query.length) {
    const char = query[index], next = query[index + 1];
    if (char === "/" && next === "/") {
      const end = query.indexOf("\n", index);
      const stop = end < 0 ? query.length : end;
      masked += " ".repeat(stop - index);
      index = stop;
    } else if (char === "/" && next === "*") {
      const end = query.indexOf("*/", index + 2);
      if (end < 0) throw personalError("invalid_query", "Complete the KQL comment before running.");
      masked += " ".repeat(end + 2 - index);
      index = end + 2;
    } else if (char === "'" || char === '"') {
      const quote = char, start = index++;
      let closed = false;
      while (index < query.length) {
        if (query[index] === "\\") {
          index += 2;
          continue;
        }
        if (query[index] === quote) {
          if (query[index + 1] === quote) {
            index += 2;
            continue;
          }
          index++;
          closed = true;
          break;
        }
        index++;
      }
      if (!closed) throw personalError("invalid_query", "Complete the KQL string before running.");
      masked += " ".repeat(index - start);
    } else {
      masked += char;
      index++;
    }
  }
  return masked;
}
function validatePersonalKql(query, { source, schema } = {}) {
  if (typeof query !== "string" || !query.trim() || query.length > PERSONAL_LIMITS.queryChars) throw personalError("invalid_query", `Provide complete KQL of at most ${PERSONAL_LIMITS.queryChars} characters.`);
  if (safeText(query, query.length) !== query) throw personalError("secret_query", "Query drafts must not contain credentials or signed links.");
  const masked = maskKql(query);
  if (masked.split(";").some((statement) => /^\s*\./.test(statement)) || FORBIDDEN.test(masked) || /\]\s*\(/.test(masked) || /(?:^|[|;])\s*(?:union|search|find)\b[^|;]*\*/i.test(masked)) {
    throw personalError("readonly_scope_violation", "Only local read-only KQL is supported; management commands, external access, cross-source references, plugins and scope/limit overrides are blocked.");
  }
  if (source && (source.kind === "logs" || source.kind === "appInsights" || source.transport === "namespace")) {
    if (/[^\x20-\x7e\s]/.test(masked)) throw personalError("unsupported_query_identifier", "Non-ASCII query identifiers need the direct Data Explorer adapter with server-enforced source isolation.");
    for (const match of masked.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) {
      if (!LOG_BUILTINS.has(match[1].toLowerCase()) && !["in", "between", "on"].includes(match[1].toLowerCase())) throw personalError("unsupported_query_function", "Unverified stored functions cannot be used on this transport; use supported built-in KQL or direct Data Explorer with server-enforced source isolation.");
    }
    if (/\btable\s*\(/i.test(masked) || /\blet\s+\w+\s*=\s*\(/i.test(masked)) throw personalError("readonly_scope_violation", "Dynamic table resolution and user-defined functions cannot establish this source boundary.");
    const probe = /^\s*print\s+[A-Za-z_]\w*\s*=\s*(?:\d+|true|false)\s*;?\s*$/i.test(masked);
    if (!probe) {
      if (!schema?.verified) throw personalError("schema_required", "This transport needs verified local table metadata before reading tables.", "Refresh source schema, or use explicit KQL with the direct Data Explorer adapter.");
      const statements = masked.split(";").filter((statement) => statement.trim());
      const table = statements.length === 1 && statements[0].match(/^\s*([A-Za-z_]\w*)\s*(?:\||$)/)?.[1];
      if (!table || !schema.tables.some((item) => item.name === table)) throw personalError("unverified_table", "Use a single verified local table pipeline; unions, stored functions and dynamic source resolution need the direct Data Explorer adapter.");
      const allowed = /^(?:where|project(?:-away|-rename|-keep|-reorder)?|extend|summarize|take|limit|top|sort|order|distinct|serialize|count|getschema)\b/i;
      for (const pipe of statements[0].split("|").slice(1)) if (!allowed.test(pipe.trim())) throw personalError("unsupported_query_operator", "This transport supports bounded single-table diagnostic pipelines, not an unverified source-changing operator.");
      if (/\b(?:toscalar|materialize|table)\s*\(/i.test(masked)) throw personalError("readonly_scope_violation", "Subquery source resolution is not supported on this transport.");
    }
  }
  return query;
}
function normalizePersonalTimeRange(input, clock = Date.now) {
  const end = input?.end || input?.endTime || new Date(Number(clock())).toISOString();
  const start = input?.start || input?.startTime || new Date(new Date(end).getTime() - 36e5).toISOString();
  for (const boundary of [start, end]) if (!(boundary instanceof Date) && (typeof boundary !== "string" || !/T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(boundary))) {
    throw personalError("invalid_time_range", "Time boundaries must include an explicit UTC or timezone offset.");
  }
  const from = new Date(start), to = new Date(end);
  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to || to - from > 7 * 864e5) {
    throw personalError("invalid_time_range", "Use an explicit UTC start/end time spanning no more than seven days.");
  }
  return Object.freeze({ start: from.toISOString(), end: to.toISOString() });
}
function projectPersonalResult(raw) {
  if (!raw || !Array.isArray(raw.columns) || !Array.isArray(raw.rows)) throw personalError("result_contract_unverified", "The diagnostic backend returned no supported columns/rows result.");
  let truncated = raw.truncated === true || raw.columns.length > PERSONAL_LIMITS.columns || raw.rows.length > PERSONAL_LIMITS.rows;
  const columns = raw.columns.slice(0, PERSONAL_LIMITS.columns).map((column) => ({
    name: safeText(typeof column === "string" ? column : column?.name, 128),
    type: safeText(typeof column === "string" ? "unknown" : column?.type || "unknown", 48)
  }));
  const rows = [], limitations = (raw.limitations || []).slice(0, 8).map((value) => safeText(value));
  let bytes = Buffer.byteLength(JSON.stringify(columns));
  for (const row of raw.rows.slice(0, PERSONAL_LIMITS.rows)) {
    if (!Array.isArray(row) || row.length !== raw.columns.length) throw personalError("result_contract_unverified", "The backend returned a row that does not match its actual column metadata.");
    const projected = columns.map((column, index) => {
      let value = row[index];
      if (/password|secret|token|credential|authorization|cookie|api.?key/i.test(column.name)) return "[redacted]";
      if (value === null || value === void 0) return null;
      if (typeof value === "number") return Number.isFinite(value) ? value : safeText(value);
      if (typeof value === "boolean") return value;
      if (value instanceof Date) return value.toISOString();
      if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
        try {
          value = JSON.parse(value);
        } catch {
        }
      }
      if (typeof value === "object") {
        const seen = /* @__PURE__ */ new WeakSet();
        try {
          value = JSON.stringify(value, (key, item) => {
            if (/password|secret|token|credential|authorization|cookie|api.?key/i.test(key)) return "[redacted]";
            if (item && typeof item === "object") {
              if (seen.has(item)) return "[circular]";
              seen.add(item);
            }
            return item;
          });
        } catch {
          value = "[unrepresentable value]";
          truncated = true;
        }
      }
      const original = String(value);
      if (original.length > PERSONAL_LIMITS.cellChars) truncated = true;
      return safeText(original, PERSONAL_LIMITS.cellChars);
    });
    const size = Buffer.byteLength(JSON.stringify(projected));
    if (bytes + size > PERSONAL_LIMITS.resultBytes) {
      truncated = true;
      break;
    }
    bytes += size;
    rows.push(projected);
  }
  if (truncated) limitations.push("Results were bounded to 100 rows, 32 columns, 1,000 characters per cell and 64 KiB; omitted data is not evidence of absence.");
  return {
    columns,
    rows,
    receivedRows: raw.rows.length,
    partial: raw.partial === true,
    truncated,
    ...Number.isSafeInteger(raw.totalRows) && raw.totalRows >= raw.rows.length ? { totalRows: raw.totalRows } : {},
    limitations: [...new Set(limitations)]
  };
}
function requestProperties() {
  const properties = new ClientRequestProperties();
  for (const name of ["request_readonly", "request_readonly_hardline", "request_remote_entities_disabled", "request_external_data_disabled", "request_external_table_disabled", "request_callout_disabled", "request_impersonation_disabled", "request_sandboxed_execution_disabled"]) properties.setOption(name, true);
  properties.setOption("truncationmaxrecords", PERSONAL_LIMITS.rows + 1);
  properties.setOption("truncationmaxsize", 1024 * 1024);
  properties.setOption("maxoutputcolumns", PERSONAL_LIMITS.columns);
  properties.setOption("deferpartialqueryfailures", false);
  properties.setTimeout(PERSONAL_LIMITS.timeoutMs);
  properties.setClientTimeout(PERSONAL_LIMITS.timeoutMs);
  return properties;
}
function kustoResult(data) {
  const tables = data?.primaryResults;
  if (!Array.isArray(tables) || !tables.length) throw personalError("result_contract_unverified", "Data Explorer returned no primary result table.");
  const table = tables[0];
  const errors = typeof data.getExceptions === "function" ? data.getExceptions() : [];
  const warnings = typeof data.getWarnings === "function" ? data.getWarnings() : [];
  const partial = data.dataSetCompletion?.HasErrors === true || errors.length > 0;
  const rows = [];
  for (const row of table.rows()) {
    rows.push(table.columns.map((_, index) => row.getValueAt(index)));
    if (rows.length > PERSONAL_LIMITS.rows) break;
  }
  return { columns: table.columns, rows, partial, truncated: rows.length > PERSONAL_LIMITS.rows, limitations: [
    ...errors.slice(0, 3).map((error) => `Partial Data Explorer failure: ${safeText(error)}`),
    ...warnings.slice(0, 3).map((warning) => `Data Explorer warning: ${safeText(warning)}`),
    ...tables.length > 1 ? ["Only the first primary result table is displayed."] : []
  ] };
}
function logsResult(data) {
  if (!["Success", "PartialFailure"].includes(data?.status)) throw personalError("query_failed", "The Logs API did not return a successful or explicitly partial result.");
  const tables = data.status === "PartialFailure" ? data.partialTables : data.tables;
  if (!Array.isArray(tables) || !tables.length || !Array.isArray(tables[0].rows)) throw personalError("result_contract_unverified", "The Logs API returned an unsupported table response.");
  return { columns: tables[0].columns, rows: tables[0].rows, partial: data.status === "PartialFailure", limitations: [
    ...data.status === "PartialFailure" ? [`Partial Logs failure: ${safeText(data.partialError?.code)} ${safeText(data.partialError?.message)}`] : [],
    ...tables.length > 1 ? ["Only the first result table is displayed."] : []
  ] };
}
function connectorResult(data) {
  if (!Array.isArray(data?.value)) throw personalError("result_contract_unverified", "The namespace operation returned an unsupported row collection.");
  const names = [...new Set(data.value.slice(0, PERSONAL_LIMITS.rows + 1).flatMap((row) => Object.keys(row || {})))];
  if (data.value.some((row) => !row || typeof row !== "object" || Array.isArray(row))) throw personalError("result_contract_unverified", "The namespace returned an unsupported result row.");
  return { columns: names.map((name) => ({ name, type: "unknown" })), rows: data.value.map((row) => names.map((name) => row[name])), limitations: ["The namespace operation does not expose column types or server truncation statistics."] };
}
function schemaProjection(tables) {
  if (!Array.isArray(tables)) throw personalError("schema_contract_unverified", "The backend did not return a supported table schema.");
  return { verified: true, tables: tables.filter((table) => IDENTIFIER.test(table?.name || table?.Name || "")).slice(0, PERSONAL_LIMITS.tables).map((table) => ({
    name: table.name || table.Name,
    columns: (table.columns || table.OrderedColumns || []).slice(0, PERSONAL_LIMITS.columns).map((column) => ({ name: safeText(column.name || column.Name, 128), type: safeText(column.type || column.CslType || column.Type, 48) }))
  })), truncated: tables.length > PERSONAL_LIMITS.tables };
}
function personalSourceAudience(source) {
  return source.transport === "namespace" ? "https://apihub.azure.com" : source.kind === "kusto" ? PERSONAL_CLOUDS[source.cloud].kusto || source.clusterUrl : source.kind === "metrics" ? PERSONAL_CLOUDS[source.cloud].arm : PERSONAL_CLOUDS[source.cloud].logs;
}
function createPersonalDiagnosticsTransport({ clock = Date.now, fetchImpl = globalThis.fetch, clients = {} } = {}) {
  const DataClient = clients.KustoDataClient || KustoDataClient;
  const LogsClient = clients.LogsQueryClient || LogsQueryClient;
  const ConnectorKusto = clients.NamespaceKustoClient || NamespaceKustoClient;
  const ConnectorLogs = clients.NamespaceLogsClient || NamespaceLogsClient;
  const KustoCloud = clients.KustoCloudSettings || KustoCloudSettings;
  async function getAudience({ source, signal }) {
    source = normalizeSource(source);
    if (signal?.aborted) throw personalError("cancelled", "The diagnostic request was cancelled before audience selection.");
    if (source.transport !== "direct" || source.kind !== "kusto" || source.cloud !== "AzureCloud") return personalSourceAudience(source);
    const metadata = await KustoCloud.getCloudInfoForCluster(source.clusterUrl);
    if (signal?.aborted) throw personalError("cancelled", "The diagnostic request was cancelled during audience selection.");
    if (metadata?.KustoServiceResourceId !== PERSONAL_CLOUDS.AzureCloud.kusto) throw personalError("audience_mismatch", "Data Explorer metadata requested a resource outside the pinned public Kusto service.");
    return metadata.LoginMfaRequired ? metadata.KustoServiceResourceId.replace(".kusto.", ".kustomfa.") : metadata.KustoServiceResourceId;
  }
  async function checked(input) {
    const source = normalizeSource(input.source), identity = normalizeIdentity(input.identity);
    assertSourceIdentity(source, identity);
    if (input.signal?.aborted) throw personalError("cancelled", "The diagnostic request was cancelled.");
    const audience = await getAudience({ source, signal: input.signal });
    const credential = bindPersonalCredential(input.credential, identity, audience, clock);
    await credential.getToken(`${audience}/.default`, { abortSignal: input.signal });
    if (input.signal?.aborted) throw personalError("cancelled", "The diagnostic request was cancelled before dispatch.");
    return { source, identity, credential, audience };
  }
  async function kustoRead(input, query2, management = false) {
    const { source, credential, audience } = await checked(input);
    const client = new DataClient(KustoConnectionStringBuilder.withTokenProvider(source.clusterUrl, async () => (await credential.getToken(`${audience}/.default`, { abortSignal: input.signal })).token));
    const abort = () => client.close();
    input.signal?.addEventListener("abort", abort, { once: true });
    try {
      if (input.signal?.aborted) throw personalError("cancelled", "The diagnostic request was cancelled.");
      return await (management ? client.executeMgmt(source.database, query2, requestProperties()) : client.executeQuery(source.database, query2, requestProperties()));
    } finally {
      input.signal?.removeEventListener("abort", abort);
      client.close();
    }
  }
  async function readJson(input, audience, path) {
    const credential = bindPersonalCredential(input.credential, normalizeIdentity(input.identity), audience, clock);
    const token = await credential.getToken(`${audience}/.default`, { abortSignal: input.signal });
    const response = await fetchImpl(`${audience}${path}`, { method: "GET", headers: { Authorization: `Bearer ${token.token}` }, redirect: "error", signal: input.signal || AbortSignal.timeout(PERSONAL_LIMITS.timeoutMs) });
    if (!response.ok) throw personalError("source_access_failed", `The scoped read failed (HTTP ${response.status}).`, "Check this user's source permissions and service connectivity.");
    return readBoundedPersonalJson(response);
  }
  async function schema(input) {
    const { source } = await checked(input);
    if (source.transport === "namespace") {
      if (!input.connection?.schema?.verified) throw personalError("schema_unavailable", "This namespace has no verified schema read contract.");
      return schemaProjection(input.connection.schema.tables);
    }
    if (source.kind === "kusto") {
      const result = kustoResult(await kustoRead(input, ".show database schema as json", true));
      if (result.partial) throw personalError("schema_incomplete", "Data Explorer returned a partial schema response; table-based recipes are not enabled.");
      const value = result.rows[0]?.[0];
      let metadata;
      try {
        metadata = JSON.parse(value);
      } catch {
        throw personalError("schema_contract_unverified", "Data Explorer returned an unsupported database schema.");
      }
      const database = metadata.Databases?.[source.database];
      if (!database?.Tables) throw personalError("schema_contract_unverified", "The schema response did not identify the explicitly selected database.");
      return schemaProjection(Object.values(database.Tables));
    }
    if (source.kind === "metrics") {
      const response2 = await readJson(input, PERSONAL_CLOUDS[source.cloud].arm, `${source.resourceId}/providers/Microsoft.Insights/metricDefinitions?api-version=2018-01-01`);
      if (!Array.isArray(response2.value)) throw personalError("schema_contract_unverified", "The metrics API returned no metric definitions.");
      return { verified: true, tables: [], metrics: response2.value.slice(0, 30).map((metric) => ({ name: safeText(metric.name?.value, 128), aggregations: (metric.supportedAggregationTypes || []).slice(0, 8).map((name) => safeText(name, 32)) })) };
    }
    const scope = source.resourceId || `/workspaces/${source.workspaceId}`;
    const response = await readJson(input, PERSONAL_CLOUDS[source.cloud].logs, `/v1${scope}/metadata`);
    return schemaProjection(response.tables);
  }
  async function query(input) {
    validatePersonalKql(input.query, { source: normalizeSource(input.source), schema: input.schema });
    const { source, identity, credential } = await checked(input);
    const timeRange = normalizePersonalTimeRange(input.timeRange, clock);
    if (source.transport === "namespace") {
      const connection = input.connection;
      let runtime;
      try {
        runtime = validatePersonalConnectionRuntimeUrl({ runtimeUrl: connection?.runtimeUrl, cloud: source.cloud, connectorName: source.kind === "kusto" ? "kusto" : "azuremonitorlogs" });
      } catch {
        runtime = null;
      }
      if (!connection || connection.status !== "Verified" || connection.id !== source.connectionId || connection.privateCallerAccess !== true || connection.connectionHealthy !== true || connection.connectionAuthenticated !== true || connection.verifiedIdentity !== identityKey(identity) || connection.queryScopeEnforced !== true || !runtime || connection.source?.database !== source.database || connection.source?.clusterUrl !== source.clusterUrl || connection.source?.workspaceId !== source.workspaceId || connection.source?.resourceId !== source.resourceId) {
        throw personalError("namespace_scope_unverified", "The namespace has no verified private caller access, authenticated connection and source-isolated query boundary.", "Check private namespace access and connection authentication; qualify its enforced read scope or use the direct diagnostic adapter.");
      }
      const tokenProvider = { getAccessTokenAsync: async (scopes) => (await credential.getToken(scopes, { abortSignal: input.signal })).token };
      const options2 = { timeoutMs: PERSONAL_LIMITS.timeoutMs, maxRetryAttempts: 0 };
      if (source.kind === "kusto") {
        if (!connection.operations.includes("ListKustoResults")) throw personalError("operation_unavailable", "The connection does not expose the verified Kusto read operation.");
        const client3 = new ConnectorKusto(connection.runtimeUrl, tokenProvider, options2);
        const result2 = connectorResult(await client3.listKustoResultsAsync({ cluster: source.clusterUrl, db: source.database, csl: input.query }, input.signal));
        return { ...result2, limitations: [...result2.limitations, "For namespace KQL, the displayed time range is context; the exact query's filters restrict data."] };
      }
      if (!connection.operations.includes("queryDataV2") || !source.resourceId) throw personalError("operation_unavailable", "Namespace Logs reads need the qualified queryDataV2 operation and exact resource binding.");
      const match = source.resourceId.match(/^\/subscriptions\/([^/]+)\/resourceGroups\/([^/]+)\/providers\/Microsoft\.(OperationalInsights|Insights)\/(workspaces|components)\/([^/]+)$/i);
      if (!match) throw personalError("unsupported_logs_resource", "This namespace Logs resource binding has not been qualified.");
      if (connection.logsBinding?.verified !== true || connection.logsBinding.resourceId.toLowerCase() !== source.resourceId.toLowerCase() || typeof connection.logsBinding.resourceType !== "string" || connection.logsBinding.resourceType.length > 128) {
        throw personalError("operation_contract_unverified", "The namespace Logs operation's resource-type selector has not been verified.", "Qualify the service's resource-type selector for this resource, or use the direct Logs SDK.");
      }
      const client2 = new ConnectorLogs(connection.runtimeUrl, tokenProvider, options2);
      const result = connectorResult(await client2.queryDataAsync({ query: input.query, timerangetype: "SetInQuery", timerange: {} }, match[1], match[2], connection.logsBinding.resourceType, match[5], input.signal));
      return { ...result, limitations: [...result.limitations, "The namespace operation uses SetInQuery; only time filters in the exact KQL restrict data."] };
    }
    if (source.kind === "kusto") {
      const result = kustoResult(await kustoRead(input, input.query));
      return { ...result, limitations: [...result.limitations, "For explicit Data Explorer KQL, the displayed time range is context; only filters in the exact query restrict its data."] };
    }
    if (source.kind === "metrics") throw personalError("unsupported_query", "Metrics use the verified resource-metrics recipe, not KQL.");
    const audience = PERSONAL_CLOUDS[source.cloud].logs;
    const client = new LogsClient(credential, { endpoint: `${audience}/v1`, credentials: { scopes: [`${audience}/.default`] }, retryOptions: { maxRetries: 0 } });
    client.pipeline.addPolicy({ name: "personalDiagnosticsScope", async sendRequest(request, next) {
      if (new URL(request.url).origin !== audience) throw personalError("endpoint_mismatch", "The Logs client attempted to leave the pinned cloud endpoint.");
      request.abortSignal = input.signal;
      request.timeout = PERSONAL_LIMITS.timeoutMs;
      return next(request);
    } }, { phase: "Sign" });
    const options = { serverTimeoutInSeconds: 30 };
    const interval = { startTime: new Date(timeRange.start), endTime: new Date(timeRange.end) };
    return logsResult(await (source.resourceId ? client.queryResource(source.resourceId, input.query, interval, options) : client.queryWorkspace(source.workspaceId, input.query, interval, options)));
  }
  const api = {
    query,
    schema,
    getAudience,
    async testSource(input) {
      const { source } = await checked(input);
      if (source.kind === "metrics") return { connected: true, schema: await schema(input) };
      await query({ ...input, query: "print PersonalDiagnosticsAccess = 1" });
      try {
        return { connected: true, schema: await schema(input) };
      } catch (error) {
        return { connected: true, schema: { verified: false, tables: [], error: { code: safeText(error.code || "schema_failed", 64), message: safeText(error.message) } }, limitations: ["Source access succeeded, but schema discovery failed. No table-based recipe is available."] };
      }
    },
    async discoverDatabases(input) {
      if (input.source.transport !== "direct" || input.source.kind !== "kusto") throw personalError("enumeration_unavailable", "Database enumeration is available only through direct Data Explorer.");
      const result = kustoResult(await kustoRead(input, ".show databases", true));
      const index = result.columns.findIndex((column) => column.name === "DatabaseName");
      if (index < 0) throw personalError("catalog_contract_unverified", "Data Explorer returned no DatabaseName column.");
      return { databases: result.rows.slice(0, 30).map((row) => safeText(row[index], 128)), partial: result.partial === true, truncated: result.rows.length > 30, limitations: result.limitations };
    },
    async queryMetrics(input) {
      const { source } = await checked(input);
      if (source.kind !== "metrics" || source.transport !== "direct") throw personalError("operation_unavailable", "The resource-metrics recipe is a direct ARM read.");
      const definitions = input.schema?.verified ? input.schema : await schema(input);
      const names = input.metricNames;
      if (!Array.isArray(names) || !names.length || names.length > 5 || names.some((name) => !definitions.metrics?.some((metric) => metric.name === name && metric.aggregations.includes("Average")))) throw personalError("unverified_metric", "Choose one to five verified metrics supporting Average aggregation.");
      const range = normalizePersonalTimeRange(input.timeRange, clock);
      const params = new URLSearchParams({ "api-version": "2018-01-01", timespan: `${range.start}/${range.end}`, interval: "PT5M", metricnames: names.join(","), aggregation: "Average" });
      const data = await readJson(input, PERSONAL_CLOUDS[source.cloud].arm, `${source.resourceId}/providers/Microsoft.Insights/metrics?${params}`);
      if (!Array.isArray(data.value)) throw personalError("result_contract_unverified", "The metrics API returned an unsupported response.");
      const rows = [], limitations = [];
      for (const metric of data.value) {
        if (metric.errorCode && metric.errorCode !== "Success") limitations.push(`Metric ${safeText(metric.name?.value)} failed: ${safeText(metric.errorCode)} ${safeText(metric.errorMessage)}`);
        for (const series of metric.timeseries || []) for (const point of series.data || []) {
          rows.push([metric.name?.value, point.timeStamp, point.average ?? null, (series.metadatavalues || []).map((dimension) => `${safeText(dimension.name?.value)}=${safeText(dimension.value)}`).join("; ")]);
        }
      }
      return { columns: [{ name: "Metric", type: "string" }, { name: "TimeStamp", type: "datetime" }, { name: "Average", type: "real" }, { name: "Dimensions", type: "string" }], rows, partial: limitations.length > 0, limitations };
    }
  };
  for (const name of Object.keys(api)) {
    const operation = api[name];
    api[name] = async (...args) => {
      try {
        return await operation(...args);
      } catch (error) {
        throw sanitizePersonalError(error);
      }
    };
  }
  return Object.freeze(api);
}
export {
  PERSONAL_LIMITS,
  createPersonalDiagnosticsTransport,
  normalizePersonalTimeRange,
  personalSourceAudience,
  projectPersonalResult,
  validatePersonalKql
};
