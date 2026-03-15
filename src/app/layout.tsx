import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "RallyOn | Join Rally, Stay On Rally",
  description: "Korean badminton community and tournament platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-200 selection:text-teal-900">
        {children}
      </body>
    </html>
  );
}
