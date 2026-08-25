# UberTib Product Requirements Document

**Phase:** 1 — Foundation  
**Operating mode:** Existing Repository  
**Baseline date:** 2026-08-23  
**Requirement registry:** `docs/README.md`  
**Status:** Canonical product/business baseline for the engineering-documentation pipeline

## 1. Purpose and Source Boundary

UberTib is a technical and operational intermediary for coordinating dental services and building operational trust between patients, dentists, and clinics. The V1 operating scope is Aleppo, Syria, with dental services in the G01–G04 groups that have passed the required medical and operational readiness gates. The platform is not a medical provider, diagnostic authority, insurer, bank, wallet, escrow service, or funds custodian.

**Primary source:** `Docs/UberTib_SRS_Etkan_v1.1.pdf`. The PDF exists in the repository but its full readable text was not returned by the available GitHub connector. Therefore `Q-PLATFORM-001` remains a Blocker for claiming complete end-to-end SRS reconciliation. This PRD preserves the approved SRS aliases and requirement statements carried by the approved `.spec/` baseline and does not claim that lower-priority sources supersede the SRS.

**Source priority:** `.spec/decisions/` → authoritative SRS v1.1 → approved `.spec/` requirements/traceability → verified repository behavior → `UberTip-Backend/specs/` → other documents → marked engineering inference.

Canonical `FR-*` and `NFR-*` IDs are defined in `docs/README.md`. Existing dotted and SRS IDs remain permanent aliases. No standalone canonical `BR-*` IDs are allocated in this phase: the approved business principles are preserved below as source aliases `BP-01`–`BP-14` rather than being silently reclassified before full SRS reconciliation.

## 2. Product Goals

1. Ensure patients are offered only provider-service-branch combinations that are currently eligible for the requested service.
2. Keep `S`, `P`, `H`, `R`, and `I` distinct, computed or derived from governed facts and policies rather than manually entered outcomes.
3. Provide an auditable journey from service discovery and booking through treatment, evidence, follow-up, review, and issue handling.
4. Preserve immutable accepted treatment/financial terms and append-only financial and audit histories.
5. Record money activity performed outside UberTib without performing any money movement in V1.
6. Keep diagnosis, treatment planning, sensitive medical decisions, and other high-impact decisions under authorized human professional control.
7. Support Arabic-first, RTL, accessible journeys resilient to weak/intermittent connectivity.
8. Gate production activation on current medical, legal, operational, and technical readiness.

## 3. Actors and Stakeholders

| Actor / stakeholder | Product responsibility or interest |
|---|---|
| Product Owner / UberTib management | Scope, policy, launch readiness, sustainability, risk control |
| Patient | Discover eligible care, book, accept treatment/financial terms, follow treatment, review, raise issues |
| Guardian / family representative | Explicitly scoped representation of another patient where authorized |
| Dentist | Service activation facts/evidence, booking response, treatment plan, treatment-stage evidence |
| Authorized clinic staff | Branch appointments, attendance, externally performed financial facts, permitted documentation |
| Verification staff | Verify identity, licenses, credentials, facilities, equipment, and evidence facts; not computed outcomes |
| Medical reviewer | Medical/service readiness, evidence quality, sensitive medical review |
| Integrity/review staff | Verified-review integrity and appeal handling |
| Claims/dispute staff | Complaints, disputes, claims, evidence, deadlines, decisions |
| Finance staff | Confirm/dispute and operationally review external financial events; never move funds |
| Policy owner | Versioned policy lifecycle and governed activation |
| Administrator / operations | Users, permissions, queues, monitoring, operational exceptions |
| Auditor / authorized reviewer | Trace sensitive actions and reproduce historical decisions within scope |
| External regulators / licensing sources | External facts and binding compliance constraints |

## 4. Scope

### 4.1 In Scope for V1

- Aleppo only.
- Approved dental services within G01–G04.
- Patient, guardian, dentist, clinic/staff identity and verification behaviors established by the requirements.
- Provider/branch/service facts, evidence, eligibility, classification, search, comparison, booking, rescheduling, cancellation, attendance/no-show.
- Treatment plans, accepted terms, stages, evidence, follow-up, completion, and unified case history.
- Provider-entered actual prices with automatic internal `P`; automatic `H` and internal `I` according to versioned policies.
- External financial-event recording, confirmation/dispute, refund/compensation decision tracking, and external-execution confirmation.
- Verified reviews, complaints, disputes, protection claims, appeals, work queues, permissions, audit, and operational reporting.
- Arabic-first, RTL, accessibility, weak-connectivity resilience, policy versioning, and launch governance.

### 4.2 Explicitly Out of Scope for V1

- Stripe or any payment gateway integration.
- Electronic collection, authorization, capture, custody, escrow, wallet, transfer, payout, settlement, or automated refund of money.
- UberTib-held balances or withdrawable wallet funds.
- Cities outside Aleppo and medical specialties outside the approved dental scope.
- Orthodontics, unless a later authoritative scope decision changes this.
- Medical insurance or representing protection as insurance.
- Telemedicine/video consultation.
- AI-generated diagnosis, prescription, or treatment plan.
- Fully automated final sensitive medical, punitive, or high-impact compensation decisions.
- Paid ranking, advertising-driven ordering, referrals, loyalty, coupons, and advanced promotions.
- UX layout, navigation, wireframes, component design, and screen allocation; these belong to the dedicated UX pipeline.

## 5. Binding Business Principles — Source Aliases

| Source ID | Principle |
|---|---|
| BP-01 | Users provide facts; the system derives governed outcomes. |
| BP-02 | Eligibility is contextual to provider, service/domain, branch, and effective period; there is no universal doctor score. |
| BP-03 | `S`, `P`, `H`, `R`, and `I` remain separate concepts. |
| BP-04 | Staff may verify/correct facts through governed workflows but may not directly edit computed outcomes. |
| BP-05 | `PENDING_EVALUATION` is distinct from grade `F`; there is no grade `E`. |
| BP-06 | UberTib V1 performs no money movement. |
| BP-07 | Financial management records external activity; recording a state does not execute money movement. |
| BP-08 | Accepted historical terms and governing policy are immutable; amendments create new versions. |
| BP-09 | Diagnosis, treatment plans, and sensitive medical decisions remain with authorized humans. |
| BP-10 | No final automated fraud accusation, sensitive suspension/downgrade, or high-impact compensation decision without documented human review. |
| BP-11 | Patient-facing experiences show practical meaning before internal symbols/formulas. |
| BP-12 | A case should have a unified timeline spanning booking, agreement, external financial records, treatment, follow-up, review, and issues. |
| BP-13 | Operations are managed through responsibility/priority/deadline queues and exceptions. |
| BP-14 | Future payment integration may be architecturally possible only without changing the meaning of historical V1 record-only events; it is not V1 scope. |

## 6. Named Product Journeys

The engineering PRD names journeys but does not define navigation or screen flow. The UX pipeline owns IA, navigation, and detailed user flows.

1. Patient identity/contact verification and governed representation.
2. Understandable service discovery and eligible-provider search.
3. Dentist service activation request, evidence review, and eligibility computation.
4. Provider selection, booking request, provider response, revalidation, cancellation/no-show.
5. Treatment plan creation, patient acceptance, and immutable accepted terms.
6. Treatment stages, evidence, follow-up, completion, and case timeline.
7. External payment/refund reporting, confirmation/dispute, and financial timeline.
8. Verified review submission and review appeal.
9. Refund request/protection claim, evidence/deadline review, decision, appeal, and external execution follow-up.
10. Operational queue handling, policy/version governance, launch readiness, audit, and historical reproduction.

## 7. Functional Requirements

### 7.1 ELIG — Eligibility and Classification

### FR-ELIG-001 — Eligible Provider Search
**Source:** `.spec/functional-requirements/FR.01.1.1-eligible-provider-search.md` · aliases `FR.01.1.1`, SRS `FR-003`  
**Status:** Confirmed  
**Description:** Search doctors and branches by service, Aleppo area, and appointment time while returning only currently eligible provider-service-branch combinations.  
**Actors:** Patient; system.  
**Preconditions / Inputs:** Requested service plus configured area/availability criteria; current provider/service/branch eligibility.  
**Screens:** Deferred to UX pipeline; no `SCR-*` allocated by this engineering run.  
**Business Principles:** BP-02.  
**Acceptance Criteria:**
- Given a provider-service-branch result, when it is returned, then all mandatory service, branch, facility, and regulatory gates are current and passing.
- Given any mandatory gate fails, when search results are built, then that combination is absent from bookable results and the reason remains available to authorized review.

