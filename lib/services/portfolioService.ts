import rawData from "@/lib/data/portfolio-data.json";
import type { RawPortfolioData } from "@/lib/types";

const DATA = rawData as RawPortfolioData;

const SIMULATED_LATENCY_MS = 500;

export async function fetchPortfolioData(options?: {
  forceError?: boolean;
}): Promise<RawPortfolioData> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

  if (options?.forceError) {
    throw new Error("Unable to reach the portfolio service. Please try again.");
  }

  return JSON.parse(JSON.stringify(DATA));
}
