# UX Phase 4 Handoff — Widget and Screen Specifications to Build

**From:** Phase 4 — Widget and Screen Specifications
**To:** Phase 5 — Build and Handoff
**Gate date:** 2026-09-01
**Validator at this gate:** `python docs/ux/scripts/validate_ux_docs.py --phase 4`

---

## 1. Phase 4 status

**COMPLETE.** Every documented screen has a specification, every widget has a specification, every
Phase 3 obligation is placed on at least one Phase 4 surface, every declared data source resolves to
a canonical contract owner, and every local gate is green. The gate was extended before it was
declared passed, and each new check was negative-tested rather than assumed — see sections 12 and 13.

Phase 4 authored specifications only. It wrote no production code, created no `05-build/`, and
allocated no new `SCR-*`, `FLOW-*`, `WF-*`, `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*` or `ERR-*`. The one
new identifier family is `WGT-*`, which Phase 4 owns.

Two conditions qualify the word "complete" and are stated here rather than buried:

- The clinical dependencies `Q-CATALOG-001` and `Q-ELIG-001` remain open. Phase 4 specified the
  surfaces that will display that content; it did not author the content, and no specification here
  should be read as clinical approval.
- `Q-PLATFORM-008` still leaves the palette provisional. Phase 4 references semantic tokens
  throughout and names no colour, so ratification stays a one-layer change.

## 2. Authority baseline

Unchanged, and reasserted because Phase 5 inherits it whole.

1. Canonical engineering and product behavior: `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`,
   `docs/api/*`, `docs/database/*`, `docs/architecture/*`, `docs/ops/*`.
2. Product Owner decisions under `.spec/decisions/`, and the `.spec` requirement set.
3. Phase 1 owns actors, jobs, information architecture, screen inventory and flows.
4. Phase 2 owns grey-box structure, hierarchy, priority order and interaction shape.
5. Phase 3 owns the design system.
6. Phase 4 owns widget composition and per-screen specifications. It composes what Phases 1 to 3
   decided and decides nothing they already decided.

Phase 4 is derived. Where a specification and a canonical requirement disagree, the requirement wins
and the specification is the defect.

## 3. Measured baseline

Measured from the committed artifacts at this gate, not carried forward from Phase 3.

| Family | Count | Measured from |
|---|---:|---|
| `SCR-*` specified | 165 of 165 | `04-specs/SCREEN_SPECS_*.md` headings against `01-foundation/INFORMATION_ARCHITECTURE.md` |
| `WGT-*` allocated | 30 | `04-specs/WIDGET_SPECS_PLATFORM.md`, `_DOMAIN.md` headings |
| `WF-*` realized | 165 | one per screen block, each verified against its Phase 2 owner |
| `FLOW-*` referenced | 103 | screen blocks, each resolved against Phase 1 |
| `CMP-*` placed | 22 of 22 | zero unplaced |
| `IX-*` placed | 26 of 26 | zero unplaced |
| `TXT-*` placed | 60 of 60 | zero unplaced |
| `A11Y-*` placed | 40 of 40 | zero unplaced |
| `ERR-*` surfaced | 21 of 21 | every error reaches a screen and names its `TXT-ERR-*` copy rule |
| `API-*` bound | 34 of 36 | two deliberately unbound — section 9 |
| `SDC-*` bound | 24 of 24 | zero unbound |

## 4. Platform baseline

| Platform | Profile | Runtime | Screens | Density |
|---|---|---|---:|---|
| Patient app | C | React Native, `/api/v1` | 47 | `reading` |
| Clinic / Doctor panel | A | Filament panel | 56 | `operational`, `dense` in table bodies |
| Admin panel | A | Filament panel | 62 | `operational`, `dense` in workspaces |

Measured density across all 165 blocks: `reading` 47, `operational` 113, `dense` 5.
Measured archetypes: detail 68, form 58, list-and-detail 29, dashboard 5, workspace 5.

No Patient screen binds an `SDC-*` contract and no staff screen binds an `API-*` contract. This is
measured, not asserted.

## 5. Artifacts produced

All under `docs/ux/04-specs/`.

