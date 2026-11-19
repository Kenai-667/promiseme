import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { ensureSeeded } from "@/lib/seed";
import "./globals.css";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "promiseme.com — Read, Upload & Voice Your Stories",
  description: "High-resolution manga uploads, webtoon-style reading, community discussions, live chat, and a voice studio. No sign-up or verification required.",
  applicationName: "promiseme.com",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    title: "promiseme.com",
    statusBarStyle: "black-translucent",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "promiseme.com",
    title: "promiseme.com — Read, Upload & Voice Your Stories",
    description: "High-resolution manga, community chat, live rooms and a voice studio. No verification required.",
    url: "/",
    images: ["/images/hero-promise.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "promiseme.com",
    description: "Read, upload and voice your stories — no verification required.",
    images: ["/images/hero-promise.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0c0e",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f7f8] text-[#111318] antialiased">
        <SiteHeader />
        <main className="min-h-[65vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
