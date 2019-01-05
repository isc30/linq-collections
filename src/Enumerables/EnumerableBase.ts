import { Predicate, Selector } from "@lib/Core";
import { Iterator, SelectIterator, WhereIterator } from "@lib/Iterators";
import { arrayEnumerable } from ".";
import { Enumerable } from "./Enumerable";
import * as Helpers from "./EnumerableExtensions";

export type EnumerableConstructor<T> = new(iteratorFactory: () => Iterator<T>) => Enumerable<T>;

export abstract class EnumerableBase<T> implements EnumerableConstructor<T>, Enumerable<T>
{
    private _iteratorFactory: () => Iterator<T>;

    public constructor(
        iteratorFactory: () => Iterator<T>)
    {
        this._iteratorFactory = iteratorFactory;
    }

    public create<TOut>(iteratorFactory: () => Iterator<TOut>)
    {
        return new (this.constructor as EnumerableConstructor<TOut>)(iteratorFactory);
    }

    public iterator(): Iterator<T>
    {
        return this._iteratorFactory();
    }

    public [Symbol.iterator](): Iterator<T>
    {
        return this.iterator();
    }

    public where(predicate: Predicate<T>): Enumerable<T>
    {
        const x = arrayEnumerable([1, 2, 3]);

        return this.create(
            () => new WhereIterator(this.iterator(), predicate));
    }

    public select<TOut>(selector: Selector<T, TOut>): Enumerable<TOut>
    {
        return this.create(
            () => new SelectIterator(this.iterator(), selector));
    }

    public toArray(): T[]
    {
        return Helpers.toArray(this);
    }
}
