"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/services/authService";
import { Sidebar } from "./Sidebar/Sidebar";
import { Topbar } from "./Topbar/Topbar";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [sessionUser] = useState<string | null>(() => getSession());
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
      <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      {mobileNavOpen && (
        <div className={styles.overlay} onClick={() => setMobileNavOpen(false)} aria-hidden />
      )}

      <div className={styles.content}>
        <Topbar onLogout={handleLogout} onMenuClick={() => setMobileNavOpen(true)} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
