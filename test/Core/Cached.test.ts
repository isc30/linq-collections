import { Cached } from "../../src/Core/Cached";

describe("Constructor", constructor);
describe("Value", value);
describe("Invalidate", invalidate);

function constructor(): void {
  it("Starts invalidated", () => {
    const c = new Cached<number>();

    expect(c.isValid()).toBe(false);
  });
}

function value(): void {
  it("Throws exception if invalid", () => {
    const c = new Cached<number>();

    expect(c.isValid()).toBe(false);
    expect(() => c.value).toThrow();
  });

  it("Validate on value set", () => {
    const c = new Cached<number>();

    expect(c.isValid()).toBe(false);

    c.value = 33;
    expect(c.isValid()).toBe(true);
  });

  it("Get value", () => {
    const c = new Cached<number>();
    c.value = 33;

    expect(c.isValid()).toBe(true);
    expect(c.value).toBe(33);
  });
}

function invalidate(): void {
  it("Do nothing if already invalid", () => {
    const c = new Cached<number>();

    expect(c.isValid()).toBe(false);

    c.invalidate();
    c.invalidate();
    c.invalidate();

    expect(c.isValid()).toBe(false);
  });

  it("Make invalid if it was valid", () => {
    const c = new Cached<number>();

    expect(c.isValid()).toBe(false);

    c.value = 33;
    expect(c.isValid()).toBe(true);

    c.invalidate();
    expect(c.isValid()).toBe(false);
  });
}
