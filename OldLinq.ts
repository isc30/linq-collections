"use strict";

namespace OLinq
{
    export type Predicate<TElement, TOut> = (element: TElement, index: number/*, iterator: Array<TIn>*/) => TOut;
    export type Accumulator<TElement, TValue> = (accumulated: TValue, currentValue: TElement, currentIndex: number/*, iterator: Array<TIn>*/) => TValue;

    export interface IList<TElement> extends IEnumerable<TElement>
    {
        /*add(): void;
        addRange(): void;
        insert(index: number): void;
        remove(element): void;
        removeAt(element): void;*/
    }

    export interface IEnumerable<TElement>
    {
        clone(): IEnumerable<TElement>;

        asArray(): Array<TElement>;
        toArray(): Array<TElement>;
        //ToDictionary
        //toList

        reverse(): IEnumerable<TElement>;
        concat(other: IEnumerable<TElement>): IEnumerable<TElement>;

        aggregate(accumulator: Accumulator<TElement, TElement>, initialValue?: TElement): TElement;
        aggregate<TOut>(accumulator: Accumulator<TElement, TOut>, initialValue: TOut): TOut;

        count(): number;
        count(predicate: Predicate<TElement, boolean>): number;

        any(): boolean;
        any(predicate: Predicate<TElement, boolean>): boolean;

        all(predicate: Predicate<TElement, boolean>): boolean;

        contains(element: TElement): boolean;

        where(predicate: Predicate<TElement, boolean>): IEnumerable<TElement>;

        select<TOut>(predicate: Predicate<TElement, TOut>): IEnumerable<TOut>;
        //SelectMany

        elementAt(index: number): TElement;
        elementAtOrDefault(index: number): TElement | undefined;

        indexOf(element: TElement): number | undefined;
        lastIndexOf(element: TElement): number | undefined;

        first(): TElement;
        first(predicate: Predicate<TElement, boolean>): TElement;

        firstOrDefault(): TElement | undefined;
        firstOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;

        last(): TElement;
        last(predicate: Predicate<TElement, boolean>): TElement;

        lastOrDefault(): TElement | undefined;
        lastOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;

        single(): TElement;
        single(predicate: Predicate<TElement, boolean>): TElement;

        singleOrDefault(): TElement | undefined;
        singleOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;

        distinct(): IEnumerable<TElement>;
        //distinctBy<TValue>(propertySelector: PropertySelector<TElement, TValue>): IEnumerable<TElement>;

        min(): TElement;
        min<TOut>(property: Predicate<TElement, TOut>): TOut;

        max(): TElement;
        max<TOut>(property: Predicate<TElement, TOut>): TOut;

        average(): TElement;
        average<TOut>(property: Predicate<TElement, TOut>): TOut;

        sum(): TElement;
        sum<TOut>(property: Predicate<TElement, TOut>): TOut;

        /*except();
        forEach();
        orderBy<TValue>(propertySelector: PropertySelector<TElement, TValue>);
        orderByDescending<TValue>(propertySelector: PropertySelector<TElement, TValue>);
        thenBy<TValue>(propertySelector: PropertySelector<TElement, TValue>);
        thenByDescending<TValue>(propertySelector: PropertySelector<TElement, TValue>);
        groupBy<TValue>(propertySelector: PropertySelector<TElement, TValue>);
        union(); // concat + distinct*/

        skip(amount: number): IEnumerable<TElement>;
        take(amount: number): IEnumerable<TElement>;
    }

    export class Enumerable<TElement> implements IEnumerable<TElement>
    {
        private readonly _elements: Array<TElement>;

        public static empty<TElement>(): IEnumerable<TElement>
        {
            return new Enumerable<TElement>();
        }

        public static range(start: number, count: number): IEnumerable<number>
        {
            if (count < 0)
            {
                throw new Error("Count must be >= 0");
            }

            const elements = [] as Array<number>;

            for (let i = 0; i < count; ++i)
            {
                elements.push(start + i);
            }

            return new Enumerable<number>(elements);
        }

