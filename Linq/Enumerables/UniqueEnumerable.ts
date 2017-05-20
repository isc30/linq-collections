"use strict";

namespace Linq
{
    export class UniqueEnumerable<TElement> extends Enumerable<TElement>
    {
        private _seenElements: Array<TElement>;

        public constructor(source: IIterator<TElement>)
        {
            super(source);
            this._seenElements = [];
        }

        public clone(): IEnumerable<TElement, TElement>
        {
            return new UniqueEnumerable<TElement>(this.source.clone());
        }

        public reset(): void
        {
            super.reset();
            this._seenElements = [];
        }

        private isUnique(element: TElement): boolean
        {
            if (this._seenElements.indexOf(element) < 0)
            {
                this._seenElements.push(element);
                return true;
            }

            return false;
        }

        public next(): boolean
        {
            let hasValue: boolean;

            do
            {
                hasValue = super.next();
            }
            while (hasValue && !this.isUnique(this.value()));

            return hasValue;
        }
    }
}