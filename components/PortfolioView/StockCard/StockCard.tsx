import type { Holding } from "@/lib/types";
import { formatCurrency, formatShares, formatSignedCurrency, formatPercent } from "@/lib/utils/format/format";
import { colorForSector, iconForSector } from "@/lib/utils/portfolio/portfolio";
import { Icon } from "@/components/shared/Icon/Icon";
import styles from "./StockCard.module.css";

export function StockCard({ holding, separated }: { holding: Holding; separated?: boolean }) {
  const positive = (holding.gainLossAmount ?? 0) >= 0;

  return (
    <div className={separated ? `${styles.card} ${styles.separated}` : styles.card}>
      <div className={styles.left}>
        <div className={styles.icon} style={{ color: colorForSector(holding.sector) }}>
          <Icon name={iconForSector(holding.sector)} size={20} />
        </div>
        <div className={styles.identity}>
          <div className={styles.ticker}>{holding.ticker}</div>
          <div className={styles.name}>{holding.name}</div>
        </div>
      </div>

      <div className={styles.shares}>
        <span className={styles.sharesLabel}>Shares</span>
        <span className={styles.sharesValue}>{formatShares(holding.shares)}</span>
      </div>

      <div className={styles.right}>
        {holding.priceUnavailable ? (
          <>
            <div className={styles.currentValue}>—</div>
            <span className={styles.unavailable}>Price unavailable</span>
          </>
        ) : (
          <>
            <div className={styles.currentValue}>{formatCurrency(holding.marketValue ?? 0)}</div>
            <div className={`${styles.gainLoss} ${positive ? styles.positive : styles.negative}`}>
               {formatSignedCurrency(holding.gainLossAmount ?? 0)} (
              {formatPercent(holding.gainLossPercent ?? 0)})
            </div>
          </>
        )}
      </div>
    </div>
  );
}
