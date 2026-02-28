# Layout picker: analysis and recommendation

## Problem statement

When designers create a new project from this template and preview it, they should see a gallery of available layouts. Each layout has an associated prompt that, when copied and pasted into the AI agent, deterministically generates that layout as the first page or screen of the project. The layout picker is temporary scaffolding: once the AI generates the chosen layout, it replaces the picker in `App.tsx` and becomes the root content of the designer's prototype.

---

## Atomic decomposition

### Atom 1: Layout data model

**Logical component.** A data structure representing a single layout: its identity, visual metadata, and the generative prompt.

**Independence.** This atom has no dependencies on UI, clipboard, or routing. It is a pure data concern.

**Correctness.** A layout must contain at minimum:

- `id` (string) — unique identifier
- `name` (string) — display name, sentence case
- `description` (string) — one-sentence summary of the layout's purpose
- `prompt` (string) — the full AI prompt that deterministically produces this layout
- `thumbnail` (string) — path or import reference to a preview image
- `tags` (string[]) — categories for filtering (e.g., "dashboard", "editorial", "form")

This is correct because each field maps to a distinct user need: identification, comprehension, action, and discovery.

---

### Atom 2: Layout registry

**Logical component.** A central collection of all available layout definitions, acting as the single source of truth.

**Independence.** Depends only on the layout data model (Atom 1). Does not depend on UI rendering or user interaction.

**Correctness.** The registry must be:

- Statically importable (no async fetching for a client-only app)
- Ordered (layouts appear in a deliberate sequence)
- Extensible (adding a layout means adding one entry, not modifying multiple files)
- Type-safe (TypeScript interface enforces the schema)

A single `layouts.ts` file exporting an array satisfies all four constraints. File-based discovery (dynamic imports, glob patterns) adds complexity without proportional benefit at this scale.

---

### Atom 3: Prompt determinism

**Logical component.** The prompt string must be specific enough that an AI agent produces the same layout structure every time.

**Independence.** This is a content/authoring concern, independent of how the prompt is stored or displayed.

**Correctness.** Determinism requires the prompt to specify:

- Exact component hierarchy (which S2 components, in what nesting order)
- Layout dimensions and spacing (CSS grid/flex definitions)
- Placeholder content strategy (what sample content to use)
- Which files to create or modify
- Constraints the output must satisfy (S2 only, sentence case, WCAG 2.2 AA)

The prompt is essentially a detailed specification, not a vague instruction. Storing prompts as multi-line template literals (or importing from `.md` files) preserves readability during authoring.

---

### Atom 4: Gallery UI

**Logical component.** A visual grid of layout cards that designers can browse.

**Independence.** Depends on the registry (Atom 2) for data. Does not depend on clipboard or routing logic.

**Correctness.** Must satisfy:

- Uses React Spectrum S2 components exclusively
- Responsive grid that works at common viewport sizes
- Each card shows: thumbnail, name, description, tags, and a copy action
- Follows S2 attention hierarchy (the gallery is the primary focal point)
- Sentence case for all text
- WCAG 2.2 AA compliant (keyboard navigable, sufficient contrast, alt text on thumbnails)

---

### Atom 5: Copy-to-clipboard interaction

**Logical component.** A user action that copies a layout's prompt to the system clipboard and confirms success.

**Independence.** Depends on the prompt string (Atom 1) and a UI trigger (Atom 4). Does not depend on routing, layout preview, or registry structure.

**Correctness.** Must:

- Use the Clipboard API (`navigator.clipboard.writeText`)
- Provide visual feedback via an S2 toast (positive variant) on success
- Handle clipboard permission denial gracefully (supportive error toast)
- Be accessible (button with clear label, not icon-only without aria-label)

---

### Atom 6: Thumbnail / preview representation

**Logical component.** A visual representation of what each layout looks like before the designer commits to generating it.

**Independence.** This is a content/asset concern. The gallery UI (Atom 4) consumes thumbnails but does not dictate their format.

**Correctness.** Options ranked by fidelity and cost:

1. **Static images** (PNG/WebP) — highest fidelity, requires manual creation per layout, stored in `src/assets/layouts/`
2. **SVG wireframes** — schematic representation, lightweight, can be version-controlled, conveys structure without pixel-perfect detail
3. **CSS-only previews** — miniature rendered versions using actual CSS, no image assets needed, but complex to maintain
4. **Placeholder with icon** — lowest effort, uses a generic icon per category, weakest signal

For a template where layouts will be added incrementally, **SVG wireframes** or **static images** are the best balance. Start with a placeholder strategy and upgrade to images as layouts are authored.

---

### Atom 7: Fresh-state detection

