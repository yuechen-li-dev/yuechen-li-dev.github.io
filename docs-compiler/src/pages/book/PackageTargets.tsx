export function PackageTargets(): Document {
    return <Document>
        <Paragraph>In the previous chapters, Node loaded an npm dependency and .NET loaded a NuGet assembly. Both are direct calls on the runtime that owns the package. This chapter shows how the same typed call can reach a package in another runtime when the project declares a supported boundary.</Paragraph>
        <Heading level="2">Choose a target for the dependencies you need</Heading>
        <List>
            <Item><Paragraph>**npm on Node** uses a declared package-export contract and an ordinary ESM import in the emitted JavaScript.</Paragraph></Item>
            <Item><Paragraph>**NuGet on .NET** uses PackageReference and CLR metadata. Generated C# calls the selected package method in-process.</Paragraph></Item>
            <Item><Paragraph>**npm from .NET** uses a generated Node guest. The contract describes the input, result, and supported application errors. The Copeland caller awaits a reply because the package runs in another process.</Paragraph></Item>
            <Item><Paragraph>**NuGet from Node** can use a generated .NET worker. Select a supported package method and declare any data shapes that its CLR signature leaves open.</Paragraph></Item>
        </List>
        <Paragraph>Portable code such as the [queue rule](/copeland-ts/book/modules-and-testing/) can build for both targets. Package calls still need compatible contracts and the runtime assets required by the target. Run the same input and output checks on both builds when they promise the same behavior.</Paragraph>
        <Heading level="2">Run an npm package from .NET</Heading>
        <Paragraph>Use the pinned [CopelandHello sample](https://github.com/yuechen-li-dev/Copeland/tree/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/samples/copeland-ts/CopelandHello/CopelandHello). Copy the project directory with its source, contract, and package lock. From that copy, use Node, the .NET 10 SDK, and the local NuGet feed from [Installation](/copeland-ts/installation/).</Paragraph>
        <Paragraph>Save this as `NuGet.Config` beside the project. Replace the preview source path with the absolute path to your extracted `nuget` directory. The source mapping selects the qualified Copeland preview and gets the other packages from NuGet.org. A project-local restore cache keeps previously installed builds of the same preview version out of this example.</Paragraph>
        <CodeBlock language="xml">
<configuration>
  <packageSources>
    <clear />
    <add key="preview" value="/path/to/copeland-preview/nuget" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
  </packageSources>
  <packageSourceMapping>
    <packageSource key="preview"><package pattern="Copeland.TS.*" /></packageSource>
    <packageSource key="nuget.org"><package pattern="*" /></packageSource>
  </packageSourceMapping>
  <fallbackPackageFolders><clear /></fallbackPackageFolders>
</configuration>
        </CodeBlock>
        <CodeBlock language="console">
npm ci
dotnet restore --configfile NuGet.Config --packages obj/preview-packages
dotnet run --no-restore
        </CodeBlock>
        <CodeBlock language="text">
C# says hello to Copeland through System.String
lodash-es says: helloFromNpm
"helloFromNpm"
        </CodeBlock>
        <Paragraph>The project’s `CopelandNpmContract` names the locked lodash-es export and the data it accepts. The SDK emits the Node guest and copies its dependency closure into the build output. At runtime, the .NET host starts Node and sends the arguments in a framed TSON message. The guest calls lodash-es and returns the string. The same app passes that string to Newtonsoft.Json in-process, which produces the quoted final line.</Paragraph>
        <Paragraph>A framed request and reply cost time and serialization. Keep high-frequency work within one runtime when practical. Ship the complete publish directory and have Node available on PATH for this .NET app.</Paragraph>
        <Heading level="2">Call NuGet from Node and .NET</Heading>
        <Paragraph>Open the pinned [Newtonsoft.Json round-trip sample](https://github.com/yuechen-li-dev/Copeland/tree/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/samples/copeland-ts/nuget-roundtrip-m5). Its `nuget-worker.json` selects exact overloads and declares the nested shipment record once. The compiler reads the restored signatures and generates the Copeland bindings, CLR data contracts, and TSON codecs.</Paragraph>
        <CodeBlock language="console">
tscl nuget generate .
tscl build --standalone . --target node --result obj/node.json
tscl build --standalone . --target clr --result obj/clr.json
node dist/node/main.js
dotnet dist/clr/main.dll
        </CodeBlock>
        <Paragraph>Both commands print the serialized shipment after checking that it decodes back to the expected values. The Node build calls the .NET worker with a typed request. The managed build calls the selected CLR methods directly. The checked data includes nested records, arrays, nullable fields, and present values such as zero and false.</Paragraph>
        <Paragraph>The worker handles declared data shapes. A live CLR object, arbitrary generic method, or JavaScript callback needs its own supported boundary. Node deployment needs the whole worker directory and the .NET 10 runtime. Browser use has separately qualified WebAssembly and service paths with their own deployment requirements. See the [package interop milestones](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/architecture/copeland-package-interop-milestones.md) for the tested API surface.</Paragraph>
    </Document>;
}
