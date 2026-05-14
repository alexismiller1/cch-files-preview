---
name: cc-change-background
description: Change the desktop wallpaper gradient or set an image background. Use when the user says "change desktop background", "reset desktop background", or provides an image URL to use as the wallpaper.
---

# CC Change Background

Change the desktop wallpaper gradient or set an image background at runtime. Persists to localStorage. Context: `src/context/DesktopBackgroundContext.tsx`.

## Commands

| Command | What it does |
|---------|-------------|
| Change desktop background | Pick a random gradient palette (see below) |
| Change desktop background `<image-url>` | Use the provided image URL as the desktop wallpaper |
| Reset desktop background | Revert to the default gradient |

## Gradient palettes

20 pre-generated palettes are in `GRADIENT_PALETTES` in `src/context/DesktopBackgroundContext.tsx` (indices 0–19: red, orange-red, orange, gold, yellow, lime, green, emerald, teal, cyan, sky, azure, blue, indigo, violet, purple, orchid, magenta, pink, rose).

- **"Change desktop background"** → pick a palette index (0–19) directly — do NOT shell out or use random CLI commands. Copy its `dark` HSL gradient string into `.desktop { background: … }` in `src/App.css` (line ~6) and its `light` value into `.desktop[data-theme="light"] { background: … }` (line ~714).
- **"Change desktop background `<url>`"** → call `setImageBackground(url)` from `useDesktopBackground()`
- **"Reset desktop background"** → restore the default pink-to-blue:
  - dark: `linear-gradient(160deg, hsl(335,50%,32%) 0%, hsl(260,48%,28%) 40%, hsl(200,55%,21%) 100%)`
  - light: `linear-gradient(160deg, hsl(335,38%,84%) 0%, hsl(260,28%,74%) 50%, hsl(200,22%,63%) 100%)`

## Notes

- Always pick the palette index directly without using shell commands for randomness.
- Use the HSL gradient string from `GRADIENT_PALETTES[index]` verbatim — do not recompute or modify it.
- Only modify `src/App.css` gradient lines and `DesktopBackgroundContext.tsx` — do not touch page content or other components.
