import type { Dispatch, SetStateAction } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ActionButton, Image, Menu, MenuItem, MenuSection, Text } from "@react-spectrum/s2";
import AppsAll from "@react-spectrum/s2/icons/AppsAll";
import More from "@react-spectrum/s2/icons/More";
import { UiDragHandleS2Icon } from "./UiDragHandleS2Icon.tsx";
import { UiDashS2Icon } from "./UiDashS2Icon.tsx";
import "./TopAppBar.css";
import { APP_ICONS } from "../appIcons";
import { DEFAULT_APPS, dedupeAppsById, MORE_APPS, type TopAppBarApp } from "../topAppBarApps.ts";

/** Maps app id to product background SVG (in public/product-backgrounds/) */
const APP_BACKGROUNDS: Record<string, string> = {
  home: "/product-backgrounds/Product=Adobe.svg",
  firefly: "/product-backgrounds/Product=Firefly.svg",
  express: "/product-backgrounds/Product=Express.svg",
  photoshop: "/product-backgrounds/Product=Photo.svg",
  lightroom: "/product-backgrounds/Product=Lightroom.svg",
  acrobat: "/product-backgrounds/Product=Acrobat.svg",
  frameio: "/product-backgrounds/Product=Frame.svg",
};

/** Insert dragId immediately before dropId in the id list (for tab reorder in edit mode). */
function moveBefore(ids: string[], dragId: string, dropId: string): string[] {
  if (dragId === dropId) return ids;
  const without = ids.filter((id) => id !== dragId);
  const insertAt = without.indexOf(dropId);
  if (insertAt === -1) return ids;
  return [...without.slice(0, insertAt), dragId, ...without.slice(insertAt)];
}

/** Move dragId to the end (rightmost). moveBefore(dragId, lastId) cannot do that — it inserts before last. */
function moveToEnd(ids: string[], dragId: string): string[] {
  const without = ids.filter((id) => id !== dragId);
  return [...without, dragId];
}

/**
 * Horizontal drop target from pointer X and tab rects (left→right DOM order).
 * Last tab: left half = before that tab; right half = append to end.
 * Placeholder slot: left half = before next tab; right half defers to following tabs.
 */
function resolveDropTargetKey(tabEls: HTMLElement[], clientX: number): string {
  if (tabEls.length === 0) return "end";

  for (let i = 0; i < tabEls.length; i++) {
    const el = tabEls[i];
    const id = el.dataset.appId!;
    const r = el.getBoundingClientRect();
    const mid = r.left + r.width / 2;
    const isLast = i === tabEls.length - 1;
    const isPlaceholder = el.classList.contains("top-app-bar__app--drag-placeholder");

    if (isPlaceholder) {
      if (clientX < mid) {
        const next = tabEls[i + 1];
        return next ? `before:${next.dataset.appId!}` : "end";
      }
      if (isLast) return "end";
      continue;
    }

    if (isLast) {
      if (clientX < mid) return `before:${id}`;
      return "end";
    }
    if (clientX < mid) return `before:${id}`;
  }
  return "end";
}

export type TopAppBarProps = {
  /** Initial expanded state */
  defaultExpanded?: boolean;
  /** Callback when collapse/expand state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** App items to display (defaults to standard set) */
  apps?: TopAppBarApp[];
  /** Custom class name */
  className?: string;
  /** Initial selected app id when uncontrolled (default: "home") */
  defaultSelectedAppId?: string;
  /** Selected app id when controlled (omit for uncontrolled) */
  selectedAppId?: string;
  /** Callback when selected app changes */
  onAppSelect?: (appId: string) => void;
  /** Pinned “more” apps (lifted to AppShell for app switcher parity) */
  pinnedAppIds?: string[];
  onPinnedAppIdsChange?: React.Dispatch<React.SetStateAction<string[]>>;
};

