import { Test } from "../test/Test";
import { ArrayIterator, Enumerable, IEnumerable, List } from "../src/Linq";

export namespace UnitTests
{
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

    function arrayIterator(): void
    {
        let i = new ArrayIterator<number>([]);
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());

        i = new ArrayIterator<number>([2, 4, 6]);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 2);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 4);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 6);
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());
    }

    function enumerable(): void
    {
        let i = Enumerable.fromSource(new ArrayIterator<number>([]));
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());

        i = Enumerable.fromSource(new ArrayIterator<number>([2, 4, 6]));
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 2);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 4);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 6);
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());

        i = Enumerable.fromSource(Enumerable.fromSource(new ArrayIterator<number>([])));
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());

        i = Enumerable.fromSource(Enumerable.fromSource([2, 4, 6]));
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 2);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 4);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 6);
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());
    }
}
