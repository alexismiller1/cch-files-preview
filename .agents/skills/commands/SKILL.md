---
name: commands
description: Lists all available project-specific chat commands and shortcuts. Use when the user asks what commands are available, types /commands, or wants to know what shortcuts exist.
---

# Project Commands

## Component Shortcuts

Toggle UI components by typing these commands in chat:

| Command | Aliases | What it does |
|---------|---------|-------------|
| Show/Hide Top App Bar | `TAB`, `top app bar`, `top bar` | Toggles the Top App Bar in all display presets |
| Show/Hide search | `search`, `search bar` | Toggles the header search field in the app frame |
| Add/Remove right panel | `right panel` | Adds or removes the right panel on a specific page |

### Usage
- `Hide TAB` — hides the Top App Bar
- `Show TAB` — shows the Top App Bar
- `Show search` — shows the header search component
- `Hide search` — hides the header search component
- `Add right panel to Apps page` — adds `app-frame-right-panel` to the Apps page
- `Remove right panel on Home page` — removes `app-frame-right-panel` from the Home page

## Desktop Background

Change the desktop wallpaper at runtime:

| Command | What it does |
|---------|-------------|
| `Change desktop background` | Randomize the gradient wallpaper |
| `Change desktop background <image-url>` | Use an image as the wallpaper |
| `Reset desktop background` | Revert to the default gradient |

### Usage
- `Change desktop background` — generates a new random gradient
- `Change desktop background https://example.com/photo.jpg` — sets an image wallpaper
- `Reset desktop background` — restores the default pink-to-blue gradient

## Tips
- Commands are case-insensitive
- New component shortcuts can be added to the table in CLAUDE.md under "Component Shortcuts"
