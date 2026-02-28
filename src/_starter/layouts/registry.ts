import type { Layout } from "./types";

export const layouts: Layout[] = [
  {
    id: "blank",
    name: "Blank",
    description:
      "A minimal starting point with no predefined structure. Start from scratch and build your own layout.",
    tags: ["starter", "minimal"],
    prompt: `Generate a blank layout with a single full-viewport container and no predefined content.

## File structure
- Create src/pages/BlankPage.tsx
- Update src/App.tsx to import BlankPage instead of _starter/StarterPage

## Component hierarchy
BlankPage (flex column, full viewport height, gray-25 background, 32px padding)
└── empty container ready for content

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
  {
    id: "editing-app",
    name: "Editing app",
    description:
      "A single-pane editing interface with a toolbar and content area, suited for document or asset editing workflows.",
    tags: ["editing", "tools"],
    prompt: `Generate an editing app layout with a top toolbar and a main content editing area below.

## File structure
- Create src/components/EditorToolbar.tsx
- Create src/components/EditorCanvas.tsx
- Create src/pages/EditingApp.tsx
- Update src/App.tsx to import EditingApp instead of _starter/StarterPage

## Component hierarchy
EditingApp (flex column, full viewport)
├── EditorToolbar (flex row, 16px padding, gray-50 background, border-bottom, gap: 8px)
│   ├── Heading size="S" — document title
│   ├── Divider orientation="vertical"
│   ├── ActionButtonGroup — formatting and tool buttons
│   └── Button variant="accent" — "Save"
└── EditorCanvas (flex-grow: 1, gray-25 background, 32px padding, overflow: auto)
    └── content editing area with placeholder text

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
  {
    id: "pro-editing-app",
    name: "Pro editing app",
    description:
      "A multi-panel editing interface with a left panel, center canvas, and right inspector, designed for professional creative tools.",
    tags: ["editing", "professional"],
    prompt: `Generate a professional editing app layout with a left panel for assets, a center canvas, and a right inspector panel.

## File structure
- Create src/components/AssetPanel.tsx
- Create src/components/Canvas.tsx
- Create src/components/InspectorPanel.tsx
- Create src/components/AppToolbar.tsx
- Create src/pages/ProEditingApp.tsx
- Update src/App.tsx to import ProEditingApp instead of _starter/StarterPage

## Component hierarchy
ProEditingApp (flex column, full viewport)
├── AppToolbar (flex row, 12px padding, gray-100 background, border-bottom, gap: 8px)
│   ├── Heading size="S" — app name
│   ├── ActionButtonGroup — undo, redo, zoom controls
│   ├── SegmentedControl — tool mode selector
│   └── Button variant="accent" — "Export"
└── WorkArea (CSS grid: 240px 1fr 280px, flex-grow: 1)
    ├── AssetPanel (gray-75 background, 16px padding, overflow-y: auto, border-right)
    │   ├── SearchField label="Search assets"
    │   └── vertical list of asset items
    ├── Canvas (gray-50 background, flex, align-items: center, justify-content: center)
    │   └── centered canvas area with checkerboard or neutral background
    └── InspectorPanel (gray-75 background, 16px padding, overflow-y: auto, border-left)
        ├── Heading size="XS" — "Properties"
        └── form fields for position, size, opacity, and color

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
  {
    id: "browsing-context",
    name: "Browsing context",
    description:
      "A content browsing layout with a navigation sidebar and a scrollable main area for exploring collections of items.",
    tags: ["browsing", "navigation"],
    prompt: `Generate a browsing context layout with a navigation sidebar on the left and a scrollable content area on the right for exploring items.

## File structure
- Create src/components/NavSidebar.tsx
- Create src/components/BrowseArea.tsx
- Create src/components/ItemCard.tsx
- Create src/pages/BrowsingContext.tsx
- Update src/App.tsx to import BrowsingContext instead of _starter/StarterPage

## Component hierarchy
BrowsingContext (CSS grid: 240px 1fr, full viewport)
├── NavSidebar (gray-75 background, 16px padding, flex column, gap: 8px)
│   ├── Heading size="S" — app name
│   ├── SearchField label="Search"
│   ├── Divider
│   └── nav items using ActionButton components with icons
└── BrowseArea (gray-25 background, flex column)
    ├── header (flex row, space-between, 24px padding, border-bottom)
    │   ├── Heading size="M" — current section title
    │   └── ActionButtonGroup — view and sort controls
    └── scrollable content (flex-grow: 1, overflow-y: auto, 24px padding)
        └── CSS grid of ItemCard components (repeat(auto-fill, minmax(220px, 1fr)), gap: 16px)
            └── Card variant="secondary" with preview image, title, and description

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
  {
    id: "bento",
    name: "Bento",
    description:
      "A bento-box grid layout with varied-size content blocks, ideal for dashboards, landing pages, or feature showcases.",
    tags: ["dashboard", "grid"],
    prompt: `Generate a bento-box grid layout with content blocks of varying sizes arranged in an asymmetric grid.

## File structure
- Create src/components/BentoCard.tsx
- Create src/pages/BentoLayout.tsx
- Update src/App.tsx to import BentoLayout instead of _starter/StarterPage

## Component hierarchy
BentoLayout (flex column, full viewport, gray-25 background)
├── header (32px padding)
│   └── Heading size="L" — page title
└── BentoGrid (CSS grid, 24px padding, 16px gap)
    Grid template: 4 columns, auto rows with minmax(200px, auto)
    ├── BentoCard span 2 cols, 2 rows — hero/featured content (accent-subtle background)
    │   ├── Heading size="M" — card title
    │   └── body text or illustration
    ├── BentoCard span 1 col, 1 row — metric or stat
    ├── BentoCard span 1 col, 1 row — metric or stat
    ├── BentoCard span 1 col, 2 rows — tall sidebar card
    ├── BentoCard span 2 cols, 1 row — wide content card
    └── BentoCard span 1 col, 1 row — small card

    Each BentoCard uses Card with rounded corners, padding: 24px, and varied background colors from Spectrum tokens.

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
];
