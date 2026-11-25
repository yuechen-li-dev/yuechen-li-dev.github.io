import { execFileSync } from "node:child_process";
import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL(".", import.meta.url));
const compiler = process.env.COPELAND_CLI;
const argumentsForBuild = [
  "build", "--standalone", ".", "--target", "node", "--node-interop", "--result", "obj/build.json",
];

try {
  execFileSync(compiler ? "dotnet" : "tscl", compiler
    ? [resolve(compiler), ...argumentsForBuild]
    : argumentsForBuild, { cwd: project, stdio: "inherit" });
} catch (error) {
  console.error("Could not build the article panel. Check that tscl is on PATH or COPELAND_CLI names the compiler DLL.");
  throw error;
}

cpSync(new URL("./web/", import.meta.url), new URL("./dist/", import.meta.url), { recursive: true });
console.log("Built the article panel in dist/.");
