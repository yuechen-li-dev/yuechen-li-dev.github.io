import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderPortal } from "./portal.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const compiler = resolve(root, "docs-compiler");
const cli = process.env.COPELAND_CLI ?? resolve(root, ".tspack/copeland/Copeland.Cli.dll");
await access(cli);
await access(resolve(root, "dist/aetheris/index.html"));
const result = resolve(root, ".tspack/docs-compiler.json");
await mkdir(dirname(result), { recursive: true });
await rm(result, { force: true });
try {
  execFileSync("dotnet", [
    cli, "build", "--standalone", compiler, "--target", "node", "--node-interop", "--result", result,
  ], { cwd: root, stdio: "inherit" });
} catch (error) {
  console.error(await readFile(result, "utf8").catch(() => "Copeland did not write a build result."));
  throw error;
}
const engine = await import("../docs-compiler/dist/src/Portal.node.js");
const registry = JSON.parse(await readFile(resolve(root, "content/projects.json"), "utf8"));
const pages = await renderPortal(engine, registry);
for (const [route, html] of pages) {
  const relative = route === "/404.html" ? "404.html" : route.slice(1) + "index.html";
  const file = resolve(root, "dist", relative);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html, "utf8");
}
console.log("Rendered " + pages.size + " pages with the Copeland docs compiler.");
