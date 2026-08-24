# UberTib Data Flow Diagrams

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/COMPONENT_DESIGN.md`  
**Data source:** `docs/database/ERD.md`  
**API source:** `docs/api/API_CONTRACTS.md`  
**Registry:** `docs/README.md`

## 1. Purpose and Scope

This document defines the information flows required by UberTib V1. It complements `docs/database/ERD.md`: the ERD owns relational structure, while this file shows how information moves between actors, application processes, and authoritative data stores.

The diagrams intentionally focus on flows where ordering, provenance, authorization, or information transformation matters. Trivial create/read/update/delete interactions are omitted.

Two product boundaries apply to every flow:

- production medical behavior requires licensed clinical approval and versioned governance;
- UberTib V1 records externally performed financial activity but performs no electronic payment, wallet, escrow, settlement, payout, custody, or refund transfer.

`Q-PLATFORM-001` remains a Blocker for claiming complete reconciliation against readable SRS v1.1 text. `Q-CATALOG-001`, `Q-ELIG-001`, `Q-PLATFORM-002`, `Q-PLATFORM-003`, and `Q-OPS-001` continue to govern production clinical, retention, provider, and infrastructure details.

## 2. DFD Conventions

- **External entity** — a person, role group, or provider outside the UberTib application process boundary.
- **Process** — an UberTib application/domain capability that transforms, validates, or routes information.
- **Data store** — an authoritative or durable logical store represented physically by one or more ERD tables.
- **Derived view** — rebuildable/read-only information assembled from authoritative stores.
- **Provider adapter** — an external delivery/storage/scanning boundary whose concrete vendor is not selected.

The diagrams use logical stores rather than duplicating every table name. Section 4 maps each logical store to the ERD.

## 3. System Context DFD

```mermaid
flowchart LR
    PATIENT[Patient / Authorized Guardian]
    PROVIDER[Dental Provider / Clinic Staff]
    REVIEWER[Verifier / Licensed Clinical Reviewer]
    STAFF[UberTib Operations / Finance / Claims / Policy / Admin]
    NOTIFY[Notification / OTP Provider Adapter]
    STORAGE[Private Storage / Malware Scan Adapter]

    SYSTEM((UberTib V1 Platform))

    PATIENT -->|identity facts, booking requests, plan acceptance, evidence, financial assertions, reviews, claims| SYSTEM
    SYSTEM -->|catalog, eligible providers, booking/case state, accepted terms, timelines, decisions, reminders| PATIENT

    PROVIDER -->|provider facts, service activation data, availability, booking responses, clinician-authored plans, stage evidence| SYSTEM
    SYSTEM -->|work items, eligibility results, booking/case context, required evidence, operational outcomes| PROVIDER

    REVIEWER -->|verified facts, credential evidence, launch approvals, governed decisions| SYSTEM
    SYSTEM -->|review scope, submitted evidence, policy/version context, blockers| REVIEWER

    STAFF -->|policy versions, work decisions, claim/review decisions, financial confirmations, operational actions| SYSTEM
    SYSTEM -->|queues, reports, exceptions, audit context, deadlines| STAFF

    SYSTEM -->|delivery intent only| NOTIFY
    NOTIFY -->|delivery result metadata| SYSTEM

    SYSTEM -->|private object transfer / scan request| STORAGE
    STORAGE -->|object / scan-state metadata| SYSTEM
