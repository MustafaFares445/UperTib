# UX Phase 5 Implementation Plan — Build and Handoff

**Phase:** UX 5 — Build and Handoff
**Execution status:** Sessions 1–7 complete; final Phase 5 remote gate passed
**Input gate:** `docs/ux/PHASE_04_HANDOFF.md`, complete and passed on CI
**Owns:** the Phase 5 artifact architecture, the widget implementation classification, the build
dependency order, the target-path analysis, the manifest and frame-coverage strategy, the
implementation-contract schema, and the verification strategy.
**Validator at completion gate:** `python docs/ux/scripts/validate_ux_docs.py --phase 5`.
The completion run promotes CI only after the manifest, all 30 contracts, traceability, verification and handoff exist.

This file began as the Session 1 plan. Later sessions produced the manifest, all implementation contracts, traceability and handoff without production code or an actual Figma render.

---

## 1. Authority chain

Inherited whole from Phase 4 and reasserted, because Phase 5 is the phase that touches a repository
and is therefore the phase most likely to let an implementation convenience overwrite a product
decision.

```
canonical product and engineering behaviour     docs/PRD.md, docs/SDD.md, docs/domain/*,
                                                docs/api/*, docs/database/*, docs/architecture/*,
                                                docs/ops/*, docs/implementation/*
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
Phase 4  30 WGT-*, 165 per-screen specifications
        v
Phase 5  build manifest, implementation contracts, traceability, verification   <- this phase
```

Two rules govern every conflict Phase 5 can meet:

1. **Upward.** Where a Phase 5 artifact and anything above it disagree, the upstream owner wins and
   the Phase 5 artifact is the defect. Phase 5 raises the conflict against its owner; it does not
   resolve it locally.
2. **Sideways.** Where the derived Figma file and an implementation contract disagree, the contract
   wins. Section 11 states this as a standing rule for both consumers.

Nothing new is designed in Phase 5. If a translation step requires a design or product decision, the
earlier phase that owns it is incomplete, and Phase 5 names that phase and stops.

## 2. Current measured baseline

Measured from the committed artifacts at the start of this session by counting headings in each
family's canonical owner, not carried forward from the Phase 4 handoff text.

| Family | Measured | Owner counted |
|---|---:|---|
| `SCR-*` | 165 | `01-foundation/INFORMATION_ARCHITECTURE.md` |
| `FLOW-*` | 103 | `01-foundation/USER_FLOWS.md` |
| `WF-*` | 165 | `02-wireframes/WIREFRAMES_*.md` |
| `CMP-*` | 22 | `03-system/COMPONENT_INVENTORY_PLATFORM.md`, `_DOMAIN.md` |
| `IX-*` | 26 | `03-system/INTERACTION_PATTERNS.md`, `_DOMAIN.md` |
| `TXT-*` | 60 | `03-system/CONTENT_GUIDE*.md` |
| `A11Y-*` | 40 | `03-system/ACCESSIBILITY.md` |
| `WGT-*` | 30 | `04-specs/WIDGET_SPECS_PLATFORM.md`, `_DOMAIN.md` |
| `ERR-*` | 21 | `docs/api/ERROR_CATALOG.md` |
| `API-*` | 36 | `docs/api/API_CONTRACTS.md` |
| `SDC-*` | 24 | `docs/domain/STAFF_INTERACTION_CONTRACTS.md` |

Placement, recomputed independently from `04-specs/SCREEN_SPEC_MAP.md` rather than read from the
handoff:

| Measure | Value |
|---|---:|
| Screens with a map row | 165 |
| Total `WGT-*` placements | 885 |
| Mean widgets per screen | 5.36 |
| Minimum / maximum widgets on one screen | 2 / 10 |
| Widgets placed on no screen | 0 |
| Patient / Clinic / Admin screens | 47 / 56 / 62 |

Every figure agrees with `PHASE_04_HANDOFF.md` sections 3 and 7. The Phase 4 baseline is therefore
reproducible and is adopted unchanged.

Measured reach per widget, per platform, from the same source. This table is the input to section 6
and to the frame budget in section 9.

| Widget | Total | Patient | Clinic | Admin |
|---|---:|---:|---:|---:|
| `WGT-PLATFORM-001` | 165 | 47 | 56 | 62 |
| `WGT-PLATFORM-003` | 161 | 45 | 56 | 60 |
| `WGT-PLATFORM-002` | 156 | 44 | 51 | 61 |
| `WGT-PLATFORM-005` | 85 | 19 | 26 | 40 |
| `WGT-PLATFORM-010` | 62 | 13 | 31 | 18 |
| `WGT-PLATFORM-004` | 39 | 9 | 13 | 17 |
| `WGT-PLATFORM-007` | 38 | 8 | 10 | 20 |
| `WGT-PLATFORM-006` | 33 | 6 | 6 | 21 |
| `WGT-POLICY-001` | 16 | 0 | 0 | 16 |
| `WGT-PLATFORM-014` | 15 | 2 | 3 | 10 |
| `WGT-ELIG-002` | 13 | 1 | 6 | 6 |
| `WGT-IDENTITY-002` | 13 | 5 | 4 | 4 |
| `WGT-PLATFORM-011` | 10 | 0 | 8 | 2 |
| `WGT-PLATFORM-008` | 9 | 1 | 4 | 4 |
| `WGT-OPS-001` | 8 | 0 | 3 | 5 |
| `WGT-CLINICAL-002` | 7 | 3 | 2 | 2 |
| `WGT-IDENTITY-001` | 6 | 2 | 3 | 1 |
| `WGT-PLATFORM-013` | 6 | 0 | 0 | 6 |
| `WGT-ELIG-001` | 5 | 5 | 0 | 0 |
| `WGT-FINANCE-001` | 5 | 1 | 1 | 3 |
| `WGT-OPS-002` | 5 | 0 | 0 | 5 |
| `WGT-BOOKING-001` | 4 | 2 | 2 | 0 |
| `WGT-BOOKING-002` | 4 | 2 | 2 | 0 |
| `WGT-CATALOG-001` | 4 | 0 | 0 | 4 |
| `WGT-CLAIMS-001` | 4 | 2 | 1 | 1 |
| `WGT-CLINICAL-003` | 4 | 1 | 3 | 0 |
| `WGT-PLATFORM-009` | 4 | 2 | 1 | 1 |
| `WGT-CLINICAL-001` | 2 | 0 | 2 | 0 |
| `WGT-PLATFORM-012` | 1 | 1 | 0 | 0 |
| `WGT-POLICY-002` | 1 | 0 | 0 | 1 |

Three of the thirty carry 482 of the 885 placements. That fact, not a preference, is what fixes the
first three entries of the build order.

## 3. Scope and non-goals

### 3.1 What Phase 5 owns

1. `05-build/figma/BUILD_MANIFEST.json` and `05-build/figma/NAMING.md` — the derived drawing input.
2. `05-build/IMPLEMENTATION_CONTRACTS.md` — one self-sufficient contract per `WGT-*`, in build order.
3. An `AGENTS.md` UI section that points at the above and states the non-negotiables.
4. `05-build/DESIGN_TRACEABILITY.md` — the forward and reverse chain proof.
5. `05-build/FULL_CHAIN_VERIFICATION.md` — the re-run of every phase, with real output.
6. `PHASE_05_HANDOFF.md`.
7. The Phase 5 validator extensions, and the CI promotion to `--phase 5` at the final gate only.

### 3.2 What Phase 5 must not do

- **No production code.** No Laravel, Filament or React Native source, no migration, model,
  controller, policy, service, action, resource, page, widget class or test. Phase 5 writes contracts
  that a coding agent later executes; it does not execute them. Session 1 inspected the repository
  and changed nothing in it.
- **No design decision.** The frozen set is the whole of `PHASE_03_HANDOFF.md` section 17 and
  `PHASE_04_HANDOFF.md` section 17: the 165 `SCR-*`, 103 `FLOW-*`, 165 `WF-*`, 22 `CMP-*`,
  26 `IX-*`, 60 `TXT-*`, 40 `A11Y-*`, 30 `WGT-*`, lifecycle semantics, screen hierarchy, widget
  composition, the `API-*` versus `SDC-*` platform split, the right-to-left rules, the accessibility
  architecture, the zero-money-movement boundary and the light-only V1 scope.
- **No renumbering, merging, splitting or renaming of any `WGT-*`** to suit a framework. Where a
  framework makes one awkward, the framework usage is adapted and the adaptation is recorded in that
  widget's contract.
- **No invented target path.** A path either exists in the repository or is declared `(Proposed)` by
  a canonical engineering document. Phase 5 does not create a third category for the Patient client:
  `TASK-PLATFORM-008` owns that bootstrap and must record the real paths and commands first.
- **No vendor selection.** `Q-OPS-001` is not closed by naming a storage, scanning, one-time-code or
  notification provider in a contract.
- **No clinical content.** `Q-CATALOG-001` and `Q-ELIG-001` remain open; representative content in
  the manifest is provisional and labelled as such — section 9.6.
