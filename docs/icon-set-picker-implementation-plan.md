# Icon set picker implementation plan

## Goal

Implement the recommended direction from `docs/icon-set-picker-design.md`:

- Add a single-select icon set picker to `LayoutDetailDialog`.
- Keep `Default` as the zero-change path that copies `layout.prompt` unchanged.
- Append icon-set integration guidance when a non-default icon set is selected.
- Preserve the selected icon set while the starter page remains mounted, including across dialog close and reopen and previous and next layout navigation.

## What the review confirmed

- `LayoutPicker` is the correct state owner because `LayoutDetailDialog` is mounted conditionally inside `DialogContainer` and unmounts on dismiss.
- `Picker` is the correct Spectrum 2 control for this interaction because the user is choosing one option from a compact list.
- `ButtonGroup` must remain button-only. The picker cannot be inserted as a `ButtonGroup` child.
- The prompt preview and clipboard copy action must share one assembled prompt string so they never drift.
- The base prompts in `src/_starter/layouts/registry.ts` should remain the source of truth for the default case.

## Important correction to the design doc

The recommended solution is still the right direction, but one layout detail needs to change during implementation:

- `FullscreenDialog` does not expose a generic footer slot.
- A plain wrapper after `Content` will not be positioned correctly unless that wrapper is a direct child of `FullscreenDialog` and explicitly places itself in the dialog's button area with `gridArea: "buttons"`.
- Keep the wrapper as a direct child after `Content`, and place both the `Picker` and the existing `ButtonGroup` inside that wrapper.

This keeps the current dialog component, preserves the requested placement, and avoids a larger migration to `CustomDialog`.

## Files in scope

| File | Change |
| --- | --- |
| `src/_starter/components/LayoutPicker.tsx` | Own the selected icon set in state and pass it into the dialog |
| `src/_starter/components/LayoutDetailDialog.tsx` | Render the picker, build the final prompt, and update preview and copy behavior |

Optional follow-up, not required for the first pass:

| File | Change |
| --- | --- |
| `src/_starter/constants/iconSets.ts` | Extract the icon-set catalog later if another screen needs it |

## Implementation steps

### 1. Lift state into `LayoutPicker.tsx`

Add a new piece of state next to `selectedLayout`:

```tsx
const [iconSetId, setIconSetId] = useState("default");
```

Then pass both values into `LayoutDetailDialog`:

```tsx
<LayoutDetailDialog
  layout={selectedLayout}
  iconSetId={iconSetId}
  onIconSetChange={setIconSetId}
  ...
/>
```

Implementation notes:

- Keep this state in `LayoutPicker` only.
- Do not reset it when the dialog closes.
- Do not add localStorage, URL params, or registry fields for the first implementation.

### 2. Add the icon-set catalog in `LayoutDetailDialog.tsx`

Create a module-level constant in `LayoutDetailDialog.tsx` for the first pass. Keep the catalog explicit rather than deriving values from labels.

Recommended shape:

```ts
type IconSetSourceType = "default" | "package" | "gateway";

interface IconSetOption {
  id: string;
  name: string;
  sourceType: IconSetSourceType;
  packageName: string | null;
  outputDir: string | null;
  sourceUrl?: string;
}
```

Why this shape:

- `id` is the controlled picker value.
- `name` is the visible picker label.
- `sourceType` prevents incorrect assumptions that every option has a `pnpm add` command.
- `packageName` supports the prompt addendum for standard A4U packages.
- `outputDir` gives the prompt builder a deterministic target path for generated icons.
- `sourceUrl` handles the Adobe.com gateway case without inventing a package name.

### 3. Extend `LayoutDetailDialog` props and build one final prompt

Extend `LayoutDetailDialogProps`:

```ts
interface LayoutDetailDialogProps {
  layout: Layout;
  iconSetId: string;
  onIconSetChange: (value: string) => void;
  onPreviousLayout?: () => void;
  onNextLayout?: () => void;
}
```

Then add three small helpers at module scope:

```ts
function getIconSetById(iconSetId: string): IconSetOption
function buildIconSetAddendum(iconSet: IconSetOption): string
function buildPrompt(layoutPrompt: string, iconSet: IconSetOption): string
```

