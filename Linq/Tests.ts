import { ArrayIterator, StringIterator, Enumerable } from "./Linq";
import { Test } from "../Testing/UnitTest"

export module UnitTests
{
    export function run(): void
    {
        //console.log(`<meta http-equiv="refresh" content="1" />`);

        Test.run("array iterator", arrayIterator);
        Test.run("enumerable", enumerable);
        Test.run("empty", empty);
        Test.run("range", range);
        Test.run("repeat", repeat);
        Test.run("toArray", toArray);
        Test.run("reverse", reverse);
        Test.run("concat", concat);
        Test.run("aggregate", aggregate);
        Test.run("count", count);
        Test.run("any", any);
        Test.run("all", all);
        Test.run("contains", contains);
        Test.run("where", where);
        Test.run("select", select);
        Test.run("first", first);
        Test.run("firstOrDefault", firstOrDefault);
        Test.run("last", last);
        Test.run("lastOrDefault", lastOrDefault);
        Test.run("single", single);
        Test.run("singleOrDefault", singleOrDefault);
        Test.run("distinct", distinct);
        Test.run("min", min);
        Test.run("max", max);
        Test.run("average", average);
        Test.run("sum", sum);
        Test.run("skip", skip);
        Test.run("take", take);
        Test.run("skip + take", skipTake);
    }

    function empty(t: Test): void
    {
        const base = Enumerable.empty<number>();
        t.arrayEquals(base.toArray(), [] as Array<number>);
    }

    function range(t: Test): void
    {
        t.throwsException(() => Enumerable.range(0, -1));
        t.throwsException(() => Enumerable.range(5, -666));

        let base = Enumerable.range(0, 0);
        t.arrayEquals(base.toArray(), [] as Array<number>);

        base = Enumerable.range(4, 0);
        t.arrayEquals(base.toArray(), [] as Array<number>);

        base = Enumerable.range(2, 3);
        t.arrayEquals(base.toArray(), [2, 3, 4]);

        base = Enumerable.range(-2, 4);
        t.arrayEquals(base.toArray(), [-2, -1, 0, 1]);

        base = Enumerable.range(0, 6);
        t.arrayEquals(base.toArray(), [0, 1, 2, 3, 4, 5]);
    }

    function repeat(t: Test): void
    {
        t.throwsException(() => Enumerable.repeat(0, -1));
        t.throwsException(() => Enumerable.repeat(5, -60));
        t.throwsException(() => Enumerable.repeat(-5, -1));

        let base = Enumerable.repeat(3, 0);
        t.arrayEquals(base.toArray(), [] as Array<number>);

        base = Enumerable.repeat(3, 4);
        t.arrayEquals(base.toArray(), [3, 3, 3, 3]);

        let baseString = Enumerable.repeat("a", 0);
        t.arrayEquals(baseString.toArray(), [] as Array<string>);

        baseString = Enumerable.repeat("a", 2);
        t.arrayEquals(baseString.toArray(), ["a", "a"]);
    }

    function arrayIterator(t: Test): void
    {
        let i = new ArrayIterator<number>([]);
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = new ArrayIterator<number>([2, 4, 6]);
        t.isTrue(i.next());
        t.equals(i.value(), 2);
        t.isTrue(i.next());
        t.equals(i.value(), 4);
        t.isTrue(i.next());
        t.equals(i.value(), 6);
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
        t.equals(i.value(), 2);
        t.isTrue(i.next());
        t.equals(i.value(), 4);
        t.isTrue(i.next());
        t.equals(i.value(), 6);
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(Enumerable.fromSource(new ArrayIterator<number>([])));
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(Enumerable.fromSource([2, 4, 6]));
        t.isTrue(i.next());
        t.equals(i.value(), 2);
        t.isTrue(i.next());
        t.equals(i.value(), 4);
        t.isTrue(i.next());
        t.equals(i.value(), 6);
        t.isFalse(i.next());
        t.throwsException(() => i.value());
    }

    function toArray(t: Test): void
    {
        const base = [1, 2, 3, 4];
        const baseEnumerable = Enumerable.fromSource(base);
        const baseArray = baseEnumerable.toArray(); // Copy of `base`

        t.arrayEquals(base, baseArray);

        base.push(5);
        t.arrayEquals([1, 2, 3, 4], baseArray);

        let source: Array<number> = [];
        let i = Enumerable.fromSource(new ArrayIterator(source));
        t.arrayEquals(i.toArray(), source);

        source = [1, 2, 3];
        i = Enumerable.fromSource(new ArrayIterator(source));
        t.arrayEquals(i.toArray(), source);

        let strSource = ["asd", "asdaa"];
        let strI = Enumerable.fromSource(new ArrayIterator(strSource));
        t.arrayEquals(strI.toArray(), strSource);

        let str = "asdasdsad";
        let strI2 = Enumerable.fromSource(new StringIterator(str));
        t.arrayEquals(strI2.toArray(), str.split(""));
    }

