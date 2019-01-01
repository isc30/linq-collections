import { Selector } from "../Core";
import { Iterator } from "../Iterators";
import { Enumerable } from "./Enumerable";

export abstract class EnumerableBase<TIn, TOut> implements Enumerable<TOut>
{
    public abstract iterator(): Iterator<TOut>;

    public [Symbol.iterator](): Iterator<TOut>
    {
        return this.iterator();
    }

    public where(predicate: Selector<TOut, boolean>): Enumerable<TOut>
    {
        return EnumerableExtensions.where(this, predicate);
    }

    public toArray(): TOut[]
    {
        return EnumerableExtensions.toArray(this);
    }
}

// lazy loaded extension methods
import * as EnumerableExtensions from "./EnumerableExtensions";
