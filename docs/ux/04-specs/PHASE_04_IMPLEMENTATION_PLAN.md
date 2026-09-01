# UX Phase 4 Implementation Plan — Widget and Screen Specifications

**Phase:** UX 4 — Widget and Screen Specifications
**Input gate:** `docs/ux/PHASE_03_HANDOFF.md`, complete and passed on CI
**Owns:** `WGT-*` allocation, per-screen composition, per-screen behaviour, and the implementation-facing
contracts that Phase 5 builds against.
**Validator at this gate:** `python docs/ux/scripts/validate_ux_docs.py --phase 4`

---

## 1. Authority chain

Unchanged, and inherited whole. Phase 4 consumes the chain; it does not reinterpret it.

```
canonical product and engineering behaviour     docs/PRD.md, docs/SDD.md, docs/domain/*,
                                                docs/api/*, docs/database/*, docs/architecture/*,
                                                docs/ops/*
        v
Product Owner decisions                         .spec/decisions/*, .spec/functional-requirements,
                                                .spec/non-functional-requirements
        v
Phase 1  actors, jobs, IA, 165 SCR-*, 103 FLOW-*
        v
Phase 2  165 WF-*, archetypes, region vocabulary, priority order
        v
Phase 3  tokens, 22 CMP-*, 26 IX-*, 60 TXT-*, 40 A11Y-*, 18 lifecycle machines, 82 statuses
        v
Phase 4  WGT-*, per-screen specification            <- this phase
        v
Phase 5  build and implementation handoff
```

Where a Phase 4 idea conflicts with anything above it, the upstream decision wins and the conflict is
raised against its canonical owner. No screen specification redesigns the product to make itself
easier to write.

## 2. Scope — what Phase 4 owns

1. **`WGT-*` allocation.** Implementation-facing compositions of `CMP-*` and `IX-*` that repeat across
   screens, allocated under the rule in section 4.
2. **Per-screen composition.** Which components, which variants, which widgets, in which region.
3. **Per-screen behaviour.** Loading, empty, partial, stale, error, permission and offline arrangements
   inside the `IX-PLATFORM-017` precedence that Phase 3 already fixed.
4. **Per-screen responsive behaviour**, expressed only in the Phase 3 breakpoint and density tokens.
5. **Per-screen action model.** Primary, secondary, destructive and context actions, with the
   hidden / unavailable / disabled resolution stated per action.
6. **Binding**, not authoring, of `TXT-*`, `A11Y-*` and `ERR-*` obligations to individual surfaces.
7. **Platform realization** — React Native for Patient, Filament for Clinic and Admin — at widget and
   screen level, inside the profile vocabulary `COMPONENT_INVENTORY.md` section 1 already fixes.
8. **Acceptance criteria** per widget and per screen, written so an implementer can test them.

## 3. Non-goals — what Phase 4 must not do

Phase 4 may not re-decide anything in `PHASE_03_HANDOFF.md` section 17. Restated here in the form the
authoring sessions actually needed:

- No new `SCR-*`, `FLOW-*` or `WF-*`. No renumbering of any existing identifier in any family.
- No new `CMP-*`, `IX-*`, `TXT-*` or `A11Y-*`, and no change to what an existing one means.
- No second component taxonomy wearing widget identifiers. See section 5.
- No invented data. A field that no `API-*`, `SDC-*`, domain model or canonical requirement supplies is
  recorded as a gap, never specified as if it existed. In particular, **no REST endpoint is invented for
  a Clinic or Admin surface**: those are in-process Filament adapters and their contracts are `SDC-*`.
- No lifecycle, status, eligibility, guardian, immutability, evidence-transfer or financial-boundary
  semantics are changed. UberTib V1 moves no money and Phase 4 specifies no surface that implies it does.
- No dark-mode surface, no dark-mode toggle, no dark-mode scope change. V1 is light-only.
- No conformance claim, accessibility or otherwise. Phase 4 binds obligations; Phase 5 measures a
  rendered interface.
- No Phase 5 output: no `05-build/`, no build manifest, no implementation contract, no production code,
  no React Native component, no Filament resource or page, no Laravel code, no migration.

## 4. `WGT-*` allocation strategy

### 4.1 The rule

A composition earns a `WGT-*` only when **all four** hold. This is deliberately the same shape as the
`CMP-*` rule in `COMPONENT_INVENTORY.md` section 1.1, because the failure it prevents is the same one.

