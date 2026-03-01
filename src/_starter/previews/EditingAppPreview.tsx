import {
  ActionButton,
  Button,
  Image,
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

export default function EditingAppPreview({ onToggleTheme }: PreviewProps) {
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
      <div
        className={style({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          position: "relative",
        })}
      >
        <div
          className={style({
            backgroundColor: "elevated",
            boxShadow: "emphasized",
            padding: 8,
            position: "fixed",
            borderRadius: "default",
          })}
          style={{
            top: "64px",
            left: "8px",
            marginBottom: "8px",
          }}
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
        <div
          className={style({
            backgroundColor: "layer-2",
            padding: 32,
            overflow: "auto",
          })}
          style={{ width: "30vw", height: "60vh" }}
        />
      </div>
    </div>
  );
}