Recommended behavior:

- `getIconSetById` falls back to `default` if the id is unknown.
- `buildPrompt` returns `layoutPrompt` unchanged for `default`.
- `buildPrompt` should use `layoutPrompt.trimEnd()` before appending the addendum so the output is stable.
- `buildIconSetAddendum` should be pure and should not read from component state directly.

Use the assembled prompt in both places:

- The `<pre>` preview on the right side of the dialog.
- The `copyPrompt()` call for the accent button.

Do not keep separate strings for preview and clipboard output.

### 4. Replace the direct footer `ButtonGroup` with a direct-child wrapper

Keep the wrapper as a direct child of `FullscreenDialog`, immediately after `Content`.

Recommended structure:

```tsx
<div className={footerControls}>
  <Picker
    label="Icon set"
    labelPosition="side"
    size="S"
    value={iconSetId}
    onChange={onIconSetChange}
    styles={pickerStyles}
  >
    {ICON_SET_OPTIONS.map((iconSet) => (
      <PickerItem key={iconSet.id} id={iconSet.id} textValue={iconSet.name}>
        {iconSet.name}
      </PickerItem>
    ))}
  </Picker>

  <ButtonGroup>
    {/* existing buttons */}
  </ButtonGroup>
</div>
```

Required wrapper behavior:

- The wrapper must be a direct child of `FullscreenDialog`.
- The wrapper must include `gridArea: "buttons"`.
- The wrapper should use `display: "flex"`.
- The wrapper should use `flexWrap: "wrap"` so the layout does not break at narrower widths.
- The wrapper should use `columnGap: 16` and `rowGap: 12`.
- The wrapper should use `alignItems: "center"`.
- The wrapper should use `maxWidth: "full"`.

Recommended picker behavior:

- Use `label="Icon set"` for a visible, accessible label.
- Use `labelPosition="side"` to keep the control compact in the dialog controls area.
- Use `size="S"`.
- Constrain width so long labels do not expand the top row unexpectedly. A good starting point is `width: { default: "full", sm: 240 }`.

Implementation notes:

- Keep the existing `ButtonGroup` intact so button overflow behavior stays handled by Spectrum.
- Keep the button order unchanged.
- Update the copy action to `copyPrompt(finalPrompt, layout.name)`.

### 5. Build the prompt addendum from the findings doc

The appended text should be short, deterministic, and directly actionable.

Recommended addendum structure:

