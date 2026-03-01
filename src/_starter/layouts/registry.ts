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
    prompt: `Use the layout defined in src/_starter/previews/BlankPreview.tsx as the reference implementation.

## File structure
- Create src/pages/BlankPage.tsx
- Update src/App.tsx to import BlankPage instead of _starter/StarterPage

Reproduce the preview's visual structure, spacing, colors, and components exactly.

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
    preview: EditingAppPreview,
    prompt: `Use the layout defined in src/_starter/previews/EditingAppPreview.tsx as the reference implementation.

## File structure
- Create src/components/EditorToolbar.tsx
- Create src/components/EditorCanvas.tsx
- Create src/pages/EditingApp.tsx
- Update src/App.tsx to import EditingApp instead of _starter/StarterPage

Split the preview's single-file layout into the components listed above.
Match the preview's visual structure, spacing, colors, and S2 components exactly.

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
    preview: ProEditingAppPreview,
    prompt: `Use the layout defined in src/_starter/previews/ProEditingAppPreview.tsx as the reference implementation.

## File structure
- Create src/components/AssetPanel.tsx
- Create src/components/Canvas.tsx
- Create src/components/InspectorPanel.tsx
- Create src/components/AppHeader.tsx
- Create src/pages/ProEditingApp.tsx
- Update src/App.tsx to import ProEditingApp instead of _starter/StarterPage

Split the preview's single-file layout into the components listed above.
Match the preview's visual structure, spacing, colors, and S2 components exactly.

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
      "A content browsing layout with a collapsible navigation sidebar and a scrollable main area for exploring collections of items.",
    tags: ["browsing", "navigation"],
    preview: BrowsingContextPreview,
    prompt: `Use the layout defined in src/_starter/previews/BrowsingContextPreview.tsx as the reference implementation.

## File structure
- Create src/components/NavSidebar.tsx
- Create src/components/SideNav.tsx
- Create src/components/PanelToggleButton.tsx
- Create src/components/TopBar.tsx
- Create src/components/ContentArea.tsx
- Create src/pages/BrowsingContext.tsx
- Update src/App.tsx to import BrowsingContext instead of _starter/StarterPage

Split the preview's single-file layout into the components listed above.
Match the preview's visual structure, spacing, colors, animations, and S2 components exactly.
Preserve the collapsible sidebar transitions and custom SideNav behavior.

## Constraints
- Use only @react-spectrum/s2 components and react-aria-components
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
    preview: BentoPreview,
    prompt: `Use the layout defined in src/_starter/previews/BentoPreview.tsx as the reference implementation.

## File structure
- Create src/components/BentoCard.tsx
- Create src/components/BentoGrid.tsx
- Create src/pages/BentoLayout.tsx
- Update src/App.tsx to import BentoLayout instead of _starter/StarterPage

Split the preview's single-file layout into the components listed above.
Match the preview's visual structure, spacing, colors, and grid layout exactly.

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
  {
    id: "text-document",
    name: "Text document",
    description:
      "A long-form document layout with a sidebar outline and optimal reading width, suited for articles, guides, and documentation.",
    tags: ["document", "reading", "content"],
    preview: TextDocumentPreview,
    prompt: `Use the layout defined in src/_starter/previews/TextDocumentPreview.tsx as the reference implementation.

## File structure
- Create src/components/DocumentOutline.tsx
- Create src/components/DocumentContent.tsx
- Create src/pages/TextDocument.tsx
- Update src/App.tsx to import TextDocument instead of _starter/StarterPage

Split the preview's single-file layout into the components listed above.
Match the preview's visual structure, spacing, colors, typography, and scroll behavior exactly.

## Constraints
- Use only @react-spectrum/s2 components
- Use the style macro for all styling
- Sentence case for all text
- WCAG 2.2 AA compliant
- Do not modify any files inside src/_starter/`,
  },
];
