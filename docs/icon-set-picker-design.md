# Adding an icon-set picker to the layout detail dialog

## Problem

Add a single-select icon-set picker to the left of the "Copy prompt" button in `LayoutDetailDialog`. When a non-default icon set is selected, append icon-set integration instructions to the copied prompt. The default option ("Default") copies the prompt unmodified, using the built-in RSP S2 icons.

---

## Atomic decomposition

### Atom 1: Location of the copy prompt button

**Logical component:** The "Copy prompt" button is the rightmost element inside a `ButtonGroup` in the footer of `LayoutDetailDialog.tsx` (line 191). `LayoutDetailDialog` renders a `FullscreenDialog` whose children are `Heading` (title slot), `Content`, and `ButtonGroup`. The button calls `copyPrompt(layout.prompt, layout.name)` which writes `layout.prompt` verbatim to the clipboard.

**Independence:** Standalone structural observation about the existing code.

**Correctness:** Verified in `src/_starter/components/LayoutDetailDialog.tsx` lines 171-197. The `ButtonGroup` contains Close, optional Previous/Next, and Copy prompt.

---

### Atom 2: S2 ButtonGroup accepts only Button children

**Logical component:** The S2 `ButtonGroup` component is designed for grouping related `Button` elements and handling overflow. Inserting a non-button element (like `Picker`) inside `ButtonGroup` is not supported by the component's contract and may produce layout or accessibility issues.

**Independence:** Independent constraint derived from the S2 component specification.

**Correctness:** The S2 docs state "ButtonGroup handles overflow for a grouping of buttons whose actions are related to each other." The component expects `Button` children exclusively.

---

### Atom 3: S2 Picker is the correct component for single-select

**Logical component:** The user needs to pick one icon set from a list. S2 `Picker` is described as "Pickers allow users to choose a single option from a collapsible list of options when space is limited." It supports `defaultValue`, controlled `value`/`onChange`, and `PickerItem` children with `id` keys. This matches the requirement exactly.

**Independence:** Independent component selection decision.

**Correctness:** Verified against the S2 Picker API. `selectionMode` defaults to `'single'`. The component returns a `Key` via `onChange`. Import path: `import { Picker, PickerItem } from "@react-spectrum/s2"`.

---

### Atom 4: Icon set data model

**Logical component:** The icon-set list from `docs/icon-set-list.md` contains 16 named icon sets, each with an Artifactory or gateway URL. For prompt generation, each entry needs: a stable `id`, a display `name`, and the npm `package` name (for install and build commands). The "Default" option has no package — it represents the built-in RSP S2 icons and produces no prompt addendum.

**Independence:** Standalone data-modeling decision. Does not depend on UI placement.

**Correctness:** Verified by cross-referencing `docs/icon-set-list.md` (16 entries) with `docs/a4u-icon-set-findings.md` (package names confirmed as `@a4u/a4u-{slug}`). The Adobe.com S2 set uses the A4U gateway instead of a standard npm package, which should be noted in the data model.

---

### Atom 5: Prompt construction when an icon set is selected

**Logical component:** When a non-default icon set is selected, the copied prompt should be `layout.prompt` with an appended section describing how to install the package, convert SVGs to React components, and use them alongside the base RSP S2 icons. The integration guide in `docs/a4u-icon-set-findings.md` (lines 199-263) specifies the exact steps: install, run `s2-icon-builder`, import generated components.

**Independence:** Depends on Atom 4 (data model provides package name and slug) but the prompt-assembly logic is an independent concern.

**Correctness:** The integration steps are verified in `a4u-icon-set-findings.md`:
1. `pnpm add @a4u/a4u-{slug}`
2. `npx @react-spectrum/s2-icon-builder -i 'node_modules/@a4u/a4u-{slug}/assets/svg/S2_Icon_*_20_N.svg' -o 'src/icons/{slug}'`
3. Import from generated directory; continue using `@react-spectrum/s2/icons/*` for base icons

Key constraints from the findings doc that should be included in the prompt addendum:
- Only 20px icons are compatible with the S2 pipeline
- RSP S2 icons take precedence when the same icon exists in both sources
- Gradient/multi-color icons do not follow the color system

---

### Atom 6: Default behavior produces an unmodified prompt

**Logical component:** When the picker value is `"default"` (the initial state), `copyPrompt` receives `layout.prompt` unchanged. No icon-set section is appended. This means the prompts in `registry.ts` remain the single source of truth for the base case, and no existing behavior changes.

**Independence:** Independent behavioral constraint. Ensures backward compatibility.

