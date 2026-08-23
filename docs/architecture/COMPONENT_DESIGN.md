# UberTib Component Design

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-23  
**Product source:** `docs/PRD.md`  
**Technical source:** `docs/SDD.md`  
**System architecture:** `docs/architecture/SYSTEM_ARCHITECTURE.md`  
**Registry:** `docs/README.md`

## 1. Purpose

This document defines the application-component boundaries required to implement UberTib V1 inside the approved modular Laravel monolith. It refines the module-level design from `docs/SDD.md` and `docs/architecture/SYSTEM_ARCHITECTURE.md` without redefining product behavior.

The design distinguishes:

- **Existing** — verified in the current repository.
- **Extend** — existing convention/component should be expanded.
- **New** — required by confirmed product requirements but not currently implemented.
- **Governed** — implementation may exist only after the relevant clinical, legal, or operational approval is satisfied.

Two hard boundaries apply to every component:

1. production medical behavior requires licensed clinical approval; and
2. UberTib V1 records external financial events but performs no electronic money movement.

`Q-PLATFORM-001` remains a Blocker for claiming complete reconciliation against readable SRS v1.1 content.

## 2. Component Model

Each business capability follows the same framework-neutral internal shape where applicable:

```text
HTTP / Filament Adapter
        ↓
Application Action or Query
        ↓
Authorization + Preconditions
        ↓
Domain Model / Domain Service
        ↓
Eloquent Persistence + Constraints
        ↓
Audit / Domain Follow-up / Queue after commit
```

Controllers, API resources, Filament resources/pages/actions, jobs, and notification handlers are adapters. They must not become independent owners of business rules.

## 3. Existing Repository Conventions to Preserve

The current backend already establishes these conventions and they should be extended rather than replaced:

- Laravel application under `UberTip-Backend/`.
- Eloquent models and migrations.
- Application Actions for use cases.
- API controllers/resources with `/api/v1` routing.
- Domain enums/data objects.
- Filament panel shell.
- Pest tests.
- Spatie Permission for coarse capabilities.
- Spatie Activitylog for supporting audit concerns.
- Spatie Media Library for file/media capabilities where it can satisfy the private-evidence rules.
- Laravel queues, cache, logging, mail, and configuration facilities.

Verified current catalog/governance components include:

- `ServiceGroup`.
- `Service`.
- `ServiceDefinition`.
- `ClinicalReviewerCredential`.
- `ServiceLaunchGate`.
- `ListVisibleServiceGroups`.
- `PublishServiceDefinition`.
- `RecordServiceLaunchGateApproval`.
- `RecordServiceLaunchGateDecision`.

The verified public API currently exposes only `GET /api/v1/catalog/service-groups`.

## 4. Cross-Cutting Component Rules

Every sensitive application action must apply the following sequence where relevant:

1. authenticate actor;
2. resolve role and resource scope;
3. validate request syntax;
4. load the exact current or historical policy/snapshot required by the use case;
5. validate business preconditions;
6. resolve idempotency for retry-prone commands;
7. start a transaction when multiple writes form one outcome;
8. lock or rely on uniqueness constraints where contention matters;
9. persist authoritative state plus required immutable snapshot/event/audit data;
10. commit;
11. dispatch non-critical asynchronous work after commit.

No asynchronous delivery or background job may be treated as completed business state before the authoritative transaction commits.

## 5. Identity and Access Components

**Requirements:** FR-IDENTITY-001–003, NFR-IDENTITY-001–002.

### 5.1 Identity Account Component — Extend

**Responsibility**

- Maintain the authenticated application identity.
- Associate the identity with patient, dentist, clinic/staff, reviewer, finance, policy, operations, or administration responsibilities without creating independent authentication stacks.
- Prevent duplicate active patient identities for the same verified identity according to the approved account rules.

**Primary collaborators**

- Contact Verification component.
- Authorization Scope component.
- Guardian Grant component.
- Audit component.

### 5.2 Contact Verification / OTP Component — New

**Responsibility**

