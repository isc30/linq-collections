// tslint:disable-next-line:max-line-length

import { ArrayEnumerable, ConcatEnumerable, ConditionalEnumerable, Enumerable, IEnumerable, IQueryable, OrderedEnumerable, RangeEnumerable, ReverseEnumerable, SkipWhileEnumerable, TakeWhileEnumerable, TransformEnumerable, UniqueEnumerable } from "../../src/Enumerables";
import { Dictionary, EnumerableCollection, IDictionary, List, Stack } from "../../src/Collections";

import { ArrayIterator } from "../../src/Iterators";
import { Indexer } from "../../src/Types";
import { Test } from "../Test";

export namespace IQueryableUnitTest
{
    class EnumerableCollectionBase<TElement>
        extends EnumerableCollection<TElement>
    {
        protected source: TElement[];

        public constructor();
        public constructor(elements: TElement[])
        public constructor(elements: TElement[] = [])
        {
            super();
            this.source = elements;
        }

        public copy(): IQueryable<TElement>
        {
            return new EnumerableCollectionBase(this.toArray());
        }

        public toArray(): TElement[]
        {
            return ([] as TElement[]).concat(this.source);
        }

        public asEnumerable(): IEnumerable<TElement>
        {
            return new ArrayEnumerable(this.source);
        }
    }

    type Instancer = <T>(elements: T[]) => IQueryable<T>;

    function runTest(name: string, test: (instancer: Instancer) => void)
    {
        describe(`${name} (Enumerable)`, () => test(
            <T>(e: T[]) => new Enumerable(new ArrayIterator(e))));

        describe(`${name} (ConditionalEnumerable)`, () => test(
            <T>(e: T[]) => new ConditionalEnumerable(Enumerable.fromSource(e), x => true)));

        describe(`${name} (ConcatEnumerable)`, () => test(
            <T>(e: T[]) => e.length > 1
                ? new ConcatEnumerable(
                    Enumerable.fromSource([e[0]]),
                    Enumerable.fromSource(e.slice(1)))
                : new ConcatEnumerable(
                    Enumerable.fromSource(e),
                    Enumerable.fromSource([]))));

        let counter = 0;
        describe(`${name} (UniqueEnumerable)`, () => test(
            <T>(e: T[]) => new UniqueEnumerable(Enumerable.fromSource(e), k => counter++)));

        describe(`${name} (RangeEnumerable)`, () => test(
            <T>(e: T[]) => new RangeEnumerable(Enumerable.fromSource(e), undefined, undefined)));

        describe(`${name} (TransformEnumerable)`, () => test(
            <T>(e: T[]) => new TransformEnumerable(Enumerable.fromSource(e), x => x)));

        describe(`${name} (ReverseEnumerable)`, () => test(
            <T>(e: T[]) => new ReverseEnumerable(new ReverseEnumerable(Enumerable.fromSource(e)))));

        describe(`${name} (SkipWhileEnumerable)`, () => test(
            <T>(e: T[]) => new SkipWhileEnumerable(Enumerable.fromSource(e), x => false)));

        describe(`${name} (TakeWhileEnumerable)`, () => test(
            <T>(e: T[]) => new TakeWhileEnumerable(Enumerable.fromSource(e), x => true)));

        describe(`${name} (ArrayEnumerable)`, () => test(
            <T>(e: T[]) => new ArrayEnumerable(e)));

        describe(`${name} (EnumerableCollection)`, () => test(
            <T>(e: T[]) => new EnumerableCollectionBase(e)));

        describe(`${name} (List)`, () => test(
            <T>(e: T[]) => new List(e)));

        describe(`${name} (Stack)`, () => test(
            <T>(e: T[]) => new Stack(e)));

        counter = 0;
        describe(`${name} (Dictionary Value)`, () => test(
            <T>(e: T[]) => Dictionary.fromArray(e, p => counter++, p => p).select(p => p.value)));
    }