```

There is intentionally **no payment gateway or money-transfer entity** in the context diagram.

## 4. Logical Data Stores

| Store | Logical responsibility | Main ERD tables |
|---|---|---|
| D1 — Identity & Authorization | identities, verified contacts, guardian grants, staff/provider scope | `users`, `identity_contacts`, `contact_verification_challenges`, `guardian_grants`, `providers`, `clinics`, `branches`, `provider_branch_assignments`, `staff_scope_grants` |
| D2 — Catalog & Policy | stable services, versioned definitions, policy versions, launch governance | `service_groups`, `services`, `service_definitions`, `policy_versions`, `clinical_reviewer_credentials`, `service_launch_gates` |
| D3 — Evidence | private evidence metadata, scan state, resource binding, legal hold | `evidence_items`, `evidence_bindings`, `legal_holds` |
| D4 — Eligibility | source facts, price facts, activation requests, computed immutable decisions/gates | `service_activation_requests`, `approved_facts`, `provider_service_prices`, `eligibility_decisions`, `eligibility_gate_results` |
| D5 — Booking & Clinical Case | capacity, booking lifecycle, treatment/case/follow-up history | `appointment_slots`, `bookings`, `booking_alternatives`, `booking_events`, `cases`, `treatment_plan_versions`, `treatment_plan_stages`, `accepted_treatment_snapshots`, `case_treatment_stages`, `follow_ups` |
| D6 — Financial Records | immutable accepted financial terms and append-only external financial facts | `financial_terms_snapshots`, `financial_events` |
| D7 — Reviews & Claims | verified reviews, appeals, claims, deadlines, human decisions | `reviews`, `review_appeals`, `claims`, `claim_deadline_events`, `claim_decisions`, `claim_appeals` |
| D8 — Audit & Operations | idempotency, work queues, audit/provenance, notifications, integrity exceptions | `work_items`, `audit_events`, `idempotency_records`, `integrity_exceptions`, `notification_intents` |

Framework cache/session/job tables are operational implementation details and are not separate business data stores in this DFD.

## 5. Level 0 DFD — V1 Business Information Flow

```mermaid
flowchart TD
    PATIENT[Patient / Guardian]
    PROVIDER[Provider / Clinic]
    REVIEWER[Verifier / Clinical Reviewer]
    STAFF[UberTib Staff]

    P1((P1 Identity & Access))
    P2((P2 Catalog, Evidence & Eligibility))
    P3((P3 Booking & Clinical Case))
    P4((P4 External Financial Records))
    P5((P5 Reviews, Claims & Appeals))
    P6((P6 Policy, Operations & Audit))

    D1[(D1 Identity & Authorization)]
    D2[(D2 Catalog & Policy)]
    D3[(D3 Evidence)]
    D4[(D4 Eligibility)]
    D5[(D5 Booking & Clinical Case)]
    D6[(D6 Financial Records)]
    D7[(D7 Reviews & Claims)]
    D8[(D8 Audit & Operations)]

    PATIENT -->|verification / representation data| P1
    P1 -->|authenticated / scoped context| PATIENT
    PROVIDER -->|identity / scope data| P1
    STAFF -->|role and scope administration| P1
    P1 <--> D1

    PATIENT -->|service discovery criteria| P2
    PROVIDER -->|activation facts, prices, evidence| P2
    REVIEWER -->|fact verification / clinical approvals| P2
    P2 -->|catalog / eligibility explanation| PATIENT
    P2 -->|eligibility / blockers| PROVIDER
    P2 <--> D2
    P2 <--> D3
    P2 <--> D4

    PATIENT -->|booking request / acceptance / cancellation| P3
    PROVIDER -->|booking response / treatment plan / stage completion| P3
    P3 -->|booking / case / treatment state| PATIENT
    P3 -->|case work / patient decisions| PROVIDER
    P3 <--> D4
    P3 <--> D5
    P3 <--> D3

    PATIENT -->|external payment/refund assertions| P4
    PROVIDER -->|counterparty confirmation/dispute| P4
    STAFF -->|authorized financial review / external-action follow-up| P4
    P4 -->|financial timeline / confirmation state| PATIENT
    P4 -->|financial timeline / follow-up state| PROVIDER
    P4 <--> D5
    P4 <--> D6
    P4 <--> D3

    PATIENT -->|review / refund request / protection claim / appeal| P5
    PROVIDER -->|review appeal / claim evidence where authorized| P5
    STAFF -->|human review / decision / appeal review| P5
    P5 -->|claim, review and appeal state| PATIENT
    P5 -->|decision / required response state| PROVIDER
    P5 <--> D5
    P5 <--> D6
    P5 <--> D7
    P5 <--> D3

    REVIEWER -->|governed approval / decision| P6
    STAFF -->|policy / work assignment / escalation| P6
    P6 -->|work queues / exceptions / reporting| STAFF
    P6 <--> D2
    P6 <--> D8

    P1 -->|audit / security events| D8
    P2 -->|audit / work / notification intents| D8
    P3 -->|audit / work / notification intents| D8
    P4 -->|audit / work / notification intents| D8
    P5 -->|audit / work / notification intents| D8
