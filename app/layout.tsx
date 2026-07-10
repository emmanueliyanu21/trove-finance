import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const title = "Trove — Portfolio Dashboard";
const description =
  "Track net worth, sector allocation, holdings, and transactions in one clean investment portfolio dashboard.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s · Trove",
  },
  description,
  keywords: [
    "portfolio dashboard",
    "investment tracker",
    "net worth tracker",
    "stock portfolio",
    "Trove",
  ],
  applicationName: "Trove",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    siteName: "Trove",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
