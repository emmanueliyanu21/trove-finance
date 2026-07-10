"use client";

import dynamic from "next/dynamic";

const TransactionsView = dynamic(
  () => import("@/components/TransactionsView/TransactionsView").then((m) => m.TransactionsView),
  { ssr: false }
);

export default function TransactionsPageClient() {
  return <TransactionsView />;
}
