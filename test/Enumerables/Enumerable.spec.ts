import { Enumerable } from "@lib/Enumerables";

type Instancer = <T>(elements: T[]) => Enumerable<T>;

export function runEnumerableTests(instancer: Instancer): void
{
    describe("toArray", () => toArray(instancer));
    describe("where", () => where(instancer));
    describe("select", () => select(instancer));
}

function toArray(instancer: Instancer): void
{
    it("Empty collection", () =>
    {
        const instance = instancer<number>([]);

        expect(instance.toArray()).toEqual([]);
    });

    it("Content is correct", () =>
    {
        const data = [1, 2, 3, 4];
        const enumerable = instancer(data);

        expect(enumerable.toArray()).toEqual(data);
    });

    it("Returns a copy, not a reference", () =>
    {
        const data = [1, 2, 3, 4];
        const enumerable = instancer(data);
        const enumerableToArray = enumerable.toArray();

        data.push(5);

        expect(enumerableToArray).toEqual([1, 2, 3, 4]);
    });
}

function where(instancer: Instancer)
{
    it("Empty if empty", () =>
    {
        const base = instancer<number>([]);
        const enumerable = base.where(e => true);

        expect(enumerable.toArray()).toEqual([]);
    });

    it("Value is correct (returns elements)", () =>
    {
        const base = instancer([39, 21, 66, 20]);
        const enumerable = base.where(e => e < 30);

        expect(enumerable.toArray()).toEqual([21, 20]);
    });

    it("Value is correct (no elements)", () =>
    {
        const base = instancer([39, 21, 66, 20]);
        const enumerable = base.where(e => e > 90);

        expect(enumerable.toArray()).toEqual([]);
    });
}

function select(instancer: Instancer): void
{
    it("Empty if empty", () =>
    {
        const base = instancer<number>([])
            .select(e => e + 1);

        expect(base.toArray()).toEqual([]);
    });

    it("Value is correct", () =>
    {
        const base = instancer([1, 2, 3])
            .select(e => e + 1);

        expect(base.toArray()).toEqual([2, 3, 4]);
    });

    it("Value is correct (string)", () =>
    {
        const base = instancer(["pepin", "sanz", "macheta"])
            .select(e => e.length);

        expect(base.toArray()).toEqual([5, 4, 7]);
    });
}
