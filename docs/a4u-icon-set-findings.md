# A4U icon set compatibility with React Spectrum S2

Findings from inspecting each `@a4u` S2 icon package and testing compatibility with the `@react-spectrum/s2` icon system used in this project.

## Summary

The A4U icon packages deliver **raw SVG files**, not React components. Most 20px icons follow the same SVG conventions as the built-in RSP S2 icon set and are **additive** (they supplement rather than replace the base set). A build step is required to convert the SVGs into React components that work with S2.

A few icons per package use hardcoded colors or gradients and will **not** respond to the RSP S2 color system.

---

## Package format (consistent across all sets)

Every `@a4u/a4u-*-s2` package has the same structure:

```
package/
  assets/svg/          ← raw SVG files
  overview.html        ← browser-based preview page
  overview/            ← CSS/JS for the preview
  .a4urc               ← build options metadata
  package.json
  CHANGELOG.md
```

The `.a4urc` file in every inspected package confirms `"react": false` and `"webComponent": false`. There are no pre-built React or web components shipped. You get SVGs only.

---

## Relationship to the base RSP S2 icon set

These packages are **supersets**. Each one bundles a subset of the base Spectrum 2 icons alongside product-specific icons. For example, Firefly S2 contains 370 icons total: 161 overlap with the RSP S2 base set and 209 are Firefly-specific (AI generation icons, premium badges, Firefly-branded UI icons, etc.).

This means using an A4U set does not replace the base icons in `@react-spectrum/s2/icons/*`. The base icons remain available from the RSP S2 package regardless.

Overlapping icons may have minor path differences from the same-named icon in the base RSP S2 set since they come from separate design deliveries. Mixing the same icon name from both sources could cause visual inconsistencies. Pick one source per icon name and use it consistently.

---

## Color system compatibility

### Icons that work with RSP S2 colors

The majority of 20px icons in every A4U package use this fill pattern:

```xml
<svg width="20" height="20" viewBox="0 0 20 20">
  <path fill="var(--iconPrimary, #222)" ... />
</svg>
```

This matches the RSP S2 icon requirements exactly. When converted to React components and placed inside S2 components (Button, ActionButton, ToggleButton, etc.), these icons inherit the same `--iconPrimary` CSS custom property that controls built-in icon color. Dark mode, disabled states, static color variants, and the `iconStyle` macro all work correctly.

### Icons that do not follow the color system

A small number of icons per package use hardcoded fills. These will not respond to the RSP S2 color token and will look out of place in dark mode or when used in components that set icon color.

| Type | Example | Fill behavior |
| --- | --- | --- |
| Premium/gradient icons | `PremiumFeatureGradient`, `AIStudio_GradientFill` | Multi-color linear gradients with hardcoded hex stops |
| HUD icons | `FullScreenExitHUD`, `FullScreenHUD` | Hardcoded `#000` with opacity and `#fff` fills |
| Premium badges | `PremiumBadgeCheckmark` | Mix of `#fff` and `var(--iconPrimary)` |

These icons should be treated as fixed-color assets, not as standard S2 icons. If you need them to respond to theme changes, the SVG source must be manually edited to replace hardcoded values with CSS custom properties.

---

## Per-package breakdown

### Adobe Concept S2

| | |
| --- | --- |
| Package | `@a4u/a4u-adobe-concept-s2` |
| Latest version | 4.0.0 |
| Total icons | 203 |
| Sizes | 20px only |
| Notes | General-purpose product concept icons. Good overlap with base set plus additions like `SolidColor` and concept-specific variants. |

### Adobe Connect S2

| | |
| --- | --- |
| Package | `@a4u/a4u-adobe-connect-s2` |
| Notes | Conferencing and collaboration icons for Adobe Connect. |

### Adobe.com S2

| | |
| --- | --- |
| Package | Published via A4U gateway (see link in icon-set-list.md) |
| Notes | Icons for Adobe.com web properties. |

### Ai Web S2

| | |
| --- | --- |
| Package | `@a4u/a4u-ai-web-s2` |
| Notes | AI-specific web interface icons. Likely contains AI generation, prompt, and model icons. |

### CC Express S2

| | |
| --- | --- |
| Package | `@a4u/a4u-cc-express-s2` |
| Latest version | 23.1.1 |
| Total icons | Large set (102 published versions, actively maintained) |
| Notes | Creative Cloud Express icons. Highest version count among these sets, indicating active development. |

