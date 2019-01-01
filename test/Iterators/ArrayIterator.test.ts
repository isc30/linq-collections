import { ArrayIterator } from "../../src/Iterators";
import { runIteratorTests } from "./Iterator.spec";

runIteratorTests(<T>(e: T[]) => new ArrayIterator<T>(e));
