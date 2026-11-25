export function Values(): Document {
    return <Document>
        <Paragraph>Imagine you are building a task queue. Before building the queue itself, write the rule that decides how a task is labeled.</Paragraph>
        <Heading level="2">Make the contract visible</Heading>
        <Paragraph>The function accepts an integer priority and returns text. Its comparison produces a boolean for the if condition. An integer literal such as 8 infers `int`, while a decimal literal such as 8.0 infers `float`.</Paragraph>
        <CodeBlock language="copeland">
function PriorityLabel(priority: int): string {
    if (priority >= 5) {
        return "urgent";
    }

    return "normal";
}

export function Main(): string {
    const high: int = 8;
    const low = 2;
    return PriorityLabel(high) + " / " + PriorityLabel(low);
}
        </CodeBlock>
        <CodeBlock language="output">
urgent / normal
        </CodeBlock>
        <Heading level="2">Try the boundary</Heading>
        <Paragraph>Replace 8 with 5, then with 4. Those values exercise opposite sides of the threshold. A quoted 8 is a string, so passing it to PriorityLabel is a type error. Copeland also keeps integer and floating-point arithmetic distinct. Choose the numeric type that matches the quantity you want to model.</Paragraph>
        <Paragraph>Replace the body of `src/Hello.ts` with each chapter’s complete program and re-run the same build and Node commands. Next, collect several tasks using [records and collections](/copeland-ts/book/records-and-collections/).</Paragraph>
    </Document>;
}
