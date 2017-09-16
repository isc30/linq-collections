import { Enumerable } from "../../src/Enumerables";
import { ArrayIterator, StringIterator } from "../../src/Iterators";
import { Test } from "../Test";

export namespace IEnumerableTests
{
    export function run(): void
    {
        describe("ToArray", toArray);
        describe("Aggregate", aggregate);
        describe("All", all);
        describe("Any", any);
        describe("Average", average);
        describe("Concat", concat);
        describe("Contains", contains);
        describe("Count", count);
        /*describe("Distinct", aggregate);
        describe("ElementAt", aggregate);
        describe("ElementAtOrDefault", aggregate);
        describe("Except", aggregate);
        describe("First", aggregate);
        describe("FirstOrDefault", aggregate);
        describe("ForEach", aggregate);
        describe("Last", aggregate);
        describe("LastOrDefault", aggregate);
        describe("Max", aggregate);
        describe("Min", aggregate);
        describe("Select", aggregate);
        describe("SelectMany", aggregate);
        describe("Single", aggregate);
        describe("SingleOrDefault", aggregate);
        describe("Skip", aggregate);
        describe("Sum", aggregate);
        describe("Take", aggregate);
        describe("Union", aggregate);
        describe("Where", aggregate);*/
    }

    function toArray(): void
    {
        it("Empty collection (base array)", () =>
        {
            Test.isArrayEqual(Enumerable.fromSource([]).toArray(), []);
        });

        const base = [1, 2, 3, 4];
        const baseEnumerable = Enumerable.fromSource(base);
        const baseToArray = baseEnumerable.toArray();

        it("Content is correct (base array)", () =>
        {
            Test.isArrayEqual(base, baseToArray);
        });

        it("Returns a copy, not a reference", () =>
        {
            base.push(5);
            Test.isArrayEqual([1, 2, 3, 4], baseToArray);
        });

        it("Empty collection (base iterator)", () =>
        {
            const source: number[] = [];
            const e = Enumerable.fromSource(new ArrayIterator(source));
            Test.isArrayEqual(e.toArray(), source);
        });

        it("Content is correct (base iterator)", () =>
        {
            const source = [1, 2, 3];
            const e = Enumerable.fromSource(new ArrayIterator(source));
            Test.isArrayEqual(e.toArray(), source);
        });

        it("Content is correct (base iterator of T)", () =>
        {
            const strSource = ["asd", "asdaa"];
            const strI = Enumerable.fromSource(new ArrayIterator(strSource));
            Test.isArrayEqual(strI.toArray(), strSource);
        });
    }

    function aggregate(): void
    {
        it("Exception if empty", () =>
        {
            const base = Enumerable.fromSource<number>([]);
            Test.throwsException(() => base.aggregate((p, c) => c));
        });

        it("No initial value", () =>
        {
            const base = Enumerable.fromSource(["a", "b", "a", "a"]);
            Test.isEqual(base.aggregate((p, c) => p === "b" ? p : c), "b");
            Test.isEqual(base.aggregate((p, c) => p !== undefined ? c + p : c), "aaba");
        });

        it("Custom initial value", () =>
        {
            const base = Enumerable.fromSource(["a", "b", "a", "a"]);
            Test.isEqual(base.aggregate((p, c) => p !== undefined ? c + p : c, "xd"), "aabaxd");
        });

        it("Custom return type", () =>
        {
            const base = Enumerable.fromSource(["a", "b", "a", "a"]);
            Test.isTrue(base.aggregate((p, c) => p || c === "b", false));
            Test.isTrue(base.aggregate((p, c) => p || c === "a", false));
            Test.isFalse(base.aggregate((p, c) => p || c === "x", false));
            Test.isTrue(base.aggregate((p, c) => p || c === "x", true));
        });
    }

    function all(): void
    {
        it("True if empty", () =>
        {
            const base = Enumerable.empty<string>();
            Test.isTrue(base.all(e => true));
            Test.isTrue(base.all(e => false));
        });

        it("Single element", () =>
        {
            const base = Enumerable.fromSource(["lol"]);
            Test.isTrue(base.all(e => e[0] === "l"));
            Test.isFalse(base.all(e => e[0] === "X"));
        });

        it("Multiple elements", () =>
        {
            const base = Enumerable.fromSource(["a", "av", "abc", "axd"]);
            Test.isTrue(base.all(e => e.length > 0));
            Test.isTrue(base.all(e => e[0] === "a"));
            Test.isTrue(base.all(e => e.length < 4));
            Test.isFalse(base.all(e => e.length > 1));
            Test.isFalse(base.all(e => e[1] === "v"));
            Test.isFalse(base.all(e => e.length < 2));
        });
    }

