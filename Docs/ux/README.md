# UberTib UX Documentation — Start Here

**Chain phase:** 1 of 5 complete — Discovery, Information Architecture and User Flows
**Baseline:** 2026-08-25
**Validator:** `python docs/ux/scripts/validate_ux_docs.py --phase 1` → 0 failures, 0 warnings

## Authority Chain

1. **Engineering docs** — canonical for behavior, data, permissions, lifecycle, errors. `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`, `docs/api/*`, `docs/database/*`.
2. **Product Owner decisions** — `.spec/decisions/`. `PO-2026-08-25-ux-gap-resolution.md` governs clinic onboarding, doctor comparison, staff contracts and run scope.
3. **This chain's outputs** — canonical for structure, presentation and interaction.
4. **Tokens** — canonical for style, from UX Phase 3 onward. Not yet produced.
5. **Figma** — derived, authoritative over nothing. Not yet produced.

This chain never invents product behavior. Gaps become `Q-*` or `CONFLICT-*` in `01-foundation/UPSTREAM_GAPS.md`.

## Ownership Split Against `docs/`

| Owned by `docs/` | Owned by `docs/ux/` |
|---|---|
| What the product does; business rules; acceptance criteria | Which screens exist and how tasks move through them |
| Authorization decisions (`PERMISSIONS_MATRIX.md`) | Whether an action is reachable, and from where |
| Lifecycle states and transitions (`STATE_MACHINES.md`) | Which screen displays each state and what it must communicate |
| Error semantics and Arabic message text (`ERROR_CATALOG.md`) | Which surface each error lands on and its recovery path |
| Data and action contracts (`API_CONTRACTS.md`, `STAFF_INTERACTION_CONTRACTS.md`) | Which screen consumes which contract |

This chain references canonical IDs and never restates the rules behind them.

## Platform Profiles

Declared here and never re-litigated downstream.

| Platform | Runtime | Profile | Screens |
|---|---|---|---:|
| Patient app | React Native, consumes `/api/v1` | **C** — native | 44 |
| Clinic / Doctor | Filament 5, panel `clinic` at `/clinic` (Proposed) | **A** — admin panel | 54 |
| Admin | Filament 5, panel `admin` at `/admin` | **A** — admin panel | 57 |

**Input mode:** Docs-Partial. No screen inventory existed to inherit; all 155 screens are derived and `New`. Verified directly: `app/Filament/` does not exist, one API route is implemented, no React Native repository is verified.

**Accessibility target:** WCAG 2.2 AA, from `NFR-PLATFORM-005`. This chain specifies obligations and never claims conformance.

Profile C emits no hover state. Profile A specifies framework configuration and targeted custom views, classified Stock, Extended or Custom.

## Reading Order

**Designers** — `01-foundation/UX_FOUNDATION.md` for actors, jobs and constraints → `01-foundation/INFORMATION_ARCHITECTURE.md` for the screen model and navigation → `01-foundation/USER_FLOWS.md` for task movement → `01-foundation/UPSTREAM_GAPS.md` for what is not yet decided.

**Coding agents** — do not build from this phase. Structure only; no visual, component or behavioral specification exists yet. Wait for `05-build/IMPLEMENTATION_CONTRACTS.md`.

**Figma agent** — nothing to consume yet. Wireframes are UX Phase 2; the build manifest is UX Phase 5.

**Anyone continuing the chain** — read `PHASE_01_HANDOFF.md` first, especially its must-not-re-decide list.

## Phase Status

| Phase | Artifacts | Status |
|---|---|---|
| 1 — Discovery, IA, Flows | `01-foundation/*`, `scripts/validate_ux_docs.py` | **Complete — awaiting gate approval** |
| 2 — Wireframes | `02-wireframes/*` | Not started |
| 3 — Design System | `03-system/*` | Not started |
| 4 — Widget and Screen Specs | `04-specs/*` | Not started |
| 5 — Build and Handoff | `05-build/*` | Not started |

## What Phase 1 Produced

| Artifact | Count |
|---|---:|
| Actors with evidence-based personas | 19 UI-bearing, plus system automation and 2 explicit non-roles |
| Jobs to be done | 62 |
| Screens | 155 — Patient 44, Clinic 54, Admin 57 |
| Flows | 94, including 8 cross-platform lifecycle flows |
| Lifecycle statuses mapped to screens | 62 of 62 across 15 machines |
| Gaps recorded | 17 |

