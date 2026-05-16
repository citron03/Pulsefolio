import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulsefolio",
  description: "Investment monitoring platform",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
