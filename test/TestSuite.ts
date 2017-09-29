import { UtilsUnitTest } from "./unitary/Utils.test";
import { IteratorUnitTest } from "./unitary/Iterator.test";
import { EnumerableUnitTest } from "./unitary/Enumerable.test";
import { IEnumerableUnitTest } from "./unitary/IEnumerable.test";
import { IQueryableUnitTest } from "./unitary/IQueryable.test";
import { IEnumerableIntegrationTest } from "./integration/IEnumerable.test";

describe("Unit Tests", () =>
{
    describe("Utils", UtilsUnitTest.run);
    describe("Iterators", IteratorUnitTest.run);
    describe("Enumerable (static)", EnumerableUnitTest.run);
    describe("IEnumerable", IEnumerableUnitTest.run);
    describe("IQueryable", IQueryableUnitTest.run);
});

describe("Integration", IEnumerableIntegrationTest.run);
