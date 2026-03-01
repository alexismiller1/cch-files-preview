import { useEffect, useRef, useState } from "react";

interface ScaledPreviewProps {
  children: React.ReactNode;
  innerWidth?: number;
  innerHeight?: number;
  fill?: boolean;
}

/**
 * Renders children at a fixed "virtual viewport" size and scales them down
 * to fit the container. Uses ResizeObserver to keep the scale in sync.
 *
 * Default mode: outer element takes full width and maintains the inner
 * aspect ratio.
 *
 * Fill mode (fill=true): outer element fills both width and height of its
 * parent, scaling to fit while preserving aspect ratio (letterboxed).
 */
export function ScaledPreview({
  children,
  innerWidth = 1280,
  innerHeight = 800,
  fill = false,
}: ScaledPreviewProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        if (fill) {
          setScale(Math.min(width / innerWidth, height / innerHeight));
        } else {
          setScale(width / innerWidth);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [innerWidth, innerHeight, fill]);

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        ...(fill ? { height: "100%" } : { aspectRatio: `${innerWidth} / ${innerHeight}` }),
        overflow: "hidden",
        pointerEvents: "none",
        position: "relative",
      }}
    >
      <div
        style={{
          width: innerWidth,
          height: innerHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
