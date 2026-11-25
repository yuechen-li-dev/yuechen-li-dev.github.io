export function InteractiveUi(): Document {
    return <Document>
        <Callout>This chapter is planned.</Callout>
        <Paragraph>Turn the static article panel into a screen that responds to selection and retry. Keep the transition logic visible in a reducer.</Paragraph>
        <Heading level="2">What this chapter will cover</Heading>
        <List>
            <Item><Paragraph>Trace one browser event from its control to a typed action and then to the next view.</Paragraph></Item>
            <Item><Paragraph>Introduce component-local `state` and `on` with a zero-payload event on a supported browser path.</Paragraph></Item>
            <Item><Paragraph>Exercise the loading, failure, and retry views with controlled inputs before introducing network timing.</Paragraph></Item>
        </List>
        <Paragraph>Start with the reducer from [Reduce UI events](/copeland-ts/book/reduce-ui-events/). [Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/) covers the timing rule separately.</Paragraph>
    </Document>;
}
