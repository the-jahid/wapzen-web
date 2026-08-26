"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeChoice,
} from "./theme-constants";

type ThemeContextValue = {
  /** What the user picked — "system" follows the OS setting. */
  theme: ThemeChoice;
  /** What is actually painted right now. */
  resolvedTheme: ResolvedTheme;
  setTheme: (next: ThemeChoice) => void;
  /** Flips between light and dark, resolving "system" first. */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredTheme(): ThemeChoice {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage unavailable (private mode, blocked cookies) — fall through.
  }
  return DEFAULT_THEME;
}

function applyTheme(resolved: ResolvedTheme, choice: ThemeChoice) {
  const root = document.documentElement;
  root.setAttribute("data-theme", resolved);
  root.setAttribute("data-theme-choice", choice);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initialisers read the same sources as the inline script, so React's
  // first render matches the DOM the script already produced.
  const [theme, setThemeState] = useState<ThemeChoice>(readStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    typeof window === "undefined"
      ? "light"
      : readStoredTheme() === "system"
        ? systemTheme()
        : (readStoredTheme() as ResolvedTheme),
  );

  const setTheme = useCallback((next: ThemeChoice) => {
    setThemeState(next);
    try {
      if (next === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Preference just won't persist; the in-memory choice still applies.
    }
    const resolved = next === "system" ? systemTheme() : next;
    setResolvedTheme(resolved);
    applyTheme(resolved, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Keep "system" live: follow the OS if the user hasn't pinned a theme.
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = query.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved, "system");
    };
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  // Mirror the preference across tabs.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      const next = readStoredTheme();
      setThemeState(next);
      const resolved = next === "system" ? systemTheme() : next;
      setResolvedTheme(resolved);
      applyTheme(resolved, next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}

function subscribeToThemeChoice(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme-choice"],
  });
  return () => observer.disconnect();
}

/**
 * Reads the preference straight off <html>, where the inline script wrote it
 * before first paint. Returns null during SSR and hydration so server and
 * client markup agree; React swaps in the real value right after.
 */
export function useThemeChoiceAttribute(): ThemeChoice | null {
  return useSyncExternalStore(
    subscribeToThemeChoice,
    () => document.documentElement.getAttribute("data-theme-choice") as ThemeChoice | null,
    () => null,
  );
}
