/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

import { Enumerable, IEnumerable, ArrayEnumerable, ICollection } from "./Enumerables";
import { ArrayIterator } from "./Iterators";

interface IKeyValuePair<TKey, TValue>
{
    key: TKey;
    value: TValue;
}

export interface IList<TElement>// extends ILinq<TElement>
{
    asEnumerable(): IEnumerable<TElement>;
    clone(): IList<TElement>;
    clear(): void;
    at(index: number): TElement | undefined;
    add(element: TElement): void;
    indexOf(element: TElement): number | undefined;
    insert(index: number, element: TElement): void;
}

export class List<TElement> implements IList<TElement>
{
    protected _source: TElement[];

    public constructor(elements: TElement[])
    {
        this._source = elements;
    }

    public asEnumerable(): IEnumerable<TElement>
    {
        return Enumerable.fromSource<TElement>(this.asArray());
    }

    public asArray(): TElement[]
    {
        return this._source;
    }

    public toArray(): TElement[]
    {
        return ([] as TElement[]).concat(this._source);
    }

    public clone(): IList<TElement>
    {
        return new List<TElement>(this.toArray());
    }

    public clear(): void
    {
        this._source = [];
    }

    public at(index: number): TElement | undefined
    {
        /*if (!this.isValidIndex(index))
        {
            throw new Error("Out of bounds");
        }*/

        return this._source[index];
    }

    public add(...elements: TElement[]): void
    {
        this._source.push(...elements);
    }

    public contains(element: TElement): boolean
    {
        return this._source.indexOf(element) !== undefined;
    }

    public insert(index: number, element: TElement): void
    {
        this._source.splice(index, 0, element);
    }

    public indexOf(element: TElement): number
    {
        return this._source.indexOf(element);
    }

    protected isValidIndex(index: number): boolean
    {
        return index >= 0 && index < this._source.length;
    }
}