### FR-ELIG-002 — Automatic Service Eligibility
**Source:** `.spec/functional-requirements/FR.01.2.1-automatic-service-eligibility.md` · aliases `FR.01.2.1`, SRS `FR-011`  
**Status:** Confirmed  
**Description:** Determine a dentist's eligibility for a specific service, branch, and policy period from approved facts and the effective versioned S/P/H/I policy without permitting direct entry of the final result.  
**Actors:** System; authorized fact reviewers.  
**Preconditions / Inputs:** Approved facts, exact doctor/service/branch scope, effective policy.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-01, BP-02, BP-04.  
**Acceptance Criteria:**
- Given complete approved inputs, when eligibility is evaluated, then the decision stores policy version, facts, component outcomes, final result, reasons, and evaluation time.
- Given any user/admin workflow, when it attempts to directly set the final computed result, then the operation is unavailable or rejected.

### FR-ELIG-003 — Automatic Service Suspension
**Source:** `.spec/functional-requirements/FR.01.2.2-automatic-service-suspension.md` · aliases `FR.01.2.2`, SRS `FR-030`  
**Status:** Confirmed  
**Description:** Suspend affected service/branch eligibility when a required credential, approved fact, policy condition, or evidence item becomes invalid, expired, revoked, or unavailable.  
**Actors:** System; operations reviewers.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-02, BP-04.  
**Acceptance Criteria:**
- Given an invalid dependency, when suspension becomes effective, then only dependent provider-service-branch scopes are suspended and new bookings are blocked.
- Given existing bookings in the affected scope, when suspension occurs, then each affected `CONFIRMED` booking moves to the non-terminal `ELIGIBILITY_REVIEW` state, keeps its reserved slot, is not attendable, and creates an urgent operational work item rather than being silently rewritten.
- Given the owning eligibility scope is still `SUSPENDED`, then no override of any role can make the booking attendable, and the review is due no later than two hours before the appointment.

### FR-ELIG-004 — Eligibility Recalculation
**Source:** `.spec/functional-requirements/FR.01.2.3-eligibility-recalculation.md` · aliases `FR.01.2.3`, SRS `FR-031`  
**Status:** Confirmed  
**Description:** Recalculate affected eligibility after influential facts, evidence status, service rules, branch relationships, or policy versions change.  
**Actors:** System.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-01, BP-02, BP-08.  
**Acceptance Criteria:**
- Given an influential change, when dependencies are resolved, then only affected scopes are reevaluated.
- Given a new evaluation, when committed, then it creates a new decision record and preserves prior decisions; material changes create the configured operational review/notification work.

### FR-ELIG-005 — Final Eligibility from the Most Restrictive Gate
**Source:** `.spec/functional-requirements/FR.01.2.4-most-restrictive-eligibility-gate.md` · aliases `FR.01.2.4`, SRS `FR-038`  
**Status:** Confirmed  
**Description:** Derive final eligibility from the most restrictive applicable regulatory, credential, service, branch, scientific, price, protection, evidence, and launch-readiness gate.  
**Actors:** System.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-02, BP-03.  
**Acceptance Criteria:**
- Given all applicable gates, when evaluated, then each yields a machine-readable state/reason and a failing or pending mandatory gate cannot be overridden by a favorable component score.
- Given a final decision, then the controlling gate and all evaluated gate outcomes are retained.

### FR-ELIG-006 — Periodic and Event-Driven Reevaluation
**Source:** `.spec/functional-requirements/FR.01.2.5-periodic-and-event-reevaluation.md` · aliases `FR.01.2.5`, SRS `FR-039`  
**Status:** Confirmed  
**Description:** Reevaluate provider-service-branch eligibility on configured schedules, on material domain events, and immediately before booking confirmation.  
**Actors:** System.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-02, BP-08.  
**Acceptance Criteria:**
- Given effective policy, when reevaluation scheduling is resolved, then the interval, trigger events, and freshness window come from the versioned policy.
- Given a failed/delayed background reevaluation, then it enters observable retry/exception handling and is not treated as successful.

### FR-ELIG-007 — Service Activation Request and Evidence
**Source:** `.spec/functional-requirements/FR.02.1.1-service-activation-evidence.md` · aliases `FR.02.1.1`, SRS `FR-010`  
**Status:** Confirmed  
**Description:** Allow a dentist to request activation of one service at one branch by answering the versioned service questionnaire and providing required evidence.  
**Actors:** Dentist; verification/review staff.  
**Screens:** Deferred to UX pipeline; no `SCR-*` allocated by this engineering run.  
**Business Principles:** BP-01, BP-04.  
**Acceptance Criteria:**
- Given an activation request, then it is bound to one dentist, one service-definition version, and one branch.
- Given the request interface, then it captures facts/evidence only and exposes no control for directly choosing A/B/C/D/F, P, H, or I; invalid/missing evidence returns reasoned correction/review needs.

### FR-ELIG-008 — Pending Evaluation on Insufficient Evidence
**Source:** `.spec/functional-requirements/FR.02.2.1-pending-evaluation-insufficient-evidence.md` · aliases `FR.02.2.1`, SRS `FR-012`  
**Status:** Confirmed  
**Description:** Use `PENDING_EVALUATION` when mandatory facts/evidence are insufficient and keep it distinct from grade `F`.  
**Actors:** System; dentist/reviewer as consumers of the result.  
**Screens:** Deferred to UX pipeline for result/error-state presentation.  
**Business Principles:** BP-05.  
**Acceptance Criteria:**
- Given a missing/expired mandatory input, when evaluation runs, then the result is `PENDING_EVALUATION`, not a scientific grade, and all blockers are actionable.
- Given missing inputs are later approved, then a new evaluation occurs without rewriting the earlier decision.

### FR-ELIG-009 — Actual Price Recording and Internal P
**Source:** `.spec/functional-requirements/FR.02.2.2-actual-price-and-internal-p.md` · aliases `FR.02.2.2`, SRS `FR-013`  
**Status:** Confirmed  
**Description:** Record provider prices as source facts and compute internal `P` from the effective versioned price-band policy without exposing `P` as a scientific quality grade.  
**Actors:** Dentist/clinic source; system; patient as consumer of practical price information.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-01, BP-03, BP-11.  
**Acceptance Criteria:**
- Given a price fact, then it retains service, source, branch, currency, amount, effective period, and provenance.
- Given `P` is computed, then it references the exact policy/source fact; patient-facing output presents expected price/range rather than `P` as a quality grade.

### FR-ELIG-010 — Automatic Protection Selection
**Source:** `.spec/functional-requirements/FR.02.2.3-automatic-protection-selection.md` · aliases `FR.02.2.3`, SRS `FR-014`  
**Status:** Confirmed  
**Description:** Select the applicable protection level from effective policy and eligibility context; funded monetary protection remains disabled unless separately approved.  
**Actors:** System; authorized reviewers; case parties as consumers.  
**Screens:** Deferred to UX pipeline for practical protection explanation.  
**Business Principles:** BP-03, BP-06, BP-07.  
**Acceptance Criteria:**
- Given a protection decision, then it is scoped to service/provider/branch/policy/time and records machine-readable plus understandable reasons.
- Given funded protection is disabled, then no workflow promises reimbursement, escrow, insurance, or platform-funded protection.

### FR-ELIG-011 — S Score and Snapshot
**Source:** `.spec/functional-requirements/FR.02.2.4-s-score-and-snapshot.md` · aliases `FR.02.2.4`, SRS `FR-036`  
**Status:** Confirmed with production governance dependency `Q-ELIG-001`.  
**Description:** Compute service-specific scientific `S` from versioned, clinically approved weighted criteria and persist an immutable calculation snapshot.  
**Actors:** System; licensed medical reviewers govern production criteria.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-01, BP-03, BP-08, BP-09.  
**Acceptance Criteria:**
- Given an evaluable service, then only clinically approved active criteria/weights for the exact domain and policy period participate.
- Given a stored decision, then the calculation is deterministically reproducible; formula/weight change creates a new policy version and does not mutate old results.