**Correctness:** The current line `onPress={() => copyPrompt(layout.prompt, layout.name)}` copies `layout.prompt` directly. Keeping this path for the default selection preserves existing behavior exactly.

---

### Atom 7: State scope — lifted to LayoutPicker

**Logical component:** The selected icon set must survive dialog close/reopen cycles so the user does not have to re-select the icon set when browsing different layouts. `LayoutDetailDialog` unmounts every time the dialog closes (`DialogContainer` renders it conditionally via `{selectedLayout && <LayoutDetailDialog ... />}` in `LayoutPicker.tsx` line 94), so state inside the dialog is destroyed on close. The state must therefore live in `LayoutPicker`, which stays mounted for the entire session, and be passed to `LayoutDetailDialog` as props (`iconSetId` and `onIconSetChange`).

No persistence layer (localStorage, URL params, etc.) is needed. The state lives in React component memory for the duration of the page session, which is sufficient — when the user navigates away or refreshes, resetting to "Default" is acceptable.

**Independence:** Independent architecture decision. Affects the prop interface between `LayoutPicker` and `LayoutDetailDialog`.

**Correctness:** `LayoutPicker` is rendered by `StarterPage`, which is rendered by `App` / `PickerApp`. It stays mounted as long as the starter page is visible. A `useState` in `LayoutPicker` survives across dialog open/close cycles without any persistence mechanism.

---

### Atom 8: Prompt preview should reflect the selected icon set

**Logical component:** The `<pre>` block in the right column of the dialog (line 152-167) displays `layout.prompt`. If the user selects a non-default icon set, the displayed prompt should also show the appended icon-set section, so the user sees exactly what will be copied.

**Independence:** Depends on Atom 5 (prompt construction) but the display concern is distinct from the copy concern.

**Correctness:** Both the `<pre>` and the `copyPrompt` call should use the same assembled prompt string. Deriving the final prompt in one place (e.g., a `useMemo` or inline computation) and using it in both locations prevents drift.

---

### Atom 9: Footer layout must accommodate the Picker

**Logical component:** Since `ButtonGroup` only accepts buttons (Atom 2), the Picker must be placed outside the `ButtonGroup` but still visually in the footer row. The `FullscreenDialog` component renders its children in slots: `Heading` (title), `Content`, and any remaining children as footer. The `ButtonGroup` is currently the only footer child. Adding a sibling element alongside `ButtonGroup` requires a wrapper to control horizontal layout.

**Independence:** Depends on Atom 2 (ButtonGroup constraint) and Atom 1 (current structure).

**Correctness:** S2 `FullscreenDialog` renders unnamed-slot children after `Content` as the footer area. A flex wrapper around the `Picker` + `ButtonGroup` will produce a single-row footer with the picker on the left and buttons on the right.

---

### Atom 10: Picker sizing and label

**Logical component:** The Picker should be compact enough for a dialog footer. S2 Picker supports `size` prop with values `"S"`, `"M"`, `"L"`, `"XL"` (default `"M"`). A label is needed for accessibility. The label should describe what the picker controls — something like "Icon set" follows the Spectrum content guidelines (sentence case, concise, action-oriented).

**Independence:** Independent UX/accessibility decision.

**Correctness:** Per Spectrum content guidelines: labels should be brief (4 words or fewer), sentence case, and describe the field's purpose. "Icon set" is 2 words, sentence case, and descriptive.

---

## Synthesized solutions

### Solution A: Flex wrapper in footer with Picker + ButtonGroup (recommended)

Replace the bare `ButtonGroup` with a flex container that places the `Picker` on the left and the `ButtonGroup` on the right. The selected icon set drives a computed prompt used by both the `<pre>` display and the copy action.

**Changes to `LayoutPicker.tsx`:**

1. Add `useState` for the icon set selection: `const [iconSetId, setIconSetId] = useState<Key>("default")`
2. Pass `iconSetId` and `onIconSetChange={setIconSetId}` as props to `LayoutDetailDialog`

**Changes to `LayoutDetailDialog.tsx`:**

1. Add imports: `Picker`, `PickerItem`, `useMemo`
2. Extend `LayoutDetailDialogProps` with `iconSetId: Key` and `onIconSetChange: (key: Key) => void`
3. Define an `ICON_SETS` constant array with `{ id, name, package }` entries (plus `{ id: "default", name: "Default", package: null }`)
4. Compute the final prompt via `useMemo`: if `iconSetId === "default"`, return `layout.prompt`; otherwise append the icon-set integration section
5. Use the computed prompt in both the `<pre>` block and the `copyPrompt` call
6. Wrap `Picker` + `ButtonGroup` in a `<div>` with `display: flex`, `justifyContent: space-between`, `alignItems: center`, `gap: 16`

