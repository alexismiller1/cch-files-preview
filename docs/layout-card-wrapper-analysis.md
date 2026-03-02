# LayoutCard wrapper div analysis

## Problem statement

`LayoutCard.tsx` wraps an S2 `Card` inside a `<div>` that manually reimplements interactivity (click, keyboard, focus, ARIA role). Is the wrapper required? Are there better alternatives?

## Current implementation

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={onPress}
  onKeyDown={handleKeyDown}
  className={style({ cursor: "pointer", borderRadius: "xl" })}
  aria-label={`View ${layout.name} layout`}
>
  <Card variant="tertiary" size="XL" density="spacious">
    ...
  </Card>
</div>
```

---

## Atomic reasoning

### Atom 1 — The wrapper provides six things

| Concern | Mechanism |
|---|---|
| Clickability | `onClick={onPress}` |
| Keyboard activation | `onKeyDown` handling Enter and Space |
| Focusability | `tabIndex={0}` |
| Semantic role | `role="button"` |
| Pointer cursor | `cursor: "pointer"` style |
| Accessible name | `aria-label` |

**Independence**: each concern is independently verifiable.
**Correctness**: all six are necessary for the card to behave as an interactive element.

### Atom 2 — Card's `onPress` only works inside CardView

The S2 `Card` component accepts `onPress`, `onPressStart`, `onPressEnd`, `onPressChange`, and `onPressUp` in its TypeScript interface (inherited from `GridListItemProps`). However, the Card source (`Card.tsx` lines 427-441) reveals a critical branch:

```tsx
if (ElementType === 'div' || isSkeleton) {
  return (
    <div
      {...filterDOMProps(otherProps)}
      ...
    </div>
  );
}
```

When Card is used standalone (outside a CardView), `ElementType` defaults to `'div'` via `InternalCardViewContext`. In this branch, `filterDOMProps` strips all non-DOM props including `onPress`. The interactive `GridListItem` path (lines 444-468) only executes when `ElementType !== 'div'`, which requires a parent `CardView`.

**Independence**: verifiable from the Card source code.
**Correctness**: confirmed by browser testing — standalone Card with `onPress` renders a static `<div>` with no interactive behavior.

### Atom 3 — The wrapper creates a nested interactive element

The wrapper has `role="button"` and `tabIndex={0}`. Inside it, Card (when given `onPress`) also becomes an interactive element. This means:

- Screen readers encounter two nested interactive elements (WCAG violation)
- Tab order contains a redundant stop
- Click events fire on both the wrapper and the card

Without `onPress`, Card renders as a static container, and the wrapper provides the only interactive layer. This is not a violation, but it is an anti-pattern: it bypasses Card's built-in press handling, focus ring, hover states, and pressed states.

**Independence**: testable by inspecting the DOM.
**Correctness**: nested interactive elements violate [WCAG 4.1.2 Name, Role, Value](https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html).

### Atom 4 — `borderRadius: "xl"` on the wrapper is dead code

The wrapper has no background and no border. `border-radius` only affects the visual rendering of an element's own background and border. Without either, the property has no visual effect and does not clip children (that requires `overflow: hidden`).

**Independence**: pure CSS specification.
**Correctness**: confirmed — `border-radius` without `overflow: hidden` never clips child box-shadows.

### Atom 5 — CardView provides collection-level interactivity

`CardView` is the S2 collection component for groups of cards. It provides:

- `onAction` — fires when a user activates any card
- Arrow-key navigation between cards
- `selectionMode` — single or multiple selection
- Built-in grid/waterfall layout
- Virtualized rendering for large collections
- `renderActionBar` for bulk actions
- Proper `role="grid"` or `role="listbox"` semantics

**Independence**: verifiable from the CardView API.
**Correctness**: confirmed in S2 CardView documentation.

### Atom 6 — The current layout uses manual flex-wrap

The parent in `LayoutPicker.tsx` uses a plain flex container:

```tsx
<div className={style({ display: "flex", flexWrap: "wrap", columnGap: 24, rowGap: 24 })}>
  {layouts.map(...)}
