import {
  ActionButton,
  Button,
  Image,
  NumberField,
  ToggleButtonGroup,
  ToggleButton,
} from "@react-spectrum/s2";
import { useState } from "react";
import type { Key } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";
import Select from "@react-spectrum/s2/icons/Select";
import SelectRectangle from "@react-spectrum/s2/icons/SelectRectangle";
import Text from "@react-spectrum/s2/icons/Text";
import appLogo from "../../assets/B_app_Murtceps.svg";

import type { PreviewProps } from "../layouts/types";

export default function ProEditingAppPreview({ onToggleTheme }: PreviewProps) {
  const [selectedTool, setSelectedTool] = useState<Key>("select");
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
        backgroundColor: "pasteboard",
      })}
    >
      {/* App Header */}
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 16,
          columnGap: 8,
          height: 56,
          backgroundColor: "layer-1",
        })}
        style={{ marginBottom: "1px" }}
      >
        <div
          className={style({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 12,
          })}
        >
          <Image
            src={appLogo}
            alt="App icon"
            styles={style({
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: "default",
            })}
          />
          <h2
            className={style({
              font: "heading-xs",
              margin: 0,
              fontWeight: "bold",
            })}
          >
            Project
          </h2>
        </div>
        <div className={style({ flexGrow: 1 })} />
        <ActionButton isQuiet aria-label="Toggle color scheme" onPress={onToggleTheme}>
          <Contrast />
        </ActionButton>
        <Button variant="accent">Export</Button>
      </div>

      {/* WorkArea */}
      <div
        className={style({
          display: "grid",
          gridTemplateColumns: "auto 1fr 280px",
          flexGrow: 1,
          overflow: "hidden",
        })}
      >
        {/* Toolbar Panel */}
        <div
          className={style({
            backgroundColor: "layer-1",
            padding: 16,
          })}
        >
          <ToggleButtonGroup
            orientation="vertical"
            selectionMode="single"
            selectedKeys={[selectedTool]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              if (selected) {
                setSelectedTool(selected);
              }
            }}
            isQuiet
            size="M"
          >
            <ToggleButton id="select" aria-label="Select">
              <Select />
            </ToggleButton>
            <ToggleButton id="square" aria-label="Square">
              <SelectRectangle />
            </ToggleButton>
            <ToggleButton id="text" aria-label="Text">
              <Text />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        {/* Canvas */}
        <div
          className={style({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <div
            className={style({
              width: 640,
              height: 400,
              backgroundColor: "layer-2",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "gray-200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <span className={style({ font: "body", color: "detail" })}>
            </span>
          </div>
        </div>

        {/* InspectorPanel */}
        <div
          className={style({
            display: "flex",
            flexDirection: "column",
            padding: 16,
            rowGap: 16,
            backgroundColor: "layer-1",
            overflowY: "auto",
          })}
        >
          <h3
            className={style({
              font: "detail-lg",
              fontWeight: "medium",
              margin: 0,
            })}
          >
            Properties
          </h3>

          {/* Transform */}
          <div
            className={style({
              display: "flex",
              flexDirection: "column",
              rowGap: 4,
            })}
          >
            <span
              className={style({
                font: "detail",
                color: "detail",
                marginBottom: 4,
              })}
            >
              Transform
            </span>
            <div
              className={style({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 24,
                rowGap: 8,
              })}
            >
              <NumberField label="W" labelPosition="side" hideStepper />
              <NumberField label="X" labelPosition="side" hideStepper />
              <NumberField label="H" labelPosition="side" hideStepper />
              <NumberField label="Y" labelPosition="side" hideStepper />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
