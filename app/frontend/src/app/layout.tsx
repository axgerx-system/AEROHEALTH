import type { Metadata } from "next";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { LanguageProvider } from "@/i18n/language-provider";

export const metadata: Metadata = {
  title: "AEROHEALTH | Engineering intelligence for remaining life",
  description: "Research platform for turbofan degradation and Remaining Useful Life estimation on NASA C-MAPSS FD001.",
};

export const viewport: Viewport = { themeColor: "#05070A" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
