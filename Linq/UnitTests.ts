import { Test } from "../Testing/Test";
import { ArrayIterator, Enumerable, IEnumerable, List, StringIterator } from "./Linq";

export namespace UnitTests
{
    export function run(detailed: boolean = true): void
    {
        let success = 0;
        let fail = 0;

        Test.run("array iterator", arrayIterator, detailed) ? success++ : fail++;
        Test.run("enumerable", enumerable, detailed) ? success++ : fail++;
        Test.run("empty", empty, detailed) ? success++ : fail++;
        Test.run("range", range, detailed) ? success++ : fail++;
        Test.run("repeat", repeat, detailed) ? success++ : fail++;
        Test.run("toArray", toArray, detailed) ? success++ : fail++;
        Test.run("reverse", reverse, detailed) ? success++ : fail++;
        Test.run("concat", concat, detailed) ? success++ : fail++;
        Test.run("aggregate", aggregate, detailed) ? success++ : fail++;
        Test.run("count", count, detailed) ? success++ : fail++;
        Test.run("any", any, detailed) ? success++ : fail++;
        Test.run("all", all, detailed) ? success++ : fail++;
        Test.run("contains", contains, detailed) ? success++ : fail++;
        Test.run("where", where, detailed) ? success++ : fail++;
        Test.run("select", select, detailed) ? success++ : fail++;
        Test.run("selectMany", selectMany, detailed) ? success++ : fail++;
        Test.run("first", first, detailed) ? success++ : fail++;
        Test.run("firstOrDefault", firstOrDefault, detailed) ? success++ : fail++;
        Test.run("last", last, detailed) ? success++ : fail++;
        Test.run("lastOrDefault", lastOrDefault, detailed) ? success++ : fail++;
        Test.run("single", single, detailed) ? success++ : fail++;
        Test.run("singleOrDefault", singleOrDefault, detailed) ? success++ : fail++;
        Test.run("distinct", distinct, detailed) ? success++ : fail++;
        Test.run("min", min, detailed) ? success++ : fail++;
        Test.run("max", max, detailed) ? success++ : fail++;
        Test.run("average", average, detailed) ? success++ : fail++;
        Test.run("sum", sum, detailed) ? success++ : fail++;
        Test.run("skip", skip, detailed) ? success++ : fail++;
        Test.run("take", take, detailed) ? success++ : fail++;
        Test.run("skip + take", skipTake, detailed) ? success++ : fail++;
        Test.run("forEach", forEach, detailed) ? success++ : fail++;
        Test.run("elementAt", elementAt, detailed) ? success++ : fail++;
        Test.run("elementAtOrDefault", elementAtOrDefault, detailed) ? success++ : fail++;
        Test.run("union", union, detailed) ? success++ : fail++;
        Test.run("except", except, detailed) ? success++ : fail++;

        console.log(`Tests: ${success}/${success + fail}`);
    }

    function empty(t: Test): void
    {
        const base = Enumerable.empty<number>();
        t.isArrayEqual(base.toArray(), [] as number[]);
    }

    function range(t: Test): void
    {
        t.throwsException(() => Enumerable.range(0, -1));
        t.throwsException(() => Enumerable.range(5, -666));

        let base = Enumerable.range(0, 0);
        t.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.range(4, 0);
        t.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.range(2, 3);
        t.isArrayEqual(base.toArray(), [2, 3, 4]);

        base = Enumerable.range(-2, 4);
        t.isArrayEqual(base.toArray(), [-2, -1, 0, 1]);

        base = Enumerable.range(0, 6);
        t.isArrayEqual(base.toArray(), [0, 1, 2, 3, 4, 5]);
    }

    function repeat(t: Test): void
    {
        t.throwsException(() => Enumerable.repeat(0, -1));
        t.throwsException(() => Enumerable.repeat(5, -60));
        t.throwsException(() => Enumerable.repeat(-5, -1));

        let base = Enumerable.repeat(3, 0);
        t.isArrayEqual(base.toArray(), [] as number[]);

        base = Enumerable.repeat(3, 4);
        t.isArrayEqual(base.toArray(), [3, 3, 3, 3]);

        let baseString = Enumerable.repeat("a", 0);
        t.isArrayEqual(baseString.toArray(), [] as string[]);

        baseString = Enumerable.repeat("a", 2);
        t.isArrayEqual(baseString.toArray(), ["a", "a"]);
    }

