export function Installation(): Document {
    return <Document>
        <Paragraph>Build and install the Copeland TS local-feed preview with the **.NET 10 SDK**. Use a PowerShell terminal in the Copeland checkout for the distribution steps below.</Paragraph>
        <Callout>This guide covers the M0 local feed. Check the [Preview 1 scope](https://github.com/yuechen-li-dev/Copeland/blob/a48991b7f8e7fd9b84a27b7a46b3bd24b2a871ad/docs/Copeland/releases/0.1.0-preview.1-scope.md) for packaging and platform details.</Callout>
        <Heading level="2">Build the local feed</Heading>
        <CodeBlock language="powershell">
.\tools\Invoke-CopelandDistributionProof.ps1
        </CodeBlock>
        <Paragraph>The distribution proof writes packages, a VSIX, and the TSPack archive to the checkout's local feed at `artifacts/cts-distribution-m0/packages`.</Paragraph>
        <Heading level="2">Install the tool and templates</Heading>
        <CodeBlock language="console">
dotnet tool install --global Copeland.TS.Tool --version 0.1.0 --add-source <feed>
dotnet new install Copeland.TS.Templates@0.1.0 --nuget-source <feed>
code --install-extension <feed>/copeland-ts-0.1.0.vsix
        </CodeBlock>
        <Paragraph>Replace the feed placeholder with the path from the distribution proof. For the React template, extract the companion TSPack archive and add its executable to your PATH.</Paragraph>
        <CodeBlock language="powershell">
Expand-Archive <feed>/TSPack.Tool.0.1.7-win-x64.zip <tools>
$env:Path = "<tools>/tspack-windows-amd64;$env:Path"
        </CodeBlock>
        <Heading level="2">Run a project</Heading>
        <CodeBlock language="console">
dotnet new copeland-react -n HelloCopeland
cd HelloCopeland
tscl workspace sync
tspack run web
        </CodeBlock>
        <Paragraph>Run workspace sync after ownership changes in a mixed project. The VS Code extension then routes Copeland-owned files to the compiler.</Paragraph>
        <Heading level="2">Update or uninstall</Heading>
        <CodeBlock language="console">
dotnet tool update --global Copeland.TS.Tool --version 0.1.0 --add-source <feed>
dotnet new update
code --install-extension <feed>/copeland-ts-0.1.0.vsix --force
dotnet tool uninstall --global Copeland.TS.Tool
dotnet new uninstall Copeland.TS.Templates
code --uninstall-extension copeland.copeland-ts
        </CodeBlock>
        <Paragraph>For this site's authoring workflow, see [Writing docs](/copeland-ts/writing-docs/).</Paragraph>
    </Document>;
}