- Create hashed, single-use contact-verification challenges.
- Enforce the approved expiry, attempt, resend, and throttling constraints from `NFR-IDENTITY-002`.
- Activate a patient identity only after successful verification.

**Boundary**

The concrete OTP/SMS provider is not selected. Provider-specific delivery belongs behind an adapter and remains governed by `Q-PLATFORM-003`.

### 5.3 Privileged MFA Component — New

**Responsibility**

- Enforce a non-SMS second factor for privileged production roles.
- Keep factor-provider implementation outside domain rules.

**Boundary**

Provider selection remains unresolved under `Q-PLATFORM-003`.

### 5.4 Authorization Scope Component — New / Extend Spatie Permission

**Responsibility**

- Apply deny-by-default authorization.
- Combine coarse permission with organization, clinic, branch, case/resource relationship, workflow responsibility, subject-matter scope, purpose, and separation-of-duties conditions.
- Produce equivalent decisions for REST, Filament, jobs, files, exports, queues, search, and notifications.

**Rule**

Spatie Permission may answer whether an actor has a capability; it does not by itself establish domain scope.

### 5.5 Guardian / Family Grant Component — New

**Responsibility**

- Store explicit representation grants.
- Track subject patient, grantee, grantor/legal basis, allowed actions/data, purpose, and effective period.
- Apply immediate revocation/expiry while preserving history.
- Attribute actions to the guardian identity rather than impersonating the patient.

## 6. Catalog Components

**Requirements:** FR-CATALOG-001, FR-POLICY-001, FR-OPS-003.

### 6.1 Service Group Component — Existing

Owns stable dental grouping identity and ordering used by the public catalog.

### 6.2 Service Component — Existing

Owns stable service identity independent of versioned service-definition content.

### 6.3 Service Definition Component — Existing / Extend

**Responsibility**

- Maintain versioned service content and readiness-sensitive definition state.
- Preserve effective periods, version identity, content integrity, and immutable historical definitions after governed publication/terminal transitions.

**Rule**

A service definition being present does not make it production ready.

### 6.4 Catalog Visibility Query — Existing / Extend

Current evidence: `ListVisibleServiceGroups` and the catalog API endpoint.

**Responsibility**

- Return only the service groups/services/definitions permitted for the current catalog mode.
- In production, exclude evaluation-only or unready content.
- Avoid exposing internal clinical/risk/reviewer data.

### 6.5 Service Publication Component — Existing / Extend

Current evidence: `PublishServiceDefinition` plus launch-gate actions.

**Responsibility**

- Validate the complete launch-readiness card for the affected service definition.
- Fail closed on missing, expired, revoked, or rejected mandatory approvals.
- Preserve evidence-bound approvals and decision history.

**Governance**

The current 26 service records remain provisional evaluation data. Production activation remains governed by `Q-CATALOG-001`.

## 7. Launch Readiness Components

**Requirements:** FR-OPS-003.

### 7.1 Clinical Reviewer Credential Component — Existing / Extend

**Responsibility**

- Preserve independently verified reviewer credential facts/snapshots used to justify applicable clinical approvals.
- Make approval decisions traceable to the reviewer credential state used at decision time.

### 7.2 Launch Gate Decision Component — Existing / Extend

Current evidence: `ServiceLaunchGate`, `RecordServiceLaunchGateApproval`, and `RecordServiceLaunchGateDecision`.

**Responsibility**

- Record medical, legal, operational, and technical launch decisions where applicable.
- Bind decisions to scope, evidence, actor/accountable role, time, content/version, and expiry where relevant.
- Keep decisions append-only or historically immutable as required by the owning workflow.

### 7.3 Launch Readiness Evaluator — Extend

**Responsibility**

- Resolve the required gates for a launch scope.
- Determine whether the scope is production eligible.
- Return blocking gates/reasons without mutating source decisions.

**Future extension**

Provider-scope and geographic-scope readiness should reuse this pattern only when those V1 requirements are implemented; they need not share one database table with service-definition gates.

## 8. Eligibility and Classification Components

**Requirements:** FR-ELIG-001–017, FR-POLICY-001–002, NFR-AUDIT-003.