```

## 6. Level 1 — Identity Verification and Representation

**Requirements:** FR-IDENTITY-002–003, NFR-IDENTITY-001–002, NFR-AUDIT-001–002.  
**APIs:** API-IDENTITY-001–005 where the mobile/API path is used.

This flow matters because authentication, patient ownership, and guardian acting identity must remain separate and auditable.

```mermaid
flowchart LR
    USER[Patient / Guardian]
    OTP[OTP Provider Adapter]
    P11((P1.1 Create Verification Challenge))
    P12((P1.2 Verify Challenge & Activate Identity))
    P13((P1.3 Create / Revoke Representation Grant))
    AUTH((Authorization Scope Resolver))

    D1[(D1 Identity & Authorization)]
    D8[(D8 Audit & Operations)]

    USER -->|normalized phone/contact| P11
    P11 -->|challenge hash, limits, expiry| D1
    P11 -->|OTP delivery intent| OTP
    OTP -->|delivery metadata| P11
    P11 -->|challenge id / safe resend timing| USER

    USER -->|challenge id + OTP| P12
    D1 -->|challenge state / attempt history| P12
    P12 -->|consumed challenge + verified contact + activated identity| D1
    P12 -->|success / safe failure| USER
    P12 -->|audit result| D8

    USER -->|subject, grantee, actions, scope, purpose, basis| P13
    AUTH -->|grant authorization decision| P13
    P13 -->|effective grant / revocation history| D1
    P13 -->|grant state| USER
    P13 -->|audit event| D8
```

**Critical rules**

- OTP values are never stored or returned in plaintext.
- Resend invalidates the prior OTP without silently resetting accumulated failure controls.
- A guardian acts as the guardian identity; the patient remains the case owner.
- Revocation affects future authorization immediately while historical actions remain attributed and auditable.

## 7. Level 1 — Provider Service Activation and Eligibility

**Requirements:** FR-ELIG-002–017, FR-POLICY-001–002, FR-OPS-003, NFR-AUDIT-003.  
**APIs:** API-ELIG-002–004 where externally exposed.

This flow is central to the project because providers supply facts/evidence while the backend derives classification and eligibility. No actor directly selects final `S`, `P`, `H`, or `I` outcomes.

```mermaid
flowchart TD
    PROVIDER[Provider / Clinic]
    VERIFIER[Verifier]
    CLINICAL[Licensed Clinical Reviewer]

    P21((P2.1 Capture Activation Facts & Evidence))
    P22((P2.2 Validate / Verify Evidence & Facts))
    P23((P2.3 Resolve Versioned Policy Inputs))
    P24((P2.4 Compute S / P / H / I Components))
    P25((P2.5 Evaluate Mandatory Gates))
    P26((P2.6 Commit Immutable Eligibility Decision))

    D2[(D2 Catalog & Policy)]
    D3[(D3 Evidence)]
    D4[(D4 Eligibility)]
    D8[(D8 Audit & Operations)]

    PROVIDER -->|service, branch, questionnaire facts, price facts, evidence refs| P21
    P21 -->|activation request / source facts| D4
    P21 -->|evidence metadata / bindings| D3

    VERIFIER -->|verification result / reason| P22
    CLINICAL -->|governed clinical approval where required| P22
    D3 -->|scan / evidence state| P22
    P22 -->|approved / rejected / pending fact state| D4
    P22 -->|work/audit outcome| D8

    D2 -->|service definition, policy versions, launch gates| P23
    D4 -->|effective verified facts and price facts| P23
    P23 -->|exact versioned inputs| P24

    P24 -->|computed component values + confidence + provenance| P25
    D2 -->|gate rules / readiness policy| P25
    P25 -->|gate results + controlling reason| P26
    P26 -->|immutable eligibility snapshot and gate results| D4
    P26 -->|audit / recalculation notification intent| D8

    P26 -->|practical result / blockers; no editable final code| PROVIDER
