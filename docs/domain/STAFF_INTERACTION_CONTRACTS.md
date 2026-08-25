# UberTib Staff Interaction Contracts

**Status:** Canonical staff-facing in-process contract baseline  
**Decision source:** `.spec/decisions/PO-2026-08-25-ux-gap-resolution.md`  
**Applies to:** Clinic / Doctor Filament panel and Admin Filament panel  
**External REST owner:** `docs/api/API_CONTRACTS.md`

## 1. Purpose

This file closes the staff-facing data-contract gap without inventing internal REST endpoints.

Clinic and Admin are Filament adapters inside the Laravel application. They consume shared Laravel query services, application actions, policies, state machines, and projections. Stable `SDC-*` IDs let UX specifications and implementation plans reference those in-process contracts exactly.

`SDC-*` means **Staff Data / Interaction Contract**. It is not an HTTP route.

Rules:

- Patient/mobile external contracts use `API-*`.
- Clinic/Admin Filament widgets/screens use `SDC-*`.
- Commands that change authoritative state call the same application actions used by other adapters.
- Reads use role-filtered projections and server-side scope enforcement.
- No Filament-only business status or duplicate business rule is allowed.
- Authorization is deny-by-default and follows `PERMISSIONS_MATRIX.md`.
- State values come from `STATE_MACHINES.md`; presentation labels belong to UX.

## 2. Contract shape

Every `SDC-*` identifies:

- **Projection:** the minimum data the staff UI may read.
- **Commands:** authoritative actions available from that surface.
- **Scope:** actor/provider/branch/case/work-item limits.
- **Requirements:** owning `FR-*` / `NFR-*`.
- **Errors/states:** canonical error or state owners where applicable.

The UX pipeline must reference these IDs in Phase 4 screen/widget specs under `Data / action contract`.

---

# 3. Identity and Clinic Onboarding

## SDC-IDENTITY-001 — Clinic Onboarding Applicant Workspace

**Actors:** verified prospective clinic/provider applicant.  
**Requirements/Decision:** FR-IDENTITY-001; `PO-UX-02`.  
**Projection:** application ID, provider type, applicant source facts, primary branch source facts, evidence item statuses, validation issues, requested changes, current application status, last saved/submitted timestamps.  
**Commands:** create draft; update permitted draft/requested-change fields; attach/remove draft evidence references; submit; resubmit after requested changes; withdraw before final decision where policy allows.  
**States:** `DRAFT`, `SUBMITTED`, `CHANGES_REQUESTED`, `RESUBMITTED`, `APPROVED`, `REJECTED`.  
**Scope:** only the verified applicant's own onboarding application(s).  
**Rules:** applicant enters facts only; no S/P/H/I/final eligibility controls; approved/rejected applications are immutable except later audit/correction events.

## SDC-IDENTITY-002 — Admin Clinic Onboarding Review Workspace

**Actors:** authorized verification/Admin reviewer.  
**Requirements/Decision:** FR-IDENTITY-001, FR-AUDIT-001; `PO-UX-02`.  
**Projection:** submitted source facts, evidence verification state, duplicate/matching provider candidates, branch facts, applicant relationship evidence, review history, outstanding corrections.  
**Commands:** claim/assign review if work-queue policy requires; verify/reject individual facts/evidence; request changes with itemized reasons; approve application; reject with reason.  
**Scope:** assigned/authorized onboarding work only.  
**Approval result:** atomically create/link provider organization, applicant identity, primary branch, scoped provider-representative grant, Clinic-panel access, and onboarding work items.  
**Prohibited:** approval must not activate services, assign scientific grade, directly set P/H/I, or publish the provider.

## SDC-IDENTITY-003 — Clinic Staff Invitation and Scoped Grant

**Actors:** authorized clinic owner/provider representative; invited staff member.  
**Requirements/Decision:** FR-IDENTITY-001, NFR-IDENTITY-001, FR-AUDIT-001; `PO-UX-03`.  
**Projection:** invitation status, invited identity/contact, provider, branches, delegated capabilities, effective period, accepted/revoked timestamps.  
**Commands:** create invitation; resend/replace expired invitation; accept after identity verification; revoke active grant.  
**Scope:** inviter may delegate only capabilities/branches they are authorized to delegate.  
**Rules:** invite acceptance creates explicit scoped grant; no arbitrary clinic self-attachment; treating-clinician actions still require professional verification and case relationship.

