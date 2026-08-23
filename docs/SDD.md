# UberTib Software Design Document

**Phase:** 1 — Foundation  
**Operating mode:** Existing Repository  
**Baseline date:** 2026-08-23  
**Product source:** `docs/PRD.md`  
**Registry:** `docs/README.md`  
**Status:** Canonical technical-design baseline for the engineering-documentation pipeline

## 1. Purpose and Design Boundary

This document defines how the confirmed UberTib requirements are implemented technically without redefining product behavior owned by `docs/PRD.md`. It describes the architecture style, module boundaries, data and API strategy, validation, authorization, concurrency, security, background processing, and the implementation shape required for the full V1 platform.

UberTib is an existing-repository system. The current Laravel backend contains a meaningful service-catalog and launch-governance slice, but the wider product remains largely unimplemented. Existing code is implementation evidence, not authority over higher-priority product requirements.

`Q-PLATFORM-001` remains a Blocker for claiming complete end-to-end reconciliation against readable SRS v1.1 text. The Product Owner explicitly approved continuing the documentation pipeline under the approved `.spec/` requirement baseline while preserving the SRS as the higher-priority source. No design in this document may silently override the SRS.

This document does not define UX layout, navigation, wireframes, component styling, or screen allocation. Those belong to the later UX pipeline.

## 2. Verified Existing Technical Baseline

The implemented backend resides in `UberTip-Backend/` and is a Laravel application. Verified Composer constraints include PHP `^8.3`, Laravel `^13.17`, Filament `~5.0`, Pest `^4.7`, Spatie Permission `^8.3`, Spatie Activitylog `^5.0`, Spatie Media Library `^11.23`, and Spatie Laravel Data `^4.23`.

The repository already uses application actions, Eloquent models, API controllers/resources, versioned API routing, explicit domain enums/data objects, migrations, configuration, Pest tests, and a Filament panel shell. These established conventions should be extended instead of replaced by an unrelated architecture.

Verified current public API behavior is limited to `GET /api/v1/catalog/service-groups`. Feature specifications and OpenAPI material may describe broader intended behavior and must not be treated as implementation proof.

The current meaningful persistent domain slice contains service groups, services, versioned service definitions, clinical reviewer credential snapshots, and service launch-gate decisions. The current 26 dental-service records are evaluation-only records and are not production clinical approvals.

## 3. Architecture Style

UberTib V1 should remain a **modular Laravel monolith** with one transactional application boundary and clearly separated business modules inside the existing Laravel application.

The architecture should use:

- Laravel HTTP/API adapters for the React Native patient client and other API consumers.
- Filament as the staff/doctor administrative interaction layer where applicable.
- Application actions as the primary use-case boundary shared by API and Filament adapters.
- Eloquent models plus database constraints for persistence and invariant enforcement.
- Domain-specific policy/evaluation services where calculation or lifecycle logic is too substantial for models/actions.
- Queued jobs only for genuinely asynchronous work such as notifications, malware scanning orchestration, scheduled reevaluation, reporting refresh, retention jobs, and non-immediate operational follow-up.
- Versioned REST contracts under `/api/v1` for external client access.

Do not introduce microservices, distributed transactions, CQRS, event sourcing, Kubernetes, or generic repository abstractions without a later concrete requirement and documented decision.

## 4. Technical Goals

The implementation must prioritize:

1. Requirement fidelity and explicit traceability to `FR-*` / `NFR-*`.
2. Fail-closed medical, eligibility, authorization, and launch decisions.
3. Immutable historical agreements, decisions, and append-only event histories where required.
4. Deterministic reproducibility of versioned policies and computed outcomes.
5. Zero platform money movement in V1.
6. Shared business logic between API and Filament without duplicating policy logic in presentation adapters.
7. Safe retry behavior and transactional concurrency control for sensitive commands.
8. Privacy-safe observability and least-privilege access to clinical, identity, and financial evidence.
9. Arabic-first and weak-connectivity-capable client contracts.
10. Simplicity appropriate to an Aleppo-first launch while preserving the approved engineering capacity envelope.

## 5. Logical Module Boundaries

