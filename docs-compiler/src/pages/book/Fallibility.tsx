export function Fallibility(): Document {
    return <Document>
        <Paragraph>On a quiet day, there may be no tasks to show. When a user submits an empty task name, the queue should tell them what to fix. If both operations returned the same missing value, the caller would have to guess whether to display an empty state or show a validation error. Copeland gives these outcomes different types. `Option` answers whether a value is present. A `Result` answers whether an operation succeeded and carries the reason when it failed.</Paragraph>
        <Heading level="2">Start with a familiar TypeScript queue</Heading>
        <Paragraph>In traditional TypeScript, an array’s `find` returns `undefined` when the search has no match. An API that uses `null` as its empty value might declare `string | null` instead. With [strict null checks](https://www.typescriptlang.org/tsconfig/strictNullChecks.html), those values have distinct types and you have to account for them before using the result as a string. The first two calls here use `??` to provide a fallback when the lookup returns `undefined`. The same operator supplies a fallback for `null`.</Paragraph>
        <Paragraph>For validation, this implementation uses the JavaScript convention of throwing an `Error` and catching it where the program can show a message. Watch the signature of `validateName` as you read. Its declared return type describes what comes back on success.</Paragraph>
        <CodeBlock language="typescript">
function firstTask(tasks: readonly string[]): string | undefined {
    return tasks.find(() => true);
}

function validateName(name: string): string {
    if (name === "") {
        throw new Error("a task needs a name");
    }
    return name;
}

function queueLabel(name: string): string {
    return "Queued: " + validateName(name);
}

function describeRequest(name: string): string {
    try {
        return queueLabel(name);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return "Rejected: " + error.message;
        }
        throw error;
    }
}

console.log(firstTask([]) ?? "No tasks");
console.log(firstTask(["Write the docs"]) ?? "No tasks");
console.log(describeRequest("Write the docs"));
console.log(describeRequest(""));
        </CodeBlock>
        <CodeBlock language="output">
No tasks
Write the docs
Queued: Write the docs
Rejected: a task needs a name
        </CodeBlock>
        <Paragraph>Both `validateName` and `queueLabel` say they return a string. The fact that either can throw has to be communicated separately, usually in documentation or by reading the implementation. The catch variable starts as `unknown` because JavaScript allows anything to be thrown. The `instanceof Error` check narrows it before the code reads its message. If you want failure in the return type of a TypeScript function, you can already express it with a discriminated union, just as we did for screen state. [TypeScript guidance on catch variables](https://www.typescriptlang.org/tsconfig/useUnknownInCatchVariables.html) and [the book’s tagged-union example](/copeland-ts/book/model-ui-state/) show those two techniques.</Paragraph>
        <Heading level="2">Represent absence with Option</Heading>
        <Paragraph>Copeland source uses explicit optional values in place of ambient `null` and `undefined`. Read `Option of T` as a container with exactly two cases. `Some(value)` contains one value of type `T`. `None` contains no value. A function that returns a plain `string` promises a string. A function that can lack one declares an Option of string. If an incoming JavaScript API uses a sentinel for absence, translate that contract at the interop boundary so the Copeland code can work with an Option.</Paragraph>
        <Paragraph>Use the project from [Your first program](/copeland-ts/book/first-program/) and replace `src/Hello.ts` with the following. In `FirstTask`, the length check comes before indexing. The empty queue returns `None` and a queue with a task returns `Some` containing its name.</Paragraph>
        <CodeBlock language="copeland">
function FirstTask(tasks: string[]): Option<string> {
    if (tasks.length == 0) {
        return None;
    }
    return Some(tasks[0]);
}

function DisplayTask(task: Option<string>): string {
    return match task {
        Some(name) => name,
        None => "No tasks",
    };
}

export function Main(): string {
    const empty: string[] = [];
    const tasks: string[] = ["Write the docs"];
    const first: Option<string> = FirstTask(tasks);
    const fallback: string = FirstTask(empty) ?? "No tasks";

    return String.Join([
        DisplayTask(FirstTask(empty)),
        DisplayTask(first),
        fallback,
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
No tasks
Write the docs
No tasks
        </CodeBlock>
        <Paragraph>Matching an Option opens it. In the `Some(name)` arm, `name` is an ordinary string and is available only in that arm. `None` has no payload to bind. Both arms yield a string in this example. If all you need is a default, `??` expresses the same choice directly. It evaluates the fallback only for `None`. A present value such as `Some("")` still wins over the fallback.</Paragraph>
        <Paragraph>Optional record fields use the same model. A declaration like `nickname?: string` makes the field an Option of string, and omitting it when constructing the record supplies `None`. The [optional values reference](https://github.com/yuechen-li-dev/Copeland/blob/2490894430af407b9ebefcf648a12008d9c8ba16/docs/Copeland/language/copeland-ts-option.md) covers this shorthand and how `?.` projects through an Option.</Paragraph>
        <Heading level="2">Put the error in the return type</Heading>
        <Paragraph>A validation failure carries information the caller needs. Think of a Result as a value with one of two cases. `ok(value)` contains the successful value. `err(error)` contains the failure reason. `T` names the success type and `E` names the error type. Rust uses the generic name in the first line below. Copeland writes the same idea with the bang notation carried over from Oct. Copeland function signatures put a colon before the return type.</Paragraph>
        <CodeBlock language="text">
Result<T, E>                    Name for the two-case type
-> T ! E                        Oct return notation
function Work(): T ! E          Copeland function signature
        </CodeBlock>
        <Paragraph>In Copeland, spell the type `T ! E` in both signatures and value declarations. Read it as “a T on success, or an E on failure.” The call itself gives you the Result value. You can store it in a variable, pass it to another function, return it, or inspect it with a match. The [Rust Book’s Result chapter](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html) explains the same success-or-error model in Rust.</Paragraph>
        <Heading level="2">Match a Result or let the error travel</Heading>
        <Paragraph>Give the queue an error enum so the caller can distinguish an empty name from a reserved one. `EmptyName` carries everything the caller needs in the case name itself. `ReservedName` carries the offending name so the caller can show it. In this version, a request can also ask for a preview, which produces a label without validating a task name.</Paragraph>
        <CodeBlock language="copeland">
enum NameError {
    EmptyName,
    ReservedName(name: string),
}

enum QueueAction {
    Add(name: string),
    Preview,
}

function ValidateName(name: string): string ! NameError {
    if (name == "") {
        return err(NameError.EmptyName);
    }
    if (name == "system") {
        return err(NameError.ReservedName(name));
    }
    return ok(name);
}

function QueueLabel(action: QueueAction): string ! NameError {
    return match action {
        case Add(name) => ok("Queued: " + ValidateName(name)?),
        case Preview => ok("Preview only"),
    };
}

function DescribeError(error: NameError): string {
    return match error {
        EmptyName => "a task needs a name",
        ReservedName(name) => name + " is reserved",
    };
}

function DescribeRequest(result: string ! NameError): string {
    return switch result {
        case ok(label) => label,
        case err(error) => "Rejected: " + DescribeError(error),
    };
}

export function Main(): string {
    const added: string ! NameError = QueueLabel(QueueAction.Add("Write the docs"));
    const emptyName: string ! NameError = QueueLabel(QueueAction.Add(""));
    const reservedName: string ! NameError = QueueLabel(QueueAction.Add("system"));
    const preview: string ! NameError = QueueLabel(QueueAction.Preview);

    return String.Join([
        DescribeRequest(added),
        DescribeRequest(emptyName),
        DescribeRequest(reservedName),
        DescribeRequest(preview),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Queued: Write the docs
Rejected: a task needs a name
Rejected: system is reserved
Preview only
        </CodeBlock>
        <Paragraph>There are two places to follow the error path. In `QueueLabel`, the match dispatches on the action. Only the selected arm runs. When it selects `Add`, postfix `?` inspects the Result from `ValidateName`. On success it yields the name, so the arm finishes building the label and wraps it in `ok`. On failure it immediately returns `err` with the same `NameError` from `QueueLabel`. The function’s declared error type gives that early return a place to go. The preview arm simply returns its own `ok`.</Paragraph>
        <Paragraph>In `DescribeRequest`, the subject of the switch is the Result itself. Its `ok(label)` arm receives a string, and its `err(error)` arm receives a `NameError`. This is where we decide how to present the failure. Both arms return plain strings, so the function finishes handling the Result. This is a match on a Result, spelled `switch`. The two keywords are [aliases for the same exhaustive construct](/copeland-ts/book/enums-and-match/#choose-match-or-switch), with or without a `case` prefix.</Paragraph>
        <Heading level="2">Choose what your caller needs to know</Heading>
        <List>
            <Item><Paragraph>Return an Option when absence is an expected answer. Looking for the first task in a queue that happens to be empty is a successful lookup with nothing to display.</Paragraph></Item>
            <Item><Paragraph>Return a Result when callers need to know why the operation failed. Use a match where you can make a decision about the error, and use postfix `?` to pass it along from a function with the same error type. For an Option, use `match` or `??` to decide what absence means.</Paragraph></Item>
            <Item><Paragraph>Use both when the two facts can vary independently. A store lookup might return `ok(None)` when it reached the store and found no matching row, `ok(Some(task))` when it found one, or `err(error)` when the store was unavailable. A caller could show an empty state for the first, render the task for the second, and offer a retry for the third.</Paragraph></Item>
        </List>
        <Paragraph>Try adding a third error case for names that exceed a length limit. Rebuild after adding the case and have a look at `obj/build.json`. The description of that error requires a new match arm. The propagation inside `QueueLabel` already passes along any value of the declared `NameError` type. Once you add the validation rule and a description, call the queue with a long name and check the rejection.</Paragraph>
        <Paragraph>Next, take the queue into a larger project with [modules, targets, and testing](/copeland-ts/book/modules-and-testing/).</Paragraph>
    </Document>;
}
