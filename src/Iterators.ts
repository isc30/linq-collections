/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

export interface IIterator<TElement>
{
    clone(): IIterator<TElement>;
    reset(): void;
    next(): boolean;
    value(): TElement;
}

export class ArrayIterator<TElement> implements IIterator<TElement>
{
    protected readonly source: TElement[];
    private _index: number;

    public constructor(source: TElement[])
    {
        this.source = source;
        this.reset();
    }

    public clone(): IIterator<TElement>
    {
        return new ArrayIterator<TElement>(this.source);
    }

    public reset(): void
    {
        this._index = -1;
    }

    private isValidIndex(): boolean
    {
        return this._index >= 0 && this._index < this.source.length;
    }

    public next(): boolean
    {
        ++this._index;

        return this.isValidIndex();
    }

    public value(): TElement
    {
        if (!this.isValidIndex())
        {
            throw new Error("Out of bounds");
        }

        return this.source[this._index];
    }
}
