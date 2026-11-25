export function Book(): Document {
    return <Document>
        <Paragraph>This book is for developers who already write JavaScript or TypeScript. It assumes you know functions, modules, and how to run a Node program. It introduces Copeland’s rules for modeling data, handling failure, and using the same code across targets.</Paragraph>
        <Paragraph>Start on Node with emitted JavaScript and your usual tools. Once a project declares Node and .NET targets, select the target at build time. The task queue in this book uses the same Copeland source on both.</Paragraph>
        <Heading level="2">Copeland TS basics</Heading>
        <List>
            <Item><Paragraph>[Your first program](/copeland-ts/book/first-program/) builds a Copeland source file and runs the emitted JavaScript in Node.</Paragraph></Item>
            <Item><Paragraph>[Values and functions](/copeland-ts/book/values-and-functions/) covers numeric types, function boundaries, and branching.</Paragraph></Item>
            <Item><Paragraph>[Records and collections](/copeland-ts/book/records-and-collections/) models a task list and updates it without changing the original values.</Paragraph></Item>
            <Item><Paragraph>[Payload enums and match](/copeland-ts/book/enums-and-match/) gives each task state exactly the data it needs.</Paragraph></Item>
            <Item><Paragraph>[Absence and failure](/copeland-ts/book/absence-and-failure/) distinguishes a missing task from an operation that failed.</Paragraph></Item>
            <Item><Paragraph>[Modules, targets, and testing](/copeland-ts/book/modules-and-testing/) splits the queue into modules and runs the same source on Node and .NET.</Paragraph></Item>
        </List>
        <Heading level="2">Find a specific answer</Heading>
        <Paragraph>Use the [installation guide](/copeland-ts/installation/) to set up the local preview. Consult the [language overview](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/language/overview.md) when you need semantics or feature boundaries. [Writing docs](/copeland-ts/writing-docs/) explains how this site is built.</Paragraph>
    </Document>;
}
