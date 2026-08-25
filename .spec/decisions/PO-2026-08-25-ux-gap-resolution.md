# Product Owner Decision — UX Phase 1 Gap Resolution

**Date:** 2026-08-25  
**Status:** Approved / authoritative  
**Scope:** Patient App, Clinic/Doctor Dashboard, Admin Dashboard  
**Supersedes:** any earlier recommendation that limits the first UX run to the Evaluation Catalog only, and any temporary UX treatment of the decisions below as `Blocked`, `Q-*`, or deferred behavior.

This decision exists to close the product gaps discovered during UX Phase 1. The UX agent must implement these behaviors as confirmed product behavior and must not reopen them as questions unless a later explicit Product Owner decision changes them.

## PO-UX-01 — Full three-platform UX scope

The UX pipeline covers the complete V1 journeys established by the canonical engineering docs across:

1. Patient App.
2. Clinic / Doctor Dashboard.
3. Admin Dashboard.

Phase 1 must model the cross-platform handoffs between Patient, Clinic, System Automation, Admin/Operations, and Human Review. The UX agent still stops at the Phase 1 gate before wireframes.

## PO-UX-02 — Clinic / provider onboarding is approval-based

Clinic onboarding is a real V1 journey and is not blocked.

### Entry and application

- The Clinic portal exposes a public **Join UberTib** entry before authenticated Clinic-panel access.
- The applicant selects one of two provider types: **individual dentist** or **clinic / dental center**.
- The applicant verifies the primary contact before final submission.
- The application supports **Draft → Submitted → Changes Requested → Resubmitted → Approved / Rejected**.
- A draft may be saved and resumed by the same verified applicant.

### Required application information

The onboarding application captures source facts only:

- applicant full/legal name and verified contact;
- provider type;
- professional/license/registration identifiers applicable to the applicant/provider;
- clinic/center legal and display name when applicable;
- primary Aleppo branch identity, address/area/location, and contact details;
- applicant relationship to the provider (owner / authorized representative / dentist);
- required identity, license, registration, and authorization evidence.

Service-specific eligibility questionnaires, S/P/H/I values, scientific grade, and final service eligibility are **not** chosen during onboarding. Service activation remains a separate post-approval workflow.

### Admin review

Authorized verification/Admin staff can:

- open the submitted application;
- verify source facts/evidence;
- request specific corrections with reasons;
- approve;
- reject with a required reason.

`Changes Requested` returns the application to the applicant with only the requested sections/items marked for correction. Rejection closes that application but does not prevent a later new application unless an explicit compliance restriction exists.

### Approval effects

Approval performs all of the following atomically through shared application actions:

1. create or link the provider/clinic organization record;
2. create or link the applicant application identity;
3. create the primary branch context from approved source facts;
4. grant the applicant the approved clinic/provider representative capability scoped to that provider/branch;
5. activate Clinic-dashboard access;
6. create the post-approval onboarding checklist/work items.

Approval **does not**:

- activate any dental service;
- assign A/B/C/D/F;
- directly set P, H, or I;
- make the provider publicly discoverable;
- make the provider medically/operationally production-ready.

After approval, the Clinic user proceeds to branch facts, staff invitations, service activation, pricing, evidence, and eligibility workflows already defined by the engineering docs.

## PO-UX-03 — Clinic staff onboarding is invite-and-scope based

Additional Clinic users do not self-attach to a clinic by searching for it.

- An authorized clinic owner/provider representative invites a staff member.
- The invitation specifies the clinic/provider, allowed branches, capability/role, and any required effective period.
- The invitee verifies their identity/contact and accepts the invitation.
- Acceptance creates an explicit scoped grant; access is deny-by-default outside that grant.
- The inviter cannot grant a capability or branch scope they are not authorized to delegate.
- Expired/revoked invitations do not grant access; a new invitation is required.
- Revoking an active clinic grant removes subsequent access immediately while preserving audit history.
- A user invited as a treating dentist may not author clinical treatment merely because the invitation was accepted; professional/clinical eligibility and treating-case assignment requirements still apply.

## PO-UX-04 — Patient doctor comparison is included

Doctor comparison is a supported V1 discovery behavior because the current PRD scope already includes provider comparison.

### Comparison behavior

- A patient may add **2 or 3** currently eligible provider-service-branch results to a temporary comparison tray.
- All compared options must belong to the **same requested service context**. A comparison across unrelated services is not allowed.
- The comparison is transient UI state for the current discovery session; V1 does not require a saved/favorited comparison list.
- Comparison uses the patient-safe provider decision-card data already returned by provider discovery. A separate server-side ranking engine is not introduced.

### Comparison attributes

The comparison presents only practical, patient-safe attributes supported by canonical data:

- doctor/provider identity shown to the patient;
- exact branch and area/location summary;
- selected service;
- current practical eligibility/availability meaning;
- latest assessment/update time where applicable;
- actual/expected price information;
- protection meaning/availability without implying insurance or funded guarantee when disabled;
- verified experience rating and verified review count where available;
- nearest available appointment where available.

### Prohibited comparison behavior

The UI must not:

- calculate or display one composite "best doctor" score;
- expose raw internal risk `I`;
- expose K/EU formulas or internal classification mathematics;
- imply that price, popularity, or review stars change scientific eligibility;
- persist a stale option as bookable after eligibility/capacity changes.

Selecting **Book** from comparison opens the ordinary booking path for the chosen provider/service/branch and the backend performs the same required booking-time revalidation. If an option becomes ineligible/unavailable, the comparison marks it unavailable/removes the booking action and prompts refresh; it never bypasses revalidation.

## PO-UX-05 — Staff-facing data contracts are in-process, not fake REST APIs

The absence of staff REST `API-*` IDs is not a blocker. Clinic and Admin are Filament interaction adapters inside the Laravel application and must not receive artificial internal HTTP endpoints merely for UX traceability.

A new canonical contract document, `docs/domain/STAFF_INTERACTION_CONTRACTS.md`, defines stable `SDC-*` identifiers for staff-facing read projections and application actions.

UX rules:

- Patient/mobile external interactions reference `API-*` contracts.
- Clinic/Admin Filament interactions reference `SDC-*` contracts.
- `SDC-*` is a documentation identifier for an in-process query/action contract, **not** an HTTP endpoint.
- Phase 4 screen/widget specs must reference the applicable `API-*` or `SDC-*` contract rather than inventing data/actions.
- The shared Laravel application/domain layer remains the single implementation of business behavior.

## PO-UX-06 — No Phase 1 blocker for these resolved items

For the decisions in this file, the UX agent must:

- treat the behavior as confirmed;
- include the corresponding screens/flows in Phase 1;
- not create a `Q-*` or `Blocked` item for them;
- not defer them to Phase 4;
- preserve genuine unrelated open questions already present in canonical docs.

If an implementation detail is not needed to define Phase 1 structure/flow, use the canonical contract/state/permission owner rather than inventing infrastructure.