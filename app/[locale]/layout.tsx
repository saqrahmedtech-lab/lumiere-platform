import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
  Playfair_Display,
} from "next/font/google";
import { notFound } from "next/navigation";

import { hasLocale, isRTL, locales } from "@/lib/i18n";
import "../globals.css";
import ProgressProviders from "@/components/ui/progressBarProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-noto-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lumière",
  description: "Lumière e-commerce platform",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(locale)) notFound();

  const rtl = isRTL(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={[
        geistSans.variable,
        geistMono.variable,
        ibmPlexArabic.variable,
        playfair.variable,
        notoNaskhArabic.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <ProgressProviders>{children}</ProgressProviders>
      </body>
    </html>
  );
}