    function reverse(t: Test): void
    {
        const baseEnumerable = Enumerable.fromSource([1, 2, 3, 4]);
        const baseEnumerableReversed = baseEnumerable.reverse();

        t.arrayEquals([1, 2, 3, 4], baseEnumerable.toArray());
        t.arrayEquals([4, 3, 2, 1], baseEnumerableReversed.toArray());
    }

    function concat(t: Test): void
    {
        const base0 = Enumerable.fromSource([1, 2]);
        const base1 = Enumerable.fromSource([3, 4]);
        const result = base0.concat(base1);

        t.arrayEquals([1, 2], base0.toArray());
        t.arrayEquals([3, 4], base1.toArray());
        t.arrayEquals([1, 2, 3, 4], result.toArray());
    }

    function aggregate(t: Test): void
    {
        let base = Enumerable.fromSource([] as Array<string>);
        t.throwsException(() => base.aggregate((p, c) => c));

        base = Enumerable.fromSource(["a", "b", "a", "a"]);
        t.equals(base.aggregate((p, c) => p === "b" ? p : c), "b");
        t.equals(base.aggregate((p, c) => 33, 2), 33);
        t.isTrue(base.aggregate<boolean>((p, c) => p || c === "b", false));
        t.isTrue(base.aggregate<boolean>((p, c) => p || c === "a", false));
        t.isFalse(base.aggregate<boolean>((p, c) => p || c === "x", false));
        t.isTrue(base.aggregate<boolean>((p, c) => p || c === "x", true));
    }

    function count(t: Test): void
    {
        let source: Array<number> = [];
        let i = Enumerable.fromSource(new ArrayIterator(source));
        t.equals(i.count(), source.length);

        source = [1, 2, 3];
        i = Enumerable.fromSource(new ArrayIterator(source));
        t.equals(i.count(), source.length);

        let strSource = ["asd", "asdaa"];
        let strI = Enumerable.fromSource(new ArrayIterator(strSource));
        t.equals(strI.count(), strSource.length);

        let str = "asdasdsad";
        let strI2 = Enumerable.fromSource(new StringIterator(str));
        t.equals(strI2.count(), str.split("").length);

        let base = Enumerable.fromSource([1, 2, 41, 668, 7]);
        t.equals(base.count(e => e % 2 !== 0), 3);
        t.equals(base.count(e => e % 2 === 0), 2);
        t.equals(base.count((e) => e > 50), 1);
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
        t.equals(onlyYoung.count(), 2);
        t.arrayEquals(onlyYoung.toArray(), [21, 20]);

        const sooooOld = base.where(e => e > 90);
        t.equals(sooooOld.count(), 0);

        let i = Enumerable.fromSource([1, 2, 3, 4, 5, 6, 7, 8]);
        i = i.where(e => e % 2 === 0);
        t.isTrue(i.next());
        t.equals(i.value(), 2);
        t.isTrue(i.next());
        t.equals(i.value(), 4);
        t.isTrue(i.next());
        t.equals(i.value(), 6);
        t.isTrue(i.next());
        t.equals(i.value(), 8);
        t.isFalse(i.next());
        t.throwsException(() => i.value());

        i = Enumerable.fromSource(new ArrayIterator<number>([1, 2, 3, 4, 5, 6, 7, 8]));
        i = i.where(e => e % 2 === 0);
        i = i.where(e => e < 5);
        t.isTrue(i.next());
        t.equals(i.value(), 2);
        t.isTrue(i.next());
        t.equals(i.value(), 4);
        t.isFalse(i.next());
        t.throwsException(() => i.value());
    }

    function select(t: Test): void
    {
        const base = Enumerable.fromSource(["pepin", "sanz", "macheta", "cea"]);
        const lengths = base.select(e => e.length);

        t.arrayEquals(lengths.toArray(), [5, 4, 7, 3]);

        let i = Enumerable.fromSource([1, 2, 3]);
        let names = i.select(e => "name" + e);
        t.isTrue(names.next());
        t.equals(names.value(), "name1");
        t.isTrue(names.next());
        t.equals(names.value(), "name2");
        i.next();
        i.next();
        i.next();
        t.isTrue(names.next());
        t.equals(names.value(), "name3");
        t.isFalse(names.next());
        t.throwsException(() => names.value());
    }

