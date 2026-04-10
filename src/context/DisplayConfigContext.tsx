import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type DisplayPreset = "full-desktop" | "content-only";

export type DisplayFlags = {
  desktopChrome: boolean;
  browserChrome: boolean;
  topAppBar: boolean;
  appHeaderBar: boolean;
  deviceSwitcher: boolean;
  themeToggle: boolean;
  responsiveTester: boolean;
};

const PRESET_FLAGS: Record<DisplayPreset, DisplayFlags> = {
  "full-desktop": {
    desktopChrome: true,
    browserChrome: true,
    topAppBar: true,
    appHeaderBar: true,
    deviceSwitcher: true,
    themeToggle: true,
    responsiveTester: true,
  },
  "content-only": {
    desktopChrome: false,
    browserChrome: false,
    topAppBar: true,
    appHeaderBar: true,
    deviceSwitcher: false,
    themeToggle: false,
    responsiveTester: false,
  },
};

type DisplayConfigContextValue = {
  preset: DisplayPreset;
  setPreset: (preset: DisplayPreset) => void;
  flags: DisplayFlags;
};

const STORAGE_KEY = "display-preset";

function loadPreset(): DisplayPreset {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "full-desktop" || stored === "content-only") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "full-desktop";
}

const DisplayConfigContext = createContext<DisplayConfigContextValue>({
  preset: "full-desktop",
  setPreset: () => {},
  flags: PRESET_FLAGS["full-desktop"],
});

export function DisplayConfigProvider({ children }: { children: ReactNode }) {
  const [preset, setPresetState] = useState<DisplayPreset>(loadPreset);

  const setPreset = useCallback((next: DisplayPreset) => {
    setPresetState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return (
    <DisplayConfigContext.Provider value={{ preset, setPreset, flags: PRESET_FLAGS[preset] }}>
      {children}
    </DisplayConfigContext.Provider>
  );
}

export function useDisplayConfig() {
  return useContext(DisplayConfigContext);
}
