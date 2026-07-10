"use client";

import dynamic from "next/dynamic";

const MarketsView = dynamic(
  () => import("@/components/MarketsView/MarketsView").then((m) => m.MarketsView),
  { ssr: false }
);

export default function MarketsPageClient() {
  return <MarketsView />;
}
