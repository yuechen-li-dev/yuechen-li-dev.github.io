export function StaleResponses(): Document {
    return <Document>
        <Paragraph>A user selects article A, then selects article B before the first response arrives. If we extend the reducer from [Reduce UI events](/copeland-ts/book/reduce-ui-events/) to start B’s request immediately, an early response for A could still win. The old reducer accepts any completion while the panel is loading. That also lets an old failure replace the newer loading message.</Paragraph>
        <Heading level="2">Give a load an identity</Heading>
        <Paragraph>Assign an ID when a selection starts a request. Put that ID in the loading state. When the host finishes the request, have it dispatch the original ID with the success or failure. The panel can now ask whether the response belongs to the load it is still showing.</Paragraph>
        <Paragraph>Use a record for the data that must survive any phase. `Model.nextRequest` is the next ID to allocate, whether the panel is idle, loading, ready, or failed. The active request ID belongs specifically to `Panel.Loading`. Once an outcome is accepted, the panel leaves that case and stops accepting outcomes for the completed request.</Paragraph>
        <CodeBlock language="copeland">
enum Panel {
    Idle,
    Loading(request: int),
    Ready(title: string),
    Failed(message: string),
}

record Model {
    nextRequest: int;
    panel: Panel;
}

enum PanelEvent {
    Requested,
    Received(request: int, title: string),
    Rejected(request: int, message: string),
}

function Start(model: Model): Model {
    const request: int = model.nextRequest;
    return model with {
        nextRequest: request + 1,
        panel: Panel.Loading(request),
    };
}

function Complete(model: Model, request: int, completed: Panel): Model {
    return match model.panel {
        Idle => model,
        Loading(active) => if active == request {
            model with { panel: completed }
        } else {
            model
        },
        Ready(_) => model,
        Failed(_) => model,
    };
}

function Update(model: Model, event: PanelEvent): Model {
    return match event {
        Requested => Start(model),
        Received(request, title) => Complete(model, request, Panel.Ready(title)),
        Rejected(request, message) => Complete(model, request, Panel.Failed(message)),
    };
}

function ViewText(model: Model): string {
    return match model.panel {
        Idle => "Choose an article",
        Loading(request) => `Loading request ${request}`,
        Ready(title) => title,
        Failed(message) => "Could not load: " + message,
    };
}

export function Main(): string {
    const initial: Model = { nextRequest: 1, panel: Panel.Idle };
    const first: Model = Update(initial, PanelEvent.Requested);
    const second: Model = Update(first, PanelEvent.Requested);
    const afterOldSuccess: Model = Update(second, PanelEvent.Received(1, "Article A"));
    const afterOldFailure: Model = Update(second, PanelEvent.Rejected(1, "A timed out"));
    const ready: Model = Update(afterOldSuccess, PanelEvent.Received(2, "Article B"));
    const afterDuplicate: Model = Update(ready, PanelEvent.Received(2, "Duplicate response"));
    const third: Model = Update(afterDuplicate, PanelEvent.Requested);
    const failed: Model = Update(third, PanelEvent.Rejected(3, "Connection lost"));

    return String.Join([
        ViewText(first),
        ViewText(second),
        ViewText(afterOldSuccess),
        ViewText(afterOldFailure),
        ViewText(ready),
        ViewText(afterDuplicate),
        ViewText(failed),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Loading request 1
Loading request 2
Loading request 2
Loading request 2
Article B
Article B
Could not load: Connection lost
        </CodeBlock>
        <Heading level="2">Follow both ways a response can be ignored</Heading>
        <Paragraph>The example tests two possible outcomes for request 1 from the same starting point, just after request 2 starts. Both leave request 2 on screen because the active ID and the event ID differ. The rest of the trace continues from the stale success. Request 2 succeeds and the panel moves to `Ready`. A duplicate response with that same ID leaves the title alone because the reducer only accepts a response in the loading case. Request 3 fails while it is active, so its error becomes visible.</Paragraph>
        <Paragraph>The `with` expressions make new record values. The first load still has ID 1 after you start the second load. Both success and failure call the same `Complete` function, so they apply the same acceptance rule. In a test you can build a prefix of the trace once, then feed different completions into it to see what the panel does.</Paragraph>
        <Heading level="2">Carry the ID across the host boundary</Heading>
        <Paragraph>When wiring up a real fetch, the host uses the selected article key to choose what to fetch. It captures the newly assigned request ID to identify that particular attempt. The same article can be selected twice and get two different request IDs. Dispatch the captured ID when the promise settles. Reading the latest ID at completion time would label an old response with the new load’s ID and defeat the check. If a host can cancel a superseded request, cancellation saves work. Keep the ID check because a response may already be queued when cancellation happens.</Paragraph>
        <Paragraph>Try delivering request 2’s success before request 1’s. Use the same state just after request 2 starts, then feed it both events in the opposite order. Article B should remain visible in either trace. For a larger test suite, assert the state case and its data directly. The display text in this example makes the sequence easy to read, but different states can have the same copy.</Paragraph>
        <Paragraph>Return to [The Copeland TS Book](/copeland-ts/book/) to revisit the examples.</Paragraph>
    </Document>;
}
