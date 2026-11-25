export function WritingDocs(): Document {
    return <Document>
        <Paragraph>A page is an ordinary **Copeland TSX** function returning a **Document**. Write the text inline, then use document components for headings, lists, callouts, and examples.</Paragraph>
        <Heading level="2">Write a page</Heading>
        <CodeBlock language="tsx">
export function QuickStart(): Document {
    return <Document>
        <Heading level="2">Install the tool</Heading>
        <Paragraph>Use **bold text**, *emphasis*, and [links](/).</Paragraph>
        <Callout>Run the build before publishing.</Callout>
    </Document>;
}
        </CodeBlock>
        <Heading level="2">Register and preview</Heading>
        <List>
            <Item><Paragraph>Add the function to the typed site registry with its title, route, and description.</Paragraph></Item>
            <Item><Paragraph>Build the site and run the documentation checks.</Paragraph></Item>
            <Item><Paragraph>Open the direct URL and check its headings and links.</Paragraph></Item>
        </List>
        <CodeBlock language="console">
tspack run build
tspack run docs-build
tspack run docs-check
tspack run preview
        </CodeBlock>
        <Callout>Page files define content. The framework supplies the navigation, heading anchors, table of contents, HTML, and styles.</Callout>
    </Document>;
}
