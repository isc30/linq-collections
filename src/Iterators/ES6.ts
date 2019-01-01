/* tslint:disable no-any */

export interface IteratorResult<T>
{
    done: boolean;
    value: T;
}

export interface Iterator<T>
{
    next(): IteratorResult<T>;
}

export interface Iterable<T>
{
    [Symbol.iterator](): Iterator<T>;
    iterator(): Iterator<T>;
}

export interface IterableIterator<T> extends Iterator<T>
{
    [Symbol.iterator](): IterableIterator<T>;
    iterator(): IterableIterator<T>;
}
