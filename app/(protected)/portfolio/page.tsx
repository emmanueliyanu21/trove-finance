import type { Metadata } from "next";
import PortfolioPageClient from "./PortfolioPageClient";

export const metadata: Metadata = {
  title: "Portfolio",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
