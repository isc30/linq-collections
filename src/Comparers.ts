/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

import { Selector } from "./Types";

export type ComparerResult = -1 | 0 | 1;
export type Comparer<T> = (left: T, right: T) => ComparerResult;

export function combineComparers<T>(left: Comparer<T>, right: Comparer<T>): Comparer<T>
{
    return (l: T, r: T) => left(l, r) || right(l, r);
}

export function compare<T, TKey>(left: T, right: T, keySelector: Selector<T, TKey>, ascending: boolean): ComparerResult
{
    const leftKey = keySelector(left);
    const rightKey = keySelector(right);

    if (ascending)
    {
        return leftKey < rightKey
            ? -1
            : leftKey > rightKey
                ? 1
                : 0;
    }

    return leftKey < rightKey
        ? 1
        : leftKey > rightKey
            ? -1
            : 0;
}

export function createComparer<TElement, TKey>(
    keySelector: Selector<TElement, TKey>,
    ascending: boolean,
    customComparer?: Comparer<TKey>): Comparer<TElement>
{
    if (customComparer !== undefined)
    {
        return (l: TElement, r: TElement) => customComparer(keySelector(l), keySelector(r));
    }

    return (l: TElement, r: TElement) => compare(l, r, keySelector, ascending);
}