### Firefly S2

| | |
| --- | --- |
| Package | `@a4u/a4u-firefly-s2` |
| Latest version | 11.17.0 |
| Total icons | 370 |
| Sizes | 14px, 16px, 20px, 22px |
| Extra assets | 3 cursor SVGs (`S2_Cur_*`) |
| Color exceptions | `PremiumFeatureGradient`, `PremiumBadgeCheckmark`, `FullScreenExitHUD` use hardcoded colors |
| Notes | Largest inspected set. Includes extensive AI generation icons (`AIGen*`, `AISparkles*`, `AIVariation*`), premium feature badges, and multiple size variants. The non-20px icons and cursors cannot be used through the standard S2 icon pipeline without modification. |

### Fr S2

| | |
| --- | --- |
| Package | `@a4u/a4u-fr-s2` |
| Notes | Frame.io / review tool icons. |

### Lr Mobile S2 and Lr Web S2

| | |
| --- | --- |
| Package | `@a4u/a4u-lr-mobile-s2`, `@a4u/a4u-lr-web-s2` |
| Notes | Lightroom mobile and web icons. May include photo editing-specific icons (crop, exposure, preset, etc.) not in the base set. |

### Md Desktop Workflow Icons S2

| | |
| --- | --- |
| Package | `@a4u/a4u-md-desktop-workflow-icons-s2` |
| Notes | Media Desktop workflow icons. |

### Milo Workflow Icons S2

| | |
| --- | --- |
| Package | `@a4u/a4u-milo-workflow-icons-s2` |
| Latest version | 1.6.2 |
| Total icons | 58 |
| Sizes | 20px only |
| Notes | Smallest inspected set. Contains only common workflow icons (Add, Bell, Calendar, Copy, Delete, etc.). Nearly all overlap with the base RSP S2 set. Useful if you need a curated, minimal icon subset for a Milo-based project. |

### Ps Mobile S2

| | |
| --- | --- |
| Package | `@a4u/a4u-ps-mobile-s2` |
| Notes | Photoshop mobile icons. Likely includes brush, layer, selection, and tool icons. |

### S2 Acrobat DC

| | |
| --- | --- |
| Package | `@a4u/a4u-s2-acrobat-dc` |
| Notes | Acrobat / PDF-specific icons (document, form field, signature, redaction, etc.). |

### Squirrel/Pr Mobile

| | |
| --- | --- |
| Package | `@a4u/a4u-squirrel` |
| Notes | Premiere Rush mobile icons. |

### Stock E-com Icons S2

| | |
| --- | --- |
| Package | `@a4u/a4u-stock-e-com-icons-s2` |
| Latest version | 1.2.0 |
| Total icons | 65 |
| Sizes | 20px only |
| Color exceptions | `AIStudio_GradientFill`, `AIStudio_GradientSparkles` use multi-color linear gradients |
| Notes | Adobe Stock and e-commerce icons. Contains Stock-specific icons (licensing, marketplace) plus gradient AI branding icons that do not follow the `var(--iconPrimary)` convention. |

### Workfront S2

| | |
| --- | --- |
| Package | `@a4u/a4u-workfront-s2` |
| Latest version | 10.3.0 |
| Total icons | 187 |
| Sizes | 20px, 44px |
| Extra assets | 1 app icon (`B_app_Workfront.svg`) |
| Notes | Includes project management icons (Kanban, Agile, Timesheets, Utilization, etc.) not in the base set. The 44px "Hero" icons use colored backgrounds and hardcoded fills (not `var(--iconPrimary)`); they function as illustrations, not standard icons, and are not compatible with the S2 icon pipeline. |

---

## Integration guide

### Step 1: Install the package

```bash
pnpm add @a4u/a4u-firefly-s2
```

### Step 2: Convert SVGs to React components

Use the `@react-spectrum/s2-icon-builder` CLI tool to batch-convert the 20px SVGs:

```bash
npx @react-spectrum/s2-icon-builder \
  -i 'node_modules/@a4u/a4u-firefly-s2/assets/svg/S2_Icon_*_20_N.svg' \
  -o 'src/icons/firefly'
```

This reads each SVG, validates the format, and outputs a `.tsx` file per icon. The generated components work identically to built-in RSP S2 icons.

To build as a distributable library (ES modules + CommonJS + type declarations):

