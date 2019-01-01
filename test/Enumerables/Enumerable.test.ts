import { ArrayEnumerable, Enumerable } from "../../src/Enumerables";

it("XD", () =>
{
    const source = [1, 2, 3];
    const enumerable = Enumerable.fromSource(source);

    expect(enumerable).toBeInstanceOf(ArrayEnumerable);
});
