"use client";

import { useState } from "react";
import { usePortfolioContext } from "@/lib/context/PortfolioContext";
import { Icon } from "@/components/shared/Icon/Icon";
import { IconButton } from "@/components/shared/IconButton/IconButton";
import styles from "./Topbar.module.css";

interface IconButtonConfig {
  key: string;
  icon: string;
  label: string;
  size?: number;
  showDot?: boolean;
  mobileOnly?: boolean;
  onClick?: () => void;
}

interface TopbarProps {
  onLogout: () => void;
  onMenuClick: () => void;
}

export function Topbar({ onLogout, onMenuClick }: TopbarProps) {
  const { setSearchQuery } = usePortfolioContext();
  const [value, setValue] = useState("");

  const iconButtons: IconButtonConfig[] = [
    { key: "notifications", icon: "bell", label: "Notifications", showDot: true },
    { key: "help", icon: "help-circle", label: "Help" },
    { key: "logout", icon: "logout", label: "Log out", size: 15, mobileOnly: true, onClick: onLogout },
  ];

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      setSearchQuery(value.trim());
    }
  }

  return (
    <header className={styles.topbar}>
      <IconButton
        icon="menu"
        label="Open navigation menu"
        size={18}
        variant="ghost"
        onClick={onMenuClick}
        className={styles.menuButton}
      />

      <div className={styles.mobileBrand}>
        <div className={styles.brandMark}>T</div>
      </div>

      <div className={styles.searchWrap}>
        <Icon name="search" size={15} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search stocks, crypto…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className={styles.spacer} />

      <div className={styles.icons}>
        {iconButtons.map((btn) => (
          <IconButton
            key={btn.key}
            icon={btn.icon}
            label={btn.label}
            size={btn.size}
            variant="ghost"
            showBadge={btn.showDot}
            onClick={btn.onClick}
            className={btn.mobileOnly ? styles.mobileLogout : undefined}
          />
        ))}
      </div>
    </header>
  );
}
