import { IEnumerable, Enumerable, ArrayIterator } from "../Linq/Linq";

export interface IList<TElement>
{
    count(): number;
    clear(): void;
    at(index: number): TElement;
    add(element: TElement): void;
    contains(element: TElement): boolean;
    indexOf(element: TElement): number | undefined;
    insert(index: number, element: TElement): void;
    toArray(): Array<TElement>;
    asEnumerable(): IEnumerable<TElement, TElement>;
}

export class List<TElement> implements IList<TElement>
{
    protected source: Array<TElement>;

    public constructor()
    public constructor(source: Array<TElement>)
    public constructor(source: Array<TElement> = [])
    {
        this.source = source;
    }

    public count(): number
    {
        return this.source.length;
    }

    public clear(): void
    {
        this.source = [];
    }

    protected isValidIndex(index: number): boolean
    {
        return index >= 0 && index < this.source.length;
    }

    public at(index: number): TElement
    {
        if (!this.isValidIndex(index))
        {
            throw new Error("Out of bounds");
        }

        return this.source[index];
    }

    public add(element: TElement): void
    {
        this.source.push(element);
    }

    public contains(element: TElement): boolean
    {
        return this.indexOf(element) !== undefined;
    }

    public indexOf(element: TElement): number | undefined
    {
        const index = this.source.indexOf(element);

        return index >= 0
            ? index
            : undefined;
    }
    
    public insert(index: number, element: TElement): void
    {
        throw new Error("Method not implemented.");
    }

    public toArray(): Array<TElement>
    {
        return this.source.slice(); // Copy memory
    }

    public asEnumerable(): IEnumerable<TElement, TElement>
    {
        return Enumerable.fromSource(this.source);
    }
}
