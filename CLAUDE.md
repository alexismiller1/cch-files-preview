# PPK Template Starter

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

## Key Rules
- Use sentence case for all text (not Title Case)
- Follow S2 design system patterns (see .agents/rules/)
- Vite only (no webpack/parcel)
