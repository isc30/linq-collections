import { IterableIterator, IteratorResult } from ".";

export abstract class IteratorBase<T> implements IterableIterator<T>
{
    public abstract next(): IteratorResult<T>;

    public iterator(): IterableIterator<T>
    {
        return this;
    }

    public [Symbol.iterator](): IterableIterator<T>
    {
        return this;
    }
}
