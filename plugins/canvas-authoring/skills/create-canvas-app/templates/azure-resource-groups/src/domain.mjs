import { defineActions, empty, enum_, guid, InputError, obj } from "@microsoft/canvas-toolkit/actions";
import { AuthError, createAzureAuthSession } from "@microsoft/canvas-toolkit/auth";
import { createViewStore } from "@microsoft/canvas-toolkit/state";
import { readResourceGroups } from "./resource-groups.mjs";

export const contracts = {
    get_state: { input: empty(), description: "Read this panel's scope, status and bounded resource groups without Azure I/O." },
    reload_profile: { input: empty(), description: "Load or re-read Azure CLI profile metadata and return the signed-in accounts and subscriptions. The panel also runs it on open and on focus; a call during a running load returns that load's result. Keeps a still-listed subscription and its results; otherwise clears them. No resource query or login." },
    select_subscription: {
        input: obj({ subscriptionId: guid(), tenantId: guid(), cloud: enum_("AzureCloud", "AzureUSGovernment", "AzureChinaCloud") },
            { required: ["subscriptionId", "tenantId", "cloud"] }),
        description: "Validate and select one loaded subscription; do not query it.",
    },
    list_resource_groups: { input: empty(), description: "Read resource groups in the explicitly selected subscription, with 200-row and 10-page limits." },
    cancel: { input: empty(), description: "Cancel this panel's active read without presenting empty success." },
};

function publicError(error) {
    if (error instanceof AuthError || error instanceof InputError) return error;
    console.error("Resource-group lesson: an unexpected operation failed.");
    return new AuthError("operation-failed", "The operation failed unexpectedly. Inspect local diagnostics before retrying.");
}

export function createDomain({ auth = createAzureAuthSession(), httpClient } = {}) {
    const store = createViewStore({ initial: {
        status: "not-loaded", profile: "uninitialized", accounts: [], scope: null, rows: [], error: null,
    } });
    let context;
    let selection;
    let active;
    let generation = 0;
    let disposed = false;
    let profileBusy = false;
    let profileLoad;

    function invalidate() {
        generation++;
        active?.abort();
        active = undefined;
    }
    function clearScope(state) {
        invalidate();
        context = undefined;
        selection = undefined;
        if (!disposed) store.patch({
            profile: state.status, accounts: state.accounts, scope: null, rows: [],
            status: state.error ? "error" : "select-subscription", error: state.error,
        });
    }
    // A profile re-read retires old credentials. Re-bind the selected subscription when it is still listed.
    function reconcile(state) {
        if (!selection || state.status !== "connected") return clearScope(state);
        invalidate();
        try {
            context = auth.bindSubscription(selection);
            const scope = auth.resolveScope({ ...selection, subscriptionIds: [selection.subscriptionId] });
            const kept = store.snapshot().model;
            const complete = kept.status === "complete";
            if (!disposed) store.patch({ profile: state.status, accounts: state.accounts, scope, error: null,
                rows: complete ? kept.rows : [], status: complete ? "complete" : "ready-to-read" });
        } catch {
            clearScope(state);
        }
    }
    // reload_profile reconciles itself; this handles changes that it did not start.
    const unsubscribe = auth.subscribe(({ state }) => { if (!profileBusy) reconcile(state); });
    async function loadProfile() {
        profileBusy = true;
        invalidate();
        if (!selection) store.patch({ status: "loading-profile", error: null });
        try {
            await auth.reloadProfile();
            if (disposed) throw new AuthError("disposed", "This panel has closed.");
            reconcile(auth.getState());
            return store.snapshot();
        } catch (error) {
            const safe = publicError(error);
            if (!disposed) {
                clearScope(auth.getState());
                store.patch({ status: "error", error: { code: safe.code, message: safe.message } });
            }
            throw safe;
        } finally {
            profileBusy = false;
        }
    }
    const handlers = {
        get_state: () => store.snapshot(),
        // A second caller (the panel's open-time load and an agent) joins the running load.
        reload_profile() {
            profileLoad ??= loadProfile().finally(() => { profileLoad = undefined; });
            return profileLoad;
        },
        select_subscription(input) {
            if (profileBusy) throw new InputError("Wait for the profile reload before selecting a subscription.");
            const selected = auth.bindSubscription(input);
            const scope = auth.resolveScope({ ...input, subscriptionIds: [input.subscriptionId] });
            invalidate();
            context = selected;
            selection = { subscriptionId: input.subscriptionId, tenantId: input.tenantId, cloud: input.cloud };
            store.patch({ scope, rows: [], status: "ready-to-read", error: null });
            return store.snapshot();
        },
        async list_resource_groups() {
            if (profileBusy || !context) throw new InputError("Load the profile and explicitly select a subscription first.");
            invalidate();
            const request = new AbortController();
            const started = generation;
            const selected = context;
            active = request;
            store.patch({ status: "loading", rows: [], error: null });
            try {
                const rows = await readResourceGroups(selected, { signal: request.signal, httpClient });
                if (disposed || started !== generation || selected !== context) {
                    throw new AuthError("request-superseded", "The read was cancelled or its scope changed.");
                }
                store.patch({ status: "complete", rows, error: null });
                return store.snapshot();
            } catch (error) {
                const safe = request.signal.aborted
                    ? new AuthError("request-cancelled", "The read was cancelled or its scope changed.")
                    : publicError(error);
                if (!disposed && started === generation) {
                    store.patch({ status: request.signal.aborted ? "cancelled" : "error", rows: [],
                        error: { code: safe.code, message: safe.message } });
                }
                throw safe;
            } finally {
                if (active === request) active = undefined;
            }
        },
        cancel() {
            if (!active) throw new InputError("There is no active resource read to cancel.");
            invalidate();
            store.patch({ status: "cancelled", rows: [], error: null });
            return store.snapshot();
        },
    };
    const actions = defineActions(Object.fromEntries(Object.entries(contracts).map(([name, contract]) => [
        name, { ...contract, run: input => {
            if (disposed) throw new AuthError("disposed", "This panel has closed.");
            return handlers[name](input);
        } },
    ])));
    return {
        store, actions,
        dispose() {
            if (disposed) return;
            disposed = true;
            invalidate();
            unsubscribe();
            auth.dispose();
        },
    };
}
