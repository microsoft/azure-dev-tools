import { createRequire as __canvasCreateRequire } from "node:module";
const require = __canvasCreateRequire(import.meta.url);

// node_modules/@azure/connectors/dist/esm/azureConnectors/options.js
var DefaultConnectorClientOptions = {
  baseUri: "",
  maxRetryAttempts: 3,
  timeoutMs: 3e4,
  useExponentialBackoff: true,
  initialRetryDelayMs: 500
};

// node_modules/@azure/connectors/dist/esm/azureConnectors/connectorHttpClient.js
var ConnectorHttpClient = class _ConnectorHttpClient {
  static ApiHubScopes = ["https://apihub.azure.com/.default"];
  tokenProvider;
  options;
  /**
   * Initializes a ConnectorHttpClient.
   * @param tokenProvider The token provider for authentication.
   * @param options The client options.
   */
  constructor(tokenProvider, options) {
    this.tokenProvider = tokenProvider;
    this.options = {
      ...DefaultConnectorClientOptions,
      ...options
    };
  }
  /**
   * Sends an HTTP request with authentication and retry.
   * @param method The HTTP method.
   * @param url The request URL.
   * @param scopes The authentication scopes. Defaults to API Hub scopes.
   * @param body Optional request body (will be JSON-serialized).
   * @param abortSignal Optional abort signal for caller-initiated cancellation.
   */
  async sendAsync(method, url, scopes, body, abortSignal) {
    const effectiveScopes = scopes ?? _ConnectorHttpClient.ApiHubScopes;
    const token = await this.tokenProvider.getAccessTokenAsync(effectiveScopes);
    const headers = {
      "Authorization": `Bearer ${token}`
    };
    const init = { method, headers };
    if (body !== void 0) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
    return this.sendWithRetry(url, init, 0, abortSignal);
  }
  /**
   * Sends request with retry logic.
   */
  async sendWithRetry(url, init, attempt, callerSignal) {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), this.options.timeoutMs);
    const onCallerAbort = () => abortController.abort();
    if (callerSignal) {
      if (callerSignal.aborted) {
        abortController.abort();
      } else {
        callerSignal.addEventListener("abort", onCallerAbort, { once: true });
      }
    }
    try {
      const response = await fetch(url, { ...init, signal: abortController.signal });
      const text = await response.text();
      const responseHeaders = {};
      response.headers.forEach((headerValue, headerKey) => {
        responseHeaders[headerKey] = headerValue;
      });
      let value;
      if (text) {
        try {
          value = JSON.parse(text);
        } catch {
          value = void 0;
        }
      }
      return {
        statusCode: response.status,
        headers: responseHeaders,
        value,
        text,
        isSuccessStatusCode: response.ok
      };
    } catch (error) {
      if (error instanceof TypeError || error instanceof SyntaxError) {
        throw error;
      }
      if (attempt < this.options.maxRetryAttempts - 1) {
        const delay = this.options.useExponentialBackoff ? this.options.initialRetryDelayMs * Math.pow(2, attempt) : this.options.initialRetryDelayMs;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.sendWithRetry(url, init, attempt + 1, callerSignal);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      if (callerSignal) {
        callerSignal.removeEventListener("abort", onCallerAbort);
      }
    }
  }
};

