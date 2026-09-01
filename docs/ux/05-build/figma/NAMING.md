# Figma Build Manifest — Naming and Authority Contract

**Phase:** UX 5 — Build and Handoff
**Session:** 2 of 7 — manifest and naming
**Companion artifact:** `BUILD_MANIFEST.json`, in this same directory.
**Input gate:** `docs/ux/05-build/PHASE_05_IMPLEMENTATION_PLAN.md` (Session 1, complete).

This file is prose. `BUILD_MANIFEST.json` is the machine-readable artifact a Figma-generation
agent, plugin or script actually consumes. Where the two ever disagree, the JSON is the defect,
because this file records intent and the JSON is derived from the specifications, not from this
file.

---

## 1. Manifest authority — restated, not re-decided

This is the same rule `PHASE_05_IMPLEMENTATION_PLAN.md` section 11 states, repeated here because
it is the rule people forget:

```
canonical product and engineering behaviour   (docs/PRD.md, docs/SDD.md, docs/domain/*, docs/api/*,
                                               docs/database/*, docs/architecture/*, docs/ops/*)
        v
Phase 1   165 SCR-*, 103 FLOW-*
        v
Phase 2   165 WF-*, archetypes
        v
Phase 3   tokens, 22 CMP-*, 26 IX-*, 60 TXT-*, 40 A11Y-*
        v
Phase 4   30 WGT-*, 165 per-screen specifications
        v
Phase 5 implementation contract   (Session 3-5, not yet written)
        v
BUILD_MANIFEST.json / the rendered Figma file        <- lowest authority, this artifact
```

Two rules, stated exactly once each so there is one place to look:

1. **The Figma file is derived and cannot be a source of truth for code.** It is generated from
   these specifications; treating it as authoritative would make the implementation a copy of a
   copy. A Figma agent or plugin reads `BUILD_MANIFEST.json`. It never reads the prose
   specifications directly, and a coding agent never reads the Figma file except as a visual
   reference.
2. **Where the manifest and a Session 3-5 implementation contract disagree, the contract wins**,
   and the disagreement is reported as a manifest defect. **Where a contract and a canonical
   requirement disagree, the requirement wins**, and the contract is the defect. Nothing in this
   chain is ever resolved in the direction of the artifact with the least authority.

### 1.1 What the future Figma agent may infer, and what it may not

**May infer**, because it is genuinely a rendering decision and not a product one:
- Exact pixel positions within a frame, once `layout` and token references fix the mode, gap,
  padding and axis behaviour.
- Which Figma component-set/variant machinery to use to realize `variantProperties` and `states`.
- Interpolated visual states between two declared states, for a smoother design-review experience,
  provided the two declared endpoints are not altered.
- Ordering and grouping of frames within a page, provided every frame keeps its declared `id` and
  full discriminator `name`.

**May not infer**, because it would be a product or design decision this chain does not delegate
downward:
- A new component, widget, screen, variant, or state not present in `components[]`, `widgets[]` or
  `screens[]`.
- A resolved literal value in place of a token reference — the plugin resolves tokens against
  `tokenSource` at render time; it never bakes a literal into the manifest or the file it produces.
- Content for `Q-CATALOG-001` or `Q-ELIG-001` beyond what is marked `contentStatus: "provisional"`.
- Any dark-mode frame. V1 is light-only; the manifest emits zero.
- A merged, renamed, split or renumbered `WGT-*`, `CMP-*` or `SCR-*` to make a frame convenient to
  draw.

---

## 2. Whether the Figma agent can create nodes

**Not confirmed in this session.** Section 8.6 of the Session 1 plan flagged this as the one thing
to confirm before emitting at volume. Session 2 did not have write access to a connected Figma
file or plugin runtime to test node creation, and the MCP tool surface available to this session
carries no Figma-specific tool. `BUILD_MANIFEST.json` is still the right artifact regardless of the
answer: if a future agent can only read a Figma file, a plugin or script consumes this manifest to
generate one; if it can create nodes directly, it consumes the same manifest directly. This is
recorded as **open**, not assumed either way, and is a Session 3+ or tooling-owner confirmation
before frames are actually drawn at volume in a live Figma file.

---

## 3. Page plan

Four pages, no more. There is deliberately no `05 · Flows` page.

