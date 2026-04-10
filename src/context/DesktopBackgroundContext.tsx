import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type DesktopBackground =
  | { type: "default" }
  | { type: "gradient"; dark: string; light: string }
  | { type: "image"; url: string };

type DesktopBackgroundContextValue = {
  background: DesktopBackground;
  randomizeBackground: () => void;
  setImageBackground: (url: string) => void;
  resetBackground: () => void;
};

const STORAGE_KEY = "desktop-background";

const DEFAULT_BG: DesktopBackground = { type: "default" };

/** Pre-generated gradient palettes — 20 hues evenly spaced around the color wheel. */
const GRADIENT_PALETTES: { dark: string; light: string }[] = [
  /* 0   red        */ { dark: "linear-gradient(160deg, hsl(0,50%,32%) 0%, hsl(357,48%,28%) 40%, hsl(354,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(0,38%,84%) 0%, hsl(357,28%,74%) 50%, hsl(354,22%,63%) 100%)" },
  /* 1   orange-red */ { dark: "linear-gradient(160deg, hsl(18,50%,32%) 0%, hsl(15,48%,28%) 40%, hsl(12,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(18,38%,84%) 0%, hsl(15,28%,74%) 50%, hsl(12,22%,63%) 100%)" },
  /* 2   orange     */ { dark: "linear-gradient(160deg, hsl(36,50%,32%) 0%, hsl(33,48%,28%) 40%, hsl(30,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(36,38%,84%) 0%, hsl(33,28%,74%) 50%, hsl(30,22%,63%) 100%)" },
  /* 3   gold       */ { dark: "linear-gradient(160deg, hsl(54,50%,32%) 0%, hsl(51,48%,28%) 40%, hsl(48,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(54,38%,84%) 0%, hsl(51,28%,74%) 50%, hsl(48,22%,63%) 100%)" },
  /* 4   yellow     */ { dark: "linear-gradient(160deg, hsl(72,50%,32%) 0%, hsl(69,48%,28%) 40%, hsl(66,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(72,38%,84%) 0%, hsl(69,28%,74%) 50%, hsl(66,22%,63%) 100%)" },
  /* 5   lime       */ { dark: "linear-gradient(160deg, hsl(90,50%,32%) 0%, hsl(87,48%,28%) 40%, hsl(84,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(90,38%,84%) 0%, hsl(87,28%,74%) 50%, hsl(84,22%,63%) 100%)" },
  /* 6   green      */ { dark: "linear-gradient(160deg, hsl(108,50%,32%) 0%, hsl(105,48%,28%) 40%, hsl(102,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(108,38%,84%) 0%, hsl(105,28%,74%) 50%, hsl(102,22%,63%) 100%)" },
  /* 7   emerald    */ { dark: "linear-gradient(160deg, hsl(126,50%,32%) 0%, hsl(123,48%,28%) 40%, hsl(120,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(126,38%,84%) 0%, hsl(123,28%,74%) 50%, hsl(120,22%,63%) 100%)" },
  /* 8   teal       */ { dark: "linear-gradient(160deg, hsl(144,50%,32%) 0%, hsl(141,48%,28%) 40%, hsl(138,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(144,38%,84%) 0%, hsl(141,28%,74%) 50%, hsl(138,22%,63%) 100%)" },
  /* 9   cyan       */ { dark: "linear-gradient(160deg, hsl(162,50%,32%) 0%, hsl(159,48%,28%) 40%, hsl(156,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(162,38%,84%) 0%, hsl(159,28%,74%) 50%, hsl(156,22%,63%) 100%)" },
  /* 10  sky        */ { dark: "linear-gradient(160deg, hsl(180,50%,32%) 0%, hsl(177,48%,28%) 40%, hsl(174,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(180,38%,84%) 0%, hsl(177,28%,74%) 50%, hsl(174,22%,63%) 100%)" },
  /* 11  azure      */ { dark: "linear-gradient(160deg, hsl(198,50%,32%) 0%, hsl(195,48%,28%) 40%, hsl(192,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(198,38%,84%) 0%, hsl(195,28%,74%) 50%, hsl(192,22%,63%) 100%)" },
  /* 12  blue       */ { dark: "linear-gradient(160deg, hsl(216,50%,32%) 0%, hsl(213,48%,28%) 40%, hsl(210,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(216,38%,84%) 0%, hsl(213,28%,74%) 50%, hsl(210,22%,63%) 100%)" },
  /* 13  indigo     */ { dark: "linear-gradient(160deg, hsl(234,50%,32%) 0%, hsl(231,48%,28%) 40%, hsl(228,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(234,38%,84%) 0%, hsl(231,28%,74%) 50%, hsl(228,22%,63%) 100%)" },
  /* 14  violet     */ { dark: "linear-gradient(160deg, hsl(252,50%,32%) 0%, hsl(249,48%,28%) 40%, hsl(246,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(252,38%,84%) 0%, hsl(249,28%,74%) 50%, hsl(246,22%,63%) 100%)" },
  /* 15  purple     */ { dark: "linear-gradient(160deg, hsl(270,50%,32%) 0%, hsl(267,48%,28%) 40%, hsl(264,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(270,38%,84%) 0%, hsl(267,28%,74%) 50%, hsl(264,22%,63%) 100%)" },
  /* 16  orchid     */ { dark: "linear-gradient(160deg, hsl(288,50%,32%) 0%, hsl(285,48%,28%) 40%, hsl(282,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(288,38%,84%) 0%, hsl(285,28%,74%) 50%, hsl(282,22%,63%) 100%)" },
  /* 17  magenta    */ { dark: "linear-gradient(160deg, hsl(306,50%,32%) 0%, hsl(303,48%,28%) 40%, hsl(300,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(306,38%,84%) 0%, hsl(303,28%,74%) 50%, hsl(300,22%,63%) 100%)" },
  /* 18  pink       */ { dark: "linear-gradient(160deg, hsl(324,50%,32%) 0%, hsl(321,48%,28%) 40%, hsl(318,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(324,38%,84%) 0%, hsl(321,28%,74%) 50%, hsl(318,22%,63%) 100%)" },
  /* 19  rose       */ { dark: "linear-gradient(160deg, hsl(342,50%,32%) 0%, hsl(339,48%,28%) 40%, hsl(336,55%,21%) 100%)", light: "linear-gradient(160deg, hsl(342,38%,84%) 0%, hsl(339,28%,74%) 50%, hsl(336,22%,63%) 100%)" },
];

