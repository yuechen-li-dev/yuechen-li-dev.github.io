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
    if (block.language === "copeland" || block.language === "typescript") {
      assert.equal(entry, undefined, route + " has an example without expected output");
      entry = block;
    } else if (block.language.startsWith("copeland:")) {
      const file = block.language.slice("copeland:".length);
      assert.match(file, /^[A-Za-z][A-Za-z0-9_-]*\.ts$/, route + " has an invalid companion filename");
      assert.ok(file.toLowerCase() !== "hello.ts" && !companions.has(file.toLowerCase()),
        route + " repeats a companion filename");
      companions.set(file.toLowerCase(), { file, source: block.text });
    } else if (block.language === "output") {
      assert.notEqual(entry, undefined, route + " has output without an example");
      if (entry.language === "typescript") {
        assert.equal(companions.size, 0, route + " has Copeland companions in a TypeScript example");
      }
      examples.push({ route, entry, companions: [...companions.values()], expected: block.text });
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
const examples = chapters.flatMap((plan) =>
  examplesIn(plan.route, codeBlocks(Content(plan.page.id))));
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

let copelandCount = 0;
let typescriptCount = 0;
const scratch = await mkdtemp(join(root, ".tspack", "book-examples-"));
try {
  for (const [index, example] of examples.entries()) {
    const exampleRoot = join(scratch, String(index + 1));
    const label = example.route + " example " + (index + 1);
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
  + ") and on Node (TypeScript: " + typescriptCount + ").");
