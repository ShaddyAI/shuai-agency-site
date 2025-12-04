// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Script from "next/script";

import CookieConsent from "@/components/CookieConsent";
import {
  generateMetadata as genMeta,
  generateOrganizationSchema,
} from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// ---------- SITE METADATA ----------
export const metadata: Metadata = genMeta({
  title: "ShuAI Growth Engine",
  description:
    "Next-generation AI-powered growth website for agencies. Built with Next.js 14 + OpenAI.",
}) as any;

// ---------- ROOT LAYOUT ----------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>

      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
