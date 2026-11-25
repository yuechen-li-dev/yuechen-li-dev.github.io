export function TypeRequirements(): Document {
    return <Document>
        <Paragraph>The queue can schedule both tasks and reminders. A task has a title and an estimate. A reminder has a message and an estimate. The scheduling rule only cares about the estimate. Give the two kinds of data their own types, then express the one requirement they share.</Paragraph>
        <Heading level="2">Recognize the TypeScript pattern</Heading>
        <Paragraph>Traditional TypeScript can use an interface directly as a parameter type. The caller supplies any compatible object. This example also uses a `type` alias so the signature says which `number` values represent minutes. [TypeScript handbook on type aliases and interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces).</Paragraph>
        <CodeBlock language="typescript">
type Minutes = number;

interface HasEstimate {
    estimate: Minutes;
}

function fitsToday(item: HasEstimate, available: Minutes): boolean {
    return item.estimate > 0 && item.estimate <= available;
}

function label(fits: boolean): string {
    return fits ? "schedule today" : "defer";
}

const task = { title: "Review patch", estimate: 4 };
const reminder = { message: "Check build", estimate: 7 };
const available: Minutes = 5;

console.log("Task: " + label(fitsToday(task, available)));
console.log("Reminder: " + label(fitsToday(reminder, available)));
        </CodeBlock>
        <CodeBlock language="output">
Task: schedule today
Reminder: defer
        </CodeBlock>
        <Heading level="2">Give an existing type a name</Heading>
        <Paragraph>In Copeland, `type Minutes = int` gives the existing `int` type another name. The alias makes a parameter’s purpose visible and can shorten a repeated expression such as an array or Result type. It has the same type identity as its target, so the literal `5` can be passed wherever a `Minutes` value is expected. Use a named `record` when the data needs its own identity, as `QueueTask` and `Reminder` do below. [Copeland record shapes and type aliases](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/language/copeland-record-shapes-types-interfaces-design.md#type).</Paragraph>
        <Heading level="2">Ask for a capability with interface</Heading>
        <Paragraph>In Copeland, place `HasEstimate` after `extends` on a type parameter. Read that declaration as “for any concrete type T with a readable estimate of this type.” The function takes a concrete T and may read the fields promised by the constraint. At each call, Copeland checks the concrete type and keeps its identity. Extra fields are allowed, and the record does not need an `implements` declaration.</Paragraph>
        <Paragraph>Use the project from [Your first program](/copeland-ts/book/first-program/) and replace `src/Hello.ts` with this program.</Paragraph>
        <CodeBlock language="copeland">
type Minutes = int;

interface HasEstimate {
    estimate: Minutes;
}

record QueueTask {
    title: string;
    estimate: Minutes;
}

record Reminder {
    message: string;
    estimate: int;
}

function FitsToday<T extends HasEstimate>(item: T, available: Minutes): boolean {
    return item.estimate > 0 && item.estimate <= available;
}

function Label(fits: boolean): string {
    return if fits { "schedule today" } else { "defer" };
}

export function Main(): string {
    const task: QueueTask = { title: "Review patch", estimate: 4 };
    const reminder: Reminder = { message: "Check build", estimate: 7 };
    const available: Minutes = 5;

    return String.Join([
        "Task: " + Label(FitsToday(task, available)),
        "Reminder: " + Label(FitsToday(reminder, available)),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Task: schedule today
Reminder: defer
        </CodeBlock>
        <Paragraph>Inside `FitsToday`, the constraint guarantees `item.estimate`. A read of `item.title` would require an additional guarantee because `Reminder` supplies a message instead. Copeland’s interfaces describe field requirements at compile time. Use concrete records for stored values and a generic constraint when an operation can accept several shapes. A record-shaped `type` alias can also supply field requirements. In this book, we use `interface` to make the capability role visible at the declaration. [Copeland interface guide](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/authoring/copeland-typescript-guide.md#interfaces-are-constraints-not-storage-types).</Paragraph>
        <Paragraph>Try renaming the `Reminder` field to `duration` in its declaration and initializer. The call to `FitsToday` fails because the concrete type no longer supplies `estimate`. Restore it and try passing `5` directly. Both calls still work because `Minutes` is a name for `int`.</Paragraph>
        <Paragraph>Next, see what changes when the same reusable declaration uses [generics and templates](/copeland-ts/book/generics-and-templates/).</Paragraph>
    </Document>;
}