### 8.1 Provider Service Activation Request — New

**Responsibility**

- Bind one dentist, one service-definition version, and one branch.
- Capture questionnaire facts and evidence.
- Never expose direct controls for final `S`, `P`, `H`, or `I` outcomes.

### 8.2 Approved Fact Component — New

**Responsibility**

- Store source facts with subject, source, provenance, effective period, verification state, and relevant scope.
- Preserve superseded/expired facts where needed for historical reproduction.

**Rule**

Reviewers approve or reject facts; they do not edit computed results directly.

### 8.3 Evidence Requirement / Evidence State Component — New

**Responsibility**

- Resolve evidence requirements from the relevant versioned service/policy definition.
- Track missing, submitted, quarantined, accepted, rejected, expired, and superseded evidence state as appropriate.
- Feed eligibility and confidence calculation without leaking private evidence.

### 8.4 Scientific Evaluation Component — New / Governed

**Responsibility**

- Calculate scientific `S` from the clinically approved versioned criteria and weights.
- Preserve immutable input/weight/formula/result snapshot.
- Map evaluable results to versioned grade bands.
- Keep `PENDING_EVALUATION` distinct from grade `F`.

**Governance**

Production formulas, weights, thresholds, and defaults remain governed by `Q-ELIG-001`.

### 8.5 Confidence Component — New / Governed

**Responsibility**

- Compute the configured `K` / `EU` confidence measures from evidence coverage and verification state.
- Apply any clinically approved confidence-based grade cap.
- Preserve both uncapped result and applied cap reason.

### 8.6 Pricing Classification Component — New

**Responsibility**

- Accept actual price as a governed source fact.
- Resolve the exact service/locality/currency/effective price-band policy.
- Compute internal `P` automatically.
- Preserve the calculation snapshot.

**Rule**

`P` is not a patient-facing scientific quality score and does not move money.

### 8.7 Protection Classification Component — New / Governed

**Responsibility**

- Compute `H` from versioned protection rules and the eligibility context.
- Preserve the governing rule and explanation.

**Rule**

In V1, `H` must not imply platform-funded coverage, escrow, insurance, or money custody.

### 8.8 Internal Risk Component — New / Governed

**Responsibility**

- Compute internal `I` from versioned approved rules.
- Restrict output to authorized internal users/processes.

**Rule**

`I` is not a patient rating and must not be exposed as an accusation or substituted for `R` or `S`.

### 8.9 Eligibility Gate Evaluator — New

**Responsibility**

- Evaluate regulatory, credential, service, branch, scientific, price, protection, evidence, launch-readiness, and other mandatory gates applicable to the exact provider/service/branch context.
- Produce a state and reason for each gate.
- Derive final eligibility from the most restrictive mandatory gate.

**Rule**

A passing component score cannot override a failing or pending mandatory gate.

### 8.10 Eligibility Decision Snapshot — New

**Responsibility**

- Persist the exact policy versions, input facts/evidence references, component outputs, gate results, final outcome, controlling reason, and evaluation time.
- Remain immutable after commitment.

### 8.11 Eligibility Dependency Resolver — New

**Responsibility**

- Determine which provider/service/branch scopes are affected by a changed fact, credential, evidence state, branch relationship, service definition, or policy version.
- Avoid unnecessary global recalculation.

### 8.12 Eligibility Recalculation Coordinator — New

**Responsibility**

- Trigger event-driven or scheduled reevaluation.
- Create a new decision rather than rewriting historical decisions.
- Route delayed/failed recalculation into observable retry/exception handling.

### 8.13 Eligible Provider Search Query — New

**Responsibility**

- Search by requested service and approved area/availability criteria.
- Include only currently eligible provider-service-branch combinations.
- Expose practical provider decision data without raw internal risk values.

**Rule**

Discovery output does not replace booking-time revalidation.

## 9. Booking Components

**Requirements:** FR-BOOKING-001–003, NFR-AUDIT-002.

### 9.1 Booking Request Component — New

**Responsibility**

- Receive a booking request against exact patient, service, provider, branch, and slot context.
- Revalidate publication, readiness, eligibility, and slot capacity at submission.
- Apply idempotency for retry-safe submission.

