/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

// Node
export { IQueryable, IKeyValue, IGrouping, IEnumerable, IOrderedEnumerable, Enumerable } from "./Enumerables";
export { IIterable } from "./Iterators";
export { IReadOnlyList, IList, List, IReadOnlyDictionary, IDictionary, Dictionary, IStack, Stack } from "./Collections";
export { Comparer, ComparerResult, EqualityComparer, strictEqualityComparer } from './Comparers';
export * from './Types';

// Browser
import { Enumerable } from "./Enumerables";
import { List, Dictionary, Stack } from "./Collections";

declare const window: any;

if (window !== undefined)
{
    Object.freeze(window.Enumerable = Enumerable);
    Object.freeze(window.List = List);
    Object.freeze(window.Dictionary = Dictionary);
    Object.freeze(window.Stack = Stack);
}
