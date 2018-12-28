import { Comparer } from ".";

export function defaultOrderedComparer<T>(ascending: boolean): Comparer<T> {
  return ascending ? defaultAscendingComparer : defaultDescendingComparer;
}

export const defaultAscendingComparer = <T>(left: T, right: T) =>
  left < right ? -1 : left > right ? 1 : 0;

export const defaultDescendingComparer = <T>(left: T, right: T) =>
  left < right ? 1 : left > right ? -1 : 0;
