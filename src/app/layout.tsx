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
  title: "Jeffery Patterson | Software Engineer",
  description:
    "Software engineer at AE Studio. Builder of AI tools, data platforms, and open source utilities.",
  openGraph: {
    title: "Jeffery Patterson | Software Engineer",
    description:
      "Software engineer at AE Studio. Builder of AI tools, data platforms, and open source utilities.",
    type: "website",
    locale: "en_US",
    siteName: "Jeffery Patterson",
  },
  twitter: {
    card: "summary",
    title: "Jeffery Patterson | Software Engineer",
    description:
      "Software engineer at AE Studio. Builder of AI tools, data platforms, and open source utilities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
