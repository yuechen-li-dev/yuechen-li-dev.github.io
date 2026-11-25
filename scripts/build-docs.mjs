import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
const { Content, PlanPages, RenderArticle, RenderDirectories } = await import("../docs-compiler/dist/src/Site.node.js");
const { ValidateRoutes } = await import("../docs-compiler/dist/src/Portal.node.js");
const checked = (result) => {
  if (result.tag === "err") throw new Error(result.error);
  return result.value;
};
const files = [...checked(RenderDirectories()), ...checked(PlanPages()).map((plan) =>
  checked(RenderArticle(plan, Content(plan.page.id))))];
checked(ValidateRoutes(files.map(({ path }) => path)));
for (const { path, content } of files) {
  const relative = path.slice(1) + (path.endsWith("/") ? "index.html" : "");
  const file = resolve(root, "dist", relative);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content, "utf8");
}
console.log("Generated " + files.length + " static files with the Copeland docs framework.");
