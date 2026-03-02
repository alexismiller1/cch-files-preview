import { Card, CardPreview, Content, Text } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import type { Layout } from "../layouts/types";
import { ScaledPreview } from "./ScaledPreview";

interface LayoutCardProps {
  layout: Layout;
  index: number;
  onPress: () => void;
}

const buttonStyles = style({
  cursor: "pointer",
  backgroundColor: "transparent",
  borderStyle: "none",
  padding: 0,
  font: "body",
  textAlign: "start",
  color: "inherit",
});

export function LayoutCard({ layout, onPress }: LayoutCardProps) {
  const PreviewComponent = layout.preview;

  return (
    <button
      type="button"
      className={buttonStyles}
      onClick={onPress}
      aria-label={`View ${layout.name} layout`}
    >
      <Card variant="tertiary" size="XL" density="spacious">
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
          <Text slot="description" styles={style({ color: "neutral-subdued" })}>
            {layout.description}
          </Text>
        </Content>
      </Card>
    </button>
  );
}
