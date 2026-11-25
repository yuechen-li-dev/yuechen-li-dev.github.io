export function OctCli(): Document {
    return <Document>
        <Paragraph>Use this reference to find the Oct command for testing, build plans, artifact generation, and formatting. Run these examples from the Oct checkout.</Paragraph>
        <Heading level="2">Usage</Heading>
        <CodeBlock language="console">
oct <command> [options]
oct --help
oct <command> --help
        </CodeBlock>
        <Heading level="2">Common commands</Heading>
        <CodeBlock language="console">
go run ./cmd/oct test <path>
go run ./cmd/oct test <path> --suite <suite>
go run ./cmd/oct test <path> --execution compiled
go run ./cmd/oct test <path> --all-packages
go run ./cmd/oct fmt <path> --mode en-llm --check
go run ./cmd/oct bench <path> --profile
        </CodeBlock>
        <Callout>Oct type-checks imported packages. Test selection defaults to the chosen entry package, so use **--all-packages** when you want tests from dependencies too.</Callout>
        <Heading level="2">oct atlas</Heading>
        <Paragraph>Atlas compiles and queries an opt-in semantic documentation graph. Use verify to check references and policies, and explain to see why an item is present.</Paragraph>
        <CodeBlock language="console">
go run ./cmd/oct atlas verify <path>
go run ./cmd/oct atlas explain <ID> <path>
        </CodeBlock>
        <Paragraph>Read the [Atlas contract](https://github.com/yuechen-li-dev/oct/blob/da8b97236b6eeb8bbd72c84b254e988a31eb19a6/Language/reference/tooling/atlas.md) for graph declarations, coverage, and query commands.</Paragraph>
        <Heading level="2">oct make and Make.octest</Heading>
        <Paragraph>Make evaluates the plan in Make.oct and executes the selected target. Run Make.octest separately to check the plan, defaults, and dependencies.</Paragraph>
        <CodeBlock language="console">
oct make Build
oct test Make.octest
        </CodeBlock>
        <Heading level="3">oct make reporting</Heading>
        <Paragraph>Use the plan snapshot to inspect target metadata and use explain and doctor for read-only decisions and project health. Failed executions write a diagnostic under the configured make state directory.</Paragraph>
        <CodeBlock language="console">
oct make --plan-out plan.octagon
oct make explain Build --file Make.oct
oct make doctor --file Make.oct
        </CodeBlock>
        <Heading level="2">oct artifact build phase</Heading>
        <Paragraph>Artifact evaluates a typed build-time program and writes its declared outputs below the output root. Byte-identical files retain their modification times.</Paragraph>
        <CodeBlock language="console">
go run ./cmd/oct artifact <path> --output-root out/generated
        </CodeBlock>
        <Heading level="2">oct new package scaffolding</Heading>
        <Paragraph>Create a package in a new directory with a strict PascalCase name. The scaffold kind selects the starting files for a library, experiment, application, or wrapper library.</Paragraph>
        <CodeBlock language="console">
oct new library SignalTools
oct new experiment BrownNoiseKalman
oct new wrapper-library OpenCV
oct new application MyApp
        </CodeBlock>
        <Heading level="2">oct init existing package manifests</Heading>
        <Paragraph>Initialize the current directory using its PascalCase name. Oct creates a manifest and preserves any existing manifest.</Paragraph>
        <CodeBlock language="console">
oct init <experiment|library|wrapper-library|application|app>
        </CodeBlock>
        <Heading level="2">oct json infer</Heading>
        <Paragraph>Generate Oct declarations and a loading example for a JSON document. Use the explain flag to inspect inference choices.</Paragraph>
        <CodeBlock language="console">
oct json infer tickets.json
oct json infer tickets.json --name Ticket --explain
        </CodeBlock>
        <Heading level="2">oct templates discovery</Heading>
        <Paragraph>List or inspect template declarations and their accompanying documentation. JSON output supports tool integration.</Paragraph>
        <CodeBlock language="console">
oct templates list Libraries/DatabaseTemplates --json
oct templates describe MaterializedFilter Libraries/DatabaseTemplates
        </CodeBlock>
        <Heading level="2">oct pkg wrapper tooling</Heading>
        <Paragraph>Inspect wrapper metadata or write it to a data-only registry. Building current-package native sidecars requires a separate command and explicit permission.</Paragraph>
        <CodeBlock language="console">
oct pkg wrappers --registry-out wrappers.octagon
oct pkg build-wrappers --allow-native
        </CodeBlock>
        <Heading level="3">Optional package lockfiles</Heading>
        <Paragraph>Lock the exact resolved graph in lock.octagon, then sync against that graph. Git entries carry a resolved commit. Local paths remain mutable.</Paragraph>
        <CodeBlock language="console">
oct pkg lock
oct pkg sync --locked
        </CodeBlock>
        <Heading level="2">Version surface</Heading>
        <Paragraph>Development builds print oct dev. Release builds can supply a version through the Go linker flags.</Paragraph>
        <CodeBlock language="console">
oct version
oct --version
        </CodeBlock>
        <Heading level="2">Package manager / canonical registry quick reference</Heading>
        <Paragraph>The canonical registry is source-controlled. Configure a local checkout and use exact dependency versions.</Paragraph>
        <CodeBlock language="console">
oct pkg registry add oct <path-to-oct-repo>/Registry
oct pkg registry list
oct pkg add Mathematics@0.1.0
oct pkg sync
        </CodeBlock>
        <Paragraph>The upstream CLI reference below includes the full flags, detailed reporting contracts, and additional examples.</Paragraph>
    </Document>;
}
