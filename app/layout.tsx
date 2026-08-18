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
    default: "China Sourcing Partner | Supplier Matching & Factory Verification — ETF-NODES",
    template: "%s | ETF-NODES",
  },
  description: "ETF-NODES helps global buyers identify reliable manufacturers, verify production capability and manage OEM sourcing with confidence. Start your sourcing request.",
  keywords: ["China sourcing partner", "China supplier matching", "factory verification China", "China sourcing agent", "supplier sourcing", "factory audit", "import from China", "China procurement"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "ETF-NODES",
    title: "China Sourcing Partner | Supplier Matching & Factory Verification",
    description: "We help global buyers identify reliable manufacturers, verify production capability and manage OEM sourcing with confidence.",
    url: "https://etf-nodes.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "China Sourcing Partner | ETF-NODES",
    description: "Supplier matching, factory verification and export coordination for global buyers sourcing in China.",
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
