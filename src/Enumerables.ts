import { Selector, Predicate, Aggregator, Action } from "./Types";
import { List } from "./Containers";
import { IIterator, ArrayIterator } from "./Iterators";
import { Comparer, KeyComparer  } from "./Comparers";
import { Cached } from "./Utils";

export interface IEnumerable<TOut> extends IIterator<TOut>
{
    clone(): IEnumerable<TOut>;

    toArray(): TOut[];
    toList(): List<TOut>;
    // toDictionary
    // toLookup

    aggregate(aggregator: Aggregator<TOut, TOut | undefined>): TOut;
    aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue: TValue): TValue;

    all(predicate: Predicate<TOut>): boolean;

    any(): boolean;
    any(predicate: Predicate<TOut>): boolean;

    average(selector: Selector<TOut, number>): number;

    concat(other: IEnumerable<TOut>, ...others: Array<IEnumerable<TOut>>): IEnumerable<TOut>;

    contains(element: TOut): boolean;

    count(): number;
    count(predicate: Predicate<TOut>): number;

    // defaultIfEmpty

    distinct(): IEnumerable<TOut>;
    distinct<TKey>(keySelector: Selector<TOut, TKey>): IEnumerable<TOut>;

    elementAt(index: number): TOut;

    elementAtOrDefault(index: number): TOut | undefined;

    except(other: IEnumerable<TOut>): IEnumerable<TOut>;

    first(): TOut;
    first(predicate: Predicate<TOut>): TOut;

    firstOrDefault(): TOut | undefined;
    firstOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    forEach(action: Action<TOut>): void;

    // groupBy

    // groupJoin

    // intersect

    // join

    last(): TOut;
    last(predicate: Predicate<TOut>): TOut;

    lastOrDefault(): TOut | undefined;
    lastOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    // longCount

    max(): TOut;
    max<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    min(): TOut;
    min<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    orderBy<TSelectorOut>(keySelector: Selector<TOut, TSelectorOut>): IEnumerable<TOut>;

    orderByDescending<TSelectorOut>(keySelector: Selector<TOut, TSelectorOut>): IEnumerable<TOut>;

    reverse(): IEnumerable<TOut>;

    select<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): IEnumerable<TSelectorOut>;

    selectMany<TSelectorOut>(
        selector: Selector<TOut, TSelectorOut[] | IEnumerable<TSelectorOut>>):
        IEnumerable<TSelectorOut>;

    // sequenceEqual

    single(): TOut;
    single(predicate: Predicate<TOut>): TOut;

    singleOrDefault(): TOut | undefined;
    singleOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    skip(amount: number): IEnumerable<TOut>;

    // skipWhile

    sum(): TOut;
    sum<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    take(amount: number): IEnumerable<TOut>;

    /////// thenBy
    /////// thenByDescending

    union(other: IEnumerable<TOut>): IEnumerable<TOut>;

    where(predicate: Predicate<TOut>): IEnumerable<TOut>;
}

export interface IOrderedEnumerable<TOut> extends IEnumerable<TOut>
{
    /*thenBy<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>): TSelectorOut;
    thenBy<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>,
        comparer: Comparer<TSelectorOut>): TSelectorOut;

    thenByDescending<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>): TSelectorOut;
    thenByDescending<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>,
        comparer: Comparer<TSelectorOut>): TSelectorOut;*/
}

export abstract class EnumerableBase<TElement, TOut> implements IEnumerable<TOut>
{
    protected readonly source: IIterator<TElement> | IEnumerable<TElement>;
    protected _isValid: boolean;

    protected constructor(source: IIterator<TElement>)
    {
        this.source = source;
    }

    public abstract clone(): IEnumerable<TOut>;
    public abstract value(): TOut;

    public reset(): void
    {
        this.source.reset();
    }

    public next(): boolean
    {
        return this.source.next();
    }

    public toArray(): TOut[]
    {
        const result: TOut[] = [];
        this.reset();

        while (this.next())
        {
            result.push(this.value());
        }

        return result;
    }

    public toList(): List<TOut>
    {
        return new List<TOut>(...this.toArray());
    }