- **No conformance claim.** Every rendered and runtime obligation is reported by tier, and an
  unrun check is reported as unrun — section 13.
- **No dark mode.** V1 is light-only and the manifest emits zero dark frames.

## 4. Known upstream correction — result

### 4.1 The defect

`PHASE_04_HANDOFF.md` section 10 raised one upstream reference defect and did not apply it, because
Phase 4 does not edit Phase 1: `SCR-ELIG-010` — Service price — was recorded in Phase 1 against
`SDC-ELIG-001` while Phase 4 specified it against `SDC-ELIG-005`.

### 4.2 Independent verification

Confirmed, from four sources, before anything was edited.

| # | Source | Evidence |
|---|---|---|
| 1 | `docs/domain/STAFF_INTERACTION_CONTRACTS.md`, `SDC-ELIG-001` | Clinic Service Activation Workspace. Requirements `FR-ELIG-007`–`008`. Projection: service definitions, versioned questionnaire, provider and branch facts, required evidence, evidence status, activation request state, actionable blockers. **It carries no price field of any kind.** |
| 2 | Same file, `SDC-ELIG-005` | Clinic Provider Price and Display-Mode Workspace. Requirements `FR-ELIG-009`, `FR-ELIG-014`, `FR-ELIG-018`. Projection: the provider's own price facts with display mode, amount or bounds, currency, effective period, provenance and superseded predecessor. Commands: record a new price fact, supersede prospectively, withdraw a future-dated fact. |
| 3 | `01-foundation/INFORMATION_ARCHITECTURE.md`, the `SCR-ELIG-010` block itself | Its `Requirements` line reads `FR-ELIG-009, FR-ELIG-014` — the exact requirement pair `SDC-ELIG-005` declares and a pair `SDC-ELIG-001` does not carry at all. Its own `Notes` cite `FR-ELIG-018`, governed display-mode selection, prospective superseding and the accepted-snapshot protection, which are `SDC-ELIG-005`'s stated Rules and Commands verbatim in substance. |
| 4 | `01-foundation/UX_FOUNDATION.md`, `JTBD-ELIG-006` | The job this screen serves already binds `SDC-ELIG-005`. Phase 1's own job layer and its own screen layer disagreed with each other; the screen layer was the stale one. |

Source 4 is decisive: the correction reconciles Phase 1 with itself. `SDC-ELIG-005` also sits after
`SDC-ELIG-003` and out of numeric order in its owner file, which is the ordering evidence that it was
appended after the Phase 1 screen entry was written.

### 4.3 What was applied

One line, in one file.

```text
docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md, SCR-ELIG-010 block
-  **Contract:** SDC-ELIG-001
+  **Contract:** SDC-ELIG-005
```

Nothing else changed. The screen's purpose, job, requirements, roles, entry points, exits, lifecycle
statuses, notes, wireframe, flows, widgets, components, patterns, content rules, accessibility
obligations and errors are untouched, and no Phase 2, 3 or 4 artifact was edited. The Phase 4 screen
block and `SCREEN_SPEC_MAP.md` already specified `SDC-ELIG-005`, so the correction removes a
divergence rather than creating one. `PHASE_04_HANDOFF.md` section 19 item 2 — the recorded deviation
— is now discharged.

### 4.4 The same staleness elsewhere, raised and not applied

`FLOW-ELIG-008` — Submit a service price — and `FLOW-ELIG-011` — Resolve pending-evaluation blockers
— both route through `SCR-ELIG-010` and both list `SDC-ELIG-001` without `SDC-ELIG-005` on their
`Contracts` line. This is the same upstream staleness at the flow layer. It is **raised here and not
applied**, because the session's correction mandate is explicitly limited to the `SCR-ELIG-010`
contract line and explicitly forbids modifying its `FLOW-*`. Section 17 records it for the Phase 1
owner.

## 5. `WGT-*` implementation classification

### 5.1 The vocabulary, and which axis each runtime actually has

Phase 4 section 7 fixed two different realization vocabularies on purpose, and Phase 5 does not merge
them:

| Profile | Runtime | Vocabulary Phase 4 allows |
|---|---|---|
| C — Patient | React Native, `/api/v1` | `Native`, `n/a` |
| A — Clinic and Admin | Filament panel, in-process | `Stock`, `Extended`, `Custom`, `n/a` |

`Stock` is a claim about a **shipped framework component being configured rather than rebuilt**.
Filament ships that component layer; React Native core does not. Phase 4 therefore used `Native` on
Profile C, and `docs/implementation/USER_IMPLEMENTATION_PLAN.md` `TASK-PLATFORM-008` records that the
Patient client's navigation, state and component libraries are not selected and must not be selected
silently. So:

- **Profile A realization is measured**, transcribed from each widget's own Realization table. It is
  a Phase 4 fact and carries no new decision.
- **Profile C realization is `Native`**, also a Phase 4 fact.
- A three-way classification of the two **Patient-only** widgets is *derived* by Phase 5 against
  React Native core primitives, marked provisional, and revisited when `TASK-PLATFORM-008` records
  the actual stack. It is flagged rather than presented as measured.

### 5.2 Definitions used

| Realization | Test |
|---|---|
| `Stock` | The framework primitive realizes it with configuration. The contract is configuration plus the permission gate; it does not restate what the framework renders. |
| `Extended` | The framework primitive plus meaningful UberTib-specific behaviour or view. The contract specifies the delta and the framework defaults that must be switched off. |
| `Custom` | It needs its own implementation boundary because no framework primitive carries the behaviour. The contract specifies the view fully. |

UberTib styling is never on its own a reason to call something `Custom`. Every widget below that is
`Custom` is `Custom` because Phase 4 states a behaviour the framework does not ship, and each row
carries that reason.

### 5.3 The classification table

Reach, platform split and screen counts are measured (section 2). Realization is transcribed from
Phase 4. Path status is from section 7.