## ID Conventions

Inherited and never reassigned: `FR-*`, `BR-*`, `NFR-*`, `API-*`, `SDC-*`, `ERR-*`, and the 12 canonical domains.

Introduced by this chain: `SCR-*` and `FLOW-*` in Phase 1; `WF-*` in Phase 2; `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*` in Phase 3; `WGT-*` in Phase 4.

`Q-*`, `ASM-*` and `CONFLICT-*` use the shared register in `docs/README.md`. Numbering is append-only across all phases and all runs.

### Registry additions from Phase 1

`SCR-*` highest allocated per domain — to be appended to `docs/README.md`:

| Domain | SCR | Domain | SCR |
|---|---:|---|---:|
| IDENTITY | 036 | FINANCE | 012 |
| ELIG | 020 | REVIEWS | 009 |
| CLINICAL | 019 | CATALOG | 009 |
| BOOKING | 015 | PLATFORM | 008 |
| CLAIMS | 013 | OPS | 006 |
| POLICY | 004 | AUDIT | 004 |

`FLOW-*` highest allocated per domain: IDENTITY 020 · ELIG 014 · BOOKING 012 · CLINICAL 010 · CLAIMS 009 · FINANCE 008 · REVIEWS 005 · CATALOG 005 · OPS 004 · PLATFORM 003 · POLICY 002 · AUDIT 002.

`JTBD-*` highest allocated per domain: IDENTITY 011 · ELIG 008 · CLINICAL 007 · BOOKING 007 · CLAIMS 007 · FINANCE 006 · CATALOG 003 · OPS 003 · REVIEWS 003 · PLATFORM 003 · POLICY 002 · AUDIT 002.

## Open Items

New from Phase 1 — full detail in `01-foundation/UPSTREAM_GAPS.md`:

| ID | Severity | Needs a decision on |
|---|---|---|
| `Q-OPS-002` | Major | Work-item state vocabulary, which is required to be user-visible but is unfinalized |
| `Q-PLATFORM-005` | Major | Whether a patient notification or attention surface exists in V1 |
| `Q-PLATFORM-006` | Major | Environment and expertise for all 19 actors |
| `Q-PLATFORM-007` | Major | Any research input at all — none exists |
| `Q-IDENTITY-001` | Major | Who establishes a representation grant on a legal basis, and where |
| `Q-REVIEWS-001` | Major | Whether a patient may appeal a review decision |
| `CONFLICT-BOOKING-001` | Major | `ERR-BOOKING-002` reused on a guardian-revocation surface |
| `Q-BOOKING-003` | Minor | Whether a confirmed booking can be rescheduled |
| `Q-CLINICAL-001` | Minor | Whether a proposed treatment plan expires |
| `ASM-PLATFORM-001` | Assumption | The attention surface is the patient's primary re-entry path |
| `ASM-IDENTITY-001` | Assumption | Applicant contact verification precedes application content |
| `ASM-ELIG-001` | Assumption | Booking may proceed directly from a result row |

Carried forward from canonical documentation: `Q-PLATFORM-001` Blocker for the completeness claim only; `Q-BOOKING-001`, `Q-BOOKING-002`, `Q-PLATFORM-003`, `Q-CATALOG-001`, `Q-ELIG-001`, `Q-PLATFORM-002`, `Q-OPS-001` Major; `Q-PLATFORM-004` Minor.

**Resolved and not reopened:** staff-facing data contracts, clinic and provider onboarding, doctor comparison, and full three-platform scope are confirmed product behavior under `PO-2026-08-25` and are implemented in this phase.

## Two Bounded Incomplete Branches

Not defects. Both flows are complete up to the point where their destination is undefined upstream, and neither invents an outcome.

- `FLOW-BOOKING-007` — an alternative proposal that expires or is declined has no canonical resulting booking state (`Q-BOOKING-001`).
- `FLOW-ELIG-012` — existing bookings in a newly suspended scope enter a review workflow with no defined actor, deadline, state effect or outcome (`Q-BOOKING-002`).

## Verification

Run at every gate, with a higher `--phase` as later work lands:

```bash
python docs/ux/scripts/validate_ux_docs.py --phase 1
```

The validator is phase-aware and cumulative; `--phase 4` runs phases 1 through 4. It was written once in Phase 1 and is not rewritten later.
