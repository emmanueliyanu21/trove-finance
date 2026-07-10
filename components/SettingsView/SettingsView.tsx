"use client";

import { usePortfolio } from "@/hooks/usePortfolio";
import { Layout } from "../Layout/Layout";
import { ComingSoon } from "@/components/shared/ComingSoon/ComingSoon";
import { DashboardSkeleton } from "@/components/shared/LoadingState/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState/ErrorState";

export function SettingsView() {
  const { loading, error, userName, retry } = usePortfolio();

  return (
    <Layout userName={userName}>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : (
        <ComingSoon
          icon="settings"
          title="Settings are coming soon"
          message="Profile, security, and notification preferences will live here."
        />
      )}
    </Layout>
  );
}
