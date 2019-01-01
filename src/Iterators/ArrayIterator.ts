import { IterableIterator, IteratorResult } from "./ES6";
import { IteratorBase } from "./IteratorBase";

export class ArrayIterator<T> extends IteratorBase<T>
{
    private readonly _source: T[];
    private _index: number;

    public constructor(source: T[])
    {
        super();

        this._source = source;
        this._index = -1;
    }

    public next(): IteratorResult<T>
    {
        ++this._index;

        return {
            done: this._index >= this._source.length,
            value: this._source[this._index],
        };
    }
}
