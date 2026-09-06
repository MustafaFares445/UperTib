# UberTib Patient UI Preview — Slice 3 Care Reading

Date: 2026-09-06

Branch: `feat/patient-slice3-care-reading`

Base: Slice 2 head `28b5b3714c0628de95d090cc2ff78d1da2b88d21`

Writable/product scope: `tools/patient-ui-preview/**` only. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice is the first item under README "Later slices": **treatment and case reading**.

It is derived from:

1. `docs/ux/PHASE_05_HANDOFF.md`
2. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
3. Phase 3 design tokens and component system
4. `API-CLINICAL-001`, `API-CLINICAL-002`, `API-CLINICAL-003`, `API-CLINICAL-004`
5. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_02.md`
6. `FLOW-CLINICAL-008` and the patient plan review / acceptance flows

No business behavior was derived from the preview itself.

## Implemented canonical screens

| SCR | Surface | Preview file |
|---|---|---|
| `SCR-CLINICAL-001` | My cases | `src/screens/MyCasesScreen.tsx` |
| `SCR-CLINICAL-002` | Case summary | `src/screens/CaseSummaryScreen.tsx` |
| `SCR-CLINICAL-003` | Treatment plan | `src/screens/TreatmentPlanScreen.tsx` |
| `SCR-CLINICAL-004` | Plan acceptance | `src/screens/PlanAcceptanceScreen.tsx` |
| `SCR-CLINICAL-005` | Case timeline | `src/screens/CaseTimelineScreen.tsx` |

`SCR-CLINICAL-006` Stage detail is deliberately **not** part of this slice. It is owned by the following evidence/stage-execution slice through `FR-CLINICAL-003` and `WGT-CLINICAL-003`.

## Implemented domain composition

- `WGT-CLINICAL-002` Treatment plan reader: `src/widgets/TreatmentPlanReader.tsx`
- `CMP-CLINICAL-001` patient `review` treatment line: `src/components/TreatmentLine.tsx`
- `CMP-CLINICAL-002` patient `amendment` disclosure: `src/components/AmendmentDelta.tsx`
- `CMP-PLATFORM-008` case `record` timeline projection: `src/components/CaseEventTimeline.tsx`
- canonical lifecycle state rendering continues through `StateChip`; the governed `document-check` icon was added to the preview icon subset for the accepted treatment-plan state.

## UX decisions applied

### Cases are navigation containers, not clinical dashboards

`SCR-CLINICAL-001` makes each case scan as:

1. service and provider;
2. current patient-safe status;
3. accepted-plan presence and next follow-up;
4. any outstanding patient action;
5. open case.

The outstanding action is visible before opening the case, matching the canonical acceptance criterion.

### Case summary is a task hub

`SCR-CLINICAL-002` leads with the current case meaning and places an outstanding patient action directly beneath it. Plan and timeline are compact case-scoped routes. A route whose target is not implemented/available in the current projection is not shown. In particular, Slice 3 does not invent a financial-history screen.

### Treatment plans are readable objects, not invoices

Every treatment line is a separate reading block with:

- plain-language meaning;
- quantity and unit;
- unit/line amount;
- what the amount includes;
- explicit exclusions when present;
- a named category and reason for an additional governed item.

The total is rendered only when the complete line set is available. The incomplete story intentionally hides the total rather than displaying a potentially wrong number.

### Amendments are before/after disclosures

The prior accepted version is stated before the proposed version. The patient sees the change summary and both totals before any acceptance affordance. The prior accepted version is explicitly described as retained history.

### Acceptance is a separate consequence screen

`SCR-CLINICAL-004` states before the action that acceptance creates immutable accepted clinical and financial snapshots. It also restates that no electronic payment or money movement occurs inside UberTib V1.

A stale/incomplete plan is framed as requiring correction/update by the clinic; the preview provides no patient override.

### Timeline is append-only

The unified case history renders booking, plan and stage facts in one list. A stage reopening is a later correction event and the earlier completion remains visible. The boundary says whether older events exist; scope-limited history explicitly says it is scope-limited.

No timeline control edits or deletes an event.

## Clickable flow

`Patient/Flows/FLOW-CLINICAL-008 Care reading` provides a local preview journey:

`My cases` → `Case summary` → `Treatment plan` → `Plan acceptance` → accepted immutable plan

and the case summary can also open the unified timeline.

The acceptance transition is local mock behavior representing a successful canonical `API-CLINICAL-003` response. It is not production persistence and is not an optimistic clinical outcome.

## Preserved boundaries

This slice does **not**:

- author or diagnose a treatment plan on behalf of UberTib;
- expose private clinical evidence, storage paths, signed links, internal S/P/H/I values, calibration, or risk mechanics;
- mutate an accepted treatment snapshot;
- replace a prior accepted version silently;
- invent payment, wallet, transfer, refund, settlement, or money-movement behavior;
- invent a finance, claims, review, evidence, guardian, or profile surface;
- create production API or persistence code;
- implement `SCR-CLINICAL-006` or `WGT-CLINICAL-003` ahead of the evidence slice.

## Verification coverage

`playwright/slice3-care.spec.ts` covers:

- RTL and horizontal reflow on all five screens;
- axe serious/critical accessibility checks on the primary review width;
- outstanding action visibility in the case list;
- empty-case recovery to discovery;
- case hub route availability;
- clinician authorship and amendment disclosure before acceptance;
- no total for a partial/incomplete treatment plan;
- no acceptance action on accepted plan history;
- permanence before acceptance and stale-plan blocking;
- correction ordering and explicit timeline boundary;
- scope-limited timeline disclosure;
- the complete care-reading acceptance flow.

`package.json` promotes this suite into `test:smoke` and `verify`, alongside the existing readiness and Slice 2 checks.

## Verification status

GitHub Actions **Patient UI Preview run 25** (`34048149705`) completed successfully on the pre-report-update Slice 3 head. Measured job evidence:

- preview dependency install: passed;
- dependency audit: passed;
- Chromium install: passed;
- TypeScript typecheck: passed;
- Storybook production build: passed;
- readiness + Slice 2 + Slice 3 smoke gate: passed;
- artifact upload: passed.

The report update itself is documentation-only inside the preview path, so the PR CI reruns once more against the final head. Final PR status should be taken from that latest run rather than treating run 25 as evidence for a later code change.

## Next slice after this one

The next canonical preview slice is **evidence / treatment-stage reading**, beginning with `SCR-CLINICAL-006` and `WGT-CLINICAL-003`. It should not be started until this care-reading slice is verified/reviewed.
