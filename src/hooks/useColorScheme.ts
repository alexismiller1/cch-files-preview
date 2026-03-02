import { useEffect, useState } from "react";

const STORAGE_KEY = "spectrum-color-scheme";

function getInitialColorScheme(): "light" | "dark" {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // Storage may be unavailable; fall back to system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useColorScheme() {
  const [colorScheme, setColorScheme] =
    useState<"light" | "dark">(getInitialColorScheme);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, colorScheme);
    } catch {
      // Ignore storage write errors.
    }
  }, [colorScheme]);

  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { colorScheme, setColorScheme, toggleColorScheme } as const;
}
