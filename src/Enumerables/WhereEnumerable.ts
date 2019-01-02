import { Predicate } from "@lib/Core";
import { Iterator, WhereIterator } from "@lib/Iterators";
import { Enumerable } from ".";
import { EnumerableBase } from "./EnumerableBase";

export class WhereEnumerable<T> extends EnumerableBase<T>
{
    private readonly _source: Enumerable<T>;
    private readonly _predicate: Predicate<T>;

    public constructor(
        source: Enumerable<T>,
        predicate: Predicate<T>)
    {
        super();

        this._source = source;
        this._predicate = predicate;
    }

    public iterator(): Iterator<T>
    {
        return new WhereIterator(this._source.iterator(), this._predicate);
    }
}
