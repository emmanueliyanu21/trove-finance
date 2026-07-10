"use client";

import dynamic from "next/dynamic";

const SettingsView = dynamic(
  () => import("@/components/SettingsView/SettingsView").then((m) => m.SettingsView),
  { ssr: false }
);

export default function SettingsPageClient() {
  return <SettingsView />;
}
