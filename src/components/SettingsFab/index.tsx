import { useState, useRef, useEffect } from "react";
import { useDisplayConfig, type AppMode, type DisplayPreset } from "../../context/DisplayConfigContext";
import PropertiesIcon from "@react-spectrum/s2/icons/Properties";
import DeviceDesktopIcon from "@react-spectrum/s2/icons/DeviceDesktop";
import FullScreenIcon from "@react-spectrum/s2/icons/FullScreen";
import DeviceTabletIcon from "@react-spectrum/s2/icons/DeviceTablet";
import DevicePhoneIcon from "@react-spectrum/s2/icons/DevicePhone";
import LightenIcon from "@react-spectrum/s2/icons/Lighten";
import BrightnessContrastIcon from "@react-spectrum/s2/icons/BrightnessContrast";
import HomeIcon from "@react-spectrum/s2/icons/Home";
import AppIcon from "@react-spectrum/s2/icons/App";
import { useSelectedApp } from "../../context/SelectedAppContext";
import type { DeviceType } from "../DeviceSwitcher";
import "./SettingsFab.css";

const APP_MODES: { id: AppMode; label: string; icon: React.ReactNode }[] = [
  { id: "cc-home", label: "CC Home", icon: <HomeIcon /> },
  { id: "cc-desktop", label: "CC Desktop", icon: <AppIcon /> },
];

const VIEW_PRESETS: { id: DisplayPreset; label: string; icon: React.ReactNode }[] = [
  { id: "full-desktop", label: "Full desktop", icon: <DeviceDesktopIcon /> },
  { id: "content-only", label: "Content only", icon: <FullScreenIcon /> },
];

const DEVICES: { id: DeviceType; label: string; icon: React.ReactNode }[] = [
  { id: "desktop", label: "Desktop", icon: <DeviceDesktopIcon /> },
  { id: "ipad", label: "iPad", icon: <DeviceTabletIcon /> },
  { id: "iphone17", label: "iPhone", icon: <DevicePhoneIcon /> },
  { id: "pixel8", label: "Pixel", icon: <DevicePhoneIcon /> },
];

type SettingsFabProps = {
  theme: "light" | "dark";
  onThemeToggle: () => void;
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
};

export function SettingsFab({ theme, onThemeToggle, device, onDeviceChange }: SettingsFabProps) {
  const [open, setOpen] = useState(false);
  const { setSelectedAppId } = useSelectedApp();
  const { appMode, setAppMode, preset, setPreset } = useDisplayConfig();
  const isCCDesktop = appMode === "cc-desktop";
  const isContentOnly = preset === "content-only";
  const isDeviceDisabled = isContentOnly || isCCDesktop;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="settings-fab" ref={panelRef}>
      {open && (
        <div className="settings-fab__panel">
          {/* App mode */}
          <div className="settings-fab__section">
            <span className="settings-fab__label">App mode</span>
            <div className="settings-fab__row" role="tablist">
              {APP_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={appMode === m.id}
                  className={`settings-fab__chip ${appMode === m.id ? "settings-fab__chip--active" : ""}`}
                  onClick={() => {
                    setAppMode(m.id);
                    if (m.id === "cc-desktop") {
                      setSelectedAppId("home");
                      if (device !== "desktop") {
                        onDeviceChange("desktop");
                      }
                    }
                  }}
                >
                  <span className="settings-fab__chip-icon" aria-hidden>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* View */}
          <div className="settings-fab__section">
            <span className="settings-fab__label">View</span>
            <div className="settings-fab__row" role="tablist">
              {VIEW_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={preset === p.id}
                  className={`settings-fab__chip ${preset === p.id ? "settings-fab__chip--active" : ""}`}
                  onClick={() => {
                    setPreset(p.id);
                    if (p.id === "content-only" && device !== "desktop") {
                      onDeviceChange("desktop");
                    }
                  }}
                >
                  <span className="settings-fab__chip-icon" aria-hidden>{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Device */}
          <div className={`settings-fab__section ${isDeviceDisabled ? "settings-fab__section--disabled" : ""}`}>
            <span className="settings-fab__label">Device</span>
            <div className="settings-fab__row" role="tablist">
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  role="tab"
                  aria-selected={device === d.id}
                  aria-disabled={isDeviceDisabled || undefined}
                  className={`settings-fab__chip ${device === d.id ? "settings-fab__chip--active" : ""}`}
                  onClick={isDeviceDisabled ? undefined : () => onDeviceChange(d.id)}
                >
                  <span className="settings-fab__chip-icon" aria-hidden>{d.icon}</span>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="settings-fab__section">
            <span className="settings-fab__label">Theme</span>
            <div className="settings-fab__row" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={theme === "light"}
                className={`settings-fab__chip ${theme === "light" ? "settings-fab__chip--active" : ""}`}
                onClick={theme === "dark" ? onThemeToggle : undefined}
              >
                <span className="settings-fab__chip-icon" aria-hidden>
                  <LightenIcon />
                </span>
                Light
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={theme === "dark"}
                className={`settings-fab__chip ${theme === "dark" ? "settings-fab__chip--active" : ""}`}
                onClick={theme === "light" ? onThemeToggle : undefined}
              >
                <span className="settings-fab__chip-icon" aria-hidden>
                  <BrightnessContrastIcon />
                </span>
                Dark
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`settings-fab__trigger ${open ? "settings-fab__trigger--open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Page settings"
        aria-expanded={open}
      >
        <PropertiesIcon />
      </button>
    </div>
  );
}
