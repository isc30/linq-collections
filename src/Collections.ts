/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

// tslint:disable-next-line:max-line-length
import { RangeEnumerable, OrderedEnumerable, IOrderedEnumerable, UniqueEnumerable, ConcatEnumerable, TransformEnumerable, ConditionalEnumerable, ReverseEnumerable, Enumerable, IEnumerable, ArrayEnumerable, IQueryable } from "./Enumerables";
import { Action, Selector,  Aggregator,  Predicate } from "./Types";
import { Comparer, createComparer } from "./Comparers";

interface IKeyValuePair<TKey, TValue>
{
    key: TKey;
    value: TValue;
}

export interface IList<TElement> extends IQueryable<TElement>
{
    toEnumerable(): IEnumerable<TElement>;
    asArray(): TElement[];
    copy(): IList<TElement>;
    clear(): void;
    at(index: number): TElement | undefined;
    add(element: TElement): void;
    indexOf(element: TElement): number | undefined;
    insert(index: number, element: TElement): void;
}

export class List<TElement> implements IList<TElement>
{
    protected source: TElement[];

    public constructor(elements: TElement[])
    {
        this.source = elements;
    }

    public toEnumerable(): IEnumerable<TElement>
    {
        return new ArrayEnumerable(this.source);
    }

    public asArray(): TElement[]
    {
        return this.source;
    }

    public toArray(): TElement[]
    {
        return ([] as TElement[]).concat(this.source);
    }

    public toList(): IList<TElement>
    {
        return this.copy();
    }

    public copy(): IList<TElement>
    {
        return new List<TElement>(this.toArray());
    }

    public clear(): void
    {
        this.source = [];
    }

    public at(index: number): TElement | undefined
    {
        /*if (!this.isValidIndex(index))
        {
            throw new Error("Out of bounds");
        }*/

        return this.source[index];
    }

    public add(...elements: TElement[]): void
    {
        this.source.push(...elements);
    }

    public insert(index: number, element: TElement): void
    {
        this.source.splice(index, 0, element);
    }

    public indexOf(element: TElement): number
    {
        return this.source.indexOf(element);
    }

    /////////////////////////////////////////////////////////////////////////////////////
    // Collection

    public aggregate(aggregator: Aggregator<TElement, TElement | undefined>): TElement;
    public aggregate<TValue>(aggregator: Aggregator<TElement, TValue>, initialValue: TValue): TValue;
    public aggregate<TValue>(
        aggregator: Aggregator<TElement, TValue | TElement | undefined>,
        initialValue?: TValue): TValue | TElement
    {
        if (initialValue !== undefined)
        {
            return this.source.reduce(
                aggregator as Aggregator<TElement, TValue>,
                initialValue);
        }

        return this.source.reduce(aggregator as Aggregator<TElement, TElement>);
    }

    public any(): boolean;
    public any(predicate: Predicate<TElement>): boolean;
    public any(predicate?: Predicate<TElement>): boolean
    {
        if (predicate !== undefined)
        {
            return this.source.some(predicate);
        }

        return this.source.length > 0;
    }

    public all(predicate: Predicate<TElement>): boolean
    {
        return this.source.every(predicate);
    }

    public average(selector: Selector<TElement, number>): number
    {
        if (this.count() === 0)
        {
            throw new Error("Sequence contains no elements");
        }

        let sum = 0;

        for (let i = 0, end = this.source.length; i < end; ++i)
        {
            sum += selector(this.source[i]);
        }

        return sum / this.source.length;
    }

    public count(): number;
    public count(predicate: Predicate<TElement>): number;
    public count(predicate?: Predicate<TElement>): number
    {
        if (predicate !== undefined)
        {
            return this.source.filter(predicate).length;
        }

        // tslint:disable-next-line:no-bitwise
        return this.source.length >>> 0;
    }

    public elementAtOrDefault(index: number): TElement | undefined
    {
        if (index < 0)
        {
            throw new Error("Negative index is forbiden");
        }

        return this.source[index];
    }

    public firstOrDefault(): TElement | undefined;
    public firstOrDefault(predicate: Predicate<TElement>): TElement | undefined;
    public firstOrDefault(predicate?: Predicate<TElement>): TElement | undefined
    {
        if (predicate !== undefined)
        {
            return this.source.filter(predicate)[0];
        }

        return this.source[0];
    }