</div>
```

CardView manages its own layout internally (`layout="grid"` or `layout="waterfall"`), so adopting CardView would replace this manual layout.

**Independence**: observable from `LayoutPicker.tsx`.
**Correctness**: CardView requires a `styles` prop with explicit height for virtualization.

---

## Solutions

### Solution A — Replace `div[role=button]` with a native `<button>` wrapper

Per Atom 2, Card's `onPress` does not work standalone. A wrapper is required. Replace the `div` with a semantic `<button>` element, which provides keyboard activation, focus, and ARIA role natively without manual event handlers.

```tsx
const buttonStyles = style({
  cursor: "pointer",
  backgroundColor: "transparent",
  borderStyle: "none",
  padding: 0,
  font: "body",
  textAlign: "start",
  color: "inherit",
});

export function LayoutCard({ layout, onPress }: LayoutCardProps) {
  const PreviewComponent = layout.preview;

  return (
    <button
      type="button"
      className={buttonStyles}
      onClick={onPress}
      aria-label={`View ${layout.name} layout`}
    >
      <Card variant="tertiary" size="XL" density="spacious">
        ...
      </Card>
    </button>
  );
}
```

| Criterion | Assessment |
|---|---|
| Resolves nested interactive elements | Yes — Card is a static `<div>` when standalone |
| Removes dead code (`borderRadius`) | Yes |
| Removes manual keyboard handling | Yes — native `<button>` handles Enter/Space |
| Preserves existing flex-wrap layout | Yes |
| Change scope | Minimal — one component, no parent changes |
| Keyboard navigation between cards | No — still Tab-only, no arrow keys |

### Solution B — Use CardView collection

Replace the manual flex layout with a CardView, moving `onPress` to `onAction`.

```tsx
<CardView
  aria-label="Layout templates"
  variant="tertiary"
  size="XL"
  density="spacious"
  layout="grid"
  onAction={(key) => {
    const layout = layouts.find((l) => l.id === key);
    if (layout) setSelectedLayout(layout);
  }}
  items={layouts}
  styles={style({ width: "full", height: 600 })}
>
  {(layout) => (
    <Card id={layout.id} textValue={layout.name}>
      <CardPreview>
        {layout.preview ? (
          <ScaledPreview>
            <layout.preview />
          </ScaledPreview>
        ) : (
          <div
            className={style({
              width: "full",
              aspectRatio: "video",
              backgroundColor: "layer-2",
            })}
          />
        )}
      </CardPreview>
      <Content>
        <Text slot="title">{layout.name}</Text>
        <Text slot="description" styles={style({ color: "neutral-subdued" })}>
          {layout.description}
        </Text>
      </Content>
    </Card>
  )}
</CardView>
```

| Criterion | Assessment |
|---|---|
| Resolves nested interactive elements | Yes |
| Removes dead code | Yes |
| Preserves interactive concerns | Yes — handled by CardView's `onAction` |
| Arrow-key navigation between cards | Yes — built-in |
| Change scope | Moderate — replaces flex layout, removes LayoutCard component |
| Requires explicit height | Yes — CardView uses virtualization |
| Potential layout regression | Possible — CardView controls its own grid sizing |

### Solution C — Keep the wrapper, fix the dead code

Remove `borderRadius: "xl"` from the wrapper. Keep everything else.

```tsx
className={style({ cursor: "pointer" })}
```

| Criterion | Assessment |
|---|---|
| Resolves nested interactive elements | No |
| Removes dead code | Partially |
| Preserves interactive concerns | Yes |
| Change scope | Trivial |

---

## Recommendation: Solution A

**Replace the `div[role=button]` wrapper with a native `<button>` element.**

Rationale:

1. **Correctness** — a native `<button>` provides keyboard, focus, and ARIA semantics without manual handlers
2. **No nested interactive elements** — standalone Card renders as a static `<div>` (Atom 2), so the `<button>` is the only interactive element
3. **Dead code** — removes the no-op `borderRadius: "xl"` and manual `onKeyDown` handler (Atom 4)
4. **Low risk** — no parent layout changes needed
5. **Key finding** — Card's `onPress` only works inside `CardView` (Atom 2), so a wrapper element is genuinely required for standalone usage

Solution B (CardView) is the more architecturally complete option and would be the right choice if this grid needs selection, bulk actions, or arrow-key navigation in the future. It is the only way to use Card's native `onPress`/`onAction`. For a simple "pick one and open a dialog" flow, Solution A is sufficient and carries less risk.
