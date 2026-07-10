"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { formatCurrency, formatPercent } from "@/lib/utils/format/format";
import { buildIllustrativeTrend, type TrendRange } from "@/lib/utils/trend/trend";
import { Icon } from "@/components/shared/Icon/Icon";
import styles from "./NetWorthCard.module.css";

interface NetWorthCardProps {
  netWorth: number;
  totalCostBasis: number;
  changeAmount: number;
  changePercent: number;
}

const RANGES: TrendRange[] = ["1D", "1W", "1M", "ALL"];

export function NetWorthCard({ netWorth, totalCostBasis, changeAmount, changePercent }: NetWorthCardProps) {
  const [hidden, setHidden] = useState(false);
  const [range, setRange] = useState<TrendRange>("ALL");
  const positive = changeAmount >= 0;

  const trend = useMemo(
    () => buildIllustrativeTrend(totalCostBasis, netWorth, range),
    [totalCostBasis, netWorth, range]
  );

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <span className={styles.label}>Total Net Worth</span>
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setHidden((v) => !v)}
            aria-pressed={hidden}
            aria-label={hidden ? "Show balance" : "Hide balance"}
          >
            <Icon name={hidden ? "eye-off" : "eye"} size={15} />
          </button>
        </div>

        {!hidden && (
          <div className={styles.rangeRow}>
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                className={`${styles.rangePill} ${range === r ? styles.rangePillActive : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{hidden ? "••••••" : formatCurrency(netWorth)}</span>
        {!hidden && (
          <span className={`${styles.change} ${positive ? styles.changePositive : styles.changeNegative}`}>
            <Icon name={positive ? "trending-up" : "trending-down"} size={14} className={styles.trenIcon} />
            {formatPercent(changePercent, { signed: true })}
          </span>
        )}
      </div>

      {!hidden && (
        <div className={styles.sparkline}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Area
                type="monotone"
                dataKey="y"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#netWorthGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
