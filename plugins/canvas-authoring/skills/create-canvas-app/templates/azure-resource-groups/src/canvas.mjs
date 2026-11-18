import { empty, InputError, validate } from "@microsoft/canvas-toolkit/actions";
import { readFile } from "node:fs/promises";
import { azureIconAssets } from "@microsoft/canvas-toolkit/icons";
import { startCanvasServer } from "@microsoft/canvas-toolkit/server";
import { canvasUiAssets } from "@microsoft/canvas-toolkit/ui";
import { contracts, createDomain } from "./domain.mjs";

const buildInfo = JSON.parse(await readFile(new URL("./build.json", import.meta.url), "utf8"));

export function createApp() {
    const entries = new Map();
    let stopped = false;
    const inputSchema = empty();
    const dispatch = async (entry, name, input) => {
        try { return { ...await entry.domain.actions.dispatch(name, input), build: buildInfo }; }
        catch (error) {
            if (error instanceof InputError) error.statusCode = 400;
            throw error;
        }
    };
    const definition = {
        id: "__CANVAS_NAME__",
        displayName: "__CANVAS_NAME__",
        description: "Read-only Azure resource groups. Select a subscription, then list resource groups.",
        inputSchema,
        actions: Object.entries(contracts).map(([name, contract]) => ({
            name, description: contract.description, inputSchema: contract.input,
            handler(ctx) {
                const entry = entries.get(ctx.instanceId);
                if (stopped || !entry) throw new InputError("Open the canvas before invoking actions.");
                return dispatch(entry, name, ctx.input);
            },
        })),
        async open(ctx) {
            validate(inputSchema, ctx.input ?? {});
            if (stopped) throw new Error("The canvas provider has stopped.");
            let entry = entries.get(ctx.instanceId);
            if (!entry) {
                entry = { domain: createDomain() };
                const current = entry;
                entry.pending = startCanvasServer({
                    dispatch: (name, input) => dispatch(current, name, input),
                    model: () => ({ ...entry.domain.store.snapshot(), build: buildInfo }),
                    subscribe: entry.domain.store.subscribe,
                    maxBody: 4096,
                    assets: [
                        ["", new URL("./web/index.html", import.meta.url)],
                        ["app.js", new URL("./web/app.js", import.meta.url)],
                        ["app.css", new URL("./web/app.css", import.meta.url)],
                        ["build.json", new URL("./build.json", import.meta.url)],
                        // Resource-type SVGs; the build copies them to dist/icons/.
                        ...azureIconAssets,
                        ...canvasUiAssets,
                    ],
                });
                entries.set(ctx.instanceId, entry);
            }
            try {
                const server = await entry.pending;
                if (entries.get(ctx.instanceId) !== entry) throw new Error("The panel closed while opening.");
                return { title: "__CANVAS_NAME__", url: server.url,
                    status: "Build " + buildInfo.id };
            } catch (error) {
                if (entries.get(ctx.instanceId) === entry) {
                    entries.delete(ctx.instanceId);
                    entry.domain.dispose();
                }
                throw error;
            }
        },
        async onClose(ctx) {
            const entry = entries.get(ctx.instanceId);
            if (!entry) return;
            entries.delete(ctx.instanceId);
            entry.domain.dispose();
            await (await entry.pending).close();
        },
    };
    return { definition, async close() {
        stopped = true;
        const results = await Promise.allSettled([...entries.keys()].map(instanceId => definition.onClose({ instanceId })));
        const failures = results.filter(result => result.status === "rejected").map(result => result.reason);
        if (failures.length) throw new AggregateError(failures, "Canvas teardown failed.");
    } };
}
