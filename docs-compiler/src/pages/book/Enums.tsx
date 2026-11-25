export function Enums(): Document {
    return <Document>
        <Paragraph>A queued task is ready to start. A blocked task has a reason. A completed task has a result. A payload enum puts the appropriate data on each case.</Paragraph>
        <Heading level="2">Give each case its own data</Heading>
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
        <Heading level="2">Handle every case</Heading>
        <Paragraph>The match expression chooses an arm and binds the case’s payload locally. Each arm returns a string. Add a `Cancelled` case to the enum and rebuild. The compiler reports that Describe must cover the new case. Add a corresponding arm and try the cancelled status.</Paragraph>
        <Paragraph>Next, model unsuccessful lookups with [absence and failure](/copeland-ts/book/absence-and-failure/).</Paragraph>
    </Document>;
}