| # | Widget | Name | Platforms | Screens | Mandatory `CMP-*` core | Owning `IX-*` | Data contracts | Profile C | Profile A | Target runtime | Target path | Path status |
|---:|---|---|---|---:|---|---|---|---|---|---|---|---|
| 1 | `WGT-PLATFORM-001` | Structural state region | C, A | 165 | `CMP-PLATFORM-009`, `-010` | `IX-PLATFORM-017` | owning surface's own | `Native` | `Extended` | RN + Filament | RN shared; `app/Filament/Support` | Proposed both |
| 2 | `WGT-PLATFORM-002` | Subject context bar | C, A | 156 | `CMP-PLATFORM-003` | `IX-PLATFORM-007` | `API-IDENTITY-003`, `SDC-IDENTITY-004` | `Native` | `Custom` | RN + Filament | RN chrome; panel-global render hook | Proposed both |
| 3 | `WGT-PLATFORM-003` | State-gated action region | C, A | 161 | `CMP-PLATFORM-004` | `IX-PLATFORM-001` | owning record's own | `Native` | `Extended` | RN + Filament | RN shared; Filament page and table actions | Proposed both |
| 4 | `WGT-PLATFORM-004` | Filter and result toolbar | C, A | 39 | `CMP-PLATFORM-007`, `-009` | `IX-PLATFORM-014` | `API-ELIG-001`, `SDC-OPS-001`, `SDC-AUDIT-001` | `Native` | **`Stock`** | RN + Filament | RN shared; Filament table filters | Proposed both |
| 5 | `WGT-PLATFORM-005` | Lifecycle record list | C, A | 85 | `CMP-PLATFORM-006` | `IX-PLATFORM-015` | owning projection | `Native` | `Extended` | RN + Filament | RN shared; Filament table | Proposed both |
| 6 | `WGT-PLATFORM-006` | Decision-bearing event timeline | C, A | 33 | `CMP-PLATFORM-008` | `IX-PLATFORM-016` | `API-CLINICAL-004`, `API-FINANCE-005`, `SDC-AUDIT-001` | `Native` | `Custom` | RN + Filament | RN shared; custom infolist entry | Proposed both |
| 7 | `WGT-PLATFORM-007` | Sensitive decision confirmation | C, A | 38 | `CMP-PLATFORM-014`, `-004` | `IX-AUDIT-001` | owning command's own | `Native` | `Extended` | RN + Filament | RN sheet; Filament action modal | Proposed both |
| 8 | `WGT-PLATFORM-008` | Evidence transfer panel | C, A | 9 | `CMP-PLATFORM-012` | `IX-PLATFORM-006` | `API-PLATFORM-001`, `SDC-IDENTITY-001`, `SDC-ELIG-001` | `Native` | `Extended` | RN + Filament | RN shared; Filament file field | Proposed both |
| 9 | `WGT-PLATFORM-009` | Attention and notification feed | C, A | 4 | `CMP-PLATFORM-015`, `-001` | none named | `API-PLATFORM-002`, `SDC-OPS-001` | `Native` | `Extended` | RN + Filament | RN feed; Filament dashboard widget | Proposed both |
| 10 | `WGT-PLATFORM-010` | Validation and correction region | C, A | 62 | `CMP-PLATFORM-011` | `IX-PLATFORM-018` | owning command's own | `Native` | **`Stock`** | RN + Filament | RN shared; Filament validation display | Proposed both |
| 11 | `WGT-PLATFORM-011` | Draft continuity bar | A | 10 | `CMP-PLATFORM-011` | `IX-PLATFORM-005` | six `SDC-*` | `n/a` | `Custom` | Filament | `app/Filament/Support` | Proposed |
| 12 | `WGT-PLATFORM-012` | Submission reconciliation panel | C | 1 | `CMP-PLATFORM-011`, `-006` | `IX-PLATFORM-004` | `API-BOOKING-002`, `API-CLAIMS-003`, `API-FINANCE-005` | `Native` | `n/a` | React Native | Patient project root | Proposed, unverified |
| 13 | `WGT-PLATFORM-013` | Itemized verification list | A | 6 | `CMP-PLATFORM-013` | none named | `SDC-IDENTITY-002`, `-005`, `SDC-ELIG-002` | `n/a` | `Extended` | Filament | `app/Filament/Resources` | Proposed |
| 14 | `WGT-PLATFORM-014` | Before-and-after disclosure block | C, A | 15 | `CMP-CLINICAL-002` | none named | `API-CLINICAL-002` and seven `SDC-*` | `Native` | `Custom` | RN + Filament | RN shared; custom infolist entry | Proposed both |
| 15 | `WGT-IDENTITY-001` | Verification challenge form | C, A | 6 | `CMP-PLATFORM-011` | none named | `API-IDENTITY-001`, `-002`, `SDC-IDENTITY-001` | `Native` | `Extended` | RN + Filament | RN auth; Filament login extension | Proposed both |
| 16 | `WGT-IDENTITY-002` | Authorization grant panel | C, A | 13 | `CMP-PLATFORM-003`, `-004` | `IX-PLATFORM-007` | four `API-IDENTITY-*`, three `SDC-IDENTITY-*` | `Native` | `Extended` | RN + Filament | RN feature; Filament resource | Proposed both |
| 17 | `WGT-ELIG-001` | Provider option set | C | 5 | `CMP-ELIG-001` | none named | `API-ELIG-001` | `Native` | `n/a` | React Native | Patient project root | Proposed, unverified |
| 18 | `WGT-ELIG-002` | Eligibility decision block | C, A | 13 | `CMP-ELIG-003` | `IX-ELIG-001` | `API-ELIG-002`, `SDC-ELIG-002`, `-003`, `-004` | `Native` | `Custom` | RN + Filament | RN feature; custom infolist entry | Proposed both |
| 19 | `WGT-BOOKING-001` | Slot and capacity selector | C, A | 4 | `CMP-PLATFORM-001` | `IX-ELIG-001` | `API-ELIG-001`, `API-BOOKING-001`, `SDC-BOOKING-001`, `-002` | `Native` | `Extended` | RN + Filament | RN feature; Filament form section | Proposed both |
| 20 | `WGT-BOOKING-002` | Proposal without displacement | C, A | 4 | `CMP-PLATFORM-001`, `-005` | `IX-BOOKING-002` | four `API-BOOKING-*`, `SDC-BOOKING-001`, `-002` | `Native` | `Custom` | RN + Filament | RN feature; custom infolist entry | Proposed both |
| 21 | `WGT-CLINICAL-001` | Treatment plan authoring section | A | 2 | `CMP-CLINICAL-001`, `CMP-ELIG-002`, `CMP-PLATFORM-007` | none named | `SDC-CLINICAL-001`, `SDC-POLICY-002`, `SDC-CATALOG-002` | `n/a` | `Custom` | Filament | `app/Filament/Clinic` | Proposed |
| 22 | `WGT-CLINICAL-002` | Treatment plan reader | C, A | 7 | `CMP-CLINICAL-001` | none named | `API-CLINICAL-002`, `API-FINANCE-001`, `SDC-CLINICAL-001` | `Native` | `Extended` | RN + Filament | RN feature; Filament infolist | Proposed both |
| 23 | `WGT-CLINICAL-003` | Stage execution panel | C, A | 4 | `CMP-PLATFORM-001` | none named | `API-CLINICAL-004`, `SDC-CLINICAL-001` | `Native` | `Extended` | RN + Filament | RN feature; Filament infolist and actions | Proposed both |
| 24 | `WGT-CATALOG-001` | Launch gate panel | A | 4 | `CMP-POLICY-001` | `IX-POLICY-001` | `SDC-CATALOG-001`, `-003` | `n/a` | `Custom` | Filament | `app/Filament/Resources` | Proposed |
| 25 | `WGT-POLICY-001` | Governed version and lifecycle bar | A | 16 | `CMP-POLICY-001` | `IX-POLICY-001` | five `SDC-*` | `n/a` | `Custom` | Filament | `app/Filament/Support` | Proposed |
| 26 | `WGT-POLICY-002` | Market observation entry grid | A | 1 | `CMP-PLATFORM-006`, `CMP-POLICY-001` | `IX-PLATFORM-012` | `SDC-POLICY-002` | `n/a` | `Custom` | Filament | `app/Filament/Resources` | Proposed |
| 27 | `WGT-OPS-001` | Work queue row and list | A | 8 | `CMP-OPS-001` | `IX-OPS-001` | `SDC-OPS-001` | `n/a` | `Extended` | Filament | `app/Filament/Resources` | Proposed |
| 28 | `WGT-OPS-002` | Operational metric and reporting block | A | 5 | `CMP-PLATFORM-006` | none named | `SDC-OPS-002` | `n/a` | `Extended` | Filament | `app/Filament/Widgets` | Proposed |
| 29 | `WGT-FINANCE-001` | External financial event ledger | C, A | 5 | `CMP-PLATFORM-008`, `CMP-ELIG-002` | none named | `API-FINANCE-005`, `-001`, `SDC-FINANCE-001` | `Native` | `Extended` | RN + Filament | RN feature; Filament infolist | Proposed both |
| 30 | `WGT-CLAIMS-001` | Claim evidence and deadline panel | C, A | 4 | `CMP-PLATFORM-005`, `-006` | none named | `API-CLAIMS-002`, `-004`, `SDC-CLAIMS-001` | `Native` | `Extended` | RN + Filament | RN feature; Filament infolist | Proposed both |

The `Target path` column carries the directory, not the class name. Class names are a Session 3 to 5
decision inside each contract, and they follow the existing repository conventions rather than
inventing new ones.

### 5.4 Counts

**Profile A, measured from Phase 4 — the authoritative classification:**

| Realization | Count | Widgets |
|---|---:|---|
| `Stock` | 2 | `WGT-PLATFORM-004`, `WGT-PLATFORM-010` |
| `Extended` | 16 | `WGT-PLATFORM-001`, `-003`, `-005`, `-007`, `-008`, `-009`, `-013`, `WGT-IDENTITY-001`, `-002`, `WGT-BOOKING-001`, `WGT-CLINICAL-002`, `-003`, `WGT-OPS-001`, `-002`, `WGT-FINANCE-001`, `WGT-CLAIMS-001` |
| `Custom` | 10 | `WGT-PLATFORM-002`, `-006`, `-011`, `-014`, `WGT-ELIG-002`, `WGT-BOOKING-002`, `WGT-CLINICAL-001`, `WGT-CATALOG-001`, `WGT-POLICY-001`, `-002` |
| `n/a` on Profile A | 2 | `WGT-PLATFORM-012`, `WGT-ELIG-001` |

**Profile C, measured from Phase 4:** `Native` 22, `n/a` 8.

**Whole-set three-way roll-up**, which is the Profile A value where one exists, and the derived
provisional value for the two Patient-only widgets:

| Realization | Count |
|---|---:|
| `Stock` | 2 |
| `Extended` | 16 |
| `Custom` | 12 |

The two derived entries are `WGT-PLATFORM-012` — a durable outstanding-command store reconciled
against authoritative reads on resume, which no React Native core primitive supplies — and
`WGT-ELIG-001` — one attribute set in four arrangements over `CMP-ELIG-001` with a governed price
display. Both are marked provisional pending `TASK-PLATFORM-008` and both are re-checked in
Session 5 if that task lands first.

### 5.5 Two `Stock` widgets, and why that number is small rather than wrong

Only `WGT-PLATFORM-004` and `WGT-PLATFORM-010` are `Stock` on Profile A, and both remain `Stock`
under a real reading of their blocks: the toolbar is Filament table filters and search configured to
persist per actor and surface with the applied-filter summary and count rendered, and the validation
region is Filament's validation display configured rather than replaced. Their contracts are
therefore configuration plus the permission gate and must not restate what the framework renders.
Every other Profile A widget names at least one framework default it must switch off — bulk actions,
a delete action over an immutable entity, the default confirmation text, a visibility callback
standing in for an unregistered action — which is the `Extended` boundary, not styling.

## 6. Dependency and build order

### 6.1 What counts as a dependency

