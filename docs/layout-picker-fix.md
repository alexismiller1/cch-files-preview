# Layout Picker Fix Documentation

## Problem Statement

The layout picker functionality described in `README.md` (lines 27-36) was not working correctly after a layout had been applied to `src/App.tsx`. Specifically:

1. The `?picker` URL parameter did not show the layout picker interface
2. After layouts are applied to `App.tsx`, the picker functionality was completely lost

**Note:** The layout picker is now only accessible via the URL parameter method (`?picker`). The dev toolbar button has been removed.

## Root Causes

### Issue 1: Incorrect Component Rendering

In `src/App.tsx`, when the `?picker` parameter was present, the code was rendering `BrowsingContext` instead of the `LayoutPicker` component:

```typescript
// ❌ BEFORE - Incorrect implementation
if (params.has("picker")) {
  return (
    <Provider colorScheme={colorScheme}>
      <IMSProvider>
        <BrowsingContext onToggleTheme={toggleColorScheme} />  // Wrong component!
      </IMSProvider>
      {import.meta.env.DEV && <DevToolbar />}
    </Provider>
  );
}
```

The `BrowsingContext` component is the main application layout, not the layout picker. The correct component should be `StarterPage` (which contains `LayoutPicker`).

### Issue 2: Picker Logic Lost After Layout Application

When users apply a layout via AI chat, the entire `App.tsx` file gets replaced with the new layout code. This means:

- The `?picker` check logic in `App.tsx` is removed
- The picker functionality is completely lost
- Users cannot return to the picker after applying a layout

The solution needed to move the picker check to a file that won't be modified when layouts are applied.

## Solution

### Strategy

Move the `?picker` parameter check from `App.tsx` to `main.tsx` (the application entry point). Since `main.tsx` is not modified when layouts are applied, the picker functionality will persist.

### Code Changes

#### 1. Updated `src/main.tsx`

**Before:**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**After:**

```typescript
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from '@react-spectrum/s2'
import './index.css'
import './utils/IMS'
import { IMSProvider } from './contexts/IMSProvider'
import App from './App.tsx'
import StarterPage from './_starter/StarterPage.tsx'
import { DevToolbar } from './_starter/components/DevToolbar'

// Check for picker parameter before rendering App
// This ensures the picker works even after layouts are applied to App.tsx
const params = new URLSearchParams(window.location.search);
const shouldShowPicker = params.has("picker");

function PickerApp() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <Provider colorScheme={colorScheme}>
      <IMSProvider>
        <StarterPage onToggleTheme={toggleColorScheme} />
      </IMSProvider>
      {import.meta.env.DEV && <DevToolbar />}
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {shouldShowPicker ? <PickerApp /> : <App />}
  </StrictMode>,
)
```

**Key Changes:**

- Added imports for `StarterPage`, `Provider`, `IMSProvider`, and `DevToolbar`
- Added URL parameter check at the top level: `const shouldShowPicker = params.has("picker")`
- Created `PickerApp` component that wraps `StarterPage` with necessary providers
- Conditional rendering: `{shouldShowPicker ? <PickerApp /> : <App />}`

#### 2. Updated `src/App.tsx`

**Before:**

```typescript
function App() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  const params = new URLSearchParams(window.location.search);
  const previewId = params.get("preview");

  if (previewId) {
    const theme = params.get("theme") === "light" ? "light" : "dark";
    return <PreviewPage layoutId={previewId} initialTheme={theme} />;
  }

  if (params.has("picker")) {
    return (
      <Provider colorScheme={colorScheme}>
        <IMSProvider>
          <BrowsingContext onToggleTheme={toggleColorScheme} />
        </IMSProvider>
        {import.meta.env.DEV && <DevToolbar />}
      </Provider>
    );
  }

  return (
    <Provider colorScheme={colorScheme}>
      <IMSProvider>
        <BrowsingContext onToggleTheme={toggleColorScheme} />
      </IMSProvider>
      {import.meta.env.DEV && <DevToolbar />}
    </Provider>
  );
}
```

**After:**

```typescript
function App() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  const params = new URLSearchParams(window.location.search);
  const previewId = params.get("preview");

  if (previewId) {
    const theme = params.get("theme") === "light" ? "light" : "dark";
    return <PreviewPage layoutId={previewId} initialTheme={theme} />;
  }

  // Note: ?picker is handled in main.tsx, so App.tsx won't be rendered when picker is present
  return (
    <Provider colorScheme={colorScheme}>
      <IMSProvider>
        <BrowsingContext onToggleTheme={toggleColorScheme} />
      </IMSProvider>
      {import.meta.env.DEV && <DevToolbar />}
    </Provider>
  );
}
```

**Key Changes:**

- Removed the incorrect `?picker` check that was rendering `BrowsingContext`
- Added a comment explaining that `?picker` is handled in `main.tsx`
- Simplified the component to only handle preview and default rendering

#### 3. Updated `src/_starter/components/DevToolbar.tsx`

**Before:**

