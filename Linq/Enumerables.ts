import { IIterator, ArrayIterator, CombinedIterator } from "./Iterators";
import { Cached } from "./Utils";

type Selector<TElement, TOut> = (element: TElement) => TOut;
type Predicate<TElement> = Selector<TElement, boolean>;
type Aggregator<TElement, TValue> = (previous: TValue, current: TElement) => TValue;

export interface IEnumerable<TElement, TOut> extends IIterator<TOut>
{
    clone(): IEnumerable<TElement, TOut>;

    toArray(): Array<TOut>;

    count(): number;
    count(predicate: Predicate<TOut>): number;

    any(): boolean;
    any(predicate: Predicate<TOut>): boolean;

    all(predicate: Predicate<TOut>): boolean;

    //reverse(): IEnumerable<TOut, TOut>;

    contains(element: TOut): boolean;

    where(predicate: Predicate<TOut>): IEnumerable<TOut, TOut>;

    select<TPredicateOut>(selector: Selector<TOut, TPredicateOut>): IEnumerable<TOut, TPredicateOut>;

    concat(other: IEnumerable<TElement, TOut>): IEnumerable<TOut, TOut>;

    first(): TOut;
    first(predicate: Predicate<TOut>): TOut;

    firstOrDefault(): TOut | undefined;
    firstOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    //last(): TOut;
    //last(predicate: Predicate<TOut>): TOut;

    //lastOrDefault(): TOut | undefined;
    //lastOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    single(): TOut;
    single(predicate: Predicate<TOut>): TOut;

    singleOrDefault(): TOut | undefined;
    singleOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    distinct(): IEnumerable<TOut, TOut>;

    aggregate(aggregator: Aggregator<TOut, TOut | undefined>): TOut;
    aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue: TValue): TValue;

    min(): TOut;
    min<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    max(): TOut;
    max<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    sum(): TOut;
    sum<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;
    
    average(selector: Selector<TOut, number>): number;

    skip(amount: number): IEnumerable<TOut, TOut>;
    take(amount: number): IEnumerable<TOut, TOut>;
}

abstract class EnumerableBase<TElement, TOut> implements IEnumerable<TElement, TOut>
{
    protected readonly source: IIterator<TElement>;

    public abstract clone(): IEnumerable<TElement, TOut>;
    public abstract value(): TOut;

    protected constructor(source: IIterator<TElement>)
    {
        this.source = source;
    }

    public reset(): void
    {
        this.source.reset();
    }

    public next(): boolean
    {
        return this.source.next();
    }

    public toArray(): Array<TOut>
    {
        let result: Array<TOut> = [];
        this.reset();

        while (this.next())
        {
            result.push(this.value());
        }

        return result;
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

    public contains(element: TOut): boolean
    {
        return this.any(e => e === element);
    }

    public where(predicate: Predicate<TOut>): IEnumerable<TOut, TOut>
    {
        return new ConditionalEnumerable<TOut>(this.clone(), predicate);
    }

    public select<TPredicateOut>(selector: Selector<TOut, TPredicateOut>): IEnumerable<TOut, TPredicateOut>
    {
        return new TransformEnumerable<TOut, TPredicateOut>(this.clone(), selector);
    }

    public concat(other: IEnumerable<TElement, TOut>): IEnumerable<TOut, TOut>
    {
        return new Enumerable<TOut>(new CombinedIterator(this.clone(), other.clone()));
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

    public distinct(): IEnumerable<TOut, TOut>
    {
        return new UniqueEnumerable<TOut>(this.clone());
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
        while (this.next())

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
        while (transformEnumerable.next())

        return sum / count;
    }

    public skip(amount: number): IEnumerable<TOut, TOut>
    {
        return new RangeEnumerable<TOut>(this.clone(), amount, undefined);
    }

    public take(amount: number): IEnumerable<TOut, TOut>
    {
        return new RangeEnumerable<TOut>(this.clone(), undefined, amount);
    }
}

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

    public static empty<TElement>(): Enumerable<TElement>
    {
        return new Enumerable<TElement>(new ArrayIterator<TElement>([]));
    }

    public static range(start: number, count: number): Enumerable<number>
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

    public static repeat<TElement>(element: TElement, count: number): Enumerable<TElement>
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

    public clone(): Enumerable<TElement>
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
}

class ConditionalEnumerable<TElement> extends Enumerable<TElement>
{
    private _predicate: Predicate<TElement>;

    public constructor(source: IIterator<TElement>, predicate: Predicate<TElement>)
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

class UniqueEnumerable<TElement> extends Enumerable<TElement>
{
    private _seenElements: Array<TElement>;

    public constructor(source: IIterator<TElement>)
    {
        super(source);
        this._seenElements = [];
    }

    public clone(): UniqueEnumerable<TElement>
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

class RangeEnumerable<TElement> extends Enumerable<TElement>
{
    private _start: number | undefined;
    private _count: number | undefined;
    private _current: number;

    public constructor(source: IIterator<TElement>, start: number | undefined, count: number | undefined)
    {
        if ((start !== undefined && start < 0) || (count !== undefined && count < 0))
        {
            throw new Error("Incorrect parameters");
        }

        super(source);
        this._start = start;
        this._count = count;
        this._current = -1;
    }

    public clone(): RangeEnumerable<TElement>
    {
        return new RangeEnumerable<TElement>(this.source.clone(), this._start, this._count);
    }

    public reset(): void
    {
        super.reset();
        this._current = -1;
    }

    private isValidIndex(): boolean
    {
        const start = this._start !== undefined ? this._start : 0;
        const end = this._count !== undefined ? start + this._count : undefined;

        return this._current >= start && (end === undefined || this._current < end);
    }

    private performSkip(): boolean
    {
        const start = this._start !== undefined ? this._start : 0;
        let hasValue: boolean = true;

        while (hasValue && this._current + 1 < start )
        {
            hasValue = super.next();
            ++this._current;
        }

        return hasValue;
    }

    public next(): boolean
    {
        if (this._current < 0 && !this.performSkip())
        {
            return false;
        }

        ++this._current;

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
    private _transform: Selector<TElement, TOut>;
    private _currentValue: Cached<TOut>;

    public constructor(source: IIterator<TElement>, transform: Selector<TElement, TOut>)
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
            this._currentValue.setValue(this._transform(this.source.value()));
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
}