`WIDGET_SPECS.md` section 3 fixes the composition rule: widgets compose components, they do not
compose each other, with the deliberate exceptions it names. Phase 5 therefore derives widget-level
edges **only** from statements Phase 4 actually makes, and never from co-occurrence on a screen,
which would be a guess. Component prerequisites are modelled as a separate tier in section 6.4
rather than converted into widget edges, because a `CMP-*` is owned by Phase 3 and built as a
component, not as part of the widget that first needs it.

### 6.2 The measured edge set

Six edge groups, thirty-four edges, every one quoted from its Phase 4 source.

| # | Edge | Source | What the source says |
|---|---|---|---|
| E1 | `WGT-PLATFORM-001` precedes all 29 others | `WIDGET_SPECS.md` section 3 | It "is resolved BEFORE any other widget renders content. Every other block states what it does under each state rather than re-implementing the precedence." |
| E2 | `WGT-PLATFORM-003` precedes `WGT-PLATFORM-007` | `WIDGET_SPECS.md` section 3, and the `WGT-PLATFORM-003` Composes line | The action region "HOSTS the trigger for `WGT-PLATFORM-007`, which owns the confirmation." |
| E3 | `WGT-PLATFORM-004` precedes `WGT-PLATFORM-005` | `WGT-PLATFORM-005` data-state table | Its `empty-filtered` row renders "with the applied filter still visible in `WGT-PLATFORM-004`". |
| E4 | `WGT-PLATFORM-002` precedes `WGT-PLATFORM-009` | `WGT-PLATFORM-009` block | The Profile A feed is "scoped by `WGT-PLATFORM-002` rather than filtered". |
| E5 | `WGT-PLATFORM-003` precedes `WGT-PLATFORM-012` | `WGT-PLATFORM-012` block | Its `inline` and `banner` variants "belong to `WGT-PLATFORM-003`", and Profile A "reconciles in place through `WGT-PLATFORM-003`". |
| E6 | `WGT-PLATFORM-008` precedes `WGT-CLAIMS-001` | `WGT-CLAIMS-001` offline row | Supplying evidence "resumes from its interruption point under `WGT-PLATFORM-008`". |

**Nodes 30, edges 34, cycles 0.** Longest path length 2. The graph is a shallow fan from
`WGT-PLATFORM-001` with five second-order constraints.

One cross-widget mention was examined and **rejected** as an edge: `WGT-CATALOG-001` names
`WGT-PLATFORM-005` and `WGT-OPS-002`, but only to record that it is *not* placed on `SCR-OPS-006`
and that the readiness roll-up renders through those two instead. That is a non-placement note.
A second was rejected on the same test: `WGT-PLATFORM-011` names `WGT-PLATFORM-012` only to explain
why it is `n/a` on Profile C. Neither is a build dependency and neither is drawn as one.

### 6.3 The ordering rule

The edge set alone leaves twenty-four widgets tied. Ties are broken by a stated scheduling policy,
which is a policy and **not** a claimed dependency:

1. **Hard constraint first.** No widget precedes one of its predecessors in E1 through E6.
2. Platform-level (`WGT-PLATFORM-*`) before domain-level, because the platform set carries 784 of the
   885 placements and every domain contract references at least one of its obligations.
3. Then measured reach descending — a widget on more screens unblocks more screens.
4. Then identifier ascending, so the order is reproducible rather than authored.

Applying rules 2 to 4 alone produced exactly one violation of rule 1: `WGT-PLATFORM-005` (reach 85)
sorted above `WGT-PLATFORM-004` (reach 39), against E3. `WGT-PLATFORM-004` is therefore promoted
above it, and the promotion is recorded here rather than hidden in a sort.

### 6.4 The component tier that precedes the widget tier

Every widget's mandatory `CMP-*` core must exist before that widget. The 22 components are built
once, in their own tier, and each widget contract names the components it requires. Measured Profile
A component realization, for scheduling that tier: `Stock` 1 (`CMP-PLATFORM-007`), `Extended` 14,
`Custom` 6 (`CMP-PLATFORM-002`, `-005`, `-008`, `-012`, `CMP-ELIG-003`, `CMP-CLINICAL-002`),
`n/a` 1 (`CMP-ELIG-001`, Patient-only). The six `Custom` components are the long-lead items of the
whole build and are named in each dependent widget contract as a prerequisite, not as a sub-task.

### 6.5 The build order

| Order | Widget | Depends on | What it unblocks | Platforms | Realization |
|---:|---|---|---|---|---|
| 1 | `WGT-PLATFORM-001` | none | all 29 others; every one of the 165 screens | C, A | `Native` / `Extended` |
| 2 | `WGT-PLATFORM-003` | 1 | `WGT-PLATFORM-007`, `WGT-PLATFORM-012`; 161 screens | C, A | `Native` / `Extended` |
| 3 | `WGT-PLATFORM-002` | 1 | `WGT-PLATFORM-009`; 156 screens | C, A | `Native` / `Custom` |
| 4 | `WGT-PLATFORM-004` | 1 | `WGT-PLATFORM-005`; 39 screens. Promoted above reach order by E3 | C, A | `Native` / `Stock` |
| 5 | `WGT-PLATFORM-005` | 1, 4 | 85 screens, the largest single list surface set | C, A | `Native` / `Extended` |
| 6 | `WGT-PLATFORM-010` | 1 | the 62 committing form and workspace surfaces | C, A | `Native` / `Stock` |
| 7 | `WGT-PLATFORM-007` | 1, 2 | 38 sensitive-decision surfaces | C, A | `Native` / `Extended` |
| 8 | `WGT-PLATFORM-006` | 1 | 33 append-only history surfaces | C, A | `Native` / `Custom` |
| 9 | `WGT-PLATFORM-014` | 1 | 15 comparison surfaces | C, A | `Native` / `Custom` |
| 10 | `WGT-PLATFORM-011` | 1 | 10 draft-bearing panel surfaces | A | `Custom` |
| 11 | `WGT-PLATFORM-008` | 1 | `WGT-CLAIMS-001`; 9 evidence surfaces | C, A | `Native` / `Extended` |
| 12 | `WGT-PLATFORM-013` | 1 | 6 Admin item-verification surfaces | A | `Extended` |
| 13 | `WGT-PLATFORM-009` | 1, 3 | 4 landing and feed surfaces | C, A | `Native` / `Extended` |
| 14 | `WGT-PLATFORM-012` | 1, 2 | `SCR-PLATFORM-002` | C | `Native` |
| 15 | `WGT-POLICY-001` | 1 | 16 governed-version surfaces | A | `Custom` |
| 16 | `WGT-ELIG-002` | 1 | 13 eligibility surfaces across both profiles | C, A | `Native` / `Custom` |
| 17 | `WGT-IDENTITY-002` | 1 | 13 grant and representation surfaces | C, A | `Native` / `Extended` |
| 18 | `WGT-OPS-001` | 1 | 8 queue surfaces; the panel landing depth reduction | A | `Extended` |
| 19 | `WGT-CLINICAL-002` | 1 | 7 plan-reading surfaces | C, A | `Native` / `Extended` |
| 20 | `WGT-IDENTITY-001` | 1 | 6 challenge surfaces; every gated entry point | C, A | `Native` / `Extended` |
| 21 | `WGT-ELIG-001` | 1 | 5 Patient discovery and choice surfaces | C | `Native` |
| 22 | `WGT-FINANCE-001` | 1 | 5 external-event surfaces | C, A | `Native` / `Extended` |
| 23 | `WGT-OPS-002` | 1 | 5 reporting surfaces | A | `Extended` |
| 24 | `WGT-BOOKING-001` | 1 | 4 slot-selection surfaces | C, A | `Native` / `Extended` |
| 25 | `WGT-BOOKING-002` | 1 | 4 proposal surfaces | C, A | `Native` / `Custom` |
| 26 | `WGT-CATALOG-001` | 1 | 4 launch-gate surfaces | A | `Custom` |
| 27 | `WGT-CLAIMS-001` | 1, 11 | 4 claim surfaces | C, A | `Native` / `Extended` |
| 28 | `WGT-CLINICAL-003` | 1 | 4 stage surfaces | C, A | `Native` / `Extended` |
| 29 | `WGT-CLINICAL-001` | 1 | 2 authoring workspaces; the deepest Clinic path | A | `Custom` |
| 30 | `WGT-POLICY-002` | 1 | `SCR-ELIG-023` | A | `Custom` |

Every widget appears exactly once. Every E1 to E6 constraint holds. The order is reproducible from
the rule in section 6.3 plus the measured reach in section 2, and Session 5 re-derives it
mechanically rather than trusting this table.

## 7. Target repository and path analysis

### 7.1 What was inspected

The working repository root, `UberTip-Backend/app`, `routes`, `resources`, `database`, `config`,
`tests`, `bootstrap/providers.php`, `composer.json`, `package.json`, and a repository-wide search for
a React Native project.

### 7.2 What actually exists

The backend is real but narrow: 24 files under `app`, one Filament panel, one public API route, and
the catalog and launch-governance slice.

