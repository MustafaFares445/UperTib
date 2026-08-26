# UberTib Cross-Platform Behavior Contract

**Phase:** 3 — Execution / Cross-Platform Behavior  
**Baseline:** 2026-08-24  
**Status:** Canonical owner for behavior propagation between Patient, Clinic, Admin, and shared backend state  
**Platforms:** Patient React Native app · Clinic Filament panel · Admin Filament panel · Shared Laravel backend  
**Product behavior owner:** `docs/PRD.md`  
**Lifecycle owner:** `docs/domain/STATE_MACHINES.md`  
**Authorization owner:** `docs/domain/PERMISSIONS_MATRIX.md`  
**API owner:** `docs/api/API_CONTRACTS.md`  
**Persistence owner:** `docs/database/ERD.md`  
**Ordering-sensitive detail:** `docs/diagrams/SEQUENCE_DIAGRAMS.md`  
**Implementation order:** `docs/IMPLEMENTATION_PLAN.md`

## 1. Purpose

This document defines the expected **cross-platform behavior** of UberTib V1.

It answers, for every shared workflow:

1. which platform or system actor initiates the action;
2. which authoritative backend record/event/state changes;
3. what the Patient application must see afterward;
4. what the Clinic panel must see afterward;
5. what the Admin panel must see afterward;
6. which notification intent or operational work item is expected;
7. whether the record can be edited, versioned, transitioned, retired, revoked, or deleted;
8. what happens if a secondary side effect such as notification delivery fails.

This document exists specifically to prevent each platform from implementing an isolated interpretation of the same feature.

Example:

> When a patient creates a booking, Laravel creates one authoritative `REQUESTED` booking. The Patient app sees the request as pending, the owning Clinic sees the same booking as actionable work, authorized Admin operations can inspect the same booking, and the Clinic receives a notification/work intent. No second Clinic-only booking record is created.

This file does not redefine state names, API payloads, permissions, or database columns. Those remain owned by their canonical documents. It defines **how an authoritative change propagates across the three platform surfaces**.

`Q-PLATFORM-001` still prevents claiming complete reconciliation against readable authoritative SRS v1.1. Production clinical catalog and S/P/H/I behavior remain governed by `Q-CATALOG-001` and `Q-ELIG-001`. Concrete external notification/evidence providers remain unresolved by `Q-PLATFORM-003`.

## 2. Core Cross-Platform Rule

UberTib has **one authoritative business state**, implemented in the shared Laravel application.

The three product surfaces are adapters over that state:

| Surface | Role |
|---|---|
| Patient React Native app | Patient/guardian commands and patient-safe projections through `/api/v1` |
| Clinic Filament panel | Provider/branch/dentist commands and provider-scoped projections |
| Admin Filament panel | Governance, verification, operations, scoped review, and oversight projections |
| Laravel backend | Authoritative state, policies, state transitions, transactions, authorization, audit, jobs, read models |

The following architecture is forbidden:

```text
Patient booking table/state
        +
Clinic booking table/state
        +
Admin booking table/state
        = three manually synchronized truths
```

The required architecture is:

```text
One authoritative Booking aggregate/state in Laravel
        ↓
Patient-safe projection
        ↓
Clinic-scoped projection
        ↓
Admin-scoped operational projection
```

The same rule applies to cases, treatment plans, financial events, reviews, claims, evidence metadata, eligibility decisions, and other shared records.

## 3. Cross-Platform Consistency Laws

### 3.1 One record, multiple authorized projections

A cross-platform feature must not create platform-specific copies of the same domain record merely so another interface can display it.

Examples:

- a Patient booking and a Clinic booking are the same booking;
- a Clinic treatment plan and the Patient-visible proposed plan are the same versioned plan with different authorized fields/actions;
- a Patient external-payment report and the Clinic/Admin financial record are the same append-only financial event stream;
- a Patient claim and the Admin claims queue reference the same claim;
- an Admin work item references the authoritative source domain record and does not replace it.

### 3.2 Server commit is the source of truth

A platform may update its local UI optimistically only where safe, but no business mutation is final until Laravel commits the authoritative result.

This is mandatory for:

- booking submission/confirmation/cancellation;
- alternative acceptance;
- treatment-plan acceptance;
- stage completion/reopening;
- external financial assertions/responses;
- review submission;
- claim/refund submission;
- appeal submission;
- authorization grant/revocation;
- eligibility decisions;
- production publication.

### 3.3 State changes propagate through reads, not duplicate writes

After a successful mutation, the other platforms observe the new state by querying the shared backend/read model. A second command must not be issued merely to "update the other platform."

Example:

1. Clinic accepts a booking.
2. Shared booking action commits `CONFIRMED` after revalidation.
3. Patient API now returns `CONFIRMED`.
4. Clinic query now returns `CONFIRMED`.
5. Admin operational query now returns `CONFIRMED`.
6. Notification intent tells the patient that attention is required/that the state changed.

There is no separate `updatePatientBookingStatus()` write after the Clinic action.

### 3.4 Notifications are post-commit side effects

A business mutation that has committed successfully must not be rolled back because a notification could not be delivered.

Required sequence:

```text
Authorize → Validate → Transaction → Commit authoritative state
                                      ↓
                              Create notification/work intent
                                      ↓
                                 Deliver/retry
```

If delivery fails:

- the business state remains committed;
- the notification is retried or surfaced operationally according to monitoring/work-queue rules;
- the recipient sees the new state on the next authoritative refresh even if no notification arrived;
- the system never reverses a booking, treatment acceptance, financial event, claim decision, or other committed domain state just to match a failed notification.

### 3.5 Work items are operational projections, not business truth

A work item may say "Review booking request" or "Claim evidence missing", but closing/deleting a work item does not itself change the underlying Booking/Claim/Evidence state unless an authorized domain action is explicitly executed.

### 3.6 Caches cannot own safety-critical state

Cached catalog/search/timeline content may improve responsiveness, but the following require fresh authoritative validation when a mutation depends on them:

- current eligibility;
- branch readiness;
- slot capacity;
- booking transition eligibility;
- guardian authorization;
- treatment-plan version/currentness;
- financial-event response eligibility;
- review eligibility;
- claim/refund entitlement and deadline.

### 3.7 No assumed real-time transport

This contract defines what each platform must observe, but it does not require WebSockets, push notifications, SMS, email, or a named provider unless another authoritative source establishes that transport.

Until the concrete notification provider is selected:

- Laravel persists/dispatches a provider-neutral notification intent where this document marks a notification as required;
- platforms must refresh/fetch authoritative state on entry, refocus, explicit refresh, and after their own mutations as appropriate;
- notification transport failure must be observable;
- no feature correctness may depend solely on successful push/email/SMS delivery.

## 4. Mutation, Edit, and Delete Policy

Cross-platform records must not use generic CRUD semantics when the domain requires history.

### 4.1 Allowed mutation patterns

| Pattern | Use when |
|---|---|
| Direct edit | Only for mutable draft/source data explicitly allowed by the owning domain |
| State transition | A lifecycle action changes status while preserving history |
| New version | An accepted/published/historical record needs a prospective amendment |
| Append-only event | New factual assertion/decision/correction must preserve the original event |
| Revoke/expire | Authorization/credential/evidence/policy authority ends but history remains |
| Retire/supersede | A governed current version is replaced without deleting history |
| Retention deletion | Legal/privacy policy authorizes physical deletion and no legal hold blocks it |

### 4.2 Default delete rule

