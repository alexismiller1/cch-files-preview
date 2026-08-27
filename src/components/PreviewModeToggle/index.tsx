import type { PreviewMode } from "../../context/DisplayConfigContext";
import "./PreviewModeToggle.css";

const OPTIONS: { id: PreviewMode; label: string; disabled?: boolean }[] = [
  { id: "small", label: "Small modal", disabled: true },
  { id: "fullscreen", label: "Full screen modal", disabled: true },
  { id: "split", label: "Split view", disabled: true },
  { id: "action-tab", label: "Action tab" },
  { id: "consolidated-open", label: "Consolidated open" },
  { id: "primary-open", label: "Primary open" },
  { id: "combined-actions", label: "Combined actions" },
];

export type PreviewModeToggleProps = {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
};

/** File preview size toggle, styled to match the ResponsiveTester preset row above the browser frame. */
export function PreviewModeToggle({ mode, onModeChange }: PreviewModeToggleProps) {
  return (
    <div className="preview-mode-toggle" role="group" aria-label="File preview size">
      <div className="preview-mode-toggle__header">
        <span className="preview-mode-toggle__label">File preview:</span>
      </div>
      <div className="preview-mode-toggle__row">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`preview-mode-toggle__preset ${mode === option.id ? "preview-mode-toggle__preset--active" : ""} ${option.disabled ? "preview-mode-toggle__preset--disabled" : ""}`}
            onClick={() => !option.disabled && onModeChange(option.id)}
            disabled={option.disabled}
            aria-pressed={mode === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
