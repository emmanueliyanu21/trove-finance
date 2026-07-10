"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePortfolioContext } from "@/lib/context/PortfolioContext";
import {
  activeHoldings,
  computeAccountSummaries,
  computeSectorAllocation,
  computeSummary,
} from "@/lib/utils/portfolio/portfolio";
import { NetWorthCard } from "./NetWorthCard/NetWorthCard";
import { AllocationBar } from "./AllocationBar/AllocationBar";
import { AccountList } from "./AccountList/AccountList";
import { StockCard } from "../PortfolioView/StockCard/StockCard";
import { TransactionRow } from "../TransactionsView/TransactionCard/TransactionCard";
import { DashboardSkeleton } from "@/components/shared/LoadingState/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import styles from "./DashboardView.module.css";

const HOLDINGS_TRANSACTIONS_LIMIT = 5;

export function DashboardView() {
  const {
    loading,
    error,
    holdings,
    transactions,
    summary: rawSummary,
    lastUpdated,
    searchQuery,
    retry,
  } = usePortfolioContext();

  const summary = useMemo(
    () => computeSummary(rawSummary ?? { totalPortfolioValue: 0, totalInvested: 0 }, lastUpdated ?? ""),
    [rawSummary, lastUpdated]
  );
  const allocation = useMemo(() => computeSectorAllocation(holdings), [holdings]);
  const accounts = useMemo(() => computeAccountSummaries(holdings), [holdings]);

  const open = useMemo(() => activeHoldings(holdings), [holdings]);
  const isSearching = searchQuery.trim().length > 0;

  const filteredHoldings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return open;
    return open.filter(
      (h) => h.ticker.toLowerCase().includes(query) || h.name.toLowerCase().includes(query)
    );
  }, [open, searchQuery]);

  const displayHoldings = isSearching
    ? filteredHoldings
    : filteredHoldings.slice(0, HOLDINGS_TRANSACTIONS_LIMIT);
  const displayTransactions = transactions.slice(0, HOLDINGS_TRANSACTIONS_LIMIT);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className={styles.page}>
      <div className={styles.topGrid}>
        <NetWorthCard
          netWorth={summary.netWorth}
          totalCostBasis={summary.totalCostBasis}
          changeAmount={summary.changeAmount}
          changePercent={summary.changePercent}
        />
        <AllocationBar allocation={allocation} />
      </div>

      <AccountList accounts={accounts} />

      <div className={styles.columns}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>Holdings</h3>
            <Link href="/portfolio" className={styles.viewAll}>
              View All
            </Link>
          </div>

          <div className={styles.holdingsList}>
            {displayHoldings.length === 0 ? (
              <p className={styles.empty}>No holdings match your search.</p>
            ) : (
              displayHoldings.map((h) => <StockCard key={h.id} holding={h} separated />)
            )}
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <h3 className={styles.columnTitle}>Recent Transactions</h3>
            <Link href="/transactions" className={styles.viewAll}>
              View All
            </Link>
          </div>

          <div className={styles.list}>
            {displayTransactions.length === 0 ? (
              <p className={styles.empty}>No transactions yet.</p>
            ) : (
              displayTransactions.map((t) => <TransactionRow key={t.id} transaction={t} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
