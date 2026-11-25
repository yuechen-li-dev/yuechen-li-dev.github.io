export function GenericsTemplates(): Document {
    return <Document>
        <Paragraph>A queue can carry an estimate in minutes or a note about where the estimate came from. A generic record keeps the same structure and lets each caller choose the type of the payload. A generic function can then preserve that choice as it reads or writes the payload.</Paragraph>
        <Heading level="2">Choose a declaration spelling</Heading>
        <Paragraph>Copeland supports two spellings for the same generic declaration. Put the parameters after the name, as in traditional TypeScript, or write a `template` prefix before the declaration. Use the trailing parameters for short, familiar signatures. The prefix can make a longer list of constraints, defaults, and static settings easier to read. Keep the existing convention when you add to a module. The compiler accepts either spelling for functions, records, aliases, and interfaces. [Shared generics syntax](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Aurelian/visual-typescript-generics.md#two-spellings-one-meaning).</Paragraph>
        <Heading level="2">Keep the payload type through a call</Heading>
        <Paragraph>Save this as `src/Hello.ts` in the [book project](/copeland-ts/book/first-program/). `Pack` uses trailing parameters and infers the type from `5` in the first call. The second call supplies `string` explicitly. `Unpack` uses the prefix form. In both cases the caller gets back the same concrete payload type it put in.</Paragraph>
        <CodeBlock language="copeland">
record Entry<T> {
    value: T;
}

function Pack<T>(value: T): Entry<T> {
    return { value: value };
}

template<type T>
function Unpack(entry: Entry<T>): T {
    return entry.value;
}

template<static Buffer: int = 1>
function Reserve(estimate: int): int {
    return estimate + Buffer;
}

export function Main(): string {
    const duration: Entry<int> = Pack(5);
    const note: Entry<string> = Pack<string>("from the queue");
    const estimate: int = Unpack(duration);
    const padded: int = Reserve<Buffer: 2>(estimate);
    const standard: int = Reserve(estimate);

    return String.Join([
        `Estimate: ${estimate} minutes`,
        "Source: " + Unpack(note),
        `Custom reservation: ${padded} minutes`,
        `Default reservation: ${standard} minutes`,
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Estimate: 5 minutes
Source: from the queue
Custom reservation: 7 minutes
Default reservation: 6 minutes
        </CodeBlock>
        <Paragraph>A type parameter chooses a type. A `static` parameter in the same list chooses a value the compiler knows, such as the fixed buffer for a reservation. `Buffer: 2` selects the two-minute specialization. The `estimate` in parentheses is an ordinary argument. Calling `Reserve` still runs the sum at runtime. If the buffer can vary with user input, make it an ordinary value parameter too.</Paragraph>
        <Paragraph>The compiler closes a generic declaration for the arguments a program actually uses. Calls with the same type and static arguments can share a specialization. More distinct combinations can increase compile work and the amount of emitted code, so use a static parameter when the value genuinely needs to be fixed. Try rewriting `Unpack` with trailing type parameters and rerun the program. [Specialization and execution](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Aurelian/visual-typescript-generics.md#specialization-and-execution-are-separate).</Paragraph>
        <Heading level="2">Construct a value with instantiate</Heading>
        <Paragraph>Copeland also uses `template` for a declaration that constructs a typed value during compilation. Look at what follows the parameter list. `template` before `function` gives that function generic parameters. `template` followed by a name and result type declares a construction template. Use `instantiate` to request its completed value.</Paragraph>
        <Paragraph>Use this form when a compiler tool needs a typed artifact built from a fixed set of inputs. In a new directory, save this file as `Presets.ts`. `MakePreset` describes a project tree with one text file. `Example` uses `instantiate` to make that tree with a two-minute buffer.</Paragraph>
        <CodeBlock language="copeland-template">
template<static Name: string, static Buffer: int = 1> MakePreset: ProjectTree {
    emit(textFile("preset.txt", `${Name} buffer: ${Buffer} minutes`));
}

template<> Example: ProjectTree {
    return instantiate MakePreset<Name: "Morning", Buffer: 2>;
}
        </CodeBlock>
        <Paragraph>Run the template materializer to write the tree into a new directory.</Paragraph>
        <CodeBlock language="console">
tscl template materialize Presets.ts --entry Example --output ./preset-preview
        </CodeBlock>
        <Paragraph>Open `preset-preview/preset.txt` to see the generated content.</Paragraph>
        <CodeBlock language="file:preset.txt">
Morning buffer: 2 minutes
        </CodeBlock>
        <Paragraph>Omit the named `Buffer` argument and materialize into another new directory. The file then uses the default one-minute buffer. The compiler checks the template’s parameters and result, and the materializer writes the completed tree. Keep the generic function for calculations the running app needs. Use the construction template when you want the compiler tool to produce an artifact. [Construction templates](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/templates.md#declaration-and-instantiation).</Paragraph>
        <Paragraph>When you already have an ordinary helper and only want to precompute one call, use [static evaluation](/copeland-ts/book/static-evaluation/).</Paragraph>
    </Document>;
}
