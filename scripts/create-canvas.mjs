#!/usr/bin/env node
// Repository convenience wrapper; the installable skill owns the implementation.
import { main } from "../plugins/canvas-authoring/skills/create-canvas-app/scripts/setup-toolkit.mjs";
export { scaffold } from "../plugins/canvas-authoring/skills/create-canvas-app/scripts/setup-toolkit.mjs";
import { realpath } from "node:fs/promises";
import { fileURLToPath } from "node:url";

if (process.argv[1] && await realpath(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
