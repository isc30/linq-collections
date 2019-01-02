import { Predicate, Selector } from "@lib/Core";
import { Iterable } from "@lib/Iterators";
import { ArrayEnumerable } from ".";
import { IterableEnumerable } from "./IterableEnumerable";

export interface Enumerable<T> extends Iterable<T>
{
    where(predicate: Predicate<T>): Enumerable<T>;

    select<TOut>(selector: Selector<T, TOut>): Enumerable<TOut>;

    toArray(): T[];
}

export namespace Enumerable
{
    export function fromSource<T>(source: T[] | Iterable<T>): Enumerable<T>
    {
        if (Array.isArray(source))
        {
            return new ArrayEnumerable<T>(source);
        }

        return new IterableEnumerable<T>(source);
    }
}