| Module | Primary responsibility | Main requirements |
|---|---|---|
| Identity & Access | identities, authentication, OTP/MFA, guardian grants, staff scopes | FR-IDENTITY-001–003, NFR-IDENTITY-001–002 |
| Catalog | patient-readable dental groups/services and service-definition publication | FR-CATALOG-001, FR-OPS-003 |
| Eligibility | service activation facts/evidence, S/P/H/I, gates, provider search, re-evaluation | FR-ELIG-001–017 |
| Booking | appointment request, provider response, alternative proposal, revalidation, cancellation/no-show | FR-BOOKING-001–003 |
| Clinical Case | treatment plan, accepted clinical terms, stages, evidence, follow-up, unified timeline | FR-CLINICAL-001–005 |
| Financial Records | immutable financial terms, external payment/refund events, confirmation/dispute, financial timeline | FR-FINANCE-001–007, NFR-FINANCE-001 |
| Reviews | verified experience review and appeal | FR-REVIEWS-001–002 |
| Claims & Disputes | refund/protection claims, evidence/deadlines, human review, appeal | FR-CLAIMS-001–005 |
| Operations | work queues, reporting, launch-readiness orchestration | FR-OPS-001–003 |
| Policy | versioned policy lifecycle and historical reproduction | FR-POLICY-001–002 |
| Audit & Integrity | sensitive audit, provenance, idempotency, immutable-history verification | FR-AUDIT-001–003, NFR-AUDIT-001–003 |
| Platform | storage, queues, performance, resilience, accessibility contract support, monitoring | NFR-PLATFORM-001–008 |

Modules may share the same database and Laravel process, but ownership of rules must remain explicit. Cross-domain reads should occur through application/domain services or stable query objects rather than copying rules into unrelated controllers/resources.

## 6. Request and Command Lifecycle

For mutating use cases, the expected lifecycle is:

1. Authenticate the actor where the operation is not public.
2. Resolve organization, branch, case, purpose, and other authorization scope.
3. Validate syntax and request shape.
4. Resolve the effective immutable policy/snapshot/version required by the command.
5. Validate business preconditions against current state.
6. Acquire transactional locks or rely on uniqueness constraints where contention matters.
7. Apply the use case through an application action.
8. Persist primary state, immutable snapshots/events, and audit/provenance atomically where required.
9. Commit before dispatching non-critical asynchronous side effects.
10. Return a stable API/resource result or Filament action result.

Sensitive retry-prone commands additionally enforce the idempotency contract from FR-AUDIT-003 and NFR-AUDIT-002 before a second business effect is possible.

## 7. Public Read Lifecycle

Public catalog/search reads should remain thin HTTP adapters over explicit query/application actions. They must:

- Expose only production-visible data in production mode.
- Never expose internal database IDs when stable public identities exist.
- Never leak reviewer identities, credential evidence, private evidence references, internal risk `I`, or protected clinical payloads.
- Apply bounded caching only where stale data cannot violate safety or booking correctness.
- Revalidate safety-critical facts synchronously at booking submission/confirmation rather than trusting cached discovery output.

The implemented catalog endpoint already demonstrates explicit resources, throttling, and cache headers; later public reads should preserve the same disciplined contract style.

## 8. Identity and Access Design

**Implements:** FR-IDENTITY-001–003, NFR-IDENTITY-001–002.

Identity should remain one application identity model with explicit role/permission grants and domain relationships rather than creating separate authentication systems per actor. Spatie Permission is already installed and should provide coarse permission capability, while organization/clinic/branch/case/purpose scope must be enforced by application policies and query constraints.

Patient activation requires verified contact ownership. OTP values must be hashed, rate-limited, single-use, and short-lived exactly as specified in NFR-IDENTITY-002. Privileged production roles require a non-SMS second factor; the concrete provider remains unresolved under `Q-PLATFORM-003`.

Guardian/family authority must be represented as explicit revocable grants with subject, grantee, scope, purpose, effective period, and legal/grant basis. The patient remains the owner of the case. Every representative action is attributed to the representative identity.

Authorization is deny-by-default. Controllers, Filament actions, queued jobs, file-download handlers, exports, searches, notifications, and operational queues must apply equivalent authorization semantics.

## 9. Catalog Design

**Implements:** FR-CATALOG-001, partial FR-POLICY-001, partial FR-OPS-003.

The existing catalog slice should remain the basis for the full catalog domain. Stable service-group and service identities are separated from versioned `ServiceDefinition` content so patient-readable service identity can survive prospective policy/content revisions.

