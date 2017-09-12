import {Test} from "../Test";
import {ArrayIterator} from "../../Linq/Iterators";

export namespace StringIteratorTests
{
    export function run(): void
    {
        it("Reset, Next, Value", general);
        it("Clone", clone);
    }

    function general(): void
    {
        throw new Error("Not implemented");
    }

    function clone(): void
    {
        throw new Error("Not implemented");
    }
}
