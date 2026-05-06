import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// ── Change SITE_URL to your production domain when deployed ──────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://speedpulse.app";
const SITE_NAME = "SpeedPulse";

export const metadata: Metadata = {
  // ── Title template: page-specific title + site name ──────────────────────
  title: {
    default: `${SITE_NAME} — Free Internet Speed Test`,
    template: `%s | ${SITE_NAME}`,
  },

  // ── Primary description (150–160 chars is optimal) ───────────────────────
  description:
    "Check your internet speed instantly with SpeedPulse. Measure download speed, upload speed, and ping latency in seconds. Free, accurate, and no signup required.",

  // ── Keyword-rich tags (informational, not the primary ranking factor) ─────
  keywords: [
    "internet speed test",
    "wifi speed test",
    "broadband speed test",
    "free speed test",
    "check internet speed",
    "download speed test",
    "upload speed test",
    "ping test",
    "latency test",
    "network speed checker",
    "bandwidth test",
    "online speed test",
    "fast internet speed test",
    "mbps test",
    "connection speed test",
  ],

  // ── Authorship & robots ───────────────────────────────────────────────────
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Canonical URL ─────────────────────────────────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ── Open Graph (Facebook, LinkedIn, Slack previews) ───────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Free Internet Speed Test`,
    description:
      "Check your internet speed instantly. Measure download, upload & ping with real-time results powered by Cloudflare's global network.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "SpeedPulse — Internet Speed Test",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Internet Speed Test`,
    description:
      "Check your internet speed instantly. Measure download, upload & ping in seconds.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@speedpulse",
  },

  // ── Verification placeholders (fill in from Google Search Console etc.) ──
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION ?? "",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },

  // ── App metadata ──────────────────────────────────────────────────────────
  applicationName: SITE_NAME,
  category: "technology",
  classification: "Internet Tools",

  // ── Viewport & theme colour (improves mobile appearance in search) ────────
  other: {
    "theme-color": "#0a0e1a",
    "color-scheme": "dark",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": SITE_NAME,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to Cloudflare speed test servers for faster first request */}
        <link rel="preconnect" href="https://speed.cloudflare.com" />
        <link rel="dns-prefetch" href="https://speed.cloudflare.com" />

        {/* Favicon variants */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
