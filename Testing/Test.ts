type TestBody = (test: Test) => void;

export class Test
{
    public static run(name: string, test: TestBody, showOutput: boolean = true): boolean
    {
        let success: boolean;
        const start = new Date().getTime();

        try
        {
            test(new Test());
            success = true;
        }
        catch (exception)
        {
            success = false;
        }

        if (showOutput)
        {
            const elapsed = new Date().getTime() - start;
            console.log((success ? "\x1b[32m" : "\x1b[31m") + `[${elapsed}ms] ${name}` + "\x1b[39m");
        }

        return success;
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

    public isArrayEqual<T>(left: T[], right: T[]): void
    {
        this.isTrue(left.length === right.length
            && left.every((e: T, i: number) => e === right[i]));
    }

    public isArrayNotEqual<T>(left: T[], right: T[]): void
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
