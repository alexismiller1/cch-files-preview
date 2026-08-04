import type { PreviewMode } from "../../context/DisplayConfigContext";
import "./PreviewModeToggle.css";

const OPTIONS: { id: PreviewMode; label: string }[] = [
  { id: "small", label: "Small modal" },
  { id: "fullscreen", label: "Full screen modal" },
  { id: "split", label: "Split view" },
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
            className={`preview-mode-toggle__preset ${mode === option.id ? "preview-mode-toggle__preset--active" : ""}`}
            onClick={() => onModeChange(option.id)}
            aria-pressed={mode === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
