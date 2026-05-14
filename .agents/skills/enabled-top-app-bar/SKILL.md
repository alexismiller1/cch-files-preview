---
name: enabled-top-app-bar
description: Make the Top App Bar interactive or non-interactive. Use when the user types /enabled-top-app-bar, says "enable top app bar", "disable top app bar", "make TAB interactive", or "make TAB non-interactive".
---

# Enable/Disable Top App Bar Interactivity

Toggle whether the Top App Bar (TAB) is interactive. When disabled, app tabs are not clickable and the overflow menu does nothing. The collapse/expand toggle always remains functional.

## Commands

| Command | What it does |
|---------|-------------|
| `/enabled-top-app-bar true` | Make the Top App Bar fully interactive |
| `/enabled-top-app-bar false` | Make app tabs and overflow menu non-interactive (collapse/expand still works) |
| `Enable TAB` / `Make top app bar interactive` | Enable interactivity |
| `Disable TAB interactivity` / `Make TAB non-interactive` | Disable interactivity |

## Implementation

Edit `src/components/AppShell.tsx` — add or update the `interactive` prop on the `<TopAppBar>` element:

- **Enable** (`true`) → remove the `interactive` prop entirely (it defaults to `true`), or set `interactive={true}`
- **Disable** (`false`) → add `interactive={false}` to the `<TopAppBar>` element

### Example (disabled)

```tsx
<TopAppBar
  selectedAppId={selectedAppId}
  onAppSelect={setSelectedAppId}
  pinnedAppIds={pinnedAppIds}
  onPinnedAppIdsChange={setPinnedAppIds}
  onExpandedChange={setTopAppBarExpanded}
  interactive={false}
/>
```

## What stays interactive

- The collapse/expand toggle button (AppsAll icon, top-left) always works regardless of `interactive`

## What becomes non-interactive when `interactive={false}`

- App tabs (clicking a tab does nothing; cursor: default, pointer-events: none via CSS class `top-app-bar--non-interactive`)
- Overflow menu button (More icon) is disabled
- Edit/Customize mode cannot be entered (app tabs block the click path)

## Notes

- No other files need to be changed.
- The `interactive` prop lives on `TopAppBarProps` in `src/components/TopAppBar/index.tsx` — do not modify that file.
