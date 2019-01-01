import { Enumerable } from ".";
import { Predicate } from "../Core";
import { Iterator, WhereIterator } from "../Iterators";
import { EnumerableBase } from "./EnumerableBase";

export class WhereEnumerable<T> extends EnumerableBase<T, T>
{
    public constructor(
        protected source: Enumerable<T>,
        protected predicate: Predicate<T>)
    {
        super();
    }

    public iterator(): Iterator<T>
    {
        return new WhereIterator(this.source.iterator(), this.predicate);
    }
}