    export function run(): void
    {
        runTest("ToArray", toArray);
        runTest("ToList", toList);
        runTest("ToDictionary", toDictionary);
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
        runTest("Min", min);
        runTest("OrderBy", orderBy);
        runTest("OrderByDescending", orderByDescending);
        runTest("Reverse", reverse);
        runTest("Select", select);
        runTest("SelectMany", selectMany);
        runTest("Single", single);
        runTest("SingleOrDefault", singleOrDefault);
        runTest("Skip", skip);
        runTest("Skip + Take", skipTake);
        runTest("SkipWhile", skipWhile);
        runTest("Sum", sum);
        runTest("Take", take);
        runTest("TakeWhile", takeWhile);
        runTest("ThenBy", thenBy);
        runTest("ThenByDescending", thenByDescending);
        runTest("Union", union);
        runTest("Where", where);
        runTest("GroupBy", groupBy);
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

    function toList(instancer: Instancer): void
    {
        it("Returns List", () =>
        {
            const list = instancer<number>([1, 2, 3]).toList();
            Test.isTrue(list instanceof List);
            Test.isArrayEqual(list.toArray(), [1, 2, 3]);
        });
    }

    function toDictionary(instancer: Instancer): void
    {
        it("Returns Dictionary", () =>
        {
            const dictionary = instancer<number>([1, 2, 3])
                .toDictionary(v => v, v => "wow" + v);
            Test.isTrue(dictionary instanceof Dictionary);
        });
    }

    function aggregate(instancer: Instancer): void
    {
        it("Exception if empty", () =>
        {
            const base = instancer([]);
            Test.throwsException(() => base.aggregate((p, c) => c));
        });

        it("No exception if empty but with default value", () =>
        {
            const base = instancer<number>([]);
            Test.isEqual(base.aggregate((p, c) => c, -666), -666);
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

        // TODO: Complex types
    }

    function orderBy(instancer: Instancer): void
    {
        it("Return empty if empty source (iterator)", () =>
        {
            const base = instancer([]);
            const ordered = new Enumerable(base.orderBy(e => e));
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order (iterator)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = new Enumerable(base.orderBy(e => e));
            Test.isArrayEqual(ordered.toArray(), [1, 2, 3, 6, 7]);
        });

        it("Simple order (custom comparer) (iterator)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = new Enumerable(base.orderBy(e => e, (l, r) => l > r ? -1 : 1));
            Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (string) (iterator)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            const ordered = new Enumerable(base.orderBy(e => e[1]));
            Test.isArrayEqual(
                ordered.toArray(),
                ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });

        it("Return empty if empty source", () =>
        {
            const base = instancer([]);
            const ordered = base.orderBy(e => e);
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = base.orderBy(e => e);
            Test.isArrayEqual(ordered.toArray(), [1, 2, 3, 6, 7]);
        });

        it("Simple order (custom comparer)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = base.orderBy(e => e, (l, r) => l > r ? -1 : 1);
            Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (string)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            const ordered = base.orderBy(e => e[1]);
            Test.isArrayEqual(
                ordered.toArray(),
                ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });

        it("Return empty if empty source (double)", () =>
        {
            const base = instancer([]);
            const ordered = base.orderBy(e => e).orderBy(e => e);
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order (double)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = base.orderBy(e => e).orderBy(e => e);
            Test.isArrayEqual(ordered.toArray(), [1, 2, 3, 6, 7]);
        });

        it("Simple order (custom comparer) (double)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = base.orderBy(e => e).orderBy(e => e, (l, r) => l > r ? -1 : 1);
            Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (string) (double)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            const ordered = base.orderBy(e => e[1]).orderBy(e => e[1]);
            Test.isArrayEqual(
                ordered.toArray(),
                ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });
    }

    function orderByDescending(instancer: Instancer): void
    {
        it("Return empty if empty source (iterator)", () =>
        {
            const base = instancer([]);
            const ordered = new Enumerable(base.orderByDescending(e => e));
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order (iterator)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = new Enumerable(base.orderByDescending(e => e));
            Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (string) (iterator)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            const ordered = new Enumerable(base.orderByDescending(e => e[1]));
            Test.isArrayEqual(
                ordered.toArray(),
                ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });

        it("Return empty if empty source", () =>
        {
            const base = instancer([]);
            const ordered = base.orderByDescending(e => e);
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = base.orderByDescending(e => e);
            Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (string)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            const ordered = base.orderByDescending(e => e[1]);
            Test.isArrayEqual(
                ordered.toArray(),
                ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });

        it("Return empty if empty source (double)", () =>
        {
            const base = instancer([]);
            const ordered = base.orderByDescending(e => e).orderByDescending(e => e);
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order (double)", () =>
        {
            const base = instancer([2, 6, 3, 7, 1]);
            const ordered = base.orderByDescending(e => e).orderByDescending(e => e);
            Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });

        it("Simple order (double) (string)", () =>
        {
            const base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            const ordered = base.orderByDescending(e => e).orderByDescending(e => e[1]);
            Test.isArrayEqual(
                ordered.toArray(),
                ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });
    }

    function reverse(instancer: Instancer): void
    {
        it("Value is correct ", () =>
        {
            const base = instancer([1, 2, 3, 4]).reverse();
            Test.isArrayEqual(base.toArray(), [4, 3, 2, 1]);
        });

        it("Value is correct (iterator)", () =>
        {
            const base = new Enumerable(instancer([1, 2, 3, 4]).reverse());
            Test.isArrayEqual(base.toArray(), [4, 3, 2, 1]);
        });

        it("Double reverse does nothing", () =>
        {
            let base = instancer([1, 2, 3, 4]).reverse().reverse();
            Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);

            base = new Enumerable(instancer([1, 2, 3, 4]).reverse()).reverse();
            Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);
        });

        it("Double reverse does nothing (iterator)", () =>
        {
            let base = new Enumerable(instancer([1, 2, 3, 4]).reverse().reverse());
            Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);

            base = new Enumerable(new Enumerable(instancer([1, 2, 3, 4]).reverse()).reverse());
            Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);
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

    function select(instancer: Instancer): void
    {
        it("Empty if empty", () =>
        {
            const base = instancer<number>([]).select(e => e + 1);
            Test.isArrayEqual(base.toArray(), []);
        });

        it("Value is correct", () =>
        {
            const base = instancer([1, 2, 3]).select(e => e + 1);
            Test.isArrayEqual(base.toArray(), [2, 3, 4]);
        });

        it("Value is correct (string)", () =>
        {
            const base = instancer(["pepin", "sanz", "macheta"]).select(e => e.length);
            Test.isArrayEqual(base.toArray(), [5, 4, 7]);
        });
    }

    class SelectManyTestClass
    {
        public numbers: IQueryable<number>;

        public constructor(numbers: IQueryable<number>)
        {
            this.numbers = numbers;
        }
    }

    function selectMany(instancer: Instancer): void
    {
        it("Empty returns empty", () =>
        {
            const base = instancer<SelectManyTestClass>([]);
            Test.isArrayEqual(base.selectMany(e => e.numbers).toArray(), []);
        });

        it("Single element", () =>
        {
            const base = instancer([new SelectManyTestClass(instancer([1, 2, 3]))]);
            Test.isArrayEqual(base.selectMany(e => e.numbers).toArray(), [1, 2, 3]);
        });

        it("Multiple elements", () =>
        {
            const base = instancer([
                new SelectManyTestClass(instancer([1, 2, 3])),
                new SelectManyTestClass(instancer([4, 5])),
                new SelectManyTestClass(instancer([])),
                new SelectManyTestClass(instancer([6])),
                new SelectManyTestClass(instancer([7, 8])),
            ]);

            Test.isArrayEqual(
                base.selectMany(e => e.numbers).toArray(),
                [1, 2, 3, 4, 5, 6, 7, 8]);
        });
    }

    function single(instancer: Instancer): void
    {
        it("Exception if empty (no selector)", () =>
        {
            const base = instancer<number>([]);
            Test.throwsException(() => base.single());
        });

        it("Exception if empty (with selector)", () =>
        {
            const base = instancer<number>([]);
            Test.throwsException(() => base.single(e => true));
        });

        it("Value is correct (single element)", () =>
        {
            const base = instancer([33]);
            Test.isEqual(base.single(), 33);
        });

        it("Value is correct (multiple elements)", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isEqual(base.single(e => e > 60), 65);
            Test.isEqual(base.single(e => e % 6 === 0), 36);
        });

        it("Exception if no element was found", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.single(e => e === 11811));
        });

        it("Exception if more than 1 element was found", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.single());
            Test.throwsException(() => base.single(e => e > 5));
        });
    }

    function singleOrDefault(instancer: Instancer): void
    {
        it("Undefined if empty (no selector)", () =>
        {
            const base = instancer<number>([]);
            Test.isEqual(base.singleOrDefault(), undefined);
        });

        it("Undefined if empty (with selector)", () =>
        {
            const base = instancer<number>([]);
            Test.isEqual(base.singleOrDefault(e => true), undefined);
        });

        it("Value is correct (single element)", () =>
        {
            const base = instancer([33]);
            Test.isEqual(base.singleOrDefault(), 33);
        });

        it("Value is correct (multiple elements)", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isEqual(base.singleOrDefault(e => e > 60), 65);
            Test.isEqual(base.singleOrDefault(e => e % 6 === 0), 36);
        });

        it("Undefined if no element was found", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isEqual(base.singleOrDefault(e => e === 11811), undefined);
        });

