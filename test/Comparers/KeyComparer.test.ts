import {
  createKeyComparer,
  defaultOrderedComparer,
  defaultEqualityComparer,
  createEqualityComparer,
  createKeyEqualityComparer,
  EqualityComparer
} from "../../src/Comparers";
import { testOrderedComparer } from "./OrderedComparer.spec";
import { testEqualityComparer } from "./EqualityComparer.spec";

test.each([true, false])(
  "OrderedComparer compares keys, not values",
  (ascending: boolean) => {
    const comparer = defaultOrderedComparer<string>(ascending);
    const keyComparer = createKeyComparer<{ fullName: string }, string>(
      e => e.fullName,
      comparer
    );

    testOrderedComparer(
      ascending,
      keyComparer,
      { fullName: "aaa" },
      { fullName: "bbb" }
    );
  }
);

test.each([true, false])(
  "OrderedComparer compares keys, not values",
  (ascending: boolean) => {
    const comparer = defaultEqualityComparer;
    const keyEqualityComparer = createKeyEqualityComparer<
      { fullName: string },
      string
    >(e => e.fullName, comparer);

    testEqualityComparer(
      keyEqualityComparer,
      { fullName: "aaa" },
      { fullName: "bbb" }
    );
  }
);
