# Scaled preview sizing: analysis and recommendation

## Problem statement

Preview components rendered inside the ScaledPreview wrapper sometimes overflow their container and sometimes don't fill it. The behavior is inconsistent across different viewport sizes and dialog dimensions.

---

## Atomic decomposition

### Atom 1: The viewport height mismatch

**Logical component.** All five preview components set their root element to `height: "screen"`, which compiles to `height: 100vh`. The `vh` unit always resolves relative to the browser viewport, not relative to any parent container.

**Independence.** This is a CSS resolution concern, independent of the scale calculation, the dialog layout, or the container sizing.

**Correctness.** ScaledPreview renders an inner container at a fixed size (1280x800 by default). The preview component inside it sets `height: 100vh`. On a browser with a 900px-tall viewport, the preview root becomes 1280x900 inside an 1280x800 box. The content exceeds the inner container by 100px. On a 700px-tall viewport, the content is only 700px tall inside an 800px box, leaving 100px unfilled.

The inner container dimensions and the content dimensions are decoupled. This is the root cause.

---

### Atom 2: The scale calculation

**Logical component.** ScaledPreview computes a scale factor from the outer container dimensions and the inner (virtual viewport) dimensions. In fill mode: `Math.max(containerW / innerW, containerH / innerH)`.

**Independence.** The scale calculation depends only on the outer container size and the declared inner dimensions. It does not know what the content actually renders at.

**Correctness.** The scale formula is correct IF the content exactly fills the inner container dimensions. `Math.max` produces cover behavior (fills the container, clips overflow). `Math.min` produces contain behavior (fits within, may leave gaps). But both assume the content is exactly `innerWidth x innerHeight`. When the content is a different size (due to Atom 1), the assumption breaks and the scale is wrong.

Note: CSS `transform: scale()` is a visual-only operation — it does not alter the layout box of the inner container. Children that use percentage-based sizing (e.g., `height: 100%`) resolve against the inner container's declared dimensions (`innerWidth x innerHeight`), not the visually scaled size. This means the scale factor and percentage resolution are independent, which is the correct and expected behavior.

---

### Atom 3: The outer container height chain

**Logical component.** The dialog's preview pane height depends on a CSS chain: FullscreenDialog `dialogInner` grid (`height: 100%`, rows: `auto / 32px / 1fr`) -> Content (gridArea: content, receives the `1fr` row) -> user grid div (`height: "full"`, `overflow: hidden`) -> flex container with default row direction (`alignItems: "stretch"`) -> ScaledPreview (`height: 100%`).

**Independence.** This is a CSS layout concern, independent of the scale calculation or the preview content.

**Correctness.** For `height: 100%` to resolve correctly, every ancestor must have an explicit or resolvable height. The FullscreenDialog provides a fixed dialog size. Its inner grid gives Content the `1fr` row (remaining space after the heading and 32px gap). The user's grid div uses `height: "full"` (100% of Content). The flex container uses `alignItems: "stretch"`, which stretches children along the cross-axis (vertical in a row-direction container), giving ScaledPreview the full cell height. The `overflow: hidden` already present on the user's grid div prevents content-driven expansion. This chain is correct — the outer container gets the visible dialog content height. This atom is sound.

---

### Atom 4: Card vs dialog context

**Logical component.** ScaledPreview is used in two contexts: cards (default mode with aspect ratio) and the dialog (fill mode).

**Independence.** The two contexts have different sizing behaviors but share the same ScaledPreview component and the same preview components.

**Correctness.** In card mode, the outer container determines its own height via `aspectRatio: 1280/800`. The inner content should fill 1280x800 exactly. In dialog fill mode, the outer container gets its height from the dialog. The inner content should still fill 1280x800 exactly. Both contexts require the content to match the inner dimensions. The `100vh` issue (Atom 1) affects both contexts identically.

---

## Synthesis

The root cause is Atom 1: `height: "screen"` (100vh) in the preview components resolves to the browser viewport height, not the ScaledPreview inner container height. The scale calculation (Atom 2) and container chain (Atom 3) are correct in isolation, but they depend on the assumption that the content matches the declared inner dimensions. When the content uses `100vh`, this assumption breaks.

---

## Solutions

### Solution A: Change preview components from `height: "screen"` to `height: "full"` (recommended)

Change each preview component's root element from `height: "screen"` (100vh) to `height: "full"` (100%). Since the parent is the ScaledPreview inner div with an explicit pixel height (800px by default), `100%` resolves to exactly 800px. CSS transforms on the parent do not affect this resolution (see Atom 2 note). The content fills the inner container precisely, making the scale calculation correct in all contexts.

**Pros:**
- One-line change per preview component (5 files)
- Fixes both card and dialog contexts
- No changes to ScaledPreview or the dialog layout
- Content always matches inner dimensions regardless of browser viewport
- Semantically correct: the intent is "fill the parent container", not "fill the browser viewport"
- Forward-compatible: if `innerHeight` is ever changed via props, `100%` automatically adapts

**Cons:**
- Preview code uses `height: 100%` instead of `height: 100vh`, so the AI-generated layout needs to adapt (the prompt already instructs the AI to make the layout full-viewport; it would use 100vh in the generated version)

**Impact on AI generation:** Minimal. The visual structure is identical. The prompt says "match the preview's visual structure" — the AI will see the layout pattern and apply 100vh for the generated top-level page.

---

### Solution B: Set ScaledPreview inner dimensions to match the browser viewport

Change ScaledPreview to use `window.innerWidth` and `window.innerHeight` as the inner dimensions. Since `100vh` equals `window.innerHeight`, the content would fill the inner container exactly.

**Pros:**
- Preview components keep `height: "screen"` (closer to generated code)
- Content naturally matches the inner container

**Cons:**
- Inner dimensions change with browser resize (more repaints)
- Card aspect ratio varies by viewport (inconsistent card appearance across screens)
- Requires a window resize listener in addition to ResizeObserver
- More complex implementation

---

### Solution C: Use an iframe for isolation

Render each preview inside an iframe, which creates its own viewport context. `100vh` inside the iframe equals the iframe's height.

**Pros:**
- Complete viewport isolation
- `100vh` works naturally
- No style bleed risk

**Cons:**
- Significant implementation complexity
- Style injection needed (S2 CSS must be loaded inside the iframe)
- Communication overhead between iframe and parent
- Overkill for this problem

---

## Recommendation: Solution A

Change `height: "screen"` to `height: "full"` in all five preview components. This is a targeted fix at the root cause (Atom 1) with no side effects on the other atoms. The scale calculation, container chain, and dual-context usage all work correctly once the content matches the inner container dimensions.
