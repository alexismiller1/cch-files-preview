---
name: commands
description: Lists all available project-specific chat commands and shortcuts. Use when the user asks what commands are available, types /commands, or wants to know what shortcuts exist.
---

# Project Commands

Invoke these skills by typing `/skill-name` or a natural language trigger:

| Skill | Trigger | What it does |
|-------|---------|-------------|
| `/change-background` | "change desktop background", "reset desktop background", image URL | Change the desktop wallpaper gradient or set an image background |
| `/show-top-app-bar [true\|false]` | "show TAB", "hide TAB", "show top app bar", "hide top app bar" | Show or hide the Top App Bar across all display presets |
| `/show-right-panel [true\|false] <Page>` | "add right panel to <Page>", "remove right panel on <Page>" | Add or remove the right panel on a specific page |
| `/show-search [true\|false]` | "show search", "hide search" | Show or hide the header search field |
| `/pull-remote-update` | "sync with upstream", "pull remote update" | Pull latest changes from the upstream template repository |
| `/adtech-services` | "list services", "use Firefly API", "use Photoshop API" | Discover and integrate @adtech service packages |
| `/react-spectrum-s2` | "use React Spectrum", "S2 component", "Spectrum 2" | Build accessible UI with React Spectrum S2 components |
| `/web-accessibility-checker` | "check accessibility", "WCAG audit", "EU EAA compliance" | Review websites for WCAG 2.2 Level AA and EU EAA compliance |
| `/commands` | "what commands are available", "/commands" | Show this list |

## Tips
- New skills appear automatically when added to `.agents/skills/`
