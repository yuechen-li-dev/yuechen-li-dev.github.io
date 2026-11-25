export function UiTesting(): Document {
    return <Document>
        <Paragraph>The article panel now has two things worth testing. The reducer decides which responses belong to the current selection. The browser host puts those decisions on screen and connects them to controls. A fast test can prove the first rule without a browser. A browser check proves the control, focus, and rendering behavior.</Paragraph>
        <Heading level="2">Test the compiled reducer</Heading>
        <Paragraph>From `examples/article-panel`, build the fixture and run its tests with Node. The tests import the same Copeland exports the browser uses. They exercise the emitted code and JavaScript boundary together.</Paragraph>
        <CodeBlock language="console">
node build.mjs
node --test tests/panel.test.mjs
        </CodeBlock>
        <Paragraph>Read the first test as a sequence of decisions. Start two selections, keep their request IDs, and deliver the first result after the second selection has started. Because the old request is no longer active, the model is unchanged. A result with the active ID updates the panel. Here's the first half of the test from `tests/panel.test.mjs`.</Paragraph>
        <CodeBlock language="javascript">
const first = Select(Initial());
const second = Select(first);
const oldId = LatestRequest(first);
const activeId = LatestRequest(second);
assert.notEqual(oldId, activeId);
assert.deepEqual(Receive(second, oldId, "Patterns in UI"), second);
assert.deepEqual(Reject(second, oldId, "Old failure"), second);
        </CodeBlock>
        <Paragraph>Use structural equality for the model returned through the JavaScript bridge. It says the returned fields still describe the same state. The test makes no assumption about whether two calls return the same JavaScript object instance.</Paragraph>
        <Paragraph>The remaining tests check that a real failure enables retry, that invalid queries produce typed errors, and that the TSX view emits a heading and a text run. Those tests identify which boundary failed before you investigate the browser.</Paragraph>
        <Heading level="2">Exercise the browser behavior</Heading>
        <Paragraph>Start `node serve.mjs` after building. Use the [article panel demo](/copeland-ts/book/example/) for the same walkthrough on the site. Check the visible state after each operation.</Paragraph>
        <List>
            <Item><Paragraph>Choose **Patterns in UI**, then **Records in practice** before the first completes. The panel should keep **Records in practice** when the old completion arrives.</Paragraph></Item>
            <Item><Paragraph>Check **Fail next load** and choose **Records in practice**. Wait for the demo failure, activate **Retry**, and check that the title returns. While the retry runs, focus moves to the article choice if it is visible.</Paragraph></Item>
            <Item><Paragraph>Focus **Search articles**, enter `records`, and press Enter. Then submit `x`. Expect a validation message, focus on the field, and the previous result still visible. Clear the input and submit to show both articles again.</Paragraph></Item>
            <Item><Paragraph>Repeat the search at a 320 CSS pixel viewport. Check that you can reach every control with the keyboard and read the panel without horizontal scrolling.</Paragraph></Item>
        </List>
        <Paragraph>If you automate this flow, locate the controls by role and name, then wait for observable outcomes such as the retry button becoming enabled or the article title appearing. Keep the completion-order rule in a reducer test where you can deliver results in a precise order. A browser assertion remains valuable because it catches mistakes in which model or request ID the host sends.</Paragraph>
        <Paragraph>Once the tests pass, [build and publish the UI](/copeland-ts/book/publish-your-ui/) and run the same browser checks against the copied output.</Paragraph>
    </Document>;
}