function loadBackground(): DesktopBackground {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.type === "gradient" || parsed?.type === "image") return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_BG;
}

function saveBackground(bg: DesktopBackground) {
  try {
    if (bg.type === "default") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bg));
    }
  } catch {
    // ignore
  }
}

const DesktopBackgroundContext = createContext<DesktopBackgroundContextValue>({
  background: DEFAULT_BG,
  randomizeBackground: () => {},
  setImageBackground: () => {},
  resetBackground: () => {},
});

export function DesktopBackgroundProvider({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState<DesktopBackground>(loadBackground);

  const randomizeBackground = useCallback(() => {
    const palette = GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)];
    const bg: DesktopBackground = { type: "gradient", dark: palette.dark, light: palette.light };
    setBackground(bg);
    saveBackground(bg);
  }, []);

  const setImageBackground = useCallback((url: string) => {
    const bg: DesktopBackground = { type: "image", url };
    setBackground(bg);
    saveBackground(bg);
  }, []);

  const resetBackground = useCallback(() => {
    setBackground(DEFAULT_BG);
    saveBackground(DEFAULT_BG);
  }, []);

  return (
    <DesktopBackgroundContext.Provider
      value={{ background, randomizeBackground, setImageBackground, resetBackground }}
    >
      {children}
    </DesktopBackgroundContext.Provider>
  );
}

export function useDesktopBackground() {
  return useContext(DesktopBackgroundContext);
}
