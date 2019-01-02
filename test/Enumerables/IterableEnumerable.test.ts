import { ArrayEnumerable, Enumerable, WhereEnumerable } from "@lib/Enumerables";
import { IterableEnumerable } from "@lib/Enumerables/IterableEnumerable";
import { runIterableTests } from "../Iterators/Iterable.spec";
import { runEnumerableTests } from "./Enumerable.spec";

const instancer = <T>(elements: T[]) => new IterableEnumerable(
    new ArrayEnumerable(elements),
);

runIterableTests(instancer);
runEnumerableTests(instancer);
