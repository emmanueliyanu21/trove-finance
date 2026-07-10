import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatPercent, formatShares, formatSignedCurrency } from "./format";

describe("formatCurrency", () => {
  it("formats a standard USD amount with two decimal places", () => {
    expect(formatCurrency(3229.5)).toBe("$3,229.50");
  });

  it("formats a compact amount without forcing decimals", () => {
    expect(formatCurrency(8100, { compact: true })).toBe("$8.1K");
  });
});

describe("formatSignedCurrency", () => {
  it("prefixes a positive amount with +", () => {
    expect(formatSignedCurrency(552)).toBe("+$552.00");
  });

  it("prefixes a negative amount with -, not a double sign", () => {
    expect(formatSignedCurrency(-161)).toBe("-$161.00");
  });

  it("has no sign prefix for zero", () => {
    expect(formatSignedCurrency(0)).toBe("$0.00");
  });
});

describe("formatPercent", () => {
  it("formats an unsigned percent using the absolute value", () => {
    expect(formatPercent(-6.08)).toBe("6.08%");
  });

  it("signs the percent when requested", () => {
    expect(formatPercent(20.62, { signed: true })).toBe("+20.62%");
    expect(formatPercent(-6.08, { signed: true })).toBe("-6.08%");
  });

  it("trims trailing zeros when requested", () => {
    expect(formatPercent(2.4, { trimTrailingZeros: true })).toBe("2.4%");
    expect(formatPercent(0.5, { trimTrailingZeros: true })).toBe("0.5%");
    expect(formatPercent(50, { trimTrailingZeros: true })).toBe("50%");
  });
});

describe("formatShares", () => {
  it("formats whole share counts with two decimal places", () => {
    expect(formatShares(15)).toBe("15.00");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as a short month/day/year", () => {
    expect(formatDate("2025-07-01T10:15:00Z")).toBe("Jul 1, 2025");
  });
});
