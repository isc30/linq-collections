import { Predicate } from "@lib/Core";
import { IteratorBase } from "./IteratorBase";

export class WhereIterator<T> extends IteratorBase<T>
{
    private readonly _source: Iterator<T>;
    private readonly _predicate: Predicate<T>;

    public constructor(
        source: Iterator<T>,
        predicate: Predicate<T>)
    {
        super();

        this._source = source;
        this._predicate = predicate;
    }

    public next(): IteratorResult<T>
    {
        let next = this._source.next();

        while (!next.done && !this._predicate(next.value))
        {
            next = this._source.next();
        }

        return next;
    }
}
