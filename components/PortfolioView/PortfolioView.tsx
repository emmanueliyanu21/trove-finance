"use client";

import { useMemo, useState } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { activeHoldings } from "@/lib/utils/portfolio/portfolio";
import { Layout } from "../layout/Layout";
import { StockCard } from "./StockCard/StockCard";
import { FilterPills } from "@/components/shared/FilterPills/FilterPills";
import { DashboardSkeleton } from "@/components/shared/LoadingState/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";
import styles from "./PortfolioView.module.css";

const ALL_SECTORS = "All";

export function PortfolioView() {
  const { loading, error, holdings, userName, retry } = usePortfolio();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState(ALL_SECTORS);

  const open = useMemo(() => activeHoldings(holdings), [holdings]);

  const sectorOptions = useMemo(() => {
    const sectors = [...new Set(open.map((h) => h.sector))];
    return [ALL_SECTORS, ...sectors];
  }, [open]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return open.filter((h) => {
      const matchesSector = sector === ALL_SECTORS || h.sector === sector;
      const matchesQuery =
        !query || h.ticker.toLowerCase().includes(query) || h.name.toLowerCase().includes(query);
      return matchesSector && matchesQuery;
    });
  }, [open, search, sector]);

  return (
    <Layout userName={userName} onSearch={setSearch}>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <div className={styles.section}>
          <h1 className={styles.title}>Holdings</h1>

          <FilterPills options={sectorOptions} active={sector} onChange={setSector} />

          <div className={styles.list}>
            {filtered.length === 0 ? (
              <p className={styles.empty}>No holdings match your search.</p>
            ) : (
              filtered.map((h) => <StockCard key={h.id} holding={h} />)
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
