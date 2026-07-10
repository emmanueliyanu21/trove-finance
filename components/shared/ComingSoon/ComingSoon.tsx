import { Icon } from "../Icon/Icon";
import styles from "./ComingSoon.module.css";

interface ComingSoonProps {
  icon: string;
  title: string;
  message: string;
}

export function ComingSoon({ icon, title, message }: ComingSoonProps) {
  return (
    <div className={styles.wrap}>
      <Icon name={icon} size={28} className={styles.icon} />
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
