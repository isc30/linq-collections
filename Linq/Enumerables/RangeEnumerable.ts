/// <reference path="Enumerable.ts" />
"use strict";

namespace Linq
{
    export class RangeEnumerable<TElement> extends Enumerable<TElement>
    {
        private _start: number | undefined;
        private _count: number | undefined;
        private _current: number;

        public constructor(source: IIterator<TElement>, start: number | undefined, count: number | undefined)
        {
            if ((start !== undefined && start < 0) || (count !== undefined && count < 0))
            {
                throw new Error("Incorrect parameters");
            }

            super(source);
            this._start = start;
            this._count = count;
            this._current = -1;
        }

        public clone(): IEnumerable<TElement, TElement>
        {
            return new RangeEnumerable<TElement>(this.source.clone(), this._start, this._count);
        }

        public reset(): void
        {
            super.reset();
            this._current = -1;
        }

        private isValidIndex(): boolean
        {
            const start = this._start !== undefined ? this._start : 0;
            const end = this._count !== undefined ? start + this._count : undefined;

            return this._current >= start && (end === undefined || this._current < end);
        }

        private performSkip(): boolean
        {
            const start = this._start !== undefined ? this._start : 0;
            let hasValue: boolean = true;

            while (hasValue && this._current + 1 < start )
            {
                hasValue = super.next();
                ++this._current;
            }

            return hasValue;
        }

        public next(): boolean
        {
            if (this._current < 0 && !this.performSkip())
            {
                return false;
            }

            ++this._current;

            return super.next() && this.isValidIndex();
        }

        public value(): TElement
        {
            if (!this.isValidIndex())
            {
                throw new Error("Out of bounds");
            }

            return super.value();
        }
    }
}