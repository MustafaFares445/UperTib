# UberTib UX Phase 2 — Grey-box Wireframes

**Phase:** UX 2 — Wireframes  
**Baseline:** 2026-08-26  
**Input:** approved Phase 1 screen model — 165 screens, 103 flows, 69 JTBDs  
**Platforms:** Patient App (Profile C) · Clinic/Doctor Panel (Profile A) · Admin Panel (Profile A)  
**Fidelity:** structure, hierarchy and interaction only. No final visual design.

## 1. Grid and size-class decision

- **Patient App:** compact mobile grid with one primary reading column. Wider mobile/tablet sizes may place tightly related comparison values side by side, but task order remains identical. Largest supported text forces stacking.
- **Clinic and Admin Panels:** framework-owned Filament shell. Content uses a twelve-column conceptual grid so list/detail, form/supporting rail and dashboard regions can reflow without defining final dimensions.
- **No visual values are canonical in this phase.** Size numbers in the machine-readable manifest are drawing-canvas hints only and are not design tokens.

## 2. Page archetypes

| Archetype | Use |
|---|---|
| dashboard | Attention and operational landing surfaces. |
| list-and-detail | Search, queues, histories, schedules and management tables. |
| form | Focused create/respond/review actions. |
| workspace | High-density authoring where repeated entry and context must stay visible. |
| detail | Authoritative record/status plus contextual actions. |

## 3. Region vocabulary

`Context` · `Status and identity` · `Primary content` · `Filters` · `Supporting information` · `Decision / action bar` · `Timeline / history` · `Recovery`.

Profile A shell navigation, global user menu and framework authentication chrome are framework-owned and are not repeated in every sketch. Profile C retains the Phase 1 app navigation and global active-patient context.

## 4. Cross-cutting structural rules

1. Patient surfaces show practical meaning, not raw `P`, `I`, market-calibration math, professional procedure codes or internal risk codes.
2. The Patient discovers service families; detailed procedure items appear in clinician/admin workflows and in patient plans only as understandable treatment lines.
3. `ELIGIBILITY_REVIEW` removes attendance/start/completion actions structurally while the owning eligibility scope remains suspended.
4. Guardian authorization revocation remains reachable regardless of booking state.
5. A pending reschedule proposal never displaces the original confirmed appointment until acceptance and successful revalidation.
6. `FAILED_RETRYABLE` evidence transfer and `REJECTED` evidence are separate structural states.
7. Admin-editable clinical/commercial behavior uses governed versions. Configurable does not mean instant or unreviewed production activation.
8. Accepted treatment and financial snapshots remain visibly historical and immutable.

## 5. Friction targets

### Treatment-plan authoring
`WF-CLINICAL-010` and `WF-CLINICAL-011` reduce repeated entry by using procedure search, recent/common choices, provider-price defaults, automatic unit/inclusion population, sensible quantity defaults, duplicate line, quick add and progressive disclosure. Required structured data remains intact.

### Market observations
`WF-ELIG-023` keeps all required provenance fields but makes repeat entry efficient through a grid, sticky defaults, recent-source reuse, duplicate row, batch import and keyboard-oriented navigation.

## 6. Wireframe files

- `WIREFRAMES_PATIENT_*.md` — 47 Patient wireframes.
- `WIREFRAMES_CLINIC_*.md` — 56 Clinic/Doctor wireframes.
- `WIREFRAMES_ADMIN_*.md` — 62 Admin wireframes.
- `wireframe-manifest.json` — machine-readable frame inventory.
