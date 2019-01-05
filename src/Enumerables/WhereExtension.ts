import { Predicate, Selector } from "@lib/Core";
import { WhereIterator } from "@lib/Iterators";
import { Enumerable } from ".";
import { EnumerableBase, EnumerableConstructor } from "./EnumerableBase";

export interface WhereExtension<T>
{
    where(predicate: Predicate<T>): Enumerable<T>;
}

interface BaseClass<T>
{
    readonly prototype: T;
    new (): T;
}

function where<E, T extends EnumerableBase<E>>(baseClass: BaseClass<T>)
{
    // tslint:disable-next-line:max-line-length
    class BImpl extends (baseClass as BaseClass<EnumerableBase<E>>) implements WhereExtension<E>, EnumerableConstructor<E>
    {
        public where(predicate: Selector<E, boolean>): Enumerable<E>
        {
            return this.create(
                () => new WhereIterator(this.iterator(), predicate));
        }
    }

    return BImpl as BaseClass<T & WhereExtension<E>>;
}