### 9.2 Slot Capacity Component — New

**Responsibility**

- Protect configured capacity under concurrent requests.
- Use database constraints and/or transactional locking rather than client assumptions.

**Invariant**

Confirmed bookings never exceed slot capacity.

### 9.3 Provider Booking Response Component — New

**Responsibility**

- Accept provider acceptance, reasoned rejection, or alternative proposal from an authorized provider representative.
- Apply the policy-derived response deadline.
- Preserve actor, branch, previous state, result state, reason, and time.

### 9.4 Alternative Appointment Component — New

**Responsibility**

- Represent a provider-proposed alternative without treating it as confirmed.
- Require patient acceptance and repeat required booking revalidation before confirmation.

### 9.5 Booking Confirmation Coordinator — New

**Responsibility**

- Revalidate safety-critical eligibility/readiness/capacity immediately before commitment.
- Complete confirmation transaction atomically.

### 9.6 Cancellation / No-Show Component — New

**Responsibility**

- Apply actor authorization, policy deadlines, reasons, and state rules.
- Preserve the governing policy snapshot.
- Trigger downstream review/financial/operational consequences as new facts/events.

**Rule**

Cancellation/no-show never directly rewrites prior financial or clinical history.

## 10. Clinical Case Components

**Requirements:** FR-CLINICAL-001–005.

### 10.1 Treatment Plan Component — New

**Responsibility**

- Store clinician-authored service, stages, stage prices, inclusions, exclusions, and applicable terms.
- Validate completeness before acceptance.

**Medical boundary**

UberTib may validate workflow completeness but must not generate or present an autonomous diagnosis or treatment plan.

### 10.2 Treatment Plan Version Component — New

**Responsibility**

- Preserve draft/proposed plan versions before acceptance.
- Allow later amendments without rewriting an earlier accepted version.

### 10.3 Accepted Treatment Terms Snapshot — New

**Responsibility**

- Create an immutable snapshot when the patient accepts the plan.
- Preserve parties, service, branch, plan/stages, pricing, cancellation/refund terms, protection state, and policy versions required by the PRD.

### 10.4 Treatment Stage Component — New

**Responsibility**

- Track case treatment stages against the accepted plan version.
- Resolve required evidence/acknowledgments from the accepted governing snapshot.

### 10.5 Stage Completion Validator — New

**Responsibility**

- Block completion when mandatory stage facts, evidence, or acknowledgments are missing/invalid.
- Record completion/reopening as attributed transitions.

### 10.6 Follow-Up Component — New

**Responsibility**

- Derive follow-up obligations from accepted plan/policy information.
- Track due/rescheduled/cancelled state independently from notification delivery state.

### 10.7 Unified Case Timeline Query — New

**Responsibility**

- Compose authorized booking, accepted terms, clinical stages, evidence metadata, follow-ups, reviews, issues, and financial-event metadata into chronological output.
- Apply role-based field filtering.

**Rule**

The timeline is a derived read model, not the primary source of truth.

## 11. Financial Record Components

**Requirements:** FR-FINANCE-001–007, NFR-FINANCE-001, NFR-AUDIT-003.

### 11.1 Financial Terms Snapshot — New

**Responsibility**

- Preserve immutable mutually accepted financial terms and applicable policy versions.
- Create a linked new snapshot for every accepted amendment.

### 11.2 External Financial Event Component — New

**Responsibility**

Represent external:

- payment assertions;
- payment confirmations/disputes;
- refund-execution assertions;
- refund confirmations/disputes;
- compensation assertions;
- reversals/corrections/other governed external financial facts.

**Invariant**

Committed financial events are append-only. Corrections create linked compensating/superseding events.

### 11.3 External Payment Reporting Action — New

**Responsibility**

- Record a payment performed outside UberTib against a specific case and financial-terms snapshot.
- Preserve amount, currency, method category, occurrence time, source assertion, and evidence where required.

**Rule**

Recording the event does not initiate or settle a payment.

### 11.4 Financial Confirmation / Dispute Action — New

