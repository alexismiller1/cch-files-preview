import {
  ActionButton,
  Button,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";

import type { PreviewProps } from "../layouts/types";

export default function EditingAppPreview({ onToggleTheme }: PreviewProps) {
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
        backgroundColor: "pasteboard",
      })}
    >
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 16,
          columnGap: 8,
          height: 56,
          backgroundColor: "layer-2",
        })}
      >
        <h2
          className={style({
            font: "heading-xs",
            margin: 0,
            fontWeight: "bold",
          })}
        >
          Project
        </h2>
        <div className={style({ flexGrow: 1 })} />
        <ActionButton isQuiet aria-label="Toggle color scheme" onPress={onToggleTheme}>
          <Contrast />
        </ActionButton>
        <Button variant="accent">Export</Button>
      </div>
      <div
        className={style({
          flexGrow: 1,
          backgroundColor: "base",
          padding: 32,
          overflow: "auto",
        })}
      />
    </div>
  );
}
