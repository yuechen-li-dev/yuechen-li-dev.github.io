export function ScreenState(): Document {
    return <Document>
        <Paragraph>Imagine a details panel that loads an article when you select it. Before you select anything, it prompts you to choose an article. While the request runs, it shows a loading message. When the request finishes, the panel shows either the article title or an error and a way to retry. Every change in screen copy comes from a change in what the application knows.</Paragraph>
        <Heading level="2">Look for fields that depend on each other</Heading>
        <Paragraph>Suppose the panel stores an `isLoading` flag, an optional `title`, and an optional `error`. What should it show if all three are set? Perhaps the user is refreshing an article they can already read. Perhaps the last request failed and an earlier title was left behind. The fields alone leave that decision to every caller and every renderer.</Paragraph>
        <Paragraph>For this panel, start by choosing four mutually exclusive states. Idle and loading carry no data. A ready panel has a title. A failed panel has an explanation. Combining an existing title with progress or error data is a separate product decision that we can add later.</Paragraph>
        <Heading level="2">Start with a TypeScript kind field</Heading>
        <Paragraph>This is a job for a [discriminated union](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) in TypeScript. Each object has a literal `kind`. Narrowing on that field tells TypeScript what else the object contains.</Paragraph>
        <CodeBlock language="typescript">
type Panel =
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "ready"; title: string }
    | { kind: "failed"; message: string };

function viewText(panel: Panel): string {
    switch (panel.kind) {
        case "idle":
            return "Choose an article";
        case "loading":
            return "Loading...";
        case "ready":
            return panel.title;
        case "failed":
            return "Could not load: " + panel.message;
        default: {
            const unhandled: never = panel;
            return unhandled;
        }
    }
}

console.log(viewText({ kind: "idle" }));
console.log(viewText({ kind: "loading" }));
console.log(viewText({ kind: "ready", title: "Patterns in UI" }));
console.log(viewText({ kind: "failed", message: "Timed out" }));
        </CodeBlock>
        <CodeBlock language="output">
Choose an article
Loading...
Patterns in UI
Could not load: Timed out
        </CodeBlock>
        <Paragraph>Inside the ready case, `panel.title` is a string. If you tried to read it in the loading case, TypeScript would report an error. The assignment to `never` checks that there are no cases left over. Add a refreshing variant to the union and that assignment fails until the switch handles it. The [TypeScript handbook’s exhaustiveness section](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking) explains the narrowing rule behind this.</Paragraph>
        <Heading level="2">Give the same model an enum and a match</Heading>
        <Paragraph>Copeland takes the same idea directly from Rust’s [enums with data](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html) and [exhaustive match expressions](https://doc.rust-lang.org/book/ch06-02-match.html#matches-are-exhaustive). An enum declaration names the cases and declares their data in one place. Construct a value by naming a case. Use `match` to select a case and bind its data where you need it.</Paragraph>
        <Paragraph>Using the workspace from [Your first program](/copeland-ts/book/first-program/), replace `src/Hello.ts` with this program. It prints the same four lines as the TypeScript version.</Paragraph>
        <CodeBlock language="copeland">
enum Panel {
    Idle,
    Loading,
    Ready(title: string),
    Failed(message: string),
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
    return String.Join([
        ViewText(Panel.Idle),
        ViewText(Panel.Loading),
        ViewText(Panel.Ready("Patterns in UI")),
        ViewText(Panel.Failed("Timed out")),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Choose an article
Loading...
Patterns in UI
Could not load: Timed out
        </CodeBlock>
        <Paragraph>Read `Ready(title) => title` in two steps. The pattern on the left says which case to handle and binds that case’s string to a local name. The expression on the right uses the name to produce the view text. All four arms return strings, so the match itself yields a string. The enum declaration gives you the constructor `Panel.Ready` with its required string argument, and the compiler checks coverage directly at the match.</Paragraph>
        <Heading level="2">Change the model and follow the compiler</Heading>
        <Paragraph>Imagine a product change. When the user refreshes a loaded article, the title should stay visible with a small progress indicator. Add a `Refreshing(previousTitle: string)` case and build before touching `ViewText`. In `obj/build.json`, the compiler reports that the match is missing `Refreshing`. Add an arm that shows the previous title and a refresh message, then call it from `Main`. Refreshing now explicitly promises the data required to keep the old view on screen.</Paragraph>
        <Paragraph>Use a record when data can vary independently. The panel can be expanded or collapsed in any phase, so an `expanded` flag belongs next to the panel state in a record. A record can also serve as a payload. If the ready panel needs a title, body, and author, give `Ready` an article record. A renderer can then bind that record in one place and use the parts it needs.</Paragraph>
        <Paragraph>The state describes what the user can see at one moment. Next, give clicks and responses a vocabulary of their own in [Reduce UI events](/copeland-ts/book/reduce-ui-events/).</Paragraph>
    </Document>;
}