| Page | Frames | Frame id family | Why |
|---|---|---|---|
| `01 · Tokens` | none | — | A token swatch has no `SCR-*`, `WGT-*` or `CMP-*` identity. Giving it a frame id would fail the resolvability gate. The plugin renders this page directly from `meta.tokenSource`; the manifest carries no frame data for it. |
| `02 · Components` | component variant/state frames | `CMP-*` | One frame per declared (variant × state) pair actually named in the Phase 3 inventory — never a full cartesian product of every state against every variant if the inventory itself never pairs them that way. |
| `03 · Widgets` | widget data-state frames | `WGT-*` | One frame per platform per canonical data state the widget's **own** block declares distinct behaviour for. A state the block defers to `WGT-PLATFORM-001` gets no widget-page frame; that state's coverage is the `WGT-PLATFORM-001` frame for it, drawn once. |
| `04 · Screens` | canonical screen frames, plus the declared high-risk and responsive variants | `SCR-*` | Coverage floor: one `success` frame per screen (165, exact), plus L4/L5 variants per the suppression rule in section 8 below. |

**Why no `05 · Flows` page.** A `FLOW-*` is not in the resolvable identifier set (`SCR-*`, `WGT-*`,
`CMP-*` only), so a flow frame would fail the manifest's own referential-integrity gate. Flow
membership is instead carried as a `trace.flows` array on each screen frame; a Figma plugin renders
those as connectors between existing screen frames, which preserves all 103 flows without inventing
a frame identity for something that is traceability metadata, not a drawable surface. This is a
carried-forward decision from `PHASE_05_IMPLEMENTATION_PLAN.md` section 8.3, not a new one.

The Phase 2 wireframes stay in their own file (`docs/ux/02-wireframes/`) and are not superseded by
this manifest. They remain the grey-box review record; this manifest is the high-fidelity,
token-bound build input.

---

## 4. Naming format

**Every frame name begins with its identifier.** No human-friendly name stands alone; a name
without a leading canonical ID is not traceable and is a defect.

```
Component:  <CMP-ID> / <Name> / <variant> / <state>
Widget:     <WGT-ID> / <Name> / <data-state> / <profile> / <content-width-or-size-class>
Screen:     <SCR-ID> / <Name> / <variant-discriminator>
```

Examples, drawn from the actual manifest:

```
CMP-PLATFORM-009 / Empty state / no-data / default
WGT-PLATFORM-004 / Filter and result toolbar / empty-filtered / A / wide
SCR-ELIG-010 / Service price / canonical
SCR-CLAIMS-007 / Claim response and evidence / max-composition-partial
```

A canonical (L3, non-variant) screen frame uses the discriminator `canonical`. A variant frame
names the section 9.4 reason it exists, in place of a made-up label, so the reason is legible from
the frame name alone (`workspace-reflow`, `max-composition-partial`, `separation-<pair>`,
`responsive-<archetype>-<profile>`).

### 4.1 State suffixes

The nine canonical data states plus offline, unchanged from `WIDGET_SPECS.md` section 4:

```
loading-initial · loading-refresh · empty-no-data · empty-filtered · partial · stale ·
error-fetch · error-permission · success · offline
```

A component or widget frame's state suffix is one of the states that entity's own Phase 3/4 block
declares (a component's `states` list, or a widget's data-state table). A screen's canonical frame
is always `success`; a screen's L4 variant frame states which non-success condition it represents
when that is the reason for the frame.

### 4.2 Profile and responsive suffixes

- **Profile C (Patient):** `sizeClass` — one of `compact`, `medium`, `expanded`. Default is
  `compact` (`breakpoints.json`: "Phones in portrait. The design target.").
- **Profile A (Clinic, Admin):** `contentWidth` — one of `narrow`, `medium`, `wide`, `maximum`.
  Default is `wide` ("the working default... full twelve-column behaviour").
- These two scales are **never merged into one ladder** — `breakpoints.json` states plainly that a
  Profile A threshold is measured on the content area and a Profile C threshold on the device
  viewport, and a manifest that merged them would misrepresent both.
- **Density**, `reading` / `operational` / `dense`, is carried as its own field, not folded into
  the responsive suffix, because density is a property of archetype and profile
  (`density.json`), not of viewport width.

### 4.3 Frame identity and uniqueness

Multiple frames legitimately share one `id` (e.g. every `WGT-PLATFORM-004` frame carries
`"id": "WGT-PLATFORM-004"`), because `id` is the resolvable canonical identifier, not a
frame-unique key. Uniqueness is carried by a separate `frameKey` field on every frame — the `id`
plus every discriminator, joined with `::` — and no two frames in the manifest may share a
`frameKey`. This is what section 9 below (validator extensions) checks mechanically.

---

## 5. RTL naming and metadata

