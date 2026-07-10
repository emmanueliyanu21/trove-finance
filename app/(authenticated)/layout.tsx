"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { PortfolioProvider } from "@/lib/context/PortfolioContext";

const Layout = dynamic(() => import("@/components/layout/Layout").then((m) => m.Layout), {
  ssr: false,
});

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <PortfolioProvider>
      <Layout>{children}</Layout>
    </PortfolioProvider>
  );
}
