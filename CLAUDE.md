# Spectrum 2 Starter Template

React + Vite prototype template with React Spectrum S2 and Adobe services.

## Commands
- `pnpm dev` - Start dev server (HTTPS)
- `pnpm build` - Production build
- `pnpm lint` - TypeScript + ESLint

## Architecture
- **Client-only application** - No backend/server code; hosted on an internal deployment platform
- Entry: src/main.tsx → src/App.tsx
- Auth: IMS singleton via `useIMS()` hook from src/contexts/useIMS.ts
- UI: React Spectrum S2 only (import from @react-spectrum/s2)
- App frame: `src/components/AppFrame/` (Header + PrimaryNav + page slot). Pages render inside AppFrame providing their own `.app-frame-content` and optionally `.app-frame-right-panel`. Header: `src/components/Header/`
- **Primary navigation** (aliases: primary nav, left nav) → `src/components/PrimaryNav/`
- **Page content** (aliases: page, home page, apps page, etc.) → `.app-frame-content` in each page component under `src/pages/`. Different pages are identified by name (e.g. "home page" → `HomePage`, "apps page" → `AppsPage`).
- **Right panel** → `.app-frame-right-panel`, optional per page
- **U-nav** (aliases: universal nav) → top-right area of the Header component (`src/components/Header/`): toolbar icons (Gift, Help, Notifications), app switcher button (mobile), and avatar

## Services (IMPORTANT)

**Always explore `@adtech/protopack-services-all` first for service requests.**

Available services, more may be added, please inspect for full listing:
- `firefly` - Firefly API (image generation, upscaling)
- `ps` - Photoshop API
- `lightroom` - Lightroom API
- `digitalImaging` - Digital imaging services
- `adobe3p` - Third-party Adobe services

Usage:
```typescript
import { apis } from '@adtech/protopack-services-all';

// Access services
const result = await apis.firefly.generate(...);
const psResult = await apis.ps.someMethod(...);
```

If a service doesn't exist in @adtech packages, check the Services MCP server, then inform the user.

## Authentication
For all Adobe API calls, get credentials from IMS:
```typescript
const ims = useIMS();
const token = ims.tokenData?.token;        // Bearer token
const apiKey = ims.adobeid.client_id;       // x-api-key
```

Do NOT use separate API key environment variables.

## Display Presets
Toggle UI chrome visibility using the floating panel at the bottom-left corner. Two presets:
- **Full desktop** — full macOS shell (menubar, dock, browser chrome, all controls)
- **Content only** — TopAppBar + AppHeaderBar + page content, full bleed (no desktop/browser chrome, no window decorations)

Persists to localStorage. Context: `src/context/DisplayConfigContext.tsx`, panel: `src/components/DisplayPresetPanel.tsx`.

## Component Shortcuts
When asked to show/hide individual components, edit the relevant flag in the active preset in `src/context/DisplayConfigContext.tsx`:

| Command | Aliases | Flag | File |
|---------|---------|------|------|
| Show/Hide Top App Bar | TAB, top app bar, top bar | `topAppBar` | `src/context/DisplayConfigContext.tsx` |

- "Hide TAB" → set `topAppBar: false` in **all** presets in `PRESET_FLAGS`
- "Show TAB" → set `topAppBar: true` in **all** presets in `PRESET_FLAGS`
- "Show search" → ensure the `<div className="header-search">` block is present (not commented out/removed) in `src/components/Header/index.tsx`
- "Hide search" → remove or comment out the `<div className="header-search">` block in `src/components/Header/index.tsx`
- "Add right panel to `<Page>`" → add `<div className="app-frame-right-panel" />` to the page component in `src/pages/` (e.g. `AppsPage.tsx`)
- "Remove right panel on `<Page>`" → remove `<div className="app-frame-right-panel" />` from the page component in `src/pages/`

## Desktop Background
Change the desktop wallpaper gradient or set an image background at runtime. Persists to localStorage. Context: `src/context/DesktopBackgroundContext.tsx`.

| Command | What it does |
|---------|-------------|
| Change desktop background | Generate a randomized gradient (similar brightness/saturation to the default green) |
| Change desktop background `<image-url>` | Use the provided image URL as the desktop wallpaper |
| Reset desktop background | Revert to the default gradient |

20 pre-generated palettes are in `GRADIENT_PALETTES` in the context file (indices 0–19: red, orange-red, orange, gold, yellow, lime, green, emerald, teal, cyan, sky, azure, blue, indigo, violet, purple, orchid, magenta, pink, rose).

- "Change desktop background" → pick a random palette index (0–19), copy its `dark` value into `.desktop { background: … }` in `src/App.css` (line 6) and its `light` value into `.desktop[data-theme="light"] { background: … }` (line 714). Use the HSL gradient string from `GRADIENT_PALETTES[index]` directly.
- "Change desktop background `<url>`" → call `setImageBackground(url)` from `useDesktopBackground()`
- "Reset desktop background" → restore the default pink-to-blue: dark `linear-gradient(160deg, hsl(335,50%,32%) 0%, hsl(260,48%,28%) 40%, hsl(200,55%,21%) 100%)`, light `linear-gradient(160deg, hsl(335,38%,84%) 0%, hsl(260,28%,74%) 50%, hsl(200,22%,63%) 100%)`

## Adobe Product Icons
Use SVGs from `src/assets/adobe-mnemonics/` for all Adobe product icons (Photoshop, Lightroom, Firefly, etc.) unless noted otherwise. Files are named by product code (e.g. `ps_appicon.svg`, `lr_appicon.svg`, `fi_appicon.svg`).

## Breakpoints
- **Mobile** (aliases: small breakpoint, mobile design) — below 900px (`max-width: 899px`). Use the CSS custom property `var(--breakpoint-mobile)` defined in `src/index.css`.

## Key Rules
- Use sentence case for all text (not Title Case)
- Follow S2 design system patterns (see .agents/rules/)
- Vite only (no webpack/parcel)
- **Default change scope:** Assume all changes target the page content inside the browser chrome window (`src/pages/`, `src/components/` rendered inside `<AppShell>`), not the desktop shell (menubar, dock, desktop icons) or browser chrome (toolbar, URL bar). Only modify `DesktopView.tsx`, menubar, dock, or browser chrome when explicitly asked (e.g. "update browser chrome", "change desktop icon", "change desktop background").
