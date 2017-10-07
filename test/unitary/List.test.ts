import { Test } from "./../Test";
import { List } from "./../../src/Collections";

export namespace ListUnitTest
{
    export function run(): void
    {
        describe("AsArray", asArray);
        describe("Copy", copy);
        // describe("Add", add);
        // describe("AddRange", addRange);
        // describe("Clear", clear);
        // describe("Get", get);
        // describe("Remove", remove);
        // describe("RemoveAt", removeAt);
        // describe("Set", set);
        // describe("IndexOf", indexOf);
        // describe("Insert", insert);
    }

    function asArray(): void
    {
        it("Returns a reference, not a copy", () =>
        {
            const array = [1, 2, 3];
            const list = new List(array);

            Test.isArrayEqual(list.asArray(), array);
            array.push(245);
            Test.isArrayEqual(list.asArray(), array);
        });
    }

    function copy(): void
    {
        it("Type is a List", () =>
        {
            const list = new List([1, 2, 3]);
            Test.isTrue(list instanceof List);
        });

        it("Returns a copy, not a reference", () =>
        {
            const array = [1, 2, 3];
            const list = new List(array);
            const copy = list.copy();

            Test.isArrayEqual(list.asArray(), copy.asArray());
            list.asArray().push(245);
            Test.isArrayNotEqual(list.asArray(), copy.asArray());
            Test.isArrayEqual(list.asArray(), [1, 2, 3, 245]);
            Test.isArrayEqual(copy.asArray(), [1, 2, 3]);
        });
    }
}