        public static repeat<TElement>(element: TElement, count: number): IEnumerable<TElement>
        {
            if (count < 0)
            {
                throw new Error("Count must me >= 0");
            }

            const elements = [] as Array<TElement>;

            for (let i = 0; i < count; ++i)
            {
                elements.push(element);
            }

            return new Enumerable<TElement>(elements);
        }

        public constructor();
        public constructor(elements: Array<TElement>);
        public constructor(elements: Array<TElement> = [])
        {
            this._elements = elements;
        }

        public clone(): IEnumerable<TElement>
        {
            return new Enumerable<TElement>(this.toArray());
        }

        public asArray(): Array<TElement>
        {
            return this._elements;
        }

        public toArray(): Array<TElement>
        {
            return this._elements.slice(); // Copy memory
        }

        public reverse(): IEnumerable<TElement>
        {
            return new Enumerable<TElement>(this.toArray().reverse());
        }

        public concat(other: IEnumerable<TElement>): IEnumerable<TElement>
        {
            return new Enumerable<TElement>(this._elements.concat(other.asArray()));
        }

        public aggregate(accumulator: Accumulator<TElement, TElement>, initialValue?: TElement): TElement;
        public aggregate<TOut>(accumulator: Accumulator<TElement, TOut>, initialValue: TOut): TOut;
        public aggregate<TOut>(accumulator: Accumulator<TElement, TOut>, initialValue: TElement | TOut): TOut
        {
            if (!this.any())
            {
                throw Error("Sequence contains no elements");
            }

            return this._elements.reduce(accumulator, initialValue) as TOut;
        }

        /*public add(element: TElement): number
        {
            return this.elements.push(element);
        }

        public addRange(elements: Array<TElement>): number
        {
            return this.elements.push(...elements);
        }*/

        public count(): number;
        public count(predicate: Predicate<TElement, boolean>): number;
        public count(predicate?: Predicate<TElement, boolean>): number
        {
            if (predicate !== undefined)
            {
                return this.where(predicate).count();
            }

            return this._elements.length >>> 0;
        }

        public any(): boolean;
        public any(predicate: Predicate<TElement, boolean>): boolean;
        public any(predicate?: Predicate<TElement, boolean>): boolean
        {
            if (predicate !== undefined)
            {
                return this._elements.some(predicate);
            }

            return this.count() > 0;
        }

        public all(predicate: Predicate<TElement, boolean>): boolean
        {

            return this._elements.every(predicate);
        }

        public contains(element: TElement): boolean
        {
            return this.indexOf(element) !== undefined;
        }

        public where(predicate: Predicate<TElement, boolean>): IEnumerable<TElement>
        {
            return new Enumerable<TElement>(this._elements.filter(predicate));
        }

        public select<TOut>(predicate: Predicate<TElement, TOut>): IEnumerable<TOut>
        {
            return new Enumerable<TOut>(this._elements.map(predicate));
        }

        public elementAt(index: number): TElement
        {
            const element = this._elements[index];

            if (element === undefined)
            {
                throw new RangeError("Index is out of range");
            }

            return element;
        }

        public elementAtOrDefault(index: number): TElement | undefined
        {
            return this._elements[index];
        }

        public indexOf(element: TElement): number | undefined
        {
            const index = this._elements.indexOf(element);

            return index >= 0
                ? index
                : undefined;
        }

        public lastIndexOf(element: TElement): number | undefined
        {
            const index = this._elements.lastIndexOf(element);

            return index >= 0
                ? index
                : undefined;
        }

        public first(): TElement;
        public first(predicate: Predicate<TElement, boolean>): TElement;
        public first(predicate?: Predicate<TElement, boolean>): TElement
        {
            if (predicate !== undefined)
            {
                const element = this.firstOrDefault(predicate);

                if (element === undefined)
                {
                    throw new Error("Sequence contains no elements");
                }

                return element;
            }

            return this.elementAt(0);
        }

