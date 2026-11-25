export function Fallibility(): Document {
    return <Document>
        <Paragraph>The queue can be empty during a quiet day. A request for an empty task name is a different outcome and needs an error message. Use Option for absence and a Result for operations that can fail.</Paragraph>
        <Heading level="2">Model an optional value</Heading>
        <Paragraph>FirstTask returns `Some` when the list has an item and `None` when it is empty. The length check happens before indexing. A match on the Option then chooses the selected task or a fallback.</Paragraph>
        <CodeBlock language="copeland">
function FirstTask(tasks: string[]): Option<string> {
    if (tasks.length == 0) {
        return None;
    }
    return Some(tasks[0]);
}

function ValidateName(name: string): string ! string {
    if (name == "") {
        return err("a task needs a name");
    }
    return ok(name);
}

function QueueLabel(name: string): string ! string {
    const validName: string = ValidateName(name)?;
    return ok("Queued: " + validName);
}

export function Main(): string {
    const tasks: string[] = [];
    const label: string = match FirstTask(tasks) {
        Some(name) => name,
        None => "No tasks",
    };
    const request: string = match QueueLabel("") {
        ok(name) => name,
        err(message) => message,
    };
    return label + " / " + request;
}
        </CodeBlock>
        <CodeBlock language="output">
No tasks / a task needs a name
        </CodeBlock>
        <Heading level="2">Propagate an error</Heading>
        <Paragraph>Read the return type of ValidateName as a string success or a string error. In QueueLabel, postfix `?` unwraps the success or returns the error from QueueLabel immediately. Main handles the outcome with a match. Try passing a nonempty name and notice which result changes while the empty-list branch stays the same.</Paragraph>
        <Paragraph>Next, take the queue into a larger project with [modules, targets, and testing](/copeland-ts/book/modules-and-testing/).</Paragraph>
    </Document>;
}
