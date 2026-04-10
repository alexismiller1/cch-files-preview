import { useState } from "react";
import { useSelectedApp } from "../context/SelectedAppContext";
import { useDisplayConfig } from "../context/DisplayConfigContext";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";
import AppHeaderBar from "./AppHeaderBar/index.tsx";
import TopAppBar from "./TopAppBar/index.tsx";
import "./AppShell.css";

type WindowContext = "desktop" | "browser";

type AppShellProps = {
  /** When "desktop", Top App Bar is hidden (desktop app context) */
  windowContext?: WindowContext;
};

function AppShell({ windowContext = "browser" }: AppShellProps) {
  const { selectedAppId, setSelectedAppId } = useSelectedApp();
  const { flags } = useDisplayConfig();
  const [pinnedAppIds, setPinnedAppIds] = useState<string[]>([]);
  const [topAppBarExpanded, setTopAppBarExpanded] = useState(true);
  const isNarrowViewport = useMediaQuery("(max-width: 767px)");
  /** Wide layout: collapsed TAB leaves AppsAll visible — inset header so the product icon clears it */
  const reserveSpaceForCollapsedTabButton = !isNarrowViewport && !topAppBarExpanded;

  return (
    <div className="app-shell">
      {windowContext === "browser" && (
        <>
          {flags.topAppBar && (
            <TopAppBar
              selectedAppId={selectedAppId}
              onAppSelect={setSelectedAppId}
              pinnedAppIds={pinnedAppIds}
              onPinnedAppIdsChange={setPinnedAppIds}
              onExpandedChange={setTopAppBarExpanded}
            />
          )}
          {flags.appHeaderBar && (
            <AppHeaderBar
              selectedAppId={selectedAppId}
              onAppSelect={setSelectedAppId}
              reserveSpaceForCollapsedTabButton={reserveSpaceForCollapsedTabButton}
            />
          )}
        </>
      )}
      <div className="app-shell-body" />
    </div>
  );
}

export default AppShell;
