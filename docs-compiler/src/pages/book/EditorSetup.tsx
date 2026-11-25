export function EditorSetup(): Document {
    return <Document>
        <Paragraph>A Copeland file and an ordinary TypeScript file can both end in `.ts`. The workspace decides which checker owns each file. When VS Code opens the folder, the Copeland extension reads that decision and routes each file to its language server. You can check the route by putting one small type error in each of two files.</Paragraph>
        <Heading level="2">Install matching preview tools</Heading>
        <Paragraph>Install the .NET 10 SDK, Node.js, VS Code 1.99 or newer, and the matching Copeland compiler and VSIX. The editor extension uses the separately installed compiler. Follow the [installation guide](/copeland-ts/installation/) to get the preview artifacts.</Paragraph>
        <Paragraph>Run these checks in the terminal you plan to use for the book. Confirm that `dotnet` selects a 10.x SDK and that the compiler and language server report the preview version you installed. You can also find the extension version on the Copeland TS card in VS Code’s Extensions view.</Paragraph>
        <CodeBlock language="console">
dotnet --version
node --version
tscl --version
tscl language-server --version
        </CodeBlock>
        <Heading level="2">Set up a mixed workspace</Heading>
        <Paragraph>Create an empty folder called `editor-check`. The project file gives the workspace a .NET project identity. For this exercise you only need the following contents in `EditorCheck.csproj`.</Paragraph>
        <CodeBlock language="xml">
<Project Sdk="Microsoft.NET.Sdk" />
        </CodeBlock>
        <Paragraph>Save this workspace as `tsconfig.tsx` beside the project file. Files below `src/` belong to Copeland’s checker, called `tscl`. Files below `legacy/` belong to the ordinary TypeScript checker, called `tsc`. The include patterns are disjoint so each file has one owner.</Paragraph>
        <CodeBlock language="tsx">
import { defineTypeScriptWorkspace } from "copeland/workspace";

export default defineTypeScriptWorkspace({
    ownership: "partial",
    tscl: { project: "./EditorCheck.csproj", include: ["src/**"] },
    tsc: { include: ["legacy/**"], compilerOptions: { strict: true } },
});
        </CodeBlock>
        <Paragraph>Save this minimal project manifest as `manifest.tsx`. It gives the language server the project’s package context. This workspace has no dependencies or build targets, since we’re only checking editor behavior.</Paragraph>
        <CodeBlock language="tsx">
import { define } from "tspack/manifest";

export default define(
    <Workspace name="editor-check" runtime="nodejs">
        <Package name="editor-check" version="1.0.0" kind="app" />
    </Workspace>,
);
        </CodeBlock>
        <Paragraph>Put the following Copeland code in `src/Main.ts`. The return value is deliberately wrong.</Paragraph>
        <CodeBlock language="copeland-fragment">
export record Label {
    text: string;
}

export function Greeting(): Label {
    return { text: 42 };
}
        </CodeBlock>
        <Paragraph>Put an ordinary TypeScript type error in `legacy/Check.ts`.</Paragraph>
        <CodeBlock language="ts">
export const greeting: string = 42;
        </CodeBlock>
        <Paragraph>Open the workspace folder in VS Code with `code .`. The extension normally generates its ownership map on open. To run that step yourself, use **Copeland: Workspace Sync** from the Command Palette or run the following commands from the same folder.</Paragraph>
        <CodeBlock language="console">
tscl workspace sync
tscl workspace owner src/Main.ts
tscl workspace owner legacy/Check.ts
        </CodeBlock>
        <Heading level="2">Read the two diagnostics</Heading>
        <Paragraph>Open `src/Main.ts`. The Copeland status item should read **Copeland TS: tscl**. In the Problems view, the field assignment should have a `tscl` diagnostic saying that `Label.text` expects a string. The `record` declaration is valid Copeland TS. Now open `legacy/Check.ts`. The status item should read **TypeScript: tsc** and the assignment is reported by the built-in TypeScript language service.</Paragraph>
        <Paragraph>Replace both occurrences of `42` with the string `"Hello"` and save both files. The two diagnostics should disappear. This is also a way to check a new project when a file shows unexpected parser errors. Check the owner first, then read the error from the checker that owns it.</Paragraph>
        <Heading level="2">Troubleshoot the editor route</Heading>
        <List>
            <Item><Paragraph>If the extension cannot find the compiler, check PATH in the environment that launched VS Code. The extension can also use the workspace’s .NET tool manifest. Set `copeland.tsclPath` to the executable’s full path when you need an explicit override.</Paragraph></Item>
            <Item><Paragraph>If the file has the wrong owner, check the paths in `tsconfig.tsx` and run `tscl workspace sync` again. The command writes the ownership map to `obj/copeland/workspace/editor-ownership.generated.json`. The map records the decision and is regenerated from the workspace file.</Paragraph></Item>
            <Item><Paragraph>If your terminal check or formatter selects files by path, point it at the ordinary TypeScript partition. For example, `tsc -p obj/copeland/workspace/tsconfig.generated.json --noEmit` checks the ordinary TypeScript files after workspace sync.</Paragraph></Item>
        </List>
        <Paragraph>For extension commands and the order in which the editor resolves a compiler, see the [VS Code guide](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/vscode.md). Next, [write your first program](/copeland-ts/book/first-program/) in a fresh workspace and run its compiled JavaScript.</Paragraph>
    </Document>;
}
