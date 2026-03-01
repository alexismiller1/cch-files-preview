import { useState } from "react";
import { flushSync } from "react-dom";
import { ActionButton, DialogContainer, Link } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";
import { layouts } from "../layouts/registry";
import type { Layout } from "../layouts/types";
import { LayoutCard } from "./LayoutCard";
import { LayoutDetailDialog } from "./LayoutDetailDialog";

interface LayoutPickerProps {
  onToggleTheme: () => void;
}

export function LayoutPicker({ onToggleTheme }: LayoutPickerProps) {
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
          paddingX: 24,
          paddingTop: 40,
          paddingBottom: 64,
        })}
      >
        <header
          className={style({
            marginBottom: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          })}
        >
          <div>
            <h1
              className={style({
                font: "heading-2xl",
                marginY: 0,
              })}
            >
              Pick a layout
            </h1>
            <p
              className={style({
                font: "body",
                color: "neutral-subdued",
                marginTop: 8,
                marginBottom: 0,
              })}
            >
              Copy and paste the layout prompt in chat. These templates come with toggleable Blueline accessibility overlay (via Ctrl+Shift+A) and{" "}
              <Link href="https://agentation.dev/" target="_blank" variant="secondary">Agentation</Link>.
            </p>
          </div>
          <ActionButton
            isQuiet
            aria-label="Toggle light and dark mode"
            onPress={onToggleTheme}
          >
            <Contrast />
          </ActionButton>
        </header>

        <div
          className={style({
            display: "flex",
            flexWrap: "wrap",
            columnGap: 24,
            rowGap: 24,
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
          <LayoutDetailDialog
            layout={selectedLayout}
            onNextLayout={() => {
              const currentIndex = layouts.findIndex(
                (l) => l.id === selectedLayout.id
              );
              const nextIndex =
                currentIndex === layouts.length - 1 ? 0 : currentIndex + 1;
              const nextLayout = layouts[nextIndex];

              if (!document.startViewTransition) {
                setSelectedLayout(nextLayout);
                return;
              }

              document.startViewTransition(() => {
                flushSync(() => {
                  setSelectedLayout(nextLayout);
                });
              });
            }}
          />
        )}
      </DialogContainer>
    </div>
  );
}