        public firstOrDefault(): TElement | undefined;
        public firstOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;
        public firstOrDefault(predicate?: any): TElement | undefined
        {
            if (predicate !== undefined)
            {
                for (let i = 0, end = this.count(); i < end; ++i)
                {
                    const element = this.elementAt(i);

                    if (predicate.call(this, element, i, this._elements))
                    {
                        return element;
                    }
                }

                return undefined;
            }

            return this.elementAtOrDefault(0);
        }

        public last(): TElement;
        public last(predicate: Predicate<TElement, boolean>): TElement;
        public last(predicate?: Predicate<TElement, boolean>): TElement
        {
            if (predicate !== undefined)
            {
                return this.reverse().first(predicate);
            }

            return this.elementAt(this.count() - 1);
        }

        public lastOrDefault(): TElement | undefined;
        public lastOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;
        public lastOrDefault(predicate?: Predicate<TElement, boolean>): TElement | undefined
        {
            if (predicate !== undefined)
            {
                return this.reverse().firstOrDefault(predicate);
            }

            return this.elementAtOrDefault(this.count() - 1);
        }

        public single(): TElement;
        public single(predicate: Predicate<TElement, boolean>): TElement;
        public single(predicate?: Predicate<TElement, boolean>): TElement
        {
            if (predicate !== undefined)
            {
                return this.where(predicate).single();
            }

            const elementCount = this.count();

            if (elementCount === 0)
            {
                throw new Error("Sequence contains no elements");
            }
            else if (elementCount > 1)
            {
                throw new Error("Sequence contains more than 1 element");
            }

            return this.first();
        }

        public singleOrDefault(): TElement | undefined;
        public singleOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;
        public singleOrDefault(predicate?: Predicate<TElement, boolean>): TElement | undefined
        {
            if (predicate !== undefined)
            {
                return this.where(predicate).singleOrDefault();
            }

            if (this.count() > 1)
            {
                throw new Error("Sequence contains more than 1 element");
            }

            return this.firstOrDefault();
        }

        public distinct(): IEnumerable<TElement>
        {
            return this.where((e, i) => this.indexOf(e) === i);
        }

        public min(): TElement;
        public min<TOut>(property: Predicate<TElement, TOut>): TOut;
        public min<TOut>(property?: Predicate<TElement, TOut>): TElement | TOut
        {
            if (property !== undefined)
            {
                return this.select(property).min();
            }

            return this.aggregate((previous, current) =>
                previous < current
                    ? previous
                    : current);
        }

        public max(): TElement;
        public max<TOut>(property: Predicate<TElement, TOut>): TOut;
        public max<TOut>(property?: Predicate<TElement, TOut>): TElement | TOut
        {
            if (property !== undefined)
            {
                return this.select(property).max();
            }

            return this.aggregate((previous, current) =>
                previous > current
                    ? previous
                    : current);
        }

        public average(): TElement;
        public average<TOut>(property: Predicate<TElement, TOut>): TOut;
        public average<TOut>(property?: Predicate<TElement, TOut>): TElement | TOut
        {
            if (property !== undefined)
            {
                return (this.sum(property) as any / this.count()) as any;
            }

            return (this.sum() as any / this.count()) as any;
        }

        public sum(): TElement;
        public sum<TOut>(property: Predicate<TElement, TOut>): TOut;
        public sum<TOut>(property?: Predicate<TElement, TOut>): TElement | TOut
        {
            if (property !== undefined)
            {
                return this.select(property).sum();
            }

            return this.aggregate((previous: any, current: any) => previous + current);
        }

        public skip(amount: number): IEnumerable<TElement>
        {
            if (amount < 0)
            {
                throw new Error("Amount must be >= 0");
            }

            if (this.count() < amount)
            {
                throw new Error("Sequence contains less elements than skiped");
            }

            return new Enumerable<TElement>(this._elements.slice(amount));
        }

        public take(amount: number): IEnumerable<TElement>
        {
            if (amount < 0)
            {
                throw new Error("Amount must be >= 0");
            }

            if (this.count() < amount)
            {
                throw new Error("Sequence contains less elements than taken");
            }

            return new Enumerable<TElement>(this._elements.slice(0, amount));
        }
    }

    export class List<TElement> extends Enumerable<TElement>
    {
    }
}
