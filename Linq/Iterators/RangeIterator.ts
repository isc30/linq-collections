"use strict";

namespace Linq
{
    export class RangeIterator<TElement> implements IIterator<TElement>
    {
        private readonly _source: IIterator<TElement>;
        private _index: number;

        private readonly _skip: number | undefined;
        private readonly _take: number | undefined;

        public constructor(source: IIterator<TElement>, skip: number | undefined, take: number | undefined)
        {
            if ((skip !== undefined && skip < 0) || (take !== undefined && take < 0))
            {
                throw new Error("Incorrect parameters");
            }

            this._source = source;
            this._skip = skip;
            this._take = take;

            this.reset();
        }

        public clone(): IIterator<TElement>
        {
            return new RangeIterator<TElement>(this._source.clone(), this._skip, this._take);
        }

        public reset(): void
        {
            this._index = -1;

            this._source.reset();
        }

        private isValidIndex(): boolean
        {
            const start = this._skip !== undefined ? this._skip : 0;
            const end = this._take !== undefined ? start + this._take : undefined;

            return this._index >= start && (end === undefined || this._index < end);
        }

        private performSkip(): boolean
        {
            const start = this._skip !== undefined ? this._skip : 0;
            let hasValue: boolean = true;

            while (hasValue && this._index + 1 < start )
            {
                hasValue = this._source.next();
                ++this._index;
            }

            return hasValue;
        }

        public next(): boolean
        {
            if (this._index < 0 && !this.performSkip())
            {
                return false;
            }

            ++this._index;

            return this._source.next() && this.isValidIndex();
        }

        public value(): TElement
        {
            if (!this.isValidIndex())
            {
                throw new Error("Out of bounds");
            }

            return this._source.value();
        }

    }
}