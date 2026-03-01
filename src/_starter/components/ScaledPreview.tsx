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
 * parent, scaling to contain the content (centered, no clipping).
 */
export function ScaledPreview({
  children,
  innerWidth = 1280,
  innerHeight = 800,
  fill = false,
}: ScaledPreviewProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        if (fill) {
          setScale(Math.min(width / innerWidth, height / innerHeight));
          setContainerSize({ w: width, h: height });
        } else {
          setScale(width / innerWidth);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [innerWidth, innerHeight, fill]);

  const offsetX = fill ? (containerSize.w - innerWidth * scale) / 2 : 0;
  const offsetY = fill ? (containerSize.h - innerHeight * scale) / 2 : 0;

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
          top: offsetY,
          left: offsetX,
        }}
      >
        {children}
      </div>
    </div>
  );
}
