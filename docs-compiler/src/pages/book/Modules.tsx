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
        <Paragraph>Keep backend-specific work at explicit boundaries. The first program uses the JavaScript backend and Node. The Copeland SDK can also compile source for a .NET project. Operations using host APIs need the corresponding target and contract.</Paragraph>
        <Heading level="2">Test through the target you ship</Heading>
        <List>
            <Item><Paragraph>For Node, build the project first. Use your JavaScript test runner against the emitted modules. A build with `--node-interop` adds a Node facade for supported typed boundaries such as record arguments.</Paragraph></Item>
            <Item><Paragraph>For .NET, put Copeland tests in `.tsxtest` files in an SDK test project and run `dotnet test`. Those tests use xUnit through the CLR.</Paragraph></Item>
            <Item><Paragraph>If the workspace uses TSPack native xTest, write `.xtest.tsx` suites for the emitted JavaScript boundary.</Paragraph></Item>
        </List>
        <Heading level="2">Then exercise the queue</Heading>
        <Paragraph>Good first tests cover promotion across the urgent threshold, an empty task list, and a rejected task name. Assert which result you got and what it carries. Those observations express the same contract in each runner.</Paragraph>
        <Paragraph>For host contracts and compiler diagnostics, use the [authoring guide](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/authoring/copeland-typescript-guide.md). Return to [the book](/copeland-ts/book/) to revisit a chapter.</Paragraph>
    </Document>;
}