    function arrayIterator(t: Test): void
    {
        let i = new ArrayIterator<number>([]);
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = new ArrayIterator<number>([2, 4, 6]);
        t.isTrue(i.next());
        t.isEqual(i.value(), 2);
        t.isTrue(i.next());
        t.isEqual(i.value(), 4);
        t.isTrue(i.next());
        t.isEqual(i.value(), 6);
        t.isFalse(i.next());
        t.throwsException(() => i.value());
    }

    function enumerable(t: Test): void
    {
        let i = Enumerable.fromSource(new ArrayIterator<number>([]));
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(new ArrayIterator<number>([2, 4, 6]));
        t.isTrue(i.next());
        t.isEqual(i.value(), 2);
        t.isTrue(i.next());
        t.isEqual(i.value(), 4);
        t.isTrue(i.next());
        t.isEqual(i.value(), 6);
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(Enumerable.fromSource(new ArrayIterator<number>([])));
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(Enumerable.fromSource([2, 4, 6]));
        t.isTrue(i.next());
        t.isEqual(i.value(), 2);
        t.isTrue(i.next());
        t.isEqual(i.value(), 4);
        t.isTrue(i.next());
        t.isEqual(i.value(), 6);
        t.isFalse(i.next());
        t.throwsException(() => i.value());
    }

    function toArray(t: Test): void
    {
        const base = [1, 2, 3, 4];
        const baseEnumerable = Enumerable.fromSource(base);
        const baseArray = baseEnumerable.toArray(); // Copy of `base`

        t.isArrayEqual(base, baseArray);

        base.push(5);
        t.isArrayEqual([1, 2, 3, 4], baseArray);

        let source: number[] = [];
        let i = Enumerable.fromSource(new ArrayIterator(source));
        t.isArrayEqual(i.toArray(), source);

        source = [1, 2, 3];
        i = Enumerable.fromSource(new ArrayIterator(source));
        t.isArrayEqual(i.toArray(), source);

        const strSource = ["asd", "asdaa"];
        const strI = Enumerable.fromSource(new ArrayIterator(strSource));
        t.isArrayEqual(strI.toArray(), strSource);

        const str = "asdasdsad";
        const strI2 = Enumerable.fromSource(new StringIterator(str));
        t.isArrayEqual(strI2.toArray(), str.split(""));
    }

    function reverse(t: Test): void
    {
        const baseEnumerable = Enumerable.fromSource([1, 2, 3, 4]);
        const baseEnumerableReversed = baseEnumerable.reverse();

        t.isArrayEqual([1, 2, 3, 4], baseEnumerable.toArray());
        t.isArrayEqual([4, 3, 2, 1], baseEnumerableReversed.toArray());
    }

    function concat(t: Test): void
    {
        const base0 = Enumerable.fromSource([1, 2]);
        const base1 = Enumerable.fromSource([3, 4]);
        const result = base0.concat(base1);

        t.isArrayEqual([1, 2], base0.toArray());
        t.isArrayEqual([3, 4], base1.toArray());
        t.isArrayEqual([1, 2, 3, 4], result.toArray());
    }

    function aggregate(t: Test): void
    {
        let base = Enumerable.fromSource([] as string[]);
        t.throwsException(() => base.aggregate((p, c) => c));

        base = Enumerable.fromSource(["a", "b", "a", "a"]);
        t.isEqual(base.aggregate((p, c) => p === "b" ? p : c), "b");
        t.isEqual(base.aggregate((p, c) => 33, 2), 33);
        t.isTrue(base.aggregate<boolean>((p, c) => p || c === "b", false));
        t.isTrue(base.aggregate<boolean>((p, c) => p || c === "a", false));
        t.isFalse(base.aggregate<boolean>((p, c) => p || c === "x", false));
        t.isTrue(base.aggregate<boolean>((p, c) => p || c === "x", true));
    }

    function count(t: Test): void
    {
        let source: number[] = [];
        let i = Enumerable.fromSource(new ArrayIterator(source));
        t.isEqual(i.count(), source.length);

        source = [1, 2, 3];
        i = Enumerable.fromSource(new ArrayIterator(source));
        t.isEqual(i.count(), source.length);

        const strSource = ["asd", "asdaa"];
        const strI = Enumerable.fromSource(new ArrayIterator(strSource));
        t.isEqual(strI.count(), strSource.length);

        const str = "asdasdsad";
        const strI2 = Enumerable.fromSource(new StringIterator(str));
        t.isEqual(strI2.count(), str.split("").length);

        const base = Enumerable.fromSource([1, 2, 41, 668, 7]);
        t.isEqual(base.count(e => e % 2 !== 0), 3);
        t.isEqual(base.count(e => e % 2 === 0), 2);
        t.isEqual(base.count((e) => e > 50), 1);
    }