| File | Contents |
|---|---|
| `PHASE_04_IMPLEMENTATION_PLAN.md` | Scope, the widget allocation rule, the thirteen-section screen schema, the platform, responsive, traceability, accessibility and content binding strategies, the validation strategy, and the stop condition. |
| `WIDGET_SPECS.md` | What a widget is and is not, the allocation rule, the registry of all 30 with measured reach, the four Phase 3 deferred candidates resolved, the twelve refused candidates, and the six placement corrections. |
| `WIDGET_SPECS_PLATFORM.md` | The 14 platform-level widgets. |
| `WIDGET_SPECS_DOMAIN.md` | The 16 domain-level widgets. |
| `SCREEN_SPECS_PATIENT_01..03.md` | 47 Patient screen specifications. |
| `SCREEN_SPECS_CLINIC_01..03.md` | 56 Clinic screen specifications. |
| `SCREEN_SPECS_ADMIN_01..04.md` | 62 Admin screen specifications. |
| `SCREEN_SPEC_MAP.md` | One row per screen: wireframe, archetype, flows, widgets, components, patterns, content rules, accessibility obligations, errors, Phase 1 derivation, and the file carrying the block. |

The file layout follows Phase 2's: platform-batched files flat in the phase directory, not nested.

## 6. Widget taxonomy

A widget is allocated only when a composition recurs across screens, carries behaviour the
components do not carry individually, and would otherwise be re-decided per screen. Twelve
candidates were refused and are recorded with their reasons in `WIDGET_SPECS.md` section 6.

Platform-level widgets, with measured reach:

| Widget | Screens |
|---|---:|
| `WGT-PLATFORM-001` Structural state region | 165 |
| `WGT-PLATFORM-003` State-gated action region | 161 |
| `WGT-PLATFORM-002` Subject context bar | 156 |
| `WGT-PLATFORM-005` Lifecycle record list | 85 |
| `WGT-PLATFORM-010` Validation and correction region | 62 |
| `WGT-PLATFORM-004` Filter and result toolbar | 39 |
| `WGT-PLATFORM-007` Sensitive decision confirmation | 38 |
| `WGT-PLATFORM-006` Decision-bearing event timeline | 33 |
| `WGT-PLATFORM-014` Before-and-after disclosure block | 15 |
| `WGT-PLATFORM-011` Draft continuity bar | 10 |
| `WGT-PLATFORM-008` Evidence transfer panel | 9 |
| `WGT-PLATFORM-013` Itemized verification list | 6 |
| `WGT-PLATFORM-009` Attention and notification feed | 4 |
| `WGT-PLATFORM-012` Submission reconciliation panel | 1 |

Domain-level widgets, with measured reach:

| Widget | Screens |
|---|---:|
| `WGT-ELIG-002` | 13 |
| `WGT-IDENTITY-002` | 13 |
| `WGT-POLICY-001` | 16 |
| `WGT-OPS-001` | 8 |
| `WGT-CLINICAL-002` | 7 |
| `WGT-IDENTITY-001` | 6 |
| `WGT-ELIG-001` | 5 |
| `WGT-FINANCE-001` | 5 |
| `WGT-OPS-002` | 5 |
| `WGT-BOOKING-001` | 4 |
| `WGT-BOOKING-002` | 4 |
| `WGT-CATALOG-001` | 4 |
| `WGT-CLAIMS-001` | 4 |
| `WGT-CLINICAL-003` | 4 |
| `WGT-CLINICAL-001` | 2 |
| `WGT-POLICY-002` | 1 |

Two widgets reach exactly one screen: `WGT-PLATFORM-012` and `WGT-POLICY-002`. Both are retained
deliberately and the reason is recorded in `WIDGET_SPECS.md` — each isolates a rule that must not
be re-derived when a second surface later needs it, and neither was allocated to pad the registry.

## 7. Widget placement

Measured across all 165 screen blocks:

- screens composing zero widgets: **0**
- screens composing exactly one widget: **0**
- minimum widgets on a screen: **2**
- maximum widgets on a screen: **10**
- total placements: **885**, mean 5.36 per screen
- widgets placed on no screen: **none**

