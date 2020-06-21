import { Enumerable } from "../../src/Enumerables";
import { ArrayIterator } from "../../src/Iterators";
import { Test } from "../Test";

export namespace EnumerableUnitTest
{
    export function run(): void
    {
        describe("ForOf", forOf);
        it("FromSource", fromSource);
        it("Empty", empty);
        describe("Range", range);
        it("Repeat", repeat);
    }

    function forOf(): void
    {
        it("Empty enumerable forOf works", () => {
            const e = Enumerable.fromSource([]);
            for (const item of e) {
                Test.fail();
            }
        });

        it("Enumerable forOf works", () => {
            const e = Enumerable.fromSource([2, 4, 6]);

            const array = [];
            for (const item of e) {
                array.push(item);
            }

            Test.isArrayEqual([2, 4, 6], array);
        });

        it("Enumerable where forOf works", () => {
            const e = Enumerable.fromSource([2, 4, 6]).where(x => x < 5);

            const array = [];
            for (const item of e) {
                array.push(item);
            }

            Test.isArrayEqual([2, 4], array);
        });

        it("Enumerable multiple enumerations forOf works", () => {
            const e = Enumerable.fromSource([2, 4, 6]).where(x => x < 5);

            const array = [];
            for (const item of e) {
                array.push(item);
            }

            const array2 = [];
            for (const item of e) {
                array2.push(item);
            }

            Test.isArrayEqual([2, 4], array);
            Test.isArrayEqual([2, 4], array2);
        });
    }

    function fromSource(): void
    {
        let e = Enumerable.fromSource(new ArrayIterator<number>([]));
        Test.isFalse(e.next());
        Test.throwsException(() => e.value());

        e = Enumerable.fromSource(new ArrayIterator<number>([2, 4, 6]));
        Test.isTrue(e.next());
        Test.isEqual(e.value(), 2);
        Test.isTrue(e.next());
        Test.isEqual(e.value(), 4);
        Test.isTrue(e.next());
        Test.isEqual(e.value(), 6);
        Test.isFalse(e.next());
        Test.throwsException(() => e.value());

        e = Enumerable.fromSource(Enumerable.fromSource(new ArrayIterator<number>([])));
        Test.isFalse(e.next());
        Test.throwsException(() => e.value());

        e = Enumerable.fromSource(Enumerable.fromSource([2, 4, 6]));
        Test.isTrue(e.next());
        Test.isEqual(e.value(), 2);
        Test.isTrue(e.next());
        Test.isEqual(e.value(), 4);
        Test.isTrue(e.next());
        Test.isEqual(e.value(), 6);
        Test.isFalse(e.next());
        Test.throwsException(() => e.value());
    }

    function empty(): void
    {
        const base = Enumerable.empty<number>();
        Test.isArrayEqual(base.toArray(), [] as number[]);
    }

    function range(): void
    {
        it("Negative count throws exception", () =>
        {
            Test.throwsException(() => Enumerable.range(0, -1));
            Test.throwsException(() => Enumerable.range(5, -666));
        });

        it("Zero count returns empty", () =>
        {
            let base = Enumerable.range(0, 0);
            Test.isArrayEqual(base.toArray(), [] as number[]);

            base = Enumerable.range(4, 0);
            Test.isArrayEqual(base.toArray(), [] as number[]);
        });

        it("Value is correct", () =>
        {
            let base = Enumerable.range(2, 3);
            Test.isArrayEqual(base.toArray(), [2, 3, 4]);

            base = Enumerable.range(-2, 4);
            Test.isArrayEqual(base.toArray(), [-2, -1, 0, 1]);

            base = Enumerable.range(0, 6);
            Test.isArrayEqual(base.toArray(), [0, 1, 2, 3, 4, 5]);

            base = Enumerable.range(0, 1000000);
            Test.isArrayEqual(base.toArray(), base.toArray());
        });

        it("Negative count throws exception (descending)", () =>
        {
            Test.throwsException(() => Enumerable.range(0, -1, false));
            Test.throwsException(() => Enumerable.range(5, -666, false));
        });

        it("Zero count returns empty (descending)", () =>
        {
            let base = Enumerable.range(0, 0, false);
            Test.isArrayEqual(base.toArray(), [] as number[]);

            base = Enumerable.range(4, 0, false);
            Test.isArrayEqual(base.toArray(), [] as number[]);
        });

        it("Value is correct (descending)", () =>
        {
            let base = Enumerable.range(2, 3, false);
            Test.isArrayEqual(base.toArray(), [2, 1, 0]);

            base = Enumerable.range(-2, 4, false);
            Test.isArrayEqual(base.toArray(), [-2, -3, -4, -5]);

            base = Enumerable.range(0, 6, false);
            Test.isArrayEqual(base.toArray(), [0, -1, -2, -3, -4, -5]);

            base = Enumerable.range(0, 1000000, false);
            Test.isArrayEqual(base.toArray(), base.toArray());
        });
    }

    function repeat(): void
    {
        Test.throwsException(() => Enumerable.repeat(0, -1));
        Test.throwsException(() => Enumerable.repeat(5, -60));
        Test.throwsException(() => Enumerable.repeat(-5, -1));

        let base = Enumerable.repeat(3, 0);
        Test.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.repeat(3, 4);
        Test.isArrayEqual(base.toArray(), [3, 3, 3, 3]);

        let baseString = Enumerable.repeat("a", 0);
        Test.isArrayEqual(baseString.toArray(), [] as string[]);

        baseString = Enumerable.repeat("a", 2);
        Test.isArrayEqual(baseString.toArray(), ["a", "a"]);
    }
}
