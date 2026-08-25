# Product Owner Decision — UX Phase 1 Reconciliation

**Date:** 2026-08-25  
**Status:** Approved / authoritative  
**Scope:** Patient App, Clinic/Doctor Dashboard, Admin Dashboard, and the canonical engineering documents they depend on  
**Companion decision:** `.spec/decisions/PO-2026-08-25-ux-gap-resolution.md` (`PO-UX-01`–`PO-UX-06`) remains in force and is not modified by this file.  
**Supersedes:** the open status of `Q-PLATFORM-003`, `Q-PLATFORM-005`, `Q-PLATFORM-006`, `Q-PLATFORM-007`, `Q-OPS-002`, `Q-IDENTITY-001`, `Q-REVIEWS-001`, `Q-BOOKING-001`, `Q-BOOKING-002`, `Q-BOOKING-003`, `Q-CLINICAL-001`, `CONFLICT-BOOKING-001`, and `ASM-PLATFORM-001`.

This decision closes the open items raised by UX Phase 1 after review against the canonical engineering documentation and the project UX source documents. Every item below is confirmed product behavior. The identifiers above remain permanently allocated and are marked **Resolved** rather than deleted, reused, or renumbered.

Decision numbering continues the shared `PO-UX-*` sequence.

## PO-UX-07 — Confirmed usage environment and expertise

These design contexts are authoritative for all 19 UI-bearing actors, applied by role class.

| Role class | Device and setting | Frequency and interruption | Product expertise |
|---|---|---|---|
| Patient / Public visitor / Guardian | Personal smartphone first; Arabic-first RTL; weak or intermittent connectivity must be expected | Episodic; learned navigation must not be relied on | First-time to occasional |
| Prospective provider applicant | Responsive web usable on smartphone and desktop/laptop; document and evidence upload is a major part of the task | One-time or rare | None assumed |
| Clinic representative / Clinic staff | Desktop/laptop primary inside the clinic; tablet secondary | Frequent daily; high interruption rate, especially front-desk and booking work | Trained operator after onboarding |
| Treating dentist | Desktop/laptop and tablet inside the clinic | Repeated but interruption-prone | High clinical, moderate product |
| Admin / Operations / Verification / Finance | Desktop/laptop; keyboard and mouse; higher information density is acceptable | Queue-oriented, interruption-heavy operational work | Trained recurring |
| Specialist reviewers / Policy / Legal / Technical / Audit | Desktop/laptop | Lower frequency than Operations | Trained subject-matter experts; product familiarity cannot be assumed, so complex decisions may use guided context |

For the treating dentist, optimize for low ceremony on frequent clinical tasks **without** reducing confirmation on irreversible actions.

`Q-PLATFORM-006` is resolved by this table.

## PO-UX-08 — Operational work-item lifecycle

Canonical work-item states:

- `OPEN`
- `ASSIGNED`
- `IN_PROGRESS`
- `WAITING`
- `COMPLETED`

Transitions:

| From | Event | To |
|---|---|---|
| none | create | `OPEN` |
| `OPEN` | claim / assign | `ASSIGNED` |
| `ASSIGNED` | start | `IN_PROGRESS` |
| `IN_PROGRESS` | wait for external dependency or action | `WAITING` |
| `WAITING` | resume | `IN_PROGRESS` |
| `IN_PROGRESS` | complete | `COMPLETED` |
| `COMPLETED` | reopen | `OPEN` or `ASSIGNED` depending on retained assignment |

Rules:

- `ESCALATED` and `OVERDUE` are flags and events, **not** lifecycle states.
- Escalation may change priority or assignment while preserving the lifecycle state.
- Deadline breach is derived from `due_at` and is audited.

`STATE_MACHINES.md` and `SDC-OPS-001` are updated accordingly. `Q-OPS-002` is resolved.

## PO-UX-09 — Patient notification and attention center

An in-app Patient Notification / Attention Center is confirmed for V1.

Navigation:

- Do **not** add a fifth primary Patient navigation tab. The primary set stays Home / Discover / My Care / Profile.
- The notification center is a utility destination reachable from the app chrome bell and from Home attention summaries.

Required notification intents create durable in-system entries containing:

- safe title and summary;
- linked authoritative resource;
- timestamp;
- read/unread;
- action-required indication;
- applicable due time.

Rules:

- Reading or dismissing a notification never changes business state.
- Deadline-bound and action-required items must **also** appear on the Patient Home attention area, so correctness never depends on successful push, SMS, or email delivery.
- Push, SMS, and email remain optional delivery adapters and are not required for Phase 2.

`SCR-PLATFORM-001` is the confirmed attention surface and is no longer an assumption. `Q-PLATFORM-005` and `ASM-PLATFORM-001` are resolved.

