# Linq for TypeScript
Best performance and 100% strongly typed *Linq* implementation for *TypeScript* (*ECMAScript 5*)

# How to run tests
* Call `Linq.UnitTests.run();`
* Run in browser

# Features

## Enumerable
Provides an internal iterator for the real collection
```typescript
static empty<TElement>(): IEnumerable<TElement>;

clone(): IEnumerable<TElement>;

asArray(): Array<TElement>;
toArray(): Array<TElement>;

reverse(): IEnumerable<TElement>;
concat(other: IEnumerable<TElement>): IEnumerable<TElement>;

aggregate(accumulator: Accumulator<TElement, TElement>, initialValue?: TElement): TElement;
aggregate<TOut>(accumulator: Accumulator<TElement, TOut>, initialValue: TOut): TOut;

count(): number;
count(predicate: Predicate<TElement, boolean>): number;

any(): boolean;
any(predicate: Predicate<TElement, boolean>): boolean;

all(predicate: Predicate<TElement, boolean>): boolean;

contains(element: TElement): boolean;

where(predicate: Predicate<TElement, boolean>): IEnumerable<TElement>;

select<TOut>(predicate: Predicate<TElement, TOut>): IEnumerable<TOut>;

elementAt(index: number): TElement;
elementAtOrDefault(index: number): TElement | undefined;

indexOf(element: TElement): number | undefined;
lastIndexOf(element: TElement): number | undefined;

first(): TElement;
first(predicate: Predicate<TElement, boolean>): TElement;

firstOrDefault(): TElement | undefined;
firstOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;

last(): TElement;
last(predicate: Predicate<TElement, boolean>): TElement;

lastOrDefault(): TElement | undefined;
lastOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;

single(): TElement;
single(predicate: Predicate<TElement, boolean>): TElement;

singleOrDefault(): TElement | undefined;
singleOrDefault(predicate: Predicate<TElement, boolean>): TElement | undefined;

distinct(): IEnumerable<TElement>;

min(): TElement;
max(): TElement;

skip(amount: number): IEnumerable<TElement>;
take(amount: number): IEnumerable<TElement>;
```
