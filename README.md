# TsLinq: Linq for TypeScript
Best performance and 100% strongly typed *Linq* implementation for *TypeScript* (*ECMAScript 5*)

## How to run tests
* Call `UnitTests.run();`
* Run in browser (console) or nodejs

## Features

#### Enumerable
Provides an internal iterator for the real collection
```typescript
static empty<TElement>(): IEnumerable<TElement>;
static range(start: number, count: number): IEnumerable<number, number>;
static repeat<TElement>(element: TElement, count: number): IEnumerable<TElement, TElement>;

clone(): IEnumerable<TElement, TOut>;

toArray(): Array<TOut>;
toList(): List<TOut>;

count(): number;
count(predicate: Predicate<TOut>): number;

any(): boolean;
any(predicate: Predicate<TOut>): boolean;

all(predicate: Predicate<TOut>): boolean;

reverse(): IEnumerable<TOut, TOut>;

contains(element: TOut): boolean;

where(predicate: Predicate<TOut>): IEnumerable<TOut, TOut>;

select<TPredicateOut>(selector: Selector<TOut, TPredicateOut>): IEnumerable<TOut, TPredicateOut>;

concat(other: IEnumerable<TElement, TOut>): IEnumerable<TOut, TOut>;

first(): TOut;
first(predicate: Predicate<TOut>): TOut;

firstOrDefault(): TOut | undefined;
firstOrDefault(predicate: Predicate<TOut>): TOut | undefined;

last(): TOut;
last(predicate: Predicate<TOut>): TOut;

lastOrDefault(): TOut | undefined;
lastOrDefault(predicate: Predicate<TOut>): TOut | undefined;

single(): TOut;
single(predicate: Predicate<TOut>): TOut;

singleOrDefault(): TOut | undefined;
singleOrDefault(predicate: Predicate<TOut>): TOut | undefined;

distinct(): IEnumerable<TOut, TOut>;

aggregate(aggregator: Aggregator<TOut, TOut | undefined>): TOut;
aggregate<TValue>(aggregator: Aggregator<TOut, TValue>, initialValue: TValue): TValue;

min(): TOut;
min<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

max(): TOut;
max<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

sum(): TOut;
sum<TSelectorOut>(selector: Selector<TOut, TSelectorOut>): TSelectorOut;

average(selector: Selector<TOut, number>): number;

skip(amount: number): IEnumerable<TOut, TOut>;
take(amount: number): IEnumerable<TOut, TOut>;
```
