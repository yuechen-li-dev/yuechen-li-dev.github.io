export function Modules(): Document {
    return <Document>
        <Paragraph>The book’s programs so far fit in one file. As the queue grows, put the task model and its operations into a module and give callers the public functions they need.</Paragraph>
        <Heading level="2">Choose what each module exports</Heading>
        <Paragraph>Save the task record and its operation as `src/Tasks.ts`. Export both so callers can use the model and the function.</Paragraph>
        <CodeBlock language="copeland:Tasks.ts">
export record Task {
    title: string;
    priority: int;
}

export function Promote(task: Task): Task {
    return task with { priority: task.priority + 1 };
}
        </CodeBlock>
        <Paragraph>Replace `src/Hello.ts` with this entry module. Both files belong in the Copeland ownership glob.</Paragraph>
        <CodeBlock language="copeland">
import { Promote, Task } from "./Tasks";

export function Main(): string {
    const task: Task = { title: "Ship the docs", priority: 4 };
    const promoted: Task = Promote(task);
    return `${promoted.title} has priority ${promoted.priority}`;
}
        </CodeBlock>
        <CodeBlock language="output">
Ship the docs has priority 5
        </CodeBlock>
        <Paragraph>Run the same build and Node commands. Then remove the export from Promote and build again. A named import requires a public declaration in the module on the other side.</Paragraph>
        <Heading level="2">Switch the build target</Heading>
        <Paragraph>The workspace from chapter one already declares both targets. Change the build selector from `node` to `clr`, then run the .NET artifact with dotnet.</Paragraph>
        <CodeBlock language="console">
tscl build --standalone . --target clr --result obj/build.json
dotnet dist/clr/app.dll
        </CodeBlock>
        <Paragraph>Both runs print the same task title and priority. The task model and its operations compile for both targets as written. The runtime choice gives you another way to run and benchmark that code. Measure the work you care about on the targets you plan to ship.</Paragraph>
        <Heading level="2">Where Node dependencies fit</Heading>
        <Paragraph>Use your regular Node package and test tooling with the JavaScript output. When Copeland source calls into an npm package, it crosses a declared interop contract. A call to a Node API still needs Node. Keep portable logic in ordinary Copeland modules so you can build it for .NET separately from its host-specific callers.</Paragraph>
        <Paragraph>The [Node migration guide](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/authoring/incremental-migration.md) walks through moving one export in an existing TypeScript project.</Paragraph>
        <Heading level="2">Test through the target you ship</Heading>
        <List>
            <Item><Paragraph>For Node, build the project first. Use your JavaScript test runner against the emitted modules. A build with `--node-interop` adds a Node facade for supported typed boundaries such as record arguments.</Paragraph></Item>
            <Item><Paragraph>For .NET, put Copeland tests in `.tsxtest` files in an SDK test project and run `dotnet test`. Those tests use xUnit through the CLR.</Paragraph></Item>
            <Item><Paragraph>If the workspace uses TSPack native xTest, write `.xtest.tsx` suites for the emitted JavaScript boundary.</Paragraph></Item>
        </List>
        <Heading level="2">Then exercise the queue</Heading>
        <Paragraph>Good first tests cover promotion across the urgent threshold, an empty task list, and a rejected task name. Assert which result you got and what it carries. Those observations express the same contract in each runner.</Paragraph>
        <Paragraph>For host contracts and compiler diagnostics, use the [authoring guide](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/authoring/copeland-typescript-guide.md).</Paragraph>
        <Paragraph>Next, apply payload enums and match to a UI in [Model a loading screen](/copeland-ts/book/model-ui-state/).</Paragraph>
    </Document>;
}
