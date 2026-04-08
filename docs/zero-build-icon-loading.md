# Zero-build icon loading

This document explains the mechanism that allows new icons from updated A4U packages to become usable in this project automatically, without any build step, code generation, or manual file creation.

## What was built

Three pieces work together to eliminate the old multi-step icon workflow:

1. **`src/utils/createIconsFromGlob.tsx`** -- a utility that converts raw SVG strings into React Spectrum S2 icon components at runtime.
2. **`src/icons/*.ts`** -- 15 pre-configured modules (one per A4U icon set) that use Vite's `import.meta.glob` to read SVGs from `node_modules`.
3. **`.npmrc`** -- a registry line for the `@a4u` scope so pnpm can resolve A4U packages from Adobe's internal Artifactory.

Together, these mean a user only needs to run `pnpm add @a4u/a4u-firefly-s2` and then import from an existing module. When that package is later updated with new icons, `pnpm update` is the only command needed. No CLI tool, no generated files, no commit step.

## How new icons become available automatically

The mechanism has four stages. All four happen without any user intervention beyond installing or updating the npm package.

### Stage 1: Vite resolves the glob at build time

Each icon set module contains a call to `import.meta.glob`:

```ts
const svgs = import.meta.glob(
  "/node_modules/@a4u/a4u-firefly-s2/assets/svg/S2_Icon_*_20_N.svg",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;
```

`import.meta.glob` is a Vite-specific API that runs at build time (or when the dev server starts). It scans the filesystem for files matching the glob pattern and inlines their contents into the bundle. The key behaviors:

- **The glob pattern is a string literal.** Vite evaluates it statically during the build. It does not run at runtime in the browser.
- **`/node_modules/...` paths resolve relative to the project root.** Vite treats `/` as the project root, so `/node_modules/@a4u/a4u-firefly-s2/...` points to the installed package.
- **`query: "?raw"`** tells Vite to read each matching file as a raw string instead of treating it as a JavaScript module. The result is the full SVG markup as a string.
- **`import: "default"`** extracts the default export from the raw module (the string content itself).
- **`eager: true`** means all matching files are resolved synchronously and included in the bundle. No dynamic `import()` calls are generated.

The result is a `Record<string, string>` where keys are file paths (like `/node_modules/@a4u/a4u-firefly-s2/assets/svg/S2_Icon_AIGenerate_20_N.svg`) and values are the raw SVG content of each file.

When a new icon is added to the package and the user runs `pnpm update`, the new SVG file appears in `node_modules`. The next time Vite builds (or the dev server restarts), the glob picks it up automatically because the pattern `S2_Icon_*_20_N.svg` matches any file following the A4U naming convention. No one needs to update the glob pattern or add an import for the new icon.

When an icon is removed from the package, the opposite happens: the file disappears from `node_modules`, the glob no longer matches it, and the icon is no longer included in the bundle.

### Stage 2: SVG strings are parsed into structural parts

The `createIconsFromGlob` utility iterates over each entry in the glob result and parses the raw SVG string:

```ts
function parseSvg(raw: string): { viewBox: string; inner: string } {
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 20 20";
  const inner = raw
    .replace(/<\?xml[^?]*\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
  return { viewBox, inner };
}
```

This extracts two things from the SVG:

- **`viewBox`** -- the coordinate system of the icon (typically `"0 0 20 20"` for S2-compatible icons).
- **`inner`** -- everything between the opening `<svg>` and closing `</svg>` tags. This is the actual visual content: `<path>`, `<rect>`, `<circle>`, and other SVG elements that draw the icon.

The A4U icon SVGs use `fill="var(--iconPrimary, #222)"` on their path elements. This CSS custom property is the same one that React Spectrum S2 uses for icon coloring, which means the parsed icons automatically respond to dark mode, disabled states, and the `iconStyle` macro without any modification.

### Stage 3: Each SVG is wrapped in a createIcon component

For each parsed SVG, the utility creates a React component using `createIcon` from `@react-spectrum/s2`:

```tsx
icons[name] = createIcon((props: any) => (
  <svg
    viewBox={viewBox}
    {...props}
    dangerouslySetInnerHTML={{ __html: inner }}
  />
));
```

`createIcon` is the same API used by the built-in S2 icons. It wraps the render function in a component that:

