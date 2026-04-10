# Mac-like Overlay Scrollbar Styling

## 1. Summary / Diagnosis

The implementation uses CSS custom properties (`--scrollbar-thumb`, `--scrollbar-thumb-hover`) set on `:root` for light theme and overridden on `html[data-theme="dark"]` for dark theme. WebKit browsers get a thin overlay scrollbar via `::-webkit-scrollbar*` pseudo-elements with a transparent track and translucent thumb. Firefox uses `scrollbar-width: thin` and `scrollbar-color` with a transparent track. The theme is driven entirely by the app’s in-app `data-theme` attribute on `html`, not `prefers-color-scheme`. The JS syncs `data-theme` to `html` when the theme changes and persists the preference in `localStorage`.

---

## 2. Copy-Paste Ready CSS (Global)

```css
/* Mac-like overlay scrollbar - theme via data-theme on html */
:root {
  --scrollbar-thumb: rgba(0, 0, 0, 0.25);
  --scrollbar-thumb-hover: rgba(0, 0, 0, 0.4);
}

html[data-theme="dark"] {
  --scrollbar-thumb: rgba(255, 255, 255, 0.25);
  --scrollbar-thumb-hover: rgba(255, 255, 255, 0.4);
}

/* Chrome 121+ overrides ::-webkit-scrollbar when scrollbar-width is set; use @supports to scope to Firefox */
@supports not selector(::-webkit-scrollbar) {
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent;
  }
}

*::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

*::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
  background-clip: padding-box;
}

*::-webkit-scrollbar-corner {
  background: transparent;
}

@media (prefers-reduced-motion: reduce) {
  *::-webkit-scrollbar-thumb {
    transition: none;
  }
}
```

---

## 3. Tailwind-Compatible Instructions

**Option A: Add to globals / Tailwind entry**

Add the scrollbar block above to your main CSS (e.g. `src/index.css`) **before** or **after** `@import "tailwindcss"`. No Tailwind config changes are needed.

**Option B: CSS variables in Tailwind config**

If you use Tailwind `theme.extend.colors`, you can wire the variables there:

```js
// tailwind.config.js (Tailwind v3) - optional
theme: {
  extend: {
    colors: {
      "scrollbar-thumb": "var(--scrollbar-thumb)",
      "scrollbar-thumb-hover": "var(--scrollbar-thumb-hover)",
    },
  },
},
```

Then you could use `scrollbar-thumb` in arbitrary values. For scrollbar styling itself, the global CSS above remains necessary; Tailwind has no built-in scrollbar utilities.

**Option C: Utility class (optional)**

```css
.scrollbar-overlay {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) transparent;
}
.scrollbar-overlay::-webkit-scrollbar { width: 12px; height: 12px; }
.scrollbar-overlay::-webkit-scrollbar-track { background: transparent; }
.scrollbar-overlay::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.scrollbar-overlay::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
  background-clip: padding-box;
}
.scrollbar-overlay::-webkit-scrollbar-corner { background: transparent; }
```

Use this instead of the `*` selector if you only want overlay scrollbars on specific elements.

---

## 4. JS Snippet: Theme Toggle and Persistence

```ts
const THEME_STORAGE_KEY = "app-theme";

function readStoredTheme(): "light" | "dark" {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

// In your root component:
const [theme, setTheme] = useState<"light" | "dark">(readStoredTheme);

useEffect(() => {
  document.documentElement.dataset.theme = theme;
}, [theme]);

useEffect(() => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}, [theme]);
```

This implementation is already integrated in `App.tsx`.

---

## 5. Accessibility Notes

- **Focus**: Scrollbar styling does not affect keyboard focus behavior. Focus remains on scrollable content.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables scrollbar thumb transitions to avoid motion.
- **Contrast**: Thumb opacity (25% default, 40% hover) meets a subtle overlay look; ensure sufficient contrast on your backgrounds. Adjust `--scrollbar-thumb` / `--scrollbar-thumb-hover` if needed.
- **Interaction**: Scrollbars remain draggable and scrollable; overlay appearance does not change semantics.

---

## 6. Manual Test Checklist

| # | Test | Expected Outcome |
|---|------|------------------|
| 1 | **Theme toggle** – Switch light ↔ dark via in-app toggle | Scrollbar thumb switches from dark (light theme) to light (dark theme). Track stays transparent. |
| 2 | **Page reload** – Refresh with light, then dark theme | Stored theme is restored; scrollbar matches the restored theme. |
| 3 | **Scrollable area** – Scroll a long panel (e.g. Activities) | Thin overlay thumb appears only while scrolling or on hover; track is transparent. |
| 4 | **Cross-browser** – Chrome, Safari, Firefox, Edge | Overlay-style thin scrollbar in all; Firefox may render a thin native scrollbar with a translucent thumb. |
| 5 | **Reduced motion** – Enable “Reduce motion” in OS | No scrollbar thumb transitions; other behavior unchanged. |

---

## 7. Smooth Fade Transition (Show/Hide)

### Diagnosis
The existing show/hide logic uses \`.scrollbar-visible\` and \`.scrollbar-near\` on scroll containers; visibility is driven by \`::-webkit-scrollbar-thumb\` opacity/background. A non-destructive CSS patch adds variables \`--scrollbar-transition\` and \`--scrollbar-visible-opacity\` plus smoother opacity/background transitions, with \`requestAnimationFrame\` wrapping class toggles to avoid layout thrash.

### Copy-Paste CSS Patch (already in index.css)
Variables \`--scrollbar-transition\` and \`--scrollbar-visible-opacity\` are in \`:root\`. Thumb uses them for \`transition\` and visible-state \`opacity\`.

### Tailwind Notes
Use variables in arbitrary values: \`style="--scrollbar-transition: 0.3s ease-out"\`. Or add to Tailwind theme: \`transitionDuration: { "scrollbar": "var(--scrollbar-transition, 0.5s)" }\`.

### JS Snippet (integrated in App.tsx)
Class toggles are wrapped in \`requestAnimationFrame\` for \`scrollbar-visible\` and \`scrollbar-near\` to avoid layout thrash.

### Fallback: Custom Overlay Div
If pseudo-element transitions are unreliable, use a \`.custom-scrollbar\` overlay div with \`opacity\` + \`visibility\` + \`pointer-events\`, and \`transition: opacity var(--scrollbar-transition)\`. Toggle \`.scrollbar-visible\` / \`.scrollbar-near\` on the parent.

### 3 Quick Manual Checks

| # | Check | Expected |
|---|-------|----------|
| 1 | Scroll a panel, then stop | Scrollbar fades out over ~0.5s (no abrupt disappear). |
| 2 | Move mouse near scrollbar edge | Scrollbar fades in smoothly over ~0.5s. |
| 3 | Enable OS "Reduce motion" | Scrollbar appears/disappears instantly (no fade). |
