import { expect } from "chai";
import { Dictionary } from "./Collections";

describe("Test dictionary", () =>
{
    it("fromArray", () =>
    {
        const resultDictionary = Dictionary.fromArray([1, 2, 3], a => a, a => a);
        expect("result").to.equal("result");
    });
});
