# Integrating blueline.min.js into App.tsx

## Problem

Add `blueline.min.js` to the application following the same pattern used for Agentation.

---

## Atomic decomposition

### Atom 1: Module format of blueline.min.js

**Logical component:** Blueline is an IIFE (immediately invoked function expression), not an ES module. It wraps as `var blueline = (function(A){ ... })({})` and explicitly sets `window.blueline = { init }` at runtime.

**Independence:** This is a standalone fact about the file; it does not depend on any other atom.

**Correctness:** Verified by inspecting line 1 (`var blueline=(function(A){"use strict";...`) and the tail (`e.blueline={init:ae}`). The file also has auto-init logic gated on `document.currentScript`, which will be `null` when bundled by Vite — so auto-init will **not** fire. Only `window.blueline.init()` will be available.

---

### Atom 2: Module format of Agentation

**Logical component:** Agentation is an npm package (`"agentation": "^2.2.1"` in devDependencies) that exports a React component via standard ES module syntax: `import { Agentation } from "agentation"`.

**Independence:** Standalone fact about the reference pattern.

**Correctness:** Verified in `package.json` line 26 and `DevToolbar.tsx` line 1.

---

### Atom 3: Agentation integration pattern

**Logical component:** The Agentation pattern has four layers:

1. **Package install** — listed in `devDependencies`
2. **Wrapper component** — `DevToolbar.tsx` imports and renders `<Agentation />`
3. **Conditional rendering** — `App.tsx` line 74: `{import.meta.env.DEV && <DevToolbar />}`
4. **Dual mount points** — same guard in `main.tsx` line 24 for the picker route

**Independence:** Depends on Atom 2 for the import style, but the four-layer pattern is an independent structural observation.

**Correctness:** Verified across `DevToolbar.tsx`, `App.tsx` lines 70-76, and `main.tsx` lines 19-26.

---

### Atom 4: Blueline initialization API

**Logical component:** `blueline.init(config?)` returns a control object: `{ destroy, refresh, toggle, show, hide }`. The `destroy()` method removes all DOM artifacts (shadow DOM host, overlays, mutation observers, event listeners).

**Independence:** Standalone fact derived from reading the source.

**Correctness:** Verified in the source — the `ae` function (aliased to `init`) instantiates `En` (the core class), calls `init()`, and returns the control object. `destroy()` calls `En.destroy()` which removes the host element and all listeners.

---

### Atom 5: React lifecycle alignment

**Logical component:** Because Blueline manipulates the DOM imperatively (creates a shadow DOM host on `document.body`, installs mutation observers, scroll/resize listeners), it must be initialized inside a `useEffect` and cleaned up via the effect's return function calling `destroy()`.

**Independence:** Depends on Atom 4 (API shape) but the React lifecycle requirement is an independent constraint.

**Correctness:** React's rules of effects require side-effectful DOM work in `useEffect`. The `destroy()` method is the correct cleanup since it reverses all DOM mutations and listener registrations.

---

### Atom 6: Import strategy for the IIFE

**Logical component:** When Vite bundles an IIFE file via `import "./blueline.min.js"`, it executes the IIFE in module scope. The `var blueline` stays local to the module, but the explicit `window.blueline = { init }` assignment fires, making `window.blueline.init` globally available.

**Independence:** Depends on Atom 1 (module format) and the Vite build system.

**Correctness:** Vite treats `.js` imports as ES modules to bundle. The IIFE executes during module evaluation, and since it explicitly writes to `window`, the init function is accessible. `document.currentScript` will be `null` in a bundled context, so auto-init is skipped — only manual `init()` works.

---

### Atom 7: DEV-only gating

**Logical component:** Like Agentation, Blueline is a development overlay tool. It should only load in development mode, gated by `import.meta.env.DEV`.

**Independence:** Independent design decision; mirrors the Agentation convention.

**Correctness:** `import.meta.env.DEV` is Vite's built-in flag. When `false`, the conditional JSX branch is tree-shaken in production builds.

---

### Atom 8: Dual mount point consistency

**Logical component:** Agentation renders in both `App.tsx` (main route) and `main.tsx` (picker route) via `DevToolbar`. Any Blueline integration through `DevToolbar` automatically inherits this dual-mount behavior.

**Independence:** Depends on Atom 3 (integration pattern) but the dual-mount consequence is a distinct observation.

**Correctness:** Verified — `DevToolbar` is rendered in both `App.tsx` line 74 and `main.tsx` line 24 with the same `import.meta.env.DEV` guard.

---

## Synthesized solutions

### Solution A: React wrapper component in DevToolbar (recommended)

Create a small React wrapper that mirrors the `<Agentation />` component pattern, then add it alongside Agentation in `DevToolbar.tsx`.

**New file: `src/_starter/components/Blueline.tsx`**

```tsx
import { useEffect } from "react";
import "../../blueline.min.js";

declare global {
  interface Window {
    blueline?: { init: (config?: object) => { destroy: () => void } };
  }
}

export function Blueline() {
  useEffect(() => {
    const instance = window.blueline?.init();
    return () => instance?.destroy();
  }, []);

  return null;
}
```

**Modified: `src/_starter/components/DevToolbar.tsx`**

```tsx
import { Agentation } from "agentation";
import { Blueline } from "./Blueline";

export function DevToolbar() {
  return (
    <>
      <Agentation />
      <Blueline />
    </>
  );
}
```

**Why this is recommended:**

- Mirrors the Agentation pattern exactly (component in DevToolbar, conditional on DEV)
- Proper React lifecycle management (init on mount, destroy on unmount)
- Automatically inherits dual-mount behavior in both App.tsx and main.tsx
- No changes needed to App.tsx or main.tsx
- Production tree-shaking works because the DEV guard already exists
- Clean separation of concerns — Blueline logic is encapsulated

---

### Solution B: Inline useEffect in DevToolbar (no new file)

Skip the separate component and put the effect directly in `DevToolbar.tsx`.

**Modified: `src/_starter/components/DevToolbar.tsx`**

```tsx
import { useEffect } from "react";
import { Agentation } from "agentation";
import "../../blueline.min.js";

export function DevToolbar() {
  useEffect(() => {
    const instance = (window as any).blueline?.init();
    return () => instance?.destroy();
  }, []);

  return <Agentation />;
}
```

**Trade-offs:**

- Fewer files, simpler diff
- Mixes concerns (Agentation rendering + Blueline side effect in one component)
- Less modular if either tool needs independent configuration later
- Uses `any` cast instead of proper type declaration

---

### Solution C: Side-effect import in App.tsx (diverges from pattern)

Import Blueline directly in `App.tsx` as a side-effect, relying on its auto-init behavior.

**Problem:** Auto-init is gated on `document.currentScript` which is `null` in bundled code. This approach **does not work** without modifying `blueline.min.js` to remove that guard. Rejected.

---

## Recommendation

**Solution A** is the clear winner. It:

1. Follows the Agentation pattern (component rendered in DevToolbar)
2. Properly manages React lifecycle (useEffect + cleanup)
3. Requires no changes to App.tsx or main.tsx
4. Provides type safety via the global declaration
5. Is independently testable and removable
