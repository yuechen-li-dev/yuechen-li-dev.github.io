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

function DescribeWithMatch(status: TaskStatus): string {
    return match status {
        Queued => "Queued",
        Blocked(reason) => "Blocked: " + reason,
        Complete(result) => "Complete: " + result,
    };
}

function DescribeWithSwitch(status: TaskStatus): string {
    return switch status {
        case Queued => "Queued",
        case Blocked(reason) => "Blocked: " + reason,
        case Complete(result) => "Complete: " + result,
    };
}

export function Main(): string {
    const status: TaskStatus = TaskStatus.Blocked("waiting for review");
    return DescribeWithMatch(status) + " / " + DescribeWithSwitch(status);
}
        </CodeBlock>
        <CodeBlock language="output">
Blocked: waiting for review / Blocked: waiting for review
        </CodeBlock>
        <Heading level="2">Read the tag and payload together</Heading>
        <Paragraph>In `Blocked(reason)`, the pattern checks that the status is blocked and binds the reason for use on the right of the arrow. That name is local to the arm. The queued arm has no payload to bind. Each arm produces a string, so the whole match produces the description that the function returns.</Paragraph>
        <Heading level="2">Choose match or switch</Heading>
        <Paragraph>The two functions above do exactly the same work. Copeland’s `match` and `switch` are interchangeable spellings of the same pattern construct. Both evaluate the subject once, choose one arm, bind that arm’s payload, and check that all cases are covered. Either keyword can produce a value or dispatch to statement blocks.</Paragraph>
        <Paragraph>Use whichever reads better in a given function. A `match` often reads naturally when you are taking apart a value, such as a task status or a Result. A `switch` often reads naturally when you are dispatching events, as in [Reduce UI events](/copeland-ts/book/reduce-ui-events/). This is a convention. You can change the keyword in either function above and keep the same behavior.</Paragraph>
        <Paragraph>The `case` prefix is optional with either keyword. `case Blocked(reason) =>` and `Blocked(reason) =>` start the same arm. Use the arrow in both forms. Traditional TypeScript switch statements use colon labels and can fall through into the next case. Copeland selects a single arm and finishes the match when that arm finishes, so there’s no `break` to add between arms.</Paragraph>
        <Heading level="2">Let the compiler find the readers of a new case</Heading>
        <Paragraph>Add a `Cancelled` case to the enum and rebuild before changing anything else. In `obj/build.json`, the compiler reports the missing case in both description functions. Decide what users should see for a cancelled task and add the corresponding arms. Then pass `TaskStatus.Cancelled` from Main to check the result. This is especially helpful when more than one function uses the enum. A renderer might display the status, while a scheduler uses it to decide whether a task can run. Each needs its own answer for cancellation.</Paragraph>
        <Paragraph>Copeland borrows this pairing of payload enums and exhaustive match from Rust. If you usually express these choices with a `kind` field in TypeScript, [Model a loading screen](/copeland-ts/book/model-ui-state/) works through both versions and shows what changes when the model grows.</Paragraph>
        <Paragraph>Next, model unsuccessful lookups with [absence and failure](/copeland-ts/book/absence-and-failure/).</Paragraph>
    </Document>;
}
