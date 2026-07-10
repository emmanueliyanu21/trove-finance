import type { AccountSummary } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils/format/format";
import styles from "./AccountList.module.css";

export function AccountList({ accounts }: { accounts: AccountSummary[] }) {
  return (
    <div className={styles.section}>
      <div className={styles.grid}>
        {accounts.map((account) => {
          const positive = (account.gainLossPercent ?? 0) >= 0;
          return (
            <div className={styles.card} key={account.sector}>
              <span className={styles.name}>{account.sector}</span>
              <span className={styles.value}>{formatCurrency(account.totalValue)}</span>
              <span className={styles.positions}>
                {account.positions} {account.positions === 1 ? "position" : "positions"}
              </span>
              {account.gainLossPercent !== null && (
                <span className={`${styles.change} ${positive ? styles.positive : styles.negative}`}>
                  {positive ? "▲" : "▼"} {formatPercent(account.gainLossPercent)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
