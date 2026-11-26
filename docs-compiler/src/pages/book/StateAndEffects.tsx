export function StateAndEffects(): Document {
    return <Document>
        <Paragraph>In [Reduce UI events](/copeland-ts/book/reduce-ui-events/), a reducer chose the next screen from the current state and one event. An article load can also have a lifecycle of its own. It starts, waits for an answer, and ends with a title or an error. Once it ends, a second reply has nowhere to go. A Copeland `flow` gives those states and transitions names the compiler can check.</Paragraph>
        <Heading level="2">Start with the TypeScript pattern</Heading>
        <Paragraph>You can write the same state machine in traditional TypeScript with a union of states, a union of events, and a switch. When a transition calls for outside work, the reducer can return a description of that work along with the new state. The caller interprets the description, starts the request, and sends another event when the request finishes.</Paragraph>
        <CodeBlock language="typescript">
type LoadState =
    | { phase: "idle" }
    | { phase: "loading"; id: number }
    | { phase: "ready"; title: string };

type LoadEvent =
    | { kind: "start"; id: number }
    | { kind: "received"; id: number; title: string };

type ReadTitle = { kind: "readTitle"; id: number };

type Decision = { state: LoadState; effect?: ReadTitle };

function advance(state: LoadState, event: LoadEvent): Decision {
    switch (event.kind) {
        case "start":
            if (state.phase === "idle" && event.id > 0) {
                return {
                    state: { phase: "loading", id: event.id },
                    effect: { kind: "readTitle", id: event.id },
                };
            }
            return { state };
        case "received":
            if (state.phase === "loading" && state.id === event.id) {
                return { state: { phase: "ready", title: event.title } };
            }
            return { state };
    }
}

const started = advance({ phase: "idle" }, { kind: "start", id: 2 });
const stale = advance(started.state, { kind: "received", id: 1, title: "Old title" });
const ready = advance(stale.state, { kind: "received", id: 2, title: "Patterns in UI" });

console.log(started.effect?.kind, stale.state.phase, ready.state.phase);
        </CodeBlock>
        <CodeBlock language="output">
readTitle loading ready
        </CodeBlock>
        <Paragraph>Here the effect is data. It names the request the host should perform. The event describing the result carries the same ID. That gives the transition rule enough information to accept the right result and ignore the older one. You can test the decision with ordinary values and leave the network to a separate test.</Paragraph>
        <Heading level="2">Declare the same transitions with flow</Heading>
        <Paragraph>Save the next declaration as `ArticleLoad.ts` in a separate directory for the Node exercise below. This version adds a failure outcome. The `board` holds the data that survives across events. Each `state` lists the events it accepts, and the arrow names the next state.</Paragraph>
        <CodeBlock language="copeland-fragment">
flow ArticleLoad -> string ! string {
    board {
        requestId: int = 0;
        title: string = "";
        message: string = "";
    }

    event Start(id: int);
    event Received(id: int, title: string);
    event Rejected(id: int, message: string);

    state Idle initial {
        on Start(id) when id > 0 -> Loading {
            board.requestId = id;
        };
    }

    state Loading {
        on Received(id, title) when id == board.requestId -> Ready {
            board.title = title;
        };
        on Rejected(id, message) when id == board.requestId -> Failed {
            board.message = message;
        };
    }

    state Ready { finish board.title; }
    state Failed { fail board.message; }
}
        </CodeBlock>
        <Paragraph>Follow `Received` through the declaration. In `Idle` the event has no transition. In `Loading` the `when` guard compares its ID with the one on the board. If the guard passes, the title update and the move to `Ready` commit together. Entering `Ready` finishes the session with the title. Entering `Failed` ends it with the error declared after `!`.</Paragraph>
        <Paragraph>The names and types describe the same rules we wrote in the TypeScript switch. Mark exactly one state as `initial` so the session knows where to start. The compiler checks the target state named after each arrow, the payload types, and the values returned by `finish` and `fail`. An event with no applicable edge leaves the session as it was. A retry can start a fresh session for the same article.</Paragraph>
        <Heading level="2">Give the host control of effects</Heading>
        <Paragraph>Keep the request in the host. In the TypeScript version the host sees a `readTitle` effect description. With `ArticleLoad` the host sends `Start` and begins the request if the transition is accepted. On success it delivers `Received`, and on failure it delivers `Rejected`. That keeps scheduling and I/O in the caller and makes the flow’s transition a synchronous decision. The caller still owns which session is current when several article selections overlap.</Paragraph>
        <Heading level="2">Exercise the event flow from Node</Heading>
        <Paragraph>In the directory with `ArticleLoad.ts`, save this harness as `effect-check.mjs`. It calls the pinned compiler’s generated JavaScript session methods. Each event has its own sender. The test injects a request function so you can exercise the effect boundary without a server.</Paragraph>
        <CodeBlock language="javascript">
import assert from "node:assert/strict";
import { test } from "node:test";

async function attempt(session, id, readTitle) {
    if (session.sendStart(id).kind !== "Transitioned") return;

    let title;
    try {
        title = await readTitle();
    } catch (error) {
        return session.sendRejected(id, error instanceof Error ? error.message : String(error));
    }
    return session.sendReceived(id, title);
}

test("a stale reply leaves the current request loading", () => {
    const session = ArticleLoad.start();
    assert.equal(session.sendStart(0).kind, "Unhandled");
    assert.equal(session.sendStart(2).kind, "Transitioned");
    assert.equal(session.sendReceived(1, "Old title").kind, "Unhandled");
    assert.equal(session.state, "Loading");

    const received = session.sendReceived(2, "Patterns in UI");
    assert.equal(received.kind, "Completed");
    assert.equal(received.value, "Patterns in UI");
    assert.equal(session.sendReceived(2, "Duplicate").kind, "Terminal");
});

test("the host runs the effect and delivers its outcome", async () => {
    const success = await attempt(ArticleLoad.start(), 2, async () => "Patterns in UI");
    assert.equal(success.kind, "Completed");
    assert.equal(success.value, "Patterns in UI");

    const failure = await attempt(ArticleLoad.start(), 3, async () => {
        throw new Error("Timed out");
    });
    assert.equal(failure.kind, "Failed");
    assert.equal(failure.error, "Timed out");
});
        </CodeBlock>
        <Paragraph>Use the single-file JavaScript emitter for this exercise. Put the harness after the generated code so it can access the flow factory in the same module. Run these commands in PowerShell.</Paragraph>
        <CodeBlock language="powershell">
tscl compile ArticleLoad.ts --emit javascript --out flow.generated.mjs
Get-Content flow.generated.mjs, effect-check.mjs | Set-Content flow.test.mjs
node --test flow.test.mjs
        </CodeBlock>
        <Heading level="2">Step through work explicitly</Heading>
        <Paragraph>Copeland also has an execution form of `flow` for code the caller advances explicitly. Parentheses after the flow name introduce its inputs. A call to `step` advances one state body and returns a new frame. Save this example as `src/Hello.ts` in the workspace from [Your first program](/copeland-ts/book/first-program/). This flow prepares a preview in two steps so the caller can choose when to continue.</Paragraph>
        <CodeBlock language="copeland">
flow Preview(title: string) -> string {
    board { label: string = ""; }

    state Prepare initial {
        board.label = "Preview: " + title;
        transition Publish;
    }

    state Publish {
        finish board.label;
    }
}

export function Main(): string {
    const started = Preview.start("Patterns in UI");
    const prepared = Preview.step(started);
    const published = Preview.step(prepared);

    return match published.outcome {
        Active => "Still active",
        Yielded => "Paused",
        Completed(label) => label,
    };
}
        </CodeBlock>
        <CodeBlock language="output">
Preview: Patterns in UI
        </CodeBlock>
        <Paragraph>The first step stores the label and advances to `Publish`. The second runs that state body and completes. Event flows such as `ArticleLoad` advance on incoming events. Execution flows such as `Preview` advance when the caller steps the frame. Choose based on what drives the work.</Paragraph>
        <Paragraph>Use a reducer for a screen whose events keep coming. Use a flow when the work has named phases and the allowed transitions depend on where you are. A screen can use both. It can retain the selected article in a reducer while a flow tracks one load. The renderer’s component-local `state`, `on`, and `effect` declarations follow a separate [component runtime contract](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/language/components.md).</Paragraph>
        <Paragraph>Next, [score independent items with batch](/copeland-ts/book/batch-estimates/) once a load has given you the data to work on.</Paragraph>
    </Document>;
}