Evaluation and production visibility must remain explicit server-side modes. Production mode must fail closed: incomplete, pending, stale, or unapproved service definitions are not publicly visible. A newer unready production version must not silently fall back to an older version if the governing publication rules prohibit that fallback.

The current 26 records remain evaluation data. Production publication requires the governed launch gate, including current medical approval by an independently verified licensed dental reviewer plus other mandatory readiness approvals.

Public API resources should expose only practical localized catalog information and the minimum safe readiness metadata required by clients.

## 10. Eligibility and Classification Design

**Implements:** FR-ELIG-001–017, FR-POLICY-001–002, NFR-AUDIT-003.

Eligibility is a contextual decision keyed by provider, service, branch, applicable facts/evidence, and effective policy period. There is no universal provider grade.

The implementation should separate:

- Source facts supplied by dentists, clinics, verifiers, or approved external evidence.
- Evidence verification state.
- Versioned calculation/policy definitions.
- Computed components `S`, `P`, `H`, and `I` plus confidence values where applicable.
- Final eligibility gates and controlling reason.
- Immutable decision snapshots used for audit and reproduction.

No actor may directly enter or override final `S/P/H/I` outcomes. Corrections occur by changing governed source facts or policy through authorized workflows, then creating a new decision.

`PENDING_EVALUATION` is a first-class non-grade state and must never collapse into grade `F`. `I` remains internal. Patient-visible outputs expose practical meaning rather than raw internal symbols.

Production S/P/H/I formulas, weights, thresholds, and clinical defaults remain governed by `Q-ELIG-001`; provisional configuration may be versioned for evaluation but must not be represented as licensed production medical truth.

## 11. Eligibility Recalculation

Eligibility recalculation should be dependency-aware rather than globally recomputing all providers after every change. Each approved fact, evidence item, service policy, branch relationship, credential, or launch gate should expose enough ownership metadata to identify affected provider-service-branch scopes.

Material changes may enqueue recalculation jobs. Booking confirmation must not depend solely on asynchronous freshness: FR-ELIG-006 and FR-BOOKING-001 require current evaluation or synchronous revalidation inside the approved freshness window.

Every recalculation creates a new immutable decision record. Existing decisions remain historical evidence. Failed background recalculations must remain observable and retryable rather than appearing complete.

## 12. Booking Design

**Implements:** FR-BOOKING-001–003, NFR-AUDIT-002.

Booking should be a transactional lifecycle with explicit states documented canonically in `docs/domain/STATE_MACHINES.md` during Phase 2. Do not embed state-transition rules independently in controllers or UI components.

A booking request must validate service publication, provider-service-branch eligibility, branch readiness, and slot capacity at submission. Confirmation repeats the safety-critical checks. Capacity enforcement must use database constraints and/or row-level transactional locking so concurrent requests cannot overbook a slot.

Provider responses support acceptance, rejection with reason, or an alternative proposal. Deadlines are policy-derived and preserved with the relevant snapshot. Alternative proposals require patient acceptance before confirmation.

Cancellation/no-show behavior creates auditable state transitions and derives downstream operational/financial/review consequences without rewriting earlier events or moving money.

## 13. Clinical Case Design

**Implements:** FR-CLINICAL-001–005.

Treatment plans are clinician-authored domain records. UberTib may validate completeness and manage workflow but must never generate or represent an autonomous diagnosis or treatment plan.

A plan should be versioned before acceptance. Patient acceptance creates an immutable accepted snapshot capturing the clinical and linked financial terms required by the PRD. Later amendments create linked new versions; they do not edit the accepted historical record.

Treatment-stage completion resolves requirements from the accepted service/policy snapshot rather than mutable current defaults. Required evidence and acknowledgments must be complete and valid before completion.

Follow-up reminders should be derived from accepted plan/policy data and dispatched asynchronously. Failed communication is an operational delivery failure, not a change to the clinical follow-up itself.

The unified case timeline should be a read model composed from authoritative domain records/events while preserving role-based field filtering.

## 14. Financial Record Design

**Implements:** FR-FINANCE-001–007, NFR-FINANCE-001, NFR-AUDIT-003.

V1 financial behavior is an external-event record system only. The codebase must contain no payment authorization, capture, wallet, escrow, payout, settlement, bank/card credential storage, or platform refund execution path.

