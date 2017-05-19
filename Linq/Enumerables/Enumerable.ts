/// <reference path="EnumerableBase.ts" />
/// <reference path="../Utils/Cached.ts" />
"use strict";

namespace Linq
{
    export class Enumerable<TElement> extends EnumerableBase<TElement, TElement>
    {
        private _currentValue: Cached<TElement>;

        public static fromSource<TElement>(source: Array<TElement>): IEnumerable<TElement, TElement>;
        public static fromSource<TElement>(source: IIterator<TElement>): IEnumerable<TElement, TElement>;
        public static fromSource<TElement>(source: Array<TElement> | IIterator<TElement>): IEnumerable<TElement, TElement>
        {
            if (source instanceof Array)
            {
                return new Enumerable<TElement>(new ArrayIterator<TElement>(source));
            }

            return new Enumerable<TElement>(source);
        }

        public static empty<TElement>(): IEnumerable<TElement, TElement>
        {
            return new Enumerable<TElement>(new ArrayIterator<TElement>([]));
        }

        public static range(start: number, count: number): IEnumerable<number, number>
        {
            if (count < 0)
            {
                throw new Error("Count must be >= 0");
            }

            const source = [] as Array<number>;

            for (let i = 0; i < count; ++i)
            {
                source.push(start + i);
            }

            return new Enumerable<number>(new ArrayIterator<number>(source));
        }

        public static repeat<TElement>(element: TElement, count: number): IEnumerable<TElement, TElement>
        {
            if (count < 0)
            {
                throw new Error("Count must me >= 0");
            }

            const source = [] as Array<TElement>;

            for (let i = 0; i < count; ++i)
            {
                source.push(element);
            }

            return new Enumerable<TElement>(new ArrayIterator<TElement>(source));
        }

        public constructor(source: IIterator<TElement>)
        {
            super(source);
            this._currentValue = new Cached<TElement>();
        }

        public clone(): IEnumerable<TElement, TElement>
        {
            return new Enumerable<TElement>(this.source.clone());
        }

        public value(): TElement
        {
            if (!this._currentValue.isValid())
            {
                this._currentValue.setValue(this.source.value());
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
    };
}