import { Test } from "./../Test";
import { Dictionary } from "./../../src/Collections";

export namespace DictionaryUnitTest
{
    export function run(): void
    {
        describe("fromJsObject", fromJsObject);
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Get", get);
        describe("Set", set);
        describe("SetOrUpdate", setOrUpdate);
        describe("ContainsKey", containsKey);
        describe("ContainsValue", containsValue);
        describe("GetKeys", getKeys);
        describe("GetValues", getValues);
        describe("Remove", remove);
    }

    function fromJsObject(): void
    {
        it("Empty object", () =>
        {
            const dic = Dictionary.fromJsObject({});

            Test.isArrayEqual(dic.getKeys().toArray(), []);
        });

        it("Single property (string)", () =>
        {
            const dic = Dictionary.fromJsObject<string>({
                hello: "hola",
            });

            Test.isArrayEqual(dic.getKeys().toArray(), ["hello"]);
            Test.isEqual(dic.get("hello"), "hola");
        });

        it("Single property (number)", () =>
        {
            const dic = Dictionary.fromJsObject<number>({
                hello: 123,
            });

            Test.isArrayEqual(dic.getKeys().toArray(), ["hello"]);
            Test.isEqual(dic.get("hello"), 123);
        });

        it("Multiple properties (string)", () =>
        {
            const dic = Dictionary.fromJsObject<string>({
                hello: "hola",
                bye: "adios"
            });

            Test.isArrayEqual(dic.getKeys().toArray(), ["hello", "bye"]);
            Test.isArrayEqual(dic.getValues().toArray(), ["hola", "adios"]);
            Test.isEqual(dic.get("hello"), "hola");
            Test.isEqual(dic.get("bye"), "adios");
        });

        it("Multiple properties (number)", () =>
        {
            const dic = Dictionary.fromJsObject<number>({
                hello: 123,
                bye: 666,
            });

            Test.isArrayEqual(dic.getKeys().toArray(), ["hello", "bye"]);
            Test.isArrayEqual(dic.getValues().toArray(), [123, 666]);
            Test.isEqual(dic.get("hello"), 123);
            Test.isEqual(dic.get("bye"), 666);
        });
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

        it("Exception if invalid key", () =>
        {
            const dic = new Dictionary<string, string>([
                { key: "Hello", value: "Hola" },
            ]);

            Test.throwsException(() => dic.get("Bye"));
            Test.throwsException(() => dic.get(":("));
        });
    }

    function set(): void
    {
        it("Value is set correctly", () =>
        {
            const dic = new Dictionary<string, string>();

            dic.set("hola", "hello");
            Test.isEqual(dic.get("hola"), "hello");
        });

        it("Throws exception if key already exists", () =>
        {
            const dic = new Dictionary<string, string>([
                { key: "hola", value: "hello" },
            ]);

            Test.throwsException(() => dic.set("hola", "nope"));
        });
    }

    function setOrUpdate(): void
    {
        it("Value is set correctly", () =>
        {
            const dic = new Dictionary<string, string>();

            dic.setOrUpdate("hola", "hello");
            Test.isEqual(dic.get("hola"), "hello");
        });

        it("Replace value if key already exists", () =>
        {
            const dic = new Dictionary<string, string>([
                { key: "hola", value: "hello" },
            ]);

            dic.setOrUpdate("hola", "nope");
            Test.isEqual(dic.get("hola"), "nope");
        });
    }

    function containsKey(): void
    {
        it("Returns correct value", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);

            Test.isTrue(dic.containsKey(1));
            Test.isTrue(dic.containsKey(22));
            Test.isFalse(dic.containsKey(-1));
            Test.isFalse(dic.containsKey(0));
            Test.isFalse(dic.containsKey(2));
            Test.isFalse(dic.containsKey(101));
            Test.isFalse(dic.containsKey(122));

            Test.isFalse(dic.containsKey(5));
            dic.set(5, 105);
            Test.isTrue(dic.containsKey(5));
        });
    }

    function containsValue(): void
    {
        it("Returns correct value", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);

            Test.isTrue(dic.containsValue(101));
            Test.isTrue(dic.containsValue(122));
            Test.isFalse(dic.containsValue(-1));
            Test.isFalse(dic.containsValue(0));
            Test.isFalse(dic.containsValue(2));
            Test.isFalse(dic.containsValue(1));
            Test.isFalse(dic.containsValue(22));

            Test.isFalse(dic.containsValue(105));
            dic.set(5, 105);
            Test.isTrue(dic.containsValue(105));
        });
    }

    function getKeys(): void
    {
        it("Returns correct value (number)", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);

            Test.isArrayEqual(dic.getKeys().asArray(), [1, 22]);
        });

        it("Returns correct value (string)", () =>
        {
            const dic = new Dictionary<string, number>([
                { key: "hola", value: 101 },
                { key: "adios", value: 122 },
            ]);

            Test.isArrayEqual(dic.getKeys().asArray(), ["hola", "adios"]);
        });
    }

    function getValues(): void
    {
        it("Returns correct value (number)", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);

            Test.isArrayEqual(dic.getValues().asArray(), [101, 122]);
        });

        it("Returns correct value (string)", () =>
        {
            const dic = new Dictionary<string, string>([
                { key: "hola", value: "iepe" },
                { key: "adios", value: "talue" },
            ]);

            Test.isArrayEqual(dic.getValues().asArray(), ["iepe", "talue"]);
        });
    }

    function remove(): void
    {
        it("Does nothing if key doesn't exist", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);

            Test.isArrayEqual(dic.getKeys().asArray(), [1, 22]);
            dic.remove(66);
            Test.isArrayEqual(dic.getKeys().asArray(), [1, 22]);
        });

        it("Removes key", () =>
        {
            const dic = new Dictionary<number, number>([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
                { key: 33, value: 1322 },
            ]);

            Test.isArrayEqual(dic.getKeys().asArray(), [1, 22, 33]);
            dic.remove(22);
            Test.isArrayEqual(dic.getKeys().asArray(), [1, 33]);
            dic.remove(1);
            Test.isArrayEqual(dic.getKeys().asArray(), [33]);
            dic.remove(33);
            Test.isArrayEqual(dic.getKeys().asArray(), []);
        });
    }
}
