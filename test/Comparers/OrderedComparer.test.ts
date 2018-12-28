import { defaultOrderedComparer } from "../../src/Comparers";
import { testOrderedComparer } from "./OrderedComparer.spec";

test.each([true, false])("Respects Order", (ascending: boolean) => {
  const comparer = defaultOrderedComparer<number>(ascending);

  testOrderedComparer(ascending, comparer, 0, 1);
});
