import { ActionButton } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";

export default function BlankPreview() {
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
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
        <ActionButton isQuiet aria-label="Toggle color scheme">
          <Contrast />
        </ActionButton>
      </div>
    </div>
  );
}
