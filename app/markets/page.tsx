import type { Metadata } from "next";
import MarketsPageClient from "./MarketsPageClient";

export const metadata: Metadata = {
  title: "Markets",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MarketsPage() {
  return <MarketsPageClient />;
}
