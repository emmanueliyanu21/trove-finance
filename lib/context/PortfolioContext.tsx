"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";

interface PortfolioContextValue extends ReturnType<typeof usePortfolio> {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const portfolio = usePortfolio();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PortfolioContext.Provider value={{ ...portfolio, searchQuery, setSearchQuery }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolioContext must be used within a PortfolioProvider");
  return ctx;
}
