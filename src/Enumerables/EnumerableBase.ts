import { Iterator } from "../Iterators";
import { IEnumerable } from "./Enumerable";

export abstract class EnumerableBase<TOut> implements IEnumerable<TOut>
{
    public abstract [Symbol.iterator](): Iterator<TOut>;
    public abstract iterator(): Iterator<TOut>;
}
