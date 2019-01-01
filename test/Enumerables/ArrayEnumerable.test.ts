import { ArrayEnumerable } from "@lib/Enumerables";
import { runIterableTests } from "../Iterators/Iterable.spec";

runIterableTests(<T>(elements: T[]) => new ArrayEnumerable<T>(elements));

// TODO: remove
it("where + toarray", () =>
{
    const arr = new ArrayEnumerable([-5, 123, 234, 5, 155])
        .where(i => i < 200)
        .where(i => i > 100)
        .toArray();

    expect(arr).toEqual([123, 155]);
});