```tsx
<div className={style({ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 })}>
  <Picker
    label="Icon set"
    size="S"
    value={iconSetId}
    onChange={onIconSetChange}
  >
    <PickerItem id="default">Default</PickerItem>
    {ICON_SETS.filter(s => s.id !== "default").map(s => (
      <PickerItem key={s.id} id={s.id}>{s.name}</PickerItem>
    ))}
  </Picker>
  <ButtonGroup>
    {/* existing buttons unchanged */}
    <Button variant="accent" onPress={() => copyPrompt(finalPrompt, layout.name)}>
      Copy prompt
    </Button>
  </ButtonGroup>
</div>
```

**Why this is recommended:**

- Satisfies the placement requirement ("to the left of the copy prompt button") by putting the Picker in the same footer row
- Does not violate the ButtonGroup contract — Picker is a sibling, not a child
- State lives in `LayoutPicker` and survives dialog close/reopen — the user's icon set choice is retained while browsing layouts (Atom 7)
- No persistence layer needed — React component state lasts for the page session
- Both the preview and copy action use the same computed prompt (Atom 8)
- Default selection preserves existing behavior exactly (Atom 6)
- Changes scoped to two files: `LayoutPicker.tsx` (state owner) and `LayoutDetailDialog.tsx` (UI + prompt logic); no changes to types, registry, or other components
- Icon set data can live as a module-level constant in the dialog file or a small separate file

**Trade-offs:**

- The flex wrapper replaces the direct `ButtonGroup` in the FullscreenDialog footer slot. This changes the DOM structure slightly but should not affect FullscreenDialog behavior since unnamed-slot children are rendered generically
- The Picker adds visual weight to the footer; using `size="S"` keeps it compact
- Two files change instead of one, but the `LayoutPicker` change is minimal (one `useState` + two props)

---

### Solution B: Picker in the right panel above the prompt preview

Place the Picker in the right column of the dialog content, directly above the `<pre>` block, instead of in the footer.

**Changes:**

- Insert a `Picker` between the description `<p>` and the `<pre>` in the right column
- Keep the `ButtonGroup` and copy button unchanged
- Use the same state/computed-prompt logic as Solution A

**Trade-offs:**

- Visually associates the picker with the prompt content (clear cause-and-effect)
- Does not require a footer layout change
- Does not satisfy the literal requirement "to the left of the copy prompt button" — the picker is above the button, not beside it
- Adds vertical space to the right panel, reducing visible prompt area

---

### Solution C: Picker data in Layout type, stored in registry

Extend the `Layout` interface with an optional `iconSets?: string[]` field, and move icon-set eligibility into `registry.ts` per layout. The dialog reads the allowed icon sets from the layout object.

**Trade-offs:**

- Over-engineers the data model — all layouts use the same set of icon sets since A4U packages are generic supplements
- Requires changing the `Layout` type and every layout entry in the registry
- No current need for per-layout icon-set filtering
- Rejected as unnecessary complexity

---

### Solution D: Icon set data in a shared constants file

Move the `ICON_SETS` array to a dedicated file (`src/_starter/constants/iconSets.ts`) instead of defining it inline in `LayoutDetailDialog.tsx`.

This is not a separate solution but an **optional refinement** of Solution A. It makes sense if other components (e.g., a future settings page) need access to the icon set list. For now, co-locating with the dialog is simpler. This refinement can be applied to Solution A if reuse becomes necessary.

---

## Recommendation

**Solution A** is the clear winner. It:

1. Places the Picker exactly where requested (left of the copy prompt button, in the footer)
2. Respects the S2 ButtonGroup contract (Picker is a sibling, not a child)
3. Retains the user's icon set choice across dialog open/close cycles by lifting state to `LayoutPicker` — no persistence layer needed
4. Updates both the prompt preview and the clipboard copy in sync
5. Preserves existing default behavior with zero changes to prompts or types
6. Requires changes to only two files: `LayoutPicker.tsx` (state) and `LayoutDetailDialog.tsx` (UI + prompt logic)

The icon-set data constant should include all 16 entries from `docs/icon-set-list.md` plus the "Default" entry as the first item. Each entry needs `id`, `name`, and `npmPackage` (null for Default). The prompt addendum should follow the integration guide from `docs/a4u-icon-set-findings.md`, covering install, SVG-to-React conversion, import patterns, and the key constraints (20px only, RSP S2 takes precedence, gradient icons do not follow the color system).