```md
## Additional icon instructions

Use the {icon set name} icon set only for product-specific icons that do not exist in the base React Spectrum S2 icon set.

Install or retrieve the source:
- package-backed sets: `pnpm add {packageName}`
- gateway-backed sets: retrieve the package from `{sourceUrl}` and make its 20px SVGs available locally

Convert only 20px SVGs into React components:
- package-backed sets: `npx @react-spectrum/s2-icon-builder -i 'node_modules/{packageName}/assets/svg/S2_Icon_*_20_N.svg' -o 'src/icons/{outputDir}'`
- gateway-backed sets: run the same builder flow against the local directory that contains the extracted 20px SVGs

Import generated icons from `src/icons/{outputDir}`.

Keep using `@react-spectrum/s2/icons/*` when the same icon exists in both sources.

Avoid gradient or fixed-color icons unless you intentionally want fixed colors, because they do not follow the standard S2 color contract.
```

Required constraints from `docs/a4u-icon-set-findings.md`:

- Only 20px icons should be sent through the standard S2 icon pipeline.
- Base React Spectrum S2 icons take precedence over overlapping A4U icons.
- Gradient, multi-color, or other fixed-color icons do not reliably inherit the S2 color system.

Recommended additional note:

- For standard A4U packages, generated components should be committed into the app if you want to avoid a deploy-time dependency on internal registries.

### 6. Handle the Adobe.com option as a first-class special case

The design doc correctly called out that Adobe.com S2 is not a normal package-backed option.

Implementation rule:

- Do not invent an npm package name for Adobe.com S2.
- Store it as `sourceType: "gateway"` with its gateway URL.
- Use gateway-specific language in the copied prompt instead of a fake `pnpm add` command.

This avoids generating instructions that cannot be followed.

## Recommended catalog

Keep the picker order aligned with `docs/icon-set-list.md`, with `Default` first.

| id | Label | sourceType | package or source | outputDir |
| --- | --- | --- | --- | --- |
| `default` | Default | `default` | none | none |
| `adobe-concept` | Adobe Concept S2 | `package` | `@a4u/a4u-adobe-concept-s2` | `adobe-concept` |
| `adobe-connect` | Adobe Connect S2 | `package` | `@a4u/a4u-adobe-connect-s2` | `adobe-connect` |
| `adobe-com` | Adobe.com S2 | `gateway` | `https://a4u-gateway.corp.adobe.com/packages/661812de248c150261377f31/overview` | `adobe-com` |
| `ai-web` | Ai Web S2 | `package` | `@a4u/a4u-ai-web-s2` | `ai-web` |
| `cc-express` | CC Express S2 | `package` | `@a4u/a4u-cc-express-s2` | `cc-express` |
| `firefly` | Firefly S2 | `package` | `@a4u/a4u-firefly-s2` | `firefly` |
| `fr` | Fr S2 | `package` | `@a4u/a4u-fr-s2` | `fr` |
| `lr-mobile` | Lr Mobile S2 | `package` | `@a4u/a4u-lr-mobile-s2` | `lr-mobile` |
| `lr-web` | Lr Web S2 | `package` | `@a4u/a4u-lr-web-s2` | `lr-web` |
| `md-desktop-workflow-icons` | Md Desktop Workflow Icons S2 | `package` | `@a4u/a4u-md-desktop-workflow-icons-s2` | `md-desktop-workflow-icons` |
| `milo-workflow-icons` | Milo Workflow Icons S2 | `package` | `@a4u/a4u-milo-workflow-icons-s2` | `milo-workflow-icons` |
| `ps-mobile` | Ps Mobile S2 | `package` | `@a4u/a4u-ps-mobile-s2` | `ps-mobile` |
| `s2-acrobat-dc` | S2 Acrobat DC | `package` | `@a4u/a4u-s2-acrobat-dc` | `s2-acrobat-dc` |
| `squirrel` | Squirrel/Pr Mobile | `package` | `@a4u/a4u-squirrel` | `squirrel` |
| `stock-e-com-icons` | Stock E-com Icons S2 | `package` | `@a4u/a4u-stock-e-com-icons-s2` | `stock-e-com-icons` |
| `workfront` | Workfront S2 | `package` | `@a4u/a4u-workfront-s2` | `workfront` |

## Acceptance checklist

The implementation is complete when all of the following are true:

- The dialog opens with `Default` selected.
- With `Default` selected, the preview matches `layout.prompt` exactly.
- With `Default` selected, the copy button writes `layout.prompt` unchanged.
- Selecting a non-default icon set updates the preview immediately.
- Selecting a non-default icon set changes the clipboard output to the same text shown in the preview.
- The selected icon set persists after closing and reopening the dialog.
- The selected icon set persists when moving between layouts with previous and next.
- The picker remains outside `ButtonGroup`.
- The dialog controls do not overlap or break when long icon-set labels are selected.
- Adobe.com S2 produces gateway-specific instructions rather than a fake package install command.

## Risks to avoid

- Do not place the picker inside `ButtonGroup`.
- Do not keep icon-set state inside `LayoutDetailDialog`.
- Do not build one prompt for the preview and a different prompt for copying.
- Do not derive package names from the display labels at runtime.
- Do not assume Adobe.com S2 can be installed with the same command shape as the Artifactory-backed sets.
- Do not let the picker width grow without bounds, or it may crowd the dialog title row.

## Out of scope for the first implementation

- Per-layout icon-set filtering in `registry.ts`
- Multi-select icon-set support
- Persisting the choice across page reloads
- Refactoring the icon-set catalog into a shared module before there is a second consumer
- Changing any base prompt strings in `src/_starter/layouts/registry.ts`
