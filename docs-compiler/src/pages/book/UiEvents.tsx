export function UiEvents(): Document {
    return <Document>
        <Paragraph>In [Model a loading screen](/copeland-ts/book/model-ui-state/), the screen’s type tells the renderer what it can show. Now decide how it gets there. A click asks for an article. A response supplies a title or an error. A retry click asks to start over. Those events can happen at different times, and what each one should do depends on the current panel.</Paragraph>
        <Heading level="2">A reducer routes events</Heading>
        <Paragraph>A reducer answers one question. Given the current state and an event, what should the next state be? Think of it as routing an event to a state transition. The event tells you which rule to run. The current state tells you whether that rule should change anything. For example, route a retry to the retry rule. If the panel has failed, that rule returns a loading panel. If the panel is already ready, it returns the panel it received.</Paragraph>
        <Paragraph>In traditional TypeScript, use a discriminated union to give each event a name and the data it carries. A switch on that name is the routing step. Each branch can return the next value directly or delegate the decision to a small function.</Paragraph>
        <CodeBlock language="typescript">
type Panel =
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ready"; title: string }
    | { kind: "failed"; message: string };

type PanelEvent =
    | { type: "requested" }
    | { type: "received"; title: string }
    | { type: "rejected"; message: string }
    | { type: "retry" };

function update(panel: Panel, event: PanelEvent): Panel {
    switch (event.type) {
        case "requested":
            return panel.kind === "idle" ? { kind: "loading" } : panel;
        case "received":
            return panel.kind === "loading"
                ? { kind: "ready", title: event.title }
                : panel;
        case "rejected":
            return panel.kind === "loading"
                ? { kind: "failed", message: event.message }
                : panel;
        case "retry":
            return panel.kind === "failed" ? { kind: "loading" } : panel;
    }
    const unhandled: never = event;
    return unhandled;
}

const idle: Panel = { kind: "idle" };
const early = update(idle, { type: "received", title: "Too early" });
const loading = update(early, { type: "requested" });
const failed = update(loading, { type: "rejected", message: "Timed out" });
const retrying = update(failed, { type: "retry" });
console.log(early.kind, failed.kind, retrying.kind);
        </CodeBlock>
        <CodeBlock language="output">
idle failed loading
        </CodeBlock>
        <Paragraph>Read the first event through the switch. It reaches the received branch, and TypeScript knows that branch has a title. The panel is idle, so the branch leaves it idle. The event’s type routes it to the right branch even when the state makes the event irrelevant. The final `never` assignment gives you a compile error if you add an event to the union and forget to handle it.</Paragraph>
        <Callout>Zustand illustrates how little machinery this needs. Its core store keeps the current value, applies updates, and notifies subscribers when the value changes. The optional Redux middleware feeds each dispatched action to the reducer you provide. Your application owns the switch and its rules, so the store can stay small. [Store source](https://github.com/pmndrs/zustand/blob/main/src/vanilla.ts) · [Redux middleware source](https://github.com/pmndrs/zustand/blob/main/src/middleware/redux.ts).</Callout>
        <Heading level="2">Distinguish events from states</Heading>
        <Paragraph>Copeland expresses the same routing with payload enums and an exhaustive `match` or `switch`. The branch pattern can bind a title or error message directly from the event. Use the event enum to describe what came in and the panel enum to describe the states that can exist afterward.</Paragraph>
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
        <Heading level="2">Why keep the routing simple</Heading>
        <Paragraph>Reach for a reducer when several paths can change the same piece of state. A click, a keyboard shortcut, and a response handler can all send events through the same rules. If a retry must be legal only after failure, write that check once. To track down an unexpected screen, read the event and the state it arrived in. To reproduce it, feed those two values into the same function.</Paragraph>
        <Paragraph>A plain switch and a few small transition functions can handle most routing within a feature. You can follow one branch to see what an event costs. In this panel an ignored event returns the existing value without constructing a replacement. A store that preserves reference identity can use that to skip notifications, so subscribers avoid work for an update that changed nothing. Keep rendering and request execution in the host, where you can measure those costs separately.</Paragraph>
        <Heading level="2">Run the reducer without a browser</Heading>
        <Paragraph>The example feeds events directly into the reducer. It builds and runs on Node and .NET with the same trace. The first line shows that an early result leaves the panel idle. The last shows that a retry delivered after success leaves the article visible. You can create either sequence without clicking a button, starting a server, or waiting for a timeout.</Paragraph>
        <Paragraph>In an application, the host starts the fetch when a request is accepted, then dispatches a received or rejected event on completion. The reducer is ordinary synchronous code. The view reads its result, and the host owns the network call. Try sending a second `Requested` event while already loading and compare the text before and after.</Paragraph>
        <Paragraph>So far, `Loading` only says that a request is pending. Next, [wire the view to events and state](/copeland-ts/book/wire-ui-events/) to see how the browser host uses the reducer. The browser example also gives each load its own identity, a rule you can work through in [Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/).</Paragraph>
    </Document>;
}