```typescript
import { ActionButton, TooltipTrigger, Tooltip } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { Agentation } from "agentation";
import ViewGrid from "@react-spectrum/s2/icons/ViewGrid";

function navigateToPicker() {
  const url = new URL(window.location.href);
  url.search = "?picker";
  window.location.href = url.toString();
}

export function DevToolbar() {
  return (
    <>
      <div
        className={style({
          position: "fixed",
          zIndex: 1000,
        })}
        style={{ bottom: 88, right: 28 }}
      >
        <TooltipTrigger>
          <ActionButton
            aria-label="Open layout picker"
            onPress={navigateToPicker}
            size="M"
          >
            <ViewGrid />
          </ActionButton>
          <Tooltip>Layout picker</Tooltip>
        </TooltipTrigger>
      </div>
      <Agentation />
    </>
  );
}
```

**After:**

```typescript
import { Agentation } from "agentation";

export function DevToolbar() {
  return <Agentation />;
}
```

**Key Changes:**

- Removed the layout picker button and all related UI code
- Removed unused imports (`ActionButton`, `TooltipTrigger`, `Tooltip`, `style`, `ViewGrid`)
- Removed `navigateToPicker` function
- Simplified component to only render `Agentation` widget
- Layout picker is now only accessible via URL parameter `?picker`

## How It Works Now

### Flow Diagram

```
User navigates to app
         ↓
    main.tsx checks URL
         ↓
    ┌─────────┴─────────┐
    │                   │
?picker present?      No
    │                   │
   Yes                  ↓
    │              Render <App />
    │                   │
    ↓                   ↓
Render <PickerApp>   Normal app
    │              (layout or default)
    ↓
StarterPage
    │
    ↓
LayoutPicker
```

### URL Parameter Method (Only Method)

The layout picker is accessed exclusively via the URL parameter:

1. User adds `?picker` to the URL (e.g., `https://localhost:8080/?picker`)
2. `main.tsx` checks for the parameter before rendering
3. If present, `PickerApp` is rendered instead of `App`
4. `PickerApp` wraps `StarterPage` with necessary providers
5. `StarterPage` renders `LayoutPicker` component
6. User can browse and select layouts

**Note:** The dev toolbar button for accessing the picker has been removed. Users must manually add `?picker` to the URL to access the layout picker.

### Persistence After Layout Application

The key advantage of this solution is that the picker check happens in `main.tsx`, which is the application entry point and is **not modified** when layouts are applied to `App.tsx`. This means:

- ✅ Picker functionality persists after layouts are applied
- ✅ Users can always return to the picker via `?picker` URL parameter
- ✅ No need to preserve picker logic in `App.tsx` when applying layouts
- ✅ Simple, URL-based access method that works consistently

## Component Hierarchy

### When `?picker` is present:

```
main.tsx
  └─ PickerApp
      └─ Provider (colorScheme)
          └─ IMSProvider
              └─ StarterPage
                  ├─ LayoutPicker
                  │   ├─ LayoutCard (for each layout)
                  │   └─ LayoutDetailDialog (when layout selected)
                  └─ ToastContainer
          └─ DevToolbar (dev mode only)
```

### When `?picker` is NOT present:

```
main.tsx
  └─ App
      └─ Provider (colorScheme)
          └─ IMSProvider
              └─ BrowsingContext (or user's applied layout)
          └─ DevToolbar (dev mode only)
```

## Testing

### Verification Steps

1. **Test URL parameter method:**

   ```bash
   # Start dev server
   pnpm dev

   # Navigate to http://localhost:8080/?picker
   # Should show layout picker interface
   ```

2. **Test persistence after layout application:**
   ```bash
   # Apply a layout to App.tsx via AI chat
   # Navigate to http://localhost:8080/?picker
   # Should still show layout picker (this was broken before)
   ```

### Build Verification

```bash
# Lint check
npm run lint
# ✓ Should pass with no errors

# Build check
npm run build
# ✓ Should compile successfully
```

## Benefits

1. **Persistent Functionality**: Picker works regardless of `App.tsx` content
2. **Clean Separation**: Picker logic is isolated in the entry point
3. **Backward Compatible**: Existing functionality (preview, default app) still works
4. **Simple Access**: URL-based method is straightforward and always available
5. **User Experience**: Users can always return to browse more layouts via URL parameter
6. **Cleaner UI**: Removed toolbar button reduces visual clutter in dev mode

## Related Files

- `src/main.tsx` - Entry point with picker check
- `src/App.tsx` - Main app component (can be replaced by layouts)
- `src/_starter/StarterPage.tsx` - Wrapper for LayoutPicker
- `src/_starter/components/LayoutPicker.tsx` - Layout picker UI
- `src/_starter/components/DevToolbar.tsx` - Dev toolbar (only contains Agentation widget)
- `README.md` - User documentation (lines 27-36)

## Future Considerations

- Consider adding a route-based solution if the app grows to use a router
- Could add keyboard shortcut (e.g., `Cmd/Ctrl + P`) to open picker
- Might want to preserve other URL parameters when navigating to picker
- The dev toolbar button was removed to simplify the UI; it can be re-added if needed
