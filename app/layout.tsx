import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "msmeSaathi",
  description: "Blockchain-backed microfinance dashboard for MSMEs"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
