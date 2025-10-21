import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import { MainContentWrapper } from "@/components/MainContentWrapper";

const SUIT = localFont({
  src: [
    { path: "./font/SUIT-Regular.ttf", weight: "400", style: "normal" },
    { path: "./font/SUIT-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./font/SUIT-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "출근빵 | 출근 도우미",
  description: "유루디아를 위한 출근 도우미 웹 서비스",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={SUIT.className}>
      <body className="text-sm">
        <Navbar />
        <MainContentWrapper>{children}</MainContentWrapper>
      </body>
    </html>
  );
}
