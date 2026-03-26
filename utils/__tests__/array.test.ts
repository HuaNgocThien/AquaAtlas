import { getRandomItems } from "../array";

describe("getRandomItems", () => {
  it("returns empty array when input is empty", () => {
    expect(getRandomItems([], 3)).toEqual([]);
  });

  it("returns empty array when limit is 0", () => {
    expect(getRandomItems([1, 2, 3], 0)).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const source = [1, 2, 3, 4, 5];
    const snapshot = [...source];

    getRandomItems(source, 3);

    expect(source).toEqual(snapshot);
  });

  it("returns at most limit items and all items come from source", () => {
    const source = ["a", "b", "c", "d", "e"];
    const result = getRandomItems(source, 3);

    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.every((item) => source.includes(item))).toBe(true);
  });

  it("returns all items when limit exceeds source length", () => {
    const source = [10, 20, 30];
    const result = getRandomItems(source, 10);

    expect(result).toHaveLength(3);
    expect(result.every((item) => source.includes(item))).toBe(true);
  });
});
