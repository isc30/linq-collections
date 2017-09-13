import { Enumerable } from "../../src/Enumerables";
import { ArrayIterator, StringIterator } from "../../src/Iterators";
import { Test } from "../Test";

export namespace IEnumerableTests
{
    export function run(): void
    {
        describe("ToArray", toArray);
        describe("Aggregate", aggregate);
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
}