```

**Critical rules**

- `PENDING_EVALUATION` is different from scientific grade `F`.
- `I` is internal and not exposed as a patient rating.
- Production S/P/H/I formulas, weights, thresholds, and defaults remain governed by `Q-ELIG-001`.
- A passing component cannot override a failing or pending mandatory gate.
- Corrections create new facts and a new eligibility decision rather than rewriting historical decisions.

## 8. Level 1 — Patient Discovery and Booking

**Requirements:** FR-CATALOG-001, FR-ELIG-001, FR-ELIG-005–006, FR-BOOKING-001–003, NFR-AUDIT-002.  
**APIs:** API-CATALOG-001, API-ELIG-001–002, API-BOOKING-001–005.

```mermaid
flowchart TD
    PATIENT[Patient / Guardian]
    PROVIDER[Provider / Clinic]

    P31((P3.1 Publish Safe Catalog & Eligible Provider View))
    P32((P3.2 Submit Booking Request))
    P33((P3.3 Revalidate Readiness / Eligibility / Capacity))
    P34((P3.4 Provider Response))
    P35((P3.5 Patient Accept Alternative if Offered))
    P36((P3.6 Confirm / Cancel / Expire Booking))

    D1[(D1 Identity & Authorization)]
    D2[(D2 Catalog & Policy)]
    D4[(D4 Eligibility)]
    D5[(D5 Booking & Clinical Case)]
    D8[(D8 Audit & Operations)]

    D2 -->|production-visible services| P31
    D4 -->|current passing provider/service/branch decisions| P31
    D5 -->|availability projection| P31
    P31 -->|catalog, eligible providers, safe explanation| PATIENT

    PATIENT -->|provider, branch, service, slot, acting context| P32
    D1 -->|patient/guardian authorization| P32
    P32 -->|proposed booking context| P33

    D2 -->|current publication/readiness| P33
    D4 -->|current eligibility| P33
    D5 -->|transactional slot capacity| P33
    P33 -->|booking request + eligibility reference + deadline| D5
    P33 -->|provider work/notification intent| D8

    PROVIDER -->|accept, reject+reason, or alternative slot| P34
    D5 -->|booking state + deadline| P34
    P34 -->|provider response / alternative| D5
    P34 -->|result state| PATIENT

    PATIENT -->|alternative acceptance| P35
    P35 -->|revalidation command| P33

    PATIENT -->|cancel request where allowed| P36
    D2 -->|booking/cancellation policy version| P36
    D5 -->|current lifecycle state| P36
    P36 -->|append-only booking event / capacity release / final state| D5
    P36 -->|audit / downstream work| D8
```

**Critical rules**

- Search/discovery output is not sufficient for booking correctness; final confirmation revalidates safety-critical facts.
- Capacity protection is transactional and must resist concurrent overbooking.
- A provider alternative is not confirmed until patient acceptance and revalidation succeed.
- Cancellation/no-show consequences are recorded as later events and do not rewrite previous clinical or financial history.

## 9. Level 1 — Treatment Plan Acceptance and Case Progress

**Requirements:** FR-CLINICAL-001–005, FR-FINANCE-001, NFR-AUDIT-003.  
**APIs:** API-CLINICAL-001–004, API-FINANCE-001.

```mermaid
flowchart TD
    PROVIDER[Clinician / Clinic]
    PATIENT[Patient / Guardian]

    P41((P3.7 Author Versioned Treatment Plan))
    P42((P3.8 Validate Plan Completeness))
    P43((P3.9 Accept Plan & Terms))
    P44((P3.10 Progress Treatment Stage))
    P45((P3.11 Schedule Follow-Up / Build Timeline))

    D2[(D2 Catalog & Policy)]
    D3[(D3 Evidence)]
    D5[(D5 Booking & Clinical Case)]
    D6[(D6 Financial Records)]
    D8[(D8 Audit & Operations)]

    PROVIDER -->|clinician-authored plan, stages, prices, inclusions/exclusions| P41
    P41 -->|new plan version| D5
    D2 -->|service/policy requirements| P42
    D5 -->|plan version| P42
    P42 -->|complete proposed plan| PATIENT

    PATIENT -->|explicit acceptance of exact plan version| P43
    D5 -->|proposed plan content/hash| P43
    D2 -->|governing policy versions| P43
    P43 -->|immutable accepted treatment snapshot| D5
    P43 -->|immutable financial terms snapshot| D6
    P43 -->|acceptance audit| D8

    PROVIDER -->|stage evidence / completion facts| P44
    D5 -->|accepted stage requirements| P44
    D3 -->|validated evidence state| P44
    P44 -->|stage state / completion history| D5
    P44 -->|audit / follow-up trigger| D8

    D5 -->|accepted plan / completed stages / due rules| P45
    D2 -->|follow-up policy| P45
    P45 -->|follow-up obligations| D5
    P45 -->|reminder intents| D8
    P45 -->|authorized case timeline| PATIENT