    public count(): number;
    public count(predicate: Predicate<TOut>): number;
    public count(predicate?: Predicate<TOut>): number
    {
        if (predicate !== undefined)
        {
            // Don't copy iterators
            return new ConditionalEnumerable<TOut>(this, predicate).count();
        }

        let result: number = 0;
        this.reset();

        while (this.next())
        {
            result++;
        }

        // tslint:disable-next-line:no-bitwise
        return result >>> 0;
    }

    public any(): boolean;
    public any(predicate: Predicate<TOut>): boolean;
    public any(predicate?: Predicate<TOut>): boolean
    {
        if (predicate !== undefined)
        {
            // Don't copy iterators
            return new ConditionalEnumerable<TOut>(this, predicate).any();
        }

        this.reset();

        return this.next();
    }

    public all(predicate: Predicate<TOut>): boolean
    {
        this.reset();

        while (this.next())
        {
            if (!predicate(this.value()))
            {
                return false;
            }
        }

        return true;
    }

    public reverse(): IEnumerable<TOut>
    {
        return new ReverseEnumerable<TOut>(this.clone());
    }

    public contains(element: TOut): boolean
    {
        return this.any(e => e === element);
    }

    public where(predicate: Predicate<TOut>): IEnumerable<TOut>
    {
        return new ConditionalEnumerable<TOut>(this.clone(), predicate);
    }