`FinancialTermsSnapshot` is immutable and created on mutually accepted terms and every accepted amendment. External payment, refund, compensation, confirmation, dispute, reversal, and correction facts are modeled as append-only financial events associated with the relevant case and immutable terms snapshot.

A reported external payment is initially an assertion. Confirmation/dispute creates additional events; it does not mutate the original assertion. Derived case financial status is computed from the ordered event history.

Approved refunds or compensation create an amount/action due for external human execution. Only after external execution is reported and confirmed can the system reflect that execution as confirmed.

Architecture, API names, domain language, tests, and operational documentation must consistently preserve this boundary.

## 15. Reviews Design

**Implements:** FR-REVIEWS-001–002.

Review eligibility is anchored to a verified completed patient experience. Database/application constraints should prevent more than one active review for the same eligible experience.

Patient experience rating `R` remains independent of scientific classification and must not feed `S/P/H/I` or eligibility calculations.

Appeals create separate governed records containing appellant, review, reason/grounds, evidence, status, decision, and audit history. An appeal may affect publication eligibility according to policy but must not directly edit the rating content or scientific classification.

## 16. Claims and Disputes Design

**Implements:** FR-CLAIMS-001–005.

Refund requests, protection claims, evidence collection, deadlines, sensitive decisions, and appeals should be modeled as explicit stateful case workflows. Canonical states/transitions belong in `docs/domain/STATE_MACHINES.md`.

Claim eligibility and deadlines resolve from the immutable accepted terms/policy snapshot governing the case. Deadline extensions or pauses are additional authorized events with reasons, not silent field replacements.

Sensitive medical, legal, punitive, or high-impact financial decisions require authorized human review. Separation-of-duties constraints must be enforced in authorization/application logic.

A successful claim/refund decision may produce an externally executable obligation but never a platform money transfer.

## 17. Operations Design

**Implements:** FR-OPS-001–003, NFR-PLATFORM-008.

Operational work should be represented as scoped work items or domain-specific actionable queues with responsibility, state, priority, due time, source case/resource, and blocking reason. Queue views are derived operational surfaces; the underlying domain record remains authoritative.

Assignment, escalation, completion, reopening, and deadline breach must be auditable. A worker can claim/act only within active permission and organizational scope.

Operational reporting should derive metrics from authoritative records with explicit population, time window, status rules, and refresh time. Provisional/disputed facts must remain distinguishable from confirmed facts in metrics and exports.

Launch readiness is a governed approval workflow. The implemented service-definition launch-gate slice should be generalized to provider/geographic scopes only when those requirements are implemented, preserving evidence binding, reviewer accountability, expiry, and fail-closed behavior.

## 18. Policy Design

**Implements:** FR-POLICY-001–002.

Policies that influence business outcomes must be versioned, effective-dated, and immutable after activation where historical reproduction depends on them. This includes classification, eligibility, evidence, deadlines, financial rules, launch gates, retention, and relevant operational policies.

A policy version should identify a stable policy key, scope, version, lifecycle state, effective interval, provenance, and serialized/structured rule content appropriate to its domain. Overlapping active policies must either be impossible or resolved by an explicit precedence rule.

Historical reproduction loads the captured snapshot/version used at the time of the original decision, not the current active configuration. Reproduction mismatches create auditable integrity exceptions.

The existing `ServiceDefinition` lifecycle is implementation evidence for this pattern, but it must not force every policy domain into the same table/schema.

## 19. Audit and Provenance Design

**Implements:** FR-AUDIT-001–003, NFR-AUDIT-001–003.

Sensitive operations must produce attributable audit records containing actor, effective role/scope, action, target, outcome, timestamp, request correlation, and reason where required. Audit records are not editable through ordinary business workflows.

Business-history immutability and general activity logging are related but distinct concerns. Domain snapshots/events required to reproduce decisions must remain first-class domain records; Spatie Activitylog may capture operational activity but must not replace authoritative financial, policy, clinical, or eligibility history.

Every sensitive decision must retain provenance to the exact facts, evidence, approvals, policy versions, and snapshots that produced it.

Logs and audit presentation must redact protected content, OTP values, private object names/URLs, credential secrets, and unnecessary clinical payloads.

## 20. Idempotency and Concurrency Strategy

Commands covered by FR-AUDIT-003 require a persistent idempotency record keyed by actor, operation, scope, and idempotency key plus a request fingerprint. A committed identical retry returns the original result; key reuse with a different fingerprint is rejected.