    function any(): void
    {
        it("False if empty", () =>
        {
            const base = Enumerable.empty<string>();
            Test.isFalse(base.any());
            Test.isFalse(base.any(e => true));
            Test.isFalse(base.any(e => false));
        });

        it("True if single element", () =>
        {
            const base = Enumerable.fromSource(["lol"]);
            Test.isTrue(base.any());
        });

        it("Predicate in single element", () =>
        {
            const base = Enumerable.fromSource(["lol"]);
            Test.isTrue(base.any(e => e[1] === "o"));
            Test.isFalse(base.any(e => e === "isc"));
        });

        it("Predicate in multiple elements", () =>
        {
            const base = Enumerable.fromSource(["a", "av", "abc", "x"]);

            Test.isTrue(base.any(e => e.length > 2));
            Test.isTrue(base.any(e => e[0] === "a"));
            Test.isTrue(base.any(e => e.length === 1));
            Test.isFalse(base.any(e => e[0] === "b"));
            Test.isFalse(base.any(e => e.length > 5));
            Test.isFalse(base.any(e => e.length === 0));
        });

        it("Stop as soon as the result can be determined", () =>
        {
            const base = Enumerable.fromSource([
                () => 3,
                () => 4,
                () => { throw new Error("stop"); },
                () => 5,
            ]);

            Test.isTrue(base.any(e => e() === 3));
            Test.isTrue(base.any(e => e() === 4));
            Test.throwsException(() => base.any(e => e() === 5));
        });
    }

    function average(): void
    {
        it("Exception if empty", () =>
        {
            const base = Enumerable.empty<number>();
            Test.throwsException(() => base.average(e => e));
        });

        it("Single element", () =>
        {
            const base = Enumerable.fromSource([2]);
            Test.isEqual(base.average(e => e), 2);
        });

        it("Multiple elements", () =>
        {
            const base = Enumerable.fromSource([3, 4, -2, 79, 1]);
            Test.isEqual(base.average(e => e), 17);
        });

        it("Selector in multiple elements", () =>
        {
            const strbase = Enumerable.fromSource(["112", "452", "465"]);
            Test.isEqual(strbase.average(e => parseInt(e[0])), 3);
            Test.isEqual(strbase.average(e => parseInt(e[1])), 4);
            Test.isEqual(strbase.average(e => parseInt(e)), 343);
        });
    }

