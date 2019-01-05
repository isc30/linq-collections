import { EqualityComparer } from "../../src/Comparers";

export function testEqualityComparer<T>(
    comparer: EqualityComparer<T>,
    left: T,
    right: T,
): void
{
    expect(comparer(left, right)).toBe(false);
    expect(comparer(right, left)).toBe(false);

    expect(comparer(left, left)).toBe(true);
    expect(comparer(right, right)).toBe(true);
}
