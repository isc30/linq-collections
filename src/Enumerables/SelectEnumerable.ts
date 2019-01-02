import { Selector } from "@lib/Core";
import { Iterator, SelectIterator } from "@lib/Iterators";
import { Enumerable } from ".";
import { EnumerableBase } from "./EnumerableBase";

export class SelectEnumerable<TIn, TOut> extends EnumerableBase<TOut>
{
    private readonly _source: Enumerable<TIn>;
    private readonly _selector: Selector<TIn, TOut>;

    public constructor(
        source: Enumerable<TIn>,
        selector: Selector<TIn, TOut>)
    {
        super();

        this._source = source;
        this._selector = selector;
    }

    public iterator(): Iterator<TOut>
    {
        return new SelectIterator(this._source.iterator(), this._selector);
    }
}
