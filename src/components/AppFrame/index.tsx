import { type ReactNode, type ComponentType } from "react";
import { Header } from "../Header";
import { PrimaryNav } from "../PrimaryNav";
import { AppPlaceholderView } from "../AppPlaceholderView";
import { HomePage } from "../../pages/HomePage";
import { FilesPage } from "../../pages/FilesPage";
import { AiAssistantPage } from "../../pages/AiAssistantPage";
import { useSelectedApp } from "../../context/SelectedAppContext";
import "./AppFrame.css";

const PAGE_MAP: Record<string, ComponentType> = {
  home: HomePage,
  files: FilesPage,
  "ai-assistant": AiAssistantPage,
};

function BlankPage() {
  return <div className="app-frame-content" />;
}

type AppFrameProps = {
  insetLogo?: boolean;
  children?: ReactNode;
};

export function AppFrame({ insetLogo }: AppFrameProps) {
  const { homeNavId: navId, setHomeNavId: setNavId, placeholderApp } = useSelectedApp();
  const Page = PAGE_MAP[navId] ?? BlankPage;

  // A placeholder ("{App} module") takes over the entire frame below the top app-switcher
  // bar — no primary nav, no header — since its only way out is the browser chrome's real
  // back button (entering it is tracked as a step in nav history). The underlying page stays
  // mounted (just hidden) rather than being unmounted, so its local state — which file was
  // selected/opened, etc. — survives and is still there when the placeholder is dismissed.
  return (
    <div className="app-frame">
      {!placeholderApp && <Header insetLogo={insetLogo} selectedNavId={navId} onNavSelect={setNavId} />}

      <div className="app-frame-body">
        {!placeholderApp && <PrimaryNav selectedId={navId} onSelect={setNavId} />}
        <div className="app-frame-page">
          {placeholderApp && (
            <div className="app-frame-content">
              <AppPlaceholderView appName={placeholderApp} />
            </div>
          )}
          <div className={`app-frame-page-slot${placeholderApp ? " app-frame-page-hidden" : ""}`}>
            <Page />
          </div>
        </div>
      </div>
    </div>
  );
}
