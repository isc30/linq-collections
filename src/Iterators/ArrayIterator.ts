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

        return {
            done: this._index >= this._source.length,
            value: this._source[this._index],
        };
    }

    public iterator(): IterableIterator<TElement>
    {
        return this;
    }

    public [Symbol.iterator](): IterableIterator<TElement>
    {
        return this.iterator();
    }
}
