import type { Metadata } from "next";
import "./globals.css";
import "./ui.css";

export const metadata: Metadata = {
  title: "DivaViva Studio",
  description: "DivaViva ürün ve pazaryeri yönetim paneli"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
