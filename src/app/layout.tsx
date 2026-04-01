import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AppProviders } from "./providers";
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
  icons: {
    icon: [
      {
        url: "/rallyon-mark-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/rallyon-mark-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: "/rallyon-mark-light.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-slate-50 font-sans text-slate-900 antialiased selection:bg-teal-200 selection:text-teal-900">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
