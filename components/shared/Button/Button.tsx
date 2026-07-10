import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: "primary" | "secondary" | "text";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.base} ${styles[variant]} ${fullWidth ? styles.fullWidth : ""} ${
        className ?? ""
      }`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden />}
      {children}
    </button>
  );
}
