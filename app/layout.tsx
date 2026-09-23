import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "أجير | التحقق من تصريح أجير",
  description: "واجهة التحقق من تصريح أجير",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
