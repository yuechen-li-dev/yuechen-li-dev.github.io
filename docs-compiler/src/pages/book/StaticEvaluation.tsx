export function StaticEvaluation(): Document {
    return <Document>
        <Paragraph>The queue can estimate how many tasks of a given duration fit a time budget. A preset budget is known when you build the app. The duration of the selected task arrives later. You can precompute the answers for the preset and still use the actual duration at runtime. That is partial evaluation. The compiler evaluates the part whose inputs are known and leaves the remaining work for the running program.</Paragraph>
        <Heading level="2">Evaluate one ordinary call during the build</Heading>
        <Paragraph>Write `static` before the expression you want the compiler to evaluate. The helper itself is an ordinary function. It can build a table during compilation when called with known values, or at runtime when called with a budget supplied by the application. `const` keeps the binding fixed in either case.</Paragraph>
        <Paragraph>Save this as `src/Hello.ts` in the [book project](/copeland-ts/book/first-program/). Here the table stores how many complete tasks fit for each positive duration up to the limit. Entry zero stays zero so the builder only divides by positive durations.</Paragraph>
        <CodeBlock language="copeland">
function BuildSlots(budget: int, limit: int): int[] {
    const slots = MutableArray<int>(limit + 1);
    let duration: int = 1;
    while (duration <= limit) {
        slots[duration] = budget / duration;
        duration = duration + 1;
    }
    return slots.freeze();
}

function LookupSlots(slots: int[], duration: int): int {
    if (duration <= 0 || duration >= slots.length) {
        return 0;
    }
    return slots[duration];
}

function PresetSlots(duration: int): int {
    const slots: int[] = static BuildSlots(24, 8);
    return LookupSlots(slots, duration);
}

function CustomSlots(budget: int, duration: int): int {
    const slots: int[] = BuildSlots(budget, 8);
    return LookupSlots(slots, duration);
}

export function Main(): string {
    const preset: int = PresetSlots(3);
    const custom: int = CustomSlots(18, 3);
    const zero: int = PresetSlots(0);

    return String.Join([
        `Preset budget of 24: ${preset} slots`,
        `Custom budget of 18: ${custom} slots`,
        `Zero-minute task: ${zero} slots`,
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Preset budget of 24: 8 slots
Custom budget of 18: 6 slots
Zero-minute task: 0 slots
        </CodeBlock>
        <Heading level="2">Check what remains at runtime</Heading>
        <Paragraph>After the Node build, open `dist/src/Hello.js`. The preset path contains the computed array `[0, 24, 12, 8, 6, 4, 4, 3, 3]`. The custom path still calls `BuildSlots`. Both paths keep the lookup because it uses the duration passed by the caller. The compiler embeds the preset value before lowering the program for Node or .NET. [Static evaluation architecture](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/architecture/cts-static-meta-m1.md#post-static-phase-and-backend-boundary).</Paragraph>
        <Paragraph>Try putting `static` before `BuildSlots` in `CustomSlots`. Build and read the report in `obj/build.json`. The compiler needs a value for `budget` at that call site, and the runtime parameter is unavailable during the build. Restore the ordinary call. A local buffer may be used while evaluating a static-safe helper, as this example does, and `freeze()` supplies the immutable result the compiler embeds.</Paragraph>
        <Heading level="2">Choose what is worth precomputing</Heading>
        <List>
            <Item><Paragraph>Use `static` when the inputs are fixed for the build, the work is deterministic, and the resulting value is useful at runtime. Examples include a small lookup table, fixed coefficients, or a preset derived from declared configuration.</Paragraph></Item>
            <Item><Paragraph>Keep calculations that depend on request data, environment settings, or host I/O at runtime. The static evaluator accepts a bounded set of operations and reports a build diagnostic if a computation or its result exceeds those limits.</Paragraph></Item>
            <Item><Paragraph>Compare the cost of computing the value with the cost of embedding it. Evaluation adds build work, and changing a fixed input requires a rebuild. A large embedded value can grow the artifact and still take time to load or allocate. For this simple queue rule, a single division per task may be cheaper than preparing any table.</Paragraph></Item>
        </List>
        <Paragraph>A generic parameter selects a type, and a static parameter fixes a value for one specialization. A `static` expression goes a step further and evaluates the selected computation during the build. Choose the form that expresses the decision your program actually needs.</Paragraph>
        <Paragraph>Next, use an existing library from the JavaScript ecosystem in [Use npm packages](/copeland-ts/book/npm-packages/).</Paragraph>
    </Document>;
}
