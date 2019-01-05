import { arrayEnumerable, Enumerable } from "@lib/Enumerables";

it("fromSource (array)", () =>
{
    const source = [1, 2, 3];
    const enumerable = Enumerable.fromSource(source);

    expect(enumerable.toArray()).toEqual(source);
});

it("fromSource (iterable)", () =>
{
    const data = [1, 2, 3];
    const source = arrayEnumerable(data);
    const enumerable = Enumerable.fromSource(source);

    expect(enumerable.toArray()).toEqual(data);
});
