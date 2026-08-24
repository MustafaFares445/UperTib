# UberTib Testing Strategy

**Phase:** 3 — Verification, Implementation Planning, and Traceability  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/*`, `docs/api/*`, `docs/database/*`, `docs/domain/*`, `docs/diagrams/SEQUENCE_DIAGRAMS.md`, `docs/ops/*`  
**Cross-platform behavior owner:** `docs/domain/CROSS_PLATFORM_BEHAVIOR.md`  
**Requirement sources:** `.spec/functional-requirements/` and `.spec/non-functional-requirements/`  
**Implementation owner:** `docs/IMPLEMENTATION_PLAN.md` and `docs/implementation/*`  
**Coverage owner:** `docs/TRACEABILITY_MATRIX.md`  
**Registry:** `docs/README.md`

## 1. Purpose

This document defines how UberTib V1 requirements are verified and allocates the canonical concrete `TC-*` test-case identifiers used by Phase 3 traceability.

It distinguishes:

- **Existing** — executable verification already confirmed in the repository;
- **Partial** — an existing test proves part of the listed case but V1 assertions remain to be added;
- **Planned** — the acceptance case is concretely specified here but the executable test/artifact is not implemented yet;
- **Governed acceptance** — licensed clinical, legal, operational, or other accountable human evidence that software tests cannot replace.

A `TC-*` marked Planned is not evidence that the application already passes it. It is a concrete implementation acceptance contract that must become executable or otherwise produce the specified verification artifact before the owning requirement is considered released.

`Q-PLATFORM-001` remains a Blocker for claiming complete reconciliation against readable authoritative SRS v1.1. `Q-CATALOG-001` and `Q-ELIG-001` prevent software tests from being treated as licensed clinical approval of the provisional catalog or production S/P/H/I policy.

## 2. Verification Principles

1. Every approved `FR-*` and `NFR-*` must trace to one or more concrete `TC-*` cases or an explicitly identified governed acceptance requirement.
2. Safety-critical invariants are verified at more than one layer when feasible: domain, persistence, API/adapter, concurrency, and cross-platform projection.
3. Laravel is the authoritative business-state source. Patient, Clinic, and Admin tests must not legitimize independent platform copies of shared records.
4. Tests verify outcomes and invariants rather than framework implementation trivia.
5. Sensitive workflows fail closed when authorization, evidence, policy, readiness, or current state is missing or invalid.
6. Historical snapshots/events are tested for immutability and reproducibility.
7. Financial verification proves both the record-only workflow and the absence of payment/custody/money-movement behavior.
8. S/P/H/I tests provide source facts and policy versions; they never directly input final classifications as an accepted business path.
9. `PENDING_EVALUATION` is distinct from scientific grade `F`.
10. Race conditions, retries, duplicate commands, stale state, expired deadlines, revoked grants, and failed post-commit notifications are first-class scenarios.
11. Production-database/concurrency behavior must be verified on the selected production relational engine, not only SQLite in-memory.
12. A passing automated suite never substitutes for unresolved clinical/legal/accountable approval.

## 3. Verified Current Toolchain and Quality Gates

The backend currently uses Pest `^4.7`, Pest Laravel `^4.1`, PHPUnit `^12.5.12`, Pest type coverage, Laravel Pint, Rector Laravel, Larastan/PHPStan, and Roave Security Advisories.

Verified Composer commands:

```text
composer test:lint
composer test:types
composer test:type-coverage
composer test:coverage
composer test:unit
composer test:mysql
composer test
```

Current behavior:

- `composer test:lint` — Pint check + Rector dry-run;
- `composer test:types` — PHPStan;
- `composer test:type-coverage` — configured minimum 100%;
- `composer test:coverage` — configured line coverage minimum 100%;
- `composer test:unit` — Laravel/Pest in parallel with two processes;
- `composer test:mysql` — same suites against `phpunit.mysql.xml`;
- `composer test` — aggregate lint/types/type/line coverage, but does not replace `test:mysql`.

Future work must preserve these existing repository gates rather than lowering them to accommodate V1 implementation.

## 4. Verification Environments

### 4.1 Fast deterministic environment

Current `phpunit.xml` uses `APP_ENV=testing`, SQLite in-memory, array cache/session, synchronous queue, array mail, reduced bcrypt rounds, and disables production observability packages.

Use this for fast Unit/Feature/contract behavior where database-engine concurrency semantics are not the assertion.

### 4.2 MySQL compatibility environment

Current `phpunit.mysql.xml` uses the MySQL test connection (`ubertib_test`). Use it for schema, constraints, locking, query behavior, uniqueness, and persistence cases that may differ from SQLite.

### 4.3 Required production-like verification environments

Before V1 release the project also requires:

- production-engine integration with representative indexes/constraints;
- asynchronous queue verification rather than only `sync`;
- private evidence/storage + malware-adapter fake or approved sandbox;
- load/concurrency environment isolated from production;
- backup/restore environment;
- React Native test/build environment after `TASK-PLATFORM-008` verifies the actual patient-client repository and commands.

`Q-OPS-001` and `Q-PLATFORM-003` still block final provider/topology-specific suites.

## 5. Verified Existing Automated Coverage

Verified current test files include:

- `tests/Feature/Api/V1/Catalog/ListServiceGroupsTest.php`;
- `tests/Feature/Models/CatalogIdentityIntegrityTest.php`;
- `tests/Feature/Models/ClinicalApprovalIntegrityTest.php`;
- `tests/Feature/Models/ServiceDefinitionTest.php`;
- `tests/Feature/Models/UserTest.php`;
- `tests/Unit/ArchTest.php`.

Current substantive coverage is concentrated on evaluation catalog structure, production visibility/readiness, service-definition lifecycle/version immutability, catalog identity integrity, clinical launch approval integrity, and architecture conventions.

This remains partial V1 implementation coverage. Identity/OTP, scoped authorization, provider activation, full eligibility, booking, case/treatment, finance, reviews, claims, evidence security, operations, mobile, and most NFR verification are still Planned.

## 6. Verification Layers

| Layer | Main use |
|---|---|
| Unit/domain | deterministic policy calculations, deadlines, state guards, value objects, snapshot/hash logic |
| Feature/application | actions, authorization, transactions, Eloquent invariants, jobs, audit, workflow transitions |
| API contract | method/path/auth, payload shape, stable `ERR-*`, privacy fields, idempotency, safe projections |
| Filament adapter | Admin/Clinic route isolation, scoped resource/action access, shared-domain action invocation |
| Persistence/constraint | uniqueness, append-only rules, FK/integrity, version/effective intervals, capacity locks |
| Cross-platform | one authoritative mutation propagates correctly to Patient/Clinic/Admin projections |
| Integration/provider | OTP/MFA/malware/notification/storage adapters after provider approval; fakes before approval |
| Load/concurrency | latency/RPS, 100-way booking contention, queue behavior, degraded dependency behavior |
| Recovery/operations | RPO/RTO restore, alerting, queue/work backlog, correlation, backup evidence |
| Client/accessibility | React Native Arabic/RTL, accessibility, network recovery after client bootstrap |
| Governed human acceptance | clinical/legal/accountable approval that cannot be inferred from software tests |

## 7. `TC-*` Identifier Rules

1. IDs are `TC-DOMAIN-NNN` and append-only.
2. A case may verify several requirements when one executable scenario genuinely proves the shared invariant.
3. A requirement may require several cases across layers.
4. `Existing`/`Partial` cases may reference current test files; `Planned` cases define the executable target without pretending the file exists.
5. Mobile execution paths/commands remain `TBD after TASK-PLATFORM-008` until the actual React Native project is verified.
6. Governed approval is referenced beside the relevant TCs/open questions; it is not faked as an automated pass.
7. These allocations must be synchronized into `docs/README.md` in the next registry-maintenance step without renumbering.

---

# 8. Identity Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-IDENTITY-001` | Planned | FR-IDENTITY-002, NFR-IDENTITY-002 | API + DB · Patient | Request OTP: generate exactly six digits, persist hash only, expose no raw OTP, five-minute expiry metadata, safe challenge response. |
| `TC-IDENTITY-002` | Planned | FR-IDENTITY-002, NFR-IDENTITY-002 | API + time control · Patient | OTP verification enforces single use, max five attempts, invalid/expired/used behavior, and at-most-one patient activation under concurrent success. |
| `TC-IDENTITY-003` | Planned | FR-IDENTITY-002, NFR-IDENTITY-002 | API + rate limit · Patient | Max three sends/15 minutes across phone/account/IP scope; resend invalidates previous challenge without resetting accumulated abuse protection. |
| `TC-IDENTITY-004` | Planned | FR-IDENTITY-001, NFR-IDENTITY-001 | Authorization matrix · Admin/Clinic/API | Deny by default; role alone cannot bypass organization/branch/workflow/subject/purpose/time scope; route/record identifier tampering cannot escape scope. |
| `TC-IDENTITY-005` | Planned | FR-IDENTITY-001, NFR-IDENTITY-002 | Security · Admin | Privileged production roles require approved non-SMS second factor; insecure environment bypass cannot be enabled in production. |
| `TC-IDENTITY-006` | Planned | FR-IDENTITY-003, NFR-IDENTITY-001 | API + cross-platform · Patient/Admin | Guardian grant permits only configured patient/actions/data/purpose/time; patient remains owner and action audit records actual guardian actor. |
| `TC-IDENTITY-007` | Planned | FR-IDENTITY-003, FR-IDENTITY-001, NFR-IDENTITY-001 | Cross-platform · Patient/Clinic/Admin | Revoke/expire guardian or clinic scope: next protected request is denied on every affected adapter while historical actions remain attributable and source records remain unchanged. |

# 9. Catalog and Launch Governance Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-CATALOG-001` | Existing | FR-CATALOG-001, NFR-PLATFORM-005 | API · Patient/public | `API-CATALOG-001` returns four evaluation groups / 26 provisional records with documented resource shape in evaluation mode. Existing evidence: `ListServiceGroupsTest.php`. |
| `TC-CATALOG-002` | Existing | FR-CATALOG-001, FR-OPS-003 | API + model | Production mode never exposes evaluation-only/unready definition and does not silently fall back to older ready version when highest applicable current version is unready. Existing evidence: `ListServiceGroupsTest.php`. |
| `TC-CATALOG-003` | Existing | FR-CATALOG-001, FR-POLICY-001 | Model + persistence | Stable catalog identity and governed definition version integrity cannot be silently rewritten. Existing evidence: `CatalogIdentityIntegrityTest.php`, `ServiceDefinitionTest.php`. |
| `TC-CATALOG-004` | Partial | FR-OPS-003, FR-POLICY-001 | Model + governance · Admin | Production publication fails without all current gates; medical gate requires current verified dental credential; stale content hash/expired/revoked approval fails closed. Current clinical approval tests cover part; full staff/action authorization remains Planned. |
| `TC-CATALOG-005` | Partial | FR-POLICY-001, FR-OPS-003 | Transaction + cross-platform | Publishing higher production version atomically supersedes prior active version; fresh Patient/Clinic/Admin projections use new current version while historical cases retain captured version. Lifecycle transaction is partly Existing; cross-platform projection verification Planned. |

**Governed acceptance:** Passing `TC-CATALOG-*` does not resolve `Q-CATALOG-001`; licensed clinical approval is still required for production medical readiness of the 26 provisional records.

# 10. Eligibility and S/P/H/I Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-ELIG-001` | Planned | FR-ELIG-007–008 | Feature + evidence · Clinic/Admin | Clinic submits factual provider/service/branch activation inputs/evidence; Admin verifies source facts; neither adapter can submit final S/P/H/I/eligibility. |
| `TC-ELIG-002` | Planned | FR-ELIG-002, FR-ELIG-008 | Domain + DB | Missing/expired mandatory fact or evidence produces immutable `PENDING_EVALUATION`; it is never scientific grade `F`. |
| `TC-ELIG-003` | Planned | FR-ELIG-009, FR-ELIG-014 | Domain | Actual provider price + exact effective price-band policy computes `P`; no request/form/action can persist a manually selected P outcome. |
| `TC-ELIG-004` | Planned | FR-ELIG-010–013, FR-ELIG-015 | Domain/property | Approved versioned policy computes S/H/I/confidence/grade-cap/gates deterministically at approved boundary values. Numeric clinical assertions remain gated by `Q-ELIG-001`. |
| `TC-ELIG-005` | Planned | FR-ELIG-002, FR-ELIG-005, FR-ELIG-011–015 | Domain + DB | Most restrictive mandatory gate determines final eligibility; decision captures exact provider/service/branch/input/policy snapshot and cannot be edited. |
| `TC-ELIG-006` | Planned | FR-ELIG-003–004, FR-ELIG-006 | Queue + DB + cross-platform | Influential fact/evidence/policy expiry/revocation creates a new decision, immediately blocks affected new bookings, removes affected Patient discovery result, updates Clinic status, and creates Admin operational visibility without changing unaffected scopes. |
| `TC-ELIG-007` | Planned | FR-ELIG-001, FR-ELIG-005–006 | API · Patient | Provider search returns only currently passing provider/service/branch combinations and excludes pending/suspended/failing scopes. |
| `TC-ELIG-008` | Planned | FR-ELIG-016–017 | API privacy · Patient/Clinic | Patient-safe explanation and Clinic projection expose actionable reasons/freshness but omit raw internal `I`, protected reviewer evidence, and manual override controls. |
| `TC-ELIG-009` | Planned | FR-POLICY-002, FR-ELIG-004 | Reproduction | Replaying captured inputs + historical policy reproduces the original decision; mismatch creates an integrity exception rather than rewriting original history. |
| `TC-ELIG-010` | Planned | FR-ELIG-003, FR-BOOKING-001 | Integration | Search/cache says eligible, then influential state becomes invalid before booking: booking-time revalidation rejects the mutation and stale client data cannot bypass current eligibility. |

**Governed acceptance:** Formula/weight/threshold correctness for production medicine cannot be marked accepted until `Q-ELIG-001` is resolved by licensed clinical approval.

# 11. Booking Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-BOOKING-001` | Planned | FR-BOOKING-001, FR-ELIG-006 | API + transaction · Patient | Patient/guardian booking request revalidates publication, branch readiness, eligibility, slot/capacity, authority, and creates one `REQUESTED` booking with idempotent retry behavior. |
| `TC-BOOKING-002` | Planned | FR-BOOKING-001–003, FR-OPS-001 | Cross-platform | After `TC-BOOKING-001` commit, Patient sees pending, owning Clinic sees the **same booking** as actionable request, authorized Admin sees oversight projection; no second platform-specific booking record exists. |
| `TC-BOOKING-003` | Planned | FR-BOOKING-003 | Feature + time · Clinic | Correct provider/branch may accept, reject-with-reason, or propose alternative before the earlier of 12 hours or 2 hours before appointment; wrong scope/expired response is rejected. |
| `TC-BOOKING-004` | Planned | FR-BOOKING-001, FR-BOOKING-003 | Transaction + cross-platform | Clinic accept revalidates current eligibility/readiness/capacity and commits `CONFIRMED`; Patient/Clinic/Admin all read confirmed state from one authoritative booking. |
| `TC-BOOKING-005` | Planned | FR-BOOKING-003 | API + transaction · Patient/Clinic | Alternative proposal is not confirmation; only patient/authorized guardian may accept current unexpired proposal and capacity/eligibility are revalidated before confirmation. |
| `TC-BOOKING-006` | Planned | FR-BOOKING-002 | State + policy · Patient/Clinic/Admin | Cancellation validates actor/current state/versioned policy; no-show fails before threshold; resulting history records actor/reason/prior/result/policy and propagates to all authorized projections. |
| `TC-BOOKING-007` | Planned | FR-BOOKING-001, NFR-PLATFORM-001, NFR-AUDIT-002 | MySQL concurrency | 100 concurrent confirmations against finite capacity never exceed capacity; losers receive deterministic conflict and idempotent retries create no duplicate reservation/event. |
| `TC-BOOKING-008` | Planned | FR-BOOKING-001–003, NFR-PLATFORM-006, NFR-PLATFORM-008 | Cross-platform + notification | Booking state commits before notification. Simulate Patient/Clinic notification delivery failure: authoritative booking remains committed, recipient sees state on refresh, delivery is retryable/observable, and no rollback/duplicate booking occurs. |

# 12. Clinical Case and Treatment Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-CLINICAL-001` | Planned | FR-CLINICAL-001, NFR-IDENTITY-001 | Authorization · Clinic | Only assigned/authorized treating clinician can author clinical plan; ordinary clinic staff/Admin cannot gain clinical authorship from broad access. |
| `TC-CLINICAL-002` | Planned | FR-CLINICAL-001 | Domain/security | System may validate structure but never autonomously emits diagnosis, prescription, or authoritative treatment plan; incomplete required service/stage/price/terms cannot be proposed/accepted. |
| `TC-CLINICAL-003` | Planned | FR-CLINICAL-001–002, FR-FINANCE-001 | Cross-platform | Dentist proposes exact plan version → Patient sees same proposed version/financial terms → Clinic sees awaiting-patient state → Admin only authorized oversight; no duplicate plan copies. |
| `TC-CLINICAL-004` | Planned | FR-CLINICAL-002, FR-FINANCE-001, NFR-AUDIT-003 | Transaction · Patient/Clinic | Patient/guardian accepts exact displayed plan version; one transaction creates immutable accepted treatment + financial snapshots; Clinic/Admin projections update after commit. |
| `TC-CLINICAL-005` | Planned | FR-CLINICAL-002, NFR-AUDIT-003 | Versioning | Accepted plan cannot be edited; later amendment creates new proposed version and requires new patient acceptance while previous accepted snapshot remains queryable. |
| `TC-CLINICAL-006` | Planned | FR-CLINICAL-003–004 | State + evidence · Clinic | Stage completion requires exact accepted-snapshot evidence/facts/acknowledgements and authorized clinician; completion records actor/time/evidence; reopening is a new event preserving prior completion. |
| `TC-CLINICAL-007` | Planned | FR-CLINICAL-005, FR-AUDIT-002 | Cross-platform timeline | Stage/follow-up changes appear in Patient safe timeline, Clinic workflow, and authorized Admin case projection from the same source; delayed reminder/notification does not alter clinical due/completion state. |

# 13. External Financial Record Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-FINANCE-001` | Planned | FR-FINANCE-001, NFR-AUDIT-003 | Snapshot | Accepted financial terms capture exact case/plan/price/policy version and become immutable; later price/policy changes do not rewrite history. |
| `TC-FINANCE-002` | Planned | FR-FINANCE-002, FR-FINANCE-005 | API/Filament + DB | Authorized Patient or Clinic reports payment already performed externally; append unconfirmed assertion linked to accepted snapshot; submission does not call payment provider. |
| `TC-FINANCE-003` | Planned | FR-FINANCE-003, FR-FINANCE-005 | Cross-platform | Authorized counterparty confirms or disputes original assertion; append response event, never mutate original; Patient/Clinic/Admin derived financial projections converge on event history. |
| `TC-FINANCE-004` | Planned | FR-FINANCE-004–005, FR-FINANCE-007 | Claim/finance integration | Approved refund/compensation creates external amount/action due only; execution can be recorded only as an assertion after off-platform execution and remains confirmable/disputable. |
| `TC-FINANCE-005` | Planned | FR-FINANCE-005–006 | Event reproduction | Corrections/reversals are later linked events; ordered history deterministically derives provisional/confirmed/disputed/corrected state without rewriting earlier facts. |
| `TC-FINANCE-006` | Planned | FR-FINANCE-002–007, NFR-AUDIT-002 | Idempotency/concurrency | Same financial command/key produces one event; conflicting reuse fails deterministically; concurrent contradictory responses preserve append-only history according to policy. |
| `TC-FINANCE-007` | Planned | FR-FINANCE-007, NFR-FINANCE-001 | Architecture/security | Repository/runtime has no V1 gateway payment intent, charge/capture, wallet balance, escrow/custody, settlement, payout, transfer, or platform-executed refund path; funded/prohibited mode fails closed. |
| `TC-FINANCE-008` | Planned | FR-FINANCE-006, NFR-FINANCE-001 | API/client wording/privacy | Patient/Clinic financial views describe external records/uncertainty correctly and expose no platform-held-balance semantics or unnecessary protected payloads. |

# 14. Review Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-REVIEWS-001` | Planned | FR-REVIEWS-001 | API + DB · Patient | Only linked patient/currently authorized guardian may create a review for eligible verified completed experience within governing window. |
| `TC-REVIEWS-002` | Planned | FR-REVIEWS-001, NFR-AUDIT-002 | DB + concurrency | One active review per eligible experience; duplicate/replayed/concurrent submissions cannot create another active review. |
| `TC-REVIEWS-003` | Planned | FR-REVIEWS-001–002 | Domain separation | Rating `R` remains experience feedback and cannot alter S/P/H/I or scientific eligibility; Clinic cannot edit patient rating/content. |
| `TC-REVIEWS-004` | Planned | FR-REVIEWS-002 | Cross-platform · Clinic/Admin | Eligible affected party submits appeal with grounds/evidence/time; Admin integrity reviewer makes authorized publication/compliance decision; original review/rating history stays immutable. |

# 15. Claim, Refund, and Appeal Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-CLAIMS-001` | Planned | FR-CLAIMS-001 | API/domain · Patient | Refund request validates claimant, case, accepted terms/policy snapshot, deadline, amount/currency, and required evidence; submission creates reviewable workflow, not money movement. |
| `TC-CLAIMS-002` | Planned | FR-CLAIMS-002 | API/domain · Patient | Protection claim is rejected unless applicable entitlement exists in immutable accepted snapshot; successful submission creates claim/work only. |
| `TC-CLAIMS-003` | Planned | FR-CLAIMS-003 | Evidence + time | Missing/rejected/expired/accepted evidence states remain distinct; pause/extension appends reasoned deadline event and preserves original deadline. |
| `TC-CLAIMS-004` | Planned | FR-CLAIMS-001–004, FR-OPS-001 | Cross-platform | Patient claim commit → Patient sees submitted state → related Clinic sees permitted response/evidence work → Admin gets review work item on the same claim; no platform-specific claim copy. |
| `TC-CLAIMS-005` | Planned | FR-CLAIMS-004, FR-IDENTITY-001 | Human-review authorization | Final sensitive medical/legal/high-impact financial decision requires assigned scoped human reviewer and enforced separation of duties; automation may prepare facts but cannot submit final decision. |
| `TC-CLAIMS-006` | Planned | FR-CLAIMS-004, NFR-AUDIT-003 | Decision integrity | Decision records findings/reasons/evidence/policy/actor/time/external actions due and is immutable; approved monetary remedy still does not execute funds. |
| `TC-CLAIMS-007` | Planned | FR-CLAIMS-005 | Appeal + cross-platform | Eligible patient/clinic party submits appeal within governing window; appeal references immutable original decision, reviewer independence is enforced, result propagates to authorized projections without rewriting original decision. |

# 16. Policy Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-POLICY-001` | Partial | FR-POLICY-001 | Lifecycle + DB · Admin | Version lifecycle enforces draft → reviewed → scheduled → active → retired/superseded rules and prevents invalid transitions. Existing ServiceDefinition lifecycle proves catalog-specific part; general policy model Planned. |
| `TC-POLICY-002` | Planned | FR-POLICY-001 | Effective-period integrity | Active/effective policy overlap or precedence ambiguity is rejected/deterministically resolved; activated historical content cannot be edited. |
| `TC-POLICY-003` | Planned | FR-POLICY-002, NFR-AUDIT-003 | Historical reproduction | Booking/eligibility/claim/etc. can resolve exact captured governing policy version after newer policy becomes active. |
| `TC-POLICY-004` | Planned | FR-POLICY-001–002 | Cross-platform | Prospective policy replacement affects new/currently governed decisions as specified while existing accepted snapshots/history on Patient/Clinic/Admin remain bound to original version. |

# 17. Operations Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-OPS-001` | Planned | FR-OPS-001 | Work queue · Admin/Clinic | Verification/booking/claim/evidence/deadline work item references source record, has scope/priority/due/assignment, and cannot substitute or independently mutate source truth. |
| `TC-OPS-002` | Planned | FR-OPS-001, NFR-PLATFORM-008 | Queue/retry | Work/notification/jobs are created after authoritative commit; retry reloads current state and cannot duplicate domain mutation. |
| `TC-OPS-003` | Planned | FR-OPS-002 | Reporting | Each metric has explicit population/window/state/dispute rules and refresh time; rebuildable reporting projections reproduce from authoritative data and respect staff scope/privacy. |
| `TC-OPS-004` | Partial | FR-OPS-003 | Governance/release | Launch readiness fails closed for missing/expired/revoked gate/credential and does not equate infrastructure health with clinical production readiness. Existing clinical/catalog tests prove part. |
| `TC-OPS-005` | Planned | FR-OPS-001–002, NFR-PLATFORM-008 | Cross-platform operations | Closing/reassigning/deleting a work/notification UI record does not delete or revert Booking/Case/Claim/Financial source record; source state remains visible through canonical projections. |

# 18. Audit and Idempotency Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-AUDIT-001` | Planned | FR-AUDIT-001, NFR-AUDIT-001 | Audit | Sensitive action records actor, effective scope/role, action, resource, outcome, reason when required, time, and correlation ID without protected payload leakage. |
| `TC-AUDIT-002` | Planned | FR-AUDIT-001–002, NFR-AUDIT-001 | Persistence/security | Audit/provenance history is append-only/immutable; logs/audit exclude OTP, credentials, signed URLs, private evidence content, and unnecessary clinical/financial payloads. |
| `TC-AUDIT-003` | Planned | FR-AUDIT-003, NFR-AUDIT-002 | Idempotency | Same actor/operation/resource/key + same fingerprint returns original committed result; different fingerprint returns `ERR-AUDIT-001`; failed pre-commit request is not stored as successful outcome. |
| `TC-AUDIT-004` | Planned | FR-AUDIT-002–003, NFR-AUDIT-003 | Integrity | Historical reproduction/hash mismatch creates explicit integrity exception/work/audit and never silently repairs or mutates source history. |
| `TC-AUDIT-005` | Planned | FR-AUDIT-001–003, NFR-PLATFORM-008 | Correlation | Request correlation propagates into jobs/work/notification/error support context while remaining privacy safe. |

# 19. Platform / NFR Test Cases

| ID | Status | Requirements | Layer / platforms | Concrete acceptance scenario |
|---|---|---|---|---|
| `TC-PLATFORM-001` | Planned | NFR-PLATFORM-003 | File security | Evidence accepts only permitted PDF/JPEG/PNG; 10 MB image, 25 MB PDF, max 10/action; extension + magic + MIME + decode/parse validation all enforced. |
| `TC-PLATFORM-002` | Planned | NFR-PLATFORM-003 | Storage/security | Evidence gets opaque UUID, SHA-256, private storage, quarantine until successful scan; pending/rejected scan cannot satisfy business requirement. |
| `TC-PLATFORM-003` | Planned | NFR-PLATFORM-003, NFR-IDENTITY-001 | Authorization | Guessing object/path cannot bypass access; signed access expires within approved ≤60s; download authorization is freshly rechecked and audited. |
| `TC-PLATFORM-004` | Planned | NFR-PLATFORM-004 | Retention/legal hold | Retention mechanism resolves governing rule, legal hold blocks destruction, release of hold re-evaluates normal eligibility, deletion is retry-safe/auditable, referenced history is not silently cascaded. Final legal periods remain governed by `Q-PLATFORM-002`. |
| `TC-PLATFORM-005` | Planned | NFR-PLATFORM-001 | Load/performance | Production-like workload meets normal read p95 ≤500ms, normal write p95 ≤800ms, provider search p95 ≤1s, ~75 rps burst, 30-minute error rate <1% at approved planning volume. |
| `TC-PLATFORM-006` | Planned | NFR-PLATFORM-001 | Capacity/concurrency | Around 100 concurrent-user/mixed workload remains stable and integrates `TC-BOOKING-007` 100-way booking contention without overbooking. |
| `TC-PLATFORM-007` | Planned | NFR-PLATFORM-002 | Recovery | Restore isolated backup, validate representative immutable histories/evidence references, measured RPO ≤15m and RTO ≤4h, and produce quarterly restore evidence. |
| `TC-PLATFORM-008` | Planned | NFR-PLATFORM-008 | Observability | Correlation, queue age/retry/failure, scan backlog, notification failure, eligibility delay, deadline breach, backup status, and invariant breach are measurable and threshold breach creates operational signal. |
| `TC-PLATFORM-009` | Planned | NFR-PLATFORM-006, NFR-AUDIT-002 | Network resilience · Patient | Simulate timeout after server commit, reconnect duplicate, stale state, 429/temp failure: same logical command does not duplicate; unknown outcome reconciles via authoritative read. |
| `TC-PLATFORM-010` | Planned | NFR-PLATFORM-006, NFR-PLATFORM-008 | Cross-platform side effect | Out-of-order/delayed/failed notification or reminder never becomes business truth and never reverts committed state; refresh converges Patient/Clinic/Admin to backend state. |
| `TC-PLATFORM-011` | Partial | NFR-PLATFORM-007 | Architecture/static | Pint/Rector/PHPStan/100% configured type+line coverage pass; API remains `/api/v1`; presentation contains no hard-coded medical/financial policy engine. Existing `ArchTest.php` proves part. |
| `TC-PLATFORM-012` | Planned | NFR-PLATFORM-005 | API/client localization | Arabic text round-trips through DB/API; mixed Arabic/English identifiers/data are safe; React Native/Filament functional surfaces operate RTL with scalable text, semantic actions, logical order, and required accessible states after UI implementation. |

## 20. Cross-Platform Behavior Verification Rules

`docs/domain/CROSS_PLATFORM_BEHAVIOR.md` is now a test source, not only descriptive documentation.

For every shared feature, at least one acceptance test must prove all applicable points:

1. the initiating adapter invokes the shared Laravel action;
2. exactly one authoritative aggregate/event/version is committed;
3. Patient, Clinic, and Admin read authorized projections of that same state;
4. unauthorized platform/actor cannot see or mutate it;
5. notification/work generation occurs only after authoritative commit;
6. notification failure does not roll back or mutate the source business state;
7. another platform does not need a duplicate write to “synchronize” the record;
8. edit/delete behavior follows state transition, new version, append-only event, revoke/expire, retire/supersede, or governed retention rather than unsafe generic CRUD.

Mandatory cross-platform cases are currently represented by:

- `TC-IDENTITY-007` — access revocation propagation;
- `TC-CATALOG-005` — published version propagation;
- `TC-ELIG-006` — eligibility suspension propagation;
- `TC-BOOKING-002`, `004`, `006`, `008` — booking create/confirm/cancel/notification behavior;
- `TC-CLINICAL-003`, `004`, `007` — plan proposal/acceptance/stage timeline;
- `TC-FINANCE-003` — financial confirmation/dispute convergence;
- `TC-REVIEWS-004` — review appeal separation;
- `TC-CLAIMS-004`, `007` — claim intake/decision/appeal propagation;
- `TC-OPS-005` — work item never replaces source truth;
- `TC-PLATFORM-010` — failed/delayed side effects do not own state.

A feature is incomplete if only the initiating platform is tested while an expected cross-platform projection/action/notification/work behavior is missing.

## 21. API Contract and Error Verification

Every implemented `API-*` must test method/path, authentication, scope, validation, success shape, stable public IDs, state conflicts, stable `ERR-*`, privacy fields, and idempotency where required.

Target error-envelope verification includes:

- code and HTTP status match `ERROR_CATALOG.md`;
- Arabic-safe user-facing message where applicable;
- validation details do not expose protected values;
- correlation ID is available where target envelope applies;
- server errors do not return stack/config/secrets;
- hidden resources are not unnecessarily disclosed;
- client maps code, not fragile full message wording.

Current catalog 429/500 behavior still requires normalization to the target stable error envelope; tests must preserve the existing success contract while that change is implemented.

## 22. Security Verification

Security verification covers:

- OTP/authentication abuse controls (`TC-IDENTITY-001`–`005`);
- deny-by-default and cross-scope isolation (`TC-IDENTITY-004`, `007`);
- IDOR/identifier manipulation;
- mass assignment of protected state/S/P/H/I fields;
- CSRF for Filament/browser mutations as applicable;
- API replay/revocation once mobile auth transport is selected;
- rate limits;
- unsafe file uploads (`TC-PLATFORM-001`–`003`);
- output escaping where user content is rendered;
- SQL/query safety through framework conventions + review;
- secret/config/log leakage;
- private evidence access;
- zero-money-movement architecture (`TC-FINANCE-007`);
- dependency vulnerability controls.

Penetration-test vendor/tooling is not established by current source material and must not be claimed until approved/scheduled.

## 23. Performance and Scale Verification

Approved planning targets:

- 10,000 registered identities;
- 3,000 MAU;
- 500 DAU;
- about 100 concurrent users;
- about 75 requests/second burst;
- reads p95 ≤500ms;
- writes p95 ≤800ms;
- provider search p95 ≤1s;
- 30-minute error rate <1%;
- 100 concurrent booking attempts cannot overbook capacity.

Required load scenarios supporting `TC-PLATFORM-005`/`006` and `TC-BOOKING-007`:

1. public catalog burst;
2. eligible-provider search with representative data/indexes;
3. authenticated case/timeline reads;
4. representative normal write;
5. queue-producing writes;
6. 100-way booking contention;
7. mixed 30-minute workload;
8. degraded external dependency behavior.

Measurements should separate application, database, queue, and external-provider latency. Use synthetic production-like data, never real protected patient data.

## 24. Availability, Backup, and Recovery Verification

`TC-PLATFORM-007` verifies the approved 99.5% availability objective operational context, RPO ≤15 minutes, RTO ≤4 hours, and quarterly restore exercise.

A restore exercise records date, artifact/version, backup point, actual RPO/RTO, verifier, result, database integrity, representative immutable history integrity, and evidence-store reference consistency.

A configured backup without a proven restore is not release evidence.

## 25. Observability and Queue Verification

`TC-PLATFORM-008`, `TC-AUDIT-005`, `TC-OPS-002`, and `TC-PLATFORM-010` verify:

- request/job correlation;
- queue age/retry/failure;
- scan backlog;
- notification failure;
- eligibility recalculation delay;
- deadline breach;
- backup status;
- invariant alerts;
- distinction between committed business outcome and delayed side effect;
- audited retry/escalation;
- privacy-safe telemetry.

Provider-specific alert transport remains outside the suite until selected; generating the alert condition itself must still be testable.

## 26. Arabic, RTL, and Accessibility Verification

`TC-PLATFORM-012` has two layers:

**Backend/contract:** Arabic names/descriptions/errors round-trip correctly; JSON/DB encoding is preserved; bidirectional data does not corrupt identifiers/validation.

**Client/Filament:** after authoritative UI implementation exists, verify Arabic-first/RTL behavior, mixed Arabic/English/numerals, keyboard/focus where applicable, screen-reader/semantic actions, contrast, text scaling, logical reading order, dynamic/error/empty/loading states, and non-color-only status meaning.

Engineering documentation must not claim WCAG 2.2 AA/RTL completion before those interfaces exist and the client-side portion is executable.

## 27. Weak Connectivity and Retry Verification

`TC-PLATFORM-009`/`010` must simulate:

- timeout after server commit followed by identical retry;
- interrupted supported draft save/recovery;
- reconnect duplicate mutation;
- stale booking/claim state;
- retry after 429/temporary failure;
- out-of-order/delayed notification;
- delayed upload/scan completion.

Committed mutations are not duplicated, stale commands fail safely, supported drafts resume, and non-authoritative notification failure never undoes committed state.

Do not queue offline booking confirmation, treatment acceptance, financial assertion, review, or claim as if locally successful without a defined idempotent reconciliation contract.

## 28. Immutable Snapshot/Event Integrity Verification

Across catalog definitions, launch decisions, credentials, eligibility decisions, bookings/events, accepted treatment/financial snapshots, financial events, claim decisions, policy versions, and audit:

1. creation captures exact governing version/input context;
2. protected historical fields cannot be updated after terminal/accepted state;
3. correction/amendment creates new version/event/snapshot;
4. prior record remains queryable to authorized audit/reproduction;
5. content/hash binding detects unintended mutation where hashes apply;
6. order is deterministic;
7. deleting parent cannot cascade-delete required history;
8. promised reproducible derived state can be recomputed from the chain.

Relevant concrete cases include `TC-CATALOG-003`–`005`, `TC-ELIG-005`/`009`, `TC-CLINICAL-004`–`006`, `TC-FINANCE-001`/`003`–`006`, `TC-CLAIMS-003`/`006`/`007`, `TC-POLICY-002`–`004`, and `TC-AUDIT-002`/`004`.

## 29. Test Data Strategy

- Automated suites use factories/fixtures and synthetic evidence only; never copy production patient/clinical evidence into developer/test environments.
- Time-sensitive tests freeze/control time explicitly.
- The 26 service records remain **evaluation fixtures** until clinical approval.
- Formula/threshold fixtures declare exact policy version and must not be mislabeled clinically approved.
- Old policy fixtures remain for historical reproduction after prospective replacement.
- Parallel tests isolate DB/file/idempotency/fake-notification/clock state.
- Cross-platform tests query all adapters/projections from the same committed fixture rather than creating separate platform records.

## 30. External Dependency Test Rules

For future OTP/MFA/malware/notification/private-storage adapters:

- ordinary suites use fakes/stubs;
- unexpected real network calls fail where practical;
- explicit approved sandbox/contract suites are separate;
- secrets come from CI secret storage;
- timeout/outage/retry is tested;
- provider success does not become authoritative business success until local transaction/invariants succeed.

No V1 test suite may require a payment gateway.

## 31. CI and Merge Gates

Backend verification baseline:

```bash
cd UberTip-Backend
composer test:lint
composer test:types
composer test:type-coverage
composer test:coverage
composer test:unit
composer test:mysql
```

`composer test` may replace the first four when used as the aggregate CI command, but `composer test:mysql` remains a separate compatibility gate unless scripts change.

React Native commands are deliberately not invented here. `TASK-PLATFORM-008` must record actual client repository/path/package-manager/test/lint/build commands; later Patient `TC-*` executions use those verified commands.

Slower load/recovery/provider-contract suites may run in release pipelines, but safety-critical behavior cannot be left to undocumented manual checks.

## 32. Release Verification Levels

### Pull request gate

- affected concrete `TC-*` automated cases;
- static analysis/lint/refactor dry-run;
- configured coverage gates;
- relevant SQLite tests;
- MySQL suite when schema/query/constraint/concurrency behavior is affected;
- cross-platform projection regression for any shared aggregate change.

### Pre-release gate

- full backend suite;
- production-engine integration suite;
- API/error/privacy suite;
- permission negative matrix;
- concurrency/idempotency suite;
- private evidence security suite;
- performance/load suite;
- queue/observability suite;
- current restore evidence;
- migration/recovery rehearsal as appropriate;
- React Native full verified CI + cross-platform E2E journeys after client bootstrap;
- no unresolved blocker invalidating enabled scope.

### Production medical readiness gate

Software tests are necessary but insufficient. The release additionally requires current applicable launch approvals, licensed clinical approval for enabled medical catalog/policies, resolution of applicable `Q-CATALOG-001` / `Q-ELIG-001`, production catalog mode, and no promotion of evaluation fixtures merely because tests pass.

## 33. Domain Exit Evidence

| Domain | Minimum V1 exit evidence |
|---|---|
| IDENTITY | `TC-IDENTITY-001`–`007` applicable cases pass + provider-specific MFA/OTP evidence where required |
| CATALOG | `TC-CATALOG-001`–`005` pass/complete + separate clinical approval |
| ELIG | `TC-ELIG-001`–`010` pass + approved production clinical boundary fixtures |
| BOOKING | `TC-BOOKING-001`–`008` pass including MySQL 100-way contention and cross-platform propagation |
| CLINICAL | `TC-CLINICAL-001`–`007` pass |
| FINANCE | `TC-FINANCE-001`–`008` pass, especially zero-money-movement negative architecture control |
| REVIEWS | `TC-REVIEWS-001`–`004` pass |
| CLAIMS | `TC-CLAIMS-001`–`007` pass |
| POLICY | `TC-POLICY-001`–`004` pass |
| OPS | `TC-OPS-001`–`005` pass |
| AUDIT | `TC-AUDIT-001`–`005` pass |
| PLATFORM | `TC-PLATFORM-001`–`012` applicable cases pass + governed legal/clinical/provider evidence where noted |

## 34. Defect Severity

- **Blocker:** enables unsafe production medical behavior, money movement, unauthorized protected-data access, unrecoverable historical corruption, capacity overbooking, cross-platform split-brain truth, or invalidates release verification.
- **Major:** breaks a Must Have workflow, permission boundary, immutable/reproducible history, required NFR, or creates materially incorrect operational/cross-platform state.
- **Minor:** localized defect that does not break a safety/business invariant and has an acceptable workaround.

Intermittent reproducibility does not downgrade a defect affecting a high-impact invariant.

## 35. Open Questions and Verification Constraints

| ID | Severity | Verification impact |
|---|---|---|
| `Q-PLATFORM-001` | Blocker | Cannot claim full SRS v1.1 reconciliation until readable authoritative text is reviewed. |
| `Q-CATALOG-001` | Major | `TC-CATALOG-*` cannot certify clinical production approval for provisional records. |
| `Q-ELIG-001` | Major | Production clinical numeric/boundary acceptance within `TC-ELIG-004` depends on licensed approval. |
| `Q-PLATFORM-002` | Major | `TC-PLATFORM-004` proves retention mechanism; final legal-period acceptance remains open. |
| `Q-OPS-001` | Major | Final production-engine/load/recovery environment remains topology dependent. |
| `Q-PLATFORM-003` | Major | Concrete OTP/MFA/malware/private-evidence/notification provider contract suites cannot be finalized. |
| `Q-PLATFORM-004` | Minor | Performance tests retain approved NFR headroom even though expected launch population is lower. |
| `CONFLICT-PLATFORM-001` | Major | Verification targets current Laravel/PHP/package stack, not stale historical assumptions. |
| `CONFLICT-PLATFORM-002` | Major | Later SRS requirement-type reconciliation may remap traceability but must not silently delete existing test obligations. |

## 36. `TC-*` Allocation Summary

This revision allocates **82 concrete test-case IDs**:

| Domain | Allocated IDs | Count |
|---|---|---:|
| IDENTITY | `TC-IDENTITY-001`–`007` | 7 |
| CATALOG | `TC-CATALOG-001`–`005` | 5 |
| ELIG | `TC-ELIG-001`–`010` | 10 |
| BOOKING | `TC-BOOKING-001`–`008` | 8 |
| CLINICAL | `TC-CLINICAL-001`–`007` | 7 |
| FINANCE | `TC-FINANCE-001`–`008` | 8 |
| REVIEWS | `TC-REVIEWS-001`–`004` | 4 |
| CLAIMS | `TC-CLAIMS-001`–`007` | 7 |
| POLICY | `TC-POLICY-001`–`004` | 4 |
| OPS | `TC-OPS-001`–`005` | 5 |
| AUDIT | `TC-AUDIT-001`–`005` | 5 |
| PLATFORM | `TC-PLATFORM-001`–`012` | 12 |
| **Total** | — | **82** |

No IDs in this table may be renumbered during the next registry synchronization. A future test must append after the highest allocated ID in its domain.

## 37. Current Verification Gap Summary

Existing executable coverage is still concentrated in catalog/service-definition/launch-readiness governance. Most of the 82 concrete cases are Planned because the matching V1 features are not implemented yet.

The largest safety-critical gaps are scoped authorization, production-approved eligibility, booking concurrency/cross-platform propagation, immutable treatment/financial agreements, record-only finance, private evidence security, claims human review/SoD, mobile/network behavior, and production recovery/observability evidence.

This is expected and must remain visible; allocating a `TC-*` does not convert Planned application behavior into Existing code.

## 38. Phase 3 Handoff

The next Phase 3 step is **registry synchronization** in `docs/README.md` for the already allocated `API-*`, `ERR-*`, `TASK-*`, and the 82 `TC-*` IDs in this file.

After that, update `docs/TRACEABILITY_MATRIX.md` to replace verification descriptions with concrete `TC-*` references while preserving Patient / Clinic / Admin / cross-platform impact. Then create `docs/scripts/validate_docs.py` and run Phase 4 documentation verification.