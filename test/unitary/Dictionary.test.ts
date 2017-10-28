import { Test } from "./../Test";
import { Dictionary } from "./../../src/Collections";

export namespace DictionaryUnitTest
{
    export function run(): void
    {
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Get", get);
        /*describe("Set", set);
        describe("ContainsKey", containsKey);
        describe("ContainsValue", containsValue);
        describe("Remove", remove);
        describe("SetOrUpdate", setOrUpdate);*/
    }

    function copy(): void
    {
        it("Type is a Dictionary", () =>
        {
            const dic = new Dictionary();
            Test.isTrue(dic instanceof Dictionary);
        });

        it("Returns a copy, not a reference", () =>
        {
            const dic = new Dictionary<string, number>();
            const copy = dic.copy();

            Test.isArrayEqual(dic.toArray(), copy.toArray());
            dic.set("lol", 666);
            Test.isArrayNotEqual(dic.toArray(), copy.toArray());
            Test.isArrayEqual(dic.toList().select(t => t.value).toArray(), [666]);
            Test.isArrayEqual(copy.toList().select(t => t.value).toArray(), []);
        });
    }

    function clear(): void
    {
        it("Does nothing on empty dictionary", () =>
        {
            const dic = new Dictionary<number, number>();
            Test.isArrayEqual(dic.toArray(), []);

            dic.clear();
            Test.isArrayEqual(dic.toArray(), []);

            dic.clear();
            Test.isArrayEqual(dic.toArray(), []);
        });

        it("Dictionary is cleared", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 1 },
                { key: 2, value: 2 },
            ]);

            Test.isArrayEqual(dic.select(p => p.value).toArray(), [1, 2]);
            dic.clear();
            Test.isArrayEqual(dic.toArray(), []);
        });
    }

    function get(): void
    {
        it("Value is correct (number)", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 1 },
                { key: 2, value: 2 },
            ]);

            Test.isEqual(dic.get(1), 1);
            Test.isEqual(dic.get(2), 2);
        });

        it("Value is correct (string)", () =>
        {
            const dic = new Dictionary<string, string>([
                { key: "Hello", value: "Hola" },
                { key: "Bye", value: "Adios" },
            ]);

            Test.isEqual(dic.get("Hello"), "Hola");
            Test.isEqual(dic.get("Bye"), "Adios");
        });

        it("Undefined if invalid key", () =>
        {
            const dic = new Dictionary<string, string>([
                { key: "Hello", value: "Hola" },
            ]);

            Test.isEqual(dic.get("Bye"), undefined);
            Test.isEqual(dic.get(":("), undefined);
        });
    }

    /*function set(): void
    {
        it("Adds element in back of the list", () =>
        {
            const list = new List<number>();
            list.push(2); Test.isArrayEqual(list.asArray(), [2]);
            list.push(22); Test.isArrayEqual(list.asArray(), [2, 22]);
            list.push(1); Test.isArrayEqual(list.asArray(), [2, 22, 1]);
            list.push(4); Test.isArrayEqual(list.asArray(), [2, 22, 1, 4]);
        });
    }*/
}