**Responsibility**

- Allow the authorized counterparty or scoped reviewer to confirm or dispute an earlier assertion.
- Preserve the original event.

### 11.5 Refund External Execution Action — New

**Responsibility**

- Record an externally performed refund execution against an approved refund decision.
- Require the applicable confirmation/dispute workflow before deriving confirmed execution.

### 11.6 Financial Status Projector — New

**Responsibility**

- Derive agreed, reported, confirmed, disputed, refunded, and pending-external-execution amounts/statuses from immutable terms plus ordered financial events.

**Rule**

A projection can be rebuilt from authoritative event history.

### 11.7 Financial Case Timeline Query — New

**Responsibility**

- Return authorized financial history while distinguishing assertions from confirmed or reviewer-resolved facts.

### 11.8 Forbidden Money-Movement Surface

No V1 component may implement:

- payment authorization/capture;
- card/bank credential storage for payment execution;
- wallet balances;
- custody/escrow;
- payout/settlement;
- platform-executed refunds;
- platform-funded protection.

Any future money-movement capability requires a new authoritative product decision and separate architecture/integration/security work.

## 12. Review Components

**Requirements:** FR-REVIEWS-001–002.

### 12.1 Verified Review Eligibility Component — New

**Responsibility**

- Determine whether the authenticated patient or valid guardian has one eligible verified completed experience within the applicable policy window.

### 12.2 Review Component — New

**Responsibility**

- Enforce at most one active review per eligible experience.
- Preserve the verified case/experience relationship.
- Maintain patient rating `R` separately from `S/P/H/I`.

### 12.3 Review Appeal Component — New

**Responsibility**

- Preserve appellant, grounds, evidence, original review relation, status, decision, reviewer, and audit history.
- Apply policy deadlines and separation-of-duties where required.

## 13. Claims and Dispute Components

**Requirements:** FR-CLAIMS-001–005.

### 13.1 Refund Request Component — New

**Responsibility**

- Record claimant, case, requested amount/currency, reason, occurrence context, evidence, and submission time.
- Validate against the accepted financial-terms snapshot and governing deadline policy.

**Rule**

Approval creates an externally executable obligation/state, not a transfer.

### 13.2 Protection Claim Component — New

**Responsibility**

- Accept a claim only when the immutable accepted terms include an applicable protection policy.
- Preserve claim type, remedy requested, narrative, evidence, policy version, and state.

### 13.3 Claim Evidence Component — New

**Responsibility**

- Resolve versioned required-evidence rules.
- Distinguish missing, quarantined, rejected, expired, and accepted evidence.

### 13.4 Deadline Component — New

**Responsibility**

- Resolve original deadlines from policy snapshots.
- Record authorized pause/extension events without erasing the original deadline.
- Surface remaining time and breach state to authorized workflows.

### 13.5 Sensitive Human Decision Component — New

**Responsibility**

- Require authorized human decision for medically, legally, financially, or otherwise high-impact claim/dispute outcomes.
- Enforce role/scope and applicable separation of duties.
- Preserve findings, reasons, evidence references, policy version, actor, time, and required external action.

### 13.6 Claim Appeal Component — New

**Responsibility**

- Preserve the original decision.
- Validate appeal eligibility/deadline against the applicable historical policy snapshot.
- Route to an authorized reviewer according to separation-of-duties rules.

## 14. Operations Components

**Requirements:** FR-OPS-001–003, NFR-PLATFORM-008.

### 14.1 Operational Work Item / Queue Component — New

**Responsibility**

- Represent actionable verification, review, dispute, claim, financial follow-up, launch, and exception work.
- Preserve type, source resource/case, state, priority, due time, responsibility scope, and blocking reason.

**Rule**

The queue is an operational view of underlying domain work, not a replacement source of truth.

### 14.2 Assignment / Escalation Component — New

**Responsibility**

- Claim/assign work only within active authorization scope.
- Audit assignment, escalation, completion, reopening, and breach transitions.

### 14.3 Operational Reporting Component — New

**Responsibility**

