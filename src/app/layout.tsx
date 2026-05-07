import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendTrim AI",
  description: "Audit startup AI tool spend and find defensible savings in minutes.",
  openGraph: {
    title: "SpendTrim AI",
    description: "Audit startup AI tool spend and find defensible savings in minutes.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendTrim AI",
    description: "Audit startup AI tool spend and find defensible savings in minutes."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
