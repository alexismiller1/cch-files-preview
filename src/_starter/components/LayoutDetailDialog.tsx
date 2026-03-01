import { useRef } from "react";
import {
  FullscreenDialog,
  Heading,
  Content,
  ButtonGroup,
  Button,
  Text,
  TooltipTrigger,
  Tooltip,
  UNSTABLE_ToastQueue as ToastQueue,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import OpenIn from "@react-spectrum/s2/icons/OpenIn";
import type { Layout } from "../layouts/types";
import { ScaledPreview } from "./ScaledPreview";

interface LayoutDetailDialogProps {
  layout: Layout;
  onNextLayout?: () => void;
}

async function copyPrompt(prompt: string, layoutName: string) {
  try {
    await navigator.clipboard.writeText(prompt);
    ToastQueue.positive(`Prompt copied for "${layoutName}"`, {
      timeout: 5000,
    });
  } catch {
    ToastQueue.negative("Could not copy to clipboard", { timeout: 5000 });
  }
}

export function LayoutDetailDialog({ layout, onNextLayout }: LayoutDetailDialogProps) {
  const PreviewComponent = layout.preview;
  const previewRef = useRef<HTMLDivElement>(null);

  function openPreviewInNewTab() {
    let theme = "dark";
    if (previewRef.current) {
      const cs = getComputedStyle(previewRef.current).colorScheme;
      if (cs === "light") theme = "light";
    }
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("preview", layout.id);
    url.searchParams.set("theme", theme);
    window.open(url.toString(), "_blank");
  }

  return (
    <FullscreenDialog>
      {({ close }) => (
        <>
          <Heading slot="title">{layout.name}</Heading>
          <Content>
            <div
              className={style({
                display: "grid",
                gridTemplateColumns: "1fr 500px",
                gap: 24,
                height: "full",
                overflow: "hidden",
              })}
            >
              <div
                ref={previewRef}
                className={style({
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: "gray-200",
                  borderRadius: "lg",
                })}
                style={{ position: "relative", backgroundColor: "black" }}
              >
                {PreviewComponent ? (
                  <ScaledPreview fill>
                    <PreviewComponent />
                  </ScaledPreview>
                ) : (
                  <div
                    className={style({
                      width: "full",
                      aspectRatio: "square",
                      backgroundColor: "layer-2",
                      borderRadius: "lg",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    })}
                  >
                    <p
                      className={style({
                        font: "body",
                        color: "detail",
                        textAlign: "center",
                      })}
                    >
                      Preview not available
                    </p>
                  </div>
                )}
                {PreviewComponent && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 10,
                    }}
                  >
                    <TooltipTrigger>
                      <Button
                        variant="primary"
                        size="S"
                        aria-label="Open preview in new tab"
                        onPress={openPreviewInNewTab}
                      >
                        <OpenIn />
                        <Text>Open in new tab</Text>
                      </Button>
                      <Tooltip>Open in new tab</Tooltip>
                    </TooltipTrigger>
                  </div>
                )}
              </div>
              <div
                className={style({
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  overflow: "hidden",
                  minHeight: 0,
                })}
              >
                <p
                  className={style({
                    font: "body",
                    color: "body",
                    marginTop: 0,
                    marginBottom: 16,
                  })}
                >
                  {layout.description}
                </p>
                <pre
                  className={style({
                    font: "code-sm",
                    backgroundColor: "layer-1",
                    borderRadius: "lg",
                    padding: 32,
                    overflow: "auto",
                    flexGrow: 1,
                    marginY: 0,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  })}
                >
                  {layout.prompt}
                </pre>
              </div>
            </div>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Close
            </Button>
            {onNextLayout && (
              <Button variant="secondary" onPress={onNextLayout}>
                Next layout
              </Button>
            )}
            <Button
              variant="accent"
              onPress={() => copyPrompt(layout.prompt, layout.name)}
            >
              Copy prompt
            </Button>
          </ButtonGroup>
        </>
      )}
    </FullscreenDialog>
  );
}
