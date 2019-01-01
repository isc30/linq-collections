import { Iterable } from "../../src/Iterators";
import { runIteratorTests } from "./Iterator.spec";

type Instancer = <T>(elements: T[]) => Iterable<T>;
type IteratorSelector = <T>(iterable: Iterable<T>) => Iterator<T>;

export function runIterableTests(instancer: Instancer): void
{
    testIterator(instancer);

    runTest(instancer, independence);
}

function testIterator(instancer: Instancer): void
{
    describe("iterator()", () =>
    {
        const iteratorInstancer = <T>(e: T[]) => instancer(e).iterator();
        runIteratorTests(iteratorInstancer);
    });

    describe("[Symbol.iterator]()", () =>
    {
        const iteratorInstancer = <T>(e: T[]) => instancer(e)[Symbol.iterator]();
        runIteratorTests(iteratorInstancer);
    });
}

function runTest(
    instancer: Instancer,
    test: (instancer: Instancer, iteratorSelector: IteratorSelector) => void,
): void
{
    describe("iterator()", () =>
    {
        test(instancer, <T>(iterable: Iterable<T>) => iterable.iterator());
    });

    describe("[Symbol.iterator]()", () =>
    {
        test(instancer, <T>(iterable: Iterable<T>) => iterable[Symbol.iterator]());
    });
}

function independence(
    instancer: Instancer,
    iteratorSelector: IteratorSelector,
): void
{
    it("New iterator is unique", () =>
    {
        const instance = instancer([2, 4, 6]);

        const it0 = iteratorSelector(instance);
        const it1 = iteratorSelector(instance);

        expect(it0).not.toBe(it1);
    });

    it("New iterator is resetted by default", () =>
    {
        const data = [2, 4, 6];
        const instance = instancer(data);

        const it0 = iteratorSelector(instance);
        expect(it0.next().value).toBe(2);

        const it1 = iteratorSelector(instance);
        expect(it1.next().value).toBe(2);
    });

    it("Cloned iterator doesn't affect original one", () =>
    {
        const instance = instancer([2, 4, 6]);

        const it0 = iteratorSelector(instance);
        expect(it0.next().value).toBe(2);

        const it1 = iteratorSelector(instance);
        it1.next(); // 2
        it1.next(); // 4

        expect(it0.next().value).toBe(4);
        expect(it1.next().value).toBe(6);
        expect(it0.next().value).toBe(6);

        expect(it0.next().done).toBe(true);
        expect(it1.next().done).toBe(true);
    });

    /*it("Cloned iterator is identical to original", () =>
    {
        const original = instancer([2, 4, 6]);
        const cloned = original.copy();

        Test.isTrue(original.next()); Test.isEqual(original.value(), 2);
        Test.isTrue(cloned.next()); Test.isEqual(cloned.value(), 2);

        Test.isTrue(original.next()); Test.isEqual(original.value(), 4);
        Test.isTrue(cloned.next()); Test.isEqual(cloned.value(), 4);

        Test.isTrue(original.next()); Test.isEqual(original.value(), 6);
        Test.isTrue(cloned.next()); Test.isEqual(cloned.value(), 6);

        Test.isFalse(original.next());
        Test.isFalse(cloned.next());
    });*/
}
