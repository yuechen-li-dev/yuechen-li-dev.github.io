import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const cli = process.env.COPELAND_CLI ?? resolve(root, ".tspack/copeland/Copeland.Cli.dll");
const { Content, PlanPages } = await import("../docs-compiler/dist/src/Site.node.js");

function codeBlocks(events) {
  const blocks = [];
  let current;

  for (const event of events) {
    if (event.tag === "Open" && event.payload.node.tag === "CodeBlock") {
      current = { language: event.payload.node.payload.language, text: "" };
    } else if (event.tag === "Run" && current) {
      current.text += event.payload.text;
    } else if (event.tag === "Close" && event.payload.node.tag === "CodeBlock") {
      blocks.push(current);
      current = undefined;
    }
  }

  return blocks;
}

function examplesIn(route, blocks) {
  const examples = [];
  const companions = new Map();
  let entry;

  for (const block of blocks) {
    if (block.language === "copeland" || block.language === "typescript" || block.language === "copeland-template") {
      assert.equal(entry, undefined, route + " has an example without expected output");
      entry = block;
    } else if (block.language.startsWith("copeland:")) {
      const file = block.language.slice("copeland:".length);
      assert.match(file, /^[A-Za-z][A-Za-z0-9_-]*\.ts$/, route + " has an invalid companion filename");
      assert.ok(file.toLowerCase() !== "hello.ts" && !companions.has(file.toLowerCase()),
        route + " repeats a companion filename");
      companions.set(file.toLowerCase(), { file, source: block.text });
    } else if (block.language === "output" || block.language.startsWith("file:")) {
      assert.notEqual(entry, undefined, route + " has output without an example");
      const artifact = block.language.startsWith("file:") ? block.language.slice("file:".length) : undefined;
      assert.equal(entry.language === "copeland-template", artifact !== undefined,
        route + " must use file output for a construction template");
      if (artifact !== undefined) {
        assert.match(artifact, /^[A-Za-z][A-Za-z0-9_.-]*$/, route + " has an invalid generated filename");
      }
      if (entry.language !== "copeland") {
        assert.equal(companions.size, 0, route + " has companions without a Copeland program");
      }
      examples.push({ route, entry, companions: [...companions.values()], expected: block.text, artifact });
      companions.clear();
      entry = undefined;
    } else if (block.language === "node-test") {
      assert.equal(entry, undefined, route + " must put the test after the expected output");
      assert.equal(companions.size, 0, route + " must put the test before the next companion source");
      const example = examples.at(-1);
      assert.equal(example?.entry.language, "copeland", route + " has a test without a Copeland example");
      assert.equal(example.test, undefined, route + " repeats the test for a Copeland example");
      example.test = block.text;
    }
  }

  assert.equal(entry, undefined, route + " has an example without expected output");
  assert.equal(companions.size, 0, route + " has a companion without an example");
  return examples;
}

const plans = PlanPages();
assert.equal(plans.tag, "ok", plans.error);
const chapters = plans.value.filter((plan) => plan.route.startsWith("/copeland-ts/book/"));
const first = chapters.find((plan) => plan.page.slug === "first-program");
assert.ok(first, "The book must include its first program");
const setup = codeBlocks(Content(first.page.id))
  .filter((block) => block.language === "xml" || block.language === "tsx");
assert.deepEqual(setup.map((block) => block.language), ["xml", "tsx", "tsx"],
  "The first chapter must publish the project, workspace config, and manifest in order");
const files = ["Book.csproj", "tsconfig.tsx", "manifest.tsx"];
const packageRoutes = new Set(["npm-packages", "nuget-packages"]);
const examples = chapters.flatMap((plan) =>
  packageRoutes.has(plan.page.slug) ? [] : examplesIn(plan.route, codeBlocks(Content(plan.page.id))));
assert.ok(examples.length > 0, "The book must publish runnable examples");

const targets = [
  { name: "node", runner: process.execPath, artifact: "dist/main.js" },
  { name: "clr", runner: "dotnet", artifact: "dist/clr/app.dll" },
];

function checkOutput(exampleRoot, runner, artifact, expected, label) {
  const actual = execFileSync(runner, [artifact],
    { cwd: exampleRoot, encoding: "utf8", timeout: 10000 });
  assert.equal(actual.replaceAll("\r\n", "\n"), expected.replaceAll("\r\n", "\n") + "\n", label);
  console.log("Verified " + label);
}

function packageRecipe(slug, languages) {
  const chapter = chapters.find((plan) => plan.page.slug === slug);
  assert.ok(chapter, "Missing package chapter " + slug);
  const blocks = codeBlocks(Content(chapter.page.id)).filter((block) => languages.includes(block.language));
  assert.deepEqual(blocks.map((block) => block.language), languages, "Unexpected recipe blocks in " + slug);
  return blocks.map((block) => block.text);
}

