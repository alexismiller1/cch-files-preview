---
name: show-search
description: Show or hide the header search field. Use when the user types /show-search, says "show search", or "hide search".
---

# Show/Hide Search

Toggle the search field in the app header.

## Commands

| Command | What it does |
|---------|-------------|
| `/show-search true` | Show the header search field |
| `/show-search false` | Hide the header search field |
| `Show search` | Show the header search field |
| `Hide search` | Hide the header search field |

## Implementation

Edit `src/components/Header/index.tsx`:

- **Show** (`true`) → ensure the `<div className="header-search">` block is present (not commented out or removed)
- **Hide** (`false`) → remove or comment out the `<div className="header-search">` block

## Notes

- Only modify the `header-search` div — do not touch surrounding header structure.