```bash
npx @react-spectrum/s2-icon-builder \
  -i 'node_modules/@a4u/a4u-firefly-s2/assets/svg/S2_Icon_*_20_N.svg' \
  -o 'src/icons/firefly' \
  --isLibrary
```

### Step 3: Use in components

The generated icons are used the same way as built-in S2 icons:

```tsx
import AIGenerate from "../icons/firefly/S2_Icon_AIGenerate_20_N";

<ActionButton>
  <AIGenerate />
  <Text>Generate</Text>
</ActionButton>
```

They support the `iconStyle` macro for custom sizing and coloring:

```tsx
import {iconStyle} from '@react-spectrum/s2/style' with {type: 'macro'};
import AIGenerate from "../icons/firefly/S2_Icon_AIGenerate_20_N";

<AIGenerate styles={iconStyle({size: 'XL', color: 'accent'})} />
```

### Alternative: convert individual icons with createIcon

For one-off icons where a full build step is unnecessary, use `createIcon` from `@react-spectrum/s2`:

```tsx
import {createIcon} from "@react-spectrum/s2";

const AIGenerate = createIcon((props) => (
  <svg viewBox="0 0 20 20" fill="var(--iconPrimary)" {...props}>
    {/* paste <path> elements from the SVG file */}
  </svg>
));
```

This approach is already used in this project for `PanelIcon` in `BrowsingContextPreview.tsx`.

---

## Key considerations

### Only 20px icons are compatible without modification

The RSP S2 icon system expects a 20x20 viewBox. Non-20px icons (14px, 16px, 22px, 44px Hero icons) and cursor SVGs cannot be dropped into the `s2-icon-builder` pipeline directly. To use them:

- Resize the viewBox to 20x20 (which may alter visual proportions)
- Use them as standalone SVG images outside the S2 icon system
- For 44px Hero icons, render them with the S2 `Image` component instead

### Overlapping icon names

If you use both the base RSP S2 icons and a converted A4U set, you may end up with two versions of the same icon (e.g., `Add` from `@react-spectrum/s2/icons/Add` and `S2_Icon_Add_20_N` from the Firefly set). **Always use the RSP S2 icon when the same icon exists in both sources.** The base set is the canonical source maintained by the React Spectrum team, and its icons are guaranteed to stay consistent with S2 component behavior across releases. Pull from A4U sets only for product-specific icons that do not exist in the base.

### Gradient and multi-color icons break the color contract

Icons with hardcoded gradients or hex fills ignore `--iconPrimary`. Inside a Button set to `staticColor="white"`, for example, the icon will still render its original gradient. This can create accessibility and contrast issues, particularly in dark mode. Either avoid these icons in S2 components, or manually edit them to use `var(--iconPrimary)`.

### No runtime dependency

The A4U packages have zero npm dependencies. After the build step converts SVGs to TSX, you can remove the `@a4u` package from `dependencies` and commit the generated icon components directly. This avoids runtime dependency on the A4U registry.

### Registry access

All `@a4u` packages are published to Adobe's internal Artifactory (`artifactory.corp.adobe.com`). The project's `.npmrc` must point to this registry for the `@a4u` scope. If your build pipeline or CI system does not have Artifactory access, commit the generated icon components instead of resolving the package at install time.

### Renaming generated files

The `s2-icon-builder` preserves the input filename as the output module name. The A4U naming convention (`S2_Icon_AIGenerate_20_N`) is verbose. You can rename the output files to shorter names (e.g., `AIGenerate.tsx`) after generation without affecting functionality.

---

## Decision matrix

| Question | Answer |
| --- | --- |
| Do A4U sets replace the RSP S2 icon set? | No. They are additive. The base set remains available from `@react-spectrum/s2/icons/*`. |
| Do A4U icons inherit S2 component colors? | Yes, for the majority of 20px icons that use `var(--iconPrimary, #222)`. A few gradient/multi-color icons do not. |
| Can I use multiple A4U sets at once? | Yes, but RSP S2 icons take precedence when the same icon exists in both the base set and an A4U set. |
| Do I need a build step? | Yes. The packages ship raw SVGs. Use `s2-icon-builder` or `createIcon` to convert them. |
| Are non-20px icons usable? | Not directly with the S2 icon pipeline. They need manual handling. |
| Can I use these in production? | Yes, after converting. Remove the A4U package and commit the generated components to avoid a registry dependency at deploy time. |
