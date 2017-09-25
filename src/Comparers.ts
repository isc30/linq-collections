/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

import { Selector, Dynamic } from "./Types";

type NewComparer = <T>(left: T, right: T) => number;

export class Comparer<T>
{
    protected _isAscending: boolean;

    public constructor(isAscending: boolean)
    {
        this._isAscending = isAscending;
    }

    public compare(left: Dynamic, right: Dynamic): number
    {
        return this._isAscending
            ? left < right
                ? -1
                : right < left
                    ? 1
                    : 0
            : left > right
                ? -1
                : right > left
                    ? 1
                    : 0;
    }

    public then(other: Comparer<T>): Comparer<T>
    {
        return new ComparerChain(this, other);
    }
}

export class KeyComparer<TElement, TKey> extends Comparer<TElement>
{
    private _keySelector: Selector<TElement, TKey>;

    public constructor(keySelector: Selector<TElement, TKey>, isAscending: boolean)
    {
        super(isAscending);
        this._keySelector = keySelector;
    }

    public compare(left: TElement, right: TElement): number
    {
        return super.compare(
            this._keySelector(left),
            this._keySelector(right));
    }
}

export class CustomComparer<T> extends Comparer<T>
{
    private _comparer: (left: T, right: T) => number;

    public constructor(comparer: (left: T, right: T) => number)
    {
        super(true);
        this._comparer = comparer;
    }

    public compare(left: T, right: T): number
    {
        return this._comparer(left, right);
    }
}

class ComparerChain<T> extends Comparer<T>
{
    private _comparers: Array<Comparer<T>>;

    public constructor(...comparers: Array<Comparer<T>>)
    {
        super(true);
        this._comparers = comparers;
    }

    public compare(left: T, right: T): number
    {
        for (const comparer of this._comparers)
        {
            const result = comparer.compare(left, right);

            if (result !== 0)
            {
                return result;
            }
        }

        return 0;
    }

    public then(other: Comparer<T>): Comparer<T>
    {
        return new ComparerChain(...this._comparers, other);
    }
}
