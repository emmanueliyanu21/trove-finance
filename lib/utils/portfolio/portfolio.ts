import type {
  AccountSummary,
  Holding,
  PortfolioSummary,
  RawHolding,
  RawPortfolioData,
  SectorAllocation,
} from "@/lib/types";

const SECTOR_COLORS: Record<string, string> = {
  Technology: "#006858",
  Healthcare: "#d3e8d4",
  Finance: "#7B79C9",
  Automotive: "#007f9c",
  Entertainment: "#00323D",
};
const FALLBACK_COLORS = ["#059A83", "#00B6DF", "#7B79C9", "#F2C891", "#00323D"];
const SECTOR_ORDER = ["Technology", "Automotive", "Healthcare", "Finance"];

export function colorForSector(sector: string, index = 0): string {
  return SECTOR_COLORS[sector] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

const SECTOR_ICONS: Record<string, string> = {
  Technology: "grid-dots",
  Healthcare: "medical",
  Finance: "bank",
  Automotive: "car",
  Entertainment: "portfolio",
};

export function iconForSector(sector: string): string {
  return SECTOR_ICONS[sector] ?? "portfolio";
}

export function buildHoldings(raw: RawHolding[]): Holding[] {
  return raw.map((h) => {
    const priceUnavailable = h.currentPrice === 0;
    const isClosedPosition = h.shares === 0;
    const costBasis = h.shares * h.avgCost;
    const marketValue = priceUnavailable ? null : h.shares * h.currentPrice;
    const gainLossAmount = marketValue === null ? null : marketValue - costBasis;
    const gainLossPercent =
      gainLossAmount === null || costBasis === 0 ? null : (gainLossAmount / costBasis) * 100;

    return {
      ...h,
      priceUnavailable,
      isClosedPosition,
      costBasis,
      marketValue,
      gainLossAmount,
      gainLossPercent,
    };
  });
}

export function activeHoldings(holdings: Holding[]): Holding[] {
  return holdings.filter((h) => !h.isClosedPosition);
}

export function computeSummary(
  summary: { totalPortfolioValue: number; totalInvested: number },
  asOf: string
): PortfolioSummary {
  const netWorth = summary.totalPortfolioValue;
  const totalCostBasis = summary.totalInvested;
  const changeAmount = netWorth - totalCostBasis;
  const changePercent = totalCostBasis === 0 ? 0 : (changeAmount / totalCostBasis) * 100;

  return { netWorth, totalCostBasis, changeAmount, changePercent, asOf };
}

export function computeSectorAllocation(holdings: Holding[]): SectorAllocation[] {
  const priced = activeHoldings(holdings).filter((h) => !h.priceUnavailable);
  const total = priced.reduce((sum, h) => sum + (h.marketValue ?? 0), 0);

  const bySector = new Map<string, number>();
  for (const h of priced) {
    bySector.set(h.sector, (bySector.get(h.sector) ?? 0) + (h.marketValue ?? 0));
  }

  return Array.from(bySector.entries())
    .map(([sector, value], index) => ({
      sector,
      value,
      percent: total === 0 ? 0 : (value / total) * 100,
      color: colorForSector(sector, index),
    }))
    .sort((a, b) => sectorOrderIndex(a.sector) - sectorOrderIndex(b.sector));
}

function sectorOrderIndex(sector: string): number {
  const index = SECTOR_ORDER.indexOf(sector);
  return index === -1 ? SECTOR_ORDER.length : index;
}

export function computeAccountSummaries(holdings: Holding[]): AccountSummary[] {
  const active = activeHoldings(holdings);
  const bySector = new Map<
    string,
    { positions: number; totalValue: number; costBasis: number; hasPriced: boolean }
  >();

  for (const h of active) {
    const entry = bySector.get(h.sector) ?? {
      positions: 0,
      totalValue: 0,
      costBasis: 0,
      hasPriced: false,
    };
    entry.positions += 1;
    entry.totalValue += h.marketValue ?? 0;
    if (!h.priceUnavailable) {
      entry.costBasis += h.costBasis;
      entry.hasPriced = true;
    }
    bySector.set(h.sector, entry);
  }

  return Array.from(bySector.entries())
    .map(([sector, { positions, totalValue, costBasis, hasPriced }]) => ({
      sector,
      positions,
      totalValue,
      gainLossPercent:
        hasPriced && costBasis > 0 ? ((totalValue - costBasis) / costBasis) * 100 : null,
    }))
    .sort((a, b) => sectorOrderIndex(a.sector) - sectorOrderIndex(b.sector));
}

export function closedHoldingsCount(holdings: Holding[]): number {
  return holdings.filter((h) => h.isClosedPosition).length;
}

export type { RawPortfolioData };