If a canonical domain document does not explicitly define safe deletion, **do not expose a hard-delete business action**.

Use the appropriate cancellation, revocation, retirement, supersession, closure, correction, or versioning behavior instead.

This prevents a record from disappearing from one platform while related platforms still depend on it.

### 4.3 Known record mutation rules

| Record / aggregate | Edit rule | Delete rule |
|---|---|---|
| `ServiceDefinition` | Draft may be edited; activated governed content is immutable | Existing implementation permits delete only while Draft |
| Launch-gate decision | Never edit prior accountable decision | Append-only; no hard delete |
| Clinical reviewer credential snapshot | New snapshot/status history rather than rewriting approval history | No hard delete of governed history |
| Guardian grant | Effective scope may end through revocation/expiry | Historical grant retained; no hard delete |
| Approved source fact | Correction creates governed new truth/history and reevaluation | Do not delete historical fact used by a decision |
| Eligibility decision | Immutable | Never hard delete as ordinary workflow |
| Booking | Change only through canonical state transitions | Never hard delete normal booking history; use cancellation/no-show/etc. |
| Treatment-plan draft | Draft can be revised | No generic delete requirement established; do not expose hard delete unless later approved |
| Accepted treatment plan/snapshot | Never edit; amendment creates new version | Never hard delete normal history |
| Treatment-stage completion/reopening history | Append transition/event | Never hard delete normal history |
| Financial terms snapshot | Immutable | Never hard delete normal history |
| Financial event | Append confirmation/dispute/correction/reversal assertion as a new event | Never edit/delete original event |
| Review | Govern through active/retired/publication rules | Do not hard delete verified history through ordinary UI |
| Review appeal | New appeal/decision history | No hard delete |
| Claim/refund request | Lifecycle transitions/events only | No hard delete normal workflow |
| Claim deadline event | Append pause/extension/reasoned event | No hard delete |
| Claim decision | Immutable human decision | No hard delete |
| Claim appeal | Separate lifecycle/history | No hard delete |
| Evidence object | Metadata/history retained according to policy; object may become unavailable/expired/rejected | Physical deletion only through retention/privacy policy and never while legal hold applies |
| Work item | Assignment/state/close/reopen may change | Deleting work cannot delete source business record |
| Notification intent | Delivery state may change/retry | Deleting notification UI history cannot alter source business state |

## 5. Cross-Platform Visibility Vocabulary

The matrices below use these meanings:

- **Visible** — platform can read an authorized projection of the source record.
- **Actionable** — platform has at least one current allowed command for the record.
- **Oversight** — authorized Admin can inspect/operate according to scope but does not own the originating business action.
- **Hidden** — platform must not receive the record/detail in this state.
- **Safe projection** — only fields permitted to that actor are returned; raw internal classification/evidence remains filtered.
- **Work item** — operational attention entry referencing the authoritative record.
- **Notification intent** — provider-neutral post-commit intent; delivery mechanism is not defined here.

## 6. Identity, Guardian, and Access Behavior

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Patient OTP verification succeeds | Patient | Verified contact/identity activated once | Session/bootstrap available | No patient data access created | Only authorized identity/support projection | No cross-platform notification required | Challenge consumed; never reusable |
| Guardian grant created | Authorized grantor/legal workflow | Create scoped effective grant | Grantee can act only within granted scope | Sees represented actor only where relevant to authorized case actions | Authorized staff can inspect grant/audit | Notify grantee/subject where product delivery supports it; correctness still derives from grant | Grant is historical; revoke/expire instead of delete |
| Guardian grant revoked/expired | Authorized grantor/admin policy/system expiry | Grant becomes ineffective immediately | Represented context loses future access | Future represented actions are rejected | Audit shows revocation/expiry | Affected representative should receive notification intent where delivery exists | Never rewrite past actions; no hard delete |
| Clinic/provider staff scope granted | Authorized access administrator | Active scoped capability created | No direct patient-facing effect | Authorized resources become queryable/actions become available | Grant visible to scoped access administration | Optional/in-system access-change notification; not domain truth | Effective-dated grant |
| Clinic/provider staff scope revoked/expired | Authorized access administrator/system | Authorization fails on next request | No direct patient-facing state change | Existing open page cannot continue protected actions; next read/action denied | Revocation audited | Notify affected staff where delivery exists | No deletion of historical actor attribution |

### 6.1 Access-change propagation rule

Changing local UI state does not grant or retain access. Both Filament panels and patient APIs re-evaluate active authorization on protected reads/actions. A stale browser/mobile page cannot continue operating after the underlying grant is revoked.

## 7. Catalog, Policy, and Production Publication Behavior

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Service definition draft created/edited | Authorized Admin policy/catalog actor | Draft/version changes | Hidden from production patient catalog | Hidden from production activation unless explicitly evaluation context | Draft visible/actionable to authorized staff | Review work may be created when submitted to governance | Draft mutable; only Draft is deletable in existing implementation |
| Gate decision recorded | Accountable Admin reviewer | Append medical/legal/operational/technical decision | No immediate patient exposure by itself | No production effect by itself | Gate history/readiness updates | Launch-readiness work updates | Append-only decision |
| Production service definition published | Authorized governed publication action | New active definition; prior active superseded atomically | Catalog reflects newly production-visible definition on fresh read | Service becomes available for provider-side activation/use according to policy | Publication/readiness state updated | No mandatory patient notification; operational publication event audited | New version active; previous superseded, not deleted |
| Production definition becomes unavailable/retired | Governed Admin/system action | Current production visibility changes prospectively | No longer offered as new production service where rules require | New activation/selection constrained accordingly | Governance state visible | Operational work if dependent scopes require review | Historical accepted/case records retain captured version |

| Family or procedure created, renamed, re-described, or reordered | Catalog/product administrator | Governed catalog data change, prospective | Fresh read shows the new label or order; nothing already agreed changes | Fresh read shows the new label or order in activation and planning surfaces | Change, actor, reason and effective time visible in catalog governance | No mandatory patient notification; change audited | Stable identity unchanged; content change is data, not a release |
| Family or procedure retired | Catalog/product administrator | Visibility ends prospectively | No longer offered for new discovery or planning | No longer selectable for new activation or new plan lines | Retirement and its effective time visible | Operational work where dependent scopes need review | History retained; nothing deleted; existing cases unaffected |
| Family-to-procedure mapping changed | Catalog/product administrator | Superseding effective-dated map row | New discovery paths reflect the new mapping | New plan lines resolve through the new mapping | Both map generations visible | Audited | Existing plan lines keep the map generation they were reached through |
| Procedure definition version activated | Licensed clinical reviewer approval plus governed activation | New active definition; prior superseded | Applies to new planning only | Applies to new plan lines only | Version chain, approving credential and content hash visible | Launch-readiness work updates | Accepted plan lines keep the definition version they bound |
| Market observation recorded or verified | Commercial/pricing administrator | Observation appended with provenance | No patient exposure whatsoever | No clinic exposure as ordinary provider information | Visible in market calibration governance | Audited | Corrections supersede; the original assertion stays readable |
| Price-band or calibration policy activated | Commercial/pricing administrator | New effective price policy | **Nothing visible changes** — the patient sees the provider's own price either way | No clinic-visible pricing class change; the clinic never chose it | New and prior policy versions visible; recalculation queued | Recalculation work | New eligibility decisions use the new version; earlier decisions keep theirs |
| Commercial option added, changed, or retired | Commercial/pricing administrator | Governed option row, prospective | New plans may present the new option's meaning | New plan lines may select it; retired options disappear from selection | Option lifecycle and approval visible | Audited | Accepted plan lines keep the option they referenced |

