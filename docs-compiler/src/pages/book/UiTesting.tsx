export function UiTesting(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Give the article panel a fast reducer test and a browser test that exercises a real user flow.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Check success, failure, retry, and stale-response cases with deterministic events.</Paragraph></Item>
            <Item><Paragraph>Drive the rendered view by its roles and accessible names.</Paragraph></Item>
            <Item><Paragraph>Control response order in the browser test and verify that the selected article stays visible.</Paragraph></Item>
        </List>
        <Paragraph>Start with [Modules, targets, and testing](/copeland-ts/book/modules-and-testing/) and [Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/).</Paragraph>
    </Document>;
}