// node_modules/@azure/connectors/dist/esm/azureConnectors/clientBase.js
var ConnectorClientBase = class {
  connectionRuntimeUrl;
  httpClient;
  options;
  /**
   * Initializes a ConnectorClientBase.
   * @param connectionRuntimeUrl The connection runtime URL from Azure Portal.
   * @param tokenProvider The token provider for authentication.
   * @param options Optional connector client options.
   */
  constructor(connectionRuntimeUrl, tokenProvider, options) {
    if (!connectionRuntimeUrl && connectionRuntimeUrl !== "") {
      throw new Error("Parameter 'connectionRuntimeUrl' cannot be null or undefined.");
    }
    if (!tokenProvider) {
      throw new Error("tokenProvider cannot be null or undefined.");
    }
    this.connectionRuntimeUrl = connectionRuntimeUrl.replace(/\/+$/, "");
    this.options = options ?? {};
    this.httpClient = new ConnectorHttpClient(tokenProvider, this.options);
  }
  /**
   * Resolves a relative path or validates an absolute URL against the connection runtime URL.
   * When the URL host matches the connection URL, it is used as-is.
   * When it does not match (codeless connectors like ARM return nextLink pointing to the backend
   * host e.g. management.azure.com), the path+query is extracted and routed through the APIM proxy.
   * @param path The relative path or absolute URL to resolve.
   */
  resolveUrl(path) {
    let parsedUrl;
    try {
      parsedUrl = new URL(path);
    } catch {
      parsedUrl = void 0;
    }
    if (parsedUrl !== void 0) {
      if (!this.connectionRuntimeUrl) {
        throw new Error("Cannot validate absolute NextLink URL because no connection runtime URL was configured.");
      }
      const baseUrl = new URL(this.connectionRuntimeUrl);
      if (parsedUrl.hostname.toLowerCase() === baseUrl.hostname.toLowerCase()) {
        if (parsedUrl.protocol.toLowerCase() === baseUrl.protocol.toLowerCase() && parsedUrl.port === baseUrl.port) {
          return path;
        }
        throw new Error(`NextLink URI '${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}' has the same host as the connection but uses a different scheme or port than '${baseUrl.protocol}//${baseUrl.hostname}:${baseUrl.port}'. Refusing to send credentials to a potentially insecure endpoint.`);
      }
      return `${this.connectionRuntimeUrl}${parsedUrl.pathname}${parsedUrl.search}`;
    }
    if (!this.connectionRuntimeUrl) {
      throw new Error("Cannot resolve relative path because no connection runtime URL was configured.");
    }
    return `${this.connectionRuntimeUrl}${path}`;
  }
};