### FR-ELIG-012 — Confidence K/EU and Grade Cap
**Source:** `.spec/functional-requirements/FR.02.2.5-confidence-and-grade-cap.md` · aliases `FR.02.2.5`, SRS `FR-037`  
**Status:** Confirmed with production governance dependency `Q-ELIG-001`.  
**Description:** Compute `K` and `EU` from evidence coverage/verification and apply the effective confidence-based grade cap.  
**Actors:** System; authorized reviewers.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-01, BP-05, BP-08.  
**Acceptance Criteria:**
- Given a decision, then confidence inputs/provenance are captured in its immutable snapshot.
- Given mandatory evidence is insufficient, then the outcome is `PENDING_EVALUATION`; otherwise authorized reviewers can see uncapped result and applied-cap reason.

### FR-ELIG-013 — Grade Bands and F Separation
**Source:** `.spec/functional-requirements/FR.02.2.6-grade-bands-and-f-separation.md` · aliases `FR.02.2.6`, SRS `FR-040`  
**Status:** Confirmed with production governance dependency `Q-ELIG-001`.  
**Description:** Map evaluable `S` results to versioned grade bands and keep `F` separate from `PENDING_EVALUATION`.  
**Actors:** System; medical policy reviewers.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-05.  
**Acceptance Criteria:**
- Given an active service policy, then evaluable S results map to complete, non-overlapping bands.
- Given insufficient evidence, then `F` is not produced; `F` is reserved for an evaluable approved band or explicit clinically approved disqualifying rule.

### FR-ELIG-014 — Automatic P from Versioned Price Bands
**Source:** `.spec/functional-requirements/FR.02.2.7-automatic-p-versioned-price-bands.md` · aliases `FR.02.2.7`, SRS `FR-041`  
**Status:** Confirmed.  
**Description:** Compute `P` by comparing the applicable actual-price fact with versioned service-specific price bands and retain the calculation snapshot.  
**Actors:** System.  
**Screens:** None (background/system behavior).  
**Business Principles:** BP-01, BP-03, BP-08.  
**Acceptance Criteria:**
- Given price bands, then service, market/locality scope, currency, effective period, provenance, and version are defined.
- Given a currency/scope mismatch, then calculation is prevented with an explicit reason; successful calculation snapshots preserve price, comparison value if any, band, result, and policy version.

### FR-ELIG-015 — Automatic H and I
**Source:** `.spec/functional-requirements/FR.02.2.8-automatic-h-and-i.md` · aliases `FR.02.2.8`, SRS `FR-042`  
**Status:** Confirmed with production governance dependency `Q-ELIG-001`.  
**Description:** Compute protection component `H` and internal operational indicator `I` from versioned rules; `I` remains internal and neither outcome is directly entered by users.  
**Actors:** System; authorized internal roles.  
**Screens:** None (background/system behavior); UX may surface practical `H` meaning but not raw `I`.  
**Business Principles:** BP-01, BP-03, BP-04.  
**Acceptance Criteria:**
- Given `H`, then it records the applicable rule and never implies funded protection when that policy is disabled.
- Given `I`, then raw/internal values are limited to authorized internal roles; users may correct facts but cannot directly enter H/I outcomes.

### FR-ELIG-016 — Provider Decision Card
**Source:** `.spec/functional-requirements/FR.03.1.1-provider-decision-card.md` · aliases `FR.03.1.1`, SRS `FR-004`  
**Status:** Confirmed.  
**Description:** Provide a practical service-specific provider summary including eligibility, actual/expected price, funded-protection availability, verified-experience rating, branch, and nearest appointment.  
**Actors:** Patient.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-02, BP-03, BP-11.  
**Acceptance Criteria:**
- Given a provider card, then it is scoped to one doctor/service/branch and does not present a universal doctor score.
- Given funded protection is disabled, then no protected amount/promise appears; raw `I` is never exposed as a patient rating.

### FR-ELIG-017 — Eligibility Explanation
**Source:** `.spec/functional-requirements/FR.03.1.2-eligibility-explanation.md` · aliases `FR.03.1.2`, SRS `FR-005`  
**Status:** Confirmed.  
**Description:** Provide on-demand, patient-appropriate explanation of eligibility for the selected service/branch including last assessment date and practical reason summary.  
**Actors:** Patient.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-05, BP-11.  
**Acceptance Criteria:**
- Given an explanation, then it identifies exact service/branch, effective assessment date, and practical reasons without confidential evidence/raw `I`.
- Given `PENDING_EVALUATION`, then the explanation describes insufficient evidence and never presents it as `F`.

### 7.2 BOOKING — Booking Lifecycle

### FR-BOOKING-001 — Booking Request and Revalidation
**Source:** `.spec/functional-requirements/FR.04.1.1-booking-request-revalidation.md` · aliases `FR.04.1.1`, SRS `FR-006`  
**Status:** Confirmed.  
**Description:** Accept a booking request only after revalidating provider-service-branch eligibility and slot capacity, and revalidate again before confirmation.  
**Actors:** Patient; system; provider.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-02.  
**Acceptance Criteria:**
- Given eligibility/readiness/publication/capacity is no longer valid, when a request or confirmation is attempted, then it is rejected.
- Given concurrent requests, then confirmed bookings never exceed configured slot capacity and retries obey idempotency rules.

### FR-BOOKING-002 — Cancellation and No-Show
**Source:** `.spec/functional-requirements/FR.04.1.2-cancellation-and-no-show.md` · aliases `FR.04.1.2`, SRS `FR-033`  
**Status:** Confirmed.  
**Description:** Handle cancellation and no-show using versioned deadlines, reasons, actor permissions, and downstream case actions.  
**Actors:** Patient; provider/clinic; authorized operations staff.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-07, BP-08.  
**Acceptance Criteria:**
- Given cancellation, then actor authorization, initiator, reason, time, previous state, and policy snapshot are recorded.
- Given no-show, then it is permitted only after the policy threshold; any downstream financial/review/operational consequence is derived transparently and never moves money or rewrites history.

### FR-BOOKING-003 — Provider Booking Response
**Source:** `.spec/functional-requirements/FR.04.2.1-provider-booking-response.md` · aliases `FR.04.2.1`, SRS `FR-007`  
**Status:** Confirmed.  
**Description:** Allow an authorized provider representative to accept, reject with reason, or propose an alternative within the response deadline.  
**Actors:** Authorized provider representative; patient for alternative acceptance.  
**Screens:** Deferred to UX pipeline.  
**Acceptance Criteria:**
- Given a provider response, then actor, branch, prior/resulting state, reason, and time are recorded.
- Given 12 hours have elapsed or the appointment is within two hours, whichever is earlier, then the response/proposal deadline has expired; an alternative requires patient acceptance before confirmation.
- Given the patient declines an alternative or its acceptance deadline expires, then the booking closes as `CANCELLED` with reason `ALTERNATIVE_DECLINED` or `ALTERNATIVE_EXPIRED`, no patient penalty applies, the proposal history is preserved, a late acceptance is rejected, and the patient is offered a new booking request rather than a punitive cancellation message.


### FR-BOOKING-004 — Governed Booking Reschedule
**Source:** decision `PO-2026-08-25-ux-phase1-reconciliation` `PO-UX-15`; resolves `Q-BOOKING-003`  
**Status:** Confirmed.  
**Description:** Allow either the patient side or an authorized clinic party to propose moving a confirmed appointment to a different slot, through a governed proposal the counterparty must accept, instead of a generic edit of the booking.  
**Actors:** Patient/authorized guardian; authorized clinic party; system.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-04, BP-13.  
**Acceptance Criteria:**
- Given a pending reschedule proposal, then the original booking remains `CONFIRMED` and the original slot remains the authoritative appointment; the proposed slot is never silently substituted.
- Given acceptance by the counterparty, then provider/service/branch eligibility and new-slot capacity are revalidated, the booking moves to the accepted slot atomically, the old slot is released, reschedule history is appended, and both parties are notified.
- Given a decline, an expiry, or a withdrawal, then the proposal closes and the original confirmed appointment is unchanged.
- Given any attempt to change date, provider, or service without the required acceptance and successful revalidation, then the change is rejected.

### 7.3 CLINICAL — Treatment and Case Progress

