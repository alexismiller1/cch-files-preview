import {
  FullscreenDialog,
  Heading,
  Content,
  ButtonGroup,
  Button,
  UNSTABLE_ToastQueue as ToastQueue,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import type { Layout } from "../layouts/types";

interface LayoutDetailDialogProps {
  layout: Layout;
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

export function LayoutDetailDialog({ layout }: LayoutDetailDialogProps) {
  return (
    <FullscreenDialog>
      {({ close }) => (
        <>
          <Heading slot="title">{layout.name}</Heading>
          <Content>
            <div
              className={style({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
                height: "full",
              })}
            >
              <div
                className={style({
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                })}
              >
                <p
                  className={style({
                    font: "body",
                    color: "body",
                    marginY: 0,
                  })}
                >
                  {layout.description}
                </p>
                <pre
                  className={style({
                    font: "code-sm",
                    backgroundColor: "layer-2",
                    borderRadius: "lg",
                    padding: 16,
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
              <div
                className={style({
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "center",
                  overflow: "auto",
                })}
              >
                {layout.thumbnail ? (
                  <img
                    src={layout.thumbnail}
                    alt={`Full preview of ${layout.name}`}
                    className={style({
                      width: "full",
                      borderRadius: "lg",
                      objectFit: "contain",
                    })}
                  />
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
                      Screenshot not yet available. Run{" "}
                      <code
                        className={style({ font: "code-sm" })}
                      >{`pnpm screenshot ${layout.id}`}</code>{" "}
                      to generate one.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Content>
          <ButtonGroup>
            <Button variant="secondary" onPress={close}>
              Close
            </Button>
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
