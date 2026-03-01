import type { Layout } from "./types";
import BlankPreview from "../previews/BlankPreview";
import EditingAppPreview from "../previews/EditingAppPreview";
import ProEditingAppPreview from "../previews/ProEditingAppPreview";
import BrowsingContextPreview from "../previews/BrowsingContextPreview";
import BentoPreview from "../previews/BentoPreview";
import TextDocumentPreview from "../previews/TextDocumentPreview";

export const layouts: Layout[] = [
  {
    id: "blank",
    name: "Blank",
    description:
      "A minimal starting point with no predefined structure. Start from scratch and build your own layout.",
    tags: ["starter", "minimal"],
    preview: BlankPreview,
    prompt: `Use src/_starter/previews/BlankPreview.tsx as the source of truth. Recreate it by translating that file directly, not by redesigning.

## File structure
- Create src/pages/BlankPage.tsx
- Update src/App.tsx to import BlankPage instead of _starter/StarterPage
- Keep existing Provider/IMSProvider wiring, preview query-param behavior, \`?picker\` query-param routing, and the dev-mode DevToolbar in App.tsx

## Constraints
- Reuse preview implementations by copying/duplicating code into src/components and src/pages; do not import preview components from src/_starter/previews in runtime app code
- Match the preview's structure and behavior exactly (spacing, colors, icon, aria-labels, and theme-toggle placement)
- Use @react-spectrum/s2 for interactive UI controls and icons
- Semantic HTML elements are allowed where the preview uses them
- Use the style macro for static styles; keep inline style or UNSAFE_style only where runtime values are required
- Keep user-facing text in sentence case
- Preserve accessibility semantics from the preview
- Do not modify any files inside src/_starter/

## Deterministic acceptance checks
- Root container is a full-height column with base background and 32px padding
- A quiet ActionButton with Contrast icon appears in a top-right row and calls onToggleTheme`,
  },
  {
    id: "editing-app",
    name: "Editing app",
    description:
      "A single-pane editing interface with a toolbar and content area, suited for document or asset editing workflows.",
    tags: ["editing", "tools"],
    preview: EditingAppPreview,
    prompt: `Use src/_starter/previews/EditingAppPreview.tsx as the source of truth. Keep values and behavior identical while splitting into the files below.

## File structure
- Create src/components/EditorToolbar.tsx
- Create src/components/EditorCanvas.tsx
- Create src/pages/EditingApp.tsx
- Update src/App.tsx to import EditingApp instead of _starter/StarterPage
- Keep existing Provider/IMSProvider wiring, preview query-param behavior, \`?picker\` query-param routing, and the dev-mode DevToolbar in App.tsx

## Constraints
- Reuse preview implementations by copying/duplicating code into src/components and src/pages; do not import preview components from src/_starter/previews in runtime app code
- Match the preview exactly (layout, spacing, colors, icon choices, aria-labels, and control props)
- Keep selected tool state with default key "select"
- Keep the same logo asset usage from src/assets/B_app_Murtceps.svg
- Use @react-spectrum/s2 controls and icons as in the preview
- Semantic HTML elements are allowed where the preview uses them
- Use the style macro for static styles; keep inline style or UNSAFE_style only where runtime values are required
- Keep user-facing text in sentence case
- Preserve accessibility semantics from the preview
- Do not modify any files inside src/_starter/

## Deterministic acceptance checks
- Header is 56px tall with layer-2 background, logo + "Project", theme toggle, and "Export" button
- Vertical ToggleButtonGroup is fixed at top: 64px and left: 8px, quiet, size M, with ids: select, square, text
- Canvas area is centered and sized to width: 30vw and height: 60vh with layer-2 background`,
  },
  {
    id: "pro-editing-app",
    name: "Pro editing app",
    description:
      "A multi-panel editing interface with a left panel, center canvas, and right inspector, designed for professional creative tools.",
    tags: ["editing", "professional"],
    preview: ProEditingAppPreview,
    prompt: `Use src/_starter/previews/ProEditingAppPreview.tsx as the source of truth. Keep values and behavior identical while splitting into the files below.

## File structure
- Create src/components/AssetPanel.tsx
- Create src/components/Canvas.tsx
- Create src/components/InspectorPanel.tsx
- Create src/components/AppHeader.tsx
- Create src/pages/ProEditingApp.tsx
- Update src/App.tsx to import ProEditingApp instead of _starter/StarterPage
- Keep existing Provider/IMSProvider wiring, preview query-param behavior, \`?picker\` query-param routing, and the dev-mode DevToolbar in App.tsx

## Constraints
- Reuse preview implementations by copying/duplicating code into src/components and src/pages; do not import preview components from src/_starter/previews in runtime app code
- Match the preview exactly (layout, spacing, colors, icon choices, aria-labels, and control props)
- Keep selected tool state with default key "select"
- Keep the same logo asset usage from src/assets/B_app_Murtceps.svg
- Use @react-spectrum/s2 controls and icons as in the preview
- Semantic HTML elements are allowed where the preview uses them
- Use the style macro for static styles; keep inline style or UNSAFE_style only where runtime values are required
- Keep user-facing text in sentence case
- Preserve accessibility semantics from the preview
- Do not modify any files inside src/_starter/

## Deterministic acceptance checks
- Header uses layer-1 background, includes logo + "Project", quiet theme toggle, and "Export" button
- Main work area uses gridTemplateColumns: "auto 1fr 280px"
- Center canvas is 640x400 with layer-2 background and a 1px solid gray-200 border
- Inspector has "Properties" heading and NumberField controls W/X/H/Y with side labels and hidden steppers`,
  },
  {
    id: "browsing-context",
    name: "Browsing context",
    description:
      "A content browsing layout with a collapsible navigation sidebar and a scrollable main area for exploring collections of items.",
    tags: ["browsing", "navigation"],
    preview: BrowsingContextPreview,
    prompt: `Use src/_starter/previews/BrowsingContextPreview.tsx as the source of truth. Keep values and behavior identical while splitting into the files below.

## File structure
- Create src/components/NavSidebar.tsx
- Create src/components/SideNav.tsx
- Create src/components/PanelToggleButton.tsx
- Create src/components/TopBar.tsx
- Create src/components/ContentArea.tsx
- Create src/pages/BrowsingContext.tsx
- Update src/App.tsx to import BrowsingContext instead of _starter/StarterPage
- Keep existing Provider/IMSProvider wiring, preview query-param behavior, \`?picker\` query-param routing, and the dev-mode DevToolbar in App.tsx

## Constraints
- Reuse preview implementations by copying/duplicating code into src/components and src/pages; do not import preview components from src/_starter/previews in runtime app code
- Match the preview exactly (layout, spacing, colors, transitions, icon behavior, aria-labels, and control props)
- Keep the same state defaults: page = "home", sidebar collapsed = false
- Keep color-scheme persistence behavior with localStorage key "chat-s2p-color-scheme" and system fallback via matchMedia
- Keep the custom SideNav behavior based on react-aria-components ToggleButtonGroup/ToggleButton
- Keep PanelToggleButton + custom icon behavior and the same transition timing values
- Use @react-spectrum/s2 and react-aria-components as in the preview
- Semantic HTML elements are allowed where the preview uses them
- Use the style macro for static styles; keep inline style or UNSAFE_style only where runtime values are required
- Keep user-facing text in sentence case
- Preserve accessibility semantics from the preview
- Do not modify any files inside src/_starter/

## Deterministic acceptance checks
- Sidebar column animates between 160px (expanded) and 56px (collapsed) using 180ms cubic-bezier(0.2, 0, 0, 1)
- Navigation contains Home, Files, and Learn items with animated labels
- Toggle button aria-label switches between "Expand sidebar" and "Collapse sidebar"
- Main content area starts with "Lorem ipsum" heading and placeholder paragraphs`,
  },
  {
    id: "bento",
    name: "Bento",
    description:
      "A bento-box grid layout with varied-size content blocks, ideal for dashboards, landing pages, or feature showcases.",
    tags: ["dashboard", "grid"],
    preview: BentoPreview,
    prompt: `Use src/_starter/previews/BentoPreview.tsx as the source of truth. Keep values and behavior identical while splitting into the files below.

## File structure
- Create src/components/BentoCard.tsx
- Create src/components/BentoGrid.tsx
- Create src/pages/BentoLayout.tsx
- Update src/App.tsx to import BentoLayout instead of _starter/StarterPage
- Keep existing Provider/IMSProvider wiring, preview query-param behavior, \`?picker\` query-param routing, and the dev-mode DevToolbar in App.tsx

## Constraints
- Reuse preview implementations by copying/duplicating code into src/components and src/pages; do not import preview components from src/_starter/previews in runtime app code
- Match the preview exactly (layout, spacing, colors, grid spans, gradients, text, and icon usage)
- Keep the CHART_BARS heights and colors exactly as defined in the preview
- Use @react-spectrum/s2 controls and icons as in the preview
- Semantic HTML elements are allowed where the preview uses them
- Use the style macro for static styles; keep inline style or UNSAFE_style only where runtime values are required
- Keep user-facing text in sentence case
- Preserve accessibility semantics from the preview
- Do not modify any files inside src/_starter/

## Deterministic acceptance checks
- Main grid uses 4 equal columns, dense flow, minmax(180px, auto) rows, 16px gap, and 24px side/bottom padding
- Hero card spans 2 columns x 2 rows and includes the purple-to-indigo gradient block
- "Performance overview" renders five bars using CHART_BARS with the specified heights/colors
- "Status" card includes a positive status dot and the text "All systems operational"`,
  },
  {
    id: "text-document",
    name: "Text document",
    description:
      "A long-form document layout with a sidebar outline and optimal reading width, suited for articles, guides, and documentation.",
    tags: ["document", "reading", "content"],
    preview: TextDocumentPreview,
    prompt: `Use src/_starter/previews/TextDocumentPreview.tsx as the source of truth. Keep values and behavior identical while splitting into the files below.

## File structure
- Create src/components/DocumentOutline.tsx
- Create src/components/DocumentContent.tsx
- Create src/pages/TextDocument.tsx
- Update src/App.tsx to import TextDocument instead of _starter/StarterPage
- Keep existing Provider/IMSProvider wiring, preview query-param behavior, \`?picker\` query-param routing, and the dev-mode DevToolbar in App.tsx

## Constraints
- Reuse preview implementations by copying/duplicating code into src/components and src/pages; do not import preview components from src/_starter/previews in runtime app code
- Match the preview exactly (layout, spacing, typography, text content, heading ids, outline behavior, and scroll behavior)
- Keep the headings array entries exactly (id, label, level order) and keep INDENT_PER_LEVEL = 12
- Keep smooth scroll behavior for outline navigation and content container
- Use @react-spectrum/s2 controls and icons as in the preview
- Semantic HTML elements are allowed where the preview uses them
- Use the style macro for static styles; keep inline style or UNSAFE_style only where runtime values are required
- Keep user-facing text in sentence case
- Preserve accessibility semantics from the preview
- Do not modify any files inside src/_starter/

## Deterministic acceptance checks
- Two-column layout uses gridTemplateColumns: "240px 1fr"
- Outline sidebar has "On this page" label and links for all headings with level-based left padding
- Clicking an outline link scrolls to the matching heading id with smooth behavior
- Article content uses maxWidth 720 and includes the same heading/list text as the preview`,
  },
];
