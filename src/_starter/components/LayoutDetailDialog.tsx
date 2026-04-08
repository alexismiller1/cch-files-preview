import { useMemo, useRef } from "react";
import {
  FullscreenDialog,
  Heading,
  Content,
  Picker,
  PickerItem,
  ButtonGroup,
  Button,
  Text,
  TooltipTrigger,
  Tooltip,
  ToastQueue,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import OpenIn from "@react-spectrum/s2/icons/OpenIn";
import ChevronLeft from "@react-spectrum/s2/icons/ChevronLeft";
import ChevronRight from "@react-spectrum/s2/icons/ChevronRight";
import type { Layout } from "../layouts/types";
import { ScaledPreview } from "./ScaledPreview";

type IconSetSourceType = "default" | "package" | "gateway";

interface IconSetOption {
  id: string;
  name: string;
  sourceType: IconSetSourceType;
  packageName: string | null;
  outputDir: string | null;
  exportName: string | null;
  sourceUrl?: string;
}

const ICON_SET_OPTIONS: IconSetOption[] = [
  { id: "default", name: "Default", sourceType: "default", packageName: null, outputDir: null, exportName: null },
  { id: "adobe-concept", name: "Adobe Concept S2", sourceType: "package", packageName: "@a4u/a4u-adobe-concept-s2", outputDir: "adobe-concept", exportName: "adobeConceptIcons" },
  { id: "adobe-connect", name: "Adobe Connect S2", sourceType: "package", packageName: "@a4u/a4u-adobe-connect-s2", outputDir: "adobe-connect", exportName: "adobeConnectIcons" },
  { id: "adobe-com", name: "Adobe.com S2", sourceType: "gateway", packageName: null, outputDir: "adobe-com", exportName: null, sourceUrl: "https://a4u-gateway.corp.adobe.com/packages/661812de248c150261377f31/overview" },
  { id: "ai-web", name: "Ai Web S2", sourceType: "package", packageName: "@a4u/a4u-ai-web-s2", outputDir: "ai-web", exportName: "aiWebIcons" },
  { id: "cc-express", name: "CC Express S2", sourceType: "package", packageName: "@a4u/a4u-cc-express-s2", outputDir: "cc-express", exportName: "ccExpressIcons" },
  { id: "firefly", name: "Firefly S2", sourceType: "package", packageName: "@a4u/a4u-firefly-s2", outputDir: "firefly", exportName: "fireflyIcons" },
  { id: "fr", name: "Fr S2", sourceType: "package", packageName: "@a4u/a4u-fr-s2", outputDir: "fr", exportName: "frIcons" },
  { id: "lr-mobile", name: "Lr Mobile S2", sourceType: "package", packageName: "@a4u/a4u-lr-mobile-s2", outputDir: "lr-mobile", exportName: "lrMobileIcons" },
  { id: "lr-web", name: "Lr Web S2", sourceType: "package", packageName: "@a4u/a4u-lr-web-s2", outputDir: "lr-web", exportName: "lrWebIcons" },
  { id: "md-desktop-workflow-icons", name: "Md Desktop Workflow Icons S2", sourceType: "package", packageName: "@a4u/a4u-md-desktop-workflow-icons-s2", outputDir: "md-desktop-workflow-icons", exportName: "mdDesktopWorkflowIcons" },
  { id: "milo-workflow-icons", name: "Milo Workflow Icons S2", sourceType: "package", packageName: "@a4u/a4u-milo-workflow-icons-s2", outputDir: "milo-workflow-icons", exportName: "miloWorkflowIcons" },
  { id: "ps-mobile", name: "Ps Mobile S2", sourceType: "package", packageName: "@a4u/a4u-ps-mobile-s2", outputDir: "ps-mobile", exportName: "psMobileIcons" },
  { id: "s2-acrobat-dc", name: "S2 Acrobat DC", sourceType: "package", packageName: "@a4u/a4u-s2-acrobat-dc", outputDir: "s2-acrobat-dc", exportName: "s2AcrobatDcIcons" },
  { id: "squirrel", name: "Squirrel/Pr Mobile", sourceType: "package", packageName: "@a4u/a4u-squirrel", outputDir: "squirrel", exportName: "squirrelIcons" },
  { id: "stock-e-com-icons", name: "Stock E-com Icons S2", sourceType: "package", packageName: "@a4u/a4u-stock-e-com-icons-s2", outputDir: "stock-e-com-icons", exportName: "stockEComIcons" },
  { id: "workfront", name: "Workfront S2", sourceType: "package", packageName: "@a4u/a4u-workfront-s2", outputDir: "workfront", exportName: "workfrontIcons" },
];

const footerControls = style({
  gridArea: "buttons",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  columnGap: 16,
  rowGap: 12,
  width: "full",
  maxWidth: "full",
});

const promptActions = style({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  columnGap: 12,
  rowGap: 12,
  marginStart: "auto",
  maxWidth: "full",
});

const pickerStyles = style({
  width: 280,
  maxWidth: "full",
});

interface LayoutDetailDialogProps {
  layout: Layout;
  iconSetId: string;
  onIconSetChange: (value: string) => void;
  onPreviousLayout?: () => void;
  onNextLayout?: () => void;
}

function getIconSetById(iconSetId: string): IconSetOption {
  return ICON_SET_OPTIONS.find((iconSet) => iconSet.id === iconSetId) ?? ICON_SET_OPTIONS[0];
}

function buildIconSetAddendum(iconSet: IconSetOption): string {
  if (iconSet.sourceType === "default" || !iconSet.outputDir) {
    return "";
  }

  if (iconSet.sourceType === "gateway") {
    return [
      "## Additional icon instructions",
      `Use ${iconSet.name} only for product-specific icons that do not exist in \`@react-spectrum/s2/icons/*\`.`,
      "",
      "1. Retrieve the icon package from:",
      `   \`${iconSet.sourceUrl ?? ""}\``,
      "   This set is not available as a standard npm package.",
      "2. Keep using `@react-spectrum/s2/icons/*` when the same icon exists in both sources.",
      "3. Only 20px icons are compatible with the S2 icon system.",
    ].join("\n");
  }

  return [
    "## Additional icon instructions",
    `Use ${iconSet.name} only for product-specific icons that do not exist in \`@react-spectrum/s2/icons/*\`.`,
    "",
    "1. Install the package (if not already installed):",
    `   \`pnpm add ${iconSet.packageName}\``,
    "",
    `2. Import the pre-configured icon set module and use icons as components:`,
    `   \`import { ${iconSet.exportName} } from "../icons/${iconSet.outputDir}";\``,
    `   \`<${iconSet.exportName}.IconName />\``,
    "",
    `   The module at \`src/icons/${iconSet.outputDir}.ts\` uses Vite \`import.meta.glob\` to read SVGs`,
    "   from the installed package at build time and convert them to S2 icon components automatically.",
    "   No build step or code generation is needed.",
    "",
    "3. Keep using `@react-spectrum/s2/icons/*` when the same icon exists in both sources.",
    "4. Only 20px icons are included via the glob pattern.",
  ].join("\n");
}

function buildPrompt(layoutPrompt: string, iconSet: IconSetOption): string {
  if (iconSet.sourceType === "default") {
    return layoutPrompt;
  }

  return `${layoutPrompt.trimEnd()}\n\n${buildIconSetAddendum(iconSet)}`;
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

export function LayoutDetailDialog({
  layout,
  iconSetId,
  onIconSetChange,
  onPreviousLayout,
  onNextLayout,
}: LayoutDetailDialogProps) {
  const PreviewComponent = layout.preview;
  const previewRef = useRef<HTMLDivElement>(null);
  const selectedIconSet = useMemo(() => getIconSetById(iconSetId), [iconSetId]);
  const finalPrompt = useMemo(
    () => buildPrompt(layout.prompt, selectedIconSet),
    [layout.prompt, selectedIconSet],
  );

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
          <Heading slot="title" UNSAFE_className="dialog-title">{layout.name}</Heading>
          <Content>
            <div
              className={`dialog-content ${style({
                display: "grid",
                gridTemplateColumns: "1fr 500px",
                gap: 24,
                height: "full",
                overflow: "hidden",
              })}`}
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
                      top: 16,
                      right: 16,
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
                        <Text>Preview in new tab</Text>
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
                    color: "neutral-subdued",
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
                  {finalPrompt}
                </pre>
              </div>
            </div>
          </Content>
          <div className={footerControls}>
            <ButtonGroup>
              <Button variant="secondary" onPress={close}>
                Close
              </Button>
              {onPreviousLayout && (
                <TooltipTrigger>
                  <Button variant="secondary" aria-label="Previous layout" onPress={onPreviousLayout}>
                    <ChevronLeft />
                  </Button>
                  <Tooltip>Previous layout</Tooltip>
                </TooltipTrigger>
              )}
              {onNextLayout && (
                <TooltipTrigger>
                  <Button variant="secondary" aria-label="Next layout" onPress={onNextLayout}>
                    <ChevronRight />
                  </Button>
                  <Tooltip>Next layout</Tooltip>
                </TooltipTrigger>
              )}
            </ButtonGroup>
            <div className={promptActions}>
              <Picker
                label="Icon set"
                labelPosition="side"
                size="M"
                selectedKey={iconSetId}
                onSelectionChange={(key) => onIconSetChange(key == null ? "default" : String(key))}
                styles={pickerStyles}
              >
                {ICON_SET_OPTIONS.map((iconSet) => (
                  <PickerItem key={iconSet.id} id={iconSet.id} textValue={iconSet.name}>
                    {iconSet.name}
                  </PickerItem>
                ))}
              </Picker>
              <Button
                variant="accent"
                onPress={() => copyPrompt(finalPrompt, layout.name)}
              >
                Copy prompt
              </Button>
            </div>
          </div>
        </>
      )}
    </FullscreenDialog>
  );
}
