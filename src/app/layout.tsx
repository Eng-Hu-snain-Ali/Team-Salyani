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
  title: "Ustad Online | On-Demand Mechanic & Handyman App (Faisalabad)",
  description: "Connect with verified electricians, plumbers, AC technicians, and bike mechanics in Faisalabad at transparent, fixed rates. Powered by Ustad Online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
