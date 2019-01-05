import { ArrayIterator } from "@lib/Iterators";
import { EnumerableBase } from "./EnumerableBase";

export const arrayEnumerable = <T>(source: T[]) => new EnumerableBase(() => new ArrayIterator(source));
