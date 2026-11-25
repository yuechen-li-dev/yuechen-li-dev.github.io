export function UiLayout(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Arrange the article list and panel side by side on a wide display and stack them on a narrow one.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Define the regions, their order, and which region can grow.</Paragraph></Item>
            <Item><Paragraph>Use a typed layout or stream for placement and a style record for shared spacing and color.</Paragraph></Item>
            <Item><Paragraph>Use `with` for a local style variant and check long titles at both widths.</Paragraph></Item>
        </List>
        <Paragraph>Start from [Render your first view](/copeland-ts/book/first-view/) and carry the layout into [Extract reusable components](/copeland-ts/book/reusable-components/).</Paragraph>
    </Document>;
}
