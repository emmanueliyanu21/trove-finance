import type { RawTransaction } from "@/lib/types";
import { formatDate, formatShares, formatSignedCurrency } from "@/lib/utils/format/format";
import { StatusBadge } from "@/components/shared/StatusBadge/StatusBadge";
import styles from "./TransactionCard.module.css";

export function TransactionRow({ transaction }: { transaction: RawTransaction }) {
  const isFailed = transaction.status === "FAILED";
  const isBuy = transaction.type === "BUY";
  const signedAmount = isBuy ? -transaction.totalAmount : transaction.totalAmount;

  return (
    <div className={`${styles.row} ${isFailed ? styles.rowFailed : ""}`}>
      <div className={styles.left}>
        <div className={`${styles.icon} ${isBuy ? styles.iconBuy : styles.iconSell}`} aria-hidden>
          {isBuy ? "+" : "−"}
        </div>
        <div className={styles.identity}>
          <div className={styles.name}>
            {isBuy ? "Buy" : "Sell"} {transaction.name}
          </div>
          <div className={styles.meta}>
            {formatDate(transaction.date)} · {formatShares(transaction.shares)} Shares
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <span className={`${styles.amount} ${isFailed ? styles.amountFailed : ""}`}>
          {formatSignedCurrency(signedAmount)}
        </span>
        <StatusBadge status={transaction.status} />
      </div>
    </div>
  );
}
