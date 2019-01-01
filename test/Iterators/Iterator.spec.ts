import { IterableIterator, Iterator } from "../../src/Iterators";

type Instancer = <T>(elements: T[]) => Iterator<T>;

export function runIteratorTests(instancer: Instancer): void
{
    runTest("Next", instancer, next);
    runTest("Value", instancer, value);
    runTest("ES6 Integration", instancer, es6);
}

function runTest(
    name: string,
    instancer: Instancer,
    test: (instancer: Instancer) => void,
): void
{
    describe(name, () => test(instancer));
}

function next(instancer: Instancer): void
{
    it("Done for empty collection", () =>
    {
        const it = instancer<number>([]);

        const current = it.next();
        expect(current.done).toBe(true);
    });

    it("Iterate over elements + done in the end", () =>
    {
        const it = instancer([1, 2, 3]);

        let current = it.next(); // 1
        expect(current.done).toBe(false);

        current = it.next(); // 2
        expect(current.done).toBe(false);

        current = it.next(); // 3
        expect(current.done).toBe(false);

        current = it.next(); // end
        expect(current.done).toBe(true);
    });

    it("Next after done does nothing", () =>
    {
        const it = instancer([1, 2]);

        let current = it.next(); // 1
        expect(current.done).toBe(false);

        current = it.next(); // 2
        expect(current.done).toBe(false);

        for (let i = 0; i < 25; ++i)
        {
            current = it.next(); // end
            expect(current.done).toBe(true);
        }
    });
}

function value(instancer: Instancer): void
{
    it("Get values", () =>
    {
        const it = instancer([2, 4, 6]);

        let current = it.next();
        expect(current.done).toBe(false);
        expect(current.value).toBe(2);

        current = it.next();
        expect(current.done).toBe(false);
        expect(current.value).toBe(4);

        current = it.next();
        expect(current.done).toBe(false);
        expect(current.value).toBe(6);

        current = it.next();
        expect(current.done).toBe(true);
    });
}

function es6(instancer: Instancer): void
{
    it("Implements [Symbol.iterator]", () =>
    {
        const it = instancer([1, 2, 3]) as IterableIterator<number>;

        expect(it.iterator()).toBe(it);
        expect(it[Symbol.iterator]()).toBe(it);
    });
}
