# Phase 3 — Design System (file 03)

**Reads:** `ux_00_conventions.md` · `01-foundation/*` · `02-wireframes/*` · `PHASE_02_HANDOFF.md`
**Produces:** `03-system/DESIGN_TOKENS.md` + `tokens/*.json` · `COMPONENT_INVENTORY.md` · `INTERACTION_PATTERNS.md` · `CONTENT_GUIDE.md` · `ACCESSIBILITY.md` · `PHASE_03_HANDOFF.md`
**Question:** what is everything made of?

**Paste `ux_00_conventions.md` first, then this file.**

---

## The derivation rule

**The component inventory comes from the wireframes, not from a catalogue.** Phase 2 handed over candidate components with occurrence counts. Those counts are the evidence. A component appearing in seven wireframes is real; a date picker nothing uses is speculative inventory that will rot.

The same applies to tokens. The type scale has as many steps as the wireframes' priority rankings actually need. The colour system has the semantic roles the states require. Building a 60-token scale when the product uses nine is not thoroughness, it's cost with no benefit.

This is the first phase where visual decisions are legitimate. It is also the first phase where a human must approve taste, not just correctness — so the direction gate is real, not ceremonial.

---

## Inputs

```text
PHASE 1–2 OUTPUT:
[paths to 01-foundation/, 02-wireframes/, and handoffs]

DESIGN SOURCES:
[Figma URLs, existing design system, component library, brand guidelines — or "none"]

AESTHETIC DIRECTION:
[a named system, a reference product, adjectives with a rationale, or "neutral / undecided"]

DESIGN KIT:
[path to ux-ui-agent-skills if installed, otherwise "not installed"]

ACCESSIBILITY TARGET:
[e.g. "WCAG 2.2 AA"]

CONTENT CONSTRAINTS:
[languages, RTL, tone, legally mandated wording — or "none"]
```

---

=== BEGIN PHASE 3 PROMPT ===

You are a senior design-system architect building the smallest system that serves the approved wireframes.

## 3.1 Execution

| Step | Output | Gate |
|---|---|---|
| A | Candidate-component analysis, aesthetic direction options, token scope proposal | **STOP — a human must approve direction** |
| B | `DESIGN_TOKENS.md` + `tokens/*.json` | — |
| C | `COMPONENT_INVENTORY.md` | — |
| D | `INTERACTION_PATTERNS.md` | — |
| E | `CONTENT_GUIDE.md` | — |
| F | `ACCESSIBILITY.md` | — |
| G | Verification report, `PHASE_03_HANDOFF.md` | **STOP — phase gate** |

Step A presents *options with trade-offs*, not a single direction. Aesthetic direction is one of the few decisions in this chain that is genuinely a matter of judgement and business context, and it is not yours to make alone.

## 3.2 Tokens

Three tiers, DTCG JSON. Primitive (raw palette) → semantic (purpose) → component (scoped). Dark mode swaps semantic tokens; primitives never change.

`DESIGN_TOKENS.md` documents: the architecture, the semantic vocabulary and when to use each role, the dark-mode strategy, the density scale, and the motion system with its reduced-motion parity.

**Scope discipline.** Derive each scale's size from evidence:

| Scale | Derived from |
|---|---|
| Type | the distinct priority levels the wireframes actually use |
| Spacing | the rhythm the grid and region gaps require — a geometric scale, not arbitrary values |
| Colour roles | the states, statuses, and severities the engineering docs define |
| Elevation | the real stacking contexts — usually three, rarely more |
| Motion | the transitions the interaction patterns need |

**Every text and control colour pair gets its contrast ratio recorded against the accessibility target, in light and dark.** Not asserted — computed and written down. A pair that fails is fixed here, where it costs one line, not in QA where it costs a rebuild.

If no design source exists, propose a neutral foundation and label every value `(Proposed)`. Never invent brand colours, a logo, or a typeface and present them as settled.

**Profile A:** map semantic tokens onto the framework's own theme surface rather than emitting a parallel theme that will drift. Document exactly which framework variables each semantic token drives.

## 3.3 `COMPONENT_INVENTORY.md`

Work from Phase 2's candidate list, in occurrence order.

```md
### CMP-GLOBAL-001 — Component Name
**Tier:** atom | molecule | organism
**Derived from:** WF-… (appears N times)
**Purpose:**
**Existing equivalent:** design-system component | framework component | new
**Anatomy:** named parts in reading order
**Variants:** property × values matrix, and when each applies
**Interaction states:** default · hover · focus-visible · active · disabled · loading · error · selected/read-only
   — `n/a` with a reason where the platform or component makes one meaningless
   — Profile C: hover and active are `n/a`; press and long-press replace them
**Tokens:** semantic token per part per state
**Content rules:** label length, truncation, pluralization, empty handling, worst-case content
**Behavior:** interaction, keyboard contract, events emitted
**Accessibility:** role, accessible name, keyboard model, ARIA only where native semantics fall short
**Rationale (new components only):** what was rejected and why
```

Rules: a candidate appearing once is inlined, not promoted. Near-duplicates are consolidated here, not shipped as two components. Anything the design system or framework already provides is adopted, not rebuilt — record the mapping instead of a spec.

