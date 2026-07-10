import type { Metadata } from "next";
import { MarketsView } from "@/components/MarketsView/MarketsView";

export const metadata: Metadata = {
  title: "Markets",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MarketsPage() {
  return <MarketsView />;
}