## PO-UX-10 — Review appeals

Both sides may be an authorized affected party when applicable:

- the Patient or Guardian who authored the review may appeal a decision that rejects, retires, or unpublishes their review;
- the affected Provider or Clinic may appeal review eligibility or policy-compliance decisions affecting them.

Boundaries:

- An appeal concerns **eligibility, verification, or policy compliance only**.
- An appeal cannot directly edit the rating or review content merely because a party dislikes it.
- The appeal is decided by an independent Review Integrity Reviewer.

`SCR-REVIEWS-004` therefore remains a real Patient surface. `Q-REVIEWS-001` is resolved.

## PO-UX-11 — Guardian grant revocation is never blocked by booking state

A patient-granted guardian or family authorization may be revoked immediately. **No booking state may prevent that revocation.**

- `ERR-BOOKING-002` is removed from `API-IDENTITY-005`.
- No booking-domain error is introduced for this identity action.

Revoking access:

- immediately denies subsequent guardian actions;
- preserves all historical attribution;
- does **not** delete or cancel the patient's existing booking or case;
- may create an operational attention item if continuity of care needs follow-up.

Legal-basis grants are governed separately by `PO-UX-14`. `CONFLICT-BOOKING-001` is resolved.

## PO-UX-12 — Alternative proposal declined or expired

`ALTERNATIVE_PROPOSED` resolves as follows:

| Trigger | Next state | Reason code |
|---|---|---|
| Patient explicitly declines | `CANCELLED` | `ALTERNATIVE_DECLINED` |
| Acceptance deadline expires | `CANCELLED` | `ALTERNATIVE_EXPIRED` |

Both are **unconfirmed booking-request closures**, therefore:

- no Patient cancellation penalty applies;
- the full proposal, decline, and expiry history is preserved;
- late acceptance is rejected;
- Patient-facing meaning is "the appointment was not confirmed", not a punitive cancellation message;
- the next action is to choose another available time or provider and create a new booking request.

`STATE_MACHINES.md`, the booking API and error behavior, the cross-platform contract, and `FLOW-BOOKING-007` are updated. `Q-BOOKING-001` is resolved.

## PO-UX-13 — Existing booking after eligibility suspension

A non-terminal booking state is added:

- `ELIGIBILITY_REVIEW`

When an affected provider, service, or branch becomes `SUSPENDED`, `CONFIRMED` moves to `ELIGIBILITY_REVIEW`.

Rules while `ELIGIBILITY_REVIEW` is active:

- new affected bookings remain blocked;
- the existing reserved slot is preserved temporarily;
- the appointment is **not** considered attendable;
- the Clinic cannot complete or start the visit while the eligibility suspension remains;
- an urgent Admin/Operations work item is created;
- Verification handles factual and credential remediation;
- a Licensed Clinical Reviewer is included when the controlling suspension reason requires clinical judgment;
- Patient and Clinic receive a safe status notification.

Allowed outcomes:

| Condition | Next state | Reason code |
|---|---|---|
| A new authoritative eligibility evaluation becomes `ELIGIBLE` before the review deadline | `CONFIRMED` | — |
| The suspension remains unresolved when the review deadline expires | `CANCELLED` | `PROVIDER_ELIGIBILITY_SUSPENDED` |

That cancellation has no Patient penalty, preserves history, returns the Patient to eligible discovery and rebooking, and **never** automatically transfers the Patient to another provider.

Hard constraints:

- No Admin override may make the booking attendable while the owning eligibility scope remains `SUSPENDED`.
- The review due time must be **no later than two hours before the appointment**. If suspension occurs inside that two-hour window, review becomes immediately due.

`STATE_MACHINES.md`, `CROSS_PLATFORM_BEHAVIOR.md`, the staff contracts, and the affected flows are updated. `Q-BOOKING-002` is resolved.

## PO-UX-14 — Legal-basis guardian and dependent access

Legal-basis representation is confirmed V1 behavior. Two distinct paths exist.

**A. Consent grant.** An adult Patient with capacity grants and revokes scoped access themselves. This is the existing `API-IDENTITY-004` / `API-IDENTITY-005` path governed by `PO-UX-11`.

**B. Legal-basis grant.** Used for a minor, or a Patient who cannot legally or self-consensually establish the grant.

Legal-basis flow:

1. an authenticated guardian starts an Add Dependent / Legal Representation request;
2. identifies the subject Patient or dependent;
3. declares the relationship and legal basis;
4. supplies the required identity and legal evidence;
5. submission enters Admin Verification;
6. authorized Verification/Admin staff accept, request changes, or reject;
7. approval creates a `LEGAL_BASIS` GuardianGrant with explicit patient, grantee, actions, data scope, purpose, effective period, evidence, and approving reviewer.

