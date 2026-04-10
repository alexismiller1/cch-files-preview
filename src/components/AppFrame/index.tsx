import { type ReactNode, useState, type ComponentType } from "react";
import { Header } from "../Header";
import { PrimaryNav } from "../PrimaryNav";
import { HomePage } from "../../pages/HomePage";
import "./AppFrame.css";

const PAGE_MAP: Record<string, ComponentType> = {
  home: HomePage,
};

function BlankPage() {
  return <div className="app-frame-content" />;
}

type AppFrameProps = {
  insetLogo?: boolean;
  children?: ReactNode;
};

export function AppFrame({ insetLogo }: AppFrameProps) {
  const [navId, setNavId] = useState("home");
  const Page = PAGE_MAP[navId] ?? BlankPage;

  return (
    <div className="app-frame">
      <Header insetLogo={insetLogo} selectedNavId={navId} onNavSelect={setNavId} />

      <div className="app-frame-body">
        <PrimaryNav selectedId={navId} onSelect={setNavId} />
        <div className="app-frame-page">
          <Page />
        </div>
      </div>
    </div>
  );
}
