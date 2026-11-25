export function Values(): Document {
    return <Document>
        <Paragraph>You have five minutes left and a task that takes two. Can you schedule it today? Start with a small rule. A task fits when its estimate is positive and no greater than the time available. An exact fit counts. A time budget of zero leaves every positive-duration task for later.</Paragraph>
        <Heading level="2">Start with the TypeScript you already know</Heading>
        <Paragraph>In traditional TypeScript, both quantities have type `number`. The parameter types and return type describe the shape of the call. The comparisons in `fitsToday` express the scheduling rule. The ternary in `queueLabel` chooses the text from that boolean.</Paragraph>
        <CodeBlock language="typescript">
function fitsToday(available: number, estimate: number): boolean {
    return estimate > 0 && estimate <= available;
}

function queueLabel(available: number, estimate: number): string {
    return fitsToday(available, estimate) ? "schedule today" : "defer";
}

console.log("Under budget: " + queueLabel(5, 2));
console.log("Exact fit: " + queueLabel(5, 5));
console.log("Over budget: " + queueLabel(5, 6));
console.log("No time left: " + queueLabel(0, 2));
console.log("Zero estimate: " + queueLabel(5, 0));
console.log("Whole two-minute slots: " + Math.floor(5 / 2));
console.log("Fractional ratio: " + (5 / 2));
        </CodeBlock>
        <CodeBlock language="output">
Under budget: schedule today
Exact fit: schedule today
Over budget: defer
No time left: defer
Zero estimate: defer
Whole two-minute slots: 2
Fractional ratio: 2.5
        </CodeBlock>
        <Paragraph>The five scheduling cases check the two things the rule cares about. The comparison with `available` separates an exact fit from a task one minute over budget. The comparison with zero rejects a zero-minute estimate even when there is ample time. JavaScript division gives 2.5 for five divided by two, so the positive-input example uses `Math.floor` to count complete slots. [TypeScript handbook on number](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#the-primitives-string-number-and-boolean).</Paragraph>
        <Heading level="2">Choose the type of each quantity</Heading>
        <Paragraph>Copeland can express both whole minutes and fractional quantities. The task rule asks for two whole-minute values and declares them as `int`, a signed 32-bit integer. An unannotated literal such as `5` infers `int`. A decimal literal such as `5.0` uses floating-point arithmetic. The ratio below explicitly uses `number`, Copeland’s double-precision floating-point type.</Paragraph>
        <Paragraph>Replace `src/Hello.ts` from [Your first program](/copeland-ts/book/first-program/) with this program and run the Node build again. Compare all seven lines with the TypeScript version.</Paragraph>
        <CodeBlock language="copeland">
function FitsToday(available: int, estimate: int): boolean {
    return estimate > 0 && estimate <= available;
}

function QueueLabel(available: int, estimate: int): string {
    return if FitsToday(available, estimate) {
        "schedule today"
    } else {
        "defer"
    };
}

export function Main(): string {
    const available = 5;
    const estimate: int = 2;
    const fullSlots: int = available / estimate;
    const fractionalRatio: number = 5.0 / 2.0;

    return String.Join([
        "Under budget: " + QueueLabel(available, estimate),
        "Exact fit: " + QueueLabel(available, available),
        "Over budget: " + QueueLabel(available, 6),
        "No time left: " + QueueLabel(0, estimate),
        "Zero estimate: " + QueueLabel(available, 0),
        `Whole two-minute slots: ${fullSlots}`,
        `Fractional ratio: ${fractionalRatio}`,
    ], String.FromCode(10));
}
        </CodeBlock>
        <CodeBlock language="output">
Under budget: schedule today
Exact fit: schedule today
Over budget: defer
No time left: defer
Zero estimate: defer
Whole two-minute slots: 2
Fractional ratio: 2.5
        </CodeBlock>
        <Paragraph>The operands determine which division takes place. With two `int` operands, division truncates toward zero. That counts complete slots for positive minutes. With two floating-point operands, the same operator keeps the fractional part here. The first calculation deliberately uses a two-minute divisor. Integer division by zero fails, so a slot-count function that accepts estimates from callers would need to check the divisor first. The [numeric policy](https://github.com/yuechen-li-dev/Copeland/blob/2490894430af407b9ebefcf648a12008d9c8ba16/docs/Copeland/language/typescript-instinct-m26.md#numeric-and-mutation-policy) covers range, rounding, and overflow.</Paragraph>
        <Heading level="2">Make the condition say what you mean</Heading>
        <Paragraph>In JavaScript, a condition like `if (estimate)` treats zero as false and any negative finite number as true. That is a truthiness check. Here we have a more specific question. Is the estimate positive, and does it fit in the available time? The comparisons produce booleans, and `&&` requires both comparisons to be true.</Paragraph>
        <Paragraph>Copeland conditions expect a boolean. `FitsToday` names that boolean and keeps the rule in one place. `QueueLabel` uses the result in an `if` expression. Each branch supplies the string to return, so the whole expression supplies one value. The final expression in each branch is the branch’s value, and only the selected branch runs.</Paragraph>
        <Heading level="2">Try the boundaries</Heading>
        <Paragraph>Change the fit comparison to strict less-than and rebuild. The exact-fit line changes to `defer` while the under-budget line still says `schedule today`. Restore the comparison and try passing `2.5` as the estimate. Check `obj/build.json` for the type diagnostic. A quoted `"2"` is a string and also fails the integer parameter check. If you want the scheduler to accept fractional minutes, that choice belongs in the function contract.</Paragraph>
        <Paragraph>Next, collect several tasks using [records and collections](/copeland-ts/book/records-and-collections/). We’ll return to this time-budget rule when we split the queue into modules and test it on two runtimes.</Paragraph>
    </Document>;
}
