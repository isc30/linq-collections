/// <reference path="Iterators/ArrayIterator.ts" />
/// <reference path="Iterators/StringIterator.ts" />
/// <reference path="Enumerables/Enumerable.ts" />
"use strict";

namespace Linq
{
    module Assert
    {
        export function check(result: boolean)
        {
            if (!result)
            {
                throw new Error("Assertion failed");
            }
        }

        export function throwsException(call: () => void)
        {
            try
            {
                call();
            }
            catch (ex)
            {
                return;
            }

            throw new Error("Exception was expected");
        }

        export function isArrayEqual<T>(left: Array<T>, right: Array<T>): boolean
        {
            return left.length === right.length
                && left.every((e: T, i: number) => e === right[i]);
        }

        export function isEqual(left: any, right: any): boolean
        {
            return left === right;
        }
    }

    export module UnitTests
    {
        export function run(): void
        {
            document.write(`<meta http-equiv="refresh" content="1" />`);

            runTest("array iterator", arrayIterator);
            runTest("enumerable", enumerable);
            runTest("empty", empty);
            runTest("range", range);
            runTest("repeat", repeat);
            runTest("toArray", toArray);
            runTest("reverse", reverse);
            runTest("concat", concat);
            runTest("aggregate", aggregate);
            runTest("count", count);
            runTest("any", any);
            runTest("all", all);
            runTest("contains", contains);
            runTest("where", where);
            runTest("select", select);
            runTest("first", first);
            runTest("firstOrDefault", firstOrDefault);
            runTest("last", last);
            runTest("lastOrDefault", lastOrDefault);
            runTest("single", single);
            runTest("singleOrDefault", singleOrDefault);
            runTest("distinct", distinct);
            runTest("min", min);
            runTest("max", max);
            runTest("average", average);
            runTest("sum", sum);
            runTest("skip", skip);
            runTest("take", take);
        }

        function runTest(testName: string, testMethod: () => void)
        {
            try
            {
                testMethod();
                document.write(`<span style="color:green">${testName} &#10004;</span><br/>`);
            }
            catch (exception)
            {
                document.write(`<span style="color:red">${testName} &#10006;</span><br/>`);
            }
        }

        function empty(): void
        {
            const base = Enumerable.empty<number>();
            Assert.check(Assert.isArrayEqual(base.toArray(), [] as Array<number>));
        }

        function range(): void
        {
            Assert.throwsException(() => Enumerable.range(0, -1));
            Assert.throwsException(() => Enumerable.range(5, -666));

            let base = Enumerable.range(0, 0);
            Assert.check(Assert.isArrayEqual(base.toArray(), [] as Array<number>));

            base = Enumerable.range(4, 0);
            Assert.check(Assert.isArrayEqual(base.toArray(), [] as Array<number>));

            base = Enumerable.range(2, 3);
            Assert.check(Assert.isArrayEqual(base.toArray(), [2, 3, 4]));

            base = Enumerable.range(-2, 4);
            Assert.check(Assert.isArrayEqual(base.toArray(), [-2, -1, 0, 1]));

            base = Enumerable.range(0, 6);
            Assert.check(Assert.isArrayEqual(base.toArray(), [0, 1, 2, 3, 4, 5]));
        }

        function repeat(): void
        {
            Assert.throwsException(() => Enumerable.repeat(0, -1));
            Assert.throwsException(() => Enumerable.repeat(5, -60));
            Assert.throwsException(() => Enumerable.repeat(-5, -1));

            let base = Enumerable.repeat(3, 0);
            Assert.check(Assert.isArrayEqual(base.toArray(), [] as Array<number>));

            base = Enumerable.repeat(3, 4);
            Assert.check(Assert.isArrayEqual(base.toArray(), [3, 3, 3, 3]));

            let baseString = Enumerable.repeat("a", 0);
            Assert.check(Assert.isArrayEqual(baseString.toArray(), [] as Array<string>));

            baseString = Enumerable.repeat("a", 2);
            Assert.check(Assert.isArrayEqual(baseString.toArray(), ["a", "a"]));
        }

        function arrayIterator(): void
        {
            let i = new ArrayIterator<number>([]);
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());

