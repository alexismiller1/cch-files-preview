---
name: change-background
description: Change the desktop wallpaper gradient or set an image background. Use when the user says "change desktop background", "reset desktop background", or provides an image URL to use as the wallpaper.
---

# Change Background

Change the desktop wallpaper. Persists to localStorage. Context: `src/context/DesktopBackgroundContext.tsx`.

## Commands

| Command | What it does |
|---------|-------------|
| `/change-background` | Pick a random gradient palette |
| `/change-background <url\|image>` | Use the provided URL or attached image as the wallpaper |
| `/change-background reset` | Revert to the default gradient |

## Implementation

### `/change-background` — random gradient
Pick a palette index (0–19) directly — do NOT shell out or use random CLI commands. 20 palettes are in `GRADIENT_PALETTES` in `src/context/DesktopBackgroundContext.tsx` (red, orange-red, orange, gold, yellow, lime, green, emerald, teal, cyan, sky, azure, blue, indigo, violet, purple, orchid, magenta, pink, rose). Copy its `dark` HSL gradient string into `.desktop { background: … }` in `src/App.css` (line ~6) and its `light` value into `.desktop[data-theme="light"] { background: … }` (line ~714). Use the string verbatim — do not recompute or modify it.

### `/change-background <url|image>` — image wallpaper
Call `setImageBackground(url)` from `useDesktopBackground()`.

### `/change-background reset` — default gradient
Restore the default pink-to-blue:
- dark: `linear-gradient(160deg, hsl(335,50%,32%) 0%, hsl(260,48%,28%) 40%, hsl(200,55%,21%) 100%)`
- light: `linear-gradient(160deg, hsl(335,38%,84%) 0%, hsl(260,28%,74%) 50%, hsl(200,22%,63%) 100%)`

## Notes

- Only modify `src/App.css` gradient lines and `DesktopBackgroundContext.tsx` — do not touch page content or other components.
