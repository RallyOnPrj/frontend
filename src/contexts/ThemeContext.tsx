"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "rallyon-theme";
const LEGACY_THEME_KEY = "drive-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
  const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY) as Theme | null;
  const initialTheme = savedTheme ?? legacyTheme;

  if (initialTheme === "dark" || initialTheme === "light") {
    return initialTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [theme, setThemeState] = useState<Theme>(() => {
    const initialTheme = getInitialTheme();
    if (typeof window === "undefined") {
      return initialTheme;
    }

    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const legacyTheme = localStorage.getItem(LEGACY_THEME_KEY) as Theme | null;
    if (!savedTheme && legacyTheme) {
      localStorage.setItem(THEME_KEY, initialTheme);
      localStorage.removeItem(LEGACY_THEME_KEY);
    }

    return initialTheme;
  });

  // 테마 변경 시 DOM 및 localStorage 업데이트
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(THEME_KEY, theme);
    localStorage.removeItem(LEGACY_THEME_KEY);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // 마운트 전에는 기본 라이트 테마로 렌더링 (hydration 불일치 방지)
  if (!isHydrated) {
    return (
      <ThemeContext.Provider
        value={{ theme: "light", toggleTheme: () => {}, setTheme: () => {} }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
