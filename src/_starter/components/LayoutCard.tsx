import { Card, CardPreview, Content, Text } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import type { Layout } from "../layouts/types";
import type { KeyboardEvent } from "react";
import { ScaledPreview } from "./ScaledPreview";

interface LayoutCardProps {
  layout: Layout;
  index: number;
  onPress: () => void;
}

export function LayoutCard({ layout, onPress }: LayoutCardProps) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPress();
    }
  }

  const PreviewComponent = layout.preview;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={handleKeyDown}
      className={style({ cursor: "pointer", borderRadius: "xl" })}
      aria-label={`View ${layout.name} layout`}
    >
      <Card variant="secondary" size="XL" density="spacious">
        <CardPreview>
          {PreviewComponent ? (
            <ScaledPreview>
              <PreviewComponent />
            </ScaledPreview>
          ) : (
            <div
              className={style({
                width: "full",
                aspectRatio: "video",
                backgroundColor: "layer-2",
              })}
            />
          )}
        </CardPreview>
        <Content>
          <Text slot="title">{layout.name}</Text>
          <Text slot="description">{layout.description}</Text>
        </Content>
      </Card>
    </div>
  );
}