### 7.1 Historical version rule

A current catalog/policy change never rewrites a previously accepted treatment/financial snapshot or the policy version used by an earlier eligibility/claim decision.

This rule is what makes frequent operational configuration safe, so it is stated concretely across the surfaces the Syria catalog and pricing decision touches. When an administrator changes catalog content, a mapping, a provider price, a price band, a calibration threshold, a commercial option, an exchange-rate source, or a rounding rule:

- new discovery, new planning, and new evaluations use the current applicable version from their effective date;
- a not-yet-accepted proposal whose governing fact materially changed becomes stale and must be reissued rather than silently repriced;
- an already-accepted treatment or financial snapshot keeps its captured amount, currency, lines, options, and policy references forever;
- an earlier eligibility decision keeps its captured policy version, comparison basis, and calibration state and remains reproducible;
- prior financial events remain append-only;
- provenance records the actor, the version, the reason, and the effective time.

A change that appears to alter an accepted historical amount on any platform is a defect, not a configuration outcome.

## 8. Provider / Branch Activation, Evidence, and Verification

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Clinic starts/updates activation data | Clinic | Draft/source facts stored in provider/service/branch scope | Hidden | Draft visible/editable to owning Clinic scope | Optional authorized oversight | No notification required before submission | Mutable only while source/draft workflow permits |
| Clinic submits activation request | Clinic | Activation request + source facts/evidence refs committed | Provider is not automatically discoverable | Request becomes submitted/pending verification | Verification queue receives actionable request | Required Admin/verification work item; notification intent to responsible queue/actor | No direct final eligibility value is accepted from Clinic |
| Evidence uploaded by Clinic | Clinic | Private evidence metadata created; object quarantined until accepted scan/validation state | Hidden | Uploader sees safe processing status | Authorized verification can see safe metadata/preview only when allowed | Scan/verification work as required | Private; retention policy governs later physical deletion |
| Evidence rejected/invalid/expired | Scanner/verifier/system expiry | Evidence no longer satisfies fact/gate | Affected provider may disappear from eligible search if decision becomes unsafe | Clinic sees blocker/reason it is authorized to see | Verification/operations see exception | Notification intent to affected Clinic + work item where action is required | Original evidence history retained |
| Verification approves a source fact | Verification/clinical reviewer as required | Append/activate approved fact with provenance | No direct raw fact exposure; eligibility may change | Clinic sees fact/activation progress | Decision/audit visible | Recalculation work/job triggered | Approved fact used historically is not silently edited |
| Verification rejects a source fact | Authorized verifier/reviewer | Rejection recorded; affected activation remains blocked | Provider not exposed as eligible on basis of rejected fact | Clinic sees actionable rejection/blocker | Verification state visible | Clinic notification intent + work item status update | Correction requires new/updated source submission, not rewriting prior eligibility |

## 9. Eligibility and Automatic Suspension Behavior

**Requirements:** FR-ELIG-001–017 and related policy/audit requirements.

### 9.1 Eligibility result propagation

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Eligibility evaluation completes as `ELIGIBLE` | System | Append immutable decision/gate results | Exact provider/service/branch may appear in search | Clinic sees safe eligible/readiness state | Scoped staff can inspect decision/provenance; raw detail by permission | Close/update related evaluation work | Never edit decision; later change creates new decision |
| Evaluation is `PENDING_EVALUATION` | System | Append immutable pending decision + blockers | Must not be shown as eligible; never shown as scientific grade `F` | Clinic sees actionable safe blockers | Verification/operations can inspect missing dependencies | Work item/notification if Clinic/admin action is required | New evidence/fact triggers a new evaluation |
| Eligibility fails / becomes not eligible | System | Append immutable failing decision | Provider/service/branch omitted or safely unavailable for new booking | Clinic sees safe reason/blocker | Admin sees scoped decision detail | Notification/work when action is required | Never manually set final result |
| Required credential/fact/policy/evidence expires/revokes | System/governed actor | New affected-scope `SUSPENDED`/failing decision; new booking blocked | Provider disappears/becomes unavailable for affected scope | Clinic sees suspension and blockers | Operations sees impacted scope and dependency | Required Clinic notification + Admin work item for actionable suspension | Earlier eligible decision remains history |
| Missing dependency later restored | Authorized fact/evidence/policy workflow + system | New reevaluation decision | Provider may reappear only after new passing decision | Clinic sees restored eligibility | Admin sees new decision chain | Resolve suspension work; notify affected Clinic if useful/actionable | Never reactivate by editing old decision |

### 9.2 Existing-booking safety rule

Automatic suspension blocks **new** affected bookings immediately. Each affected `CONFIRMED` booking moves to the non-terminal `ELIGIBILITY_REVIEW` state defined in `STATE_MACHINES.md` section 8.2 (`PO-UX-13`).

| Platform | Projection while `ELIGIBILITY_REVIEW` is active |
|---|---|
| Patient | Sees a safe status meaning the appointment is on hold pending a check, with no penalty language and no instruction to attend |
| Clinic | Sees the booking as not attendable; start and complete actions are unavailable while the suspension remains |
| Admin/Operations | Sees an urgent work item with the controlling suspension reason and the review due time |

The reserved slot is preserved temporarily. The review is due no later than two hours before the appointment, and becomes immediately due if the suspension occurs inside that window. The outcome is either return to `CONFIRMED` on a new authoritative `ELIGIBLE` evaluation, or `CANCELLED` with reason `PROVIDER_ELIGIBILITY_SUSPENDED` and no patient penalty. **No override of any role may make the booking attendable while the owning scope remains `SUSPENDED`,** and cancellation never transfers the patient to another provider automatically.

### 9.3 Classification visibility

- Patient never receives raw internal `I`.
- Clinic does not receive raw internal `I` as ordinary provider information.
- Patient/Clinic cannot edit S/P/H/I or final eligibility.
- Neither Patient nor Clinic receives internal `P`, its calibration state, the market comparison basis, sample counts, percentiles, confidence figures, or raw `service_risk_level` codes.
- The provider's own price presentation and its governed mode **are** patient-safe and are shown whatever the internal calibration state is; a non-final calibration state changes nothing any patient or clinic sees.
- No surface may label a price as a market or city average while the effective policy reports a non-final calibration state.
- Authorized Admin roles may inspect internal components only within their permission/subject-matter scope.

## 10. Booking Cross-Platform Contract

**Requirements:** FR-BOOKING-001–003, eligibility/audit requirements.  
**Canonical states:** `docs/domain/STATE_MACHINES.md`.

### 10.1 Booking behavior matrix

