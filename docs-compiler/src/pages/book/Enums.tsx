export function Enums(): Document {
    return <Document>
        <Paragraph>A queued task is ready to start. A blocked task has a reason. A completed task has a result. The status is a choice among those cases. Unlike the record from the previous chapter, which puts a title and a priority on every task, a payload enum can give each case different fields.</Paragraph>
        <Heading level="2">Give each case its own data</Heading>
        <Paragraph>Read the declaration as a contract for anyone who creates a status. `Queued` is a complete status by itself. `Blocked` needs a string that explains what is in the way. `Complete` also needs a string, but its string means something different. Selecting the case and supplying its data happen together in a constructor call such as `TaskStatus.Blocked("waiting for review")`.</Paragraph>
        <CodeBlock language="copeland">
enum TaskStatus {
    Queued,
    Blocked(reason: string),
    Complete(result: string),
}

function Describe(status: TaskStatus): string {
    return match status {
        Queued => "Queued",
        Blocked(reason) => "Blocked: " + reason,
        Complete(result) => "Complete: " + result,
    };
}

export function Main(): string {
    const status: TaskStatus = TaskStatus.Blocked("waiting for review");
    return Describe(status);
}
        </CodeBlock>
        <CodeBlock language="output">
Blocked: waiting for review
        </CodeBlock>
        <Heading level="2">Read the tag and payload together</Heading>
        <Paragraph>In `Blocked(reason)`, the pattern checks that the status is blocked and binds the reason for use on the right of the arrow. That name is local to the arm. The queued arm has no payload to bind. Each arm produces a string, so the whole match produces the description that the function returns.</Paragraph>
        <Heading level="2">Let the compiler find the readers of a new case</Heading>
        <Paragraph>Add a `Cancelled` case to the enum and rebuild before changing anything else. In `obj/build.json`, the compiler reports that the match in Describe is missing the new case. Decide what users should see for a cancelled task and add the corresponding arm. Then pass `TaskStatus.Cancelled` from Main to check the result. This is especially helpful when more than one function uses the enum. A renderer might display the status, while a scheduler uses it to decide whether a task can run. Each needs its own answer for cancellation.</Paragraph>
        <Paragraph>Copeland borrows this pairing of payload enums and exhaustive match from Rust. If you usually express these choices with a `kind` field in TypeScript, [Model a loading screen](/copeland-ts/book/model-ui-state/) works through both versions and shows what changes when the model grows.</Paragraph>
        <Paragraph>Next, model unsuccessful lookups with [absence and failure](/copeland-ts/book/absence-and-failure/).</Paragraph>
    </Document>;
}