```

**Critical rules**

- The treatment plan is clinician-authored; UberTib does not autonomously diagnose or generate a treatment plan.
- Acceptance binds the exact plan version and creates immutable clinical and financial snapshots.
- Amendments create linked new versions/snapshots rather than editing previously accepted terms.
- Stage completion uses the accepted historical requirements, not mutable current defaults.

## 10. Level 1 — External Financial Event Recording

**Requirements:** FR-FINANCE-001–007, NFR-FINANCE-001, NFR-AUDIT-002–003.  
**APIs:** API-FINANCE-001–005.

This is a record-and-confirmation flow only. The platform never initiates the monetary transaction described by the record.

```mermaid
flowchart TD
    ASSERTOR[Patient or Authorized Case Party]
    COUNTERPARTY[Authorized Counterparty]
    FINANCE[Scoped Finance / Operations Reviewer]

    P51((P4.1 Validate Governing Accepted Terms))
    P52((P4.2 Record External Financial Assertion))
    P53((P4.3 Confirm or Dispute Assertion))
    P54((P4.4 Record External Refund / Compensation Execution))
    P55((P4.5 Derive Financial Timeline & Follow-Up))

    D3[(D3 Evidence)]
    D5[(D5 Booking & Clinical Case)]
    D6[(D6 Financial Records)]
    D8[(D8 Audit & Operations)]

    ASSERTOR -->|amount, currency, external method category, occurred time, evidence| P51
    D5 -->|case identity / parties| P51
    D6 -->|immutable accepted financial terms| P51
    P51 -->|validated assertion context| P52
    D3 -->|evidence state| P52
    P52 -->|append-only reported event| D6
    P52 -->|counterparty review intent| D8

    COUNTERPARTY -->|confirm or dispute + reason/evidence| P53
    D6 -->|original immutable assertion| P53
    P53 -->|append-only response event| D6
    P53 -->|dispute/follow-up work| D8

    FINANCE -->|authorized review / external-execution follow-up| P54
    D6 -->|approved refund/compensation decision context| P54
    P54 -->|external execution assertion only| D6
    P54 -->|confirmation work| D8

    D6 -->|ordered event history| P55
    P55 -->|agreed / reported / confirmed / disputed / pending-external-execution view| ASSERTOR
    P55 -->|same role-filtered financial state| COUNTERPARTY
