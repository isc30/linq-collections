export namespace Test
{
    export function isTrue(result: boolean): void
    {
        if (result !== true)
        {
            throw new Error("Assertion failed");
        }
    }

    export function isFalse(result: boolean): void
    {
        isTrue(result === false);
    }

    export function isEqual(first: any, second: any): void
    {
        isTrue(first === second);
    }

    export function isNotEqual(first: any, second: any): void
    {
        isFalse(first === second);
    }

    export function isArrayEqual<T>(left: T[], right: T[]): void
    {
        isTrue(left.length === right.length
            && left.every((e: T, i: number) => e === right[i]));
    }

    export function isArrayNotEqual<T>(left: T[], right: T[]): void
    {
        isFalse(left.length === right.length
            && left.every((e: T, i: number) => e === right[i]));
    }

    export function throwsException(call: () => void): void
    {
        try
        {
            call();
        }
        catch (ex)
        {
            return;
        }

        throw new Error("Exception was expected");
    }
}
