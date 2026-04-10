import { useCallback } from "react";
import "./ResponsiveTester.css";

const PRESET_WIDTHS = [375, 768, 1024, 1280, 1440, 1680, 1920] as const;

export type ResponsiveTesterProps = {
  /** Current window width in px, or null for default */
  width: number | null;
  /** Callback when width changes */
  onWidthChange: (width: number | null) => void;
  /** Max allowed width (fixed width of tester UI) */
  maxWidth: number;
  /** Min allowed width (e.g. 1440 for desktop context) */
  minWidth?: number;
};

export function ResponsiveTester({ width, onWidthChange, maxWidth, minWidth = 320 }: ResponsiveTesterProps) {
  const clampedWidth = Math.min(maxWidth, Math.max(minWidth, width ?? 1440));

  const handlePresetClick = useCallback(
    (presetWidth: number | "max") => {
      onWidthChange(presetWidth === "max" ? maxWidth : presetWidth);
    },
    [maxWidth, onWidthChange]
  );

  const visiblePresets = PRESET_WIDTHS.filter((w) => w >= minWidth);

  return (
    <div
      className="responsive-tester"
      role="group"
      aria-label="Responsive design tester"
    >
      <div className="responsive-tester__header">
        <span className="responsive-tester__label">Window width: </span>
        <span className="responsive-tester__value">{clampedWidth}px</span>
      </div>
      <div className="responsive-tester__row">
        {visiblePresets.map((w) => (
          <button
            key={w}
            type="button"
            className={`responsive-tester__preset ${width === w ? "responsive-tester__preset--active" : ""}`}
            onClick={() => handlePresetClick(w)}
            aria-pressed={width === w}
            disabled={w > maxWidth}
          >
            {w}
          </button>
        ))}
        <button
          type="button"
          className={`responsive-tester__preset ${width === maxWidth ? "responsive-tester__preset--active" : ""}`}
          onClick={() => handlePresetClick("max")}
          aria-pressed={width === maxWidth}
        >
          Max
        </button>
      </div>
    </div>
  );
}
