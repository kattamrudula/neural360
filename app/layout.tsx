import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neural 360",
  description: "AI-powered Customer 360 for growth, optimization, and agentic intelligence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
