type TestBody = (test: Test) => void;

export class Test
{
    public static run(name: string, test: TestBody)
    {
        var color: string;
        var clearColor: string = "\x1b[30m";

        var start = new Date().getTime();

        try
        {
            test(new Test());
            color = "\x1b[32m";
        }
        catch (exception)
        {
            color = "\x1b[31m";
        }

        var elapsed = new Date().getTime() - start;

        console.log(color + `[${elapsed}ms] ${name}` + clearColor);
    }

    private constructor()
    {
        // No external instantiation
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
        this.isTrue(result === false);
    }

    public isEqual(first: any, second: any): void
    {
        this.isTrue(first === second);
    }

    public isNotEqual(first: any, second: any): void
    {
        this.isFalse(first === second);
    }

    public isArrayEqual<T>(left: Array<T>, right: Array<T>): void
    {
        this.isTrue(left.length === right.length
            && left.every((e: T, i: number) => e === right[i]));
    }

    public isArrayNotEqual<T>(left: Array<T>, right: Array<T>): void
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
