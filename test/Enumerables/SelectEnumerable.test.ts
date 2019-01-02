import { ArrayEnumerable, SelectEnumerable } from "@lib/Enumerables";
import { runIterableTests } from "../Iterators/Iterable.spec";
import { runEnumerableTests } from "./Enumerable.spec";

const instancer = <T>(elements: T[]) => new SelectEnumerable(
    new ArrayEnumerable(elements),
    e => e,
);

runIterableTests(instancer);
runEnumerableTests(instancer);
