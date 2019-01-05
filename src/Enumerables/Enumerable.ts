import { Predicate, Selector } from "@lib/Core";
import { Iterable } from "@lib/Iterators";
import { arrayEnumerable } from "./ArrayEnumerable";
import { EnumerableBase } from "./EnumerableBase";
import { WhereExtension } from "./WhereExtension";

export interface Queryable<T> extends WhereExtension<T>
{
    select<TOut>(selector: Selector<T, TOut>): Enumerable<TOut>;

    toArray(): T[];
}

export interface Enumerable<T> extends Queryable<T>, Iterable<T>
{
}

export namespace Enumerable
{
    export function fromSource<T>(source: T[] | Iterable<T>): Enumerable<T>
    {
        if (Array.isArray(source))
        {
            return arrayEnumerable(source);
        }

        return new EnumerableBase(() => source.iterator());
    }
}
