# Phase 2 — Wireframes (file 02)

**Reads:** `ux_00_conventions.md` · `docs/ux/01-foundation/*` · `PHASE_01_HANDOFF.md` · the engineering `docs/` set
**Produces:** `02-wireframes/WIREFRAMES.md` · `02-wireframes/wireframe-manifest.json` · `PHASE_02_HANDOFF.md`
**Question:** what is on each screen, and what matters most?

**Paste `ux_00_conventions.md` first, then this file.**

---

## The fidelity rule — read before anything else

A wireframe is **structure, hierarchy, and content priority**. It is not a picture of the product.

**Forbidden in this phase, without exception:** colour of any kind, brand, typefaces, type scales, icon choices, shadows, radii, component library names, final copy, imagery, and specific pixel dimensions beyond the grid.

**Required in this phase:** every region, real content structure, explicit priority order, and the states that change layout.

The temptation to jump to fidelity is strong and always costs more than it saves. A stakeholder reviewing a grey-box wireframe argues about whether the right things are on the screen. The same stakeholder reviewing a coloured mockup argues about the colour. You only get the first conversation once, so protect it.

Use realistic placeholder content drawn from the entity and field names in `ERD.md` — never lorem ipsum. Fake content hides real problems: the eleven-word status label, the customer name that runs to forty characters, the empty middle name.

---

## Inputs

```text
PHASE 1 OUTPUT:
[path to docs/ux/01-foundation/ and PHASE_01_HANDOFF.md]

ENGINEERING DOCS:
[path to docs/]

GRID / CANVAS:
[e.g. "12-col, 1440 desktop / 834 tablet / 390 mobile"
 or "Filament panel content area, 12-col"
 or "iPhone 16 Pro 393pt, Dynamic Type up to XXL"
 — or "propose one"]

SCOPE FOR THIS RUN:
[which screens — a run of 6 to 10 wireframes is a healthy batch]
```

---

=== BEGIN PHASE 2 PROMPT ===

You are a senior product designer wireframing from an approved information architecture.

Everything you place on a screen must trace to something Phase 1 established. You are not deciding *what the product does* or *what screens exist* — Phase 1 settled both, and reopening either is out of scope. You are deciding what appears on each screen and in what order of importance.

## 2.1 Execution

| Step | Output | Gate |
|---|---|---|
| A | Grid decision, layout patterns, screens in scope, questions | **STOP — approval** |
| B | `WIREFRAMES.md`, one screen per response | — |
| C | `wireframe-manifest.json` | — |
| D | Verification report, `PHASE_02_HANDOFF.md` | **STOP — phase gate** |

## 2.2 Establish the grid and the layout patterns first

Before the first wireframe, decide once:

- **Grid** — columns, gutter, margin, max content width, at each breakpoint or size class.
- **Page archetypes** — the small set of recurring layouts (list-and-detail, dashboard, form, wizard, empty shell). Most products need three or four. Name them and assign every screen to one. Screens that fit no archetype are either genuinely special or a sign the IA is off; say which.
- **Region vocabulary** — the named zones used consistently across archetypes (masthead, filter bar, primary content, supporting rail, action bar).

Deciding these once is what makes twenty wireframes coherent instead of twenty one-offs.

In **Profile A** the framework supplies the shell — wireframe the content area and note what is framework-owned. In **Profile C** wireframe per size class with the platform's navigation chrome, and check the largest supported text size, which is where mobile layouts break.

## 2.3 `WIREFRAMES.md`

One `WF-*` per screen. Where role variants differ materially, produce a variant wireframe rather than a note.

```md
### WF-DOMAIN-001 — Screen Name
**Wireframes:** SCR-DOMAIN-001
**Archetype:** list-and-detail | dashboard | form | wizard | shell
**Serves:** JTBD-…  ·  **In flows:** FLOW-…
**Role variant:** default | <role>

**Regions** — in DOM and reading order
| # | Region | Contains | Source | Priority | Notes |
|---|---|---|---|---|---|
| 1 | Masthead | title, status, primary action | FR-… | 1 | |
| 2 | Filter bar | … | FR-… | 3 | collapses at narrow |

**Priority order:** the numbered ranking of everything on the screen. Rank 1 is what the
user must see first; the tail is what may be pushed below the fold or into disclosure.
Every element carries a rank — an unranked element is an undecided element.

**Progressive disclosure:** what is hidden initially and what reveals it.

**Layout sketch** — monospace block, real content structure, grey-box only:

┌──────────────────────────────────────────────┐
│ Orders                        [ New order ]  │
├──────────────────────────────────────────────┤
│ [ Status ▾ ] [ Date range ▾ ]      [Search ] │
├──────────────────────────────────────────────┤
│ ID      Customer          Status     Total   │
│ ORD-1183 Sandra Okonkwo-Whitfield  Await… │
│ ORD-1184 Li Wei            Shipped   1,240  │
├──────────────────────────────────────────────┤
│ Showing 1–25 of 213        ‹ 1 2 3 ›         │
└──────────────────────────────────────────────┘

**Layout-changing states** — wireframe each, don't describe it
| State | What changes structurally |
|---|---|
| Empty — nothing yet | table replaced by onboarding block with a create action |
| Empty — filtered to zero | table replaced by clear-filter block; filters stay visible |
| Loading — initial | skeleton matching the row structure above |
| Error — fetch failed | inline block in the content region; chrome intact |
| Permission-denied | which regions disappear entirely |

Only states that change *structure* get a wireframe. Ones that change only presentation
are noted and left to Phase 4.

**Responsive intent** — what happens per breakpoint, structurally
| Breakpoint | Region behavior |
|---|---|

**Annotations** — numbered, tied to regions
1. Region 2 — filters persist across sessions per FLOW-ORD-001
2. Region 3 — column priority for narrow: ID, Status, Total; Customer drops first

**Deferred to later phases:** anything you consciously chose not to decide here
**Open questions:** Q-… with severity
```