```

**Explicitly absent flows**

- no payment authorization request;
- no card/bank credential submission for payment execution;
- no wallet or balance update;
- no escrow/custody movement;
- no payout/settlement instruction;
- no UberTib-executed refund.

## 11. Level 1 — Verified Review, Refund Request, Claim, and Appeal

**Requirements:** FR-REVIEWS-001–002, FR-CLAIMS-001–005, FR-FINANCE-004, FR-FINANCE-007.  
**APIs:** API-REVIEWS-001–002, API-CLAIMS-001–005.

```mermaid
flowchart TD
    PATIENT[Patient / Authorized Guardian]
    PROVIDER[Provider / Authorized Appellant]
    REVIEWER[Authorized Human Reviewer]

    P61((P5.1 Validate Experience / Claim Eligibility))
    P62((P5.2 Create Review / Refund Request / Protection Claim))
    P63((P5.3 Collect Evidence & Track Deadline))
    P64((P5.4 Human Decision))
    P65((P5.5 Appeal Original Decision))
    P66((P5.6 Create External Follow-Up Obligation if Applicable))

    D2[(D2 Catalog & Policy)]
    D3[(D3 Evidence)]
    D5[(D5 Booking & Clinical Case)]
    D6[(D6 Financial Records)]
    D7[(D7 Reviews & Claims)]
    D8[(D8 Audit & Operations)]

    PATIENT -->|review / refund / protection claim facts| P61
    PROVIDER -->|review appeal facts where authorized| P61
    D5 -->|verified completed experience / case state| P61
    D6 -->|accepted financial/protection snapshot| P61
    D2 -->|eligibility/deadline policy version| P61

    P61 -->|eligible submission context| P62
    P62 -->|review or claim record| D7
    P62 -->|work item| D8

    PATIENT -->|evidence| P63
    PROVIDER -->|evidence where authorized| P63
    D3 -->|scan/validation state| P63
    D2 -->|evidence/deadline rules| P63
    P63 -->|evidence bindings + append-only deadline events| D3
    P63 -->|deadline history / completeness state| D7

    REVIEWER -->|reasoned human decision| P64
    D7 -->|claim/review facts and deadline history| P64
    D3 -->|authorized evidence| P64
    D2 -->|governing historical policy| P64
    P64 -->|immutable decision| D7
    P64 -->|audit / required follow-up| D8

    PATIENT -->|appeal grounds + evidence| P65
    PROVIDER -->|appeal where policy permits| P65
    D7 -->|original immutable decision| P65
    D2 -->|historical appeal policy| P65
    P65 -->|appeal record without rewriting original decision| D7
    P65 -->|separation-of-duties review work| D8

    D7 -->|approved refund/compensation obligation| P66
    P66 -->|external-action-due state only| D8
    P66 -->|financial status context| D6
```

**Critical rules**

- Review `R` is separate from `S/P/H/I`.
- One active review is tied to one verified eligible experience according to policy.
- Sensitive medical/legal/high-impact financial decisions are human-attributed.
- Deadline extensions/pauses create additional events and do not erase the original deadline.
- An approved refund/compensation decision may create an externally executable obligation but never causes UberTib to transfer funds.

## 12. Level 1 — Private Evidence Intake and Access

**Requirements:** NFR-PLATFORM-003, NFR-PLATFORM-004 and evidence-bearing FRs.  
**Contract status:** detailed `API-PLATFORM-*` transfer contract remains intentionally unallocated pending `Q-PLATFORM-003` / `Q-OPS-001`.

```mermaid
flowchart LR
    ACTOR[Authorized User]
    STORAGE[Private Storage Adapter]
    SCANNER[Malware Scan Adapter]

    P71((P7.1 Validate Intake Metadata & File Type))
    P72((P7.2 Store in Quarantine & Hash))
    P73((P7.3 Scan and Update Evidence State))
    P74((P7.4 Bind Evidence to Authorized Domain Resource))
    P75((P7.5 Authorize Download / Retention Action))

    D1[(D1 Identity & Authorization)]
    D3[(D3 Evidence)]
    D8[(D8 Audit & Operations)]

    ACTOR -->|PDF/JPEG/PNG + purpose| P71
    D1 -->|scope / purpose authorization| P71
    P71 -->|validated upload| P72
    P72 -->|private object| STORAGE
    P72 -->|object metadata + SHA-256 + quarantine state| D3

    STORAGE -->|object reference| P73
    P73 -->|scan request| SCANNER
    SCANNER -->|clean / rejected / failed metadata| P73
    P73 -->|scan state| D3
    P73 -->|failure/work signal| D8

    D3 -->|clean usable evidence| P74
    P74 -->|purpose-bound evidence relation| D3

    ACTOR -->|download / destruction request| P75
    D1 -->|fresh authorization| P75
    D3 -->|scan state / ownership / legal hold / retention state| P75
    P75 -->|short-lived access or denial / governed destruction| STORAGE
    P75 -->|audited result| D8
