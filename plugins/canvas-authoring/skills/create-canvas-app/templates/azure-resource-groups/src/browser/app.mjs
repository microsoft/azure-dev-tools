import "@microsoft/canvas-toolkit/ui/styles.css";
import "@microsoft/canvas-toolkit/ui/base.css";
import "@microsoft/canvas-toolkit/ui/subscription-picker.css";
import { createAzureSubscriptionPicker } from "@microsoft/canvas-toolkit/ui/azure-subscription-picker";
import {
    Blankslate, Button, CanvasFooter, CodeBlock, CanvasHeader, CanvasShell, DetailPanel, DomContent,
    FilterToolbar, KeyValueList, ListDetail, MessageBar, Spinner, createElement as h, mountCanvasComponent, useState,
} from "@microsoft/canvas-toolkit/ui/dom";
import { formatAzureLocation } from "@microsoft/canvas-toolkit/ui/locations";
import { GENERIC_ICON, iconForType } from "@microsoft/canvas-toolkit/icons";
import "./app.css";

let version = -1;
let pending = 0;
let fileBuild;
const view = { model: null, build: null, ready: false, connection: "Connecting...", error: null };

const picker = createAzureSubscriptionPicker({
    id: "builder-subscription", selectionMode: "single",
    // Re-read local CLI metadata when the user returns, for example after az login.
    refreshOnFocus: true,
    transport: async () => {
        const snapshot = await act("reload_profile", {});
        return { accounts: snapshot.model.accounts, error: snapshot.model.error, revision: snapshot.version };
    },
    onApply: scope => act("select_subscription", {
        subscriptionId: scope.subscriptionIds[0], tenantId: scope.tenantId, cloud: scope.cloud,
    }),
});
picker.trigger.id = "scope";
const run = name => () => act(name, {}).catch(showError);

// Decorative resource-type icon served by the canvas from azureIconAssets.
function ResourceIcon({ type, kind }) {
    const key = iconForType(type, kind) || GENERIC_ICON;
    return h("img", { className: "rg-icon", src: `icons/${key}.svg`, alt: "", width: 16, height: 16 });
}
const RESOURCE_GROUP = "microsoft.resources/resourcegroups";

function statusText(model) {
    if (model.status === "complete") {
        return `${model.rows.length} resource groups loaded.`;
    }
    return {
        "not-loaded": "Checking Azure CLI sign-in...",
        "loading-profile": "Checking Azure CLI sign-in...",
        "select-subscription": "Select a subscription.",
        "ready-to-read": "Ready to list resource groups.",
        loading: "Listing resource groups...",
        cancelled: "Read cancelled. No results are shown.",
        error: "The last operation failed.",
    }[model.status] ?? model.status;
}

function Details({ row, scope }) {
    return h(DetailPanel, { title: row.name, status: "Resource group" },
        h(KeyValueList, { items: [
            { label: "Location", value: formatAzureLocation(row.location) },
            { label: "Subscription", value: scope?.subscriptions.map(item => item.name).join(", ") ?? "" },
            { label: "Resource ID", value: h("code", null, row.id) },
        ] }));
}

function Results({ model }) {
    const [filters, setFilters] = useState({ location: [] });
    const locations = [...new Set(model.rows.map(row => row.location))].sort();
    const rows = model.rows.filter(row => !filters.location?.length || filters.location.includes(row.location));
    return h(ListDetail, {
        title: "Resource groups", searchLabel: "Search resource groups", emptyMessage: "No resource groups match the filters.",
        items: rows.map(row => ({ value: row.id, title: row.name, description: formatAzureLocation(row.location),
            icon: h(ResourceIcon, { type: row.type ?? RESOURCE_GROUP }) })),
        filters: h(FilterToolbar, {
            facets: [{ id: "location", label: "Location",
                options: locations.map(value => ({ value, label: formatAzureLocation(value) })) }],
            values: filters, onFiltersChange: (_event, data) => setFilters(data.values), resultCount: rows.length,
        }),
    }, value => {
        const row = model.rows.find(item => item.id === value);
        return row ? h(Details, { row, scope: model.scope }) : null;
    });
}

// Signed out or CLI missing: give the az login command and a "Check again" action.
function SignIn({ busy, detail }) {
    const [copied, setCopied] = useState(false);
    const copy = () => navigator.clipboard?.writeText("az login").then(() => setCopied(true), () => setCopied(false));
    return h(Blankslate, { id: "sign-in", title: "Sign in to Azure",
        action: h(Button, { id: "check-again", appearance: "primary", disabled: busy, onClick: run("reload_profile") }, "Check again") },
    h("p", null, "This canvas uses your Azure CLI sign-in. Run this command in a terminal, then check again."),
    h(CodeBlock, { label: "Sign-in command", language: "Terminal",
        actions: h(Button, { id: "copy-login", appearance: "subtle", size: "small", onClick: copy }, copied ? "Copied" : "Copy") },
    "az login"),
    detail ? h("p", { id: "sign-in-detail", className: "rg-hint" }, detail) : null,
    h("p", { className: "rg-hint" }, "Azure CLI not installed? See ",
        h("a", { href: "https://aka.ms/installazurecli", target: "_blank", rel: "noreferrer" }, "aka.ms/installazurecli"), "."));
}