// node_modules/@azure/connectors/dist/esm/azureConnectors/connectorException.js
var ConnectorException = class _ConnectorException extends Error {
  static MaxResponseBodyLength = 2e3;
  connectorName;
  operation;
  statusCode;
  responseBody;
  /**
   * Initializes a ConnectorException.
   * @param connectorName The connector name (e.g., "office365").
   * @param operation The operation that failed (e.g., "GET /v2/Mail").
   * @param statusCode The HTTP status code.
   * @param responseBody The response body from the failed request.
   */
  constructor(connectorName, operation, statusCode, responseBody) {
    const truncated = _ConnectorException.truncateBody(responseBody);
    super(`[${connectorName}] ${operation} failed with status ${statusCode}: ${truncated}`);
    this.name = "ConnectorException";
    this.connectorName = connectorName;
    this.operation = operation;
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
  static truncateBody(body) {
    if (!body || body.length <= _ConnectorException.MaxResponseBodyLength) {
      return body;
    }
    return body.substring(0, _ConnectorException.MaxResponseBodyLength) + "...[truncated]";
  }
};

// node_modules/@azure/connectors/dist/esm/generated/KustoExtensions.js
var KustoClient = class extends ConnectorClientBase {
  /**
   * Creates a new KustoClient.
   * @param connectionRuntimeUrl The connection runtime URL from Azure Portal.
   * @param tokenProvider The token provider for authentication.
   * @param options Optional connector client options.
   */
  constructor(connectionRuntimeUrl, tokenProvider, options) {
    super(connectionRuntimeUrl, tokenProvider, options);
  }
  get connectorName() {
    return "kusto";
  }
  /**
   * Run KQL query
   * @remarks Runs the KQL query and returns the result as a set of rows which can be iterated over in the following connectors e.g TableName | take 10.
   */
  async listKustoResultsAsync(input, abortSignal) {
    const requestPath = `/ListKustoResults/false`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Run show control command
   * @remarks Runs the show control command and returns the result as a set of rows which can be iterated over in the following connectors e.g .show table TableName policy caching.
   */
  async listKustoShowCommandResultsAsync(input, abortSignal) {
    const requestPath = `/ListKustoShowCommandResults`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Run async control command
   * @remarks Runs control command in async mode and returns its ID, state and status on completion. Command can run for maximum 1 hour. The 'async' keyword is mandatory e.g .set-or-append async TargetTable <| SourceTable.
   */
  async runAsyncControlCommandAndWaitAsync(input, abortSignal) {
    const requestPath = `/RunAsyncControlCommandAndWait`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Run KQL query and render a chart
   * @remarks Runs the KQL query and returns result as a chart of your choice e.g TableName | where Timestamp > ago(1h) | project timestamp, value.
   */
  async runKustoQueryAndVisualizeResultsAsync(input, abortSignal) {
    const requestPath = `/RunKustoAndVisualizeResults/false`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Run control command and render a chart
   * @remarks Runs the control command and returns the result as a chart of your choice e.g .clear table TableName data.
   */
  async runKustoCommandAndVisualizeResultsAsync(input, abortSignal) {
    const requestPath = `/RunKustoAndVisualizeResults/true`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Kusto Query MCP Server
   * @remarks This MCP server runs Kusto queries and manages the results.
   */
  async mcpKustoQueryManagementAsync(input, sessionId, abortSignal) {
    const queryParams = [];
    if (sessionId !== void 0) {
      queryParams.push(`sessionId=${encodeURIComponent(String(sessionId))}`);
    }
    const requestPath = `/mcp/KustoQueryManagement` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
};

// node_modules/@azure/connectors/dist/esm/generated/AzuremonitorlogsExtensions.js
var AzuremonitorlogsClient = class extends ConnectorClientBase {
  /**
   * Creates a new AzuremonitorlogsClient.
   * @param connectionRuntimeUrl The connection runtime URL from Azure Portal.
   * @param tokenProvider The token provider for authentication.
   * @param options Optional connector client options.
   */
  constructor(connectionRuntimeUrl, tokenProvider, options) {
    super(connectionRuntimeUrl, tokenProvider, options);
  }
  get connectorName() {
    return "azuremonitorlogs";
  }
  /**
   * Run query and list results V2
   * @remarks Returns each row as its own object. Use this action when you want to work with each row separately in the rest of the workflow.
   */
  async queryDataAsync(input, subscriptions, resourcegroups, resourcetype, resourcename, abortSignal) {
    const queryParams = [];
    if (subscriptions !== void 0) {
      queryParams.push(`subscriptions=${encodeURIComponent(String(subscriptions))}`);
    }
    if (resourcegroups !== void 0) {
      queryParams.push(`resourcegroups=${encodeURIComponent(String(resourcegroups))}`);
    }
    if (resourcetype !== void 0) {
      queryParams.push(`resourcetype=${encodeURIComponent(String(resourcetype))}`);
    }
    if (resourcename !== void 0) {
      queryParams.push(`resourcename=${encodeURIComponent(String(resourcename))}`);
    }
    const requestPath = `/queryDataV2` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Run query and visualize results V2
   * @remarks Returns all rows in the result set as a single formatted object. Use this action when you want to use the result set together in the rest of the workflow.
   */
  async visualizeQueryAsync(input, subscriptions, resourcegroups, resourcetype, resourcename, visType, abortSignal) {
    const queryParams = [];
    if (subscriptions !== void 0) {
      queryParams.push(`subscriptions=${encodeURIComponent(String(subscriptions))}`);
    }
    if (resourcegroups !== void 0) {
      queryParams.push(`resourcegroups=${encodeURIComponent(String(resourcegroups))}`);
    }
    if (resourcetype !== void 0) {
      queryParams.push(`resourcetype=${encodeURIComponent(String(resourcetype))}`);
    }
    if (resourcename !== void 0) {
      queryParams.push(`resourcename=${encodeURIComponent(String(resourcename))}`);
    }
    if (visType !== void 0) {
      queryParams.push(`visType=${encodeURIComponent(String(visType))}`);
    }
    const requestPath = `/visualizeQueryV2` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
};
export {
  KustoClient as NamespaceKustoClient,
  AzuremonitorlogsClient as NamespaceLogsClient
};
