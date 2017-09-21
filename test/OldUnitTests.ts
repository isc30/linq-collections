import { Test } from "../test/Test";
import { ArrayIterator, Enumerable, IEnumerable, List, StringIterator } from "../src/Linq";

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

    function reverse(): void
    {
        const baseEnumerable = Enumerable.fromSource([1, 2, 3, 4]);
        const baseEnumerableReversed = baseEnumerable.reverse();

        Test.isArrayEqual([1, 2, 3, 4], baseEnumerable.toArray());
        Test.isArrayEqual([4, 3, 2, 1], baseEnumerableReversed.toArray());
    }

    function where(): void
    {
        const base = Enumerable.fromSource([39, 21, 66, 20]);

        const onlyYoung = base.where(e => e < 30);
        Test.isEqual(onlyYoung.count(), 2);
        Test.isArrayEqual(onlyYoung.toArray(), [21, 20]);

        const sooooOld = base.where(e => e > 90);
        Test.isEqual(sooooOld.count(), 0);

        let i = Enumerable.fromSource([1, 2, 3, 4, 5, 6, 7, 8]);
        i = i.where(e => e % 2 === 0);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 2);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 4);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 6);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 8);
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());

        i = Enumerable.fromSource(new ArrayIterator<number>([1, 2, 3, 4, 5, 6, 7, 8]));
        i = i.where(e => e % 2 === 0);
        i = i.where(e => e < 5);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 2);
        Test.isTrue(i.next());
        Test.isEqual(i.value(), 4);
        Test.isFalse(i.next());
        Test.throwsException(() => i.value());
    }

    function select(): void
    {
        const base = Enumerable.fromSource(["pepin", "sanz", "macheta", "cea"]);
        const lengths = base.select(e => e.length);

        Test.isArrayEqual(lengths.toArray(), [5, 4, 7, 3]);

        const i = Enumerable.fromSource([1, 2, 3]);
        const names = i.select(e => "name" + e);
        Test.isTrue(names.next());
        Test.isEqual(names.value(), "name1");
        Test.isTrue(names.next());
        Test.isEqual(names.value(), "name2");
        i.next();
        i.next();
        i.next();
        Test.isTrue(names.next());
        Test.isEqual(names.value(), "name3");
        Test.isFalse(names.next());
        Test.throwsException(() => names.value());
    }

    class SelectManyTestClass {
        public numberArray: number[];
        public numberEnumerable: IEnumerable<number>;
        public x: string;

        public constructor(numbers: number[])
        {
            this.numberArray = numbers;
            this.numberEnumerable = Enumerable.fromSource(this.numberArray);
        }
    }

    function selectMany(): void
    {
        let base = Enumerable.fromSource([
            new SelectManyTestClass([1, 2, 3]),
        ]);

        base = base.where(x => true);

        Test.isArrayEqual(base.selectMany(e => e.numberArray).toArray(), [1, 2, 3]);
        Test.isArrayEqual(base.selectMany(e => e.numberEnumerable).toArray(), [1, 2, 3]);

        base = Enumerable.fromSource([
            new SelectManyTestClass([1, 2, 3]),
            new SelectManyTestClass([4, 5]),
            new SelectManyTestClass([]),
            new SelectManyTestClass([6]),
            new SelectManyTestClass([7, 8]),
        ]);

        Test.isArrayEqual(base.selectMany(e => e.numberArray).toArray(), [1, 2, 3, 4, 5, 6, 7, 8]);
        Test.isArrayEqual(base.selectMany(e => e.numberEnumerable).toArray(), [1, 2, 3, 4, 5, 6, 7, 8]);

        base = Enumerable.fromSource([new SelectManyTestClass([])]);

        Test.isArrayEqual(base.selectMany(e => e.numberArray).toArray(), []);
        Test.isArrayEqual(base.selectMany(e => e.numberEnumerable).toArray(), []);
    }

    function first(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.first());

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        Test.isEqual(base.first(), -2);
        Test.isEqual(base.first(e => e > 5), 65);
        Test.isEqual(base.first(e => e % 6 === 0), 42);
        Test.throwsException(() => base.first(e => e === 11811));
    }

    function firstOrDefault(): void
    {
        let base = Enumerable.empty<number>();
        Test.isEqual(base.firstOrDefault(), undefined);

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        Test.isEqual(base.firstOrDefault(), -2);
        Test.isEqual(base.firstOrDefault(e => e > 5), 65);
        Test.isEqual(base.firstOrDefault(e => e % 6 === 0), 42);
        Test.isEqual(base.firstOrDefault(e => e === 11811), undefined);
    }

    function last(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.last());

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        Test.isEqual(base.last(), 2);
        Test.isEqual(base.last(e => e > 5), 7);
        Test.isEqual(base.last(e => e % 6 === 0), 36);
        Test.throwsException(() => base.last(e => e === 11811));
    }

    function lastOrDefault(): void
    {
        let base = Enumerable.empty<number>();
        Test.isEqual(base.lastOrDefault(), undefined);

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        Test.isEqual(base.lastOrDefault(), 2);
        Test.isEqual(base.lastOrDefault(e => e > 5), 7);
        Test.isEqual(base.lastOrDefault(e => e % 6 === 0), 36);
        Test.isEqual(base.lastOrDefault(e => e === 11811), undefined);
    }

    function single(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.single());

        base = Enumerable.fromSource([33]);
        Test.isEqual(base.single(), 33);

        base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        Test.throwsException(() => base.single());
        Test.throwsException(() => base.single(e => e > 5));
        Test.isEqual(base.single(e => e > 60), 65);
        Test.isEqual(base.single(e => e % 6 === 0), 36);
        Test.throwsException(() => base.single(e => e === 11811));
    }

    function singleOrDefault(): void
    {
        let base = Enumerable.empty<number>();
        Test.isEqual(base.singleOrDefault(), undefined);

        base = Enumerable.fromSource([33]);
        Test.isEqual(base.singleOrDefault(), 33);

        base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        Test.throwsException(() => base.singleOrDefault());
        Test.throwsException(() => base.singleOrDefault(e => e > 5));
        Test.isEqual(base.singleOrDefault(e => e > 60), 65);
        Test.isEqual(base.singleOrDefault(e => e % 6 === 0), 36);
        Test.isEqual(base.singleOrDefault(e => e === 11811), undefined);
    }

    function min(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.min());

        base = Enumerable.fromSource([2]);
        Test.isEqual(base.min(), 2);

        base = Enumerable.fromSource([3, 4, -8, 77, 1]);
        Test.isEqual(base.min(), -8);

        const strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
        Test.isEqual(strbase.min(), "are");
        Test.isEqual(strbase.min(e => e[0]), "a");
        Test.isEqual(strbase.min(e => e[1]), "e");
    }

    function max(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.max());

        base = Enumerable.fromSource([2]);
        Test.isEqual(base.max(), 2);

        base = Enumerable.fromSource([3, 4, -8, 77, 1]);
        Test.isEqual(base.max(), 77);

        const strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
        Test.isEqual(strbase.max(), "you");
        Test.isEqual(strbase.max(e => e[0]), "y");
        Test.isEqual(strbase.max(e => e[1]), "v");
    }

    function sum(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.sum());

        base = Enumerable.fromSource([2]);
        Test.isEqual(base.sum(), 2);

        base = Enumerable.fromSource([3, 4, -20, 1]);
        Test.isEqual(base.sum(), -12);

        const strbase = Enumerable.fromSource(["hello", " ", "ivan"]);
        Test.isEqual(strbase.sum(), "hello ivan");
        Test.isEqual(strbase.sum(e => e[0]), "h i");
    }

    function skip(): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        Test.throwsException(() => base.skip(-666));

        const y = base.skip(0).toArray();

        Test.isArrayEqual(base.skip(0).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);

        const x = base.skip(1).toArray();

        Test.isArrayEqual(x, [4, 65, 32, 1, 36, 7, 2]);
        Test.isArrayEqual(base.skip(6).toArray(), [7, 2]);
    }

    function take(): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        Test.throwsException(() => base.take(-666));

        Test.isArrayEqual(base.take(0).toArray(), [] as number[]);
        Test.isArrayEqual(base.take(1).toArray(), [-2]);
        Test.isArrayEqual(base.take(6).toArray(), [-2, 4, 65, 32, 1, 36]);
    }

    function skipTake(): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);

        Test.isArrayEqual(base.skip(2).take(2).toArray(), [65, 32]);
        Test.isArrayEqual(base.skip(7).take(5).toArray(), [2]);
    }

    function forEach(): void
    {
        const base = Enumerable.fromSource([1, 2, 3]);
        const iterated: number[] = [];

        base.forEach(e =>
        {
            iterated.push(e);
        });

        Test.isArrayEqual(base.toArray(), iterated);

        // Check inmutablility

        const original = base.toArray();

        base.forEach(e =>
        {
            e = e + 1;
        });

        Test.isArrayEqual(base.toArray(), original);

        // With indices

        const indices: number[] = [];

        base.forEach((e, i) =>
        {
            indices.push(e + i);
        });

        Test.isArrayEqual(indices, [1, 3, 5]);
    }

    function union(): void
    {
        let base = Enumerable.fromSource([1, 2, 3, 4]);
        let base2 = Enumerable.fromSource([2, 5, 1, 7]);
        Test.isArrayEqual(base.union(base2).toArray(), [1, 2, 3, 4, 5, 7]);

        base2 = Enumerable.fromSource([]);
        Test.isArrayEqual(base.union(base2).toArray(), [1, 2, 3, 4]);

        base = Enumerable.fromSource([]);
        Test.isArrayEqual(base.union(base2).toArray(), []);
    }
}