    function any(t: Test): void
    {
        let base = Enumerable.empty<string>();
        t.isTrue(!base.any());

        base = Enumerable.fromSource(["lol"]);
        t.isTrue(base.any());

        // With predicate
        base = Enumerable.fromSource(["a", "av", "abc", "x"]);

        t.isTrue(base.any(e => e.length > 2));
        t.isTrue(base.any(e => e[0] === "a"));
        t.isTrue(!base.any(e => e[0] === "b"));
        t.isTrue(!base.any(e => e.length > 5));
        t.isTrue(!base.any(e => e.length === 0));
        t.isTrue(base.any(e => e.length === 1));
    }

    function all(t: Test): void
    {
        let base = Enumerable.empty<string>();
        t.isTrue(base.all(e => true));

        base = Enumerable.fromSource(["lol"]);
        t.isTrue(base.all(e => e[0] === "l"));

        base = Enumerable.fromSource(["a", "av", "abc"]);
        t.isTrue(base.all(e => e.length > 0));
        t.isTrue(base.all(e => e[0] === "a"));

        base = Enumerable.fromSource(["a", "av", "abc", "xd"]);
        t.isTrue(!base.all(e => e[0] === "a"));

        base = Enumerable.fromSource(["a", "av", "abc", "xd", ""]);
        t.isTrue(!base.all(e => e.length > 0));
    }

    function contains(t: Test): void
    {
        const base = Enumerable.fromSource([1, 2, 4]);

        t.isTrue(base.contains(1));
        t.isTrue(base.contains(2));
        t.isTrue(!base.contains(3));
        t.isTrue(base.contains(4));
        t.isTrue(!base.contains(7));
    }

    function where(t: Test): void
    {
        const base = Enumerable.fromSource([39, 21, 66, 20]);

        const onlyYoung = base.where(e => e < 30);
        t.isEqual(onlyYoung.count(), 2);
        t.isArrayEqual(onlyYoung.toArray(), [21, 20]);

        const sooooOld = base.where(e => e > 90);
        t.isEqual(sooooOld.count(), 0);

        let i = Enumerable.fromSource([1, 2, 3, 4, 5, 6, 7, 8]);
        i = i.where(e => e % 2 === 0);
        t.isTrue(i.next());
        t.isEqual(i.value(), 2);
        t.isTrue(i.next());
        t.isEqual(i.value(), 4);
        t.isTrue(i.next());
        t.isEqual(i.value(), 6);
        t.isTrue(i.next());
        t.isEqual(i.value(), 8);
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(new ArrayIterator<number>([1, 2, 3, 4, 5, 6, 7, 8]));
        i = i.where(e => e % 2 === 0);
        i = i.where(e => e < 5);
        t.isTrue(i.next());
        t.isEqual(i.value(), 2);
        t.isTrue(i.next());
        t.isEqual(i.value(), 4);
        t.isFalse(i.next());
        t.throwsException(() => i.value());
    }

    function select(t: Test): void
    {
        const base = Enumerable.fromSource(["pepin", "sanz", "macheta", "cea"]);
        const lengths = base.select(e => e.length);

        t.isArrayEqual(lengths.toArray(), [5, 4, 7, 3]);

        const i = Enumerable.fromSource([1, 2, 3]);
        const names = i.select(e => "name" + e);
        t.isTrue(names.next());
        t.isEqual(names.value(), "name1");
        t.isTrue(names.next());
        t.isEqual(names.value(), "name2");
        i.next();
        i.next();
        i.next();
        t.isTrue(names.next());
        t.isEqual(names.value(), "name3");
        t.isFalse(names.next());
        t.throwsException(() => names.value());
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

    function selectMany(t: Test): void
    {
        let base = Enumerable.fromSource([
            new SelectManyTestClass([1, 2, 3]),
        ]);

        base = base.where(x => true);

        t.isArrayEqual(base.selectMany(e => e.numberArray).toArray(), [1, 2, 3]);
        t.isArrayEqual(base.selectMany(e => e.numberEnumerable).toArray(), [1, 2, 3]);

        base = Enumerable.fromSource([
            new SelectManyTestClass([1, 2, 3]),
            new SelectManyTestClass([4, 5]),
            new SelectManyTestClass([]),
            new SelectManyTestClass([6]),
            new SelectManyTestClass([7, 8]),
        ]);

        t.isArrayEqual(base.selectMany(e => e.numberArray).toArray(), [1, 2, 3, 4, 5, 6, 7, 8]);
        t.isArrayEqual(base.selectMany(e => e.numberEnumerable).toArray(), [1, 2, 3, 4, 5, 6, 7, 8]);

        base = Enumerable.fromSource([new SelectManyTestClass([])]);

        t.isArrayEqual(base.selectMany(e => e.numberArray).toArray(), []);
        t.isArrayEqual(base.selectMany(e => e.numberEnumerable).toArray(), []);
    }

    function first(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.first());

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.isEqual(base.first(), -2);
        t.isEqual(base.first(e => e > 5), 65);
        t.isEqual(base.first(e => e % 6 === 0), 42);
        t.throwsException(() => base.first(e => e === 11811));
    }

