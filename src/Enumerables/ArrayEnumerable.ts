import { ArrayIterator, Iterator } from "../Iterators";
import { EnumerableBase } from "./EnumerableBase";

export class ArrayEnumerable<T> extends EnumerableBase<T>
{
    public constructor(
        public source: T[])
    {
        super();
    }

    public iterator(): Iterator<T>
    {
        return new ArrayIterator<T>(this.source);
    }

    public [Symbol.iterator](): Iterator<T>
    {
        return this.iterator();
    }
}
