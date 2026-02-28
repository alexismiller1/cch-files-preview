import { useState } from "react";
import { DialogContainer } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { layouts } from "../layouts/registry";
import type { Layout } from "../layouts/types";
import { LayoutCard } from "./LayoutCard";
import { LayoutDetailDialog } from "./LayoutDetailDialog";

export function LayoutPicker() {
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  return (
    <div
      className={style({
        minHeight: "screen",
        backgroundColor: "base",
      })}
    >
      <div
        className={style({
          maxWidth: 1280,
          marginX: "auto",
          paddingX: 32,
          paddingTop: 40,
          paddingBottom: 64,
        })}
      >
        <header className={style({ marginBottom: 32 })}>
          <h1
            className={style({
              font: "heading-3xl",
              marginY: 0,
            })}
          >
            Pick a layout
          </h1>
          <p
            className={style({
              font: "body-xl",
              color: "body",
              marginTop: 8,
              marginBottom: 0,
            })}
          >
            Preview the layout, then copy and paste the layout prompt
            into chat
          </p>
        </header>

        <div
          className={style({
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          })}
        >
          {layouts.map((layout, index) => (
            <LayoutCard
              key={layout.id}
              layout={layout}
              index={index}
              onPress={() => setSelectedLayout(layout)}
            />
          ))}
        </div>
      </div>

      <DialogContainer onDismiss={() => setSelectedLayout(null)}>
        {selectedLayout && (
          <LayoutDetailDialog layout={selectedLayout} />
        )}
      </DialogContainer>
    </div>
  );
}