| Event / action | Initiator | Backend effect | Patient App | Clinic Panel | Admin Panel | Notification / work | Edit / delete rule |
|---|---|---|---|---|---|---|---|
| Booking request created | Patient/authorized guardian | Create one `REQUESTED` booking after revalidation/idempotency/capacity checks | Shows request as pending/current server state | Same booking appears as actionable provider request for exact branch/provider scope | Authorized operations can inspect | **Clinic notification intent + Clinic booking work item** after commit | Booking is never duplicated per platform; no hard delete |
| Clinic accepts request | Clinic | Revalidate readiness/eligibility/capacity; transition to `CONFIRMED` when valid | Same booking becomes confirmed | Same booking becomes confirmed/non-actionable for response | Oversight state updates | **Patient notification intent** after commit; response work closes/advances | No direct status edit; transition only |
| Clinic rejects request | Clinic | Append rejection transition + reason | Same booking shows rejected + safe reason | Shows rejected history | Oversight reflects actor/reason | **Patient notification intent**; response work closes | Rejection is history; do not delete booking |
| Clinic proposes alternative | Clinic | Create/store alternative and `ALTERNATIVE_PROPOSED` state according to canonical model | Shows alternative as actionable for patient | Shows waiting for patient decision | Oversight shows pending alternative | **Patient notification intent** after commit | Clinic does not overwrite original requested facts silently |
| Patient accepts alternative | Patient/guardian | Revalidate proposal/state/eligibility/capacity; transition to confirmed if valid | Shows confirmed alternative | Same booking shows confirmed alternative | Oversight updates | **Clinic notification intent** after commit; waiting work resolves | Idempotent transition, no duplicate booking |
| Alternative expires/becomes invalid | System/policy | Proposal can no longer be accepted; the canonical resulting booking state remains unresolved under `Q-BOOKING-001` | Patient acceptance is disabled/rejected on server and the current authoritative safe state is shown without inventing a terminal outcome | Clinic sees expired/non-actionable proposal and current authoritative booking state | Operations sees deadline/state and unresolved outcome semantics | Notification/work may reflect expiry, but must not imply an unapproved terminal state | Preserve proposal/history; do not infer `REJECTED`, `CANCELLED`, or return-to-`REQUESTED` until `Q-BOOKING-001` is resolved |
| Patient cancels booking | Patient/guardian | Authorized cancellation transition with actor/reason/policy snapshot | Shows cancelled | Same booking shows cancelled | Oversight shows cancellation provenance | **Clinic notification intent** after commit; related work closes/updates | Cancellation replaces delete semantics |
| Clinic cancels booking where policy allows | Clinic | Authorized cancellation transition with actor/reason/policy | Shows cancelled + safe reason | Shows cancelled | Oversight shows provenance | **Patient notification intent** after commit | No hard delete; no silent date/status edit |
| No-show recorded | Authorized provider/system workflow after policy threshold | Append no-show transition/event | Shows resulting status/consequence safe projection | Shows no-show history | Admin sees actor/time/policy | Patient notification intent when status/consequence requires awareness; downstream work may be created | No early no-show; no deletion |
| Booking reaches completed experience | Authorized domain workflow | Transition to completed when canonical prerequisites hold | Booking/case shows completion | Clinic sees completed | Admin oversight updates | May enable review/follow-up workflows | Completion history immutable; later correction must be auditable |

### 10.2 Booking modification rule

A confirmed or historical booking must not expose a generic database-style "edit booking" action that directly changes date/provider/service/state across platforms.

Changes use the explicit lifecycle supported by canonical requirements, such as:

- alternative proposal + patient acceptance;
- cancellation + new request where applicable;
- the governed `RescheduleProposal` workflow defined by `FR-BOOKING-004` and `STATE_MACHINES.md` section 8.3.

While a reschedule proposal is `PENDING`, all three platforms continue to show the booking as `CONFIRMED` on its **original** slot. The proposed slot is never rendered as the appointment before the counterparty accepts, and acceptance is the only transition that moves the booking.

If a desired modification is not represented by an approved state/action, it must not be implemented as an unrestricted edit form.

### 10.3 Booking notification failure

If the Clinic accepts a booking and the Patient notification fails:

- booking stays `CONFIRMED`;
- Patient `GET booking` / list returns `CONFIRMED`;
- Clinic sees `CONFIRMED`;
- Admin sees `CONFIRMED`;
- failed notification is retried/monitored;
- booking is never reverted to `REQUESTED`.

## 11. Clinical Case and Treatment Plan Contract

### 11.1 Case visibility

A case is one authoritative case. Patient, Clinic, and Admin receive different fields/actions based on relationship and purpose.

Admin oversight does not grant Admin the right to author a diagnosis or treatment plan.

### 11.2 Treatment-plan behavior matrix

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Dentist creates treatment-plan draft | Treating dentist | Create draft plan/version | Hidden until proposed/otherwise authorized | Draft visible/editable to treating clinician | Only purpose-scoped oversight if allowed | No patient notification while draft | Draft may be revised; no accepted-history mutation |
| Dentist updates draft | Treating dentist | Update same mutable draft as allowed | Hidden | Updated draft visible | Scoped oversight if allowed | None required | Direct edit only while draft |
| Dentist proposes plan | Treating dentist | Transition exact plan version to proposed/current offer | Patient can read exact proposed plan + linked financial proposal | Clinic sees awaiting patient response | Authorized Admin oversight sees status | **Patient notification intent** after commit | Proposed version must not be silently replaced after patient viewed/accepted; amendment uses versioning |
| Patient accepts plan | Patient/guardian | Atomically create immutable accepted clinical + financial terms snapshots | Shows accepted version | Clinic sees accepted state/snapshot reference | Admin oversight updates | **Clinic notification intent** after commit | Accepted version immutable; no delete/edit |
| Acceptance fails due stale/incomplete plan | Patient request rejected | No authoritative acceptance mutation | Patient sees error/current plan | Clinic remains at current plan state | Admin unchanged except audit/error if applicable | No success notification | No partial snapshot |
| Dentist authors or revises plan lines and modifiers | Treating dentist | Lines and typed modifiers stored on the draft version | Hidden while draft | Line detail, quantities, included components and price differences visible to the author | Purpose-scoped oversight only | None required while draft | Rejected line or uncategorized charge never reaches a proposal (`ERR-CLINICAL-002`) |
| Dentist needs amendment after acceptance | Treating dentist | Create new plan version/amendment with its disclosed change summary | Existing accepted version stays historical; new proposal appears only when proposed | Clinic authors new version and must supply the change summary | Admin sees version chain if authorized | Notify Patient when new version is proposed | Never edit accepted version in place; a superseding version cannot be proposed without its summary |
| Patient reads a proposed amendment | Patient/guardian | None | Sees changed lines, reason per change, and price difference against the superseded version before any acceptance action | Clinic sees awaiting patient response | Oversight sees pending amendment | None | Read changes no state |
| Patient accepts amendment | Patient/guardian | New immutable accepted snapshot linked to new version | Current accepted view changes prospectively; old snapshot remains accessible where required | Clinic sees new accepted version | Admin sees full authorized history | Clinic notification intent | Previous acceptance never overwritten |
| Amendment left unaccepted | — | No authoritative change | Previously accepted terms still govern; the amendment is visibly pending, never applied | Clinic must not treat the amendment as agreed or bill against it | Oversight sees it pending | Reminder intents per policy | An unaccepted amendment governs nothing (`FR-CLINICAL-007`) |

### 11.3 No autonomous treatment authoring

System automation/AI may support validation/workflow but cannot create the authoritative diagnosis/treatment plan as if authored by the clinician.