The idempotency record and business outcome should commit atomically. In-progress duplicates must resolve deterministically rather than executing the action twice.

Database uniqueness constraints are required for invariants such as one active review per eligible experience, version uniqueness, one effective state where appropriate, immutable event identity, and deduplicated external financial assertions where business keys are available.

Row-level locking or equivalent transactional contention control is required for scarce resources such as appointment capacity and lifecycle actions whose state can be changed concurrently.

## 21. Data Persistence Strategy

The full persistent model is owned by `docs/database/ERD.md` in Phase 2. This SDD establishes the following persistence principles:

- Stable identities are separated from mutable/versioned definitions.
- Historical decisions use immutable snapshots or append-only events where required.
- Effective-dated policies preserve prospective change without rewriting history.
- Domain foreign keys and unique constraints enforce invariant ownership and identity.
- Soft deletion is not a substitute for immutable audit/event history.
- Sensitive evidence bytes remain private and are referenced through protected media/evidence records.
- Public contracts use stable public codes/UUIDs instead of exposing sequential database IDs where practical.

Development environment defaults do not establish production storage topology. Production recovery must satisfy NFR-PLATFORM-002; the provider/topology remains unresolved under `Q-OPS-001`.

## 22. API Strategy

Detailed contracts are owned by `docs/api/API_CONTRACTS.md` in Phase 2.

API conventions should preserve the verified `/api/v1` version namespace and Laravel controller/resource patterns. API adapters should call application actions/query services and must not duplicate business rules.

Responses should use stable machine-readable states/codes plus localized human-readable messages where the client needs them. Domain enums exposed externally must be explicitly versioned contract choices rather than accidental serialization of internal PHP enum names.

Mutation endpoints for retry-prone actions require an idempotency key according to FR-AUDIT-003. Authorization is evaluated server-side for every request.

Client contracts must support weak-connectivity states without claiming success before server commitment.

## 23. Error Strategy

Stable error identifiers are owned by `docs/api/ERROR_CATALOG.md` in Phase 2.

Errors must distinguish at minimum:

- request validation failures;
- authentication failures;
- authorization/scope failures;
- missing/not-visible resources;
- stale state / invalid transition;
- policy or eligibility blockers;
- idempotency-key conflict;
- contention/capacity conflict;
- evidence quarantine/validation failure;
- deadline expiry;
- production-readiness failure;
- unexpected server failure.

Errors must not leak protected resource existence across unauthorized scopes or include secrets/private evidence details. Client-facing error surfaces are specified later without prescribing visual layout here.

## 24. File and Evidence Strategy

**Implements:** NFR-PLATFORM-003.

Spatie Media Library is installed and may remain the media abstraction, but private evidence needs an explicit domain evidence record when provenance, quarantine, purpose, policy, or legal-hold state is required beyond generic media metadata.

Uploads must remain private, use opaque object names, validate extension/magic-byte/MIME/decode, calculate SHA-256, and remain quarantined until malware scanning succeeds. The concrete scanning/storage provider remains unresolved under `Q-PLATFORM-003`.

Downloads require fresh authorization and short-lived access (≤60 seconds per NFR). Every protected download must be audited.

Evidence references included in immutable decisions should bind to immutable hashes/versions, not mutable file paths.

## 25. Background Processing

Queues are justified for work that need not block the initiating request and whose delayed state can be represented explicitly. Applicable uses include:

- scheduled/event-driven eligibility reevaluation;
- follow-up reminders and notification delivery;
- malware-scan orchestration and post-scan processing;
- retention/deletion execution;
- report aggregation where synchronous queries are unsuitable;
- operational escalations/deadline checks;
- integrity verification and long-running exports.

A queued job must never turn an uncommitted request into an implied success. Jobs require correlation IDs, bounded retries, explicit failure recording, and idempotent handlers where replay is possible.

## 26. Notifications and Communications

Notifications communicate domain outcomes; they are not the authoritative state. A failed notification does not roll back a committed booking, decision, case, or financial event unless the product requirement explicitly makes delivery part of completion.

Notification jobs should reference the source domain record and event so retries do not duplicate business effects. Delivery status must be observable for follow-up reminders and operationally important communications.

Concrete SMS/OTP/notification providers are unresolved under `Q-PLATFORM-003`; therefore no provider-specific contract belongs in the canonical architecture yet.

## 27. Security Design