| Path | Status | Evidence |
|---|---|---|
| `UberTip-Backend/app/Providers/Filament/AdminPanelProvider.php` | **Existing** | Panel id `admin`, path `admin`, registered in `bootstrap/providers.php`. Resource, page and widget discovery is already configured against `app/Filament/*`. |
| `UberTip-Backend/routes/api.php` | **Existing** | One route: the public catalog service-groups endpoint under the `v1` prefix. |
| `UberTip-Backend/app/Http/Controllers/Api/V1/` | **Existing** | One controller. |
| `UberTip-Backend/app/Http/Resources/Api/V1/` | **Existing** | Three resources. |
| `UberTip-Backend/app/Actions/`, `app/Domain/`, `app/Data/`, `app/Enums/`, `app/Models/` | **Existing** | Catalog and governance slice only. |
| `UberTip-Backend/database/migrations/`, `factories/`, `seeders/` | **Existing** | Five domain migrations plus the framework baseline. |
| `UberTip-Backend/tests/Feature`, `tests/Unit`, `tests/Pest.php` | **Existing** | Pest suite. |
| `UberTip-Backend/config/ubertib.php` | **Existing** | Application safety configuration. |
| `UberTip-Backend/resources/css/app.css` | **Existing** | The only stylesheet; no Filament theme is present. |

### 7.3 What does not exist and is `(Proposed)`

Each row is `(Proposed)` because a canonical engineering document already names it. Phase 5 invents
none of them.

| Path | Status | Canonical declaring source |
|---|---|---|
| `UberTip-Backend/app/Filament/Resources/` | Proposed | Discovery configured in `AdminPanelProvider`; `docs/implementation/ADMIN_IMPLEMENTATION_PLAN.md` records "no verified `app/Filament/Resources` business implementation yet". |
| `UberTip-Backend/app/Filament/Pages/`, `app/Filament/Widgets/` | Proposed | Same provider, same plan. |
| `UberTip-Backend/app/Providers/Filament/ClinicPanelProvider.php` | Proposed | `docs/implementation/CLINIC_IMPLEMENTATION_PLAN.md` section 2 and `TASK-PLATFORM-013`. |
| `UberTip-Backend/app/Filament/Clinic/{Resources,Pages,Widgets}/` | Proposed | Same file, same section. |
| Clinic panel id `clinic` and route prefix `/clinic` | Proposed | Same file, which states the prefix is a proposed concrete choice and must stay easy to replace. |
| `UberTip-Backend/app/Policies/` | Proposed | `docs/implementation/ADMIN_IMPLEMENTATION_PLAN.md`, the scoped-authorization task. |
| Patient React Native project root | Proposed, **path unverified** | `docs/IMPLEMENTATION_PLAN.md` section 3 and `TASK-PLATFORM-008`. |
| Patient `src/` feature and shared areas | Proposed, **path unverified** | `docs/implementation/USER_IMPLEMENTATION_PLAN.md`, `TASK-PLATFORM-008`. |

Path-status count for the Phase 5 contracts: the section 7.2 table lists **9 existing target-area
rows covering 15 concrete existing paths**, and the section 7.3 table lists **8 proposed target-area
rows**, of which **2 are proposed with the path itself unverified**. No widget contract can name an
existing file today, because no Filament resource, page, widget or policy exists yet; every one of
the 30 contracts therefore carries `(Proposed)` target files in Session 3 to 5, and the contract
schema records *which kind* of proposed it is.

### 7.4 The Patient application

**Not found.** There is no React Native project anywhere in this repository: no `metro.config.js`,
no React Native `app.json`, no `.tsx` source, and no `package.json` outside the Laravel application
and its vendored dependencies. The only `package.json` is the backend's Vite and Tailwind build.

This is not a gap Phase 5 fills. `docs/IMPLEMENTATION_PLAN.md` states plainly that the React Native
repository, path and build, test and lint commands "are not yet verified" and that
`TASK-PLATFORM-008` owns the bootstrap and "must record the real commands before downstream mobile
tasks use them". `TASK-PLATFORM-008`'s own verification field goes further: "proposed/unverified
commands must not be documented as existing."

Consequence for the contract schema, recorded here so Session 3 cannot forget it: **a Profile C
contract's verification commands are written as an unresolved reference to the scripts
`TASK-PLATFORM-008` will record, never as a plausible command string.** A fabricated `npm test` in a
contract would be indistinguishable from a real one to the agent that runs it.

### 7.5 Two repository constraints found during the audit

Both are real and both change the Session 6 plan.

1. **`AGENTS.md` is at 149 lines against a hard budget of 150**, enforced by
   `docs/scripts/validate_docs.py`. The Phase 5 `AGENTS.md` UI section must therefore be a pointer of
   a very few lines, or the budget must be raised by the engineering-documentation owner in the same
   change. Session 6 plans for the pointer; it does not silently raise the budget.
2. **`docs/README.md` is at exactly 200 lines against a budget of 200.** Its ID-registry note still
   reads that `WGT-*` is "not yet allocated" and its registry snapshot still reads `0 WGT-*`, which
   Phase 4 falsified by allocating 30. That correction is an engineering-README change with no line
   headroom, and it is raised in section 17 rather than applied here.

## 8. Manifest architecture

`BUILD_MANIFEST.json` is **not** generated in this session. Its architecture is fixed here so that
Session 2 emits rather than designs.

### 8.1 The constraints it must satisfy

The Phase 5 branch of `docs/ux/scripts/validate_ux_docs.py` already exists and already enforces five
invariants. The architecture is designed against them rather than discovered by failing them:

1. `05-build/figma/BUILD_MANIFEST.json` must exist and must parse.
2. Every `pages[].frames[].id` must resolve to a documented `SCR-*`, `WGT-*` or `CMP-*`. **No other
   identifier may be a frame id** — which is why sections 8.3 and 8.5 keep tokens and flows off the
   frame axis entirely.
3. Every frame must declare `layout`.
4. No string value anywhere in a frame or its descendants may be a raw colour or a raw dimension
   unless it is a token reference in brace form. Numeric frame widths are not strings and are the
   one permitted literal.
5. Every `componentId` must resolve to a declared entry in `components[]`.

### 8.2 `meta`

```jsonc
{
  "meta": {
    "generatedFrom": "docs/ux/",
    "generatedAtPhase": "5",
    "fidelity": "high",
    "authority": "the specifications are canonical; this file is derived and loses every conflict",
    "tokenSource": "docs/ux/03-system/design_tokens/",
    "tokenLayers": ["primitive", "semantic", "semantic.state", "component"],
    "theme": { "modes": ["light"], "dark": "out of scope for V1" },
    "direction": { "authored": "rtl", "mirrorRule": "logical start/end only" },
    "platforms": [
      { "key": "patient", "profile": "C", "runtime": "react-native",
        "contractPrefix": "API", "density": "reading",
        "sizeClasses": ["compact", "medium", "expanded"] },
      { "key": "clinic", "profile": "A", "runtime": "filament",
        "contractPrefix": "SDC", "density": ["operational", "dense"],
        "contentWidths": ["narrow", "medium", "wide", "maximum"] },
      { "key": "admin", "profile": "A", "runtime": "filament",
        "contractPrefix": "SDC", "density": ["operational", "dense"],
        "contentWidths": ["narrow", "medium", "wide", "maximum"] }
    ]
  }
}
```

Two decisions in that block are load-bearing:

- **`tokenSource` is `docs/ux/03-system/design_tokens/`**, not a `tokens/` directory. The generic
  Phase 5 methodology names `03-system/tokens/`, which does not exist in this product, and the
  repository-root `tokens/` directory belongs to the design kit and describes a different system.
  A manifest pointing at either would resolve every token against the wrong file.
- **Three platforms, two profiles, and no shared breakpoint scale.** `breakpoints.json` states that
  the Profile C size classes and the Profile A content widths "must never be merged" because a
  Profile A threshold is measured on the content area and a Profile C threshold on the device
  viewport. The manifest keeps them as two named lists and never as one numeric ladder.

### 8.3 Pages

| Page | Frames | Frame ids |
|---|---|---|
| `01 · Tokens` | **none** | The token sheet is rendered by the plugin directly from `tokenSource`. It carries no frames because a token swatch has no `SCR-*`, `WGT-*` or `CMP-*` identity and would fail constraint 2. |
| `02 · Components` | component variant and state frames | `CMP-*` |
| `03 · Widgets` | widget data-state frames | `WGT-*` |
| `04 · Screens` | canonical screen frames plus the declared high-risk variants | `SCR-*` |

There is **no `05 · Flows` page**. A `FLOW-*` is not in the resolvable identifier set, so a flow
frame would fail the gate. Flow membership is carried instead as a `flows` array on each screen
frame, which the Figma plugin renders as connectors between existing screen frames. This preserves
all 103 flows without inventing a frame identity.

The Phase 2 wireframes stay in their own file and are not superseded. They are the review record.

### 8.4 `components[]`

Emitted before `pages[]`, one entry per allocated `CMP-*` — 22 entries, no more, because the
validator resolves every `componentId` against this list and Phase 3 owns the taxonomy.

