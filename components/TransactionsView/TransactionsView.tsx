"use client";

import { useMemo, useState } from "react";
import { usePortfolioContext } from "@/lib/context/PortfolioContext";
import { TransactionRow } from "./TransactionCard/TransactionCard";
import { FilterPills } from "@/components/shared/FilterPills/FilterPills";
import { DashboardSkeleton } from "@/components/shared/LoadingState/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import styles from "./TransactionsView.module.css";

const FILTER_OPTIONS = ["All", "Buy", "Sell"];

export function TransactionsView() {
  const { loading, error, transactions, retry } = usePortfolioContext();
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return transactions;
    const type = filter === "Buy" ? "BUY" : "SELL";
    return transactions.filter((t) => t.type === type);
  }, [transactions, filter]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className={styles.section}>
      <h1 className={styles.title}>Transactions</h1>

      <FilterPills options={FILTER_OPTIONS} active={filter} onChange={setFilter} />

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <p className={styles.empty}>No transactions match this filter.</p>
        ) : (
          filtered.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
