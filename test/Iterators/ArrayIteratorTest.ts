import {Test} from "../Test";
import {ArrayIterator} from "../../Linq/Iterators";

export namespace ArrayIteratorTests
{
    export function run(): void
    {
        describe("Next", next);
        describe("Reset", reset);
        describe("Value", value);
        describe("Clone", clone);
    }

    function next(): void
    {
        it("Return false for empty collection", () =>
        {
            const it = new ArrayIterator<number>([]);
            Test.isFalse(it.next());
        });

        it("Iterate over elements + return false in the end", () =>
        {
            const it = new ArrayIterator<number>([1, 2, 3]);
            Test.isTrue(it.next()); // 1
            Test.isTrue(it.next()); // 2
            Test.isTrue(it.next()); // 3
            Test.isFalse(it.next());
        });
    }

    function reset(): void
    {
        it("Iterator is resetted correctly", () =>
        {
            const it = new ArrayIterator<number>([1, 2]);

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
            const it = new ArrayIterator<number>([1, 2]);

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

    function value(): void
    {
        it("Exception if getting an out of bounds value", () =>
        {
            const it = new ArrayIterator<number>([]);
            Test.isFalse(it.next());
            Test.throwsException(() => it.value());
        });

        it("Get values", () =>
        {
            const it = new ArrayIterator<number>([2, 4, 6]);

            Test.isTrue(it.next()); Test.isEqual(it.value(), 2);
            Test.isTrue(it.next()); Test.isEqual(it.value(), 4);
            Test.isTrue(it.next()); Test.isEqual(it.value(), 6);
            Test.isFalse(it.next());
        });

        it("Get values + exception in the end (out of bounds)", () =>
        {
            const it = new ArrayIterator<number>([2, 4]);

            Test.isTrue(it.next()); Test.isEqual(it.value(), 2);
            Test.isTrue(it.next()); Test.isEqual(it.value(), 4);
            Test.isFalse(it.next()); Test.throwsException(() => it.value());
        });
    }

    function clone(): void
    {
        it("Cloned iterator is resetted by default", () =>
        {
            const original = new ArrayIterator<number>([2, 4, 6]);
            Test.isTrue(original.next()); Test.isEqual(original.value(), 2);

            const clone = original.clone();
            Test.isTrue(clone.next()); Test.isEqual(clone.value(), 2);
        });

        it("Cloned iterator doesn't affect original one", () =>
        {
            const original = new ArrayIterator<number>([2, 4, 6]);
            Test.isTrue(original.next()); Test.isEqual(original.value(), 2);

            const cloned = original.clone();
            cloned.next(); // 2
            cloned.next(); // 4

            Test.isTrue(original.next()); Test.isEqual(original.value(), 4);

            cloned.reset();

            Test.isTrue(original.next()); Test.isEqual(original.value(), 6);
            Test.isFalse(original.next());
        });

        it("Cloned iterator is identical to original", () =>
        {
            const original = new ArrayIterator<number>([2, 4, 6]);
            const cloned = original.clone();

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
