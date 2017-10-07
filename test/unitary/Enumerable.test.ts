import { Enumerable } from "../../src/Enumerables";
import { ArrayIterator } from "../../src/Iterators";
import { Test } from "../Test";

export namespace EnumerableUnitTest
{
    export function run(): void
    {
        it("FromSource", fromSource);
        it("Empty", empty);
        it("Range", range);
        it("Repeat", repeat);
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
        Test.throwsException(() => Enumerable.range(0, -1));
        Test.throwsException(() => Enumerable.range(5, -666));

        let base = Enumerable.range(0, 0);
        Test.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.range(4, 0);
        Test.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.range(2, 3);
        Test.isArrayEqual(base.toArray(), [2, 3, 4]);

        base = Enumerable.range(-2, 4);
        Test.isArrayEqual(base.toArray(), [-2, -1, 0, 1]);

        base = Enumerable.range(0, 6);
        Test.isArrayEqual(base.toArray(), [0, 1, 2, 3, 4, 5]);

        base = Enumerable.range(0, 1000000);
        Test.isArrayEqual(base.toArray(), base.toArray());

        // Reverse

        Test.throwsException(() => Enumerable.range(0, -1, false));
        Test.throwsException(() => Enumerable.range(5, -666, false));

        base = Enumerable.range(0, 0, false);
        Test.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.range(4, 0, false);
        Test.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.range(2, 3, false);
        Test.isArrayEqual(base.toArray(), [2, 1, 0]);

        base = Enumerable.range(-2, 4, false);
        Test.isArrayEqual(base.toArray(), [-2, -3, -4, -5]);

        base = Enumerable.range(0, 6, false);
        Test.isArrayEqual(base.toArray(), [0, -1, -2, -3, -4, -5]);

        base = Enumerable.range(0, 1000000, false);
        Test.isArrayEqual(base.toArray(), base.toArray());
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