Patient is Arabic-first and right-to-left-first, and Clinic/Admin render right-to-left as the
authored direction (section 20 of the Phase 5 brief; `PHASE_03..04` inherit this unchanged). Every
frame declares `"direction": "rtl"` — there is no left-to-right frame set to name, because
left-to-right is not a second frame axis this product draws.

- Positional language in the manifest is **logical** (`start`, `end`) and never physical
  (`left`, `right`). A `padding` or `gap` object that needs a directional key uses `start`/`end`.
- **Bidi isolation classes**, carried on the components and widgets that render them, using the
  field `bidiIsolate`: an array drawn from `amount`, `currency`, `date`, `time`, `phone`, `code`,
  `id`, `latin-name`, `email`, `url`, `version`. A frame carrying one of these renders that value
  isolated (e.g. Unicode isolate or an equivalent platform mechanism) so its internal left-to-right
  structure survives inside right-to-left flow without visually reversing the value itself. Machine
  identifiers (an `SDC-*`/`API-*` id, a UUID, a version string) are never mirrored or reversed.
- **Icon mirroring** follows `A11Y-PLATFORM-031`: a directional icon (navigation arrow, breadcrumb
  separator, forward/back, disclosure chevron) carries `"mirrorsRtl": true`; a non-directional
  state or object icon (clock, document, shield, check, status icon) carries `"mirrorsRtl": false`
  even where the glyph itself is visually asymmetric.

---

## 6. Traceability — how to trace a frame back to its specification

Every frame carries a `trace` object. The fields present depend on the frame's page, but the
method is the same: read `trace`, then open the named block in its owning file.

| Frame page | `trace` fields | Owning file to open |
|---|---|---|
| `02 · Components` | `component` (its own id) | `COMPONENT_INVENTORY_PLATFORM.md` / `_DOMAIN.md`, the block matching the id |
| `03 · Widgets` | `screens` (every `SCR-*` it reaches), `patterns` (`IX-*`), `content` (`TXT-*`), `accessibility` (`A11Y-*`), `components` (its mandatory `CMP-*` core) | `WIDGET_SPECS_PLATFORM.md` / `_DOMAIN.md` for the block; `SCREEN_SPEC_MAP.md` for the reach |
| `04 · Screens` | `wireframe` (`WF-*`), `flows` (`FLOW-*`), `widgets` (`WGT-*` placed), `dataSource` (`API-*`/`SDC-*`) | `01-foundation/INFORMATION_ARCHITECTURE.md` for the screen block; `04-specs/SCREEN_SPECS_*.md` for the full specification; `SCREEN_SPEC_MAP.md` for the placement row |

