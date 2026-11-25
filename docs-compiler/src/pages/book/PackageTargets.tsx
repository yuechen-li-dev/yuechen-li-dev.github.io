export function PackageTargets(): Document {
    return <Document>
        <Paragraph>A .NET app can use Newtonsoft.Json and an npm package in the same process tree. NuGet restores the .NET assembly. Node loads the JavaScript package. Copeland checks both calls and emits code that hands each one to the runtime that can execute it. Keeping those responsibilities separate is what makes the two ecosystems fit into one program.</Paragraph>
        <Heading level="2">Choose a target for the dependencies you need</Heading>
        <List>
            <Item><Paragraph>**npm on Node** uses a declared package-export contract and an ordinary ESM import in the emitted JavaScript. A browser build needs a compatible package entry and browser materialization.</Paragraph></Item>
            <Item><Paragraph>**NuGet on .NET** uses PackageReference and CLR metadata. The SDK compiles the generated C# along with the rest of the project. The CLR loads the package assemblies.</Paragraph></Item>
            <Item><Paragraph>**npm from .NET** uses a package-export contract, a Node sidecar, and a host that attaches the two. The package still runs in Node. The call is asynchronous from Copeland’s perspective even if the JavaScript function returns immediately.</Paragraph></Item>
            <Item><Paragraph>**NuGet from emitted JavaScript** has no built-in CLR execution path in this preview. For a Node or browser build, choose a JavaScript implementation of the operation or call a .NET service over an explicit API.</Paragraph></Item>
        </List>
        <Paragraph>You can change the target for the portable queue logic from [Modules, targets, and testing](/copeland-ts/book/modules-and-testing/). A module that calls a host library also needs a working package path on the chosen target. Give the portable code a small function to call, such as one that quotes a title, and keep the target-specific implementation in the entry project. Run the same input and output checks in both projects when they promise the same behavior.</Paragraph>
        <Heading level="2">Run an npm package from a .NET project</Heading>
        <Paragraph>Copy the contents of the pinned [CopelandHello sample project](https://github.com/yuechen-li-dev/Copeland/tree/101b5b3826f7fbf3f2f564036756bd8991d51b3b/samples/copeland-ts/CopelandHello/CopelandHello) to a directory of its own. Keep the contract, lockfile, and script in their existing locations. From the directory containing `CopelandHello.csproj`, use .NET 10 and Node to run the sample.</Paragraph>
        <CodeBlock language="console">
npm ci
dotnet restore
dotnet run --no-restore
        </CodeBlock>
        <CodeBlock language="text">
C# says hello to Copeland through System.String
lodash-es says: helloFromNpm
        </CodeBlock>
        <Paragraph>The project’s `CopelandNpmContract` item names a file that describes the installed version of lodash-es, the camelCase export, its string input and result, and the error record used at the boundary. The project also copies the guest script to its output. `Program.cs` attaches the guest to the generated assembly with `CSharpSidecarHost.AttachNode` and disposes the host when the app exits. [Project file](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/samples/copeland-ts/CopelandHello/CopelandHello/CopelandHello.csproj) · [Host entry point](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/samples/copeland-ts/CopelandHello/CopelandHello/Program.cs).</Paragraph>
        <Paragraph>The Copeland call looks like this. The package function is synchronous in JavaScript. The caller on .NET awaits a cross-process reply.</Paragraph>
        <CodeBlock language="copeland-fragment">
import { camelCase } from "lodash-es";

record NpmError {
    message: string;
}

export async function npmGreeting(value: string): string ! NpmError {
    const pending: Async<string ! NpmError> = camelCase(value);
    return await pending;
}
        </CodeBlock>
        <Heading level="2">Follow the call across the process boundary</Heading>
        <List style="Ordered">
            <Item><Paragraph>Copeland binds the import to a versioned package and export. The generated C# identifies the operation as `npm:lodash-es@4.18.1:camelCase` and serializes the arguments as a generated TSON tuple record. TSON is the typed data format used by this transport.</Paragraph></Item>
            <Item><Paragraph>The .NET host starts Node and sends a framed request over standard input. The guest imports lodash-es, executes the named function, and sends the reply over standard output. The host pairs the reply with its original request using a correlation ID.</Paragraph></Item>
            <Item><Paragraph>The generated code decodes the response into the declared Copeland result. An error reported by the guest can be decoded as the declared error record. Transport termination has its own failure state, so a dead Node process is distinguishable from a valid application error.</Paragraph></Item>
        </List>
        <Paragraph>The sample supplies its own guest adapter. Adding an npm dependency alone does not install that adapter or launch Node for you. Ship the script, the locked npm dependencies in a location Node can resolve, and a compatible Node executable alongside a .NET deployment that uses the bridge. The transport has serialization and process overhead. Use it for meaningful operations and keep tight loops on one side. Start with supported data shapes such as scalars, one-dimensional arrays, and flat records. A JS callback or live CLR object needs a different boundary. [npm binding and transport design](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/architecture/copeland-npm-import-boundary-cts-npm-m1.md) · [Sample Node adapter](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/samples/copeland-ts/CopelandHello/CopelandHello/scripts/npm-sidecar.mjs).</Paragraph>
        <Heading level="2">Use both ecosystems in one app</Heading>
        <Paragraph>In the same sample directory add the NuGet dependency.</Paragraph>
        <CodeBlock language="console">
dotnet add package Newtonsoft.Json --version 13.0.4
        </CodeBlock>
        <Paragraph>Add `src/copeland/QueueJson.ts`. The existing workspace already owns this directory.</Paragraph>
        <CodeBlock language="copeland-fragment">
using Newtonsoft.Json;

export function Quote(value: string): string {
    return JsonConvert.ToString(value);
}
        </CodeBlock>
        <Paragraph>At the end of `Program.cs`, after the sample has checked the npm result, pass the returned string to the new Copeland function.</Paragraph>
        <CodeBlock language="csharp">
Console.WriteLine(CopelandHello.Copeland.CopelandProject.Quote(npmGreeting.Value.Value));
        </CodeBlock>
        <Paragraph>Run `dotnet run --no-restore` again. It adds this line to the output.</Paragraph>
        <CodeBlock language="text">
"helloFromNpm"
        </CodeBlock>
        <Paragraph>Follow that string back through the project. Node produced it with a package locked by npm. The .NET host received a typed reply, and the generated C# passed the resulting string to an assembly selected by NuGet. The Copeland source expresses both calls with ordinary typed functions.</Paragraph>
    </Document>;
}
