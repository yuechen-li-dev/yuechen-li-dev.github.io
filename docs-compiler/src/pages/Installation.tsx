export function Installation(): Document {
    return <Document>
        <Paragraph>To follow the book, install the **.NET 10 SDK** and **Node.js 22**. Install **VS Code 1.99 or newer** if you want the Copeland extension. The book uses qualified preview artifacts from the Copeland repository.</Paragraph>
        <Heading level="2">Get the preview artifacts</Heading>
        <Paragraph>Download the `copeland-ts-0.1.0-preview.1` artifact from the [qualified GitHub Actions run](https://github.com/yuechen-li-dev/Copeland/actions/runs/45701834678). Sign in to GitHub if needed. Extract the archive into a directory named `copeland-preview`. It contains the `nuget` and `vscode` directories used below.</Paragraph>
        <Paragraph>If the run artifact has expired, check out [the corresponding Copeland source](https://github.com/yuechen-li-dev/Copeland/tree/e1a2773c830a1dbc2e68c7e06a7c32d13b593124). On Windows, run the following from that checkout in PowerShell after confirming that `dotnet --version` selects a 10.x SDK. Use `artifacts/releases/0.1.0-preview.1` as the preview directory in the installation commands.</Paragraph>
        <CodeBlock language="powershell">
./tools/Build-CopelandPreviewRelease.ps1
        </CodeBlock>
        <Heading level="2">Install the compiler and extension</Heading>
        <CodeBlock language="console">
dotnet tool install --global Copeland.TS.Tool --version 0.1.0-preview.1 --source ./copeland-preview/nuget
code --install-extension ./copeland-preview/vscode/copeland-ts-0.1.0-preview.1.vsix --force
tscl --version
        </CodeBlock>
        <Paragraph>The compiler should report `0.1.0-preview.1`. If `tscl` is missing, add the .NET global tools directory to PATH and reopen the terminal. The VS Code extension uses the installed compiler to check Copeland-owned files.</Paragraph>
        <Paragraph>Install the [pinned TSPack release](https://github.com/yuechen-li-dev/tspack/releases/tag/v0.1.14-m80i.2) when you reach the package chapters that use it. The first program and the article-panel example use the standalone compiler.</Paragraph>
        <Heading level="2">Open a project</Heading>
        <Paragraph>Continue to [Set up your editor](/copeland-ts/book/editor-setup/) to check that Copeland and traditional TypeScript are routed correctly. If you are working from the terminal, go straight to [Your first program](/copeland-ts/book/first-program/).</Paragraph>
    </Document>;
}
