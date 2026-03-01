import { ActionButton } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";

const CHART_BARS = [
  { height: 60, color: "var(--spectrum-blue-900)" },
  { height: 100, color: "var(--spectrum-cyan-900)" },
  { height: 80, color: "var(--spectrum-seafoam-900)" },
  { height: 140, color: "var(--spectrum-green-900)" },
  { height: 110, color: "var(--spectrum-blue-800)" },
] as const;

import type { PreviewProps } from "../layouts/types";

export default function BentoPreview({ onToggleTheme }: PreviewProps) {
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
        backgroundColor: "base",
      })}
    >
      {/* Header */}
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingX: 32,
          paddingY: 24,
        })}
      >
        <h1
          className={style({
            font: "heading-lg",
            margin: 0,
          })}
        >
          Dashboard
        </h1>
        <ActionButton isQuiet aria-label="Toggle color scheme" onPress={onToggleTheme}>
          <Contrast />
        </ActionButton>
      </div>

      {/* BentoGrid */}
      <div
        className={style({
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "minmax(180px, auto)",
          gridAutoFlow: "dense",
          paddingX: 24,
          paddingBottom: 24,
          gap: 16,
          flexGrow: 1,
          overflow: "auto",
        })}
      >
        {/* Hero card */}
        <div
          style={{ gridColumn: "span 2", gridRow: "span 2" }}
          className={style({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "layer-1",
            borderRadius: "xl",
            padding: 24,
          })}
        >
          <h2
            className={style({
              font: "heading",
              margin: 0,
              marginBottom: 8,
            })}
          >
            Featured content
          </h2>
          <p
            className={style({
              font: "body",
              color: "body",
              margin: 0,
            })}
          >
            This area highlights key content or metrics. Use it to draw
            attention to important updates or featured items.
          </p>
          <div
            className={style({
              flexGrow: 1,
              marginTop: 16,
              borderRadius: "lg",
              minHeight: 120,
            })}
            style={{
              background:
                "linear-gradient(135deg, var(--spectrum-purple-900) 0%, var(--spectrum-indigo-900) 100%)",
            }}
          />
        </div>

        {/* Metric card 1 */}
        <div
          style={{ gridColumn: "span 1", gridRow: "span 1" }}
          className={style({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "layer-1",
            borderRadius: "xl",
            padding: 24,
          })}
        >
          <p
            className={style({
              font: "detail",
              color: "detail",
              margin: 0,
              marginBottom: 4,
            })}
          >
            Total users
          </p>
          <p
            className={style({
              font: "heading-lg",
              margin: 0,
            })}
          >
            12,847
          </p>
          <p
            className={style({
              font: "detail",
              color: "detail",
              margin: 0,
              marginTop: 8,
            })}
          >
            +14% from last month
          </p>
        </div>

        {/* Metric card 2 */}
        <div
          style={{ gridColumn: "span 1", gridRow: "span 1" }}
          className={style({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "layer-1",
            borderRadius: "xl",
            padding: 24,
          })}
        >
          <p
            className={style({
              font: "detail",
              color: "detail",
              margin: 0,
              marginBottom: 4,
            })}
          >
            Revenue
          </p>
          <p
            className={style({
              font: "heading-lg",
              margin: 0,
            })}
          >
            $48.2K
          </p>
          <p
            className={style({
              font: "detail",
              color: "detail",
              margin: 0,
              marginTop: 8,
            })}
          >
            +8% from last month
          </p>
        </div>

        {/* Tall card - Recent activity */}
        <div
          style={{ gridColumn: "span 1", gridRow: "span 2" }}
          className={style({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "layer-1",
            borderRadius: "xl",
            padding: 24,
          })}
        >
          <h3
            className={style({
              font: "title-sm",
              margin: 0,
            })}
          >
            Recent activity
          </h3>
        </div>

        {/* Wide card - Performance overview */}
        <div
          style={{ gridColumn: "span 2", gridRow: "span 1" }}
          className={style({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "layer-1",
            borderRadius: "xl",
            padding: 24,
          })}
        >
          <h3
            className={style({
              font: "title-sm",
              margin: 0,
              marginBottom: 12,
            })}
          >
            Performance overview
          </h3>
          <div
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "end",
              gap: 8,
            })}
          >
            {CHART_BARS.map((bar, i) => (
              <div
                key={i}
                className={style({
                  width: 40,
                  borderRadius: "sm",
                })}
                style={{
                  height: bar.height,
                  backgroundColor: bar.color,
                }}
              />
            ))}
          </div>
        </div>

        {/* Small card - Status */}
        <div
          style={{ gridColumn: "span 1", gridRow: "span 2" }}
          className={style({
            display: "flex",
            flexDirection: "column",
            backgroundColor: "layer-1",
            borderRadius: "xl",
            padding: 24,
          })}
        >
          <h3
            className={style({
              font: "title-sm",
              margin: 0,
              marginBottom: 8,
            })}
          >
            Status
          </h3>
          <div
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            })}
          >
            <div
              className={style({
                width: 8,
                height: 8,
                borderRadius: "full",
                backgroundColor: "positive",
                flexShrink: 0,
              })}
            />
            <p
              className={style({
                font: "body",
                color: "body",
                margin: 0,
              })}
            >
              All systems operational
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