Every screen composes at least `WGT-PLATFORM-001`, because every screen has a loading, empty, stale
and failed state and none may invent its own.

## 8. Screen specification schema

Every block carries the same thirteen sections in the same order, and a section that does not apply
says so and why rather than being omitted. Measured: **0 of 165** blocks are missing a section, and
**0 of 165** are missing any of the nine data states.

Purpose · Hierarchy · Composition · Data · State · Actions · Content · Accessibility · Responsive ·
Loading and failure · Acceptance criteria · Traceability, with the identity header above them.

Specific results:

- **Data states.** All nine plus offline are addressed on every screen that can reach them. All 47
  Patient screens address offline explicitly; the 118 staff screens do not, because Phase 3 scoped
  the offline obligation to Profile C. A staff panel that claimed offline behaviour would be
  inventing it.
- **Right-to-left.** All 165 blocks carry an explicit direction, mirroring and bidirectional
  isolation statement. Identifiers, amounts, dates and Latin legal names are isolated; a reordered
  identifier is a wrong identifier.
- **Errors.** Every error a screen can raise is listed with what raises it and the `TXT-ERR-*` rule
  that owns its wording, so no surface can phrase a governed error itself.
- **Lifecycle labels.** Every screen that renders a governed status names the `TXT-STATE-*` machine
  that owns its labels. A screen that renders none says so explicitly rather than staying silent.
- **Action availability.** Every action states when it is available and what happens when it is not,
  resolved as HIDDEN, UNAVAILABLE or DISABLED per `A11Y-PLATFORM-016`.

## 9. Contracts, and what was deliberately not bound

Patient surfaces bind `API-*` from `docs/api/API_CONTRACTS.md`. Clinic and Admin surfaces bind
`SDC-*` from `docs/domain/STAFF_INTERACTION_CONTRACTS.md`, which exists precisely so that a staff
surface never has an internal REST endpoint invented for it. Every `Data` table restates the owning
contract's own projection and command text rather than paraphrasing it.

Two contracts are bound by no screen, deliberately:

| Contract | Why it is unbound |
|---|---|
| `API-ELIG-003` Submit Service Activation Request | The contract itself states that if the doctor experience is Filament-only at implementation time, the use case is invoked in-process and the external endpoint may be omitted. Phases 1 and 3 established the Clinic panel as Filament. `SCR-ELIG-007`, `SCR-ELIG-008` and `SCR-ELIG-009` therefore bind `SDC-ELIG-001`. Binding the REST endpoint would invent an external surface the product does not have. |
| `API-ELIG-004` Get Service Activation Request | Same reason, read side. |

This is recorded as a resolved question, not a gap. If the doctor experience later gains a mobile
surface, these two contracts are already written and the screens that would bind them are named
above.

## 10. Upstream corrections raised, not applied

Phase 4 does not edit Phase 1. Where Phase 1 predates a later canonical contract, the specification
follows the contract that actually backs the surface and the discrepancy is raised here.

| Screen | Phase 1 records | Phase 4 specifies against | Why |
|---|---|---|---|
| `SCR-ELIG-010` Service price | `SDC-ELIG-001` | `SDC-ELIG-005` | `SDC-ELIG-001` is the Clinic Service Activation Workspace; its projection is questionnaires, evidence and request state, and it carries no price at all. `SDC-ELIG-005` — Clinic Provider Price and Display-Mode Workspace — was appended to `STAFF_INTERACTION_CONTRACTS.md` after `SDC-ELIG-003` and out of numeric order, which is the evidence it postdates the Phase 1 entry. Its requirements are this screen's `FR-ELIG-009` and `FR-ELIG-014` plus `FR-ELIG-018`, the display-mode rule the screen's own Phase 1 notes already cite. Specifying against `SDC-ELIG-001` would state a projection that does not hold the data the screen renders. |

**Action for the Phase 1 owner:** update the `Contract` line of the `SCR-ELIG-010` entry in
`01-foundation/INFORMATION_ARCHITECTURE.md` to `SDC-ELIG-005`. Until then the generator applies the
correction explicitly and the screen block states it in its own `Data` section.

