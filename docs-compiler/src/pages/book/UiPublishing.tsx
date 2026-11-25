export function UiPublishing(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Build the browser target, copy its output to an empty directory, and serve it from there.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Identify the files the browser needs and the command that produces them.</Paragraph></Item>
            <Item><Paragraph>Open the app from a fresh static server and exercise the article selection and search flows.</Paragraph></Item>
            <Item><Paragraph>Check URLs and assets at the deployment path before sharing the build.</Paragraph></Item>
        </List>
        <Paragraph>Use the browser flow from [Test the UI](/copeland-ts/book/test-your-ui/) as the final check.</Paragraph>
    </Document>;
}
