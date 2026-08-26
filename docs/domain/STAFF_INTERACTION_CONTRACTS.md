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

## SDC-IDENTITY-005 — Admin Legal-Basis Representation Verification

**Actors:** authorized verification staff / admin.  
**Requirements:** FR-IDENTITY-003, FR-AUDIT-001, NFR-IDENTITY-001.  
**Projection:** request ID and state, subject patient identification, guardian applicant identity, declared relationship and legal basis, requested actions/data scope/purpose, submitted evidence references and their validation state, review history.  
**Commands:** open request; assess evidence; request changes with itemised reasons; approve, creating the `LEGAL_BASIS` grant with explicit patient, grantee, actions, data scope, purpose, effective period, evidence and approving reviewer; reject with a required reason; revoke an existing legal-basis grant through the authorized workflow.  
**Rules:** approval is the **only** path that creates the grant — submission grants nothing, and the applicant can never self-authorize (`PO-UX-14`). Historical guardian actions remain attributed to the guardian after revocation.  
**Scope:** assigned verification queue and subject scope only.  
**Errors/states:** `ERR-IDENTITY-002`, `ERR-PLATFORM-005`; grant lifecycle owned by `PERMISSIONS_MATRIX.md` section 6.

# 4. Catalog, Eligibility, and Verification

## SDC-CATALOG-001 — Admin Catalog Governance Workspace

**Actors:** authorized policy/catalog owner and reviewers.  
**Requirements:** FR-CATALOG-001, FR-CATALOG-002, FR-POLICY-001, FR-OPS-003.  
**Projection:** service groups, patient-facing service families, definition versions, audience/publication state, required launch gates, review status, effective dates, and per-family counts of mapped procedure items and their review state.  
**Commands:** create a family; edit permitted draft content, labels, description, order and visibility; retire or supersede a family prospectively; submit/review/schedule/retire according to policy; invoke governed publication action after gates pass.  
**Scope:** owned catalog/policy domain only.  
**Rules:** a family already referenced by accepted or historical records is retired or superseded, never repurposed. Creating, renaming, reordering, or retiring a family is a data operation and requires no deployment. Evaluation-audience content is never promoted by a visibility change.

## SDC-CATALOG-002 — Admin Procedure Catalog and Family Mapping Workspace

**Actors:** authorized catalog/product administrator; authorized staff read-only.  
**Requirements:** FR-CATALOG-002, FR-CLINICAL-006.  
**Projection:** detailed procedure items with code, Arabic and English label, description, billing unit and quantity semantics, active and retired state, current definition version and its review state, the families each procedure is mapped to with display order and effective period, both generations of a superseded mapping, import provenance for candidate content, and which procedures are referenced by accepted plan lines.  
**Commands:** create a procedure item; edit permitted draft label, description, billing unit and order; map a procedure to one or more families with an effective date; supersede an existing mapping; retire a procedure prospectively; supersede a procedure with a successor; import candidate procedure content as evaluation-audience data with provenance.  
**Scope:** owned catalog domain only.  
**Rules:** the projection must show that this layer is **not** patient discovery — no command publishes a procedure list to the Patient app. A procedure identity referenced by history is immutable; a changed meaning creates a successor. Import never sets a clinical value as approved and never publishes. The number of imported rows is data, not a limit.  
**Prohibited:** no command sets a clinical field's approval, activates a clinically meaningful definition version, or edits an accepted plan line.

## SDC-CATALOG-003 — Admin Clinical Service Definition Review Workspace

**Actors:** authorized catalog/product administrator as drafter; licensed clinical reviewer as approver; authorized staff read-only.  
**Requirements:** FR-CATALOG-003, FR-OPS-003, FR-ELIG-005.  
**Projection:** draft and active procedure definition versions; service risk level; minimum and allowed scientific grades; required credentials, branch and equipment capability; required evidence; inclusions and exclusions; follow-up, completion and escalation rules; treatment restrictions; clinical review state; the approving reviewer credential and its expiry; content hash; effective period; a diff against the currently active version; and which eligibility gates the version's prerequisites feed.  
**Commands:** **drafter** — edit draft clinical fields, submit for clinical review, withdraw a draft. **Licensed clinical reviewer** — request changes with reasons, approve the exact content hash, reject with a required reason, revoke a prior approval.  
**Scope:** the drafter's owned catalog scope; the reviewer's credentialed practice scope.  
**Rules:** the two command sets are held by **different authorities**. Activation fails closed without a current credentialed approval bound to the exact content hash, and the drafter cannot approve their own draft. The workspace must make the difference between a draft value and an approved production value unmistakable, because this is the screen closest to looking like a clinical decision tool while being a governance surface.  
**Prohibited:** no override activates a clinically meaningful change without the clinical gate; risk level alone never grants or denies provider eligibility.  
**Errors/states:** definition lifecycle owned by `STATE_MACHINES.md` section 3; gates by section 4.

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

## SDC-ELIG-005 — Clinic Provider Price and Display-Mode Workspace

