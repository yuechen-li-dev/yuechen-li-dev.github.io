export function UiComponents(): Document {
    return <Document>
        <Paragraph>The [article panel](/copeland-ts/book/example/) has an article list, a rendered status and title, and controls that act on the current selection. Give each part the smallest set of inputs it needs. You should be able to render the details of a failed load without creating a request or constructing a browser event.</Paragraph>
        <Heading level="2">Find the inputs to the details view</Heading>
        <Paragraph>Follow the details from the model to the screen. The model tracks the current request and its outcome. `Snapshot(model)` in `src/Panel.ts` returns a status message, a title, and `canRetry`. The host uses `canRetry` to enable the retry button and passes the two strings to `View(status, title)` in `src/View.tsx`.</Paragraph>
        <CodeBlock language="text">
Current model → status and title → Copeland TSX → Document → browser renderer
        </CodeBlock>
        <Heading level="2">Choose whole views in ordinary Copeland</Heading>
        <Paragraph>`Snapshot` uses `match` on the model. By the time the view runs, the text it needs is already available. In the example’s `src/View.tsx`, `View` calls the smaller `Details` function when there is a title. Each function can return a complete document.</Paragraph>
        <CodeBlock language="tsx">
function Details(title: string): Document {
    return <Document>
        <Heading level="2">Article details</Heading>
        <Paragraph>{title}</Paragraph>
    </Document>;
}

export function View(status: string, title: string): Document {
    if (title != "") { return Details(title); }
    return <Document>
        <Heading level="2">Article details</Heading>
        <Paragraph>{status}</Paragraph>
    </Document>;
}
        </CodeBlock>
        <Paragraph>A TextDocuments slot inserts the string you supply. Choose between complete documents in ordinary Copeland when a branch needs another structure. The supported tags and slots form a typed vocabulary for document content. The browser host handles interactive elements such as buttons and form inputs.</Paragraph>
        <Paragraph>In this fixture, the article data always has a visible title and intermediate states supply an empty title. That lets the view choose whether to show article details by inspecting the projected title. If your application accepts empty article titles, use an explicit presentation field or carry the phase into the projection. Otherwise an empty article title and a missing result would mean the same thing to the view.</Paragraph>
        <Heading level="2">Give each part a clear owner</Heading>
        <List>
            <Item><Paragraph>The browser fixture keeps its two article choices and retry control in the host page. For a generated list, the list needs the available entries and any information it displays about the selection.</Paragraph></Item>
            <Item><Paragraph>An article row needs a key and a label. If the row marks selections, pass that flag as another input. When activated, it reports the key through its button handler.</Paragraph></Item>
            <Item><Paragraph>The details view accepts presentation strings. The browser host connects retry to the reducer and renders the resulting view.</Paragraph></Item>
        </List>
        <Paragraph>In `web/browser.mjs`, `render` replaces the children of `#panel-view`. The form, search button, and retry button stay in place. Those DOM nodes keep their identity as the panel changes, so the host can update a button’s disabled state and preserve its handlers.</Paragraph>
        <Paragraph>The fixture keeps the last selected article key in the host for retry. If both the list and the details need to read the selection, share that key across their boundary. With a separate copy inside each row, the list could mark one article active while the panel shows another. A row can still have private state for something that belongs to that row alone, such as whether to reveal its extra text.</Paragraph>
        <Heading level="2">Keep identity when the list changes</Heading>
        <Paragraph>Use the article key as the identity of a row. An array position changes when you filter or reorder the list. The second row can represent article B before a filter and article C afterward. A callback that remembers position 2 might open the wrong article. A callback that remembers the key continues to name the article it was created for.</Paragraph>
        <Paragraph>The key also provides a starting point when preserving keyboard focus. If a filter leaves the focused article visible, its own button is the focus target. If the article disappears, move focus to an element that still exists and makes sense for the action, such as the search input. Stable keys let the host identify the same row across renders. Focus preservation still depends on whether the renderer reuses the element or restores focus after replacing it.</Paragraph>
        <Heading level="2">Check the extraction</Heading>
        <Paragraph>In the local example, change only the text or heading structure in the TSX view and rebuild. Load an article, retry a failed request, and change the selection while a request is running. The new markup should appear, and the same interactions should still reach the same reducer. As a second experiment, swap the two article choices in `web/index.html` and rebuild. The button should still open the article named on its label because the host reads its `data-article` key.</Paragraph>
        <Paragraph>Next, [add a search form](/copeland-ts/book/forms-and-accessibility/). It will use the same article keys even when it shows fewer rows.</Paragraph>
    </Document>;
}
