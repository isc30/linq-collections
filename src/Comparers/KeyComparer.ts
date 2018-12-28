import { Selector } from "../Core";
import { Comparer } from ".";
import { EqualityComparer } from "./EqualityComparer";

export function createKeyComparer<TElement, TKey>(
  keySelector: Selector<TElement, TKey>,
  comparer: Comparer<TKey>
): Comparer<TElement> {
  return (l: TElement, r: TElement) => comparer(keySelector(l), keySelector(r));
}

export function createKeyEqualityComparer<TElement, TKey>(
  keySelector: Selector<TElement, TKey>,
  comparer: EqualityComparer<TKey>
): EqualityComparer<TElement> {
  return (l: TElement, r: TElement) => comparer(keySelector(l), keySelector(r));
}
