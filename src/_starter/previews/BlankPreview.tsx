import { useState } from "react";
import { ActionButton } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";

export default function BlankPreview() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");

  return (
    <div
      style={{ colorScheme }}
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "screen",
        backgroundColor: "base",
        padding: 32,
      })}
    >
      <div
        className={style({
          display: "flex",
          justifyContent: "end",
        })}
      >
        <ActionButton
          isQuiet
          aria-label="Toggle color scheme"
          onPress={() =>
            setColorScheme((v) => (v === "dark" ? "light" : "dark"))
          }
        >
          <Contrast />
        </ActionButton>
      </div>
    </div>
  );
}
