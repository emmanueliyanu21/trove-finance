import type { Metadata } from "next";
import TransactionsPageClient from "./TransactionsPageClient";

export const metadata: Metadata = {
  title: "Transactions",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TransactionsPage() {
  return <TransactionsPageClient />;
}
