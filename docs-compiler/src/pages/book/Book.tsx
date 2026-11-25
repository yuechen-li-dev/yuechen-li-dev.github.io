export function Book(): Document {
    return <Document>
        <Paragraph>This book is for developers who already write JavaScript or TypeScript. It assumes you know functions, modules, and how to run a Node program. Start by compiling a small Copeland program, then learn the types and control flow you’ll use in an interactive UI.</Paragraph>
        <Paragraph>The UI chapters follow one [runnable article panel](/copeland-ts/book/example/) from its first render to a tested browser build. You’ll model what the panel knows, connect user events to its state, and handle slow or failed requests. You can run the example from the book checkout and make the same changes as you read.</Paragraph>
        <Paragraph>Follow the [installation guide](/copeland-ts/installation/) to set up the preview, or go straight to [Your first program](/copeland-ts/book/first-program/) if the tools are ready. Metaprogramming and package interoperability are available after the UI path for when you need them.</Paragraph>
    </Document>;
}
