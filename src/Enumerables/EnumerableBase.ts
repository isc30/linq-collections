import { Predicate, Selector } from "../Core";
import { Iterator } from "../Iterators";
import { Enumerable } from "./Enumerable";

export abstract class EnumerableBase<T> implements Enumerable<T>
{
    public abstract iterator(): Iterator<T>;

    public [Symbol.iterator](): Iterator<T>
    {
        return this.iterator();
    }

    public where(predicate: Predicate<T>): Enumerable<T>
    {
        return EnumerableExtensions.where(this, predicate);
    }

    public select<TOut>(selector: Selector<T, TOut>): Enumerable<TOut>
    {
        return EnumerableExtensions.select(this, selector);
    }

    public toArray(): T[]
    {
        return EnumerableExtensions.toArray(this);
    }
}

// lazy loaded extension methods
import * as EnumerableExtensions from "./EnumerableExtensions";
