export function Records(): Document {
    return <Document>
        <Paragraph>A task has a title and a priority. A named record gives that shape a stable identity you can use in function signatures.</Paragraph>
        <Heading level="2">Promote a task</Heading>
        <Paragraph>The Promote function returns a task with a higher priority. Its `with` expression preserves the record type and substitutes the fields you name. The input task keeps its original priority.</Paragraph>
        <CodeBlock language="copeland">
record Task {
    title: string;
    priority: int;
}

function Promote(task: Task): Task {
    return task with { priority: task.priority + 1 };
}

function UrgentTitles(tasks: Task[]): string[] {
    const titles = MutableList<string>();
    for (const task of tasks) {
        if (task.priority >= 5) {
            titles.append(task.title);
        }
    }

    return titles.freeze();
}

export function Main(): string {
    const original: Task = { title: "Write tests", priority: 4 };
    const promoted: Task = Promote(original);
    const tasks: Task[] = [
        original,
        promoted,
        { title: "Publish guide", priority: 2 },
    ];
    return String.Join(UrgentTitles(tasks), ", ");
}
        </CodeBlock>
        <CodeBlock language="output">
Write tests
        </CodeBlock>
        <Heading level="2">Build a collection</Heading>
        <Paragraph>The loop reads an ordinary `Task[]`. The number of urgent tasks is discovered as the loop runs, so the function uses a growable list of strings as a builder. Freeze returns a separate array snapshot. The caller can keep that snapshot while the builder is used elsewhere.</Paragraph>
        <Paragraph>The original and promoted tasks both appear in the input. Only the promoted task meets the threshold. Change the threshold to 4 and verify that both copies appear.</Paragraph>
        <Paragraph>Next, add a task lifecycle with [payload enums and match](/copeland-ts/book/enums-and-match/).</Paragraph>
    </Document>;
}