## 12. Treatment Stages, Evidence, and Follow-Up

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Stage evidence recorded | Treating clinician/authorized Clinic actor | Evidence bound to exact stage, private lifecycle applied | Patient sees only patient-safe stage/evidence status | Clinic sees authorized evidence/status | Purpose-scoped Admin/reviewer can inspect | Verification/scan work if applicable | Evidence history retained; no public URL |
| Stage completion requested | Treating clinician | Validate accepted snapshot + required evidence/facts | No completion shown until commit | Action succeeds/fails authoritatively | Oversight reflects result | None before commit | Completion cannot be local-only |
| Stage completed | Treating clinician action | Append completion state/event with actor/time/evidence set | Timeline shows completed stage | Clinic shows completed stage | Admin timeline/oversight updates | **Patient notification intent** where stage progress is patient-relevant; next follow-up work may be created | Do not delete completion; correction uses reopening/event |
| Stage reopened | Authorized clinician/workflow | Append reopening reason/event | Timeline reflects reopened/current state | Clinic sees actionable reopened stage | Admin sees reason/provenance | Patient notification when the reopened status affects patient action; work item as needed | Never erase prior completion |
| Follow-up becomes due | System from accepted plan/policy | Follow-up work/reminder state becomes due | Patient sees/reminder intent | Clinic receives actionable follow-up work | Admin sees overdue/exception only within operations scope | Patient/Clinic notification intent as configured; overdue can create work | Do not change accepted plan to represent reminder state |

## 13. External Financial Records Contract

**Hard boundary:** No row/action below authorizes, captures, holds, transfers, settles, pays out, or refunds money electronically.

### 13.1 Financial behavior matrix

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Accepted financial terms created | Patient accepts clinician-authored plan/terms | Immutable `FinancialTermsSnapshot` created atomically | Shows accepted terms | Clinic sees same accepted terms | Authorized Admin/finance can inspect | Clinic notification may accompany plan acceptance | Immutable snapshot; no edit/delete |
| Patient reports external payment | Patient/guardian | Append `REPORTED_UNCONFIRMED` financial assertion | Shows pending confirmation | Authorized counterparty Clinic sees pending response | Finance/Admin oversight sees event | **Clinic/counterparty notification intent**; finance work if policy requires | Original event immutable |
| Clinic reports external payment | Clinic | Append unconfirmed assertion | Patient sees pending confirmation | Originating Clinic sees submitted record | Admin oversight sees event | **Patient/counterparty notification intent** | Original event immutable |
| Counterparty confirms event | Patient or Clinic according to event ownership | Append confirmation event; derive new financial status | Both authorized case parties see confirmed result | Same event stream/result | Admin oversight updates | **Originating party notification intent** | Do not mutate original report |
| Counterparty disputes event | Patient or Clinic according to event ownership | Append dispute event; derived status becomes disputed | Both authorized case parties see disputed state/safe reason | Same | Admin/finance gets actionable dispute context | **Originating party notification + finance/dispute work item** | Correction/decision is another event, not edit |
| Authorized correction is required | Authorized party/reviewer | Append correction/reversal assertion according to governing rules | Timeline shows corrected interpretation | Same | Admin sees full authorized provenance | Notify affected parties if current outcome changes | Never erase erroneous original assertion |
| Refund/compensation approved | Human claim/refund decision | External amount/action due is recorded; no transfer | Patient sees approved obligation/status | Relevant Clinic sees obligation/status | Admin finance sees execution due | Notify affected parties + finance/external-execution work | Decision/obligation historical |
| External refund execution reported | Authorized asserting party after off-platform execution | Append execution assertion | Other party sees pending confirmation | Same | Finance oversight updates | **Counterparty notification intent** | No platform refund call exists |
| External refund execution confirmed/disputed | Authorized counterparty | Append response event | Timeline derives confirmed/disputed result | Same | Admin oversight updates | Originator notification; dispute work if required | Append-only |

### 13.2 Financial deletion rule

There is no normal UI action named "Delete payment" or "Delete refund" for a historical external financial event.

If an assertion was wrong, the system records a subsequent correction/dispute/reversal-type fact supported by the approved model. This keeps all three platforms aligned on the same event history.

## 14. Reviews and Review Appeals

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Verified review submitted | Eligible Patient/guardian | Create one active review for verified completed experience | Shows submitted/published state according to policy | Clinic can see authorized published/associated review projection | Integrity operations can inspect | Clinic notification is useful but not required for correctness; integrity work only when needed | One active review; no duplicate through retry |
| Review becomes ineligible/retired through governed decision | Authorized integrity workflow | Publication/active state changes according to policy | Patient sees current safe review state | Clinic sees current published state | Admin sees decision/provenance | Notify affected party when a decision changes visibility | Do not silently edit rating to solve eligibility issue |
| Review appeal submitted | Authorized affected party | Create separate appeal | Appellant sees appeal state | Other affected party sees only policy-authorized safe state | Admin integrity queue becomes actionable | **Integrity work item + relevant reviewer notification** | Appeal does not rewrite review/rating |
| Review appeal decided | Human integrity reviewer | Append/commit governed decision | Authorized affected parties see result | Same safe result | Full decision history to authorized Admin | Notify affected parties | Rating `R` never feeds S/P/H/I |

## 15. Claims, Refund Requests, Evidence, and Appeals

### 15.1 Claim behavior matrix

| Event / action | Initiator | Backend effect | Patient | Clinic | Admin | Notification / work | Record rule |
|---|---|---|---|---|---|---|---|
| Refund request submitted | Patient/authorized case party | Create claim/refund workflow after entitlement/deadline validation | Shows submitted/current state | Relevant Clinic sees claim context when it is a party | Admin claims queue receives item | **Clinic/relevant counterparty notification + Admin claim work item** | No money movement; no hard delete |
| Protection claim submitted | Eligible Patient/case party | Create claim only if accepted snapshot includes applicable protection entitlement | Shows submitted | Relevant Clinic sees scoped claim | Admin queue receives item | Same as above | No promise/execution of payment by platform |
| Claim evidence missing/rejected/expired | System/verifier/reviewer | Claim becomes/continues explicit evidence-incomplete workflow state | Patient sees safe missing/actionable evidence requirements | Clinic sees only requirements assigned to it | Admin sees full scoped evidence work | Notification to whichever party must act + evidence work item | Original deadline/history preserved |
| Patient supplies allowed claim evidence | Patient | Evidence metadata/binding created when transfer mechanism is available/authorized | Shows processing/accepted status | Clinic sees only authorized relevant metadata | Admin/reviewer sees evidence when authorized | Scan/review work | Binary transport remains provider-dependent under `Q-PLATFORM-003` |
| Clinic supplies claim evidence/response | Clinic | Append evidence/response to same claim | Patient sees safe claim progress, not private Clinic-only evidence | Clinic sees submission | Admin reviewer receives updated work | Reviewer/work notification | No duplicate Clinic claim record |
| Claim deadline paused/extended | Authorized reviewer/workflow | Append reasoned deadline event | Patient sees effective deadline/history safe projection | Relevant Clinic sees effective deadline if action required | Admin sees full event/provenance | Notify affected party when deadline/action changes | Never overwrite original deadline silently |
| Human claim decision submitted | Authorized independent human reviewer | Immutable decision with findings/reasons/evidence/policy/actor/external actions | Patient sees safe decision/result | Relevant Clinic sees safe result | Full decision/provenance visible to authorized Admin | **Notify affected parties**; close/advance work | System automation cannot make final sensitive decision |
| Claim appeal submitted | Eligible affected party | Create separate appeal referencing immutable decision | Appellant sees submitted appeal | Other affected party sees authorized appeal state | Independent appeal work created | **Admin/reviewer work + relevant party notification** | Original decision remains unchanged |
| Appeal decided | Authorized independent human reviewer | Append/commit appeal decision | Parties see safe result | Same | Admin sees full history | Notify affected parties; close appeal work | Never rewrite original decision |

