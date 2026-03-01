import { useState } from "react";
import {
  ActionButton,
  Button,
  Divider,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";
import TextBold from "@react-spectrum/s2/icons/TextBold";
import TextItalic from "@react-spectrum/s2/icons/TextItalic";
import TextUnderline from "@react-spectrum/s2/icons/TextUnderline";

export default function EditingAppPreview() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");

  return (
    <div
      style={{ colorScheme }}
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "screen",
      })}
    >
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          columnGap: 8,
          backgroundColor: "layer-1",
          borderBottomWidth: 1,
          borderStyle: "solid",
          borderColor: "gray-200",
        })}
      >
        <h2
          className={style({
            font: "heading-xs",
            margin: 0,
            fontWeight: "bold",
          })}
        >
          Document title
        </h2>
        <Divider orientation="vertical" size="M" />
        <ActionButton isQuiet aria-label="Bold">
          <TextBold />
        </ActionButton>
        <ActionButton isQuiet aria-label="Italic">
          <TextItalic />
        </ActionButton>
        <ActionButton isQuiet aria-label="Underline">
          <TextUnderline />
        </ActionButton>
        <div className={style({ flexGrow: 1 })} />
        <ActionButton
          isQuiet
          aria-label="Toggle color scheme"
          onPress={() =>
            setColorScheme((v) => (v === "dark" ? "light" : "dark"))
          }
        >
          <Contrast />
        </ActionButton>
        <Button variant="accent">Save</Button>
      </div>
      <div
        className={style({
          flexGrow: 1,
          backgroundColor: "base",
          padding: 32,
          overflow: "auto",
        })}
      >
        <p
          className={style({
            font: "body",
            color: "body",
          })}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <p
          className={style({
            font: "body",
            color: "body",
          })}
        >
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p
          className={style({
            font: "body",
            color: "body",
          })}
        >
          Curabitur pretium tincidunt lacus. Nulla facilisi. Ut fringilla.
          Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet.
        </p>
      </div>
    </div>
  );
}
