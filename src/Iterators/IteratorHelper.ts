import { IteratorResult } from ".";

export function doneResult<T>(): IteratorResult<T>
{
    // tslint:disable-next-line:no-object-literal-type-assertion
    return { done: true } as IteratorResult<T>;
}

export function valueResult<T>(value: T): IteratorResult<T>
{
    return { done: false, value };
}
