export function UiComponents(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Extract the article list, an article row, and the details panel into components with explicit inputs.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Choose props that describe what each component needs to render.</Paragraph></Item>
            <Item><Paragraph>Keep selection in the parent and distinguish local view state from shared application state.</Paragraph></Item>
            <Item><Paragraph>Keep list item identity stable when filtering or reordering the articles.</Paragraph></Item>
        </List>
        <Paragraph>This chapter builds on [Lay out and style the panel](/copeland-ts/book/layout-and-styling/) and prepares the view for [a search form](/copeland-ts/book/forms-and-accessibility/).</Paragraph>
    </Document>;
}