    public select<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): IEnumerable<TSelectorOut>
    {
        return new TransformEnumerable<TOut, TSelectorOut>(this.clone(), selector);
    }

    public selectMany<TSelectorOut>(
        selector: Selector<TOut, TSelectorOut[] | IEnumerable<TSelectorOut>>)
        : IEnumerable<TSelectorOut>
    {
        const selectToEnumerable = (e: TOut) =>
        {
            const ie = selector(e);

            return Array.isArray(ie)
                ? Enumerable.fromSource(ie)
                : ie;
        };

        return this
            .select(selectToEnumerable)
            .aggregate(
                (p, c) => p !== undefined
                    ? new ConcatEnumerable(p, c)
                    : c);
    }

    public concat(other: IEnumerable<TOut>, ...others: Array<IEnumerable<TOut>>): IEnumerable<TOut>
    {
        let result = new ConcatEnumerable<TOut>(this.clone(), other.clone());

        for (const next of others)
        {
            result = new ConcatEnumerable<TOut>(result, next.clone());
        }

        return result;
    }

    public elementAt(index: number): TOut
    {
        const element = this.elementAtOrDefault(index);

        if (element === undefined)
        {
            throw new Error("Out of bounds");
        }

        return element;
    }

    public elementAtOrDefault(index: number): TOut | undefined
    {
        if (index < 0)
        {
            throw new Error("Negative index is forbiden");
        }

        let currentIndex = -1;

        this.reset();

        while (this.next())
        {
            currentIndex++;

            if (currentIndex === index)
            {
                break;
            }
        }

        if (currentIndex !== index)
        {
            return undefined;
        }

        return this.value();
    }

    public except(other: IEnumerable<TOut>): IEnumerable<TOut>
    {
        return this.where(e => !other.contains(e));
    }

    public first(): TOut;
    public first(predicate: Predicate<TOut>): TOut;
    public first(predicate?: Predicate<TOut>): TOut
    {
        let element: TOut | undefined;

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

    public firstOrDefault(): TOut | undefined;
    public firstOrDefault(predicate: Predicate<TOut>): TOut | undefined;
    public firstOrDefault(predicate?: Predicate<TOut>): TOut | undefined
    {
        if (predicate !== undefined)
        {
            // Don't copy iterators
            return new ConditionalEnumerable<TOut>(this, predicate).firstOrDefault();
        }

        this.reset();

        if (!this.next())
        {
            return undefined;
        }

        return this.value();
    }

    public forEach(action: Action<TOut>): void
    {
        this.reset();

        for (let i = 0; this.next(); i++)
        {
            action(this.value(), i);
        }
    }

    public last(): TOut;
    public last(predicate: Predicate<TOut>): TOut;
    public last(predicate?: Predicate<TOut>): TOut
    {
        let element: TOut | undefined;

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

    public lastOrDefault(): TOut | undefined;
    public lastOrDefault(predicate: Predicate<TOut>): TOut | undefined;
    public lastOrDefault(predicate?: Predicate<TOut>): TOut | undefined
    {
        if (predicate !== undefined)
        {
            // Don't copy iterators
            return new ConditionalEnumerable<TOut>(this, predicate).lastOrDefault();
        }

        const reversed = new ReverseEnumerable<TOut>(this);
        reversed.reset();

        if (!reversed.next())
        {
            return undefined;
        }

        return reversed.value();
    }

    public single(): TOut;
    public single(predicate: Predicate<TOut>): TOut;
    public single(predicate?: Predicate<TOut>): TOut
    {
        let element: TOut | undefined;

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

    public singleOrDefault(): TOut | undefined;
    public singleOrDefault(predicate: Predicate<TOut>): TOut | undefined;
    public singleOrDefault(predicate?: Predicate<TOut>): TOut | undefined
    {
        if (predicate !== undefined)
        {
            // Don't copy iterators
            return new ConditionalEnumerable<TOut>(this, predicate).singleOrDefault();
        }

        this.reset();

        if (!this.next())
        {
            return undefined;
        }

        const element = this.value();

        if (this.next())
        {
            throw new Error("Sequence contains more than 1 element");
        }

        return element;
    }

    public distinct(): IEnumerable<TOut>;
    public distinct<TKey>(keySelector: Selector<TOut, TKey>): IEnumerable<TOut>;
    public distinct<TKey>(keySelector?: Selector<TOut, TKey>): IEnumerable<TOut>
    {
        if (keySelector !== undefined)
        {
            return new UniqueEnumerable<TOut, TKey>(this.clone(), keySelector);
        }

        return new UniqueEnumerable<TOut, TOut>(this.clone(), e => e);
    }

    public aggregate(aggregator: Aggregator<TOut, TOut | undefined>): TOut;
    public aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue: TValue): TValue;
    public aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue?: TValue): TValue
    {
        let value = initialValue;

        this.reset();

        if (!this.next())
        {
            throw new Error("Sequence contains no elements");
        }

        do
        {
            value = aggregator(value as TValue, this.value());
        }
        while (this.next());

        return value as TValue;
    }

    public min(): TOut;
    public min<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;
    public min<TSelectorOut>(selector?: Selector<TOut, TSelectorOut>): TOut | TSelectorOut
    {
        if (selector !== undefined)
        {
            // Don't copy iterators
            return new TransformEnumerable<TOut, TSelectorOut>(this, selector).min();
        }

        return this.aggregate((previous, current) =>
            (previous !== undefined && previous < current)
                ? previous
                : current);
    }

    public orderBy<TSelectorOut>(keySelector: Selector<TOut, TSelectorOut>): IEnumerable<TOut>
    {
        return new OrderedEnumerable(this.clone(), new KeyComparer(keySelector, true));
    }

    public orderByDescending<TSelectorOut>(keySelector: Selector<TOut, TSelectorOut>): IEnumerable<TOut>
    {
        return new OrderedEnumerable(this.clone(), new KeyComparer(keySelector, false));
    }

    public max(): TOut;
    public max<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;
    public max<TSelectorOut>(selector?: Selector<TOut, TSelectorOut>): TOut | TSelectorOut
    {
        if (selector !== undefined)
        {
            // Don't copy iterators
            return new TransformEnumerable<TOut, TSelectorOut>(this, selector).max();
        }

        return this.aggregate((previous, current) =>
            (previous !== undefined && previous > current)
                ? previous
                : current);
    }

    public sum(): TOut;
    public sum<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;
    public sum<TSelectorOut>(selector?: Selector<TOut, TSelectorOut>): TOut | TSelectorOut
    {
        if (selector !== undefined)
        {
            // Don't copy iterators
            return new TransformEnumerable<TOut, TSelectorOut>(this, selector).sum();
        }

        return this.aggregate(
            (previous: any, current: any) =>
                previous !== undefined
                    ? previous + current
                    : current);
    }

    public average(selector: Selector<TOut, number>): number
    {
        const transformEnumerable = new TransformEnumerable<TOut, number>(this, selector);

        transformEnumerable.reset();

        if (!transformEnumerable.next())
        {
            throw new Error("Sequence contains no elements");
        }

        let sum = 0;
        let count = 0;

        do
        {
            sum += transformEnumerable.value();
            count++;
        }
        while (transformEnumerable.next());

        return sum / count;
    }

    public skip(amount: number): IEnumerable<TOut>
    {
        return new RangeEnumerable<TOut>(this.clone(), amount, undefined);
    }

    public take(amount: number): IEnumerable<TOut>
    {
        return new RangeEnumerable<TOut>(this.clone(), undefined, amount);
    }

    public union(other: IEnumerable<TOut>): IEnumerable<TOut>
    {
        return new UniqueEnumerable<TOut, TOut>(this.concat(other), e => e);
    }
}

