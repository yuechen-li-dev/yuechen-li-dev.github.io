export function UiForms(): Document {
    return <Document>
        <Paragraph>Use search in the [article panel](/copeland-ts/book/example/) to narrow the article list before selecting an item. The field holds a draft and applies a valid query on submit. An invalid query brings focus back to the field and leaves the previous result set visible.</Paragraph>
        <Heading level="2">Give the input an accessible name</Heading>
        <Paragraph>Open `examples/article-panel/web/index.html`. The visible **Search articles** label points to the query field, and the form has a native **Search** submit button. Enter in the field and a click on the button go through the same submit listener. The host prevents the default navigation because the search updates this page in place.</Paragraph>
        <CodeBlock language="html">
<form id="article-search" role="search" aria-label="Articles">
  <label for="query">Search articles</label>
  <div class="search-controls">
    <input id="query" name="query" type="search" aria-describedby="query-error">
    <button type="submit">Search</button>
  </div>
  <p id="query-error" hidden></p>
  <p id="search-status" role="status">2 articles</p>
</form>
        </CodeBlock>
        <Paragraph>The label names the field even when the input contains text. Keep the error beside the field and associate the message with it through `aria-describedby`. A stable status region lets assistive technology announce a useful result summary without moving focus. Keep the list outside that region so each update can announce just the new count. See the [W3C guidance on labels](https://www.w3.org/WAI/tutorials/forms/labels/) and [status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).</Paragraph>
        <Heading level="2">Apply the query only after validation</Heading>
        <Paragraph>As you type, the input element owns the draft. On submit, the host reads the current text, trims surrounding whitespace, and passes the result to `ValidateQuery` in `src/Panel.ts`. The Copeland function owns which queries the application accepts. An empty query clears the filter. A nonempty query must be 2 to 60 UTF-16 code units long, the count reported by `string.length`.</Paragraph>
        <CodeBlock language="copeland-fragment">
export function ValidateQuery(query: string): string ! string {
    if (query != "" && query.length < 2) { return err("Use at least 2 characters."); }
    if (query.length > 60) { return err("Use at most 60 characters."); }
    return ok(query);
}
        </CodeBlock>
        <Paragraph>On success, the host lowercases the accepted query and the titles before calling `Matches`. It hides unmatched article rows and updates the result count. On failure, the host displays the explanation, sets `aria-invalid`, keeps the existing results, and focuses the query field so the user can correct it. The next valid submission clears the validation message and the invalid state.</Paragraph>
        <Heading level="2">Give each outcome its own meaning</Heading>
        <List>
            <Item><Paragraph>Submit `records` to narrow the list to **Records in practice**. Submit a blank query to see both articles again.</Paragraph></Item>
            <Item><Paragraph>Submit `x` after a valid search. The field displays **Use at least 2 characters.** and the previous result list and count stay visible.</Paragraph></Item>
            <Item><Paragraph>Submit `unmatched`. This is a valid query with zero matches. The status reads **0 articles** and the field stays valid.</Paragraph></Item>
            <Item><Paragraph>Choose an article with **Fail next load** checked. That failure belongs to the detail panel and offers **Retry**. The last accepted query stays valid.</Paragraph></Item>
        </List>
        <Paragraph>Filtering this sample's local list finishes during submit. Loading a selected article can finish later. Keep request identity attached to article completions so a late result cannot undo a more recent selection. For the reducer rule, revisit [Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/).</Paragraph>
        <Heading level="2">Run the flow with a keyboard</Heading>
        <Paragraph>Tab to **Search articles**, type `records`, and press Enter. Check that the status reads **1 article**. Tab past **Search** to **Records in practice**, activate that button, and wait for the title to appear under **Article details**. Repeat with invalid input, verify that focus returns to the field, correct the query, and submit again. Check that the accessible field name remains **Search articles**, the invalid state clears, and the validation message disappears.</Paragraph>
        <Paragraph>Repeat once at a narrow width. Check that the focus indicator stays visible, and check the status and error messages with a screen reader when one is available. Next, [wait for work with async and await](/copeland-ts/book/async-estimates/) before bringing these interactions together in [Test the UI](/copeland-ts/book/test-your-ui/).</Paragraph>
    </Document>;
}
