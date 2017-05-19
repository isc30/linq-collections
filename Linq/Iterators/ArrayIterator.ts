"use strict";

namespace Linq
{
    export class ArrayIterator<TElement> implements IIterator<TElement>
    {
        private readonly _source: Array<TElement>;
        private _index: number;

        public constructor(source: Array<TElement>)
        {
            this._source = source;
            this.reset();
        }

        public clone(): ArrayIterator<TElement>
        {
            return new ArrayIterator<TElement>(this._source);
        }

        public reset(): void
        {
            this._index = -1;
        }

        private isValidIndex(): boolean
        {
            return this._index >= 0 && this._index < this._source.length;
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

            return this._source[this._index];
        }
    }
}