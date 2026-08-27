import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";

export type AppMode = "cc-home" | "cc-desktop";
export type DisplayPreset = "full-desktop" | "content-only";
export type PreviewMode =
  | "small"
  | "fullscreen"
  | "split"
  | "action-tab"
  | "consolidated-open"
  | "primary-open"
  | "combined-actions";

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

/** CC Desktop overrides: browser chrome and TAB hidden, device locked to desktop */
const CC_DESKTOP_OVERRIDES: Partial<DisplayFlags> = {
  browserChrome: false,
  topAppBar: false,
  deviceSwitcher: false,
};

type DisplayConfigContextValue = {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  preset: DisplayPreset;
  setPreset: (preset: DisplayPreset) => void;
  flags: DisplayFlags;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
};

const PRESET_STORAGE_KEY = "display-preset";
const APP_MODE_STORAGE_KEY = "app-mode";
const PREVIEW_MODE_STORAGE_KEY = "files-preview-mode";

function loadPreset(): DisplayPreset {
  try {
    const stored = localStorage.getItem(PRESET_STORAGE_KEY);
    if (stored === "full-desktop" || stored === "content-only") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "full-desktop";
}

function loadAppMode(): AppMode {
  try {
    const stored = localStorage.getItem(APP_MODE_STORAGE_KEY);
    if (stored === "cc-home" || stored === "cc-desktop") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "cc-home";
}

function loadPreviewMode(): PreviewMode {
  try {
    const stored = localStorage.getItem(PREVIEW_MODE_STORAGE_KEY);
    if (
      stored === "small" ||
      stored === "fullscreen" ||
      stored === "split" ||
      stored === "action-tab" ||
      stored === "consolidated-open" ||
      stored === "primary-open" ||
      stored === "combined-actions"
    ) {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "fullscreen";
}

const DisplayConfigContext = createContext<DisplayConfigContextValue>({
  appMode: "cc-home",
  setAppMode: () => {},
  preset: "full-desktop",
  setPreset: () => {},
  flags: PRESET_FLAGS["full-desktop"],
  previewMode: "fullscreen",
  setPreviewMode: () => {},
});

export function DisplayConfigProvider({ children }: { children: ReactNode }) {
  const [appMode, setAppModeState] = useState<AppMode>(loadAppMode);
  const [preset, setPresetState] = useState<DisplayPreset>(loadPreset);
  const [previewMode, setPreviewModeState] = useState<PreviewMode>(loadPreviewMode);

  const setAppMode = useCallback((next: AppMode) => {
    setAppModeState(next);
    try {
      localStorage.setItem(APP_MODE_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setPreset = useCallback((next: DisplayPreset) => {
    setPresetState(next);
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setPreviewMode = useCallback((next: PreviewMode) => {
    setPreviewModeState(next);
    try {
      localStorage.setItem(PREVIEW_MODE_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const flags = useMemo(() => {
    const base = PRESET_FLAGS[preset];
    if (appMode === "cc-desktop") {
      return { ...base, ...CC_DESKTOP_OVERRIDES };
    }
    return base;
  }, [preset, appMode]);

  return (
    <DisplayConfigContext.Provider
      value={{ appMode, setAppMode, preset, setPreset, flags, previewMode, setPreviewMode }}
    >
      {children}
    </DisplayConfigContext.Provider>
  );
}

export function useDisplayConfig() {
  return useContext(DisplayConfigContext);
}
