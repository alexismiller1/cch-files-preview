export type ThemeMode = "light" | "dark";

export type DividerStyle = {
  width: string;
  color: string;
};

export type ThemeColorSet = {
  base: string;
  nav: string;
  panel: string;
  divider: DividerStyle;
};

export const THEME_COLORS: Record<ThemeMode, ThemeColorSet> = {
  light: {
    base: "#fff",
    nav: "rgba(0, 0, 0, 0.04)",
    panel: "rgba(255, 255, 255, 0.98)",
    divider: { width: "1px", color: "rgba(0, 0, 0, 0.1)" },
  },
  dark: {
    base: "#111",
    nav: "rgba(255, 255, 255, 0.06)",
    panel: "rgba(45, 45, 50, 0.98)",
    divider: { width: "1px", color: "rgba(255, 255, 255, 0.1)" },
  },
};