Security is enforced at multiple layers:

- Authentication and MFA/OTP controls per NFR-IDENTITY-002.
- Deny-by-default authorization and scope isolation per NFR-IDENTITY-001.
- Private evidence storage and fresh download authorization per NFR-PLATFORM-003.
- Validation and output minimization at API/resource boundaries.
- Immutable sensitive history and tamper-evident provenance per NFR-AUDIT-001/003.
- Secret/protected-data redaction in logs and errors.
- Separation of duties for sensitive reviews.
- No payment credential handling or money-movement integration in V1.

Security-sensitive business rules must have automated allow/deny and negative tests; details are owned by `docs/TESTING_STRATEGY.md` in Phase 3.

## 28. Performance and Scale

**Implements:** NFR-PLATFORM-001.

The architecture should satisfy the approved capacity envelope without premature distribution. A Laravel monolith with indexed relational queries, bounded eager loading, pagination, targeted caching for safe public reads, and queue-backed asynchronous work is sufficient as the starting architecture.

Provider search and operational queues will require indexes driven by their real query shapes. Exact indexes belong in `docs/database/ERD.md` and must state the query each index supports.

Caching must never replace synchronous revalidation for safety-critical booking/eligibility decisions. Cache invalidation strategy should follow the domain's freshness requirement rather than using global caching indiscriminately.

Load verification thresholds are defined in the PRD and later testing strategy.

## 29. Availability, Backup, and Recovery

**Implements:** NFR-PLATFORM-002.

The production deployment must support the required 99.5% monthly availability, RPO ≤15 minutes, and RTO ≤4 hours. Database, private evidence, quarantine metadata, deletion tombstones, and legal-hold state must all be recoverable consistently enough to reconstruct authoritative case history.

The `.spec` requirement explicitly references MySQL point-in-time recovery; production infrastructure must honor that requirement unless a later authoritative source changes it. Hosting/provider selection remains `Q-OPS-001`, so this document does not select a cloud vendor or managed service.

Recovery procedures and deployment topology are owned by Phase 2 operations documents.

## 30. Arabic, RTL, Accessibility, and Client Resilience

**Implements:** NFR-PLATFORM-005–006.

Backend contracts must expose Arabic-capable localized content and stable semantic states rather than requiring the client to derive meaning from internal codes. Accessibility layout/rendering belongs to client/UX implementation, but the API must provide the textual labels, reasons, state descriptions, and validation information needed to meet the requirement.

Draftable workflows should use server-side draft states only where the product permits drafts; otherwise clients may preserve local unsubmitted input without creating a submitted business record.

Retry-prone commands must rely on server idempotency so React Native can safely recover from ambiguous network outcomes.

## 31. Configuration Strategy

Runtime/product configuration should remain separated into:

1. environment/runtime configuration (database, queue, storage, logging, external-provider credentials), and
2. business policy configuration (versioned rules affecting classification, eligibility, deadlines, retention, evidence, finance, and launch readiness).

Business policy values that must reproduce historical decisions must not live only in `.env` or mutable config files. They require versioned persisted policy records/snapshots.

Existing `config/ubertib.php` currently exposes catalog mode and `record_only_non_funded` financial mode. Those values are application safety configuration; the record-only financial boundary also remains a product requirement and must be enforced by architecture/tests, not only by a mutable environment flag.

Detailed configuration ownership is deferred to `docs/ops/CONFIGURATION.md`.

## 32. Existing Behavior vs Required Change

### Implemented / meaningful evidence

- Laravel/Filament project foundation and test/tooling setup.
- Public versioned catalog route `GET /api/v1/catalog/service-groups`.
- Service groups/services/versioned service definitions.
- Evaluation catalog data and Arabic practical descriptions.
- Service publication action and partial version lifecycle.
- Clinical reviewer credential snapshots.
- Evidence-bound launch-gate decisions for service definitions.
- Model/database integrity tests around service definitions, catalog identity, clinical approval, and production visibility.

### Partially implemented

- FR-CATALOG-001.
- FR-POLICY-001 for service definitions only.
- FR-OPS-003 for service-scope launch gates only.

### Required new behavior

All remaining identity, eligibility, provider/branch, booking, treatment-case, financial-record, review, claims, operational, policy-generalization, audit, retention, evidence, notification, reporting, and production operations behavior described in the PRD.

