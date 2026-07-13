import type { ReactNode } from "react";
import "../globals.css";
import { Inter, Fraunces } from "next/font/google";
import { SITE } from "@/lib/site";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-ink-900 text-clay-50 antialiased">
        {children}
      </body>
    </html>
  );
}
