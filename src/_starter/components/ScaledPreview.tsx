import { useEffect, useRef, useState } from "react";

interface ScaledPreviewProps {
  children: React.ReactNode;
  innerWidth?: number;
  innerHeight?: number;
}

/**
 * Renders children at a fixed "virtual viewport" size and scales them down
 * to fit the container. The outer element takes full width from its parent
 * and maintains the inner aspect ratio. A ResizeObserver keeps the scale
 * factor in sync when the container resizes.
 */
export function ScaledPreview({
  children,
  innerWidth = 1280,
  innerHeight = 800,
}: ScaledPreviewProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setScale(entry.contentRect.width / innerWidth);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [innerWidth]);

  return (
    <div
      ref={outerRef}
      style={{
        width: "100%",
        aspectRatio: `${innerWidth} / ${innerHeight}`,
        overflow: "hidden",
        pointerEvents: "none",
        position: "relative",
        borderRadius: 8,
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
