export function NpmPackages(): Document {
    return <Document>
        <Paragraph>The task queue needs to turn a title into a camel-case label. The `change-case` package already does that. Install it through the workspace and declare the one export the queue calls. Copeland emits a regular JavaScript import and Node runs the package.</Paragraph>
        <Heading level="2">Set up the compiler and package manager</Heading>
        <Paragraph>Start in an empty directory with Node, .NET 10, and [TSPack v0.1.14-m80i.2](https://github.com/yuechen-li-dev/tspack/releases/tag/v0.1.14-m80i.2). Build the compiler revision used by this book into the project’s `tools` directory. Use this build even if you have the published Preview 1 CLI on your PATH. The published CLI rejects this TSPack build request with `COPE-TSCL-0005`.</Paragraph>
        <CodeBlock language="console">
git clone https://github.com/yuechen-li-dev/Copeland.git ../Copeland
git -C ../Copeland checkout --detach 101b5b3826f7fbf3f2f564036756bd8991d51b3b
dotnet build ../Copeland/src/Copeland/Copeland.Cli/Copeland.Cli.csproj -c Release -o tools
        </CodeBlock>
        <Heading level="2">Declare the dependency and its signature</Heading>
        <Paragraph>Save the following as `manifest.tsx`. Use `./tools/Copeland.Cli.exe` as the compiler path on Windows. If you already built this compiler revision, point the manifest at your existing executable.</Paragraph>
        <CodeBlock language="tsx">
import { define, dep, npm } from "tspack/manifest";

const changeCase = dep(npm("change-case", "5.4.4"));

export default define(
    <Workspace name="queue-npm" runtime="nodejs">
        <Package name="queue-npm" version="1.0.0" kind="app"
            compiler="tscl" compilerPath="./tools/Copeland.Cli"
            dependencies={{ values: [changeCase] }}>
            <Policies types={{ missingTypes: "ignore" }} />
            <Targets rows={[{
                name: "node",
                export: ".",
                entry: "src/Main.ts",
                runtime: "dist/main.js",
                deps: [changeCase],
                npmContracts: [{
                    package: "change-case",
                    exports: [{ name: "camelCase", parameters: ["string"], result: "string" }],
                }],
            }]} />
        </Package>
    </Workspace>,
);
        </CodeBlock>
        <Paragraph>The dependency tells TSPack which package and version to resolve. Copeland reads the target’s contract for the named export and the types of its arguments and return value. This recipe needs no TypeScript declaration file. The actual library has optional settings, and the queue declares the single-string call it needs. The contract is an assertion about that export, so run the application against the locked package and rerun its tests when you update the lockfile. [change-case package](https://www.npmjs.com/package/change-case/v/5.4.4).</Paragraph>
        <Paragraph>Save this tiny project identity as `Queue.csproj`, as in [Your first program](/copeland-ts/book/first-program/). The workspace uses it to identify the files Copeland owns. The Node build still emits JavaScript.</Paragraph>
        <CodeBlock language="xml">
<Project Sdk="Microsoft.NET.Sdk" />
        </CodeBlock>
        <Paragraph>Save the target and source selection as `tsconfig.tsx`.</Paragraph>
        <CodeBlock language="tsx">
import { defineTypeScriptWorkspace } from "copeland/workspace";

export default defineTypeScriptWorkspace({
    ownership: "partial",
    tscl: {
        project: "./Queue.csproj",
        include: ["src/**"],
        targets: {
            node: { backend: "javascript", runtime: "node" },
        },
    },
});
        </CodeBlock>
        <Paragraph>Save the queue’s entry point as `src/Main.ts`.</Paragraph>
        <CodeBlock language="copeland-npm">
import { camelCase } from "change-case";

export function Main(): string {
    return camelCase("Ship the docs");
}
        </CodeBlock>
        <Heading level="2">Resolve, build, and run</Heading>
        <CodeBlock language="console">
tspack update
tspack sync
tspack build node
node dist/main.js
        </CodeBlock>
        <CodeBlock language="output">
shipTheDocs
        </CodeBlock>
        <Paragraph>Use `update` to resolve changed dependencies and write the lockfile. Check the lockfile in. Use `sync` to reproduce that resolution from another checkout. For this recipe, build through TSPack so it supplies the resolved function contract to the compiler. A standalone project build has a different input path.</Paragraph>
        <Heading level="2">Follow the call into Node</Heading>
        <Paragraph>Open `dist/src/Main.js`. The call and its named ESM import survive compilation. Node resolves that import to the installed package, which needs to be available when you run or deploy the output. Copeland checks this call against the declared signature. TSPack handles the locked dependency and Node provides the package’s actual implementation.</Paragraph>
        <CodeBlock language="javascript">
import { camelCase } from "change-case";

function Main() {
    return camelCase("Ship the docs");
}

export { Main };
        </CodeBlock>
        <Paragraph>Try passing `42` to camelCase. Copeland reports a type error before Node runs. Try removing the export from the contract while leaving the package installed. The compiler can no longer bind that import. A successful build still relies on the package honoring the signature at runtime. A thrown JavaScript exception stays a host exception unless you handle it at the boundary.</Paragraph>
        <Paragraph>A browser target also needs a browser-compatible package entry. Node built-ins and native addons do not get browser implementations through a manifest declaration. TSPack has a separate browser materialization path that prepares package entries and an import map for that target. [TSPack browser integration](https://github.com/yuechen-li-dev/tspack/blob/c830bd678f3e74700f89851af4f394d5a4054012/docs/reviews/tspack-tscl-browser-m1.md).</Paragraph>
        <Paragraph>Next, call a library from the other ecosystem in [Use NuGet packages](/copeland-ts/book/nuget-packages/). Then see how [npm calls work from .NET](/copeland-ts/book/package-targets/).</Paragraph>
    </Document>;
}
