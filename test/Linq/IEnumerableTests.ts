import { IEnumerable, Enumerable } from "../../src/Enumerables";
import { ArrayIterator, StringIterator } from "../../src/Iterators";
import { Test } from "../Test";

export namespace IEnumerableTests
{
    type Instancer = <T>(elements: T[]) => IEnumerable<T>;

    function ArrayInstancer<T>(elements: T[])
    {
        return Enumerable.fromSource(elements);
    }

    function EnumerableInstancer<T>(elements: T[])
    {
        return new Enumerable(new ArrayIterator(elements));
    }

    function runTest(name: string, test: (instancer: Instancer) => void)
    {
        describe(`${name} (Iterator)`, () => test(EnumerableInstancer));
        describe(`${name} (Array)`, () => test(ArrayInstancer));
    }

    export function run(): void
    {
        runTest("ToArray", toArray);
        runTest("Aggregate", aggregate);
        runTest("All", all);
        runTest("Any", any);
        runTest("Average", average);
        runTest("Concat", concat);
        runTest("Contains", contains);
        runTest("Count", count);
        runTest("Distinct", distinct);
        runTest("ElementAt", elementAt);
        runTest("ElementAtOrDefault", elementAtOrDefault);
        runTest("Except", except);
        runTest("First", first);
        runTest("FirstOrDefault", firstOrDefault);
        runTest("ForEach", forEach);
        runTest("Last", last);
        runTest("LastOrDefault", lastOrDefault);
        runTest("Max", max);
        runTest("Min", aggregate);
        runTest("OrderBy", orderBy);
        runTest("OrderByDescending", orderByDescending);
        // describe("Select", aggregate);
        // describe("SelectMany", aggregate);
        // describe("Single", aggregate);
        // describe("SingleOrDefault", aggregate);
        // describe("Skip", aggregate);
        // describe("Sum", aggregate);
        // describe("Take", aggregate);
        // describe("Union", aggregate);
        // describe("Where", aggregate);
    }

    function toArray(instancer: Instancer): void
    {
        it("Empty collection", () =>
        {
            Test.isArrayEqual(instancer<number>([]).toArray(), []);
        });

        const base = [1, 2, 3, 4];
        const baseEnumerable = instancer([1, 2, 3, 4]);
        const baseToArray = baseEnumerable.toArray();

        it("Content is correct", () =>
        {
            Test.isArrayEqual(base, baseToArray);
        });

        it("Returns a copy, not a reference", () =>
        {
            base.push(5);
            Test.isArrayEqual([1, 2, 3, 4], baseToArray);
        });

        it("Content is correct (string)", () =>
        {
            const strSource = ["asd", "asdaa"];
            const strI = instancer(strSource);
            Test.isArrayEqual(strI.toArray(), strSource);
        });
    }

