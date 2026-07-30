import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelectedApp } from "../context/SelectedAppContext";
import { useDisplayConfig } from "../context/DisplayConfigContext";
import { useDesktopBackground } from "../context/DesktopBackgroundContext";
import { displayHostnameForAppId } from "../utils/appDisplayHostname";
import AppShell from "../components/AppShell";
import StatusBar from "../components/StatusBar";
import SafariBrowserBar from "../components/SafariBrowserBar";
import { ResponsiveTester } from "../components/ResponsiveTester";
import { type DeviceType } from "../components/DeviceSwitcher";
import { SettingsFab } from "../components/SettingsFab";
import { THEME_COLORS } from "../themeColors";
import "../App.css";

import finderLight from "../assets/dock-icons/light/Finder.png";
import safariLight from "../assets/dock-icons/light/Safari.png";
import mailLight from "../assets/dock-icons/light/Mail.png";
import photosLight from "../assets/dock-icons/light/Photos.png";
import messagesLight from "../assets/dock-icons/light/Messages.png";
import mapsLight from "../assets/dock-icons/light/Maps.png";
import calendarLight from "../assets/dock-icons/light/Calendar.png";
import creativeCloudLight from "../assets/dock-icons/light/CreativeCloud.png";
import notesLight from "../assets/dock-icons/light/Notes.png";
import remindersLight from "../assets/dock-icons/light/Reminders.png";
import trashLight from "../assets/dock-icons/light/Trash.png";

import finderDark from "../assets/dock-icons/dark/Finder.png";
import safariDark from "../assets/dock-icons/dark/Safari.png";
import mailDark from "../assets/dock-icons/dark/Mail.png";
import photosDark from "../assets/dock-icons/dark/Photos.png";
import messagesDark from "../assets/dock-icons/dark/Messages.png";
import mapsDark from "../assets/dock-icons/dark/Maps.png";
import calendarDark from "../assets/dock-icons/dark/Calendar.png";
import creativeCloudDark from "../assets/dock-icons/dark/CreativeCloud.png";
import notesDark from "../assets/dock-icons/dark/Notes.png";
import remindersDark from "../assets/dock-icons/dark/Reminders.png";
import trashDark from "../assets/dock-icons/dark/Trash.png";

const MENU_ITEMS_REST = ["File", "Edit", "View", "Go", "Window", "Help"];