1. It appears in **at least two meaningful contexts**, or in **one high-consequence context whose
   implementation complexity is substantial enough that leaving it unspecified guarantees divergence**.
2. It **composes multiple `CMP-*`**, or carries screen-level behaviour that no single component owns.
3. Re-implementing it independently per screen would create **drift risk with a named consequence**.
4. It has a **stable semantic purpose** — it is a thing, not a layout of the moment.

### 4.2 What is deliberately not a widget

- Framework primitives. Button, input, select, checkbox, radio, date picker, modal shell, drawer,
  toast, banner, tabs, breadcrumb, pagination, avatar, badge, card and navigation chrome are
  framework-owned and were already excluded by `COMPONENT_INVENTORY.md` section 7. Phase 4 does not
  re-admit them under a new prefix.
- A composition that a single `CMP-*` already fully defines. `CMP-PLATFORM-002` is already a
  composition of the chip, the deadline and the attribution; wrapping it in a widget would add an
  identifier and no contract.
- A one-screen layout with no repeated behaviour. Those are specified in the screen spec and named as
  screen-only compositions, which is a decision recorded per screen rather than an omission.

### 4.3 How the set was actually derived

Not from a wish list. The audit ran over all 165 wireframes and the Phase 3 binding map:

| Signal | Source | What it decided |
|---|---|---|
| Component co-occurrence | `WIREFRAME_COMPONENT_MAP.md`, all 165 rows | Which groups of `CMP-*` recur together often enough to be one thing |
| Archetype | Phase 2, and the same map | Whether the recurrence is a real composition or an artifact of the archetype |
| Screen purpose and notes | `INFORMATION_ARCHITECTURE.md`, all 165 blocks | Whether the recurrence carries the same behaviour or only the same parts |
| Canonical behaviour | `IX-*`, `STATE_MACHINES.md`, `PERMISSIONS_MATRIX.md` | Whether a rule needs a structural home at composition level |
| Phase 3 dispositions | `COMPONENT_INVENTORY.md` section 8 | Four candidates Phase 3 explicitly deferred to Phase 4 |

Phase 3 deferred exactly four things to this phase by name: the **comparison view**, the
**market-observation entry grid**, the **dashboard composition**, and **stat tile / metric card /
chart**. All four are resolved in `WIDGET_SPECS.md` section 5 — three as widgets, one as a template
that is not a widget.

### 4.4 Identifier convention

`WGT-<DOMAIN>-<NNN>`, append-only, using the same twelve product domains as every other family. No
thirteenth domain. A widget is keyed `PLATFORM` when it is cross-cutting and keyed to a domain only when
it genuinely owns domain-specific behaviour. **No screen number is ever encoded into a widget
identifier** — a widget that could only be named after one screen has failed criterion 1.

## 5. Widget versus component — the line that keeps this from being a second taxonomy

| | Owns | Example |
|---|---|---|
| `CMP-*` | A **semantic contract**: anatomy, variants, required states, token mapping, per-profile realization | `CMP-PLATFORM-007` is the filter and search bar: what it is made of, and that a filtered-empty result is not an empty set |
| `WGT-*` | An **implementation-facing composition**: which components, in what arrangement, driven by which `IX-*` sequence, over which data contract, with which per-state behaviour | `WGT-PLATFORM-004` is the toolbar as actually built: the search control, the persisted filter set, the applied-filter summary, the result count, and the coupling to the two empty states |

The test applied throughout: **if the block could be written without naming any other component, it is a
component and does not belong here.**

## 6. Screen-specification schema

Every one of the 165 blocks carries the same thirteen sections in the same order. A section that does
not apply says so and why; it is never dropped.