- Produce metrics with explicit population, status logic, time window, and last-refresh time.
- Distinguish provisional/disputed from confirmed data.
- Apply equivalent authorization and audit controls to reports, drill-downs, and exports.

## 15. Policy Components

**Requirements:** FR-POLICY-001–002.

### 15.1 Versioned Policy Component — New / Pattern Established by ServiceDefinition

**Responsibility**

- Preserve stable policy key, scope, version, lifecycle state, effective interval, provenance, and rule content appropriate to each policy domain.
- Prevent historical mutation after activation where reproduction depends on it.

**Policy domains may include**

- eligibility/classification;
- evidence requirements;
- deadlines;
- booking/cancellation rules;
- financial handling rules;
- launch readiness;
- retention and operational policies where applicable.

One generic table is not required; the invariant is versioned reproducibility, not physical schema uniformity.

### 15.2 Policy Lifecycle Coordinator — New

**Responsibility**

- Enforce draft/review/scheduled/active/retired/superseded transitions as required.
- Apply authorized reviewer/owner rules.
- Prevent unresolved overlapping effective policies unless explicit precedence exists.

### 15.3 Historical Decision Reproducer — New

**Responsibility**

- Load historical immutable inputs/snapshots/policies.
- Recompute or replay the relevant deterministic rule path.
- Compare reproduced and stored outcome.
- Emit an auditable integrity exception on mismatch.

## 16. Audit and Integrity Components

**Requirements:** FR-AUDIT-001–003, NFR-AUDIT-001–003.

### 16.1 Sensitive Audit Recorder — New / Extend Activitylog Capability

**Responsibility**

- Record actor, effective role/scope, action, target, outcome, time, request correlation, and reason where required.
- Cover sensitive reads, downloads, writes, approvals, decisions, permission changes, and exceptional operations.

**Rule**

Activitylog may be used as an implementation tool only if the final record structure and immutability requirements are satisfied.

### 16.2 Provenance Component — New

**Responsibility**

- Link classifications, financial outcomes, launch decisions, claims, and sensitive decisions to immutable inputs, evidence, approvals, snapshots, and policy versions.

### 16.3 Idempotency Component — New

**Responsibility**

- Bind idempotency to actor, operation, scope, key, and payload fingerprint.
- Return the original committed response for exact retries.
- Reject key reuse with a materially different payload.
- Prevent duplicate side effects under concurrency.

### 16.4 Integrity Verification Component — New

**Responsibility**

- Verify hashes or derived-state consistency for immutable snapshots/events where required.
- Record auditable exceptions rather than silently repairing history.

## 17. Private Evidence Components

**Requirements:** NFR-PLATFORM-003 plus applicable FRs.

### 17.1 Evidence Upload Intake — New

**Responsibility**

- Enforce allowed PDF/JPEG/PNG types and approved size/count limits.
- Validate extension, magic bytes, MIME, and decode.
- Generate opaque object identity.
- Calculate immutable SHA-256.
- Persist ownership/purpose metadata.

### 17.2 Quarantine / Scan Coordinator — New

**Responsibility**

- Keep newly uploaded evidence unavailable to business workflows until malware scanning succeeds where scanning is required.
- Track scan state and failures.

**Boundary**

Concrete scanning/storage providers remain unresolved under `Q-PLATFORM-003` / `Q-OPS-001`.

### 17.3 Authorized Evidence Download — New

**Responsibility**

- Reauthorize every download request.
- Generate or proxy access valid for no more than the approved 60-second limit.
- Audit every download.

### 17.4 Evidence Retention / Legal Hold — New

**Responsibility**

- Apply approved retention policy by purpose/case/subject/legal-hold state.
- Prevent deletion under active hold.
- Record non-sensitive destruction audit metadata.

Final legal values remain governed by `Q-PLATFORM-002`.

## 18. Notification and Reminder Components

### 18.1 Notification Intent Component — New

**Responsibility**

- Convert committed domain outcomes/obligations into notification intents.
- Preserve recipient, purpose, business reference, intended time, and delivery state.

### 18.2 Notification Delivery Adapter — New

**Responsibility**