```

No provider-specific presigned, multipart, chunked, or resumable protocol is defined here.

## 13. Level 1 — Policy Activation, Launch Readiness, and Recalculation

**Requirements:** FR-POLICY-001–002, FR-OPS-003, FR-ELIG-003–006, NFR-AUDIT-003.

```mermaid
flowchart TD
    POLICY[Authorized Policy Owner]
    CLINICAL[Licensed Clinical Reviewer]
    OPS[Legal / Operational / Technical Approver]

    P81((P6.1 Draft Versioned Policy / Definition))
    P82((P6.2 Record Evidence-Bound Approval))
    P83((P6.3 Evaluate Launch Readiness))
    P84((P6.4 Activate Effective Version))
    P85((P6.5 Resolve Affected Eligibility Scopes))
    P86((P6.6 Recalculate into New Immutable Decisions))
    P87((P6.7 Reproduce Historical Decision / Detect Integrity Mismatch))

    D2[(D2 Catalog & Policy)]
    D4[(D4 Eligibility)]
    D8[(D8 Audit & Operations)]

    POLICY -->|versioned rule content + source| P81
    P81 -->|draft definition/policy + hash| D2

    CLINICAL -->|medical approval + credential evidence| P82
    OPS -->|legal / operational / technical decisions| P82
    P82 -->|append-only approval/decision history| D2

    D2 -->|required gates + current decisions| P83
    P83 -->|ready / blocked with reason| P84
    P84 -->|activated/effective immutable version| D2
    P84 -->|activation audit| D8

    D2 -->|changed policy/service/credential dependency| P85
    P85 -->|affected provider/service/branch set| P86
    D4 -->|current facts/evidence context| P86
    D2 -->|new effective policy| P86
    P86 -->|new immutable eligibility decisions| D4
    P86 -->|failure/retry work| D8

    D2 -->|historical policy/version| P87
    D4 -->|historical snapshot/result| P87
    P87 -->|integrity mismatch exception if any| D8
