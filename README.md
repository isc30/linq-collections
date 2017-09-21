[![Build Status](https://travis-ci.org/isc30/linq-collections.svg?branch=master)](https://travis-ci.org/isc30/linq-collections)
[![Coverage Status](https://coveralls.io/repos/github/isc30/linq-collections/badge.svg?branch=master)](https://coveralls.io/github/isc30/linq-collections?branch=master) <- Please I need test contributors :D

# Linq-Collections: (IEnumerable, ...) + (List, Dictionary, ...)
Best performance and 100% strongly/statically typed *Linq* implementation for *TypeScript* (*ECMAScript 5*)
#### This library uses custom iterators and deferred execution mechanisms that ensure minimal CPU and RAM usage (no infinite array regenerations like other libraries do!!) ####
#### Strictly following C# original documentation
https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/classification-of-standard-query-operators-by-manner-of-execution

## How to run tests
This library uses `mocha` with custom assertion helper for testing.<br />
Use `nyc mocha` to run the tests and coverage.

## Features

#### Enumerable / IEnumerable
Provides an inmutable iterator for the real collection

```typescript
type Selector<TElement, TOut> = (element: TElement) => TOut;
type Predicate<TElement> = Selector<TElement, boolean>;
type Aggregator<TElement, TValue> = (previous: TValue, current: TElement) => TValue;
type Action<TElement> = (element: TElement, index: number) => void;
```

```typescript
interface IEnumerable<TOut>
{
    clone(): IEnumerable<TOut>;

    toArray(): TOut[];
    toList(): List<TOut>;

    aggregate(aggregator: Aggregator<TOut, TOut | undefined>): TOut;
    aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue: TValue): TValue;

    all(predicate: Predicate<TOut>): boolean;

    any(): boolean;
    any(predicate: Predicate<TOut>): boolean;

    average(selector: Selector<TOut, number>): number;

    concat(other: IEnumerable<TOut>, ...others: Array<IEnumerable<TOut>>): IEnumerable<TOut>;

    contains(element: TOut): boolean;

    count(): number;
    count(predicate: Predicate<TOut>): number;

    distinct(): IEnumerable<TOut>;
    distinct<TKey>(keySelector: Selector<TOut, TKey>): IEnumerable<TOut>;

    elementAt(index: number): TOut;

    elementAtOrDefault(index: number): TOut | undefined;

    first(): TOut;
    first(predicate: Predicate<TOut>): TOut;

    firstOrDefault(): TOut | undefined;
    firstOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    forEach(action: Action<TOut>): void;

    last(): TOut;
    last(predicate: Predicate<TOut>): TOut;

    lastOrDefault(): TOut | undefined;
    lastOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    max(): TOut;
    max<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    min(): TOut;
    min<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    reverse(): IEnumerable<TOut>;

    select<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): IEnumerable<TSelectorOut>;

    selectMany<TSelectorOut>(
        selector: Selector<TOut, TSelectorOut[] | IEnumerable<TSelectorOut>>):
        IEnumerable<TSelectorOut>;

    single(): TOut;
    single(predicate: Predicate<TOut>): TOut;

    singleOrDefault(): TOut | undefined;
    singleOrDefault(predicate: Predicate<TOut>): TOut | undefined;

    skip(amount: number): IEnumerable<TOut>;

    sum(): TOut;
    sum<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

    take(amount: number): IEnumerable<TOut>;

    where(predicate: Predicate<TOut>): IEnumerable<TOut>;
}
```

```typescript
class Enumerable<TOut> implements IEnumerable<TOut>
{
    static empty<TOut>(): IEnumerable<TOut>;
    static range(start: number, count: number): IEnumerable<number>;
    static repeat<TOut>(element: TOut, count: number): IEnumerable<TOut>;
}
```
