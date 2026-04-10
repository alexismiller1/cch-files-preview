/* Context module: provider + hook (Fast Refresh expects single export). */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type SelectedAppContextValue = {
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
};

const SelectedAppContext = createContext<SelectedAppContextValue | null>(null);

export function SelectedAppProvider({ children }: { children: ReactNode }) {
  const [selectedAppId, setSelectedAppId] = useState("home");
  const value = useMemo(
    () => ({ selectedAppId, setSelectedAppId }),
    [selectedAppId]
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