Six further corrections were placement corrections inside Phase 4 rather than upstream ones, and are
recorded in `WIDGET_SPECS.md` section 6.1. In each case a widget's mandatory component core did not
match a screen's Phase 3 binding, and Phase 4 narrowed the widget's placement. **Phase 3 was not
edited in any of the six.**

## 11. Open `Q-*` dependencies

All seven carried forward from Phase 3. None was closed by Phase 4, and none may be closed by
Phase 5 without its named authority.

| ID | Severity | Classification | State after Phase 4 |
|---|---|---|---|
| `Q-PLATFORM-001` | Blocker | Production-only / source availability | Open. Still limits any claim of complete reconciliation against readable SRS v1.1. |
| `Q-CATALOG-001` | Major | **Clinical** | Open. Phase 4 specified the catalog surfaces; production medical content still requires licensed clinical approval. **Not closed here.** |
| `Q-ELIG-001` | Major | **Clinical** | Open. Phase 4 specified the eligibility surfaces and kept every internal `S`/`P`/`H`/`I` value, weight, threshold and grade band off every surface. Formulas still require licensed dental review. **Not closed here.** |
| `Q-PLATFORM-002` | Major | **Legal** | Open. Retention and destruction periods remain legal work; `SCR-PLATFORM-007` specifies the surface without asserting a period. |
| `Q-OPS-001` | Major | **Infrastructure** | Open. Phase 4 specified provider-neutral evidence transfer, OTP challenge and notification surfaces and selected no vendor. **Not closed by naming any vendor.** |
| `Q-PLATFORM-004` | Minor | Production-only | Open. Load versus headroom. |
| `Q-PLATFORM-008` | Minor | **Visual brand** | Open. Palette provisional. Phase 4 names no colour and references semantic tokens only, so ratification remains a one-layer change. |

No product behavior was invented to close any of them.

## 12. Validator extensions

The Phase 4 gate was extended, never weakened. Every existing Phase 1, 2 and 3 check is unchanged
and still passes. Each extension protects a real Phase 4 invariant, resolves identifiers against the
phase that owns them, and encodes no count that append-only growth would falsify.

| Extension | Invariant it protects |
|---|---|
| `PHASE_4_REQUIRED` artifact existence | Every other Phase 4 check is conditional on content being found. A deleted or mis-cased artifact would otherwise leave the gate green — the same failure mode Phase 3 Session 7 caught. |
| Every `SCR-*` has a specification, and every specification is a documented screen | Without it, 164 of 165 screens could be unspecified and the gate would stay green. Measured from the Phase 1 screen set, not a literal 165. |
| `canonical_sources()` accepts `API-*` and `SDC-*`, and every declared source must resolve | Accepting only `API-*` would force either an invented REST endpoint or a false declaration on every staff widget. Resolving the identifier catches a mistyped or unallocated contract of either prefix. |
| Each screen names a wireframe that Phase 2 documents **for that screen** | Catches a copy-pasted block pointing at a neighbour's wireframe. |
| Each screen declares a contract that resolves to a canonical owner | The "do not invent data" rule, enforced where the data actually lands. |
| Each screen addresses all nine data states | A specification that does not say what the screen shows while loading, empty, stale or denied is not a specification. |
| Each screen composes at least one widget, and every `WGT-*`, `CMP-*` and `FLOW-*` it names is defined | Referential integrity across the whole composition. |
| Every `IX-*`, `TXT-*`, `A11Y-*` and `CMP-*` is placed on a widget or screen | Placement is the whole point of Phase 4. An obligation reaching neither has been authored and abandoned, and no later phase will look for it. This replaced a warning with a failure — a strengthening. |

## 13. Validation results

All run from the repository root at this gate.

