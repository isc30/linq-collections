import { arrayEnumerable } from "@lib/Enumerables";
import { runIterableTests } from "../Iterators/Iterable.spec";
import { runEnumerableTests } from "./Enumerable.spec";

const instancer = <T>(elements: T[]) => arrayEnumerable(
    elements,
);

runIterableTests(instancer);
runEnumerableTests(instancer);

// TODO: remove
it("where + toarray", () =>
{
    const arr = new ArrayEnumerable([-5, 123, 234, 5, 155])
        .where(i => i < 200)
        .where(i => i > 100)
        .select(i => i + 2)
        .toArray();

    expect(arr).toEqual([125, 157]);
});
