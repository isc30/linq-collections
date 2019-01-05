import { IteratorResult } from "./ES6";
import { IteratorBase } from "./IteratorBase";
import { doneResult, valueResult } from "./IteratorHelper";

export class ArrayIterator<T> extends IteratorBase<T>
{
    private readonly _source: T[];
    private _index: number;

    public constructor(
        source: T[])
    {
        super();

        this._source = source;
        this._index = -1;
    }

    public next(): IteratorResult<T>
    {
        ++this._index;

        if (this._index >= this._source.length)
        {
            return doneResult();
        }

        return valueResult(this._source[this._index]);
    }
}