export class Enumerable<TElement> extends EnumerableBase<TElement, TElement>
{
    protected currentValue: Cached<TElement>;

    public static fromSource<TElement>(source: TElement[] | IIterator<TElement>): IEnumerable<TElement>
    {
        if (Array.isArray(source))
        {
            return new Enumerable<TElement>(new ArrayIterator<TElement>(source));
        }

        return new Enumerable<TElement>(source);
    }

    public static empty<TElement>(): IEnumerable<TElement>
    {
        return new Enumerable<TElement>(new ArrayIterator<TElement>([]));
    }

    public static range(start: number, count: number): IEnumerable<number>
    {
        if (count < 0)
        {
            throw new Error("Count must be >= 0");
        }

        const source = [] as number[];

        for (let i = 0; i < count; ++i)
        {
            source.push(start + i);
        }

        return new Enumerable<number>(new ArrayIterator<number>(source));
    }

    public static repeat<TElement>(element: TElement, count: number): IEnumerable<TElement>
    {
        if (count < 0)
        {
            throw new Error("Count must me >= 0");
        }

        const source = [] as TElement[];

        for (let i = 0; i < count; ++i)
        {
            source.push(element);
        }

        return new Enumerable<TElement>(new ArrayIterator<TElement>(source));
    }

    public constructor(source: IIterator<TElement>)
    {
        super(source);
        this.currentValue = new Cached<TElement>();
    }

    public clone(): Enumerable<TElement>
    {
        return new Enumerable<TElement>(this.source.clone());
    }

    public value(): TElement
    {
        if (!this.currentValue.isValid())
        {
            this.currentValue.value = this.source.value();
        }

        return this.currentValue.value;
    }

    public reset(): void
    {
        super.reset();
        this.currentValue.invalidate();
    }

    public next(): boolean
    {
        this.currentValue.invalidate();

        return super.next();
    }
}

class ConditionalEnumerable<TElement> extends Enumerable<TElement>
{
    protected source: IEnumerable<TElement>;
    private _predicate: Predicate<TElement>;

    public constructor(source: IEnumerable<TElement>, predicate: Predicate<TElement>)
    {
        super(source);
        this._predicate = predicate;
    }

    public clone(): ConditionalEnumerable<TElement>
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

class ConcatEnumerable<TElement> extends Enumerable<TElement>
{
    private _otherSource: IIterator<TElement>;
    private _isFirstSourceFinished: boolean;

    public constructor(left: IIterator<TElement>, right: IIterator<TElement>)
    {
        super(left);
        this._otherSource = right;
        this._isFirstSourceFinished = false;
    }

    public clone(): ConcatEnumerable<TElement>
    {
        return new ConcatEnumerable<TElement>(this.source.clone(), this._otherSource.clone());
    }

    public reset(): void
    {
        this.source.reset();
        this._otherSource.reset();
        this.currentValue.invalidate();
    }

    public next(): boolean
    {
        this.currentValue.invalidate();

        const hasValue = !this._isFirstSourceFinished
            ? this.source.next()
            : this._otherSource.next();

        if (!hasValue && !this._isFirstSourceFinished)
        {
            this._isFirstSourceFinished = true;

            return this.next();
        }

        return hasValue;
    }

    public value(): TElement
    {
        if (!this.currentValue.isValid())
        {
            this.currentValue.value = !this._isFirstSourceFinished
                ? this.source.value()
                : this._otherSource.value();
        }

        return this.currentValue.value;
    }
}

class UniqueEnumerable<TElement, TKey> extends Enumerable<TElement>
{
    protected source: IEnumerable<TElement>;
    private _seenKeys: TKey[];
    private _keySelector: Selector<TElement, TKey>;

