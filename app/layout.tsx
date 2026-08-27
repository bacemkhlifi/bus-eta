import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bus Sfax ETA",
  description: "Arabic and French bus arrival estimation for Sfax.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
