---
name: show-right-panel
description: Add or remove the right panel on a specific page. Use when the user types /show-right-panel, says "add right panel to <Page>", or "remove right panel on <Page>".
---

# Show/Hide Right Panel

Add or remove the right panel (`.app-frame-right-panel`) on a specific page.

## Commands

| Command | What it does |
|---------|-------------|
| `/show-right-panel true <Page>` | Add the right panel to the specified page |
| `/show-right-panel false <Page>` | Remove the right panel from the specified page |
| `Add right panel to <Page>` | Add the right panel to the specified page |
| `Remove right panel on <Page>` | Remove the right panel from the specified page |

## Implementation

Edit the target page component under `src/pages/` (e.g. `AppsPage.tsx`, `HomePage.tsx`):

- **Show** (`true`) → add `<div className="app-frame-right-panel" />` inside the page component's JSX
- **Hide** (`false`) → remove `<div className="app-frame-right-panel" />` from the page component's JSX

## Notes

- Only modify the page component for the specified page — do not touch other pages.
- The panel div can be placed anywhere inside the top-level return; AppFrame picks it up via CSS class.