**Actors:** authorized clinic/provider representative; treating dentist within scope.  
**Requirements:** FR-ELIG-009, FR-ELIG-014, FR-ELIG-018.  
**Projection:** the provider's own price facts for their authorized branch and catalog scope, each with its display mode, amount or bounds, currency, effective period, provenance and superseded predecessor; the active approved price-display modes selectable for that scope; which catalog items still have no price; the patient-safe meaning the current configuration produces; and whether an accepted snapshot depends on a given historical fact.  
**Commands:** record a new price fact with its mode, amount or bounds, currency and effective date; supersede an existing fact prospectively; withdraw a future-dated fact that has not taken effect.  
**Scope:** exact authorized provider, branch and catalog scope only.  
**Rules:** the price is a source fact. A zero-cost price is valid, and no control requires a positive amount. Modes are offered only from the active approved commercial options — the clinic cannot invent a mode. A new fact supersedes prospectively and never rewrites an amount captured in an accepted snapshot; the projection must make that visible rather than implying a historical edit.  
**Prohibited:** no control sets or displays internal `P` as an editable or selectable value, offers A/B/C/D/F as a pricing menu, exposes the market comparison basis, sample count or confidence figure, or edits a market band.  
**Errors/states:** `ERR-PLATFORM-001` for an amount or period the chosen mode does not permit; `ERR-IDENTITY-002` outside scope.

## SDC-ELIG-004 — Admin Booking Eligibility-Review Workspace

**Actors:** authorized verification/operations staff; licensed clinical reviewer where the suspension reason requires clinical judgment.  
**Requirements:** FR-ELIG-003, FR-BOOKING-002, FR-OPS-001.  
**Projection:** affected bookings in `ELIGIBILITY_REVIEW`, controlling suspension reason and owning eligibility scope, review due time, appointment time, whether clinical judgment is required, remediation progress, patient/clinic notification state.  
**Commands:** record verification remediation; request the clinical reviewer's assessment; record the outcome once a new authoritative eligibility evaluation exists.  
**Rules:** the workspace **cannot** make the appointment attendable. Its only outcomes are the ones the state machine allows — return to `CONFIRMED` when a new evaluation is `ELIGIBLE`, or `CANCELLED` with reason `PROVIDER_ELIGIBILITY_SUSPENDED` at deadline expiry. **No override exists while the owning scope remains `SUSPENDED`** (`PO-UX-13`). The review due time is never later than two hours before the appointment.  
**Scope:** assigned provider/branch/subject-matter scope only.  
**Errors/states:** booking states owned by `STATE_MACHINES.md` section 8.2.

# 5. Booking and Clinical Work

## SDC-BOOKING-001 — Clinic Booking Inbox and Response

**Actors:** authorized clinic/provider representative.  
**Requirements:** FR-BOOKING-001–003.  
**Projection:** scoped booking requests, service, patient-safe identity/context, branch, requested slot, response deadline, current booking state, alternative proposal if any, capacity/readiness summary.  
**Commands:** accept; reject with reason; propose alternative; cancel when policy/state permits; record no-show after threshold.  
**Rules:** every confirmation revalidates eligibility/readiness/capacity; authoritative booking state is shared with Patient/Admin.

## SDC-BOOKING-002 — Clinic Reschedule Proposal Workspace

**Actors:** authorized clinic/provider representative.  
**Requirements:** FR-BOOKING-004, FR-BOOKING-001, NFR-AUDIT-002.  
**Projection:** confirmed bookings eligible for reschedule, any existing `PENDING` proposal with its initiator/proposed slot/response deadline, the **unchanged** current booking slot, available target slots, reschedule history.  
**Commands:** propose a reschedule; respond to a patient-initiated proposal by accepting or declining; withdraw the clinic's own pending proposal.  
**Rules:** while a proposal is `PENDING` the projection must continue to present the **original** slot as the appointment; the proposed slot is never shown as confirmed. A party cannot respond to its own proposal. Acceptance revalidates eligibility and new-slot capacity before the atomic move and old-slot release. No proposal may be created against a booking in `ELIGIBILITY_REVIEW`. Generic editing of booking date/provider/service is not offered (`PO-UX-15`).  
**Scope:** exact provider/branch scope only.  
**Errors/states:** `ERR-BOOKING-001`, `ERR-BOOKING-002`, `ERR-BOOKING-003`, `ERR-ELIG-001`; proposal states owned by `STATE_MACHINES.md` section 8.3.

## SDC-CLINICAL-001 — Clinic Case and Treatment Workspace

**Actors:** treating dentist and authorized clinic staff according to exact action.  
**Requirements:** FR-CLINICAL-001–005.  
**Projection:** authorized case summary/timeline, treating relationship, plan versions, accepted snapshot, stages, required evidence/acknowledgements, follow-up state.  
**Commands:** dentist creates/revises/proposes plan; authorized clinician records stage progress/evidence/completion; create amendment proposal; permitted staff record non-clinical case facts.

