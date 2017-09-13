import { Cached } from "../src/Utils";
import { Test } from "./Test";

export namespace UtilsTests
{
    export function run(): void
    {
        describe("Constructor", constructor);
        describe("Value", value);
        describe("Invalidate", invalidate);
    }

    function constructor(): void
    {
        it("Starts invalidated", () =>
        {
            const c = new Cached<number>();
            Test.isFalse(c.isValid());
        });
    }

    function value(): void
    {
        it("Throws exception if invalid", () =>
        {
            const c = new Cached<number>();
            Test.isFalse(c.isValid());
            Test.throwsException(() => { const x = c.value; });
        });

        it("Validate on value set", () =>
        {
            const c = new Cached<number>();
            Test.isFalse(c.isValid());
            c.value = 33;
            Test.isTrue(c.isValid());
        });

        it("Get value", () =>
        {
            const c = new Cached<number>();
            c.value = 33;
            Test.isEqual(c.value, 33);
        });
    }

    function invalidate(): void
    {
        it("Do nothing if already invalid", () =>
        {
            const c = new Cached<number>();
            Test.isFalse(c.isValid());

            c.invalidate();
            c.invalidate();
            c.invalidate();

            Test.isFalse(c.isValid());
        });

        it("Make invalid if it was valid", () =>
        {
            const c = new Cached<number>();
            Test.isFalse(c.isValid());
            c.value = 33;
            Test.isTrue(c.isValid());
            c.invalidate();
            Test.isFalse(c.isValid());
        });
    }
}
