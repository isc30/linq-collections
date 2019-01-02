import { ArrayEnumerable, Enumerable, WhereEnumerable } from "@lib/Enumerables";
import { runIterableTests } from "../Iterators/Iterable.spec";
import { runEnumerableTests } from "./Enumerable.spec";

const instancer = <T>(elements: T[]) => new WhereEnumerable(
    new ArrayEnumerable(elements),
    e => true,
);

runIterableTests(instancer);
runEnumerableTests(instancer);