| # | Section | Contents |
|---|---|---|
| 1 | Identity | `SCR-*`, `WF-*`, name, platform, profile, archetype, density, actors, `FLOW-*`, `FR-*`, data contract |
| 2 | Purpose | Primary user goal, success outcome, why the screen exists as its own screen |
| 3 | Hierarchy | Primary, secondary, supporting and action regions, in the Phase 2 priority order for that archetype |
| 4 | Composition | `CMP-*` with the exact variant, `WGT-*` placed, `IX-*` governing, and the screen-only compositions named |
| 5 | Data | Required and optional fields, the owning contract, and the missing-data behaviour per field group |
| 6 | State | Lifecycle statuses visible here, permission model, and the hidden / unavailable / disabled resolution |
| 7 | Actions | Primary, secondary, destructive, context; each with its state and permission condition |
| 8 | Content | `TXT-*` obligations, lifecycle label source, error families and which interaction raises each |
| 9 | Accessibility | Applicable `A11Y-*` only, focus entry, keyboard order, screen-reader hierarchy, announcements, RTL specifics |
| 10 | Responsive | Profile C size-class behaviour, or Profile A content-width behaviour, plus text scaling and reflow |
| 11 | Loading and failure | Only the data states meaningful on this surface, resolved through `IX-PLATFORM-017` |
| 12 | Acceptance criteria | Implementation-testable bullets |
| 13 | Traceability | `FLOW`, `CMP`, `WGT`, `IX`, `TXT`, `A11Y`, `ERR`, `FR`, `API`/`SDC` |

### 6.1 The data-state rule

Section 11 lists **only the states that are meaningful on that surface**, per the phase brief. A
pre-authentication form with no read has no `stale`; a read-only public surface has no
`error-permission`. Every screen states which states it omits and why, so an omission is a decision and
not a gap. The precedence between the states it does carry is never restated: `IX-PLATFORM-017` owns it.

### 6.2 The action-availability rule

Every action names one of three outcomes when it is not available, using `A11Y-PLATFORM-016` and
`CMP-PLATFORM-004`:

- **HIDDEN** — the actor is outside the scope that would make the action meaningful. Absent from the
  accessibility tree.
- **UNAVAILABLE** — the action exists for this actor but the record's lifecycle forecloses it. Present
  as an explained absence, not as a dead control.
- **DISABLED** — the same actor, on the same record, will be able to act once they complete something
  visible on this surface. Narrow, and never an authorization control.

A forbidden operation rendered as a disabled control is a defect in this product, because a disabled
control implies an override exists.

## 7. Platform strategy

| | Patient | Clinic and Admin |
|---|---|---|
| Runtime | React Native, `/api/v1` | Filament panel, in-process |
| Profile | C | A |
| Contract prefix | `API-*` | `SDC-*` |
| Density | `reading`, every archetype | `operational`, and `dense` on the five workspaces and table bodies |
| Hover | never emitted | available, and never the only affordance |
| Realization vocabulary | `Native`, `n/a` | `Stock`, `Extended`, `Custom`, `n/a` |

Every widget block and every screen spec states its realization in that vocabulary. `Stock` is a
contract about how the framework component is configured and what it must not do — it is not an
instruction to rebuild it. The three platforms are not one interface at three widths and no spec
converges them.

## 8. Responsive strategy

No arbitrary breakpoint appears anywhere in Phase 4. Every responsive statement resolves to a
`breakpoints.json` token.

**Profile C** uses `profile-c.size-class.compact`, `.medium` and `.expanded`, one primary reading column
capped at `profile-c.reading-column-max`, and the `profile-c.stack-threshold` condition, which is a text
size and not a width. A wider device produces whitespace, not a second pane.

**Profile A** uses `profile-a.content-width.narrow`, `.medium`, `.wide` and `.maximum`, measured on the
**content area** rather than the viewport. Each Profile A screen states whether its table stays a table
at `narrow`, degrades to the `reading-list` variant of `CMP-PLATFORM-006`, or keeps a bounded internal
horizontal scroll — which `A11Y-PLATFORM-036` permits for a data table and forbids for the page.

Both profiles state text-scaling behaviour, and every screen with a table or a rail states where its
filters, sticky elements and actions relocate.

## 9. Traceability strategy

- `SCREEN_SPEC_MAP.md` carries **one row per `SCR-*`, all 165**, and is the Phase 4 traceability source.
- Every widget block names the `WF-*` and `SCR-*` it is placed on; every screen spec names the `WGT-*`
  it places. The relation is closed in both directions and the closure is mechanically checked.
- Every reference to `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*` and `ERR-*` resolves to an existing Phase 3 or
  canonical definition. The Phase 3 gate already enforces three of those five and Phase 4 inherits it.
- Every widget declares a data source that resolves to a canonical owner — `docs/api/API_CONTRACTS.md`
  for `API-*`, `docs/domain/STAFF_INTERACTION_CONTRACTS.md` for `SDC-*`.

