/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

import { Selector } from "./Types";

export type ComparerResult = -1 | 0 | 1;
export type Comparer<T> = (left: T, right: T) => ComparerResult;

export function defaultComparer<T>(left: T, right: T): ComparerResult
{
    return left < right
        ? -1
        : left > right
            ? 1
            : 0;
}

export function defaultComparerDescending<T>(left: T, right: T): ComparerResult
{
    return left < right
        ? 1
        : left > right
            ? -1
            : 0;
}

export function combineComparers<T>(left: Comparer<T>, right: Comparer<T>): Comparer<T>
{
    return (l: T, r: T) => left(l, r) || right(l, r);
}

export function createComparerForKey<TElement, TKey>(
    selector: Selector<TElement, TKey>,
    ascending: boolean,
    customComparer?: Comparer<TKey>): Comparer<TElement>
{
    const comparer = customComparer !== undefined
        ? customComparer
        : ascending
            ? defaultComparer
            : defaultComparerDescending;

    return (l: TElement, r: TElement) => comparer(selector(l), selector(r));
}