```

The current implemented service-definition/launch-gate slice is evidence for this pattern. Production medical publication still depends on licensed clinical approval; the 26 evaluation records are not production-ready merely because they exist in the database.

## 14. Derived Read Flows

The following outputs are derived views and are not separate authoritative stores:

| Derived output | Authoritative inputs | Requirements |
|---|---|---|
| Eligible provider search | D2 + D4 + relevant D5 availability | FR-ELIG-001, FR-ELIG-005–006 |
| Unified case timeline | D5 + authorized D6 + D7 metadata + D8 attribution where required | FR-CLINICAL-005, FR-AUDIT-002 |
| Financial timeline | D6 + accepted terms context from D5 | FR-FINANCE-006–007 |
| Operations queues | underlying D2/D3/D4/D5/D6/D7 state + D8 coordination records | FR-OPS-001 |
| Operational reports | authoritative domain records with explicit filters/time windows | FR-OPS-002 |

A stale projection may improve read performance but must never override synchronous validation for booking confirmation, permission revocation, expired eligibility, launch readiness, or sensitive decisions.

## 15. Audit and Notification Flow Rule

For all Level 1 processes:

1. authoritative domain state is committed first when the business outcome must be durable;
2. required audit/provenance/idempotency information is committed atomically where necessary;
3. non-critical notification delivery is dispatched after commit;
4. notification delivery failure changes delivery/operations state, not the already committed business decision;
5. logs and notification payloads must exclude secrets, OTP values, private storage paths, temporary access links, and unnecessary clinical/financial payloads.

## 16. Authorization Boundaries

Information flow is denied by default. Every protected flow resolves the actor plus applicable organization/clinic/branch, patient/case relationship, guardian grant, work responsibility, purpose, and separation-of-duties requirement.

Cross-scope requests may be returned as not found when existence itself is protected. Client-side hiding is never an authorization control.

## 17. Weak-Connectivity Behavior

`NFR-PLATFORM-006` affects information transport but not authoritative truth:

- clients may retry safe reads and idempotent writes;
- retry-prone writes use the idempotency rules from `API_CONTRACTS.md`;
- drafts may be retained client-side or server-side where the final workflow allows it, but a draft is not a committed booking, accepted treatment plan, financial event, or claim;
- asynchronous upload/retry support must preserve evidence hash, ownership, purpose, and scan state;
- cached discovery data cannot replace booking-time validation.

## 18. Current Implementation vs Target DFD

| Area | Current verified information flow | V1 target status |
|---|---|---|
| Catalog | Public request → `ListVisibleServiceGroups` → existing catalog/launch data → API response | Existing narrow slice |
| Launch governance | Service definition + credential + launch-gate actions → append-only readiness state | Existing narrow slice / extend |
| Identity/guardian | Framework user baseline only | Proposed |
| Provider eligibility | Not verified as implemented | Proposed / clinically governed |
| Booking/case | Not verified as implemented | Proposed |
| Financial records | Configuration intent only; no money movement | Proposed record-only flow |
| Reviews/claims | Not verified as implemented | Proposed |
| Private evidence lifecycle | Supporting package capability exists; compliant business flow not verified | Proposed / provider-neutral |
| Operations/audit | Framework/package support exists; full V1 business flow not verified | Proposed / extend |

## 19. Requirement Coverage

| Flow | Primary coverage |
|---|---|
| Identity verification / representation | FR-IDENTITY-002–003, NFR-IDENTITY-001–002 |
| Provider activation / eligibility | FR-ELIG-002–017, FR-POLICY-001–002, FR-OPS-003 |
| Discovery / booking | FR-CATALOG-001, FR-ELIG-001, FR-BOOKING-001–003 |
| Treatment / case progress | FR-CLINICAL-001–005, FR-FINANCE-001 |
| External financial records | FR-FINANCE-001–007, NFR-FINANCE-001 |
| Reviews / claims / appeals | FR-REVIEWS-001–002, FR-CLAIMS-001–005 |
| Evidence lifecycle | NFR-PLATFORM-003–004 plus evidence-bearing FRs |
| Policy / launch / recalculation | FR-POLICY-001–002, FR-OPS-003, FR-ELIG-003–006 |
| Audit / retries / notifications | FR-AUDIT-001–003, NFR-AUDIT-001–003, NFR-PLATFORM-008 |

## 20. Open Items Affecting Data Flow

| ID | Severity | DFD impact |
|---|---|---|
| Q-PLATFORM-001 | Blocker | Complete SRS-to-flow reconciliation cannot yet be certified. |
| Q-CATALOG-001 | Major | Production catalog flow cannot treat provisional records as clinically approved. |
| Q-ELIG-001 | Major | Production S/P/H/I calculation inputs/thresholds remain clinically governed. |
| Q-PLATFORM-002 | Major | Retention/destruction flow needs final legal/compliance validation. |
| Q-OPS-001 | Major | Concrete hosting/storage/queue topology remains provider-neutral. |
| Q-PLATFORM-003 | Major | OTP/MFA, storage, malware-scan and notification provider contracts remain unresolved. |
| CONFLICT-PLATFORM-001 | Major | Historical stack assumptions do not override the verified Laravel/PHP baseline. |
| CONFLICT-CATALOG-001 | Major | Registry wording should be reviewed because current route and current OpenAPI now align. |
| CONFLICT-PLATFORM-002 | Major | Final NFR vs DR/TD classification awaits complete SRS reconciliation. |

## 21. Document Boundary

This file does not define:

- database columns or indexes beyond what is owned by `docs/database/ERD.md`;
- exact lifecycle statuses, which are owned by `docs/domain/STATE_MACHINES.md`;
- role/action authorization decisions, which are owned by `docs/domain/PERMISSIONS_MATRIX.md`;
- endpoint field-level contracts, which are owned by `docs/api/API_CONTRACTS.md`;
- stable error behavior, which is owned by `docs/api/ERROR_CATALOG.md`;
- screen layout, navigation, information architecture, or visual design, which remain deferred to the UX pipeline.

No new canonical `DR-*`, `TD-*`, `ASM-*`, `API-*`, `ERR-*`, or `SCR-*` identifiers are introduced by this DFD.