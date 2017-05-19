"use strict";

namespace Linq
{
    export type Selector<TElement, TOut> = (element: TElement) => TOut;
    export type Predicate<TElement> = Selector<TElement, boolean>;
    export type Aggregator<TElement, TValue> = (previous: TValue, current: TElement) => TValue;

    export interface IEnumerable<TElement, TOut> extends IIterator<TOut>
    {
        clone(): IEnumerable<TElement, TOut>;

        toArray(): Array<TOut>;

        count(): number;
        count(predicate: Predicate<TOut>): number;

        any(): boolean;
        any(predicate: Predicate<TOut>): boolean;

        all(predicate: Predicate<TOut>): boolean;

        contains(element: TOut): boolean;

        where(predicate: Predicate<TOut>): IEnumerable<TOut, TOut>;

        select<TPredicateOut>(selector: Selector<TOut, TPredicateOut>): IEnumerable<TOut, TPredicateOut>;

        concat(other: IEnumerable<TElement, TOut>): IEnumerable<TOut, TOut>;

        first(): TOut;
        first(predicate: Predicate<TOut>): TOut;

        firstOrDefault(): TOut | undefined;
        firstOrDefault(predicate: Predicate<TOut>): TOut | undefined;

        single(): TOut;
        single(predicate: Predicate<TOut>): TOut;

        singleOrDefault(): TOut | undefined;
        singleOrDefault(predicate: Predicate<TOut>): TOut | undefined;

        aggregate(aggregator: Aggregator<TOut, TOut | undefined>): TOut;
        aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue: TValue): TValue;

        min(): TOut;
        min<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

        max(): TOut;
        max<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

        sum(): TOut;
        sum<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;
    }
}