"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/shared/Icon/Icon";
import { Button } from "@/components/shared/Button/Button";
import { IconButton } from "@/components/shared/IconButton/IconButton";
import styles from "./Sidebar.module.css";

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

interface SidebarProps {
  userName: string | null;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ userName, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 2200);
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandName}>Trove</span>
          <IconButton
            icon="x"
            label="Close navigation menu"
            size={16}
            variant="ghost"
            onClick={onClose}
            className={styles.closeSidebar}
          />
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
                onClick={onClose}
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