**Logical component.** Determining whether to show the layout picker or the generated app.

**Independence.** This is an architectural concern about the app's lifecycle, independent of specific layouts or UI.

**Correctness.** This is a development-time workflow, not a runtime concern. `App.tsx` initially renders `<StarterPage />` (the layout picker). When the designer copies a prompt and pastes it into the AI agent, the AI generates the chosen layout and wires it into `App.tsx` as the replacement for `<StarterPage />`. The generated layout becomes the first page or screen of the project — the root content the designer and their users see when the app loads. This means:

- No runtime flag, localStorage check, or route guard needed
- The picker code is inherently temporary scaffolding
- The prompt instructs the AI to replace the `<StarterPage />` import in `App.tsx` with the generated layout component

This is correct because it avoids dead code (no picker logic ships in the final prototype) and matches the mental model: "I pick a layout, and it becomes the starting point of my app."

---

### Atom 8: Prompt storage format

**Logical component.** The physical format and location of prompt strings.

**Independence.** Depends on the data model (Atom 1). Does not depend on UI or clipboard.

**Correctness.** Options:

| Format | Readability | Editability | Type safety | Import cost |
|---|---|---|---|---|
| Inline in `layouts.ts` | Medium | Easy | Full | None |
| Separate `.md` files | High | Easy | Requires loader | Vite raw import |
| JSON file | Medium | Moderate | Requires parsing | Native import |

**Inline in `layouts.ts`** is the simplest correct choice: no build config changes, full type safety, and prompts are co-located with their metadata. For very long prompts, use template literals. If prompts grow beyond ~100 lines, extracting to `.md` files with Vite's `?raw` import suffix is a clean upgrade path.

---

### Atom 9: Page header and context

**Logical component.** The surrounding UI that frames the gallery: a title, brief instructions, and any branding.

**Independence.** Depends on S2 components. Does not depend on layout data or clipboard logic.

**Correctness.** Must:

- Use S2 `Heading` for the page title
- Provide a one-sentence instruction ("Browse layouts and copy a prompt to get started")
- Not compete with the gallery for attention (supportive, not dominant)
- Follow Spectrum content guidelines (sentence case, no exclamation points, second person)

---

## Solution synthesis

### Solution A: Static registry with card grid (recommended)

**Architecture.** A single-file layout registry (`src/layouts/registry.ts`) defines all layouts. A `LayoutPicker` component renders them as a card grid in `App.tsx`. Copy uses the Clipboard API with S2 toast feedback.

```
src/
├── layouts/
│   ├── registry.ts          # Layout data model + all layout entries
│   └── thumbnails/          # SVG or PNG preview assets
├── components/
│   ├── LayoutPicker.tsx      # Gallery grid page
│   └── LayoutCard.tsx        # Individual layout card
├── App.tsx                   # Renders <LayoutPicker /> as default content
└── ...existing files
```

**Atoms satisfied.** 1 (data model), 2 (registry), 4 (gallery UI), 5 (clipboard), 6 (thumbnails), 7 (fresh-state via replacement), 8 (inline storage), 9 (page header).

**Atom 3 (prompt determinism)** is an authoring concern addressed by prompt content, not by code architecture.

**Pros:**

- Minimal complexity; no routing, no async loading, no build config changes
- Adding a layout is a single registry entry plus an optional thumbnail
- Type-safe end to end
- The picker is self-contained and trivially replaceable by AI-generated code
- No runtime overhead in the final prototype (picker code is replaced, not hidden)

**Cons:**