- Send through the selected provider without changing authoritative domain state.
- Track queued, attempted, delivered/accepted where available, failed, retrying, and terminal failure states.

**Boundary**

No concrete provider contract is currently established; therefore `docs/integrations/INTEGRATION_CONTRACTS.md` remains intentionally omitted.

### 18.3 Reminder Scheduler — New

**Responsibility**

- Schedule follow-up/deadline reminders from authoritative due dates.
- Avoid duplicate reminder creation/sending under retries.

## 19. Background Job Components

Queues are appropriate for:

- notification delivery;
- malware scan orchestration;
- scheduled eligibility reevaluation;
- retryable recalculation;
- deadline/escalation checks;
- follow-up reminders;
- report projection refresh where justified;
- retention/deletion processing.

Every job must:

- carry a correlation identifier;
- be retry-safe;
- reload authoritative state before acting;
- respect current authorization/system policy where applicable;
- not duplicate committed business outcomes;
- expose failures and retry age to operations.

## 20. API Adapter Components

The external API uses versioned `/api/v1` contracts.

### Controller responsibilities

Controllers should only:

- accept transport input;
- authenticate/authorize through application mechanisms;
- map request data to application actions/queries;
- map stable application results/errors to HTTP responses.

### Resource / Data responsibilities

Resources/data objects should:

- expose stable client contracts;
- filter audience-specific fields;
- avoid leaking internal IDs, private evidence, reviewer secrets, credential data, or raw internal risk fields.

Canonical endpoint definitions belong to `docs/api/API_CONTRACTS.md`; stable failures belong to `docs/api/ERROR_CATALOG.md`.

## 21. Filament Adapter Components

Filament resources/pages/actions are operational adapters to the same application layer used by APIs.

They may provide authorized management workflows for catalog, service publication, verification, provider/service activation, bookings, cases, evidence, finance records, claims, reviews, policies, operations, and audit only as those capabilities are implemented.

Filament components must not duplicate domain calculations or lifecycle rules.

The existing Filament shell is not an authoritative business-screen inventory. Screen/navigation/layout design remains deferred to the UX pipeline.

## 22. Database and Transaction Ownership

### Transactional components

Transactions are required when a business outcome spans multiple authoritative writes, including examples such as:

- booking confirmation plus capacity reservation and required audit/idempotency state;
- accepted plan plus immutable accepted snapshots;
- financial assertion plus idempotency/audit records;
- policy activation plus supersession constraints;
- launch decision plus readiness-state changes where atomicity is required.

### Database constraints

Use unique/check/foreign-key/index constraints where they materially protect invariants, particularly:

- stable catalog identities and version uniqueness;
- one effective policy per unresolved scope/instant rule where enforceable;
- one active review per eligible experience;
- idempotency key ownership;
- booking capacity support;
- immutable-history references.

Application validation does not replace durable database integrity.

## 23. Read Models and Projections

The following may be implemented as query objects or projections when necessary for performance:

- eligible-provider search;
- unified case timeline;
- financial case timeline;
- operational work queues;
- operational reporting.

A projection must be rebuildable or verifiable from authoritative domain records and must clearly distinguish stale/provisional state when freshness matters.

## 24. Caching Components

Caching may be used for safe public/read-heavy queries such as catalog data.

Caching must not become authoritative for:

- booking capacity;
- final booking confirmation;
- permission revocation;
- expired eligibility;
- current launch readiness;
- claim/financial decision state;
- sensitive evidence authorization.

No specific cache backend is selected by this document.

## 25. Observability Components

The platform must expose privacy-safe operational signals for:

- request correlation;
- application error rates;
- latency;
- queue age/retries/failures;
- deadline breaches;
- eligibility recalculation delay;
- scan backlog/failure;
- notification failure;
- backup/restore status;
- historical-reproduction/integrity exceptions.

Protected payloads, OTP values, credential secrets, signed evidence links, and private evidence locations must not appear in ordinary logs.

## 26. Component Dependency Rules

