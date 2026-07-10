"use client";

import { Icon } from "../Icon/Icon";
import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className={styles.wrap}>
      <Icon name="search" size={15} className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder ?? "Search"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
