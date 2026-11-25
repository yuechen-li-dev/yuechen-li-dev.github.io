export function NugetPackages(): Document {
    return <Document>
        <Paragraph>On .NET, the queue can use Newtonsoft.Json to quote a task title. Keep the familiar NuGet setup and call the library from Copeland TS. The .NET SDK resolves the assembly, Copeland binds a method from its metadata, and the generated C# calls it directly.</Paragraph>
        <Heading level="2">Use a normal SDK project</Heading>
        <Paragraph>Create a new directory with a `Queue.csproj` file. This example uses .NET 10 and the published Copeland TS SDK preview. The SDK adds the Copeland compiler to the MSBuild pipeline. The second package reference is the application dependency. [Newtonsoft.Json package](https://www.nuget.org/packages/Newtonsoft.Json/13.0.4).</Paragraph>
        <CodeBlock language="xml">
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>net10.0</TargetFramework>
    </PropertyGroup>
    <ItemGroup>
        <PackageReference Include="Copeland.TS.Sdk" Version="0.1.0-preview.1" PrivateAssets="all" />
        <PackageReference Include="Newtonsoft.Json" Version="13.0.4" />
        <CopelandCompile Include="QueueJson.ts" />
    </ItemGroup>
</Project>
        </CodeBlock>
        <Paragraph>Save the following as `QueueJson.ts`. `using` opens a CLR namespace. Use the namespace published by the assembly, which may differ from the package ID. Here the package and namespace are both Newtonsoft.Json.</Paragraph>
        <CodeBlock language="copeland-nuget">
using Newtonsoft.Json;

export function Encode(title: string): string {
    return JsonConvert.ToString(title);
}
        </CodeBlock>
        <Paragraph>Save this entry point as `Program.cs`. In this project the SDK generates `Queue.Copeland.QueueJson` for the Copeland module. The C# entry point calls it as it would call another .NET method. The call into the NuGet library lives in the Copeland file.</Paragraph>
        <CodeBlock language="csharp">
using Queue.Copeland;

System.Console.WriteLine(QueueJson.Encode("Ship the docs"));
        </CodeBlock>
        <Heading level="2">Restore and run</Heading>
        <CodeBlock language="console">
dotnet restore
dotnet run --no-restore
        </CodeBlock>
        <CodeBlock language="output">
"Ship the docs"
        </CodeBlock>
        <Heading level="2">Follow the call into the CLR</Heading>
        <Paragraph>NuGet chooses the package version and the assets that match the project’s target framework. MSBuild resolves the reference assemblies and passes their paths to the Copeland compiler. Copeland reads the CLR metadata, checks the arguments, and selects the string overload. MSBuild compiles the resulting C# together with `Program.cs`. That is why Copeland source and C# can use dependencies restored by the same project. [NuGet PackageReference](https://learn.microsoft.com/en-us/nuget/consume-packages/package-references-in-project-files).</Paragraph>
        <Paragraph>Open `obj/Debug/net10.0/Copeland/QueueJson.g.cs` after the build. The body contains the direct call below. No Node process or interop serialization is needed for this call.</Paragraph>
        <CodeBlock language="csharp">
return global::Newtonsoft.Json.JsonConvert.ToString(title);
        </CodeBlock>
        <Paragraph>Start with CLR methods whose inputs and outputs the Copeland compiler can express, such as the string in this example. Constructors, readable properties, and supported instance and static overloads are also available. Check unfamiliar signatures against the [CLR interop guide](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/authoring/copeland-typescript-guide.md#clr-interop). For an API shape the compiler cannot bind, a small C# wrapper can expose the simpler signature your Copeland module needs. A nullable value or a thrown CLR exception does not automatically become a Copeland Option or Result.</Paragraph>
        <Paragraph>A NuGet package written for Copeland can also ship a package contract that exposes named Copeland modules with `import`. Its build-transitive targets hand Copeland the contract on restore. Copeland can bind those module names and their declared CLR realizations. Ordinary CLR libraries such as Newtonsoft.Json use `using` and the assembly’s public metadata. [Copeland NuGet package design](https://github.com/yuechen-li-dev/Copeland/blob/101b5b3826f7fbf3f2f564036756bd8991d51b3b/docs/Copeland/architecture/copeland-nuget-packages.md).</Paragraph>
        <Paragraph>Next, see which dependencies carry across a target change and how [package calls cross a runtime boundary](/copeland-ts/book/package-targets/).</Paragraph>
    </Document>;
}