- Long prompts may make `registry.ts` verbose (mitigated by template literals and eventual `.md` extraction)
- No live preview of layouts (acceptable since layouts don't exist yet)

---

### Solution B: File-based discovery with markdown prompts

**Architecture.** Each layout is a directory containing a `meta.json` and `prompt.md`. A build-time script or Vite plugin discovers them and generates a registry.

```
src/
├── layouts/
│   ├── dashboard/
│   │   ├── meta.json
│   │   ├── prompt.md
│   │   └── thumbnail.svg
│   ├── editorial/
│   │   ├── meta.json
│   │   ├── prompt.md
│   │   └── thumbnail.svg
│   └── index.ts              # Auto-generated or glob-imported
├── components/
│   ├── LayoutPicker.tsx
│   └── LayoutCard.tsx
└── App.tsx
```

**Atoms satisfied.** Same as Solution A, with better separation for Atom 8 (storage).

**Pros:**

- Clean separation of concerns (metadata, prompt, and thumbnail are siblings)
- Prompts in markdown are highly readable and editable
- Scales well to many layouts

**Cons:**

- Requires Vite glob imports (`import.meta.glob`) or a build script
- More files to manage per layout (3 files vs. 1 registry entry)
- Overkill for the initial phase when layouts are being authored incrementally
- Slightly more complex onboarding for designers adding layouts

---

### Solution C: Route-based with layout preview iframe

**Architecture.** Each layout ships as a separate route. The picker shows live miniature previews via iframes or portals.

**Atoms satisfied.** All, including live preview.

**Pros:**

- Highest fidelity preview
- Layouts are runnable before selection

**Cons:**

- Requires a router (new dependency)
- Layouts must exist as code to preview them (contradicts the "layouts will be added later" constraint)
- Significantly more complex
- iframe previews have performance and styling challenges
- Doesn't match the workflow: the point is to generate the layout from a prompt, not to ship it pre-built

---

## Recommendation: Solution A with isolation strategy

**Solution A (static registry with card grid)** is the right choice for this phase. It aligns with the project's constraints:

1. **Client-only, no backend** — everything is static imports
2. **Layouts don't exist yet** — the registry is a data structure, not a code loader
3. **Designers are the audience** — simplicity in adding layouts matters more than architectural elegance
4. **The picker is temporary** — it gets replaced by generated code, so minimizing its footprint is valuable
5. **S2 compliance** — a card grid is a natural S2 pattern using standard components

**Upgrade path.** When the number of layouts exceeds ~10, or prompts exceed ~100 lines each, migrate to Solution B by extracting prompts to `.md` files. The `LayoutPicker` and `LayoutCard` components remain unchanged; only the registry import changes.

---

### File isolation strategy

Template scaffolding must be clearly separated from user-generated project files to prevent two failure modes: (1) AI agents accidentally editing template files when generating layout code, and (2) designers confusing template infrastructure with their own components.

**Two-layer protection:**

#### Layer 1: Physical separation via `src/_starter/`

All template scaffolding lives under `src/_starter/`. The underscore prefix is a convention meaning "internal/framework — do not modify." It sorts to the top of directory listings, making the boundary visible. Keeping it inside `src/` means Vite resolves imports with zero config changes.

```
src/
├── _starter/                      # Template scaffolding (isolated, do not modify)
│   ├── components/
│   │   ├── LayoutPicker.tsx       # Gallery grid page
│   │   └── LayoutCard.tsx         # Individual layout card
│   ├── layouts/
│   │   ├── registry.ts            # Layout data model + all entries
│   │   └── thumbnails/            # SVG or PNG preview assets
│   └── StarterPage.tsx            # Single entry point exported to App.tsx
├── App.tsx                        # Imports <StarterPage /> initially
├── contexts/                      # Existing auth infrastructure (persists)
├── utils/                         # Existing utilities (persists)
├── components/                    # ← User/AI-generated components go here
├── pages/                         # ← User/AI-generated pages go here
└── assets/                        # ← User/AI-generated assets go here
```

When the AI generates a layout, it creates files in `src/components/`, `src/pages/`, etc. The `_starter/` directory is left untouched. It can be deleted afterward if desired.

#### Layer 2: Self-documenting prompts

Each layout prompt in the registry includes explicit instructions about file placement and the replacement workflow. The prompt tells the AI: "Create components in `src/components/`, create pages in `src/pages/`, replace the `_starter/StarterPage` import in `App.tsx` with the generated layout component, and make it the first screen of the app." This means the prompt itself enforces both the file boundary and the end result: the chosen layout becomes the project's root content.

**Why `src/_starter/` over alternatives:**

| Approach | Signal strength | Import ergonomics | Visibility | Verdict |
|---|---|---|---|---|
| `src/_starter/` | Strong (underscore convention) | Native (inside src) | Visible in explorer | Recommended |
| Root `.starter/` | Strongest (dot prefix) | Needs Vite config | Hidden in most explorers | Over-isolated |
| Root `starter/` | Moderate | Needs Vite alias | Visible | Config overhead |
| `src/starter/` | Weak | Native | Visible | Too easily confused |
| `src/__template__/` | Very strong (dunder) | Native | Visible | Foreign to JS/TS |

---

### Implementation order

1. Create `src/_starter/` directory structure
2. Define the `Layout` TypeScript interface and create `registry.ts` with 2-3 placeholder entries
3. Build `LayoutCard` component (S2 card with thumbnail, name, description, copy button)
4. Build `LayoutPicker` component (page header + responsive grid of cards)
5. Create `StarterPage.tsx` as the single entry point
6. Wire clipboard copy with S2 toast feedback
7. Replace `App.tsx` placeholder content with `<StarterPage />`
8. Add placeholder thumbnails (SVG wireframes or generic icons)
