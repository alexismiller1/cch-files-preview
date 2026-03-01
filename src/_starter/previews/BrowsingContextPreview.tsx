import {
  ActionButton,
  Button,
  Image,
  Text,
  createIcon,
  pressScale,
} from "@react-spectrum/s2";
import {
  focusRing,
  style,
} from "@react-spectrum/s2/style" with { type: "macro" };
import Add from "@react-spectrum/s2/icons/Add";
import Contrast from "@react-spectrum/s2/icons/Contrast";
import Folder from "@react-spectrum/s2/icons/Folder";
import Home from "@react-spectrum/s2/icons/Home";
import Lightbulb from "@react-spectrum/s2/icons/Lightbulb";
import {
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
} from "react-aria-components";
import type {
  Selection,
  ToggleButtonRenderProps,
} from "react-aria-components";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import appLogo from "../../assets/B_app_Murtceps.svg";

const sideNav = style({
  marginStart: -4,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  boxSizing: "border-box",
  width: "full",
});

const sideNavItem = style({
  ...focusRing(),
  backgroundColor: "transparent",
  borderStyle: "none",
  width: "full",
  minHeight: 32,
  boxSizing: "border-box",
  padding: 0,
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  gap: 8,
  font: "ui",
  fontWeight: {
    default: "normal",
    isSelected: "bold",
  },
  textDecoration: "none",
  borderRadius: "default",
  transition: "none",
});

const sideNavIndicator = style({
  flexShrink: 0,
  width: 2,
  height: "[1lh]",
  borderRadius: "full",
  transition: "none",
  backgroundColor: {
    default: "transparent",
    isHovered: "gray-400",
    isSelected: "gray-800",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PanelIcon = createIcon((props: any) => {
  const { state, isHovered, ...otherProps } = props;
  return (
    <svg viewBox="0 0 20 20" fill="var(--iconPrimary)" {...otherProps}>
      <path
        d="M15.75 18H4.25C3.00977 18 2 16.9907 2 15.75V4.25C2 3.00928 3.00977 2 4.25 2H15.75C16.9902 2 18 3.00928 18 4.25V15.75C18 16.9907 16.9902 18 15.75 18ZM4.25 3.5C3.83691 3.5 3.5 3.83643 3.5 4.25V15.75C3.5 16.1636 3.83691 16.5 4.25 16.5H15.75C16.1631 16.5 16.5 16.1636 16.5 15.75V4.25C16.5 3.83643 16.1631 3.5 15.75 3.5H4.25Z"
        fill="var(--iconPrimary)"
      />
      <rect
        x={5}
        y={5}
        rx={0.5}
        height={10}
        className={style({
          transition: "[width]",
          transitionDuration: 300,
          width: {
            default: "[1.5px]",
            state: {
              expanded: "[5px]",
              collapsed: "[1.5px]",
            },
            isHovered: {
              default: "[5px]",
              state: {
                expanded: "[1.5px]",
                collapsed: "[5px]",
              },
            },
          },
        })({ state, isHovered } as Record<string, unknown>)}
      />
    </svg>
  );
});

const sidebarTransitionMs = 180;
const sidebarTransitionTiming = `${sidebarTransitionMs}ms cubic-bezier(0.2, 0, 0, 1)`;
const colorSchemeStorageKey = "chat-s2p-color-scheme";

function getInitialColorScheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedColorScheme = window.localStorage.getItem(
      colorSchemeStorageKey,
    );
    if (storedColorScheme === "light" || storedColorScheme === "dark") {
      return storedColorScheme;
    }
  } catch {
    // Ignore storage access errors and fall back to system preference.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSidebarLabelMotionStyle(
  isCollapsed: boolean,
  expandedWidth: number,
): React.CSSProperties {
  return {
    display: "inline-block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: isCollapsed ? 0 : expandedWidth,
    opacity: isCollapsed ? 0 : 1,
    transform: `translateX(${isCollapsed ? "-4px" : "0px"})`,
    transition: `max-width ${sidebarTransitionTiming}, opacity 120ms linear, transform ${sidebarTransitionTiming}`,
  };
}

const sidebarPanel = style({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  flexDirection: "column",
  backgroundColor: "layer-1",
  paddingTop: 12,
  paddingEnd: 12,
  paddingBottom: 12,
  paddingStart: 12,
});

function SideNav(props: React.ComponentProps<typeof RACToggleButtonGroup>) {
  return <RACToggleButtonGroup {...props} className={sideNav} />;
}

function SideNavItem(props: React.ComponentProps<typeof RACToggleButton>) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <RACToggleButton
      {...props}
      ref={ref}
      style={pressScale(ref)}
      className={(renderProps: ToggleButtonRenderProps) =>
        sideNavItem(renderProps)
      }
    >
      {(renderProps: ToggleButtonRenderProps) => (
        <>
          <span className={sideNavIndicator(renderProps)} />
          {props.children}
        </>
      )}
    </RACToggleButton>
  );
}

function PanelToggleButton({
  state,
  onToggle,
}: {
  state: "expanded" | "collapsed";
  onToggle: () => void;
}) {
  const [isHovered, setHovered] = useState(false);
  return (
    <ActionButton
      isQuiet
      aria-label={
        state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"
      }
      // @ts-expect-error onHoverChange not in public types yet
      onHoverChange={setHovered}
      onPress={() => {
        onToggle();
        setHovered(false);
      }}
    >
      {/* @ts-expect-error passing custom props to icon */}
      <PanelIcon state={state} isHovered={isHovered} />
    </ActionButton>
  );
}

