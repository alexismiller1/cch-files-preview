import { useMemo, useRef, useState } from "react";
import { ActionButton } from "@react-spectrum/s2";
import AppsAll from "@react-spectrum/s2/icons/AppsAll";
import { APP_ICONS } from "../appIcons";
import { DEFAULT_APPS, dedupeAppsById, MORE_APPS, type TopAppBarApp } from "../topAppBarApps.ts";
import { AppSwitcher } from "../AppSwitcher/index.tsx";
import "./AppHeaderBar.css";

export type AppHeaderBarProps = {
  /** Selected top-app id (matches Top App Bar selection) */
  selectedAppId: string;
  className?: string;
  /** Apps in the default TAB strip (same source as TopAppBar `apps`) */
  apps?: TopAppBarApp[];
  onAppSelect: (appId: string) => void;
  /**
   * Wide layout only: when the Top App Bar is collapsed, the AppsAll (9-grid) stays visible above;
   * add left inset so the product icon clears that control.
   */
  reserveSpaceForCollapsedTabButton?: boolean;
};

export function AppHeaderBar({
  selectedAppId,
  className = "",
  apps = DEFAULT_APPS,
  onAppSelect,
  reserveSpaceForCollapsedTabButton = false,
}: AppHeaderBarProps) {
  const iconSrc = APP_ICONS[selectedAppId] ?? APP_ICONS.home;
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const appSwitcherTriggerRef = useRef<HTMLDivElement>(null);

  /** TAB strip apps plus all “more” apps (Stock, Fonts), whether pinned to TAB or not */
  const webApps = useMemo(() => dedupeAppsById([...apps, ...MORE_APPS]), [apps]);

  return (
    <div
      className={`app-header-bar ${reserveSpaceForCollapsedTabButton ? "app-header-bar--tab-collapsed-offset" : ""} ${className}`.trim()}
      role="region"
      aria-label="Product header"
    >
      <div className="app-header-bar__icon-wrap" aria-hidden>
        <img src={iconSrc} alt="" width={24} height={24} />
      </div>
      <div className="app-header-bar__surface" />
      <div className="app-header-bar__mobile-tab-toggle">
        <div ref={appSwitcherTriggerRef} className="app-header-bar__app-switcher-anchor">
          <ActionButton
            isQuiet
            size="M"
            aria-label={appSwitcherOpen ? "Close app switcher" : "Open app switcher"}
            aria-expanded={appSwitcherOpen}
            aria-haspopup="dialog"
            onPress={() => setAppSwitcherOpen((open) => !open)}
          >
            <AppsAll />
          </ActionButton>
        </div>
      </div>
      <AppSwitcher
        isOpen={appSwitcherOpen}
        onClose={() => setAppSwitcherOpen(false)}
        triggerRef={appSwitcherTriggerRef}
        webApps={webApps}
        selectedAppId={selectedAppId}
        onSelectApp={onAppSelect}
        onAdobeHome={() => onAppSelect("home")}
        onAllApps={() => {
          /* Placeholder: same as legacy “View all apps” menu action */
        }}
      />
    </div>
  );
}

export default AppHeaderBar;
