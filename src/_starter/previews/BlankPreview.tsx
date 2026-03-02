import { ActionButton } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";

import type { PreviewProps } from "../layouts/types";

export default function BlankPreview({ onToggleTheme }: PreviewProps) {
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
        backgroundColor: "base",
        padding: 16,
      })}
    >
      <div
        className={style({
          display: "flex",
          justifyContent: "end",
        })}
      >
        <ActionButton isQuiet aria-label="Toggle color scheme" onPress={onToggleTheme}>
          <Contrast />
        </ActionButton>
      </div>
    </div>
  );
}