```text
python docs/scripts/validate_docs.py
  Markdown files inspected: 75
  Result: 0 failure(s), 0 warning(s)

python docs/ux/scripts/validate_ux_docs.py --phase 3
  phase 3 | 165 screens, 103 flows, 165 wireframes, 22 components, 30 widgets
  0 failure(s), 0 warning(s)

python docs/ux/scripts/validate_ux_docs.py --phase 4
  phase 4 | 165 screens, 103 flows, 165 wireframes, 22 components, 30 widgets
  0 failure(s), 0 warning(s)

python docs/ux/scripts/validate_ux_tokens.py
  114/114 required pairs pass (light)
  114/114 required pairs pass (dark compatibility overrides)
  OK: 0 failures.

python scripts/check_no_emoji.py
  Scanned 208 file(s). OK: no emoji in UI output or taste files.

python scripts/check_no_emoji.py docs
  Scanned 84 file(s). OK: no emoji in UI output or taste files.
```

A green gate proves nothing about a check that never fires, so each new Phase 4 check was
negative-tested: one thing was broken, the expected failure was confirmed by message, and the file
was restored. All nine passed and the gate returned to green afterwards.

Unallocated identifiers are quoted descriptively below rather than literally, because the
engineering registry gate correctly rejects an out-of-range identifier anywhere under `docs/`.

| Perturbation | Expected failure | Result |
|---|---|---|
| Point a screen at a neighbour's wireframe | the screen claims a wireframe Phase 2 documents for a different screen | caught |
| Name a wireframe Phase 2 does not document | the screen names a wireframe Phase 2 does not document | caught |
| Invent a contract identifier | the screen declares a data source no canonical contract owner defines | caught |
| Drop one data state from one screen | `SCR-IDENTITY-001 missing data state(s): empty-filtered` | caught |
| Compose an undefined widget | the screen composes a widget no widget specification defines | caught |
| Bind an undefined component | the screen binds a component the inventory does not define | caught |
| Serve an undocumented flow | the screen serves a flow Phase 1 does not document | caught |
| Delete a required artifact | `P4 required artifact missing at canonical path: docs/ux/04-specs/SCREEN_SPEC_MAP.md` | caught |
| Remove an obligation from every surface | `A11Y-PLATFORM-025 is defined by phase 3 but placed on no widget or screen` | caught |

The map was additionally cross-checked against the blocks it summarizes: all 165 rows agree with
their block's own traceability line across wireframe, flows, widgets, components, patterns, content,
accessibility and errors, with **0 mismatches**. The map is derived; where the two ever disagree the
block wins.

## 14. CI gate result

`.github/workflows/docs-validation.yml` was promoted from `--phase 3` to `--phase 4` only after
every local gate was green and every new check was negative-tested — never before, so that a
not-yet-authored Phase 4 obligation could not turn an unrelated documentation change into a red
build. The workflow's step label and published report were updated to say Phase 4 at the same time,
so the report cannot claim to have run a gate it did not run. The measured result of the promoted
job is in section 20.

## 15. What Phase 4 did not do

- No production code. `UberTip-Backend/app/`, `routes/`, `database/`, the React Native sources, the
  Filament resources and the Laravel services are untouched. No migration, no model, no controller,
  no component.
- No `05-build/`, no `BUILD_MANIFEST`, no implementation contracts, no Figma production handoff.
- No renumbering. `SCR-*`, `FLOW-*`, `WF-*`, `CMP-*`, `IX-*`, `TXT-*` and `A11Y-*` are append-only
  and none was renumbered, merged or retired.
- No new requirement, error, contract or state machine.
- No dark-mode specification. Phase 3 scoped dark mode out of V1 and Phase 4 did not reopen it.
- No rendered accessibility claim. Every accessibility statement here is a binding to a Phase 3
  obligation, not a measurement of a rendered screen. Contrast, focus order, screen-reader output
  and target size must be measured on real renders in Phase 5.

## 16. Phase 5 inputs

1. `04-specs/SCREEN_SPEC_MAP.md` — the index. Start here.
2. `04-specs/PHASE_04_IMPLEMENTATION_PLAN.md` — the schema every block follows.
3. `04-specs/WIDGET_SPECS.md` and its two block files — build these before the screens that compose
   them. `WGT-PLATFORM-001`, `-002` and `-003` are on nearly every screen and are the first work.
4. `04-specs/SCREEN_SPECS_*.md` — the 165 blocks.
5. This handoff, for what is settled and what is not.

## 17. Phase 5 must not re-decide

