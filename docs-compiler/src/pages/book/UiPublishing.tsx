export function UiPublishing(): Document {
    return <Document>
        <Paragraph>Build the article panel, then serve its output from an empty directory. This proves that the browser can run the published files by themselves. The terminal still uses Node for the local server, while Copeland’s emitted ES modules execute in the browser.</Paragraph>
        <Heading level="2">Build the deployable directory</Heading>
        <Paragraph>From `examples/article-panel`, run the same build you used while editing. `build.mjs` compiles the declared target, then copies the page shell, browser adapter, and stylesheet into `dist/`. The compiler replaces its output directory on each successful build.</Paragraph>
        <CodeBlock language="console">
node build.mjs
node --test tests/panel.test.mjs
        </CodeBlock>
        <Paragraph>Start at `dist/index.html`. It loads `browser.mjs` and `style.css` from the same directory. The browser module imports the generated model and view through `src/Panel.node.js` and `src/View.node.js`. Those entry modules also import generated files. Copy the whole `dist/` tree so their relative imports resolve.</Paragraph>
        <Heading level="2">Test a copy from outside the project</Heading>
        <Paragraph>From the example directory, use PowerShell to make a temporary deployment copy. The last command serves that directory on loopback. Open the HTTP URL printed in the terminal.</Paragraph>
        <CodeBlock language="powershell">
$deployment = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid())
New-Item -ItemType Directory -Path $deployment
Copy-Item -Path dist/* -Destination $deployment -Recurse
node serve.mjs $deployment
        </CodeBlock>
        <Paragraph>The copied page should open with **Choose an article**. Run the [browser checks from the previous chapter](/copeland-ts/book/test-your-ui/#exercise-the-browser-behavior). Check the browser console for failed module requests. An HTML error page returned for a module URL often appears as an unexpected MIME type error, so inspect the request’s URL and response in the Network tab.</Paragraph>
        <Heading level="2">Publish below your chosen URL</Heading>
        <Paragraph>Place the contents of `dist/` under the document root or the subdirectory that will hold the tool. The sample uses relative stylesheet, script, and module paths so the same tree can sit under a site prefix. Keep the trailing slash on directory URLs such as `/copeland-ts/book/example/` so relative requests resolve from the intended directory.</Paragraph>
        <Paragraph>The book publishes its own copy at [the live article panel](/copeland-ts/book/example/). On your host, open the final URL directly in a new tab and reload it. Confirm that the stylesheet and modules load from that prefix, then check search, selection, and retry once more.</Paragraph>
        <Paragraph>Keep the Copeland source, browser shell, and build scripts under version control. Rebuild and publish the generated files together when they change. The basic UI path ends here. Continue with [metaprogramming](/copeland-ts/book/types-and-interfaces/) or [package interoperability](/copeland-ts/book/npm-packages/) when your app needs them.</Paragraph>
    </Document>;
}
