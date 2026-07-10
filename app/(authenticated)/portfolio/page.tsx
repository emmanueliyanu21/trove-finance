import type { Metadata } from "next";
import { PortfolioView } from "@/components/PortfolioView/PortfolioView";

export const metadata: Metadata = {
  title: "Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
