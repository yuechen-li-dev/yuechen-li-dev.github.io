export function FirstView(): Document {
    return <Document>
        <Paragraph>Open the [article panel example](/copeland-ts/book/example/) and look at its first appearance. The article details say “Choose an article.” That prompt is a good first view because it needs only text and a little structure. In this chapter you’ll build and change the Copeland TSX that produces it.</Paragraph>
        <Heading level="2">Build and open the example</Heading>
        <Paragraph>Use the tools from [Set up your editor](/copeland-ts/book/editor-setup/). Open `examples/article-panel` in the [book’s source checkout](https://github.com/yuechen-li-dev/yuechen-li-dev.github.io) and run the following commands from that directory. Leave the server running while you make changes.</Paragraph>
        <CodeBlock language="console">
node build.mjs
node serve.mjs
        </CodeBlock>
        <Paragraph>Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/) in a browser. You should see the article list and a section headed “Article details.” Leave the article unselected for now. The example includes the interactions used in later chapters, and you can start with its initial render.</Paragraph>
        <Heading level="2">Read a TSX view as a function</Heading>
        <Paragraph>Open `src/View.tsx`. Its `View(status: string, title: string): Document` signature explains what the function needs and what it produces. The view describes a heading and text. The caller supplies the current strings. That lets you inspect the layout of the content without first reading the code that loads an article.</Paragraph>
        <Paragraph>The workspace enables `TextDocuments` in `tsconfig.tsx`. With that project type, a `Document` expression constructs a Copeland value with typed nodes and text runs. A string expression in braces fills a text slot. The view uses ordinary Copeland control flow to select the loaded title or the current status.</Paragraph>
        <CodeBlock language="tsx">
function Details(title: string): Document {
    return <Document>
        <Heading level="2">Article details</Heading>
        <Paragraph>{title}</Paragraph>
    </Document>;
}

export function View(status: string, title: string): Document {
    if (title != "") { return Details(title); }
    return <Document>
        <Heading level="2">Article details</Heading>
        <Paragraph>{status}</Paragraph>
    </Document>;
}
        </CodeBlock>
        <Paragraph>`status` and `title` are guaranteed to be text because the inputs say `string`. If you need to choose user-facing text or compute a label from several fields, do the computation in a Copeland function and pass the resulting string into the view. You can then test that decision separately from the rendering.</Paragraph>
        <Heading level="2">Follow the document into the browser</Heading>
        <Paragraph>The build script invokes the Copeland compiler on the `node` target with `--node-interop`. The target names `src/Main.ts` as the standalone entry. The browser host imports `View` from the generated adapter module at `dist/src/View.node.js`. This example’s generated modules use portable JavaScript, so the browser can import them directly. Browser compatibility depends on the modules and APIs the application uses.</Paragraph>
        <Paragraph>`web/index.html` provides the page shell. The host in `web/browser.mjs` gets the strings for the current panel from the Copeland model and calls the emitted view. It uses `web/document.mjs` to turn the returned document events into DOM nodes. The adapter supports the small set used here and inserts dynamic strings as text. A title containing angle brackets still displays as text.</Paragraph>
        <Paragraph>The build helper copies the files from `web/` into `dist/` alongside the compiler output. The server serves `dist/`, where the browser can load the page and resolve imports relative to it.</Paragraph>
        <Heading level="2">Change a heading and trace the result</Heading>
        <Paragraph>In `src/View.tsx`, replace both occurrences of “Article details” with “Read an article.” In a second terminal, run `node build.mjs` again and refresh the local page. The section heading should change while the initial prompt stays the same. Select an article and check that the same heading now appears above its title. You changed the Copeland view, rebuilt its exported module, and reused the same browser host.</Paragraph>
        <Paragraph>If the page stays blank, check the build output and the browser console. The first error usually tells you whether a module failed to load or the renderer failed while visiting the document. Open the served HTTP URL so the browser can load the emitted ES modules. If a TSX file shows errors from ordinary TypeScript instead, check the editor’s file owner.</Paragraph>
        <Paragraph>Next, [model the loading screen](/copeland-ts/book/model-ui-state/) so the view can distinguish a selection that is still loading, a loaded article, and a failure with a retry action.</Paragraph>
    </Document>;
}
