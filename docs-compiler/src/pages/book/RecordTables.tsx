export function RecordTables(): Document {
    return <Document>
        <Paragraph>In [Records and collections](/copeland-ts/book/records-and-collections/) you built a queue from individual task values. A `record table` is useful when the data belongs together as a named set of rows with a fixed schema. You can declare the queue once, then ask for the tasks that fit or summarize their estimated minutes.</Paragraph>
        <Heading level="2">A table stores columns</Heading>
        <Paragraph>Copeland stores all the IDs together, all the titles together, and so on. One position across those columns describes one task. Here is the queue written the way the columns line up.</Paragraph>
        <CodeBlock language="copeland-fragment">
record table Tasks {
    key id: int = [10, 20, 30, 40];
    title: string = ["Triage inbox", "Draft the guide", "Check links", "Review a patch"];
    minutes: int = [15, 45, 10, 20];
    ready: boolean = [true, true, false, true];
}
        </CodeBlock>
        <Paragraph>The second position has ID 20, title “Draft the guide,” and an estimate of 45 minutes. When you call `Tasks.rows()`, a row in that view reads each field at its position in the source columns. Creating the view does not copy the columns into an array of task objects. The view gives you a convenient way to read all the fields for one task together.</Paragraph>
        <Heading level="2">Describe the same table by rows</Heading>
        <Paragraph>You can also author the initializer one task per line, as the full example below does. Every row supplies each declared field once, and the compiler organizes the values into the same columns. In either form, `key id: int` says that IDs identify rows and must be unique. A task keeps its ID if you reorder the rows.</Paragraph>
        <Heading level="2">Filter, project, and summarize</Heading>
        <Paragraph>If you use TypeScript’s `filter` and `map`, the first query should look familiar. Call `rows()` to read a table as a sequence of typed rows. `where` keeps rows that pass a predicate, in their original order. `select` turns those rows into the values you want to return. Copeland uses LINQ-style method names here.</Paragraph>
        <Paragraph>Save the following as `src/Hello.ts` in the workspace from [Your first program](/copeland-ts/book/first-program/). The queue starts with four tasks. Keeping the filter in `Fits` lets the list and its totals use the same admission rule.</Paragraph>
        <CodeBlock language="copeland">
record table Tasks {
    key id: int;
    title: string;
    minutes: int;
    ready: boolean;
} = [
    { id: 10, title: "Triage inbox", minutes: 15, ready: true },
    { id: 20, title: "Draft the guide", minutes: 45, ready: true },
    { id: 30, title: "Check links", minutes: 10, ready: false },
    { id: 40, title: "Review a patch", minutes: 20, ready: true },
];

record TaskLine {
    title: string;
    minutes: int;
}

record TaskTotals {
    tasks: int;
    minutes: int;
}

function Fits(limit: int): (task: Tasks.Row) => boolean {
    return capture { limit } (task: Tasks.Row) => task.ready && task.minutes <= limit;
}

function ToLine(task: Tasks.Row): TaskLine {
    return { title: task.title, minutes: task.minutes };
}

function ReadyWithin(limit: int): TaskLine[] {
    return Tasks.rows().where(Fits(limit)).select(ToLine);
}

function TotalsWithin(limit: int): TaskTotals {
    return Tasks.rows().where(Fits(limit)).summarize<TaskTotals>(task => ({
        tasks: count(),
        minutes: sum(task.minutes),
    }));
}

export function Main(): string {
    const limit: int = 30;
    const lines = MutableList<string>();
    for (const task of ReadyWithin(limit)) {
        lines.append(`${task.title} (${task.minutes} min)`);
    }
    const totals: TaskTotals = TotalsWithin(limit);
    const label: string = if totals.tasks == 1 { "task" } else { "tasks" };
    lines.append(`${totals.tasks} ${label}, ${totals.minutes} min total`);
    return String.Join(lines.freeze(), String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Triage inbox (15 min)
Review a patch (20 min)
2 tasks, 35 min total
        </CodeBlock>
        <Paragraph>`Tasks.Row` is the row type that belongs to `Tasks`. The row view reads fields from the source table. `ToLine` picks two fields and constructs a smaller ordinary record. The query materializes those records as a `TaskLine[]`, which the example can pass to another function or loop over like any other array.</Paragraph>
        <Paragraph>`Fits` captures the limit when the predicate is created. Both queries keep ready tasks whose individual estimate is at most 30 minutes. The result can total 35 minutes because each row is checked independently. A rule for choosing a set of tasks within a total budget would need to track the remaining time as it picks tasks.</Paragraph>
        <Paragraph>`summarize` ends the second query with a typed record. Inside that expression, `count()` counts the rows that survived the filter and `sum(task.minutes)` adds their minutes. Keeping the result named means callers can read `totals.minutes` directly. For a total over zero matching rows, both fields are zero.</Paragraph>
        <Heading level="2">Try a smaller limit</Heading>
        <Paragraph>Change `limit` to 14 and run the example again. The ten-minute task is still waiting, so the output becomes `0 tasks, 0 min total`. Then mark **Check links** ready. It should be the only projected row. If you give it ID 10, the compiler reports the duplicate key before the query runs.</Paragraph>
        <Paragraph>When you need one total per category, `groupBy` followed by `summarize` produces an array of typed summary records. See the [table authoring guide](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/language/copeland-ts-table-authoring.md) and [typed summaries reference](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/language/copeland-ts-table-summaries.md). Next, give a task a lifecycle with [payload enums and match](/copeland-ts/book/enums-and-match/).</Paragraph>
    </Document>;
}
