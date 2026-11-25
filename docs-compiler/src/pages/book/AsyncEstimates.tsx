export function AsyncEstimates(): Document {
    return <Document>
        <Paragraph>The queue needs its estimates before it can decide which tasks fit today. A real loader might wait for a file or a service. Keep the call and the work that depends on it in the same function. `await` marks the point where that function needs the answer.</Paragraph>
        <Heading level="2">Write the result type you expect to get</Heading>
        <Paragraph>In TypeScript, you might write an async function with a Promise return annotation. In Copeland, write the eventual result type after the colon. `LoadEstimates` declares an array of integers on success or an `EstimateError` on failure. A call to it gives you an `Async` of that whole Result. Await it to get the Result value.</Paragraph>
        <Paragraph>Replace `src/Hello.ts` in the [book project](/copeland-ts/book/first-program/) with this example. The fixture supplies the estimates immediately and can also simulate an unavailable feed. That gives us repeatable examples of both outcomes using the same build on Node and .NET.</Paragraph>
        <Callout>Use the [compiler revision pinned by the book](https://github.com/yuechen-li-dev/Copeland/tree/101b5b3826f7fbf3f2f564036756bd8991d51b3b) when [building the local preview](/copeland-ts/installation/) for this chapter. Its Node and .NET launchers wait for an async Main and print the return value.</Callout>
        <CodeBlock language="copeland">
enum EstimateError {
    Unavailable,
}

function ReadFixture(available: boolean): int[] ! EstimateError {
    if (!available) {
        return err(EstimateError.Unavailable);
    }

    return ok([5, 0, 2, 6]);
}

async function LoadEstimates(available: boolean): int[] ! EstimateError {
    return ReadFixture(available);
}

function DescribeEstimates(estimates: int[]): string {
    return `Loaded ${estimates.length} estimates`;
}

async function SummarizeEstimates(available: boolean): string ! EstimateError {
    const pending: Async<int[] ! EstimateError> = LoadEstimates(available);
    const estimates: int[] = await pending?;
    return ok(DescribeEstimates(estimates));
}

function DescribeOutcome(result: string ! EstimateError): string {
    return match result {
        ok(summary) => summary,
        err(error) => match error {
            Unavailable => "Could not load: estimate feed unavailable",
        },
    };
}

function DescribeRuns(successful: string ! EstimateError, failed: string ! EstimateError): string {
    return DescribeOutcome(successful) + String.FromCode(10) + DescribeOutcome(failed);
}

export async function Main(): string {
    const successful: string ! EstimateError = await SummarizeEstimates(true);
    const failed: string ! EstimateError = await SummarizeEstimates(false);
    return DescribeRuns(successful, failed);
}
        </CodeBlock>
        <CodeBlock language="output">
Loaded 4 estimates
Could not load: estimate feed unavailable
        </CodeBlock>
        <Heading level="2">Read await and question mark in order</Heading>
        <Paragraph>Follow `await pending?` from left to right. First, `await` produces the eventual Result. Then postfix `?` takes the array from `ok` or returns the error from `SummarizeEstimates` immediately. On failure, that function skips `DescribeEstimates`. `Main` awaits the summary without `?`, so it keeps the complete Result and lets `DescribeOutcome` decide what to display. The handling rules are the same ones you used in [Absence and failure](/copeland-ts/book/absence-and-failure/).</Paragraph>
        <Paragraph>The `pending` local gives us a name and an explicit type for the computation before we need its answer. If the call and the wait belong together, you can write `await LoadEstimates(available)?` directly. Try making that change and check that both lines stay the same.</Paragraph>
        <Heading level="2">Wait where the answer is needed</Heading>
        <Paragraph>When the computation is still pending, `await` suspends the current async function and resumes it when the result is ready. This fixture completes immediately, so the trace demonstrates the types and the error path. With an I/O-backed loader, the same sequence describes which work depends on the reply. The second call in `Main` starts after the first await finishes. The UI still owns decisions such as whether a reply belongs to the current request. [Async authoring guide](https://github.com/yuechen-li-dev/Copeland/blob/2490894430af407b9ebefcf648a12008d9c8ba16/docs/Copeland/authoring/copeland-typescript-guide.md#async).</Paragraph>
        <Paragraph>Once the estimates arrive, each can be scored independently. Next, [score independent items with batch](/copeland-ts/book/batch-estimates/).</Paragraph>
    </Document>;
}