    function aggregate(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.aggregate((p, c) => c));
        });

        it("No initial value", () =>
        {
            const base = instancer(["a", "b", "a", "a"]);
            Test.isEqual(base.aggregate((p, c) => p === "b" ? p : c), "b");
            Test.isEqual(base.aggregate((p, c) => p !== undefined ? c + p : c), "aaba");
        });

        it("Custom initial value", () =>
        {
            const base = instancer(["a", "b", "a", "a"]);
            Test.isEqual(base.aggregate((p, c) => p !== undefined ? c + p : c, "xd"), "aabaxd");
        });

        it("Custom return type", () =>
        {
            const base = instancer(["a", "b", "a", "a"]);
            Test.isTrue(base.aggregate((p, c) => p || c === "b", false));
            Test.isTrue(base.aggregate((p, c) => p || c === "a", false));
            Test.isFalse(base.aggregate((p, c) => p || c === "x", false));
            Test.isTrue(base.aggregate((p, c) => p || c === "x", true));
        });
    }

    function all(instancer: Instancer): void
    {
        it("True if empty", () =>
        {
            const base = instancer([]);
            Test.isTrue(base.all(e => true));
            Test.isTrue(base.all(e => false));
        });

        it("Single element", () =>
        {
            const base = instancer(["lol"]);
            Test.isTrue(base.all(e => e[0] === "l"));
            Test.isFalse(base.all(e => e[0] === "X"));
        });

        it("Multiple elements", () =>
        {
            const base = instancer(["a", "av", "abc", "axd"]);
            Test.isTrue(base.all(e => e.length > 0));
            Test.isTrue(base.all(e => e[0] === "a"));
            Test.isTrue(base.all(e => e.length < 4));
            Test.isFalse(base.all(e => e.length > 1));
            Test.isFalse(base.all(e => e[1] === "v"));
            Test.isFalse(base.all(e => e.length < 2));
        });
    }

    function any(instancer: Instancer): void
    {
        it("False if empty", () =>
        {
            const base = instancer([]);
            Test.isFalse(base.any());
            Test.isFalse(base.any(e => true));
            Test.isFalse(base.any(e => false));
        });

        it("True if single element", () =>
        {
            const base = instancer(["lol"]);
            Test.isTrue(base.any());
        });

        it("Predicate in single element", () =>
        {
            const base = instancer(["lol"]);
            Test.isTrue(base.any(e => e[1] === "o"));
            Test.isFalse(base.any(e => e === "isc"));
        });

        it("Predicate in multiple elements", () =>
        {
            const base = instancer(["a", "av", "abc", "x"]);

            Test.isTrue(base.any(e => e.length > 2));
            Test.isTrue(base.any(e => e[0] === "a"));
            Test.isTrue(base.any(e => e.length === 1));
            Test.isFalse(base.any(e => e[0] === "b"));
            Test.isFalse(base.any(e => e.length > 5));
            Test.isFalse(base.any(e => e.length === 0));
        });

        it("Stop as soon as the result can be determined", () =>
        {
            const base = instancer([
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

    function average(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.average(e => e));
        });

        it("Single element", () =>
        {
            const base = instancer([2]);
            Test.isEqual(base.average(e => e), 2);
        });

        it("Multiple elements", () =>
        {
            const base = instancer([3, 4, -2, 79, 1]);
            Test.isEqual(base.average(e => e), 17);
        });

        it("Selector in multiple elements", () =>
        {
            const strbase = instancer(["112", "452", "465"]);
            Test.isEqual(strbase.average(e => parseInt(e[0])), 3);
            Test.isEqual(strbase.average(e => parseInt(e[1])), 4);
            Test.isEqual(strbase.average(e => parseInt(e)), 343);
        });
    }

    function concat(instancer: Instancer): void
    {
        it("Empty collections", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.concat(base).toArray(), []);
            Test.isArrayEqual(base.concat(base, base).toArray(), []);
            Test.isArrayEqual(base.concat(base, base, base).toArray(), []);
        });

        it("Exception if out of bounds", () =>
        {
            const first = instancer(Enumerable.range(1, 2).toArray());
            const second = instancer(Enumerable.range(3, 2).toArray());
            const third = instancer(Enumerable.range(5, 2).toArray());
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
            const first = instancer(Enumerable.range(1, 3).toArray());
            const second = instancer(Enumerable.range(4, 3).toArray());

            Test.isArrayEqual(
                first.concat(second).toArray(),
                [1, 2, 3, 4, 5, 6]);
        });

        it("More than 2 collections", () =>
        {
            const first = instancer(Enumerable.range(1, 2).toArray());
            const second = instancer(Enumerable.range(3, 2).toArray());
            const third = instancer(Enumerable.range(5, 2).toArray());

            Test.isArrayEqual(
                first.concat(second, third).toArray(),
                [1, 2, 3, 4, 5, 6]);
        });

        it("Result is copy, not a reference", () =>
        {
            const first = instancer(Enumerable.range(1, 3).toArray());
            const second = instancer(Enumerable.range(4, 3).toArray());
            const third = instancer(Enumerable.range(7, 3).toArray());

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
            const empty = instancer<number>([]);
            const range = instancer(Enumerable.range(1, 3).toArray());

            Test.isArrayEqual(range.concat(empty).toArray(), [1, 2, 3]);
            Test.isArrayEqual(empty.concat(range).toArray(), [1, 2, 3]);
            Test.isArrayEqual(empty.concat(range, empty).toArray(), [1, 2, 3]);
            Test.isArrayEqual(range.concat(range, empty).toArray(), [1, 2, 3, 1, 2, 3]);
            Test.isArrayEqual(range.concat(empty, range).toArray(), [1, 2, 3, 1, 2, 3]);
        });
    }

    function contains(instancer: Instancer): void
    {
        it("Empty returns false", () =>
        {
            const empty = instancer<number>([]);

            Test.isFalse(empty.contains(999));
            Test.isFalse(empty.contains(0));
            Test.isFalse(empty.contains(-999));
        });

        it("Value is correct", () =>
        {
            const base = instancer([1, 2, 4]);

            Test.isTrue(base.contains(1));
            Test.isTrue(base.contains(2));
            Test.isTrue(base.contains(4));
            Test.isFalse(base.contains(3));
            Test.isFalse(base.contains(7));
        });
    }

    function count(instancer: Instancer): void
    {
        it("Empty returns Zero (no predicate)", () =>
        {
            const empty = instancer([]);
            Test.isEqual(empty.count(), 0);
        });

        it("Empty returns Zero (with predicate)", () =>
        {
            const empty = instancer([]);
            Test.isEqual(empty.count(e => e === 13), 0);
        });

        it("Value is correct (no predicate)", () =>
        {
            let base = instancer([1]);
            Test.isEqual(base.count(), 1);

            base = instancer<number>([1, 2, 3]);
            Test.isEqual(base.count(), 3);

            base = instancer(Enumerable.range(1, 66).toArray());
            Test.isEqual(base.count(), 66);
        });

        it("Value is correct (with predicate)", () =>
        {
            let base = instancer([1]);
            Test.isEqual(base.count(e => e < 4), 1);
            Test.isEqual(base.count(e => e > 4), 0);

            base = instancer([1, 2, 3]);
            Test.isEqual(base.count(e => e % 2 !== 0), 2);
            Test.isEqual(base.count(e => e > 0), 3);
            Test.isEqual(base.count(e => e <= 1), 1);

            base = instancer(Enumerable.range(1, 66).toArray());
            Test.isEqual(base.count(e => e < 1), 0);
            Test.isEqual(base.count(e => e > 20), 46);
            Test.isEqual(base.count(e => e < 100), 66);
        });
    }

    function distinct(instancer: Instancer): void
    {
        it("Return empty if empty (no predicate)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.distinct(e => e).toArray(), []);
        });

        it("Value is correct (no predicate)", () =>
        {
            const base = instancer([
                -5, 6, 2, 6, 99, 0, -5, 2, 7, 2, 0,
            ]);

            Test.isArrayEqual(
                base.distinct(e => e).toArray(),
                [-5, 6, 2, 99, 0, 7]);
        });

        it("Return empty if empty (with predicate)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.distinct(x => x).toArray(), []);
        });

        it("Value is correct (with predicate)", () =>
        {
            const base = instancer([
                "a", "b", "aba", "ce", "wea", "baba", "era", "eaa",
            ]);

            Test.isArrayEqual(
                base.distinct(e => e[0]).toArray(),
                ["a", "b", "ce", "wea", "era"]);
        });
    }

    function orderBy(instancer: Instancer): void
    {
        it("Return empty if empty source", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.orderBy(e => e).toArray(), []);
        });

        it("Simple order", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            Test.isArrayEqual(base.orderBy(e => e).toArray(), [1, 2, 3, 6, 7]);
        });

        it("Simple order (key)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            Test.isArrayEqual(
                base.orderBy(e => e[1]).toArray(),
                ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });
    }

    function orderByDescending(instancer: Instancer): void
    {
        it("Return empty if empty source", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.orderByDescending(e => e).toArray(), []);
        });

        it("Simple order", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            Test.isArrayEqual(base.orderByDescending(e => e).toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (key)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            Test.isArrayEqual(base.orderByDescending(e => e[1]).toArray(), ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });
    }

    function elementAt(instancer: Instancer): void
    {
        it("Negative index throws exception", () =>
        {
            const base = instancer([1, 2, 3, 4]);
            Test.throwsException(() => base.elementAt(-1));
            Test.throwsException(() => base.elementAt(-666));
        });

        it("Out of bounds index throws exception", () =>
        {
            const base = instancer([1, 2]);
            Test.throwsException(() => base.elementAt(2));
            Test.throwsException(() => base.elementAt(666));
        });

        it("Value is correct", () =>
        {
            const base = instancer([1, 2, 3, 4]);
            Test.throwsException(() => base.elementAt(-1));
            Test.isEqual(base.elementAt(0), 1);
            Test.isEqual(base.elementAt(1), 2);
            Test.isEqual(base.elementAt(2), 3);
            Test.isEqual(base.elementAt(3), 4);
            Test.throwsException(() => base.elementAt(4));
        });
    }

    function elementAtOrDefault(instancer: Instancer): void
    {
        it("Negative index throws exception", () =>
        {
            const base = instancer([1, 2, 3, 4]);
            Test.throwsException(() => base.elementAtOrDefault(-1));
            Test.throwsException(() => base.elementAtOrDefault(-666));
        });

        it("Out of bounds index returns undefined", () =>
        {
            const base = instancer([1, 2]);
            Test.isEqual(base.elementAtOrDefault(2), undefined);
            Test.isEqual(base.elementAtOrDefault(666), undefined);
        });

        it("Value is correct", () =>
        {
            const base = instancer([1, 2, 3, 4]);
            Test.throwsException(() => base.elementAtOrDefault(-1));
            Test.isEqual(base.elementAtOrDefault(0), 1);
            Test.isEqual(base.elementAtOrDefault(1), 2);
            Test.isEqual(base.elementAtOrDefault(2), 3);
            Test.isEqual(base.elementAtOrDefault(3), 4);
            Test.isEqual(base.elementAtOrDefault(4), undefined);
        });
    }

    function except(instancer: Instancer): void
    {
        it("Value is correct (empty)", () =>
        {
            let base = instancer([1, 2, 3, 4]);
            const base2 = instancer([]);
            Test.isArrayEqual(base.except(base2).toArray(), [1, 2, 3, 4]);

            base = instancer([]);
            Test.isArrayEqual(base.except(base2).toArray(), []);
        });

        it("Value is correct", () =>
        {
            const base = instancer([1, 2, 3, 4]);
            let base2 = instancer([2, 5, 1, 7]);
            Test.isArrayEqual(base.except(base2).toArray(), [3, 4]);

            base2 = instancer([3, 6, 88]);
            Test.isArrayEqual(base.except(base2).toArray(), [1, 2, 4]);
        });
    }

    function first(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.first());
        });

        it("Exception if no element found", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.first(e => e === 11811));
        });

        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.isEqual(base.first(), -2);
            Test.isEqual(base.first(e => e > 5), 65);
            Test.isEqual(base.first(e => e % 6 === 0), 42);
        });
    }

    function firstOrDefault(instancer: Instancer): void
    {
        it("Undefined if empty", () =>
        {
            const base = instancer([]);
            Test.isEqual(base.firstOrDefault(), undefined);
        });

        it("Undefined if no element found", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.isEqual(base.firstOrDefault(e => e === 11811), undefined);
        });

        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.isEqual(base.firstOrDefault(), -2);
            Test.isEqual(base.firstOrDefault(e => e > 5), 65);
            Test.isEqual(base.firstOrDefault(e => e % 6 === 0), 42);
        });
    }

    function last(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.last());
        });

        it("Exception if no element found", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.last(e => e === 11811));
        });

        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.isEqual(base.last(), 2);
            Test.isEqual(base.last(e => e > 5), 7);
            Test.isEqual(base.last(e => e % 6 === 0), 36);
        });
    }

    function lastOrDefault(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.isEqual(base.lastOrDefault(), undefined);
        });

        it("Exception if no element found", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.isEqual(base.lastOrDefault(e => e === 11811), undefined);
        });

        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test.isEqual(base.lastOrDefault(), 2);
            Test.isEqual(base.lastOrDefault(e => e > 5), 7);
            Test.isEqual(base.lastOrDefault(e => e % 6 === 0), 36);
        });
    }

    function forEach(instancer: Instancer): void
    {
        it("All elements are iterated", () =>
        {
            const base = instancer([1, 2, 3]);
            const iterated: number[] = [];

            base.forEach(e =>
            {
                iterated.push(e);
            });

            Test.isArrayEqual(base.toArray(), iterated);
        });

        it("Primitive type inmutability", () =>
        {
            const base = instancer([1, 2, 3]);
            const original = base.toArray();

            base.forEach(e =>
            {
                e = e + 1;
            });

            Test.isArrayEqual(base.toArray(), original);
        });

        it("Using indices", () =>
        {
            const base = instancer([1, 2, 3]);
            const indices: number[] = [];

            base.forEach((e, i) =>
            {
                indices.push(e + i);
            });

            Test.isArrayEqual(indices, [1, 3, 5]);
        });
    }

    function max(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.max());
        });

        it("Value is correct (no selector)", () =>
        {
            let base = instancer([2]);
            Test.isEqual(base.max(), 2);

            base = instancer([3, 4, -8, 77, 1]);
            Test.isEqual(base.max(), 77);
        });

        it("Value is correct (with selector)", () =>
        {
            const strbase = instancer([
                "hello", "ivan", "how", "are", "you",
            ]);
            Test.isEqual(strbase.max(), "you");
            Test.isEqual(strbase.max(e => e[0]), "y");
            Test.isEqual(strbase.max(e => e[1]), "v");
        });
    }

    function min(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.min());
        });

        it("Value is correct (no selector)", () =>
        {
            let base = instancer([2]);
            Test.isEqual(base.min(), 2);

            base = instancer([3, 4, -8, 77, 1]);
            Test.isEqual(base.min(), -8);
        });

        it("Value is correct (with selector)", () =>
        {
            const strbase = instancer([
                "hello", "ivan", "how", "are", "you",
            ]);
            Test.isEqual(strbase.min(), "are");
            Test.isEqual(strbase.min(e => e[0]), "a");
            Test.isEqual(strbase.min(e => e[1]), "e");
        });
    }
}
