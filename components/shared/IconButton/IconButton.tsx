import type { ButtonHTMLAttributes } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./IconButton.module.css";

interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | "aria-label" | "title"> {
  icon: string;
  label: string;
  size?: number;
  variant?: "ghost" | "outline";
  tone?: "neutral" | "danger";
  showBadge?: boolean;
  className?: string;
}

export function IconButton({
  icon,
  label,
  size,
  variant = "ghost",
  tone = "neutral",
  showBadge = false,
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.base} ${styles[variant]} ${styles[tone]} ${className ?? ""}`}
      title={label}
      aria-label={label}
      {...rest}
    >
      <Icon name={icon} size={size} />
      {showBadge && <span className={styles.badge} aria-hidden />}
    </button>
  );
}