    public lastOrDefault(): TElement | undefined;
    public lastOrDefault(predicate: Predicate<TElement>): TElement | undefined;
    public lastOrDefault(predicate?: Predicate<TElement>): TElement | undefined
    {
        if (predicate !== undefined)
        {
            const records = this.source.filter(predicate);

            return records[records.length - 1];
        }

        return this.source[this.source.length - 1];
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////

    public reverse(): IEnumerable<TElement>
    {
        return new ReverseEnumerable<TElement>(this.toEnumerable());
    }

    public contains(element: TElement): boolean
    {
        return this.any(e => e === element);
    }

    public where(predicate: Predicate<TElement>): IEnumerable<TElement>
    {
        return new ConditionalEnumerable<TElement>(this.toEnumerable(), predicate);
    }

    public select<TSelectorOut>(selector: Selector<TElement, TSelectorOut>): IEnumerable<TSelectorOut>
    {
        return new TransformEnumerable<TElement, TSelectorOut>(this.toEnumerable(), selector);
    }

    public selectMany<TSelectorOut>(
        selector: Selector<TElement, TSelectorOut[] | IEnumerable<TSelectorOut>>)
        : IEnumerable<TSelectorOut>
    {
        const selectToEnumerable = (e: TElement) =>
        {
            const ie = selector(e);

            return Array.isArray(ie)
                ? Enumerable.fromSource(ie)
                : ie;
        };

        return this
            .select(selectToEnumerable).toArray()
            .reduce((p, c) => new ConcatEnumerable(p, c), Enumerable.empty()) as IEnumerable<TSelectorOut>;
    }

    public concat(other: IEnumerable<TElement>, ...others: Array<IEnumerable<TElement>>): IEnumerable<TElement>
    {
        let result = new ConcatEnumerable<TElement>(this.toEnumerable(), other.copy());

        for (let i = 0, end = others.length; i < end; ++i)
        {
            result = new ConcatEnumerable<TElement>(result, others[i].copy());
        }

        return result;
    }

    public elementAt(index: number): TElement
    {
        const element = this.elementAtOrDefault(index);

        if (element === undefined)
        {
            throw new Error("Out of bounds");
        }

        return element;
    }

    public except(other: IEnumerable<TElement>): IEnumerable<TElement>
    {
        return this.where(e => !other.contains(e));
    }

    public first(): TElement;
    public first(predicate: Predicate<TElement>): TElement;
    public first(predicate?: Predicate<TElement>): TElement
    {
        let element: TElement | undefined;

        if (predicate !== undefined)
        {
            element = this.firstOrDefault(predicate);
        }
        else
        {
            element = this.firstOrDefault();
        }

        if (element === undefined)
        {
            throw new Error("Sequence contains no elements");
        }

        return element;
    }

    public forEach(action: Action<TElement>): void
    {
        for (let i = 0, end = this.source.length; i < end; ++i)
        {
            action(this.source[i], i);
        }
    }

    public last(): TElement;
    public last(predicate: Predicate<TElement>): TElement;
    public last(predicate?: Predicate<TElement>): TElement
    {
        let element: TElement | undefined;

        if (predicate !== undefined)
        {
            element = this.lastOrDefault(predicate);
        }
        else
        {
            element = this.lastOrDefault();
        }

        if (element === undefined)
        {
            throw new Error("Sequence contains no elements");
        }

        return element;
    }

    public single(): TElement;
    public single(predicate: Predicate<TElement>): TElement;
    public single(predicate?: Predicate<TElement>): TElement
    {
        let element: TElement | undefined;

        if (predicate !== undefined)
        {
            element = this.singleOrDefault(predicate);
        }
        else
        {
            element = this.singleOrDefault();
        }

        if (element === undefined)
        {
            throw new Error("Sequence contains no elements");
        }

        return element;
    }

    public singleOrDefault(): TElement | undefined;
    public singleOrDefault(predicate: Predicate<TElement>): TElement | undefined;
    public singleOrDefault(predicate?: Predicate<TElement>): TElement | undefined
    {
        if (predicate !== undefined)
        {
            return this.toEnumerable().singleOrDefault(predicate);
        }

        return this.toEnumerable().singleOrDefault();
    }

    public distinct(): IEnumerable<TElement>;
    public distinct<TKey>(keySelector: Selector<TElement, TKey>): IEnumerable<TElement>;
    public distinct<TKey>(keySelector?: Selector<TElement, TKey>): IEnumerable<TElement>
    {
        return new UniqueEnumerable(this.toEnumerable(), keySelector);
    }

    public min(): TElement;
    public min<TSelectorOut>(selector: Selector<TElement, TSelectorOut>): TSelectorOut;
    public min<TSelectorOut>(selector?: Selector<TElement, TSelectorOut>): TElement | TSelectorOut
    {
        if (selector !== undefined)
        {
            // Don't copy iterators
            return new TransformEnumerable<TElement, TSelectorOut>(this.toEnumerable(), selector).min();
        }

        return this.aggregate((previous, current) =>
            (previous !== undefined && previous < current)
                ? previous
                : current);
    }

    public orderBy<TKey>(
        keySelector: Selector<TElement, TKey>): IOrderedEnumerable<TElement>;
    public orderBy<TKey>(
        keySelector: Selector<TElement, TKey>,
        comparer: Comparer<TKey>): IOrderedEnumerable<TElement>;
    public orderBy<TKey>(
        keySelector: Selector<TElement, TKey>,
        comparer?: Comparer<TKey>): IOrderedEnumerable<TElement>
    {
        return new OrderedEnumerable(this.toEnumerable(), createComparer(keySelector, true, comparer));
    }

    public orderByDescending<TKey>(
        keySelector: Selector<TElement, TKey>): IOrderedEnumerable<TElement>
    {
        return new OrderedEnumerable(this.toEnumerable(), createComparer(keySelector, false, undefined));
    }

    public max(): TElement;
    public max<TSelectorOut>(selector: Selector<TElement, TSelectorOut>): TSelectorOut;
    public max<TSelectorOut>(selector?: Selector<TElement, TSelectorOut>): TElement | TSelectorOut
    {
        if (selector !== undefined)
        {
            // Don't copy iterators
            return new TransformEnumerable<TElement, TSelectorOut>(this.toEnumerable(), selector).max();
        }

        return this.aggregate((previous, current) =>
            (previous !== undefined && previous > current)
                ? previous
                : current);
    }

    public sum(selector: Selector<TElement, number>): number
    {
        return this.aggregate(
            (previous: number, current: TElement) => previous + selector(current), 0);
    }

    public skip(amount: number): IEnumerable<TElement>
    {
        return new RangeEnumerable<TElement>(this.toEnumerable(), amount, undefined);
    }

    public take(amount: number): IEnumerable<TElement>
    {
        return new RangeEnumerable<TElement>(this.toEnumerable(), undefined, amount);
    }

    public union(other: IEnumerable<TElement>): IEnumerable<TElement>
    {
        return new UniqueEnumerable(this.concat(other));
    }
}