## SDC-IDENTITY-004 — Clinic Access and Context Bootstrap

**Actors:** authenticated Clinic-panel user.  
**Requirements:** FR-IDENTITY-001, NFR-IDENTITY-001.  
**Projection:** current identity, accessible provider/clinic contexts, accessible branches, effective capabilities, pending onboarding checklist/work counts.  
**Commands:** switch active authorized provider/branch context; no authorization is created by switching.  
**Scope:** only active grants.  
**Errors:** `ERR-IDENTITY-001`, `ERR-IDENTITY-002` semantics apply even though this is in-process.

---

# 4. Catalog, Eligibility, and Verification

## SDC-CATALOG-001 — Admin Catalog Governance Workspace

**Actors:** authorized policy/catalog owner and reviewers.  
**Requirements:** FR-CATALOG-001, FR-POLICY-001, FR-OPS-003.  
**Projection:** service groups/services, definition versions, audience/publication state, required launch gates, review status, effective dates.  
**Commands:** edit permitted draft content; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass.  
**Scope:** owned catalog/policy domain only.

## SDC-ELIG-001 — Clinic Service Activation Workspace

**Actors:** scoped dentist/provider representative.  
**Requirements:** FR-ELIG-007–008.  
**Projection:** available service definitions, versioned questionnaire, provider/branch facts, required evidence, evidence status, activation request state, actionable blockers.  
**Commands:** create/update activation request; answer source-fact questions; attach evidence; submit/resubmit.  
**Prohibited:** no manual A/B/C/D/F/P/H/I/final eligibility inputs.

## SDC-ELIG-002 — Admin Verification Workbench

**Actors:** verification staff; licensed clinical reviewer when clinical judgment is required.  
**Requirements:** FR-ELIG-002–008, FR-IDENTITY-001, FR-AUDIT-001.  
**Projection:** activation request, source facts, evidence metadata/status, verification provenance, assigned work item, policy/service-definition references, computed evaluation summary after approved inputs.  
**Commands:** verify/reject/request-correction for source facts/evidence; record reviewer decision where authorized; trigger/requeue governed evaluation after approved changes.  
**Prohibited:** no direct editing of computed final S/P/H/I/eligibility.

## SDC-ELIG-003 — Clinic Eligibility Status Projection

**Actors:** scoped clinic/provider user.  
**Requirements:** FR-ELIG-002–017.  
**Projection:** service + branch scope, current practical eligibility state, safe scientific-grade meaning where allowed, price/protection meaning, last evaluation time, actionable blockers, evidence/fact items requiring provider action, reevaluation/work status. Raw internal `I` is excluded.  
**Commands:** navigate to source-fact/evidence correction actions only; no outcome override.

---

# 5. Booking and Clinical Work

## SDC-BOOKING-001 — Clinic Booking Inbox and Response

**Actors:** authorized clinic/provider representative.  
**Requirements:** FR-BOOKING-001–003.  
**Projection:** scoped booking requests, service, patient-safe identity/context, branch, requested slot, response deadline, current booking state, alternative proposal if any, capacity/readiness summary.  
**Commands:** accept; reject with reason; propose alternative; cancel when policy/state permits; record no-show after threshold.  
**Rules:** every confirmation revalidates eligibility/readiness/capacity; authoritative booking state is shared with Patient/Admin.

## SDC-CLINICAL-001 — Clinic Case and Treatment Workspace

**Actors:** treating dentist and authorized clinic staff according to exact action.  
**Requirements:** FR-CLINICAL-001–005.  
**Projection:** authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state.  
**Commands:** dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts.  
**Prohibited:** non-treating staff cannot author diagnosis/treatment plan; accepted historical versions cannot be edited.

---

# 6. Financial Records, Reviews, and Claims

## SDC-FINANCE-001 — Clinic/Admin Financial Record Workspace

**Actors:** authorized clinic party; finance reviewer according to action.  
**Requirements:** FR-FINANCE-001–007.  
**Projection:** immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items.  
**Commands:** report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work.  
**Boundary:** no command authorizes/captures/holds/transfers/settles money.

