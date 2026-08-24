# UberTib Testing Strategy

**Phase:** 3 — Verification, Implementation Planning, and Traceability  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/*`, `docs/api/*`, `docs/database/*`, `docs/domain/*`, `docs/diagrams/SEQUENCE_DIAGRAMS.md`, `docs/ops/*`  
**Requirement sources:** `.spec/functional-requirements/` and `.spec/non-functional-requirements/`  
**Registry:** `docs/README.md`

## 1. Purpose

This document defines the verification strategy for UberTib V1. It owns how approved functional and non-functional requirements are proved through automated tests, integration tests, database tests, concurrency tests, security checks, operational verification, and governed manual acceptance where automation cannot establish clinical/legal approval.

The strategy distinguishes:

- **Existing verification** — tests and quality gates verified in the current Laravel repository;
- **Required verification** — tests necessary to prove the approved V1 behavior but not yet implemented;
- **Governed acceptance** — evidence that requires an authorized human clinical, legal, operational, or product decision rather than a software assertion.

This document does not define UI layouts or UX acceptance screens. UI-specific test cases remain downstream of the separate UX pipeline.

`Q-PLATFORM-001` remains a Blocker for claiming complete end-to-end reconciliation with readable authoritative SRS v1.1 text. `Q-CATALOG-001` and `Q-ELIG-001` prevent automated tests from being treated as licensed clinical approval of the provisional service catalog or production S/P/H/I policy.

## 2. Verification Principles

1. Every approved `FR-*` and `NFR-*` must have an explicit verification method before production release.
2. Safety-critical invariants are tested at more than one layer when feasible: domain behavior, persistence constraints, API behavior, and integration/concurrency behavior.
3. Tests verify outcomes and invariants, not implementation trivia.
4. External-provider behavior is isolated behind fakes/contracts until a concrete provider is approved.
5. Sensitive workflows fail closed when required evidence, authorization, readiness, or policy data is missing.
6. Historical snapshots/events are tested for immutability and reproducibility.
7. Financial tests prove **recording of external financial facts only** and explicitly prove absence of platform money movement.
8. S/P/H/I and eligibility tests feed source facts and policy versions into the system; tests never legitimize a direct final-outcome input path.
9. `PENDING_EVALUATION` is tested as a distinct state and never treated as scientific grade `F`.
10. Race conditions, retries, duplicated requests, expired deadlines, revoked grants, and stale state are first-class test scenarios.
11. Production database behavior must be tested on the selected production engine in addition to the fast SQLite suite.
12. A passing automated suite does not override unresolved clinical, legal, infrastructure, or provider approval questions.

## 3. Verified Current Test Toolchain

The backend currently uses:

- Pest `^4.7` with `pestphp/pest-plugin-laravel ^4.1`;
- PHPUnit `^12.5.12` as the underlying runner;
- Pest type coverage plugin `^4.0`;
- Laravel Pint;
- Rector Laravel;
- Larastan/PHPStan;
- Roave Security Advisories at dependency-resolution time.

Current Composer verification scripts are:

```text
composer test:lint
composer test:types
composer test:type-coverage
composer test:coverage
composer test:unit
composer test:mysql
composer test
```

Verified behavior of those scripts:

- `composer test:lint` runs Pint in check mode and Rector dry-run;
- `composer test:types` runs PHPStan;
- `composer test:type-coverage` enforces Pest type coverage at `--min=100`;
- `composer test:coverage` runs Pest with line coverage `--min=100`;
- `composer test:unit` runs the Laravel/Pest suite in parallel with two processes;
- `composer test:mysql` runs the suite against `phpunit.mysql.xml`;
- `composer test` aggregates lint, static analysis, type coverage, and line coverage; it does **not** replace the explicit MySQL verification gate.

The configured 100% line/type thresholds are repository quality gates. This strategy does not lower them to accommodate future V1 implementation.

## 4. Current Test Environments

### 4.1 Default test environment

`phpunit.xml` currently uses:

- `APP_ENV=testing`;
- SQLite in-memory database;
- array cache;
- array session;
- synchronous queue;
- array mail transport;
- reduced bcrypt rounds for tests;
- Pulse/Telescope/Nightwatch disabled.

This environment is appropriate for fast deterministic application tests but cannot prove every production database or asynchronous behavior.

### 4.2 MySQL compatibility environment

`phpunit.mysql.xml` runs the same Unit/Feature suites against:

```text
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ubertib_test
DB_USERNAME=root
```

Production credentials/topology must not reuse these test defaults.

The MySQL suite is required because current catalog/governance integrity logic includes database-specific behavior and future booking/concurrency constraints must be proven on a production-like relational engine.

### 4.3 Required additional verification environments

Before production, the project also needs:

- a production-engine integration environment with representative indexes/constraints;
- an asynchronous queue environment rather than only `QUEUE_CONNECTION=sync`;
- a private-storage/evidence test environment with provider fakes or approved sandbox services;
- a load/concurrency environment isolated from production;
- a restore-test environment for backup recovery exercises.

Concrete infrastructure remains governed by `Q-OPS-001` and `Q-PLATFORM-003`.

## 5. Verified Existing Automated Coverage

The repository currently contains a narrow but meaningful catalog/governance test slice.

Verified test files include:

- `tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php`;
- `tests/Feature/Models/CatalogIdentityIntegrityTest.php`;
- `tests/Feature/Models/ClinicalApprovalIntegrityTest.php`;
- `tests/Feature/Models/ServiceDefinitionTest.php`;
- `tests/Feature/Models/UserTest.php`;
- `tests/Unit/ArchTest.php`;
- framework example tests that are not substantive UberTib requirement coverage.

Existing coverage already exercises material behavior including:

- evaluation catalog structure and the four evaluation groups / 26 provisional services;
- production filtering and launch-readiness behavior;
- service-definition version lifecycle and immutability;
- catalog identity integrity;
- clinical launch approval integrity;
- highest applicable version selection without unsafe fallback;
- architectural conventions represented by the current architecture test.

This is **partial implementation coverage**, not V1 acceptance coverage. Identity/OTP, scoped permissions, provider activation, S/P/H/I, booking, cases, finance, reviews, claims, operations, evidence security, and most NFRs remain unimplemented or unverified end to end.

## 6. Test Layers

### 6.1 Unit/domain tests

Use for deterministic pure behavior such as:

- policy evaluation helpers;
- classification calculations after clinically approved formulas exist;
- deadline calculations;
- state-transition guards;
- normalization/value objects;
- safe error mapping;
- immutable snapshot hashing/normalization;
- permission scope predicates where meaningful outside persistence.

Unit tests must not mock away the invariant being tested.

### 6.2 Feature/application tests

Use Laravel feature tests for:

- actions/queries;
- authorization policies;
- transaction behavior;
- Eloquent/database invariants;
- workflow transitions;
- audit creation;
- queue dispatch boundaries;
- evidence metadata lifecycle;
- provider/service/branch scoping.

### 6.3 API contract tests

Every implemented `API-*` contract must verify:

- method and route;
- authentication requirement;
- authorization/scope behavior;
- validation failures;
- success payload shape;
- stable public identifiers;
- state-dependent conflict behavior;
- stable `ERR-*` error code where the target error contract applies;
- privacy-safe fields;
- idempotency where required;
- no accidental exposure of internal `I`, private evidence paths, reviewer credentials, OTP material, or protected payloads.

The currently implemented `API-CATALOG-001` remains the baseline example but its 429/500 responses still require future normalization to the target stable error envelope documented in `ERROR_CATALOG.md`.

### 6.4 Persistence/constraint tests

Required for invariants that cannot safely depend only on request validation:

- stable catalog identity immutability;
- version uniqueness/effective-period rules;
- append-only records;
- foreign keys;
- active/effective uniqueness rules;
- one verified review per eligible experience;
- idempotency key uniqueness;
- evidence binding integrity;
- booking capacity/concurrency protection;
- supersession chains;
- historical snapshot immutability.

Run these tests on SQLite where supported and on the chosen production relational engine.

### 6.5 Integration/provider-contract tests

Required only after a concrete provider exists. Until then use application adapters/fakes for:

- OTP delivery;
- privileged MFA;
- malware scanning;
- notification delivery;
- private object storage where externalized.

No payment-provider integration tests belong to V1.

### 6.6 End-to-end workflow tests

Backend/API-level E2E workflows must verify complete business paths across aggregates, for example:

- provider facts → verification → eligibility decision → patient discovery → booking;
- booking → treatment plan → acceptance → immutable snapshots → treatment-stage evidence;
- external payment report → counterparty confirmation/dispute → financial timeline;
- eligible case → verified review → review appeal;
- refund/protection claim → evidence → human decision → external-action record → appeal.

UI automation is not defined by this engineering document because authoritative business UI has not yet been produced.

## 7. Requirement Traceability Rule

The final `docs/TRACEABILITY_MATRIX.md` must map every approved requirement to at least one verification method.

Allowed verification methods are:

- automated unit test;
- automated feature/application test;
- automated API contract test;
- database/constraint test;
- concurrency/load test;
- security test;
- recovery/operations exercise;
- accessibility/localization verification;
- governed human acceptance where software alone cannot establish approval.

This strategy intentionally allocates **no new `TC-*` identifiers**. Executable test-case IDs should be allocated only when concrete cases are introduced into the authoritative registry and implementation/traceability artifacts, avoiding placeholder IDs that imply nonexistent tests.

## 8. Identity and Authorization Verification

**Requirements:** FR-IDENTITY-001–003; NFR-IDENTITY-001–002.

Required tests include:

- OTP generation is six digits without persisting the raw code;
- OTP expires at five minutes;
- single-use consumption;
- maximum five verification attempts;
- maximum three sends per 15-minute phone/account/IP scope;
- resend invalidates prior challenge without resetting accumulated failures;
- equivalent error behavior avoids unnecessary account/identity enumeration;
- privileged roles cannot satisfy the required second factor with SMS alone;
- deny-by-default authorization;
- role + organization + branch + workflow + subject-matter + purpose + time scope combinations;
- changing route/request identifiers cannot escape scope isolation;
- revoked/expired grants stop access immediately;
- guardian actions retain guardian actor attribution and patient ownership remains unchanged;
- administrator/coarse role does not become universal domain bypass;
- protected evidence and case data use fresh authorization checks.

Authorization tests should be table-driven across actor/resource/action combinations derived from `PERMISSIONS_MATRIX.md`.

## 9. Catalog and Launch Governance Verification

**Requirements:** FR-CATALOG-001, FR-POLICY-001–002, FR-OPS-003.

Existing tests are extended to prove:

- only visible/eligible service definitions appear for the selected catalog mode;
- evaluation content cannot leak into production mode;
- production publication fails without every required current gate;
- medical launch approval requires a current verified clinical credential;
- approval content hash must match the definition being published;
- expired/revoked gate or credential causes readiness to fail closed;
- higher version publication supersedes the earlier active version atomically;
- historical effective versions remain reproducible;
- active/retired/superseded definitions cannot have governed content silently rewritten;
- V1 funded protection remains rejected;
- launch status cannot be inferred from infrastructure availability alone.

The 26 provisional records may be used as evaluation fixtures but automated tests must label them evaluation data. Test success does not satisfy `Q-CATALOG-001`.

## 10. Eligibility and S/P/H/I Verification

**Requirements:** FR-ELIG-001–017, FR-POLICY-002, NFR-AUDIT-003.

After licensed clinical approval supplies production formulas/policies, tests must cover:

- one decision scoped to provider + service + branch + policy context;
- approved source facts/evidence are the only accepted decision inputs;
- no API/admin/action path accepts a manually supplied final eligibility outcome;
- no user path directly sets S, P, H, or I;
- missing/expired mandatory inputs create `PENDING_EVALUATION`;
- `PENDING_EVALUATION` is never grade `F`;
- grade-cap/confidence behavior exactly matches the approved versioned policy;
- P derives from actual price + effective versioned price bands;
- H and I derive from governed policies;
- most-restrictive gate determines final eligibility;
- changing an influential approved fact creates a **new** decision rather than rewriting history;
- invalid/revoked/expired dependency immediately blocks new bookings for the affected scope;
- unaffected provider/service/branch scopes do not become suspended;
- patient-facing explanations omit raw internal risk and protected evidence;
- historical decision reproduction yields the same result from captured policy/input snapshot.

Property-based or parameterized tests are strongly preferred for approved formula boundary values once `Q-ELIG-001` is resolved.

## 11. Booking Verification

**Requirements:** FR-BOOKING-001–003, NFR-AUDIT-002.

Required tests cover:

- request-time revalidation of service publication, branch readiness, provider eligibility, and slot capacity;
- confirmation-time revalidation repeats safety checks;
- provider accept/reject/alternative actions require exact provider/branch scope;
- rejection records a reason;
- provider response expires at 12 hours or two hours before the appointment, whichever occurs first;
- alternative proposal requires patient/authorized guardian acceptance;
- stale alternative cannot confirm;
- cancellation validates actor + current state + versioned policy;
- no-show cannot be recorded before the policy threshold;
- financial/review consequences are derived as records/events rather than money movement or historical rewrites;
- invalid transitions map to the documented booking errors;
- repeated idempotent commands return the original committed outcome.

### 11.1 Mandatory concurrency test

`NFR-PLATFORM-001` requires a test where **100 concurrent booking attempts cannot overbook the configured slot capacity**.

The production-engine concurrency test must:

1. create a slot with known capacity;
2. issue 100 independent competing confirmation attempts;
3. synchronize their critical section closely enough to exercise contention;
4. assert confirmed bookings never exceed capacity;
5. assert losing requests receive deterministic conflict behavior rather than silent success;
6. verify no duplicate capacity reservation/event from idempotent retries;
7. inspect final authoritative rows rather than relying only on API responses.

SQLite in-memory results are not sufficient evidence for this concurrency requirement.

## 12. Clinical Case and Treatment Verification

**Requirements:** FR-CLINICAL-001–005, FR-FINANCE-001.

Required tests include:

- only authorized treating clinicians can author the clinical plan;
- system output never represents an autonomous diagnosis/prescription/treatment plan;
- incomplete service/stage/price/policy content cannot be accepted;
- acceptance creates immutable treatment and financial snapshots in one committed workflow;
- later amendment creates a new version/snapshot and preserves prior accepted history;
- stage completion fails when mandatory evidence/facts/acknowledgments are missing or invalid;
- stage completion records actor/time/evidence context;
- reopening/correction preserves prior completion event/history;
- follow-up scheduling/rescheduling preserves traceability;
- unified case timeline reconstructs ordered booking, clinical, financial, review, claim, and operational facts without mutating source records.

## 13. External Financial Record Verification

**Requirements:** FR-FINANCE-001–007, NFR-FINANCE-001, NFR-AUDIT-003.

Financial verification has two equally important goals: prove the record workflow and prove the absence of platform money movement.

Required tests:

- every financial record references the correct case and immutable financial-terms snapshot;
- external payment report begins unconfirmed;
- only an authorized counterparty/scoped reviewer can confirm or dispute;
- confirmation/dispute appends a new event and never rewrites the original assertion;
- refund/compensation external execution confirmation is append-only;
- corrections/reversals are later events linked to earlier events;
- derived financial state is reproducible from ordered event history;
- duplicate idempotency key creates no duplicate financial event;
- no gateway payment intent, capture, transfer, wallet balance, payout, settlement, escrow, custody, or platform refund execution occurs;
- forbidden financial mode/funded-protection configuration fails closed;
- financial client responses/logs do not expose unnecessary sensitive details.

A V1 release must include a negative architecture/security test that detects introduction of prohibited payment/custody behavior or dependencies where practical.

## 14. Review and Appeal Verification

**Requirements:** FR-REVIEWS-001–002.

Required tests:

- review accepted only after eligible verified completion;
- only linked patient or currently authorized guardian may submit;
- review-window deadline uses the governing policy snapshot;
- a second active review for the same eligible experience is rejected;
- verified-experience link cannot be detached silently;
- review rating `R` stays separate from S/P/H/I and cannot alter scientific eligibility;
- review appeal records appellant, grounds, evidence, policy, and time;
- only authorized integrity reviewer may issue publication/eligibility compliance decision;
- appeal does not directly edit rating content or scientific classification;
- original review/appeal history remains auditable.

## 15. Claims, Refund Requests, and Sensitive Human Review

**Requirements:** FR-CLAIMS-001–005.

Required tests:

- refund request validates case, accepted terms, deadline, claimant, amount/currency, and evidence requirements;
- protection claim cannot be submitted without applicable protection entitlement in the immutable accepted snapshot;
- claim policy/evidence/deadline rules are captured from the correct historical version;
- missing/rejected/expired/accepted evidence states are distinguishable;
- deadline pause/extension creates an event and never erases original deadline;
- sensitive decision requires an appropriately scoped human reviewer;
- separation-of-duties rule rejects a conflicted reviewer where governing policy requires independence;
- automated components may prepare facts/routing but cannot issue the final sensitive decision;
- decision records findings, reasons, evidence references, policy version, actor, time, and required external action;
- approval of a refund/compensation creates an entitlement/amount-due record only and does not execute money movement;
- appeal references and preserves original decision;
- appeal deadline and reviewer independence are enforced;
- closed claim remains reasoned/reproducible.

## 16. Operations, Audit, and Idempotency Verification

**Requirements:** FR-OPS-001–003, FR-AUDIT-001–003, NFR-AUDIT-001–003, NFR-PLATFORM-008.

Required tests include:

- sensitive action audit contains actor, effective scope/role, action, resource, outcome, reason where required, correlation ID, and time;
- audit safe metadata excludes OTP, credentials, signed URLs, raw private evidence, and unnecessary clinical/financial payloads;
- append-only audit/integrity records cannot be silently updated/deleted;
- idempotency scope includes actor/operation/resource and request fingerprint;
- same key + same request returns original committed result;
- same key + different request fingerprint returns `ERR-AUDIT-001`;
- failed pre-commit request does not masquerade as a committed idempotent result;
- queue/work item creation happens after authoritative transaction commit for flows that depend on committed state;
- retried jobs reload authoritative state and do not duplicate business outcomes;
- stale/failed work items remain operationally visible;
- integrity mismatch records exception rather than silently repairing history.

## 17. Private Evidence and File Security Verification

**Requirements:** NFR-PLATFORM-003 plus evidence-bearing FRs.

Required automated/security tests:

- accepted extensions: PDF/JPEG/PNG only where the requirement applies;
- size limits: 10 MB image, 25 MB PDF;
- maximum 10 files per action;
- extension, magic bytes, MIME, and file decode/parse validation;
- opaque/UUID object identity;
- SHA-256 captured;
- object remains quarantined until scan success;
- failed/pending scan cannot satisfy business evidence requirements;
- private evidence never uses the public disk/public storage URL;
- direct object/path guessing cannot bypass authorization;
- short-lived signed access is no longer valid after the approved maximum lifetime;
- download authorization is re-evaluated and audited;
- evidence deletion respects retention and legal hold;
- logs/errors do not emit object secrets, signed URLs, or protected file content.

Until a malware-scanning/storage provider is approved, provider interaction is tested through fakes and local contract semantics rather than invented vendor behavior.

## 18. Privacy, Retention, and Legal Hold Verification

**Requirement:** NFR-PLATFORM-004.

Retention periods are provisional under `Q-PLATFORM-002`, so tests should separate **mechanism correctness** from final legal-period acceptance.

Mechanism tests must prove:

- retention clock resolves from the captured governing rule;
- legal hold prevents destruction;
- release of hold does not automatically destroy data before normal eligibility checks;
- abandoned/unverified/temp cleanup does not remove referenced historical evidence;
- destruction is auditable without preserving the protected payload itself;
- deletion jobs are retry-safe;
- immutable/audit obligations are reconciled with approved deletion/anonymization policy rather than silently cascading historical records.

Final numeric legal periods remain governed acceptance until `Q-PLATFORM-002` is resolved.

## 19. API Error and Privacy Verification

**Owner:** `docs/api/ERROR_CATALOG.md`.

For each implemented error:

- stable code matches the catalog;
- HTTP status matches the catalog;
- Arabic-first safe message is available where user-facing;
- validation `details` do not expose internal/private values;
- `correlation_id` is available for operational support where target envelope applies;
- server failures do not return stack traces/config/secrets;
- authorization failures do not disclose a hidden resource unnecessarily;
- rate-limit behavior is deterministic enough for client recovery;
- retryability follows the documented recovery model.

Contract tests should compare canonical error codes, not fragile full-message wording unless wording itself is an approved requirement.

## 20. Performance and Scale Verification

**Requirement:** NFR-PLATFORM-001.

### 20.1 Approved targets

- 10,000 registered identities;
- 3,000 MAU planning baseline;
- 500 DAU planning baseline;
- approximately 100 concurrent users;
- approximately 75 requests/second burst;
- normal reads p95 ≤ 500 ms;
- normal writes p95 ≤ 800 ms;
- provider search p95 ≤ 1 second;
- 30-minute test error rate < 1%;
- 100 concurrent booking attempts cannot overbook capacity.

### 20.2 Required load scenarios

At minimum run:

1. public catalog read burst;
2. eligible-provider search with representative data/indexes;
3. authenticated patient case/timeline reads;
4. representative normal write path;
5. queue-producing writes;
6. 100-way booking contention;
7. mixed 30-minute workload at expected launch concurrency;
8. degraded dependency scenario to confirm external-provider slowness does not consume all application capacity.

Measurements must separate application latency, database latency, queue latency, and external-provider latency where applicable.

Performance tests use production-like configuration/data volume but never real protected patient data.

## 21. Availability, Backup, and Recovery Verification

**Requirement:** NFR-PLATFORM-002.

Approved targets:

- 99.5% availability objective;
- RPO ≤ 15 minutes;
- RTO ≤ 4 hours;
- quarterly restore verification.

Required operational exercises:

- restore database backup to an isolated environment;
- validate schema/integrity and representative immutable histories after restore;
- prove restored point satisfies the measured RPO;
- measure service restoration workflow against RTO;
- verify evidence-store recovery/availability strategy does not orphan database references;
- verify backup failure/staleness triggers alerting;
- record restore test date, artifact/version, backup point, actual RPO/RTO, verifier, and result.

A configured backup without a successful restore exercise is not sufficient acceptance evidence.

## 22. Observability and Queue Verification

**Requirement:** NFR-PLATFORM-008.

Tests/operational probes must prove:

- every request has a correlation identifier;
- asynchronous jobs propagate/create correlation context;
- queue age, retry count, failed-job count, scan backlog, notification failure, reevaluation delay, deadline breach, and backup status are measurable;
- threshold breach creates the intended alert/operational signal;
- operators can distinguish committed business outcome from delayed side effect;
- retry/escalation is audited;
- monitoring telemetry is privacy-safe;
- monitoring outage does not become permission to skip domain safety checks.

Provider-specific alert transport is not tested until selected; alert-condition generation is testable independently.

## 23. Arabic, RTL, and Accessibility Verification

**Requirement:** NFR-PLATFORM-005.

Backend/contract-level tests can prove:

- Arabic service names/descriptions round-trip correctly under selected database charset/collation;
- JSON/API encoding preserves Arabic text;
- user-facing API error text supports Arabic-first product behavior;
- mixed Arabic/English data does not corrupt identifiers or validation.

Full RTL layout and WCAG 2.2 AA interaction verification belongs to the UX/client implementation phase once authoritative interfaces exist. The later UX testing plan must include keyboard/focus, screen-reader semantics, contrast, text scaling, logical reading order, dynamic content, and bidirectional text behavior.

Engineering documentation must not claim WCAG/RTL completion before those interfaces are implemented and tested.

## 24. Weak Connectivity and Retry Verification

**Requirement:** NFR-PLATFORM-006.

API/application tests must simulate:

- request timeout after server commit followed by identical retry;
- interrupted draft save/recovery;
- duplicate mutation caused by mobile reconnect;
- stale client state on booking/claim actions;
- retry after 429/temporary failure;
- out-of-order background notification delivery;
- delayed upload/scan completion.

Required outcomes:

- committed mutations are not duplicated;
- stale state fails with recoverable current-state information rather than corrupting history;
- drafts can be safely resumed where the feature supports drafts;
- non-authoritative notification failure does not undo committed business state.

## 25. Maintainability and Contract Verification

**Requirement:** NFR-PLATFORM-007.

Required gates include:

- Pint check;
- Rector dry-run;
- PHPStan;
- 100% configured type coverage threshold;
- 100% configured line coverage threshold;
- architecture tests protecting agreed layering/conventions;
- API version remains under `/api/v1` unless an explicit versioning change is approved;
- OpenAPI/Scramble output must not silently contradict implemented routes/resources;
- presentation layers do not contain hard-coded clinical/financial policy calculations;
- domain behavior remains independently testable outside Filament/React Native presentation.

Generated API documentation is evidence of route/schema shape, not a substitute for behavioral tests.

## 26. Immutable Snapshot and Event Integrity Verification

**Requirement:** NFR-AUDIT-003.

For every immutable/superseding entity family, test:

1. creation captures exact governing version/input context;
2. protected fields cannot be updated after terminal/accepted state;
3. correction produces new version/event/snapshot;
4. prior record remains queryable for authorized audit/reproduction;
5. hash/content binding detects unintended changes where hashes apply;
6. timeline order is deterministic;
7. deleting a parent cannot cascade-delete required immutable history;
8. current derived view can be recomputed from the event/snapshot chain where the design promises reproducibility.

This applies particularly to service definitions, launch decisions, credentials, eligibility decisions, accepted treatment/financial snapshots, booking events, financial events, claim decisions, policy versions, and audit records.

## 27. Security Verification

Security verification includes automated application tests, dependency controls, configuration checks, and targeted manual review.

Minimum scope:

- authentication/OTP abuse controls;
- deny-by-default authorization and cross-scope isolation;
- IDOR/resource identifier manipulation;
- mass-assignment of protected outcome/state fields;
- CSRF for browser/Filament mutation paths as applicable;
- API authentication/replay behavior once auth transport is selected;
- rate limiting;
- input validation and unsafe file uploads;
- stored/reflected output escaping where user content is rendered;
- SQL injection resistance through framework/query conventions plus review;
- secret/config leakage;
- private evidence path/access leakage;
- log privacy;
- prohibited payment/money-movement surface;
- dependency vulnerability gate through project dependency policy.

Penetration testing scope/tooling is not specified by current source material and should not be claimed until scheduled/approved.

## 28. Test Data Strategy

### 28.1 Synthetic data only

Automated suites use factories/fixtures and synthetic evidence. Production patient/clinical evidence must not be copied into developer/test environments.

### 28.2 Deterministic time

Deadline, expiry, effective-period, OTP, booking, claim, retention, and launch tests freeze or control time explicitly.

### 28.3 Catalog fixtures

The 26 seeded service records are usable only as **evaluation** fixtures until clinical approval. Tests must not rename them production-approved or use fixture presence as a production-readiness assertion.

### 28.4 Policy fixtures

Formula/threshold fixtures must declare the policy version they represent. When clinical/legal defaults change prospectively, old test fixtures remain available for historical reproduction tests while new policy tests cover the replacement version.

### 28.5 Parallel isolation

Parallel tests must isolate database and file state. Shared filesystem paths, idempotency keys, external fake mail/notification state, and mutable clocks must not make tests order-dependent.

## 29. External Dependency Test Rules

The test suite must prevent accidental real external calls during automated tests.

For every future adapter:

- default tests use fakes/stubs;
- unexpected network calls fail the test where practical;
- explicit sandbox/contract suites are separately tagged/configured;
- secrets come from CI secret storage, never committed fixtures;
- provider outage/timeout/retry behavior is tested;
- a provider success response is not treated as authoritative business success until local transaction/invariant rules succeed.

No V1 test suite may require a payment gateway.

## 30. CI and Merge Gates

At minimum, backend changes should not be merged when an applicable required gate fails.

Recommended verification sequence:

```bash
cd UberTip-Backend
composer test:lint
composer test:types
composer test:type-coverage
composer test:coverage
composer test:unit
composer test:mysql
```

`composer test` may replace the first four commands when the CI job uses that aggregate script, but `composer test:mysql` remains an explicit separate database-compatibility gate unless the Composer scripts are later changed.

Additional domain-specific integration/load/recovery suites may run in slower CI stages or release pipelines, but safety-critical behavior must not be left to an undocumented manual check.

The exact CI provider/workflow is not fixed by this document.

## 31. Release Verification Levels

### Pull request gate

Required for every backend change:

- affected automated tests;
- static analysis;
- code style/refactor dry-run;
- configured type/line coverage gates;
- relevant SQLite feature/unit tests;
- MySQL suite when schema/queries/constraints/concurrency behavior can be affected.

### Pre-release gate

Required for a V1 release candidate:

- full automated backend suite;
- production-engine integration suite;
- API contract/error/privacy suite;
- permissions matrix negative tests;
- concurrency/idempotency suite;
- private evidence security suite;
- load/performance suite;
- queue/observability verification;
- backup/restore exercise evidence current within the approved cadence;
- migration forward/rollback/recovery rehearsal as appropriate to the migration design;
- no unresolved blocker that invalidates the released feature scope.

### Production medical readiness gate

In addition to software verification:

- the applicable service definitions must have required current launch approvals;
- licensed clinical approval must cover the production medical catalog/policies;
- `Q-CATALOG-001` / `Q-ELIG-001` must be resolved for the behavior being enabled;
- production catalog mode must remain `production`;
- evaluation records must not be promoted through test success alone.

## 32. Acceptance and Exit Criteria by Domain

A domain is not considered V1-complete until:

| Domain | Minimum exit evidence |
|---|---|
| IDENTITY | OTP/MFA + scoped permission + guardian/isolation tests pass |
| CATALOG | Publication/version/launch tests pass; clinical readiness separately approved |
| ELIG | Approved policy boundary tests + provenance + no-manual-outcome + reevaluation tests pass |
| BOOKING | Lifecycle/deadline/idempotency + production-engine 100-way capacity test pass |
| CLINICAL | Clinician ownership + acceptance snapshots + evidence-gated stage completion pass |
| FINANCE | Append-only external record workflow passes and zero-money-movement negative controls pass |
| REVIEWS | Verified-experience uniqueness + R separation + appeal tests pass |
| CLAIMS | Eligibility/evidence/deadline/human review/SoD/appeal tests pass |
| OPS | Work queues, retries, alerts, reporting evidence, launch gates pass |
| POLICY | Version lifecycle, effective uniqueness, reproduction, immutability pass |
| AUDIT | Complete privacy-safe audit + idempotency + integrity tests pass |
| PLATFORM | Performance, recovery, security, files, Arabic/RTL/accessibility applicable evidence pass |

## 33. Defect Severity for Verification

Testing should classify defects by product consequence rather than only visual/technical impact.

- **Blocker:** can enable unsafe production medical behavior, money movement, unauthorized protected-data access, unrecoverable historical corruption, capacity overbooking, or invalidates release verification.
- **Major:** breaks a Must Have workflow, permission boundary, immutable/reproducible history, required NFR, or creates materially incorrect operational state.
- **Minor:** localized defect that does not break a safety/business invariant and has an acceptable workaround.

A defect is not downgraded merely because it is difficult to reproduce when it affects a high-impact invariant.

## 34. Open Questions and Testing Constraints

| ID | Severity | Verification impact |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Cannot claim full SRS v1.1 reconciliation until readable authoritative text is reviewed. |
| `Q-CATALOG-001` | Major | Automated catalog tests cannot certify clinical production approval for the 26 provisional records. |
| `Q-ELIG-001` | Major | Final production formula/threshold boundary suites depend on licensed clinical approval. |
| `Q-PLATFORM-002` | Major | Retention mechanism can be tested, but final legal-period acceptance remains open. |
| `Q-OPS-001` | Major | Final production-engine/infrastructure/load/recovery environment remains provider/topology dependent. |
| `Q-PLATFORM-003` | Major | Concrete OTP/MFA/malware/private-evidence/notification provider contract suites cannot be finalized. |
| `Q-PLATFORM-004` | Minor | Capacity tests use approved NFR headroom even though expected launch population is lower. |
| `CONFLICT-PLATFORM-001` | Major | Verification must target the current repository stack, not the stale historical stack assumptions. |
| `CONFLICT-PLATFORM-002` | Major | Any requirement-type classification changed during later SRS reconciliation may require traceability remapping, not silent deletion of tests. |

## 35. Current Verification Gap Summary

Current automated coverage is concentrated in catalog/service-definition/launch-readiness governance. The majority of V1 verification described above is **required but not yet implemented**, matching the current codebase's narrow implementation state.

The largest safety-critical future test gaps are:

- deny-by-default scoped authorization;
- clinically approved S/P/H/I and eligibility computation;
- booking concurrency/revalidation/idempotency;
- immutable treatment/financial agreements;
- record-only financial event workflows;
- evidence security and malware-scan gating;
- claim human-review/separation-of-duties flows;
- performance/recovery/observability release evidence.

These gaps are expected to become implementation work in `docs/IMPLEMENTATION_PLAN.md`; this document does not imply that they already exist in code.

## 36. Phase 3 Handoff

The next Phase 3 artifact, `docs/IMPLEMENTATION_PLAN.md`, must convert the approved product/design/test requirements into ordered implementation work while preserving dependency order and blockers.

After implementation planning, `docs/TRACEABILITY_MATRIX.md` must prove coverage across requirement → design → API/data/state/permission → verification → implementation task relationships. `docs/scripts/validate_docs.py` then provides mechanical documentation consistency checks.
