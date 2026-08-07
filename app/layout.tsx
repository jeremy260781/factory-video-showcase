import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://etf-nodes.com"),
  title: {
    default: "Factory Tour Videos | Real Chinese Factory Tours for Global Buyers",
    template: "%s | Factory Tour Videos",
  },
  description: "Watch real first-person factory tour videos filmed on actual production floors across China. Verify source factories before you visit. Factory Direct Video Showcase by UltronFS.",
  keywords: ["factory tour video", "China factory verification", "source factory", "factory audit video", "supplier verification", "Chinese manufacturer video"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Factory Tour Videos",
    title: "Factory Tour Videos | Real Chinese Factory Tours",
    description: "First-person factory tour videos filmed on real production floors in China. Verify source factories before you visit.",
    url: "https://etf-nodes.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Factory Tour Videos | Real Chinese Factory Tours",
    description: "First-person factory tour videos filmed on real production floors in China.",
  },
};

export const viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
