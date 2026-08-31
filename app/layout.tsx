import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "AIPPT — AI Presentation Generator",
  description: "Production-grade web-native AI presentation generator by @Robozonics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
