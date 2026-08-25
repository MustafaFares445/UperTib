# UberTib UX Documentation — Start Here

**Chain phase:** 1 of 5 complete — Discovery, Information Architecture and User Flows
**Baseline:** 2026-08-25, reconciled 2026-08-25 against `PO-2026-08-25-ux-phase1-reconciliation`
**Validator:** `python docs/ux/scripts/validate_ux_docs.py --phase 1` → 0 failures, 0 warnings

## Authority Chain

1. **Engineering docs** — canonical for behavior, data, permissions, lifecycle, errors. `docs/PRD.md`, `docs/SDD.md`, `docs/domain/*`, `docs/api/*`, `docs/database/*`.
2. **Product Owner decisions** — `.spec/decisions/`. `PO-2026-08-25-ux-gap-resolution.md` (`PO-UX-01`–`06`) governs clinic onboarding, doctor comparison, staff contracts and run scope. `PO-2026-08-25-ux-phase1-reconciliation.md` (`PO-UX-07`–`18`) governs actor context, work-item states, patient notifications, review appeals, guardian revocation, alternative closure, eligibility review, legal-basis representation, reschedule, plan validity, evidence transfer and the research limitation.
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
| Patient app | React Native, consumes `/api/v1` | **C** — native | 47 |
| Clinic / Doctor | Filament 5, panel `clinic` at `/clinic` (Proposed) | **A** — admin panel | 56 |
| Admin | Filament 5, panel `admin` at `/admin` | **A** — admin panel | 59 |

**Input mode:** Docs-Partial. No screen inventory existed to inherit; all 162 screens are derived and `New`. Verified directly: `app/Filament/` does not exist, one API route is implemented, no React Native repository is verified.

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
| Jobs to be done | 66 |
| Screens | 162 — Patient 47, Clinic 56, Admin 59 |
| Flows | 100, including 9 cross-platform lifecycle flows |
| Lifecycle statuses mapped to screens | 82 of 82 across 18 machines |
| Gaps recorded | 17, of which 12 are resolved |

## ID Conventions

Inherited and never reassigned: `FR-*`, `BR-*`, `NFR-*`, `API-*`, `SDC-*`, `ERR-*`, and the 12 canonical domains.

Introduced by this chain: `SCR-*` and `FLOW-*` in Phase 1; `WF-*` in Phase 2; `CMP-*`, `IX-*`, `TXT-*`, `A11Y-*` in Phase 3; `WGT-*` in Phase 4.

`Q-*`, `ASM-*` and `CONFLICT-*` use the shared register in `docs/README.md`. Numbering is append-only across all phases and all runs.

### Registry additions from Phase 1

`SCR-*` highest allocated per domain — to be appended to `docs/README.md`:

| Domain | SCR | Domain | SCR |
|---|---:|---|---:|
| IDENTITY | 038 | FINANCE | 012 |
| ELIG | 022 | REVIEWS | 009 |
| CLINICAL | 019 | CATALOG | 009 |
| BOOKING | 017 | PLATFORM | 009 |
| CLAIMS | 013 | OPS | 006 |
| POLICY | 004 | AUDIT | 004 |

`FLOW-*` highest allocated per domain: IDENTITY 021 · ELIG 015 · BOOKING 014 · CLINICAL 010 · CLAIMS 009 · FINANCE 008 · REVIEWS 006 · CATALOG 005 · OPS 004 · PLATFORM 004 · POLICY 002 · AUDIT 002.

`JTBD-*` highest allocated per domain: IDENTITY 012 · ELIG 008 · BOOKING 008 · CLINICAL 007 · CLAIMS 007 · FINANCE 006 · REVIEWS 004 · PLATFORM 004 · CATALOG 003 · OPS 003 · POLICY 002 · AUDIT 002.

## Open Items

Nothing raised by this phase is still open. Twelve of the seventeen gaps, plus one assumption, were resolved on 2026-08-25 by `.spec/decisions/PO-2026-08-25-ux-phase1-reconciliation.md`:

| Resolved | Became |
|---|---|
| `Q-PLATFORM-006` environment and expertise | Confirmed contexts for six role classes (`PO-UX-07`) |
| `Q-OPS-002` work-item states | `OPEN`/`ASSIGNED`/`IN_PROGRESS`/`WAITING`/`COMPLETED`, escalation and overdue as flags |
| `Q-PLATFORM-005` patient notifications | `FR-PLATFORM-001`, `API-PLATFORM-002`, `SCR-PLATFORM-009` |
| `Q-REVIEWS-001` review appeals | Patient is an authorized affected party; `FLOW-REVIEWS-006` |
| `CONFLICT-BOOKING-001` guardian revocation | `ERR-BOOKING-002` removed from `API-IDENTITY-005`; revocation is unconditional |
| `Q-BOOKING-001` alternative closure | `CANCELLED` with `ALTERNATIVE_DECLINED` / `ALTERNATIVE_EXPIRED`, no penalty |
| `Q-BOOKING-002` suspended-scope bookings | `ELIGIBILITY_REVIEW` state; `FLOW-ELIG-015`, `SCR-ELIG-022` |
| `Q-IDENTITY-001` legal-basis access | `API-IDENTITY-006`, `SDC-IDENTITY-005`, `FLOW-IDENTITY-021` |
| `Q-BOOKING-003` rescheduling | `FR-BOOKING-004` governed proposal; `FLOW-BOOKING-013`, `FLOW-BOOKING-014` |
| `Q-CLINICAL-001` plan validity | Policy-governed `expires_at`, V1 default 7 days, plus early staleness |
| `Q-PLATFORM-003` evidence transfer | `API-PLATFORM-001` and eight provider-neutral session states |
| `Q-PLATFORM-007` research | Accepted limitation, not a blocker |
| `ASM-PLATFORM-001` attention surface | Confirmed as requirement, no longer an assumption |

Still carried from canonical documentation, none of which constrains Phase 2 structure: `Q-PLATFORM-001` Blocker for the completeness claim only; `Q-CATALOG-001`, `Q-ELIG-001`, `Q-PLATFORM-002` and `Q-OPS-001` Major — the last now also carries the storage, scanner, OTP and notification vendor selection deferred from `Q-PLATFORM-003`; `Q-PLATFORM-004` Minor.

Two assumptions remain in force: `ASM-IDENTITY-001` and `ASM-ELIG-001`. Both are recorded with what breaks if wrong in `01-foundation/UPSTREAM_GAPS.md` section 5.

**No bounded incomplete branches remain.** The two Phase 1 reported — `FLOW-BOOKING-007` and `FLOW-ELIG-012` — now run to defined outcomes.

## Verification

Run at every gate, with a higher `--phase` as later work lands:

```bash
python docs/ux/scripts/validate_ux_docs.py --phase 1
```

The validator is phase-aware and cumulative; `--phase 4` runs phases 1 through 4. It was written once in Phase 1 and is not rewritten later.