    function first(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.first());

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.equals(base.first(), -2);
        t.equals(base.first(e => e > 5), 65);
        t.equals(base.first(e => e % 6 === 0), 42);
        t.throwsException(() => base.first(e => e === 11811));
    }

    function firstOrDefault(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.equals(base.firstOrDefault(), undefined);

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.equals(base.firstOrDefault(), -2);
        t.equals(base.firstOrDefault(e => e > 5), 65);
        t.equals(base.firstOrDefault(e => e % 6 === 0), 42);
        t.equals(base.firstOrDefault(e => e === 11811), undefined);
    }

    function last(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.last());

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.equals(base.last(), 2);
        t.equals(base.last(e => e > 5), 7);
        t.equals(base.last(e => e % 6 === 0), 36);
        t.throwsException(() => base.last(e => e === 11811));
    }

    function lastOrDefault(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.equals(base.lastOrDefault(), undefined);

        base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
        t.equals(base.lastOrDefault(), 2);
        t.equals(base.lastOrDefault(e => e > 5), 7);
        t.equals(base.lastOrDefault(e => e % 6 === 0), 36);
        t.equals(base.lastOrDefault(e => e === 11811), undefined);
    }

    function single(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.single());

        base = Enumerable.fromSource([33]);
        t.equals(base.single(), 33);

        base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.single());
        t.throwsException(() => base.single(e => e > 5));
        t.equals(base.single(e => e > 60), 65);
        t.equals(base.single(e => e % 6 === 0), 36);
        t.throwsException(() => base.single(e => e === 11811));
    }

    function singleOrDefault(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.equals(base.singleOrDefault(), undefined);

        base = Enumerable.fromSource([33]);
        t.equals(base.singleOrDefault(), 33);

        base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.singleOrDefault());
        t.throwsException(() => base.singleOrDefault(e => e > 5));
        t.equals(base.singleOrDefault(e => e > 60), 65);
        t.equals(base.singleOrDefault(e => e % 6 === 0), 36);
        t.equals(base.singleOrDefault(e => e === 11811), undefined);
    }

    function distinct(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.arrayEquals(base.distinct().toArray(), []);

        base = Enumerable.fromSource([-5, 6, 2, 6, 99, 0, -5, 2, 7, 2, 0]);
        t.arrayEquals(base.distinct().toArray(), [-5, 6, 2, 99, 0, 7]);
    }

    function min(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.min());

        base = Enumerable.fromSource([2]);
        t.equals(base.min(), 2);

        base = Enumerable.fromSource([3, 4, -8, 77, 1]);
        t.equals(base.min(), -8);

        let strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
        t.equals(strbase.min(), "are");
        t.equals(strbase.min(e => e[0]), "a");
        t.equals(strbase.min(e => e[1]), "e");
    }

    function max(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.max());

        base = Enumerable.fromSource([2]);
        t.equals(base.max(), 2);

        base = Enumerable.fromSource([3, 4, -8, 77, 1]);
        t.equals(base.max(), 77);

        let strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
        t.equals(strbase.max(), "you");
        t.equals(strbase.max(e => e[0]), "y");
        t.equals(strbase.max(e => e[1]), "v");
    }

    function average(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.average(e => e));

        base = Enumerable.fromSource([2]);
        t.equals(base.average(e => e), 2);

        base = Enumerable.fromSource([3, 4, -2, 79, 1]);
        t.equals(base.average(e => e), 17);

        let strbase = Enumerable.fromSource(["112", "432", "46"]);
        t.equals(strbase.average(e => parseInt(e[0])), 3);
    }

    function sum(t: Test): void
    {
        let base = Enumerable.empty<number>();
        t.throwsException(() => base.sum());

        base = Enumerable.fromSource([2]);
        t.equals(base.sum(), 2);

        base = Enumerable.fromSource([3, 4, -20, 1]);
        t.equals(base.sum(), -12);

        let strbase = Enumerable.fromSource(["hello", " ", "ivan"]);
        t.equals(strbase.sum(), "hello ivan");
        t.equals(strbase.sum(e => e[0]), "h i");
    }

    function skip(t: Test): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.skip(-666));

        const y = base.skip(0).toArray();

        t.arrayEquals(base.skip(0).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);

        const x = base.skip(1).toArray();

        t.arrayEquals(x, [4, 65, 32, 1, 36, 7, 2]);
        t.arrayEquals(base.skip(6).toArray(), [7, 2]);
    }

    function take(t: Test): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
        t.throwsException(() => base.take(-666));

        t.arrayEquals(base.take(0).toArray(), [] as Array<number>);
        t.arrayEquals(base.take(1).toArray(), [-2]);
        t.arrayEquals(base.take(6).toArray(), [-2, 4, 65, 32, 1, 36]);
    }

    function skipTake(t: Test): void
    {
        const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);

        t.arrayEquals(base.skip(2).take(2).toArray(), [65, 32]);
        t.arrayEquals(base.skip(7).take(5).toArray(), [2]);
    }
}
