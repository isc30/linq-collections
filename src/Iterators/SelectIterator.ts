import { Selector } from "@lib/Core";
import { IteratorBase } from "./IteratorBase";
import { doneResult, valueResult } from "./IteratorHelper";

export class SelectIterator<TIn, TOut> extends IteratorBase<TOut>
{
    private readonly _source: Iterator<TIn>;
    private readonly _selector: Selector<TIn, TOut>;

    public constructor(
        source: Iterator<TIn>,
        selector: Selector<TIn, TOut>)
    {
        super();

        this._source = source;
        this._selector = selector;
    }

    public next(): IteratorResult<TOut>
    {
        const next = this._source.next();

        if (next.done)
        {
            return doneResult();
        }

        return valueResult(this._selector(next.value));
    }
}
