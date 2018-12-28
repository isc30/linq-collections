import { ArrayIterator } from "../../src/Iterators";
import { run as runIteratorTests } from "./Iterator.spec";

runIteratorTests(<T>(e: T[]) => new ArrayIterator<T>(e));