    public constructor(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>)
    {
        super(source);
        this._seenKeys = [];
        this._keySelector = keySelector;
    }

    public clone(): UniqueEnumerable<TElement, TKey>
    {
        return new UniqueEnumerable<TElement, TKey>(this.source.clone(), this._keySelector);
    }

    public reset(): void
    {
        super.reset();
        this._seenKeys = [];
    }

    private isUnique(element: TElement): boolean
    {
        const key = this._keySelector(element);

        if (this._seenKeys.indexOf(key) < 0)
        {
            this._seenKeys.push(key);

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

class RangeEnumerable<TElement> extends Enumerable<TElement>
{
    protected source: IEnumerable<TElement>;
    private _start: number | undefined;
    private _count: number | undefined;
    private _currentIndex: number;

    public constructor(source: IEnumerable<TElement>, start: number | undefined, count: number | undefined)
    {
        if ((start !== undefined && start < 0) || (count !== undefined && count < 0))
        {
            throw new Error("Incorrect parameters");
        }

        super(source);
        this._start = start;
        this._count = count;
        this._currentIndex = -1;
    }

    public clone(): RangeEnumerable<TElement>
    {
        return new RangeEnumerable<TElement>(this.source.clone(), this._start, this._count);
    }

    public reset(): void
    {
        super.reset();
        this._currentIndex = -1;
    }

    private isValidIndex(): boolean
    {
        const start = this._start !== undefined ? this._start : 0;
        const end = this._count !== undefined ? start + this._count : undefined;

        return this._currentIndex >= start && (end === undefined || this._currentIndex < end);
    }

    private performSkip(): boolean
    {
        const start = this._start !== undefined ? this._start : 0;
        let hasValue: boolean = true;

        while (hasValue && this._currentIndex + 1 < start )
        {
            hasValue = super.next();
            ++this._currentIndex;
        }

        return hasValue;
    }

    public next(): boolean
    {
        if (this._currentIndex < 0 && !this.performSkip())
        {
            return false;
        }

        ++this._currentIndex;

        return super.next() && this.isValidIndex();
    }

    public value(): TElement
    {
        if (!this.isValidIndex())
        {
            throw new Error("Out of bounds");
        }

        return super.value();
    }
}

class TransformEnumerable<TElement, TOut> extends EnumerableBase<TElement, TOut>
{
    protected source: IEnumerable<TElement>;
    private _transform: Selector<TElement, TOut>;
    private _currentValue: Cached<TOut>;

    public constructor(source: IEnumerable<TElement>, transform: Selector<TElement, TOut>)
    {
        super(source);
        this._transform = transform;
        this._currentValue = new Cached<TOut>();
    }

    public clone(): TransformEnumerable<TElement, TOut>
    {
        return new TransformEnumerable<TElement, TOut>(this.source.clone(), this._transform);
    }

    public value(): TOut
    {
        if (!this._currentValue.isValid())
        {
            this._currentValue.value = this._transform(this.source.value());
        }

        return this._currentValue.value;
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
}

class ReverseEnumerable<TElement> extends Enumerable<TElement>
{
    protected source: IEnumerable<TElement>;
    private _elements: Cached<TElement[]>;
    private _currentIndex: number;

    public constructor(source: IEnumerable<TElement>)
    {
        super(source);
        this._elements = new Cached<TElement[]>();
        this._currentIndex = -1;
    }

    public reset(): void
    {
        this._elements.invalidate();
        this._currentIndex = -1;
    }

    private isValidIndex(): boolean
    {
        return this._currentIndex >= 0
            && this._currentIndex < this._elements.value.length;
    }

    public all(predicate: Predicate<TElement>): boolean
    {
        return this.source.all(predicate);
    }

    public any(): boolean;
    public any(predicate: Predicate<TElement>): boolean;
    public any(predicate?: Predicate<TElement>): boolean
    {
        if (predicate !== undefined)
        {
            return this.source.any(predicate);
        }

        return this.source.any();
    }

    public average(selector: Selector<TElement, number>): number
    {
        return this.source.average(selector);
    }

    public count(): number;
    public count(predicate: Predicate<TElement>): number;
    public count(predicate?: Predicate<TElement>): number
    {
        if (predicate !== undefined)
        {
            return this.source.count(predicate);
        }

        return this.source.count();
    }

    public max(): TElement;
    public max<TSelectorOut>(selector: Selector<TElement, TSelectorOut>): TSelectorOut;
    public max<TSelectorOut>(selector?: Selector<TElement, TSelectorOut>): TElement | TSelectorOut
    {
        if (selector !== undefined)
        {
            return this.source.max(selector);
        }

        return this.source.max();
    }

    public min(): TElement;
    public min<TSelectorOut>(selector: Selector<TElement, TSelectorOut>): TSelectorOut;
    public min<TSelectorOut>(selector?: Selector<TElement, TSelectorOut>): TElement | TSelectorOut
    {
        if (selector !== undefined)
        {
            return this.source.min(selector);
        }

        return this.source.min();
    }

    public reverse(): IEnumerable<TElement>
    {
        return this.source.clone(); // haha so smart
    }

    public sum(): TElement;
    public sum<TSelectorOut>(selector: Selector<TElement, TSelectorOut>): TSelectorOut;
    public sum<TSelectorOut>(selector?: Selector<TElement, TSelectorOut>): TElement | TSelectorOut
    {
        if (selector !== undefined)
        {
            return this.source.sum(selector);
        }

        return this.source.sum();
    }

    public next(): boolean
    {
        if (!this._elements.isValid())
        {
            this._elements.value = this.source.toArray();
        }

        ++this._currentIndex;

        return this.isValidIndex();
    }

    public value(): TElement
    {
        if (!this._elements.isValid() || !this.isValidIndex())
        {
            throw new Error("Out of bounds");
        }

        return this._elements.value[(this._elements.value.length - 1) - this._currentIndex];
    }
}

class OrderedEnumerable<TOut, TKey> extends EnumerableBase<TOut, TOut> implements IOrderedEnumerable<TOut>
{
    protected source: IEnumerable<TOut>;
    private _comparer: Comparer<TOut>;
    private _elements: Cached<TOut[]>;
    private _currentIndex: number;

    public constructor(source: IEnumerable<TOut>, comparer: Comparer<TOut>)
    {
        super(source);

        this._comparer = comparer;
        this._elements = new Cached<TOut[]>();
        this._currentIndex = -1;
    }

    private isValidIndex(): boolean
    {
        return this._currentIndex >= 0
            && this._currentIndex < this._elements.value.length;
    }

    /*public thenBy<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>): IOrderedEnumerable<TOut>;
    public thenBy<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>, comparer: Comparer<TOut>): IOrderedEnumerable<TOut>;
    public thenBy<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>,
        comparer: Comparer<TOut> = new Comparer()): IOrderedEnumerable<TOut>
    {
        const chainedComparer = this._comparer.then(comparer);
    }

    public thenByDescending<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>): TSelectorOut;
    public thenByDescending<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>, comparer: Comparer<TSelectorOut>): TSelectorOut;
    public thenByDescending<TSelectorOut>(
        keySelector: Selector<TOut, TSelectorOut>,
        comparer: Comparer<TSelectorOut> = new Comparer()): TSelectorOut
    {
        throw new Error("Method not implemented.");
    }*/

    public reset(): void
    {
        this._elements.invalidate();
        this._currentIndex = -1;
    }

    public clone(): IEnumerable<TOut>
    {
        return new OrderedEnumerable(this.source.clone(), this._comparer);
    }

    public value(): TOut
    {
        if (!this._elements.isValid() || !this.isValidIndex())
        {
            throw new Error("Out of bounds");
        }

        return this._elements.value[(this._elements.value.length - 1) - this._currentIndex];
    }

    public next(): boolean
    {
        if (!this._elements.isValid())
        {
            this._elements.value = this.orderElements(this.source.toArray());
        }

        this._currentIndex++;

        return this.isValidIndex();
    }

    private orderElements(elements: TOut[]): TOut[]
    {
        return elements.sort(this._comparer.compare.bind(this._comparer));
    }
}
