import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import AppsAll from "@react-spectrum/s2/icons/AppsAll";
import Home from "@react-spectrum/s2/icons/Home";
import type { TopAppBarApp } from "../topAppBarApps.ts";
import { APP_ICONS } from "../appIcons";
import "./AppSwitcher.css";

function chunkApps<T>(items: T[], rowSize: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += rowSize) {
    rows.push(items.slice(i, i + rowSize));
  }
  return rows;
}

export type AppSwitcherProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
  /** Same list as TAB: default apps + pinned “more” apps */
  webApps: TopAppBarApp[];
  selectedAppId: string;
  onSelectApp: (appId: string) => void;
  onAdobeHome: () => void;
  onAllApps: () => void;
};

export function AppSwitcher({
  isOpen,
  onClose,
  triggerRef,
  webApps,
  selectedAppId,
  onSelectApp,
  onAdobeHome,
  onAllApps,
}: AppSwitcherProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const rows = chunkApps(webApps, 3);
  const [layout, setLayout] = useState<{ top: number; right: number } | null>(null);

  const updateLayout = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setLayout({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, [triggerRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setLayout(null);
      return;
    }
    updateLayout();
  }, [isOpen, updateLayout]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, true);
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout, true);
    };
  }, [isOpen, updateLayout]);

  useEffect(() => {
    if (!isOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || layout === null) return null;

  const style: CSSProperties = {
    position: "fixed",
    top: layout.top,
    right: layout.right,
    zIndex: 10000,
  };

  const portal = (
    <div
      ref={panelRef}
      className="app-switcher"
      role="dialog"
      aria-label="App switcher"
      style={style}
    >
      <div className="app-switcher__inner">
        <section className="app-switcher__section" aria-labelledby="app-switcher-web-apps-heading">
          <h2 id="app-switcher-web-apps-heading" className="app-switcher__title">
            Web apps
          </h2>
          <div className="app-switcher__grid">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="app-switcher__row" role="list">
                {row.map((app) => {
                  const icon = APP_ICONS[app.id];
                  const isCurrent = selectedAppId === app.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      role="listitem"
                      className="app-switcher__item"
                      aria-current={isCurrent ? "true" : undefined}
                      onClick={() => {
                        onSelectApp(app.id);
                        onClose();
                      }}
                    >
                      <span className="app-switcher__logo" aria-hidden>
                        {icon ? <img src={icon} alt="" width={40} height={40} /> : null}
                      </span>
                      <span className="app-switcher__label">{app.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <footer className="app-switcher__footer">
          <div className="app-switcher__footer-bar">
            <button
              type="button"
              className="app-switcher__footer-item"
              onClick={() => {
                onAdobeHome();
                onClose();
              }}
            >
              <span className="app-switcher__footer-icon" aria-hidden>
                <Home />
              </span>
              <span className="app-switcher__footer-label">Adobe Home</span>
            </button>
            <button
              type="button"
              className="app-switcher__footer-item"
              onClick={() => {
                onAllApps();
                onClose();
              }}
            >
              <span className="app-switcher__footer-icon" aria-hidden>
                <AppsAll />
              </span>
              <span className="app-switcher__footer-label">All apps</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );

  return createPortal(portal, document.body);
}

export default AppSwitcher;
