/// <reference path="EnumerableBase.ts" />
/// <reference path="../Utils/Cached.ts" />
"use strict";

namespace Linq
{
    export class TransformEnumerable<TElement, TOut> extends EnumerableBase<TElement, TOut>
    {
        private _transform: Selector<TElement, TOut>;
        private _currentValue: Cached<TOut>;

        public constructor(source: IIterator<TElement>, transform: Selector<TElement, TOut>)
        {
            super(source);
            this._transform = transform;
            this._currentValue = new Cached<TOut>();
        }

        public clone(): IEnumerable<TElement, TOut>
        {
            return new TransformEnumerable<TElement, TOut>(this.source.clone(), this._transform);
        }

        public value(): TOut
        {
            if (!this._currentValue.isValid())
            {
                this._currentValue.setValue(this._transform(this.source.value()));
            }

            return this._currentValue.getValue();
        }

        public reset(): void
        {
            super.reset();
            this._currentValue.invalidate();
        }

        public next(): boolean
        {
            this._currentValue.invalidate();
            return super.next();
        }
    }
}