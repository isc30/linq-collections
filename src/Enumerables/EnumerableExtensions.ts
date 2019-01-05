import { Enumerable } from ".";

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
