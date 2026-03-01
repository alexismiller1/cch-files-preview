import { ActionButton } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import Contrast from "@react-spectrum/s2/icons/Contrast";

import type { PreviewProps } from "../layouts/types";

interface HeadingEntry {
  id: string;
  label: string;
  level: number;
}

const headings: HeadingEntry[] = [
  { id: "understanding-document-structure", label: "Understanding document structure", level: 1 },
  { id: "the-role-of-headings", label: "The role of headings", level: 2 },
  { id: "first-level-h1", label: "First level: H1", level: 3 },
  { id: "second-level-h2", label: "Second level: H2", level: 3 },
  { id: "third-level-h3", label: "Third level: H3", level: 3 },
  { id: "fourth-through-sixth-levels", label: "Fourth through sixth levels", level: 3 },
  { id: "ordered-lists", label: "Ordered lists", level: 2 },
  { id: "when-sequence-matters", label: "When sequence matters", level: 3 },
  { id: "unordered-lists", label: "Unordered lists", level: 2 },
  { id: "grouping-related-items", label: "Grouping related items", level: 3 },
  { id: "nesting-lists", label: "Nesting lists", level: 3 },
  { id: "bringing-it-all-together", label: "Bringing it all together", level: 2 },
];

const INDENT_PER_LEVEL = 12;

function handleOutlineClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function TextDocumentPreview({ onToggleTheme }: PreviewProps) {
  return (
    <div
      className={style({
        display: "flex",
        flexDirection: "column",
        height: "full",
        backgroundColor: "base",
      })}
    >
      {/* Top bar */}
      <div
        className={style({
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          paddingX: 24,
          paddingY: 12,
        })}
      >
        <ActionButton isQuiet aria-label="Toggle color scheme" onPress={onToggleTheme}>
          <Contrast />
        </ActionButton>
      </div>

      {/* Main body: sidebar + content */}
      <div
        className={style({
          display: "grid",
          flexGrow: 1,
          overflow: "hidden",
          paddingBottom: 56,
        })}
        style={{ gridTemplateColumns: "240px 1fr" }}
      >
        {/* Outline sidebar */}
        <nav
          aria-label="Document outline"
          className={style({
            overflow: "auto",
            paddingX: 20,
          })}
        >
          <p
            className={style({
              font: "detail",
              fontWeight: "bold",
              color: "detail",
              marginTop: 0,
              marginBottom: 16,
              letterSpacing: 0.5,
            })}
          >
            On this page
          </p>
          <ul
            style={{ listStyle: "none", margin: 0, padding: 0 }}
          >
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleOutlineClick(e, h.id)}
                      className={style({
                    font: "body-sm",
                    color: "body",
                    display: "block",
                    paddingY: 4,
                    borderStartWidth: 2,
                    borderStyle: "solid",
                    borderColor: "transparent",
                    textDecoration: "none",
                    transition: "default",
                  })}
                  style={{
                    paddingLeft: 12 + (h.level - 1) * INDENT_PER_LEVEL,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = "var(--spectrum-accent-visual-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderLeftColor = "transparent";
                  }}
                >
                  {h.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Document content */}
        <main
          className={style({
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
          })}
          style={{ scrollBehavior: "smooth" }}
        >
          <article
            className={style({
              paddingX: 48,
              paddingTop: 40,
              paddingBottom: 80,
            })}
            style={{ maxWidth: 720 }}
          >
            {/* H1 */}
            <h1
              id="understanding-document-structure"
              className={style({
                font: "heading-xl",
                marginTop: 0,
                marginBottom: 8,
              })}
            >
              Understanding document structure
            </h1>
            <p
              className={style({
                font: "body-lg",
                color: "detail",
                marginTop: 0,
                marginBottom: 40,
              })}
            >
              A guide to headings, hierarchy, and lists
            </p>
            <hr
              className={style({
                borderWidth: 0,
                borderTopWidth: 1,
                borderStyle: "solid",
                borderColor: "gray-200",
                marginBottom: 40,
              })}
            />
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
            >
              Every well-crafted document relies on a clear, logical structure. Structure
              is what transforms a wall of text into something a reader can navigate with
              confidence. When content is organized using headings, subheadings, and lists,
              readers can scan for the information they need, assistive technologies can
              build navigable outlines, and search engines can better understand the
              content of a page.
            </p>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 48,
                lineHeight: "body",
              })}
            >
              This document walks through the building blocks of text hierarchy. You will
              learn how headings create a table of contents, how ordered and unordered
              lists present information efficiently, and how these elements work together
              to produce content that is both beautiful and accessible.
            </p>

            {/* H2: The role of headings */}
            <h2
              id="the-role-of-headings"
              className={style({
                font: "heading-lg",
                marginTop: 0,
                marginBottom: 16,
              })}
            >
              The role of headings
            </h2>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
            >
              Headings divide a document into sections and subsections. They range from H1,
              the broadest and most prominent, down to H6, the most granular. Think of them
              as a nesting system: each level sits inside the one above it, much like
              chapters contain sections, which contain subsections.
            </p>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 32,
                lineHeight: "body",
              })}
            >
              A consistent heading hierarchy is not merely a visual nicety. Screen readers
              allow users to jump between headings, so skipping levels (for example, going
              from H2 directly to H5) creates a confusing experience. Always step down one
              level at a time.
            </p>

            {/* H3: First level */}
            <h3
              id="first-level-h1"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              First level: H1
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 32,
                lineHeight: "body",
              })}
            >
              The H1 heading is the title of the entire document or page. There should
              typically be only one H1 per page, serving as the single, top-level
              description of what the content is about. It carries the most visual weight
              and sets the tone for everything that follows.
            </p>

            {/* H3: Second level */}
            <h3
              id="second-level-h2"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              Second level: H2
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 32,
                lineHeight: "body",
              })}
            >
              H2 headings mark major sections beneath the page title. They are the primary
              way readers orient themselves within a longer document. If the H1 is the book
              title, the H2 headings are the chapter names. Each H2 should introduce a
              distinct topic or theme.
            </p>

            {/* H3: Third level */}
            <h3
              id="third-level-h3"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              Third level: H3
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 32,
                lineHeight: "body",
              })}
            >
              H3 headings break an H2 section into smaller parts. They add nuance without
              introducing an entirely new topic. For most documents, three levels of
              heading (H1, H2, and H3) provide sufficient depth. Deeper nesting is
              available when subject matter demands it.
            </p>

            {/* H3: Fourth through sixth levels */}
            <h3
              id="fourth-through-sixth-levels"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              Fourth through sixth levels
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              Levels four through six are reserved for highly detailed or technical
              documents. Below is a demonstration of each.
            </p>
            <h4
              className={style({
                font: "heading-sm",
                marginTop: 24,
                marginBottom: 8,
              })}
            >
              Fourth level: H4
            </h4>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              An H4 heading sits beneath an H3. Use it when a subsection itself needs to
              be divided further. Technical specifications, API references, and legal
              documents sometimes require this level of detail.
            </p>
            <h5
              className={style({
                font: "heading-xs",
                marginTop: 20,
                marginBottom: 8,
              })}
            >
              Fifth level: H5
            </h5>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              H5 headings are rarely needed outside of dense reference material. They
              indicate a very fine-grained subdivision of content.
            </p>
            <h6
              className={style({
                font: "heading-2xs",
                marginTop: 16,
                marginBottom: 8,
              })}
            >
              Sixth level: H6
            </h6>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 48,
                lineHeight: "body",
              })}
            >
              The H6 heading is the deepest available level. If you find yourself needing
              it frequently, consider whether your document would benefit from being split
              into multiple pages instead.
            </p>

            <hr
              className={style({
                borderWidth: 0,
                borderTopWidth: 1,
                borderStyle: "solid",
                borderColor: "gray-200",
                marginBottom: 48,
              })}
            />

            {/* H2: Ordered lists */}
            <h2
              id="ordered-lists"
              className={style({
                font: "heading-lg",
                marginTop: 0,
                marginBottom: 16,
              })}
            >
              Ordered lists
            </h2>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
            >
              An ordered list communicates that the sequence of items matters. Readers
              understand that item one comes before item two, and that the order carries
              meaning. Use ordered lists for step-by-step instructions, rankings,
              priorities, or any content where position is significant.
            </p>

            {/* H3: When sequence matters */}
            <h3
              id="when-sequence-matters"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              When sequence matters
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              Consider the steps required to publish a document:
            </p>
            <ol
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
              style={{ paddingLeft: 24 }}
            >
              <li>Draft the content in a text editor</li>
              <li>Review the draft for clarity and accuracy</li>
              <li>Apply formatting using headings and lists</li>
              <li>Run an accessibility check</li>
              <li>Publish to the intended platform</li>
            </ol>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 16,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              Reordering any of these steps would change the outcome. That inherent
              dependency is what makes an ordered list the right choice. Here is another
              example, ranking priorities for a design system:
            </p>
            <ol
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 48,
                lineHeight: "body",
              })}
              style={{ paddingLeft: 24 }}
            >
              <li>Accessibility and inclusivity</li>
              <li>Consistency across products</li>
              <li>Developer ergonomics</li>
              <li>Visual refinement</li>
            </ol>

            <hr
              className={style({
                borderWidth: 0,
                borderTopWidth: 1,
                borderStyle: "solid",
                borderColor: "gray-200",
                marginBottom: 48,
              })}
            />

            {/* H2: Unordered lists */}
            <h2
              id="unordered-lists"
              className={style({
                font: "heading-lg",
                marginTop: 0,
                marginBottom: 16,
              })}
            >
              Unordered lists
            </h2>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
            >
              An unordered list groups related items without implying sequence. Each item
              is a peer of equal importance. Use unordered lists for feature inventories,
              ingredient lists, collections of options, or any set where order is
              arbitrary.
            </p>

            {/* H3: Grouping related items */}
            <h3
              id="grouping-related-items"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              Grouping related items
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              Benefits of a clear document structure:
            </p>
            <ul
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 32,
                lineHeight: "body",
              })}
              style={{ paddingLeft: 24 }}
            >
              <li>Readers find information faster</li>
              <li>Assistive technologies can generate navigable outlines</li>
              <li>Content is easier to maintain and update</li>
              <li>Translations become more consistent</li>
              <li>Search engines index the page more effectively</li>
            </ul>

            {/* H3: Nesting lists */}
            <h3
              id="nesting-lists"
              className={style({
                font: "heading",
                marginTop: 0,
                marginBottom: 12,
              })}
            >
              Nesting lists
            </h3>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 16,
                lineHeight: "body",
              })}
            >
              Lists can be nested inside one another to express sub-groupings. Keep
              nesting to two levels at most to maintain readability.
            </p>
            <ul
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 48,
                lineHeight: "body",
              })}
              style={{ paddingLeft: 24 }}
            >
              <li>
                Text formatting
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  <li>Bold for emphasis</li>
                  <li>Italic for titles or foreign terms</li>
                  <li>Monospace for code or technical values</li>
                </ul>
              </li>
              <li>
                Structural elements
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  <li>Headings for hierarchy</li>
                  <li>Lists for collections</li>
                  <li>Blockquotes for cited material</li>
                </ul>
              </li>
              <li>
                Visual aids
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  <li>Tables for comparative data</li>
                  <li>Images for illustration</li>
                  <li>Diagrams for processes</li>
                </ul>
              </li>
            </ul>

            <hr
              className={style({
                borderWidth: 0,
                borderTopWidth: 1,
                borderStyle: "solid",
                borderColor: "gray-200",
                marginBottom: 48,
              })}
            />

            {/* H2: Bringing it all together */}
            <h2
              id="bringing-it-all-together"
              className={style({
                font: "heading-lg",
                marginTop: 0,
                marginBottom: 16,
              })}
            >
              Bringing it all together
            </h2>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
            >
              A well-structured document is an act of respect toward the reader. Headings
              provide a map, lists organize details into scannable groups, and consistent
              hierarchy ensures that no one gets lost. When these elements work in concert,
              the result is content that feels effortless to consume, regardless of whether
              it is read visually, heard through a screen reader, or parsed by a machine.
            </p>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
            >
              The principles are simple:
            </p>
            <ol
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 24,
                lineHeight: "body",
              })}
              style={{ paddingLeft: 24 }}
            >
              <li>Use one H1 per page as the document title</li>
              <li>Step through heading levels sequentially</li>
              <li>Choose ordered lists when sequence matters</li>
              <li>Choose unordered lists when items are peers</li>
              <li>Limit list nesting to two levels</li>
            </ol>
            <p
              className={style({
                font: "body-lg",
                color: "body",
                marginTop: 0,
                marginBottom: 0,
                lineHeight: "body",
              })}
            >
              With these foundations in place, every document you create will be clear,
              navigable, and accessible to the widest possible audience.
            </p>
          </article>
        </main>
      </div>
    </div>
  );
}
