"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/services/authService";
import { Icon } from "@/components/shared/Icon/Icon";
import { Button } from "@/components/shared/Button/Button";
import { IconButton } from "@/components/shared/IconButton/IconButton";
import styles from "./Layout.module.css";

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href?: string;
  disabled?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { key: "portfolio", label: "Portfolio", icon: "portfolio", href: "/portfolio" },
  { key: "transactions", label: "Transactions", icon: "transactions", href: "/transactions" },
  { key: "markets", label: "Markets", icon: "markets", href: "/markets" },
  { key: "settings", label: "Settings", icon: "settings", href: "/settings" },
];

function Sidebar({ userName }: { userName: string | null }) {
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2200);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Trove</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            if (!item.href || item.disabled) {
              return (
                <button key={item.key} type="button" className={styles.navItem} disabled>
                  <span className={styles.navIcon}>
                    <Icon name={item.icon} />
                  </span>
                  {item.label}
                </button>
              );
            }

            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <span className={styles.navIcon}>
                  <Icon name={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={styles.bottom}>
        <div className={styles.profile}>
          {userName ? (
            <>
              <div className={styles.avatar}>{userName.slice(0, 2)}</div>
              <div className={styles.profileText}>
                <div className={styles.profileName}>{userName}</div>
                <div className={styles.profileTier}>Premium Member</div>
              </div>
            </>
          ) : (
            <>
              <div className={`${styles.avatar} ${styles.avatarSkeleton}`} aria-hidden />
              <div className={styles.profileText}>
                <div className={`${styles.skeletonLine} ${styles.skeletonLineName}`} aria-hidden />
                <div className={`${styles.skeletonLine} ${styles.skeletonLineTier}`} aria-hidden />
              </div>
            </>
          )}
        </div>

        <div className={styles.addFundsWrap}>
          {showToast && <div className={styles.toast}>Adding funds isn&apos;t available in this demo.</div>}
          <Button variant="primary" fullWidth className={styles.addFunds} onClick={() => setShowToast(true)}>
            Add Funds
          </Button>
        </div>
      </div>
    </aside>
  );
}

interface IconButtonConfig {
  key: string;
  icon: string;
  label: string;
  size?: number;
  showDot?: boolean;
  mobileOnly?: boolean;
  onClick?: () => void;
}

function Topbar({ onSearch, onLogout }: { onSearch: (query: string) => void; onLogout: () => void }) {
  const [value, setValue] = useState("");

  const iconButtons: IconButtonConfig[] = [
    { key: "notifications", icon: "bell", label: "Notifications", showDot: true },
    { key: "help", icon: "help-circle", label: "Help" },
    { key: "logout", icon: "logout", label: "Log out", size: 15, mobileOnly: true, onClick: onLogout },
  ];

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      onSearch(value.trim());
    }
  }

  return (
    <header className={styles.topbar}>
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

interface LayoutProps {
  userName?: string | null;
  onSearch?: (query: string) => void;
  children: ReactNode;
}

export function Layout({ userName, onSearch, children }: LayoutProps) {
  const router = useRouter();
  const [sessionUser] = useState<string | null>(() => getSession());

  useEffect(() => {
    if (!sessionUser) {
      router.replace("/");
    }
  }, [sessionUser, router]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (!sessionUser) return null;

  return (
    <div className={styles.shell}>
      <Sidebar userName={userName ?? null} />

      <div className={styles.content}>
        <Topbar onSearch={onSearch ?? (() => {})} onLogout={handleLogout} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
