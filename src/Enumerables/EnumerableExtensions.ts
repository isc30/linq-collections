import { Enumerable, WhereEnumerable } from ".";
import { Selector } from "../Core";

export function where<T>(
    source: Enumerable<T>,
    predicate: Selector<T, boolean>,
): Enumerable<T>
{
    return new WhereEnumerable(source, predicate);
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
