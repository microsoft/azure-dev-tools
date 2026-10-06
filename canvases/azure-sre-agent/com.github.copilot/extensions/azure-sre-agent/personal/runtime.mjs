import { createRequire as __canvasCreateRequire } from "node:module";
const require = __canvasCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// canvases/azure-sre-agent/src/personal-consent-origin.mjs
function validatePersonalConsentUrl(value) {
  const supported = /* @__PURE__ */ new Set(["portal.azure.com", "login.microsoftonline.com", "global.consent.azure-apim.net"]);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Unsupported provider consent link. Your source and draft are preserved.");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port || !supported.has(url.hostname)) {
    throw new Error("Unsupported provider consent origin. No browser login was started; your source and draft are preserved.");
  }
  return url;
}
var init_personal_consent_origin = __esm({
  "canvases/azure-sre-agent/src/personal-consent-origin.mjs"() {
  }
});

// canvases/azure-sre-agent/src/personal-kusto-endpoints.mjs
function normalizePersonalKustoEndpoint(value, cloud) {
  const suffix = {
    AzureCloud: ".kusto.windows.net",
    AzureUSGovernment: ".kusto.usgovcloudapi.net",
    AzureChinaCloud: ".kusto.chinacloudapi.cn"
  }[cloud];
  const invalid2 = () => Object.assign(new Error("Use an HTTPS Data Explorer engine endpoint, or a supported public ADX cluster link, in the pinned Azure cloud without credentials, encoded separators, query parameters or extra paths."), { code: "invalid_endpoint" });
  if (!suffix || typeof value !== "string" || value.length > 256 || /[\s\\%?#]/.test(value.trim())) throw invalid2();
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw invalid2();
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash) throw invalid2();
  if (url.hostname === "dataexplorer.azure.com") {
    if (cloud !== "AzureCloud") throw invalid2();
    const match = /^https:\/\/dataexplorer\.azure\.com\/clusters\/([a-z0-9.-]+)\/?$/i.exec(value.trim());
    if (!match) throw invalid2();
    const cluster = match[1].toLowerCase();
    if (cluster.endsWith(suffix)) url = new URL(`https://${cluster}`);
    else {
      if (cluster !== "help" && !/^[a-z0-9-]+\.[a-z0-9-]+$/.test(cluster)) throw invalid2();
      url = new URL(`https://${cluster}${suffix}`);
    }
  } else if (!/^https:\/\/[a-z0-9.-]+\/?$/i.test(value.trim())) throw invalid2();
  if (!url.hostname.endsWith(suffix) || url.hostname.length <= suffix.length || url.pathname !== "/" || !url.hostname.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) throw invalid2();
  return url.origin;
}
var init_personal_kusto_endpoints = __esm({
  "canvases/azure-sre-agent/src/personal-kusto-endpoints.mjs"() {
  }
});

// canvases/azure-sre-agent/src/personal-source-catalog.mjs
var personal_source_catalog_exports = {};
__export(personal_source_catalog_exports, {
  CONNECTOR_API_VERSION: () => CONNECTOR_API_VERSION,
  PERSONAL_CLOUDS: () => PERSONAL_CLOUDS,
  assertSourceIdentity: () => assertSourceIdentity,
  bindPersonalCredential: () => bindPersonalCredential,
  createPersonalKustoConfigurationDefinition: () => createPersonalKustoConfigurationDefinition,
  createPersonalSourceCatalog: () => createPersonalSourceCatalog,
  fingerprint: () => fingerprint,
  identityKey: () => identityKey2,
  loadConnection: () => loadConnection,
  normalizeIdentity: () => normalizeIdentity,
  normalizeSource: () => normalizeSource,
  parsePersonalDiagnosticConfiguration: () => parsePersonalDiagnosticConfiguration,
  personalError: () => personalError,
  readBoundedPersonalJson: () => readBoundedPersonalJson,
  safeText: () => safeText,
  sanitizePersonalError: () => sanitizePersonalError,
  validateNamespaceId: () => validateNamespaceId,
  validatePersonalConnectionRuntimeUrl: () => validatePersonalConnectionRuntimeUrl,
  validateResourceId: () => validateResourceId
});
import { createHash as createHash3 } from "node:crypto";
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
  if (!identity || !GUID2.test(identity.tenantId) || !GUID2.test(identity.objectId) || !PERSONAL_CLOUDS[identity.cloud]) {
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
  if (!GUID2.test(source.tenantId) || !PERSONAL_CLOUDS[source.cloud]) throw personalError("invalid_source", "Pin the source to a tenant and supported Azure cloud.");
  source.tenantId = source.tenantId.toLowerCase();
  source.name = string(source.name, "source name", 120);
  if (source.clusterUrl) {
    source.clusterUrl = normalizePersonalKustoEndpoint(source.clusterUrl, source.cloud);
  }
  if (source.kind === "kusto") {
    if (!source.clusterUrl || !source.database) throw personalError("invalid_source", "Enter the cluster URL and a known database; enumeration is not required.");
    if (/["'\\;\r\n]/.test(source.database) || source.database.length > 128) throw personalError("invalid_source", "The database name contains unsupported characters.");
  }
  if (source.workspaceId && !GUID2.test(source.workspaceId)) throw personalError("invalid_source", "Use the Log Analytics workspace GUID.");
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
function createPersonalKustoConfigurationDefinition({ namespaceId, connectionId, configurationName, source, operationName = "ListKustoResults" }) {
  namespaceId = validateNamespaceId(namespaceId);
  const normalized = normalizeSource({ ...source, transport: "namespace", namespaceId, connectionId });
  configurationName = string(configurationName, "configuration name", 128);
  if (!/^[a-z0-9_-]+$/i.test(configurationName) || !/^ListKustoResults(?:Post)?$/i.test(operationName) || normalized.kind !== "kusto") {
    throw personalError("binding_contract_unverified", "Choose a named Kusto configuration and the verified read-query operation.");
  }
  return {
    path: `${namespaceId}/mcpserverConfigs/${configurationName}`,
    apiVersion: CONNECTOR_API_VERSION,
    body: { properties: {
      state: "Enabled",
      disableApiKeyAuth: true,
      connectors: [{
        name: "kusto",
        connectionName: normalized.connectionId.split("/").pop(),
        operations: [{
          name: operationName,
          displayName: "Run a read-only Kusto query",
          userParameters: [{ name: "cluster", value: normalized.clusterUrl }, { name: "db", value: normalized.database }],
          agentParameters: [{ name: "csl" }]
        }]
      }]
    } }
  };
}
function parsePersonalDiagnosticConfiguration({ namespaceId, connectionId, identity, configuration, configurationRevision }) {
  namespaceId = validateNamespaceId(namespaceId);
  identity = normalizeIdentity(identity);
  if (!configuration) throw personalError("binding_definition_missing", "The cloud diagnostic target definition is missing.", "Persist a Connector Namespace configuration with a fixed target, then read its authoritative definition again.");
  const prefix = `${namespaceId}/mcpserverConfigs/`;
  const id = string(configuration.id, "configuration resource ID", 1024);
  if (!id.toLowerCase().startsWith(prefix.toLowerCase()) || !/^[a-z0-9_-]{1,128}$/i.test(id.slice(prefix.length))) {
    throw personalError("binding_definition_mismatch", "The target definition does not belong to the selected Connector Namespace.");
  }
  const name = connectionId?.startsWith("/") ? connectionId.slice(`${namespaceId}/connections/`.length) : connectionId;
  if (!/^[a-z0-9_-]{1,128}$/i.test(name || "") || connectionId.startsWith("/") && !connectionId.toLowerCase().startsWith(`${namespaceId}/connections/`.toLowerCase())) {
    throw personalError("invalid_connection", "The target definition must reference a connection in the selected namespace.");
  }
  const properties = configuration.properties;
  if (properties?.state !== "Enabled" || properties.disableApiKeyAuth !== true || properties.provisioningState !== void 0 && properties.provisioningState !== "Succeeded") {
    throw personalError("binding_definition_unavailable", "The persisted diagnostic configuration is not enabled, ready and API-key-disabled.");
  }
  if (!Array.isArray(properties.connectors) || properties.connectors.length !== 1) throw personalError("binding_contract_unverified", "A bounded diagnostic configuration must contain exactly one connector.");
  const connector = properties.connectors[0];
  if (connector.connectionName !== name) throw personalError("binding_definition_mismatch", "The persisted configuration references a different connection.");
  if (connector.name !== "kusto") {
    throw personalError("binding_contract_unverified", "Only the persisted Kusto target-parameter serialization is qualified.", "Logs needs the managed operation's fixed resource-type selector and target-parameter contract; its serialization is not inferred from Kusto.");
  }
  if (!Array.isArray(connector.operations) || connector.operations.length !== 1) throw personalError("binding_contract_unverified", "The persisted diagnostic definition must expose exactly one verified read operation.");
  const operation = connector.operations[0];
  if (!/^ListKustoResults(?:Post)?$/i.test(operation?.name || "")) throw personalError("binding_contract_unverified", "The persisted definition does not expose the verified Kusto read-query operation.");
  if (!Array.isArray(operation.userParameters) || operation.userParameters.length !== 2 || !Array.isArray(operation.agentParameters) || operation.agentParameters.length !== 1 || operation.agentParameters[0]?.name !== "csl") {
    throw personalError("binding_scope_unverified", "Cluster and database must be fixed cloud user parameters; only csl may be supplied at query time.");
  }
  const parameters = new Map(operation.userParameters.map((parameter) => [parameter?.name, parameter?.value]));
  if (parameters.size !== 2 || !parameters.has("cluster") || !parameters.has("db")) throw personalError("binding_scope_unverified", "The cloud definition must fix exactly the SDK cluster and db parameters.");
  const source = normalizeSource({
    name: safeText(configuration.name || id.slice(prefix.length), 120),
    kind: "kusto",
    transport: "namespace",
    namespaceId,
    connectionId: name,
    clusterUrl: parameters.get("cluster"),
    database: parameters.get("db"),
    tenantId: identity.tenantId,
    cloud: identity.cloud,
    accountId: identity.accountId
  });
  return Object.freeze({
    source,
    operations: ["ListKustoResults"],
    queryScopeEnforced: true,
    configurationId: id,
    configurationFingerprint: fingerprint({ id, properties, etag: configuration.etag ?? null }),
    configurationRevision: configurationRevision != null ? string(configurationRevision, "configuration revision", 512) : configuration.etag != null ? string(configuration.etag, "configuration ETag", 512) : fingerprint({ id, properties })
  });
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
function createPersonalSourceCatalog({ credentialProvider, authorize, fetchImpl = globalThis.fetch, verifyConnection, clock = Date.now } = {}) {
  async function read(path2, identity) {
    const audience = PERSONAL_CLOUDS[identity.cloud].arm;
    if (typeof credentialProvider !== "function") throw personalError("credential_required", "Namespace discovery needs an explicit-user credential provider.");
    const credential = bindPersonalCredential(await credentialProvider({ ...identity, audience }), identity, audience, clock);
    const token = await credential.getToken(`${audience}/.default`);
    const url = `${audience}${path2}?api-version=${CONNECTOR_API_VERSION}`;
    const response = await fetchImpl(url, { method: "GET", headers: { Authorization: `Bearer ${token.token}` }, redirect: "error", signal: AbortSignal.timeout(3e4) });
    return { data: await readBoundedPersonalJson(response), etag: response.headers?.get("etag") || null };
  }
  async function readKustoBinding({ namespaceId, connectionId, identity, configurationId }) {
    const prefix = `${namespaceId}/mcpserverConfigs/`;
    function configurationReference(id) {
      if (typeof id !== "string" || !id.toLowerCase().startsWith(prefix.toLowerCase()) || !/^[a-z0-9_-]{1,128}$/i.test(id.slice(prefix.length))) {
        throw personalError("binding_definition_mismatch", "The persisted diagnostic definition must belong to the selected namespace.");
      }
      return id;
    }
    async function readConfiguration(id) {
      const { data: data2, etag: etag2 } = await read(configurationReference(id), identity);
      if (typeof data2?.id !== "string" || data2.id.toLowerCase() !== id.toLowerCase()) throw personalError("binding_definition_mismatch", "The service returned a different diagnostic definition.");
      return { data: data2, etag: etag2 };
    }
    if (configurationId !== void 0) {
      const { data: data2, etag: etag2 } = await readConfiguration(configurationId);
      return parsePersonalDiagnosticConfiguration({ namespaceId, connectionId, identity, configuration: data2, configurationRevision: etag2 || data2.etag });
    }
    const { data } = await read(`${namespaceId}/mcpserverConfigs`, identity);
    if (!Array.isArray(data?.value)) throw personalError("binding_catalog_unverified", "The namespace returned an unsupported MCP configuration inventory.");
    if (data.nextLink || data.value.length > 30) throw personalError("binding_catalog_incomplete", "The bounded configuration inventory cannot establish a unique diagnostic target.", "Select an exact configuration ID through the lifecycle verifier; no arbitrary page or target was selected.");
    const matches = [], seen = /* @__PURE__ */ new Set(), name = connectionId.split("/").pop();
    for (const row of data.value) {
      const id = configurationReference(row?.id);
      if (seen.has(id.toLowerCase())) throw personalError("binding_catalog_unverified", "The configuration inventory contains duplicate resource references.");
      seen.add(id.toLowerCase());
      const configuration2 = await readConfiguration(id);
      if (Array.isArray(configuration2.data.properties?.connectors) && configuration2.data.properties.connectors.some((connector) => typeof connector?.connectionName === "string" && (connector.connectionName === name || connector.connectionName.toLowerCase() === connectionId.toLowerCase()))) {
        matches.push(configuration2);
      }
    }
    if (matches.length > 1) throw personalError("binding_definition_ambiguous", "More than one persisted configuration references this connection.", "Select the exact configuration ID through the lifecycle verifier before registering a diagnostic source.");
    if (!matches.length) return null;
    const { data: configuration, etag } = matches[0];
    return parsePersonalDiagnosticConfiguration({ namespaceId, connectionId, identity, configuration, configurationRevision: etag || configuration.etag });
  }
  async function load({ namespaceId, connectionId, identity }) {
    identity = normalizeIdentity(identity);
    namespaceId = validateNamespaceId(namespaceId);
    const name = connectionId?.startsWith("/") ? connectionId.slice(`${namespaceId}/connections/`.length) : connectionId;
    if (!/^[a-z0-9_-]{1,128}$/i.test(name || "") || connectionId.startsWith("/") && !connectionId.toLowerCase().startsWith(`${namespaceId}/connections/`.toLowerCase())) {
      throw personalError("invalid_connection", "Choose a connection in the explicitly selected namespace.");
    }
    const id = `${namespaceId}/connections/${name}`;
    if (typeof authorize !== "function") throw personalError("permission_required", "Namespace metadata access requires the host permission surface.");
    await authorize({ operation: "load_personal_connection", sourceId: id, description: "Refresh this personal cloud connection and its authorization boundary.", mutates: false });
    const [namespace2, connection] = await Promise.all([read(namespaceId, identity), read(id, identity)]);
    if (connection.data?.id?.toLowerCase() !== id.toLowerCase() || namespace2.data?.id?.toLowerCase() !== namespaceId.toLowerCase()) {
      throw personalError("catalog_contract_unverified", "The service returned metadata for a different cloud resource.");
    }
    if (typeof verifyConnection !== "function") throw personalError("connection_access_unverified", "Fresh private caller access and provider connection health/authentication have not been checked.", "Use a direct diagnostic source, or supply the namespace's provider-owned connection and private caller access verifier.");
    const proof = await verifyConnection({ namespaceId, connectionId: id, identity, namespace: namespace2.data, connection: connection.data });
    const caller = proof?.gateway || proof?.caller || proof;
    if (proof?.invocationAllowed !== true || (proof.privateCallerAccess ?? proof.privateAccess) !== true || caller?.tenantId?.toLowerCase() !== identity.tenantId || caller?.objectId?.toLowerCase() !== identity.objectId || caller?.cloud !== identity.cloud || caller.accountId !== void 0 && caller.accountId !== identity.accountId) {
      throw personalError("connection_access_unverified", "The current Azure caller does not have verified namespace invocation access.", "Verify the current caller's access policy, then retry with the intended Azure user. Existing policies are not changed.");
    }
    if ((proof.providerHealthy ?? proof.connectionHealthy) !== true || (proof.authenticatedConnection ?? proof.connectionAuthenticated) !== true) {
      throw personalError("connection_not_authenticated", "The provider-owned connection is not healthy and authenticated.", "Complete or renew the provider-managed consent flow and check the connection again.");
    }
    if (proof.sourceAccess === false) throw personalError("source_access_denied", "The provider connection does not have access to the selected diagnostic source.", "Choose an authorized source or update its provider-owned access, then retry.");
    const providerAccount = proof.providerAccount == null || proof.providerAccount === "" ? void 0 : string(proof.providerAccount, "provider-reported consent account");
    const providerAccountLabel = providerAccount || "uses account chosen during consent";
    const connectorName = connection.data.properties?.connectorName;
    const binding = proof.configuration !== void 0 ? parsePersonalDiagnosticConfiguration({
      namespaceId,
      connectionId: id,
      identity,
      configuration: proof.configuration,
      configurationRevision: proof.configurationRevision
    }) : !proof.source && connectorName === "kusto" ? await readKustoBinding({ namespaceId, connectionId: id, identity, configurationId: proof.configurationId }) || proof : proof;
    const source = binding.source ? normalizeSource({ ...binding.source, transport: "namespace", namespaceId, connectionId: id, tenantId: identity.tenantId, cloud: identity.cloud, accountId: identity.accountId, providerAccount }) : void 0;
    if (source && (source.kind === "kusto" && connectorName !== "kusto" || ["logs", "appInsights"].includes(source.kind) && connectorName !== "azuremonitorlogs" || source.kind === "metrics")) {
      throw personalError("source_binding_unverified", "The verified source kind does not match a supported namespace read adapter.");
    }
    const runtime = validatePersonalConnectionRuntimeUrl({ runtimeUrl: proof.runtimeUrl ?? connection.data.properties?.connectionRuntimeUrl, cloud: identity.cloud, connectorName });
    const operations = Array.isArray(binding.operations) ? binding.operations.filter((value) => typeof value === "string" && /^[a-z][a-z0-9_.-]{0,127}$/i.test(value)).slice(0, 20) : [];
    const definition = {
      id,
      namespaceId,
      name: safeText(connection.data.properties?.displayName || name, 120),
      connectorName: safeText(connection.data.properties?.connectorName, 64),
      source,
      runtimeUrl: runtime.href,
      ...providerAccount ? { providerAccount } : {},
      providerAccountLabel,
      providerAccountStatus: providerAccount ? "provider-reported" : "unknown",
      privateCallerAccess: true,
      connectionHealthy: true,
      connectionAuthenticated: true,
      operations,
      ...binding.configurationId ? { configurationId: binding.configurationId } : {},
      ...binding.configurationFingerprint ? { configurationFingerprint: binding.configurationFingerprint } : {},
      ...binding.configurationRevision != null ? { configurationRevision: string(binding.configurationRevision, "configuration revision", 512) } : {},
      ...proof.consentRevision != null ? { consentRevision: string(proof.consentRevision, "consent revision", 512) } : {},
      queryScopeEnforced: binding.queryScopeEnforced === true,
      etag: connection.etag || connection.data.etag ? safeText(connection.etag || connection.data.etag, 128) : null,
      ...proof.logsBinding?.verified === true ? { logsBinding: {
        verified: true,
        resourceId: validateResourceId(proof.logsBinding.resourceId),
        resourceType: string(proof.logsBinding.resourceType, "verified Logs operation resource type", 128)
      } } : {},
      ...proof.schema?.verified === true ? { schema: {
        verified: true,
        tables: (proof.schema.tables || []).slice(0, 30).map((table) => ({
          name: safeText(table.name, 128),
          columns: (table.columns || []).slice(0, 32).map((column) => ({ name: safeText(column.name, 128), type: safeText(column.type, 48) }))
        }))
      } } : {}
    };
    return Object.freeze({
      ...definition,
      fingerprint: fingerprint(definition),
      verifiedIdentity: identityKey2(identity),
      status: source ? "Verified" : "Partial; target binding missing",
      ...!source ? { limitations: ["Connection health/private caller access are verified, but a persisted diagnostic target is missing."] } : binding.configurationId ? {
        targetAccessVerified: proof.sourceAccess === true,
        mcpInvocationVerified: false,
        limitations: ["The persisted fixed target and read-operation definition are validated. Registration does not test data access or MCP endpoint invocation; explicitly test and activate the source before use."]
      } : {}
    });
  }
  async function guardedLoad(input) {
    try {
      return await load(input);
    } catch (error) {
      throw sanitizePersonalError(error);
    }
  }
  return Object.freeze({
    loadConnection: guardedLoad,
    async discover({ namespaceId, identity }) {
      identity = normalizeIdentity(identity);
      namespaceId = validateNamespaceId(namespaceId);
      if (typeof authorize !== "function") throw personalError("permission_required", "Namespace discovery requires the host permission surface.");
      await authorize({ operation: "discover_personal_sources", sourceId: namespaceId, description: "Read the selected namespace's cloud connection catalog; do not activate or query connections.", mutates: false });
      const { data } = await read(`${namespaceId}/connections`, identity);
      if (!Array.isArray(data?.value)) throw personalError("catalog_contract_unverified", "The namespace returned an unsupported connection list.");
      const items = [];
      for (const row of data.value.slice(0, 30)) {
        const prefix = `${namespaceId}/connections/`;
        if (typeof row?.id !== "string" || !row.id.toLowerCase().startsWith(prefix.toLowerCase()) || !/^[a-z0-9_-]{1,128}$/i.test(row.id.slice(prefix.length))) throw personalError("catalog_contract_unverified", "The catalog contains an invalid connection reference or a connection outside the selected namespace.");
        try {
          const loaded = await load({ namespaceId, connectionId: row.id, identity });
          items.push({
            id: loaded.id,
            name: loaded.name,
            connectorName: loaded.connectorName,
            source: loaded.source,
            providerAccountLabel: loaded.providerAccountLabel,
            providerAccountStatus: loaded.providerAccountStatus,
            fingerprint: loaded.fingerprint,
            etag: loaded.etag,
            ...loaded.configurationId ? { configurationId: loaded.configurationId, configurationRevision: loaded.configurationRevision } : {},
            status: loaded.source ? "Verified; not activated" : loaded.status,
            ...loaded.limitations ? { limitations: loaded.limitations } : {}
          });
        } catch (error) {
          items.push({ id: row.id, name: safeText(row.properties?.displayName || row.name, 120), connectorName: safeText(row.properties?.connectorName, 64), status: "Unavailable", error: { code: safeText(error.code || "verification_failed", 64), message: safeText(error.message), recovery: safeText(error.recovery) } });
        }
      }
      return { namespaceId, sources: items, truncated: data.value.length > 30 || Boolean(data.nextLink), limitations: data.nextLink ? ["Additional cloud connections were not fetched."] : [] };
    }
  });
}
async function loadConnection({ namespaceId, connectionId, identity, catalog, ...options }) {
  return (catalog || createPersonalSourceCatalog(options)).loadConnection({ namespaceId, connectionId, identity });
}
var PERSONAL_CLOUDS, CONNECTOR_API_VERSION, GUID2, NAMESPACE, RESOURCE, SOURCE_FIELDS, identityKey2, fingerprint;
var init_personal_source_catalog = __esm({
  "canvases/azure-sre-agent/src/personal-source-catalog.mjs"() {
    init_personal_kusto_endpoints();
    PERSONAL_CLOUDS = Object.freeze({
      AzureCloud: { arm: "https://management.azure.com", logs: "https://api.loganalytics.io", kusto: "https://kusto.kusto.windows.net", kustoSuffix: ".kusto.windows.net", authority: "login.microsoftonline.com" },
      AzureUSGovernment: { arm: "https://management.usgovcloudapi.net", logs: "https://api.loganalytics.us", kustoSuffix: ".kusto.usgovcloudapi.net", authority: "login.microsoftonline.us" },
      AzureChinaCloud: { arm: "https://management.chinacloudapi.cn", logs: "https://api.loganalytics.azure.cn", kustoSuffix: ".kusto.chinacloudapi.cn", authority: "login.chinacloudapi.cn" }
    });
    CONNECTOR_API_VERSION = "2026-05-01-preview";
    GUID2 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    NAMESPACE = /^\/subscriptions\/[0-9a-f-]{36}\/resourceGroups\/[a-z0-9_.()-]+\/providers\/Microsoft\.Web\/connectorGateways\/[a-z0-9_-]+$/i;
    RESOURCE = /^\/subscriptions\/[0-9a-f-]{36}\/resourceGroups\/[a-z0-9_.()-]+\/providers\/[a-z0-9.]+\/[a-z0-9_./()-]+$/i;
    SOURCE_FIELDS = ["id", "name", "kind", "transport", "clusterUrl", "database", "workspaceId", "resourceId", "namespaceId", "connectionId", "tenantId", "cloud", "accountId", "providerAccount"];
    identityKey2 = (identity) => [identity.cloud, identity.tenantId.toLowerCase(), identity.objectId.toLowerCase(), identity.accountId].join("|");
    fingerprint = (value) => createHash3("sha256").update(JSON.stringify(value)).digest("hex");
  }
});

// canvases/azure-sre-agent/src/personal-diagnostics.mjs
var personal_diagnostics_exports = {};
__export(personal_diagnostics_exports, {
  createPersonalDiagnosticsService: () => createPersonalDiagnosticsService
});
import { randomUUID as randomUUID4 } from "node:crypto";
import {
  createPersonalDiagnosticsTransport,
  normalizePersonalTimeRange,
  personalSourceAudience,
  PERSONAL_LIMITS,
  projectPersonalResult,
  validatePersonalKql
} from "./diagnostics-transport.mjs";
function safeSchema(schema) {
  if (!schema?.verified) return { verified: false, tables: [], ...schema?.error ? { error: { code: safeText(schema.error.code, 64), message: safeText(schema.error.message) } } : {} };
  if (!Array.isArray(schema.tables)) throw personalError("schema_contract_unverified", "The source returned an unsupported schema.");
  return {
    verified: true,
    truncated: schema.truncated === true || schema.tables.length > PERSONAL_LIMITS.tables,
    tables: schema.tables.filter((table) => TABLE_NAME.test(table?.name || "")).slice(0, PERSONAL_LIMITS.tables).map((table) => ({
      name: table.name,
      columns: (table.columns || []).filter((column) => TABLE_NAME.test(column?.name || "")).slice(0, PERSONAL_LIMITS.columns).map((column) => ({ name: column.name, type: safeText(column.type || "unknown", 48) }))
    })),
    ...Array.isArray(schema.metrics) ? { metrics: schema.metrics.slice(0, 30).map((metric) => ({ name: safeText(metric.name, 128), aggregations: (metric.aggregations || []).slice(0, 8).map((name) => safeText(name, 32)) })) } : {}
  };
}
function recipesFor(source, schema) {
  if (!schema?.verified) return [];
  if (source.kind === "metrics") return schema.metrics?.length ? ["resource-metrics"] : [];
  if (!schema.tables.length) return [];
  const recipes = ["sample"];
  if (schema.tables.some((table) => table.columns.some((column) => column.type === "datetime"))) recipes.push("freshness");
  if (schema.tables.some((table) => table.columns.some((column) => column.type === "datetime") && table.columns.some((column) => ["Success", "success"].includes(column.name) && ["bool", "boolean"].includes(column.type)))) recipes.push("error-trend");
  if (schema.tables.some((table) => table.columns.some((column) => column.type === "datetime") && table.columns.some((column) => ["DurationMs", "durationMs"].includes(column.name) && ["real", "double", "long", "int"].includes(column.type)))) recipes.push("dependency-latency");
  return recipes;
}
function prepareRecipe(source, schema, recipe, timeRange, parameters = {}) {
  if (!recipesFor(source, schema).includes(recipe)) throw personalError("recipe_unavailable", "That diagnostic recipe is not supported by this source's verified schema.", "Test the source and choose an available recipe, or provide explicit read-only KQL.");
  if (recipe === "resource-metrics") {
    const metricNames = parameters.metricNames;
    if (!Array.isArray(metricNames) || !metricNames.length || metricNames.length > 5 || metricNames.some((name) => !schema.metrics.some((metric) => metric.name === name && metric.aggregations.includes("Average")))) throw personalError("unverified_metric", "Choose one to five verified metrics supporting Average aggregation.");
    return { query: JSON.stringify({ method: "GET", resourceId: source.resourceId, operation: "metrics", metricNames, aggregation: "Average", interval: "PT5M", timeRange }), metricNames: [...metricNames] };
  }
  const table = parameters.table ? schema.tables.find((item) => item.name === parameters.table) : schema.tables.length === 1 ? schema.tables[0] : null;
  if (!table) throw personalError("table_required", "Choose an actual table from this source's verified schema.");
  if (recipe === "sample") return { query: `${table.name}
| take 100`, limitations: ["This sample recipe has no time column; its exact KQL does not filter by the displayed time window."] };
  const time = parameters.timeColumn ? table.columns.find((column) => column.name === parameters.timeColumn && column.type === "datetime") : table.columns.find((column) => ["TimeGenerated", "Timestamp", "timestamp"].includes(column.name) && column.type === "datetime");
  if (!time) throw personalError("column_required", "Choose a verified datetime column in the selected table.");
  const base = `${table.name}
| where ${time.name} between (datetime(${timeRange.start}) .. datetime(${timeRange.end}))`;
  if (recipe === "freshness") return { query: `${base}
| summarize Latest = max(${time.name}), Records = count()`, limitations: ["Freshness describes records within the selected window, not ingestion health or proof that telemetry is complete."] };
  if (recipe === "error-trend") {
    const success = table.columns.find((column) => column.name === (parameters.successColumn || "Success") && ["bool", "boolean"].includes(column.type)) || (!parameters.successColumn ? table.columns.find((column) => column.name === "success" && ["bool", "boolean"].includes(column.type)) : null);
    if (!success) throw personalError("column_required", "Choose a verified boolean success column; no error semantics are inferred from arbitrary fields.");
    return { query: `${base}
| summarize Requests = count(), Failures = countif(${success.name} == false) by bin(${time.name}, 5m)
| order by ${time.name} asc
| take 100` };
  }
  const duration = table.columns.find((column) => column.name === (parameters.durationColumn || "DurationMs") && ["real", "double", "long", "int"].includes(column.type)) || (!parameters.durationColumn ? table.columns.find((column) => column.name === "durationMs" && ["real", "double", "long", "int"].includes(column.type)) : null);
  if (!duration) throw personalError("column_required", "Choose a verified numeric duration-in-milliseconds column.");
  return { query: `${base}
| summarize Calls = count(), P95DurationMs = percentile(${duration.name}, 95) by bin(${time.name}, 5m)
| order by ${time.name} asc
| take 100` };
}
function createPersonalDiagnosticsService({ conversationId, identityProvider, credentialProvider, authorize, transport, catalog, verifyConnection, clock = Date.now } = {}) {
  if (typeof conversationId !== "string" || !conversationId || typeof identityProvider !== "function" || typeof credentialProvider !== "function" || typeof authorize !== "function") throw personalError("service_configuration_required", "Personal diagnostics require a conversation ID, explicit identity/credential providers and the host permission surface.");
  transport ||= createPersonalDiagnosticsTransport({ clock });
  catalog ||= createPersonalSourceCatalog({ credentialProvider, authorize, clock });
  const sources = /* @__PURE__ */ new Map(), drafts = /* @__PURE__ */ new Map(), runs = /* @__PURE__ */ new Map(), controllers = /* @__PURE__ */ new Map();
  let lastIdentity, identityGeneration = 0, draftRevision = 0;
  const now = () => Number(clock());
  const timestamp = () => new Date(now()).toISOString();
  function invalidate(entry, reason) {
    entry.generation++;
    entry.active = false;
    entry.targetProof = null;
    entry.schema = { verified: false, tables: [] };
    entry.status = reason;
    for (const controller of entry.testControllers || []) controller.abort(personalError("source_invalidated", reason));
    for (const draft of drafts.values()) if (draft.sourceId === entry.source.id) {
      draft.current = false;
      draft.invalidationReason = reason;
    }
    for (const run2 of runs.values()) if (run2.source.id === entry.source.id) {
      run2.current = false;
      run2.invalidationReason = reason;
      if (run2.status === "running") {
        run2.status = "cancelled";
        run2.cancellation = "Client cancellation requested; backend completion is not confirmed.";
        controllers.get(run2.runId)?.abort(personalError("source_invalidated", reason));
      }
    }
  }
  async function currentIdentity() {
    let identity;
    try {
      identity = normalizeIdentity(await identityProvider());
    } catch (error) {
      if (lastIdentity) {
        identityGeneration++;
        for (const entry of sources.values()) invalidate(entry, "Sign-in is unavailable; use the source again explicitly after reconnecting.");
        lastIdentity = void 0;
      }
      throw error;
    }
    if (lastIdentity && identityKey2(identity) !== identityKey2(lastIdentity)) {
      identityGeneration++;
      for (const entry of sources.values()) invalidate(entry, "Account, tenant or cloud changed; use the source again explicitly.");
    }
    lastIdentity = identity;
    return identity;
  }
  function ownedSource(sourceId) {
    const entry = sources.get(sourceId);
    if (!entry) throw personalError("source_not_found", "This conversation does not own that personal source.");
    return entry;
  }
  function revision2(entry, expectedRevision) {
    if (expectedRevision !== void 0 && expectedRevision !== entry.revision) throw personalError("revision_conflict", "The source changed; review its current revision before proceeding.");
  }
  function stamp(entry) {
    return { generation: entry.generation, revision: entry.revision, identityGeneration };
  }
  function assertStamp(entry, snapshot) {
    if (entry.generation !== snapshot.generation || entry.revision !== snapshot.revision || identityGeneration !== snapshot.identityGeneration) throw personalError("stale_operation", "The source or identity changed while the operation was pending; review and retry.");
  }
  async function permission(operation, sourceId, description) {
    await authorize({ operation, sourceId, description, mutates: false });
  }
  function assertOwner(entry, identity) {
    assertSourceIdentity(entry.source, identity);
    if (entry.identity !== identityKey2(identity)) throw personalError("identity_mismatch", "The actual signed-in user is not the owner of this conversation's source.", "Save a source under the intended user, then choose Use here.");
  }
  async function refresh(entry, identity) {
    assertOwner(entry, identity);
    if (entry.cloudConnection) {
      if (typeof verifyConnection !== "function") throw personalError("connector_access_unverified", "Fresh caller invocation access and provider health must be checked before testing this connector.");
      const snapshot2 = stamp(entry);
      let proof;
      try {
        proof = await verifyConnection({ ...entry.cloudConnection, identity });
      } catch (error) {
        invalidate(entry, "Current connection access could not be verified.");
        throw error;
      }
      await currentIdentity();
      assertStamp(entry, snapshot2);
      if (proof.connectorName !== entry.cloudConnection.connectorName) {
        invalidate(entry, "The cloud connection provider changed.");
        throw personalError("connector_provider_changed", "The connection now belongs to another provider. Review the actual connection before testing or Use.");
      }
      if (identityKey2(normalizeIdentity(proof?.gateway || proof?.caller)) !== identityKey2(identity) || proof.invocationAllowed !== true || (proof.privateCallerAccess ?? proof.privateAccess) !== true) {
        invalidate(entry, "Current caller invocation access is unavailable.");
        throw personalError("connector_invocation_denied", "This Azure caller cannot invoke the selected connection. Existing policies were not changed.");
      }
      if (proof.providerHealthy !== true || proof.authenticatedConnection !== true) {
        invalidate(entry, "Provider consent or connection health is not ready.");
        throw personalError("connector_provider_pending", "The connector is added, but provider consent or health is not ready. Finish consent before testing its target.");
      }
      entry.cloudProof = proof;
    }
    if (entry.source.transport !== "namespace") return null;
    const snapshot = stamp(entry);
    let definition;
    try {
      definition = await catalog.loadConnection({ namespaceId: entry.source.namespaceId, connectionId: entry.source.connectionId, identity });
      assertStamp(entry, snapshot);
    } catch (error) {
      if (entry.generation === snapshot.generation) invalidate(entry, error.code === "connection_deleted" ? "Cloud connection deleted." : "Cloud connection verification failed.");
      throw error;
    }
    if (!definition.source || definition.verifiedIdentity !== identityKey2(identity) || definition.status !== "Verified" || definition.privateCallerAccess !== true || definition.connectionHealthy !== true || definition.connectionAuthenticated !== true) {
      invalidate(entry, "Cloud source binding, private caller access or connection authentication is unverified.");
      throw personalError("source_binding_unverified", "This connection has no verified private, authenticated diagnostic source binding.", "Choose a direct source or check the cloud connection's private access, authentication and read-source contract.");
    }
    const resolved = normalizeSource({ ...definition.source, id: entry.source.id, name: definition.name || definition.source.name });
    assertSourceIdentity(resolved, identity);
    if (entry.pendingBinding) {
      if (["kind", "clusterUrl", "database", "workspaceId", "resourceId"].some((field) => entry.source[field] !== resolved[field])) {
        invalidate(entry, "The cloud binding differs from the reviewed target.");
        throw personalError("cloud_definition_readonly", "The cloud binding no longer matches the reviewed target. Review the actual connection before use.");
      }
      entry.fingerprint = definition.fingerprint;
      entry.pendingBinding = false;
    } else if (entry.fingerprint !== definition.fingerprint) {
      entry.source = resolved;
      entry.fingerprint = definition.fingerprint;
      entry.connection = definition;
      entry.revision++;
      invalidate(entry, "Cloud definition changed; test and use the new revision explicitly.");
      throw personalError("source_definition_changed", "The authoritative cloud definition changed. The refreshed source is not activated.", "Review the new source revision, then choose Use here.");
    }
    entry.connection = definition;
    return definition;
  }
  async function invocation(entry, identity, signal) {
    assertOwner(entry, identity);
    const audience = typeof transport.getAudience === "function" ? await transport.getAudience({ source: clone(entry.source), signal }) : personalSourceAudience(entry.source);
    const supplied = await credentialProvider({ ...identity, audience });
    const credential = bindPersonalCredential(supplied, identity, audience, clock);
    await credential.getToken(`${audience}/.default`, { abortSignal: signal });
    return { source: clone(entry.source), identity: clone(identity), credential, connection: entry.connection, schema: clone(entry.schema), signal };
  }
  function providerAccountView(entry) {
    return entry.source.transport === "namespace" ? {
      providerAccountLabel: safeText(entry.connection?.providerAccountLabel || entry.source.providerAccount || "uses account chosen during consent", 256),
      providerAccountStatus: entry.connection?.providerAccountStatus === "provider-reported" ? "provider-reported" : "unknown"
    } : {};
  }
  function sourceView(entry) {
    return {
      ...clone(entry.source),
      ...providerAccountView(entry),
      revision: entry.revision,
      active: entry.active,
      status: entry.status,
      testedAt: entry.testedAt || null,
      ready: Boolean(entry.targetProof),
      targetValidated: Boolean(entry.targetProof),
      connectionAvailable: entry.active === true && (Boolean(entry.cloudProof?.providerHealthy) || entry.directChatConfirmed === true),
      ...entry.cloudConnection ? { cloudConnection: clone(entry.cloudConnection), connectionAdded: true } : {},
      ...entry.fingerprint ? { fingerprint: entry.fingerprint, etag: entry.connection?.etag || null } : {}
    };
  }
  function connectionStatus(entry) {
    if (!entry.schema.verified) return entry.active ? "Authenticated; schema unverified; active for explicit scoped reads" : "Authenticated; schema unverified; not activated";
    return entry.active ? "Connected; active in this conversation" : "Connected; not activated";
  }
  async function test(entry, identity) {
    const snapshot = stamp(entry);
    const controller = new AbortController();
    entry.testControllers ||= /* @__PURE__ */ new Set();
    entry.testControllers.add(controller);
    const timeout = setTimeout(() => controller.abort(personalError("query_timeout", "The connection test exceeded 30 seconds.")), PERSONAL_LIMITS.timeoutMs);
    let removeAbort;
    const aborted = new Promise((_, reject) => {
      const listener = () => reject(controller.signal.reason || personalError("cancelled", "The source test was cancelled."));
      controller.signal.addEventListener("abort", listener, { once: true });
      removeAbort = () => controller.signal.removeEventListener("abort", listener);
    });
    try {
      const request = await Promise.race([invocation(entry, identity, controller.signal), aborted]);
      assertStamp(entry, snapshot);
      if (controller.signal.aborted) throw controller.signal.reason;
      const result = await Promise.race([transport.testSource(request), aborted]);
      await currentIdentity();
      assertStamp(entry, snapshot);
      if (result?.connected !== true) throw personalError("source_test_failed", "The backend did not confirm source access.");
      entry.schema = safeSchema(result.schema);
      if (entry.cloudConnection) {
        const before = entry.cloudProof.configurationRevision;
        await refresh(entry, identity);
        assertStamp(entry, snapshot);
        if (before !== entry.cloudProof.configurationRevision) throw personalError("source_changed", "The connection changed while testing its target. Review and test again.");
      }
      entry.testedAt = timestamp();
      entry.targetProof = { at: now(), configurationRevision: entry.cloudProof?.configurationRevision || null, revision: entry.revision };
      entry.status = connectionStatus(entry);
      return { ...sourceView(entry), schema: clone(entry.schema), limitations: (result.limitations || []).slice(0, 8).map((value) => safeText(value)) };
    } catch (error) {
      if (entry.generation === snapshot.generation) {
        if (/identity|credential|auth|sign.?in|consent|tenant|audience/i.test(String(error.code || error.name))) invalidate(entry, `Sign-in verification failed: ${safeText(error.message)}`);
        else {
          entry.active = false;
          entry.targetProof = null;
          entry.status = `Unavailable: ${safeText(error.message)}`;
          entry.schema = { verified: false, tables: [] };
        }
      }
      throw error;
    } finally {
      clearTimeout(timeout);
      removeAbort();
      entry.testControllers.delete(controller);
    }
  }
  function draftView(draft) {
    return { ...clone(draft), runs: [...runs.values()].filter((run2) => run2.draftId === draft.draftId).map((run2) => ({ runId: run2.runId, status: run2.status, current: run2.current })) };
  }
  async function prepare({ sourceId, query, timeRange, origin, queryComplete = true, recipe, metricNames, limitations = [] }) {
    const identity = await currentIdentity(), entry = ownedSource(sourceId);
    assertOwner(entry, identity);
    if (!entry.active) throw personalError("source_not_active", "Choose Use in this conversation before preparing an executable personal query.");
    const snapshot = stamp(entry);
    const needsSchema = !entry.schema.verified && (["logs", "appInsights"].includes(entry.source.kind) || entry.source.transport === "namespace");
    await permission("prepare_personal_query", sourceId, needsSchema ? "Read bounded table metadata for this source and prepare the exact personal KQL draft. Do not run the query or share with SRE." : "Prepare an inspectable personal query draft without execution or SRE disclosure.");
    await currentIdentity();
    assertStamp(entry, snapshot);
    if (typeof query !== "string" || !query.trim() || query.length > PERSONAL_LIMITS.queryChars) throw personalError("invalid_query", `Provide complete query text of at most ${PERSONAL_LIMITS.queryChars} characters.`);
    if (safeText(query, query.length) !== query) throw personalError("secret_query", "Query drafts must not contain credentials or signed links.");
    if (!metricNames && queryComplete === true) validatePersonalKql(query);
    if (needsSchema && !metricNames && queryComplete === true) {
      await refresh(entry, identity);
      assertStamp(entry, snapshot);
      const signal = AbortSignal.timeout(PERSONAL_LIMITS.timeoutMs);
      const request = await invocation(entry, identity, signal);
      assertStamp(entry, snapshot);
      const metadata = await transport.schema(request);
      await currentIdentity();
      assertStamp(entry, snapshot);
      await refresh(entry, identity);
      assertStamp(entry, snapshot);
      if (metadata?.verified !== true || !Array.isArray(metadata.tables)) throw personalError("schema_unavailable", "This source returned no verified table metadata. The query was not run.");
      entry.schema = clone(metadata);
    }
    if (!metricNames && queryComplete === true) validatePersonalKql(query, { source: entry.source, schema: entry.schema });
    if (drafts.size >= PERSONAL_LIMITS.drafts) throw personalError("draft_limit", "This conversation already contains 100 retained drafts; start a new conversation rather than silently evicting history.");
    for (const draft2 of drafts.values()) if (draft2.sourceId === sourceId) draft2.current = false;
    for (const run2 of runs.values()) if (run2.source.id === sourceId) run2.current = false;
    const safeOrigin = {};
    if (origin && typeof origin === "object" && !Array.isArray(origin)) for (const key of ORIGIN_FIELDS) {
      if (typeof origin[key] === "string" && origin[key].trim() && origin[key].length <= 1024 && safeText(origin[key], 1024) === origin[key]) safeOrigin[key] = origin[key];
      else if (Number.isSafeInteger(origin[key])) safeOrigin[key] = origin[key];
    }
    const draft = {
      draftId: opaque("draft"),
      revision: ++draftRevision,
      sourceId,
      sourceRevision: entry.revision,
      sourceFingerprint: entry.fingerprint || fingerprint(entry.source),
      identity: clone(identity),
      query,
      queryFingerprint: fingerprint(query),
      timeRange: normalizePersonalTimeRange(timeRange, clock),
      origin: Object.keys(safeOrigin).length ? safeOrigin : null,
      queryComplete: queryComplete === true,
      runnable: queryComplete === true,
      createdAt: timestamp(),
      current: true,
      schemaVerified: entry.schema.verified,
      limitations: [...limitations, ...!entry.schema.verified ? ["Schema is unverified; this is explicit KQL, not a schema-grounded generated query."] : [], ...queryComplete !== true ? ["Incomplete query: execution is blocked until complete text is supplied."] : []],
      ...recipe ? { recipe } : {},
      ...metricNames ? { metricNames } : {}
    };
    drafts.set(draft.draftId, draft);
    return draftView(draft);
  }
  async function run({ draftId, expectedRevision }) {
    const draft = drafts.get(draftId);
    if (!draft) throw personalError("draft_not_found", "This conversation does not own that query draft.");
    if (expectedRevision !== draft.revision) throw personalError("revision_conflict", "Run requires the exact reviewed draft revision.");
    if (!draft.current || !draft.runnable || !draft.queryComplete) throw personalError("draft_not_runnable", "This draft is stale or incomplete; prepare a complete current draft.");
    const identity = await currentIdentity(), entry = ownedSource(draft.sourceId);
    assertOwner(entry, identity);
    if (!entry.active || entry.revision !== draft.sourceRevision || identityKey2(identity) !== identityKey2(draft.identity)) throw personalError("stale_draft", "The source or identity changed; review a new query draft.");
    const snapshot = stamp(entry);
    await permission("run_personal_query", entry.source.id, "Run the exact reviewed, bounded read-only query under your personal source identity; do not share with SRE.");
    await currentIdentity();
    assertStamp(entry, snapshot);
    await refresh(entry, identity);
    assertStamp(entry, snapshot);
    if (!draft.current) throw personalError("stale_draft", "The query was edited while authorization was pending.");
    if (!draft.metricNames) validatePersonalKql(draft.query, { source: entry.source, schema: entry.schema });
    if (runs.size >= PERSONAL_LIMITS.runs) throw personalError("run_limit", "This conversation already contains 100 retained runs; start a new conversation rather than silently evicting evidence.");
    const controller = new AbortController(), runId = opaque("run"), started = now();
    const record = {
      runId,
      draftId,
      revision: draft.revision,
      sourceRevision: draft.sourceRevision,
      query: draft.query,
      queryFingerprint: draft.queryFingerprint,
      source: { ...clone(entry.source), ...providerAccountView(entry) },
      identity: clone(identity),
      timeRange: clone(draft.timeRange),
      origin: clone(draft.origin),
      startedAt: new Date(started).toISOString(),
      elapsedMs: 0,
      status: "running",
      current: true,
      partial: false,
      truncated: false,
      limitations: [...draft.limitations]
    };
    runs.set(runId, record);
    controllers.set(runId, controller);
    const timeout = setTimeout(() => controller.abort(personalError("query_timeout", "The diagnostic query exceeded the 30-second client bound; backend completion is unconfirmed.")), PERSONAL_LIMITS.timeoutMs);
    let removeAbort;
    const aborted = new Promise((_, reject) => {
      const listener = () => reject(controller.signal.reason || personalError("cancelled", "The query was cancelled."));
      controller.signal.addEventListener("abort", listener, { once: true });
      removeAbort = () => controller.signal.removeEventListener("abort", listener);
    });
    try {
      const request = await Promise.race([invocation(entry, identity, controller.signal), aborted]);
      assertStamp(entry, snapshot);
      if (!draft.current || controller.signal.aborted) throw personalError("stale_draft", "The query or source changed before execution.");
      const operation = draft.metricNames ? transport.queryMetrics({ ...request, metricNames: draft.metricNames, timeRange: draft.timeRange }) : transport.query({ ...request, query: draft.query, timeRange: draft.timeRange });
      const result = await Promise.race([operation, aborted]);
      await currentIdentity();
      assertStamp(entry, snapshot);
      await refresh(entry, identity);
      assertStamp(entry, snapshot);
      if (!draft.current || controller.signal.aborted) throw personalError("stale_result", "The result belongs to a source or query that is no longer current.");
      const projected = projectPersonalResult(result);
      Object.assign(record, projected, { status: "completed", elapsedMs: Math.max(0, now() - started), limitations: [...record.limitations, ...projected.limitations] });
      return clone(record);
    } catch (error) {
      record.elapsedMs = Math.max(0, now() - started);
      record.status = controller.signal.aborted || record.status === "cancelled" ? "cancelled" : "failed";
      record.current = false;
      record.error = { code: safeText(error.code || "query_failed", 64), message: safeText(error.message), recovery: safeText(error.recovery) };
      if (record.status === "cancelled") record.cancellation = "Client cancellation requested; backend completion is not confirmed.";
      if (entry.generation === snapshot.generation && /identity|credential|auth|sign.?in|consent|tenant|audience/i.test(String(error.code || error.name))) invalidate(entry, `Sign-in verification failed: ${safeText(error.message)}`);
      throw personalError(record.error.code, record.error.message, record.error.recovery);
    } finally {
      clearTimeout(timeout);
      removeAbort();
      controllers.delete(runId);
    }
  }
  const api = {
    async validateRegistration({ sourceId, expectedRevision, namespaceId, connectionId }) {
      const identity = await currentIdentity(), entry = ownedSource(sourceId);
      assertOwner(entry, identity);
      revision2(entry, expectedRevision);
      if (expectedRevision === void 0 || entry.cloudConnection?.namespaceId.toLowerCase() !== namespaceId.toLowerCase() || entry.cloudConnection?.connectionId.toLowerCase() !== connectionId.toLowerCase()) {
        throw personalError("source_changed", "This source revision belongs to another connection. Review its current connection before editing.");
      }
    },
    async registerConnector({ source: input, cloudConnection, sourceId, expectedRevision }) {
      const identity = await currentIdentity(), source = normalizeSource(input);
      assertSourceIdentity(source, identity);
      const reference2 = normalizeSource({
        ...source,
        transport: "namespace",
        namespaceId: cloudConnection.namespaceId,
        connectionId: cloudConnection.connectionId
      });
      const binding = {
        namespaceId: reference2.namespaceId,
        connectionId: reference2.connectionId,
        connectorName: source.kind === "kusto" ? "kusto" : "azuremonitorlogs"
      };
      if (sourceId) {
        await api.validateRegistration({ sourceId, expectedRevision, ...binding });
        const entry2 = ownedSource(sourceId);
        invalidate(entry2, "Source edited; test the new target before Use.");
        entry2.source = normalizeSource({ ...source, id: sourceId });
        entry2.revision++;
        entry2.cloudConnection = binding;
        entry2.pendingBinding = source.transport === "namespace";
        entry2.fingerprint = void 0;
        return sourceView(entry2);
      }
      const existing = [...sources.values()].find((entry2) => entry2.identity === identityKey2(identity) && fingerprint(entry2.cloudConnection || null) === fingerprint(binding) && ["kind", "clusterUrl", "database", "workspaceId", "resourceId"].every((field) => entry2.source[field] === source[field]));
      if (existing) return sourceView(existing);
      if (sources.size >= PERSONAL_LIMITS.sources) throw personalError("source_limit", "A conversation supports at most 20 personal source references.");
      const id = opaque("source");
      const entry = {
        source: normalizeSource({ ...source, id }),
        revision: 1,
        generation: 1,
        identity: identityKey2(identity),
        active: false,
        status: "Added; provider and target checks pending",
        schema: { verified: false, tables: [] },
        cloudConnection: binding,
        pendingBinding: source.transport === "namespace",
        targetProof: null
      };
      sources.set(id, entry);
      return sourceView(entry);
    },
    async discover({ namespaceId }) {
      const identity = await currentIdentity();
      const snapshot = identityGeneration;
      const result = await catalog.discover({ namespaceId, identity });
      await currentIdentity();
      if (identityGeneration !== snapshot) throw personalError("stale_discovery", "The signed-in account changed during discovery.");
      return clone(result);
    },
    async saveSource({ source: input, expectedRevision }) {
      const identity = await currentIdentity();
      let source = normalizeSource(input);
      assertSourceIdentity(source, identity);
      const existing = source.id ? ownedSource(source.id) : null;
      if (existing) {
        if (expectedRevision === void 0) throw personalError("revision_required", "Editing a source requires its current revision.");
        revision2(existing, expectedRevision);
      } else if (sources.size >= PERSONAL_LIMITS.sources) throw personalError("source_limit", "A conversation supports at most 20 personal source references.");
      let definition;
      if (source.transport === "namespace") {
        definition = await catalog.loadConnection({ namespaceId: source.namespaceId, connectionId: source.connectionId, identity });
        if (!definition.source || definition.verifiedIdentity !== identityKey2(identity) || definition.status !== "Verified" || definition.privateCallerAccess !== true || definition.connectionHealthy !== true || definition.connectionAuthenticated !== true) throw personalError("source_binding_unverified", "The cloud connection has no verified private, authenticated diagnostic source binding.");
        const authoritative = normalizeSource({ ...definition.source, id: existing?.source.id, name: definition.name || definition.source.name });
        if (["kind", "clusterUrl", "database", "workspaceId", "resourceId"].some((field) => source[field] !== authoritative[field])) {
          if (existing) invalidate(existing, "The proposed source differs from the authoritative cloud binding.");
          throw personalError("cloud_definition_readonly", "This source differs from the authoritative namespace connection; local references cannot change its cloud binding.", "Edit the cloud connection explicitly in Azure Portal, refresh it, then use its verified definition here.");
        }
        source = authoritative;
        assertSourceIdentity(source, identity);
      } else source = normalizeSource({ ...source, accountId: identity.accountId, providerAccount: identity.accountId });
      await currentIdentity();
      if (identityKey2(lastIdentity) !== identityKey2(identity)) throw personalError("stale_save", "The account changed while saving the source.");
      if (existing && sources.get(existing.source.id) !== existing) throw personalError("source_not_found", "This source was removed or replaced while its edit was pending; save a new registration explicitly.");
      if (existing) revision2(existing, expectedRevision);
      const id = existing?.source.id || opaque("source");
      if (existing) invalidate(existing, "Source edited; test and use the new revision explicitly.");
      const entry = {
        source: normalizeSource({ ...source, id }),
        revision: (existing?.revision || 0) + 1,
        generation: (existing?.generation || 0) + 1,
        identity: identityKey2(identity),
        active: false,
        status: "Saved; not tested or activated",
        schema: { verified: false, tables: [] },
        fingerprint: definition?.fingerprint,
        connection: definition
      };
      sources.set(id, entry);
      return sourceView(entry);
    },
    async testSource({ sourceId }) {
      const identity = await currentIdentity(), entry = ownedSource(sourceId), snapshot = stamp(entry);
      assertOwner(entry, identity);
      await permission("test_personal_source", sourceId, "Test this exact personal source with a read-only probe and bounded schema reads, independently of SRE.");
      await currentIdentity();
      assertStamp(entry, snapshot);
      await refresh(entry, identity);
      return test(entry, identity);
    },
    async checkForChat({ sourceId, expectedRevision }) {
      const identity = await currentIdentity(), entry = ownedSource(sourceId), snapshot = stamp(entry);
      revision2(entry, expectedRevision);
      assertOwner(entry, identity);
      await permission("check_personal_connection", sourceId, entry.cloudConnection ? "Check current caller invocation access and provider health. Do not run a target query or read schema." : "Verify the current caller's pinned direct-source credential for this chat. Target access needs a separately approved operation; do not run a query or read schema.");
      await currentIdentity();
      assertStamp(entry, snapshot);
      if (!entry.cloudConnection) {
        if (entry.source.transport !== "direct") throw personalError("connection_required", "Choose the existing cloud connection for this confirmation.");
        await invocation(entry, identity, AbortSignal.timeout(PERSONAL_LIMITS.timeoutMs));
        await currentIdentity();
        assertStamp(entry, snapshot);
        entry.directChatConfirmed = true;
        entry.active = true;
        entry.status = "Available in this chat; target access checked on approved operations";
        return sourceView(entry);
      }
      try {
        await refresh(entry, identity);
      } catch (error) {
        if (error.code !== "connector_provider_pending") throw error;
        entry.status = "Provider consent or connection health is not ready";
        return sourceView(entry);
      }
      assertStamp(entry, snapshot);
      entry.active = true;
      entry.status = "Available in this chat; target access checked on approved operations";
      return sourceView(entry);
    },
    async activate({ sourceId, expectedRevision }) {
      const identity = await currentIdentity(), entry = ownedSource(sourceId), snapshot = stamp(entry);
      revision2(entry, expectedRevision);
      assertOwner(entry, identity);
      if (entry.cloudConnection && (!entry.targetProof || entry.targetProof.revision !== entry.revision || now() - entry.targetProof.at > 5 * 60 * 1e3)) {
        throw personalError("source_test_required", "Approve a bounded test of this connector's configured target before choosing Use in this chat.");
      }
      await permission("activate_personal_source", sourceId, "Verify this personal source and use it only in this conversation; no SRE permissions are granted.");
      await currentIdentity();
      assertStamp(entry, snapshot);
      await refresh(entry, identity);
      if (entry.cloudConnection) {
        if (entry.targetProof.configurationRevision !== entry.cloudProof.configurationRevision) {
          invalidate(entry, "The connection changed after its target test.");
          throw personalError("source_test_required", "The connection changed after testing. Approve a fresh target test before Use.");
        }
      } else await test(entry, identity);
      assertStamp(entry, snapshot);
      entry.active = true;
      entry.status = connectionStatus(entry);
      return sourceView(entry);
    },
    async stopUsing({ sourceId }) {
      const entry = ownedSource(sourceId);
      invalidate(entry, "Stopped using in this conversation; cloud connection and provider consent are unchanged.");
      return sourceView(entry);
    },
    async removeSource({ sourceId, expectedRevision }) {
      const entry = ownedSource(sourceId);
      if (expectedRevision !== void 0 && expectedRevision !== entry.revision) throw personalError("source_changed", "The connector changed. Refresh and review removal again.");
      invalidate(entry, "Removed from this conversation; cloud definitions, access policies and provider consent are unchanged.");
      let removedDrafts = 0, invalidatedRuns = 0;
      for (const [draftId, draft] of drafts) if (draft.sourceId === sourceId) {
        drafts.delete(draftId);
        removedDrafts++;
      }
      for (const run2 of runs.values()) if (run2.source.id === sourceId) invalidatedRuns++;
      sources.delete(sourceId);
      return { sourceId, removed: true, removedDrafts, invalidatedRuns, conversationId, scope: "conversation", cloudDefinitionUnchanged: true };
    },
    async getContext() {
      const identity = await currentIdentity(), limitations = [];
      for (const entry of sources.values()) if (entry.active && entry.source.transport === "namespace") {
        try {
          await refresh(entry, identity);
        } catch (error) {
          limitations.push(`${safeText(entry.source.name, 120)}: ${safeText(error.message)}`);
        }
      }
      const context = {
        conversationId,
        identity: clone(identity),
        sources: [...sources.values()].map((entry) => ({
          ...sourceView(entry),
          schema: clone(entry.schema),
          recipes: entry.active ? recipesFor(entry.source, entry.schema) : []
        })),
        drafts: [...drafts.values()].slice(-20).map((draft) => ({ draftId: draft.draftId, revision: draft.revision, sourceId: draft.sourceId, current: draft.current, runnable: draft.runnable && draft.current })),
        runs: [...runs.values()].slice(-20).map((record) => ({ runId: record.runId, draftId: record.draftId, revision: record.revision, sourceId: record.source.id, status: record.status, current: record.current })),
        limitations,
        scope: "Personal sources are available to you in this conversation, not attached to SRE."
      };
      let schemaBudget = 32768;
      for (const selected of context.sources) {
        const projectedTables = [];
        for (const table of selected.schema.tables) {
          const size = Buffer.byteLength(JSON.stringify(table));
          if (size > schemaBudget) {
            selected.schema.truncated = true;
            break;
          }
          schemaBudget -= size;
          projectedTables.push(table);
        }
        selected.schema.tables = projectedTables;
      }
      if (context.sources.some((selected) => selected.schema.truncated)) context.limitations.push("Schema context is bounded; only the displayed verified tables/columns are available to generate queries.");
      if (drafts.size > 20 || runs.size > 20) context.limitations.push("Only the 20 most recent draft/run handles are listed; earlier immutable records remain available through their original handles.");
      return context;
    },
    prepareQuery: prepare,
    runQuery: run,
    async cancelQuery({ runId }) {
      const record = runs.get(runId);
      if (!record) throw personalError("run_not_found", "This conversation does not own that query run.");
      if (record.status !== "running") return clone(record);
      record.status = "cancelled";
      record.current = false;
      record.cancellation = "Client cancellation requested; backend completion is not confirmed.";
      controllers.get(runId)?.abort(personalError("cancelled", "The query was cancelled by its owning conversation."));
      return { runId, status: record.status, cancellation: record.cancellation };
    },
    async runDiagnostic({ sourceId, recipe, timeRange, parameters }) {
      const identity = await currentIdentity(), entry = ownedSource(sourceId);
      assertOwner(entry, identity);
      const range = normalizePersonalTimeRange(timeRange, clock);
      const generated = prepareRecipe(entry.source, entry.schema, recipe, range, parameters);
      const draft = await prepare({ sourceId, ...generated, recipe, timeRange: range, queryComplete: true });
      return run({ draftId: draft.draftId, expectedRevision: draft.revision });
    },
    getDraft({ draftId }) {
      const draft = drafts.get(draftId);
      if (!draft) throw personalError("draft_not_found", "This conversation does not own that query draft.");
      return draftView(draft);
    },
    getRun({ runId }) {
      const record = runs.get(runId);
      if (!record) throw personalError("run_not_found", "This conversation does not own that diagnostic run.");
      return clone(record);
    }
  };
  for (const name of Object.keys(api).filter((name2) => !["getRun", "getDraft"].includes(name2))) {
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
var clone, opaque, ORIGIN_FIELDS, TABLE_NAME;
var init_personal_diagnostics = __esm({
  "canvases/azure-sre-agent/src/personal-diagnostics.mjs"() {
    init_personal_source_catalog();
    clone = (value) => value === void 0 ? void 0 : structuredClone(value);
    opaque = (kind) => `${kind}_${randomUUID4()}`;
    ORIGIN_FIELDS = ["agentKey", "agentId", "resourceId", "tenantId", "cloud", "threadId", "messageId", "executionId", "queryBlockId", "blockId", "surface", "queryKey", "sourceRevision"];
    TABLE_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,127}$/;
  }
});

// canvases/azure-sre-agent/src/teams-target.mjs
function invalid(message = "Paste a supported Teams channel or channel-message link.") {
  const error = new Error(message);
  error.code = "invalid_teams_url";
  throw error;
}
function decode(value) {
  try {
    const result = decodeURIComponent(value);
    if (/[%/\\\u0000-\u001f\u007f]/.test(result)) invalid();
    return result;
  } catch {
    invalid();
  }
}
function parseTeamsTarget(value, { tenantId } = {}) {
  if (typeof value !== "string" || value.length > 4096 || /[\\\u0000-\u0020\u007f]/.test(value)) invalid();
  let url;
  try {
    url = new URL(value);
  } catch {
    invalid();
  }
  if (url.protocol !== "https:" || !HOSTS.has(url.hostname) || url.port || url.username || url.password || url.hash) invalid();
  const parts = url.pathname.split("/");
  if (parts.length !== 5 || parts[1] !== "l" || !["channel", "message"].includes(parts[2])) invalid();
  const channelId = decode(parts[3]);
  if (!CHANNEL.test(channelId)) invalid("This is not a supported Teams channel link.");
  for (const key of url.searchParams.keys()) {
    if (!PARAMETERS.has(key) || url.searchParams.getAll(key).length !== 1) invalid();
  }
  const groupId = url.searchParams.get("groupId");
  const linkTenantId = url.searchParams.get("tenantId");
  if (!GUID5.test(groupId ?? "") || !GUID5.test(linkTenantId ?? "")) {
    invalid("The link needs its team and tenant hints. Choose a channel using an authorized picker.");
  }
  if (tenantId && linkTenantId.toLowerCase() !== tenantId.toLowerCase()) {
    const error = new Error("The Teams link belongs to another tenant. Change account explicitly.");
    error.code = "wrong_account";
    throw error;
  }
  let messageId = null, replyTo = null, labelHint = null;
  if (parts[2] === "message") {
    messageId = decode(parts[4]);
    replyTo = url.searchParams.get("parentMessageId") || messageId;
    if (!MESSAGE.test(messageId) || !MESSAGE.test(replyTo)) invalid();
  } else {
    labelHint = decode(parts[4]);
    if (!labelHint || labelHint.length > 200 || url.searchParams.has("parentMessageId")) invalid();
  }
  return Object.freeze({
    kind: parts[2],
    groupId: groupId.toLowerCase(),
    channelId,
    tenantId: linkTenantId.toLowerCase(),
    messageId,
    replyTo,
    labelHint
  });
}
function validReplyId(value) {
  return typeof value === "string" && MESSAGE.test(value);
}
function safeTeamsMessageLink(value, expected = {}) {
  if (typeof value !== "string" || value.length > 4096 || /[\\\u0000-\u0020]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !HOSTS.has(url.hostname) || url.username || url.password || url.port || url.hash) return null;
    const parts = url.pathname.split("/");
    if (parts.length !== 5 || parts[1] !== "l" || parts[2] !== "message" || !CHANNEL.test(decode(parts[3])) || !MESSAGE.test(decode(parts[4]))) return null;
    if (expected.channelId && decode(parts[3]) !== expected.channelId || expected.messageId && decode(parts[4]) !== expected.messageId) return null;
    for (const key of [...url.searchParams.keys()]) {
      if (!PARAMETERS.has(key) || url.searchParams.getAll(key).length !== 1) return null;
      const hint = url.searchParams.get(key);
      if (["groupId", "tenantId"].includes(key)) {
        if (!GUID5.test(hint) || expected[key] && expected[key].toLowerCase() !== hint.toLowerCase()) return null;
      } else if (key === "parentMessageId") {
        if (!MESSAGE.test(hint)) return null;
      } else url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return null;
  }
}
var GUID5, CHANNEL, MESSAGE, HOSTS, PARAMETERS;
var init_teams_target = __esm({
  "canvases/azure-sre-agent/src/teams-target.mjs"() {
    GUID5 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    CHANNEL = /^19:[a-z0-9._-]{1,220}@thread\.(?:tacv2|skype)$/i;
    MESSAGE = /^\d{1,32}$/;
    HOSTS = /* @__PURE__ */ new Set(["teams.microsoft.com", "teams.cloud.microsoft"]);
    PARAMETERS = /* @__PURE__ */ new Set([
      "groupId",
      "tenantId",
      "parentMessageId",
      "teamName",
      "channelName",
      "createdTime",
      "allowXTenantAccess",
      "context"
    ]);
  }
});

// canvases/azure-sre-agent/src/personal-m365.mjs
var personal_m365_exports = {};
__export(personal_m365_exports, {
  createPersonalM365Service: () => createPersonalM365Service
});
import { createHash as createHash6, randomUUID as randomUUID5 } from "node:crypto";
import {
  createPersonalM365Transport,
  M365_RESOURCE,
  m365Error,
  sameM365Identity,
  assertM365CallerAccess,
  m365ProviderAccount
} from "./m365-transport.mjs";
function text(value, limit, name) {
  if (typeof value !== "string" || !value.trim() || value.length > limit || /\u0000/.test(value)) {
    throw m365Error("invalid_input", `${name} must be nonempty and at most ${limit} characters.`);
  }
  return value;
}
function clip(value, max) {
  return typeof value === "string" ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").slice(0, max) : "";
}
function clone2(value) {
  return structuredClone(value);
}
function digest(value) {
  return createHash6("sha256").update(JSON.stringify(value)).digest("hex");
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\r?\n/g, "<br>");
}
function redact(value) {
  return value.replace(/https?:\/\/[^\s<>"']+/gi, (link) => {
    try {
      const url = new URL(link);
      if (url.username || url.password || [...url.searchParams.keys()].some((key) => /^(sig|token|code|access_token|refresh_token|client_secret|key|api-key|x-amz-signature)$/i.test(key))) return "[redacted link]";
    } catch {
      return "[redacted link]";
    }
    return link;
  }).replace(/Bearer\s+\S+/gi, "[redacted]").replace(/\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g, "[redacted]").replace(/\b(access[_-]?token|refresh[_-]?token|api[_-]?key|password|secret)\s*[:=]\s*["']?[^\s"'<>&]+/gi, "$1=[redacted]");
}
function evidencePacket(value) {
  if (value == null) return null;
  const summary = typeof value === "string" ? value : value?.summary;
  text(summary, 4e3, "Evidence summary");
  return { summary: redact(summary), ...typeof value?.reference === "string" && /^[a-z0-9_-]{1,128}$/i.test(value.reference) ? { reference: value.reference } : {} };
}
function reference(namespaceId, connectionId) {
  text(namespaceId, 1200, "Namespace resource ID");
  if (!/^\/subscriptions\/[a-f0-9-]{36}\/resourceGroups\/[^/\\?#%\s]+\/providers\/Microsoft\.Web\/connectorGateways\/[a-z0-9_.-]+$/i.test(namespaceId)) {
    throw m365Error("invalid_input", "Choose a Connector Namespace by its full Azure resource ID.");
  }
  text(connectionId, 1400, "Connection");
  if (connectionId.startsWith("/")) {
    if (!connectionId.toLowerCase().startsWith(`${namespaceId.toLowerCase()}/connections/`)) {
      throw m365Error("invalid_input", "The connection must belong to the selected namespace.");
    }
    connectionId = connectionId.slice(namespaceId.length + "/connections/".length);
  }
  if (!/^[a-z0-9_.-]{1,200}$/i.test(connectionId)) throw m365Error("invalid_input", "Choose a valid cloud connection.");
  return { namespaceId, connectionId };
}
function safeStatus(error) {
  return STATUS.has(error?.code) ? error.code : error?.statusCode === 401 ? "sign_in_required" : error?.statusCode === 403 ? "source_access_denied" : "unavailable";
}
function date(value, name) {
  if (typeof value !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(value) || !Number.isFinite(Date.parse(value))) throw m365Error("invalid_input", `${name} must be an ISO UTC timestamp.`);
  return new Date(value).toISOString();
}
function terminalDelivery(draft) {
  return ["sending", "sent", "delivery_unknown"].includes(draft.delivery);
}
function teamsSourceUrl(value) {
  const url = new URL(value);
  for (const key of [...url.searchParams.keys()]) {
    if (!["groupId", "tenantId", "parentMessageId"].includes(key)) url.searchParams.delete(key);
  }
  return url.href;
}
function createPersonalM365Service(options = {}) {
  const { conversationId, identityProvider, credentialProvider, authorize, loadConnection: loadConnection2, allowWrites = false } = options;
  text(conversationId, 240, "Conversation identity");
  for (const [name, fn] of Object.entries({ identityProvider, credentialProvider, authorize })) {
    if (typeof fn !== "function") throw m365Error("invalid_input", `${name} is required.`);
  }
  const transport = options.transport ?? createPersonalM365Transport({ loadConnection: loadConnection2, ...options.sdk ? { sdk: options.sdk } : {} });
  const clock = options.clock ?? Date.now;
  const sources = /* @__PURE__ */ new Map(), mentions = /* @__PURE__ */ new Map(), drafts = /* @__PURE__ */ new Map(), consentLinks = /* @__PURE__ */ new Map();
  let draftRevision = 0;
  async function identity() {
    const result = await identityProvider();
    for (const key of ["tenantId", "cloud", "objectId", "accountId", "displayName"]) text(result?.[key], 240, key);
    return Object.fromEntries(["tenantId", "cloud", "objectId", "accountId", "displayName"].map((key) => [key, result[key]]));
  }
  function owned(sourceId, kind, allowStopped = false) {
    const source = sources.get(sourceId);
    if (!source || source.conversationId !== conversationId || kind && source.kind !== kind) {
      throw m365Error("unknown_source", "Choose a source owned by this conversation.");
    }
    if (source.status === "stopped" && !allowStopped) throw m365Error("source_stopped", "Connect explicitly before using this source.");
    return source;
  }
  function sourceView(source) {
    return {
      id: source.id,
      sourceId: source.id,
      kind: source.kind,
      status: source.status,
      state: source.status,
      name: source.name || (source.kind === "inbox" ? source.mailbox?.displayName || "Inbox \u2014 uses account chosen during consent" : source.team && source.channel ? `${source.team.displayName} / ${source.channel.displayName}` : "Teams channel"),
      active: source.activationRequired ? source.active === true : source.status !== "stopped",
      ready: source.status === "ready",
      targetValidated: source.status === "ready",
      activationRequired: source.activationRequired === true,
      namespaceId: source.namespaceId,
      connectionId: source.connectionId,
      url: source.url,
      account: clone2(source.identity),
      revision: source.revision,
      generation: source.generation,
      recovery: RECOVERY[source.status],
      mailbox: clone2(source.mailbox ?? null),
      team: clone2(source.team ?? null),
      channel: clone2(source.channel ?? null),
      author: clone2(source.author ?? null),
      replyHint: source.target?.replyTo ?? null,
      connection: clone2(source.connection ?? null),
      providerAccount: clone2(source.providerAccount ?? m365ProviderAccount()),
      accountUsage: "Uses the provider account chosen during consent; it may differ from the Azure caller.",
      connectionHealth: { status: source.connectionStatus ?? "Unknown", healthy: source.healthy === true },
      connectionAvailable: source.active === true && source.healthy === true && ["connection_checked", "ready"].includes(source.status),
      ...source.kind === "teams" ? {
        mentionStatus: source.mentionStatus ?? "not_resolved",
        mentionRecovery: source.mentionRecovery ?? null,
        mentionCapabilities: { user: "provider_resolution_required", team: "unsupported", channel: "unsupported" }
      } : {},
      allowedActions: source.kind === "inbox" ? ["test_source", "read_inbox_context"] : ["test_source", "resolve_mention", "prepare_channel_update", ...allowWrites ? ["publish_channel_update"] : []]
    };
  }
  function lease(source) {
    return { revision: source.revision, generation: source.generation };
  }
  function assertLease(source, captured, allowStopped = false) {
    if (!allowStopped && source.status === "stopped" || source.revision !== captured.revision || source.generation !== captured.generation) {
      throw m365Error("source_changed", "The source changed while checking. Review it again.");
    }
  }
  async function account(source) {
    const current = await identity();
    if (!sameM365Identity(current, source.identity)) {
      if (source.status !== "wrong_account") source.revision++;
      source.status = "wrong_account";
      source.active = false;
      source.testedAt = null;
      throw m365Error("wrong_account", "Change account explicitly; the source and draft have been preserved.");
    }
    return current;
  }
  async function args(source, expected = false) {
    const captured = lease(source), current = await account(source);
    const credential = await credentialProvider({ ...current, audience: M365_RESOURCE });
    assertLease(source, captured);
    if (!credential || typeof credential.getToken !== "function") throw m365Error("sign_in_required", "Sign in with the selected account.");
    return {
      source: {
        kind: source.kind,
        namespaceId: source.namespaceId,
        connectionId: source.connectionId,
        target: clone2(source.target ?? null)
      },
      identity: current,
      credential,
      ...expected ? {
        expectedConfigurationRevision: source.configurationRevision,
        expectedConsentRevision: source.consentRevision
      } : {}
    };
  }
  function applyInspection(source, inspection) {
    assertM365CallerAccess(inspection, source.identity, source.namespaceId);
    if (inspection.status === "ready" && inspection.sourceAccess !== true) {
      throw m365Error("source_access_denied", "The selected provider connection cannot access this source.");
    }
    if (!STATUS.has(inspection.status) || inspection.status === "ready" && (inspection.connectionStatus !== "Connected" || inspection.healthy !== true || !inspection.configurationRevision)) {
      throw m365Error("connection_unavailable", "Readiness requires a Connected, healthy provider connection and current source access.");
    }
    if (inspection.status === "ready" && source.kind === "teams" && (inspection.team?.id?.toLowerCase() !== source.target.groupId || inspection.channel?.id !== source.target.channelId || inspection.author?.poster !== "Flow bot" || inspection.author?.displayName !== "Flow bot")) {
      throw m365Error("source_access_denied", "The channel and actual posting identity were not resolved.");
    }
    if (inspection.status === "ready" && source.kind === "inbox" && inspection.mailbox?.folder !== "Inbox") {
      throw m365Error("source_access_denied", "The selected connection's Inbox could not be accessed.");
    }
    const next = {
      status: inspection.status,
      configurationRevision: inspection.configurationRevision,
      consentRevision: inspection.consentRevision ?? inspection.configurationRevision,
      connectionStatus: inspection.connectionStatus ?? "Unknown",
      healthy: inspection.healthy === true,
      connection: inspection.connection ? {
        id: `${source.namespaceId}/connections/${source.connectionId}`,
        name: clip(inspection.connection.name, 240) || source.connectionId,
        kind: source.kind,
        namespaceId: source.namespaceId,
        connectionId: source.connectionId
      } : {
        id: `${source.namespaceId}/connections/${source.connectionId}`,
        name: source.connectionId,
        kind: source.kind,
        namespaceId: source.namespaceId,
        connectionId: source.connectionId
      },
      providerAccount: m365ProviderAccount(inspection.providerAccount ?? inspection.provider),
      mailbox: inspection.mailbox ? { displayName: clip(inspection.mailbox.displayName, 240), folder: "Inbox" } : null,
      team: inspection.team ? { id: inspection.team.id, displayName: clip(inspection.team.displayName, 240) } : null,
      channel: inspection.channel ? {
        id: inspection.channel.id,
        displayName: clip(inspection.channel.displayName, 240),
        membershipType: clip(inspection.channel.membershipType, 20)
      } : null,
      author: inspection.author ? { kind: "bot", displayName: "Flow bot", poster: "Flow bot" } : null
    };
    const fingerprint3 = digest(next);
    if (source.fingerprint && source.fingerprint !== fingerprint3) {
      source.revision++;
      if (source.activationRequired) {
        source.active = false;
        source.testedAt = null;
      }
      source.mentionStatus = "not_resolved";
      source.mentionRecovery = null;
    }
    Object.assign(source, next, { fingerprint: fingerprint3 });
  }
  async function refresh(source) {
    const captured = lease(source);
    try {
      const inspection = await transport.inspectSource(await args(source));
      assertLease(source, captured);
      await account(source);
      applyInspection(source, inspection);
    } catch (error) {
      if (error.code === "source_changed") throw error;
      assertLease(source, captured);
      const status = safeStatus(error);
      if (source.status !== status) source.revision++;
      source.status = status;
      if (source.activationRequired) {
        source.active = false;
        source.testedAt = null;
      }
    }
    return source;
  }
  async function requireReady(source) {
    if (source.activationRequired && !source.active) throw m365Error("source_not_active", "Test this source, then choose Use in this chat before reading or posting.");
    if (source.chatConfirmed && source.kind === "inbox") {
      const captured = lease(source);
      const proof = await transport.checkAccess(await args(source, true));
      await account(source);
      assertLease(source, captured);
      assertM365CallerAccess(proof, source.identity, source.namespaceId);
      if (proof.status !== "ready" || proof.healthy !== true || proof.connectionStatus !== "Connected") {
        applyAccess(source, proof);
        throw m365Error(source.status, RECOVERY[source.status]);
      }
      return;
    }
    await refresh(source);
    if (source.status !== "ready") throw m365Error(source.status, RECOVERY[source.status]);
    if (source.activationRequired && !source.active) throw m365Error("source_not_active", "Access changed. Test this same source and choose Use again.");
  }
  function applyAccess(source, proof) {
    assertM365CallerAccess(proof, source.identity, source.namespaceId);
    const status = proof.status === "ready" ? "not_tested" : proof.status;
    if (!STATUS.has(status) || !proof.configurationRevision) throw m365Error("connection_unavailable", "The provider returned no current connection state.");
    if (source.status !== status || source.configurationRevision !== proof.configurationRevision || source.consentRevision !== proof.consentRevision) source.revision++;
    source.status = status;
    source.configurationRevision = proof.configurationRevision;
    source.consentRevision = proof.consentRevision;
    source.connectionStatus = proof.connectionStatus;
    source.healthy = proof.healthy === true;
    source.providerAccount = m365ProviderAccount(proof.providerAccount);
    source.active = false;
    source.testedAt = null;
  }
  async function permission(operation, source, description, mutates = false) {
    await authorize({ operation, sourceId: source.id, description, mutates });
  }
  function draftView(draft) {
    const source = sources.get(draft.sourceId);
    return {
      id: draft.id,
      draftId: draft.id,
      sourceId: draft.sourceId,
      revision: draft.revision,
      body: draft.body,
      team: clone2(draft.team),
      channel: clone2(draft.channel),
      author: clone2(draft.author),
      mentions: clone2(draft.mentions),
      replyTo: draft.replyTo,
      evidence: clone2(draft.evidence),
      payload: clone2(draft.payload),
      ready: draft.ready && source?.status === "ready" && source.revision === draft.sourceRevision && draft.delivery === "draft",
      delivery: draft.delivery,
      recovery: draft.recovery ?? null,
      ...draft.messageId ? { messageId: draft.messageId, messageLink: draft.messageLink } : {}
    };
  }
  function getDraftInternal(draftId) {
    const draft = drafts.get(draftId);
    if (!draft || draft.conversationId !== conversationId) throw m365Error("unknown_draft", "Choose this conversation's draft.");
    return draft;
  }
  async function connect(kind, input) {
    const current = await identity();
    if (input.accountId && input.accountId !== current.accountId) throw m365Error("wrong_account", "Select the intended signed-in account.");
    const source = {
      id: randomUUID5(),
      conversationId,
      kind,
      identity: current,
      ...reference(input.namespaceId, input.connectionId),
      target: kind === "teams" ? parseTeamsTarget(input.url) : null,
      url: kind === "teams" ? teamsSourceUrl(input.url) : null,
      status: "unavailable",
      revision: 1,
      generation: 0
    };
    sources.set(source.id, source);
    await permission(
      kind === "inbox" ? "connect_inbox" : "connect_teams",
      source,
      kind === "inbox" ? "Read the Inbox of the account chosen during provider consent; do not change mail." : "Resolve this channel through the selected provider connection; do not post."
    );
    await refresh(source);
    return sourceView(source);
  }
  function pollView(source) {
    return {
      ...sourceView(source),
      state: source.poll?.state ?? null,
      expiresAt: source.poll ? new Date(source.poll.expiresAt).toISOString() : null,
      pollAfterMs: 3e3,
      consentFlow: "provider_managed"
    };
  }
  function stopSource(source) {
    source.status = "stopped";
    source.generation++;
    source.revision++;
    source.active = false;
    source.testedAt = null;
    source.chatConfirmed = false;
    if (source.poll) source.poll.cancelled = true;
    consentLinks.delete(source.id);
    return sourceView(source);
  }
  const service = {
    async validateRegistration({ sourceId, expectedRevision, kind, namespaceId, connectionId }) {
      const source = owned(sourceId, kind, true);
      await account(source);
      const selected = reference(namespaceId, connectionId);
      if (expectedRevision !== source.revision || source.namespaceId.toLowerCase() !== selected.namespaceId.toLowerCase() || source.connectionId.toLowerCase() !== selected.connectionId.toLowerCase()) {
        throw m365Error("source_changed", "This source revision belongs to another connection. Review its current connection before editing.");
      }
    },
    async registerConnector({ kind, namespaceId, connectionId, url, name, sourceId, expectedRevision }) {
      if (!["inbox", "teams"].includes(kind)) throw m365Error("invalid_input", "Register Inbox or Teams in the Microsoft 365 source registry.");
      const current = await identity(), connection = reference(namespaceId, connectionId);
      const target = kind === "teams" && url ? parseTeamsTarget(url) : null;
      if (sourceId) {
        await service.validateRegistration({ sourceId, expectedRevision, kind, namespaceId, connectionId });
        const source2 = owned(sourceId, kind, true);
        source2.target = target;
        source2.url = kind === "teams" && url ? teamsSourceUrl(url) : null;
        source2.name = name;
        source2.status = kind === "teams" && !target ? "target_required" : "not_tested";
        source2.chatConfirmed = false;
        source2.revision++;
        source2.generation++;
        source2.active = false;
        source2.testedAt = null;
        source2.activationRequired = true;
        if (source2.poll) source2.poll.cancelled = true;
        consentLinks.delete(source2.id);
        return sourceView(source2);
      }
      const existing = [...sources.values()].find((source2) => sameM365Identity(source2.identity, current) && source2.kind === kind && source2.namespaceId === connection.namespaceId && source2.connectionId === connection.connectionId && JSON.stringify(source2.target) === JSON.stringify(target));
      if (existing) return sourceView(existing);
      const source = {
        id: randomUUID5(),
        conversationId,
        kind,
        identity: current,
        ...connection,
        target,
        url: kind === "teams" && url ? teamsSourceUrl(url) : null,
        name,
        status: kind === "teams" && !target ? "target_required" : "not_tested",
        revision: 1,
        generation: 0,
        activationRequired: true,
        active: false,
        testedAt: null
      };
      sources.set(source.id, source);
      return sourceView(source);
    },
    async activate({ sourceId, expectedRevision }) {
      const source = owned(sourceId);
      await account(source);
      if (expectedRevision !== void 0 && expectedRevision !== source.revision) throw m365Error("source_changed", "Review the current source revision before Use.");
      if (!source.activationRequired) {
        await permission("activate_personal_source", source, "Use this verified Microsoft 365 source in this chat.");
        await refresh(source);
        if (source.status !== "ready") throw m365Error(source.status, RECOVERY[source.status]);
        return sourceView(source);
      }
      if (source.status !== "ready" || !source.testedAt || clock() - source.testedAt > 3e5) {
        throw m365Error("source_test_required", "Approve a bounded target test before choosing Use in this chat.");
      }
      const captured = lease(source);
      await permission("activate_personal_source", source, "Use this tested source only in this chat. Recheck caller access and provider consent; do not read contents.");
      await account(source);
      assertLease(source, captured);
      if (typeof transport.checkAccess !== "function") throw m365Error("identity_unverified", "The provider transport cannot freshly verify access without reading contents.");
      try {
        const proof = await transport.checkAccess(await args(source, true));
        await account(source);
        assertLease(source, captured);
        assertM365CallerAccess(proof, source.identity, source.namespaceId);
        if (proof.status !== "ready" || proof.healthy !== true || proof.connectionStatus !== "Connected" || proof.configurationRevision !== source.configurationRevision || proof.consentRevision !== source.consentRevision) {
          throw m365Error("source_test_required", "Access or provider state changed after testing. Test this same source again before Use.");
        }
        source.active = true;
        return sourceView(source);
      } catch (error) {
        source.active = false;
        throw error;
      }
    },
    async checkForChat({ sourceId, expectedRevision }) {
      const source = owned(sourceId, void 0, true), captured = lease(source);
      if (expectedRevision !== captured.revision) throw m365Error("source_changed", "This source changed. Confirm the current connector again.");
      if (source.kind === "teams" && !source.target) throw m365Error("source_target_required", "Choose the Teams channel for this connection.");
      const resumeStopped = source.status === "stopped";
      await account(source);
      assertLease(source, captured, resumeStopped);
      await permission("check_personal_connection", source, "Check current caller invocation access and provider connection health for this chat. Do not read content or start consent.");
      await account(source);
      assertLease(source, captured, resumeStopped);
      if (resumeStopped) {
        source.status = "not_tested";
        source.generation++;
        source.revision++;
      }
      const checking = lease(source);
      if (typeof transport.checkAccess !== "function") throw m365Error("identity_unverified", "The provider cannot check connection health without reading content.");
      try {
        const proof = await transport.checkAccess(await args(source));
        await account(source);
        assertLease(source, checking);
        applyAccess(source, proof);
        source.chatConfirmed = true;
        if (proof.status === "ready" && proof.healthy === true && proof.connectionStatus === "Connected") {
          source.status = "connection_checked";
          source.active = true;
        }
        return sourceView(source);
      } catch (error) {
        if (["source_changed", "wrong_account"].includes(error.code)) throw error;
        assertLease(source, checking);
        source.status = safeStatus(error);
        source.active = false;
        source.revision++;
        throw error;
      }
    },
    connectInbox: (input) => connect("inbox", input),
    connectTeams: (input) => connect("teams", input),
    async testSource({ sourceId }) {
      const source = owned(sourceId, void 0, true);
      if (source.status === "stopped" && !source.activationRequired) throw m365Error("source_stopped", "Connect explicitly before using this source.");
      if (source.kind === "teams" && !source.target) throw m365Error("source_target_required", "Paste the channel or message link for this retained Teams connection before testing.");
      const captured = lease(source), resumeStopped = source.status === "stopped";
      try {
        await account(source);
      } catch (error) {
        if (error.code !== "wrong_account") throw error;
        return sourceView(source);
      }
      assertLease(source, captured, resumeStopped);
      await permission("test_source", source, source.kind === "inbox" ? "Check current access to the existing Inbox without changing mail or starting consent." : "Check current access to the existing Teams channel without posting or starting consent.");
      await account(source);
      assertLease(source, captured, resumeStopped);
      if (source.status === "stopped") {
        source.status = "unavailable";
        source.generation++;
        source.revision++;
      }
      await refresh(source);
      if (source.activationRequired) {
        source.active = false;
        source.testedAt = source.status === "ready" ? clock() : null;
      }
      if (source.status === "consent_required" && source.poll && !source.poll.cancelled && source.poll.generation === source.generation && source.poll.expiresAt > clock() && source.poll.configurationRevision === source.configurationRevision) {
        source.status = "consent_pending";
      }
      return sourceView(source);
    },
    async getContext() {
      const current = await identity();
      for (const source of sources.values()) {
        if (source.status !== "stopped" && !sameM365Identity(current, source.identity)) {
          if (source.status !== "wrong_account") source.revision++;
          source.status = "wrong_account";
          source.active = false;
          source.testedAt = null;
        }
      }
      return {
        conversationId,
        identity: current,
        account: current,
        allowWrites,
        sources: [...sources.values()].map(sourceView),
        connections: [...sources.values()].filter((source) => source.connection).map((source) => ({
          ...clone2(source.connection),
          sourceId: source.id,
          status: source.status,
          active: source.activationRequired ? source.active === true : source.status !== "stopped",
          providerAccount: clone2(source.providerAccount ?? null)
        }))
      };
    },
    async beginConsent({ sourceId }) {
      const source = owned(sourceId);
      await account(source);
      if (source.activationRequired) {
        if (typeof transport.checkAccess !== "function") throw m365Error("identity_unverified", "A metadata-only provider access check is required before consent.");
        applyAccess(source, await transport.checkAccess(await args(source)));
        if (source.status === "not_tested") return pollView(source);
      } else await refresh(source);
      if (source.status === "source_access_denied") throw m365Error(source.status, RECOVERY[source.status]);
      if (source.status === "ready") return pollView(source);
      await permission("begin_consent", source, "Allow provider access for this selected account and source.");
      source.generation++;
      source.revision++;
      const captured = lease(source);
      const poll = {
        state: randomUUID5(),
        generation: source.generation,
        expiresAt: clock() + 3e5,
        lastPollAt: -Infinity,
        cancelled: false,
        configurationRevision: source.configurationRevision
      };
      source.poll = poll;
      source.status = "consent_pending";
      consentLinks.delete(source.id);
      try {
        const result = await transport.beginConsent({ ...await args(source), generation: poll.generation, state: poll.state });
        assertLease(source, captured);
        await account(source);
        if (clock() >= poll.expiresAt) {
          source.status = "consent_expired";
          source.revision++;
          return pollView(source);
        }
        if (!result || result.flow !== "provider_managed") throw m365Error("consent_unavailable", "Only the qualified provider-managed consent flow is supported.");
        let url;
        try {
          url = validatePersonalConsentUrl(result.url);
        } catch {
          throw m365Error("consent_unavailable", "The provider returned an unsupported consent origin.");
        }
        consentLinks.set(source.id, { url: url.href, generation: poll.generation });
      } catch (error) {
        if (error.code === "source_changed") throw error;
        assertLease(source, captured);
        source.status = safeStatus(error);
        consentLinks.delete(source.id);
      }
      return pollView(source);
    },
    // Provider/UI-only: never register this as a model tool or save this URL.
    async getConsentPresentation({ sourceId, generation }) {
      const source = owned(sourceId), link = consentLinks.get(sourceId);
      try {
        await account(source);
      } catch {
        return null;
      }
      if (source.status !== "consent_pending" || source.poll?.cancelled || source.poll?.expiresAt <= clock() || generation !== source.generation || link?.generation !== generation) return null;
      return { url: link.url, flow: "provider_managed", expiresAt: new Date(source.poll.expiresAt).toISOString() };
    },
    async checkConsent({ sourceId, generation, state }) {
      const source = owned(sourceId), poll = source.poll;
      if (!poll || generation !== source.generation || state !== poll.state) {
        throw m365Error("stale_consent", "This consent check belongs to an earlier setup.");
      }
      if (poll.cancelled || ["consent_cancelled", "consent_expired", "consent_declined"].includes(source.status)) return pollView(source);
      if (clock() >= poll.expiresAt) {
        source.status = "consent_expired";
        source.revision++;
        consentLinks.delete(source.id);
        return pollView(source);
      }
      if (clock() - poll.lastPollAt < 3e3) return pollView(source);
      poll.lastPollAt = clock();
      const captured = lease(source);
      try {
        const method = source.activationRequired ? transport.checkConsentAccess : transport.checkConsent;
        if (typeof method !== "function") throw m365Error("identity_unverified", "A metadata-only consent check is required; target reads need their own approval.");
        const inspection = await method({ ...await args(source), generation, state });
        assertLease(source, captured);
        await account(source);
        if (inspection.configurationRevision !== poll.configurationRevision) {
          poll.cancelled = true;
          source.generation++;
          source.revision++;
          source.status = "connection_unavailable";
        } else if (clock() >= poll.expiresAt) {
          source.status = "consent_expired";
          source.revision++;
        } else {
          const checked = inspection.status === "consent_required" ? { ...inspection, status: "consent_pending" } : inspection;
          if (source.activationRequired) {
            applyAccess(source, checked);
            if (source.chatConfirmed && checked.status === "ready" && checked.healthy === true && checked.connectionStatus === "Connected") {
              source.status = "connection_checked";
              source.active = true;
            }
          } else applyInspection(source, checked);
        }
        if (source.status !== "consent_pending") consentLinks.delete(source.id);
      } catch (error) {
        if (error.code === "source_changed") throw error;
        assertLease(source, captured);
        source.status = safeStatus(error);
        source.revision++;
        consentLinks.delete(source.id);
      }
      return pollView(source);
    },
    async cancelConsent({ sourceId, generation }) {
      const source = owned(sourceId);
      if (!source.poll || generation !== source.generation) throw m365Error("stale_consent", "This consent request is no longer active.");
      source.poll.cancelled = true;
      source.generation++;
      source.revision++;
      source.status = "consent_cancelled";
      consentLinks.delete(source.id);
      return sourceView(source);
    },
    async readInbox({ sourceId, after, before, limit = 20, search = "" }) {
      const source = owned(sourceId, "inbox");
      if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw m365Error("invalid_input", "Read between 1 and 50 messages.");
      if (typeof search !== "string" || search.length > 300 || /[\r\n\u0000-\u001f]/.test(search)) throw m365Error("invalid_input", "Use a short plain search.");
      const upper = date(before ?? new Date(clock()).toISOString(), "before");
      const lower3 = date(after ?? new Date(Date.parse(upper) - 864e5).toISOString(), "after");
      if (Date.parse(lower3) >= Date.parse(upper) || Date.parse(upper) - Date.parse(lower3) > 31 * 864e5) {
        throw m365Error("invalid_input", "Choose a positive Inbox time range of at most 31 days.");
      }
      await permission("read_inbox_context", source, `Read up to ${limit} Inbox messages in the approved UTC time range.`);
      await requireReady(source);
      const captured = lease(source);
      const searchQuery = `received>=${lower3} AND received<=${upper}${search ? ` AND "${search.replace(/["\\]/g, "\\$&")}"` : ""}`;
      try {
        const result = await transport.readInbox({ ...await args(source, true), after: lower3, before: upper, limit, searchQuery });
        assertLease(source, captured);
        await account(source);
        if (!Array.isArray(result?.value)) throw m365Error("invalid_response", "Inbox retrieval did not return a message list.");
        if (source.chatConfirmed) {
          source.status = "ready";
          source.mailbox = { displayName: source.name || "Inbox using account chosen during consent", folder: "Inbox" };
        }
        let truncated = result.value.length > limit, removedOutsideScope = 0;
        const messages = [];
        for (const message of result.value.slice(0, 250)) {
          const received = Date.parse(message.receivedDateTime);
          if (!Number.isFinite(received) || received < Date.parse(lower3) || received > Date.parse(upper)) {
            removedOutsideScope++;
            continue;
          }
          if (messages.length >= limit) {
            truncated = true;
            break;
          }
          const raw = typeof message.bodyPreview === "string" ? message.bodyPreview : typeof message.body === "string" ? message.body : "";
          const plain = raw.slice(0, 6e3).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, "");
          messages.push({
            messageId: randomUUID5(),
            subject: redact(clip(message.subject, 300)),
            from: redact(clip(message.from, 320)),
            receivedDateTime: new Date(received).toISOString(),
            preview: redact(clip(plain, 1200)),
            truncated: raw.length > 1200,
            untrusted: true
          });
        }
        return {
          sourceId,
          mailbox: clone2(source.mailbox),
          after: lower3,
          before: upper,
          messages,
          count: messages.length,
          truncated,
          removedOutsideScope,
          untrusted: true,
          qualification: "Bounded provider search; not a complete mailbox or incident-health assertion."
        };
      } catch (error) {
        if (["source_changed", "wrong_account"].includes(error.code)) throw error;
        source.status = safeStatus(error);
        source.revision++;
        throw m365Error(source.status, RECOVERY[source.status]);
      }
    },
    async resolveMention({ sourceId, user }) {
      const source = owned(sourceId, "teams");
      text(user, 320, "Mention user");
      if (["@team", "@channel", "@everyone"].includes(user.toLowerCase())) {
        source.mentionStatus = "mention_unsupported";
        source.mentionRecovery = "Choose a supported user; team and channel mentions are not enabled.";
        throw m365Error(source.mentionStatus, source.mentionRecovery);
      }
      await permission("resolve_mention", source, "Resolve a user through the authorized provider's native mention operation.");
      await requireReady(source);
      const captured = lease(source);
      source.mentionStatus = "resolving";
      source.mentionRecovery = null;
      let result;
      try {
        result = await transport.resolveMention({ ...await args(source, true), user });
      } catch (error) {
        if (["source_changed", "wrong_account"].includes(error.code)) {
          source.mentionStatus = "not_resolved";
          source.mentionRecovery = "The source or account changed. Resolve the user again.";
          throw m365Error(error.code, source.mentionRecovery);
        }
        if (["mention_unresolved", "mention_unsupported"].includes(error.code)) {
          source.mentionStatus = error.code;
          source.mentionRecovery = error.code === "mention_unresolved" ? "Enter an explicit email/UPN or Microsoft Entra user ID; short names require an authorized picker." : "The provider must return a supported native user mention token.";
          throw m365Error(error.code, source.mentionRecovery);
        }
        if ([400, 404, 405, 501].includes(error.statusCode)) {
          const unsupported = [405, 501].includes(error.statusCode);
          source.mentionStatus = unsupported ? "mention_unsupported" : "mention_unresolved";
          source.mentionRecovery = unsupported ? "This connection does not expose the supported native user mention operation." : "Choose a user that the authorized provider can resolve.";
          throw m365Error(source.mentionStatus, source.mentionRecovery);
        }
        const status = safeStatus(error);
        source.mentionStatus = status;
        source.mentionRecovery = RECOVERY[status];
        source.status = status;
        source.revision++;
        throw m365Error(status, RECOVERY[status]);
      }
      assertLease(source, captured);
      await account(source);
      if (result?.kind !== "user" || !result.id || typeof result.token !== "string" || !/^<at(?:\s+id=["']\d+["'])?>[^<>]+<\/at>$/i.test(result.token) || result.token.length > 2048) {
        source.mentionStatus = "mention_unsupported";
        source.mentionRecovery = "A real provider-issued user mention token is required.";
        throw m365Error(source.mentionStatus, source.mentionRecovery);
      }
      const mention = {
        id: randomUUID5(),
        sourceId,
        sourceRevision: source.revision,
        identity: clone2(source.identity),
        userId: clip(result.id, 320),
        displayName: clip(result.displayName, 240),
        token: result.token
      };
      mentions.set(mention.id, mention);
      source.mentionStatus = "resolved";
      source.mentionRecovery = null;
      return { mentionId: mention.id, userId: mention.userId, displayName: mention.displayName, kind: "user" };
    },
    async prepareChannelUpdate({ sourceId, body, evidence, mentions: requested = [], replyTo = null }) {
      const source = owned(sourceId, "teams");
      text(body, 12e3, "Channel update");
      if (!Array.isArray(requested) || requested.length > 20) throw m365Error("invalid_input", "Choose up to 20 resolved user mentions.");
      if (replyTo !== null && (!validReplyId(replyTo) || replyTo !== source.target.replyTo)) {
        throw m365Error("invalid_reply", "Choose the reply hinted by this verified message link or create a new post.");
      }
      await permission("prepare_channel_update", source, "Preview the exact channel update without sending.");
      await requireReady(source);
      const resolved = [...new Set(requested.map((value) => typeof value === "string" ? value : value?.mentionId))].map((id) => {
        const mention = mentions.get(id);
        if (!mention || mention.sourceId !== sourceId || mention.sourceRevision !== source.revision || !sameM365Identity(mention.identity, source.identity)) throw m365Error("stale_mention", "Resolve mentions again after a source or account change.");
        return mention;
      });
      const packet = evidencePacket(evidence);
      const safeBody = redact(body);
      const messageBody = `${escapeHtml(safeBody)}${packet ? `<br><br>${escapeHtml(packet.summary)}` : ""}` + (resolved.length ? `<br>${resolved.map((mention) => mention.token).join(" ")}` : "");
      if (Buffer.byteLength(messageBody, "utf8") > 27e3) {
        throw m365Error("message_too_large", "Shorten the update, evidence or mentions to fit the provider's message limit.");
      }
      const draft = {
        id: randomUUID5(),
        conversationId,
        sourceId,
        sourceRevision: source.revision,
        fingerprint: source.fingerprint,
        identity: clone2(source.identity),
        revision: ++draftRevision,
        body: safeBody,
        evidence: packet,
        team: clone2(source.team),
        channel: clone2(source.channel),
        author: clone2(source.author),
        mentions: resolved.map((mention) => ({ userId: mention.userId, displayName: mention.displayName, kind: "user" })),
        replyTo,
        ready: !replyTo,
        delivery: "draft",
        recovery: replyTo ? "Reply payload metadata needs provider qualification. Choose a new channel post instead." : null,
        payload: {
          poster: "Flow bot",
          location: "Channel",
          input: { recipient: { groupId: source.target.groupId, channelId: source.target.channelId }, messageBody }
        }
      };
      drafts.set(draft.id, draft);
      draft.previewDigest = digest(draftView(draft));
      return draftView(draft);
    },
    getDraft({ draftId }) {
      return draftView(getDraftInternal(draftId));
    },
    async publishChannelUpdate({ draftId, expectedRevision, approval }) {
      const draft = getDraftInternal(draftId);
      if (terminalDelivery(draft) || draft.delivery === "validating") return draftView(draft);
      if (!allowWrites) throw m365Error("writes_disabled", "Channel publishing is disabled; the draft is preserved.");
      if (!draft.ready || draft.delivery !== "draft") throw m365Error("fresh_preview_required", "Prepare and review a fresh preview.");
      if (expectedRevision !== draft.revision || approval?.approved !== true || approval.draftId !== draftId || approval.revision !== draft.revision || !approval.preview || typeof approval.preview !== "object" || digest(approval.preview) !== draft.previewDigest) {
        throw m365Error("approval_required", "Approve this exact preview and revision before sending.");
      }
      draft.delivery = "validating";
      let dispatched = false;
      try {
        const source = owned(draft.sourceId, "teams");
        await requireReady(source);
        if (source.revision !== draft.sourceRevision || source.fingerprint !== draft.fingerprint || !sameM365Identity(source.identity, draft.identity)) throw m365Error("fresh_preview_required", "Source, account or consent changed. Review a fresh preview.");
        const captured = lease(source);
        const recipients = draft.mentions.map((mention) => `${mention.displayName} (${mention.userId})`).join(", ") || "None";
        await permission(
          "publish_channel_update",
          source,
          `Send the approved update to ${draft.team.displayName} / ${draft.channel.displayName} as Flow bot.
Revision: ${draft.revision}
Mentions: ${recipients}

Body:
${draft.body}` + (draft.evidence ? `

Evidence:
${draft.evidence.summary}` : ""),
          true
        );
        assertLease(source, captured);
        await account(source);
        const callArgs = await args(source, true);
        assertLease(source, captured);
        draft.delivery = "sending";
        dispatched = true;
        const result = await transport.publishChannelUpdate({
          ...callArgs,
          payload: clone2(draft.payload),
          replyTo: draft.replyTo,
          draftId,
          revision: draft.revision
        });
        if (typeof result?.messageId !== "string" || !result.messageId || result.messageId.length > 300) {
          throw m365Error("delivery_unknown", "The provider did not confirm message delivery.");
        }
        draft.delivery = "sent";
        draft.ready = false;
        draft.messageId = clip(result.messageId, 300);
        draft.messageLink = safeTeamsMessageLink(result.messageLink, {
          ...source.target,
          messageId: result.messageId
        });
        return { ...draftView(draft), messageId: draft.messageId, messageLink: draft.messageLink };
      } catch (error) {
        draft.ready = false;
        const unknown = dispatched && error.deliveryStarted !== false;
        draft.delivery = unknown ? "delivery_unknown" : "preview_required";
        draft.recovery = unknown ? "Delivery unknown. Inspect the channel before creating another post; no automatic retry." : "Reconnect or correct source access, then prepare and approve a fresh preview.";
        return draftView(draft);
      }
    },
    async stopUsing({ sourceId }) {
      return stopSource(owned(sourceId));
    },
    async removeSource({ sourceId, expectedRevision }) {
      const source = owned(sourceId, null, true);
      if (expectedRevision !== void 0 && expectedRevision !== source.revision) throw m365Error("source_changed", "The connector changed. Refresh and review removal again.");
      const result = stopSource(source);
      sources.delete(sourceId);
      return result;
    }
  };
  return Object.freeze(service);
}
var STATUS, RECOVERY;
var init_personal_m365 = __esm({
  "canvases/azure-sre-agent/src/personal-m365.mjs"() {
    init_teams_target();
    init_personal_consent_origin();
    STATUS = /* @__PURE__ */ new Set([
      "ready",
      "consent_required",
      "consent_pending",
      "consent_declined",
      "consent_cancelled",
      "consent_expired",
      "admin_approval_required",
      "sign_in_required",
      "wrong_account",
      "identity_unverified",
      "gateway_access_denied",
      "source_access_denied",
      "connection_unavailable",
      "consent_unavailable",
      "unsupported_channel",
      "stopped",
      "unavailable",
      "not_tested",
      "target_required",
      "connection_checked"
    ]);
    RECOVERY = {
      ready: null,
      consent_required: "Allow access",
      consent_pending: "Finish connecting or cancel",
      consent_declined: "Try again",
      consent_cancelled: "Finish connecting",
      consent_expired: "Try again",
      admin_approval_required: "Request tenant administrator approval",
      sign_in_required: "Sign in",
      wrong_account: "Change account",
      identity_unverified: "Check the Azure caller, private namespace access and provider connection health",
      gateway_access_denied: "Verify private caller access to the selected namespace",
      source_access_denied: "Change account or choose another source",
      connection_unavailable: "Choose another connection",
      consent_unavailable: "Use the supported provider consent flow",
      unsupported_channel: "Choose a supported channel",
      stopped: "Connect explicitly",
      unavailable: "Retry after checking the service",
      not_tested: "Test this connection before Use",
      target_required: "Choose the target for this retained connection",
      connection_checked: null
    };
  }
});

// canvases/azure-sre-agent/src/personal-connector-definitions.mjs
var personal_connector_definitions_exports = {};
__export(personal_connector_definitions_exports, {
  PERSONAL_CONNECTOR_TYPES: () => PERSONAL_CONNECTOR_TYPES,
  createPersonalConnectorDefinitions: () => createPersonalConnectorDefinitions
});
import { randomUUID as randomUUID6 } from "node:crypto";
function text2(value, name, max = 128) {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u001f]/.test(value) || safeText(value, max) !== value) {
    throw personalError("invalid_definition", `Use a nonsecret ${name} of at most ${max} characters.`);
  }
  return value.trim();
}
function leaf(value, name) {
  const result = text2(value, name);
  if (!LEAF.test(result)) throw personalError("invalid_definition", `The ${name} must contain only letters, numbers, underscores or hyphens and start with a letter or number.`);
  return result;
}
function connectionResource(namespaceId, value) {
  const prefix = `${namespaceId}/connections/`;
  if (typeof value === "string" && value.startsWith("/")) {
    if (!value.toLowerCase().startsWith(prefix.toLowerCase())) throw personalError("invalid_connection", "Choose a connection inside the selected namespace.");
    return `${prefix}${leaf(value.slice(prefix.length), "connection name")}`;
  }
  return `${prefix}${leaf(value, "connection name")}`;
}
function armResource(value, expectedId) {
  if (!value || typeof value !== "object" || Array.isArray(value) || !sameId(value.id, expectedId)) {
    throw personalError("definition_contract_unverified", "The service returned metadata for a different resource.");
  }
  return value;
}
function revision(value) {
  return value === null ? null : fingerprint(value);
}
function provisioning(value) {
  const state = value.properties?.provisioningState;
  if (typeof state !== "string" || !state.trim()) throw personalError("definition_contract_unverified", "The service did not report the resource provisioning state.");
  if (/^(failed|canceled|cancelled)$/i.test(state)) throw personalError("definition_provisioning_failed", `Resource provisioning ended in ${safeText(state, 40)}.`, "Inspect the exact cloud resource before preparing another create.");
  return /^succeeded$/i.test(state) ? "provisioned" : "provisioning";
}
function assertNamespaceScope({ tenantId, cloud }, identity) {
  if (!GUID6.test(tenantId || "") || typeof cloud !== "string" || !cloud) throw personalError("namespace_scope_required", "Supply the tenant and cloud from the selected Azure subscription scope.");
  if (!sameId(tenantId, identity.tenantId) || cloud !== identity.cloud) throw personalError("namespace_scope_mismatch", "The explicit namespace scope does not match the actual Azure caller's tenant and cloud.", "Select the intended Azure subscription scope and signed-in Azure identity; no default subscription or tenant is assumed.");
}
function kustoOperation(contract) {
  const operations = contract?.paths ? Object.values(contract.paths).flatMap((path2) => {
    const operation = path2?.post;
    if (!operation) return [];
    if (!Array.isArray(operation.parameters)) throw personalError("mcp_contract_unsupported", "The Kusto operation parameter schema is missing or unsupported.");
    const parameters = (operation.parameters || []).filter((parameter) => parameter?.["x-ms-visibility"] !== "internal").flatMap((parameter) => {
      const definition = contract.definitions?.[parameter?.schema?.$ref?.split("/").pop()];
      return parameter?.in === "body" && definition?.properties ? Object.keys(definition.properties).map((name) => ({ name })) : [parameter];
    });
    return [{ name: operation.operationId, parameters }];
  }) : contract?.value || contract?.operations || [];
  if (!Array.isArray(operations)) throw personalError("mcp_contract_unsupported", "The Kusto managed API did not return a qualified operation schema.");
  const candidates = operations.filter((operation) => /^ListKustoResults(?:Post)?$/i.test(operation?.name || ""));
  const names = Array.isArray(candidates[0]?.parameters) ? candidates[0].parameters.map((parameter) => parameter?.name) : null;
  if (candidates.length !== 1 || !Array.isArray(names) || names.length !== 3 || new Set(names).size !== 3 || !["cluster", "db", "csl"].every((name) => names.includes(name))) {
    throw personalError("mcp_contract_unsupported", "The Kusto managed API must expose one verified read operation with cluster, db and csl parameters.", "Use API mode until the actual managed operation schema is qualified.");
  }
  return candidates[0].name;
}
function callerPolicy(policy, identity, mcp = false) {
  const properties = policy.properties;
  if (properties?.principal?.type !== "ActiveDirectory" || !sameId(properties.principal.identity?.objectId, identity.objectId) || !sameId(properties.principal.identity?.tenantId, identity.tenantId) || mcp && properties.principalType !== "User" || properties.provisioningState !== void 0 && !/^succeeded$/i.test(properties.provisioningState)) {
    throw personalError("definition_policy_unverified", "The caller access policy did not confirm the reviewed principal and successful provisioning.");
  }
}
function mcpEndpoint(value, configurationId) {
  const raw = value.properties?.endpoint || value.properties?.mcpEndpointUrl;
  if (raw === void 0 || raw === null || raw === "") return null;
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw personalError("mcp_endpoint_unverified", "The service returned an invalid MCP endpoint.");
  }
  if (url.protocol !== "https:" || !/^[a-z0-9.-]+\.logic\.azure\.com$/i.test(url.hostname) || url.username || url.password || url.port || url.search || url.hash || !/^\/api\/connectorGateways\/[a-z0-9_-]+\/mcpserverConfigs\/[a-z0-9_-]+\/mcp\/?$/i.test(url.pathname) || !sameId(url.pathname.split("/")[5], configurationId.split("/").pop())) {
    throw personalError("mcp_endpoint_unverified", "The MCP endpoint does not match the reviewed public-cloud configuration.");
  }
  return url.href;
}
function proofView(proof, identity) {
  const caller = proof?.gateway || proof?.caller;
  if (!caller || !sameId(caller.tenantId, identity.tenantId) || !sameId(caller.objectId, identity.objectId) || caller.cloud !== identity.cloud || caller.accountId !== void 0 && caller.accountId !== identity.accountId || proof.invocationAllowed !== true) {
    throw personalError("connector_invocation_denied", "The current Azure caller has no verified invocation access to this connection.", "Choose an authorized connection. Existing policies were not changed.");
  }
  const health = proof.providerHealthy ?? proof.connectionHealthy;
  const authentication = proof.authenticatedConnection ?? proof.connectionAuthenticated;
  const providerHealthy = typeof health === "boolean" ? health : null;
  const authenticatedConnection = typeof authentication === "boolean" ? authentication : null;
  const providerState = providerHealthy === null || authenticatedConnection === null ? "unverified" : authenticatedConnection === false ? "consent_required" : providerHealthy === false ? "unhealthy" : "authenticated";
  const providerAccount = proof.providerAccount ? safeText(proof.providerAccount, 240) : null;
  return {
    eligible: true,
    selectable: true,
    invocationAllowed: true,
    providerHealthy,
    authenticatedConnection,
    providerState,
    ready: false,
    active: false,
    targetValidated: false,
    providerAccount,
    providerAccountLabel: providerAccount || "uses account chosen during consent",
    providerAccountStatus: providerAccount ? "provider-reported" : "unknown"
  };
}
function normalizeTarget(type, target, identity, name, namespaceId, connectionId) {
  if (target == null) return null;
  if (typeof target !== "object" || Array.isArray(target)) throw personalError("invalid_definition", "Use a typed nonsecret diagnostic target.");
  if (!["kusto", "logs", "workspaceInsights"].includes(type)) {
    throw personalError("target_contract_unsupported", "Inbox and Teams target selection belongs to their scoped service, not connection provisioning.");
  }
  const allowed = type === "kusto" ? ["clusterUrl", "database"] : type === "logs" ? ["workspaceId", "resourceId"] : ["workspaceId", "resourceId"];
  if (Object.keys(target).some((key) => !allowed.includes(key))) throw personalError("invalid_definition", "The target contains unsupported fields; credentials and arbitrary metadata are not accepted.");
  if (type === "workspaceInsights" && (!target.resourceId || !/\/providers\/microsoft\.insights\/components\/[^/]+$/i.test(target.resourceId))) {
    throw personalError("invalid_definition", "Workspace-based Application Insights requires its component resource ID; a workspace alone would broaden its scope.");
  }
  if (type === "logs" && target.resourceId && !/\/providers\/microsoft\.operationalinsights\/workspaces\/[^/]+$/i.test(target.resourceId)) {
    throw personalError("invalid_definition", "Log Analytics target resources must be workspace resource IDs.");
  }
  const source = normalizeSource({
    ...target,
    name,
    kind: type === "workspaceInsights" ? "appInsights" : type,
    transport: "namespace",
    namespaceId,
    connectionId,
    tenantId: identity.tenantId,
    cloud: identity.cloud,
    accountId: identity.accountId
  });
  return Object.fromEntries(allowed.filter((key) => source[key] !== void 0).map((key) => [key, source[key]]));
}
function createPersonalConnectorDefinitions({
  identityProvider,
  request,
  authorize,
  verifyConnection,
  clock = Date.now,
  wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
} = {}) {
  for (const [name, callback] of Object.entries({ identityProvider, request, authorize })) {
    if (typeof callback !== "function") throw personalError("definition_adapter_required", `${name} is required.`);
  }
  if (typeof wait !== "function") throw personalError("definition_adapter_required", "wait must be an asynchronous bounded-poll delay callback.");
  const reviews = /* @__PURE__ */ new Map(), locks = /* @__PURE__ */ new Set();
  let nextRevision = 0;
  async function currentIdentity(expected) {
    const current = normalizeIdentity(await identityProvider());
    if (current.cloud !== "AzureCloud") throw personalError("definition_cloud_unsupported", "Connector Namespace provisioning is qualified for AzureCloud only.");
    if (expected && identityKey2(current) !== identityKey2(expected)) throw personalError("definition_identity_changed", "The Azure caller changed after review. Prepare a new review.");
    return current;
  }
  async function call(path2, method, body, identity, allowMissing = false) {
    await currentIdentity(identity);
    let response;
    try {
      response = await request(resourceUrl(path2), method, body === void 0 ? void 0 : clone3(body));
    } catch (error) {
      if (allowMissing && method === "GET" && (error?.status === 404 || error?.statusCode === 404)) response = null;
      else throw sanitizePersonalError(error);
    }
    await currentIdentity(identity);
    if (response === null) {
      if (allowMissing && method === "GET") return null;
      throw personalError("definition_missing", "The requested cloud definition is missing.");
    }
    if (response === void 0) throw personalError("definition_contract_unverified", "The ARM adapter returned no metadata.");
    if (typeof response?.status === "number" && response.status >= 400) throw personalError("definition_request_failed", `ARM ${method} failed with HTTP ${response.status}; no resource readiness was reported.`);
    if (response?.status === 202 && method !== "PUT") throw personalError("definition_contract_unverified", "An ARM read returned Accepted rather than resource metadata.");
    const encoded = JSON.stringify(response);
    if (!encoded || Buffer.byteLength(encoded) > MAX_METADATA_BYTES) throw personalError("definition_metadata_too_large", "The cloud definition exceeds the bounded metadata limit.");
    if (response?.data && typeof response.data === "object") {
      return { ...response.data, ...response.etag ? { etag: response.etag } : {} };
    }
    return response;
  }
  async function read(path2, identity, allowMissing = false) {
    const value = await call(path2, "GET", void 0, identity, allowMissing);
    return value === null ? null : armResource(value, path2);
  }
  async function permission(operation, sourceId, description, mutates) {
    await authorize({ operation, sourceId, description, mutates });
  }
  async function namespace2(namespaceId, identity) {
    const value = await read(namespaceId, identity);
    if (provisioning(value) !== "provisioned") throw personalError("namespace_provisioning", "The selected Connector Namespace is still provisioning.");
    return value;
  }
  async function verify(namespaceId, connectionId, identity, namespace3, connection, discoverySnapshot = false) {
    if (typeof verifyConnection !== "function") throw personalError("connector_access_unverified", "A fresh caller invocation and provider-state verifier is required.", "Supply the owner's qualified connection metadata verifier; ARM visibility alone is not invocation proof.");
    const proof = await verifyConnection({ namespaceId, connectionId, identity, namespace: namespace3, connection, target: null, definitionOnly: true, discoverySnapshot });
    await currentIdentity(identity);
    return proofView(proof, identity);
  }
  function newReview(kind, identity, details, snapshots) {
    if (reviews.size >= MAX_REVIEWS) throw personalError("definition_review_limit", "This conversation reached its bounded review limit.");
    const review = {
      draftId: `connector-review-${randomUUID6()}`,
      revision: ++nextRevision,
      kind,
      identity,
      createdAt: new Date(Number(clock())).toISOString(),
      expiresAt: Number(clock()) + REVIEW_MS,
      status: "prepared",
      ...details,
      snapshots
    };
    reviews.set(review.draftId, review);
    return reviewView(review);
  }
  function reviewView(review) {
    const { snapshots, expiresAt, ...view } = review;
    return clone3({
      ...view,
      id: review.draftId,
      definitionKind: review.kind,
      kind: review.kind === "connector" ? review.sourceKind : review.kind,
      namespace: review.namespaceId || review.resourceId,
      expiresAt: new Date(expiresAt).toISOString()
    });
  }
  function getReview(kind, draftId, expectedRevision) {
    const value = reviews.get(draftId);
    if (!value || value.kind !== kind) throw personalError("definition_review_not_found", "Prepare a definition in this conversation first.");
    if (value.revision !== expectedRevision) throw personalError("definition_review_stale", "Use the exact reviewed revision.");
    if (value.status !== "prepared") throw personalError("definition_review_consumed", "This review has already been submitted. Inspect its exact resources before preparing another review.");
    if (Number(clock()) >= value.expiresAt) throw personalError("definition_review_expired", "The review expired. Refresh and prepare it again.");
    return value;
  }
  function lock(review, resource) {
    const resources = [resource, ...review.configuration ? [review.configuration.path] : []].map((value) => value.toLowerCase());
    if (resources.some((value) => locks.has(value))) throw personalError("definition_save_pending", "Another reviewed save for these resources is in progress.");
    for (const value of resources) locks.add(value);
    review.status = "saving";
  }
  function unlock(review) {
    locks.delete(review.resourceId.toLowerCase());
    if (review.configuration) locks.delete(review.configuration.path.toLowerCase());
  }
  async function checkSnapshot(path2, expectedRevision, identity, allowMissing) {
    const value = await read(path2, identity, allowMissing);
    if (revision(value) !== expectedRevision) throw personalError("definition_changed", "The cloud definition changed after review. Refresh and review again; no stale definition was written.");
    return value;
  }
  async function write(review, path2, body, stage) {
    if (Number(clock()) >= review.expiresAt) throw personalError("definition_review_expired", "The review expired before this write. Inspect completed setup steps before reviewing again.");
    review.stage = stage;
    review.writeAttempted = true;
    await call(path2, "PUT", body, review.identity);
  }
  function saveError(review, error) {
    const cancelledBeforeWrite = error?.code === "personal_approval_cancelled" && !review.writeAttempted;
    review.status = cancelledBeforeWrite ? "prepared" : review.writeAttempted ? "incomplete" : "rejected";
    const result = sanitizePersonalError(error);
    result.draftId = review.draftId;
    result.resourceId = review.resourceId;
    result.stage = review.stage || "preflight";
    result.writeAttempted = review.writeAttempted === true;
    result.recovery = cancelledBeforeWrite ? "The exact review is kept. A separate user action must request native approval again; caller and cloud snapshots are rechecked before any write." : "Inspect the exact resource and completed setup steps before preparing another review. No failed or uncertain write was retried.";
    return result;
  }
  async function pollCreatedNamespace(review) {
    let value = null;
    for (let attempt = 1; attempt <= 12; attempt++) {
      assertNamespaceScope(review.fields, await currentIdentity(review.identity));
      value = await read(review.resourceId, review.identity, true);
      if (value) {
        const state = provisioning(value);
        if (value.location?.toLowerCase().replace(/\s/g, "") !== review.body.location || value.identity?.type !== "SystemAssigned") {
          throw personalError("definition_contract_unverified", "Created namespace metadata does not match the reviewed location and identity.");
        }
        if (state === "provisioned") return { value, state, provisioningChecks: attempt };
      }
      if (attempt < 12) await wait(2e3);
    }
    return { value, state: "provisioning", provisioningChecks: 12 };
  }
  const service = {
    async prepareNamespace({ subscriptionId, resourceGroup, name, location, tenantId, cloud }) {
      const identity = await currentIdentity();
      assertNamespaceScope({ tenantId, cloud }, identity);
      if (!GUID6.test(subscriptionId || "")) throw personalError("invalid_namespace", "Choose an explicit Azure subscription GUID.");
      resourceGroup = text2(resourceGroup, "resource group", 90);
      name = leaf(name, "namespace name");
      location = text2(location, "Azure location", 80).toLowerCase().replace(/\s/g, "");
      if (!/^[a-z0-9]+$/.test(location)) throw personalError("invalid_namespace", "Choose a named Azure region.");
      const resourceId = validateNamespaceId(`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.Web/connectorGateways/${name}`);
      await permission("review_connector_namespace", resourceId, "Check the exact namespace reference before reviewing creation.", false);
      if (await read(resourceId, identity, true)) throw personalError("namespace_exists", "This namespace already exists. Select it instead; it was not overwritten.");
      return newReview("namespace", identity, {
        resourceId,
        body: { location, identity: { type: "SystemAssigned" }, properties: {} },
        fields: { subscriptionId, resourceGroup, name, location, tenantId: tenantId.toLowerCase(), cloud },
        limitations: [
          "The service must confirm regional availability and provisioning. A system-assigned namespace identity is created; no SRE or data-source permissions are granted.",
          "Creation rechecks absence immediately before PUT. The injected three-argument ARM adapter has no verified atomic conditional-write contract."
        ]
      }, { resource: null });
    },
    async createNamespace({ draftId, expectedRevision, approval }) {
      if (approval !== true) throw personalError("definition_approval_required", "Explicitly approve the exact namespace review before creating it.");
      const review = getReview("namespace", draftId, expectedRevision);
      lock(review, review.resourceId);
      try {
        assertNamespaceScope(review.fields, await currentIdentity(review.identity));
        await permission("create_connector_namespace", review.resourceId, `Create the reviewed Connector Namespace ${review.resourceId} in ${review.body.location} with a system-assigned identity. No SRE grants are included.`, true);
        await checkSnapshot(review.resourceId, review.snapshots.resource, review.identity, true);
        assertNamespaceScope(review.fields, await currentIdentity(review.identity));
        await write(review, review.resourceId, review.body, "namespace");
        const { value, state, provisioningChecks } = await pollCreatedNamespace(review);
        review.status = "saved";
        return {
          id: draftId,
          draftId,
          revision: review.revision,
          kind: "namespace",
          namespace: review.resourceId,
          namespaceId: review.resourceId,
          fields: clone3(review.fields),
          state,
          ready: state === "provisioned",
          location: value?.location || review.body.location,
          provisioningChecks,
          limitations: state === "provisioning" ? ["The approved namespace create was submitted once. Bounded reads did not confirm completion; inspect this exact resource before continuing."] : []
        };
      } catch (error) {
        throw saveError(review, error);
      } finally {
        unlock(review);
      }
    },
    async discoverConnections({ namespaceId }) {
      namespaceId = validateNamespaceId(namespaceId);
      const identity = await currentIdentity();
      await permission("discover_connector_definitions", namespaceId, "Read authorized existing connections in the selected namespace. Do not modify access policies or activate connections.", false);
      const parent = await namespace2(namespaceId, identity);
      const data = await call(`${namespaceId}/connections`, "GET", void 0, identity);
      if (!Array.isArray(data.value)) throw personalError("definition_contract_unverified", "The service returned an unsupported connection list.");
      const connections = [];
      let next = 0, stopped = false;
      async function itemView(item) {
        const id = connectionResource(namespaceId, item?.id);
        try {
          const connection = armResource(item, id);
          const type = PERSONAL_CONNECTOR_TYPES.find((value) => value.connectorName === connection.properties?.connectorName);
          if (!type) throw personalError("connector_type_unsupported", "This provider connector is outside the supported typed catalog.");
          const access = await verify(namespaceId, id, identity, parent, connection, true);
          return {
            id,
            connectionId: id,
            name: safeText(connection.properties.displayName || id.split("/").pop(), 120),
            connectorName: type.connectorName,
            types: PERSONAL_CONNECTOR_TYPES.filter((value) => value.connectorName === type.connectorName).map((value) => value.type),
            configurationRevision: revision(connection),
            ...access,
            status: access.providerState === "authenticated" ? "Connected" : access.providerState === "consent_required" ? "Consent required" : access.providerState === "unhealthy" ? "Provider unhealthy" : "Provider state unverified"
          };
        } catch (error) {
          const failure2 = sanitizePersonalError(error);
          if (!["connector_type_unsupported", "connector_invocation_denied"].includes(failure2.code)) throw failure2;
          return {
            id,
            connectionId: id,
            name: safeText(item.properties?.displayName || item.name, 120),
            eligible: false,
            selectable: false,
            ready: false,
            active: false,
            targetValidated: false,
            status: "Unavailable",
            error: { code: failure2.code, message: failure2.message, recovery: failure2.recovery }
          };
        }
      }
      const items = data.value.slice(0, 50);
      async function worker() {
        while (!stopped && next < items.length) {
          const index = next++;
          try {
            connections[index] = await itemView(items[index]);
          } catch (error) {
            stopped = true;
            throw error;
          }
        }
      }
      await Promise.all([worker(), worker(), worker(), worker()]);
      return {
        namespaceId,
        connections,
        truncated: data.value.length > 50 || Boolean(data.nextLink),
        limitations: data.nextLink ? ["Additional connections were not fetched; discovery is bounded to the selected namespace."] : []
      };
    },
    async prepareConnector({
      namespaceId,
      kind,
      name,
      source,
      withMcp,
      existingConnectionId,
      type,
      connectionId,
      displayName,
      transport,
      configurationName,
      target,
      url,
      sourceId,
      expectedSourceRevision
    }) {
      if (displayName !== void 0) displayName = text2(displayName, "connector display name", 120);
      if (kind !== void 0 && type !== void 0 && (kind === "appInsights" ? "workspaceInsights" : kind) !== type) throw personalError("invalid_definition", "Choose one connector kind.");
      const sourceKind = kind ?? (type === "workspaceInsights" ? "appInsights" : type);
      if (url !== void 0) {
        if (sourceKind !== "teams") throw personalError("invalid_definition", "A channel URL is only supported for Teams.");
        parseTeamsTarget(url);
      }
      type = sourceKind === "appInsights" ? "workspaceInsights" : sourceKind;
      if (withMcp !== void 0 && typeof withMcp !== "boolean") throw personalError("invalid_definition", "withMcp must be an explicit boolean.");
      if (transport !== void 0 && withMcp !== void 0 && transport !== (withMcp ? "mcp" : "api")) throw personalError("invalid_definition", "The reviewed connector transport is ambiguous.");
      transport = transport ?? (withMcp === true ? "mcp" : "api");
      if (source !== void 0 && target !== void 0) throw personalError("invalid_definition", "Provide one typed source target.");
      target = source ?? target;
      if (existingConnectionId !== void 0) {
        if (connectionId !== void 0) throw personalError("invalid_definition", "Provide one existing connection reference.");
        connectionId = existingConnectionId;
        displayName = displayName ?? name;
        name = void 0;
      }
      namespaceId = validateNamespaceId(namespaceId);
      const identity = await currentIdentity();
      const definition = PERSONAL_CONNECTOR_TYPES.find((value) => value.type === type);
      if (!definition) throw personalError("connector_type_unsupported", "Choose Kusto, Logs, workspace-based Application Insights, Inbox or Teams.");
      if (!["api", "mcp"].includes(transport)) throw personalError("connector_transport_unsupported", "Use API mode, or explicitly review supported MCP creation.");
      if (transport === "mcp" && !definition.mcpSupported) throw personalError("mcp_contract_unsupported", `The fixed read-operation MCP serialization for ${definition.name} is not qualified. Use its API connection; no generic MCP was created.`);
      if (Boolean(name) === Boolean(connectionId)) throw personalError("invalid_definition", "Provide a new connection name or one existing connection ID, not both.");
      const resourceId = connectionResource(namespaceId, connectionId || name);
      if (sourceId !== void 0 && (!connectionId || !Number.isSafeInteger(expectedSourceRevision) || expectedSourceRevision < 1)) {
        throw personalError("source_revision_required", "Editing a chat source requires its existing connection and exact current source revision.");
      }
      if (sourceId !== void 0) sourceId = text2(sourceId, "chat source reference", 240);
      await permission("review_connector_definition", resourceId, "Read the selected namespace and connection to prepare an exact typed review.", false);
      const parent = await namespace2(namespaceId, identity);
      const existing = await read(resourceId, identity, true);
      if (connectionId && !existing) throw personalError("connection_deleted", "The selected existing connection is missing. Refresh the namespace list.");
      if (name && existing) throw personalError("connection_exists", "The new name is already in use. Select the existing connection explicitly; it was not overwritten.");
      if (existing && existing.properties?.connectorName !== definition.connectorName) throw personalError("connector_type_mismatch", "The existing connection belongs to another provider type.");
      const reviewedName = text2(displayName ?? (existing?.properties?.displayName || definition.name), "connector display name", 120);
      const normalizedTarget = normalizeTarget(type, target, identity, reviewedName, namespaceId, resourceId);
      const access = existing ? await verify(namespaceId, resourceId, identity, parent, existing) : null;
      const callerPolicy2 = { properties: { principal: { type: "ActiveDirectory", identity: { objectId: identity.objectId, tenantId: identity.tenantId } } } };
      let configuration = null, existingConfiguration = null, managedApi = null;
      if (transport === "mcp") {
        if (!normalizedTarget) throw personalError("mcp_target_required", "Kusto MCP creation needs a reviewed fixed cluster URL and database.");
        managedApi = await call(`${namespaceId}/managedApis/kusto?export=true`, "GET", void 0, identity);
        configurationName = configurationName ?? `${resourceId.split("/").pop().slice(0, 90)}-mcp-${randomUUID6().slice(0, 8)}`;
        configuration = createPersonalKustoConfigurationDefinition({
          namespaceId,
          connectionId: resourceId,
          configurationName: leaf(configurationName, "MCP configuration name"),
          operationName: kustoOperation(managedApi),
          source: { ...normalizedTarget, name: reviewedName, kind: "kusto", tenantId: identity.tenantId, cloud: identity.cloud }
        });
        existingConfiguration = await read(configuration.path, identity, true);
        if (existingConfiguration) throw personalError("mcp_configuration_exists", "The MCP configuration name is already in use. No existing configuration or policy was replaced.");
      } else if (configurationName !== void 0) throw personalError("invalid_definition", "A configuration name is only used for explicitly reviewed MCP creation.");
      return newReview("connector", identity, {
        namespaceId,
        resourceId,
        type,
        sourceKind,
        connectorName: definition.connectorName,
        transport,
        target: normalizedTarget,
        selectable: true,
        ready: false,
        active: false,
        targetValidated: false,
        providerState: access?.providerState || "not_created",
        providerHealthy: access?.providerHealthy ?? null,
        authenticatedConnection: access?.authenticatedConnection ?? null,
        fields: {
          name: resourceId.split("/").pop(),
          displayName: reviewedName,
          source: normalizedTarget,
          ...url !== void 0 ? { url } : {},
          ...sourceId !== void 0 ? { sourceId, expectedSourceRevision } : {},
          withMcp: transport === "mcp",
          existingConnectionId: existing ? resourceId : null,
          ...configuration ? { configurationName: configuration.path.split("/").pop() } : {}
        },
        reuseExisting: Boolean(existing),
        body: existing ? null : { properties: { connectorName: definition.connectorName, displayName: reviewedName } },
        connectionPolicy: existing ? null : { path: `${resourceId}/accessPolicies/${identity.objectId}`, body: callerPolicy2 },
        configuration: configuration ? { ...configuration, policy: {
          path: `${configuration.path}/accessPolicies/${identity.objectId}`,
          body: { properties: { ...callerPolicy2.properties, principalType: "User" } }
        } } : null,
        targetPersistence: configuration ? "cloud-fixed-parameters" : normalizedTarget ? "review-only" : "not-selected",
        limitations: [
          ...normalizedTarget && !configuration ? [
            "The API connection ARM schema has no qualified diagnostic target-storage field. This target remains a reviewed nonsecret reference, not a persisted cloud binding.",
            "The returned direct diagnostic source uses the signed-in Azure user's service credentials, not the consenting API connection account."
          ] : [],
          "Existing connection access policies are never rewritten. New resource policies grant only this reviewed caller; no SRE or global configuration is modified.",
          "Definition review does not invoke data operations or validate a downstream target. Test or connect the explicitly selected target before use.",
          "Fresh snapshots are rechecked before writes. The three-argument ARM adapter does not provide a qualified atomic conditional-write contract."
        ]
      }, { namespace: revision(parent), connection: revision(existing), configuration: revision(existingConfiguration), managedApi: revision(managedApi) });
    },
    getRegistrationReview({ draftId, expectedRevision }) {
      const review = getReview("connector", draftId, expectedRevision);
      return {
        kind: review.sourceKind,
        namespaceId: review.namespaceId,
        connectionId: review.resourceId,
        sourceId: review.fields.sourceId,
        expectedRevision: review.fields.expectedSourceRevision
      };
    },
    async saveConnector({ draftId, expectedRevision, approval }, { existingOnly = false } = {}) {
      if (approval !== true) throw personalError("definition_approval_required", "Explicitly approve the exact connector review before saving it.");
      const review = getReview("connector", draftId, expectedRevision);
      if (existingOnly && (!review.reuseExisting || review.configuration)) {
        throw personalError("cloud_creation_requires_approval", "Add existing cannot create a connection, configuration or policy. Review Create and add separately.");
      }
      lock(review, review.resourceId);
      try {
        await currentIdentity(review.identity);
        await permission(
          "save_connector_definition",
          review.resourceId,
          `${review.reuseExisting ? "Use the authorized existing" : "Create the reviewed"} ${review.type} API connection${review.configuration ? " and the fixed-target MCP configuration with caller-only access" : ""}. No existing policies are changed; no SRE grants are included.`,
          !review.reuseExisting || Boolean(review.configuration)
        );
        const parent = await checkSnapshot(review.namespaceId, review.snapshots.namespace, review.identity, false);
        let connection = await checkSnapshot(review.resourceId, review.snapshots.connection, review.identity, true);
        if (review.configuration) {
          await checkSnapshot(review.configuration.path, review.snapshots.configuration, review.identity, true);
          const managedApi = await call(`${review.namespaceId}/managedApis/kusto?export=true`, "GET", void 0, review.identity);
          if (revision(managedApi) !== review.snapshots.managedApi) throw personalError("definition_changed", "The managed API operation schema changed after review.");
        }
        const access = review.reuseExisting ? await verify(review.namespaceId, review.resourceId, review.identity, parent, connection) : null;
        if (!review.reuseExisting) {
          await write(review, review.resourceId, review.body, "connection");
          await write(review, review.connectionPolicy.path, review.connectionPolicy.body, "connection-caller-policy");
          const policy = await read(review.connectionPolicy.path, review.identity);
          callerPolicy(policy, review.identity);
          connection = await read(review.resourceId, review.identity);
        }
        if (connection.properties?.connectorName !== review.connectorName) throw personalError("connector_type_mismatch", "The saved connection does not match the reviewed provider type.");
        let mcp = null;
        if (review.configuration) {
          await write(review, review.configuration.path, review.configuration.body, "mcp-configuration");
          await write(review, review.configuration.policy.path, review.configuration.policy.body, "mcp-caller-policy");
          const saved = await read(review.configuration.path, review.identity);
          const parsed = parsePersonalDiagnosticConfiguration({
            namespaceId: review.namespaceId,
            connectionId: review.resourceId,
            identity: review.identity,
            configuration: saved
          });
          if (parsed.source.clusterUrl !== review.target.clusterUrl || parsed.source.database !== review.target.database) {
            throw personalError("definition_changed", "The saved MCP target does not match the reviewed fixed target.");
          }
          const policy = await read(review.configuration.policy.path, review.identity);
          callerPolicy(policy, review.identity, true);
          mcp = {
            configurationId: parsed.configurationId,
            configurationRevision: parsed.configurationRevision,
            queryScopeEnforced: true,
            operations: parsed.operations,
            endpoint: mcpEndpoint(saved, parsed.configurationId),
            ready: false,
            state: "invocation_unverified"
          };
        }
        review.status = "saved";
        const source = review.target ? normalizeSource({
          ...review.target,
          name: review.fields.displayName,
          kind: review.type === "workspaceInsights" ? "appInsights" : review.type,
          transport: mcp ? "namespace" : "direct",
          namespaceId: review.namespaceId,
          connectionId: review.resourceId,
          tenantId: review.identity.tenantId,
          cloud: review.identity.cloud,
          accountId: review.identity.accountId
        }) : null;
        return {
          id: draftId,
          draftId,
          revision: review.revision,
          kind: review.sourceKind,
          namespace: review.namespaceId,
          fields: clone3(review.fields),
          source,
          cloudConnection: {
            namespaceId: review.namespaceId,
            connectionId: review.resourceId,
            connectorName: review.connectorName,
            ...mcp ? { configurationId: mcp.configurationId } : {}
          },
          namespaceId: review.namespaceId,
          connectionId: review.resourceId,
          type: review.type,
          connectorName: review.connectorName,
          transport: review.transport,
          reused: review.reuseExisting,
          target: clone3(review.target),
          targetPersistence: review.targetPersistence,
          configurationRevision: revision(connection),
          mcp,
          state: !review.reuseExisting || access.providerState === "consent_required" ? "consent_required" : access.providerState === "unhealthy" ? "provider_unhealthy" : access.providerState === "unverified" ? "provider_unverified" : mcp ? "mcp_invocation_unverified" : "target_unverified",
          providerState: access?.providerState || "consent_required",
          providerHealthy: access?.providerHealthy ?? null,
          authenticatedConnection: access?.authenticatedConnection ?? null,
          ready: false,
          active: false,
          targetValidated: false,
          selectable: true,
          limitations: [...clone3(review.limitations), ...mcp ? ["The actual MCP configuration and caller policy were persisted. MCP endpoint invocation has not been probed; no MCP readiness is claimed."] : []]
        };
      } catch (error) {
        throw saveError(review, error);
      } finally {
        unlock(review);
      }
    }
  };
  service.listConnections = service.discoverConnections;
  service.addExistingConnector = (input) => service.saveConnector(input, { existingOnly: true });
  return Object.freeze(service);
}
var PERSONAL_CONNECTOR_TYPES, GUID6, LEAF, MAX_METADATA_BYTES, MAX_REVIEWS, REVIEW_MS, clone3, sameId, resourceUrl;
var init_personal_connector_definitions = __esm({
  "canvases/azure-sre-agent/src/personal-connector-definitions.mjs"() {
    init_teams_target();
    init_personal_source_catalog();
    PERSONAL_CONNECTOR_TYPES = Object.freeze([
      Object.freeze({ type: "kusto", name: "Azure Data Explorer", connectorName: "kusto", mcpSupported: true }),
      Object.freeze({ type: "logs", name: "Log Analytics", connectorName: "azuremonitorlogs", mcpSupported: false }),
      Object.freeze({ type: "workspaceInsights", name: "Workspace-based Application Insights", connectorName: "azuremonitorlogs", mcpSupported: false }),
      Object.freeze({ type: "inbox", name: "Inbox", connectorName: "office365", mcpSupported: false }),
      Object.freeze({ type: "teams", name: "Teams", connectorName: "teams", mcpSupported: false })
    ]);
    GUID6 = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
    LEAF = /^[a-z0-9][a-z0-9_-]{0,127}$/i;
    MAX_METADATA_BYTES = 1024 * 1024;
    MAX_REVIEWS = 100;
    REVIEW_MS = 10 * 60 * 1e3;
    clone3 = (value) => structuredClone(value);
    sameId = (one, two) => typeof one === "string" && typeof two === "string" && one.toLowerCase() === two.toLowerCase();
    resourceUrl = (path2) => `${path2}${path2.includes("?") ? "&" : "?"}api-version=${CONNECTOR_API_VERSION}`;
  }
});

// canvases/azure-sre-agent/src/personal-runtime.mjs
import { createHash as createHash7, randomUUID as randomUUID7 } from "node:crypto";
import { AsyncLocalStorage as AsyncLocalStorage2 } from "node:async_hooks";

// packages/studio-runtime/src/studio-commands.mjs
import { execFile, spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { accessSync, constants, readFileSync } from "node:fs";
import { cp, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
var ICONS = {
  vscode: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>',
  github: '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
  azure: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.05 2 4 20.01h5.86l1.45-3.73 5.63 5.72H24L13.05 2Zm.8 6.42 4.37 10.36-5.25-4.79 2.91-5.01-2.03-.56ZM10.1 17.73H6.78l5.45-10.85 1.43 3.38-3.56 7.47Z"/></svg>'
};
var COMMAND_BUTTONS = `<button class="btn ghost" id="open-vscode">${ICONS.vscode}<span class="label">Open in VS Code</span></button>
      <button class="btn ghost" id="save-github">${ICONS.github}<span class="label">Save to GitHub</span></button>
      <button class="btn ghost" id="deploy-azure">${ICONS.azure}<span class="label">Deploy to Azure</span></button>`;
function canExecuteCommand(file, osName = os.platform()) {
  try {
    accessSync(file, osName === "win32" ? constants.F_OK : constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
var WINDOWS_COMMAND_META_CHARACTERS = /([()\][%!^"`<>&|;, *?])/g;
function escapeWindowsCommandMetaCharacters(value) {
  return value.replace(WINDOWS_COMMAND_META_CHARACTERS, "^$1");
}
function assertWindowsCommandValue(value) {
  const text3 = String(value);
  if (/[\r\n]/.test(text3)) {
    throw new Error("Command arguments contain unsupported Windows command characters.");
  }
  return text3;
}
function escapeWindowsCommand(value) {
  return escapeWindowsCommandMetaCharacters(assertWindowsCommandValue(value));
}
function quoteWindowsCommandArgument(value) {
  let text3 = assertWindowsCommandValue(value);
  text3 = text3.replace(/(?=(\\+?)?)\1"/g, '$1$1\\"');
  text3 = text3.replace(/(?=(\\+?)?)\1$/, "$1$1");
  return escapeWindowsCommandMetaCharacters(`"${text3}"`);
}
function windowsCommandShellLine(command, args = []) {
  const shellCommand = [escapeWindowsCommand(command), ...args.map(quoteWindowsCommandArgument)].join(" ");
  return `"${shellCommand}"`;
}
function spawnSpecForLocated(located, args, env, osName) {
  if (osName === "win32" && /\.(?:cmd|bat)$/i.test(located.path)) {
    const comSpec = env.ComSpec || env.COMSPEC || path.win32.join(env.SystemRoot || env.SYSTEMROOT || "C:\\Windows", "System32", "cmd.exe");
    return {
      file: comSpec,
      args: [
        "/d",
        "/s",
        "/c",
        windowsCommandShellLine(located.path, args)
      ],
      env,
      located,
      windowsVerbatimArguments: true
    };
  }
  return { file: located.path, args: [...args], env, located, windowsVerbatimArguments: false };
}
var AZURE_CLI_ENV_KEYS = [
  "HOME",
  "USER",
  "LOGNAME",
  "TMPDIR",
  "LANG",
  "LC_ALL",
  "SHELL",
  "USERPROFILE",
  "HOMEDRIVE",
  "HOMEPATH",
  "SystemRoot",
  "SYSTEMROOT",
  "TEMP",
  "TMP",
  "ComSpec",
  "COMSPEC",
  "PATHEXT",
  "AZURE_CONFIG_DIR",
  "XDG_CONFIG_HOME",
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "NO_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
  "no_proxy",
  "REQUESTS_CA_BUNDLE",
  "CURL_CA_BUNDLE",
  "SSL_CERT_FILE",
  "SSL_CERT_DIR",
  "AZURE_CLI_DISABLE_CONNECTION_VERIFICATION"
];
function sourcePath(source) {
  return source.PATH || source.Path || source.path || "";
}
function locateAzureCli(source = process.env, osName = os.platform(), exists = (candidate) => canExecuteCommand(candidate, osName)) {
  const paths = osName === "win32" ? path.win32 : path.posix;
  const inherited = sourcePath(source).split(paths.delimiter).filter(Boolean);
  const home = source.HOME || source.USERPROFILE || os.homedir();
  const known = osName === "win32" ? [
    paths.join(source.ProgramFiles || "C:\\Program Files", "Microsoft SDKs", "Azure", "CLI2", "wbin"),
    paths.join(
      source["ProgramFiles(x86)"] || "C:\\Program Files (x86)",
      "Microsoft SDKs",
      "Azure",
      "CLI2",
      "wbin"
    )
  ] : [
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/opt/local/bin",
    paths.join(home, ".local", "bin"),
    paths.join(home, "bin"),
    "/usr/bin",
    "/bin",
    "/snap/bin"
  ];
  const directories = [.../* @__PURE__ */ new Set([...inherited, ...known])];
  const searched = [];
  if (source.AZURE_CLI_PATH) {
    searched.push(source.AZURE_CLI_PATH);
    if (exists(source.AZURE_CLI_PATH)) {
      return {
        found: true,
        path: source.AZURE_CLI_PATH,
        directory: paths.dirname(source.AZURE_CLI_PATH),
        searched
      };
    }
  }
  for (const directory of directories) {
    for (const name of osName === "win32" ? ["az.cmd", "az.exe", "az"] : ["az"]) {
      const candidate = paths.join(directory, name);
      searched.push(candidate);
      if (exists(candidate)) return { found: true, path: candidate, directory, searched };
    }
  }
  return { found: false, path: "", directory: "", searched };
}
var AzureCliNotFoundError = class extends Error {
  constructor(searched = []) {
    super(
      "Azure CLI executable was not found. Install Azure CLI or set AZURE_CLI_PATH to its absolute path, then retry."
    );
    this.name = "AzureCliNotFoundError";
    this.code = "AZURE_CLI_NOT_FOUND";
    this.searched = searched;
  }
};
function azureCliChildEnv(source = process.env, located = locateAzureCli(source), osName = os.platform()) {
  const paths = osName === "win32" ? path.win32 : path.posix;
  const env = {};
  const copied = /* @__PURE__ */ new Set();
  for (const key of AZURE_CLI_ENV_KEYS) {
    const identity = osName === "win32" ? key.toLowerCase() : key;
    if (source[key] != null && !copied.has(identity)) {
      env[key] = source[key];
      copied.add(identity);
    }
  }
  const inherited = sourcePath(source).split(paths.delimiter).filter(Boolean);
  const fallbacks = osName === "win32" ? [
    paths.join(source.SystemRoot || source.SYSTEMROOT || "C:\\Windows", "System32"),
    source.SystemRoot || source.SYSTEMROOT || "C:\\Windows"
  ] : ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"];
  env.PATH = [.../* @__PURE__ */ new Set([...located.found ? [located.directory] : [], ...inherited, ...fallbacks])].join(
    paths.delimiter
  );
  if (osName === "win32" && !env.ComSpec && !env.COMSPEC) {
    env.ComSpec = paths.join(source.SystemRoot || source.SYSTEMROOT || "C:\\Windows", "System32", "cmd.exe");
  }
  return env;
}
function azureCliSpawnSpec(args, {
  env = process.env,
  osName = os.platform(),
  locate = locateAzureCli
} = {}) {
  assertFixtureAuthenticationDenied("az");
  const located = locate(env, osName);
  if (!located.found) throw new AzureCliNotFoundError(located.searched);
  const childEnv = azureCliChildEnv(env, located, osName);
  return spawnSpecForLocated(located, args, childEnv, osName);
}
async function runAzureCliJson(args, subscription, {
  timeout = 3e4,
  maxBuffer = 1024 * 1024,
  env = process.env,
  execute = execFileText,
  locate = locateAzureCli,
  osName = os.platform(),
  signal
} = {}) {
  const full = subscription ? [...args, "--subscription", subscription] : [...args];
  const withFlag = full.includes("--only-show-errors") ? full : [...full, "--only-show-errors"];
  const { stdout } = await runAzureCliText(withFlag, {
    env,
    maxBuffer,
    timeout,
    execute,
    locate,
    osName,
    ...signal ? { signal } : {}
  });
  const text3 = stdout.trim();
  return text3 ? JSON.parse(text3) : null;
}
async function runAzureCliText(args, {
  env = process.env,
  execute = execFileText,
  locate = locateAzureCli,
  osName = os.platform(),
  ...options
} = {}) {
  const command = azureCliSpawnSpec(args, { env, locate, osName });
  return execute(command.file, command.args, {
    maxBuffer: 1024 * 1024,
    ...options,
    env: command.env,
    windowsVerbatimArguments: command.windowsVerbatimArguments
  });
}
var fixtureAuthCommands = [];
function assertFixtureAuthenticationDenied(command, args = []) {
  if (process.env.FUNCTION_STUDIO_TEST_MODE !== "1") return;
  const name = path.win32.basename(String(command)).replace(/\.(?:cmd|bat|exe)$/i, "").toLowerCase();
  const gitRemote = name === "git" && args.some((arg) => ["clone", "fetch", "pull", "push", "ls-remote", "credential"].includes(arg));
  const packageInstall = ["npm", "npx", "pip", "pip3", "uv"].includes(name) && args.some((arg) => ["install", "exec", "add", "run"].includes(arg)) || /^python(?:\d+(?:\.\d+)?)?$/.test(name) && args.includes("pip") && args.includes("install");
  if (!gitRemote && !packageInstall && !["az", "azd", "gh", "azureauth", "security", "codesign", "npx"].includes(name)) return;
  fixtureAuthCommands.push(name);
  throw new Error(`Live authentication command '${name}' is disabled in Hosted Skills fixture mode. Inject a fake service instead.`);
}
function execFileText(file, args, options = {}) {
  return new Promise((resolve, reject) => {
    assertFixtureAuthenticationDenied(file, args);
    execFile(file, args, { maxBuffer: 1024 * 1024, ...options }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// canvases/azure-sre-agent/src/personal-connection-lifecycle.mjs
init_personal_consent_origin();
import { createHash as createHash2, randomUUID as randomUUID2 } from "node:crypto";

// canvases/azure-sre-agent/src/personal-metadata-lease.mjs
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
var leases = new AsyncLocalStorage();
var READ_ACTIONS = /* @__PURE__ */ new Set([
  "get_diagnostics_context",
  "list_personal_subscriptions",
  "browse_personal_namespaces",
  "browse_personal_kusto_clusters",
  "find_personal_tools"
]);
var identityKey = (value) => JSON.stringify([value.cloud, value.tenantId, value.objectId, value.accountId]);
var failure = (code, message) => Object.assign(new Error(message), { code });
function assertPersonalMetadataCurrent() {
  const lease = leases.getStore();
  if (lease && (lease.closed || lease.signal.aborted)) throw failure("personal_metadata_cancelled", "Connector metadata loading was cancelled or exceeded 15 seconds. No denied operation was retried.");
}
function personalMetadataSignal() {
  assertPersonalMetadataCurrent();
  return leases.getStore()?.signal;
}
async function personalMetadataPhase(phase, operation) {
  assertPersonalMetadataCurrent();
  const lease = leases.getStore(), started = performance.now();
  try {
    return await operation();
  } finally {
    if (lease) lease.phases[phase] = (lease.phases[phase] || 0) + Math.round(performance.now() - started);
    assertPersonalMetadataCurrent();
  }
}
async function personalMetadataCli(run, args) {
  const lease = leases.getStore();
  if (lease) lease.cliCalls++;
  return personalMetadataPhase("cli", () => run(args, void 0, lease ? {
    timeout: Math.max(1, Math.ceil(lease.deadline - performance.now())),
    signal: lease.signal
  } : void 0));
}
async function personalMetadataIdentity(run, read) {
  const lease = leases.getStore();
  if (!lease || lease.validating) return read();
  assertPersonalMetadataCurrent();
  if (!lease.identities.has(run)) {
    lease.readers.set(run, read);
    lease.identities.set(run, read());
  } else lease.identityReuse++;
  return lease.identities.get(run);
}
function rememberPersonalMetadataToken(run, identity, token, expiresOnTimestamp) {
  const lease = leases.getStore();
  if (lease && !lease.validating) lease.tokens.set(run, { identity: identityKey(identity), token, expiresOnTimestamp });
}
function personalMetadataArmToken(run, identity) {
  assertPersonalMetadataCurrent();
  const cached = leases.getStore()?.tokens.get(run);
  return cached?.identity === identityKey(identity) && cached.expiresOnTimestamp > Date.now() + 6e4 ? { token: cached.token, expiresOnTimestamp: cached.expiresOnTimestamp } : null;
}
async function withPersonalMetadataLease(action, operation, { signal, onTiming } = {}) {
  if (!READ_ACTIONS.has(action)) return operation();
  const timeout = AbortSignal.timeout(15e3);
  const lease = {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    deadline: performance.now() + 15e3,
    identities: /* @__PURE__ */ new Map(),
    readers: /* @__PURE__ */ new Map(),
    tokens: /* @__PURE__ */ new Map(),
    phases: {},
    cliCalls: 0,
    identityReuse: 0,
    validating: false
  };
  return leases.run(lease, async () => {
    const started = performance.now();
    let status = "failed";
    try {
      const value = await operation();
      lease.validating = true;
      for (const [run, read] of lease.readers) {
        if (identityKey(await read()) !== identityKey(await lease.identities.get(run))) {
          throw failure("personal_scope_changed", "The Azure caller changed while loading connector metadata. Choose the intended scope again.");
        }
      }
      assertPersonalMetadataCurrent();
      status = "complete";
      return value;
    } finally {
      lease.closed = true;
      lease.tokens.clear();
      lease.identities.clear();
      lease.readers.clear();
      await onTiming?.({
        event: "personal-metadata",
        correlationId: randomUUID(),
        action,
        status,
        durationMs: Math.round(performance.now() - started),
        cliCalls: lease.cliCalls,
        identityReuse: lease.identityReuse,
        phases: lease.phases
      });
    }
  });
}

// canvases/azure-sre-agent/src/personal-network-errors.mjs
var reasons = {
  UND_ERR_CONNECT_TIMEOUT: "connection timed out",
  ETIMEDOUT: "connection timed out",
  ENOTFOUND: "DNS lookup failed",
  EAI_AGAIN: "DNS lookup was unavailable",
  ECONNREFUSED: "connection was refused",
  ECONNRESET: "connection was reset",
  ENETUNREACH: "network was unreachable",
  EHOSTUNREACH: "host was unreachable",
  UND_ERR_SOCKET: "connection closed unexpectedly",
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: "TLS certificate could not be verified",
  UNABLE_TO_GET_ISSUER_CERT_LOCALLY: "TLS certificate issuer was not trusted",
  SELF_SIGNED_CERT_IN_CHAIN: "TLS certificate chain was not trusted",
  DEPTH_ZERO_SELF_SIGNED_CERT: "TLS certificate was not trusted",
  CERT_HAS_EXPIRED: "TLS certificate expired",
  ERR_TLS_CERT_ALTNAME_INVALID: "TLS certificate did not match the host"
};
var stages = /* @__PURE__ */ new Set([
  "namespace read",
  "connection read",
  "connection inventory",
  "access policy read",
  "namespace inventory",
  "Kusto inventory",
  "provider definition read",
  "MCP configuration read",
  "provider consent request",
  "namespace creation",
  "connection creation",
  "access policy creation"
]);
function personalNetworkFailure(error, { method = "GET", stage, code = "connection_unavailable" }) {
  const pending = [error];
  let networkCode = "NETWORK_UNAVAILABLE";
  for (let index = 0; index < pending.length && index < 12; index++) {
    const item = pending[index];
    if (typeof item?.code === "string" && Object.hasOwn(reasons, item.code)) {
      networkCode = item.code;
      break;
    }
    if (item?.cause) pending.push(item.cause);
    if (Array.isArray(item?.errors)) pending.push(...item.errors.slice(0, 4));
  }
  const location = stages.has(stage) ? stage : "connection request", reason = reasons[networkCode] || "network request failed";
  const write = method === "PUT";
  const message = write ? `Cloud creation delivery is unknown: Azure management ${reason} during ${location} (${networkCode}). Check the exact resource in Portal before another create attempt. Nothing was marked ready.` : `Azure management ${reason} during ${location} (${networkCode}). Check network access.${method === "GET" ? " You can retry this read." : ""} No connection health or consent success was reported.`;
  return Object.assign(new Error(message), { code: write ? "setup_delivery_unknown" : code });
}

// canvases/azure-sre-agent/src/personal-connection-lifecycle.mjs
var API_VERSION = "2026-05-01-preview";
var ARM = "https://management.azure.com";
var GUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
var hash = (value) => createHash2("sha256").update(JSON.stringify(value)).digest("hex");
var principalKey = (identity) => hash([identity.tenantId?.toLowerCase(), identity.objectId?.toLowerCase(), identity.cloud, identity.accountId?.toLowerCase()]);
var fail = (code, message, status) => Object.assign(new Error(message), { code, status });
function personalConnectionReference(namespaceId, connectionId) {
  if (!/^\/subscriptions\/[a-f0-9-]{36}\/resourceGroups\/[^/?#%]+\/providers\/Microsoft\.Web\/connectorGateways\/[a-z0-9._-]+$/i.test(namespaceId || "") || !/^[a-z0-9][a-z0-9._-]{0,127}$/i.test(connectionId || "")) {
    throw fail("invalid_source", "Choose one valid Connector Namespace and a connection name; arbitrary endpoints are not supported.");
  }
  const subscriptionId = namespaceId.split("/")[2];
  if (!GUID.test(subscriptionId)) throw fail("invalid_source", "The namespace subscription reference is invalid.");
  return `${namespaceId}/connections/${connectionId}`;
}
function createPersonalConnectionLifecycle({
  conversationId,
  identityProvider,
  credentialProvider,
  authorize,
  fetchImpl = fetch,
  clock = Date.now
}) {
  if (!conversationId) throw new Error("Personal connection setup needs an owning Copilot conversation.");
  const creating = /* @__PURE__ */ new Set();
  const attempts = /* @__PURE__ */ new Map();
  async function identity(expected) {
    const current = await identityProvider();
    if (current.cloud !== "AzureCloud" || !GUID.test(current.tenantId || "") || !GUID.test(current.objectId || "")) {
      throw fail("gateway_access_denied", "Choose an explicitly signed-in AzureCloud user with a verified immutable tenant and object ID.");
    }
    if (expected && principalKey(current) !== principalKey(expected)) throw fail("wrong_account", "The Azure caller changed. Reconnect under the intended caller; the OAuth account selected during consent may be different.");
    return current;
  }
  async function request(method, resource, expected, body, { allowMissing = false, suffix = "", acceptPending = false, query = {} } = {}) {
    const current = await identity(expected);
    const credential = await credentialProvider({ ...current, audience: ARM + "/" });
    const token = await credential.getToken(ARM + "/.default");
    await identity(current);
    const url = new URL(`${ARM}${resource}${suffix}`);
    url.searchParams.set("api-version", API_VERSION);
    for (const [name, value] of Object.entries(query)) {
      if (name !== "export" || value !== "true") throw fail("invalid_source", "The connector setup requested an unsupported management parameter.");
      url.searchParams.set(name, value);
    }
    let response;
    try {
      response = await personalMetadataPhase("arm", () => fetchImpl(url, {
        method,
        redirect: "error",
        signal: personalMetadataSignal() || AbortSignal.timeout(3e4),
        headers: {
          Authorization: `Bearer ${token.token}`,
          Accept: "application/json",
          ...body === void 0 ? {} : { "Content-Type": "application/json" }
        },
        ...body === void 0 ? {} : { body: JSON.stringify(body) }
      }));
    } catch (error) {
      assertPersonalMetadataCurrent();
      throw personalNetworkFailure(error, {
        method,
        stage: suffix === "/accessPolicies" ? "access policy read" : /\/accessPolicies\//i.test(resource) ? "access policy creation" : method === "PUT" ? /\/connections\//i.test(resource) ? "connection creation" : "namespace creation" : suffix === "/listConsentLinks" ? "provider consent request" : /\/connections$/i.test(resource) ? "connection inventory" : /\/managedApis\//i.test(resource) ? "provider definition read" : /\/mcpserverConfigs(?:\/|$)/i.test(resource) ? "MCP configuration read" : /\/connections\//i.test(resource) ? "connection read" : "namespace read"
      });
    }
    await identity(current);
    if (allowMissing && response.status === 404) return null;
    const pending = acceptPending && method === "PUT" && response.status === 202;
    if (![200, 201].includes(response.status) && !pending) throw fail(
      response.status === 403 ? "gateway_access_denied" : "connection_unavailable",
      `Connector Namespace ${method} failed with HTTP ${response.status}. No connection was marked ready.`,
      response.status
    );
    if (Number(response.headers?.get("content-length") || 0) > 1024 * 1024) throw fail("connection_unavailable", "Connection metadata exceeded its bounded response limit.");
    const reader = response.body?.getReader();
    if (!reader) throw fail("connection_unavailable", "The connection service returned no readable metadata.");
    const parts = [];
    let bytes = 0;
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1024 * 1024) {
        await reader.cancel();
        throw fail("connection_unavailable", "Connection metadata exceeded its bounded response limit.");
      }
      parts.push(Buffer.from(value));
    }
    if (!bytes && method === "PUT") return { accepted: true, ...pending ? { provisioningState: "Pending" } : {} };
    let data;
    try {
      data = JSON.parse(Buffer.concat(parts).toString("utf8"));
    } catch {
      throw fail("connection_unavailable", "The connection service returned invalid metadata, not a successful setup.");
    }
    return data;
  }
  async function read(namespaceId, connectionId, expected, metadata) {
    const current = await identity(expected), id = personalConnectionReference(namespaceId, connectionId);
    const resource = metadata || await request("GET", id, current);
    if (resource.id?.toLowerCase() !== id.toLowerCase()) throw fail("connection_unavailable", "The service returned a different connection reference.");
    const properties = resource.properties || {};
    const policies = await request("GET", id, current, void 0, { suffix: "/accessPolicies" });
    if (!Array.isArray(policies?.value) || policies.nextLink || policies.value.length > 100 || policies.value.some((policy) => typeof policy?.properties?.principal?.type !== "string")) {
      throw fail("connection_policy_unverified", "Connection access policies were missing, malformed or incomplete. No source was activated.");
    }
    if (!policies.value.length) {
      throw fail("connector_invocation_denied", "This connection has no caller access policy. It is unavailable; no source was activated or policy changed.");
    }
    const callerPolicy2 = policies.value.some((policy) => {
      const principal = policy.properties?.principal;
      return principal?.type === "ActiveDirectory" && principal.identity?.objectId?.toLowerCase() === current.objectId.toLowerCase() && principal.identity?.tenantId?.toLowerCase() === current.tenantId.toLowerCase() && policy.properties?.provisioningState?.toLowerCase() !== "failed";
    });
    if (!callerPolicy2) throw fail("gateway_access_denied", "The current caller has no verified connection invocation policy. Existing access policies were not changed.");
    const status = String(properties.overallStatus || "").toLowerCase();
    const statuses = (properties.statuses || []).map((value) => String(value.status || "").toLowerCase());
    const healthy = status === "connected" && (!properties.provisioningState || properties.provisioningState.toLowerCase() === "succeeded") && !statuses.some((value) => /failed|error|unauth|denied|expired/.test(value));
    const configurationRevision = hash([
      id.toLowerCase(),
      properties.connectorName,
      properties.displayName,
      properties.createdBy,
      policies.value.map((value) => value.properties.principal)
    ]);
    return {
      id,
      namespaceId,
      connectionId,
      name: String(properties.displayName || connectionId).slice(0, 160),
      connectorName: properties.connectorName,
      runtimeUrl: properties.connectionRuntimeUrl || null,
      configurationRevision,
      consentRevision: hash([resource.etag || null, status, statuses, properties.connectionRuntimeUrl || null]),
      healthy,
      status,
      identity: current,
      privateCallerAccess: true,
      privateAccess: policies.value.length === 1
    };
  }
  async function ensureConnection({ namespaceId, connectionId, kind }) {
    const connectorName = kind === "inbox" ? "office365" : kind === "teams" ? "teams" : null;
    if (!connectorName) throw fail("invalid_source", "Only personal Inbox and Teams setup is supported.");
    const current = await identity();
    if (connectionId) {
      const existing = await read(namespaceId, connectionId, current);
      if (existing.connectorName !== connectorName) throw fail("invalid_source", "The selected cloud connection belongs to a different connector.");
      return { namespaceId, connectionId, reused: true, name: existing.name };
    }
    const key = hash([namespaceId.toLowerCase(), connectorName, principalKey(current)]);
    if (creating.has(key)) throw fail("setup_pending", "This private connection setup is already in progress. Repeated setup clicks are blocked.");
    if (attempts.has(key)) {
      const previous = attempts.get(key);
      if (previous.status !== "complete") throw fail("setup_incomplete", `A previous setup needs attention at ${previous.id}. It was not silently retried or replaced.`);
      return { namespaceId, connectionId: previous.connectionId, reused: true, name: previous.name };
    }
    creating.add(key);
    try {
      const generated = `copilot-${connectorName}-${randomUUID2()}`, id = personalConnectionReference(namespaceId, generated);
      await authorize({
        operation: "create_personal_connection",
        sourceId: id,
        mutates: true,
        description: `Create ${kind === "inbox" ? "an Inbox" : "a Teams"} connection in ${namespaceId}, private to this Azure caller. Provider consent may use a different Microsoft 365 account. No SRE identity receives access.`
      });
      await identity(current);
      if (await request("GET", id, current, void 0, { allowMissing: true })) throw fail("connection_exists", "The generated connection already exists. It was not overwritten.");
      const attempt = { id, connectionId: generated, name: kind === "inbox" ? "My Inbox" : "My Teams", status: "creating" };
      attempts.set(key, attempt);
      await request("PUT", id, current, { properties: { connectorName, displayName: attempt.name } });
      attempt.status = "policy_pending";
      await identity(current);
      await request("PUT", id, current, { properties: { principal: {
        type: "ActiveDirectory",
        identity: { objectId: current.objectId, tenantId: current.tenantId }
      } } }, { suffix: `/accessPolicies/${current.objectId}` });
      const created = await read(namespaceId, generated, current);
      if (created.connectorName !== connectorName) throw fail("connection_unavailable", "Created connection metadata did not match the requested connector.");
      attempt.status = "complete";
      return { namespaceId, connectionId: generated, reused: false, name: attempt.name };
    } finally {
      creating.delete(key);
    }
  }
  async function loadConnection2({ namespaceId, connectionId, identity: expected }) {
    const loaded = await read(namespaceId, connectionId, expected);
    const expectedConnector = loaded.connectorName;
    return {
      connectionResourceId: loaded.id,
      connectionRuntimeUrl: loaded.runtimeUrl,
      configurationRevision: loaded.configurationRevision,
      name: loaded.name,
      displayName: loaded.name,
      async verifyIdentity() {
        const latest = await read(namespaceId, connectionId, loaded.identity);
        if (latest.connectorName !== expectedConnector) throw fail("connection_unavailable", "The connector changed. Reconnect and prepare a fresh preview.");
        return {
          gateway: latest.identity,
          invocationAllowed: true,
          privateCallerAccess: latest.privateCallerAccess,
          privateAccess: latest.privateAccess,
          providerHealthy: latest.healthy,
          authenticatedConnection: latest.healthy,
          consentStatus: latest.healthy ? "ready" : "consent_required",
          consentRevision: latest.consentRevision,
          configurationRevision: latest.configurationRevision,
          providerAccount: null,
          providerAccountLabel: "uses account chosen during consent",
          mailbox: { personal: true, folder: "Inbox", displayName: "Inbox using account chosen during consent" },
          sourceAccess: latest.healthy
        };
      },
      async beginConsent() {
        await identity(loaded.identity);
        const latest = await read(namespaceId, connectionId, loaded.identity);
        if (latest.configurationRevision !== loaded.configurationRevision) throw fail("connection_unavailable", "The cloud connection changed. Reconnect before requesting consent; your draft is preserved.");
        const links = await request(
          "POST",
          loaded.id,
          loaded.identity,
          { parameters: [{ parameterName: "token", redirectUrl: "https://portal.azure.com" }] },
          { suffix: "/listConsentLinks" }
        );
        const link = links.value?.find((value) => typeof value.link === "string")?.link;
        if (!link) throw fail("consent_unavailable", "The provider returned no consent link. Your source and draft are preserved.");
        const url = validatePersonalConsentUrl(link);
        return { flow: "provider_managed", url: url.href };
      },
      async checkConsent() {
        await read(namespaceId, connectionId, loaded.identity);
      }
    };
  }
  async function verifyConnection({ namespaceId, connectionId, identity: expected, metadata }) {
    const current = await read(namespaceId, connectionId, expected, metadata);
    return {
      gateway: current.identity,
      connectorName: current.connectorName,
      invocationAllowed: true,
      privateCallerAccess: current.privateCallerAccess,
      privateAccess: current.privateAccess,
      providerHealthy: current.healthy,
      authenticatedConnection: current.healthy,
      runtimeUrl: current.runtimeUrl,
      configurationRevision: current.configurationRevision,
      consentRevision: current.consentRevision,
      providerAccount: null,
      providerAccountLabel: "uses account chosen during consent",
      source: null,
      operations: [],
      queryScopeEnforced: false,
      limitations: ["Cloud connection health and private caller access are verified. A persisted diagnostic target binding is not available through this loader; use a known manual source."]
    };
  }
  return {
    ensureConnection,
    loadConnection: loadConnection2,
    verifyConnection,
    readConnection: read,
    clock,
    request: (method, resource, body, options) => request(method, resource, void 0, body, options)
  };
}

// canvases/azure-sre-agent/src/personal-resource-picker.mjs
init_personal_source_catalog();
import { createHash as createHash5 } from "node:crypto";

// canvases/azure-sre-agent/src/personal-selection-store.mjs
init_personal_source_catalog();
import { createHash as createHash4, randomUUID as randomUUID3 } from "node:crypto";
import { mkdirSync, readFileSync as readFileSync2, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
var guid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
var namespace = /^\/subscriptions\/([a-f0-9-]{36})\/resourceGroups\/[^/?#%\\]+\/providers\/Microsoft\.Web\/connectorGateways\/[^/?#%\\]+$/i;
function createPersonalSelectionStore({ conversationId, directory }) {
  if (typeof conversationId !== "string" || !conversationId) throw new Error("Private connector selection requires its owning conversation.");
  const file = directory ? join(directory, `private-connector-selection-${createHash4("sha256").update(conversationId).digest("hex")}.json`) : null;
  let record = null;
  function validate(value) {
    const scope = value?.scope;
    if (!value || value.version !== 1 || value.conversationId !== conversationId || !/^[a-f0-9]{64}$/.test(value.callerBinding || "") || Object.keys(value).some((key) => !["version", "conversationId", "callerBinding", "scope", "namespaceId"].includes(key)) || scope !== null && (!scope || !guid.test(scope.tenantId || "") || !PERSONAL_CLOUDS[scope.cloud] || !Array.isArray(scope.subscriptionIds) || !scope.subscriptionIds.length || scope.subscriptionIds.length > 20 || scope.subscriptionIds.some((id) => !guid.test(id)) || new Set(scope.subscriptionIds.map((id) => id.toLowerCase())).size !== scope.subscriptionIds.length || Object.keys(scope).some((key) => !["tenantId", "cloud", "subscriptionIds"].includes(key))) || value.namespaceId !== null && (typeof value.namespaceId !== "string" || value.namespaceId.length > 2048 || !namespace.test(value.namespaceId) || scope && !scope.subscriptionIds.some((id) => id.toLowerCase() === value.namespaceId.match(namespace)[1].toLowerCase()))) {
      throw new Error("The saved private connector selection is invalid. It was not used as a default or as cloud authorization.");
    }
    return structuredClone(value);
  }
  return {
    load() {
      if (file) {
        try {
          if (statSync(file).size > 8192) throw new Error("The saved private connector selection exceeds its size limit.");
          record = validate(JSON.parse(readFileSync2(file, "utf8")));
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          record = null;
        }
      }
      return record ? structuredClone(record) : null;
    },
    save(value) {
      const next = validate({ version: 1, conversationId, ...value });
      if (file) {
        mkdirSync(dirname(file), { recursive: true });
        const temporary = `${file}.${randomUUID3()}.tmp`;
        try {
          writeFileSync(temporary, JSON.stringify(next), { mode: 384, flag: "wx" });
          renameSync(temporary, file);
        } catch (error) {
          try {
            unlinkSync(temporary);
          } catch (cleanup) {
            if (cleanup.code !== "ENOENT") throw new AggregateError([error, cleanup], "Private connector selection could not be saved or cleaned up.");
          }
          throw error;
        }
      }
      record = next;
    }
  };
}

// packages/canvas-toolkit/src/subscriptions.mjs
var GUID3 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
var clouds = {
  AzureCloud: "https://management.azure.com",
  AzureUSGovernment: "https://management.usgovcloudapi.net",
  AzureChinaCloud: "https://management.chinacloudapi.cn"
};
var SubscriptionError = class extends Error {
  constructor(code, message) {
    super(message);
    this.name = "SubscriptionError";
    this.code = code;
  }
};
function fail2(code, message) {
  throw new SubscriptionError(code, message);
}
function normalizeSubscriptionScope(scope) {
  if (!scope || typeof scope !== "object" || Array.isArray(scope) || typeof scope.tenantId !== "string" || !GUID3.test(scope.tenantId) || !Array.isArray(scope.subscriptionIds) || !scope.subscriptionIds.length || scope.subscriptionIds.length > 1e3 || scope.subscriptionIds.some((id) => typeof id !== "string" || !GUID3.test(id)) || new Set(scope.subscriptionIds.map((id) => id.toLowerCase())).size !== scope.subscriptionIds.length || typeof scope.cloud !== "string" || !Object.hasOwn(clouds, scope.cloud)) {
    fail2("invalid-scope", "Choose an explicit tenant, one or more unique subscription IDs, and a supported Azure cloud.");
  }
  return { tenantId: scope.tenantId.toLowerCase(), subscriptionIds: scope.subscriptionIds.map((id) => id.toLowerCase()), cloud: scope.cloud };
}

// canvases/azure-sre-agent/src/subscription-scope.mjs
var lower = (value) => String(value || "").toLowerCase();
var guid2 = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function createSreSubscriptionInventory(load, { allowedClouds = ["AzureCloud"], unsupportedReason = "SRE Agent discovery currently supports AzureCloud only." } = {}) {
  let snapshot = { accounts: [], revision: 0 };
  let pending = null;
  let loaded = false;
  let refreshFailed = false;
  async function refresh(force = false) {
    if (pending) return pending;
    if (loaded && !force && !refreshFailed) return structuredClone(snapshot);
    pending = Promise.resolve().then(() => load(force || refreshFailed)).then((rows) => {
      if (!Array.isArray(rows)) throw new Error("Azure CLI returned an invalid subscription inventory.");
      const accounts = rows.map((row) => {
        if (!row || typeof row !== "object") throw new Error("Azure CLI returned invalid subscription metadata.");
        const cloud = row.cloudName || row.environmentName || row.cloud;
        const accountName = row.user?.name || row.accountName;
        if (!guid2.test(row.id || "") || !guid2.test(row.tenantId || "") || typeof cloud !== "string" || !cloud.trim() || typeof accountName !== "string" || !accountName.trim()) {
          throw new Error("Azure CLI subscription metadata is missing its tenant, cloud, or account identity. Reload your Azure CLI profile and retry.");
        }
        return {
          key: JSON.stringify([cloud, lower(row.tenantId), lower(row.id), lower(accountName)]),
          id: row.id,
          name: row.name || row.id,
          tenantId: row.tenantId,
          tenantName: row.tenantDisplayName || row.tenantName || row.tenantId,
          cloud,
          accountName,
          state: row.state,
          isDefault: Boolean(row.isDefault),
          disabled: !allowedClouds.includes(cloud),
          disabledReason: !allowedClouds.includes(cloud) ? unsupportedReason : ""
        };
      });
      snapshot = { accounts, revision: snapshot.revision + 1 };
      loaded = true;
      refreshFailed = false;
      return structuredClone(snapshot);
    }).catch((error) => {
      refreshFailed = true;
      throw error;
    }).finally(() => {
      pending = null;
    });
    return pending;
  }
  function resolve(request) {
    if (!loaded || pending || refreshFailed || request?.revision !== snapshot.revision || !Array.isArray(request.selectedKeys) || new Set(request.selectedKeys).size !== request.selectedKeys.length) {
      throw new Error("Refresh subscriptions and choose the scope again.");
    }
    if (!request.selectedKeys.length && Array.isArray(request.subscriptionIds) && !request.subscriptionIds.length) {
      return { tenantId: "", cloud: "AzureCloud", subscriptionIds: [], subscriptions: [], selectedKeys: [], revision: snapshot.revision };
    }
    const normalized = normalizeSubscriptionScope(request);
    const accounts = request.selectedKeys.map((key) => {
      const matches = snapshot.accounts.filter((account) => account.key === key);
      if (matches.length !== 1) throw new Error("The selected subscription identity is unavailable or ambiguous. Refresh subscriptions.");
      return matches[0];
    });
    if (!allowedClouds.includes(normalized.cloud) || accounts.length !== normalized.subscriptionIds.length || accounts.some((account) => account.disabled || lower(account.state) !== "enabled" || lower(account.tenantId) !== normalized.tenantId || account.cloud !== normalized.cloud || !normalized.subscriptionIds.includes(lower(account.id)))) {
      throw new Error(`Choose available subscriptions from one tenant in ${allowedClouds.join(", ")}.`);
    }
    const principals = new Set(accounts.map((account) => lower(account.accountName)));
    if (principals.size !== 1 || accounts.some((account) => new Set(snapshot.accounts.filter((candidate) => lower(candidate.id) === lower(account.id) && lower(candidate.tenantId) === lower(account.tenantId) && candidate.cloud === account.cloud).map((candidate) => lower(candidate.accountName))).size !== 1)) {
      throw new Error("Choose subscriptions from one unambiguous Azure account.");
    }
    return {
      ...normalized,
      tenantName: accounts[0].tenantName,
      selectedKeys: [...request.selectedKeys],
      revision: snapshot.revision,
      subscriptions: accounts.map(({ id, name }) => ({ id, name }))
    };
  }
  return { refresh, resolve, getSnapshot: () => structuredClone(snapshot) };
}
function createSreAgentDiscovery() {
  let active = 0;
  const waiting = [];
  async function acquire() {
    if (active < 2) active++;
    else await new Promise((resolve) => waiting.push(resolve));
    return () => {
      if (waiting.length) waiting.shift()();
      else active--;
    };
  }
  return async function discover(subscriptionIds, load, isCurrent = () => true) {
    const agents = [];
    const errors = [];
    let index = 0;
    async function worker() {
      while (index < subscriptionIds.length && isCurrent()) {
        const subscription = subscriptionIds[index++];
        const release = await acquire();
        try {
          if (!isCurrent()) continue;
          const rows = await load(subscription);
          if (!Array.isArray(rows)) throw new Error("The agent service returned an invalid list.");
          if (rows.some((agent) => lower(agent?.id?.match(/^\/subscriptions\/([^/]+)\//i)?.[1]) !== lower(subscription))) {
            throw new Error("Agent discovery returned a resource outside the requested subscription.");
          }
          if (new Set(rows.map((agent) => lower(agent.id))).size !== rows.length) {
            throw new Error("Agent discovery returned duplicate resource identities.");
          }
          if (isCurrent()) agents.push(...rows.map((agent) => ({ ...agent, subscriptionId: subscription })));
        } catch (error) {
          if (isCurrent()) errors.push({ subscription, error });
        } finally {
          release();
        }
      }
    }
    await Promise.all([worker(), worker()]);
    return { agents, errors };
  };
}
var discoverSreAgents = createSreAgentDiscovery();

// canvases/azure-sre-agent/src/personal-resource-picker.mjs
var GUID4 = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
var lower2 = (value) => String(value || "").toLowerCase();
var fingerprint2 = (identity) => JSON.stringify([identity.tenantId, identity.cloud, identity.objectId, identity.accountId].map(lower2));
var fail3 = (code, message) => Object.assign(new Error(message), { code });
function createPersonalResourcePicker({
  identityProvider,
  credentialProvider,
  authorize,
  conversationId,
  selectionStore = createPersonalSelectionStore({ conversationId }),
  run = runAzureCliJson,
  fetchImpl = fetch,
  clock = Date.now,
  inventory = createSreSubscriptionInventory(
    () => personalMetadataCli(run, ["account", "list", "--query", "[?state=='Enabled']", "-o", "json"]),
    { allowedClouds: Object.keys(PERSONAL_CLOUDS), unsupportedReason: "This Azure cloud is not supported for personal discovery." }
  )
}) {
  let profileBinding = null, profilesLoadedAt = 0;
  async function current(expected) {
    const identity = await identityProvider();
    if (!PERSONAL_CLOUDS[identity.cloud] || !GUID4.test(identity.tenantId || "") || !identity.accountId || !identity.objectId) {
      throw fail3("personal_scope_invalid", "Choose an explicitly signed-in Azure user, tenant and supported cloud.");
    }
    if (expected && fingerprint2(expected) !== fingerprint2(identity)) {
      throw fail3("personal_scope_changed", "The signed-in Azure caller changed. Choose the intended subscription again.");
    }
    return identity;
  }
  async function scopeOf(input) {
    const identity = await current(), scope = inventory.resolve(input.scope);
    const accounts = inventory.getSnapshot().accounts.filter((account) => scope.selectedKeys.includes(account.key));
    if (!scope.subscriptionIds.length || scope.subscriptionIds.length > 20 || lower2(scope.tenantId) !== lower2(identity.tenantId) || scope.cloud !== identity.cloud || accounts.some((account) => lower2(account.accountName) !== lower2(identity.accountId))) {
      throw fail3("personal_scope_invalid", "Choose up to 20 subscriptions from the signed-in Azure caller's tenant and cloud. No default subscription was assumed.");
    }
    return { identity, scope };
  }
  const callerBinding = (identity) => createHash5("sha256").update(fingerprint2(identity)).digest("hex");
  function selection(identity) {
    const saved = selectionStore.load();
    return saved?.callerBinding === callerBinding(identity) ? saved : null;
  }
  function saveScope(identity, scope) {
    const previous = selection(identity), selectedId = previous?.namespaceId?.split("/")[2];
    selectionStore.save({
      callerBinding: callerBinding(identity),
      scope: { tenantId: scope.tenantId, cloud: scope.cloud, subscriptionIds: [...scope.subscriptionIds] },
      namespaceId: scope.subscriptionIds.some((id) => lower2(id) === lower2(selectedId)) ? previous.namespaceId : null
    });
  }
  async function page(url, expected) {
    const credential = await credentialProvider({ ...expected, audience: PERSONAL_CLOUDS[expected.cloud].arm });
    const token = await credential.getToken(`${PERSONAL_CLOUDS[expected.cloud].arm}/.default`);
    if (typeof token?.token !== "string" || !token.token) throw fail3("personal_inventory_authentication", "Azure did not supply a caller-bound ARM token.");
    await current(expected);
    let response;
    try {
      response = await personalMetadataPhase("arm", () => fetchImpl(url, {
        method: "GET",
        redirect: "error",
        signal: personalMetadataSignal() || AbortSignal.timeout(3e4),
        headers: { Authorization: `Bearer ${token.token}`, Accept: "application/json" }
      }));
    } catch (error) {
      assertPersonalMetadataCurrent();
      throw personalNetworkFailure(error, {
        code: "personal_inventory_unavailable",
        stage: url.pathname.endsWith("/resources") ? "namespace inventory" : "Kusto inventory"
      });
    }
    await current(expected);
    if (response.status !== 200) throw fail3(
      response.status === 403 ? "personal_inventory_access_denied" : "personal_inventory_unavailable",
      `Azure resource inventory failed with HTTP ${response.status}. No retry or alternate inventory was attempted. Known source references remain usable when authorized.`
    );
    const reader = response.body?.getReader();
    if (!reader) throw fail3("personal_inventory_invalid", "Azure resource inventory returned no readable metadata.");
    const parts = [];
    let size = 0;
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024 * 1024) {
        await reader.cancel();
        throw fail3("personal_inventory_too_large", "Azure resource inventory exceeded the bounded metadata limit.");
      }
      parts.push(Buffer.from(value));
    }
    let result;
    try {
      result = JSON.parse(Buffer.concat(parts).toString("utf8"));
    } catch {
      throw fail3("personal_inventory_invalid", "Azure resource inventory returned invalid JSON, not an empty list.");
    }
    if (!Array.isArray(result.value)) throw fail3("personal_inventory_invalid", "Azure resource inventory returned an invalid resource list.");
    return result;
  }
  async function browse(input, kind) {
    const { identity, scope } = await scopeOf(input);
    const provider = kind === "namespace" ? "Microsoft.Web/connectorGateways" : "Microsoft.Kusto/clusters";
    const version = kind === "namespace" ? "2021-04-01" : "2024-04-13";
    const filter = kind === "namespace" ? `resourceType eq '${provider}'` : null;
    await authorize({
      operation: kind === "namespace" ? "browse_connector_namespaces" : "browse_kusto_clusters",
      sourceId: scope.subscriptionIds.join(","),
      description: `List ${kind === "namespace" ? "Connector Namespaces" : "Kusto clusters"} only in the explicitly selected subscriptions.`,
      mutates: false
    });
    await current(identity);
    const rows = [], seen = /* @__PURE__ */ new Set();
    let partial = false;
    for (const subscriptionId of scope.subscriptionIds) {
      const path2 = kind === "namespace" ? `/subscriptions/${subscriptionId}/resources` : `/subscriptions/${subscriptionId}/providers/${provider}`;
      let next = new URL(path2, PERSONAL_CLOUDS[scope.cloud].arm);
      next.searchParams.set("api-version", version);
      if (filter) next.searchParams.set("$filter", filter);
      for (let count = 0; next && count < 3 && rows.length < 100; count++) {
        const key = next.href;
        if (seen.has(key)) throw fail3("personal_inventory_invalid", "Azure resource inventory returned a repeating continuation.");
        seen.add(key);
        const result = await page(next, identity);
        for (const row of result.value) {
          const match = row?.id?.match(/^\/subscriptions\/([^/]+)\/resourceGroups\/([^/?#%\\]+)\/providers\/([^/]+)\/([^/]+)\/([^/?#%\\]+)$/i);
          if (!match || lower2(match[1]) !== lower2(subscriptionId) || lower2(`${match[3]}/${match[4]}`) !== lower2(provider)) {
            throw fail3("personal_inventory_invalid", "Azure resource inventory returned a resource outside the selected subscription or type.");
          }
          if (rows.length === 100) {
            partial = true;
            break;
          }
          rows.push({ ...row, resourceGroup: match[2], subscriptionId });
        }
        next = null;
        if (result.nextLink) {
          let link;
          try {
            link = new URL(result.nextLink);
          } catch {
            throw fail3("personal_inventory_invalid", "Azure resource inventory returned an invalid continuation.");
          }
          if (link.origin !== PERSONAL_CLOUDS[scope.cloud].arm || lower2(link.pathname) !== lower2(path2) || link.username || link.password || link.hash || link.searchParams.getAll("api-version").length !== 1 || link.searchParams.get("api-version") !== version || filter && (link.searchParams.getAll("$filter").length !== 1 || link.searchParams.get("$filter") !== filter)) {
            throw fail3("personal_inventory_invalid", "Azure resource inventory returned an untrusted or out-of-scope continuation.");
          }
          next = link;
        }
      }
      if (next) partial = true;
      if (rows.length >= 100) {
        partial ||= lower2(subscriptionId) !== lower2(scope.subscriptionIds.at(-1));
        break;
      }
    }
    await current(identity);
    inventory.resolve(input.scope);
    rows.sort((a, b) => String(a.name).localeCompare(String(b.name)) || a.id.localeCompare(b.id));
    if (kind === "namespace") {
      saveScope(identity, scope);
      return {
        namespaces: rows.map((row) => ({
          id: row.id,
          name: String(row.name || "").slice(0, 160),
          resourceGroup: row.resourceGroup,
          subscriptionLabel: scope.subscriptions.find((subscription) => lower2(subscription.id) === lower2(row.subscriptionId))?.name || ""
        })),
        scope,
        partial,
        message: `${rows.length} namespace${rows.length === 1 ? "" : "s"}${partial ? " in this bounded list; more may be available" : ""}.`
      };
    }
    const clusters = [];
    let rejected = 0;
    for (const row of rows) {
      let url;
      try {
        url = new URL(row.properties?.uri);
      } catch {
        rejected++;
        continue;
      }
      const suffix = PERSONAL_CLOUDS[scope.cloud].kustoSuffix;
      if (!/^https:\/\/[a-z0-9.-]+\/?$/i.test(row.properties?.uri || "") || url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.port || url.pathname !== "/" || !/^[a-z0-9.-]+$/i.test(url.hostname) || !url.hostname.endsWith(suffix) || url.hostname.length <= suffix.length) {
        rejected++;
        continue;
      }
      clusters.push({ id: row.id, name: String(row.name || "").slice(0, 160), clusterUrl: url.origin });
    }
    return {
      clusters,
      scope,
      rejected,
      partial: partial || rejected > 0,
      message: `${clusters.length} cluster${clusters.length === 1 ? "" : "s"}${partial ? " in this bounded list" : ""}.${rejected ? ` ${rejected} unsafe or wrong-cloud endpoints were omitted for ${scope.cloud}; this is not a complete empty inventory.` : ""}`
    };
  }
  return {
    async subscriptions({ refresh = false } = {}) {
      const identity = await current(), binding = callerBinding(identity);
      const refreshed = refresh || binding !== profileBinding || clock() - profilesLoadedAt >= 3e4;
      const snapshot = await inventory.refresh(refreshed);
      await current(identity);
      profileBinding = binding;
      if (refreshed) profilesLoadedAt = clock();
      return {
        ...snapshot,
        accounts: snapshot.accounts.map((account) => {
          const sameCaller = lower2(account.tenantId) === lower2(identity.tenantId) && account.cloud === identity.cloud && lower2(account.accountName) === lower2(identity.accountId);
          return {
            ...account,
            disabled: account.disabled || !sameCaller,
            disabledReason: account.disabledReason || (!sameCaller ? "This profile is not the signed-in Azure caller and tenant." : "")
          };
        }),
        identity: { tenantId: identity.tenantId, cloud: identity.cloud, accountId: identity.accountId, callerBinding: callerBinding(identity) },
        selection: selection(identity)
      };
    },
    rememberNamespace(namespaceId, identity) {
      const previous = selection(identity);
      const scope = previous?.scope && previous.scope.subscriptionIds.some((id) => lower2(id) === lower2(namespaceId.split("/")[2])) ? previous.scope : null;
      selectionStore.save({ callerBinding: callerBinding(identity), scope, namespaceId });
    },
    browseNamespaces: (input) => browse(input, "namespace"),
    browseKustoClusters: (input) => browse(input, "kusto")
  };
}

// canvases/azure-sre-agent/src/personal-connector-registration.mjs
init_personal_source_catalog();
var identityKey3 = (identity) => JSON.stringify(["tenantId", "cloud", "objectId"].map((key) => identity?.[key]?.toLowerCase()));
function createPersonalConnectorRegistration({ definitions, diagnostics, m365, identityProvider }) {
  const attempts = /* @__PURE__ */ new Map();
  const registration = {
    async confirm(input) {
      const added = await registration.add(input, { existingOnly: true });
      const service = ["inbox", "teams"].includes(added.kind) ? m365 : diagnostics;
      const personalSource = await service.checkForChat({
        sourceId: added.personalSource.sourceId || added.personalSource.id,
        expectedRevision: added.personalSource.revision
      });
      attempts.get(input.draftId).source = personalSource;
      return {
        ...added,
        personalSource,
        active: personalSource.active,
        ready: false,
        connectionAvailable: personalSource.connectionAvailable === true,
        targetValidated: false,
        message: personalSource.connectionAvailable ? "Available in this chat. Content access is checked when you approve an operation." : personalSource.recovery || "This connection needs attention before it is available in this chat."
      };
    },
    async add(input, { existingOnly = false } = {}) {
      if (input.approval !== true) throw personalError("definition_approval_required", "Approve this exact connector review before adding it.");
      const identity = identityKey3(await identityProvider());
      let attempt = attempts.get(input.draftId);
      if (attempt && (attempt.identity !== identity || attempt.revision !== input.expectedRevision)) {
        throw personalError("stale_registration", "This setup belongs to a different caller or review revision.");
      }
      if (attempt?.running) throw personalError("registration_pending", "This exact setup is already being added. Do not create it again.");
      if (!attempt) {
        attempt = { identity, revision: input.expectedRevision, running: false };
        attempts.set(input.draftId, attempt);
      }
      attempt.running = true;
      try {
        if (!attempt.created) {
          const review = definitions.getRegistrationReview(input);
          if (review.sourceId) {
            await (["inbox", "teams"].includes(review.kind) ? m365 : diagnostics).validateRegistration(review);
          }
        }
        attempt.created ||= await (existingOnly ? definitions.addExistingConnector(input) : definitions.saveConnector(input));
        if (identity !== identityKey3(await identityProvider())) throw personalError("stale_registration", "The caller changed after saving. The connection is retained; nothing was activated.");
        if (!attempt.source) {
          const created = attempt.created;
          if (["inbox", "teams"].includes(created.kind)) {
            attempt.source = await m365.registerConnector({
              kind: created.kind,
              namespaceId: created.namespaceId,
              connectionId: created.connectionId,
              url: created.fields.url,
              name: created.fields.displayName,
              sourceId: created.fields.sourceId,
              expectedRevision: created.fields.expectedSourceRevision
            });
          } else if (created.source) {
            attempt.source = await diagnostics.registerConnector({
              source: created.source,
              cloudConnection: created.cloudConnection,
              sourceId: created.fields.sourceId,
              expectedRevision: created.fields.expectedSourceRevision
            });
          } else {
            throw personalError("source_target_required", "The connection was retained. Choose its exact diagnostic target before adding it to this chat.");
          }
        }
        return {
          ...attempt.created,
          personalSource: attempt.source,
          registrationPending: false,
          ready: false,
          active: false,
          targetValidated: false,
          message: "Added to this chat. Test the configured target, then choose Use. Nothing was queried, posted or activated."
        };
      } catch (error) {
        if (attempt.created) {
          error.connectionRetained = true;
          error.connectionId = attempt.created.connectionId;
          error.registrationError = sanitizePersonalError(error);
        } else attempts.delete(input.draftId);
        throw error;
      } finally {
        attempt.running = false;
      }
    }
  };
  return Object.freeze(registration);
}

// canvases/azure-sre-agent/src/personal-runtime.mjs
import { createPersonalDiagnosticsTransport as createPersonalDiagnosticsTransport2 } from "./diagnostics-transport.mjs";
import { createPersonalM365Transport as createPersonalM365Transport2 } from "./m365-transport.mjs";
var personalUiInvocation = new AsyncLocalStorage2();
var UI_METADATA_OPERATIONS = /* @__PURE__ */ new Map([
  ["browse_personal_namespaces", "browse_connector_namespaces"],
  ["browse_personal_kusto_clusters", "browse_kusto_clusters"],
  ["find_personal_tools", "discover_connector_definitions"],
  ["prepare_personal_namespace", "review_connector_namespace"],
  ["prepare_personal_connector", "review_connector_definition"],
  ["add_personal_connector", "save_connector_definition"],
  ["confirm_personal_connector", ["save_connector_definition", "check_personal_connection", "load_personal_connection"]],
  ["use_personal_connection", ["check_personal_connection", "load_personal_connection"]]
]);
function withPersonalUiMetadataAction(action, handler, options) {
  return personalUiInvocation.run(
    UI_METADATA_OPERATIONS.get(action) || null,
    () => withPersonalMetadataLease(action, handler, options)
  );
}
var ARM_AUDIENCES = /* @__PURE__ */ new Set(["https://management.azure.com", "https://management.core.windows.net"]);
var audienceOrigin = (value) => String(value || "").replace(/\/$/, "");
var sameAudience = (actual, expected) => audienceOrigin(actual) === audienceOrigin(expected) || ARM_AUDIENCES.has(audienceOrigin(actual)) && ARM_AUDIENCES.has(audienceOrigin(expected));
async function readPersonalIdentity(run = runAzureCliJson) {
  return personalMetadataIdentity(run, () => readPersonalIdentityNow(run));
}
async function readPersonalIdentityNow(run) {
  const account = await personalMetadataCli(run, ["account", "show", "-o", "json"]);
  const cloud = account?.environmentName || account?.cloudName || account?.cloud;
  if (cloud !== "AzureCloud" || !account.tenantId || account.user?.type?.toLowerCase() !== "user" || !account.user.name) {
    throw new Error("Personal tools require an explicitly signed-in AzureCloud user. Choose the intended account in your terminal; this canvas does not sign in automatically.");
  }
  const credential = await personalMetadataCli(run, [
    "account",
    "get-access-token",
    "--resource",
    "https://management.azure.com/",
    "--tenant",
    account.tenantId,
    "-o",
    "json"
  ]);
  let claims;
  try {
    claims = JSON.parse(Buffer.from(credential?.accessToken?.split(".")[1] || "", "base64url").toString());
  } catch {
    throw new Error("The Azure CLI user token could not be verified. Personal tools were not activated.");
  }
  if (!claims.oid || claims.tid?.toLowerCase() !== account.tenantId.toLowerCase() || !ARM_AUDIENCES.has(audienceOrigin(claims.aud)) || !Number.isFinite(claims.exp) || claims.exp * 1e3 <= Date.now() + 6e4 || claims.idtyp === "app") {
    throw new Error("The immutable signed-in user token did not match the chosen tenant and Azure service. Personal tools were not activated.");
  }
  const after = await personalMetadataCli(run, ["account", "show", "-o", "json"]);
  if (after.tenantId !== account.tenantId || after.user?.name !== account.user.name || (after.environmentName || after.cloudName || after.cloud) !== cloud || after.user?.type?.toLowerCase() !== "user") {
    throw new Error("The signed-in Azure account changed while checking personal identity. Retry under the intended account.");
  }
  const identity = {
    tenantId: account.tenantId.toLowerCase(),
    cloud,
    objectId: claims.oid.toLowerCase(),
    accountId: account.user.name.toLowerCase(),
    displayName: account.user.displayName || account.user.name
  };
  rememberPersonalMetadataToken(run, identity, credential.accessToken, claims.exp * 1e3);
  return identity;
}
function personalIdentityFingerprint(identity) {
  return createHash7("sha256").update(JSON.stringify([identity.cloud, identity.tenantId, identity.objectId, identity.accountId])).digest("hex");
}
function createPersonalCredentialProvider({ identityProvider, run = runAzureCliJson }) {
  return async (expected) => {
    const identity = await identityProvider();
    if (identity.tenantId !== expected.tenantId || identity.cloud !== expected.cloud || identity.objectId !== expected.objectId || identity.accountId !== expected.accountId) throw new Error("The personal source's account, tenant or cloud changed. Activate it again under the intended user.");
    const audiences = /* @__PURE__ */ new Set([
      "https://management.azure.com/",
      "https://management.azure.com",
      "https://management.core.windows.net",
      "https://kusto.kustomfa.windows.net",
      "https://apihub.azure.com",
      "https://api.loganalytics.io",
      "https://api.loganalytics.azure.com",
      "https://graph.microsoft.com"
    ]);
    const safeAudience = (audience2) => {
      let url;
      try {
        url = new URL(audience2);
      } catch {
        throw new Error("The source requested an invalid token audience.");
      }
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash || url.port || url.pathname !== "/" && url.pathname !== "" || !audiences.has(url.origin) && !audiences.has(url.origin + "/") && !/^[a-z0-9.-]+\.kusto\.windows\.net$/i.test(url.hostname)) {
        throw new Error("This token audience is not an approved personal diagnostics or M365 service.");
      }
      return url.origin + (audience2.endsWith("/") ? "/" : "");
    };
    const audience = safeAudience(expected.audience);
    return {
      async getToken(scopes) {
        const values = Array.isArray(scopes) ? scopes : [scopes];
        if (values.length !== 1 || !sameAudience(values[0].replace(/\/\.default$/, ""), audience)) {
          throw new Error("The SDK requested a different service audience. No token was returned.");
        }
        const current = await identityProvider();
        if (personalIdentityFingerprint(current) !== personalIdentityFingerprint(identity)) throw new Error("The signed-in user changed before this source call.");
        const cached = ARM_AUDIENCES.has(audienceOrigin(audience)) && personalMetadataArmToken(run, identity);
        if (cached) return cached;
        const token = await personalMetadataCli(run, ["account", "get-access-token", "--tenant", identity.tenantId, "--resource", audience, "-o", "json"]);
        let claims;
        try {
          claims = JSON.parse(Buffer.from(token.accessToken.split(".")[1], "base64url").toString("utf8"));
        } catch {
          throw new Error("The CLI returned an unverifiable personal access token.");
        }
        if (claims.tid?.toLowerCase() !== identity.tenantId || claims.oid?.toLowerCase() !== identity.objectId || !sameAudience(claims.aud, audience) || claims.idtyp === "app" || personalIdentityFingerprint(await identityProvider()) !== personalIdentityFingerprint(identity)) {
          throw new Error("The token does not match the approved user, tenant and service. No source request was made.");
        }
        const expiresOnTimestamp = Number(token.expires_on || claims.exp) * 1e3;
        if (!Number.isFinite(expiresOnTimestamp) || expiresOnTimestamp <= Date.now()) throw new Error("The personal access token is expired. Refresh your intended sign-in in the terminal.");
        return { token: token.accessToken, expiresOnTimestamp };
      }
    };
  };
}
function createPersonalAuthorization(getSession) {
  return async ({ operation, sourceId, description, mutates }) => {
    const allowedOperation = personalUiInvocation.getStore();
    if (mutates === false && (typeof allowedOperation === "string" ? allowedOperation === operation : Array.isArray(allowedOperation) && allowedOperation.includes(operation))) return;
    const session = getSession();
    if (!session?.capabilities?.ui?.elicitation || typeof session.ui?.elicitation !== "function") {
      throw Object.assign(new Error("This host cannot request the required personal-source approval. The requested operation was not run; no global permission setting was changed."), { code: "personal_approval_unavailable" });
    }
    let response;
    try {
      response = await session.ui.elicitation({
        message: `${mutates ? "Approve this write once" : "Allow this bounded personal read"}: ${description}
Source: ${sourceId || "selected personal source"}
Operation: ${operation}`,
        requestedSchema: { type: "object", properties: { confirmed: { type: "boolean", title: "Allow this operation", default: true } }, required: ["confirmed"] }
      });
    } catch {
      throw Object.assign(new Error("The host could not deliver the approval request. Nothing ran; your source and draft are kept."), { code: "personal_approval_unavailable" });
    }
    if (response?.action === "accept" && response.content?.confirmed === true) return;
    const code = response?.action === "cancel" ? "personal_approval_cancelled" : response?.action === "decline" || response?.action === "accept" && response.content?.confirmed === false ? "personal_approval_declined" : "personal_approval_invalid";
    const message = code === "personal_approval_cancelled" ? "The host cancelled this approval." : code === "personal_approval_declined" ? "This operation was declined." : "The host returned no valid approval.";
    const guidance = code === "personal_approval_cancelled" && mutates === true ? " If this chat is in Autopilot, switch to Interactive to review approvals." : "";
    throw Object.assign(new Error(`${message} Nothing ran; your source and draft are kept.${guidance}`), { code });
  };
}
async function createPersonalRuntime({
  conversationId,
  identityProvider,
  credentialProvider,
  authorize,
  diagnosticsFactory,
  m365Factory,
  ...dependencies
}) {
  const diagnosticsModule = diagnosticsFactory ? null : await Promise.resolve().then(() => (init_personal_diagnostics(), personal_diagnostics_exports));
  const m365Module = m365Factory ? null : await Promise.resolve().then(() => (init_personal_m365(), personal_m365_exports));
  const lifecycle = dependencies.lifecycle || createPersonalConnectionLifecycle({
    conversationId,
    identityProvider,
    credentialProvider,
    authorize,
    ...dependencies.connection
  });
  const resourcePicker = createPersonalResourcePicker({
    conversationId,
    identityProvider,
    credentialProvider,
    authorize,
    ...dependencies.connection?.fetchImpl ? { fetchImpl: dependencies.connection.fetchImpl } : {},
    ...dependencies.resourcePicker
  });
  const verifyCloudConnection = ({ namespaceId, connectionId, identity, connection, discoverySnapshot }) => {
    const prefix = `${namespaceId}/connections/`;
    const leaf2 = connectionId.toLowerCase().startsWith(prefix.toLowerCase()) ? connectionId.slice(prefix.length) : connectionId;
    return lifecycle.verifyConnection({
      namespaceId,
      connectionId: leaf2,
      identity,
      ...discoverySnapshot ? { metadata: connection } : {}
    });
  };
  const { createPersonalConnectorDefinitions: createPersonalConnectorDefinitions2 } = await Promise.resolve().then(() => (init_personal_connector_definitions(), personal_connector_definitions_exports));
  const definitions = createPersonalConnectorDefinitions2({
    identityProvider,
    authorize,
    verifyConnection: verifyCloudConnection,
    request: (resource, method, body) => {
      const url = new URL(resource, "https://management.azure.com");
      if (url.origin !== "https://management.azure.com" || url.username || url.password || url.hash || url.searchParams.get("api-version") !== "2026-05-01-preview" || [...url.searchParams.keys()].some((name) => !["api-version", "export"].includes(name))) {
        throw new Error("The reviewed connector definition requested an unsupported management route.");
      }
      return lifecycle.request(method, url.pathname, body, {
        allowMissing: method === "GET",
        acceptPending: method === "PUT",
        query: url.searchParams.has("export") ? { export: url.searchParams.get("export") } : {}
      });
    },
    ...dependencies.definitions
  });
  const catalogModule = diagnosticsFactory || dependencies.diagnostics?.catalog ? null : await Promise.resolve().then(() => (init_personal_source_catalog(), personal_source_catalog_exports));
  const catalog = dependencies.diagnostics?.catalog || catalogModule?.createPersonalSourceCatalog({
    credentialProvider,
    authorize,
    verifyConnection: verifyCloudConnection,
    ...dependencies.connection?.fetchImpl ? { fetchImpl: dependencies.connection.fetchImpl } : {}
  });
  const diagnostics = (diagnosticsFactory || diagnosticsModule.createPersonalDiagnosticsService)({
    conversationId,
    identityProvider,
    credentialProvider,
    authorize,
    catalog,
    verifyConnection: verifyCloudConnection,
    ...dependencies.diagnostics
  });
  const m365 = (m365Factory || m365Module.createPersonalM365Service)({
    conversationId,
    identityProvider,
    credentialProvider,
    authorize,
    allowWrites: true,
    loadConnection: lifecycle.loadConnection,
    ...dependencies.m365
  });
  const registration = createPersonalConnectorRegistration({ definitions, diagnostics, m365, identityProvider });
  let candidates = null, candidateIdentity = null, discoveryGeneration = 0;
  const runtime = {
    diagnostics,
    m365,
    lifecycle,
    definitions,
    resourcePicker,
    registration,
    identityProvider,
    async discoverConnections(input) {
      const generation = ++discoveryGeneration, identity = await identityProvider();
      candidates = { namespaceId: input.namespaceId, connections: [] };
      candidateIdentity = personalIdentityFingerprint(identity);
      const listed = await definitions.listConnections(input);
      const currentIdentity = await identityProvider();
      if (generation !== discoveryGeneration || personalIdentityFingerprint(identity) !== personalIdentityFingerprint(currentIdentity)) {
        throw new Error("The namespace or Azure caller changed while listing connectors. Select the intended namespace again.");
      }
      resourcePicker.rememberNamespace(input.namespaceId, currentIdentity);
      candidates = listed;
      candidateIdentity = personalIdentityFingerprint(identity);
      return listed;
    },
    async getContext() {
      const context = await diagnostics.getContext();
      if (candidates && candidateIdentity !== personalIdentityFingerprint(await identityProvider())) {
        candidates = null;
        candidateIdentity = null;
        discoveryGeneration++;
      }
      return { diagnostics: { ...context, ...candidates ? { connections: candidates.connections.map((connection) => ({
        ...connection,
        namespaceId: candidates.namespaceId
      })) } : {} }, m365: await m365.getContext() };
    }
  };
  if (dependencies.evidence) {
    runtime.evidence = createEvidenceStore({
      conversationId,
      identityProvider,
      authorize,
      connection: dependencies.evidence.connection,
      revalidateRecipient: dependencies.evidence.revalidateRecipient,
      send: dependencies.evidence.send,
      revalidateRun: (runId) => diagnostics.getRun({ runId })
    });
  }
  return runtime;
}
function evidenceCell(value) {
  const text3 = typeof value === "string" ? value : JSON.stringify(value);
  return String(text3 ?? "").slice(0, 200).replace(/\b(?:Bearer|Basic)\s+[^\s]+/gi, "[credential removed]").replace(/https?:\/\/[^\s<>"']+/gi, "[link removed]").replace(/\b[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\b/gi, "[identifier removed]").replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[account removed]").replace(/(?:password|secret|token|api[-_ ]?key)\s*[:=]\s*[^\s,;]+/gi, "[credential removed]");
}
function createEvidenceStore({ conversationId, connection, identityProvider, revalidateRecipient, revalidateRun, send, authorize }) {
  if (typeof revalidateRun !== "function") throw new Error("Evidence sharing requires live personal-run currency checks.");
  const previews = /* @__PURE__ */ new Map();
  return {
    async preview(run) {
      if (!run?.runId || !run.query) throw new Error("Run an approved personal query before preparing evidence.");
      if (run.current === false || run.stale === true) throw new Error("This result belongs to an earlier query/source revision. Run the current reviewed draft before sharing evidence.");
      const identity = await identityProvider();
      if (!run.identity || personalIdentityFingerprint(run.identity) !== personalIdentityFingerprint(identity)) {
        throw new Error("The result's executing account, tenant or cloud is no longer the current personal identity. A fresh run and preview are required.");
      }
      const current = connection();
      if (!current?.target) throw new Error("Connect the exact SRE investigation in this Copilot conversation first.");
      if ([...previews.values()].some((value) => value.runId === run.runId && value.status === "unknown" && value.recipient.threadId === current.target.threadId && value.recipient.agentKey === current.target.agentKey)) {
        throw new Error("Earlier evidence delivery is unknown. Check the exact investigation; the same evidence cannot be blindly resent.");
      }
      const origin = run.origin;
      if (origin && (origin.agentKey !== current.target.agentKey || origin.threadId !== current.target.threadId)) {
        throw new Error("This query came from another investigation. Explicitly switch the Copilot connection to that origin before sharing its evidence.");
      }
      const body = [
        "Reviewed personal diagnostic evidence. Source permissions were not granted to SRE.",
        `Run: ${run.runId}. Query revision: ${run.revision}.`,
        `Query fingerprint: ${createHash7("sha256").update(run.query).digest("hex")}.`,
        `UTC: ${run.startedAt || "not supplied"}. Source: ${evidenceCell(run.source?.name || run.source?.kind || "personal source")}.`,
        `Database/workspace: ${evidenceCell(run.source?.database || run.source?.workspaceId || "not reported")}.`,
        `UTC window: ${evidenceCell(run.timeRange?.start || "not reported")} to ${evidenceCell(run.timeRange?.end || "not reported")}.`,
        `Partial: ${Boolean(run.partial)}. Truncated: ${Boolean(run.truncated)}. Included rows: ${Math.min(run.rows?.length || 0, 10)}.`,
        "Columns: " + (run.columns || []).slice(0, 8).map((value) => evidenceCell(typeof value === "string" ? value : value.name)).join(" | "),
        ...(run.rows || []).slice(0, 10).map((row) => (Array.isArray(row) ? row : Object.values(row)).slice(0, 8).map(evidenceCell).join(" | ")),
        ...(run.limitations || []).slice(0, 4).map(evidenceCell)
      ].join("\n").slice(0, 6e3);
      const preview = {
        previewId: randomUUID7(),
        revision: 1,
        conversationId,
        runId: run.runId,
        body,
        recipient: structuredClone(current.target),
        connectionRevision: current.revision,
        identity: personalIdentityFingerprint(identity),
        status: "preview",
        createdAt: Date.now()
      };
      previews.set(preview.previewId, preview);
      return { previewId: preview.previewId, revision: preview.revision, recipient: {
        agentKey: preview.recipient.agentKey,
        threadId: preview.recipient.threadId,
        threadLabel: preview.recipient.threadLabel
      }, body };
    },
    async share({ previewId, expectedRevision, approval }) {
      const preview = previews.get(previewId);
      if (!preview || preview.status !== "preview" || preview.revision !== expectedRevision || approval !== true) {
        throw new Error("Review and approve a fresh evidence preview. Repeated sends are blocked.");
      }
      preview.status = "validating";
      let sent = false;
      try {
        const check = async () => {
          const run = await revalidateRun(preview.runId);
          if (!run || run.current === false || run.stale === true || !run.identity || personalIdentityFingerprint(run.identity) !== preview.identity) {
            throw new Error("The personal result is no longer current. A fresh run and evidence preview are required.");
          }
          const current = connection();
          if (current.revision !== preview.connectionRevision || current.target?.agentKey !== preview.recipient.agentKey || current.target?.threadId !== preview.recipient.threadId || preview.identity !== personalIdentityFingerprint(await identityProvider())) {
            throw new Error("The account or connected investigation changed. Prepare a new preview; nothing was sent.");
          }
        };
        await check();
        await revalidateRecipient(preview.recipient);
        await authorize({ operation: "share_evidence", sourceId: preview.runId, description: `Send exactly this redacted evidence to ${preview.recipient.threadLabel}:
${preview.body}`, mutates: true });
        await check();
        await revalidateRecipient(preview.recipient);
        await check();
        preview.status = "sending";
        await send(preview.recipient, preview.body);
        sent = true;
        preview.status = "sent";
        return { delivered: true, threadId: preview.recipient.threadId, message: `Approved evidence sent to ${preview.recipient.threadLabel}. No datasource access was granted.` };
      } catch (error) {
        const unknown = preview.status === "sending" && !sent;
        preview.status = unknown ? "unknown" : "invalid";
        throw new Error(unknown ? "Evidence delivery unknown. Check the exact investigation before preparing another send. No automatic retry was attempted." : error.message, { cause: error });
      }
    }
  };
}
export {
  createEvidenceStore,
  createPersonalAuthorization,
  createPersonalCredentialProvider,
  createPersonalDiagnosticsTransport2 as createPersonalDiagnosticsTransport,
  createPersonalM365Transport2 as createPersonalM365Transport,
  createPersonalRuntime,
  personalIdentityFingerprint,
  readPersonalIdentity,
  evidenceCell as redactPersonalDataCell,
  withPersonalUiMetadataAction
};
