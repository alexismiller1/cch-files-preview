import {
  ActionButton,
  Button,
  NumberField,
  SearchField,
} from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";
import Redo from "@react-spectrum/s2/icons/Redo";
import Undo from "@react-spectrum/s2/icons/Undo";

const ASSET_ITEMS = [
  { name: "Hero banner", color: "blue-400" },
  { name: "Product shot", color: "green-400" },
  { name: "Icon set", color: "purple-400" },
  { name: "Background texture", color: "orange-400" },
  { name: "Logo mark", color: "indigo-400" },
  { name: "Typography sample", color: "gray-400" },
] as const;

export default function ProEditingAppPreview() {
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
      })}
    >
      {/* AppToolbar */}
      <div
        className={style({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          columnGap: 8,
          backgroundColor: "layer-2",
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
          Creative studio
        </h2>
        <ActionButton isQuiet aria-label="Undo">
          <Undo />
        </ActionButton>
        <ActionButton isQuiet aria-label="Redo">
          <Redo />
        </ActionButton>
        <div className={style({ flexGrow: 1 })} />
        <ActionButton isQuiet aria-label="Toggle color scheme">
          <Contrast />
        </ActionButton>
        <Button variant="accent">Export</Button>
      </div>

      {/* WorkArea */}
      <div
        className={style({
          display: "grid",
          gridTemplateColumns: "240px 1fr 280px",
          flexGrow: 1,
          overflow: "hidden",
        })}
      >
        {/* AssetPanel */}
        <div
          className={style({
            display: "flex",
            flexDirection: "column",
            padding: 16,
            rowGap: 12,
            backgroundColor: "layer-1",
            overflowY: "auto",
            borderEndWidth: 1,
            borderStyle: "solid",
            borderColor: "gray-200",
          })}
        >
          <SearchField label="Search assets" />
          <div
            className={style({
              display: "flex",
              flexDirection: "column",
              rowGap: 4,
            })}
          >
            {ASSET_ITEMS.map((item) => (
              <div
                key={item.name}
                className={style({
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 8,
                  padding: 8,
                  borderRadius: "default",
                  backgroundColor: "transparent",
                })}
              >
                <div
                  className={style({
                    width: 32,
                    height: 32,
                    borderRadius: "sm",
                    flexShrink: 0,
                  })}
                  style={{
                    backgroundColor: `var(--spectrum-${item.color})`,
                  }}
                />
                <span className={style({ font: "ui" })}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          className={style({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "elevated",
          })}
        >
          <div
            className={style({
              width: 640,
              height: 400,
              backgroundColor: "layer-1",
              borderRadius: "lg",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "gray-200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <span className={style({ font: "body", color: "detail" })}>
              Canvas area
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
            borderStartWidth: 1,
            borderStyle: "solid",
            borderColor: "gray-200",
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

          {/* Position */}
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
              Position
            </span>
            <div
              className={style({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 8,
              })}
            >
              <NumberField label="X" />
              <NumberField label="Y" />
            </div>
          </div>

          {/* Size */}
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
              Size
            </span>
            <div
              className={style({
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 8,
              })}
            >
              <NumberField label="W" />
              <NumberField label="H" />
            </div>
          </div>

          {/* Opacity */}
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
              Opacity
            </span>
            <NumberField label="Opacity" />
          </div>
        </div>
      </div>
    </div>
  );
}
