// SDK protocol fixture, NOT output from a current native scaffold tool.
// The native tool is unavailable in this session; no live-host claim is made.
export function hostEntry(name, { connected = false, unusedImport = false } = {}) {
    return `${connected || unusedImport ? 'import { attachToolkit } from "./toolkit.mjs";\n' : ""}import { createCanvas, joinSession } from "@github/copilot-sdk/extension";

const native = {
    id: ${JSON.stringify(name)},
    displayName: "Native title",
    description: "Native metadata remains host-owned.",
    actions: [{ name: "example_action", handler: ctx => ({ instanceId: ctx.instanceId }) }],
    open: async ctx => ({ title: "Native title", url: "http://127.0.0.1:1/", host: ctx.host }),
    onClose: async ctx => { globalThis.nativeCloseContext = ctx; },
};
const session = await joinSession({
    canvases: [createCanvas(${connected ? "attachToolkit(native)" : "native"})],
    tools: [],
});
globalThis.nativeSession = session;
`;
}
