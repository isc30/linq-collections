import { Enumerable, IEnumerable } from "./Enumerables";
import { ArrayIterator } from "./Iterators";

export interface IList<TElement>
{
    asEnumerable(): IEnumerable<TElement, TElement>;
    clone(): IList<TElement>;
    clear(): void;
    at(index: number): TElement;
    add(element: TElement): void;
    indexOf(element: TElement): number | undefined;
    insert(index: number, element: TElement): void;
}

export class List<TElement> extends Array<TElement> implements IList<TElement>
{
    protected _index: number;

    public asEnumerable(): IEnumerable<TElement, TElement>
    {
        return Enumerable.fromSource<TElement>(this as TElement[]);
    }

    public toArray(): TElement[]
    {
        return this;
    }

    public clone(): List<TElement>
    {
        return new List<TElement>(...this.slice());
    }

    public count(): number
    {
        return this.length;
    }

    public clear(): void
    {
        this.clear();
    }

    public at(index: number): TElement
    {
        if (!this.isValidIndex(index))
        {
            throw new Error("Out of bounds");
        }

        return this[index];
    }

    public add(...elements: TElement[]): void
    {
        this.push(...elements);
    }

    public contains(element: TElement): boolean
    {
        return this.indexOf(element) !== undefined;
    }

    public insert(index: number, element: TElement): void
    {
        this.splice(index, 0, element);
    }

    protected isValidIndex(index: number): boolean
    {
        return index >= 0 && index < this.length;
    }
}