### FR-CLINICAL-001 — Treatment Plan with Stages and Price
**Source:** `.spec/functional-requirements/FR.05.1.1-treatment-plan-stages-price.md` · aliases `FR.05.1.1`, SRS `FR-008`  
**Status:** Confirmed.  
**Description:** Allow the treating dentist to create the clinician's treatment proposal containing service, clinical stages, stage prices, inclusions, exclusions, and applicable terms.  
**Actors:** Authorized treating clinician; patient as recipient/acceptor.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-09.  
**Acceptance Criteria:**
- Given treatment planning, then only an authorized treating clinician authors clinical stages and the system identifies the plan as the clinician's proposal, not autonomous platform diagnosis.
- Given required service/stage/price/policy information is missing, then the plan cannot be accepted.
- Given a proposed plan, then it carries a policy-governed `expires_at` whose V1 default is 7 calendar days after proposal, and that value is versioned policy data rather than a hard-coded constant.
- Given a material governing fact changes before expiry — the relevant plan version, service, price or financial terms, eligibility state, or a required policy/snapshot input — then the proposal is no longer acceptable and the clinician must issue a new version; an already-accepted snapshot is never invalidated by a later expiry.

### FR-CLINICAL-002 — Accepted Terms Snapshot
**Source:** `.spec/functional-requirements/FR.05.2.1-accepted-terms-snapshot.md` · aliases `FR.05.2.1`, SRS `FR-009`  
**Status:** Confirmed.  
**Description:** Create an immutable snapshot of treatment and financial terms when the patient accepts a plan.  
**Actors:** Patient; treating clinician/provider; system.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-08.  
**Acceptance Criteria:**
- Given acceptance, then plan version, parties, service, branch, price, stages, cancellation/refund terms, protection state, and policy version are frozen in the snapshot.
- Given later policy/catalog/amendment change, then the old snapshot remains unchanged and any amendment creates a new accepted version.

### FR-CLINICAL-003 — Treatment Stage Evidence
**Source:** `.spec/functional-requirements/FR.07.1.1-treatment-stage-evidence.md` · aliases `FR.07.1.1`, SRS `FR-023`  
**Status:** Confirmed.  
**Description:** Require configured evidence and clinical-stage facts before an authorized dentist can mark a stage/case complete.  
**Actors:** Treating dentist; patient/reviewer as authorized consumers.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-08, BP-09.  
**Acceptance Criteria:**
- Given completion is requested, then mandatory requirements are resolved from the accepted service/policy snapshot and completion is rejected while mandatory stage/field/acknowledgment/evidence is absent or invalid.
- Given completion or reopening, then actor, time, reason, and evaluated evidence set are recorded.

### FR-CLINICAL-004 — Follow-Up Reminders
**Source:** `.spec/functional-requirements/FR.07.2.1-follow-up-reminders.md` · aliases `FR.07.2.1`, SRS `FR-024`  
**Status:** Confirmed.  
**Description:** Schedule and communicate follow-up reminders derived from the accepted treatment plan and effective communication policy.  
**Actors:** Patient; dentist/clinic; system.  
**Screens:** Deferred to UX pipeline for reminder visibility; scheduling/delivery is system behavior.  
**Acceptance Criteria:**
- Given a reminder, then case, participant, purpose, due time, and delivery state are identifiable.
- Given reschedule/cancel/failure, then prior history/reason is retained and failed delivery enters retry/exception handling without duplicating the follow-up.

### FR-CLINICAL-005 — Unified Patient Case Timeline
**Source:** `.spec/functional-requirements/FR.07.2.2-unified-patient-case-timeline.md` · aliases `FR.07.2.2`, SRS `FR-034`  
**Status:** Confirmed.  
**Description:** Present an authorized unified case timeline for booking, accepted terms, treatment stages, evidence, follow-ups, reviews, issues, and external financial records.  
**Actors:** Patient; dentist/clinic; authorized reviewers/operations.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-12.  
**Acceptance Criteria:**
- Given timeline events, then they are consistently ordered, source-attributed, and linked to governing snapshots/decisions where applicable.
- Given corrections/reversals, then they appear as later events and never erase history; role-based field visibility is enforced.

### 7.4 FINANCE — External Financial Records Only

### FR-FINANCE-001 — Financial Terms Snapshot on Acceptance or Amendment
**Source:** `.spec/functional-requirements/FR.05.2.2-financial-snapshot-acceptance-amendment.md` · aliases `FR.05.2.2`, SRS `FR-043`  
**Status:** Confirmed.  
**Description:** Create an immutable `FinancialTermsSnapshot` whenever terms are mutually accepted and whenever an amendment is accepted.  
**Actors:** Patient; provider; system.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-08.  
**Acceptance Criteria:**
- Given a snapshot, then it includes service, stages, price, currency, due structure, cancellation/refund rules, protection terms, and governing policy versions.
- Given an accepted amendment, then a new linked snapshot is created and the prior snapshot remains immutable and governs earlier events.

### FR-FINANCE-002 — External Payment Reporting
**Source:** `.spec/functional-requirements/FR.06.1.1-external-payment-reporting.md` · aliases `FR.06.1.1`, SRS `FR-015`  
**Status:** Confirmed.  
**Description:** Allow an authorized party to report a payment performed outside UberTib against a case and immutable terms snapshot.  
**Actors:** Patient; authorized clinic/provider party; finance reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-06, BP-07.  
**Acceptance Criteria:**
- Given a report, then case, snapshot, amount, currency, external-method category, payer assertion, occurrence time, and required evidence are recorded as an unconfirmed financial event.
- Given duplicate submission with the same idempotency key, then the original result is returned and no duplicate event is created; UberTib never initiates/settles the money.

### FR-FINANCE-003 — Payment Confirmation or Dispute
**Source:** `.spec/functional-requirements/FR.06.1.2-payment-confirmation-or-dispute.md` · aliases `FR.06.1.2`, SRS `FR-016`  
**Status:** Confirmed.  
**Description:** Allow the authorized counterparty to confirm or dispute an externally reported payment while preserving every assertion as append-only history.  
**Actors:** Authorized counterparty; scoped finance reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-07.  
**Acceptance Criteria:**
- Given confirm/dispute action, then only an authorized counterparty or finance reviewer can submit it; disputes record reason, actor, time, and optional evidence without altering the original report.
- Given the event history, then derived financial state is reproducible from ordered append-only events.

### FR-FINANCE-004 — External Refund Execution Confirmation
**Source:** `.spec/functional-requirements/FR.06.1.3-external-refund-confirmation.md` · aliases `FR.06.1.3`, SRS `FR-019`  
**Status:** Confirmed.  
**Description:** Record execution of an approved refund outside the platform and require confirmation/dispute before treating it as confirmed.  
**Actors:** Authorized external executor/reporting party; counterparty; finance reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-06, BP-07.  
**Acceptance Criteria:**
- Given an execution report, then it references the refund decision, case, amount/currency, executor assertion, occurrence time, and evidence.
- Given correction, then compensating events are used and the original report is never edited/deleted.

### FR-FINANCE-005 — Append-Only Financial Events
**Source:** `.spec/functional-requirements/FR.06.1.4-append-only-financial-events.md` · aliases `FR.06.1.4`, SRS `FR-044`  
**Status:** Confirmed.  
**Description:** Represent external payment, refund, compensation, dispute, confirmation, reversal, and correction as append-only financial events.  
**Actors:** System; authorized case/finance actors.  
**Screens:** None (background/system integrity behavior); event history is consumed by other user-visible requirements.  
**Business Principles:** BP-07, BP-08.  
**Acceptance Criteria:**
- Given an accepted financial event, then business workflows cannot update/delete it.
- Given a correction, then it references the prior event and derived totals/statuses remain reproducible from immutable terms plus ordered events.

### FR-FINANCE-006 — Financial Case Timeline
**Source:** `.spec/functional-requirements/FR.06.2.1-financial-case-timeline.md` · aliases `FR.06.2.1`, SRS `FR-017`  
**Status:** Confirmed.  
**Description:** Present an authorized case-scoped financial timeline that distinguishes agreed, reported, confirmed, disputed, refunded, and pending-external-execution amounts.  
**Actors:** Patient; provider/clinic; finance/operations staff.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-07, BP-12.  
**Acceptance Criteria:**
- Given an amount/status, then it is derived from immutable terms plus append-only events and assertions are visibly distinct from confirmed/resolved facts.
- Given an actor, then only permitted cases and financial fields are visible according to role/organization/case relationship.

