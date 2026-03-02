# Layout prompt viewport and dark-mode background analysis

When a user picks a layout, copies the prompt, and pastes it into AI chat to apply to `src/App.tsx`, the resulting app does not match the preview. Specifically:

- The layout does not cover the entire viewport height
- In dark mode, the bottom portion of the screen shows a white background where the `<body>` is exposed
- Semantic S2 background colors are not applied at the root level, so the page does not adapt to light and dark mode correctly

This document decomposes the problem into atomic reasoning units, validates each independently, and synthesizes solutions.

---

## Atomic reasoning units

### Atom 1: PreviewPage wraps previews in a full-viewport container, but prompts omit this

**Logical component.** In `App.tsx`, the `PreviewPage` component (used for `?preview=` routes) wraps every preview in a `100vw` x `100vh` div with `backgroundColor: "pasteboard"`:

```tsx
<Provider colorScheme={colorScheme}>
  <div
    className={style({ backgroundColor: "pasteboard" })}
    style={{ width: "100vw", height: "100vh" }}
  >
    <PreviewComponent onToggleTheme={toggleColorScheme} />
  </div>
</Provider>
```

The prompts tell the AI to "Keep existing Provider/IMSProvider wiring" but never mention adding an equivalent full-viewport wrapper around the new page component. The AI replaces `<StarterPage />` with the new page component directly under `<IMSProvider>`, which has no height or background constraints.

**Independence.** This is purely about the prompt instructions and App.tsx wiring. It does not depend on how CSS cascades or how the preview components themselves are styled.

**Correctness.** Verified by reading `App.tsx` lines 43-52 (PreviewPage) vs. lines 79-86 (main route). The main route has no viewport wrapper. All six prompts in `registry.ts` say "Keep existing Provider/IMSProvider wiring" but none mention a viewport-filling wrapper div.

---

### Atom 2: `<html>`, `<body>`, and `#root` have no explicit height

**Logical component.** For `height: 100%` to propagate from a child element up to the viewport, every ancestor in the chain must have an explicit height. Currently:

- `index.html`: `<html>`, `<body>`, and `<div id="root">` have no height set
- `index.css`: `body` only has `margin: 0` and `font-family`

Without `height: 100%` on these elements, any child using `height: "full"` (which compiles to `height: 100%`) collapses to its content height rather than the viewport height.

**Independence.** This is a CSS cascade issue, independent of the S2 component tree or prompt wording.

**Correctness.** Verified by reading `index.html` (no style attributes on html/body) and `index.css` (only `margin: 0` and `font-family` on body). No other global stylesheet exists.

---

### Atom 3: Preview components use `height: "full"` (relative), not `minHeight: "screen"` (viewport)

**Logical component.** Every preview component's root div uses:

```tsx
className={style({ height: "full", backgroundColor: "..." })}
```

`height: "full"` compiles to `height: 100%`, which is relative to the parent's height. Inside PreviewPage's `100vh` wrapper, this fills the viewport. But when the AI recreates the component standalone (without a `100vh` parent), `height: 100%` resolves to the content's intrinsic height because no ancestor has an explicit height (per Atom 2).

The S2 style macro offers `minHeight: "screen"` which compiles to `min-height: 100vh` -- an absolute viewport unit that works regardless of parent chain. The previews don't use it because they rely on the PreviewPage wrapper.

**Independence.** This is about the CSS sizing strategy inside the preview components. It interacts with Atom 2 (parent chain) but is independently fixable.

**Correctness.** Verified across all six preview files: `BlankPreview` (line 12), `EditingAppPreview` (line 26), `ProEditingAppPreview` (line 26), `BrowsingContextPreview` (line 241), `BentoPreview` (line 21), `TextDocumentPreview` (line 43) -- all use `height: "full"`.

---

### Atom 4: `<body>` does not participate in React Spectrum's color scheme

**Logical component.** React Spectrum's `<Provider colorScheme="dark">` sets CSS custom properties and `color-scheme` on its own container element. The `<body>` element is outside this scope. The browser's default `background-color` for `<body>` is white, and this does not change when the S2 Provider switches to dark mode.

Any area of the viewport not covered by an S2-styled element (a div with `backgroundColor: "base"`, `"pasteboard"`, etc.) shows the body's white background. In dark mode, this creates a visible white strip wherever the layout falls short of covering the viewport.

**Independence.** This is about the HTML/CSS cascade outside React's component tree. It does not depend on prompt wording or component sizing.

**Correctness.** Verified: `index.css` has no `background-color` on `body`. The S2 `Provider` component renders a div with Spectrum tokens -- it does not style `<body>`.

---

### Atom 5: Prompts' acceptance checks are ambiguous about viewport coverage

**Logical component.** The prompts include "deterministic acceptance checks" that describe the layout structure, but they use ambiguous height language. For example, the Blank layout says:

> Root container is a full-height column with base background and 32px padding

"Full-height" could mean `height: 100%` (relative to parent, which may not be the viewport) or `height: 100vh` / `minHeight: 100vh` (absolute viewport coverage). The AI is likely to interpret this as `height: 100%`, which fails without the parent chain from Atom 2.

None of the six prompts' acceptance checks specify:
- The root must cover `100vh`
- The body/html must have a dark-mode-aware background
- The App.tsx wrapper must provide viewport-level coverage

**Independence.** This is purely about prompt specification completeness. It is a distinct issue from the CSS or component-level problems.

**Correctness.** Verified by reading all six prompts' acceptance checks in `registry.ts`. None mention `100vh`, viewport coverage, or body-level dark mode handling.

---

### Atom 6: Prompts reference the preview source file but not the PreviewPage wrapper

**Logical component.** Every prompt starts with:

> Use src/_starter/previews/[Preview].tsx as the source of truth.

