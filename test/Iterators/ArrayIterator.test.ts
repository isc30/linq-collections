import { run as runIteratorTests } from "./Iterator.spec";
import { ArrayIterator } from "../../src/Iterators";

runIteratorTests(<T>(e: T[]) => new ArrayIterator<T>(e));
