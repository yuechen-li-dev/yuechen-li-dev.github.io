export function FirstView(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Render a static article panel in a browser. Start with a title, a short description, and a list of article names.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Choose the browser target and identify the entry module.</Paragraph></Item>
            <Item><Paragraph>Create a `.tsx` view with typed inputs and pass it data from an ordinary `.ts` module.</Paragraph></Item>
            <Item><Paragraph>Build the project, serve the output locally, and inspect the first rendered view.</Paragraph></Item>
        </List>
        <Paragraph>Finish [Your first program](/copeland-ts/book/first-program/) before this chapter. Then [model the states the panel can show](/copeland-ts/book/model-ui-state/).</Paragraph>
    </Document>;
}
