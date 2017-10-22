import { Test } from "./../Test";
import { List } from "./../../src/Collections";

export namespace ListUnitTest
{
    export function run(): void
    {
        describe("AsArray", asArray);
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Get", get);
        describe("Push", push);
        describe("PushFront", pushFront);
        describe("PushRange", pushRange);
        describe("Pop", pop);
        describe("PopFront", popFront);
        describe("Remove", remove);
        describe("RemoveAt", removeAt);
        describe("Set", set);
        describe("IndexOf", indexOf);
        describe("Insert", insert);
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

    function clear(): void
    {
        it("Does nothing on empty list", () =>
        {
            const list = new List<number>();
            Test.isArrayEqual(list.asArray(), []);

            list.clear();
            Test.isArrayEqual(list.asArray(), []);

            list.clear();
            Test.isArrayEqual(list.asArray(), []);
        });

        it("List is cleared", () =>
        {
            const list = new List([1, 2, 3]);
            Test.isArrayEqual(list.asArray(), [1, 2, 3]);

            list.clear();
            Test.isArrayEqual(list.asArray(), []);
        });
    }

    function get(): void
    {
        it("Value is correct", () =>
        {
            const list = new List([1, 2, 3]);
            Test.isEqual(list.get(0), 1);
            Test.isEqual(list.get(1), 2);
            Test.isEqual(list.get(2), 3);
        });

        it("Undefined if invalid index", () =>
        {
            const list = new List([1, 2, 3]);
            Test.isEqual(list.get(-999), undefined);
            Test.isEqual(list.get(-1), undefined);
            Test.isEqual(list.get(3), undefined);
            Test.isEqual(list.get(999), undefined);
        });
    }

    function push(): void
    {
        it("Adds element in back of the list", () =>
        {
            const list = new List<number>();
            list.push(2); Test.isArrayEqual(list.asArray(), [2]);
            list.push(22); Test.isArrayEqual(list.asArray(), [2, 22]);
            list.push(1); Test.isArrayEqual(list.asArray(), [2, 22, 1]);
            list.push(4); Test.isArrayEqual(list.asArray(), [2, 22, 1, 4]);
        });
    }

    function pushFront(): void
    {
        it("Adds element in front of the list", () =>
        {
            const list = new List<number>();
            list.pushFront(2); Test.isArrayEqual(list.asArray(), [2]);
            list.pushFront(22); Test.isArrayEqual(list.asArray(), [22, 2]);
            list.pushFront(1); Test.isArrayEqual(list.asArray(), [1, 22, 2]);
            list.pushFront(4); Test.isArrayEqual(list.asArray(), [4, 1, 22, 2]);
        });
    }

    function pushRange(): void
    {
        it("Empty range doesn't modify the original (array)", () =>
        {
            const list = new List([1, 2, 3]);

            Test.isEqual(list.pushRange([]), 3);
            Test.isArrayEqual(list.asArray(), [1, 2, 3]);
        });

        it("Empty range doesn't modify the original (IQueryable)", () =>
        {
            const list = new List([1, 2, 3]);

            Test.isEqual(list.pushRange(new List<number>()), 3);
            Test.isArrayEqual(list.asArray(), [1, 2, 3]);
        });

        it("Value is correct (array)", () =>
        {
            const list = new List([1, 2, 3]);

            Test.isEqual(list.pushRange([22]), 4);
            Test.isArrayEqual(list.asArray(), [1, 2, 3, 22]);

            Test.isEqual(list.pushRange([24, 67]), 6);
            Test.isArrayEqual(list.asArray(), [1, 2, 3, 22, 24, 67]);
        });

        it("Value is correct (IQueryable)", () =>
        {
            const list = new List([1, 2, 3]);

            Test.isEqual(list.pushRange(new List([22])), 4);
            Test.isArrayEqual(list.asArray(), [1, 2, 3, 22]);

            Test.isEqual(list.pushRange(new List([24, 67])), 6);
            Test.isArrayEqual(list.asArray(), [1, 2, 3, 22, 24, 67]);
        });
    }

    function pop(): void
    {
        it("Removes and returns the element in back of the list", () =>
        {
            const list = new List([1, 2, 3]);

            let element = list.pop();
            Test.isEqual(element, 3);
            Test.isArrayEqual(list.asArray(), [1, 2]);

            element = list.pop();
            Test.isEqual(element, 2);
            Test.isArrayEqual(list.asArray(), [1]);

            element = list.pop();
            Test.isEqual(element, 1);
            Test.isArrayEqual(list.asArray(), []);
        });

        it("Returns undefined in empty list", () =>
        {
            const list = new List<number>();

            const element = list.pop();
            Test.isEqual(element, undefined);
            Test.isArrayEqual(list.asArray(), []);
        });
    }

    function popFront(): void
    {
        it("Removes and returns the element in back of the list", () =>
        {
            const list = new List([1, 2, 3]);

            let element = list.popFront();
            Test.isEqual(element, 1);
            Test.isArrayEqual(list.asArray(), [2, 3]);

            element = list.popFront();
            Test.isEqual(element, 2);
            Test.isArrayEqual(list.asArray(), [3]);

            element = list.popFront();
            Test.isEqual(element, 3);
            Test.isArrayEqual(list.asArray(), []);
        });

        it("Returns undefined in empty list", () =>
        {
            const list = new List<number>();

            const element = list.popFront();
            Test.isEqual(element, undefined);
            Test.isArrayEqual(list.asArray(), []);
        });
    }

    function remove(): void
    {
        it("Does nothing on empty list", () =>
        {
            const list = new List<number>();
            list.remove(6);
            list.remove(-6);
            Test.isArrayEqual(list.asArray(), []);
        });

        it("Remove single element", () =>
        {
            const list = new List([2, 3, 4, 5]);
            list.remove(3);
            Test.isArrayEqual(list.asArray(), [2, 4, 5]);

            list.remove(6);
            Test.isArrayEqual(list.asArray(), [2, 4, 5]);

            list.remove(4);
            Test.isArrayEqual(list.asArray(), [2, 5]);

            list.remove(2);
            Test.isArrayEqual(list.asArray(), [5]);

            list.remove(5);
            Test.isArrayEqual(list.asArray(), []);
        });

        it("Remove element multiple times", () =>
        {
            const list = new List([1, 1, 2, 3, 2, 5, 6, 6]);
            list.remove(1);
            Test.isArrayEqual(list.asArray(), [2, 3, 2, 5, 6, 6]);

            list.remove(2);
            Test.isArrayEqual(list.asArray(), [3, 5, 6, 6]);

            list.remove(6);
            Test.isArrayEqual(list.asArray(), [3, 5]);
        });
    }

    function removeAt(): void
    {
        it("Exception if negative index", () =>
        {
            const list = new List([6, 6, 6]);
            Test.throwsException(() => list.removeAt(-1));
            Test.throwsException(() => list.removeAt(-50));
            Test.throwsException(() => list.removeAt(-9999));
        });

        it("Exception if invalid index", () =>
        {
            const list = new List([6, 6, 6]);
            Test.throwsException(() => list.removeAt(3));
            Test.throwsException(() => list.removeAt(50));
            Test.throwsException(() => list.removeAt(9999));
        });

        it("Deletes element by index", () =>
        {
            const list = new List([2, 3, 4, 5]);
            list.removeAt(3);
            Test.isArrayEqual(list.asArray(), [2, 3, 4]);

            list.removeAt(0);
            Test.isArrayEqual(list.asArray(), [3, 4]);

            list.removeAt(1);
            Test.isArrayEqual(list.asArray(), [3]);

            list.removeAt(0);
            Test.isArrayEqual(list.asArray(), []);
        });
    }

    function set(): void
    {
        it("Exception if negative index", () =>
        {
            const list = new List([6, 6, 6]);
            Test.throwsException(() => list.set(-1, 666));
            Test.throwsException(() => list.set(-50, 666));
            Test.throwsException(() => list.set(-9999, 666));
        });

        it("Initializes list if empty", () =>
        {
            const list = new List<number>();

            list.set(0, 33);
            Test.isArrayEqual(list.asArray(), [33]);
        });

        it("Sets the correct index", () =>
        {
            const list = new List([2, 4, 6, 8, 7]);

            list.set(0, 33);
            Test.isArrayEqual(list.asArray(), [33, 4, 6, 8, 7]);

            list.set(3, 22);
            Test.isArrayEqual(list.asArray(), [33, 4, 6, 22, 7]);
        });

        it("Resizes list if necessary", () =>
        {
            const list = new List([2, 4, 6, 8, 7]);

            list.set(7, 33);
            Test.isArrayEqual(list.asArray(), [2, 4, 6, 8, 7, undefined, undefined, 33]);
        });
    }

    function indexOf(): void
    {
        it("-1 in empty list", () =>
        {
            const list = new List<number>();
            Test.isEqual(list.indexOf(666), -1);
            Test.isEqual(list.indexOf(0), -1);
            Test.isEqual(list.indexOf(-666), -1);
        });

        it("-1 if element not found", () =>
        {
            const list = new List([1, 2, 3]);
            Test.isEqual(list.indexOf(-999), -1);
            Test.isEqual(list.indexOf(-1), -1);
            Test.isEqual(list.indexOf(4), -1);
            Test.isEqual(list.indexOf(999), -1);
        });

        it("Value is correct", () =>
        {
            const list = new List([1, 2, 3]);
            Test.isEqual(list.indexOf(2), 1);
            Test.isEqual(list.indexOf(1), 0);
            Test.isEqual(list.indexOf(3), 2);
        });
    }

    function insert(): void
    {
        it("Throws exception if index < 0", () =>
        {
            const list = new List([1, 2, 3]);
            Test.throwsException(() => list.insert(-3, 55));
        });

        it("Throws exception if index > length", () =>
        {
            const list = new List([1, 2, 3]);
            Test.throwsException(() => list.insert(4, 55));
        });

        it("Initializes empty list", () =>
        {
            const list = new List<number>();
            list.insert(0, 4);
            Test.isArrayEqual(list.asArray(), [4]);
        });

        it("Moves other elements to fit the new one", () =>
        {
            const list = new List([1, 2, 3]);
            list.insert(1, 55);
            Test.isArrayEqual(list.asArray(), [1, 55, 2, 3]);
        });
    }
}