    function concat(): void
    {
        it("Empty collections", () =>
        {
            const base = Enumerable.empty<number>();
            Test.isArrayEqual(base.concat(base).toArray(), []);
            Test.isArrayEqual(base.concat(base, base).toArray(), []);
            Test.isArrayEqual(base.concat(base, base, base).toArray(), []);
        });

        it("Exception if out of bounds", () =>
        {
            const first = Enumerable.range(1, 2);
            const second = Enumerable.range(3, 2);
            const third = Enumerable.range(5, 2);
            let combo = first.concat(second);

            combo.next(); Test.isEqual(combo.value(), 1);
            combo.next(); Test.isEqual(combo.value(), 2);
            combo.next(); Test.isEqual(combo.value(), 3);
            combo.next(); Test.isEqual(combo.value(), 4);
            combo.next(); Test.throwsException(() => { combo.value(); });

            combo = first.concat(second, third);
            combo.next(); Test.isEqual(combo.value(), 1);
            combo.next(); Test.isEqual(combo.value(), 2);
            combo.next(); Test.isEqual(combo.value(), 3);
            combo.next(); Test.isEqual(combo.value(), 4);
            combo.next(); Test.isEqual(combo.value(), 5);
            combo.next(); Test.isEqual(combo.value(), 6);
            combo.next(); Test.throwsException(() => { combo.value(); });
        });

        it("2 collections", () =>
        {
            const first = Enumerable.range(1, 3);
            const second = Enumerable.range(4, 3);

            Test.isArrayEqual(
                first.concat(second).toArray(),
                [1, 2, 3, 4, 5, 6]);
        });

        it("More than 2 collections", () =>
        {
            const first = Enumerable.range(1, 2);
            const second = Enumerable.range(3, 2);
            const third = Enumerable.range(5, 2);

            Test.isArrayEqual(
                first.concat(second, third).toArray(),
                [1, 2, 3, 4, 5, 6]);
        });

        it("Result is copy, not a reference", () =>
        {
            const first = Enumerable.range(1, 3);
            const second = Enumerable.range(4, 3);
            const third = Enumerable.range(7, 3);

            first.next(); first.next(); Test.isEqual(first.value(), 2);
            second.next(); second.next(); Test.isEqual(second.value(), 5);
            third.next(); third.next(); Test.isEqual(third.value(), 8);

            const copy = first.concat(second, third);

            copy.next(); Test.isEqual(copy.value(), 1);
            copy.next(); Test.isEqual(copy.value(), 2);

            first.next(); Test.isEqual(first.value(), 3);
            second.next(); Test.isEqual(second.value(), 6);
            third.next(); Test.isEqual(third.value(), 9);

            copy.next(); Test.isEqual(copy.value(), 3);
            copy.next(); Test.isEqual(copy.value(), 4);
            copy.next(); Test.isEqual(copy.value(), 5);
            copy.next(); Test.isEqual(copy.value(), 6);

            first.reset(); second.reset(); third.reset();

            copy.next(); Test.isEqual(copy.value(), 7);
            copy.next(); Test.isEqual(copy.value(), 8);
            copy.next(); Test.isEqual(copy.value(), 9);

            first.next(); Test.isEqual(first.value(), 1);
            second.next(); Test.isEqual(second.value(), 4);
            third.next(); Test.isEqual(third.value(), 7);
        });

        it("Mixed with Empty collections", () =>
        {
            const empty = Enumerable.empty<number>();
            const range = Enumerable.range(1, 3);

            Test.isArrayEqual(range.concat(empty).toArray(), [1, 2, 3]);
            Test.isArrayEqual(empty.concat(range).toArray(), [1, 2, 3]);
            Test.isArrayEqual(empty.concat(range, empty).toArray(), [1, 2, 3]);
            Test.isArrayEqual(range.concat(range, empty).toArray(), [1, 2, 3, 1, 2, 3]);
            Test.isArrayEqual(range.concat(empty, range).toArray(), [1, 2, 3, 1, 2, 3]);
        });
    }

    function contains(): void
    {
        it("Empty returns false", () =>
        {
            const empty = Enumerable.empty<number>();

            Test.isFalse(empty.contains(999));
            Test.isFalse(empty.contains(0));
            Test.isFalse(empty.contains(-999));
        });

        it("Value is correct", () =>
        {
            const base = Enumerable.fromSource([1, 2, 4]);

            Test.isTrue(base.contains(1));
            Test.isTrue(base.contains(2));
            Test.isTrue(base.contains(4));
            Test.isFalse(base.contains(3));
            Test.isFalse(base.contains(7));
        });
    }

    function count(): void
    {
        it("Empty returns Zero (no predicate)", () =>
        {
            const empty = Enumerable.empty<number>();
            Test.isEqual(empty.count(), 0);
        });

        it("Empty returns Zero (with predicate)", () =>
        {
            const empty = Enumerable.empty<number>();
            Test.isEqual(empty.count(e => e === 13), 0);
        });

        it("Value is correct (no predicate)", () =>
        {
            let base = Enumerable.fromSource<number>([1]);
            Test.isEqual(base.count(), 1);

            base = Enumerable.fromSource<number>([1, 2, 3]);
            Test.isEqual(base.count(), 3);

            base = Enumerable.range(1, 66);
            Test.isEqual(base.count(), 66);
        });

        it("Value is correct (with predicate)", () =>
        {
            let base = Enumerable.fromSource<number>([1]);
            Test.isEqual(base.count(e => e < 4), 1);
            Test.isEqual(base.count(e => e > 4), 0);

            base = Enumerable.fromSource<number>([1, 2, 3]);
            Test.isEqual(base.count(e => e % 2 !== 0), 2);
            Test.isEqual(base.count(e => e > 0), 3);
            Test.isEqual(base.count(e => e <= 1), 1);

            base = Enumerable.range(1, 66);
            Test.isEqual(base.count(e => e < 1), 0);
            Test.isEqual(base.count(e => e > 20), 46);
            Test.isEqual(base.count(e => e < 100), 66);
        });
    }
}