```jsonc
{
  "id": "CMP-PLATFORM-009",
  "name": "Empty state",
  "tier": "molecule",
  "variantProperties": { "variant": ["no-data", "filtered-empty"] },
  "states": ["default"],
  "anatomy": ["icon", "headline", "explanation", "action"],
  "layout": { "mode": "VERTICAL", "gap": "{semantic.space.stack-md}",
              "padding": { "all": "{semantic.space.inset-lg}" },
              "primaryAxis": "MIN", "counterAxis": "STRETCH" },
  "realization": { "C": "Native", "A": "Extended" },
  "tokens": { "surface": "{semantic.color.surface.card}",
              "text": "{semantic.color.text.primary}" }
}
```

`variantProperties` and `states` are transcribed from that component's inventory block. A variant the
inventory does not declare is not invented to fill a matrix.

### 8.5 Frames

```jsonc
{
  "id": "WGT-PLATFORM-004",
  "name": "WGT-PLATFORM-004 / Filter and result toolbar / empty-filtered / A / wide",
  "kind": "widget",
  "profile": "A",
  "platform": "admin",
  "state": "empty-filtered",
  "density": "operational",
  "contentWidth": "wide",
  "direction": "rtl",
  "width": 1024,
  "height": "HUG",
  "layout": { "mode": "VERTICAL", "gap": "{semantic.space.stack-sm}",
              "padding": { "all": "{semantic.space.inset-md}" },
              "primaryAxis": "MIN", "counterAxis": "STRETCH" },
  "trace": { "screens": ["SCR-OPS-001"], "patterns": ["IX-PLATFORM-014"],
             "content": ["TXT-PLATFORM-004"], "accessibility": ["A11Y-PLATFORM-011"] },
  "children": []
}
```

Rules binding every frame and every node:

1. **The name begins with the identifier.** `<ID> / <Name> / <discriminators>` in that order, so a
   frame can be traced without opening it.
2. **Explicit sizing on both axes** for every node: `HUG`, `FILL`, or a token-derived value. A node
   with no declared sizing is a defect the Session 5 check reports by count.
3. **Auto-layout on every container.** Absolute positioning requires a recorded reason on the node.
4. **Token references only.** The single permitted literal is a numeric frame width at a declared
   threshold. Every colour, space, radius, type, elevation, duration and easing is a brace reference
   into `tokenSource`.
5. **`trace` on every frame**, naming the specifications the frame realizes. This is what makes
   `DESIGN_TRACEABILITY.md` derivable rather than hand-written.
6. **`state`, `profile`, `density`, `contentWidth` or `sizeClass`, and `direction` are explicit.**
   A frame that does not say which state it is is unusable as coverage evidence.

`figma/NAMING.md` records the same conventions in prose, the page plan, the authority rule from
section 11, and the procedure for tracing any frame back to its specification block.

### 8.6 One thing to confirm before emitting at volume

Session 2 must confirm the Figma agent can create nodes, not only read them, before emitting hundreds
of frames. If it can only read, the manifest is still the right artifact — a plugin or script
consumes it — but that is worth knowing first, and the answer is recorded in `NAMING.md`.

## 9. Frame and state coverage strategy

### 9.1 The failure being avoided

165 screens times 9 data states times three or four responsive thresholds is 4455 screen frames
before components and widgets are counted. Most would be identical, because `WGT-PLATFORM-001` owns
the rendering of the non-success states on all 165 screens and no screen may invent its own. A
Cartesian manifest would be simultaneously enormous and less trustworthy, because a reviewer cannot
inspect 4455 frames and would stop looking.

### 9.2 The principle

**Draw each obligation once, at the lowest layer that owns it.** Coverage is then the union of the
layers, and the manifest states for every class what covers it and where. An omission becomes a
recorded decision instead of an absence.

### 9.3 The layers

| Layer | Page | What it covers | Why a separate frame exists, or does not |
|---|---|---|---|
| L1 Component variants and states | `02 · Components` | The declared variant and state pairs of all 22 `CMP-*`, including hover, focus, active, disabled, loading, error and selected | These states are properties of the component, not of the screen. Drawing them per screen would produce 165 copies of one truth. A second profile frame is emitted only where the inventory records a different anatomy or a different realization, not for every component. |
| L2 Widget data states | `03 · Widgets` | For each widget, the data states **it itself declares behaviour for** | A state whose row defers entirely to `WGT-PLATFORM-001` emits no frame; the coverage is the `WGT-PLATFORM-001` frame for that state, drawn once. A state Phase 4 marks `n/a` with a reason emits no frame and the reason is carried in the manifest. |
| L3 Canonical screens | `04 · Screens` | One `success` frame per screen, at its own profile, density and default threshold — exactly 165 | This is the non-negotiable coverage floor: every screen is drawn. It is also the frame a reviewer compares against the Phase 2 wireframe priority order. |
| L4 Screen high-risk variants | `04 · Screens` | Only where the screen spec declares something neither L1 nor L2 can carry | Derivation rule in section 9.4. Every included screen names the reason; every excluded screen is excluded because L1 or L2 already carries it. |
| L5 Responsive and profile | both | Per **archetype and profile**, not per screen | Phase 2 fixed the archetype and Phase 3 fixed the responsive rule per profile. Two screens of the same archetype on the same profile reflow identically; drawing both proves nothing twice. |
| L6 Density | `02`, `03` | `reading`, `operational`, `dense` | `dense` applies to the five workspace screens and to table bodies only. It is drawn once per affected component and widget, never per screen. |
| L7 Direction | all | Authored right-to-left throughout | Left-to-right is not a second frame set. The bidi-isolation classes — identifier, amount, date, Latin legal name — are drawn once each at L1 on the components that carry them. |
| L8 Theme | none | Nothing | V1 is light-only. Zero dark frames, stated rather than omitted. |

### 9.4 The L4 inclusion rule

A screen earns a variant frame beyond its canonical one only when one of these holds, and the frame
records which:

1. It renders one of the four safety-critical status separations —
   `PENDING_EVALUATION` against `NOT_ELIGIBLE`, retryable transfer failure against authoritative
   rejection, transferred against accepted evidence, and the booking cancellation whose tone is
   `restricted`. Each separation is drawn once, on the screen that owns it, not on all 165.
2. Its action model resolves an unavailable action differently from the widget default, so the
   HIDDEN, UNAVAILABLE and DISABLED distinction is visible on a real surface.
3. It is one of the five workspace screens, whose `dense` composition is the product's only earned
   density and its highest reflow risk.
4. It is the maximum-composition screen, `SCR-CLAIMS-007`, which composes ten widgets and is the one
   place the composition itself can fail.
5. Its spec declares an empty, partial or denied arrangement that differs from what
   `WGT-PLATFORM-001` renders — which, by construction, should be rare, and each instance is worth
   inspecting precisely because it is an exception.

### 9.5 Estimated frame budget

An estimate, derived from the layer rules and the measured counts, to be **replaced by a measured
count in Session 2**. It is stated as a range because L2 and L4 depend on a per-block reading that
Session 2 performs.

| Layer | Estimate | Basis |
|---|---:|---|
| L1 components | 120 to 180 | 22 components times their declared variant and state pairs, with a second profile frame only where anatomy differs |
| L2 widgets | 180 to 260 | 50 widget-and-profile pairs, each times the states it actually owns rather than all ten |
| L3 canonical screens | 165 | Exact. One per screen |
| L4 screen variants | 40 to 70 | The four safety separations, the five workspaces, the maximum-composition screen, and the availability-resolution exceptions |
| L5 responsive | 35 to 55 | Five archetypes times two profiles times the thresholds that actually differ |
| **Total** | **540 to 730** | Against 4455 for the screen axis alone under a Cartesian product |

Session 2 publishes the measured count **and the suppression count per layer**. A frame that was not
emitted because another layer covers it is reported, not silently dropped, because a coverage
strategy that hides its own exclusions is indistinguishable from an incomplete one.

### 9.6 Representative content

No placeholder text of any kind. Content is sourced, in this precedence:

1. **Entity and field names** from `docs/database/ERD.md` — 54 tables, 6 existing and 48 proposed —
   so a frame shows the field the implementation will actually bind.
2. **Lifecycle status labels** from `CONTENT_GUIDE_STATES.md`, which carries the Arabic chip label
   and the per-audience meaning for all 82 statuses across 18 machines. A frame never invents a
   label, and never renders a bare enumeration value.
3. **Copy obligations** from the 60 `TXT-*` rules, bound by reference. No canonical `ERR-*` message
   string is restated in the manifest; `docs/api/ERROR_CATALOG.md` owns those.
4. **Worst-case strings** that Phase 2 identified — a long Arabic clinic legal name, a mixed-direction
   identifier, a long facet label — because a frame filled with short strings proves nothing about
   wrapping and truncation.

Two hard limits on content:

- **Clinical content is provisional.** `Q-CATALOG-001` and `Q-ELIG-001` are open, so no frame carries
  production medical content. Catalog and eligibility frames use clearly marked provisional test
  content, and the manifest carries a `contentStatus` marker on those frames so a reviewer cannot
  mistake a placeholder for an approved clinical string.
