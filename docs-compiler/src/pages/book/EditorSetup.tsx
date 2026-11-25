export function EditorSetup(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Open a workspace and make one small edit. The checkpoint is a Copeland diagnostic on a Copeland file and an ordinary TypeScript diagnostic on an ordinary TypeScript file.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Install the compiler and the VS Code extension, then confirm the editor can find the same compiler you run from the terminal.</Paragraph></Item>
            <Item><Paragraph>Open the folder that contains `tsconfig.tsx` and inspect ownership in the status bar.</Paragraph></Item>
            <Item><Paragraph>Try one deliberate type error, fix it, and verify that diagnostics disappear without restarting the editor.</Paragraph></Item>
        </List>
        <Paragraph>Use the [installation guide](/copeland-ts/installation/) for the current preview setup, then continue to [Your first program](/copeland-ts/book/first-program/).</Paragraph>
    </Document>;
}
