import { IterableIterator, IteratorResult } from "./ES6";

export class ArrayIterator<TElement> implements IterableIterator<TElement>
{
    private readonly _source: TElement[];
    private _index: number;

    public constructor(source: TElement[])
    {
        this._source = source;
        this._index = -1;
    }

    public next(): IteratorResult<TElement>
    {
        ++this._index;

        const done = this._index >= this._source.length;
        const value = this._source[this._index];

        return { done, value };
    }

    public iterator(): IterableIterator<TElement> {
        return this;
    }
}
