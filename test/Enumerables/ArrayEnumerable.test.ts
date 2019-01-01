import { ArrayEnumerable } from "../../src/Enumerables/ArrayEnumerable";
import { runIterableTests } from "../Iterators/Iterable.spec";

runIterableTests(<T>(elements: T[]) => new ArrayEnumerable<T>(elements));