### FR-FINANCE-007 — Explicit External Money Boundary
**Source:** `.spec/functional-requirements/FR.06.2.2-explicit-external-money-boundary.md` · aliases `FR.06.2.2`, SRS `FR-047`, `PO-2026-08-23`  
**Status:** Confirmed.  
**Description:** UberTib V1 is a financial-management record system only; it has no gateway, wallet, escrow, card/bank credential storage, automated settlement, or custody of funds.  
**Actors:** All actors; system.  
**Screens:** None (cross-cutting system boundary); all UX copy must respect the boundary.  
**Business Principles:** BP-06, BP-07, BP-14.  
**Acceptance Criteria:**
- Given any API/UI/job/integration, then it cannot initiate, authorize, capture, hold, transfer, or settle money.
- Given an approved amount awaiting human action, then it remains explicitly pending external execution until reported and confirmed.

### 7.5 REVIEWS — Verified Experience Reviews

### FR-REVIEWS-001 — Single Verified Review
**Source:** `.spec/functional-requirements/FR.08.1.1-single-verified-review.md` · aliases `FR.08.1.1`, SRS `FR-025`  
**Status:** Confirmed.  
**Description:** Permit one review per eligible verified completed patient experience within the effective review window.  
**Actors:** Patient or active authorized guardian.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-03.  
**Acceptance Criteria:**
- Given a review, then the author is the linked patient or valid guardian, completion is verified, and a second active review for the same experience is rejected.
- Given the rating `R`, then its verified-experience link is retained and `R` never substitutes for S/P/H/I classification.

### FR-REVIEWS-002 — Review Appeal
**Source:** `.spec/functional-requirements/FR.08.2.1-review-appeal.md` · aliases `FR.08.2.1`, SRS `FR-026`  
**Status:** Confirmed.  
**Description:** Allow an authorized affected party to appeal review eligibility or policy compliance without directly changing rating content.  
**Actors:** Authorized affected party; integrity reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-03, BP-10.  
**Acceptance Criteria:**
- Given an appeal, then appellant, review, policy-grounded reason, evidence, and submission time are recorded.
- Given a publication-state decision, then an authorized integrity decision with findings/reason is required and the review rating cannot feed S/P/H/I or modify scientific eligibility.
- Given a decision that rejects, retires, or unpublishes a review, then the authoring patient or guardian is an authorized affected party who may appeal it.
- Given a review eligibility or policy-compliance decision affecting a provider, then that provider or clinic is an authorized affected party who may appeal it.
- Given any appeal, then it concerns eligibility, verification, or policy compliance only, is decided by an independent Review Integrity Reviewer, and can never directly edit the rating or review content.

### 7.6 CLAIMS — Refunds, Protection Claims, Sensitive Review

### FR-CLAIMS-001 — Refund Request
**Source:** `.spec/functional-requirements/FR.09.1.1-refund-request.md` · aliases `FR.09.1.1`, SRS `FR-018`  
**Status:** Confirmed.  
**Description:** Allow an authorized case party to request a refund related to a booking/treatment case and route it for operational review and external execution.  
**Actors:** Authorized case party; claims/finance/operations reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-06, BP-07.  
**Acceptance Criteria:**
- Given a request, then case, amount/currency, reason, claimant, occurrence context, evidence, time, governing terms, and deadline policy are validated/recorded.
- Given approval, then an amount due for external execution is recorded; UberTib does not move money.

### FR-CLAIMS-002 — Protection Claim Submission
**Source:** `.spec/functional-requirements/FR.09.1.2-protection-claim-submission.md` · aliases `FR.09.1.2`, SRS `FR-020`  
**Status:** Confirmed.  
**Description:** Allow an eligible case party to submit a protection claim only when the immutable accepted terms contain an applicable active protection policy.  
**Actors:** Eligible case party; claims reviewers.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-07, BP-08.  
**Acceptance Criteria:**
- Given no applicable entitlement in the accepted snapshot, then claim submission is rejected.
- Given eligible submission, then type, requested remedy, narrative, evidence, claimant, case, policy version, and time are recorded; submission never promises/executes a monetary outcome.

### FR-CLAIMS-003 — Claim Evidence and Deadlines
**Source:** `.spec/functional-requirements/FR.09.2.1-claim-evidence-and-deadlines.md` · aliases `FR.09.2.1`, SRS `FR-021`  
**Status:** Confirmed.  
**Description:** Validate protection-claim evidence and deadlines against the effective snapshot and expose missing items/remaining response time to authorized participants.  
**Actors:** Claimant/case party; reviewers; system.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-08.  
**Acceptance Criteria:**
- Given a claim type, then required evidence and deadlines resolve from versioned policy; missing/rejected/expired/accepted evidence states are distinguishable with reasons.
- Given a pause/extension, then it requires authorized, reasoned, audited history and never silently replaces the original deadline.

### FR-CLAIMS-004 — Sensitive Human Review
**Source:** `.spec/functional-requirements/FR.09.2.2-sensitive-human-review.md` · aliases `FR.09.2.2`, SRS `FR-022`  
**Status:** Confirmed.  
**Description:** Require an appropriately scoped human reviewer for medically, financially, or legally sensitive claims/disputes with separation of duties where policy requires.  
**Actors:** Authorized medical/financial/legal reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-09, BP-10.  
**Acceptance Criteria:**
- Given a sensitive decision, then only a reviewer with required role, organization, and subject scope may decide it and prohibited self-approval is rejected.
- Given a decision, then findings, reasons, evidence references, policy, actor, time, and required external actions are retained.

### FR-CLAIMS-005 — Claim Appeal
**Source:** `.spec/functional-requirements/FR.09.2.3-claim-appeal.md` · aliases `FR.09.2.3`, SRS `FR-026`  
**Status:** Confirmed.  
**Description:** Allow an authorized case party to appeal an eligible claim/dispute decision within the versioned appeal window.  
**Actors:** Authorized case party; appeal reviewer.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-10.  
**Acceptance Criteria:**
- Given an appeal, then it references the original decision, grounds, evidence, and submission time; eligibility/deadline use the governing policy snapshot.
- Given assignment, then separation-of-duties rules are enforced and the original decision is preserved.

### 7.7 OPS — Operational Work and Launch Governance

