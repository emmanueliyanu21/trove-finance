import type { TransactionStatus } from "@/lib/types";
import styles from "./StatusBadge.module.css";

const CLASS_BY_STATUS: Record<TransactionStatus, string> = {
  COMPLETED: styles.completed,
  PENDING: styles.pending,
  FAILED: styles.failed,
};

const LABEL_BY_STATUS: Record<TransactionStatus, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <span className={`${styles.badge} ${CLASS_BY_STATUS[status]}`}>
      <span aria-hidden />
      {LABEL_BY_STATUS[status]}
    </span>
  );
}
