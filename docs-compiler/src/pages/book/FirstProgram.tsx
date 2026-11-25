export function FirstProgram(): Document {
    return <Document>
        <Paragraph>Start with a familiar TypeScript-shaped function. Copeland checks that its return value matches its declared type, then emits JavaScript you can run with Node. Install the Copeland CLI from the [local preview feed](/copeland-ts/installation/) and have Node on your PATH.</Paragraph>
        <Heading level="2">Write the source</Heading>
        <Paragraph>In an empty directory, save this as `src/Hello.ts`. The exported Main function is the entry point. Its return annotation tells the compiler that the program produces text.</Paragraph>
        <CodeBlock language="copeland">
export function Main(): string {
    return "Hello, Copeland!";
}
        </CodeBlock>
        <Heading level="2">Declare the project</Heading>
        <Paragraph>Save the project identity as `Book.csproj`. The standalone compiler uses it for workspace ownership.</Paragraph>
        <CodeBlock language="xml">
<Project Sdk="Microsoft.NET.Sdk" />
        </CodeBlock>
        <Paragraph>Save this as `tsconfig.tsx` to tell the Copeland compiler which files it owns and which backend to use.</Paragraph>
        <CodeBlock language="tsx">
import { defineTypeScriptWorkspace } from "copeland/workspace";

export default defineTypeScriptWorkspace({
    ownership: "partial",
    tscl: {
        project: "./Book.csproj",
        include: ["src/**"],
        targets: {
            node: { backend: "javascript", runtime: "node" },
            clr: { backend: "csharp", runtime: "ryujit", targetFramework: "net10.0" },
        },
    },
});
        </CodeBlock>
        <Paragraph>Save this as `manifest.tsx`. Both targets use the same entry file. Each target has its own output path. Start with Node and use the CLR target in the last basics chapter.</Paragraph>
        <CodeBlock language="tsx">
import { define } from "tspack/manifest";

export default define(
    <Workspace name="book" runtime="nodejs">
        <Package name="book" version="1.0.0" kind="app">
            <Targets rows={[
                { name: "node", export: ".", entry: "src/Hello.ts", runtime: "dist/main.js", deps: [], peers: [] },
                { name: "clr", export: "./clr", entry: "src/Hello.ts", runtime: "dist/clr/app.dll", deps: [], peers: [] },
            ]} />
        </Package>
    </Workspace>,
);
        </CodeBlock>
        <Heading level="2">Build and run</Heading>
        <Paragraph>Run these commands from the directory containing the three project files. The launcher calls Main and prints the returned string.</Paragraph>
        <CodeBlock language="console">
tscl build --standalone . --target node --result obj/build.json
node dist/main.js
        </CodeBlock>
        <CodeBlock language="output">
Hello, Copeland!
        </CodeBlock>
        <Paragraph>Change the greeting, build again, and run it. Then change the return value to an integer and build. The compiler will report the mismatch between the value and the declared return type.</Paragraph>
        <Paragraph>Next, explore [values and functions](/copeland-ts/book/values-and-functions/).</Paragraph>
    </Document>;
}
