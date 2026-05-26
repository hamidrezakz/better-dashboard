import { describe, expect, it } from "vitest";
import {
  buildDataTablePageNumbers,
  getDataTableItemRange,
} from "@/lib/data-table/pagination";

describe("getDataTableItemRange", () => {
  it("returns zero range when total is zero", () => {
    expect(getDataTableItemRange(1, 10, 0)).toEqual({ start: 0, end: 0 });
  });

  it("returns inclusive range for a page", () => {
    expect(getDataTableItemRange(2, 10, 25)).toEqual({ start: 11, end: 20 });
    expect(getDataTableItemRange(3, 10, 25)).toEqual({ start: 21, end: 25 });
  });
});

describe("buildDataTablePageNumbers", () => {
  it("returns all pages when total is small", () => {
    expect(buildDataTablePageNumbers(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("inserts ellipses for large page counts", () => {
    expect(buildDataTablePageNumbers(5, 10)).toEqual([
      1,
      "...",
      4,
      5,
      6,
      "...",
      10,
    ]);
  });
});
