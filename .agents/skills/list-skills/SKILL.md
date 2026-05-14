---
name: list-skills
description: Lists all available project-specific chat commands and shortcuts. Use when the user asks what commands are available, types /list-skills, or wants to know what shortcuts exist.
---

# Project Commands

Invoke these skills by typing `/skill-name` or a natural language trigger.

Skills are defined in `.agents/skills/` — each folder contains a `SKILL.md` with the authoritative description. When displaying this list, read each skill's `SKILL.md` and use its content — do not rely on hardcoded text here.

---

### `/change-background`
> Source: `.agents/skills/change-background/SKILL.md`

Change the desktop wallpaper. Pick a random gradient from 20 named palettes (red through rose), set an image from a URL or attached file, or reset to the default pink-to-blue gradient. Changes are written to `src/App.css` and persist to localStorage via `DesktopBackgroundContext`.

| Variant | Trigger |
|---------|---------|
| `/change-background` | Pick a random gradient palette |
| `/change-background <url\|image>` | Use the provided URL or attached image as the wallpaper |
| `/change-background reset` | Revert to the default gradient |

---

### `/show-top-app-bar`
> Source: `.agents/skills/show-top-app-bar/SKILL.md`

Toggle the Top App Bar (TAB) visibility across **all** display presets at once by setting `topAppBar` in `PRESET_FLAGS` inside `src/context/DisplayConfigContext.tsx`. Always updates every preset — not just the active one.

| Variant | Trigger |
|---------|---------|
| `/show-top-app-bar true` | Show the Top App Bar in all presets |
| `/show-top-app-bar false` | Hide the Top App Bar in all presets |
| `Show TAB` / `Show top app bar` | Show the Top App Bar |
| `Hide TAB` / `Hide top app bar` | Hide the Top App Bar |

---

### `/enabled-top-app-bar`
> Source: `.agents/skills/enabled-top-app-bar/SKILL.md`

Toggle whether the Top App Bar (TAB) is interactive. When disabled, app tabs and the overflow menu are non-clickable, while the collapse/expand toggle always remains functional. Implemented by adding or removing the `interactive` prop on `<TopAppBar>` in `src/components/AppShell.tsx`.

| Variant | Trigger |
|---------|---------|
| `/enabled-top-app-bar true` | Make the Top App Bar fully interactive |
| `/enabled-top-app-bar false` | Make app tabs and overflow menu non-interactive |
| `Enable TAB` / `Make top app bar interactive` | Enable interactivity |
| `Disable TAB` / `Make TAB non-interactive` | Disable interactivity |

---

### `/show-right-panel`
> Source: `.agents/skills/show-right-panel/SKILL.md`

Add or remove the `.app-frame-right-panel` div on a specific page component under `src/pages/`. AppFrame picks up the panel via CSS class — the div can be placed anywhere in the page's top-level return. Requires a page name argument.

| Variant | Trigger |
|---------|---------|
| `/show-right-panel true <Page>` | Add the right panel to the specified page |
| `/show-right-panel false <Page>` | Remove the right panel from the specified page |
| `Add right panel to <Page>` | Natural language trigger |
| `Remove right panel on <Page>` | Natural language trigger |

---

### `/show-search`
> Source: `.agents/skills/show-search/SKILL.md`

Show or hide the `<div className="header-search">` search field in `src/components/Header/index.tsx`. Only the `header-search` div is modified — surrounding header structure is left untouched.

| Variant | Trigger |
|---------|---------|
| `/show-search true` | Show the header search field |
| `/show-search false` | Hide the header search field |
| `Show search` | Show the header search field |
| `Hide search` | Hide the header search field |

---

### `/pull-remote-update`
> Source: `.agents/skills/pull-remote-update/SKILL.md`

Pull the latest changes from the `upstream` git remote into the current branch. Adds the remote (`git@github.com:Adobe-Prototype/cc-home-template-00f54.git`) if it doesn't exist, fetches, then pulls from `main` (falling back to `master`). Lists conflicting files and asks the user how to resolve them — never auto-resolves. Never force-pushes.

---

### `/list-skills`
> Source: `.agents/skills/list-skills/SKILL.md`

Show this list of available project commands, drawn live from each skill's `SKILL.md`. Use `/list-skills update` to rebuild the listing after skills are added or changed.

| Variant | Trigger |
|---------|---------|
| `/list-skills` | Display the current commands list |
| `/list-skills update` | Rebuild the commands list from all skill files |

---

## Tips
- New skills appear automatically when added to `.agents/skills/`
- Each skill's `SKILL.md` `description` frontmatter is the canonical one-line summary used for skill routing

## `/list-skills update` — rebuild procedure

When the argument is `update`:

1. List every subdirectory in `.agents/skills/` (each is a skill). **Skip** `react-spectrum-s2`, `adtech-services`, and `web-accessibility-checker` — these are background/internal skills and must not appear in the listing.
2. Read each skill's `SKILL.md` in full.
3. Rewrite the skill listing section of **this file** (`.agents/skills/list-skills/SKILL.md`) — from the first `---` separator after the intro paragraph down to (but not including) the Tips section — replacing it with one entry per skill, structured as:

   ```
   ### `/<skill-name>`
   > Source: `.agents/skills/<skill-name>/SKILL.md`

   <one-paragraph description drawn from the skill's content>

   <commands/variants table if the skill has multiple invocation forms>

   ---
   ```

4. Preserve the intro paragraph, the `/list-skills` entry itself, the Tips section, and this update procedure — do not overwrite them.
5. Confirm to the user which skills were found and that the file was updated.
