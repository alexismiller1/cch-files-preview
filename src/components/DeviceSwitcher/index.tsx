import "./DeviceSwitcher.css";

export type DeviceType = "desktop" | "iphone17" | "pixel8" | "ipad";

export type DeviceSwitcherProps = {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
};

function DesktopIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
    </svg>
  );
}

function iPhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 1h-8A2.5 2.5 0 005 3.5v17A2.5 2.5 0 007.5 23h8a2.5 2.5 0 002.5-2.5v-17A2.5 2.5 0 0015.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H9V4h7v14z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-.65-.27-1.34-.48-2.07-.63L13 4.6c.03-.33-.23-.6-.56-.6h-1.11c-.33 0-.59.27-.56.6l.77 4.43c-.74.14-1.43.35-2.08.62L6.65 5.07c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.18 10.75 3 12.7 3 15c0 2.76 2.24 5 5 5h8c2.76 0 5-2.24 5-5 0-2.3-1.18-4.25-2.9-5.52zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

function iPadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zM12 19c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    </svg>
  );
}

const DEVICES: { id: DeviceType; label: string; Icon: React.ComponentType }[] = [
  { id: "desktop", label: "Desktop", Icon: DesktopIcon },
  { id: "ipad", label: "iPad", Icon: iPadIcon },
  { id: "iphone17", label: "iPhone 17", Icon: iPhoneIcon },
  { id: "pixel8", label: "Pixel 8", Icon: AndroidIcon },
];

export function DeviceSwitcher({ device, onDeviceChange }: DeviceSwitcherProps) {
  return (
    <div className="device-switcher" role="group" aria-label="Device preview">
      <span className="device-switcher__label">Device</span>
      <div className="device-switcher__tabs" role="tablist">
        {DEVICES.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={device === d.id}
            aria-label={`Preview on ${d.label}`}
            className={`device-switcher__tab ${device === d.id ? "device-switcher__tab--active" : ""}`}
            onClick={() => onDeviceChange(d.id)}
          >
            <span className="device-switcher__tab-icon" aria-hidden>
              <d.Icon />
            </span>
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
