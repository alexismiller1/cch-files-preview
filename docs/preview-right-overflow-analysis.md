# Preview pane right-side overflow: analysis and recommendation

## Problem statement

Preview content displayed inside the `LayoutDetailDialog` preview pane is clipped by a few pixels on the right edge. Elements that should have visible right padding (such as the app header's right-side action buttons and padding) are cut off. When the same preview is opened in a new tab (no `ScaledPreview` wrapper), the right padding is fully visible.

---

## Atomic decomposition

### Atom 1: Fill-mode scaling uses "cover" behavior (Math.max)

**Logical component.** `ScaledPreview` in fill mode computes the scale factor as `Math.max(containerW / 1280, containerH / 800)`. This is a CSS-like "cover" strategy: the larger of the two ratios is chosen, guaranteeing the content fills the container completely in both dimensions at the cost of clipping the excess.

**Independence.** This is purely a scaling-arithmetic concern. It does not depend on the dialog layout, the preview content, or how the container is sized.

**Correctness.** When the container's aspect ratio differs from 16:10 (1280/800), one dimension's scale is larger than the other. `Math.max` picks the larger scale, so:

- If height drives the scale (`containerH / 800 > containerW / 1280`): the scaled content width becomes `1280 × (containerH / 800) = 1.6 × containerH`, which exceeds `containerW`. The right edge overflows.
- If width drives the scale: the scaled content height exceeds `containerH`. The bottom edge overflows.

The right overflow in pixels equals `1.6 × containerH − containerW` when height drives the scale. Even a small deviation from 16:10 produces visible clipping. For example, a container of 820 × 516 (aspect ratio 1.589 vs 1.6) clips `1.6 × 516 − 820 = 5.6px` from the right.

This is the primary mechanism causing the right-side clipping.

---

### Atom 2: Content is anchored at the top-left corner

**Logical component.** The inner div (1280 × 800) uses `position: absolute`, `top: 0`, `left: 0`, and `transformOrigin: "top left"`. The scale transform expands the content from the top-left corner outward.

**Independence.** This is a positioning concern, independent of the scale value or container dimensions.

**Correctness.** Because the content is pinned to the top-left, all overflow from cover scaling extends rightward and/or downward. The `overflow: hidden` on the outer container clips only the right and bottom edges. The left edge and top edge are always fully visible.

This means the right-side clipping is asymmetric: none on the left, all on the right. If the content were centered instead, the same total overflow would be split equally between left and right, halving the perceived loss on each side.

---

### Atom 3: The dialog's preview container aspect ratio differs from 16:10

**Logical component.** In `LayoutDetailDialog`, the content area uses a CSS grid with `gridTemplateColumns: "1fr 500px"` and `gap: 24`. The preview column gets the remaining width after the 500px prompt column and 24px gap. The height is determined by the `FullscreenDialog`'s content area (the remaining space after the heading row, 32px grid gap, and button group).

**Independence.** This is a dialog-layout concern, independent of the scale calculation or preview content.

**Correctness.** The preview container's width and height depend on the viewport size and dialog chrome. On most viewports, the resulting aspect ratio is NOT exactly 16:10:

| Viewport | Approx. container | Aspect ratio | Right overflow |
|-----------|-------------------|--------------|----------------|
| 1440 × 900 | ~870 × 650 | 1.338 | ~170px |
| 1920 × 1080 | ~1350 × 820 | 1.646 | 0 (width drives) |
| 1280 × 800 | ~710 × 540 | 1.315 | ~154px |
| 2560 × 1440 | ~1990 × 1180 | 1.686 | 0 (width drives) |

On narrower or shorter viewports, the container is narrower than 16:10, and height drives the scale — producing right-side clipping. On very wide viewports, width drives the scale, and the bottom is clipped instead (less noticeable since preview content often doesn't extend to the bottom edge).

The amount of right clipping varies by viewport. "A few pixels" occurs when the container is very close to 16:10 but slightly narrower.

---

### Atom 4: The 2px border reduces the effective content area

**Logical component.** The preview container has `borderWidth: 2` (a 2px solid border on all sides). The project has no global `box-sizing: border-box` rule (the only global CSS is `body { margin: 0 }`). However, in CSS Grid with default stretch alignment, the grid child's margin box fills the grid track, so the border is properly subtracted from the available content area.

**Independence.** This is a box-model concern, independent of the scale calculation.

**Correctness.** The 2px border reduces the content area by 4px horizontally (2px each side) and 4px vertically. The `ResizeObserver` reports `contentRect`, which already excludes the border. So the scale calculation sees the correct (reduced) content area. The border does not directly cause overflow, but it slightly alters the container's effective aspect ratio (making it marginally narrower relative to its height), which can push the aspect ratio further from 16:10 and increase the right overflow by a small amount.

---

### Atom 5: Preview content has meaningful right-edge elements

**Logical component.** Preview components include right-side padding and controls that occupy the rightmost pixels of the 1280px virtual viewport:

- `BrowsingContextPreview`: header has `paddingEnd: 12`; content area has `marginEnd: 12`
- `ProEditingAppPreview`: toolbar has `padding: 12`; inspector panel occupies the right 280px
- `EditingAppPreview`: toolbar has `padding: 16`; "Save" button is right-aligned
- `BentoPreview`: header has `paddingX: 32`; contrast button is right-aligned

**Independence.** This is a content-design concern, independent of the scaling mechanism.

**Correctness.** These elements are the first to be visually lost when the right edge is clipped. Even a small amount of clipping (5–15 scaled pixels) removes the right padding from the header, making the content appear to run into the container edge. This is why the clipping is noticeable despite being small: the visual result changes from "content with breathing room" to "content flush against the edge."

---

### Atom 6: The "new tab" view renders without scaling or clipping

**Logical component.** In `App.tsx`, `PreviewPage` renders the preview component inside a `100vw × 100vh` container with no `ScaledPreview` wrapper and no `overflow: hidden`. The content fills the viewport directly at its natural size.

**Independence.** This is an entirely separate rendering path. It shares only the preview component itself.

**Correctness.** Without `ScaledPreview`, there is no cover scaling, no clipping, and no transform. The full 1280px-equivalent content renders at the viewport's actual dimensions. All right-side padding (e.g., `paddingEnd: 12` in the header) is fully visible. This confirms that the clipping is caused by the ScaledPreview/dialog interaction, not by the preview content itself.

---

### Atom 7: Card mode does not exhibit this issue

**Logical component.** In `LayoutCard`, `ScaledPreview` is used without the `fill` prop (default mode). The outer container uses `aspectRatio: 1280/800` and scales by width only: `scale = containerW / 1280`.

**Independence.** This is a separate usage context that shares the ScaledPreview component.

**Correctness.** With width-only scaling:
- Scaled width = `1280 × (containerW / 1280) = containerW` — fits exactly.
- Scaled height = `800 × (containerW / 1280)` — and the container height is `containerW × 800 / 1280` (from the aspect ratio) — fits exactly.

Both dimensions match perfectly. No overflow occurs in either direction. The card previews display the full content without clipping. This confirms that the issue is specific to fill mode's `Math.max` behavior.

---

## Synthesis

The root cause is the interaction between **Atom 1** (cover scaling via `Math.max`) and **Atom 2** (top-left anchoring). When the dialog's preview container (Atom 3) has an aspect ratio narrower than 16:10, the height drives the scale, causing the scaled content to extend past the right edge. Because the content is anchored at the top-left (Atom 2), all overflow goes rightward and is clipped by `overflow: hidden`. The clipped pixels remove visible right-edge padding (Atom 5), producing a noticeable visual difference from the unscaled new-tab view (Atom 6).

The border (Atom 4) is a minor contributor that slightly worsens the aspect ratio mismatch. The card mode (Atom 7) is unaffected because it uses width-only scaling.

---

## Solutions

### Solution A: Change fill mode to "contain" scaling with centered content (recommended)

Change `Math.max` to `Math.min` in fill mode, and center the inner div within the outer container. This is the CSS-equivalent of `object-fit: contain` with centering.

```typescript
// ScaledPreview.tsx — fill mode changes

// Scale: contain instead of cover
const newScale = fill
  ? Math.min(width / innerWidth, height / innerHeight)
  : width / innerWidth;

// Center the inner div (store container dimensions in state)
const offsetX = fill ? (containerW - innerWidth * scale) / 2 : 0;
const offsetY = fill ? (containerH - innerHeight * scale) / 2 : 0;

// Inner div positioning
style={{
  width: innerWidth,
  height: innerHeight,
  transform: `scale(${scale})`,
  transformOrigin: "top left",
  position: "absolute",
  top: offsetY,
  left: offsetX,
}}
```

**Pros:**
- Eliminates all clipping — the full preview is always visible
- Content is visually centered in the container
- Minimal code change (ScaledPreview only, 5–10 lines)
- Card mode is unaffected (non-fill path unchanged)
- Works correctly at all viewport sizes

**Cons:**
- May produce thin "letterbox" gaps on two sides when the container aspect ratio differs from 16:10; these gaps show the parent container's background
- The preview no longer fills every pixel of the container (minor visual trade-off)

**Mitigation for gaps:** The preview container already has a border and background, so small gaps blend naturally with the container's appearance. The gaps are symmetric and visually clean.

---

### Solution B: Center the cover-scaled content (keep Math.max)

Keep the cover scaling but center the inner div so clipping is distributed equally on both sides.

```typescript
// Same centering math, but with Math.max
// offsetX will be negative (centering the overflow)
const offsetX = fill ? (containerW - innerWidth * scale) / 2 : 0;
const offsetY = fill ? (containerH - innerHeight * scale) / 2 : 0;
```

**Pros:**
- The container is always completely filled (no gaps)
- Clipping is symmetric — equal loss from both left and right
- The perceived right-side clipping is halved

**Cons:**
- Content is still clipped — just symmetrically
- Left-side content (logos, sidebar edges) also loses pixels
- Does not fully solve the problem — some preview content is always hidden

---

### Solution C: Constrain the preview container to 16:10 aspect ratio

Force the preview container to maintain `aspectRatio: 16 / 10`, making `Math.max` and `Math.min` produce identical scales (no overflow, no gaps).

```typescript
// LayoutDetailDialog.tsx — preview container change
<div
  className={style({
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "gray-200",
    borderRadius: "lg",
    maxHeight: "full",
    aspectRatio: "video",  // 16:10
  })}
>
```

**Pros:**
- No clipping and no gaps — the container exactly matches the content ratio
- No changes to ScaledPreview

**Cons:**
- Wastes vertical space on viewports where the dialog is tall relative to its width
- The preview doesn't fill the available height, leaving empty space in the dialog
- Less flexible if inner dimensions are ever changed

---

### Solution D: Use width-only scaling in fill mode

Replace the fill-mode formula with the same width-only scaling used in card mode, but keep `height: 100%` on the outer container.

```typescript
// Always scale by width
setScale(width / innerWidth);
```

**Pros:**
- Right edge never clips (same behavior as card mode)
- Simplest change (remove the Math.max branch)

**Cons:**
- On tall containers, the scaled content may not fill the full height, leaving a visible gap at the bottom
- Worse than Solution A because the content is not centered vertically

---

## Recommendation: Solution A

**Change fill mode to contain scaling with centered content.** This is the most robust fix because:

1. It eliminates clipping entirely — every pixel of the preview is visible.
2. Centering produces a balanced, polished appearance even when the container aspect ratio deviates from 16:10.
3. The letterbox gaps are small and blend with the container's existing border and background.
4. It requires changes only in `ScaledPreview.tsx` (5–10 lines), with no changes to the dialog layout or preview components.
5. Card mode is completely unaffected.

The design intent of the preview pane is to show the user what the layout looks like. Clipping any portion of the preview undermines that goal. Contain + center preserves the full preview while keeping it as large as possible within the available space.