A reviewer who opens any frame and reads `trace` can therefore reach the specification block that
authorizes everything drawn in it, without needing this file open at the same time. This is what
makes `DESIGN_TRACEABILITY.md` (a later session's artifact) derivable mechanically from the
manifest rather than hand-written.

---

## 7. Representative content rule

No lorem ipsum, anywhere. Content precedence, unchanged from the Session 1 plan section 9.6:

1. Entity and field names from `docs/database/ERD.md` (53 tables — 6 existing, 47 proposed), so a
   frame shows the field an implementation will actually bind.
2. Lifecycle status labels — the Arabic chip label and per-audience meaning — from
   `CONTENT_GUIDE_STATES.md`, for all 82 statuses across 18 machines. A frame never renders a bare
   enumeration value (`PENDING_EVALUATION` is never shown as the literal string `PENDING_EVALUATION`
   — it is shown as its Arabic label, e.g. `غير مؤهَّل حاليًا` for `NOT_ELIGIBLE`).
3. Copy obligations bound by `TXT-*` reference. No canonical `ERR-*` message is restated in the
   manifest; `docs/api/ERROR_CATALOG.md` owns those strings and the manifest points at the ID.
4. Worst-case strings (a long Arabic clinic legal name, a mixed-direction identifier, a long facet
   label) where Phase 2 identified them, because short strings prove nothing about wrapping.

Two hard limits, both mechanically checkable by grep against a fixed list:

- **Provisional content marker.** Any frame whose content touches `Q-CATALOG-001` or `Q-ELIG-001`
  (catalog and eligibility surfaces) carries `"contentStatus": "provisional"`. A frame with no such
  marker is asserting its content is not blocked on either open question.
- **Zero internal-value leakage.** `S`, `P`, `H`, `I`, calibration mechanics, market-comparison
  corpus, sample counts, confidence figures and any internal risk/classification code never appear
  in a Patient or Clinic frame's content strings. Section 9 lists the mechanical check.

---

## 8. Frame coverage and suppression strategy

Restated from the Session 1 architecture (`PHASE_05_IMPLEMENTATION_PLAN.md` section 9), because
this is the rule that keeps the manifest from being a 4,455-frame Cartesian product of 165 screens
times nine states times responsive thresholds.

**Draw each obligation once, at the lowest layer that owns it.**

| Layer | Owns | Frame count is | Suppression when |
|---|---|---|---|
| L1 — component variant/state | `02 · Components` | Exactly the declared (variant × state) pairs per `CMP-*` | A variant or state the inventory never declares is never invented to fill a matrix |
| L2 — widget data state | `03 · Widgets` | One per platform per state the widget's own block owns | A state whose row defers to `WGT-PLATFORM-001`, or is marked `n/a` with a reason, draws no widget-page frame; the manifest still records the state and its disposition so the omission is a recorded decision, not a silent gap |
| L3 — canonical screen | `04 · Screens` | Exactly 165, one `success` frame per screen | Never suppressed — this is the coverage floor |
| L4 — screen high-risk variant | `04 · Screens` | Only where section 9.4's five criteria hold, one frame per qualifying reason | Every other screen is excluded because L1 or L2 already carries its obligations; the manifest states which layer covers each excluded screen rather than omitting the statement |
| L5 — responsive/profile | `04 · Screens` | Per distinct (archetype × profile) pair actually observed, not per screen | Two screens of the same archetype on the same profile reflow identically; only the first (by id) draws the variant |
| L6 — density | `02`, `03` | Once per component/widget that reaches a workspace screen | Not drawn per screen |
| L7 — direction | all | Zero additional frames | Authored RTL throughout; LTR is not a second frame set |
| L8 — theme | none | Zero | V1 is light-only |

**Measured counts, suppression counts, and the reusable-layer attribution for every suppressed
class are published in section 10 below and in the Session 2 final report — not estimated, and not
carried forward from the Session 1 range (540–730).** Where the Session 2 measured total is lower
than that range, the reason is stated explicitly per layer rather than padded to match the
estimate: Session 1's own section 9.5 called the range an estimate "to be replaced by a measured
count," and a coverage strategy that pads its own count to look thorough is exactly the failure
mode section 15 of the brief prohibits ("no coverage by assertion").

### 8.1 The L4 inclusion test, applied

A screen earns an L4 variant only when the Session 1 test (`PHASE_05_IMPLEMENTATION_PLAN.md`
section 9.4) actually holds for it, checked against real evidence rather than asserted:

1. **The four safety-critical separations** — `PENDING_EVALUATION`/`NOT_ELIGIBLE`,
   `FAILED_RETRYABLE`/`REJECTED`, `UPLOADED`/`ACCEPTED`, and booking `CANCELLED`'s `restricted`
   tone — are structurally distinct at the **token** layer already (`ACCESSIBILITY.md` section 25
   confirms this mechanically). Two of the four (`FAILED_RETRYABLE`/`REJECTED` and
   `UPLOADED`/`ACCEPTED`) are owned entirely by `WGT-PLATFORM-008`'s own eight-state table and are
   therefore L2 coverage already — no additional L4 frame is manufactured for them, because L2
   already draws both states as distinct widget frames on real content, which is exactly what the
   inclusion test asks for. Where a distinct owning screen exists and the pair is not already fully
   covered at L1/L2, Session 2 draws one L4 frame naming the pair.
2. Action-model exceptions (an unavailable action resolved differently from the `WGT-PLATFORM-003`
   default) and state-divergent screen compositions (criteria 2 and 5) require a per-screen reading
   deeper than the structural maps this session worked from. **Session 2 did not fabricate specific
   instances of either without documented evidence** — where none was found in the sources actually
   read, none is claimed, and the gap is flagged for the Session 3-5 contract authors to raise if
   they find one while writing a contract (a contract session reads every block in full and is the
   correct place to catch this, not a manifest session working from maps).
3. **The five workspace screens** (Profile A `dense` density, `density.json`) each earn one L4
   variant proving the `narrow` content-width reflow of their dense composition, because that
   reflow is the product's only earned density and its highest documented risk.
4. **`SCR-CLAIMS-007`** (ten widgets, the maximum composition) earns one L4 variant under a
   non-success condition, because that is the one place the composition itself — not any one
   widget — can fail.

---

## 9. Validator extensions added this session

`docs/ux/scripts/validate_ux_docs.py`'s `--phase 5` branch already checked, before this session:
manifest exists and parses; every frame id resolves to a documented `SCR-*`/`WGT-*`/`CMP-*`; every
frame declares `layout`; no non-token raw value in any frame string; every `componentId` resolves;
every `WGT-*` has an implementation contract (still failing at this session, by design — Session 2
writes no contracts).

Extensions added in this session, each a **durable, manifest-specific mechanical invariant** rather
than a contract-dependency check (section 32 of the brief reserves those for later):

| Extension | What it catches |
|---|---|
| Every frame's `frameKey` is globally unique | Two frames that would silently collide as one drawn surface |
| Every frame `name` begins with its own `id` | A frame that would be untraceable without opening it |
| Every frame declares `direction` | A frame nobody decided the reading direction for |
| Every frame under `04 · Screens` declares `profile` and either `sizeClass` (C) or `contentWidth` (A) | An unclassified responsive surface |
| No frame under any page is tagged for a dark mode | A V1 scope violation that a careless copy-paste could introduce silently |
| Every component referenced by a widget's `mandatoryComponents` resolves in `components[]` | Referential integrity from the widget layer back into Phase 3, independent of the existing `componentId` check, which only fires where a frame node actually carries that key |

Each is negative-tested: an invariant is temporarily broken, the expected failure message is
confirmed, the artifact is restored, and the gate is re-run green. The test, expected failure and
actual result for each extension are recorded in the Session 2 final report rather than committed
as intentional breakage.

---

## 10. Measured coverage

Measured directly from `BUILD_MANIFEST.json` after generation — not the Session 1 estimate
(540–730), carried forward unchanged only where it happened to still apply.

| | Count |
|---|---|
| **Total frames** | **509** |
| `02 · Components` (L1) | 137 |
| `03 · Widgets` (L2 + L6) | 190 (L2 = 179, L6 = 11) |
| `04 · Screens` (L3 + L4 + L5) | 182 (L3 = 165, L4 = 8, L5 = 9) |

L4 high-risk variants (8, all evidence-based per section 8.1 — none fabricated to hit a target):
`SCR-ELIG-004` and `SCR-ELIG-011` (`PENDING_EVALUATION` vs `NOT_ELIGIBLE`, distinct owning screens
not already fully covered at L1/L2), the 5 workspace screens' narrow-reflow variant
(`SCR-IDENTITY-012`, `SCR-CLINICAL-009/010/011`, `SCR-FINANCE-006`), and `SCR-CLAIMS-007`'s
non-success max-composition variant.

Suppressed, by layer, with the reusable-layer attribution recorded on every entry:

| Layer | Suppressed | Attribution |
|---|---|---|
| L1 (component variant × state pairs) | recorded per-pair in `comp_suppressed` | state proven once on the primary variant, not re-drawn per variant |
| L2 (widget data-state frames) | 271 | the 5 infrastructure states (`loading-initial`, `loading-refresh`, `stale`, `error-fetch`, `error-permission`) defer to `WGT-PLATFORM-001`'s structural region for every widget except itself, per `WIDGET_SPECS.md` section 4's own stated precedence rule; any state a widget's block separately marked `n/a` keeps that specific reason |
| L4 (safety-critical separations not given a dedicated screen frame) | 10 screens | `FAILED_RETRYABLE`/`REJECTED` and `UPLOADED`/`ACCEPTED` are owned entirely by `WGT-PLATFORM-008`'s own state table and are L2-covered already; booking `CANCELLED`'s `restricted` tone is a token/content-level rule with no single owning screen — none of the 165 screens carry it as a `safetyCriticalSeparation` tag |

The measured total (509) is below the Session 1 range (540–730). The reason is stated per layer
above, not padded to match the estimate: the L2 normalization against `WIDGET_SPECS.md` section 4's
own stated rationale is the largest single driver, and Session 1's own section 9.5 called its range
an estimate "to be replaced by a measured count."

---

## 11. Open `Q-*`, unchanged

`Q-PLATFORM-001`, `Q-CATALOG-001`, `Q-ELIG-001`, `Q-PLATFORM-002`, `Q-OPS-001`, `Q-PLATFORM-004`,
`Q-PLATFORM-008` — all seven remain open. None is closed by this manifest. `Q-CATALOG-001` and
`Q-ELIG-001` are enforced structurally by the `contentStatus: "provisional"` marker (section 7);
`Q-OPS-001` is enforced by naming no storage, scanning, one-time-code or notification vendor
anywhere in the manifest, including inside any evidence-transfer or notification frame's content.

---

**Session 2 status: see the final report in the same turn as this file for measured statistics,
validator results, and the explicit confirmation that no implementation contract, production code
or Figma file was produced.**