### FR-OPS-001 — Operational Work Queues
**Source:** `.spec/functional-requirements/FR.10.1.1-operational-work-queues.md` · aliases `FR.10.1.1`, SRS `FR-029`  
**Status:** Confirmed.  
**Description:** Provide scoped queues for verification, review, dispute, claim, financial follow-up, and exception work ordered by policy priority/deadline.  
**Actors:** Authorized UberTib staff.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-13.  
**Acceptance Criteria:**
- Given a work item, then type, case, state, priority, due time, responsibility scope, and blocking reason are visible to authorized staff.
- Given assignment/escalation/completion/reopening/deadline breach, then an audited state transition is recorded; staff can only see/claim work within active scope.
- Given a work item, then its lifecycle state is exactly one of `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `WAITING`, or `COMPLETED`.
- Given escalation or a passed due time, then these are recorded as flags and events that preserve the lifecycle state rather than replacing it, so an item can be simultaneously `IN_PROGRESS`, escalated, and overdue; deadline breach is derived from `due_at` and audited.

### FR-OPS-002 — Operational Reporting
**Source:** `.spec/functional-requirements/FR.14.1.1-operational-reporting.md` · aliases `FR.14.1.1`, SRS `FR-035`  
**Status:** Confirmed.  
**Description:** Provide scoped reports/metrics for queues, deadlines, exceptions, eligibility, evidence completeness, bookings, treatment progress, and external financial cases.  
**Actors:** Operations managers; Product Owner; authorized staff.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-13.  
**Acceptance Criteria:**
- Given a metric, then population, time window, status rules, and last-refreshed time are defined; provisional/disputed data is distinguished from confirmed facts.
- Given report export/drill-down, then the same authorization, isolation, and audit rules apply.

### FR-OPS-003 — Launch Readiness Gate
**Source:** `.spec/functional-requirements/FR.14.2.1-launch-readiness-gate.md` · alias `FR.14.2.1`, decision `PO-2026-08-23`  
**Status:** Confirmed; production catalog activation remains governed by `Q-CATALOG-001` and `Q-ELIG-001`.  
**Description:** Prevent production activation of a service, provider scope, or geographic expansion until required medical, legal, operational, and technical approvals are current.  
**Actors:** Product/policy owners; medical/legal/operational/technical reviewers; system.  
**Screens:** Deferred to UX pipeline for staff workflow; enforcement is system behavior.  
**Business Principles:** BP-09, BP-10.  
**Acceptance Criteria:**
- Given a launch scope, then every required gate has accountable role, evidence, decision, expiry where applicable, and current state.
- Given a missing/expired/revoked/rejected mandatory approval, then public discoverability and new bookings for that scope are blocked; provisional evaluation data does not equal production medical approval.

### 7.8 IDENTITY — Accounts, Representation, Staff Authorization

### FR-IDENTITY-001 — Scoped Staff Permissions
**Source:** `.spec/functional-requirements/FR.10.2.1-scoped-staff-permissions.md` · aliases `FR.10.2.1`, SRS `FR-027`  
**Status:** Confirmed.  
**Description:** Enforce least-privilege staff permissions by role, organization, branch, workflow responsibility, and subject-matter scope on administrative/API access paths.  
**Actors:** Staff; administrator; system.  
**Screens:** None (cross-cutting authorization behavior); UX consumes the permission model.  
**Acceptance Criteria:**
- Given no active explicit grant, then access is denied by default.
- Given route/interface/request manipulation, then organization/branch isolation cannot be bypassed and permission changes apply consistently across panels, APIs, files, queues, and exports with audit history.

### FR-IDENTITY-002 — Patient Account and Contact Verification
**Source:** `.spec/functional-requirements/FR.11.1.1-patient-account-contact-verification.md` · aliases `FR.11.1.1`, SRS `FR-001`  
**Status:** Confirmed.  
**Description:** Create/activate a patient identity only after required contact verification and bind cases to that authenticated identity.  
**Actors:** Patient; system.  
**Screens:** Deferred to UX pipeline.  
**Acceptance Criteria:**
- Given an unverified challenge, then the account cannot become active.
- Given an authenticated patient, then only owned records are accessible unless a valid scoped grant exists; repeated registration does not create duplicate active patient identities.

### FR-IDENTITY-003 — Guardian and Family Grants
**Source:** `.spec/functional-requirements/FR.11.1.2-guardian-and-family-grants.md` · aliases `FR.11.1.2`, SRS `FR-032`  
**Status:** Confirmed.  
**Description:** Support explicit, revocable, purpose-limited guardian/family access while preserving the patient as case owner.  
**Actors:** Patient/legal basis; guardian/family grantee; system.  
**Screens:** Deferred to UX pipeline.  
**Acceptance Criteria:**
- Given a grant, then grantor/legal basis, patient, grantee, actions, data scope, effective period, and purpose are explicit.
- Given expiry/revocation, then access stops immediately while history remains; guardian actions are attributed to the guardian, never impersonating the patient.
- Given an adult patient with capacity, then that patient grants and revokes scoped access themselves, and revocation is always immediate — no booking or case state may block it, and revocation never deletes or cancels an existing booking or case.
- Given a minor or a patient who cannot legally or self-consensually establish the grant, then the guardian submits a legal-basis request with declared relationship, legal basis, and required identity/legal evidence, which enters Admin Verification; only an authorized verification decision creates the `LEGAL_BASIS` grant, so a guardian can never self-authorize by entering a dependent.

### 7.9 AUDIT — Audit, Idempotency, Provenance

### FR-AUDIT-001 — Sensitive Decision Audit
**Source:** `.spec/functional-requirements/FR.11.2.1-sensitive-decision-audit.md` · aliases `FR.11.2.1`, SRS `FR-028`  
**Status:** Confirmed.  
**Description:** Create tamper-evident audit history for sensitive reads/downloads/writes/approvals/decisions/permission changes/exceptional admin actions.  
**Actors:** System; authorized auditor; all sensitive-action actors.  
**Screens:** Deferred to UX pipeline for auditor access; event creation is system behavior.  
**Acceptance Criteria:**
- Given a sensitive action, then actor, effective role/scope, action, resource, time, outcome, request correlation, and required reason are retained.
- Given audit search, then authorized auditors can search without gaining unrelated protected payload access; operational users cannot edit/delete audit records.

### FR-AUDIT-002 — Classification and Financial Audit
**Source:** `.spec/functional-requirements/FR.11.2.2-classification-financial-audit.md` · aliases `FR.11.2.2`, SRS `FR-046`  
**Status:** Confirmed.  
**Description:** Retain provenance for classification inputs/results, financial terms/events, claims, reviews, and sensitive decisions.  
**Actors:** Authorized auditor/reviewer; system.  
**Screens:** Deferred to UX pipeline for audit tools.  
**Business Principles:** BP-08.  
**Acceptance Criteria:**
- Given an outcome, then an authorized auditor can trace facts, evidence, approvals, policy versions, actors, and time without relying on mutable current configuration.
- Given an audit export, then access control and attribution/audit of the export itself are enforced.

### FR-AUDIT-003 — Idempotent Sensitive Commands
**Source:** `.spec/functional-requirements/FR.12.1.1-idempotent-sensitive-commands.md` · aliases `FR.12.1.1`, SRS `FR-045`  
**Status:** Confirmed.  
**Description:** Require idempotent processing for retry-prone commands including bookings, acceptances, uploads, financial events, claims, and decisions.  
**Actors:** System; any actor issuing sensitive commands.  
**Screens:** None (background/system behavior).  
**Acceptance Criteria:**
- Given the same actor/scope/key and identical request, then a retry returns the original successful result without duplicate side effects.
- Given the same key with materially different payload, then it is rejected; concurrent duplicates create at most one committed business outcome.

### 7.10 CATALOG — Understandable Dental Catalog

### FR-CATALOG-001 — Understandable Service Catalog
**Source:** `.spec/functional-requirements/FR.12.2.1-understandable-service-catalog.md` · aliases `FR.12.2.1`, SRS `FR-002`  
**Status:** Confirmed; backend evaluation slice is Partially Implemented; production service content remains governed by `Q-CATALOG-001`.  
**Description:** Present available dental groups/services in understandable Arabic without requiring patients to understand internal classification symbols.  
**Actors:** Patient; product evaluator; system.  
**Screens:** Deferred to UX pipeline; the current verified backend exposes API data only.  
**Business Principles:** BP-11.  
**Acceptance Criteria:**
- Given an active service, then patient-facing Arabic name, description, owning group, and practical purpose are available.
- Given catalog state/availability, then meaning is communicated through text/accessible semantics and does not require knowledge of S/P/H/I/K/EU/internal risk codes.

### 7.11 POLICY — Versioned Rules and Historical Reproduction

### FR-POLICY-001 — Policy Version Lifecycle
**Source:** `.spec/functional-requirements/FR.13.1.1-policy-version-lifecycle.md` · alias `FR.13.1.1`, decision `PO-2026-08-23`  
**Status:** Confirmed; catalog-policy subset is Partially Implemented.  
**Description:** Manage classification, eligibility, deadline, evidence, financial, and launch policies through draft, reviewed, scheduled, active, retired, and superseded versions.  
**Actors:** Policy owner; required reviewers; system.  
**Screens:** Deferred to UX pipeline for staff policy workflow.  
**Business Principles:** BP-08.  
**Acceptance Criteria:**
- Given a policy version, then only authorized owners/reviewers may advance it through configured approval states.
- Given the same key/scope/instant, then at most one version is effective unless explicit precedence resolves overlap; activation/retirement never mutates historical cases/decisions.

### FR-POLICY-002 — Historical Decision Reproduction
**Source:** `.spec/functional-requirements/FR.13.2.1-historical-decision-reproduction.md` · alias `FR.13.2.1`, decision `PO-2026-08-23`  
**Status:** Confirmed.  
**Description:** Reproduce retained historical classification, eligibility, financial, and sensitive workflow decisions from immutable inputs, snapshots, policy versions, and recorded rules.  
**Actors:** Authorized auditor/reviewer; system.  
**Screens:** Deferred to UX pipeline for reviewer tooling; reproduction is system behavior.  
**Business Principles:** BP-08.  
**Acceptance Criteria:**
- Given historical reproduction, then historical snapshots—not mutable current data—are used and the result matches stored history.
- Given an integrity mismatch, then an auditable exception is raised; protected payload remains purpose/scope restricted.

### 7.12 PLATFORM — Patient Attention and Notification

### FR-PLATFORM-001 — Patient Notification and Attention Center
**Source:** decision `PO-2026-08-25-ux-phase1-reconciliation` `PO-UX-09`; resolves `Q-PLATFORM-005`  
**Status:** Confirmed.  
**Description:** Provide the patient with a durable in-app record of the notification intents addressed to them, plus an attention area that surfaces everything currently awaiting their action, so correctness never depends on push, SMS, or email delivery.  
**Actors:** Patient; guardian within an active grant scope; system.  
**Screens:** Deferred to UX pipeline.  
**Business Principles:** BP-04, BP-13.  
**Acceptance Criteria:**
- Given a required notification intent addressed to the patient, then a durable in-system entry exists carrying a safe title/summary, a link to the authoritative resource, a timestamp, read/unread, an action-required indication, and any applicable due time.
- Given the patient reads or dismisses an entry, then no business state changes; reading is never an acknowledgement, an acceptance, or a deadline response.
- Given a deadline-bound or action-required item, then it also appears in the patient attention area, so a failed or undelivered push/SMS/email never causes a missed obligation.
- Given push, SMS, or email delivery fails, then the durable entry and the attention area still present the obligation and the authoritative state is unchanged.

## 8. Non-Functional Requirements

Every NFR below states an explicit metric, threshold, and verification method. Where the source uses a universal requirement rather than a numeric percentage, the measurable threshold is 100% coverage of the specified behavior.

### NFR-PLATFORM-001 — Performance and Scale
**Source:** `.spec/non-functional-requirements/NFR.01-performance-and-scale.md` · alias `NFR.01`  
**Status:** Confirmed; `Q-PLATFORM-004` clarifies expected population versus engineering envelope.  
**Metric / Threshold:** Support ≥10,000 registered identities, 3,000 MAU, 500 DAU, 100 concurrent authenticated sessions; ordinary API reads p95 ≤500 ms, writes p95 ≤800 ms, provider search p95 ≤1 s; 30-minute 100-session application error rate <1%; 75 req/s burst remains within approved latency/error thresholds; 100 concurrent attempts for one slot never exceed capacity.  
**Measurement Method:** Repeatable staging load/concurrency tests with production-shaped data; record p95, error rate, throughput, and overbooking assertions.

### NFR-PLATFORM-002 — Availability, Backup, and Recovery
**Source:** `.spec/non-functional-requirements/NFR.02-availability-backup-and-recovery.md` · alias `NFR.02`  
**Status:** Confirmed with architecture classification caveat `CONFLICT-PLATFORM-002`.  
**Metric / Threshold:** 99.5% monthly production availability excluding approved maintenance; RPO ≤15 min; RTO ≤4 h; quarterly full restore exercise within RTO.  
**Measurement Method:** Availability monitoring plus quarterly restore exercise covering database state, private evidence/object recovery, scan/quarantine metadata, deletion tombstones, and legal holds. The source explicitly names MySQL point-in-time recovery; production topology remains unresolved under `Q-OPS-001`.

### NFR-IDENTITY-001 — Authorization and Tenant/Scope Isolation
**Source:** `.spec/non-functional-requirements/NFR.03-authorization-and-tenant-isolation.md` · alias `NFR.03`  
**Status:** Confirmed.  
**Metric / Threshold:** 100% of REST, Filament, jobs, files, exports, search, and notification access paths enforce deny-by-default role/organization/clinic/branch/case/purpose authorization; zero protected cross-scope disclosures.  
**Measurement Method:** Automated allow/deny matrix tests for each sensitive action and representative cross-scope identifier probes.

### NFR-IDENTITY-002 — Authentication, MFA, and OTP Safety
**Source:** `.spec/non-functional-requirements/NFR.04-authentication-mfa-and-otp.md` · alias `NFR.04`  
**Status:** Confirmed; concrete providers remain `Q-PLATFORM-003`.  
**Metric / Threshold:** Patient OTP = 6 digits, expires in 5 min, single-use, hash-only storage, ≤5 verification attempts, ≤3 sends/15 min per phone/account/IP combination; resend invalidates prior OTP without resetting failures; privileged roles require a non-SMS second factor for production access.  
**Measurement Method:** Automated authentication/rate-limit/state tests and production configuration review.

### NFR-PLATFORM-003 — Private File and Evidence Security
**Source:** `.spec/non-functional-requirements/NFR.05-private-file-and-evidence-security.md` · alias `NFR.05`  
**Status:** Confirmed; malware/private-evidence provider selection remains `Q-PLATFORM-003`.  
**Metric / Threshold:** Allowlist PDF/JPEG/PNG; ≤10 MB/image, ≤25 MB/PDF, ≤10 files/action; 100% uploads validate extension + magic bytes + MIME + decode, use opaque UUID names, store immutable SHA-256, and remain quarantined until malware scan succeeds; authorized download links ≤60 s and every download audited.  
**Measurement Method:** Upload/download security tests, malware/quarantine integration tests, authorization tests, and audit-log assertions.

### NFR-PLATFORM-004 — Privacy, Retention, and Deletion
**Source:** `.spec/non-functional-requirements/NFR.06-privacy-retention-and-deletion.md` · alias `NFR.06`  
**Status:** Confirmed as provisional policy; final legal values require `Q-PLATFORM-002`.  
**Metric / Threshold:** Adult closed cases 11 years; child cases until 25th birthday, or 26th when treatment ended at 17, unless approved law supersedes prospectively; OTP hash/metadata ≤24 h; unverified accounts/draft evidence/abandoned uploads ≤90 days; orphan temporary uploads ≤24 h; zero deletion while active legal hold exists.  
**Measurement Method:** Retention-policy unit/application tests, scheduled deletion tests, legal-hold deny tests, and periodic data-retention audit.

### NFR-AUDIT-001 — Audit and Provenance Integrity
**Source:** `.spec/non-functional-requirements/NFR.07-audit-and-provenance-integrity.md` · alias `NFR.07`  
**Status:** Confirmed.  
**Metric / Threshold:** 100% of defined sensitive access/fact/evidence/decision/configuration/exception actions produce attributable append-only provenance; zero health content, credential secrets, OTP values, private filenames, or signed URLs in ordinary logs/client error payloads.  
**Measurement Method:** Event-coverage tests, audit immutability tests, log redaction tests, and trace-back tests from classifications/financial outcomes to inputs/snapshots/policies.

### NFR-AUDIT-002 — Concurrency and Idempotency
**Source:** `.spec/non-functional-requirements/NFR.08-concurrency-and-idempotency.md` · alias `NFR.08`  
**Status:** Confirmed.  
**Metric / Threshold:** Identical actor/operation/scope/key/payload produces exactly one committed side effect and original response; same key/different payload is deterministically rejected; zero overbooking, duplicate acceptances, duplicate financial events, or partial sensitive-workflow commits under tested contention.  
**Measurement Method:** Parallel application/database tests with duplicate/reordered/retried commands and constraint/transaction assertions.

### NFR-PLATFORM-005 — Arabic, RTL, and Accessibility
**Source:** `.spec/non-functional-requirements/NFR.09-arabic-rtl-and-accessibility.md` · alias `NFR.09`  
**Status:** Confirmed.  
**Metric / Threshold:** Arabic-first/RTL for production patient/staff journeys; WCAG 2.2 AA for applicable web/mobile interactions; 100% production labels, validation, states, and recovery guidance avoid untranslated internal codes; status/error/protection/eligibility/urgency never rely on color alone.  
**Measurement Method:** Automated accessibility checks where applicable plus keyboard/assistive-navigation, focus, accessible-name, text-scaling, contrast, and screen-reader test suite.

### NFR-PLATFORM-006 — Weak-Connectivity Resilience
**Source:** `.spec/non-functional-requirements/NFR.10-weak-connectivity-resilience.md` · alias `NFR.10`  
**Status:** Confirmed.  
**Metric / Threshold:** Eligible in-progress data can be recovered without creating a submitted record; interrupted operations expose pending/failed/retrying/completed state; network retry of an already committed command creates zero duplicate bookings/evidence/claims/financial events.  
**Measurement Method:** Offline/interrupted-network application tests, resumable-upload tests, retry/idempotency tests, and client-state verification.

### NFR-PLATFORM-007 — Maintainability and Contract Versioning
**Source:** `.spec/non-functional-requirements/NFR.11-maintainability-and-contract-versioning.md` · alias `NFR.11`  
**Status:** Approved source requirement; architecture-specific wording remains subject to `CONFLICT-PLATFORM-002`.  
**Metric / Threshold:** 100% external REST contracts are explicitly versioned; zero silent breaking changes; classification/eligibility/evidence/deadline/financial policies are not embedded in presentation components; shared domain/application behavior is independently testable.  
**Measurement Method:** Contract tests, architecture/static checks, change-review evidence, and application-layer tests across REST/Filament adapters.

### NFR-PLATFORM-008 — Observability and Queue Operations
**Source:** `.spec/non-functional-requirements/NFR.12-observability-and-queue-operations.md` · alias `NFR.12`  
**Status:** Confirmed; concrete production tooling/topology remains `Q-OPS-001`.  
**Metric / Threshold:** 100% requests/jobs carry correlation IDs without protected payload logging; every enumerated signal—queue age, retry/failure count, deadline breach, scan backlog, notification failure, eligibility recalculation delay, backup status—has a defined operational threshold and alert; delayed background work is never represented as completed business outcome.  
**Measurement Method:** Configuration inspection, synthetic fault tests, queue/alert integration tests, and audited retry/escalation tests.

### NFR-FINANCE-001 — Zero-Money-Movement Safety
**Source:** `.spec/non-functional-requirements/NFR.13-zero-money-movement-safety.md` · alias `NFR.13`  
**Status:** Confirmed.  
**Metric / Threshold:** Zero endpoints, jobs, credential fields, or integrations for authorizing/capturing/holding/transferring/settling money; 100% financial commands record assertions/confirmations/disputes/approvals/external outcomes only; user language never claims UberTib held, paid, insured, or refunded money.  
**Measurement Method:** Architecture/contract scan, API/job/configuration review, automated negative tests, and UX-copy verification in the later design phase.

### NFR-AUDIT-003 — Immutable Snapshot and Event Integrity
**Source:** `.spec/non-functional-requirements/NFR.14-immutable-snapshot-and-event-integrity.md` · alias `NFR.14`  
**Status:** Confirmed.  
**Metric / Threshold:** 100% accepted agreements, computed decisions, and accepted financial events reject business update/delete; 100% corrections use linked superseding snapshots or compensating events; integrity verification reports any inconsistent stored history.  
**Measurement Method:** Model/database/application immutability tests, correction-history tests, and deterministic hash/derived-state reproduction tests.

## 9. V1 Success Criteria

Source: `.spec/00-business-context.md`.

| Source ID | Acceptance threshold |
|---|---|
| SC-01 | 100% displayed/booked provider results pass service/branch eligibility at display and revalidation time. |
| SC-02 | 100% S/P/H/I and eligibility decisions retain documented inputs, policy version, and auditable reasons. |
| SC-03 | Zero UI/permission paths allow direct entry of final S/P/H/I outcomes. |
| SC-04 | 100% cases starting treatment or recording a payment have mutually accepted terms snapshots. |
| SC-05 | 100% reported external payments resolve to counterparty confirmation, authorized confirmation, or an open dispute. |
| SC-06 | 100% refunds/compensation cases separate entitlement/decision from external execution as distinct states/times. |
| SC-07 | Zero money collection, custody, transfer, withdrawal, or settlement operations executed by UberTib. |
| SC-08 | 100% published reviews link to a completed verified non-duplicate experience. |
| SC-09 | 100% closed complaints/disputes/claims contain reasoned decision, evidence history, and authorized reviewer. |
| SC-10 | 100% sensitive medical/punitive/high-impact compensation decisions have documented human review. |
| SC-11 | Zero bookable appointments outside Aleppo or for services lacking required medical approval. |
| SC-12 | 100% cases retain a unified timeline from request through completion/closure. |

## 10. Current Implementation Evidence — Not Product Authority

The verified backend currently implements a narrow service-catalog/governance slice. This evidence does not redefine requirements.

- `UberTip-Backend/routes/api.php` currently exposes `GET /api/v1/catalog/service-groups` as the verified public API surface.
- The backend contains service groups, services, versioned service definitions, clinical reviewer credentials, service launch gates, and actions/tests for catalog publication/governance.
- `FR-CATALOG-001`, `FR-POLICY-001`, and `FR-OPS-003` have partial implementation evidence in the current backend and tests.
- The 26 seeded dental-service records are provisional evaluation records, not clinically approved production services.
- Booking, complete S/P/H/I eligibility computation, treatment/case management, record-only finance lifecycle, reviews, claims, full permissions, and the remaining platform workflows are not evidenced as complete implementations.
- Feature/OpenAPI documents remain contract/planning evidence and are not proof that unimplemented routes exist. Historical `CONFLICT-CATALOG-001` is resolved for the implemented `API-CATALOG-001` route/OpenAPI alignment.

## 11. Assumptions, Questions, and Conflicts

No canonical `ASM-*` is allocated at this point. Do not convert open items below into confirmed behavior.

| ID | Severity | Impact / required decision |
|---|---|---|
| Q-PLATFORM-001 | Blocker | The authoritative SRS v1.1 must be available as readable text before complete SRS reconciliation can be certified. This blocks claims of complete source coverage, not the already approved derivative requirement identities preserved here. |
| Q-CATALOG-001 | Major | The 26 provisional dental-service records require licensed clinical approval before production medical readiness. |
| Q-ELIG-001 | Major | Production S/P/H/I formulas, weights, thresholds, deadlines, and defaults require licensed clinical approval; provisional values remain versioned/configurable evaluation policy. |
| Q-PLATFORM-002 | Major | Final retention/deletion periods require applicable legal/compliance validation. |
| Q-OPS-001 | Major | Production hosting/deployment topology/provider is not established. Infrastructure documentation must remain provider-neutral until resolved. |
| Q-PLATFORM-003 | Resolved for interaction; provider selection open | Resolved 2026-08-25 by `PO-UX-17`: the evidence-transfer interaction contract is fixed and provider-neutral (`API-PLATFORM-001`, `STATE_MACHINES.md` section 21.1), and the patient notification surface is confirmed (`FR-PLATFORM-001`). Selecting the concrete OTP, malware-scanning, private-storage, and notification-delivery vendors remains an infrastructure decision tracked by `Q-OPS-001`; provider contracts must still not be invented. |
| Q-PLATFORM-004 | Minor | Low-thousands expected Aleppo launch population and the 10,000-identity NFR envelope are treated as expected population versus engineering headroom unless superseded. |
| CONFLICT-PLATFORM-001 | Major | Older feature-plan stack assumptions differ from the verified current backend package constraints; technical documentation must use verified repository facts and preserve older plans only as historical evidence. |
| CONFLICT-CATALOG-001 | Resolved | Resolved 2026-08-24: the currently verified `GET /api/v1/catalog/service-groups` route and current OpenAPI contract align. Broader planned contracts still remain planning evidence and must not be treated as implemented behavior. |
| CONFLICT-PLATFORM-002 | Major | Some `.spec` quality statements include architecture-specific wording; final NFR versus DR/TD classification awaits authoritative SRS reconciliation. |

## 12. Product Rules for Downstream Design and Implementation

- Do not add electronic payments, wallet, escrow, settlement, custody, or money movement to satisfy any financial requirement.
- Do not expose a direct control for final S/P/H/I or eligibility outcomes; governed source facts/policy changes cause recomputation.
- Do not treat `PENDING_EVALUATION` as `F`.
- Do not use patient review rating `R` as scientific eligibility/classification.
- Do not present raw internal `I` to patients as a rating, accusation, or quality score.
- Do not present the 26 evaluation catalog records as clinically production-approved.
- Do not activate production medical behavior without required licensed clinical and launch-gate approval.
- Do not allow current policy/configuration changes to rewrite accepted historical snapshots or prior decision/event history.
- Do not automate final sensitive medical or high-impact decisions that the confirmed requirements reserve for authorized human review.
- Do not infer screens, navigation, layouts, or components from this PRD. The UX chain consumes the requirements, permissions, state machines, APIs, errors, and data models after engineering documentation is complete.

## 13. Phase Dependency

`docs/SDD.md` must consume this PRD and reference these canonical IDs rather than restating product truth. Phase 2 conditional architecture/API/database/domain documents must not begin until `docs/SDD.md` exists. Requirements affected by unresolved Major questions may be technically designed only under explicit, documented assumptions; the Blocker `Q-PLATFORM-001` remains visible throughout the documentation run.