Rules:

- The guardian **cannot self-authorize** merely by entering a dependent.
- Expiration and revocation follow the legal basis and the authorized Admin workflow.
- Historical guardian actions remain attributed to the guardian.

`Q-IDENTITY-001` is resolved.

## PO-UX-15 — Governed booking reschedule

Rescheduling is confirmed for V1. Generic editing of a confirmed booking is **not** implemented. A governed RescheduleProposal workflow is created instead.

- Either the Patient or an authorized Clinic party may initiate a proposal, subject to policy.
- While the proposal is pending: the original booking stays `CONFIRMED`, the original slot remains the authoritative appointment, and the new slot is **not** silently substituted.
- The counterparty may accept or decline.

On acceptance:

1. revalidate provider, service, and branch eligibility;
2. revalidate new-slot capacity;
3. atomically move the booking to the accepted slot;
4. release the old slot;
5. append reschedule history;
6. notify both parties.

On decline or expiry the reschedule proposal closes and the original confirmed appointment remains unchanged.

No date, provider, or service change occurs without the required acceptance and validation. `Q-BOOKING-003` is resolved.

## PO-UX-16 — Proposed treatment-plan validity

A proposed treatment plan has an `expires_at` controlled by a versioned policy.

- **V1 default: 7 calendar days after proposal.**
- The value must **not** be hard-coded in presentation or business code.

A proposal becomes non-acceptable before `expires_at` if a material governing fact changes, including a relevant plan version, service, price or financial terms, eligibility state, or required policy/snapshot input.

- Expired or stale plans cannot be accepted.
- The clinician must issue a new plan version or proposal.
- Accepted snapshots remain immutable.

`Q-CLINICAL-001` is resolved.

## PO-UX-17 — Evidence transfer interaction contract

Evidence-upload wireframes must **not** be deferred because a storage or scanner vendor has not been selected. The V1 interaction contract is provider-neutral and resumable.

Required user-visible states:

- `SELECTED`
- `UPLOADING`
- `PAUSED`
- `FAILED_RETRYABLE`
- `UPLOADED`
- `VALIDATING_SCANNING`
- `ACCEPTED`
- `REJECTED`

Rules:

- an interrupted upload can resume rather than restart where technically possible;
- finalization validates allowed type, MIME/magic/decode, and size;
- SHA-256 integrity metadata is recorded;
- evidence remains quarantined until required scanning and validation pass;
- failed or rejected files show a safe, actionable reason;
- private evidence is never exposed through a public URL.

Laravel Filesystem may use private local storage now, or approved S3-compatible storage later, without changing this UX contract. The provider-neutral `API-PLATFORM-*` evidence-transfer contract is allocated before Phase 4. The concrete storage and scanner vendor remains an infrastructure decision, not a UX blocker.

`Q-PLATFORM-003` is resolved **for UX purposes**. Its infrastructure-provider selection scope remains open and is retained under `Q-OPS-001`.

## PO-UX-18 — Research limitation is accepted

No user research currently exists. This is an **accepted research limitation**, not an unresolved product decision and not a Phase 2 blocker.

- Proceed with the confirmed usage contexts in `PO-UX-07`.
- Usability testing remains a recommended validation activity, not a prerequisite.

`Q-PLATFORM-007` is resolved as accepted.

## Reconciliation obligations

This decision requires updates to:

1. `docs/domain/STATE_MACHINES.md` — work-item machine, booking alternative closure, `ELIGIBILITY_REVIEW`, reschedule proposal, plan expiry;
2. `docs/domain/PERMISSIONS_MATRIX.md` — legal-basis grant, reschedule proposal, patient review appeal, eligibility-review actions;
3. `docs/domain/CROSS_PLATFORM_BEHAVIOR.md` — existing-booking safety rule, booking modification rule, work-item states, notification durability, open dependencies;
4. `docs/api/API_CONTRACTS.md` — `API-IDENTITY-005` error removal, and the legal-basis, reschedule, notification, and evidence-transfer contracts;
5. `docs/api/ERROR_CATALOG.md` — `ERR-BOOKING-002` and `ERR-BOOKING-003` reconciliation, plan staleness, appeal authority, evidence rejection;
6. `docs/domain/STAFF_INTERACTION_CONTRACTS.md` — `SDC-OPS-001` states plus the new staff workspaces;
7. `docs/PRD.md` and `docs/TRACEABILITY_MATRIX.md` — where requirement behavior changed;
8. `docs/ux/01-foundation/*` and `docs/ux/PHASE_01_HANDOFF.md` — actor context, screens, flows, gaps, handoff.

The UX chain stops at the updated Phase 1 gate. Phase 2 wireframes do not begin under this decision.
