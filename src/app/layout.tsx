import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Jeffery Patterson | Software Engineer",
  description:
    "Software engineer at AE Studio. Education platforms, AI integrations, open source utilities, and practical automation.",
  openGraph: {
    title: "Jeffery Patterson | Software Engineer",
    description:
      "Software engineer at AE Studio. Education platforms, AI integrations, open source utilities, and practical automation.",
    type: "website",
    locale: "en_US",
    siteName: "Jeffery Patterson",
  },
  twitter: {
    card: "summary",
    title: "Jeffery Patterson | Software Engineer",
    description:
      "Software engineer at AE Studio. Education platforms, AI integrations, open source utilities, and practical automation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
