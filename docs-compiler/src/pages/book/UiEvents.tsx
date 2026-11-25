export function UiEvents(): Document {
    return <Document>
        <Paragraph>In [Model a loading screen](/copeland-ts/book/model-ui-state/), the screen’s type tells the renderer what it can show. Now decide how it gets there. A click asks for an article. A response supplies a title or an error. A retry click asks to start over. Those events can happen at different times, and what each one should do depends on the current panel.</Paragraph>
        <Heading level="2">Distinguish events from states</Heading>
        <Paragraph>Give the panel’s current state and its incoming events separate enums. `Panel.Loading` means the panel is waiting. `PanelEvent.Requested` says something happened that might start a load. `PanelEvent.Received` carries the title from a completed request. Whether that title becomes the next `Panel.Ready` is a decision for the update function.</Paragraph>
        <Paragraph>In this first version, the panel starts one request at a time. It accepts the initial click while idle, accepts retry only after failure, and accepts a completion only while loading. Every other event leaves the panel as it was. Keep those choices in a reducer, a function that takes the current state and one event and returns the next state.</Paragraph>
        <CodeBlock language="copeland">
enum Panel {
    Idle,
    Loading,
    Ready(title: string),
    Failed(message: string),
}

enum PanelEvent {
    Requested,
    Received(title: string),
    Rejected(message: string),
    Retry,
}

function Request(panel: Panel): Panel {
    return match panel {
        Idle => Panel.Loading,
        Loading => panel,
        Ready(_) => panel,
        Failed(_) => panel,
    };
}

function RetryRequest(panel: Panel): Panel {
    return match panel {
        Idle => panel,
        Loading => panel,
        Ready(_) => panel,
        Failed(_) => Panel.Loading,
    };
}

function Complete(panel: Panel, completed: Panel): Panel {
    return match panel {
        Idle => panel,
        Loading => completed,
        Ready(_) => panel,
        Failed(_) => panel,
    };
}

function Update(panel: Panel, event: PanelEvent): Panel {
    return switch event {
        case Requested => Request(panel),
        case Received(title) => Complete(panel, Panel.Ready(title)),
        case Rejected(message) => Complete(panel, Panel.Failed(message)),
        case Retry => RetryRequest(panel),
    };
}

function ViewText(panel: Panel): string {
    return match panel {
        Idle => "Choose an article",
        Loading => "Loading...",
        Ready(title) => title,
        Failed(message) => "Could not load: " + message,
    };
}

export function Main(): string {
    const idle: Panel = Panel.Idle;
    const early: Panel = Update(idle, PanelEvent.Received("Too early"));
    const loading: Panel = Update(early, PanelEvent.Requested);
    const failed: Panel = Update(loading, PanelEvent.Rejected("Timed out"));
    const retrying: Panel = Update(failed, PanelEvent.Retry);
    const ready: Panel = Update(retrying, PanelEvent.Received("Patterns in UI"));
    const afterRetryClick: Panel = Update(ready, PanelEvent.Retry);

    return String.Join([
        ViewText(early),
        ViewText(loading),
        ViewText(failed),
        ViewText(retrying),
        ViewText(ready),
        ViewText(afterRetryClick),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Choose an article
Loading...
Could not load: Timed out
Loading...
Patterns in UI
Patterns in UI
        </CodeBlock>
        <Heading level="2">Read the two decisions separately</Heading>
        <Paragraph>The switch in `Update` asks what happened. It uses the [same pattern rules as match](/copeland-ts/book/enums-and-match/#choose-match-or-switch). For a rejected request, it takes the error message out of the event and proposes a failed panel. The match in `Complete` asks whether the current panel can accept that outcome. A loading panel accepts it. An idle, ready, or failed panel retains its state. A pattern like `Ready(_)` matches a ready panel without binding the title, since that branch returns the existing panel as a whole.</Paragraph>
        <Paragraph>Each match names all the relevant cases. If you add a new event, start at `Update`. If you add a new panel state, the matches that decide what to display or which actions to accept all need a decision. In a real interface, the same panel state can also drive the disabled state of a retry button. That keeps the visual controls and the update rules tied to the same model.</Paragraph>
        <Heading level="2">Run the reducer without a browser</Heading>
        <Paragraph>The example feeds events directly into the reducer. It builds and runs on Node and .NET with the same trace. The first line shows that an early result leaves the panel idle. The last shows that a retry delivered after success leaves the article visible. You can create either sequence without clicking a button, starting a server, or waiting for a timeout.</Paragraph>
        <Paragraph>In an application, the host starts the fetch when a request is accepted, then dispatches a received or rejected event on completion. The reducer is ordinary synchronous code. The view reads its result, and the host owns the network call. Try sending a second `Requested` event while already loading and compare the text before and after.</Paragraph>
        <Paragraph>So far, `Loading` only says that a request is pending. Next, [wire the view to events and state](/copeland-ts/book/wire-ui-events/) to see how the browser host uses the reducer. The browser example also gives each load its own identity, a rule you can work through in [Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/).</Paragraph>
    </Document>;
}