        it("Exception if more than 1 element was found", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.singleOrDefault());
            Test.throwsException(() => base.singleOrDefault(e => e > 5));
        });
    }

    function skip(instancer: Instancer): void
    {
        it("Exception if negative amount", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.skip(-666));
        });

        it("Value is same (skipping 0 elements)", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(
                base.skip(0).toArray(),
                [-2, 4, 65, 32, 1, 36, 7, 2]);
        });

        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.skip(1).toArray(), [4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.skip(3).toArray(), [32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.skip(6).toArray(), [7, 2]);
        });

        it("Empty if amount >= count", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.skip(8).toArray(), []);
            Test.isArrayEqual(base.skip(99).toArray(), []);
            Test.isArrayEqual(base.skip(666).toArray(), []);
        });

        it("Exception if index is out of bounds", () =>
        {
            const base = instancer([-2, 4]).skip(1);

            Test.throwsException(() => base.value());
            Test.isTrue(base.next()); Test.isEqual(base.value(), 4);
            Test.isFalse(base.next()); Test.throwsException(() => base.value());
        });
    }

    function skipTake(instancer: Instancer): void
    {
        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);

            Test.isArrayEqual(base.skip(2).take(2).toArray(), [65, 32]);
            Test.isArrayEqual(base.skip(7).take(5).toArray(), [2]);
        });

        it("Exception if index is out of bounds", () =>
        {
            const base = instancer([-2, 4, 5, 6]).skip(1).take(2);

            Test.throwsException(() => base.value());
            Test.isTrue(base.next()); Test.isEqual(base.value(), 4);
            Test.isTrue(base.next()); Test.isEqual(base.value(), 5);
            Test.isFalse(base.next()); Test.throwsException(() => base.value());
        });
    }

    function skipWhile(instancer: Instancer): void
    {
        it("Empty if empty (true)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.skipWhile(e => true).toArray(), []);
        });

        it("Empty if empty (false)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.skipWhile(e => false).toArray(), []);
        });

        it("Empty if empty (true) (iterator)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(new Enumerable(base.skipWhile(e => true)).toArray(), []);
        });

        it("Empty if empty (false) (iterator)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(new Enumerable(base.skipWhile(e => false)).toArray(), []);
        });

        it("Value is correct (returns elements)", () =>
        {
            const base = instancer([39, 40, 21, 66, 20]);
            const skipWhile = base.skipWhile(e => e >= 39);
            Test.isArrayEqual(skipWhile.toArray(), [21, 66, 20]);
        });

        it("Value is correct (no elements)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const skipWhile = base.skipWhile(e => e < 90);
            Test.isArrayEqual(skipWhile.toArray(), []);
        });

        it("Value is correct (returns elements) (iterator)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const skipWhile = new Enumerable(base.skipWhile(e => e >= 39));
            Test.isArrayEqual(skipWhile.toArray(), [21, 66, 20]);
        });

        it("Value is correct (no elements) (iterator)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const skipWhile = new Enumerable(base.skipWhile(e => e < 90));
            Test.isArrayEqual(skipWhile.toArray(), []);
        });
    }

    function sum(instancer: Instancer): void
    {
        it("Zero if empty", () =>
        {
            const base = instancer<number>([]);
            Test.isEqual(base.sum(e => e), 0);
        });

        it("Value is correct (single element)", () =>
        {
            const base = instancer([2]);
            Test.isEqual(base.sum(e => e), 2);
        });

        it("Value is correct (multiple elements)", () =>
        {
            const base = instancer([3, 4, -20, 1]);
            Test.isEqual(base.sum(e => e), -12);
        });
    }

    function take(instancer: Instancer): void
    {
        it("Exception if negative amount", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.throwsException(() => base.take(-666));
        });

        it("Value is empty (take 0 elements)", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.take(0).toArray(), []);
        });

        it("Value is correct", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.take(1).toArray(), [-2]);
            Test.isArrayEqual(base.take(3).toArray(), [-2, 4, 65]);
            Test.isArrayEqual(base.take(6).toArray(), [-2, 4, 65, 32, 1, 36]);
        });

        it("Value is correct (amount >= count)", () =>
        {
            const base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.take(8).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.take(99).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
            Test.isArrayEqual(base.take(666).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
        });

        it("Exception if index is out of bounds", () =>
        {
            const base = instancer([-2, 4]).take(1);

            Test.throwsException(() => base.value());
            Test.isTrue(base.next()); Test.isEqual(base.value(), -2);
            Test.isFalse(base.next()); Test.throwsException(() => base.value());
        });
    }

    function takeWhile(instancer: Instancer): void
    {
        it("Empty if empty (true)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.takeWhile(e => true).toArray(), []);
        });

        it("Empty if empty (false)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.takeWhile(e => false).toArray(), []);
        });

        it("Empty if empty (true) (iterator)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(new Enumerable(base.takeWhile(e => true)).toArray(), []);
        });

        it("Empty if empty (false) (iterator)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(new Enumerable(base.takeWhile(e => false)).toArray(), []);
        });

        it("Value is correct (returns elements)", () =>
        {
            const base = instancer([39, 40, 21, 66, 20]);
            const takeWhile = base.takeWhile(e => e >= 39);
            Test.isArrayEqual(takeWhile.toArray(), [39, 40]);
        });

        it("Value is correct (no elements)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const takeWhile = base.takeWhile(e => e > 90);
            Test.isArrayEqual(takeWhile.toArray(), []);
        });

        it("Value is correct (returns elements) (iterator)", () =>
        {
            const base = instancer([39, 40, 21, 66, 20]);
            const takeWhile = new Enumerable(base.takeWhile(e => e >= 39));
            Test.isArrayEqual(takeWhile.toArray(), [39, 40]);
        });

        it("Value is correct (no elements) (iterator)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const takeWhile = new Enumerable(base.takeWhile(e => e > 90));
            Test.isArrayEqual(takeWhile.toArray(), []);
        });
    }

    function union(instancer: Instancer): void
    {
        it("Empty returns empty", () =>
        {
            const base1 = instancer<number>([]);
            const base2 = instancer<number>([]);
            const union = base1.union(base2);

            Test.isArrayEqual(union.toArray(), []);
        });

        it("Empty returns empty (iterator)", () =>
        {
            const base1 = instancer<number>([]);
            const base2 = instancer<number>([]);
            const union = new Enumerable(base1.union(base2));

            Test.isArrayEqual(union.toArray(), []);
        });

        it("Value is correct", () =>
        {
            const base1 = instancer([1, 2, 3, 4]);
            const base2 = instancer([2, 5, 6, 1, 7]);
            const union = base1.union(base2);

            Test.isArrayEqual(union.toArray(), [1, 2, 3, 4, 5, 6, 7]);
        });

        it("Value is correct (iterator)", () =>
        {
            const base1 = instancer([1, 2, 3, 4]);
            const base2 = instancer([2, 5, 6, 1, 7]);
            const union = new Enumerable(base1.union(base2));

            Test.isArrayEqual(union.toArray(), [1, 2, 3, 4, 5, 6, 7]);
        });

        it("Value is correct (left is empty)", () =>
        {
            const base1 = instancer([1, 2, 3, 4]);
            const base2 = instancer<number>([]);
            const union = base1.union(base2);

            Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });

        it("Value is correct (left is empty) (iterator)", () =>
        {
            const base1 = instancer<number>([]);
            const base2 = instancer([1, 2, 3, 4]);
            const union = new Enumerable(base1.union(base2));

            Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });

        it("Value is correct (right is empty)", () =>
        {
            const base1 = instancer<number>([]);
            const base2 = instancer([1, 2, 3, 4]);
            const union = base1.union(base2);

            Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });

        it("Value is correct (right is empty) (iterator)", () =>
        {
            const base1 = instancer([1, 2, 3, 4]);
            const base2 = instancer<number>([]);
            const union = new Enumerable(base1.union(base2));

            Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });
    }

    function where(instancer: Instancer): void
    {
        it("Empty if empty", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(base.where(e => true).toArray(), []);
        });

        it("Value is correct (returns elements)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const where = base.where(e => e < 30);
            Test.isArrayEqual(where.toArray(), [21, 20]);
        });

        it("Value is correct (no elements)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const where = base.where(e => e > 90);
            Test.isArrayEqual(where.toArray(), []);
        });

        it("Empty if empty (iterator)", () =>
        {
            const base = instancer([]);
            Test.isArrayEqual(new Enumerable(base.where(e => true)).toArray(), []);
        });

        it("Value is correct (returns elements) (iterator)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const where = new Enumerable(base.where(e => e < 30));
            Test.isArrayEqual(where.toArray(), [21, 20]);
        });

        it("Value is correct (no elements) (iterator)", () =>
        {
            const base = instancer([39, 21, 66, 20]);
            const where = new Enumerable(base.where(e => e > 90));
            Test.isArrayEqual(where.toArray(), []);
        });
    }

    class IThenByTestClass
    {
        public id: number;
        public day: number;
    }

    function thenBy(instancer: Instancer): void
    {
        it("Return empty if empty source (iterator)", () =>
        {
            const base = instancer<IThenByTestClass>([]);
            const ordered = new Enumerable(base.orderBy(e => e).thenBy(e => e));
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order 1 (iterator)", () =>
        {
            const elements = [
                {id: 1, day: 4}, // 0
                {id: 2, day: 7}, // 1
                {id: 3, day: 4}, // 2
                {id: 4, day: 9}, // 3
                {id: 5, day: 1}, // 4
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = new Enumerable(base.orderBy(e => e.day).thenBy(e => e.id));
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[0],
                elements[2],
                elements[1],
                elements[3],
            ]);
        });

        it("Simple order 2 (iterator)", () =>
        {
            const elements = [
                {id: 5, day: 7},
                {id: 2, day: 5},
                {id: 3, day: 4},
                {id: 1, day: 7},
                {id: 4, day: 4},
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = new Enumerable(base.orderBy(e => e.day).thenBy(e => e.id));
            Test.isArrayEqual(ordered.toArray(), [
                elements[2],
                elements[4],
                elements[1],
                elements[3],
                elements[0],
            ]);
        });

        it("Simple order (custom comparer) (iterator)", () =>
        {
            const elements = [
                {id: 1, day: 4}, // 0
                {id: 2, day: 7}, // 1
                {id: 3, day: 4}, // 2
                {id: 4, day: 9}, // 3
                {id: 5, day: 1}, // 4
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = new Enumerable(base.orderBy(e => e.day).thenBy(e => e.id, (l, r) => l < 3 ? 1 : -1));
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });

        it("Return empty if empty source", () =>
        {
            const base = instancer<IThenByTestClass>([]);
            const ordered = base.orderBy(e => e).thenBy(e => e);
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order 1", () =>
        {
            const elements = [
                {id: 1, day: 4}, // 0
                {id: 2, day: 7}, // 1
                {id: 3, day: 4}, // 2
                {id: 4, day: 9}, // 3
                {id: 5, day: 1}, // 4
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = base.orderBy(e => e.day).thenBy(e => e.id);
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[0],
                elements[2],
                elements[1],
                elements[3],
            ]);
        });

        it("Simple order 2", () =>
        {
            const elements = [
                {id: 5, day: 7},
                {id: 2, day: 5},
                {id: 3, day: 4},
                {id: 1, day: 7},
                {id: 4, day: 4},
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = base.orderBy(e => e.day).thenBy(e => e.id);
            Test.isArrayEqual(ordered.toArray(), [
                elements[2],
                elements[4],
                elements[1],
                elements[3],
                elements[0],
            ]);
        });

        it("Simple order (custom comparer)", () =>
        {
            const elements = [
                {id: 1, day: 4}, // 0
                {id: 2, day: 7}, // 1
                {id: 3, day: 4}, // 2
                {id: 4, day: 9}, // 3
                {id: 5, day: 1}, // 4
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = base.orderBy(e => e.day).thenBy(e => e.id, (l, r) => l < 3 ? 1 : -1);
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });
    }

    function thenByDescending(instancer: Instancer): void
    {
        it("Return empty if empty source (iterator)", () =>
        {
            const base = instancer<IThenByTestClass>([]);
            const ordered = new Enumerable(base.orderBy(e => e).thenByDescending(e => e));
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order 1 (iterator)", () =>
        {
            const elements = [
                {id: 1, day: 4}, // 0
                {id: 2, day: 7}, // 1
                {id: 3, day: 4}, // 2
                {id: 4, day: 9}, // 3
                {id: 5, day: 1}, // 4
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = new Enumerable(base.orderBy(e => e.day).thenByDescending(e => e.id));
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });

        it("Simple order 2 (iterator)", () =>
        {
            const elements = [
                {id: 5, day: 7},
                {id: 2, day: 5},
                {id: 3, day: 4},
                {id: 1, day: 7},
                {id: 4, day: 4},
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = new Enumerable(base.orderBy(e => e.day).thenByDescending(e => e.id));
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[1],
                elements[0],
                elements[3],
            ]);
        });

        it("Return empty if empty source", () =>
        {
            const base = instancer<IThenByTestClass>([]);
            const ordered = base.orderBy(e => e).thenByDescending(e => e);
            Test.isArrayEqual(ordered.toArray(), []);
        });

        it("Simple order 1", () =>
        {
            const elements = [
                {id: 1, day: 4}, // 0
                {id: 2, day: 7}, // 1
                {id: 3, day: 4}, // 2
                {id: 4, day: 9}, // 3
                {id: 5, day: 1}, // 4
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = base.orderBy(e => e.day).thenByDescending(e => e.id);
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });

        it("Simple order 2", () =>
        {
            const elements = [
                {id: 5, day: 7},
                {id: 2, day: 5},
                {id: 3, day: 4},
                {id: 1, day: 7},
                {id: 4, day: 4},
            ];
            const base = instancer<IThenByTestClass>(elements);
            const ordered = base.orderBy(e => e.day).thenByDescending(e => e.id);
            Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[1],
                elements[0],
                elements[3],
            ]);
        });
    }

    interface IGroupByTestClass
    {
        id: number;
        type: number;
        name: string;
    }

    function groupBy(instancer: Instancer): void
    {
        it("Return empty if empty source", () =>
        {
            const base = instancer<IGroupByTestClass>([]);
            const grouped = base.groupBy(e => e.id);
            Test.isArrayEqual(grouped.toArray(), []);
        });

        it("Return empty if empty source (value selector)", () =>
        {
            const base = instancer<IGroupByTestClass>([]);
            const grouped = base.groupBy(e => e.id, e => e.name);
            Test.isArrayEqual(grouped.toArray(), []);
        });

        it("Grouping is correct", () =>
        {
            const people = <IGroupByTestClass[]>[
                { id: 1, type: 3, name: "Ivan" },
                { id: 2, type: 2, name: "Juanmari" },
                { id: 3, type: 3, name: "Uxue" },
                { id: 4, type: 2, name: "Begoña" },
                { id: 5, type: 1, name: "Juanito" },
            ];

            const grouped = instancer(people)
                .groupBy(p => p.type)
                .toDictionary(g => g.key, g => g.value);

            Test.isFalse(grouped.containsKey(0));
            Test.isTrue(grouped.containsKey(1));
            Test.isTrue(grouped.containsKey(2));
            Test.isTrue(grouped.containsKey(3));
            Test.isFalse(grouped.containsKey(4));

            Test.isArrayEqual(grouped.get(1).toArray(), [people[4]]); // Juanito
            Test.isArrayEqual(grouped.get(2).toArray(), [people[1], people[3]]); // Juanmari, Begoña
            Test.isArrayEqual(grouped.get(3).toArray(), [people[0], people[2]]); // Ivan, Uxue
        });

        it("Grouping is correct (value selector)", () =>
        {
            const people = <IGroupByTestClass[]>[
                { id: 1, type: 3, name: "Ivan" },
                { id: 2, type: 2, name: "Juanmari" },
                { id: 3, type: 3, name: "Uxue" },
                { id: 4, type: 2, name: "Begoña" },
                { id: 5, type: 1, name: "Juanito" },
            ];

            const grouped = instancer(people)
                .groupBy(p => p.type, p => p.name);

            Test.isFalse(grouped.any(g => g.key === 0));
            Test.isTrue(grouped.any(g => g.key === 1));
            Test.isTrue(grouped.any(g => g.key === 2));
            Test.isTrue(grouped.any(g => g.key === 3));
            Test.isFalse(grouped.any(g => g.key === 4));

            Test.isArrayEqual(grouped.single(g => g.key === 1).value.toArray(), ["Juanito"]);
            Test.isArrayEqual(grouped.single(g => g.key === 2).value.toArray(), ["Juanmari", "Begoña"]);
            Test.isArrayEqual(grouped.single(g => g.key === 3).value.toArray(), ["Ivan", "Uxue"]);
        });
    }
}