Implementation status must be tracked in the final traceability matrix and must never be inferred from design documentation alone.

## 33. Dependency Rules

- `Http/*` and Filament UI adapters depend on application actions/query services, not the reverse.
- Domain/application logic must not depend on React Native or Filament presentation concepts.
- Financial-record logic must not depend on payment-provider SDKs in V1.
- Eligibility decisions may consume verified facts and versioned policy but must not depend on patient review rating `R` as a substitute for scientific evidence.
- Historical snapshots/events may reference stable identity/domain records but must carry enough captured data/version context to survive later mutation of those records.
- Audit logging may observe domain actions; domain correctness must not depend solely on the activity-log package.
- Background jobs invoke idempotent application actions and may not bypass authorization/policy scope merely because they run asynchronously.

## 34. Design Risks and Open Items

| ID | Severity | Technical impact |
|---|---|---|
| Q-PLATFORM-001 | Blocker | Full SRS reconciliation cannot be certified until readable authoritative v1.1 text is available. Do not claim lower-priority material supersedes it. |
| Q-CATALOG-001 | Major | 26 evaluation records cannot be treated as clinically approved production service definitions. |
| Q-ELIG-001 | Major | Production S/P/H/I formulas, thresholds, weights, and defaults require licensed clinical approval. |
| Q-PLATFORM-002 | Major | Final legal retention/deletion values may change policy/schema/scheduled processing. |
| Q-OPS-001 | Major | Hosting, managed database, object storage, queue, and recovery topology remain provider-neutral. |
| Q-PLATFORM-003 | Major | OTP, malware scanning/private evidence, and other external providers are unresolved; no provider-specific integration contract is authoritative. |
| Q-PLATFORM-004 | Minor | Treat low-thousands expected launch use and 10,000 registered-user engineering envelope as expected population versus capacity headroom unless superseded. |
| CONFLICT-PLATFORM-001 | Major | Historical backend feature planning named older PHP/Laravel/database/auth assumptions; current verified Composer/repository facts control implementation conventions unless product requirements demand change. |
| CONFLICT-CATALOG-001 | Major | Feature/OpenAPI evidence must remain classified separately from actually implemented routes and behavior. |
| CONFLICT-PLATFORM-002 | Major | Architecture-specific wording inside some NFR sources must not be expanded into additional product behavior before final SRS reconciliation. |

## 35. Technical Decision Allocation

No new canonical `TD-*` or `ASM-*` IDs are allocated in this Phase 1 SDD. The major architecture shape described above is either verified existing-repository convention, directly required by confirmed requirements/NFRs, or intentionally left unresolved under the existing `Q-*` / `CONFLICT-*` register.

Phase 2 conditional documents may identify a genuinely discretionary technical choice that requires a `TD-*`. If so, the ID must first be allocated append-only in `docs/README.md`, include rationale and rejected alternatives, and must not silently override product behavior.

## 36. Phase 2 Decomposition

The following documents should expand this SDD without redefining it:

- `docs/architecture/SYSTEM_ARCHITECTURE.md` — process/layer/module/runtime architecture.
- `docs/architecture/COMPONENT_DESIGN.md` — application/module/component responsibilities and dependencies.
- `docs/api/API_CONTRACTS.md` — complete API registry and contracts.
- `docs/api/ERROR_CATALOG.md` — stable client-relevant errors.
- `docs/database/ERD.md` — persistent entities, columns, relationships, constraints, indexes.
- `docs/database/DFD.md` — non-trivial data movement and trust boundaries.
- `docs/domain/STATE_MACHINES.md` — lifecycle states/transitions.
- `docs/domain/PERMISSIONS_MATRIX.md` — actor/action/scope authorization.
- `docs/diagrams/SEQUENCE_DIAGRAMS.md` — ordering-sensitive workflows.
- `docs/ops/CONFIGURATION.md` — runtime and policy configuration ownership.
- `docs/ops/INFRASTRUCTURE.md` — provider-neutral production topology and recovery needs.
- `docs/ops/MONITORING.md` — logs, metrics, health, queues, alerts, privacy constraints.

`docs/integrations/INTEGRATION_CONTRACTS.md` remains omitted until at least one concrete third-party provider contract is established. `docs/ux/SCREEN_INVENTORY.md` remains omitted because no implemented business UI establishes authoritative screens and screen/flow design belongs to the dedicated UX pipeline for this run.
