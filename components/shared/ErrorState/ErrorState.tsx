import { Icon } from "../Icon/Icon";
import { Button } from "../Button/Button";
import styles from "./ErrorState.module.css";

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={styles.wrap} role="alert">
      <Icon name="alert-circle" size={28} className={styles.icon} />
      <p className={styles.title}>Couldn&apos;t load your portfolio</p>
      <p className={styles.message}>{message}</p>
      <Button variant="primary" onClick={onRetry} className={styles.retry}>
        Retry
      </Button>
    </div>
  );
}