- **No internal value ever appears.** `S`, `P`, `H`, `I`, calibration mechanics, market comparison
  basis, sample counts and confidence figures are absent from every Patient and Clinic frame, and
  a bare Latin letter never appears as or inside a status label.

## 10. Implementation-contract schema

### 10.1 The rule

One contract per `WGT-*`, self-sufficient: an agent implementing one must not need to read the other
29. Contracts are ordered by the build order in section 6.5, never by domain. The file opens with the
authority rule, the tokens-only rule and the build order.

### 10.2 The schema

Fields marked **new** are additions Phase 5 makes because the generic methodology's schema has no
slot for them and this repository needs them. Each says why.

| # | Field | Contents | Source |
|---:|---|---|---|
| 1 | Implements | The `FR-*` and `NFR-*` the widget block names | Phase 4 block |
| 2 | Used by | Every `SCR-*` the widget is placed on, with counts per platform | `SCREEN_SPEC_MAP.md` |
| 3 | Depends on | Predecessor widgets from section 6.2, the mandatory `CMP-*` core, and the governing `IX-*` | Phase 4 block, section 6 |
| 4 | Build order | The integer from section 6.5 | this plan |
| 5 | Platform and profile | C, A, or both, with the density mode from `density.json` | Phase 4 block **new: density** |
| 6 | Realization | `Stock`, `Extended`, `Custom` or `Native`, per profile | section 5 |
| 7 | **Panel and route target** | For Profile A: which panel — `admin` or `clinic` — which panel provider, and the navigation group | **new.** The repository has one panel and the second is Proposed; a contract naming a Resource without naming its panel is ambiguous here |
| 8 | Target files | Directory and class, each tagged `Existing`, `Proposed (canonical)` or `Proposed, path unverified` | section 7 **new: the three-way tag** |
| 9 | **Shared application-layer prerequisite** | The `TASK-*` from `docs/IMPLEMENTATION_PLAN.md` that must land first | **new, and the most important addition.** 48 of 54 ERD tables are Proposed; without this a contract would let an agent build a panel surface over a model that does not exist |
| 10 | **Data model prerequisite** | The ERD tables the projection reads, each marked Existing or Proposed | **new**, same reason |
| 11 | Data source and view-model mapping | The owning `API-*` or `SDC-*`, restating that contract's own projection and command text field by field | Phase 4 block |
| 12 | Caching, refresh and polling | Including the stale-versus-error precedence the widget inherits | Phase 4 block |
| 13 | **Idempotency and correlation** | For committing widgets: key derivation, retry reuse, and the unknown-outcome path | **new.** `NFR-AUDIT-002` requires it and the generic schema has no slot |
| 14 | Permission gate | Enforced server-side, at a **named** policy or gate class, never merely hidden client-side | Phase 4 block **new: the named enforcement point** |
| 15 | Props and configuration | Name, type, default, required, notes | generic schema |
| 16 | State rendering | One row per data state, naming exactly what renders, including the states marked `n/a` and why | Phase 4 block |
| 17 | Tokens | Semantic names only. Raw colour, dimension and duration values are forbidden and linted | Phase 3 |
| 18 | Content rules | The `TXT-*` bound, by reference. No string is restated | Phase 4 block |
| 19 | Accessibility contract | Role, accessible name, keyboard path, live-region politeness, contrast pairs, non-visual equivalent — as assertions that must pass | Phase 3 and 4 |
| 20 | Right-to-left | Logical anatomy, mirroring, and the bidi-isolation classes this widget must isolate | Phase 4 block **new: isolation classes enumerated** |
| 21 | Responsive behaviour | Profile C size class or Profile A content width, plus text scaling and reflow | Phase 4 block |
| 22 | **Immutability declaration** | Whether the widget renders one of the nine immutable or append-only entities, and therefore which affordances must not be registered | **new.** `WIDGET_SPECS.md` section 6 records that Filament ships bulk actions including delete by default; this is where that becomes checkable |
| 23 | **Framework defaults to disable** | For `Stock` and `Extended`: the exact framework features that must not be registered | **new.** This is what stops an `Extended` contract from quietly becoming a rewrite, and what stops a `Stock` contract from shipping a delete action |
| 24 | **Prohibitions** | The widget block's `Prohibited` list, restated as testable negatives | **new.** Phase 4 blocks carry it; the generic schema drops it, and it is the highest-value half of several blocks |
| 25 | Definition of done | The generic checklist plus items 22, 23 and 24 | generic schema, extended |
| 26 | Verification commands | Split into the three tiers of section 12, each with the exact command, and an explicit unrun marker on the runtime tier | **new: the tier split** |

### 10.3 What the schema must not contain

- A class name, method signature or migration for a path marked `Proposed, path unverified`. For
  Profile C that is every path, so a Patient contract specifies behaviour, data mapping, states,
  tokens and assertions, and names its file targets as proposed areas.
- An invented verification command. Section 7.4 is the reason.
- A restatement of a canonical `ERR-*` message, an `API-*` projection or an `SDC-*` command in
  paraphrase. Contracts quote or reference; they do not fork.
- A new design decision. If writing a contract requires one, the session stops and names the owning
  phase.

## 11. Figma authority rule

**The Figma file is derived. It is generated from these specifications, so it cannot be a source of
truth for the code — that would make the code a copy of a copy.**

| Consumer | Reads | Never reads |
|---|---|---|
| Figma agent | `05-build/figma/BUILD_MANIFEST.json` | the prose specifications |
| Coding agent | `05-build/IMPLEMENTATION_CONTRACTS.md` and the token source | the Figma file, except as visual reference |

Where the Figma file and an implementation contract disagree, **the contract wins** and the
discrepancy is reported as a manifest defect. Where the contract and a canonical requirement
disagree, the requirement wins and the contract is the defect.

This rule is stated in three places on purpose — `NAMING.md`, the head of
`IMPLEMENTATION_CONTRACTS.md`, and the `AGENTS.md` UI section — because it is the rule people forget,
and forgetting it quietly reintroduces the design drift this whole chain exists to prevent.

## 12. Verification strategy

Three tiers, kept separate because collapsing them is how a documentation gate comes to be quoted as
an accessibility conformance claim.

### 12.1 Tier A — mechanically verifiable in this repository

Runs on every Phase 5 checkpoint and at the gate. The existing gates are unchanged and still pass;
the extensions are additive and each is negative-tested before it is relied on.

Already enforced by the Phase 5 branch of `validate_ux_docs.py`:

- `BUILD_MANIFEST.json` exists and parses;
- every frame id resolves to a documented `SCR-*`, `WGT-*` or `CMP-*`;
- every frame declares auto-layout;
- no non-token raw colour or dimension appears in any frame string value;
- every `componentId` resolves to a declared component;
- every `WGT-*` has an implementation contract.

Extensions Session 5 adds, each protecting an invariant the current gate cannot see:

| Extension | Invariant |
|---|---|
| The build dependency graph is total and acyclic | Every widget appears exactly once; no cycle; every declared predecessor exists. A cycle would make the contract file unusable top to bottom, which is its whole reading model. |
| Every contract declares a path status | A target file with no `Existing` or `Proposed` tag is an invitation to write code against a path that does not exist. |
| Every contract declares its runtime and, on Profile A, its panel | The repository has one panel and a second that is Proposed. |
| Every contract carries verification commands, and a Profile C contract carries none that claims to exist | Directly enforces `TASK-PLATFORM-008`'s rule that unverified commands must not be documented as existing. |
| Every frame name begins with its identifier | Traceability without opening the frame. |
| Every node declares sizing on both axes | Reported as a count that must be zero. |
| Every widget's contract names its mandatory `CMP-*` core, and every named component is allocated | Referential integrity from the contract layer back into Phase 3. |
| No contract restates a canonical `ERR-*` message string | Prevents a second source of truth for governed wording. |

Also in Tier A, unchanged and re-run: `python docs/scripts/validate_docs.py`,
`validate_ux_docs.py --phase 1` through `--phase 5`, `validate_ux_tokens.py`, and both
`check_no_emoji.py` invocations.

### 12.2 Tier B — rendered design QA

Needs a rendered artifact, not a running product. The design kit's scripts exist at the repository
root and are the tools: `measure_render.mjs`, `verify_states.mjs`, `axe_audit.mjs`,
`taste_audit.mjs`, `lint_hardcodes.py`, `validate_theme_refs.py`.

- Real computed contrast on rendered text, as distinct from the token-pair contrast already proven.
- Every element's contrast in default, hover and focus, because a resting state that passes can fail
  on hover through a specificity trap.
- Structure against the Phase 2 priority order, screen by screen.
- Whether `restricted` and `neutral` — deliberately close in hue by design — are genuinely
  distinguishable to a real reader.
- Arabic diacritic clipping at heading sizes, and whether the Arabic and Latin faces share usable
  vertical metrics on one line. `DESIGN_TOKENS.md` section 4.2 states plainly that nothing measured a
  glyph; that obligation is still open and is not closed by any gate above.
