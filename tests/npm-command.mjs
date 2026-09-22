import { realpath, stat } from "node:fs/promises";
import path from "node:path";

export async function npmCommand({ node = process.execPath, env = process.env, platform = process.platform } = {}) {
    const directories = [path.dirname(node), ...(env.PATH ?? env.Path ?? "").split(platform === "win32" ? ";" : ":")].filter(Boolean);
    const candidates = [
        env.npm_execpath,
        ...directories.flatMap(directory => [
            path.join(directory, "node_modules/npm/bin/npm-cli.js"),
            path.resolve(directory, "../lib/node_modules/npm/bin/npm-cli.js"),
            ...(platform === "win32" ? [] : [path.join(directory, "npm")]),
        ]),
    ].filter(Boolean);
    for (const candidate of candidates) {
        try {
            const cli = await realpath(candidate);
            if (path.basename(cli) === "npm-cli.js" && (await stat(cli)).isFile()) {
                // Execute JavaScript directly, never npm.cmd or a shell command.
                return { file: node, args: [cli] };
            }
        } catch (error) {
            if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error;
        }
    }
    throw new Error("Cannot locate npm-cli.js. Set npm_execpath to your npm installation's bin/npm-cli.js.");
}
