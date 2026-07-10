"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchPortfolioData } from "@/lib/services/portfolioService";
import { buildHoldings } from "@/lib/utils/portfolio/portfolio";
import type { Holding, RawPortfolioData, RawTransaction } from "@/lib/types";

interface PortfolioState {
  loading: boolean;
  error: string | null;
  holdings: Holding[];
  transactions: RawTransaction[];
  summary: RawPortfolioData["summary"] | null;
  userName: string | null;
  lastUpdated: string | null;
}

export function usePortfolio() {
  const [state, setState] = useState<PortfolioState>({
    loading: true,
    error: null,
    holdings: [],
    transactions: [],
    summary: null,
    userName: null,
    lastUpdated: null,
  });

  const load = useCallback(async (forceError = false) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchPortfolioData({ forceError });
      setState({
        loading: false,
        error: null,
        holdings: buildHoldings(data.holdings),
        transactions: data.transactions,
        summary: data.summary,
        userName: data.user.name,
        lastUpdated: data.user.lastUpdated,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Something went wrong.",
      }));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: () => load(false) };
}
