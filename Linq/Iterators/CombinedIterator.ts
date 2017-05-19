"use strict";

namespace Linq
{
    export class CombinedIterator<TElement> implements IIterator<TElement>
    {
        private readonly _first: IIterator<TElement>;
        private readonly _second: IIterator<TElement>;
        private _isFirstFinished: boolean;

        public constructor(first: IIterator<TElement>, second: IIterator<TElement>)
        {
            this._first = first;
            this._second = second;
            this._isFirstFinished = false;

            this.reset();
        }

        public clone(): IIterator<TElement>
        {
            return new CombinedIterator<TElement>(this._first.clone(), this._second.clone());
        }

        public reset(): void
        {
            this._first.reset();
            this._second.reset();
            this._isFirstFinished = false;
        }

        public next(): boolean
        {
            const hasValue = !this._isFirstFinished
                ? this._first.next()
                : this._second.next();

            if (!hasValue && !this._isFirstFinished)
            {
                this._isFirstFinished = true;

                return this.next();
            }

            return hasValue;
        }

        public value(): TElement
        {
            return !this._isFirstFinished
                ? this._first.value()
                : this._second.value();
        }
    }
}