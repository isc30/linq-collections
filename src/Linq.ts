/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

// Node
export { IQueryable, IKeyValue, IGrouping, IEnumerable, IOrderedEnumerable, Enumerable } from "./Enumerables";
export { IIterable, ArrayIterator } from "./Iterators";
export { IReadOnlyList, IList, List, IReadOnlyDictionary, IDictionary, Dictionary, IStack, Stack } from "./Collections";
export { Comparer, ComparerResult } from './Comparers';
export * from './Types';

// Browser
import { Enumerable } from "./Enumerables";
import { ArrayIterator } from "./Iterators";
import { List, Dictionary, Stack } from "./Collections";

declare const window: any;

window.LinqCollections = {
    Enumerable,
    ArrayIterator,
    List, Dictionary, Stack
};