1. Adapters depend on application actions/queries; actions do not depend on controllers or Filament components.
2. Client-facing resources do not determine business eligibility or permissions.
3. Domain modules may consume explicit cross-domain application/query interfaces but must not copy another domain's rules.
4. Policy components provide immutable/effective rule versions; presentation code does not hard-code policy thresholds.
5. Audit/provenance records observe or accompany sensitive actions; they do not become editable operational records.
6. Financial components may reference clinical/case snapshots but may not initiate money movement.
7. Eligibility may depend on catalog/readiness/policy facts; catalog presentation must not independently recreate eligibility rules.
8. Notifications depend on committed domain outcomes, never the reverse.

## 27. Component Status Matrix

| Capability | Status |
|---|---|
| Catalog identity and service definitions | Existing |
| Visible catalog query/API slice | Existing / partial |
| Clinical reviewer credential snapshots | Existing |
| Service launch-gate decisions/publication core | Existing / partial |
| Identity verification/MFA/guardian grants | New |
| Scoped authorization beyond framework baseline | New / extend |
| Full eligibility/classification engine | New / governed |
| Booking lifecycle | New |
| Clinical case/treatment workflow | New |
| External financial-event ledger | New |
| Reviews and appeals | New |
| Claims/disputes and appeals | New |
| Versioned cross-domain policy platform | New / partial pattern exists |
| Full sensitive audit/provenance/idempotency | New / extend libraries |
| Private evidence quarantine/scan/access | New |
| Operational queues/reporting | New |
| Provider-specific infrastructure/integrations | Unresolved |

## 28. Open Component Constraints

| ID | Severity | Component impact |
|---|---|---|
| Q-PLATFORM-001 | Blocker | Full SRS-to-component reconciliation cannot yet be certified. |
| Q-CATALOG-001 | Major | Catalog production publication cannot treat the 26 provisional records as clinically approved. |
| Q-ELIG-001 | Major | Production S/P/H/I/confidence formulas and thresholds require licensed clinical approval. |
| Q-PLATFORM-002 | Major | Retention/deletion policy values require final legal/compliance validation. |
| Q-OPS-001 | Major | Infrastructure/storage topology/provider selection remains unresolved. |
| Q-PLATFORM-003 | Major | OTP/MFA, malware scanning, evidence storage, and notification providers remain unresolved. |
| Q-PLATFORM-004 | Minor | Low-thousands launch population remains distinct from the approved 10,000-identity engineering envelope. |
| CONFLICT-PLATFORM-001 | Major | Historical stack assumptions must not override verified current Laravel/PHP/package constraints. |
| CONFLICT-CATALOG-001 | Major | Contract/spec intent and verified implemented route surface remain separately classified. |
| CONFLICT-PLATFORM-002 | Major | Final NFR-vs-DR/TD classification awaits complete SRS reconciliation. |

## 29. Downstream Documentation Ownership

This component document deliberately does not duplicate details owned by later Phase 2 files:

- endpoint shapes and request/response contracts → `docs/api/API_CONTRACTS.md`;
- stable API/client errors → `docs/api/ERROR_CATALOG.md`;
- entities/relationships/constraints → `docs/database/ERD.md`;
- cross-system/domain data movement → `docs/database/DFD.md`;
- canonical lifecycle states/transitions → `docs/domain/STATE_MACHINES.md`;
- role/action authorization → `docs/domain/PERMISSIONS_MATRIX.md`;
- interaction ordering → `docs/diagrams/SEQUENCE_DIAGRAMS.md`;
- runtime configuration → `docs/ops/CONFIGURATION.md`;
- provider-neutral deployment → `docs/ops/INFRASTRUCTURE.md`;
- monitoring/alerts → `docs/ops/MONITORING.md`.

## 30. Completion Criteria

This document is complete for the current engineering-documentation baseline when:

- every confirmed V1 domain has an owning application component boundary;
- current repository components are distinguished from new/extended behavior;
- no component duplicates product rules owned by the PRD;
- no component introduces payment/custody behavior;
- clinical-governance blockers remain explicit;
- API, data, state, permission, sequence, configuration, infrastructure, and monitoring details are delegated to their canonical downstream documents.
