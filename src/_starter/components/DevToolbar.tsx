import { ActionButton, TooltipTrigger, Tooltip } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { Agentation } from "agentation";
import ViewGrid from "@react-spectrum/s2/icons/ViewGrid";

function navigateToPicker() {
  const url = new URL(window.location.href);
  url.search = "?picker";
  window.location.href = url.toString();
}

export function DevToolbar() {
  return (
    <>
      <div
        className={style({
          position: "fixed",
          zIndex: 1000,
        })}
        style={{ bottom: 88, right: 28 }}
      >
        <TooltipTrigger>
          <ActionButton
            aria-label="Open layout picker"
            onPress={navigateToPicker}
            size="M"
          >
            <ViewGrid />
          </ActionButton>
          <Tooltip>Layout picker</Tooltip>
        </TooltipTrigger>
      </div>
      <Agentation />
    </>
  );
}
