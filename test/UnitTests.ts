import { EnumerableTests } from "./Linq/EnumerableTests";
import { IEnumerableTests } from "./Linq/IEnumerableTests";
import { UtilsTests } from "./Utils/UtilsTest";
import { IEnumerableIntegrationTests } from "./Linq/IEnumerableIntegrationTests";
import { IteratorTests } from "./Iterators/IteratorTests";

describe("Utils", UtilsTests.run);
describe("Iterators", IteratorTests.run);

describe("Linq", () =>
{
    describe("Enumerable", EnumerableTests.run);
    describe("IEnumerable", IEnumerableTests.run);
});

describe("Integration", IEnumerableIntegrationTests.run);
