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
  constructor(tokenProvider2, options) {
    this.tokenProvider = tokenProvider2;
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
  constructor(connectionRuntimeUrl, tokenProvider2, options) {
    if (!connectionRuntimeUrl && connectionRuntimeUrl !== "") {
      throw new Error("Parameter 'connectionRuntimeUrl' cannot be null or undefined.");
    }
    if (!tokenProvider2) {
      throw new Error("tokenProvider cannot be null or undefined.");
    }
    this.connectionRuntimeUrl = connectionRuntimeUrl.replace(/\/+$/, "");
    this.options = options ?? {};
    this.httpClient = new ConnectorHttpClient(tokenProvider2, this.options);
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

// node_modules/@azure/connectors/dist/esm/generated/Office365Extensions.js
var Office365Client = class extends ConnectorClientBase {
  /**
   * Creates a new Office365Client.
   * @param connectionRuntimeUrl The connection runtime URL from Azure Portal.
   * @param tokenProvider The token provider for authentication.
   * @param options Optional connector client options.
   */
  constructor(connectionRuntimeUrl, tokenProvider2, options) {
    super(connectionRuntimeUrl, tokenProvider2, options);
  }
  get connectorName() {
    return "office365";
  }
  /**
   * Get Outlook category names
   * @remarks This operation gets Outlook category display names.
   */
  async getOutlookCategoryNamesAsync(abortSignal) {
    const requestPath = `/Categories`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Updates an email Draft message
   * @remarks This operation updates an an email Draft message.
   */
  async updateDraftEmailAsync(input, messageId, abortSignal) {
    const queryParams = [];
    if (messageId !== void 0) {
      queryParams.push(`messageId=${encodeURIComponent(String(messageId))}`);
    }
    const requestPath = `/Draft` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PATCH", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PATCH ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Draft an email message
   * @remarks This operation drafts an email message.
   */
  async draftEmailAsync(input, messageId, draftType, comment, abortSignal) {
    const queryParams = [];
    if (messageId !== void 0) {
      queryParams.push(`messageId=${encodeURIComponent(String(messageId))}`);
    }
    if (draftType !== void 0) {
      queryParams.push(`draftType=${encodeURIComponent(String(draftType))}`);
    }
    if (comment !== void 0) {
      queryParams.push(`comment=${encodeURIComponent(String(comment))}`);
    }
    const requestPath = `/Draft` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Send a Draft message
   * @remarks This operation sends a Draft message.
   */
  async sendDraftEmailAsync(messageId, abortSignal) {
    const requestPath = `/Draft/Send/${messageId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Assigns an Outlook category
   * @remarks This operation assigns an Outlook category to an email.
   */
  async assignCategoryAsync(messageId, category, abortSignal) {
    const queryParams = [];
    if (messageId !== void 0) {
      queryParams.push(`messageId=${encodeURIComponent(String(messageId))}`);
    }
    if (category !== void 0) {
      queryParams.push(`category=${encodeURIComponent(String(category))}`);
    }
    const requestPath = `/Mail/Category` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Assign a category to multiple emails
   * @remarks This operation assigns an Outlook category to multiple emails.
   */
  async assignCategoryBulkAsync(input, categoryName, abortSignal) {
    const requestPath = `/Mail/Category/Bulk/${categoryName}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Send approval email
   * @remarks This operation sends an approval email and waits for a response from the recipient. Please refer to the following link regarding the support of actionable messages in different mail clients: https://docs.microsoft.com/outlook/actionable-messages/#outlook-version-requirements-for-actionable-messages.
   */
  async sendApprovalMailAsync(input, abortSignal) {
    const requestPath = `/approvalmail/$subscriptions`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Send an HTTP request
   * @remarks Construct a Microsoft Graph REST API request to invoke. These segments are supported: 1st segement: /me, /users/<userId> 2nd segment: messages, mailFolders, events, calendar, calendars, outlook, inferenceClassification. Learn more: https://docs.microsoft.com/en-us/graph/use-the-api.
   */
  async httpRequestAsync(input, abortSignal) {
    const requestPath = `/codeless/httprequest`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Update my contact's photo
   * @remarks Updates the photo of the specified contact of the current user. The size of the photo must be less than 4 MB.
   */
  async updateMyContactPhotoAsync(input, folder, id, abortSignal) {
    const requestPath = `/codeless/v1.0/me/contactFolders/${folder}/contacts/${id}/photo/$value`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PUT", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PUT ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Send email with options
   * @remarks This operation sends an email with multiple options and waits for the recipient to respond back with one of the options. Please refer to the following link regarding the support of actionable messages in different mail clients: https://docs.microsoft.com/outlook/actionable-messages/#outlook-version-requirements-for-actionable-messages.
   */
  async sendMailWithOptionsAsync(input, abortSignal) {
    const requestPath = `/mailwithoptions/$subscriptions`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Contact Management MCP Server
   * @remarks This MCP server manages contacts
   */
  async mcpContactsManagementAsync(input, sessionId, abortSignal) {
    const queryParams = [];
    if (sessionId !== void 0) {
      queryParams.push(`sessionId=${encodeURIComponent(String(sessionId))}`);
    }
    const requestPath = `/mcp/ContactsManagement` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Email Management MCP Server (deprecated)
   * @remarks This MCP server manages email messages from your Office 365 account
   */
  async mcpEmailsManagementAsync(input, sessionId, abortSignal) {
    const queryParams = [];
    if (sessionId !== void 0) {
      queryParams.push(`sessionId=${encodeURIComponent(String(sessionId))}`);
    }
    const requestPath = `/mcp/EmailsManagement` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Meeting Management MCP Server (deprecated)
   * @remarks This MCP server manages events, calendars and meetings
   */
  async mcpMeetingManagementAsync(input, sessionId, abortSignal) {
    const queryParams = [];
    if (sessionId !== void 0) {
      queryParams.push(`sessionId=${encodeURIComponent(String(sessionId))}`);
    }
    const requestPath = `/mcp/MeetingManagement` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Delete event (V2)
   * @remarks This operation deletes an event in a calendar.
   */
  async calendarDeleteItemAsync(calendar, event_, abortSignal) {
    const requestPath = `/codeless/v1.0/me/calendars/${calendar}/events/${event_}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("DELETE", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `DELETE ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Get event (V3)
   * @remarks This operation gets a specific event from a calendar using Graph API. (V3)
   */
  async calendarGetItemAsync(table, id, abortSignal) {
    const requestPath = `/datasets/calendars/v3/tables/${table}/items/${id}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get events (V4)
   * @remarks This operation gets events from a calendar using Graph API. (V4)
   */
  async calendarGetItemsAsync(table, filter, orderby, top, skip, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    if (skip !== void 0) {
      queryParams.push(`$skip=${encodeURIComponent(String(skip))}`);
    }
    const requestPath = `/datasets/calendars/v4/tables/${table}/items` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When an event is added, updated or deleted (V3)
   * @remarks This operation triggers a flow when an event is added, updated or deleted in a calendar. (V3) This is not available in Mooncake.
   */
  async calendarGetOnChangedItemsAsync(table, incomingDays, pastDays, abortSignal) {
    const queryParams = [];
    if (incomingDays !== void 0) {
      queryParams.push(`incomingDays=${encodeURIComponent(String(incomingDays))}`);
    }
    if (pastDays !== void 0) {
      queryParams.push(`pastDays=${encodeURIComponent(String(pastDays))}`);
    }
    const requestPath = `/datasets/calendars/v3/tables/${table}/onchangeditems` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new event is created (V3)
   * @remarks This operation triggers a flow when a new event is created in a calendar. (V3)
   */
  async calendarGetOnNewItemsAsync(table, filter, orderby, top, skip, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    if (skip !== void 0) {
      queryParams.push(`$skip=${encodeURIComponent(String(skip))}`);
    }
    const requestPath = `/datasets/calendars/v3/tables/${table}/onnewitems` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When an event is modified (V3)
   * @remarks This operation triggers a flow when an event is modified in a calendar. (V3)
   */
  async calendarGetOnUpdatedItemsAsync(table, filter, orderby, top, skip, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    if (skip !== void 0) {
      queryParams.push(`$skip=${encodeURIComponent(String(skip))}`);
    }
    const requestPath = `/datasets/calendars/v3/tables/${table}/onupdateditems` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get calendars (V2)
   * @remarks This operation lists available calendars.
   */
  async calendarGetTablesAsync(skip, top, orderBy, abortSignal) {
    const queryParams = [];
    if (skip !== void 0) {
      queryParams.push(`skip=${encodeURIComponent(String(skip))}`);
    }
    if (top !== void 0) {
      queryParams.push(`top=${encodeURIComponent(String(top))}`);
    }
    if (orderBy !== void 0) {
      queryParams.push(`orderBy=${encodeURIComponent(String(orderBy))}`);
    }
    const requestPath = `/codeless/v1.0/me/calendars` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Update event (V4)
   * @remarks This operation updates an event in a calendar using Graph API.
   */
  async calendarPatchItemAsync(input, table, id, abortSignal) {
    const requestPath = `/datasets/calendars/v4/tables/${table}/items/${id}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PATCH", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PATCH ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Create event (V4)
   * @remarks This operation creates a new event in a calendar.
   */
  async calendarPostItemAsync(input, table, abortSignal) {
    const requestPath = `/datasets/calendars/v4/tables/${table}/items`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Delete contact (V2)
   * @remarks This operation deletes a contact from a contacts folder.
   */
  async contactDeleteItemAsync(folder, id, abortSignal) {
    const requestPath = `/codeless/v1.0/me/contactFolders/${folder}/contacts/${id}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("DELETE", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `DELETE ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Get contact (V2)
   * @remarks This operation gets a specific contact from a contacts folder.
   */
  async contactGetItemAsync(folder, id, abortSignal) {
    const requestPath = `/codeless/v1.0/me/contactFolders/${folder}/contacts/${id}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get contacts (V2)
   * @remarks This operation gets contacts from a contacts folder.
   */
  async contactGetItemsAsync(folder, filter, orderby, top, skip, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    if (skip !== void 0) {
      queryParams.push(`$skip=${encodeURIComponent(String(skip))}`);
    }
    const requestPath = `/codeless/v1.0/me/contactFolders/${folder}/contacts` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get contact folders (V2)
   * @remarks This operation lists available contacts folders using Graph API
   */
  async contactGetTablesAsync(abortSignal) {
    const requestPath = `/v2/datasets/contacts/tables`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Update contact (V2)
   * @remarks This operation updates a contact in a contacts folder.
   */
  async contactPatchItemAsync(input, folder, id, abortSignal) {
    const requestPath = `/codeless/v1.0/me/contactFolders/${folder}/contacts/${id}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PATCH", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PATCH ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Create contact (V2)
   * @remarks This operation creates a new contact in a contacts folder.
   */
  async contactPostItemAsync(input, folder, abortSignal) {
    const requestPath = `/codeless/v1.0/me/contactFolders/${folder}/contacts`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Delete email (V2)
   * @remarks This operation deletes an email by id.
   */
  async deleteEmailAsync(messageId, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/codeless/v1.0/me/messages/${messageId}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("DELETE", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `DELETE ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Export email (V2)
   * @remarks Export the content of the email in the EML file format.
   */
  async exportEmailAsync(messageId, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/codeless/beta/me/messages/${messageId}/$value` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Find meeting times (V2)
   * @remarks Find meeting time suggestions based on organizer, attendee availability, and time or location constraints
   */
  async findMeetingTimesAsync(input, abortSignal) {
    const requestPath = `/codeless/beta/me/findMeetingTimes`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Flag email (V2)
   * @remarks This operation updates an email flag.
   */
  async flagAsync(input, messageId, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/codeless/v1.0/me/messages/${messageId}/flag` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PATCH", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PATCH ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Forward an email (V2)
   * @remarks Forward an email.
   */
  async forwardEmailAsync(input, messageId, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/codeless/v1.0/me/messages/${messageId}/forward` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Get Attachment (V2)
   * @remarks This operation gets an email attachment by id.
   */
  async getAttachmentAsync(messageId, attachmentId, mailboxAddress, extractSensitivityLabel, fetchSensitivityLabelMetadata, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    if (extractSensitivityLabel !== void 0) {
      queryParams.push(`extractSensitivityLabel=${encodeURIComponent(String(extractSensitivityLabel))}`);
    }
    if (fetchSensitivityLabelMetadata !== void 0) {
      queryParams.push(`fetchSensitivityLabelMetadata=${encodeURIComponent(String(fetchSensitivityLabelMetadata))}`);
    }
    const requestPath = `/codeless/v1.0/me/messages/${messageId}/attachments/${attachmentId}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get email (V2)
   * @remarks This operation gets an email by id.
   */
  async getEmailAsync(messageId, mailboxAddress, includeAttachments, internetMessageId, extractSensitivityLabel, fetchSensitivityLabelMetadata, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    if (includeAttachments !== void 0) {
      queryParams.push(`includeAttachments=${encodeURIComponent(String(includeAttachments))}`);
    }
    if (internetMessageId !== void 0) {
      queryParams.push(`internetMessageId=${encodeURIComponent(String(internetMessageId))}`);
    }
    if (extractSensitivityLabel !== void 0) {
      queryParams.push(`extractSensitivityLabel=${encodeURIComponent(String(extractSensitivityLabel))}`);
    }
    if (fetchSensitivityLabelMetadata !== void 0) {
      queryParams.push(`fetchSensitivityLabelMetadata=${encodeURIComponent(String(fetchSensitivityLabelMetadata))}`);
    }
    const requestPath = `/v2/Mail/${messageId}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get emails (V3)
   * @remarks This operation gets emails from a folder via graph apis. Please note that filtering related to these fields: To, Cc, To Or Cc, From, Importance, Fetch Only With Attachments, Subject Filter, is performed using first 250 items in a given mail folder. To avoid that limitation you can use 'Search Query' field.
   */
  async getEmailsAsync(folderPath, to, cc, toOrCc, from, importance, fetchOnlyWithAttachment, subjectFilter, fetchOnlyUnread, fetchOnlyFlagged, mailboxAddress, includeAttachments, searchQuery, top, abortSignal) {
    const queryParams = [];
    if (folderPath !== void 0) {
      queryParams.push(`folderPath=${encodeURIComponent(String(folderPath))}`);
    }
    if (to !== void 0) {
      queryParams.push(`to=${encodeURIComponent(String(to))}`);
    }
    if (cc !== void 0) {
      queryParams.push(`cc=${encodeURIComponent(String(cc))}`);
    }
    if (toOrCc !== void 0) {
      queryParams.push(`toOrCc=${encodeURIComponent(String(toOrCc))}`);
    }
    if (from !== void 0) {
      queryParams.push(`from=${encodeURIComponent(String(from))}`);
    }
    if (importance !== void 0) {
      queryParams.push(`importance=${encodeURIComponent(String(importance))}`);
    }
    if (fetchOnlyWithAttachment !== void 0) {
      queryParams.push(`fetchOnlyWithAttachment=${encodeURIComponent(String(fetchOnlyWithAttachment))}`);
    }
    if (subjectFilter !== void 0) {
      queryParams.push(`subjectFilter=${encodeURIComponent(String(subjectFilter))}`);
    }
    if (fetchOnlyUnread !== void 0) {
      queryParams.push(`fetchOnlyUnread=${encodeURIComponent(String(fetchOnlyUnread))}`);
    }
    if (fetchOnlyFlagged !== void 0) {
      queryParams.push(`fetchOnlyFlagged=${encodeURIComponent(String(fetchOnlyFlagged))}`);
    }
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    if (includeAttachments !== void 0) {
      queryParams.push(`includeAttachments=${encodeURIComponent(String(includeAttachments))}`);
    }
    if (searchQuery !== void 0) {
      queryParams.push(`searchQuery=${encodeURIComponent(String(searchQuery))}`);
    }
    if (top !== void 0) {
      queryParams.push(`top=${encodeURIComponent(String(top))}`);
    }
    const requestPath = `/v3/Mail` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get calendar view of events (V3)
   * @remarks This operation gets all events (including instances of recurrences) in a calendar using Graph API. Recurrence property is null in this case.
   */
  async getEventsCalendarViewAsync(calendarId, startDateTimeUtc, endDateTimeUtc, filter, orderby, top, skip, search, abortSignal) {
    const queryParams = [];
    if (calendarId !== void 0) {
      queryParams.push(`calendarId=${encodeURIComponent(String(calendarId))}`);
    }
    if (startDateTimeUtc !== void 0) {
      queryParams.push(`startDateTimeUtc=${encodeURIComponent(String(startDateTimeUtc))}`);
    }
    if (endDateTimeUtc !== void 0) {
      queryParams.push(`endDateTimeUtc=${encodeURIComponent(String(endDateTimeUtc))}`);
    }
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    if (skip !== void 0) {
      queryParams.push(`$skip=${encodeURIComponent(String(skip))}`);
    }
    if (search !== void 0) {
      queryParams.push(`search=${encodeURIComponent(String(search))}`);
    }
    const requestPath = `/datasets/calendars/v3/tables/items/calendarview` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get mail tips for a mailbox (V2)
   * @remarks Get mail tips for a mailbox such as automatic replies / OOF message or if the mailbox is full. This is not available in GccHigh and Mooncake.
   */
  async getMailTipsAsync(input, abortSignal) {
    const requestPath = `/codeless/v1.0/me/getMailTips`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get room lists (V2)
   * @remarks Get all the room lists defined in the user's tenant
   */
  async getRoomListsAsync(abortSignal) {
    const requestPath = `/codeless/beta/me/findRoomLists`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get rooms (V2)
   * @remarks Get all the meeting rooms defined in the user's tenant
   */
  async getRoomsAsync(abortSignal) {
    const requestPath = `/codeless/beta/me/findRooms`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get rooms in room list (V2)
   * @remarks Get the meeting rooms in a specific room list
   */
  async getRoomsInRoomListAsync(roomList, abortSignal) {
    const requestPath = `/codeless/beta/me/findRooms(RoomList='${roomList}')`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Mark as read or unread (V3)
   * @remarks This operation marks an email as read/unread.
   */
  async markAsReadAsync(input, messageId, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/codeless/v3/v1.0/me/messages/${messageId}/markAsRead` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PATCH", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PATCH ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Move email (V2)
   * @remarks This operation moves an email to the specified folder within the same mailbox.
   */
  async moveAsync(messageId, folderPath, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (folderPath !== void 0) {
      queryParams.push(`folderPath=${encodeURIComponent(String(folderPath))}`);
    }
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/v2/Mail/Move/${messageId}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When an email is flagged (V4)
   * @remarks This operation triggers a flow when an email is flagged.
   */
  async onFlaggedEmailAsync(folderPath, to, cc, toOrCc, from, importance, fetchOnlyWithAttachment, includeAttachments, subjectFilter, abortSignal) {
    const queryParams = [];
    if (folderPath !== void 0) {
      queryParams.push(`folderPath=${encodeURIComponent(String(folderPath))}`);
    }
    if (to !== void 0) {
      queryParams.push(`to=${encodeURIComponent(String(to))}`);
    }
    if (cc !== void 0) {
      queryParams.push(`cc=${encodeURIComponent(String(cc))}`);
    }
    if (toOrCc !== void 0) {
      queryParams.push(`toOrCc=${encodeURIComponent(String(toOrCc))}`);
    }
    if (from !== void 0) {
      queryParams.push(`from=${encodeURIComponent(String(from))}`);
    }
    if (importance !== void 0) {
      queryParams.push(`importance=${encodeURIComponent(String(importance))}`);
    }
    if (fetchOnlyWithAttachment !== void 0) {
      queryParams.push(`fetchOnlyWithAttachment=${encodeURIComponent(String(fetchOnlyWithAttachment))}`);
    }
    if (includeAttachments !== void 0) {
      queryParams.push(`includeAttachments=${encodeURIComponent(String(includeAttachments))}`);
    }
    if (subjectFilter !== void 0) {
      queryParams.push(`subjectFilter=${encodeURIComponent(String(subjectFilter))}`);
    }
    const requestPath = `/v4/Mail/OnFlaggedEmail` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new email arrives (V3)
   * @remarks This operation triggers a flow when a new email arrives. It will skip any email that has a total message size greater than the limit put by your Exchange Admin or 50 MB, whichever is less. It may also skip protected emails and emails with invalid body or attachments.
   */
  async onNewEmailAsync(folderPath, to, cc, toOrCc, from, importance, fetchOnlyWithAttachment, includeAttachments, subjectFilter, abortSignal) {
    const queryParams = [];
    if (folderPath !== void 0) {
      queryParams.push(`folderPath=${encodeURIComponent(String(folderPath))}`);
    }
    if (to !== void 0) {
      queryParams.push(`to=${encodeURIComponent(String(to))}`);
    }
    if (cc !== void 0) {
      queryParams.push(`cc=${encodeURIComponent(String(cc))}`);
    }
    if (toOrCc !== void 0) {
      queryParams.push(`toOrCc=${encodeURIComponent(String(toOrCc))}`);
    }
    if (from !== void 0) {
      queryParams.push(`from=${encodeURIComponent(String(from))}`);
    }
    if (importance !== void 0) {
      queryParams.push(`importance=${encodeURIComponent(String(importance))}`);
    }
    if (fetchOnlyWithAttachment !== void 0) {
      queryParams.push(`fetchOnlyWithAttachment=${encodeURIComponent(String(fetchOnlyWithAttachment))}`);
    }
    if (includeAttachments !== void 0) {
      queryParams.push(`includeAttachments=${encodeURIComponent(String(includeAttachments))}`);
    }
    if (subjectFilter !== void 0) {
      queryParams.push(`subjectFilter=${encodeURIComponent(String(subjectFilter))}`);
    }
    const requestPath = `/v3/Mail/OnNewEmail` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new email mentioning me arrives (V3)
   * @remarks This operation triggers a flow when a new email mentioning me arrives. It will skip any email that has a total message size greater than the limit put by your Exchange Admin or 50 MB, whichever is less. It may also skip protected emails and emails with invalid body or attachments.
   */
  async onNewMentionMeEmailAsync(messageIdToFireOnFirstTriggerRun, folderPath, to, cc, toOrCc, from, importance, fetchOnlyWithAttachment, includeAttachments, subjectFilter, abortSignal) {
    const queryParams = [];
    if (messageIdToFireOnFirstTriggerRun !== void 0) {
      queryParams.push(`messageIdToFireOnFirstTriggerRun=${encodeURIComponent(String(messageIdToFireOnFirstTriggerRun))}`);
    }
    if (folderPath !== void 0) {
      queryParams.push(`folderPath=${encodeURIComponent(String(folderPath))}`);
    }
    if (to !== void 0) {
      queryParams.push(`to=${encodeURIComponent(String(to))}`);
    }
    if (cc !== void 0) {
      queryParams.push(`cc=${encodeURIComponent(String(cc))}`);
    }
    if (toOrCc !== void 0) {
      queryParams.push(`toOrCc=${encodeURIComponent(String(toOrCc))}`);
    }
    if (from !== void 0) {
      queryParams.push(`from=${encodeURIComponent(String(from))}`);
    }
    if (importance !== void 0) {
      queryParams.push(`importance=${encodeURIComponent(String(importance))}`);
    }
    if (fetchOnlyWithAttachment !== void 0) {
      queryParams.push(`fetchOnlyWithAttachment=${encodeURIComponent(String(fetchOnlyWithAttachment))}`);
    }
    if (includeAttachments !== void 0) {
      queryParams.push(`includeAttachments=${encodeURIComponent(String(includeAttachments))}`);
    }
    if (subjectFilter !== void 0) {
      queryParams.push(`subjectFilter=${encodeURIComponent(String(subjectFilter))}`);
    }
    const requestPath = `/v3/Mail/OnNewMentionMeEmail` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When an upcoming event is starting soon (V3)
   * @remarks This operation triggers a flow when an upcoming calendar event is starting.
   */
  async onUpcomingEventsAsync(table, lookAheadTimeInMinutes, abortSignal) {
    const queryParams = [];
    if (table !== void 0) {
      queryParams.push(`table=${encodeURIComponent(String(table))}`);
    }
    if (lookAheadTimeInMinutes !== void 0) {
      queryParams.push(`lookAheadTimeInMinutes=${encodeURIComponent(String(lookAheadTimeInMinutes))}`);
    }
    const requestPath = `/v3/Events/OnUpcomingEvents` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Reply to email (V3)
   * @remarks This operation replies to an email.
   */
  async replyToAsync(input, messageId, mailboxAddress, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    const requestPath = `/v3/Mail/ReplyTo/${messageId}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Respond to an event invite (V2)
   * @remarks Respond to an event invite.
   */
  async respondToEventAsync(input, eventId, response, abortSignal) {
    const requestPath = `/codeless/v1.0/me/events/${eventId}/${response}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Send an email (V2)
   * @remarks This operation sends an email message.
   */
  async sendEmailAsync(input, abortSignal) {
    const requestPath = `/v2/Mail`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Set up automatic replies (V2)
   * @remarks Set the automatic replies setting for your mailbox.
   */
  async setAutomaticRepliesSettingAsync(input, abortSignal) {
    const requestPath = `/codeless/v1.0/me/mailboxSettings`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("PATCH", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `PATCH ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new email arrives in a shared mailbox (V2)
   * @remarks This operation triggers a flow when a new email arrives in a shared mailbox. Your account should have permission to access the mailbox for this operation to succeed. It will skip any email that has a total message size greater than the limit put by your Exchange Admin or 50 MB, whichever is less. It may also skip protected emails and emails with invalid body or attachments.
   */
  async sharedMailboxOnNewEmailAsync(mailboxAddress, folderId, to, cc, toOrCc, from, importance, hasAttachments, includeAttachments, subjectFilter, abortSignal) {
    const queryParams = [];
    if (mailboxAddress !== void 0) {
      queryParams.push(`mailboxAddress=${encodeURIComponent(String(mailboxAddress))}`);
    }
    if (folderId !== void 0) {
      queryParams.push(`folderId=${encodeURIComponent(String(folderId))}`);
    }
    if (to !== void 0) {
      queryParams.push(`to=${encodeURIComponent(String(to))}`);
    }
    if (cc !== void 0) {
      queryParams.push(`cc=${encodeURIComponent(String(cc))}`);
    }
    if (toOrCc !== void 0) {
      queryParams.push(`toOrCc=${encodeURIComponent(String(toOrCc))}`);
    }
    if (from !== void 0) {
      queryParams.push(`from=${encodeURIComponent(String(from))}`);
    }
    if (importance !== void 0) {
      queryParams.push(`importance=${encodeURIComponent(String(importance))}`);
    }
    if (hasAttachments !== void 0) {
      queryParams.push(`hasAttachments=${encodeURIComponent(String(hasAttachments))}`);
    }
    if (includeAttachments !== void 0) {
      queryParams.push(`includeAttachments=${encodeURIComponent(String(includeAttachments))}`);
    }
    if (subjectFilter !== void 0) {
      queryParams.push(`subjectFilter=${encodeURIComponent(String(subjectFilter))}`);
    }
    const requestPath = `/v2/SharedMailbox/Mail/OnNewEmail` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Send an email from a shared mailbox (V2)
   * @remarks This operation sends an email from a shared mailbox. Your account should have permission to access the mailbox for this operation to succeed.
   */
  async sharedMailboxSendEmailAsync(input, abortSignal) {
    const requestPath = `/v2/SharedMailbox/Mail`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
};

// node_modules/@azure/connectors/dist/esm/generated/TeamsExtensions.js
var TeamsClient = class extends ConnectorClientBase {
  /**
   * Creates a new TeamsClient.
   * @param connectionRuntimeUrl The connection runtime URL from Azure Portal.
   * @param tokenProvider The token provider for authentication.
   * @param options Optional connector client options.
   */
  constructor(connectionRuntimeUrl, tokenProvider2, options) {
    super(connectionRuntimeUrl, tokenProvider2, options);
  }
  get connectorName() {
    return "teams";
  }
  /**
   * Create a chat
   * @remarks Creates a one on one or group chat
   */
  async createChatAsync(input, abortSignal) {
    const requestPath = `/beta/chats`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get messages in a chat
   * @remarks Retrieves messages from a one on one or group chat
   */
  async getMessagesFromChatAsync(chatId, filter, orderby, top, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    const requestPath = `/beta/chats/${chatId}/messages` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List channels
   * @remarks Lists all the channels for a specific team
   */
  async getChannelsForGroupAsync(groupId, filter, orderby, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    const requestPath = `/beta/groups/${groupId}/channels` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Create a channel
   * @remarks Create a new channel within a specified team
   */
  async createChannelAsync(input, groupId, abortSignal) {
    const requestPath = `/beta/groups/${groupId}/channels`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List joined teams
   * @remarks Lists all the teams in Microsoft Teams that you are a member of
   */
  async getAllTeamsAsync(abortSignal) {
    const requestPath = `/beta/me/joinedTeams`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When I'm @mentioned
   * @remarks Triggers when a new message that @mentions the current user is added to a specified chat or channel.
   */
  async webhookAtMentionTriggerAsync(input, threadType, abortSignal) {
    const requestPath = `/beta/subscriptions/atmentiontrigger/threadType/${threadType}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * When a new chat message is added
   * @remarks Triggers when a new message is posted in any chat the user is a part of.
   */
  async webhookChatMessageTriggerAsync(input, abortSignal) {
    const requestPath = `/beta/subscriptions/chatmessagetrigger`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * When keywords are mentioned
   * @remarks Triggers when a keyword is mentioned in a specified chat or channel. Does not trigger if a message is edited.
   */
  async webhookKeywordTriggerAsync(input, threadType, search, abortSignal) {
    const queryParams = [];
    if (search !== void 0) {
      queryParams.push(`$search=${encodeURIComponent(String(search))}`);
    }
    const requestPath = `/beta/subscriptions/keywordtrigger/threadType/${threadType}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * When someone reacted to a message in chat
   * @remarks Triggers when someone reacts to a message in a specified chat or channel.
   */
  async webhookMessageReactionTriggerAsync(input, threadType, reactionKey, frequency, runningPolicy, abortSignal) {
    const queryParams = [];
    if (reactionKey !== void 0) {
      queryParams.push(`reactionKey=${encodeURIComponent(String(reactionKey))}`);
    }
    if (frequency !== void 0) {
      queryParams.push(`frequency=${encodeURIComponent(String(frequency))}`);
    }
    if (runningPolicy !== void 0) {
      queryParams.push(`runningPolicy=${encodeURIComponent(String(runningPolicy))}`);
    }
    const requestPath = `/beta/subscriptions/messagereactiontrigger/threadType/${threadType}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * When a new message is added to a chat or channel
   * @remarks Triggers when a new message is posted in a specified chat or channel. Does not trigger if a message is edited.
   */
  async webhookNewMessageTriggerAsync(input, threadType, abortSignal) {
    const requestPath = `/beta/subscriptions/newmessagetrigger/threadType/${threadType}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Create a team
   * @remarks Creates a new team in Microsoft Teams
   */
  async createATeamAsync(input, abortSignal) {
    const requestPath = `/beta/teams`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Post message in a chat or channel
   * @remarks Posts a message to a chat or a channel
   */
  async postMessageToConversationAsync(input, poster, location, abortSignal) {
    const requestPath = `/beta/teams/conversation/message/poster/${poster}/location/${location}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get message details
   * @remarks Gets the details of a message in a chat or a channel.
   */
  async getMessageDetailsAsync(input, messageId, threadType, abortSignal) {
    const requestPath = `/beta/teams/messages/${messageId}/messageType/${threadType}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List all channels
   * @remarks Lists all the channels for a specific team, including channels that are shared with the team
   */
  async getAllChannelsForTeamAsync(groupId, filter, orderby, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    if (orderby !== void 0) {
      queryParams.push(`$orderby=${encodeURIComponent(String(orderby))}`);
    }
    const requestPath = `/beta/teams/${groupId}/allChannels` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get details for a specific channel in a team
   * @remarks Get the channel details
   */
  async getChannelAsync(groupId, channelId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/channels/${channelId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get messages in a channel
   * @remarks Gets messages from a channel in a specific team. For shared channels, the team ID must refer to the host team, which is the team that owns the shared channel.
   */
  async getMessagesFromChannelAsync(groupId, channelId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/channels/${channelId}/messages`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List all tags for a team
   * @remarks Lists the team's tags
   */
  async getTagsAsync(groupId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Create a tag for a team
   * @remarks Creates a tag in a team
   */
  async createTagAsync(input, groupId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Delete a team tag
   * @remarks Deletes a tag from a team
   */
  async deleteTagAsync(groupId, tagId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags/${tagId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("DELETE", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `DELETE ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Get an @mention token for a team tag
   * @remarks Creates a token that can be inserted into a message or adaptive card sent as a user in a channel to @mention a team tag.
   */
  async atMentionTagAsync(groupId, tagId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags/${tagId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List the members of a team tag
   * @remarks Lists the members of a team tag
   */
  async getTagMembersAsync(groupId, tagId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags/${tagId}/members`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Add a member to a team tag
   * @remarks Adds a user to a team tag
   */
  async addMemberToTagAsync(input, groupId, tagId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags/${tagId}/members`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Delete a member from a team tag
   * @remarks Deletes a member from a team tag
   */
  async deleteTagMemberAsync(groupId, tagId, tagMemberId, abortSignal) {
    const requestPath = `/beta/teams/${groupId}/tags/${tagId}/members/${tagMemberId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("DELETE", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `DELETE ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Get a team
   * @remarks Gets the details for a team in Microsoft Teams.
   */
  async getTeamAsync(teamId, abortSignal) {
    const requestPath = `/beta/teams/${teamId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Add a member to a team
   * @remarks Adds a member to a team in Microsoft Teams
   */
  async addMemberToTeamAsync(input, teamId, abortSignal) {
    const requestPath = `/beta/teams/${teamId}/members`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * List chats
   * @remarks Lists recent chats you are a part of
   */
  async getChatsAsync(chatType, topic, abortSignal) {
    const requestPath = `/flowbot/actions/listchats/chattypes/${chatType}/topic/${topic}/expandmembers/false`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Post a choice of options as the Flow bot to a user
   * @remarks Send a set of options to a Microsoft Teams user, that they must respond to before the flow will continue. This action will pause the flow until the user response to the options
   */
  async subscribeUserMessageWithOptionsAsync(input, abortSignal) {
    const requestPath = `/flowbot/actions/messagewithoptions/recipienttypes/user/$subscriptions`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Post a feed notification
   * @remarks Posts a notification to a user's activity feed linking to a chat or team.
   */
  async postFeedNotificationAsync(input, poster, notificationType, abortSignal) {
    const requestPath = `/flowbot/feednotification/poster/${poster}/notificationType/${notificationType}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Send a Microsoft Graph HTTP request
   * @remarks Construct a Microsoft Graph REST API request to invoke against the Microsoft Teams endpoints. These segments are supported: 1st segment: /teams, /me, /users 2nd segment: channels, chats, installedApps, messages, pinnedMessages, onlineMeetings. Learn more: https://docs.microsoft.com/en-us/graph/use-the-api
   */
  async httpRequestAsync(input, abortSignal) {
    const requestPath = `/httprequest`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new channel message is added
   * @remarks Triggers when a new message is posted to a channel in a team. Note that this trigger only fires when a root messages is added in the channel. Replies to an existing channel message will not result in the trigger event firing. For shared channels, the team ID must refer to the host team, which is the team that owns the shared channel.
   */
  async onNewChannelMessageAsync(groupId, channelId, top, abortSignal) {
    const queryParams = [];
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    const requestPath = `/trigger/beta/teams/${groupId}/channels/${channelId}/messages` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When I am mentioned in a channel message
   * @remarks Triggers when a new message that @mentions the current user is added to a channel in a team. For shared channels, the team ID must refer to the host team, which is the team that owns the shared channel.
   */
  async onNewChannelMessageMentioningMeAsync(groupId, channelId, top, abortSignal) {
    const queryParams = [];
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    const requestPath = `/trigger/beta/teams/${groupId}/channels/${channelId}/messages_mentioningme` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new team member is added
   * @remarks Triggers when a member is added to the given team
   */
  async onGroupMembershipAddAsync(groupId, select, abortSignal) {
    const queryParams = [];
    if (groupId !== void 0) {
      queryParams.push(`groupId=${encodeURIComponent(String(groupId))}`);
    }
    if (select !== void 0) {
      queryParams.push(`$select=${encodeURIComponent(String(select))}`);
    }
    const requestPath = `/trigger/v1.0/groups/delta` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * When a new team member is removed
   * @remarks Triggers when a member is removed from the specified team
   */
  async onGroupMembershipRemovalAsync(groupId, select, abortSignal) {
    const queryParams = [];
    if (groupId !== void 0) {
      queryParams.push(`groupId=${encodeURIComponent(String(groupId))}`);
    }
    if (select !== void 0) {
      queryParams.push(`$select=${encodeURIComponent(String(select))}`);
    }
    const requestPath = `/trigger/v1.0/groups/removal` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Create a Teams meeting
   * @remarks Create a meeting with a link at the bottom of the invite to join the meeting online on Microsoft Teams.
   */
  async createTeamsMeetingAsync(input, calendarid, abortSignal) {
    const requestPath = `/v1.0/me/calendars/${calendarid}/events`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List associated teams
   * @remarks Lists all the teams you are a direct member of, or are a member of a shared channel that is hosted inside the team.
   */
  async getAllAssociatedTeamsAsync(abortSignal) {
    const requestPath = `/v1.0/me/teamwork/associatedTeams`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Post card in a chat or channel
   * @remarks Posts a card to a chat or a channel
   */
  async postCardToConversationAsync(input, poster, location, abortSignal) {
    const requestPath = `/v1.0/teams/conversation/adaptivecard/poster/${poster}/location/${location}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Post adaptive card and wait for a response
   * @remarks Posts an adaptive card to a chat or a channel and waits for a response from any user. This will pause the flow until any user responds.
   */
  async postCardAndWaitForResponseAsync(input, poster, location, abortSignal) {
    const requestPath = `/v1.0/teams/conversation/gatherinput/poster/${poster}/location/${location}/$subscriptions`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Reply with an adaptive card in a channel
   * @remarks Replies with an adaptive card to a channel's message
   */
  async replyWithCardToConversationAsync(input, poster, location, abortSignal) {
    const requestPath = `/v1.0/teams/conversation/replyWithAdaptivecard/poster/${poster}/location/${location}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Reply with a message in a channel
   * @remarks Replies with a message to a channel's message
   */
  async replyWithMessageToConversationAsync(input, poster, location, abortSignal) {
    const requestPath = `/v1.0/teams/conversation/replyWithMessage/poster/${poster}/location/${location}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Update an adaptive card in a chat or channel
   * @remarks Updates an existing adaptive card
   */
  async updateCardInConversationAsync(input, poster, location, abortSignal) {
    const requestPath = `/v1.0/teams/conversation/updateAdaptivecard/poster/${poster}/location/${location}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * List members
   * @remarks List direct members of a group chat or a channel
   */
  async listMembersAsync(input, threadType, filter, abortSignal) {
    const queryParams = [];
    if (filter !== void 0) {
      queryParams.push(`$filter=${encodeURIComponent(String(filter))}`);
    }
    const requestPath = `/v1.0/teams/listmembers/threadType/${threadType}` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Add a member to a channel
   * @remarks Adds a member to a channel in Microsoft Teams
   */
  async addMemberToChannelAsync(input, groupId, channelId, abortSignal) {
    const requestPath = `/v1.0/teams/${groupId}/channels/${channelId}/members`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("POST", url, void 0, input, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `POST ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * Remove a direct member from a channel
   * @remarks Removes a direct member from a channel in Microsoft Teams
   */
  async removeMemberFromChannelAsync(groupId, channelId, membershipId, abortSignal) {
    const requestPath = `/v1.0/teams/${groupId}/channels/${channelId}/members/${membershipId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("DELETE", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `DELETE ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
  }
  /**
   * List replies of a channel message
   * @remarks List replies to a message in a channel in a specific team. For shared channels, the team ID must refer to the host team, which is the team that owns the shared channel.
   */
  async listRepliesToMessageAsync(groupId, channelId, messageId, top, abortSignal) {
    const queryParams = [];
    if (top !== void 0) {
      queryParams.push(`$top=${encodeURIComponent(String(top))}`);
    }
    const requestPath = `/v1.0/teams/${groupId}/channels/${channelId}/messages/${messageId}/replies` + (queryParams.length > 0 ? "?" + queryParams.join("&") : "");
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
  /**
   * Get an @mention token for a user
   * @remarks Creates a token that can be inserted into a message or adaptive card to @mention a user.
   */
  async atMentionUserAsync(userId, abortSignal) {
    const requestPath = `/v1.0/users/${userId}`;
    const url = this.resolveUrl(requestPath);
    const httpResponse = await this.httpClient.sendAsync("GET", url, void 0, void 0, abortSignal);
    if (!httpResponse.isSuccessStatusCode) {
      throw new ConnectorException(this.connectorName, `GET ${requestPath}`, httpResponse.statusCode, httpResponse.text);
    }
    return httpResponse.value;
  }
};

// canvases/azure-sre-agent/src/teams-target.mjs
var GUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
var CHANNEL = /^19:[a-z0-9._-]{1,220}@thread\.(?:tacv2|skype)$/i;
var MESSAGE = /^\d{1,32}$/;
var HOSTS = /* @__PURE__ */ new Set(["teams.microsoft.com", "teams.cloud.microsoft"]);
var PARAMETERS = /* @__PURE__ */ new Set([
  "groupId",
  "tenantId",
  "parentMessageId",
  "teamName",
  "channelName",
  "createdTime",
  "allowXTenantAccess",
  "context"
]);
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
        if (!GUID.test(hint) || expected[key] && expected[key].toLowerCase() !== hint.toLowerCase()) return null;
      } else if (key === "parentMessageId") {
        if (!MESSAGE.test(hint)) return null;
      } else url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return null;
  }
}

// canvases/azure-sre-agent/src/personal-m365-transport.mjs
var M365_RESOURCE = "https://apihub.azure.com";
var M365_AUDIENCE = `${M365_RESOURCE}/.default`;
var CONSENT_STATES = /* @__PURE__ */ new Set([
  "ready",
  "consent_required",
  "consent_pending",
  "consent_declined",
  "consent_expired",
  "admin_approval_required",
  "sign_in_required",
  "source_access_denied",
  "connection_unavailable"
]);
function m365Error(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
function sameM365Identity(one, two) {
  return ["tenantId", "cloud", "objectId"].every((key) => typeof one?.[key] === "string" && typeof two?.[key] === "string" && one[key].toLowerCase() === two[key].toLowerCase());
}
function assertM365CallerAccess(proof, identity, namespaceId) {
  if (!sameM365Identity(identity, proof?.caller ?? proof?.gateway)) {
    throw m365Error("wrong_account", "The authenticated Azure caller does not match this conversation's selected principal.");
  }
  if (typeof proof.namespaceId !== "string" || proof.namespaceId.toLowerCase() !== namespaceId.toLowerCase() || proof.invocationAllowed !== true || (proof.privateCallerAccess ?? proof.privateAccess) !== true) {
    throw m365Error("gateway_access_denied", "Fresh private caller access to the selected namespace is required.");
  }
}
function m365ProviderAccount(account) {
  const label = account?.displayName || account?.email || account?.accountId;
  return {
    displayName: typeof label === "string" && label ? label.slice(0, 240) : "uses account chosen during consent",
    accountId: typeof account?.accountId === "string" ? account.accountId.slice(0, 240) : null,
    selection: "consent",
    identityVerified: false
  };
}
function connectionState(proof) {
  if (CONSENT_STATES.has(proof.consentStatus) && proof.consentStatus !== "ready") return proof.consentStatus;
  if (proof.authenticated === false) return "consent_required";
  if (proof.connectionStatus === "Connected" && proof.healthy === true) return "ready";
  if (proof.connectionStatus === "Connecting") return "consent_pending";
  if (proof.connectionStatus === "Disconnected" || proof.connectionStatus === "NotConnected") return "consent_required";
  return "connection_unavailable";
}
function nativeMentionName(value) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
  const name = value.replace(/&(?:amp|lt|gt|quot|apos|#(?:\d{1,7}|x[a-f0-9]{1,6}));/gi, (entity) => {
    const key = entity.slice(1, -1).toLowerCase();
    if (key[0] !== "#") return entities[key];
    const hex = key.startsWith("#x"), code = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
    if (code > 1114111 || code >= 55296 && code <= 57343) {
      throw m365Error("mention_unsupported", "The native mention token contains an unsupported display name.");
    }
    return String.fromCodePoint(code);
  }).trim();
  if (!name || /[\u0000-\u001f\u007f]/.test(name)) {
    throw m365Error("mention_unsupported", "The native mention token contains an unsupported display name.");
  }
  return name;
}
function runtimeUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw m365Error("connection_unavailable", "The connection has no supported runtime URL.");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || !(url.hostname.endsWith(".azure-apihub.net") || url.hostname.endsWith(".apihub.azure.com") || url.hostname === "apihub.azure.com") || /%|\\/.test(url.pathname)) {
    throw m365Error("connection_unavailable", "The connection runtime is not an approved API Hub endpoint.");
  }
  return url.href.replace(/\/+$/, "");
}
function tokenProvider(credential) {
  if (!credential || typeof credential.getToken !== "function") {
    throw m365Error("sign_in_required", "Sign in with the selected user account.");
  }
  return {
    async getAccessTokenAsync(scopes) {
      if (scopes.length !== 1 || scopes[0] !== M365_AUDIENCE) {
        throw m365Error("identity_unverified", "The SDK requested an unapproved token audience.");
      }
      const token = await credential.getToken(M365_AUDIENCE);
      if (!token?.token) throw m365Error("sign_in_required", "Sign in with the selected user account.");
      return token.token;
    }
  };
}
function createPersonalM365Transport({ loadConnection, sdk = { Office365Client, TeamsClient } } = {}) {
  async function open(args) {
    if (typeof loadConnection !== "function") {
      throw m365Error("identity_unverified", "A fresh caller/private namespace access and connection-health check is required.");
    }
    const connection = await loadConnection({
      ...args,
      namespaceId: args.source.namespaceId,
      connectionId: args.source.connectionId
    });
    const verify = connection?.verifyAccess ?? connection?.verifyIdentity;
    if (typeof verify !== "function") {
      throw m365Error("identity_unverified", "Caller/private namespace access and provider connection health have not been checked.");
    }
    const expectedResource = `${args.source.namespaceId}/connections/${args.source.connectionId}`;
    if (typeof connection.connectionResourceId !== "string" || connection.connectionResourceId.toLowerCase() !== expectedResource.toLowerCase()) {
      throw m365Error("source_changed", "The loaded connection does not match the selected cloud resource.");
    }
    const facts = await verify.call(connection, args);
    const healthy = facts?.healthy ?? facts?.providerHealthy;
    const authenticated = facts?.authenticated ?? facts?.authenticatedConnection;
    const reported = {
      ...facts,
      namespaceId: facts?.namespaceId ?? args.source.namespaceId,
      privateCallerAccess: facts?.privateCallerAccess ?? facts?.privateAccess,
      connectionStatus: facts?.connectionStatus ?? facts?.overallStatus ?? (healthy === true && authenticated === true && facts?.consentStatus === "ready" ? "Connected" : "Unknown"),
      healthy,
      authenticated
    };
    assertM365CallerAccess(reported, args.identity, args.source.namespaceId);
    if (typeof connection.configurationRevision !== "string" || !connection.configurationRevision) {
      throw m365Error("connection_unavailable", "The connection configuration has no validated revision.");
    }
    if (facts?.configurationRevision && facts.configurationRevision !== connection.configurationRevision) {
      throw m365Error("source_changed", "Connection metadata changed during verification. Reload it before continuing.");
    }
    const proof = {
      ...reported,
      gateway: reported.caller ?? reported.gateway,
      consentStatus: connectionState(reported),
      consentRevision: reported.consentRevision ?? connection.configurationRevision,
      providerAccount: m365ProviderAccount(reported.providerAccount ?? connection.providerAccount ?? reported.provider)
    };
    if (args.expectedConfigurationRevision && (connection.configurationRevision !== args.expectedConfigurationRevision || proof.consentRevision !== args.expectedConsentRevision)) {
      throw m365Error("source_changed", "Connection or consent changed. Prepare a fresh preview.");
    }
    let client = null;
    if (proof.consentStatus === "ready") {
      const url = runtimeUrl(connection.connectionRuntimeUrl);
      const Client = args.source.kind === "inbox" ? sdk.Office365Client : sdk.TeamsClient;
      client = new Client(url, tokenProvider(args.credential), { maxRetryAttempts: 1, timeoutMs: 3e4 });
    }
    return { connection, proof, client };
  }
  async function inspected(args, opened = null) {
    const { connection, proof, client } = opened ?? await open(args);
    const result = {
      gateway: proof.gateway,
      namespaceId: proof.namespaceId,
      invocationAllowed: proof.invocationAllowed,
      privateCallerAccess: proof.privateCallerAccess,
      connectionStatus: proof.connectionStatus,
      healthy: proof.healthy,
      providerAccount: proof.providerAccount,
      configurationRevision: connection.configurationRevision,
      consentRevision: proof.consentRevision ?? null,
      status: proof.consentStatus,
      connection: {
        id: connection.connectionResourceId,
        name: connection.displayName || connection.name || args.source.connectionId,
        kind: args.source.kind,
        namespaceId: args.source.namespaceId,
        connectionId: args.source.connectionId
      }
    };
    if (result.status !== "ready") return result;
    if (proof.sourceAccess === false) return { ...result, status: "source_access_denied" };
    if (args.source.kind === "inbox") {
      const inbox = await client.getEmailsAsync(
        "Inbox",
        void 0,
        void 0,
        void 0,
        void 0,
        void 0,
        "false",
        void 0,
        "false",
        "false",
        void 0,
        "false",
        void 0,
        "1"
      );
      if (!Array.isArray(inbox?.value)) {
        throw m365Error("connection_unavailable", "The provider did not return an accessible Inbox response.");
      }
      return { ...result, sourceAccess: true, mailbox: {
        displayName: proof.mailbox?.displayName || "Inbox \u2014 uses account chosen during consent",
        folder: "Inbox"
      } };
    }
    const target = args.source.target;
    const [team, channel] = await Promise.all([
      client.getTeamAsync(target.groupId),
      client.getChannelAsync(target.groupId, encodeURIComponent(target.channelId))
    ]);
    if (team?.id?.toLowerCase() !== target.groupId || channel?.id !== target.channelId || channel.tenantId && channel.tenantId.toLowerCase() !== target.tenantId.toLowerCase() || !team.displayName || !channel.displayName) {
      throw m365Error("source_access_denied", "The provider did not resolve the selected team and channel.");
    }
    const membershipType = channel.membershipType;
    if (!["standard", "shared"].includes(membershipType) || membershipType === "shared" && proof.supportedMembershipTypes?.includes("shared") !== true) {
      throw m365Error("unsupported_channel", "This channel's identity and publishing contract has not been qualified.");
    }
    if (args.identity.cloud !== "AzureCloud") {
      throw m365Error("unsupported_channel", "Flow bot posting is supported only in commercial tenants.");
    }
    if (team.isArchived) throw m365Error("source_access_denied", "This team is archived.");
    return {
      ...result,
      sourceAccess: true,
      team: { id: team.id, displayName: team.displayName },
      channel: { id: channel.id, displayName: channel.displayName, membershipType },
      author: { kind: "bot", displayName: "Flow bot", poster: "Flow bot" }
    };
  }
  async function ready(args) {
    const opened = await open(args);
    if (opened.proof.consentStatus !== "ready" || opened.proof.sourceAccess === false) {
      throw m365Error(
        opened.proof.consentStatus === "ready" ? "source_access_denied" : opened.proof.consentStatus,
        "Reconnect or choose a source this account can access."
      );
    }
    return opened;
  }
  return Object.freeze({
    async checkAccess(args) {
      const { proof } = await open(args);
      return { ...proof, status: connectionState(proof) };
    },
    async checkConsentAccess(args) {
      const { connection } = await open(args);
      if (typeof connection.checkConsent === "function") await connection.checkConsent(args);
      const { proof } = await open(args);
      return { ...proof, status: connectionState(proof) };
    },
    inspectSource: inspected,
    async beginConsent(args) {
      const { connection, proof } = await open(args);
      if (proof.consentStatus === "source_access_denied" || proof.sourceAccess === false && proof.consentStatus === "ready") {
        throw m365Error("source_access_denied", "Consent exists. Change account or choose another source.");
      }
      if (typeof connection.beginConsent !== "function") {
        throw m365Error("consent_unavailable", "The provider-managed consent link operation has not been qualified.");
      }
      return connection.beginConsent(args);
    },
    async checkConsent(args) {
      const { connection } = await open(args);
      if (typeof connection.checkConsent === "function") await connection.checkConsent(args);
      return inspected(args);
    },
    async readInbox(args) {
      const { client } = await ready(args);
      return client.getEmailsAsync(
        "Inbox",
        void 0,
        void 0,
        void 0,
        void 0,
        void 0,
        "false",
        void 0,
        "false",
        "false",
        void 0,
        "false",
        args.searchQuery,
        String(args.limit)
      );
    },
    async resolveMention(args) {
      const { client, connection } = await ready(args);
      let user = args.user;
      if (typeof connection.resolveUser === "function") user = await connection.resolveUser(args);
      else if (typeof user === "string" && (/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(user) || /^[a-z0-9.!#$&'*+?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(user))) {
        user = { id: user };
      }
      if (!user?.id || typeof user.id !== "string" || user.id.length > 320 || /[/\\\u0000-\u0020]/.test(user.id)) {
        throw m365Error("mention_unresolved", "Choose a verified user ID or principal name; display names need an authorized picker.");
      }
      const result = await client.atMentionUserAsync(encodeURIComponent(user.id));
      const match = typeof result?.atMention === "string" && result.atMention.length <= 2048 ? /^<at(?:\s+id=["']\d+["'])?>([^<>]+)<\/at>$/i.exec(result.atMention) : null;
      if (!match) {
        throw m365Error("mention_unsupported", "The provider did not return a supported native user mention token.");
      }
      return { id: user.id, displayName: nativeMentionName(match[1]), token: result.atMention, kind: "user" };
    },
    async publishChannelUpdate(args) {
      let client;
      const payload = args.payload;
      try {
        ({ client } = await ready(args));
        if (args.identity.cloud !== "AzureCloud" || payload.poster !== "Flow bot" || payload.location !== "Channel" || payload.input?.recipient?.groupId !== args.source.target.groupId || payload.input?.recipient?.channelId !== args.source.target.channelId || args.replyTo) {
          throw m365Error("publish_contract_changed", "Only qualified new commercial channel posts are supported.");
        }
      } catch (error) {
        error.deliveryStarted = false;
        throw error;
      }
      const result = await client.postMessageToConversationAsync(payload.input, payload.poster, payload.location);
      if (typeof result?.id !== "string" || !result.id || result.id.length > 300 || result.conversationId && result.conversationId !== args.source.target.channelId) {
        throw m365Error("delivery_unknown", "The provider did not confirm delivery to the selected channel. Do not retry blindly.");
      }
      return { messageId: result.id, messageLink: safeTeamsMessageLink(result.messageLink, {
        ...args.source.target,
        messageId: result.id
      }) };
    }
  });
}
export {
  M365_AUDIENCE,
  M365_RESOURCE,
  assertM365CallerAccess,
  createPersonalM365Transport,
  m365Error,
  m365ProviderAccount,
  sameM365Identity
};
