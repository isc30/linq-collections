import {
  defaultOrderedComparer,
  createEqualityComparer
} from "../../src/Comparers";
import { testEqualityComparer } from "./EqualityComparer.spec";

test.each([true, false])(
  "Comparer can be used as EqualityComparer",
  (ascending: boolean) => {
    const comparer = defaultOrderedComparer<number>(ascending);
    const equalityComparer = createEqualityComparer(comparer);

    testEqualityComparer(equalityComparer, 0, 1);
  }
);
