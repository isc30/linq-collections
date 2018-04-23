import { Test } from "../Test";
import { ArrayIterator, IIterable } from "../../src/Iterators";
import { Enumerable, ArrayEnumerable, ConditionalEnumerable,
    ConcatEnumerable, UniqueEnumerable, RangeEnumerable,
    TransformEnumerable, ReverseEnumerable, OrderedEnumerable,
    DefaultIfEmptyEnumerable, TakeWhileEnumerable, SkipWhileEnumerable,
    ZippedEnumerable } from "../../src/Enumerables";

export namespace IteratorUnitTest
{
    type Instancer = <T>(elements: T[]) => IIterable<T>;

    function runTest(name: string, test: (instancer: Instancer) => void)
    {
        describe(`${name} (ArrayIterator)`, () => test(
            <T>(e: T[]) => new ArrayIterator(e)));

        describe(`${name} (Enumerable)`, () => test(
            <T>(e: T[]) => new Enumerable(new ArrayIterator(e))));

        describe(`${name} (ConditionalEnumerable)`, () => test(
            <T>(e: T[]) => new ConditionalEnumerable(Enumerable.fromSource(e), x => true)));

        describe(`${name} (ConcatEnumerable)`, () => test(
            <T>(e: T[]) => e.length > 1
                ? new ConcatEnumerable(
                    Enumerable.fromSource([e[0]]),
                    Enumerable.fromSource(e.slice(1)))
                : new ConcatEnumerable(
                    Enumerable.fromSource(e),
                    Enumerable.fromSource([]))));

        describe(`${name} (OrderedEnumerable)`, () => test(
            <T>(e: T[]) => new OrderedEnumerable(Enumerable.fromSource(e), (l, r) => 0)));

        describe(`${name} (RangeEnumerable)`, () => test(
            <T>(e: T[]) => new RangeEnumerable(Enumerable.fromSource(e), undefined, undefined)));

        describe(`${name} (TransformEnumerable)`, () => test(
            <T>(e: T[]) => new TransformEnumerable(Enumerable.fromSource(e), x => x)));

        describe(`${name} (ReverseEnumerable)`, () => test(
            <T>(e: T[]) => new ReverseEnumerable(new ReverseEnumerable(Enumerable.fromSource(e)))));

        describe(`${name} (OrderedEnumerable)`, () => test(
            <T>(e: T[]) => new OrderedEnumerable(Enumerable.fromSource(e), (x, y) => 0)));

        describe(`${name} (ArrayEnumerable)`, () => test(
            <T>(e: T[]) => new ArrayEnumerable(e)));

        describe(`${name} (DefaultIfEmptyEnumerable)`, () => test(
            <T>(e: T[]) => new DefaultIfEmptyEnumerable(Enumerable.fromSource(e))
                .where(p => p !== undefined) as IIterable<T>));

        describe(`${name} (TakeWhileEnumerable)`, () => test(
            <T>(e: T[]) => new TakeWhileEnumerable(Enumerable.fromSource(e), e => true)));

        describe(`${name} (SkipWhileEnumerable)`, () => test(
            <T>(e: T[]) => new SkipWhileEnumerable(Enumerable.fromSource(e), e => false)));
      
        describe(`${name} (ZippedEnumerable)`, () => test(
            <T>(e: T[]) => new ZippedEnumerable(Enumerable.fromSource(e), Enumerable.fromSource(e), (x, y) => x)));
    }

    export function run(): void
    {
        runTest("Next", next);
        runTest("Reset", reset);
        runTest("Value", value);
        runTest("Clone", clone);
    }

    function next(instancer: Instancer): void
    {
        it("Return false for empty collection", () =>
        {
            const it = instancer<number>([]);
            Test.isFalse(it.next());
        });

        it("Iterate over elements + return false in the end", () =>
        {
            const it = instancer([1, 2, 3]);
            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isTrue(it.next()); // 3
            Test.isFalse(it.next());
        });
    }

    function reset(instancer: Instancer): void
    {
        it("Iterator is resetted correctly", () =>
        {
            const it = instancer([1, 2]);

            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isFalse(it.next());
            it.reset();

            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isFalse(it.next());
            it.reset();

            Test.isTrue(it.next()); // 1
            it.reset();

            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isFalse(it.next());
        });

        it("Multiple reset in a row act like single one", () =>
        {
            const it = instancer([1, 2]);

            it.reset();
            it.reset();
            it.reset();

            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isFalse(it.next());

            it.reset();
            it.reset();
            it.reset();

            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isFalse(it.next());

            it.reset();
            it.reset();
            it.reset();
        });
    }

    function value(instancer: Instancer): void
    {
        it("Exception if getting an out of bounds value", () =>
        {
            const it = instancer<number>([]);
            Test.isFalse(it.next());
            Test.throwsException(() => it.value());
        });

        it("Get values", () =>
        {
            const it = instancer([2, 4, 6]);

            Test.isTrue(it.next()); Test.isEqual(it.value(), 2);
            Test.isTrue(it.next()); Test.isEqual(it.value(), 4);
            Test.isTrue(it.next()); Test.isEqual(it.value(), 6);
            Test.isFalse(it.next());
        });

        it("Get values + exception in the end (out of bounds)", () =>
        {
            const it = instancer([2, 4]);

            Test.isTrue(it.next()); Test.isEqual(it.value(), 2);
            Test.isTrue(it.next()); Test.isEqual(it.value(), 4);
            Test.isFalse(it.next()); Test.throwsException(() => it.value());
        });
    }

    function clone(instancer: Instancer): void
    {
        it("Cloned iterator is resetted by default", () =>
        {
            const original = instancer([2, 4, 6]);
            Test.isTrue(original.next()); Test.isEqual(original.value(), 2);

            const clone = original.copy();
            Test.isTrue(clone.next()); Test.isEqual(clone.value(), 2);
        });

        it("Cloned iterator doesn't affect original one", () =>
        {
            const original = instancer([2, 4, 6]);
            Test.isTrue(original.next()); Test.isEqual(original.value(), 2);

            const cloned = original.copy();
            cloned.next(); // 2
            cloned.next(); // 4

            Test.isTrue(original.next()); Test.isEqual(original.value(), 4);

            cloned.reset();

            Test.isTrue(original.next()); Test.isEqual(original.value(), 6);
            Test.isFalse(original.next());
        });

        it("Cloned iterator is identical to original", () =>
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
        });
    }
}
