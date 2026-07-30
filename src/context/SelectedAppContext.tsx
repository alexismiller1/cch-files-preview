/* Context module: provider + hook (Fast Refresh expects single export). */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AiAssistantRequest = {
  thumbnail: string;
  prompt: string;
};

type NavEntry = { selectedAppId: string; homeNavId: string; placeholderApp: string | null };
type NavHistory = { entries: NavEntry[]; index: number };

type SelectedAppContextValue = {
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
  /** Selected CC Home primary nav page id (home/apps/files/benefits/create), used for the faux browser URL. */
  homeNavId: string;
  setHomeNavId: (id: string) => void;
  /** Carries a file thumbnail + prompt text from wherever an "AI Assistant" action card was
      clicked (e.g. Home) to the AI Assistant page, since navigation only passes a nav id. */
  aiAssistantRequest: AiAssistantRequest | null;
  setAiAssistantRequest: (request: AiAssistantRequest | null) => void;
  /** Name of the app whose placeholder screen ("{App} module") is currently taking over the
      page — set by quick actions/context-menu items on Home and Files. Tracked as part of nav
      history (rather than local component state) so the faux browser's real back/forward
      buttons are the way out of it, since the placeholder view itself has no back button and
      hides the primary nav/header entirely. */
  placeholderApp: string | null;
  setPlaceholderApp: (appName: string | null) => void;
  /** Browser-style session history over (selectedAppId, homeNavId, placeholderApp) triples,
      for the faux browser chrome's back/forward buttons. */
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
};

const SelectedAppContext = createContext<SelectedAppContextValue | null>(null);

const INITIAL_ENTRY: NavEntry = { selectedAppId: "home", homeNavId: "home", placeholderApp: null };

export function SelectedAppProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<NavHistory>({ entries: [INITIAL_ENTRY], index: 0 });
  const [aiAssistantRequest, setAiAssistantRequest] = useState<AiAssistantRequest | null>(null);
  const current = nav.entries[nav.index];

  const navigate = (partial: Partial<NavEntry>) => {
    setNav((prev) => {
      const currentEntry = prev.entries[prev.index];
      const nextEntry = { ...currentEntry, ...partial };
      if (
        nextEntry.selectedAppId === currentEntry.selectedAppId &&
        nextEntry.homeNavId === currentEntry.homeNavId &&
        nextEntry.placeholderApp === currentEntry.placeholderApp
      ) {
        return prev;
      }
      const truncated = prev.entries.slice(0, prev.index + 1);
      return { entries: [...truncated, nextEntry], index: truncated.length };
    });
  };

  const value = useMemo(
    () => ({
      selectedAppId: current.selectedAppId,
      setSelectedAppId: (id: string) => navigate({ selectedAppId: id }),
      homeNavId: current.homeNavId,
      setHomeNavId: (id: string) => {
        // Navigating anywhere other than the AI Assistant page clears any pending request, so
        // clicking the "AI Assistant" nav item directly (not via an action card) always lands
        // on a blank conversation rather than replaying a stale one.
        if (id !== "ai-assistant") {
          setAiAssistantRequest(null);
        }
        navigate({ homeNavId: id });
      },
      aiAssistantRequest,
      setAiAssistantRequest,
      placeholderApp: current.placeholderApp,
      setPlaceholderApp: (appName: string | null) => navigate({ placeholderApp: appName }),
      canGoBack: nav.index > 0,
      canGoForward: nav.index < nav.entries.length - 1,
      goBack: () => setNav((prev) => ({ ...prev, index: Math.max(0, prev.index - 1) })),
      goForward: () => setNav((prev) => ({ ...prev, index: Math.min(prev.entries.length - 1, prev.index + 1) })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nav, aiAssistantRequest]
  );

  return <SelectedAppContext.Provider value={value}>{children}</SelectedAppContext.Provider>;
}

export function useSelectedApp(): SelectedAppContextValue {
  const ctx = useContext(SelectedAppContext);
  if (!ctx) {
    throw new Error("useSelectedApp must be used within SelectedAppProvider");
  }
  return ctx;
}
