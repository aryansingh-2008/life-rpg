import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aetheria // Life RPG - Gamified Habit & Productivity Realm",
  description:
    "Translate mundane real-world tasks into tangible 3D RPG character progression, epic boss raids, non-linear leveling, and relic armory upgrades.",
  keywords: [
    "Life RPG",
    "Productivity Game",
    "Habit Tracker RPG",
    "Gamified Tasks",
    "3D Progression",
  ],
  authors: [{ name: "Aetheria Development Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500 selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
