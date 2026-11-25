enum Panel {
    Idle,
    Loading(requestId: int),
    Ready(title: string),
    Failed(message: string),
}

enum PanelEvent {
    Selected,
    Received(requestId: int, title: string),
    Rejected(requestId: int, message: string),
}

export record Model {
    nextRequest: int;
    panel: Panel;
}

export record PanelView {
    status: string;
    title: string;
    canRetry: boolean;
}

export function Initial(): Model {
    return { nextRequest: 1, panel: Panel.Idle };
}

function Complete(model: Model, requestId: int, outcome: Panel): Model {
    return match model.panel {
        Idle => model,
        Loading(active) => if active == requestId { model with { panel: outcome } } else { model },
        Ready(_) => model,
        Failed(_) => model,
    };
}

function Reduce(model: Model, event: PanelEvent): Model {
    return match event {
        Selected => model with { nextRequest: model.nextRequest + 1, panel: Panel.Loading(model.nextRequest) },
        Received(requestId, title) => Complete(model, requestId, Panel.Ready(title)),
        Rejected(requestId, message) => Complete(model, requestId, Panel.Failed(message)),
    };
}

export function Select(model: Model): Model {
    return Reduce(model, PanelEvent.Selected);
}

export function Receive(model: Model, requestId: int, title: string): Model {
    return Reduce(model, PanelEvent.Received(requestId, title));
}

export function Reject(model: Model, requestId: int, message: string): Model {
    return Reduce(model, PanelEvent.Rejected(requestId, message));
}

export function LatestRequest(model: Model): int {
    return model.nextRequest - 1;
}

export function Snapshot(model: Model): PanelView {
    return match model.panel {
        Idle => { status: "Choose an article", title: "", canRetry: false },
        Loading(_) => { status: "Loading…", title: "", canRetry: false },
        Ready(title) => { status: "Loaded " + title, title: title, canRetry: false },
        Failed(message) => { status: "Could not load: " + message, title: "", canRetry: true },
    };
}

export function ValidateQuery(query: string): string ! string {
    if (query != "" && query.length < 2) { return err("Use at least 2 characters."); }
    if (query.length > 60) { return err("Use at most 60 characters."); }
    return ok(query);
}

export function Matches(title: string, query: string): boolean {
    return query == "" || String.IndexOf(title, query) >= 0;
}
