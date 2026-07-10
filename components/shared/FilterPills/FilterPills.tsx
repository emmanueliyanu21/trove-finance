"use client";

import styles from "./FilterPills.module.css";

interface FilterPillsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className={styles.row} role="tablist">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={active === option}
          className={`${styles.pill} ${active === option ? styles.pillActive : ""}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
