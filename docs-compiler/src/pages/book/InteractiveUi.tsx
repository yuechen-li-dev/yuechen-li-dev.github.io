export function InteractiveUi(): Document {
    return <Document>
        <Paragraph>In [Render your first view](/copeland-ts/book/first-view/) the inputs were known before the page ran. On an interactive page, a reader chooses an article and the answer arrives later. Use the [reducer from the previous chapter](/copeland-ts/book/reduce-ui-events/) to decide what the panel should show at each step, then connect it to real browser events.</Paragraph>
        <Heading level="2">Keep one current model</Heading>
        <Paragraph>Open the [article panel demo](/copeland-ts/book/example/) or run the example from the checkout as described in [Render your first view](/copeland-ts/book/first-view/). The browser host receives clicks, runs requests, and holds the current model. The reducer in `src/Panel.ts` takes that model and a typed event and returns the next model. The view turns its status and title into a native Copeland document.</Paragraph>
        <CodeBlock language="text">
Browser event → application event → reducer → next model → view
Request result → completion event → reducer → next model → view
        </CodeBlock>
        <Paragraph>The browser handler routes a click to an application event. The reducer routes that event to a rule based on the current state. Those decisions answer different questions. A button can tell you what the reader chose. The reducer can tell you what the choice means even when the same event comes from a keyboard shortcut or a test. See [A reducer routes events](/copeland-ts/book/reduce-ui-events/#a-reducer-routes-events) for the equivalent TypeScript switch.</Paragraph>
        <Paragraph>Keep the model with the browser host between events. When a click arrives, read the current model at that moment, pass it to the reducer, and retain the returned value before rendering. A handler registered during page setup may run many times. If it closes over the initial model, every click starts again from that initial state.</Paragraph>
        <Paragraph>The browser host handles button events in `web/browser.mjs`. Both selection and retry start a new load, so both call `Select`. The host uses an article key to decide which article to load. The reducer assigns and tracks the request without needing the button, the browser event, or the article key.</Paragraph>
        <Heading level="2">Follow a selection through the page</Heading>
        <Paragraph>Choose **Patterns in UI**. The host calls `Select(currentModel)`, saves the result, and reads `LatestRequest` from it before starting work. It renders the loading state immediately. Waiting until the request finishes to render would hide the loading state and leave the old view on screen.</Paragraph>
        <Paragraph>This function from `web/browser.mjs` is the bridge from a browser action to a Copeland state transition. The timer stands in for a request so the demo can reliably produce slow and fast responses.</Paragraph>
        <CodeBlock language="javascript">
async function select(article) {
  lastArticle = article;
  model = Select(model);
  const requestId = LatestRequest(model);
  const shouldFail = failNext.checked;
  failNext.checked = false;
  render();

  await new Promise((resolve) => setTimeout(resolve, article.delay));
  model = shouldFail
    ? Reject(model, requestId, "Demo failure")
    : Receive(model, requestId, article.title);
  render();
}
        </CodeBlock>
        <Paragraph>On success the host calls `Receive` with the latest model, the original request identity, and the returned title. On failure it calls `Reject` with the same kind of identity and an error message. Always pass the model that is current **at completion** and the identity that was current **when this request began**. Saving a whole old model would roll the panel back. Reading a new identity would make an old response look current.</Paragraph>
        <Paragraph>Try choosing **Patterns in UI**, then **Records in practice** before the first load finishes. The first article takes longer on purpose. Once both attempts have finished, the panel should still show **Records in practice**. The reducer accepts a completion only while its request identity is still active. [Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/) shows how to reproduce this order without timers or a browser.</Paragraph>
        <Heading level="2">Make failure and retry visible</Heading>
        <Paragraph>Check **Fail next load**, then choose **Records in practice**. Wait for the failure, then choose **Retry**. The supplied loader fails one attempt on purpose. Retry uses the last article selection, allocates a fresh request identity, and shows loading again. When the new attempt finishes, expect **Records in practice**. Two attempts can share an article key and still have different request identities.</Paragraph>
        <List>
            <Item><Paragraph>If a click produces no loading message, first check that the correct event reaches the reducer and that the host renders its result.</Paragraph></Item>
            <Item><Paragraph>If the loading message stays, check that both completion paths dispatch an event with the captured request identity.</Paragraph></Item>
            <Item><Paragraph>If an old title flashes after a newer selection, check which model and identity the completion carried.</Paragraph></Item>
        </List>
        <Heading level="2">Where component state fits</Heading>
        <Paragraph>The article panel uses explicit host-owned state and an ordinary Copeland reducer. Copeland also has component-local `state` and `on` declarations for projects with a compatible renderer. Here is the shape of a local counter in the React presentation profile.</Paragraph>
        <CodeBlock language="tsx">
record CounterState { count: int; }

function Counter(): ReactNode {
    state current: CounterState = { count: 0 };
    on Increment() => current with { count: current.count + 1 };
    return <span>{current.count}</span>;
}
        </CodeBlock>
        <Paragraph>`state` declares a retained value for one component instance. `on Increment()` defines a transition without a payload. The expression after the arrow computes its replacement record. This fragment leaves out the host attachment and event binding. To run it as a browser component, use a renderer and runtime that support Copeland component frames. The available transitions and effects depend on that target. See the [component state reference](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/language/components.md) for the supported boundary.</Paragraph>
        <Paragraph>Continue to [Lay out and style the panel](/copeland-ts/book/layout-and-styling/) once selection and retry work. The panel can move on screen while the model and its transitions stay the same.</Paragraph>
        <Paragraph>For a request with a lifecycle of its own, [Model state and effects with flow](/copeland-ts/book/state-and-effects-with-flow/) shows how to declare the legal transitions and deliver effect results from the host.</Paragraph>
    </Document>;
}