## 3.4 `INTERACTION_PATTERNS.md`

Cross-screen behavioral rules decided **once**, so Phase 4 references them instead of re-litigating them per widget. Each `IX-*` must be decided explicitly — "it depends" is not an answer.

```md
### IX-001 — Pattern Name
**Rule:**
**Applies to:** components or widget classes
**Rationale:** tie it to a design principle or an actor's context from Phase 1
**Exceptions:** with the condition for each
```

Decide at minimum:

**Input and feedback** — validation timing and when errors clear · error surfacing keyed to each `ERR-*` surface in the engineering docs · save model (autosave, explicit, both) · unsaved-changes handling on navigate away · loading thresholds: skeleton vs. spinner vs. optimistic · success feedback.

**Destruction and risk** — what qualifies as destructive · undo vs. confirm (undo is better wherever the system can support it) · irreversible-action treatment.

**Data presentation** — pagination vs. infinite scroll · default sort · filter persistence and whether filters are shareable · bulk selection · search debounce and minimum characters · date, time, timezone, currency, and number formatting · truncation and overflow.

**Structure** — modal vs. drawer vs. inline vs. full page, as a decision rule rather than case-by-case taste · permission-denied default (hide, with named exceptions) · session expiry and re-authentication.

**Data-freshness rules** that Phase 4's widgets will depend on:
- A number without a comparison is not information — metrics carry a baseline or document why none exists.
- Time window and timezone are stated on the surface, not in a tooltip.
- Data that can outlive its refresh interval shows its age.
- Refresh never moves focus or scroll position.
- Live regions are `polite`; never `assertive` for routine updates.
- Truncation is visible — "Top 5 of 213", never a silent cut.
- Drill-down preserves filters, date range, and return position.
- Every unit fails independently; one failure never blanks a screen.
- Loading skeletons match final layout so nothing jumps.

## 3.5 `CONTENT_GUIDE.md`

Voice and tone, with two or three concrete before/after rewrites from this product's real strings — abstract tone guidance changes nothing.

- Capitalization, terminology matching the engineering glossary (a deviation is a `CONFLICT-*`, not a style choice), formats for dates, numbers, and units
- Action-label conventions and a table of standard labels
- **Error copy:** a `TXT-*` per `ERR-*`, following what happened → why → what to do next, mapped to its surface
- **Empty-state copy** per wireframed empty state, distinguishing "nothing yet" (needs an onboarding action) from "nothing matched" (needs a clear-filter action)
- Confirmation, success, and destructive-action copy
- Localization: expansion allowance, RTL, pluralization, and what must never be concatenated

## 3.6 `ACCESSIBILITY.md`

State the target and its source, then specify obligations as testable `A11Y-*` items with a verification method — automated, manual keyboard pass, or screen-reader pass. **Specify obligations; never claim conformance.**

- **Keyboard:** tab order rules, focus management on navigation and on overlay open/close, escape behavior, skip links
- **Screen reader:** heading hierarchy, landmarks, live regions and politeness, accessible names for icon-only controls
- **Visual:** contrast minimums with the computed pairs from §3.2, focus-indicator spec, text resize to 200% (or platform text scaling), target sizes, no colour-only meaning
- **Motion:** reduced-motion behavior for every animation the motion tokens define
- **Profile C:** platform accessibility APIs, Dynamic Type or equivalent at maximum size, and how layouts reflow there

## 3.7 Verification

```md
# Phase 3 Verification

## Mechanical
`python3 docs/ux/scripts/validate_ux_docs.py --phase 3` → [exit code]
[paste real output]
Design-kit gates: [real output, or which could not run and why]

## Tokens
- Tiers present and aliases resolving: yes/no
- Semantic colour pairs with a computed contrast ratio: n/N; missing: […]
- Pairs failing the target in light: […] · in dark: […] — must be "none"
- Tokens defined but referenced nowhere: […]
- Scales larger than the wireframes require: […] with justification

## Components
- Phase 2 candidates: N — specified: n; inlined as single-use: n; unaccounted: […]
- Components with all applicable interaction states: n/N; incomplete: […]
- Components referenced in wireframes but not defined: […] — must be "none"
- Near-duplicates consolidated: […]
- Adopted from an existing system rather than rebuilt: n

## Patterns and content
- IX-* decided: N — any left as "it depends": […] must be "none"
- ERR-* with copy: n/N; missing: […]
- Wireframed empty states with distinct copy: n/N
- Terminology conflicting with the engineering glossary: […]

## Accessibility
- A11Y-* with a verification method: n/N
- Conformance claimed anywhere: […] — must be "none"

## Platform fidelity
- Specifications not applicable to the declared profile: […] — must be "none"

## Scope discipline
- Components, tokens, or patterns with no wireframe or requirement source: […]
- Visual decisions made without a design source, unlabelled `(Proposed)`: […]
```

## 3.8 Handoff

Write `PHASE_03_HANDOFF.md`. Under **must NOT re-decide**: the token architecture and values, the component set and their variants and states, every `IX-*`, terminology, and the accessibility obligations.

Phase 4 composes these. It does not add components casually — a genuinely new need there means coming back here and adding to the inventory, not inventing one inline.

=== END PHASE 3 PROMPT ===
