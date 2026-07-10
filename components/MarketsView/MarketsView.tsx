"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { Layout } from "../Layout/Layout";
import { ComingSoon } from "@/components/shared/ComingSoon/ComingSoon";
import { DashboardSkeleton } from "@/components/shared/LoadingState/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";

export function MarketsView() {
  const { loading, error, userName, retry } = usePortfolio();

  return (
    <Layout userName={userName}>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <ComingSoon
          icon="markets"
          title="Markets are coming soon"
          message="Live market data, watchlists, and trends will live here."
        />
      )}
    </Layout>
  );
}
