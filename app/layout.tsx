import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Change Nudging Studio",
  description: "Strategic micro-interventions for enterprise change",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