## SDC-REVIEWS-001 — Review Integrity and Provider Appeal Workspace

**Actors:** authorized clinic/provider appellant; review-integrity staff.  
**Requirements:** FR-REVIEWS-001–002.  
**Projection:** eligible review summary, verified-experience linkage, publication/moderation state, appeal window/status, safe evidence metadata, reviewer work state.  
**Commands:** provider submits eligible appeal; reviewer processes assigned integrity/appeal work with reasons.  
**Prohibited:** clinic cannot edit patient rating/review directly; `R` never changes S/P/H/I.

## SDC-CLAIMS-001 — Claim / Dispute Participation and Review Workspace

**Actors:** authorized clinic case party; claim/dispute reviewer; medical/financial/legal reviewer according to sensitive decision.  
**Requirements:** FR-CLAIMS-001–005.  
**Projection:** claim/refund type, case linkage, governing snapshots, evidence states, deadlines/extensions, party responses, decision/appeal history, external-execution state where applicable.  
**Commands:** clinic submits allowed evidence/response/appeal; reviewer requests evidence, records reasoned decision, handles eligible appeal according to separation of duties.  
**Boundary:** sensitive final decisions require authorized human review; monetary outcome is external obligation/record only.

---

# 7. Operations, Policy, and Audit

## SDC-OPS-001 — Staff Work Queue

**Actors:** authorized staff/reviewers.  
**Requirements:** FR-OPS-001.  
**Projection:** work item ID/type, linked resource/case, state, priority, due time, responsibility scope, blocking reason, assignment, safe summary.  
**Commands:** claim/assign where allowed; start; complete with outcome; escalate; reopen where policy permits.  
**Scope:** only work within active role/organization/subject-matter grants.

## SDC-OPS-002 — Operational Reporting Projection

**Actors:** authorized operations managers/Product Owner/staff.  
**Requirements:** FR-OPS-002.  
**Projection:** scoped metrics with population definition, time window, state rules, confirmed-vs-provisional distinction, last-refreshed time, permitted drill-down references.  
**Commands:** filter/drill down/export only when corresponding permission/audit requirements pass.

## SDC-POLICY-001 — Policy Lifecycle Workspace

**Actors:** authorized policy owner/reviewer.  
**Requirements:** FR-POLICY-001–002.  
**Projection:** policy key/scope/version, draft content, review state, effective dates, approvals, conflicts/overlaps, historical references.  
**Commands:** edit draft; submit for review; approve/reject; schedule; retire/supersede; reproduce historical result through authorized action.  
**Rules:** active/historical versions remain immutable; prospective changes do not rewrite accepted snapshots.

## SDC-AUDIT-001 — Audit Explorer and Historical Reproduction

**Actors:** authorized auditor/reviewer.  
**Requirements:** FR-AUDIT-001–002, FR-POLICY-002.  
**Projection:** attributable audit metadata, resource/action/time/outcome/correlation, policy/snapshot/evidence references allowed by purpose, historical reproduction result/integrity state.  
**Commands:** scoped search; inspect permitted event detail; request/export permitted audit output; invoke historical reproduction.  
**Prohibited:** audit records cannot be edited/deleted; audit access does not grant unrelated protected payload access.

---

# 8. UX usage rule

For every Clinic/Admin `SCR-*` and later `WGT-*`, the UX chain must name at least one of:

- `SDC-*` when the screen/widget reads or mutates in-process staff behavior;
- `API-*` when it consumes an external/mobile REST contract;
- an explicit background/system requirement when the UI only observes a resulting state.

A staff screen does **not** require an `API-*` merely to satisfy traceability.

# 9. Local SDC registry

This namespace is append-only. Highest allocated values in this file:

| Domain | Highest SDC |
|---|---:|
| IDENTITY | 004 |
| CATALOG | 001 |
| ELIG | 003 |
| BOOKING | 001 |
| CLINICAL | 001 |
| FINANCE | 001 |
| REVIEWS | 001 |
| CLAIMS | 001 |
| OPS | 002 |
| POLICY | 001 |
| AUDIT | 001 |

Do not renumber or repurpose these IDs. New staff contracts allocate `max + 1` inside the owning domain.