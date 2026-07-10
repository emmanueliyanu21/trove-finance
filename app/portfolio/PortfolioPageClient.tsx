"use client";

import dynamic from "next/dynamic";

const PortfolioView = dynamic(
  () => import("@/components/PortfolioView/PortfolioView").then((m) => m.PortfolioView),
  { ssr: false }
);

export default function PortfolioPageClient() {
  return <PortfolioView />;
}
