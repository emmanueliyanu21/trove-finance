"use client";

import { usePortfolioContext } from "@/lib/context/PortfolioContext";
import { ComingSoon } from "@/components/shared/ComingSoon/ComingSoon";
import { DashboardSkeleton } from "@/components/shared/LoadingState/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";

export function MarketsView() {
  const { loading, error, retry } = usePortfolioContext();

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <ComingSoon
      icon="markets"
      title="Markets are coming soon"
      message="Live market data, watchlists, and trends will live here."
    />
  );
}
