---
name: show-top-app-bar
description: Show or hide the Top App Bar. Use when the user types /show-top-app-bar, says "show TAB", "hide TAB", "show top app bar", or "hide top app bar".
---

# Show/Hide Top App Bar

Toggle the Top App Bar (TAB) visibility across all display presets.

## Commands

| Command | What it does |
|---------|-------------|
| `/show-top-app-bar true` | Show the Top App Bar in all presets |
| `/show-top-app-bar false` | Hide the Top App Bar in all presets |
| `Show TAB` / `Show top app bar` | Show the Top App Bar |
| `Hide TAB` / `Hide top app bar` | Hide the Top App Bar |

## Implementation

Edit `src/context/DisplayConfigContext.tsx` — find `PRESET_FLAGS` and set `topAppBar` to `true` or `false` in **all** presets:

- **Show** (`true`) → `topAppBar: true` in every preset entry in `PRESET_FLAGS`
- **Hide** (`false`) → `topAppBar: false` in every preset entry in `PRESET_FLAGS`

## Notes

- Always update **all** presets in `PRESET_FLAGS`, not just the active one.
- No other files need to be changed.
