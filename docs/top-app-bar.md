# Top App Bar

## Overview

The **Top App Bar** is a fixed bar at the top of the browser window that displays app navigation. It stays fixed to the top of the page, spans the full width of the window, and supports collapse/expand behavior.

## Design Reference

- **Figma (expanded):** [Top App Bar - Expanded](https://www.figma.com/design/IsxNSHGtEVbb7chNzSw2HH/Top-App-Bar?node-id=9129-114463&m=dev)
- **Figma (collapsed):** [Top App Bar - Collapsed](https://www.figma.com/design/IsxNSHGtEVbb7chNzSw2HH/Top-App-Bar?node-id=2543-223513&m=dev)

## Behavior

- **Position:** Fixed to the top of the page within the window
- **Width:** Matches the window width (100%)
- **Height:** Fixed when expanded (56px); reduced when collapsed (44px)
- **Theme:** No light/dark mode — single appearance
- **Collapse/Expand:** Click the apps grid icon (top-left) to toggle

### Collapsed State

When collapsed:

- The bar height reduces to 44px (icon strip only)
- The app content area hides with a transition
- An icon remains visible in the top-left to re-expand
- Clicking the icon expands the bar with a smooth transition

### Transitions

- Height: 0.25s ease-out when expanding/collapsing
- Content opacity and transform: 0.2s ease-out when hiding/showing

## Usage

```tsx
import TopAppBar from "./components/TopAppBar/index.tsx";

// Basic usage
<TopAppBar />

// With props
<TopAppBar
  defaultExpanded={true}
  onExpandedChange={(expanded) => console.log(expanded)}
  apps={[
    { id: "home", label: "Adobe Home" },
    { id: "firefly", label: "Firefly" },
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultExpanded` | `boolean` | `true` | Initial expanded state |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Callback when state changes |
| `apps` | `TopAppBarApp[]` | Default set | App items to display |
| `className` | `string` | `""` | Additional CSS class |

## TopAppBarApp

```ts
type TopAppBarApp = {
  id: string;
  label: string;
};
```

## Structure

The Top App Bar consists of:

1. **Collapse button** — Spectrum 2 `ActionButton` (quiet, size M) with `AppsAll` icon at left 16px, top 12px
2. **Content area** — Gray bar (#c6c6c6) with app icons and labels
3. **Add button** — Spectrum 2 `ActionButton` (quiet, size S) with `Add` icon

The component uses Spectrum 2 from `@react-spectrum/s2` and icons from `@react-spectrum/s2/icons/`.

## Assets

Icons and app graphics can be replaced by uploading assets. The component uses Spectrum 2 icons (`AppsAll`, `Add`) for the collapse and add buttons. App icons can be customized by extending the component.

## Location

All Top App Bar files live under a dedicated component folder:

- **Component:** `src/components/TopAppBar/index.tsx`
- **Styles:** `src/components/TopAppBar/TopAppBar.css`
- **Integrated in:** `src/components/AppShell.tsx` (imports from `./TopAppBar/index.tsx`)

### Folder structure

```
src/components/TopAppBar/
├── index.tsx       # Main component
└── TopAppBar.css   # Styles
```
