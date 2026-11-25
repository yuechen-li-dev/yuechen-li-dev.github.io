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
oct make explain Build --file Make.oct
oct make doctor --file Make.oct
        </CodeBlock>
        <Heading level="2">oct artifact</Heading>
        <Paragraph>Artifact evaluates a typed build-time program and writes its declared outputs below the output root. Byte-identical files retain their modification times.</Paragraph>
        <CodeBlock language="console">
go run ./cmd/oct artifact <path> --output-root out/generated
        </CodeBlock>
        <Paragraph>The pinned upstream CLI guide below covers the full flag set, the Make plan and diagnostics contracts, and artifact reporting.</Paragraph>
    </Document>;
}
