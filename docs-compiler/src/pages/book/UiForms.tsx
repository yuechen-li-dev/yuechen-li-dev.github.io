export function UiForms(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Add search to the article list with a clear label, a submit action, and a readable empty result.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Model the typed query, validation failure, and submitted value.</Paragraph></Item>
            <Item><Paragraph>Show where focus goes after submission and when a validation message appears.</Paragraph></Item>
            <Item><Paragraph>Run the full search and retry flow with a keyboard and check the labels and status text.</Paragraph></Item>
        </List>
        <Paragraph>Use the explicit outcomes from [Absence and failure](/copeland-ts/book/absence-and-failure/) and carry the keyboard flow into [Test the UI](/copeland-ts/book/test-your-ui/).</Paragraph>
    </Document>;
}
