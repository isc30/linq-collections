/// <reference path="Enumerable.ts" />
"use strict";

namespace Linq
{
    export class ConditionalEnumerable<TElement> extends Enumerable<TElement>
    {
        private _predicate: Predicate<TElement>;

        public constructor(source: IIterator<TElement>, predicate: Predicate<TElement>)
        {
            super(source);
            this._predicate = predicate;
        }

        public clone(): IEnumerable<TElement, TElement>
        {
            return new ConditionalEnumerable<TElement>(this.source.clone(), this._predicate);
        }

        public next(): boolean
        {
            let hasValue: boolean;

            do
            {
                hasValue = super.next();
            }
            while (hasValue && !this._predicate(this.value()));

            return hasValue;
        }
    }
}