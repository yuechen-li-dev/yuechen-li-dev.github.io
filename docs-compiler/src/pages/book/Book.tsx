export function Book(): Document {
    return <Document>
        <Paragraph>This book is for developers who already write JavaScript or TypeScript. It assumes you know functions, modules, and how to run a Node program. It introduces Copeland’s rules for modeling data, handling failure, and using the same code across targets.</Paragraph>
        <Paragraph>Start on Node with emitted JavaScript and your usual tools. Once a project declares Node and .NET targets, select the target at build time. The task queue in this book uses the same Copeland source on both.</Paragraph>
        <Heading level="2">Copeland TS basics</Heading>
        <List>
            <Item><Paragraph>[Your first program](/copeland-ts/book/first-program/) builds a Copeland source file and runs the emitted JavaScript in Node.</Paragraph></Item>
            <Item><Paragraph>[Values and functions](/copeland-ts/book/values-and-functions/) compares TypeScript and Copeland while deciding which tasks fit in the time left today.</Paragraph></Item>
            <Item><Paragraph>[Records and collections](/copeland-ts/book/records-and-collections/) compares TypeScript objects with immutable Copeland records and uses `with` to keep both versions of a task.</Paragraph></Item>
            <Item><Paragraph>[Payload enums and match](/copeland-ts/book/enums-and-match/) gives each task state its own data and shows how match and switch handle every case.</Paragraph></Item>
            <Item><Paragraph>[Absence and failure](/copeland-ts/book/absence-and-failure/) goes from TypeScript’s missing values and exceptions to Option, typed Results, and error propagation.</Paragraph></Item>
            <Item><Paragraph>[Modules, targets, and testing](/copeland-ts/book/modules-and-testing/) puts the scheduling rule in its own module and tests both the Node and .NET builds.</Paragraph></Item>
        </List>
        <Heading level="2">Model UI state</Heading>
        <Paragraph>Build an article panel that can load, fail, and recover. Each chapter adds a decision that comes up in real interfaces.</Paragraph>
        <List>
            <Item><Paragraph>[Model a loading screen](/copeland-ts/book/model-ui-state/) starts with a TypeScript kind union and shows how Rust-style payload enums and match express the same model in Copeland.</Paragraph></Item>
            <Item><Paragraph>[Reduce UI events](/copeland-ts/book/reduce-ui-events/) turns clicks, failures, and retries into explicit state transitions.</Paragraph></Item>
            <Item><Paragraph>[Handle out-of-order responses](/copeland-ts/book/stale-ui-responses/) keeps a slow response from replacing the article the user selected most recently.</Paragraph></Item>
        </List>
        <Heading level="2">Concurrency</Heading>
        <List>
            <Item><Paragraph>[Wait for work with async and await](/copeland-ts/book/async-estimates/) loads the queue’s task estimates and handles a typed failure.</Paragraph></Item>
            <Item><Paragraph>[Score independent items with batch](/copeland-ts/book/batch-estimates/) applies the scheduling rule to every estimate and checks the output on Node and .NET.</Paragraph></Item>
        </List>
        <Heading level="2">Metaprogramming</Heading>
        <List>
            <Item><Paragraph>[Name types and express requirements](/copeland-ts/book/types-and-interfaces/) uses aliases to name existing types and interfaces to describe what a function needs.</Paragraph></Item>
            <Item><Paragraph>[Reuse code with generics and templates](/copeland-ts/book/generics-and-templates/) compares the two generic spellings, static arguments, and construction templates.</Paragraph></Item>
            <Item><Paragraph>[Precompute values with static](/copeland-ts/book/static-evaluation/) builds a lookup table at compile time and weighs the cost of embedding it.</Paragraph></Item>
        </List>
        <Heading level="2">Packages and interoperability</Heading>
        <List>
            <Item><Paragraph>[Use npm packages](/copeland-ts/book/npm-packages/) declares a package export and runs it on Node through an ordinary ESM import.</Paragraph></Item>
            <Item><Paragraph>[Use NuGet packages](/copeland-ts/book/nuget-packages/) restores a .NET library and calls it directly from Copeland TS.</Paragraph></Item>
            <Item><Paragraph>[Use both ecosystems in one app](/copeland-ts/book/package-targets/) follows an npm call into a Node sidecar and feeds its result to a NuGet library.</Paragraph></Item>
        </List>
        <Heading level="2">Find a specific answer</Heading>
        <Paragraph>Use the [installation guide](/copeland-ts/installation/) to set up the local preview. Consult the [language overview](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/language/overview.md) when you need semantics or feature boundaries. [Writing docs](/copeland-ts/writing-docs/) explains how this site is built.</Paragraph>
        <Paragraph>The examples are checked with the [compiler and TSPack pins in the Pages build](https://github.com/yuechen-li-dev/yuechen-li-dev.github.io/blob/main/.github/workflows/pages.yml).</Paragraph>
    </Document>;
}