### 15.2 Claim deletion rule

Closing a claim, rejecting a claim, deciding an appeal, or resolving external execution does not delete the claim. Historical workflow remains reproducible.

## 16. Automatic System Events and Scheduled Behavior

The system itself may initiate cross-platform changes when a governed condition becomes true.

| Trigger | Backend effect | Patient | Clinic | Admin | Notification / work |
|---|---|---|---|---|---|
| Credential expires/revokes | Affected eligibility scope reevaluated/suspended | New booking unavailable | Suspension/blocker visible | Exception/review visible | Clinic notification + Admin work |
| Required evidence expires | Reevaluate affected facts/eligibility/claim evidence | Safe current result only | Actionable blocker where responsible | Work/exception visible | Responsible-party notification/work |
| Provider response deadline reached | Booking action no longer valid under policy | Current authoritative state/actionability shown | Request no longer actionable as before | Deadline breach visible | Operational work/notification as configured |
| Claim deadline reached | Claim deadline state derived according to policy | Claim action/state updated | Relevant Clinic state updated | Claims operations alert/work | Alert/work; do not fabricate claim decision |
| Follow-up due | Follow-up due projection/work | Reminder/status | Clinic work | Overdue operations only where needed | Reminder/work intent |
| Retention eligibility reached | Governed deletion process evaluates record | Resource may become unavailable only according to privacy/legal rules | Same | Compliance audit visible | No deletion if legal hold; operations exception on failure |

System automation may compute, expire, revalidate, dispatch, and create operational work. It cannot autonomously make final sensitive medical/legal/punitive/high-impact claim decisions and cannot move money.

## 17. Notification Contract

### 17.1 Notification intent versus delivery channel

Patient-addressed intents additionally create a **durable in-system entry** under `FR-PLATFORM-001`, independent of any delivery channel. Reading or dismissing an entry changes no business state. Deadline-bound and action-required items must also be reachable from the patient attention area, so a failed or undelivered push, SMS, or email can never cause a missed obligation.

This document uses **notification intent** because the concrete transport/provider is unresolved.

A notification intent must minimally carry enough safe reference data to let the recipient open or refresh the authoritative record. It must not carry private evidence, OTP values, raw `I`, secrets, or unnecessary sensitive clinical/financial detail.

The source business record remains authoritative even if:

- notification is delayed;
- delivery provider is unavailable;
- mobile device is offline;
- recipient dismisses the notification;
- an in-system notification record is later marked read.

### 17.2 Required cross-platform notification matrix

| Trigger | Recipient | Purpose | Delivery timing | Failure behavior |
|---|---|---|---|---|
| Patient creates booking request | Owning Clinic/provider workflow | New booking requires response | After booking commit | Booking remains requested; retry/escalate notification/work |
| Clinic accepts booking | Patient/acting guardian | Booking state changed to confirmed | After confirmation commit | Booking remains confirmed; patient sees state on refresh |
| Clinic rejects booking | Patient/acting guardian | Inform rejection and safe reason | After rejection commit | Rejection remains authoritative |
| Clinic proposes alternative | Patient/acting guardian | Patient action required | After proposal commit | Proposal remains available until canonical deadline; retry delivery |
| Patient accepts alternative | Clinic/provider workflow | Patient accepted; booking confirmed when valid | After confirmation commit | Booking remains confirmed |
| Patient cancels booking | Clinic/provider workflow | Booking no longer active | After cancellation commit | Cancellation remains authoritative |
| Clinic cancels booking | Patient/guardian | Booking no longer active | After cancellation commit | Cancellation remains authoritative |
| Treatment plan proposed | Patient/guardian | Review/acceptance required | After proposal commit | Plan remains proposed; retry delivery |
| Treatment plan accepted | Treating Clinic/dentist | Patient accepted exact version | After snapshot commit | Accepted snapshot remains authoritative |
| Treatment stage completed/reopened when patient-relevant | Patient/guardian | Case progress changed | After transition commit | Timeline is authoritative |
| Patient reports external payment | Authorized Clinic/counterparty | Confirmation/dispute required | After financial event commit | Event remains unconfirmed; retry delivery |
| Clinic reports external payment | Patient/guardian counterparty | Confirmation/dispute required | After event commit | Event remains unconfirmed |
| Financial event confirmed/disputed | Original asserting party | Counterparty responded | After response event commit | Event stream remains authoritative |
| External refund execution reported | Authorized counterparty | Confirmation/dispute required | After event commit | Execution remains assertion until response |
| Eligibility automatically suspended | Affected Clinic/provider | Provider action may be required | After suspension decision commit | Suspension remains in force; Admin work tracks failure/action |
| Verification rejects/needs more evidence | Responsible Clinic/provider | Corrective action required | After verification decision commit | Verification state remains blocked |
| Refund/protection claim submitted | Relevant counterparty + Admin operational workflow | Claim requires response/review | After claim commit | Claim remains submitted; work queue is authoritative for operations |
| Claim evidence action required | Responsible Patient/Clinic party | Missing/rejected/expired evidence requires action | After evidence-state commit | Claim remains in evidence workflow |
| Sensitive claim decision issued | Affected Patient and relevant Clinic party | Human decision available | After decision commit | Decision remains authoritative |
| Claim appeal submitted | Authorized review workflow / relevant party | New appeal requires independent review | After appeal commit | Appeal remains submitted |
| Claim appeal decided | Affected parties | Appeal result available | After decision commit | Decision remains authoritative |
| Guardian grant revoked where represented access exists | Affected grantee | Represented authority ended | After revocation commit | Access already revoked even if delivery fails |

### 17.3 Notification deduplication

Retrying a business command must not generate duplicate user-visible notification effects without control.

The application should bind notification intent generation to the committed business effect/idempotency result so that:

- exact command retry returns the original business outcome;
- the system does not emit a new "booking confirmed" intent for every network retry of the same confirmation;
- delivery retry retries the same intent rather than creating a new domain mutation.

## 18. Operational Work-Item Contract

### 18.1 Work-item creation expectations

| Source event | Work owner | Work meaning |
|---|---|---|
| Clinic activation submission | Verification/Admin scope | Verify provider/service/branch facts/evidence |
| Evidence failure requiring intervention | Responsible verification/operations scope | Resolve missing/rejected/scan/expiry issue |
| Eligibility recalculation failure | Operations/technical scope | Retry/investigate recalculation without inventing eligibility |
| Automatic eligibility suspension requiring action | Provider verification/operations scope | Resolve invalid dependency and existing-booking review |
| Confirmed booking enters `ELIGIBILITY_REVIEW` | Verification/operations scope, plus licensed clinical reviewer where the suspension reason requires clinical judgment | Reach the review outcome before the deadline; the appointment is not attendable meanwhile |
| Legal-basis representation request submitted | Verification/admin scope | Assess relationship, legal basis and evidence; approval is the only path that creates the grant |
| Guardian grant revoked where continuity of care needs follow-up | Operations scope | Arrange continuity; the revocation itself is never delayed or blocked |
| Patient booking request | Owning Clinic/provider scope | Respond before provider deadline |
| Booking exception/deadline breach | Operations scope | Investigate/escalate without force-confirm override |
| Claim/refund submission | Claims review scope | Validate eligibility/evidence/deadline and assign reviewer |
| Claim evidence incomplete | Responsible party/reviewer scope | Obtain/assess required evidence |
| Sensitive claim ready for decision | Qualified human reviewer | Perform scoped independent decision |
| Claim appeal submitted | Independent appeal review scope | Review appeal without rewriting original decision |
| External financial dispute | Finance/dispute operations scope where policy requires | Review recorded external facts; never execute payment |
| Follow-up overdue/failed delivery | Clinic/operations according to policy | Complete required follow-up or resolve delivery problem |
| Notification repeatedly fails for high-priority action | Operations/technical scope | Restore delivery path; domain state remains unchanged |

