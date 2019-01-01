import { ArrayEnumerable } from ".";
import { Predicate } from "../Core";
import { Iterable } from "../Iterators";

export interface Enumerable<TOut> extends Iterable<TOut>
{
    where(predicate: Predicate<TOut>): Enumerable<TOut>;

    toArray(): TOut[];
}

export namespace Enumerable
{
    export function fromSource<T>(source: T[] | Iterable<T>): Enumerable<T>
    {
        if (Array.isArray(source))
        {
            return new ArrayEnumerable<T>(source);
        }

        throw new Error("asd");
        // return new Enumerable<T>(source);
    }
}
