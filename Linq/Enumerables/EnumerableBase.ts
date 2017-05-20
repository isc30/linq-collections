"use strict";

namespace Linq
{
    export abstract class EnumerableBase<TElement, TOut> implements IEnumerable<TElement, TOut>
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
}