The AI reads the preview file and recreates its structure. But the preview file only contains the inner component (which uses `height: "full"`). The crucial viewport wrapper lives in `App.tsx`'s `PreviewPage` function, which the prompt never references. The AI faithfully recreates the inner component but misses the outer shell that makes it fill the viewport.

**Independence.** This is about what source files the prompt directs the AI to read. It is independent of CSS inheritance or S2 semantics.

**Correctness.** Verified: all six prompts reference only `src/_starter/previews/[X].tsx`. None reference the `PreviewPage` function in `App.tsx` or its wrapper div.

---

### Atom 7: The LayoutPicker page itself handles viewport coverage correctly

**Logical component.** The LayoutPicker (the page the user sees before applying a layout) uses `minHeight: "screen"` and `backgroundColor: "base"` on its root:

```tsx
<div className={style({ minHeight: "screen", backgroundColor: "base" })}>
```

This works correctly in dark mode and fills the viewport regardless of parent chain, because `minHeight: "screen"` compiles to `min-height: 100vh`. This proves the S2 style macro has the right tool (`minHeight: "screen"`) -- it's just not being used by the generated page components.

**Independence.** This is an observation about existing correct behavior, serving as a reference implementation. It validates that the fix is within the S2 style macro's capabilities.

**Correctness.** Verified by reading `LayoutPicker.tsx` lines 21-23.

---

### Atom 8: No global dark-mode CSS fallback exists

**Logical component.** Modern browsers support `color-scheme: dark` on `<html>` or `<body>`, which causes the browser's default background to become dark. Additionally, CSS custom properties from S2 could be applied at the body level. Currently, neither mechanism is in place:

- `index.html` has no `color-scheme` meta tag or style
- `index.css` has no `color-scheme` property on `html` or `body`
- No CSS ties the body background to S2's semantic tokens

This means even if the layout component nearly fills the viewport, any sub-pixel gap, scrollbar area, or overscroll reveals white.

**Independence.** This is about browser-level dark mode support, independent of React components.

**Correctness.** Verified by reading `index.html` and `index.css`. Neither contains `color-scheme` declarations.

---

## Synthesis

The white-background-in-dark-mode problem has three independent root causes that compound:

| Root cause | Atoms | Effect |
|---|---|---|
| Missing viewport wrapper in App.tsx after AI applies layout | 1, 6 | Layout component has no `100vh` parent, so `height: 100%` collapses |
| No height chain in global CSS | 2, 3 | `height: "full"` cannot resolve to viewport height |
| Body has no dark-mode background | 4, 8 | Exposed body is always white regardless of S2 color scheme |

The prompts don't address any of these (Atoms 5, 6), even though the LayoutPicker itself demonstrates the correct pattern (Atom 7).

---

## Solutions

### Solution A: Fix global CSS + update prompts (recommended)

This two-part fix addresses all root causes with minimal structural changes.

**Part 1 -- Global CSS.** Update `src/index.css`:

```css
html, body, #root {
  height: 100%;
}
```

This establishes the height chain so `height: "full"` resolves correctly in any component. The body background is handled by S2 Provider inheriting color-scheme.

**Part 2 -- Update prompts.** Add to each prompt's constraints section:

> The page component's root element must use `minHeight: "screen"` (not `height: "full"`) and a semantic `backgroundColor` (such as "base" or "pasteboard") from the style macro to ensure full-viewport coverage and proper dark/light mode adaptation.

Add to each prompt's acceptance checks:

> Page covers the full viewport with no exposed body background in either light or dark mode.

**Pros:**
- Fixes the problem at both the CSS foundation and the prompt instruction level
- `minHeight: "screen"` makes page components self-sufficient (they don't depend on parent height chain)
- Minimal code changes (one CSS rule + prompt text edits)
- Follows the proven pattern from LayoutPicker (Atom 7)

**Cons:**
- Requires updating all six prompts in `registry.ts`
- Does not fix the body-level dark mode flash if content is loading

---

### Solution B: Make page components fully self-contained

Instead of fixing global CSS, change each preview to use `minHeight: "screen"` and update prompts accordingly. The generated pages would be viewport-filling regardless of their parent context.

**Changes:**
- Change all previews from `height: "full"` to `minHeight: "screen"`
- Update prompts to specify `minHeight: "screen"` in acceptance checks
- Add a note in prompts that App.tsx should not need a viewport wrapper

**Pros:**
- No global CSS changes needed
- Each page is independently correct
- PreviewPage wrapper in App.tsx becomes redundant (simplification opportunity)

**Cons:**
- Changes preview files (which may be treated as source-of-truth references)
- Does not address body-level dark mode background (still white on overscroll)
- More prompt changes needed since acceptance checks must be more explicit

---

### Solution C: Add an App.tsx template to each prompt

Include the exact App.tsx code the AI should produce, with the viewport wrapper built in.

**Changes:**
- Each prompt includes an explicit App.tsx code block showing the Provider/wrapper/page structure
- The wrapper uses `style={{ width: "100vw", height: "100vh" }}` and `backgroundColor: "pasteboard"`

**Pros:**
- Most deterministic -- leaves nothing to AI interpretation
- Matches the PreviewPage pattern exactly

**Cons:**
- Makes prompts significantly longer and more rigid
- Duplicates the same App.tsx boilerplate across all six prompts
- Harder to maintain if App.tsx structure evolves

---

## Recommendation

**Solution A** is recommended. It:

1. Fixes the structural CSS gap at the foundation level (`html, body, #root { height: 100% }`)
2. Makes prompts explicit about `minHeight: "screen"` + semantic background on the page root
3. Adds a viewport-coverage acceptance check so AI agents can self-verify
4. Follows the pattern already proven by LayoutPicker
5. Is the smallest change surface with the broadest fix coverage
