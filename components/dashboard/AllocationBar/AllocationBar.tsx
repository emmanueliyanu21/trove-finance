"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SectorAllocation } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils/format/format";
import styles from "./AllocationBar.module.css";

interface AllocationBarProps {
  allocation: SectorAllocation[];
}

export function AllocationBar({ allocation }: AllocationBarProps) {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  if (allocation.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title}>Allocation by Sector</span>
        </div>
        <p className={styles.empty}>No priced holdings to allocate yet.</p>
      </div>
    );
  }

  const row: Record<string, number | string> = { name: "Allocation" };
  for (const a of allocation) row[a.sector] = a.value;
  const total = allocation.reduce((s, a) => s + a.value, 0);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Asset Allocation</span>
      </div>

      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[row]} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis type="number" hide domain={[0, total]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active }) => {
                const segment = active ? allocation.find((a) => a.sector === hoveredSector) : null;
                if (!segment) return null;
                return (
                  <div className={styles.tooltip}>
                    <span className={styles.tooltipDot} style={{ background: segment.color }} aria-hidden />
                    <span className={styles.tooltipSector}>{segment.sector}</span>
                    <span className={styles.tooltipValue}>
                      {formatCurrency(segment.value)} ({formatPercent(segment.percent)})
                    </span>
                  </div>
                );
              }}
            />
            {allocation.map((a) => (
              <Bar
                key={a.sector}
                dataKey={a.sector}
                stackId="alloc"
                fill={a.color}
                onMouseEnter={() => setHoveredSector(a.sector)}
                onMouseLeave={() => setHoveredSector(null)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.legend}>
        {allocation.map((a) => (
          <div className={styles.legendItem} key={a.sector}>
            <span className={styles.dot} style={{ background: a.color }} aria-hidden />
            <div className={styles.legendText}>
              <span className={styles.sectorName}>{a.sector}</span>
              <span className={styles.sectorPercent}>
                {formatPercent(a.percent)}{" "}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