function Content({ model, busy }) {
    if (model.status === "complete" && model.rows.length) return h(Results, { key: model.scope?.subscriptions[0]?.id, model });
    if (model.status === "complete") {
        return h(Blankslate, { title: "No resource groups" }, "The selected subscription has no resource groups you can read.");
    }
    if (model.profile !== "connected") {
        if (model.status === "error") return h(SignIn, { busy, detail: model.error?.message });
        return h(Blankslate, { id: "profile-loading", title: "Checking Azure sign-in",
            action: h(Spinner, { size: "small", label: "Checking Azure sign-in" }) },
            "Reading local Azure CLI metadata. This does not sign in or query resources.");
    }
    if (model.status === "error" || model.status === "cancelled") return null;
    if (!model.scope) {
        return h(Blankslate, { title: "Select a subscription",
            action: h(Button, { appearance: "primary", disabled: busy, onClick: () => picker.open() }, "Select subscription") },
        "Choose one subscription. Nothing is read until you list resource groups.");
    }
    if (model.status === "loading") return h(Blankslate, { title: "Listing resource groups" }, "Reading up to 200 rows.");
    return h(Blankslate, { title: "Ready to list",
        action: h(Button, { appearance: "primary", disabled: busy, onClick: run("list_resource_groups") }, "List resource groups") },
    `Subscription: ${model.scope.subscriptions.map(item => item.name).join(", ")}`);
}

function App({ model, build, ready, connection, error, stale }) {
    const loading = model?.status === "loading";
    const busy = !ready || pending > 0 || loading || model?.status === "loading-profile";
    picker.trigger.disabled = !ready || model?.profile !== "connected" || model?.status === "loading-profile";
    // The sign-in state shows the profile error itself.
    const signedOut = model?.profile !== "connected" && model?.status === "error";
    const shownError = error ?? (signedOut ? null : model?.error);
    return h(CanvasShell, {
        className: "rg-shell",
        header: h(CanvasHeader, {
            title: "Azure resource groups",
            icon: h(ResourceIcon, { type: RESOURCE_GROUP }),
            actions: h("span", { className: "ct-actions" },
                h(DomContent, { element: picker.trigger }),
                loading
                    ? h(Button, { id: "cancel", appearance: "secondary", disabled: !ready, onClick: run("cancel") }, "Cancel")
                    : h(Button, { id: "list", appearance: "primary", disabled: busy || !model?.scope,
                        onClick: run("list_resource_groups") }, "List resource groups")),
        }),
        footer: h(CanvasFooter, { version: h("span", { id: "build" }, build ? "Build " + build.id : "Build loading...") },
            h("span", { id: "status", className: "rg-footer-item", role: "status" }, model ? statusText(model) : "Loading..."),
            h("span", { id: "connection", className: "rg-footer-item", role: "status" }, connection),
            model?.profile === "connected" && model.accounts[0]
                ? h("span", { id: "account", className: "rg-footer-item" }, "Azure CLI: " + model.accounts[0].accountName) : null,
            h("span", { className: "rg-footer-item" }, "Read-only. Maximum 200 rows.")),
    }, h("div", { className: "rg-content" },
        stale ? h(MessageBar, { id: "stale", intent: "warning", title: "This canvas was updated." },
            "Ask Copilot to reload extensions, then reopen this canvas.") : null,
        shownError ? h(MessageBar, { id: "error", intent: "error" }, shownError.message) : null,
        model?.status === "cancelled" ? h(MessageBar, { intent: "info",
            actions: h(Button, { appearance: "secondary", onClick: run("list_resource_groups") }, "List again") },
        "The read was cancelled. No results are shown.") : null,
        model ? h(Content, { model, busy }) : null));
}

const app = mountCanvasComponent(document.getElementById("app"), App, view);
function update(next) {
    Object.assign(view, next);
    app.update({ ...view });
}
function showError(error) { update({ error: { message: error.message } }); }

function render(snapshot) {
    if (snapshot.version < version) return;
    version = snapshot.version;
    const stale = fileBuild && fileBuild.id !== snapshot.build.id;
    update({ model: snapshot.model, build: snapshot.build, ready: true,
        error: null, stale: Boolean(stale) });
    picker.setState({ accounts: snapshot.model.accounts, scope: snapshot.model.scope, revision: snapshot.version,
        loading: snapshot.model.status === "loading-profile", error: snapshot.model.error,
        // A focus re-read would cancel an active read, so pause it.
        refreshDisabledReason: snapshot.model.status === "loading" ? "Wait for the resource read to finish." : null });
}
async function request(route, options) {
    const response = await fetch(new URL(route, location.href), options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message ?? `Request failed: ${response.status}`);
    return result;
}
async function refresh() {
    try { render(await request("api/state")); }
    catch (error) { update({ ready: false }); showError(error); }
}
async function act(name, input) {
    pending++;
    update({ error: null });
    try {
        const snapshot = await request("api/action", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, input }),
        });
        render(snapshot);
        return snapshot;
    } finally {
        pending--;
        update({});
    }
}
const events = new EventSource(new URL("events", location.href));
events.addEventListener("change", refresh);
events.onopen = () => update({ connection: "Connected" });
events.onerror = () => update({ ready: false, connection: "Connection lost; reconnecting..." });
window.addEventListener("pagehide", () => { events.close(); picker.destroy(); app.dispose(); });
try {
    fileBuild = await request("build.json");
    await refresh();
    // Profile metadata is local and read-only, so load it without a click.
    if (view.model?.profile === "uninitialized") await act("reload_profile", {}).catch(showError);
} catch (error) {
    showError(error);
}
