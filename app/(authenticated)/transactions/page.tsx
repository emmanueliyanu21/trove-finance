import type { Metadata } from "next";
import { TransactionsView } from "@/components/TransactionsView/TransactionsView";

export const metadata: Metadata = {
  title: "Transactions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TransactionsPage() {
  return <TransactionsView />;
}
