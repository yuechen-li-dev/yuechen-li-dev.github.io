export function Classes(): Document {
    return <Document>
        <Paragraph>Suppose your task queue has a 30-minute budget. Reserving time should keep the total within that limit. A Copeland class gives that value a name and puts the rules for creating and updating it in one place.</Paragraph>
        <Heading level="2">Start with a TypeScript class</Heading>
        <Paragraph>In traditional TypeScript, it is natural to store the used minutes in a private field and update it in a method. The method receives the object through `this`. If two variables refer to that object, both see the update.</Paragraph>
        <CodeBlock language="typescript">
class TimeBudget {
    private used = 0;

    constructor(readonly limit: number) {
        if (!Number.isInteger(limit) || limit < 0) {
            throw new RangeError("Invalid limit");
        }
    }

    remaining(): number {
        return this.limit - this.used;
    }

    reserve(minutes: number): void {
        if (!Number.isInteger(minutes) || minutes <= 0 || minutes > this.remaining()) {
            throw new RangeError("Invalid reservation");
        }
        this.used += minutes;
    }
}

const budget = new TimeBudget(30);
const saved = budget;
budget.reserve(20);
console.log(saved.remaining(), budget.remaining());
        </CodeBlock>
        <CodeBlock language="output">
10 10
        </CodeBlock>
        <Paragraph>Even though `saved` was assigned before the reservation, it points to the same budget. That model is useful when every consumer needs to see the latest state of a shared object. In the task queue, it is also useful to hold on to the earlier budget so you can compare two scheduling choices.</Paragraph>
        <Heading level="2">Construct a complete value</Heading>
        <Paragraph>In Copeland, a class is an immutable, named type with a constructor and associated functions. Write `TimeBudget(30)` to call the constructor. It returns a complete budget value, or a typed error when the limit is invalid. The field declarations specify the shape, and the constructor supplies the values.</Paragraph>
        <Paragraph>Save this example as `src/Hello.ts` in the workspace from [Your first program](/copeland-ts/book/first-program/). It uses the Result and `?` pattern from [Absence and failure](/copeland-ts/book/absence-and-failure/).</Paragraph>
        <CodeBlock language="copeland">
enum BudgetError {
    NegativeLimit,
    InvalidReservation,
    OverBudget,
}

class TimeBudget {
    limit: int;
    private used: int;

    constructor(limit: int): TimeBudget ! BudgetError {
        if (limit < 0) { return err(BudgetError.NegativeLimit); }
        return ok({ limit: limit, used: 0 });
    }

    remaining(value: TimeBudget): int {
        return value.limit - value.used;
    }

    reserve(value: TimeBudget, minutes: int): TimeBudget ! BudgetError {
        if (minutes <= 0) { return err(BudgetError.InvalidReservation); }
        if (minutes > TimeBudget.remaining(value)) {
            return err(BudgetError.OverBudget);
        }
        return ok(value with { used: value.used + minutes });
    }
}

function Describe(error: BudgetError): string {
    return match error {
        NegativeLimit => "The limit must be zero or more",
        InvalidReservation => "Reserve at least one minute",
        OverBudget => "Not enough time left",
    };
}

function Compare(): string ! BudgetError {
    const before: TimeBudget = TimeBudget(30)?;
    const after: TimeBudget = TimeBudget.reserve(before, 20)?;
    const original: int = TimeBudget.remaining(before);
    const updated: int = after |> TimeBudget.remaining;
    const later: string = match TimeBudget.reserve(after, 15) {
        ok(_) => "Reservation accepted",
        err(error) => Describe(error),
    };
    return ok(`${original} min before, ${updated} min after` + String.FromCode(10) + later);
}

export function Main(): string {
    return match Compare() {
        ok(message) => message,
        err(error) => Describe(error),
    };
}
        </CodeBlock>
        <CodeBlock language="output">
30 min before, 10 min after
Not enough time left
        </CodeBlock>
        <Heading level="2">Pass the value explicitly</Heading>
        <Paragraph>`TimeBudget.reserve(before, 20)` passes the budget as an ordinary argument. The function checks the requested time, then uses `with` to produce the next budget. The earlier value still has all 30 minutes. A caller can keep it for comparison or pass the new value on to a reducer. The pipe in `after |> TimeBudget.remaining` is another spelling of `TimeBudget.remaining(after)`.</Paragraph>
        <Paragraph>These functions belong to the class and name every argument they receive. Read a call such as `TimeBudget.remaining(after)` as applying the budget’s operation to a particular value. Use `after.limit` when you just need a public field. Copeland checks that the argument has the declared class type even if another value happens to have the same fields.</Paragraph>
        <Heading level="2">Choose who can change the value</Heading>
        <Paragraph>An ordinary record lets its callers construct a value and use `with` directly. Choose a class when those operations need to preserve a rule. In this example only the class can read `used`, construct a budget literal, or apply `with` to a budget. Callers go through the constructor and `TimeBudget.reserve`, so both entry points can check their inputs.</Paragraph>
        <Paragraph>Try changing the initial limit from 30 to −1. The constructor should report “The limit must be zero or more.” Restore it, then try using `with` on `before` to set its `limit` to 5 from outside the class. The compiler rejects the update. To support lowering a limit, add an associated function that also checks how much time the budget has already reserved.</Paragraph>
        <Paragraph>Next, organize these declarations across [modules, targets, and testing](/copeland-ts/book/modules-and-testing/). For the full class rules, see the [pure classes reference](https://github.com/yuechen-li-dev/Copeland/blob/e1a2773c830a1dbc2e68c7e06a7c32d13b593124/docs/Copeland/architecture/copeland-ts-pure-classes-cts-class-m1.md).</Paragraph>
    </Document>;
}