- No hardcoded colour, dimension or duration in any rendered output.

### 12.3 Tier C — runtime QA, after implementation

Cannot be run in Phase 5 at all and is **never reported as passed here**. Enumerated from
`ACCESSIBILITY.md` section 25, which lists them obligation by obligation.

- Keyboard focus order on every surface, and keyboard completion end to end on Profile A.
- Focus trap and return-focus correctness on every overlay and confirmation
  (`verify_focustrap.mjs`).
- Screen-reader announcement correctness and live-region timing; VoiceOver and TalkBack specifically,
  in Arabic, right-to-left, as distinct from generic ARIA correctness.
- Rendered target size in real viewport pixels, once the hit area is counted.
- No horizontal overflow at the three verification widths in
  `breakpoints.json` (`verify_responsive.mjs`), and reflow at the platform maximum text size.
- Forced-colours survival on Profile A.
- Reduced-motion actually branching, not merely defined.
- Bidi isolation's spoken order, as distinct from its visual order (`verify_rtl.mjs`).
- The data-state announcement and focus matrix, on real transitions.
- Real accessibility-tree behaviour for the hidden, unavailable and disabled distinction.
- The permission gate enforced server-side, proven by Pest feature tests rather than by a hidden
  control.

### 12.4 The honesty rule

A Tier C item is reported as `not run — requires implementation`. It is never reported as passing,
never inferred from a green Tier A gate, and never softened into "expected to pass". A Phase 5
handoff that claims WCAG conformance from a documentation gate would be false, and the chain's whole
value is that it is not.

## 13. Rendered QA versus runtime QA

The distinction is worth stating separately because it is the one most often collapsed.

| | Tier B — rendered | Tier C — runtime |
|---|---|---|
| Needs | A rendered artifact: a Figma frame, a static HTML harness, a component story | A running application on a real device or browser, with a real screen reader and real data |
| Answers | Does it look and measure right | Does it behave right for a person using it |
| Can run in Phase 5 | Yes, once the manifest and harnesses exist | No |
| Example that passes at B and can still fail at C | Contrast measured on a rendered chip | The same chip announced without its icon and emphasis, so a screen-reader user hears colour-only information |
| Example that passes at A and can still fail at B | Every required token pair clears the ratio | The rendered text sits on a surface the token map did not anticipate |

Neither tier is a substitute for the other, and neither is implied by the Tier A gate. Phase 4's
accessibility sections tell Phase 5 what to verify; they are not evidence that it passes, and
Phase 5 inherits that framing intact.

## 14. Open `Q-*` classification

Re-measured against `docs/README.md` at the start of this session. **Seven open**, matching the
Phase 4 handoff exactly. **None is closed by this session**, and none may be closed by Phase 5
without its named authority.

| ID | Severity | Authority that can close it | Effect on Phase 5 | May Phase 5 close it |
|---|---|---|---|---|
| `Q-PLATFORM-001` | Blocker | Source availability — a readable authoritative requirements specification | None on the artifacts. Limits only a claim of complete reconciliation | No |
| `Q-CATALOG-001` | Major | **Licensed clinical review** | Catalog frames carry provisional, marked content. No contract asserts approved medical content | **No. Clinical authority only** |
| `Q-ELIG-001` | Major | **Licensed clinical review** | Eligibility frames and contracts specify the surface and keep every internal value off it. Formulas, weights, thresholds and bands stay out | **No. Clinical authority only** |
| `Q-PLATFORM-002` | Major | Legal and compliance | Retention surfaces are specified without asserting a period | No |
| `Q-OPS-001` | Major | Infrastructure decision | Every evidence-transfer, one-time-code and notification contract stops at the provider boundary | **No, and specifically not by naming a vendor** |
| `Q-PLATFORM-004` | Minor | Production measurement | None | No |
| `Q-PLATFORM-008` | Minor | Visual brand ratification | The manifest references semantic tokens and names no colour, so ratification stays a one-layer change | No |

`Q-CATALOG-001` and `Q-ELIG-001` are the two that constrain content rather than structure, and
section 9.6 states exactly how the manifest behaves while they are open. `Q-OPS-001` is the one most
likely to be closed by accident, because a contract naming a concrete storage or messaging provider
would close it silently; item 26 of the contract schema and the Tier A extension on verification
commands both exist partly to make that visible.

## 15. Planned Phase 5 sessions

Seven sessions. The split differs from the generic five-session shape in two places, and the
repository evidence for each change is stated.

| # | Session | Produces | Gate |
|---:|---|---|---|
| 1 | Preflight, architecture, dependency order | This file, and the `SCR-ELIG-010` synchronization | **Complete** |
| 2 | Manifest and naming | `05-build/figma/BUILD_MANIFEST.json`, `05-build/figma/NAMING.md` | **Complete — 509 manifest frames** |
| 3 | Foundation contracts, build order 1 to 7 | First seven platform contracts | **Complete** |
| 4 | Remaining platform contracts, build order 8 to 14 | Remaining seven platform contracts | **Complete** |
| 5 | Domain contracts, build order 15 to 30 | Sixteen domain contracts | **Complete — 30/30 contracts** |
| 6 | Traceability and full-chain verification | `05-build/DESIGN_TRACEABILITY.md`, `05-build/FULL_CHAIN_VERIFICATION.md`, `AGENTS.md` pointer | **Complete — rendered/runtime QA explicitly deferred** |
| 7 | Final gate, handoff, CI promotion | `PHASE_05_HANDOFF.md`; CI promoted to `--phase 5` | **Complete — run 69 passed on `74040bd`** |

**Why seven rather than five.**

1. **The platform contracts are split across two sessions.** The contract schema in section 10 has 26
   fields, twelve of them additions this repository requires, and the first seven widgets cover
   706 of the 885 placements. Writing fourteen contracts of that depth in one session is how a
   schema field quietly gets dropped from the last few.
2. **Traceability and the final gate are separate.** Promoting CI to `--phase 5` is irreversible in
   practice, and it must follow a full-chain verification that has actually run, not accompany it.
   Phase 3 and Phase 4 both promoted CI only after their gates were green and every new check was
   negative-tested; Phase 5 keeps that discipline.

CI stayed at `--phase 4` through authoring. The completion gate promotes it to `--phase 5` only after all required Phase 5 artifacts and validator invariants exist.

## 16. Stop condition

### 16.1 For this session

Session 1 is complete when: the baseline is re-measured rather than inherited; the `SCR-ELIG-010`
correction is verified against its canonical sources and applied minimally, or the conflict is
reported unresolved; all 30 widgets are classified with their realization, contracts, target paths
and path status; the build order is total, acyclic and derived from stated evidence; the manifest and
frame-coverage architecture is fixed; the contract schema is defined including what this repository
adds to it; the verification tiers are separated; the seven open `Q-*` are re-measured and none is
closed; every existing gate is green; and this file exists. **Session 2 does not begin without
explicit approval.**

### 16.2 For the phase

Phase 5 is complete only when: the manifest parses and every gate in section 12.1 passes; all 30
contracts exist, are self-sufficient and are ordered by dependency; the traceability table is
unbroken in both directions; the full-chain verification has actually run with real pasted output;
every Tier C item is listed as not run rather than assumed; the open blocker count is stated
honestly; `PHASE_05_HANDOFF.md` exists; and CI has been promoted to `--phase 5` and the promoted job
has actually run and passed.

### 16.3 The condition that stops the phase mid-flight

If translating any specification into a manifest frame or an implementation contract requires a new
design or product decision, Phase 5 **stops and names the phase that owns it**. It does not fill the
gap. Translation is itself a check: anything underspecified surfaces immediately, because a frame
cannot be emitted for a state nobody described. Session 1 found no such blocker — section 17 records
what it did find.

## 17. Session 1 findings — resolution record

All six mechanical findings raised by Session 1 are now resolved without changing product behavior:

1. `FLOW-ELIG-008` / `FLOW-ELIG-011` were synchronized to the provider-price contract where the price branch requires it.
2. `docs/README.md` now records the allocated Phase 4 WGT baseline.
3. `AGENTS.md` uses its remaining line-budget slot for the Phase 5 implementation-contract pointer.
4. `WGT-PLATFORM-011` is correctly Profile A only.
5. The rendered-QA cross-reference points to the actual accessibility obligation section.
6. The design-token README now reflects the real 22 allocated component groups.

The later ERD count drift was also corrected to 54 business tables: 6 Existing and 48 Proposed.

The completion run surfaced implementation prerequisites rather than UX blockers: repeated clinical-stage transition history needs an explicit persistence representation before mutation code, `TASK-PLATFORM-013` owns the durable Patient attention-entry model, and `TASK-PLATFORM-008` still owns the unverified Patient repository/path/scripts.

---

**Phase 5 plan status:** complete. All non-rendered documentation/handoff artifacts are authored and the promoted Phase 5 CI gate passed on run 69. Actual Figma rendering and runtime QA are deliberately outside this documentation completion claim.
