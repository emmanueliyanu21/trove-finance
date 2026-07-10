import { describe, expect, it } from "vitest";
import type { RawHolding } from "@/lib/types";
import {
  activeHoldings,
  buildHoldings,
  closedHoldingsCount,
  colorForSector,
  computeAccountSummaries,
  computeSectorAllocation,
  computeSummary,
} from "./portfolio";

function rawHolding(overrides: Partial<RawHolding>): RawHolding {
  return {
    id: "h",
    ticker: "TST",
    name: "Test Co.",
    sector: "Technology",
    shares: 10,
    avgCost: 100,
    currentPrice: 110,
    currency: "USD",
    ...overrides,
  };
}

describe("buildHoldings", () => {
  it("computes cost basis, market value, and gain/loss for a normal holding", () => {
    const [aapl] = buildHoldings([
      rawHolding({ ticker: "AAPL", shares: 15, avgCost: 178.5, currentPrice: 215.3 }),
    ]);

    expect(aapl.priceUnavailable).toBe(false);
    expect(aapl.isClosedPosition).toBe(false);
    expect(aapl.costBasis).toBeCloseTo(2677.5);
    expect(aapl.marketValue).toBeCloseTo(3229.5);
    expect(aapl.gainLossAmount).toBeCloseTo(552);
    expect(aapl.gainLossPercent).toBeCloseTo((552 / 2677.5) * 100);
  });

  it("flags a zero currentPrice as priceUnavailable and nulls out value/gain-loss", () => {
    const [nvda] = buildHoldings([
      rawHolding({ ticker: "NVDA", shares: 5, avgCost: 820, currentPrice: 0 }),
    ]);

    expect(nvda.priceUnavailable).toBe(true);
    expect(nvda.marketValue).toBeNull();
    expect(nvda.gainLossAmount).toBeNull();
    expect(nvda.gainLossPercent).toBeNull();
    expect(nvda.costBasis).toBeCloseTo(4100);
  });

  it("flags zero shares as a closed position", () => {
    const [dis] = buildHoldings([
      rawHolding({ ticker: "DIS", shares: 0, avgCost: 98.75, currentPrice: 112.4 }),
    ]);

    expect(dis.isClosedPosition).toBe(true);
    expect(dis.costBasis).toBe(0);
    expect(dis.marketValue).toBe(0);
  });

  it("nulls out gain/loss percent when cost basis is zero to avoid dividing by zero", () => {
    const [zeroCost] = buildHoldings([
      rawHolding({ shares: 10, avgCost: 0, currentPrice: 50 }),
    ]);

    expect(zeroCost.costBasis).toBe(0);
    expect(zeroCost.gainLossAmount).toBe(500);
    expect(zeroCost.gainLossPercent).toBeNull();
  });
});

describe("activeHoldings", () => {
  it("filters out closed (zero-share) positions", () => {
    const holdings = buildHoldings([
      rawHolding({ ticker: "AAPL", shares: 15 }),
      rawHolding({ ticker: "DIS", shares: 0 }),
    ]);

    expect(activeHoldings(holdings).map((h) => h.ticker)).toEqual(["AAPL"]);
  });
});

describe("computeSummary", () => {
  it("passes the mock data's summary totals straight through and derives change from them", () => {
    const summary = computeSummary(
      { totalPortfolioValue: 48250.75, totalInvested: 42000 },
      "2025-07-01T00:00:00Z"
    );

    expect(summary.netWorth).toBe(48250.75);
    expect(summary.totalCostBasis).toBe(42000);
    expect(summary.changeAmount).toBeCloseTo(6250.75);
    expect(summary.changePercent).toBeCloseTo((6250.75 / 42000) * 100);
    expect(summary.asOf).toBe("2025-07-01T00:00:00Z");
  });

  it("returns a zero change percent instead of NaN when invested is zero", () => {
    const summary = computeSummary({ totalPortfolioValue: 0, totalInvested: 0 }, "");

    expect(summary.totalCostBasis).toBe(0);
    expect(summary.changePercent).toBe(0);
  });
});

describe("computeSectorAllocation", () => {
  it("groups priced, open holdings by sector and computes percent share", () => {
    const holdings = buildHoldings([
      rawHolding({ ticker: "AAPL", sector: "Technology", shares: 10, avgCost: 100, currentPrice: 150 }),
      rawHolding({ ticker: "GOOGL", sector: "Technology", shares: 10, avgCost: 100, currentPrice: 50 }),
      rawHolding({ ticker: "JPM", sector: "Finance", shares: 10, avgCost: 100, currentPrice: 100 }),
    ]);

    const allocation = computeSectorAllocation(holdings);

    expect(allocation).toHaveLength(2);
    const tech = allocation.find((a) => a.sector === "Technology")!;
    const finance = allocation.find((a) => a.sector === "Finance")!;
    expect(tech.value).toBeCloseTo(2000);
    expect(finance.value).toBeCloseTo(1000);
    expect(tech.percent).toBeCloseTo(66.666, 2);
    expect(finance.percent).toBeCloseTo(33.333, 2);
    expect(allocation[0].sector).toBe("Technology");
  });

  it("excludes unpriced and closed holdings from the allocation entirely", () => {
    const holdings = buildHoldings([
      rawHolding({ ticker: "NVDA", sector: "Technology", currentPrice: 0 }),
      rawHolding({ ticker: "DIS", sector: "Entertainment", shares: 0 }),
    ]);

    expect(computeSectorAllocation(holdings)).toEqual([]);
  });
});

describe("computeAccountSummaries", () => {
  it("counts unpriced open holdings as a position with zero value", () => {
    const holdings = buildHoldings([
      rawHolding({ ticker: "AAPL", sector: "Technology", shares: 10, avgCost: 100, currentPrice: 150 }),
      rawHolding({ ticker: "NVDA", sector: "Technology", shares: 5, avgCost: 820, currentPrice: 0 }),
    ]);

    const [tech] = computeAccountSummaries(holdings);

    expect(tech.sector).toBe("Technology");
    expect(tech.positions).toBe(2);
    expect(tech.totalValue).toBeCloseTo(1500);
    expect(tech.gainLossPercent).toBeCloseTo(50);
  });

  it("excludes closed positions from the account grouping", () => {
    const holdings = buildHoldings([rawHolding({ ticker: "DIS", sector: "Entertainment", shares: 0 })]);

    expect(computeAccountSummaries(holdings)).toEqual([]);
  });

  it("has a null gain/loss percent when the sector has no priced holdings", () => {
    const holdings = buildHoldings([
      rawHolding({ ticker: "NVDA", sector: "Technology", shares: 5, avgCost: 820, currentPrice: 0 }),
    ]);

    const [tech] = computeAccountSummaries(holdings);

    expect(tech.gainLossPercent).toBeNull();
  });
});

describe("closedHoldingsCount", () => {
  it("counts only zero-share holdings", () => {
    const holdings = buildHoldings([
      rawHolding({ ticker: "AAPL", shares: 15 }),
      rawHolding({ ticker: "DIS", shares: 0 }),
      rawHolding({ ticker: "GOOGL", shares: 8 }),
    ]);

    expect(closedHoldingsCount(holdings)).toBe(1);
  });
});

describe("colorForSector", () => {
  it("returns the mapped palette color for a known sector", () => {
    expect(colorForSector("Technology")).toBe("#006858");
  });

  it("cycles through the fallback palette for an unmapped sector by index", () => {
    expect(colorForSector("Crypto", 0)).toBe("#059A83");
    expect(colorForSector("Crypto", 1)).toBe("#00B6DF");
  });
});