export default function BrowsingContextPreview() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(
    getInitialColorScheme,
  );
  const [page, setPage] = useState("home");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarColumnWidth = isSidebarCollapsed ? 56 : 160;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(colorSchemeStorageKey, colorScheme);
    } catch {
      // Ignore storage write errors.
    }
  }, [colorScheme]);

  return (
    <div
      className={style({
        padding: 0,
        backgroundColor: "layer-1",
        height: "screen",
        borderRadius: "xl",
        borderBottomEndRadius: "none",
      })}
      style={{ colorScheme }}
    >
      <div
        className={style({
          display: "grid",
          width: "full",
          height: "full",
        })}
        style={{
          gap: "0px 0px",
          gridTemplateColumns: `${sidebarColumnWidth}px minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)`,
          gridTemplateRows:
            "56px 420px minmax(24px, 1fr) minmax(24px, 1fr) minmax(24px, 1fr) minmax(24px, 1fr) minmax(24px, 1fr)",
          transition: `grid-template-columns ${sidebarTransitionTiming}`,
          willChange: "grid-template-columns",
        }}
      >
        <div
          className={style({
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "layer-1",
            paddingTop: 12,
            paddingEnd: 12,
            paddingBottom: 12,
            paddingStart: 12,
          })}
          style={{ gridColumn: "1 / span 12", gridRow: "1 / span 1" }}
        >
          <div
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              columnGap: 12,
              rowGap: 8,
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
            <h1 className={style({ font: "heading-xs", margin: 0 })}>
              Project
            </h1>
          </div>

          <div
            className={style({
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              columnGap: 8,
              rowGap: 8,
            })}
          >
            <ActionButton
              isQuiet
              onPress={() =>
                setColorScheme((value) =>
                  value === "dark" ? "light" : "dark",
                )
              }
              aria-label={
                colorScheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              <Contrast />
            </ActionButton>
          </div>
        </div>

        <div
          className={sidebarPanel}
          style={{ gridColumn: "1 / span 1", gridRow: "2 / span 6" }}
        >
          <div
            className={style({
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              flexWrap: "wrap",
              width: "full",
              columnGap: 8,
              rowGap: 12,
            })}
          >
            <div style={{ position: "relative", display: "inline-flex" }}>
              <Button
                variant="accent"
                aria-label="Create"
                aria-hidden={!isSidebarCollapsed || undefined}
                excludeFromTabOrder={!isSidebarCollapsed}
                UNSAFE_style={{
                  opacity: isSidebarCollapsed ? 1 : 0,
                  transition: `opacity ${sidebarTransitionTiming}`,
                  pointerEvents: isSidebarCollapsed ? "auto" : "none",
                }}
              >
                <Add />
              </Button>
              <Button
                variant="accent"
                aria-hidden={isSidebarCollapsed || undefined}
                excludeFromTabOrder={isSidebarCollapsed}
                UNSAFE_style={{
                  position: "absolute",
                  top: 0,
                  insetInlineStart: 0,
                  opacity: isSidebarCollapsed ? 0 : 1,
                  transition: `opacity ${sidebarTransitionTiming}`,
                  pointerEvents: isSidebarCollapsed ? "none" : "auto",
                }}
              >
                <Add />
                <Text>Create</Text>
              </Button>
            </div>
            <SideNav
              aria-label="Navigation"
              orientation="vertical"
              selectedKeys={[page]}
              onSelectionChange={(keys: Selection) => {
                const next = [...keys][0];
                if (typeof next === "string") {
                  setPage(next);
                }
              }}
              disallowEmptySelection
            >
              <SideNavItem id="home">
                <Home />
                <span
                  style={getSidebarLabelMotionStyle(isSidebarCollapsed, 48)}
                >
                  Home
                </span>
              </SideNavItem>
              <SideNavItem id="files">
                <Folder />
                <span
                  style={getSidebarLabelMotionStyle(isSidebarCollapsed, 48)}
                >
                  Files
                </span>
              </SideNavItem>
              <SideNavItem id="learn">
                <Lightbulb />
                <span
                  style={getSidebarLabelMotionStyle(isSidebarCollapsed, 48)}
                >
                  Learn
                </span>
              </SideNavItem>
            </SideNav>
          </div>

          <PanelToggleButton
            state={isSidebarCollapsed ? "collapsed" : "expanded"}
            onToggle={() => setSidebarCollapsed((v) => !v)}
          />
        </div>

        <div
          className={style({
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            backgroundColor: "base",
            marginEnd: 12,
            padding: 48,
            borderTopStartRadius: "xl",
            borderTopEndRadius: "xl",
          })}
          style={{ gridColumn: "2 / span 11", gridRow: "2 / span 6" }}
        >
          <div className={style({ font: "body", color: "body" })}>
            <h2 className={style({ font: "heading-lg" })}>Lorem ipsum</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur.
            </p>
            <p>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum. Curabitur pretium
              tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis
              et commodo pharetra, est eros bibendum elit, nec luctus magna
              felis sollicitudin mauris. Integer in mauris eu nibh euismod
              gravida.
            </p>
            <p>
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
              vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit
              amet quam egestas semper. Aenean ultricies mi vitae est. Mauris
              placerat eleifend leo. Quisque sit amet est et sapien ullamcorper
              pharetra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