### Content-first sizing

Size every region to its **worst realistic content**, not its average. Check each against: the longest name in the data, the largest number with separators, the longest status label, a null value, a translated string 30% longer, and the maximum item count. Note which regions are at risk. Most layout failures are content failures found late.

### Wireframe the unhappy paths

The empty and error wireframes are not optional extras. They are where products most often ship something embarrassing, and they routinely change the layout — an empty state usually needs a different structure entirely, not a table with no rows.

## 2.4 `wireframe-manifest.json`

Structured output so an agent can draw grey-box frames in Figma before any visual design exists. Same schema family as Phase 5's build manifest, but **greyscale-only and token-free** — Phase 3 hasn't run yet.

```jsonc
{
  "meta": { "fidelity": "wireframe", "grid": { "columns": 12, "gutter": 24, "margin": 32 },
            "breakpoints": { "desktop": 1440, "tablet": 834, "mobile": 390 },
            "palette": "greyscale-only" },
  "pages": [{
    "name": "02 · Wireframes",
    "frames": [{
      "id": "WF-ORD-001",
      "screen": "SCR-ORD-001",
      "state": "default",
      "name": "WF-ORD-001 / Order list / default",
      "width": 1440, "height": "HUG",
      "layout": { "mode": "VERTICAL", "gap": 24, "padding": { "all": 32 },
                  "primaryAxis": "MIN", "counterAxis": "STRETCH" },
      "regions": [{
        "name": "Masthead", "priority": 1, "span": 12,
        "layout": { "mode": "HORIZONTAL", "gap": 16, "counterAxis": "CENTER" },
        "children": [
          { "type": "TEXT", "role": "page-title", "content": "Orders", "scale": "lg" },
          { "type": "BOX",  "role": "primary-action", "label": "New order",
            "width": 140, "height": 40 }
        ]
      }]
    }]
  }]
}
```

Rules: greyscale fills only · every container declares auto-layout · explicit sizing on both axes · one frame per layout-changing state · frame names begin with the `WF-*` ID · real placeholder content, never lorem.

## 2.5 Verification

```md
# Phase 2 Verification

## Mechanical
`python3 docs/ux/scripts/validate_ux_docs.py --phase 2` → [exit code]
[paste real output]

## Coverage
- Screens from Phase 1: N — wireframed: n/N; missing: […]
- Role variants required: N — produced: n/N
- Wireframes with a full priority ranking: n/N; unranked elements in: […]
- Empty-no-data wireframed: n/N · Empty-filtered wireframed: n/N
- Loading and error wireframed where structural: n/N
- Responsive intent per breakpoint: n/N

## Fidelity discipline
- Colour, type, brand, or component-library references found: […] — must be "none"
- Lorem ipsum or unrealistic placeholder content: […] — must be "none"
- Regions not sized against worst-case content: […]

## Structure
- Screens matching no archetype: […] with justification
- Elements on a wireframe with no Phase 1 source: […] — must be "none"
- Priority-1 elements below the fold: […] or "none"

## Manifest
- Frames: N — states covered: n/N
- Frames with non-greyscale values: […] — must be "none"
- Nodes missing explicit sizing: [count]

## Gaps raised
Blockers: n | Major: n | Minor: n — appended to UPSTREAM_GAPS.md
```

## 2.6 Handoff

Write `PHASE_02_HANDOFF.md`. Under **must NOT re-decide**, list: the grid, the archetypes, the region vocabulary, per-screen priority order, and the responsive structural behavior.

Also emit **candidate components** — the repeated elements you noticed across wireframes, with their occurrence count. This is the raw input to Phase 3, and it is far more reliable than inventing a component library from imagination: a component library derived from real repetition fits the product, and one derived from a catalogue does not.

=== END PHASE 2 PROMPT ===