function formatMenubarDateTime(date: Date): string {
  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart.replace(",", "")} ${timePart}`;
}

const DOCK_APPS = [
  { name: "Finder", light: finderLight, dark: finderDark },
  { name: "Safari", light: safariLight, dark: safariDark },
  { name: "Mail", light: mailLight, dark: mailDark },
  { name: "Photos", light: photosLight, dark: photosDark },
  { name: "Messages", light: messagesLight, dark: messagesDark },
  { name: "Maps", light: mapsLight, dark: mapsDark },
  { name: "Calendar", light: calendarLight, dark: calendarDark },
  { name: "Creative Cloud", light: creativeCloudLight, dark: creativeCloudDark },
  { name: "Notes", light: notesLight, dark: notesDark },
  { name: "Reminders", light: remindersLight, dark: remindersDark },
  { name: "Trash", light: trashLight, dark: trashDark },
];

const HOME_PATH = "/";

type DesktopViewProps = {
  theme: "light" | "dark";
  setTheme: (fn: (t: "light" | "dark") => "light" | "dark") => void;
};

export function DesktopView({ theme, setTheme }: DesktopViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAppId, homeNavId, canGoBack, canGoForward, goBack, goForward } = useSelectedApp();
  const { appMode, preset, flags } = useDisplayConfig();
  const { background } = useDesktopBackground();
  const [dateTime, setDateTime] = useState(() => formatMenubarDateTime(new Date()));
  /** Browser chrome only — desktop-app chrome switch removed from UI */
  const windowContext = "browser" as const;
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [resizing, setResizing] = useState(false);
  const [browserWindowWidth, setBrowserWindowWidth] = useState<number | null>(1680);
  const [maxWindowWidth, setMaxWindowWidth] = useState(() =>
    typeof window !== "undefined" ? Math.max(320, window.innerWidth - 80) : 1920
  );

  useEffect(() => {
    if (appMode === "cc-desktop") {
      if (device !== "desktop") setDevice("desktop");
      if (browserWindowWidth != null && browserWindowWidth < 1200) setBrowserWindowWidth(1200);
    }
  }, [appMode, device, browserWindowWidth]);

  useEffect(() => {
    const onResize = () => setMaxWindowWidth(Math.max(320, window.innerWidth - 80));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(formatMenubarDateTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const path = location.pathname.replace(/\/$/, "") || "/";
    if (path !== "/") {
      navigate(HOME_PATH, { replace: true });
    }
  }, [location.pathname, navigate]);

  const colors = THEME_COLORS[theme];

  const isDesktopDevice = device === "desktop";
  const isFullDesktop = preset === "full-desktop";
  const windowWidth = browserWindowWidth;
  const setWindowWidth = setBrowserWindowWidth;
  const isCCDesktop = appMode === "cc-desktop";
  const minW = isCCDesktop ? 1200 : 320;
  const maxW = maxWindowWidth;
  const resizeDisabled = isCCDesktop && maxWindowWidth < 1200;

  /** When the viewport is narrower than the chosen width, cap at viewport minus 80px (same as maxW). */
  const desktopWindowCssWidth =
    windowWidth == null ? undefined : Math.min(windowWidth, maxWindowWidth);

  const resizeRef = useRef<{ centerX: number; edge: "left" | "right" } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizeRef.current || !containerRef.current) return;
      const { centerX, edge } = resizeRef.current;
      const newWidth =
        edge === "right" ? 2 * (e.clientX - centerX) : 2 * (centerX - e.clientX);
      setWindowWidth(Math.min(maxW, Math.max(minW, newWidth)));
    },
    [minW, maxW, setWindowWidth]
  );

  const handleResizeEnd = useCallback(() => {
    resizeRef.current = null;
    setResizing(false);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleResizeMove]);

  const handleResizeStart = useCallback(
    (edge: "left" | "right") => (e: React.MouseEvent) => {
      e.preventDefault();
      if (windowWidth == null || !containerRef.current) return;
      setResizing(true);
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      resizeRef.current = { centerX, edge };
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
    },
    [windowWidth, handleResizeMove, handleResizeEnd]
  );

  return (
    <div
      className="desktop"
      data-theme={theme}
      data-app-mode={appMode}
      data-display-preset={preset}
      data-window-context={windowContext}
      data-device={device}
      data-resizing={resizing || undefined}
      data-window-width={isDesktopDevice && isFullDesktop && windowWidth != null ? String(windowWidth) : undefined}
      style={
        {
          "--color-base": colors.base,
          "--color-nav": colors.nav,
          "--color-panel": colors.panel,
          "--divider-width": colors.divider.width,
          "--color-divider": colors.divider.color,
          ...(isDesktopDevice && isFullDesktop && windowWidth != null && {
            "--desktop-window-width": `${desktopWindowCssWidth}px`,
          }),
          ...(background.type === "gradient" && {
            background: theme === "dark" ? background.dark : background.light,
          }),
          ...(background.type === "image" && {
            background: `url(${background.url}) center/cover no-repeat`,
          }),
        } as React.CSSProperties
      }
    >
      {/* Menubar */}
      {flags.desktopChrome && (
        <header className="menubar">
          <div className="menubar-left">
            <span className="apple-logo" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </span>
            {[appMode === "cc-desktop" ? "Creative Cloud" : "Browser", ...MENU_ITEMS_REST].map((item) => (
              <button type="button" className="menubar-item" key={item}>
                {item}
              </button>
            ))}
          </div>
          <div className="menubar-right">
            <span className="menubar-icon" title="Volume" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </span>
            <span className="menubar-icon" title="Bluetooth" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
              </svg>
            </span>
            <span className="menubar-icon" title="Wi‑Fi" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.7 2.7 7.3 2.7 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
            </span>
            <span className="menubar-icon" title="Search" aria-hidden>
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </span>
            <span className="menubar-time">{dateTime}</span>
          </div>
        </header>
      )}

      {/* Desktop area */}
      {flags.desktopChrome && (
        <main className="desktop-area">
          <div className="desktop-icons" />
        </main>
      )}

      {/* Dock */}
      {flags.desktopChrome && (
        <nav className="dock" aria-label="Application dock">
          <div className="dock-inner">
            {DOCK_APPS.map((app) => {
              const isOpen = appMode === "cc-desktop"
                ? app.name === "Finder" || app.name === "Creative Cloud"
                : app.name === "Finder" || app.name === "Safari";
              return (
                <button
                  type="button"
                  className={`dock-item ${isOpen ? "dock-item--on" : ""} ${app.name === "Creative Cloud" ? "dock-item--creative-cloud" : ""}`}
                  key={app.name}
                  title={app.name}
                  aria-current={isOpen ? "true" : undefined}
                >
                  <img src={theme === "dark" ? app.dark : app.light} alt={app.name} className="dock-icon" />
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <div ref={containerRef} className="responsive-window-container">
        <div className="desktop-window-wrap">
          {isDesktopDevice && isFullDesktop && !resizeDisabled && (
            <div
              className="desktop-window-resize-handle desktop-window-resize-handle--left"
              onMouseDown={handleResizeStart("left")}
              aria-label="Resize window from left edge"
            />
          )}
          {isDesktopDevice ? (
            <div className="desktop-window">
              {flags.browserChrome && (
                <div className="browser-chrome-toolbar">
                  <div className="browser-chrome-traffic-lights">
                    <span className="browser-chrome-dot browser-chrome-dot--close" />
                    <span className="browser-chrome-dot browser-chrome-dot--minimize" />
                    <span className="browser-chrome-dot browser-chrome-dot--maximize" />
                  </div>
                  <div className="browser-chrome-nav">
                    <button
                      type="button"
                      className="browser-chrome-btn browser-chrome-btn--active"
                      aria-label="Back"
                      disabled={!canGoBack}
                      onClick={goBack}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="browser-chrome-btn browser-chrome-btn--active"
                      aria-label="Forward"
                      disabled={!canGoForward}
                      onClick={goForward}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </button>
                    <span className="browser-chrome-btn" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                      </svg>
                    </span>
                  </div>
                  <div className="browser-chrome-url-bar">
                    <span className="browser-chrome-url-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                      </svg>
                    </span>
                    <span className="browser-chrome-url-text">{displayHostnameForAppId(selectedAppId, homeNavId)}</span>
                  </div>
                </div>
              )}
              <div className="desktop-window-content">
                <AppShell windowContext="browser" />
              </div>
            </div>
          ) : (
            <div className={`device-frame device-frame--${device}`}>
              <div className="device-frame__phone">
                <div className="device-frame__screen">
                  {device === "iphone17" && <div className="device-frame__dynamic-island" aria-hidden />}
                  {device === "pixel8" && <div className="device-frame__camera" aria-hidden />}
                  {device === "ipad" && <div className="device-frame__camera device-frame__camera--tablet" aria-hidden />}
                  <div className="device-frame__viewport-wrap">
                    <div
                      className="device-frame__viewport"
                      style={{
                        width:
                          device === "iphone17"
                            ? 402
                            : device === "ipad"
                              ? 1180
                              : 412,
                        height:
                          device === "iphone17"
                            ? 874
                            : device === "ipad"
                              ? 820
                              : 915,
                      }}
                    >
                      {device === "iphone17" && <StatusBar />}
                      <div className="desktop-window device-frame__inner-window">
                        <div className="desktop-window-content">
                          <AppShell windowContext="browser" />
                        </div>
                      </div>
                      {device === "iphone17" && <SafariBrowserBar />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isDesktopDevice && isFullDesktop && !resizeDisabled && (
            <div
              className="desktop-window-resize-handle desktop-window-resize-handle--right"
              onMouseDown={handleResizeStart("right")}
              aria-label="Resize window from right edge"
            />
          )}
        </div>
        {flags.responsiveTester && isDesktopDevice && (
          <div className="responsive-tester-wrap">
            <ResponsiveTester
              width={windowWidth}
              onWidthChange={setWindowWidth}
              maxWidth={maxWindowWidth}
              minWidth={minW}
            />
          </div>
        )}
      </div>

      {/* Bottom left: settings FAB */}
      <SettingsFab
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        device={device}
        onDeviceChange={setDevice}
      />

    </div>
  );
}
