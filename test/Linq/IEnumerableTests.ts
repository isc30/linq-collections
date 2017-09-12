import {Enumerable} from "../../Linq/Enumerables";
import {ArrayIterator, StringIterator} from "../../Linq/Iterators";
import {Test} from "../Test";

export namespace IEnumerableTests
{
    export function run(): void
    {
        it("ToArray", toArray);
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
}
