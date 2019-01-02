import { Enumerable, WhereEnumerable } from ".";
import { Predicate, Selector } from "../Core";
import { SelectEnumerable } from "./SelectEnumerable";

export function where<T>(
    source: Enumerable<T>,
    predicate: Predicate<T>,
): Enumerable<T>
{
    return new WhereEnumerable(source, predicate);
}

export function select<TIn, TOut>(
    source: Enumerable<TIn>,
    selector: Selector<TIn, TOut>,
): Enumerable<TOut>
{
    return new SelectEnumerable(source, selector);
}

export function toArray<T>(source: Enumerable<T>): T[]
{
    const result: T[] = [];
    const it = source.iterator();

    let current = it.next();

    while (!current.done)
    {
        result.push(current.value);
        current = it.next();
    }

    return result;
}
