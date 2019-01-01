import { Iterable } from "../Iterators";
import { ArrayEnumerable } from "./ArrayEnumerable";

export interface IEnumerable<TOut> extends /*IQueryable<TOut>,*/ Iterable<TOut>
{
}

export namespace Enumerable
{
    export function fromSource<T>(source: T[] | Iterable<T>): IEnumerable<T>
    {
        if (Array.isArray(source))
        {
            return new ArrayEnumerable<T>(source);
        }

        throw new Error("asd");
        // return new Enumerable<T>(source);
    }
}