## 10. Accessibility binding strategy

Phase 4 **binds**, it does not author. Each screen names only the `A11Y-*` obligations that actually
apply to it; copying all 40 into 165 blocks would make the binding meaningless.

The binding is derived, not chosen:

| Trigger on the screen | Bound obligations |
|---|---|
| Any surface, both profiles | `A11Y-PLATFORM-004`, `-009`, `-015`, `-017`, `-023`, `-033` |
| Profile A | adds `A11Y-PLATFORM-001`, `-005`, `-018`, `-036` |
| Profile C | adds `A11Y-PLATFORM-003`, `-013`, `-035` |
| Any input | adds `A11Y-PLATFORM-026`, `-027`, `-019`, `-021` |
| Multi-step or draft-bearing | adds `A11Y-PLATFORM-028` |
| Authentication | adds `A11Y-PLATFORM-029` |
| List or table | adds `A11Y-PLATFORM-012`, `-008` |
| Overlay or dialog | adds `A11Y-PLATFORM-002`, `-007` |
| Mutation or live status change | adds `A11Y-PLATFORM-006`, `-011` |
| Destructive or irreversible action | adds `A11Y-PLATFORM-014`, `A11Y-AUDIT-001` |
| Any amount | adds `A11Y-FINANCE-001` |
| Evidence transfer | adds `A11Y-PLATFORM-034` |
| Treatment or plan change | adds `A11Y-CLINICAL-001` |
| Governed version or comparison | adds `A11Y-POLICY-001` |
| Mixed-direction content | adds `A11Y-PLATFORM-030`, `-031`, `-032` |
| Motion | adds `A11Y-PLATFORM-024`, `-025` |

Every screen states its focus entry point, its keyboard order where the profile has one, its
screen-reader hierarchy, and which transitions announce. **No conformance is claimed anywhere.**

## 11. Content binding strategy

- `TXT-*` families are **bound by reference**. Phase 4 places no new Arabic string into the system and
  restates no canonical `ERR-*` message: `docs/api/ERROR_CATALOG.md` owns those and forking one would
  create a second source of truth.
- Lifecycle labels come from `CONTENT_GUIDE_STATES.md` and the state channel, per audience. A screen
  never picks a label.
- `TXT-PLATFORM-018` — the sixteen-rule prohibitions master list — binds every screen. Screens whose
  specific risk it addresses restate the applicable rule as a prohibition in section 7 or 8, so the rule
  is checkable on that surface rather than only in the content guide.
- Every `ERR-*` a screen can surface is bound to **the interaction that raises it**, so an implementer
  knows which action produces which recovery.

## 12. Validation strategy

Run at every checkpoint, and all of them before the gate:

```bash
python docs/scripts/validate_docs.py
python docs/ux/scripts/validate_ux_docs.py --phase 3
python docs/ux/scripts/validate_ux_docs.py --phase 4
python docs/ux/scripts/validate_ux_tokens.py
python scripts/check_no_emoji.py
python scripts/check_no_emoji.py docs
```

Phase 4 preserves every Phase 3 invariant. The `--phase 3` run is kept in the list deliberately: a
Phase 4 change that breaks a Phase 3 rule must fail on the rule it broke.

### 12.1 Validator extensions, and why each protects a real invariant

Three changes to `docs/ux/scripts/validate_ux_docs.py`, all referential or structural, **none
count-based** and none weakening an existing check.

1. **A widget's data source may be `API-*` or `SDC-*`, and must resolve to its canonical owner.** The
   original check accepted only `API-*`. That is correct for Patient and wrong for the 118 staff
   surfaces: `STAFF_INTERACTION_CONTRACTS.md` section 1 states that Clinic and Admin Filament surfaces
   use `SDC-*` and that inventing internal REST endpoints is exactly what that file exists to prevent,
   and section 2 instructs the UX pipeline to reference `SDC-*` in Phase 4 specs. Accepting `SDC-*`
   without more would be a widening, so the check is **also strengthened**: every declared source, of
   either prefix, must match a heading in its canonical owner file. A mistyped or unallocated contract
   identifier of either prefix previously passed this gate and now fails it.
2. **Every `SCR-*` has a screen specification.** The Phase 4 gate previously warned when a widget was
   placed on no screen but never checked the other direction, so 164 of 165 screens could be missing
   and the gate stayed green. This is the central Phase 4 coverage invariant and it is referential, not
   a hardcoded 165.
