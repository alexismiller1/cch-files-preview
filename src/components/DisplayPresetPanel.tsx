import { useDisplayConfig, type DisplayPreset } from "../context/DisplayConfigContext";
import "./DisplayPresetPanel.css";

const PRESETS: { id: DisplayPreset; label: string; icon: React.ReactNode }[] = [
  {
    id: "full-desktop",
    label: "Full desktop",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
      </svg>
    ),
  },
  {
    id: "content-only",
    label: "Content only",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
      </svg>
    ),
  },
];

export function DisplayPresetPanel() {
  const { preset, setPreset } = useDisplayConfig();

  return (
    <div className="display-preset-panel" role="group" aria-label="Display preset">
      <span className="display-preset-panel__label">View</span>
      <div className="display-preset-panel__tabs" role="tablist">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={preset === p.id}
            aria-label={p.label}
            className={`display-preset-panel__tab ${preset === p.id ? "display-preset-panel__tab--active" : ""}`}
            onClick={() => setPreset(p.id)}
          >
            <span className="display-preset-panel__tab-icon" aria-hidden>
              {p.icon}
            </span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