export function TopAppBar({
  defaultExpanded = true,
  onExpandedChange,
  apps = DEFAULT_APPS,
  className = "",
  defaultSelectedAppId = "home",
  selectedAppId: selectedAppIdProp,
  onAppSelect,
  pinnedAppIds: pinnedAppIdsProp,
  onPinnedAppIdsChange,
}: TopAppBarProps) {
  const [internalPinned, setInternalPinned] = useState<string[]>([]);
  const pinnedAppIds = pinnedAppIdsProp !== undefined ? pinnedAppIdsProp : internalPinned;
  const setPinnedAppIds: Dispatch<SetStateAction<string[]>> =
    onPinnedAppIdsChange ?? setInternalPinned;
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [internalSelectedAppId, setInternalSelectedAppId] = useState(defaultSelectedAppId);
  const isControlled = selectedAppIdProp !== undefined;
  const selectedAppId = isControlled ? selectedAppIdProp : internalSelectedAppId;
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  /** Default-strip apps the user removed in customize (not persisted). */
  const [hiddenAppIds, setHiddenAppIds] = useState<string[]>([]);
  const [barOrderOverride, setBarOrderOverride] = useState<string[] | null>(null);
  const [draggingAppId, setDraggingAppId] = useState<string | null>(null);
  /** Tab strip cell height at drag start — float matches this so centered content aligns with the in-strip tab */
  const [dragTabHeightPx, setDragTabHeightPx] = useState<number | null>(null);
  /** After mount, scale the drag preview up slightly (lift) — inner-only so translate stays 1:1 with pointer */
  const [dragFloatLifted, setDragFloatLifted] = useState(false);
  const draggingAppIdRef = useRef<string | null>(null);
  const lastDragOverIdRef = useRef<string | null>(null);
  /** Pointer position (viewport) — updated every move without React state for 1:1 cursor tracking */
  const dragPointerRef = useRef({ x: 0, y: 0 });
  /** Grab point relative to tab top-left (horizontal: cursor follows naturally) */
  const dragGrabOffsetRef = useRef({ x: 0, y: 0 });
  /** Frozen viewport Y for the tab row top — avoids full-viewport height + centered icon when portaled to body */
  const dragRowTopRef = useRef(0);
  const floatLayerRef = useRef<HTMLDivElement | null>(null);
  const baseIdsRef = useRef<string[]>([]);
  const topAppBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const appsRef = useRef<HTMLDivElement>(null);
  const lastAvailableWidthRef = useRef(0);

  useEffect(() => {
    Object.values(APP_BACKGROUNDS).forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
    });
  }, []);

  useEffect(() => {
    if (!draggingAppId) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [draggingAppId]);

  useEffect(() => {
    if (!draggingAppId) {
      setDragFloatLifted(false);
      return;
    }
    setDragFloatLifted(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setDragFloatLifted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [draggingAppId]);

  const syncFloatLayerPosition = useCallback(() => {
    const el = floatLayerRef.current;
    if (!el) return;
    const { x } = dragPointerRef.current;
    const off = dragGrabOffsetRef.current;
    const rowTop = dragRowTopRef.current;
    el.style.transform = `translate3d(${x - off.x}px, ${rowTop}px, 0)`;
  }, []);

  useLayoutEffect(() => {
    if (!draggingAppId) return;
    syncFloatLayerPosition();
  }, [draggingAppId, syncFloatLayerPosition]);

  const baseFullBarApps = useMemo(
    () =>
      dedupeAppsById([
        ...apps.filter((a) => !hiddenAppIds.includes(a.id)),
        ...MORE_APPS.filter((a) => pinnedAppIds.includes(a.id)),
      ]),
    [apps, pinnedAppIds, hiddenAppIds]
  );

  const fullBarApps = useMemo(() => {
    if (!barOrderOverride) return baseFullBarApps;
    const byId = Object.fromEntries(baseFullBarApps.map((a) => [a.id, a]));
    const ordered = barOrderOverride.map((id) => byId[id]).filter(Boolean) as TopAppBarApp[];
    const missing = baseFullBarApps.filter((a) => !barOrderOverride.includes(a.id));
    return dedupeAppsById([...ordered, ...missing]);
  }, [baseFullBarApps, barOrderOverride]);

  baseIdsRef.current = baseFullBarApps.map((a) => a.id);

  const moreOnlyApps = MORE_APPS.filter((a) => !pinnedAppIds.includes(a.id));

  useEffect(() => {
    const baseIds = baseFullBarApps.map((a) => a.id);
    setBarOrderOverride((prev) => {
      if (!prev) return null;
      const filtered = prev.filter((id) => baseIds.includes(id));
      const missing = baseIds.filter((id) => !filtered.includes(id));
      return [...filtered, ...missing];
    });
  }, [baseFullBarApps]);

  const exitEditMode = useCallback(() => setIsEditMode(false), []);

  useEffect(() => {
    if (!isEditMode) return;

    /** Only horizontal size changes exit edit mode (TAB height animates 56→72 in edit mode). */
    let lastWindowWidth = window.innerWidth;
    const onWindowResize = () => {
      const w = window.innerWidth;
      if (w !== lastWindowWidth) {
        lastWindowWidth = w;
        exitEditMode();
      }
    };
    window.addEventListener("resize", onWindowResize);

    const vv = window.visualViewport;
    let lastViewportWidth = vv?.width ?? window.innerWidth;
    const onViewportResize = () => {
      const w = vv?.width ?? window.innerWidth;
      if (w !== lastViewportWidth) {
        lastViewportWidth = w;
        exitEditMode();
      }
    };
    if (vv) vv.addEventListener("resize", onViewportResize);

    const el = topAppBarRef.current;
    let baselineWidth: number | null = null;
    let raf1 = 0;
    let raf2 = 0;

    const ro =
      el &&
      new ResizeObserver((entries) => {
        const cr = entries[0]?.contentRect;
        if (!cr || baselineWidth === null) return;
        const w = Math.round(cr.width);
        if (baselineWidth !== w) {
          exitEditMode();
        }
      });

    if (el && ro) ro.observe(el);

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!el) return;
        baselineWidth = Math.round(el.getBoundingClientRect().width);
      });
    });

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (vv) vv.removeEventListener("resize", onViewportResize);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro?.disconnect();
    };
  }, [isEditMode, exitEditMode]);

  const updateOverflow = useCallback(() => {
    if (isEditMode) return;
    const contentEl = contentRef.current;
    const appsEl = appsRef.current;
    if (!contentEl || !appsEl || !expanded) return;

    const { paddingLeft, paddingRight } = getComputedStyle(contentEl);
    const availableWidth =
      contentEl.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
    const appsWidth = appsEl.scrollWidth;

    setVisibleCount((prev) => {
      const currentCount = prev ?? fullBarApps.length;
      if (availableWidth > lastAvailableWidthRef.current) {
        lastAvailableWidthRef.current = availableWidth;
        return fullBarApps.length;
      }
      lastAvailableWidthRef.current = availableWidth;

      // When a new app is pinned, show it only if there's room (prevents oscillation when overflow triggers)
      const slotWidth = 86; // 80px app + 6px gap
      if (
        fullBarApps.length > currentCount &&
        availableWidth - appsWidth >= slotWidth
      ) {
        return fullBarApps.length;
      }

      if (appsWidth > availableWidth && currentCount > 1) {
        return currentCount - 1;
      }
      return currentCount;
    });
  }, [expanded, fullBarApps.length, isEditMode]);

  useLayoutEffect(() => {
    updateOverflow();
  }, [updateOverflow, visibleCount, selectedAppId, isEditMode]);

  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl || !expanded) return;

    const observer = new ResizeObserver(updateOverflow);
    observer.observe(contentEl);
    return () => observer.disconnect();
  }, [expanded, updateOverflow]);

  const selectedIndexInFull = fullBarApps.findIndex((a) => a.id === selectedAppId);
  const vc = visibleCount !== null ? Math.max(1, visibleCount) : fullBarApps.length;

  /** When the selected app would overflow into "more", keep it visible by replacing the last tab slot. */
  const barAppsRaw =
    visibleCount === null
      ? fullBarApps
      : selectedIndexInFull >= vc && selectedIndexInFull !== -1
        ? [
            ...fullBarApps.slice(0, vc - 1),
            fullBarApps[selectedIndexInFull],
          ]
        : fullBarApps.slice(0, vc);
  const barApps = dedupeAppsById(barAppsRaw);
  const barAppsForDisplay = isEditMode ? fullBarApps : barApps;

  /** Width-overflow tabs + apps unpinned from the strip + Stock/Fonts not on bar */
  const overflowApps = dedupeAppsById([
    ...fullBarApps.filter((a) => !barApps.some((b) => b.id === a.id)),
    ...apps.filter((a) => hiddenAppIds.includes(a.id)),
    ...moreOnlyApps,
  ]);

  const contentBg = APP_BACKGROUNDS[selectedAppId] ?? APP_BACKGROUNDS.home;

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    onExpandedChange?.(next);
  };

  const handleAppClick = (appId: string) => {
    if (!isControlled) setInternalSelectedAppId(appId);
    onAppSelect?.(appId);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      closeMenu();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const handleMoreAppSelect = (appId: string) => {
    setPinnedAppIds((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
    handleAppClick(appId);
    closeMenu();
  };

  const handleRemoveFromTab = (appId: string) => {
    const isPinnedMore = pinnedAppIds.includes(appId);
    const nextPinned = isPinnedMore ? pinnedAppIds.filter((id) => id !== appId) : pinnedAppIds;
    const nextHidden = isPinnedMore
      ? hiddenAppIds
      : hiddenAppIds.includes(appId)
        ? hiddenAppIds
        : [...hiddenAppIds, appId];

    const nextFullBar = dedupeAppsById([
      ...apps.filter((a) => !nextHidden.includes(a.id)),
      ...MORE_APPS.filter((a) => nextPinned.includes(a.id)),
    ]);

    if (isPinnedMore) {
      setPinnedAppIds((prev) => prev.filter((id) => id !== appId));
    } else {
      setHiddenAppIds((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
    }
    setBarOrderOverride((prev) => (prev ? prev.filter((id) => id !== appId) : null));

    if (selectedAppId === appId) {
      const nextId = nextFullBar[0]?.id ?? "home";
      if (!isControlled) setInternalSelectedAppId(nextId);
      onAppSelect?.(nextId);
    }
  };

  const handleTabPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, appId: string) => {
      if (!isEditMode) return;
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).closest(".top-app-bar__app-unpin")) return;
      e.preventDefault();
      const tabEl = e.currentTarget;
      const rect = tabEl.getBoundingClientRect();
      dragPointerRef.current = { x: e.clientX, y: e.clientY };
      dragRowTopRef.current = rect.top;
      dragGrabOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setDragTabHeightPx(Math.round(rect.height));
      draggingAppIdRef.current = appId;
      lastDragOverIdRef.current = null;
      setDraggingAppId(appId);
      const appsEl = appsRef.current;
      if (appsEl) appsEl.setPointerCapture(e.pointerId);
    },
    [isEditMode]
  );

  const handleTabPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const dragId = draggingAppIdRef.current;
      if (!dragId) return;
      dragPointerRef.current = { x: e.clientX, y: e.clientY };
      syncFloatLayerPosition();

      const appsEl = appsRef.current;
      if (!appsEl) return;

      const tabEls = Array.from(appsEl.querySelectorAll<HTMLElement>("[data-app-id]"));
      const targetKey = resolveDropTargetKey(tabEls, e.clientX);
      if (targetKey === lastDragOverIdRef.current) return;
      lastDragOverIdRef.current = targetKey;

      setBarOrderOverride((prev) => {
        const base = prev ?? [...baseIdsRef.current];
        if (targetKey === "end") return moveToEnd(base, dragId);
        const dropId = targetKey.startsWith("before:") ? targetKey.slice(7) : targetKey;
        if (!dropId || dropId === dragId) return prev;
        return moveBefore(base, dragId, dropId);
      });
    },
    [syncFloatLayerPosition]
  );

  const endTabDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingAppIdRef.current) return;
    draggingAppIdRef.current = null;
    lastDragOverIdRef.current = null;
    setDragTabHeightPx(null);
    setDragFloatLifted(false);
    setDraggingAppId(null);
    const appsEl = appsRef.current;
    try {
      appsEl?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }, []);

  const handleTabPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      endTabDrag(e);
    },
    [endTabDrag]
  );

  const handleTabLostPointerCapture = useCallback(() => {
    draggingAppIdRef.current = null;
    lastDragOverIdRef.current = null;
    setDragTabHeightPx(null);
    setDragFloatLifted(false);
    setDraggingAppId(null);
  }, []);

  const handleMenuAction = (key: string) => {
    if (key === "view-all") {
      closeMenu();
    } else if (key === "customize") {
      closeMenu();
      setIsEditMode(true);
    } else if (moreOnlyApps.some((a) => a.id === key)) {
      handleMoreAppSelect(key);
    } else if (hiddenAppIds.includes(key)) {
      setHiddenAppIds((prev) => prev.filter((id) => id !== key));
      handleAppClick(key);
      closeMenu();
    } else {
      handleAppClick(key);
      closeMenu();
    }
  };

  useEffect(() => {
    if (isEditMode) setMenuOpen(false);
  }, [isEditMode]);

  const renderEditTabBody = (
    app: TopAppBarApp,
    options?: { isDragFloatPreview?: boolean }
  ) => {
    const showDragHandle = !draggingAppId || Boolean(options?.isDragFloatPreview);
    return (
      <div className="top-app-bar__app-edit-main">
        <div className="top-app-bar__app-icon-wrap">
          <button
            type="button"
            className={`top-app-bar__app-unpin${draggingAppId ? " top-app-bar__app-unpin--hidden-when-dragging" : ""}`}
            draggable={false}
            tabIndex={-1}
            aria-label={`Remove ${app.label} from tab bar`}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFromTab(app.id);
            }}
          >
            <UiDashS2Icon />
          </button>
          <div className="top-app-bar__app-icon" aria-hidden>
            {APP_ICONS[app.id] && (
              <img src={APP_ICONS[app.id]} alt="" width={24} height={24} />
            )}
          </div>
        </div>
        <span className="top-app-bar__app-label">{app.label}</span>
        {showDragHandle && (
          <div className="top-app-bar__app-drag-handle" aria-hidden>
            <UiDragHandleS2Icon />
          </div>
        )}
      </div>
    );
  };

  const draggedAppPreview = draggingAppId
    ? barAppsForDisplay.find((a) => a.id === draggingAppId)
    : null;

  const menuPortal =
    menuOpen && !isEditMode && triggerRef.current
      ? createPortal(
          <div
            ref={menuRef}
            className="top-app-bar__more-menu-wrap"
            role="presentation"
            style={{
              position: "fixed",
              top: triggerRef.current.getBoundingClientRect().bottom + 8,
              right: window.innerWidth - triggerRef.current.getBoundingClientRect().right,
              zIndex: 10000,
            }}
          >
            <Menu size="M" onAction={(key) => handleMenuAction(String(key))}>
              {overflowApps.length > 0 && (
                <MenuSection>
                  {overflowApps.map((item) => (
                    <MenuItem key={item.id} id={item.id} textValue={item.label}>
                      <Image src={APP_ICONS[item.id]} alt="" width={20} height={20} />
                      <Text slot="label">{item.label}</Text>
                    </MenuItem>
                  ))}
                </MenuSection>
              )}
              <MenuItem id="customize" textValue="Customize">
                <Text slot="label">Customize</Text>
              </MenuItem>
              <MenuItem id="view-all" textValue="View all apps">
                <Text slot="label">View all apps</Text>
              </MenuItem>
            </Menu>
          </div>,
          document.body
        )
      : null;

  return (
    <div
      ref={topAppBarRef}
      className={`top-app-bar ${expanded ? "top-app-bar--expanded" : "top-app-bar--collapsed"} ${isEditMode ? "top-app-bar--edit-mode" : ""} ${draggingAppId ? "top-app-bar--dragging-tab" : ""} ${className}`.trim()}
      role="banner"
      aria-label="Top app bar"
    >
        <div className="top-app-bar__collapse-btn-wrap">
        <ActionButton
          {...(expanded ? { staticColor: "white" as const } : {})}
          isQuiet
          size="M"
          isDisabled={isEditMode}
          aria-label={expanded ? "Collapse top app bar" : "Expand top app bar"}
          aria-expanded={expanded}
          onPress={handleToggle}
        >
          <AppsAll />
        </ActionButton>
        
      </div>

      {isEditMode && (
        <div className="top-app-bar__done-btn-wrap">
          <ActionButton size="M" staticColor="white" onPress={exitEditMode}>
            Done
          </ActionButton>
        </div>
      )}

      <div
        ref={contentRef}
        className="top-app-bar__content"
        style={{
          backgroundImage: contentBg ? `url("${contentBg}")` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          ref={appsRef}
          className="top-app-bar__apps"
          role="tablist"
          aria-label={isEditMode ? "Customize tab order" : "Adobe products"}
          onPointerMove={isEditMode ? handleTabPointerMove : undefined}
          onPointerUp={isEditMode ? handleTabPointerUp : undefined}
          onPointerCancel={isEditMode ? handleTabPointerUp : undefined}
          onLostPointerCapture={isEditMode ? handleTabLostPointerCapture : undefined}
        >
          {barAppsForDisplay.map((app) => {
            if (isEditMode && draggingAppId === app.id) {
              return (
                <div
                  key={app.id}
                  data-app-id={app.id}
                  className="top-app-bar__app top-app-bar__app--edit top-app-bar__app--drag-placeholder"
                  aria-hidden
                />
              );
            }
            return (
              <div
                key={app.id}
                data-app-id={app.id}
                className={`top-app-bar__app ${selectedAppId === app.id ? "top-app-bar__app--selected" : ""} ${isEditMode ? "top-app-bar__app--edit" : ""}`}
                role="tab"
                id={`top-app-tab-${app.id}`}
                tabIndex={isEditMode ? -1 : selectedAppId === app.id ? 0 : -1}
                onPointerDown={isEditMode ? (e) => handleTabPointerDown(e, app.id) : undefined}
                onClick={() => {
                  if (isEditMode) return;
                  handleAppClick(app.id);
                }}
                onKeyDown={(e) => {
                  if (isEditMode) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleAppClick(app.id);
                  }
                }}
                aria-selected={selectedAppId === app.id}
              >
                {isEditMode ? (
                  renderEditTabBody(app)
                ) : (
                  <>
                    <div className="top-app-bar__app-icon-wrap">
                      <div className="top-app-bar__app-icon" aria-hidden>
                        {APP_ICONS[app.id] && (
                          <img src={APP_ICONS[app.id]} alt="" width={24} height={24} />
                        )}
                      </div>
                    </div>
                    <span className="top-app-bar__app-label">{app.label}</span>
                  </>
                )}
              </div>
            );
          })}
          {draggedAppPreview &&
            createPortal(
              <div
                ref={floatLayerRef}
                className="top-app-bar__app top-app-bar__app--edit top-app-bar__app--drag-float"
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  transform: `translate3d(${dragPointerRef.current.x - dragGrabOffsetRef.current.x}px, ${dragRowTopRef.current}px, 0)`,
                  zIndex: 10001,
                  pointerEvents: "none",
                  width: 80,
                  height: dragTabHeightPx ?? undefined,
                  willChange: "transform",
                }}
                aria-hidden
              >
                <div
                  className={`top-app-bar__app-drag-float-inner${dragFloatLifted ? " top-app-bar__app-drag-float-inner--lifted" : ""}`}
                >
                  {renderEditTabBody(draggedAppPreview, { isDragFloatPreview: true })}
                </div>
              </div>,
              document.body
            )}
          {!isEditMode && (
            <div className="top-app-bar__add-btn-wrap" ref={triggerRef}>
              <ActionButton
                staticColor="white"
                isQuiet
                size="S"
                aria-label="More apps"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onPress={() => setMenuOpen((o) => !o)}
              >
                <More />
              </ActionButton>
              {menuPortal}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopAppBar;
