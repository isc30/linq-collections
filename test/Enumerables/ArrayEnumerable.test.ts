import { ArrayEnumerable } from "../../src/Enumerables";
import { runIterableTests } from "../Iterators/Iterable.spec";

runIterableTests(<T>(elements: T[]) => new ArrayEnumerable<T>(elements));

// TODO: remove
it("where + toarray", () =>
{
    const arr = new ArrayEnumerable([123, 234, 5]).where(i => i < 200).toArray();

    expect(arr).toEqual([123, 5]);
});
