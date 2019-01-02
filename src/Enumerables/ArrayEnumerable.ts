import { ArrayIterator, Iterator } from "../Iterators";
import { EnumerableBase } from "./EnumerableBase";

export class ArrayEnumerable<T> extends EnumerableBase<T>
{
    public constructor(
        protected source: T[])
    {
        super();
    }

    public iterator(): Iterator<T>
    {
        return new ArrayIterator<T>(this.source);
    }
}
