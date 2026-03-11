import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RallyOn - Badminton Tournament Management",
  description: "RallyOn으로 배드민턴 대회 운영을 더 간편하게 관리하세요.",
  icons: {
    icon: "/rallyon-favicon.svg",
  },
};

const themeInitScript = `
(() => {
  try {
    const THEME_KEY = "rallyon-theme";
    const LEGACY_THEME_KEY = "drive-theme";
    const savedTheme = localStorage.getItem(THEME_KEY);
    const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY);
    const theme = savedTheme ?? legacyTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
