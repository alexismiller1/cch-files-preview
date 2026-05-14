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
- **Page content** (aliases: page, home page, apps page, app-frame-content, etc.) → `.app-frame-content` in each page component under `src/pages/`. Different pages are identified by name (e.g. "home page" → `HomePage`, "apps page" → `AppsPage`).
- **Panel content** (aliases: right panel, app-frame-right-panel, app-frame-panel, app-frame-left-panel) → `.app-frame-right-panel`, optional per page
- **U-nav** (aliases: universal nav) → top-right area of the Header component (`src/components/Header/`): toolbar icons (Gift, Help, Notifications), app switcher button (mobile), and avatar

### Layout
- Page content max-width: `max-width: 1200px; margin-inline: auto;` — applied inside `.app-frame-content`. Full-bleed is allowed only when explicitly requested.
- Page content padding: `padding: 40px;` on desktop, `padding: 24px;` on mobile (use `@container app-frame (max-width: 899px)`)
- Panel content padding: `padding: 24px;`
- Content section gap: same value as content padding (40px desktop, 24px mobile) between sibling sections
- Page structure inside `.app-frame-content`: use `<header>`, `<main>`, `<footer>` semantic elements. Never wrap `<main>` in a `<div>`.

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

## App Mode
Global mode toggle in the settings FAB (bottom-left). Two modes:
- **CC Home** (aliases: CCH, CC Home) — Default. Browser-based Creative Cloud experience with full chrome and all device options.
- **CC Desktop** (aliases: CCD, CC Desktop) — Native desktop app experience. Forces: device locked to Desktop, browser chrome hidden, TAB hidden, Adobe logo replaced by OS window controls (close/minimize/maximize) in Header. Switching to CCD resets the selected page to Adobe Home.

Persists to localStorage (`app-mode`). Context: `src/context/DisplayConfigContext.tsx` (`AppMode` type, `appMode` / `setAppMode`). The `data-app-mode` attribute is set on the root `.desktop` element for CSS targeting.

## Display Presets
Toggle UI chrome visibility using the floating panel at the bottom-left corner. Two presets:
- **Full desktop** — full macOS shell (menubar, dock, browser chrome, all controls)
- **Content only** — TopAppBar + AppHeaderBar + page content, full bleed (no desktop/browser chrome, no window decorations)

Persists to localStorage. Context: `src/context/DisplayConfigContext.tsx`, panel: `src/components/SettingsFab/`.

## Adobe Product Icons
Use SVGs from `src/assets/adobe-mnemonics/` for all Adobe product icons (Photoshop, Lightroom, Firefly, etc.) unless noted otherwise. Files are named by product code (e.g. `ps_appicon.svg`, `lr_appicon.svg`, `fi_appicon.svg`).


## Breakpoints
- **Mobile** (aliases: small breakpoint, mobile design) — below 900px (`max-width: 899px`). Use the CSS custom property `var(--breakpoint-mobile)` defined in `src/index.css`.

## Key Rules
- Use sentence case for all text (not Title Case)
- Follow S2 design system patterns (see .agents/rules/)
- Vite only (no webpack/parcel)
- **Default change scope:** Assume all changes target the page content inside the browser chrome window (`src/pages/`, `src/components/` rendered inside `<AppShell>`), not the desktop shell (menubar, dock, desktop icons) or browser chrome (toolbar, URL bar). Only modify `DesktopView.tsx`, menubar, dock, or browser chrome when explicitly asked (e.g. "update browser chrome", "change desktop icon", "change desktop background").