async function checkPackageRecipes(scratch) {
  const [manifest, identity, workspace, npmSource, npmOutput, emittedJs] = packageRecipe("npm-packages",
    ["tsx", "xml", "tsx", "copeland-npm", "output", "javascript"]);
  const npmRoot = join(scratch, "npm-package");
  const compiler = process.platform === "win32" ? cli.replace(/\.dll$/, ".exe") : cli.replace(/\.dll$/, "");
  const compilerPath = JSON.stringify(resolve(compiler).replaceAll("\\", "/"));
  await mkdir(join(npmRoot, "src"), { recursive: true });
  await writeFile(join(npmRoot, "manifest.tsx"),
    manifest.replace('"./tools/Copeland.Cli"', compilerPath), "utf8");
  await writeFile(join(npmRoot, "Queue.csproj"), identity, "utf8");
  await writeFile(join(npmRoot, "tsconfig.tsx"), workspace, "utf8");
  await writeFile(join(npmRoot, "src", "Main.ts"), npmSource, "utf8");
  const tspack = process.env.TSPACK_BIN ?? "tspack";
  for (const args of [["update"], ["sync"], ["build", "node"]]) {
    execFileSync(tspack, args, { cwd: npmRoot, timeout: 90000, stdio: "inherit" });
  }
  checkOutput(npmRoot, process.execPath, "dist/main.js", npmOutput, "npm book recipe (Node)");
  const generatedJs = await readFile(join(npmRoot, "dist", "src", "Main.js"), "utf8");
  const importLine = emittedJs.split("\n")[0].trim();
  assert.match(importLine, /^import /);
  assert.ok(generatedJs.includes(importLine), "Expected a direct ESM import in the npm recipe");

  const [project, nugetSource, host, nugetOutput, directCall] = packageRecipe("nuget-packages",
    ["xml", "copeland-nuget", "csharp", "output", "csharp"]);
  const nugetRoot = join(scratch, "nuget-package");
  await mkdir(nugetRoot);
  await writeFile(join(nugetRoot, "Queue.csproj"), project, "utf8");
  await writeFile(join(nugetRoot, "QueueJson.ts"), nugetSource, "utf8");
  await writeFile(join(nugetRoot, "Program.cs"), host, "utf8");
  const dotnetOptions = {
    cwd: nugetRoot,
    encoding: "utf8",
    timeout: 90000,
    env: { ...process.env, NUGET_PACKAGES: join(scratch, "nuget-cache") },
  };
  execFileSync("dotnet", ["restore"], { ...dotnetOptions, stdio: "inherit" });
  const actual = execFileSync("dotnet", ["run", "--no-restore"], dotnetOptions);
  assert.equal(actual.replaceAll("\r\n", "\n"), nugetOutput + "\n", "NuGet book recipe (.NET)");
  const generatedCs = await readFile(join(nugetRoot, "obj", "Debug", "net10.0", "Copeland", "QueueJson.g.cs"), "utf8");
  assert.ok(generatedCs.includes(directCall), "Expected a direct CLR call in the NuGet recipe");
  console.log("Verified NuGet book recipe (.NET)");
}

let copelandCount = 0;
let typescriptCount = 0;
let templateCount = 0;
const scratch = await mkdtemp(join(root, ".tspack", "book-examples-"));
try {
  await checkPackageRecipes(scratch);
  for (const [index, example] of examples.entries()) {
    const exampleRoot = join(scratch, String(index + 1));
    const label = example.route + " example " + (index + 1);
    if (example.artifact !== undefined) {
      await mkdir(exampleRoot);
      await writeFile(join(exampleRoot, "Presets.ts"), example.entry.text, "utf8");
      execFileSync("dotnet", [cli, "template", "materialize", "Presets.ts", "--entry", "Example", "--output", "preset-preview"],
        { cwd: exampleRoot, stdio: "inherit", timeout: 90000 });
      const actual = await readFile(join(exampleRoot, "preset-preview", example.artifact), "utf8");
      assert.equal(actual, example.expected.replaceAll("\r\n", "\n"), label);
      console.log("Verified " + label + " (template artifact)");
      templateCount += 1;
      continue;
    }
    await mkdir(join(exampleRoot, "src"), { recursive: true });
    await writeFile(join(exampleRoot, "src", "Hello.ts"), example.entry.text, "utf8");
    if (example.entry.language === "typescript") {
      const tsc = createRequire(import.meta.url).resolve("typescript/lib/tsc.js");
      execFileSync(process.execPath, [tsc, "--strict", "--skipLibCheck", "--target", "ES2022",
        "--module", "NodeNext", "--outDir", "dist", "src/Hello.ts"],
        { cwd: exampleRoot, timeout: 90000 });
      checkOutput(exampleRoot, process.execPath, "dist/Hello.js", example.expected, label + " (TypeScript, Node)");
      typescriptCount += 1;
      continue;
    }
    for (const [fileIndex, file] of files.entries()) {
      await writeFile(join(exampleRoot, file), setup[fileIndex].text, "utf8");
    }
    for (const companion of example.companions) {
      await writeFile(join(exampleRoot, "src", companion.file), companion.source, "utf8");
    }
    for (const target of targets) {
      const targetLabel = label + " (" + target.name + ")";
      const result = join(exampleRoot, "obj", target.name + ".json");
      try {
        execFileSync("dotnet", [cli, "build", "--standalone", ".", "--target", target.name, "--result", result],
          { cwd: exampleRoot, timeout: 90000 });
      } catch (error) {
        const diagnostics = await readFile(result, "utf8").catch(() => error.message);
        throw new Error(targetLabel + " did not compile\n" + diagnostics, { cause: error });
      }
      checkOutput(exampleRoot, target.runner, target.artifact, example.expected, targetLabel);
    }
    if (example.test !== undefined) {
      const testFile = "example.test.mjs";
      await writeFile(join(exampleRoot, testFile), example.test, "utf8");
      execFileSync(process.execPath, ["--test", testFile],
        { cwd: exampleRoot, stdio: "inherit", timeout: 45000 });
      console.log("Verified the published test for " + label);
    }
    copelandCount += 1;
  }
} finally {
  await rm(scratch, { recursive: true, force: true });
}
console.log("Verified published examples on Node and .NET (Copeland: " + copelandCount
  + ") and on Node (TypeScript: " + typescriptCount + "); materialized templates: " + templateCount + ".");
