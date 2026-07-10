export type Currency = "USD";

export interface RawHolding {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  currency: Currency;
}

export type TransactionType = "BUY" | "SELL";
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface RawTransaction {
  id: string;
  type: TransactionType;
  ticker: string;
  name: string;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  date: string;
  status: TransactionStatus;
}

export interface RawPortfolioData {
  user: {
    name: string;
    accountId: string;
    lastUpdated: string;
  };
  summary: {
    totalPortfolioValue: number;
    totalInvested: number;
    currency: Currency;
  };
  holdings: RawHolding[];
  transactions: RawTransaction[];
}

export interface Holding extends RawHolding {
  priceUnavailable: boolean;
  isClosedPosition: boolean;
  marketValue: number | null;
  costBasis: number;
  gainLossAmount: number | null;
  gainLossPercent: number | null;
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percent: number;
  color: string;
}

export interface AccountSummary {
  sector: string;
  positions: number;
  totalValue: number;
  gainLossPercent: number | null;
}

export interface PortfolioSummary {
  netWorth: number;
  totalCostBasis: number;
  changeAmount: number;
  changePercent: number;
  asOf: string;
}

export type Transaction = RawTransaction;
