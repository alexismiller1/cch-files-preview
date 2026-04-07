# Codex and .mdc file compatibility analysis

## Problem statement

This project uses `.mdc` files (Cursor's rule format) to provide persistent agent instructions in `.cursor/rules/` and `.agents/rules/`. OpenAI's Codex app does not recognize `.mdc` files, so when the project is opened in Codex, all rule files are silently ignored. The question: can Codex `.rules` files serve as an index to force Codex to read `.mdc` content?

---

## Atomic decomposition

### Atom 1: Codex `.rules` files serve a different purpose than `.mdc` files

**Logical component**: Codex `.rules` files (Starlark format, stored in `.codex/rules/`) are command-execution sandboxing policies. They define `prefix_rule()` entries that control whether a shell command is allowed, prompted, or forbidden. They cannot contain markdown instructions, reference external files, or influence agent behavior beyond command gating.

**Independence**: This atom is self-contained. The `.rules` mechanism is orthogonal to agent instruction discovery.

**Correctness**: Confirmed by the [Codex rules documentation](https://developers.openai.com/codex/rules). The only construct available is `prefix_rule()` with `pattern`, `decision`, `justification`, `match`, and `not_match` fields. There is no `include`, `read_file`, or instruction-passing facility.

**Conclusion**: `.rules` files cannot index or reference `.mdc` files. This path is a dead end.

---

### Atom 2: Codex uses `AGENTS.md` for agent instructions, not `.rules`

**Logical component**: Codex discovers persistent agent instructions through `AGENTS.md` files, walking from the project root to the current working directory. At each level it checks for `AGENTS.override.md`, then `AGENTS.md`, then any names in `project_doc_fallback_filenames`. The content is plain markdown.

**Independence**: This is independent of Atom 1. The instruction system and the command-policy system are separate subsystems in Codex.

**Correctness**: Confirmed by [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md) and [Customization](https://developers.openai.com/codex/concepts/customization). Codex concatenates discovered files in directory order, with closer files taking precedence.

---

### Atom 3: `project_doc_fallback_filenames` accepts exact filenames, not glob patterns or extensions

**Logical component**: The `project_doc_fallback_filenames` config option (set in `.codex/config.toml`) lets you add alternative filenames that Codex treats as instruction files. However, these are exact filename matches per directory (e.g., `"TEAM_GUIDE.md"`), not glob patterns or extension matchers.

**Independence**: Depends on Atom 2 (part of the same discovery chain).

**Correctness**: Confirmed by [Advanced Configuration](https://developers.openai.com/codex/config-advanced). Example: `project_doc_fallback_filenames = ["TEAM_GUIDE.md", ".agents.md"]`. You cannot write `"*.mdc"` or `".agents/rules/*.mdc"`.

**Conclusion**: You cannot make Codex auto-discover `.mdc` files through this config alone.

---

### Atom 4: `.mdc` frontmatter is Cursor-specific metadata

**Logical component**: `.mdc` files use YAML frontmatter (`alwaysApply`, `globs`, `description`) that controls when Cursor injects the rule into context. Codex has no equivalent parser for this frontmatter. Even if Codex read an `.mdc` file verbatim, it would not understand the activation semantics.

**Independence**: Independent. This is about file-format compatibility, separate from discovery mechanisms.

**Correctness**: Verified by inspecting the project's `.mdc` files. The frontmatter governs Cursor-specific behavior:
- `alwaysApply: true` means "inject into every conversation"
- `globs: ["**/*.tsx"]` means "inject when working on matching files"
- `alwaysApply: false` means "inject only when referenced or glob-matched"

---

### Atom 5: Codex Skills parallel Cursor's conditional rules

**Logical component**: Codex Skills (stored in `.agents/skills/`) use a `SKILL.md` file with YAML frontmatter (`name`, `description`) and optional `scripts/` and `references/` directories. Codex uses progressive disclosure: it reads metadata first, then loads full content when a skill matches the task. This is analogous to Cursor rules with `alwaysApply: false` and `globs`.

**Independence**: Independent of file discovery. Skills are a separate loading mechanism.

**Correctness**: Confirmed by [Codex Customization docs](https://developers.openai.com/codex/concepts/customization). Skills are discovered by metadata, loaded on demand.

---

### Atom 6: the 32 KiB default limit constrains what fits in AGENTS.md

**Logical component**: Codex caps combined instruction content at `project_doc_max_bytes` (default 32,768 bytes). The project's `.mdc` files total roughly 20-25 KB of markdown content (excluding the 160 KB charts helper). Inlining everything into `AGENTS.md` would approach or exceed this limit.

**Independence**: Depends on solution choice. Only relevant for AGENTS.md-based approaches.

**Correctness**: Confirmed by [Advanced Configuration](https://developers.openai.com/codex/config-advanced). The limit can be raised but doing so increases first-turn context cost.

---

### Atom 7: the project must work in both Cursor and Codex

**Logical component**: Any solution must preserve Cursor's `.mdc` rule loading while adding Codex compatibility. Content duplication creates a maintenance risk where the two systems diverge over time.

**Independence**: Cross-cutting constraint on all solutions.

**Correctness**: Architectural requirement stated in the problem.

---

## Current file inventory

| .mdc file | alwaysApply | Size (approx.) | Codex equivalent |
|---|---|---|---|
| `spectrum-content-guidelines.mdc` | true | 7 KB | AGENTS.md |
| `s2-general.mdc` | true | 2 KB | AGENTS.md |
| `services.mdc` | true | 2 KB | AGENTS.md |
| `icons.mdc` | true (globs: tsx/ts/jsx/js) | 5 KB | AGENTS.md or Skill |
| `code-verification.mdc` | true | 2.5 KB | AGENTS.md |
| `build-vite.mdc` | false | 3.5 KB | Skill |
| `generate-prd.mdc` | (no frontmatter) | 5 KB | Skill |
| `react-spectrum-charts-helper.mdc` | unknown | 160 KB | Skill (too large for AGENTS.md) |

---

## Solutions

### Solution A: build script that compiles .mdc into AGENTS.md

**Approach**: Write a Node.js (or shell) script that reads all `.mdc` files, strips Cursor-specific frontmatter, and assembles the content into `AGENTS.md`. Run the script as a pre-commit hook or npm script. The `.mdc` files remain the single source of truth.

**How it works**:
1. Script reads `.agents/rules/*.mdc` and `.cursor/rules/*.mdc`
2. Parses YAML frontmatter; filters for `alwaysApply: true` rules
3. Extracts markdown body, concatenates into `AGENTS.md`
4. Conditional rules (`alwaysApply: false`) get converted to Codex Skills under `.agents/skills/`
5. `AGENTS.md` is a generated file (add a "do not edit" header)

**Pros**:
- Single source of truth (`.mdc` files are canonical)
- No manual sync needed
- Works within Codex's native discovery
- Can be integrated into CI/CD

**Cons**:
- Requires a build step
- Generated `AGENTS.md` in version control can cause noisy diffs
- Does not preserve Cursor's glob-based activation semantics in Codex

---

### Solution B: manual dual-format files (AGENTS.md references .mdc content)

**Approach**: Maintain a hand-written `AGENTS.md` that contains the most critical rules inline, plus a directive telling Codex to read specific `.mdc` files when relevant.

**How it works**:
1. `AGENTS.md` contains the always-apply rules directly
2. Includes a section like: "When working on icon imports, read `.agents/rules/icons.mdc` for detailed guidance"
3. Codex's file-reading tools can open `.mdc` files when instructed

**Pros**:
- No build step
- AGENTS.md stays concise (under 32 KiB)
- Codex can read any file when told to

**Cons**:
- Relies on agent compliance (Codex may or may not follow the "read this file" instruction every time)
- Duplicates some content between AGENTS.md and .mdc files
- Manual maintenance of the index

---

### Solution C: convert always-apply rules to AGENTS.md, conditional rules to Codex Skills

**Approach**: A hybrid architecture. Rules marked `alwaysApply: true` get ported into `AGENTS.md`. Rules with `globs` or `alwaysApply: false` become Codex Skills. The `.mdc` files remain for Cursor.

**How it works**:
1. Create `AGENTS.md` with content from: `spectrum-content-guidelines`, `s2-general`, `services`, `code-verification`
2. Create Codex Skills for: `build-vite`, `generate-prd`, `icons` (with appropriate `name`/`description` in SKILL.md)
3. The `react-spectrum-charts-helper` becomes a Skill with references
4. Keep `.mdc` files unchanged for Cursor

**Pros**:
- Uses each tool's native mechanism
- Skills provide progressive disclosure (Codex loads them only when relevant)
- Respects the 32 KiB AGENTS.md limit
- No build step

**Cons**:
- Content exists in two places (`.mdc` for Cursor, `.md`/`SKILL.md` for Codex)
- Manual sync when rules change
- Different activation semantics (Cursor globs vs. Codex skill matching)

---

### Solution D: use `project_doc_fallback_filenames` with a Codex-specific index file

**Approach**: Create a `.codex/config.toml` that adds a custom fallback filename (e.g., `RULES.md`). Place `RULES.md` files in the `.agents/rules/` directory that Codex discovers during its directory walk.

**How it works**:
1. Add `.codex/config.toml` with `project_doc_fallback_filenames = ["RULES.md"]`
2. Create `.agents/rules/RULES.md` that contains the compiled rule content
3. Codex walks into `.agents/rules/` only if you `cd` there, so this has limited utility

**Pros**:
- Uses Codex's native config mechanism
- No build step

**Cons**:
- Codex only reads fallback files in directories on the path from root to CWD
- Since `.agents/rules/` is not typically a working directory, Codex would never walk into it
- Effectively requires putting content in root `AGENTS.md` anyway

---

### Solution E: build script (automated, recommended variant of Solution A)

**Approach**: An npm script (`pnpm run sync-rules`) that:
1. Reads all `.mdc` files
2. Separates always-apply vs. conditional rules using frontmatter
3. Writes always-apply content into `AGENTS.md` (appending to the existing base content)
4. Writes conditional rules as Codex `SKILL.md` files
5. Runs on `pre-commit` or as a manual step

```
pnpm run sync-rules
├── reads .agents/rules/*.mdc
├── reads .cursor/rules/*.mdc (deduplicates)
├── always-apply rules → appends to AGENTS.md
└── conditional rules → .agents/skills/{rule-name}/SKILL.md
```

---

## Recommendation: Solution E (automated build script)

Solution E is the strongest approach for this project because:

1. **Single source of truth**: `.mdc` files remain canonical. No content divergence.
2. **Automated**: Eliminates human error in syncing two formats.
3. **Native to both tools**: Cursor reads `.mdc`, Codex reads generated `AGENTS.md` and Skills.
4. **Handles the size constraint**: Always-apply rules fit within 32 KiB; large conditional rules become Skills with progressive disclosure.
5. **Preserves activation semantics**: `alwaysApply: true` maps to `AGENTS.md` (loaded every session). Conditional rules map to Skills (loaded on demand by description matching).

### Implementation outline

1. Create `scripts/sync-rules.mjs` that:
   - Scans `.agents/rules/*.mdc` and `.cursor/rules/*.mdc`
   - Parses YAML frontmatter with a lightweight parser (e.g., `gray-matter` or regex)
   - Splits rules by `alwaysApply` value
   - Generates `AGENTS.md` with a header block (project info, commands, auth) followed by compiled always-apply rules
   - Generates `SKILL.md` files for conditional rules
2. Add `"sync-rules": "node scripts/sync-rules.mjs"` to `package.json`
3. Optionally add a git pre-commit hook that runs the script
4. Add a comment at the top of `AGENTS.md`: `<!-- Generated by scripts/sync-rules.mjs from .mdc files. Do not edit directly. -->`

### Why not `.rules` files

To directly answer the original question: no, Codex `.rules` files cannot serve as an index for `.mdc` content. They are Starlark command-execution policies (`prefix_rule()` only) with no facility to reference, include, or instruct the agent to read other files. The correct Codex mechanism for agent instructions is `AGENTS.md` plus Skills.
