import { Predicate } from "../Core";
import { IteratorBase } from "./IteratorBase";

export class WhereIterator<T> extends IteratorBase<T>
{
    public constructor(
        protected source: Iterator<T>,
        protected predicate: Predicate<T>)
    {
        super();
    }

    public next(): IteratorResult<T>
    {
        let next = this.source.next();

        while (!next.done && !this.predicate(next.value))
        {
            next = this.source.next();
        }

        return next;
    }
}
