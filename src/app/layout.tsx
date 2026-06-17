import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "./globals.css";

const wsName = process.env.NEXT_PUBLIC_WS_NAME ?? siteConfig.name;

export const metadata: Metadata = {
  title: wsName,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
