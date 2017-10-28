import { UtilsUnitTest } from "./unitary/Utils.test";
import { IteratorUnitTest } from "./unitary/Iterator.test";
import { EnumerableUnitTest } from "./unitary/Enumerable.test";
import { IQueryableUnitTest } from "./unitary/IQueryable.test";
import { ListUnitTest } from "./unitary/List.test";
import { StackUnitTest } from "./unitary/Stack.test";
import { IEnumerableIntegrationTest } from "./integration/IEnumerable.test";
import { DictionaryUnitTest } from "./unitary/Dictionary.test";

describe("Unit Tests", () =>
{
    describe("Utils", UtilsUnitTest.run);
    describe("Enumerable (static)", EnumerableUnitTest.run);
    describe("Iterators", IteratorUnitTest.run);
    describe("IQueryable", IQueryableUnitTest.run);
    describe("List", ListUnitTest.run);
    describe("Stack", StackUnitTest.run);
    describe("Dictionary", DictionaryUnitTest.run);
});

describe("Integration Tests", () =>
{
    describe("IEnumerable", IEnumerableIntegrationTest.run);
});
