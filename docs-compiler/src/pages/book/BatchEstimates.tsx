export function BatchEstimates(): Document {
    return <Document>
        <Paragraph>The estimates have arrived. The queue can now ask the same question for every task. Does this estimate fit in the minutes left today? The answer for one estimate depends only on that estimate and the shared time limit. That independence is what lets the runtime choose how to divide the work.</Paragraph>
        <Heading level="2">Map one input to one output</Heading>
        <Paragraph>If you know JavaScript’s `Array.map`, the shape is familiar. `batch` evaluates the input array once. The name after `as` binds one element inside the body, and the body returns one result for that element. The result is an array of the same length. Each result occupies the same index as its input, even when the target processes multiple items at once.</Paragraph>
        <Paragraph>In [Values and functions](/copeland-ts/book/values-and-functions/), a task fits when the estimate is positive and at most the time available. This time we apply that rule to a whole array. Each item returns a `Score` record containing its estimate and the boolean. The body can read the same `available` value for every item.</Paragraph>
        <CodeBlock language="copeland">
record Score {
    estimate: int;
    fits: boolean;
}

function ScoreEstimates(estimates: int[], available: int): Score[] {
    return batch estimates as estimate {
        const score: Score = {
            estimate: estimate,
            fits: estimate > 0 && estimate <= available,
        };
        return score;
    };
}

function DescribeScore(score: Score): string {
    return if score.fits {
        `${score.estimate} fits`
    } else {
        `${score.estimate} defers`
    };
}

function DescribeScores(scores: Score[]): string {
    const descriptions = MutableList<string>();
    for (const score of scores) {
        descriptions.append(DescribeScore(score));
    }

    return String.Join(descriptions.freeze(), ", ");
}

function CountFits(scores: Score[]): int {
    let total: int = 0;
    for (const score of scores) {
        if (score.fits) {
            total = total + 1;
        }
    }

    return total;
}

export function Main(): string {
    const estimates: int[] = [5, 0, 2, 6];
    const scores: Score[] = ScoreEstimates(estimates, 5);
    const large: Score[] = ScoreEstimates([5, 2 ... 126, 6], 5);
    const empty: Score[] = ScoreEstimates([], 5);
    const first: Score = large[0];
    const last: Score = large[large.length - 1];
    const fits: int = CountFits(large);

    return String.Join([
        DescribeScores(scores),
        `Large batch: ${fits} of ${large.length} fit`,
        "First and last: " + DescribeScore(first) + ", " + DescribeScore(last),
        `Empty batch: ${empty.length} scores`,
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
5 fits, 0 defers, 2 fits, 6 defers
Large batch: 127 of 128 fit
First and last: 5 fits, 6 defers
Empty batch: 0 scores
        </CodeBlock>
        <Paragraph>The first line shows the result order and keeps the two deferred tasks in the output. `batch` maps each estimate to a score. If you also want to count or filter those scores, do that with the completed array, as `CountFits` does here. The repeated initializer `2 ... 126` creates 126 two-minute estimates between the first and last entries of the large input.</Paragraph>
        <Heading level="2">Let each item do its own work</Heading>
        <Paragraph>Give each item everything it needs through its value and read-only inputs. The body builds a fresh record from `estimate` and `available`. Formatting text, appending to a list, and updating the count happen afterward. A shared accumulator inside the batch would make the answer depend on when workers read and write it. Copeland checks that the body is pure and that any captured values are safe to read. [Batch language reference](https://github.com/yuechen-li-dev/Copeland/blob/2490894430af407b9ebefcf648a12008d9c8ba16/docs/Copeland/language/copeland-ts-batch-cts-batch-m1.md).</Paragraph>
        <Heading level="2">Check the same output on Node and .NET</Heading>
        <Paragraph>Run the two builds from [Modules, targets, and testing](/copeland-ts/book/modules-and-testing/). Both targets return the full array before the next statement runs. On the compiler used for this book, JavaScript evaluates items in a sequential loop. The .NET build uses a sequential loop for fewer than 128 elements and `Parallel.For` from 128 onward. The large example reaches that second path, while the short and empty examples check the first. Identical output tests the mapping contract. How much work overlaps and whether that saves time depend on the workload and machine. [Batch backend policy](https://github.com/yuechen-li-dev/Copeland/blob/2490894430af407b9ebefcf648a12008d9c8ba16/docs/Copeland/language/typescript-instinct-m26.md#branches-and-batch).</Paragraph>
        <Paragraph>When you put both ideas together, await the load before scoring. The wait marks where you need the input. The batch describes what to compute for each independent item once you have it. Try changing the available time in the short example to 2 and predict which items will still fit, then check both builds.</Paragraph>
        <Paragraph>Next, bring the UI work together in [Test the UI](/copeland-ts/book/test-your-ui/). To reuse the scheduling rule across more kinds of tasks, see [Name types and express requirements](/copeland-ts/book/types-and-interfaces/).</Paragraph>
    </Document>;
}
