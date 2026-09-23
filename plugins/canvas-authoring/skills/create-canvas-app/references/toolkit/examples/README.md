# Read-only Azure examples

Building a new canvas? Start with the [Azure canvas quickstart](../quickstart.md),
which includes an agent prompt and the end-to-end UI/action wiring recipe.

| Example | Use it to learn |
| --- | --- |
| [Resource groups](resource-groups.mjs) | Add a small, bounded Azure read to a host-created canvas. The app owns the context, UI, state and cancellation. |
| [SDK client](sdk-client.mjs) | Pass a bound credential to an Azure SDK client or the optional toolkit ARM client. |
| [Custom HTTP client](custom-fetch-client.mjs) | Use an SDK-cached bearer callback with a caller-owned HTTP transport. |

The resource-group reader exports `readResourceGroups(context, { signal, httpClient })`.
It has no CLI runner or import-time side effects. Copy it into your application's
server source and pass a subscription-bound context. It returns only `id`,
`name` and `location`; empty success, cancellation, invalid data, and incomplete
or over-limit listings remain distinct. It rejects above 200 rows or 10 pages
instead of silently returning a complete-looking partial list.

## Authentication and transport examples

These Node 22+ examples use public package exports. Importing them, or running
them without `--run`, performs no discovery, authentication, or network request.
Install the toolkit as described in the
[package guide](../README.md#setup-and-exports). No separate dependency install
is needed in this examples folder. The [authentication guide](../auth.md)
explains session ownership and credential handling.
The SDK/custom-HTTP runners never launch login, change CLI defaults/cloud, or
print credentials or resource data. Supply a dedicated test scope and an **already authenticated**
Azure CLI profile. The profile's active cloud must match the explicit cloud.

From the toolkit package directory (`node_modules/@microsoft/canvas-toolkit`
in an installed application), opt in to exactly one read:

```sh
node examples/sdk-client.mjs \
  --run --subscription <subscription-id> --tenant <tenant-id> --cloud AzureCloud
node examples/sdk-client.mjs \
  --run --optional-arm --subscription <subscription-id> --tenant <tenant-id> --cloud AzureCloud
node examples/custom-fetch-client.mjs \
  --run --subscription <subscription-id> --tenant <tenant-id> --cloud AzureCloud
```

Replace `AzureCloud` with `AzureUSGovernment` or `AzureChinaCloud` for an
appropriately authenticated sovereign-cloud profile; these commands do not
establish live qualification for those environments. Examples time out after
30 seconds and dispose their local session without machine-wide logout.

- **SDK:** constructs a real `ServiceClient` with `context.credential` and
  `context.environment` endpoint/audience. Generated service SDKs use the same
  credential contract; their service-specific endpoint options can differ.
- **Optional ARM:** uses `createArmClient(context)` instead, gaining toolkit
  per-request validity and ARM URL checks. For lists use `listArm(context, path)`;
  an iterator failure means results are incomplete, including `paging-limit`.
- **Custom fetch:** creates one reusable SDK-cached token callback and uses it
  for actual `fetch` requests. Request routing is the custom client's concern,
  not an arbitrary-service-URL option on authentication. Redirects are disabled.

Long-lived applications must subscribe to session changes and retire their own
SDK/custom clients when a context becomes invalid. Their independent SDK
pipelines can cache already-issued tokens; local disconnect does not revoke
those tokens. Toolkit-owned ARM clients enforce validity even with cached
tokens. The custom example checks context validity before and after each read.
Reuse the custom reader for repeated requests rather than reconstructing its
token callback; `context.invalidateTokens()` refreshes that callback's provider.

The ARM scope appends `/.default` to the exact `environment.armResource`.
An audience ending in `/` therefore produces `//.default`: this preserves the
audience's trailing slash when Azure Identity converts the scope to a resource.
Do not normalize token audiences like request endpoints.

For hermetic callers, create an injected-credential auth session and pass a
bound context into the exported example functions. Both `readWithSdk(context,
{ httpClient })` and `readWithOptionalArm(context, { httpClient })` accept a
standard Azure SDK `HttpClient`. The underlying optional APIs accept it as
`createArmClient(context, { httpClient })` or `listArm(context, path,
{ httpClient, signal, maxPages })`; the transport is scoped to that client or
listing, never installed globally. Default ARM clients are memoized per bound
handle. Supplying a transport creates an isolated client and does not replace
or reuse the memoized default. Tests use fake credentials and HTTP transports;
ordinary test execution never invokes the opt-in runner.