Everything in `PHASE_03_HANDOFF.md` section 17 still holds, plus:

- **Widget allocation.** Do not merge, split or rename a `WGT-*` to suit an implementation
  framework. If a framework makes one awkward, adapt the framework usage and record it.
- **Contract binding per platform.** A Patient screen binds `API-*`; a staff screen binds `SDC-*`.
  Do not add a REST endpoint for a Filament surface because it is convenient.
- **Action availability resolution.** HIDDEN, UNAVAILABLE and DISABLED are distinct outcomes with
  distinct meanings. A disabled control that should be absent is a defect, not a style choice.
- **Structural separation of retryable transfer failure from authoritative rejection.** Different
  tone, different icon, different recovery path. Do not collapse them into one error surface.
- **Immutability.** Accepted treatment and financial snapshots, audit events, credential snapshots
  and claim decisions are append-only. A later correction is a new record.
- **Zero money movement.** No V1 surface authorizes, captures, holds, transfers, settles or refunds
  money. An approved remedy records an obligation for external execution and nothing more, and no
  wording may imply otherwise.
- **Internal values stay internal.** `S`, `P`, `H`, `I`, calibration mechanics, market comparison
  basis, sample counts and confidence figures never reach a Patient or Clinic surface.

## 18. Phase 5 obligations Phase 4 could not discharge

These are stated as obligations because Phase 4 has no way to satisfy them from documents:

- Real-render WCAG measurement in both directions, at every breakpoint, for every state — not the
  token-level contrast the current gate proves.
- Focus order, focus trap and focus return on every overlay and confirmation.
- Screen-reader output verified with a real screen reader in Arabic, right-to-left.
- Target size measured on real controls at real densities.
- No-horizontal-scroll verified at 280, 320 and 414 CSS pixels on real renders.
- Reduced-motion parity for every specified transition.

Phase 4's accessibility sections tell Phase 5 what to verify. They are not evidence that it passes.

## 19. Known limitations

1. **Specifications are not renders.** Every gate here is textual and referential. None proves a
   pixel, a contrast ratio, a focus ring or a tap target. No conformance claim follows from a green
   Phase 4 gate.
2. **`SCR-ELIG-010` carries a documented deviation from its Phase 1 contract line** until the Phase 1
   owner applies the correction in section 10.
3. **Two `API-*` contracts are bound by nothing** by design (section 9). If the doctor experience
   ever gains a mobile surface, that decision must be made upstream, not in a screen block.
4. **The clinical and legal dependencies are open** (section 11). Surfaces are specified; content is
   not approved.
5. **The palette is provisional** (`Q-PLATFORM-008`).
6. **Aesthetic quality is not gated.** The gates prove token consistency, referential integrity and
   structural completeness. They say nothing about whether the result is good design. That needs
   human review on real renders.

## 20. CI gate result — measured

Recorded after the promoted workflow actually ran, not predicted from the local result.

| Field | Value |
|---|---|
| Workflow | Documentation Validation |
| Run | 61 |
| Commit | `f3f52ccc3cebba77c8df77bfa235005fe7f62b15` |
| Status | completed, success |
| Combined exit code | `0` |
| Engineering validator | `0` |
| UX Phase 4 validator | `0` |

Runner output, verbatim from the published validation report:

```text
=== Engineering documentation ===
Repository: /home/runner/work/UperTib/UperTib
Markdown files inspected: 76
Result: 0 failure(s), 0 warning(s)

=== UX Phase 4 ===
phase 4 | 165 screens, 103 flows, 165 wireframes, 22 components, 30 widgets

0 failure(s), 0 warning(s)
```

The runner is a case-sensitive Linux checkout, which is what makes this result meaningful beyond the
local one: it proves every Phase 4 artifact resolves at its canonical lowercase path and not merely
on a case-insensitive filesystem. The local and CI engineering validators agree on the same 76 files.

The promoted job counts the Phase 4 gate. A later documentation change that breaks any Phase 4
invariant now fails the build rather than passing quietly at `--phase 3`.

## 21. Stop

Phase 4 is complete. Phase 5 has not been started, and nothing in `docs/ux/05-build/` exists.
