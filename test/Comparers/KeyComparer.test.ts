import {
    createKeyComparer,
    createKeyEqualityComparer,
    defaultEqualityComparer,
    defaultOrderedComparer,
} from "../../src/Comparers";
import { testEqualityComparer } from "./EqualityComparer.spec";
import { testOrderedComparer } from "./OrderedComparer.spec";

test.each([true, false])(
    "OrderedComparer compares keys, not values",
    (ascending: boolean) =>
    {
        const comparer = defaultOrderedComparer<string>(ascending);
        const keyComparer = createKeyComparer<{ fullName: string }, string>(
            (e) => e.fullName,
            comparer,
        );

        testOrderedComparer(
            ascending,
            keyComparer,
            { fullName: "aaa" },
            { fullName: "bbb" },
        );
    },
);

it("KeyEqualityComparer compares keys, not values", () =>
{
    const comparer = defaultEqualityComparer;
    const keyEqualityComparer = createKeyEqualityComparer<{ fullName: string }, string>(
        (e) => e.fullName,
        comparer);

    testEqualityComparer(
        keyEqualityComparer,
        { fullName: "aaa" },
        { fullName: "bbb" },
    );
});
