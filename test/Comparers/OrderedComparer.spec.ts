import { Comparer } from "../../src/Comparers";

export function testOrderedComparer<T>(
    ascending: boolean,
    comparer: Comparer<T>,
    low: T,
    high: T,
): void
{
    expect(comparer(low, high)).toBe(ascending ? -1 : 1);
    expect(comparer(low, low)).toBe(0);
    expect(comparer(high, high)).toBe(0);
    expect(comparer(high, low)).toBe(ascending ? 1 : -1);
}