### 18.2 Work completion rule

A work item is complete when the underlying domain condition has been resolved or the workflow has reached its legitimate terminal/next state. Merely clicking "complete" on the work item cannot fabricate the resolution.

Work-item lifecycle states are `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `WAITING` and `COMPLETED`, owned by `STATE_MACHINES.md` section 20. Escalation and overdue are **flags and events, not states**: an item can be simultaneously `IN_PROGRESS`, escalated and overdue, and no projection may collapse those three independent facts into one status value.

## 19. Shared-Record Ownership Matrix

| Shared record | Creation authority | Main action authority | Patient projection | Clinic projection | Admin projection |
|---|---|---|---|---|---|
| Patient identity/contact | Patient verification workflow | Patient + authorized identity/admin workflows | Own identity | Only case-necessary safe identity | Scoped identity/support/audit |
| Guardian grant | Authorized grantor/legal workflow | Grantor/authorized Admin for revoke per policy | Subject/grantee safe context | Acting representative context only where case-relevant | Full scoped grant governance |
| Service definition | Admin governance | Policy/catalog/launch accountable roles | Production-safe catalog | Production activation/use context | Full governed versions/gates |
| Patient-facing service family | Catalog/product administrator | Catalog administrator; clinical reviewer where content carries clinical meaning | Production-safe discovery content | Activation and planning context | Full governed content, order, visibility, retirement |
| Detailed procedure item and its definition versions | Catalog/product administrator drafts | Licensed clinical reviewer activates clinically meaningful change | Not exposed as primary discovery | Planning and pricing context | Full versions, gates, approving credential |
| Family-to-procedure mapping | Catalog/product administrator | Catalog administrator, effective-dated | Indirect, through discovery paths | Indirect, through plan-line resolution | Both generations and effective periods |
| Provider price fact | Clinic/provider within scope | Clinic supersedes; Admin corrects only through an attributable governed workflow | Practical price and its governed mode | Own price history and effective periods | Oversight and correction provenance |
| Market observation | Commercial/pricing administrator | Commercial administrator; corrections supersede | None | None | Full corpus, verification state, provenance |
| Price-band / calibration policy | Commercial/pricing administrator | Commercial administrator per separation of duties | None | None | Full versions and effective periods |
| Commercial option | Commercial/pricing administrator | Commercial administrator; clinical approval where the option is a clinical procedure | Meaning only, where it affects a quoted plan | Selectable active options | Full lifecycle and approvals |
| Treatment plan line and modifier | Treating dentist | Treating dentist authors; Patient accepts the version | Line and modifier detail on the version shown | Authoritative authoring view | Oversight only; no authorship |
| Provider/branch activation request | Clinic | Clinic supplies facts; Admin verifies | Hidden until resulting eligibility makes provider discoverable | Full own request safe detail | Verification/work detail |
| Evidence | Authorized domain actor | Uploader + scoped verifier/reviewer | Only own/case-safe metadata | Own/assigned evidence | Purpose-scoped review/download |
| Eligibility decision | System | No human direct edit | Patient-safe eligibility | Provider-safe status/blockers | Scoped internal/provenance view |
| Booking | Patient/guardian request | Patient/Clinic actions per state/policy | Own booking | Exact provider/branch booking | Operational oversight |
| Case | System/domain workflow | Case parties by role | Own/represented case | Assigned provider/treating scope | Purpose-scoped operations/review |
| Treatment plan | Treating dentist | Dentist draft/propose; Patient accept | Proposed/accepted patient-safe version | Authoritative clinic authoring view | Oversight only; no clinical authorship |
| Treatment stage | Treating clinical workflow | Treating clinician + governed reopen | Timeline/status | Actionable clinical state | Oversight/review as permitted |
| Financial terms snapshot | System on acceptance | No edits | Accepted terms | Same case terms | Finance/operations oversight |
| Financial events | Authorized case party/reviewer | Counterparty confirm/dispute; corrections append | Safe case timeline | Safe case timeline | Full scoped operational history |
| Review | Eligible Patient/guardian | Patient create; integrity reviewer governs publication | Own review | Associated published/safe view | Integrity review |
| Review appeal | Authorized affected party | Integrity reviewer decision | Safe result | Safe result | Full appeal workflow |
| Claim/refund request | Authorized case party | Parties submit evidence; Admin human reviewers decide | Own claim | Relevant case-party view | Full scoped review/workflow |
| Claim appeal | Eligible affected party | Independent reviewer | Safe result | Relevant safe result | Full appeal workflow |
| Work item | System/domain operation | Assigned authorized operations actor | Usually hidden unless converted into user-facing state | Provider work feed where assigned | Operational queues |
| Notification intent | System post-commit | Delivery subsystem | Recipient notification history if implemented | Recipient notification history if implemented | Delivery/operations visibility as authorized |

## 20. Cross-Platform Read Refresh Rules

### 20.1 After own successful mutation

The initiating platform should use the returned committed resource/state or immediately fetch the canonical read projection. It must not manufacture the next state locally when the server did not return success.

### 20.2 When opening a shared record

Patient/Clinic/Admin must fetch current server state rather than assume the last locally cached status is still actionable.

This is particularly important for:

- booking alternative deadlines;
- revoked guardian/clinic access;
- eligibility suspension;
- treatment-plan version changes;
- claim deadlines;
- financial-event confirmation/dispute state.

### 20.3 Mobile resume / reconnect

When the Patient app resumes or reconnects after an unknown mutation outcome, it reconciles through authoritative list/detail endpoints before creating a new command.

### 20.4 Filament panels

Admin and Clinic panels share the same Laravel persistence/application layer. They must not use separate panel-specific status columns or shadow tables to synchronize shared domain records.

## 21. Error Propagation Across Platforms

A failed command must not produce a success projection on another platform.

Examples:

- booking capacity conflict → no Clinic booking work item is created for an uncommitted booking;
- stale treatment plan acceptance → Clinic still sees awaiting valid patient acceptance; no accepted snapshot exists;
- unauthorized financial confirmation → original event remains unconfirmed; originator does not see confirmed state;
- invalid claim appeal → no Admin appeal work item is created;
- failed eligibility evaluation → no patient-visible eligible provider projection is published.

Error codes and HTTP behavior are owned by `docs/api/ERROR_CATALOG.md` and `docs/api/API_CONTRACTS.md`.

## 22. Cross-Platform Failure Scenarios

### 22.1 Database commit succeeds, notification fails

Expected result:

- authoritative domain state remains changed;
- all platforms read the changed state;
- notification is retryable/observable;
- no rollback of domain state.

### 22.2 Patient request times out after server commit

Expected result:

- Patient must not blindly submit a new logical command with a new idempotency key;
- client reconciles booking/financial event/review/claim/acceptance state from server;
- exact retry with same idempotency key returns original outcome where contract requires idempotency.

### 22.3 Clinic user loses permission while a page is open

Expected result:

- next protected read/action fails authorization;
- no stale UI session can mutate the record;
- patient/admin business state is unchanged merely because the Clinic user lost access.

### 22.4 Eligibility changes while patient is viewing a provider

Expected result:

- cached provider card may be stale;
- booking request revalidates current eligibility;
- if no longer eligible, booking is rejected safely;
- Clinic/Admin see current eligibility state independently of patient's cached card.

### 22.5 Admin closes a work item without valid domain action

Expected result:

- source booking/claim/evidence/eligibility state does not change;
- implementation should prevent or surface inconsistent work completion if source condition is unresolved.

## 23. Required Cross-Platform Integration Tests

`docs/TESTING_STRATEGY.md` owns test design. The current Phase 3 test registry includes cross-platform integration coverage; implementation must preserve and prove at least the following behaviors.

| Scenario | Required assertion |
|---|---|
| Patient creates booking | Same booking is returned to Patient, visible/actionable to owning Clinic, visible to authorized Admin; Clinic notification/work created after commit |
| Clinic accepts booking | Patient read becomes confirmed; Clinic/Admin show same state; notification failure cannot revert booking |
| Clinic rejects booking | Patient sees rejected state/reason; Admin sees actor/provenance; no hard delete |
| Clinic proposes alternative | Patient sees actionable alternative; Clinic sees waiting state; Patient acceptance confirms same booking |
| Patient cancels | Clinic/Admin observe cancellation; notification failure does not restore booking |
| Clinic cancels | Patient/Admin observe cancellation with safe reason/provenance |
| Eligibility suspension | Patient cannot newly book affected scope; Clinic sees blocker; Admin gets work; unaffected scope remains usable |
| Treatment plan proposed | Patient sees exact proposed version; Admin cannot author it |
| Patient accepts plan | Clinic sees acceptance; immutable clinical/financial snapshots exist once; duplicate retry creates no second acceptance |
| Stage completed | Patient timeline and Clinic/Admin authorized views agree on completion event |
| Patient reports external payment | Clinic counterparty/Admin see same unconfirmed event; no payment integration called |
| Counterparty confirms/disputes payment | All authorized projections derive same event-stream result; original event unchanged |
| Patient submits claim | Relevant Clinic sees same claim context; Admin receives claim work; no duplicate claim copy |
| Admin human claim decision | Patient/Clinic safe projections update; original claim and decision history remain immutable |
| Appeal submitted | Admin appeal work references same original decision; original decision remains unchanged |
| Guardian grant revoked | Subsequent represented patient API action denied immediately; historical actions preserved |
| Clinic scope revoked | Clinic action denied immediately; patient/domain record remains intact |
| Notification delivery fails | Business state remains committed and visible across all platforms |
| Hard-delete attempt on historical record | Operation denied/not exposed; canonical transition/version/event mechanism is used instead |

These tests should assert authoritative database rows/events and each relevant adapter/query, not merely UI labels.

## 24. Feature Completeness Rule

A cross-platform feature is not complete until all applicable parts below are implemented:

1. authoritative Laravel action/query exists;
2. authorization is enforced;
3. state transition/version/event semantics are correct;
4. persistence is transactional/immutable where required;
5. initiating platform can execute the action;
6. every affected platform can read the resulting authorized projection;
7. required notification intent is produced post-commit;
8. required operational work item is created/updated;
9. notification/work failure cannot corrupt domain truth;
10. edit/delete behavior follows this contract and canonical domain owners;
11. cross-platform integration tests prove the propagation.

Implementing only the initiating screen or endpoint does not satisfy the feature.

## 25. Implementation Handoff by Domain

When implementing a feature, the coding agent should read in this order:

1. owning `FR-*` in `docs/PRD.md`;
2. `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` — this file;
3. `docs/domain/STATE_MACHINES.md`;
4. `docs/domain/PERMISSIONS_MATRIX.md`;
5. applicable `docs/api/API_CONTRACTS.md` / `ERROR_CATALOG.md`;
6. `docs/database/ERD.md`;
7. applicable sequence diagram;
8. owning detailed implementation plan;
9. `docs/TESTING_STRATEGY.md`.

This prevents an agent assigned only the Clinic panel, for example, from implementing a Clinic-only version of a workflow whose other half is owned by the Patient app.

## 26. Traceability Integration

`docs/TRACEABILITY_MATRIX.md` uses this document as the cross-platform behavior reference for requirements that span more than one surface.

The matrix distinguishes at least:

- backend/domain implementation;
- Patient impact;
- Clinic impact;
- Admin impact;
- API/Filament adapter;
- state/data owner;
- test coverage;
- implementation task.

A requirement must not be marked `Covered` merely because one platform has a task when the confirmed workflow requires another platform to observe or act on the resulting state.

## 27. Open Dependencies

This contract intentionally does not invent behavior blocked by unresolved decisions:

| Open item | Cross-platform impact |
|---|---|
| `Q-PLATFORM-001` | Full SRS-v1.1 reconciliation cannot be claimed |
| `Q-CATALOG-001` | Production service and procedure visibility remains clinically gated. The catalog propagation rules above are settled and are not waiting on this item |
| `Q-ELIG-001` | Production clinical calculation values and calibration thresholds cannot be treated as approved. The rule that a price-policy change is invisible to Patient and Clinic is settled |
| `Q-PLATFORM-003` | Resolved 2026-08-25 for interaction purposes by `PO-UX-17`; vendor selection folded into `Q-OPS-001`. Continue to use provider-neutral intents/interfaces |
| `Q-OPS-001` | Hosting/provider/topology remains unresolved, including managed-versus-self-hosted MySQL deployment, HA/PITR implementation, and real-time delivery infrastructure; the production relational engine is MySQL |
| `Q-PLATFORM-002` | Physical retention/deletion periods require legal validation |

No payment-provider dependency is pending because electronic money movement is explicitly outside V1.

## 28. Final Cross-Platform Invariants

Before a V1 release, the following statements must all be true:

1. A booking created by Patient is the same authoritative booking acted on by Clinic and inspected by Admin.
2. A state change performed by one platform is visible to other authorized platforms without duplicate synchronization writes.
3. A failed notification never changes a committed business result.
4. A work item never substitutes for or overrides the source domain record.
5. Generic hard delete is absent for historical bookings, accepted plans, financial events, claims, decisions, appeals, and eligibility decisions.
6. Corrections use state transitions, append-only events, or new versions according to the owning domain.
7. Patient and Clinic cannot manually edit final S/P/H/I or eligibility, and neither receives `P`, its calibration state, or the market comparison basis.
8. Patient cannot book from stale eligibility/capacity without synchronous server revalidation.
9. Treatment plans are clinician-authored; Patient acceptance creates immutable snapshots visible to Clinic/Admin according to scope.
10. Financial facts recorded by Patient/Clinic/Admin all resolve from one append-only event history and never move money.
11. Reviews and claims retain immutable decision/appeal history across all platforms.
12. Revoked guardian/staff access stops future actions immediately on every relevant adapter.
13. Private evidence remains private regardless of which platform uploaded or reviews it.
14. Sensitive human decisions remain human-attributed and separation-of-duties controlled.
15. Cross-platform integration tests prove propagation instead of relying on manual UI assumptions.
16. An administrator changing catalog content, a mapping, a provider price, a price band, a calibration threshold, a commercial option, an exchange-rate source, or a rounding rule changes no accepted historical amount, term, or decision on any platform.
17. A treatment amendment governs nothing on any platform until the patient accepts it, and the change summary is available before the acceptance action.

These invariants are mandatory implementation acceptance criteria for the shared platform behavior.