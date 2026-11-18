// Runs inside npm run build. Generic: no Azure I/O, no edits needed when you rename or add actions.
import assert from "node:assert/strict";
import { registrations } from "./host-double.mjs";
import { app, assertShutdownOwnership } from "../dist/toolkit.mjs";
import { canvasUiAssets } from "../dist/assets/toolkit/ui.mjs";

await import("../dist/extension.mjs");
assertShutdownOwnership();
assert.equal(registrations.length, 1, "Expected one host joinSession registration.");
const [canvas] = registrations[0].canvases;
assert.equal(canvas.id, "__CANVAS_NAME__");
assert.ok(canvas.actions.some(action => action.name === "get_state"),
    "Host entry is not connected. Import attachToolkit and wrap its native createCanvas declaration.");
const ctx = { sessionId: "toolkit-check", extensionId: "test:__CANVAS_NAME__",
    canvasId: "__CANVAS_NAME__", instanceId: "check-panel", input: {},
    host: { capabilities: { "canvas-renderer": true } } };
try {
    const { url } = await canvas.open(ctx);
    assert.equal((await fetch(url)).status, 200);
    const identity = await (await fetch(new URL("build.json", url))).json();
    const state = await canvas.actions.find(action => action.name === "get_state").handler({ ...ctx, input: {} });
    assert.equal(state.build.id, identity.id);
    for (const [route, [, mime]] of [...canvasUiAssets, ["icons/ResourceGroup.svg", [, "image/svg+xml"]]]) {
        const response = await fetch(new URL(route, url));
        assert.equal(response.status, 200, `Missing toolkit asset: ${route}`);
        assert.equal(response.headers.get("content-type"), mime, route);
    }
    await canvas.onClose(ctx);
    console.log("Canvas registration ready (test SDK seam; not native-host or live-Azure proof).");
} finally {
    await app.close();
}
