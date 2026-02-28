import {
  Card,
  CardPreview,
  Content,
  Text,
  Badge,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import type { Layout } from "../layouts/types";
import type { KeyboardEvent } from "react";

const placeholderStyles = [
  style({
    width: "full",
    aspectRatio: "video",
    backgroundImage:
      "linear-gradient(135deg, var(--spectrum-purple-900) 0%, var(--spectrum-indigo-900) 100%)",
  }),
  style({
    width: "full",
    aspectRatio: "video",
    backgroundImage:
      "linear-gradient(135deg, var(--spectrum-blue-900) 0%, var(--spectrum-cyan-900) 100%)",
  }),
  style({
    width: "full",
    aspectRatio: "video",
    backgroundImage:
      "linear-gradient(135deg, var(--spectrum-seafoam-900) 0%, var(--spectrum-green-900) 100%)",
  }),
  style({
    width: "full",
    aspectRatio: "video",
    backgroundImage:
      "linear-gradient(135deg, var(--spectrum-orange-900) 0%, var(--spectrum-red-900) 100%)",
  }),
  style({
    width: "full",
    aspectRatio: "video",
    backgroundImage:
      "linear-gradient(135deg, var(--spectrum-fuchsia-900) 0%, var(--spectrum-magenta-900) 100%)",
  }),
];

interface LayoutCardProps {
  layout: Layout;
  index: number;
  onPress: () => void;
}

export function LayoutCard({ layout, index, onPress }: LayoutCardProps) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPress();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={handleKeyDown}
      className={style({ cursor: "pointer", borderRadius: "xl" })}
      aria-label={`View ${layout.name} layout`}
    >
      <Card variant="secondary" size="M">
        <CardPreview>
          {layout.thumbnail ? (
            <img
              src={layout.thumbnail}
              alt={`Preview of ${layout.name}`}
              className={style({
                width: "full",
                aspectRatio: "video",
                objectFit: "cover",
              })}
            />
          ) : (
            <div
              className={placeholderStyles[index % placeholderStyles.length]}
            />
          )}
        </CardPreview>
        <Content>
          <Text slot="title">{layout.name}</Text>
          <Text slot="description">{layout.description}</Text>
          <div
            className={style({
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              marginTop: 8,
            })}
          >
            {layout.tags.map((tag) => (
              <Badge key={tag} variant="indigo" size="S">
                {tag}
              </Badge>
            ))}
          </div>
        </Content>
      </Card>
    </div>
  );
}
