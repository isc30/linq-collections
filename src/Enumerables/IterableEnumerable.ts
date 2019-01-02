import { Iterable, Iterator } from "@lib/Iterators";
import { EnumerableBase } from "./EnumerableBase";

export class IterableEnumerable<T> extends EnumerableBase<T>
{
    private readonly _iterable: Iterable<T>;

    public constructor(
        iterable: Iterable<T>)
    {
        super();

        this._iterable = iterable;
    }

    public iterator(): Iterator<T>
    {
        return this._iterable.iterator();
    }
}
