import { Comparer } from ".";

export type EqualityComparer<T> = (l: T, r: T) => boolean;

export function createEqualityComparer<T>(
  comparer: Comparer<T>
): EqualityComparer<T> {
  return (l: T, r: T) => comparer(l, r) === 0;
}

export const defaultEqualityComparer = <T>(left: T, right: T) => left === right;