3. **Required Phase 4 artifacts exist at their canonical lowercase paths.** The same defect class
   Session 7 of Phase 3 found: every other Phase 4 check is conditional on content being *found*, so a
   deleted or mis-cased artifact would leave the gate green.

Each was negative-tested before being relied on. No existing check was relaxed, no count was hardcoded,
and the Phase 3 gate is untouched.

### 12.2 Path case

`PHASE_03_HANDOFF.md` section 23 item 7 records that a case-insensitive working filesystem cannot show a
path-case defect at all. Phase 4 audits path case with `core.quotepath=false` and against `git archive`
output, never against the working directory.

## 13. Batching strategy

Eight batches, ordered so that every batch consumes only what an earlier batch settled.

| Batch | Content | Depends on |
|---|---|---|
| A | Phase 4 architecture, the `WGT-*` audit, this plan, the widget specs | Phase 3 |
| B | Patient identity, discovery, catalog, eligibility | A |
| C | Patient booking, clinical, finance, reviews, claims, platform | A, B |
| D | Clinic identity, onboarding, operational, booking | A |
| E | Clinic clinical, eligibility, evidence, finance, reviews, claims | A, D |
| F | Admin identity, operations, review queues | A |
| G | Admin catalog, eligibility, policy, finance, audit, platform | A, F |
| H | Cross-platform reconciliation, `SCREEN_SPEC_MAP.md`, validator, handoff | B to G |

The widget taxonomy is fixed in batch A and is **not** casually renamed in later batches. Where a later
batch found a genuine gap, the widget was added append-only and the earlier batches were revisited, not
the identifier reused.

## 14. Unresolved dependencies

Carried forward exactly as `PHASE_03_HANDOFF.md` section 15 states them, re-measured against
`docs/README.md` at the start of this phase. Seven open.

| ID | Severity | Effect on Phase 4 |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Limits any claim of complete reconciliation against readable SRS v1.1. Does not invalidate the approved derivative baseline. |
| `Q-CATALOG-001` | Major | Catalog surfaces are specified. Production medical content still requires licensed clinical approval. **Not closed here.** |
| `Q-ELIG-001` | Major | Eligibility surfaces are specified. Production formulas, weights, thresholds, bands and calibration minimums require licensed clinical approval. **Not closed here.** |
| `Q-PLATFORM-002` | Major | Retention and legal-hold surfaces state that current periods are provisional pending legal validation. |
| `Q-OPS-001` | Major | Every evidence-transfer surface specifies behaviour up to the transfer boundary and stops there. **No vendor is selected in a UX phase.** |
| `Q-PLATFORM-004` | Minor | No effect on specification. |
| `Q-PLATFORM-008` | Minor | The palette stays provisional. Every spec references semantic tokens only, so ratification remains a one-layer change. |

None blocks specification of behaviour the canonical product contract already defines. Where an open
question bounds a surface, the screen spec says where the boundary is instead of guessing past it.

## 15. Phase 5 handoff expectations

Phase 5 receives, and must not re-decide:

- the `WGT-*` taxonomy and every widget contract;
- per-screen composition, action model, data-state arrangement and responsive behaviour;
- the platform realization split, in the profile vocabulary;
- every binding of `TXT-*`, `A11Y-*` and `ERR-*` to a surface;
- the acceptance criteria, which are the Phase 5 test targets.

Phase 5 owns, and Phase 4 explicitly does not:

- the build manifest and the Figma production handoff;
- implementation contracts, production components, resources, pages and application code;
- **all rendered QA.** `ACCESSIBILITY.md` section 20 lists those obligation by obligation. No Phase 4
  green gate implies any of them, and none is reported as satisfied here.

## 16. Stop condition

Phase 4 is complete only when: the widget taxonomy is coherent and every allocated `WGT-*` resolves; all
165 `SCR-*` have a specification bound to their existing `WF-*`; every `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*`
and `ERR-*` reference resolves; responsive behaviour, data states, permission behaviour and platform
realization are specified per screen; no upstream decision was re-made; every local gate is green; CI is
promoted to `--phase 4` and the promoted job has actually run and passed; and `PHASE_04_HANDOFF.md`
exists. Phase 5 begins only on explicit approval.
