import {Test} from "../Test";
import {ArrayIterator} from "../../Linq/Iterators";

export namespace ArrayIteratorTests
{
    export function run(): void
    {
        it("Reset, Next, Value", general);
        // it("Clone", clone);
    }

    function general(): void
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

    function clone(): void
    {
        throw new Error("Not implemented");
    }
}