**Plan-line commands and projection (`FR-CLINICAL-006`, `FR-CLINICAL-007`).** The projection additionally exposes, per plan version: its lines with procedure definition version, patient-readable procedure name, quantity, billing unit, unit price, line total, currency, the inclusion set captured from the governing definition, and the family and mapping generation the line was reached through; each line's typed modifiers with governed category, reason and price difference; the derived version total; the active approved commercial options applicable to each line; and, on a superseding version, the disclosed change summary against the version it supersedes.

Commands are: add, edit and remove a line while the version is a draft; set quantity against the procedure's billing unit; attach a typed modifier chosen from the active approved options; record a third-party cost with its attributable party or reference and reason; and compose the amendment summary a superseding version requires before it can be proposed.

**Rules:** the total is derived from lines and is never independently editable. A charge for a component the governing definition marks as included, a modifier with no governed category, and a charge justified only by free text are all rejected by `ERR-CLINICAL-002` at authoring time, so they never reach the patient. An added clinical service is authored as its own procedure line, not as a fee. Proposing a superseding version without its change summary is refused.  
**Prohibited:** non-treating staff cannot author diagnosis/treatment plan; accepted historical versions and their lines cannot be edited; no command bills against an amendment the patient has not accepted.

---

# 6. Financial Records, Reviews, and Claims

## SDC-FINANCE-001 — Clinic/Admin Financial Record Workspace

**Actors:** authorized clinic party; finance reviewer according to action.  
**Requirements:** FR-FINANCE-001–007.  
**Projection:** immutable financial terms snapshot, ordered external financial events, derived confirmed/disputed/pending states, evidence metadata, related work items.  
**Commands:** report external payment/refund/compensation event; confirm/dispute when actor is authorized; create correction/reversal event; finance reviewer resolves assigned record-review work.  
**Boundary:** no command authorizes/captures/holds/transfers/settles money.

## SDC-REVIEWS-001 — Review Integrity and Appeal Workspace

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
**Projection:** work item ID/type, linked resource/case, lifecycle state, escalated flag, overdue flag, priority, due time, responsibility scope, blocking reason, assignment, safe summary.  
**Commands:** claim/assign where allowed; start; move to waiting with a named blocking reason; resume; complete with outcome; escalate; reopen where policy permits.  
**States:** `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `WAITING`, `COMPLETED`, owned by `STATE_MACHINES.md` section 20 (`PO-UX-08`).  
**Rules:** escalated and overdue are **flags, not states** — an item can be `IN_PROGRESS`, escalated and overdue at once, and the projection must expose all three independently rather than as one status value. Deadline breach is derived from `due_at`. Completing an item whose domain condition is unresolved is refused.  
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

## SDC-POLICY-002 — Admin Market Calibration and Commercial Policy Workspace

**Actors:** authorized commercial/pricing administrator; authorized staff read-only; independent approver where separation of duties requires one.  
**Requirements:** FR-ELIG-019, FR-ELIG-018, FR-POLICY-001–003, FR-CLINICAL-006.  
**Projection:** market observations by locality and catalog scope with amount, currency, observation date, source type and reference, material or laboratory variant, verification state, confidence and provenance; the effective price policy's observation window, minimum sample threshold, confidence rules and approved distribution boundaries; the current sample size and resulting calibration state per scope, including which scopes are non-final and why; draft, scheduled and active price-policy versions with effective periods; the commercial-option catalog by category with lifecycle and approvals; and the currency policy's approved rate source, rounding rule and effective period.  
**Commands:** record an observation; verify or reject an observation with a reason; supersede an observation to correct it; draft a price-policy version and its thresholds; submit for the required independent approval; schedule and activate prospectively; retire a version; manage price-display modes, material and option upgrades, third-party-cost categories, quantity rules and external financial method labels; draft and activate currency presentation, approved rate source and rounding policy.  
**Scope:** owned commercial and locality scope only.  
**Rules:** every threshold is policy data with an effective date — nothing here is a code constant, and the workspace exists precisely so that changing a band, a sample threshold, an approved modifier, a third-party category, or a rate source needs no deployment. Observations are corrected by supersession so a prior calibration result stays reproducible. Activation is prospective: the projection must state plainly that earlier eligibility decisions keep their captured policy version and that accepted snapshots are never recomputed. A scope whose sample or confidence rule is unmet shows its non-final calibration state honestly rather than a computed class, and no label may claim a market or city average for such a scope.  
**Prohibited:** no command sets `P`, a scientific grade, a protection level or an internal risk value for any provider; no command edits a clinic's historical price assertion; no command activates a clinical value or substitutes for clinical approval; enabling an external financial method label never activates a money-movement integration.  
**Errors/states:** policy lifecycle owned by `STATE_MACHINES.md` section 6; the calibration qualifier by section 7.1.

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
| IDENTITY | 005 |
| CATALOG | 003 |
| ELIG | 005 |
| BOOKING | 002 |
| CLINICAL | 001 |
| FINANCE | 001 |
| REVIEWS | 001 |
| CLAIMS | 001 |
| OPS | 002 |
| POLICY | 002 |
| AUDIT | 001 |

Do not renumber or repurpose these IDs. New staff contracts allocate `max + 1` inside the owning domain.