"use strict";

namespace Linq
{
    export interface IIterator<TElement>
    {
        clone(): IIterator<TElement>;
        reset(): void;
        next(): boolean;
        value(): TElement;
    }
}