- Accepts S2 styling props (`className`, `styles`, etc.)
- Integrates with S2 component icon slots (Button, ActionButton, ToggleButton, etc.)
- Supports the `iconStyle` macro for sizing and coloring

The `dangerouslySetInnerHTML` approach is used instead of JSX children because the inner SVG content is a string (from the raw file read), not a React element tree. This is safe because the content comes from versioned `@a4u` packages in `node_modules`, not from user input or external sources.

The icon name is derived from the filename by extracting the part between `S2_Icon_` and `_20_N.svg`. For example, `S2_Icon_AIGenerate_20_N.svg` becomes `AIGenerate`. This happens in the `iconNameFromPath` function:

```ts
function iconNameFromPath(path: string): string {
  const match = path.match(/S2_Icon_(.+?)_20_N\.svg$/);
  if (match) return match[1];
  const filename = path.split("/").pop() ?? "";
  return filename.replace(/\.svg$/, "");
}
```

### Stage 4: The icon map is exported as a named export

The result of `createIconsFromGlob` is a `Record<string, IconComponent>` -- a plain object where each key is an icon name and each value is a React component. This is exported from the icon set module:

```ts
export const fireflyIcons = createIconsFromGlob(svgs);
```

Consumer code accesses individual icons as properties:

```tsx
import { fireflyIcons } from "../icons/firefly";

<ActionButton>
  <fireflyIcons.AIGenerate />
  <Text>Generate</Text>
</ActionButton>
```

When the package is updated and a new icon like `S2_Icon_AISparkles_20_N.svg` is added, it appears as `fireflyIcons.AISparkles` without any changes to the module file, the utility, or the consuming component's imports. The glob matched the new file, the utility parsed it, and it showed up as a new key in the exported object.

## Why this works without a build step

The traditional approach required running `npx @react-spectrum/s2-icon-builder` to convert SVGs into `.tsx` files, then committing those generated files. This was necessary because the S2 icon system expects React components, and raw SVGs are not React components.

The new approach skips the code generation by doing the conversion at module evaluation time instead:

| Step | Old approach | New approach |
| --- | --- | --- |
| Read SVGs from package | `s2-icon-builder` CLI reads files from disk | `import.meta.glob` reads files at Vite build time |
| Parse SVG structure | CLI parses XML and extracts paths | `parseSvg` regex extracts viewBox and inner content |
| Create React components | CLI writes `.tsx` files to `src/icons/` | `createIcon` wraps each SVG at module evaluation time |
| Output | Generated files on disk that must be committed | In-memory components, nothing written to disk |
| Picking up new icons | Re-run the CLI, re-commit | `pnpm update`, restart dev server |

The trade-off is that all icons in a set are included in the bundle when the module is imported, because `eager: true` inlines every matching file. For a prototyping template where developer experience matters more than bundle size, this is the right trade-off. A Firefly icon set with 370 SVGs adds roughly 50-100 KB of SVG string data to the bundle, which compresses well with gzip.

## What happens in each scenario

### The package is not installed

The glob matches nothing. `import.meta.glob` returns `{}`. `createIconsFromGlob({})` returns `{}`. The exported icon map is an empty object. No errors, no warnings. Code that tries to render `fireflyIcons.SomeName` gets `undefined`, which React renders as nothing.

### The package is installed for the first time

After `pnpm add @a4u/a4u-firefly-s2`, the SVG files appear in `node_modules`. The next dev server start or build picks them up via the glob. The exported icon map is populated with all matching icons.

### The package is updated with new icons

After `pnpm update @a4u/a4u-firefly-s2`, the updated SVG files are in `node_modules`. The glob matches the new files on the next build. New icons appear as new keys in the exported map. Removed icons disappear. Changed icons reflect their updated SVG content. No other action is needed.

### The package is removed

After `pnpm remove @a4u/a4u-firefly-s2`, the directory disappears from `node_modules`. The glob matches nothing again. The exported map returns to `{}`.

## Files involved

| File | Role |
| --- | --- |
| `src/utils/createIconsFromGlob.tsx` | Parses raw SVG strings and wraps each in `createIcon` |
| `src/icons/firefly.ts` (and 14 others) | Glob-imports SVGs from a specific A4U package and exports the icon map |
| `.npmrc` | Configures the `@a4u` scope to resolve from Adobe's Artifactory |
| `src/_starter/components/LayoutDetailDialog.tsx` | The "Copy prompt" button appends icon set instructions that reference the new glob-based workflow |
