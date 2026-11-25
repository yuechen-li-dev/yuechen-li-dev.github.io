export function Modules(): Document {
    return <Document>
        <Paragraph>In [Values and functions](/copeland-ts/book/values-and-functions/), one file both decides whether a task fits today and prints the results. Put the scheduling rule in its own module. The application entry point can call it, and the same source can be built for Node and .NET.</Paragraph>
        <Heading level="2">Choose what each module exports</Heading>
        <Paragraph>Save the rule and its label as `src/Tasks.ts`. Export `QueueLabel` as the public function. `FitsToday` stays in the same module as an implementation detail. Both functions keep their parameter and return types from the earlier chapter.</Paragraph>
        <CodeBlock language="copeland:Tasks.ts">
function FitsToday(available: int, estimate: int): boolean {
    return estimate > 0 && estimate <= available;
}

export function QueueLabel(available: int, estimate: int): string {
    return if FitsToday(available, estimate) {
        "schedule today"
    } else {
        "defer"
    };
}
        </CodeBlock>
        <Paragraph>Replace `src/Hello.ts` with the application entry module. Its job is to choose inputs and assemble the output. The workspace from [Your first program](/copeland-ts/book/first-program/) already includes both files because both live under `src`. The manifest chooses `src/Hello.ts` as the entry file.</Paragraph>
        <CodeBlock language="copeland">
import { QueueLabel } from "./Tasks";

export function Main(): string {
    return String.Join([
        "Under budget: " + QueueLabel(5, 2),
        "Exact fit: " + QueueLabel(5, 5),
        "Over budget: " + QueueLabel(5, 6),
        "No time left: " + QueueLabel(0, 2),
        "Zero estimate: " + QueueLabel(5, 0),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Under budget: schedule today
Exact fit: schedule today
Over budget: defer
No time left: defer
Zero estimate: defer
        </CodeBlock>
        <Paragraph>Read the import as a request for the public name `QueueLabel` from the sibling module `./Tasks`. To see the boundary at work, temporarily remove `export` from `QueueLabel` and rebuild. Check the build report for the failed import, then restore the export. This lets you change the private predicate later while callers keep the same typed interface.</Paragraph>
        <Heading level="2">Switch the build target</Heading>
        <Paragraph>The workspace declares two targets, named `node` and `clr`. Run both builds from the project directory. The source, workspace, and manifest stay the same. The value after `--target` tells the compiler which backend and runtime settings to use. Each build writes its own artifact and diagnostic report.</Paragraph>
        <CodeBlock language="console">
tscl build --standalone . --target node --result obj/node.json
node dist/main.js

tscl build --standalone . --target clr --result obj/clr.json
dotnet dist/clr/app.dll
        </CodeBlock>
        <Paragraph>Both runs print the same five lines. The Node target emits JavaScript. The CLR target builds the .NET application that `dotnet` runs. The scheduling rule is portable because it only uses Copeland integers, booleans, and strings. The matching output verifies the rule here. To decide which target runs a real workload faster, measure that workload on both targets.</Paragraph>
        <Heading level="2">Test both builds with the same expectations</Heading>
        <Paragraph>Save this as `queue.test.mjs` beside `Book.csproj`. It uses Node’s built-in test runner to launch both applications from the project directory. Each test compares one application’s output against the five expected lines. Checking both outputs against an expectation catches a shared mistake as well as a difference between targets. [Node test runner](https://nodejs.org/api/test.html#running-tests-from-the-command-line).</Paragraph>
        <CodeBlock language="node-test">
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

const expected = [
    "Under budget: schedule today",
    "Exact fit: schedule today",
    "Over budget: defer",
    "No time left: defer",
    "Zero estimate: defer",
].join("\n") + "\n";

const targets = [
    { name: "Node", command: process.execPath, artifact: "dist/main.js" },
    { name: ".NET", command: "dotnet", artifact: "dist/clr/app.dll" },
];

for (const { name, command, artifact } of targets) {
    test(name + " follows the scheduling rule", () => {
        const output = execFileSync(command, [artifact], {
            encoding: "utf8",
            timeout: 10000,
        });
        assert.equal(output.replaceAll("\r\n", "\n"), expected);
    });
}
        </CodeBlock>
        <Paragraph>After rebuilding both targets with the commands above, run the test from the project directory.</Paragraph>
        <CodeBlock language="console">
node --test queue.test.mjs
        </CodeBlock>
        <Paragraph>You should see two passing tests. To check that the tests catch a change in behavior, change the fit comparison in `src/Tasks.ts` to strict less-than, rebuild both targets, and run the tests again. The exact-fit expectation fails on both. Restore the original comparison and rebuild both artifacts to make the tests pass again.</Paragraph>
        <Heading level="2">Where Node dependencies fit</Heading>
        <Paragraph>Use your regular Node package and test tooling with the JavaScript output. When Copeland source calls into an npm package, it crosses a declared interop contract. A call to a Node API still needs Node. Keep portable logic in ordinary Copeland modules so you can build it for .NET separately from its host-specific callers.</Paragraph>
        <Paragraph>The [Node migration guide](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/authoring/incremental-migration.md) walks through moving one export in an existing TypeScript project.</Paragraph>
        <Heading level="2">Test through the target you ship</Heading>
        <Paragraph>The tests above exercise the program at its entry point. When you want to test individual functions or integrate with an existing project, use the test runner that matches the boundary.</Paragraph>
        <List>
            <Item><Paragraph>For Node, build the project first. Use your JavaScript test runner against the emitted modules. A build with `--node-interop` adds a Node facade for supported typed boundaries such as record arguments.</Paragraph></Item>
            <Item><Paragraph>For .NET, put Copeland tests in `.tsxtest` files in an SDK test project and run `dotnet test`. Those tests use xUnit through the CLR.</Paragraph></Item>
            <Item><Paragraph>If the workspace uses TSPack native xTest, write `.xtest.tsx` suites for the emitted JavaScript boundary.</Paragraph></Item>
        </List>
        <Paragraph>As the queue grows, add cases from the earlier chapters. Check promotion across the urgent threshold, an empty task list, or a rejected task name. Assert the observable outcome and its data. Those expectations can stay the same even when the test runners differ.</Paragraph>
        <Paragraph>For host contracts and compiler diagnostics, use the [authoring guide](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/authoring/copeland-typescript-guide.md).</Paragraph>
        <Paragraph>Next, apply payload enums and match to a UI in [Model a loading screen](/copeland-ts/book/model-ui-state/).</Paragraph>
    </Document>;
}
