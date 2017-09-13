import { Test } from "../Test";
import { StringIterator } from "../../src/Iterators";

export namespace StringIteratorTests
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
        it("Return false for empty string", () =>
        {
            const it = new StringIterator("");
            Test.isFalse(it.next());
        });

        it("Iterate over characters + return false in the end", () =>
        {
            const it = new StringIterator("isc");
            Test.isTrue(it.next()); // i
            Test.isTrue(it.next()); // s
            Test.isTrue(it.next()); // c
            Test.isFalse(it.next());
        });
    }

    function reset(): void
    {
        it("Iterator is resetted correctly", () =>
        {
            const it = new StringIterator("hi");

            Test.isTrue(it.next()); // h
            Test.isTrue(it.next()); // i
            Test.isFalse(it.next());
            it.reset();

            Test.isTrue(it.next()); // h
            Test.isTrue(it.next()); // i
            Test.isFalse(it.next());
            it.reset();

            Test.isTrue(it.next()); // h
            it.reset();

            Test.isTrue(it.next()); // h
            Test.isTrue(it.next()); // i
            Test.isFalse(it.next());
        });

        it("Multiple reset in a row act like single one", () =>
        {
            const it = new StringIterator("hi");

            it.reset();
            it.reset();
            it.reset();

            Test.isTrue(it.next()); // h
            Test.isTrue(it.next()); // i
            Test.isFalse(it.next());

            it.reset();
            it.reset();
            it.reset();

            Test.isTrue(it.next()); // h
            Test.isTrue(it.next()); // i
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
            const it = new StringIterator("");
            Test.isFalse(it.next());
            Test.throwsException(() => it.value());
        });

        it("Get values", () =>
        {
            const it = new StringIterator("isc");

            Test.isTrue(it.next()); Test.isEqual(it.value(), "i");
            Test.isTrue(it.next()); Test.isEqual(it.value(), "s");
            Test.isTrue(it.next()); Test.isEqual(it.value(), "c");
            Test.isFalse(it.next());
        });

        it("Get values + exception in the end (out of bounds)", () =>
        {
            const it = new StringIterator("hi");

            Test.isTrue(it.next()); Test.isEqual(it.value(), "h");
            Test.isTrue(it.next()); Test.isEqual(it.value(), "i");
            Test.isFalse(it.next()); Test.throwsException(() => it.value());
        });
    }

    function clone(): void
    {
        it("Cloned iterator is resetted by default", () =>
        {
            const original = new StringIterator("isc");
            Test.isTrue(original.next()); Test.isEqual(original.value(), "i");

            const clone = original.clone();
            Test.isTrue(clone.next()); Test.isEqual(clone.value(), "i");
        });

        it("Cloned iterator doesn't affect original one", () =>
        {
            const original = new StringIterator("isc");
            Test.isTrue(original.next()); Test.isEqual(original.value(), "i");

            const cloned = original.clone();
            cloned.next(); // i
            cloned.next(); // s

            Test.isTrue(original.next()); Test.isEqual(original.value(), "s");

            cloned.reset();

            Test.isTrue(original.next()); Test.isEqual(original.value(), "c");
            Test.isFalse(original.next());
        });

        it("Cloned iterator is identical to original", () =>
        {
            const original = new StringIterator("isc");
            const cloned = original.clone();

            Test.isTrue(original.next()); Test.isEqual(original.value(), "i");
            Test.isTrue(cloned.next()); Test.isEqual(cloned.value(), "i");

            Test.isTrue(original.next()); Test.isEqual(original.value(), "s");
            Test.isTrue(cloned.next()); Test.isEqual(cloned.value(), "s");

            Test.isTrue(original.next()); Test.isEqual(original.value(), "c");
            Test.isTrue(cloned.next()); Test.isEqual(cloned.value(), "c");

            Test.isFalse(original.next());
            Test.isFalse(cloned.next());
        });
    }
}
