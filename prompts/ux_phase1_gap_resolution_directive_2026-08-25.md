# Claude Directive — Continue UberTib UX Phase 1 With Resolved Gaps

Read this file **after** the normal UX session bootstrap and `prompts/ux_00_conventions.md`, and **before** continuing Phase 1.

Authoritative new inputs:

1. `.spec/decisions/PO-2026-08-25-ux-gap-resolution.md`
2. `docs/domain/STAFF_INTERACTION_CONTRACTS.md`

These files resolve the gaps raised at the Phase 1 inventory gate. They are not open questions.

## Required interpretation

### 1. Staff-facing data contracts

Do **not** raise the absence of staff REST `API-*` IDs as a `Q-*` or Blocker.

Clinic/Admin are Filament adapters using in-process Laravel application actions/query services.

Use:

- `API-*` for Patient/mobile external REST behavior.
- `SDC-*` from `docs/domain/STAFF_INTERACTION_CONTRACTS.md` for Clinic/Admin staff-facing read/action contracts.

When Phase 1 defines a staff `SCR-*`, record the applicable `SDC-*` as canonical data/action evidence. In later Phase 4 widget/screen specs, every staff widget must reference the applicable `SDC-*` rather than inventing an internal HTTP endpoint.

### 2. Clinic / provider onboarding

Clinic onboarding is approved V1 behavior. Implement it in Phase 1; do not mark it Blocked.

Model at least these flows:

- **Clinic/provider application:** Join UberTib → provider type → verified applicant → source facts / primary Aleppo branch / evidence → draft/resume → submit → Admin review.
- **Admin onboarding review:** submitted application → fact/evidence verification → approve / request changes / reject with reason.
- **Changes requested loop:** applicant receives itemized corrections → edits only required items → resubmits → Admin review.
- **Approval handoff:** approved application → provider/clinic + applicant identity + primary branch + scoped clinic representative grant + Clinic-panel access → post-approval onboarding checklist.
- **Clinic staff invitation:** authorized clinic representative → invite with branch/capability scope → invitee verifies/accepts → scoped grant → Clinic access.
- **Grant revocation:** authorized revocation → subsequent access denied immediately; audit history retained.

Critical business boundary:

Clinic onboarding approval does **not** activate a service, assign scientific grade, set P/H/I, publish the provider, or make the provider production-ready. Service activation/evidence/eligibility is a separate downstream flow.

Use `SDC-IDENTITY-001`–`004` for these staff-facing contracts.

### 3. Compare doctors

Doctor comparison **is in V1** and must be included in Phase 1.

Patient behavior:

- add 2 or 3 currently eligible provider-service-branch results from the **same requested service** to a transient comparison tray;
- compare patient-safe decision-card attributes already supported by provider discovery;
- choose one option and continue through the normal booking flow;
- booking still performs canonical booking-time revalidation.

Show/compare:

- provider identity;
- exact branch/location/area;
- selected service;
- practical current eligibility/availability meaning;
- last assessment/update where applicable;
- actual/expected price;
- patient-safe protection meaning;
- verified review rating/count where available;
- nearest available appointment where available.

Do not:

- create a composite "best doctor" score;
- expose raw `I`, K, EU, or formulas;
- imply reviews or price alter scientific eligibility;
- keep a stale/ineligible option bookable;
- create a saved/favorites comparison feature in V1.

This comparison can be derived from `API-ELIG-001` provider decision-card results; do not invent a new server ranking API simply for comparison.

### 4. Scope

Use the **full three-platform Phase 1 scope**:

- Patient App
- Clinic / Doctor Dashboard
- Admin Dashboard

Include cross-platform handoffs among Patient, Clinic, System Automation, Admin/Operations, and Human Review.

The older recommendation to restrict the first UX run to Evaluation Catalog only is superseded by the current Product Owner decision.

## Proceeding instruction

Proceed to Phase 1 Step B and create the required Phase 1 files:

- `docs/ux/01-foundation/UX_FOUNDATION.md`
- `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md`
- `docs/ux/01-foundation/USER_FLOWS.md`
- `docs/ux/01-foundation/UPSTREAM_GAPS.md`
- `docs/ux/README.md`
- `docs/ux/scripts/validate_ux_docs.py`
- `docs/ux/PHASE_01_HANDOFF.md`

Apply the decisions above as **confirmed inputs**.

Do not create `Q-*`, `ASM-*`, `CONFLICT-*`, or `Blocked` entries for the four resolved issues above.

Genuine unrelated open items already present in canonical engineering docs remain visible and must still be respected.

Run the real Phase 1 validator, report exact counts/failures, write the handoff, and then **STOP at the Phase 1 gate**. Do not begin wireframes or Phase 2.