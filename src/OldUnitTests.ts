import { Test } from "../test/Test";
import { ArrayIterator, Enumerable, IEnumerable, List, StringIterator } from "./Linq";

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

    function toArray(): void
    {
        const base = [1, 2, 3, 4];
        const baseEnumerable = Enumerable.fromSource(base);
        const baseArray = baseEnumerable.toArray(); // Copy of `base`

        Test.isArrayEqual(base, baseArray);

        base.push(5);
        Test.isArrayEqual([1, 2, 3, 4], baseArray);

        let source: number[] = [];
        let i = Enumerable.fromSource(new ArrayIterator(source));
        Test.isArrayEqual(i.toArray(), source);

        source = [1, 2, 3];
        i = Enumerable.fromSource(new ArrayIterator(source));
        Test.isArrayEqual(i.toArray(), source);

        const strSource = ["asd", "asdaa"];
        const strI = Enumerable.fromSource(new ArrayIterator(strSource));
        Test.isArrayEqual(strI.toArray(), strSource);

        const str = "asdasdsad";
        const strI2 = Enumerable.fromSource(new StringIterator(str));
        Test.isArrayEqual(strI2.toArray(), str.split(""));
    }

    function reverse(): void
    {
        const baseEnumerable = Enumerable.fromSource([1, 2, 3, 4]);
        const baseEnumerableReversed = baseEnumerable.reverse();

        Test.isArrayEqual([1, 2, 3, 4], baseEnumerable.toArray());
        Test.isArrayEqual([4, 3, 2, 1], baseEnumerableReversed.toArray());
    }

    function concat(): void
    {
        const base0 = Enumerable.fromSource([1, 2]);
        const base1 = Enumerable.fromSource([3, 4]);
        const result = base0.concat(base1);

        Test.isArrayEqual([1, 2], base0.toArray());
        Test.isArrayEqual([3, 4], base1.toArray());
        Test.isArrayEqual([1, 2, 3, 4], result.toArray());
    }

    function aggregate(): void
    {
        let base = Enumerable.fromSource([] as string[]);
        Test.throwsException(() => base.aggregate((p, c) => c));

        base = Enumerable.fromSource(["a", "b", "a", "a"]);
        Test.isEqual(base.aggregate((p, c) => p === "b" ? p : c), "b");
        Test.isEqual(base.aggregate((p, c) => 33, 2), 33);
        Test.isTrue(base.aggregate<boolean>((p, c) => p || c === "b", false));
        Test.isTrue(base.aggregate<boolean>((p, c) => p || c === "a", false));
        Test.isFalse(base.aggregate<boolean>((p, c) => p || c === "x", false));
        Test.isTrue(base.aggregate<boolean>((p, c) => p || c === "x", true));
    }

    function count(): void
    {
        let source: number[] = [];
        let i = Enumerable.fromSource(new ArrayIterator(source));
        Test.isEqual(i.count(), source.length);

        source = [1, 2, 3];
        i = Enumerable.fromSource(new ArrayIterator(source));
        Test.isEqual(i.count(), source.length);

        const strSource = ["asd", "asdaa"];
        const strI = Enumerable.fromSource(new ArrayIterator(strSource));
        Test.isEqual(strI.count(), strSource.length);

        const str = "asdasdsad";
        const strI2 = Enumerable.fromSource(new StringIterator(str));
        Test.isEqual(strI2.count(), str.split("").length);

        const base = Enumerable.fromSource([1, 2, 41, 668, 7]);
        Test.isEqual(base.count(e => e % 2 !== 0), 3);
        Test.isEqual(base.count(e => e % 2 === 0), 2);
        Test.isEqual(base.count((e) => e > 50), 1);
    }

    function any(): void
    {
        let base = Enumerable.empty<string>();
        Test.isTrue(!base.any());

        base = Enumerable.fromSource(["lol"]);
        Test.isTrue(base.any());

        // With predicate
        base = Enumerable.fromSource(["a", "av", "abc", "x"]);

        Test.isTrue(base.any(e => e.length > 2));
        Test.isTrue(base.any(e => e[0] === "a"));
        Test.isTrue(!base.any(e => e[0] === "b"));
        Test.isTrue(!base.any(e => e.length > 5));
        Test.isTrue(!base.any(e => e.length === 0));
        Test.isTrue(base.any(e => e.length === 1));
    }

    function all(): void
    {
        let base = Enumerable.empty<string>();
        Test.isTrue(base.all(e => true));

        base = Enumerable.fromSource(["lol"]);
        Test.isTrue(base.all(e => e[0] === "l"));

        base = Enumerable.fromSource(["a", "av", "abc"]);
        Test.isTrue(base.all(e => e.length > 0));
        Test.isTrue(base.all(e => e[0] === "a"));

        base = Enumerable.fromSource(["a", "av", "abc", "xd"]);
        Test.isTrue(!base.all(e => e[0] === "a"));

        base = Enumerable.fromSource(["a", "av", "abc", "xd", ""]);
        Test.isTrue(!base.all(e => e.length > 0));
    }

    function contains(): void
    {
        const base = Enumerable.fromSource([1, 2, 4]);

        Test.isTrue(base.contains(1));
        Test.isTrue(base.contains(2));
        Test.isTrue(!base.contains(3));
        Test.isTrue(base.contains(4));
        Test.isTrue(!base.contains(7));
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

    function distinct(): void
    {
        let base = Enumerable.empty<number>();
        Test.isArrayEqual(base.distinct().toArray(), []);

        base = Enumerable.fromSource([-5, 6, 2, 6, 99, 0, -5, 2, 7, 2, 0]);
        Test.isArrayEqual(base.distinct().toArray(), [-5, 6, 2, 99, 0, 7]);

        let withKey = Enumerable.empty<string>();
        Test.isArrayEqual(withKey.distinct(x => x).toArray(), []);

        withKey = Enumerable.fromSource(["a", "b", "aba", "ce", "wea", "baba", "era", "eaa"]);
        Test.isArrayEqual(withKey.distinct(e => e[0]).toArray(), ["a", "b", "ce", "wea", "era"]);
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

    function average(): void
    {
        let base = Enumerable.empty<number>();
        Test.throwsException(() => base.average(e => e));

        base = Enumerable.fromSource([2]);
        Test.isEqual(base.average(e => e), 2);

        base = Enumerable.fromSource([3, 4, -2, 79, 1]);
        Test.isEqual(base.average(e => e), 17);

        const strbase = Enumerable.fromSource(["112", "432", "46"]);
        Test.isEqual(strbase.average(e => parseInt(e[0])), 3);
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

    function elementAt(): void
    {
        const base = Enumerable.fromSource([1, 2, 3, 4]);

        Test.throwsException(() =>
        {
            const e = base.elementAt(-2);
        });

        Test.isEqual(base.elementAt(0), 1);
        Test.isEqual(base.elementAt(1), 2);
        Test.isEqual(base.elementAt(2), 3);
        Test.isEqual(base.elementAt(3), 4);

        Test.throwsException(() =>
        {
            const e = base.elementAt(4);
        });

        Test.throwsException(() =>
        {
            const e = base.elementAt(5);
        });
    }

    function elementAtOrDefault(): void
    {
        const base = Enumerable.fromSource([1, 2, 3, 4]);

        Test.throwsException(() =>
        {
            const e = base.elementAtOrDefault(-2);
        });

        Test.isEqual(base.elementAtOrDefault(0), 1);
        Test.isEqual(base.elementAtOrDefault(1), 2);
        Test.isEqual(base.elementAtOrDefault(2), 3);
        Test.isEqual(base.elementAtOrDefault(3), 4);
        Test.isEqual(base.elementAtOrDefault(4), undefined);
        Test.isEqual(base.elementAtOrDefault(5), undefined);
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

    function except(): void
    {
        let base = Enumerable.fromSource([1, 2, 3, 4]);
        let base2 = Enumerable.fromSource([2, 5, 1, 7]);
        Test.isArrayEqual(base.except(base2).toArray(), [3, 4]);

        base2 = Enumerable.fromSource([3, 6, 88]);
        Test.isArrayEqual(base.except(base2).toArray(), [1, 2, 4]);

        base2 = Enumerable.fromSource([]);
        Test.isArrayEqual(base.except(base2).toArray(), [1, 2, 3, 4]);

        base = Enumerable.fromSource([]);
        Test.isArrayEqual(base.except(base2).toArray(), []);
    }
}
