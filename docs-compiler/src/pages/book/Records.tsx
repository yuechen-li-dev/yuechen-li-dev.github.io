export function Records(): Document {
    return <Document>
        <Paragraph>A task has a title and a priority. Imagine that an ordered list of tasks is already on screen when a user promotes one. The view needs the new priority. A test, an undo action, or another part of the view may still need the previous one. How you represent the task determines whether both values can remain available.</Paragraph>
        <Heading level="2">Describe a shape in TypeScript</Heading>
        <Paragraph>In traditional TypeScript, a `type` alias is a common way to name the shape of a JavaScript object. The compiler checks that a `Task` has the required properties with the right types. An object with compatible properties can satisfy that type because the check is structural. At runtime, there is an ordinary JavaScript object behind the type alias. [TypeScript handbook on type aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases).</Paragraph>
        <Paragraph>The example below first promotes a task with object spread, then changes the original in place. Pay attention to the two names for the original object. `task` allows writes, and `oldView` is read-only through its type. Both refer to the same object.</Paragraph>
        <CodeBlock language="typescript">
type Task = {
    title: string;
    priority: number;
};

function promote(task: Readonly<Task>): Task {
    return { ...task, priority: task.priority + 1 };
}

const task: Task = { title: "Write tests", priority: 4 };
const oldView: Readonly<Task> = task;
const promoted = promote(task);

console.log("After spread, original: " + oldView.priority + ", copy: " + promoted.priority);

task.priority = 5;
console.log("After mutation, old view: " + oldView.priority);
        </CodeBlock>
        <CodeBlock language="output">
After spread, original: 4, copy: 5
After mutation, old view: 5
        </CodeBlock>
        <Paragraph>The spread copies the original’s properties into a new object, then the later `priority` property overrides the copied one. That leaves the original at 4. The last assignment changes the original object itself, so reading through `oldView` now gives 5. In JavaScript, `const` keeps the variable bound to that object. TypeScript’s `readonly` checks writes through the annotated type. [TypeScript handbook on read-only properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties).</Paragraph>
        <Heading level="2">Declare an immutable record in Copeland</Heading>
        <Paragraph>A Copeland `record` names a fixed set of fields and defines a type of its own. `Task` and a separately declared `DraftTask` are different record types even if they happen to have the same fields. This is called nominal typing. In the example below, the annotation on `original` tells Copeland that the brace initializer constructs a `Task`. A function that returns `Task` promises that same named type.</Paragraph>
        <Paragraph>The fields belong to the value and stay fixed after construction. To represent a promotion, write `task with` and give the replacement for `priority`. The compiler checks that the field exists on `Task` and that the replacement is an `int`. The expression produces another `Task` with the previous title and the new priority. You can also assign the result to a `let` variable that tracks the current task. That changes which value the variable holds, while a list that already contains the earlier task keeps it.</Paragraph>
        <Heading level="2">Where the design comes from</Heading>
        <Paragraph>A Rust `struct` is a close analogy for named, typed fields. Rust allows in-place updates through a mutable binding or borrow, which is useful when you want to change the current value. To keep both versions in Rust, you construct another struct and decide how to share or copy the data it needs. Copeland makes keeping the original the ordinary result of a record update. That makes it straightforward to compare versions, keep an undo entry, or reuse a test fixture. [Rust Book on defining structs](https://doc.rust-lang.org/book/ch05-01-defining-structs.html) and [borrowing](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references).</Paragraph>
        <Paragraph>C# gives the closest spelling. A `readonly record struct` has immutable positional properties. The ordinary C# `record struct` allows those properties to be mutable. Copeland borrows C#’s `with` expression for copy-and-update. The two examples below preserve the original and name only the field that changes. Copeland applies that rule on both Node and .NET. [C# records](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record) and [the with expression](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/with-expression).</Paragraph>
        <CodeBlock language="csharp">
var original = new QueueTask("Write tests", 4);
var promoted = original with { Priority = original.Priority + 1 };
System.Console.WriteLine($"{original.Priority} / {promoted.Priority}");

readonly record struct QueueTask(string Title, int Priority);
        </CodeBlock>
        <Paragraph>The C# example prints `4 / 5`. The first value still holds priority 4 after building the promoted version.</Paragraph>
        <Heading level="2">Keep the queue before and after a promotion</Heading>
        <Paragraph>Replace `src/Hello.ts` in the [book project](/copeland-ts/book/first-program/) with this program. It builds two arrays. The first contains the original task and a second task. The second contains the promoted task and the same second task. Read the priorities and list the urgent titles from each version.</Paragraph>
        <CodeBlock language="copeland">
record Task {
    title: string;
    priority: int;
}

function Promote(task: Task): Task {
    return task with { priority: task.priority + 1 };
}

function UrgentTitles(tasks: Task[]): string[] {
    const titles = MutableList<string>();
    for (const task of tasks) {
        if (task.priority >= 5) {
            titles.append(task.title);
        }
    }

    return titles.freeze();
}

function DescribeUrgent(tasks: Task[]): string {
    const titles: string[] = UrgentTitles(tasks);
    if (titles.length == 0) {
        return "none";
    }

    return String.Join(titles, ", ");
}

export function Main(): string {
    const original: Task = { title: "Write tests", priority: 4 };
    const other: Task = { title: "Publish guide", priority: 2 };
    const before: Task[] = [original, other];
    const promoted: Task = Promote(original);
    const after: Task[] = [promoted, other];
    const originalPriority: int = before[0].priority;
    const promotedPriority: int = after[0].priority;

    return String.Join([
        `Original priority: ${originalPriority}`,
        `Promoted priority: ${promotedPriority}`,
        "Urgent before: " + DescribeUrgent(before),
        "Urgent after: " + DescribeUrgent(after),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Original priority: 4
Promoted priority: 5
Urgent before: none
Urgent after: Write tests
        </CodeBlock>
        <Paragraph>The task crosses the urgency threshold only in the second queue. Both queues reuse `other` as an unchanged value. That is also how `with` treats fields you leave alone. If a record contains another record or an array, the unchanged field carries that same value into the new version. To change a nested record, first use `with` to build its replacement, then use that result in the outer `with`.</Paragraph>
        <Paragraph>Try replacing the body of `Promote` with the two lines below and rebuilding. The compiler points out the assignment to the immutable field in `obj/build.json`, even if you first put the task into a `let` variable. Then restore the working version and lower the urgency threshold to 4. Both queues should now show the task as urgent, while their stored priorities remain 4 and 5.</Paragraph>
        <CodeBlock language="text">
task.priority = task.priority + 1;
return task;
        </CodeBlock>
        <Heading level="2">Build an array with a mutable list</Heading>
        <Paragraph>Read `Task[]` as an ordered array of tasks. Copeland arrays are immutable from Copeland code. You can read their `length`, index them with an `int`, and use `for...of` to visit the elements in order. Indexing checks bounds. When the array could be empty, check its length before reading the first element. [Absence and failure](/copeland-ts/book/absence-and-failure/) builds on that check to return an optional first task.</Paragraph>
        <Paragraph>In `UrgentTitles`, the loop discovers the number of results as it goes. It appends each selected title to a `MutableList` of strings. A call to `freeze()` copies the builder’s current contents into a separate immutable array. The builder remains usable, so you can keep the first snapshot and append more items before taking another.</Paragraph>
        <CodeBlock language="copeland">
export function Main(): string {
    const titles = MutableList<string>();
    titles.append("Write tests");
    const before: string[] = titles.freeze();

    titles.append("Publish guide");
    const after: string[] = titles.freeze();

    return String.Join([
        "First snapshot: " + String.Join(before, ", "),
        "Second snapshot: " + String.Join(after, ", "),
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
First snapshot: Write tests
Second snapshot: Write tests, Publish guide
        </CodeBlock>
        <Paragraph>Use an array literal when you already have the elements, a mutable list when you discover them incrementally, and a `MutableArray` when you know the buffer length and need indexed writes. In the queue, the caller sees only the frozen array. Keeping the builder local makes it clear where mutation happens and gives every caller an array it can keep. [Copeland runtime arrays reference](https://github.com/yuechen-li-dev/Copeland/blob/2490894430af407b9ebefcf648a12008d9c8ba16/docs/Copeland/language/copeland-ts-runtime-arrays.md).</Paragraph>
        <Paragraph>Next, give the task queue a named schema and query it in [Record tables and queries](/copeland-ts/book/record-tables-and-queries/).</Paragraph>
    </Document>;
}