            i = new ArrayIterator<number>([2, 4, 6]);
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 2));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 4));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 6));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());
        }

        function enumerable(): void
        {
            let i = Enumerable.fromSource(new ArrayIterator<number>([]));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());

            i = Enumerable.fromSource(new ArrayIterator<number>([2, 4, 6]));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 2));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 4));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 6));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());

            i = Enumerable.fromSource(Enumerable.fromSource(new ArrayIterator<number>([])));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());

            i = Enumerable.fromSource(Enumerable.fromSource([2, 4, 6]));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 2));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 4));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 6));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());
        }

        function toArray(): void
        {
            const base = [1, 2, 3, 4];
            const baseEnumerable = Enumerable.fromSource(base);
            const baseArray = baseEnumerable.toArray(); // Copy of `base`

            Assert.check(Assert.isArrayEqual(base, baseArray));

            base.push(5);
            Assert.check(Assert.isArrayEqual([1, 2, 3, 4], baseArray));

            let source: Array<number> = [];
            let i = Enumerable.fromSource(new ArrayIterator(source));
            Assert.check(Assert.isArrayEqual(i.toArray(), source));

            source = [1, 2, 3];
            i = Enumerable.fromSource(new ArrayIterator(source));
            Assert.check(Assert.isArrayEqual(i.toArray(), source));

            let strSource = ["asd", "asdaa"];
            let strI = Enumerable.fromSource(new ArrayIterator(strSource));
            Assert.check(Assert.isArrayEqual(strI.toArray(), strSource));

            let str = "asdasdsad";
            let strI2 = Enumerable.fromSource(new StringIterator(str));
            Assert.check(Assert.isArrayEqual(strI2.toArray(), str.split("")));
        }

        function reverse(): void
        {
            throw new Error("NOPE");

            /*const baseEnumerable = Enumerable.fromSource([1, 2, 3, 4]);
            const baseEnumerableReversed = baseEnumerable.reverse();

            Assert.check(Assert.isArrayEqual([1, 2, 3, 4], baseEnumerable.toArray()));
            Assert.check(Assert.isArrayEqual([4, 3, 2, 1], baseEnumerableReversed.toArray()));*/
        }

        function concat(): void
        {
            const base0 = Enumerable.fromSource([1, 2]);
            const base1 = Enumerable.fromSource([3, 4]);
            const result = base0.concat(base1);

            Assert.check(Assert.isArrayEqual([1, 2], base0.toArray()));
            Assert.check(Assert.isArrayEqual([3, 4], base1.toArray()));
            Assert.check(Assert.isArrayEqual([1, 2, 3, 4], result.toArray()));
        }

        function aggregate(): void
        {
            let base = Enumerable.fromSource([] as Array<string>);
            Assert.throwsException(() => base.aggregate((p, c) => c));

            base = Enumerable.fromSource(["a", "b", "a", "a"]);
            Assert.check(Assert.isEqual(base.aggregate((p, c) => p === "b" ? p : c), "b"));
            Assert.check(Assert.isEqual(base.aggregate((p, c) => 33, 2), 33));
            Assert.check(Assert.isEqual(base.aggregate<boolean>((p, c) => p || c === "b", false), true));
            Assert.check(Assert.isEqual(base.aggregate<boolean>((p, c) => p || c === "a", false), true));
            Assert.check(Assert.isEqual(base.aggregate<boolean>((p, c) => p || c === "x", false), false));
            Assert.check(Assert.isEqual(base.aggregate<boolean>((p, c) => p || c === "x", true), true));
        }

        function count(): void
        {
            let source: Array<number> = [];
            let i = Enumerable.fromSource(new ArrayIterator(source));
            Assert.check(Assert.isEqual(i.count(), source.length));

            source = [1, 2, 3];
            i = Enumerable.fromSource(new ArrayIterator(source));
            Assert.check(Assert.isEqual(i.count(), source.length));

            let strSource = ["asd", "asdaa"];
            let strI = Enumerable.fromSource(new ArrayIterator(strSource));
            Assert.check(Assert.isEqual(strI.count(), strSource.length));

            let str = "asdasdsad";
            let strI2 = Enumerable.fromSource(new StringIterator(str));
            Assert.check(Assert.isEqual(strI2.count(), str.split("").length));

            let base = Enumerable.fromSource([1, 2, 41, 668, 7]);
            Assert.check(Assert.isEqual(base.count(e => e % 2 !== 0), 3));
            Assert.check(Assert.isEqual(base.count(e => e % 2 === 0), 2));
            Assert.check(Assert.isEqual(base.count((e) => e > 50), 1));
        }

        function any(): void
        {
            let base = Enumerable.empty<string>();
            Assert.check(!base.any());

            base = Enumerable.fromSource(["lol"]);
            Assert.check(base.any());

            // With predicate
            base = Enumerable.fromSource(["a", "av", "abc", "x"]);

            Assert.check(base.any(e => e.length > 2));
            Assert.check(base.any(e => e[0] === "a"));
            Assert.check(!base.any(e => e[0] === "b"));
            Assert.check(!base.any(e => e.length > 5));
            Assert.check(!base.any(e => e.length === 0));
            Assert.check(base.any(e => e.length === 1));
        }

        function all(): void
        {
            let base = Enumerable.empty<string>();
            Assert.check(base.all(e => true));

            base = Enumerable.fromSource(["lol"]);
            Assert.check(base.all(e => e[0] === "l"));

            base = Enumerable.fromSource(["a", "av", "abc"]);
            Assert.check(base.all(e => e.length > 0));
            Assert.check(base.all(e => e[0] === "a"));

            base = Enumerable.fromSource(["a", "av", "abc", "xd"]);
            Assert.check(!base.all(e => e[0] === "a"));

            base = Enumerable.fromSource(["a", "av", "abc", "xd", ""]);
            Assert.check(!base.all(e => e.length > 0));
        }

        function contains(): void
        {
            const base = Enumerable.fromSource([1, 2, 4]);

            Assert.check(base.contains(1));
            Assert.check(base.contains(2));
            Assert.check(!base.contains(3));
            Assert.check(base.contains(4));
            Assert.check(!base.contains(7));
        }

        function where(): void
        {
            const base = Enumerable.fromSource([39, 21, 66, 20]);

            const onlyYoung = base.where(e => e < 30);
            Assert.check(Assert.isEqual(onlyYoung.count(), 2));
            Assert.check(Assert.isArrayEqual(onlyYoung.toArray(), [21, 20]));

            const sooooOld = base.where(e => e > 90);
            Assert.check(Assert.isEqual(sooooOld.count(), 0));

            let i = Enumerable.fromSource([1, 2, 3, 4, 5, 6, 7, 8]);
            i = i.where(e => e % 2 === 0);
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 2));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 4));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 6));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 8));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());

            i = Enumerable.fromSource(new ArrayIterator<number>([1, 2, 3, 4, 5, 6, 7, 8]));
            i = i.where(e => e % 2 === 0);
            i = i.where(e => e < 5);
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 2));
            Assert.check(Assert.isEqual(i.next(), true));
            Assert.check(Assert.isEqual(i.value(), 4));
            Assert.check(Assert.isEqual(i.next(), false));
            Assert.throwsException(() => i.value());
        }

        function select(): void
        {
            const base = Enumerable.fromSource(["pepin", "sanz", "macheta", "cea"]);
            const lengths = base.select(e => e.length);

            Assert.check(Assert.isArrayEqual(lengths.toArray(), [5, 4, 7, 3]));

            let i = Enumerable.fromSource([1, 2, 3]);
            let names = i.select(e => "name" + e);
            Assert.check(Assert.isEqual(names.next(), true));
            Assert.check(Assert.isEqual(names.value(), "name1"));
            Assert.check(Assert.isEqual(names.next(), true));
            Assert.check(Assert.isEqual(names.value(), "name2"));
            i.next();
            i.next();
            i.next();
            Assert.check(Assert.isEqual(names.next(), true));
            Assert.check(Assert.isEqual(names.value(), "name3"));
            Assert.check(Assert.isEqual(names.next(), false));
            Assert.throwsException(() => names.value());
        }

        function first(): void
        {
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.first());

            base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Assert.check(Assert.isEqual(base.first(), -2));
            Assert.check(Assert.isEqual(base.first(e => e > 5), 65));
            Assert.check(Assert.isEqual(base.first(e => e % 6 === 0), 42));
            Assert.throwsException(() => base.first(e => e === 11811));
        }

        function firstOrDefault(): void
        {
            let base = Enumerable.empty<number>();
            Assert.check(Assert.isEqual(base.firstOrDefault(), undefined));

            base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Assert.check(Assert.isEqual(base.firstOrDefault(), -2));
            Assert.check(Assert.isEqual(base.firstOrDefault(e => e > 5), 65));
            Assert.check(Assert.isEqual(base.firstOrDefault(e => e % 6 === 0), 42));
            Assert.check(Assert.isEqual(base.firstOrDefault(e => e === 11811), undefined));
        }

        function last(): void
        {
            throw new Error("NOPE");

            /*
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.last());

            base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Assert.check(Assert.isEqual(base.last(), 2));
            Assert.check(Assert.isEqual(base.last(e => e > 5), 7));
            Assert.check(Assert.isEqual(base.last(e => e % 6 === 0), 36));
            Assert.throwsException(() => base.last(e => e === 11811));*/
        }

        function lastOrDefault(): void
        {
            throw new Error("NOPE");

            /*
            let base = Enumerable.empty<number>();
            Assert.check(Assert.isEqual(base.lastOrDefault(), undefined));

            base = Enumerable.fromSource([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Assert.check(Assert.isEqual(base.lastOrDefault(), 2));
            Assert.check(Assert.isEqual(base.lastOrDefault(e => e > 5), 7));
            Assert.check(Assert.isEqual(base.lastOrDefault(e => e % 6 === 0), 36));
            Assert.check(Assert.isEqual(base.lastOrDefault(e => e === 11811), undefined));*/
        }

        function single(): void
        {
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.single());

            base = Enumerable.fromSource([33]);
            Assert.check(Assert.isEqual(base.single(), 33));

            base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
            Assert.throwsException(() => base.single());
            Assert.throwsException(() => base.single(e => e > 5));
            Assert.check(Assert.isEqual(base.single(e => e > 60), 65));
            Assert.check(Assert.isEqual(base.single(e => e % 6 === 0), 36));
            Assert.throwsException(() => base.single(e => e === 11811));
        }

        function singleOrDefault(): void
        {
            let base = Enumerable.empty<number>();
            Assert.check(Assert.isEqual(base.singleOrDefault(), undefined));

            base = Enumerable.fromSource([33]);
            Assert.check(Assert.isEqual(base.singleOrDefault(), 33));

            base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);
            Assert.throwsException(() => base.singleOrDefault());
            Assert.throwsException(() => base.singleOrDefault(e => e > 5));
            Assert.check(Assert.isEqual(base.singleOrDefault(e => e > 60), 65));
            Assert.check(Assert.isEqual(base.singleOrDefault(e => e % 6 === 0), 36));
            Assert.check(Assert.isEqual(base.singleOrDefault(e => e === 11811), undefined));
        }

        function distinct(): void
        {
            throw new Error("NOPE");

            /*
            const base = Enumerable.fromSource([-5, 6, 2, 6, 99, 0, -5, 2, 7, 2, 0]);
            Assert.check(Assert.isArrayEqual(base.distinct().toArray(), [-5, 6, 2, 99, 0, 7]));*/
        }

        function min(): void
        {
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.min());

            base = Enumerable.fromSource([2]);
            Assert.check(Assert.isEqual(base.min(), 2));

            base = Enumerable.fromSource([3, 4, -8, 77, 1]);
            Assert.check(Assert.isEqual(base.min(), -8));

            let strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
            Assert.check(Assert.isEqual(strbase.min(), "are"));
            Assert.check(Assert.isEqual(strbase.min(e => e[0]), "a"));
            Assert.check(Assert.isEqual(strbase.min(e => e[1]), "e"));
        }

        function max(): void
        {
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.max());

            base = Enumerable.fromSource([2]);
            Assert.check(Assert.isEqual(base.max(), 2));

            base = Enumerable.fromSource([3, 4, -8, 77, 1]);
            Assert.check(Assert.isEqual(base.max(), 77));

            let strbase = Enumerable.fromSource(["hello", "ivan", "how", "are", "you"]);
            Assert.check(Assert.isEqual(strbase.max(), "you"));
            Assert.check(Assert.isEqual(strbase.max(e => e[0]), "y"));
            Assert.check(Assert.isEqual(strbase.max(e => e[1]), "v"));
        }

        function average(): void
        {
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.average(e => e));

            base = Enumerable.fromSource([2]);
            Assert.check(Assert.isEqual(base.average(e => e), 2));

            base = Enumerable.fromSource([3, 4, -2, 79, 1]);
            Assert.check(Assert.isEqual(base.average(e => e), 17));

            let strbase = Enumerable.fromSource(["112", "432", "46"]);
            Assert.check(Assert.isEqual(strbase.average(e => parseInt(e[0])), 3));
        }

        function sum(): void
        {
            let base = Enumerable.empty<number>();
            Assert.throwsException(() => base.sum());

            base = Enumerable.fromSource([2]);
            Assert.check(Assert.isEqual(base.sum(), 2));

            base = Enumerable.fromSource([3, 4, -20, 1]);
            Assert.check(Assert.isEqual(base.sum(), -12));

            let strbase = Enumerable.fromSource(["hello", " ", "ivan"]);
            Assert.check(Assert.isEqual(strbase.sum(), "hello ivan"));
            Assert.check(Assert.isEqual(strbase.sum(e => e[0]), "h i"));
        }

        function skip(): void
        {
            throw new Error("NOPE");

            /*
            const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);

            Assert.throwsException(() => base.skip(-666));
            Assert.throwsException(() => base.skip(99999));

            Assert.check(Assert.isArrayEqual(base.skip(0).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]));
            Assert.check(Assert.isArrayEqual(base.skip(1).toArray(), [4, 65, 32, 1, 36, 7, 2]));
            Assert.check(Assert.isArrayEqual(base.skip(6).toArray(), [7, 2]));*/
        }

        function take(): void
        {
            throw new Error("NOPE");

            /*
            const base = Enumerable.fromSource([-2, 4, 65, 32, 1, 36, 7, 2]);

            Assert.throwsException(() => base.take(-666));
            Assert.throwsException(() => base.take(99999));

            Assert.check(Assert.isArrayEqual(base.take(0).toArray(), [] as Array<number>));
            Assert.check(Assert.isArrayEqual(base.take(1).toArray(), [-2]));
            Assert.check(Assert.isArrayEqual(base.take(6).toArray(), [-2, 4, 65, 32, 1, 36]));*/
        }
    }
}