    function firstOrDefault(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.isEqual(base.firstOrDefault(), undefined);

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.isEqual(base.firstOrDefault(), -2);
        t.isEqual(base.firstOrDefault(e => e > 5), 65);
        t.isEqual(base.firstOrDefault(e => e % 6 === 0), 42);
        t.isEqual(base.firstOrDefault(e => e === 11811), undefined);
    }

    function last(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.last());

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.isEqual(base.last(), 2);
        t.isEqual(base.last(e => e > 5), 7);
        t.isEqual(base.last(e => e % 6 === 0), 36);
        t.throwsException(() => base.last(e => e === 11811));
    }

    function lastOrDefault(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.isEqual(base.lastOrDefault(), undefined);

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.isEqual(base.lastOrDefault(), 2);
        t.isEqual(base.lastOrDefault(e => e > 5), 7);
        t.isEqual(base.lastOrDefault(e => e % 6 === 0), 36);
        t.isEqual(base.lastOrDefault(e => e === 11811), undefined);
    }

    function single(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.single());

        base = Enumerable.fromSource([33]);
        t.isEqual(base.single(), 33);

        base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.single());
        t.throwsException(() => base.single(e => e > 5));
        t.isEqual(base.single(e => e > 60), 65);
        t.isEqual(base.single(e => e % 6 === 0), 36);
        t.throwsException(() => base.single(e => e === 11811));
    }

    function singleOrDefault(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.isEqual(base.singleOrDefault(), undefined);

        base = Enumerable.fromSource([33]);
        t.isEqual(base.singleOrDefault(), 33);

        base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.singleOrDefault());
        t.throwsException(() => base.singleOrDefault(e => e > 5));
        t.isEqual(base.singleOrDefault(e => e > 60), 65);
        t.isEqual(base.singleOrDefault(e => e % 6 === 0), 36);
        t.isEqual(base.singleOrDefault(e => e === 11811), undefined);
    }

    function distinct(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.isArrayEqual(base.distinct().toArray(), []);

        base = Enumerable.fromSource([-5, 6, 2, 6, 99, 0, -5, 2, 7, 2, 0]);
        t.isArrayEqual(base.distinct().toArray(), [-5, 6, 2, 99, 0, 7]);

        let withKey = Enumerable.empty<string>();
        t.isArrayEqual(withKey.distinct(x => x).toArray(), []);

        withKey = Enumerable.fromSource(["a", "b", "aba", "ce", "wea", "baba", "era", "eaa"]);
        t.isArrayEqual(withKey.distinct(e => e[0]).toArray(), ["a", "b", "ce", "wea", "era"]);
    }

    function min(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.min());

        base = Enumerable.fromSource([2]);
        t.isEqual(base.min(), 2);

        base = Enumerable.fromSource([3, 4, -8, 77, 1]);
        t.isEqual(base.min(), -8);

        const strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
        t.isEqual(strbase.min(), "are");
        t.isEqual(strbase.min(e => e[0]), "a");
        t.isEqual(strbase.min(e => e[1]), "e");
    }

    function max(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.max());

        base = Enumerable.fromSource([2]);
        t.isEqual(base.max(), 2);

        base = Enumerable.fromSource([3, 4, -8, 77, 1]);
        t.isEqual(base.max(), 77);

        const strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
        t.isEqual(strbase.max(), "you");
        t.isEqual(strbase.max(e => e[0]), "y");
        t.isEqual(strbase.max(e => e[1]), "v");
    }

    function average(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.average(e => e));

        base = Enumerable.fromSource([2]);
        t.isEqual(base.average(e => e), 2);

        base = Enumerable.fromSource([3, 4, -2, 79, 1]);
        t.isEqual(base.average(e => e), 17);

        const strbase = Enumerable.fromSource(["112", "432", "46"]);
        t.isEqual(strbase.average(e => parseInt(e[0])), 3);
    }

    function sum(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.sum());

        base = Enumerable.fromSource([2]);
        t.isEqual(base.sum(), 2);

        base = Enumerable.fromSource([3, 4, -20, 1]);
        t.isEqual(base.sum(), -12);

        const strbase = Enumerable.fromSource(["hello", " ", "ivan"]);
        t.isEqual(strbase.sum(), "hello ivan");
        t.isEqual(strbase.sum(e => e[0]), "h i");
    }

    function skip(t: Test): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.skip(-666));

        const y = base.skip(0).toArray();

        t.isArrayEqual(base.skip(0).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);

        const x = base.skip(1).toArray();

        t.isArrayEqual(x, [4, 65, 32, 1, 36, 7, 2]);
        t.isArrayEqual(base.skip(6).toArray(), [7, 2]);
    }

    function take(t: Test): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.take(-666));

        t.isArrayEqual(base.take(0).toArray(), [] as number[]);
        t.isArrayEqual(base.take(1).toArray(), [-2]);
        t.isArrayEqual(base.take(6).toArray(), [-2, 4, 65, 32, 1, 36]);
    }

    function skipTake(t: Test): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);

        t.isArrayEqual(base.skip(2).take(2).toArray(), [65, 32]);
        t.isArrayEqual(base.skip(7).take(5).toArray(), [2]);
    }

    function forEach(t: Test): void
    {
        const base = Enumerable.fromSource([1, 2, 3]);
        const iterated: number[] = [];

        base.forEach(e =>
        {
            iterated.push(e);
        });

        t.isArrayEqual(base.toArray(), iterated);

        // Check inmutablility

        const original = base.toArray();

        base.forEach(e =>
        {
            e = e + 1;
        });

        t.isArrayEqual(base.toArray(), original);

        // With indices

        const indices: number[] = [];

        base.forEach((e, i) =>
        {
            indices.push(e + i);
        });

        t.isArrayEqual(indices, [1, 3, 5]);
    }

    function elementAt(t: Test): void
    {
        const base = Enumerable.fromSource([1, 2, 3, 4]);

        t.throwsException(() =>
        {
            const e = base.elementAt(-2);
        });

        t.isEqual(base.elementAt(0), 1);
        t.isEqual(base.elementAt(1), 2);
        t.isEqual(base.elementAt(2), 3);
        t.isEqual(base.elementAt(3), 4);

        t.throwsException(() =>
        {
            const e = base.elementAt(4);
        });

        t.throwsException(() =>
        {
            const e = base.elementAt(5);
        });
    }

    function elementAtOrDefault(t: Test): void
    {
        const base = Enumerable.fromSource([1, 2, 3, 4]);

        t.throwsException(() =>
        {
            const e = base.elementAtOrDefault(-2);
        });

        t.isEqual(base.elementAtOrDefault(0), 1);
        t.isEqual(base.elementAtOrDefault(1), 2);
        t.isEqual(base.elementAtOrDefault(2), 3);
        t.isEqual(base.elementAtOrDefault(3), 4);
        t.isEqual(base.elementAtOrDefault(4), undefined);
        t.isEqual(base.elementAtOrDefault(5), undefined);
    }

    function union(t: Test): void
    {
        let base = Enumerable.fromSource([1, 2, 3, 4]);
        let base2 = Enumerable.fromSource([2, 5, 1, 7]);
        t.isArrayEqual(base.union(base2).toArray(), [1, 2, 3, 4, 5, 7]);

        base2 = Enumerable.fromSource([]);
        t.isArrayEqual(base.union(base2).toArray(), [1, 2, 3, 4]);

        base = Enumerable.fromSource([]);
        t.isArrayEqual(base.union(base2).toArray(), []);
    }

    function except(t: Test): void
    {
        let base = Enumerable.fromSource([1, 2, 3, 4]);
        let base2 = Enumerable.fromSource([2, 5, 1, 7]);
        t.isArrayEqual(base.except(base2).toArray(), [3, 4]);

        base2 = Enumerable.fromSource([3, 6, 88]);
        t.isArrayEqual(base.except(base2).toArray(), [1, 2, 4]);

        base2 = Enumerable.fromSource([]);
        t.isArrayEqual(base.except(base2).toArray(), [1, 2, 3, 4]);

        base = Enumerable.fromSource([]);
        t.isArrayEqual(base.except(base2).toArray(), []);
    }
}
