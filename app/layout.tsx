import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HornMarket — Achetez et vendez près de chez vous",
  description: "Le marché en ligne de confiance pour toutes vos annonces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-100 transition-colors">
        <SessionProviderWrapper>
          <ThemeProvider>
            <LanguageProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
