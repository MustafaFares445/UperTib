# UberTib Permissions Matrix

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/COMPONENT_DESIGN.md`, `docs/domain/STATE_MACHINES.md`, `docs/api/API_CONTRACTS.md`  
**Registry:** `docs/README.md`

## 1. Purpose

This document owns the authorization model for UberTib V1. It defines which actor categories may perform material actions, the conditions under which access is allowed, and the requirements that justify each permission.

It does not define navigation, screens, menu visibility, or visual behavior. Hiding an action in React Native or Filament is never an authorization control.

Authorization is **deny by default**. Any action not explicitly allowed by this document or a later approved requirement is denied.

`Q-PLATFORM-001` remains a Blocker for claiming complete reconciliation with readable SRS v1.1 text. This matrix therefore uses only the approved `.spec` requirements, current repository evidence, and previously generated canonical engineering documents.

## 2. Current Implementation Status

The current repository does not yet implement the V1 permission model.

Verified current state:

- `App\Models\User` is a standard Laravel authenticatable user and currently does not use Spatie `HasRoles`.
- Spatie Permission is installed as a dependency, but no verified business permission wiring, policies, scoped authorization model, or business-role migrations were found in the current implementation slice.
- The existing service-catalog publication actions enforce domain preconditions but do not yet establish the complete actor authorization model described here.
- Existing launch-gate code already defines accountable role keys for medical, legal, operational, and technical gates.

Therefore all V1 permissions below are **Required/Proposed** except where an existing domain action already enforces a non-authorization invariant.

## 3. Authorization Decision Model

An allow decision may require all applicable dimensions below:

1. **Authentication** — the actor is authenticated when the action is not public.
2. **Capability** — the actor has the coarse role/permission capability.
3. **Organization scope** — the actor belongs to or is explicitly granted the relevant clinic/organization scope.
4. **Branch scope** — the actor is granted the exact branch when the resource is branch-specific.
5. **Case/resource relationship** — the actor is a party to, treating clinician for, assigned reviewer for, or otherwise explicitly authorized on the exact resource.
6. **Workflow responsibility** — the actor is assigned or eligible to perform the current workflow step.
7. **Subject-matter scope** — the actor is competent/approved for the subject being decided where required.
8. **Purpose** — the access is for an approved operational, clinical, legal, financial, support, or audit purpose.
9. **Effective period** — the grant, credential, assignment, or guardian authority is currently active.
10. **Separation of duties** — the actor did not originate or control a conflicting step when the governing policy requires independent review.

Possessing an administrative account, a Filament login, or a broad package role does not bypass these dimensions.

## 4. Actor Catalog

| Actor | Meaning | Standing Access |
|---|---|---|
| Public visitor | Unauthenticated user | Only explicitly public discovery/catalog data |
| Patient | Verified patient identity | Own identity, bookings, cases, accepted terms, authorized financial/review/claim actions |
| Guardian / family grantee | Authenticated person acting under an active explicit grant | Only granted patient, action, data scope, purpose, and effective period |
| Treating dentist | Clinician assigned to the relevant provider/case context | Clinical authoring and treatment actions within exact scope |
| Clinic/provider representative | Authorized clinic staff or dentist acting for a provider/branch | Booking responses and non-clinical provider operations within granted scope |
| Verification staff | Staff assigned to validate source facts/evidence | Verification decisions within competence/scope; never final computed S/P/H/I editing |
| Licensed clinical reviewer | Independently verified clinician with current credential | Medical launch/review decisions within credential and assigned scope |
| Review integrity reviewer | Staff assigned to review publication/eligibility/policy compliance of reviews | Review-integrity decisions; no scientific classification editing |
| Claim/dispute reviewer | Staff assigned to complaints, refund, protection, or dispute review | Human decisions within assigned scope and separation-of-duties rules |
| Finance reviewer | Scoped reviewer for external financial records/disputes | Record review/confirmation resolution only; never money movement |
| Policy owner/reviewer | Authorized owner/reviewer of a versioned policy | Draft/review/schedule/retire policy versions within owned domain |
| Product/operations owner | Accountable operations owner | Operational launch gate and authorized operations governance |
| Legal accountable owner | Accountable legal reviewer | Legal launch gate and explicitly assigned legal review only |
| Technical accountable owner | Accountable technical reviewer | Technical launch gate and explicitly assigned technical review only |
| Operations staff | Staff handling queues, deadlines, exceptions, reporting, follow-up | Assigned operational work within scoped grants |
| System administrator | Actor responsible for accounts, coarse permissions, configuration access | No automatic clinical, financial, legal, claim, or case-data override |
| System automation | Authenticated/controlled application process, not a human role | Only deterministic system actions explicitly required by policy/workflow |
| External regulator/auditor | External oversight actor | No standing application access is defined by current requirements |
| Developer/tester | Engineering role | No standing production business-data access is defined by current requirements |

The launch-gate implementation currently uses the exact accountable role keys `licensed_clinical_reviewer`, `legal_accountable_owner`, `product_and_operations_owner`, and `technical_accountable_owner`. Other actor names in this document are domain categories, not yet fixed permission-string names.

## 5. Global Permission Rules

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Read public catalog | Public visitor / any authenticated actor | Allow | Only currently visible audience-safe catalog fields | FR-CATALOG-001 |
| Access protected resource | Any authenticated actor | Conditional | Exact resource scope and purpose must authorize access | FR-IDENTITY-001, NFR-IDENTITY-001 |
| Bypass scope because actor is administrator | System administrator | Deny | Administration is not a universal domain-data override | FR-IDENTITY-001, NFR-IDENTITY-001 |
| Directly set final S/P/H/I or final eligibility | Any human actor | Deny | Outcomes are system-derived from approved facts and policies | FR-ELIG-002, FR-ELIG-009–015 |
| Rewrite immutable historical record | Any human or system actor | Deny | Correction uses new snapshot/version/event | FR-AUDIT-002, FR-POLICY-002, NFR-AUDIT-003 |
| Execute/capture/hold/transfer/settle/refund money | Any actor including administrator/system | Deny | V1 is record-only and non-funded | FR-FINANCE-007, NFR-FINANCE-001 |
| Access raw internal risk `I` | Patient/public/ordinary provider actor | Deny | Internal risk is restricted to explicitly authorized internal workflows | FR-ELIG-015 |
| Access private evidence | Any actor | Conditional | Fresh authorization for exact evidence purpose/resource; audit required | NFR-PLATFORM-003, NFR-IDENTITY-001 |

## 6. Identity, Authentication, and Guardian Access

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Request patient OTP | Public pre-auth user | Allow | Rate limits and approved contact-verification rules apply | FR-IDENTITY-002, NFR-IDENTITY-002 |
| Verify OTP / activate patient identity | Challenge holder | Allow | Valid unused challenge; attempts/expiry rules pass | FR-IDENTITY-002, NFR-IDENTITY-002 |
| Read own patient identity | Patient | Allow | Authenticated own identity | FR-IDENTITY-002 |
| Read another patient's identity | Ordinary patient/provider/staff | Deny | Unless another explicit scoped authorization below applies | NFR-IDENTITY-001 |
| Act for patient | Guardian/family grantee | Conditional | Active grant covers exact patient, action, data scope, purpose, and time | FR-IDENTITY-003 |
| Act after grant expiry/revocation | Guardian/family grantee | Deny | Revocation/expiry takes effect immediately | FR-IDENTITY-003 |
| Create consent representation grant | Adult patient with capacity | Allow | Own identity; grantee, actions, data scope, purpose, and effective period recorded | FR-IDENTITY-003 |
| Submit legal-basis representation request | Authenticated guardian applicant | Allow | Declared relationship and legal basis plus required identity/legal evidence; creates a request, never a grant | FR-IDENTITY-003 |
| Self-authorize a legal-basis grant by entering a dependent | Guardian applicant | Deny | Only an authorized verification decision may create a `LEGAL_BASIS` grant | FR-IDENTITY-003 |
| Approve/reject legal-basis representation request | Verification staff / authorized admin | Conditional | Assigned review scope; evidence assessed; grant records patient, grantee, actions, data scope, purpose, effective period, evidence, and approving reviewer | FR-IDENTITY-003, FR-AUDIT-001 |
| Revoke consent representation grant | Patient grantor | Allow | Always immediate; no booking, case, or workflow state may block it | FR-IDENTITY-003 |
| Revoke legal-basis representation grant | Actor authorized by the governing legal basis / authorized admin workflow | Conditional | Revocation is attributed and audited; follows the legal basis | FR-IDENTITY-003 |
| Block a revocation because of booking or case state | Any actor/system | Deny | Revocation is never blocked by downstream state; continuity of care is handled by an operational work item instead | FR-IDENTITY-003 |
| Masquerade guardian action as patient action | Guardian/system | Deny | Acting identity must remain guardian identity | FR-IDENTITY-003 |
| Manage coarse staff role/permission assignments | System administrator | Conditional | Administrative authorization; change audited; does not grant unscoped business access | FR-IDENTITY-001, FR-AUDIT-001 |
| Create/change scoped staff grant | System administrator / authorized access administrator | Conditional | Organization/branch/capability/subject/purpose/effective period are explicit | FR-IDENTITY-001 |
| Use SMS-only factor for privileged production role where second factor is required | Privileged staff | Deny | Non-SMS second factor required by NFR | NFR-IDENTITY-002 |

## 7. Catalog, Policy, and Launch Readiness

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| View visible service catalog | Public visitor / any actor | Allow | Audience-safe fields only | FR-CATALOG-001 |
| Edit draft policy/service-definition content | Policy owner | Conditional | Exact owned policy/catalog scope; version remains editable | FR-POLICY-001, FR-CATALOG-001 |
| Review policy/service-definition version | Authorized policy reviewer | Conditional | Assigned policy domain/scope; required review checks pass | FR-POLICY-001 |
| Schedule policy/service-definition version | Policy owner/reviewer workflow | Conditional | Required approvals complete; no unresolved effective overlap | FR-POLICY-001 |
| Directly activate production service without gates | Policy owner/admin | Deny | Publication must pass launch readiness | FR-OPS-003, FR-CATALOG-001 |
| Record medical launch approval | Licensed clinical reviewer | Conditional | Current verified dental credential; medical gate scope; evidence/reason; future expiry | FR-OPS-003 |
| Record legal launch decision | Legal accountable owner | Conditional | Legal gate scope; reason/evidence | FR-OPS-003 |
| Record operational launch decision | Product/operations owner | Conditional | Operational gate scope; reason/evidence | FR-OPS-003 |
| Record technical launch decision | Technical accountable owner | Conditional | Technical gate scope; reason/evidence | FR-OPS-003 |
| Use clinical credential on non-medical gate | Any actor | Deny | Current implementation forbids it | FR-OPS-003 |
| Publish scheduled production service definition | System/application action | Conditional | Complete card, current required gates, non-funded boundary, valid version ordering | FR-CATALOG-001, FR-OPS-003 |
| Retire active policy/version | Authorized policy owner workflow | Conditional | Domain authorization; historical decisions remain unchanged | FR-POLICY-001 |
| Change activated historical content | Policy owner/admin/system | Deny | Activated historical version is immutable | FR-POLICY-001, FR-POLICY-002 |
| Reproduce historical decision | Authorized audit/policy integrity workflow | Conditional | Exact historical inputs and policy snapshot; privacy scope applies | FR-POLICY-002 |

Production clinical approval remains governed by `Q-CATALOG-001` and `Q-ELIG-001`; these permissions do not convert provisional catalog data into approved medical policy.

## 8. Provider Activation, Facts, Evidence, and Eligibility

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Submit service activation request | Treating dentist/provider identity | Conditional | Exact provider + service-definition version + branch scope | FR-ELIG-007 |
| Supply questionnaire/source facts | Provider/dentist | Conditional | Own provider/service/branch activation scope | FR-ELIG-007 |
| Submit activation evidence | Provider/dentist | Conditional | Evidence belongs to authorized request and passes intake rules | FR-ELIG-007, NFR-PLATFORM-003 |
| Verify source facts/evidence | Verification staff | Conditional | Assigned work item, organization/subject competence, no prohibited conflict | FR-ELIG-007–008, FR-IDENTITY-001 |
| Make required medical evidence decision | Licensed clinical reviewer | Conditional | Clinical competence/credential and assigned scope where policy requires clinician judgment | FR-ELIG-007–008 |
| Directly enter scientific grade S | Provider/verifier/reviewer/admin | Deny | S is computed from approved rules/facts | FR-ELIG-011–013 |
| Directly enter pricing class P | Provider/verifier/reviewer/admin | Deny | P is computed from actual price and versioned price bands | FR-ELIG-009, FR-ELIG-014 |
| Directly enter protection H | Provider/verifier/reviewer/admin | Deny | H is computed | FR-ELIG-010, FR-ELIG-015 |
| Directly enter internal risk I | Provider/verifier/reviewer/admin | Deny | I is computed | FR-ELIG-015 |
| Compute eligibility/classification | System automation | Allow | Uses approved facts/evidence and effective versioned policy; immutable snapshot created | FR-ELIG-002, FR-ELIG-011–015 |
| Reevaluate after influential change | System automation | Allow | Only affected provider/service/branch scopes; new immutable decision | FR-ELIG-003–004, FR-ELIG-017 |
| Search eligible providers | Public/patient | Allow | Patient-safe output; only currently eligible scopes; raw I excluded | FR-ELIG-001, FR-ELIG-016 |
| View patient-safe eligibility explanation | Public/patient | Allow | Safe reasons only; no private evidence/reviewer details/raw I | FR-ELIG-016–017 |
| View internal eligibility evidence/reasons | Verification/operations/reviewer staff | Conditional | Explicit scoped grant and legitimate workflow purpose | FR-IDENTITY-001, FR-AUDIT-001 |
| Override computed final eligibility because of operational preference | Any human actor | Deny | Change source facts/policy through governed workflow and reevaluate instead | FR-ELIG-002–005 |

## 9. Booking

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Create booking request for self | Patient | Allow | Current eligibility/readiness/publication/capacity revalidation passes | FR-BOOKING-001 |
| Create booking request for represented patient | Guardian | Conditional | Active grant explicitly allows booking action for subject patient | FR-BOOKING-001, FR-IDENTITY-003 |
| Accept provider booking request | Clinic/provider representative | Conditional | Exact provider/branch scope; within response deadline; confirmation revalidation passes | FR-BOOKING-003, FR-BOOKING-001 |
| Reject provider booking request | Clinic/provider representative | Conditional | Exact provider/branch scope; within response deadline; reason required | FR-BOOKING-003 |
| Propose alternative appointment | Clinic/provider representative | Conditional | Exact branch/provider scope and response deadline | FR-BOOKING-003 |
| Accept alternative appointment | Patient | Allow | Own booking; proposal valid; capacity/readiness/eligibility revalidated | FR-BOOKING-003 |
| Accept alternative for represented patient | Guardian | Conditional | Active grant covers booking action | FR-BOOKING-003, FR-IDENTITY-003 |
| Cancel own booking | Patient | Conditional | Current state, actor permission, and versioned cancellation policy allow it | FR-BOOKING-002 |
| Cancel represented patient's booking | Guardian | Conditional | Active grant plus cancellation policy/state allows it | FR-BOOKING-002, FR-IDENTITY-003 |
| Cancel provider-side booking | Authorized provider representative | Conditional | Exact provider/branch scope and cancellation policy/state | FR-BOOKING-002 |
| Record patient no-show | Authorized provider representative | Conditional | Policy-defined no-show threshold has passed; exact booking scope | FR-BOOKING-002 |
| Mark no-show before threshold | Any actor | Deny | Threshold is mandatory | FR-BOOKING-002 |
| Force booking confirmation despite failed eligibility/capacity | Provider/admin/operations | Deny | Safety-critical revalidation cannot be overridden | FR-BOOKING-001 |
| Start or complete a visit for a booking in `ELIGIBILITY_REVIEW` | Clinic/provider representative | Deny | The appointment is not attendable while the owning eligibility scope is suspended | FR-BOOKING-002, FR-ELIG-003 |
| Override `ELIGIBILITY_REVIEW` to make a booking attendable | Admin/operations/any role | Deny | Fail-closed medical safety rule; no override exists while the scope remains `SUSPENDED` | FR-ELIG-003, FR-BOOKING-002 |
| Resolve an eligibility-review booking outcome | Verification/operations scope, with licensed clinical reviewer where the suspension reason requires clinical judgment | Conditional | Assigned review scope; outcome limited to return-to-`CONFIRMED` on a new `ELIGIBLE` evaluation or `CANCELLED` on deadline expiry | FR-ELIG-003, FR-OPS-001 |
| Propose a reschedule of a confirmed booking | Patient, guardian within grant scope, or authorized clinic party | Conditional | Booking is `CONFIRMED`; policy permits this initiating party; no other `PENDING` proposal exists | FR-BOOKING-004 |
| Respond to a reschedule proposal | Counterparty to the initiator | Conditional | Within response deadline; acceptance revalidates eligibility and new-slot capacity | FR-BOOKING-004, FR-BOOKING-001 |
| Accept one's own reschedule proposal | Initiating party | Deny | A reschedule requires the counterparty's acceptance | FR-BOOKING-004 |
| Edit a confirmed booking's date/provider/service directly | Any actor | Deny | Changes occur only through the governed proposal and acceptance path | FR-BOOKING-004, FR-BOOKING-002 |
| Resolve slot capacity atomically | System/application action | Allow | Transaction/locking/constraints protect configured capacity | FR-BOOKING-001, NFR-AUDIT-002 |

Operations or administrators do not receive a general booking-state override from current requirements. Any future exception workflow requires an explicit requirement and auditable state transition.

## 10. Clinical Case and Treatment

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| View own case summary/timeline | Patient | Allow | Own case; role-safe fields | FR-CLINICAL-005 |
| View represented patient's case | Guardian | Conditional | Active grant includes required clinical data/action scope | FR-IDENTITY-003, FR-CLINICAL-005 |
| View assigned case | Treating dentist | Conditional | Treating relationship and provider/branch scope active | FR-CLINICAL-001–005 |
| Author treatment plan | Treating dentist | Conditional | Authorized treating clinician for exact case | FR-CLINICAL-001 |
| Author clinical plan | Clinic staff without treating-clinician authority | Deny | Clinical authorship belongs to authorized treating clinician | FR-CLINICAL-001 |
| Generate autonomous diagnosis/treatment plan | System/AI/admin | Deny | Platform is not the diagnosing/treating authority | FR-CLINICAL-001 |
| Read proposed treatment plan | Patient / authorized guardian | Allow/Conditional | Case ownership or valid representation grant | FR-CLINICAL-001–002 |
| Accept treatment plan | Patient | Allow | Required service/stage/price/policy information complete | FR-CLINICAL-002 |
| Accept treatment plan for patient | Guardian | Conditional | Grant includes acceptance authority for exact patient/case | FR-IDENTITY-003, FR-CLINICAL-002 |
| Modify already accepted snapshot | Dentist/patient/admin/system | Deny | Amendment requires new plan version and new accepted snapshot | FR-CLINICAL-002, NFR-AUDIT-003 |
| Submit/attach required stage evidence | Treating dentist | Conditional | Exact case/stage scope; evidence passes private-file controls | FR-CLINICAL-003, NFR-PLATFORM-003 |
| Declare treatment stage complete | Treating dentist | Conditional | Required facts/evidence/acknowledgments from accepted snapshot are valid | FR-CLINICAL-003 |
| Complete/reopen stage without reason/evidence evaluation | Dentist/admin | Deny | Actor/time/reason/evidence set must be recorded | FR-CLINICAL-003 |
| Derive follow-up obligations | System/application action | Allow | From accepted plan/policy snapshot | FR-CLINICAL-004 |
| Manage assigned follow-up work | Treating dentist / operations staff | Conditional | Exact case/workflow scope and authorized action | FR-CLINICAL-004, FR-OPS-001 |

## 11. External Financial Records

Every permission in this section is about recording or reviewing activity performed outside UberTib. None authorizes movement of funds.

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| View accepted financial terms | Patient / authorized guardian / treating provider party | Conditional | Exact case relationship and role-safe fields | FR-FINANCE-001 |
| Report external payment | Authorized case party | Conditional | Exact accepted financial snapshot, amount/currency/context, idempotency | FR-FINANCE-002 |
| Report external payment as represented patient | Guardian | Conditional | Active financial-data/action grant | FR-FINANCE-002, FR-IDENTITY-003 |
| Confirm external payment assertion | Authorized counterparty | Conditional | Actor is counterparty for exact case/event | FR-FINANCE-003 |
| Dispute external payment assertion | Authorized counterparty | Conditional | Reason recorded; evidence when applicable | FR-FINANCE-003 |
| Review financial dispute | Finance reviewer | Conditional | Explicit case/work-item scope; policy allows reviewer involvement | FR-FINANCE-003, FR-IDENTITY-001 |
| Edit/delete original payment assertion after response | Any actor | Deny | Financial history is append-only | FR-FINANCE-005, NFR-AUDIT-003 |
| Record external refund execution assertion | Authorized case party | Conditional | References approved refund decision; exact amount/currency; evidence as required | FR-FINANCE-004 |
| Confirm/dispute external refund execution | Authorized counterparty / scoped reviewer | Conditional | Exact event and policy scope | FR-FINANCE-004 |
| View case financial timeline | Authorized case party / scoped finance staff | Conditional | Exact case/purpose; fields filtered by role | FR-FINANCE-006 |
| Authorize/capture/hold/settle/payout/refund money electronically | Patient/provider/finance/admin/system | Deny | Explicit V1 zero-money-movement boundary | FR-FINANCE-007, NFR-FINANCE-001 |
| Maintain platform wallet/balance | Any actor | Deny | No wallet/custody model in V1 | FR-FINANCE-007, NFR-FINANCE-001 |

## 12. Reviews and Review Appeals

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Submit review | Patient | Conditional | Verified completed eligible experience; within review window; no second active review | FR-REVIEWS-001 |
| Submit review for represented patient | Guardian | Conditional | Active grant covers review action and experience is eligible | FR-REVIEWS-001, FR-IDENTITY-003 |
| Submit review without verified experience | Any patient/guardian | Deny | Verified experience required | FR-REVIEWS-001 |
| Create second active review for same experience | Patient/guardian | Deny | One active review per eligible experience | FR-REVIEWS-001 |
| Appeal a decision rejecting/retiring/unpublishing own review | Authoring patient, or guardian within grant scope | Conditional | Policy-grounded appeal; evidence/grounds; applicable window | FR-REVIEWS-002 |
| Appeal review eligibility/policy decision affecting the provider | Affected provider/clinic representative | Conditional | Policy-grounded appeal; evidence/grounds; applicable window | FR-REVIEWS-002 |
| Appeal another party's review merely because its rating is unwelcome | Provider/patient/guardian | Deny | An appeal must contest eligibility, verification, or policy compliance | FR-REVIEWS-002 |
| Decide review publication/integrity appeal | Independent review integrity reviewer | Conditional | Assigned scope; reviewer did not make the original decision; findings/reason recorded | FR-REVIEWS-002 |
| Directly change rating content through appeal | Integrity reviewer/provider/admin | Deny | Appeal concerns eligibility/policy compliance, not rewriting rating content | FR-REVIEWS-002 |
| Feed R into S/P/H/I | System/reviewer/admin | Deny | Patient rating remains separate from classification | FR-REVIEWS-001–002 |

## 13. Claims, Refund Requests, Disputes, and Appeals

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Submit refund request | Patient / authorized case party | Conditional | Accepted terms and deadline policy permit request; evidence rules pass | FR-CLAIMS-001 |
| Submit refund request as guardian | Guardian | Conditional | Active grant covers claim/financial action | FR-CLAIMS-001, FR-IDENTITY-003 |
| Submit protection claim | Eligible case party | Conditional | Immutable accepted terms contain applicable active protection | FR-CLAIMS-002 |
| Submit protection claim without accepted protection | Any actor | Deny | Entitlement must exist in historical accepted snapshot | FR-CLAIMS-002 |
| Supply claim evidence | Claimant / authorized case party | Conditional | Exact claim scope; evidence intake/retention rules apply | FR-CLAIMS-003, NFR-PLATFORM-003 |
| Validate claim evidence completeness/state | Verification/claim staff | Conditional | Assigned claim scope and subject-matter permission | FR-CLAIMS-003, FR-IDENTITY-001 |
| Pause/extend claim deadline | Authorized reviewer/operations workflow | Conditional | Versioned policy permits it; reasoned audited event; original deadline preserved | FR-CLAIMS-003 |
| Silently replace original claim deadline | Any actor/system | Deny | Original deadline remains in history | FR-CLAIMS-003 |
| Decide medically/financially/legally sensitive claim | Claim/dispute reviewer with required subject scope | Conditional | Appropriate role + organization + subject scope + assignment; human decision required | FR-CLAIMS-004 |
| Decide medically sensitive claim without required clinical competence | Ordinary claim reviewer/admin | Deny | Subject-matter scope is mandatory | FR-CLAIMS-004 |
| Approve own originated decision where separation policy forbids it | Reviewer/owner | Deny | Separation of duties applies | FR-CLAIMS-004 |
| Appeal eligible claim/dispute decision | Authorized case party | Conditional | Appeal window and original policy snapshot permit it | FR-CLAIMS-005 |
| Decide claim appeal | Authorized independent reviewer | Conditional | Assignment and separation-of-duties rules pass; original decision preserved | FR-CLAIMS-005 |
| Rewrite original claim decision after appeal | Any actor | Deny | Original decision is immutable | FR-CLAIMS-005, NFR-AUDIT-003 |
| Execute approved refund/compensation through platform | Reviewer/finance/admin/system | Deny | Approval may create external action due, not money movement | FR-CLAIMS-001, FR-FINANCE-007 |

## 14. Operations, Work Queues, Reporting, and Audit

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| View operational work queue | Operations/verification/reviewer role | Conditional | Queue filtered to actor's role, organization, branch, subject, and workflow scope | FR-OPS-001, FR-IDENTITY-001 |
| Claim/assign work item | Authorized operations/queue actor | Conditional | Assignment capability and source-resource scope active | FR-OPS-001 |
| Reassign/escalate work item | Authorized operations supervisor/owner | Conditional | Explicit assignment/escalation grant; audited; escalation preserves the lifecycle state and changes only priority/assignment | FR-OPS-001, FR-AUDIT-001 |
| Start a work item | Assigned staff | Conditional | Item is `ASSIGNED` to the acting staff member | FR-OPS-001 |
| Start a work item assigned to someone else | Any staff actor | Deny | Start requires the acting staff member to hold the assignment | FR-OPS-001 |
| Move a work item to `WAITING` and resume it | Assigned staff | Conditional | A named external dependency is recorded as the blocking reason | FR-OPS-001 |
| Complete a work item | Assigned staff | Conditional | The underlying domain condition is resolved or the workflow reached its legitimate next state | FR-OPS-001 |
| Complete a work item whose domain condition is unresolved | Any staff actor | Deny | Closing the projection cannot fabricate the resolution | FR-OPS-001 |
| Reopen a completed work item | Authorized staff where policy permits | Conditional | Prior completion record is preserved; returns to `OPEN` or `ASSIGNED` by retained assignment | FR-OPS-001 |
| Use work-item assignment to gain unauthorized source-data access | Any staff actor | Deny | Source resource authorization remains independently enforced | FR-IDENTITY-001 |
| View operational report | Operations/management actor | Conditional | Report scope and underlying drill-down data authorization apply | FR-OPS-002, FR-IDENTITY-001 |
| Export report data | Authorized reporting actor | Conditional | Same or stricter authorization as source data; export audited when sensitive | FR-OPS-002, FR-AUDIT-001 |
| View sensitive audit trail | Authorized audit/compliance/operations actor | Conditional | Explicit purpose and target scope; protected payloads remain minimized | FR-AUDIT-001–002 |
| Modify/delete sensitive audit event | Human/admin/system | Deny | Audit history is append-only/immutable as required | FR-AUDIT-001, NFR-AUDIT-001 |
| Review integrity/reproduction exception | Authorized policy/audit/technical owner | Conditional | Explicit workflow assignment and subject scope | FR-POLICY-002, FR-AUDIT-002 |
| Resolve integrity exception by silently changing history | Any actor | Deny | Resolution is later auditable state/action | FR-POLICY-002, NFR-AUDIT-003 |

## 15. Private Evidence and Files

| Action | Actor | Access | Conditions | Requirement |
|---|---|---|---|---|
| Upload evidence | Actor authorized by owning domain action | Conditional | PDF/JPEG/PNG and approved size/count/type validation; exact purpose/owner recorded | NFR-PLATFORM-003 |
| Use evidence before required malware scan passes | Any domain workflow | Deny | Quarantine remains effective until required scan succeeds | NFR-PLATFORM-003 |
| View/download evidence | Patient/provider/staff/reviewer | Conditional | Fresh authorization for exact evidence/resource/purpose; download audited | NFR-PLATFORM-003, NFR-IDENTITY-001 |
| Reuse signed/private file URL after authorization expiry | Any actor | Deny | Short-lived access must be reauthorized | NFR-PLATFORM-003 |
| Delete evidence under active legal hold | Any actor/system | Deny | Legal hold blocks destruction | NFR-PLATFORM-004 |
| Process retention deletion | System automation / authorized privacy workflow | Conditional | Approved retention rule, no legal hold, destruction audited | NFR-PLATFORM-004 |
| Access raw object-store path because actor is admin | System administrator | Deny as business authorization | Storage administration cannot substitute for application authorization | NFR-PLATFORM-003, NFR-IDENTITY-001 |

Concrete evidence-storage and malware-scanning providers remain unresolved under `Q-PLATFORM-003` and `Q-OPS-001`.

## 16. System Automation Permissions

System automation is not a superuser. It may perform only deterministic actions delegated by approved rules.

| System Action | Access | Conditions | Requirement |
|---|---|---|---|
| Compute/recompute S/P/H/I and eligibility | Allow | Effective approved policies/facts/evidence; immutable decision written | FR-ELIG-002–005, FR-ELIG-011–015 |
| Suspend affected eligibility | Allow | Required dependency becomes invalid/expired/revoked/unavailable | FR-ELIG-003 |
| Revalidate booking before confirmation | Allow | Current publication/readiness/eligibility/capacity evaluated | FR-BOOKING-001 |
| Expire provider response/alternative window | Allow | Versioned deadline reached | FR-BOOKING-003 |
| Derive follow-up/reminder work | Allow | Accepted plan/policy establishes obligation | FR-CLINICAL-004 |
| Derive financial timeline/status | Allow | Derived only from immutable accepted terms and append-only events | FR-FINANCE-005–006 |
| Execute payment/refund | Deny | V1 record-only boundary | FR-FINANCE-007, NFR-FINANCE-001 |
| Close sensitive claim with autonomous high-impact decision | Deny | Appropriately scoped human reviewer required | FR-CLAIMS-004 |
| Deliver notification | Allow | Domain outcome already committed; delivery does not change authoritative business state | NFR-PLATFORM-008 |
| Process retention/deletion | Conditional | Approved policy; no legal hold; audited | NFR-PLATFORM-004 |

## 17. Separation of Duties

Separation of duties is mandatory whenever the governing policy requires independent review. At minimum, implementation must support these checks rather than relying on role labels alone:

- a medical launch approval requires a current independent licensed clinical reviewer credential;
- the same actor cannot satisfy a prohibited originator-and-approver combination;
- sensitive claim/dispute decisions must be assigned according to required subject-matter competence;
- an appeal must preserve the original decision and be routed according to the applicable independent-review policy;
- system administrators cannot self-grant a business scope and immediately bypass a policy requiring another accountable reviewer merely because they control account administration.

The exact separation combinations for every future policy domain are policy data, not hard-coded assumptions in this matrix.

## 18. Public vs Internal Data Exposure

### Public/patient-safe

May include:

- published catalog fields;
- eligible provider discovery data;
- patient-safe eligibility reasons;
- provider/service/branch identity and practical booking information;
- own case/terms/financial/review/claim data according to relationship and grant scope.

### Restricted internal

Requires explicit scoped authorization:

- raw internal risk `I`;
- private evidence and storage metadata;
- reviewer credential details beyond public-safe verification indicators;
- internal reviewer findings before they are authorized for case-party disclosure;
- staff assignments and operational notes;
- detailed audit/provenance records;
- protected identity and clinical information unrelated to the actor's authorized case/purpose.

A response serializer/resource must not rely on the client to hide restricted fields.

## 19. Interface Enforcement

The same decision must be enforced across:

- `/api/v1` REST endpoints;
- Filament pages/resources/actions;
- private evidence upload/download paths;
- queued jobs and scheduled commands;
- operational work queues;
- reports and exports;
- notifications containing sensitive references.

A permission allowed in one interface is not automatically allowed in another unless both resolve the same authoritative application authorization rule.

## 20. Implementation Guidance

The target Laravel implementation should use the existing stack without making package roles the whole authorization model:

- Spatie Permission may provide coarse role/capability assignment.
- Laravel policies/application authorization services should enforce resource and relationship scope.
- proposed `staff_scope_grants` and `guardian_grants` from `docs/database/ERD.md` provide domain scope/effective-period context.
- actions must authorize before mutation and re-check business preconditions inside the transactional correctness boundary where stale authorization/resource state matters.
- query builders/read models must be scope-aware so unauthorized rows are not fetched and merely hidden later.
- file authorization must resolve the owning business resource and purpose before granting temporary access.

Do not implement a universal `super_admin` bypass for protected clinical, financial, claim, evidence, or audit data unless a later explicit requirement authorizes one.

## 21. Testing Obligations for Phase 3

`docs/TESTING_STRATEGY.md` must create, for every materially distinct actor in this matrix, at least:

- one allowed-action authorization test; and
- one denied-action authorization test.

Additional required tests include:

- cross-patient and cross-clinic isolation;
- cross-branch identifier tampering;
- expired/revoked guardian grant denial;
- expired/revoked staff-scope denial;
- medical launch approval without current credential denial;
- direct final S/P/H/I editing denial;
- provider booking action outside branch scope denial;
- treatment-plan authorship by non-treating staff denial;
- sensitive claim decision without required subject competence denial;
- separation-of-duties conflict denial;
- private evidence access outside purpose/resource scope denial;
- administrator-without-domain-scope denial;
- zero-money-movement enforcement.

## 22. Explicit Non-Roles / No Standing Production Access

Current requirements do not establish direct application permissions for regulators, external auditors, developers, testers, database administrators, infrastructure administrators, or support engineers merely because they hold those job functions.

Any required production-data access for those actors must be introduced through a specific approved purpose, scoped authorization, audit requirement, and applicable privacy/legal basis. Until then the default is deny.

## 23. Open Permission Dependencies

| ID | Impact |
|---|---|
| Q-PLATFORM-001 | Full role/action reconciliation cannot be certified against unreadable SRS v1.1 text. |
| Q-CATALOG-001 | Medical production approval cannot be considered complete solely from provisional catalog data. |
| Q-ELIG-001 | Clinical eligibility formulas and reviewer-governed production policy still require licensed approval. |
| Q-PLATFORM-002 | Final legal retention/deletion authorization conditions remain subject to legal validation. |
| Q-PLATFORM-003 | Resolved 2026-08-25 for interaction and authorization purposes by `PO-UX-17`: the evidence-transfer contract and its authorization points are provider-neutral. Concrete OTP/MFA, evidence-storage, malware-scan and notification vendor selection moved to `Q-OPS-001`. |
| Q-OPS-001 | Infrastructure/provider administration model is not yet selected. |

## 24. Requirement Coverage

This matrix materially covers authorization requirements for:

- FR-IDENTITY-001–003;
- FR-CATALOG-001;
- FR-ELIG-001–017;
- FR-BOOKING-001–003;
- FR-CLINICAL-001–005;
- FR-FINANCE-001–007;
- FR-REVIEWS-001–002;
- FR-CLAIMS-001–005;
- FR-OPS-001–003;
- FR-POLICY-001–002;
- FR-AUDIT-001–003;
- NFR-IDENTITY-001–002;
- NFR-PLATFORM-003–004;
- NFR-FINANCE-001;
- NFR-AUDIT-001–003.

No new canonical IDs are allocated by this document.