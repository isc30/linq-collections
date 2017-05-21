type TestBody = (test: Test) => void;

export class Test
{
    public static run(name: string, test: TestBody)
    {
        try
        {
            test(new Test());
            console.log(`\x1b[32m${name}\x1b[0m`);
        }
        catch (exception)
        {
            console.log(`\x1b[31m${name}\x1b[0m`);
        }
    }

    public isTrue(result: boolean): void
    {
        if (!result)
        {
            throw new Error("Assertion failed");
        }
    }

    public isFalse(result: boolean): void
    {
        this.isTrue(!result);
    }

    public equals(first: any, second: any): void
    {
        this.isTrue(first === second);
    }

    public notEquals(first: any, second: any): void
    {
        this.isFalse(first === second);
    }

    public arrayEquals<T>(left: Array<T>, right: Array<T>): void
    {
        this.isTrue(left.length === right.length
            && left.every((e: T, i: number) => e === right[i]));
    }

    public arrayNotEquals<T>(left: Array<T>, right: Array<T>): void
    {
        this.isFalse(left.length === right.length
            && left.every((e: T, i: number) => e === right[i]));
    }

    public throwsException(call: () => void): void
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
