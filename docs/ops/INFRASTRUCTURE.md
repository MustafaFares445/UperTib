# UberTib Infrastructure Design

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/COMPONENT_DESIGN.md`, `docs/ops/CONFIGURATION.md`  
**Data sources:** `docs/database/ERD.md`, `docs/database/DFD.md`  
**Registry:** `docs/README.md`

## 1. Purpose and Boundary

This document defines the provider-neutral infrastructure required to operate UberTib V1 safely and reliably. It describes runtime responsibilities, deployment topology, isolation boundaries, backup/recovery expectations, scaling approach, security controls, and operational dependencies without selecting a cloud or hosting vendor that has not been approved.

`Q-OPS-001` remains **Major** because the concrete hosting provider, deployment topology, and production environment have not yet been selected. `Q-PLATFORM-003` remains **Major** because concrete OTP/MFA, malware-scanning, private-evidence, and notification providers are not selected.

Accordingly, this file specifies required infrastructure capabilities rather than AWS/Azure/GCP/DigitalOcean-specific products.

UberTib V1 has two hard infrastructure boundaries:

1. production medical behavior may be enabled only through the governed application launch/readiness controls; infrastructure availability cannot bypass clinical approval; and
2. V1 performs no payment authorization, capture, custody, escrow, settlement, payout, or platform-executed refund. No payment infrastructure is required or permitted by this design.

## 2. Verified Current Repository State

The current repository contains a Laravel 13 application under `UberTip-Backend/` with:

- PHP runtime dependency declared by Composer;
- Filament for operational/admin interfaces;
- REST API routes under `/api/v1`;
- relational database support through Laravel;
- database-backed queues by current `.env.example` default;
- database-backed cache/session defaults in `.env.example`;
- private local filesystem default at `storage/app/private`;
- optional S3-compatible framework configuration;
- standard Laravel logging, mail, cache, Redis, queue, and filesystem adapters;
- Pest-based automated tests and Composer quality scripts.

No verified production deployment manifests, Dockerfile, Docker Compose production stack, Kubernetes manifests, Terraform/Pulumi/CloudFormation infrastructure, Nginx/Apache production configuration, process-manager configuration, or provider-specific deployment files were found in the current repository evidence inspected for this document.

Therefore the production topology below is **Required/Proposed**, not an assertion of an existing deployment.

## 3. Capacity and Reliability Drivers

The infrastructure must support the approved NFR baseline:

- up to **10,000 registered identities**;
- approximately **3,000 monthly active users**;
- approximately **500 daily active users**;
- approximately **100 concurrent users**;
- burst handling of approximately **75 requests/second**;
- normal read requests at **p95 ≤ 500 ms**;
- normal write requests at **p95 ≤ 800 ms**;
- provider search at **p95 ≤ 1 second**;
- 30-minute performance verification with error rate below **1%**;
- concurrent booking protection such that **100 concurrent booking attempts cannot overbook capacity**;
- availability target **99.5%**;
- recovery point objective **RPO ≤ 15 minutes**;
- recovery time objective **RTO ≤ 4 hours**;
- quarterly restore verification.

These are engineering capacity targets, not a requirement to deploy a complex distributed architecture. A well-operated modular Laravel monolith is appropriate for the expected V1 scale.

## 4. Target Production Topology

```mermaid
flowchart TD
    Internet[Patients / Authorized Staff] --> Edge[HTTPS Edge / Reverse Proxy / Load Balancer]
    Edge --> Web[Laravel Web/API + Filament Runtime]

    Web --> DB[(Primary Relational Database)]
    Web --> Cache[(Cache / Shared Runtime Store)]
    Web --> Queue[(Queue Store)]
    Web --> PrivateFiles[(Private Evidence Storage)]

    Worker[Laravel Queue Worker(s)] --> Queue
    Worker --> DB
    Worker --> PrivateFiles

    Scheduler[Laravel Scheduler Singleton] --> DB
    Scheduler --> Queue

    Web --> Logs[Centralized Logs / Metrics]
    Worker --> Logs
    Scheduler --> Logs

    DB --> Backup[Encrypted Database Backups]
    PrivateFiles --> FileBackup[Versioned / Durable Evidence Protection]

    External[Approved OTP / MFA / Scan / Notification Providers] -. provider selection unresolved .-> Web
    External -. async provider interactions .-> Worker
```

The diagram describes responsibilities, not provider products. Cache and queue may share a managed runtime technology if isolation, reliability, observability, and capacity requirements remain satisfied.

## 5. Runtime Components

### 5.1 HTTPS Edge / Reverse Proxy

Required responsibilities:

- terminate or securely pass TLS using modern supported protocols;
- redirect plaintext HTTP to HTTPS in production;
- preserve original client/IP forwarding information only through trusted proxy configuration;
- enforce request/body size limits consistent with application evidence rules;
- apply safe connection/time-out limits;
- expose only intended public application entry points;
- support health checking of Laravel runtime instances;
- preserve correlation/request identifiers or allow the application to create them consistently.

The edge must not cache authenticated patient, case, clinical, financial, claim, or evidence responses publicly.

### 5.2 Laravel Web/API Runtime

Required responsibilities:

- serve `/api/v1` and Filament operational requests;
- run PHP with production optimizations and `APP_DEBUG=false`;
- use immutable application release artifacts where practical;
- read secrets from deployment secret management, not source control;
- use the production catalog and V1 record-only financial configuration from `CONFIGURATION.md`;
- remain stateless with respect to business truth so additional application instances can be added if needed.

Local writable paths such as framework cache/log temporary files must not be treated as durable business storage.

### 5.3 Queue Worker Runtime

Workers handle asynchronous work such as notifications, malware-scan orchestration, reevaluation, reminders, deadline checks, reporting projections, and retention processing.

Infrastructure must ensure:

- one or more independently restartable workers;
- graceful restart during deployments;
- retry/failure persistence;
- queue age and failed-job observability;
- bounded retry/backoff to avoid provider or database overload;
- worker memory/time limits appropriate to workload;
- no reliance on local worker filesystem for durable evidence/business state.

Queue jobs must remain idempotent and reload authoritative state before acting.

### 5.4 Scheduler Runtime

Laravel scheduled tasks require exactly-once-enough orchestration at the infrastructure level. Multiple web nodes must not independently execute singleton schedule duties without Laravel/distributed locking protection.

Expected scheduled responsibilities include:

- eligibility reevaluation deadlines;
- follow-up reminders;
- claim/deadline checks;
- escalation checks;
- retention/deletion workflows;
- operational projection refresh where required;
- stale temporary/challenge cleanup.

Scheduler failure must be visible to monitoring because missed deadlines can affect operational correctness.

## 6. Relational Database Infrastructure

The relational database is the authoritative transactional source for the V1 domain described in `ERD.md`.

### Required capabilities

- ACID transactions;
- row-level locking/concurrency behavior sufficient for booking capacity and publication flows;
- foreign keys and unique constraints;
- reliable JSON support for documented snapshot/policy structures;
- indexes required by `ERD.md`;
- encrypted transport between application and database when network-separated;
- automated backups meeting RPO/RTO requirements;
- point-in-time or sufficiently frequent recovery capability to satisfy RPO ≤ 15 minutes;
- storage monitoring and alerting;
- documented restore procedure.

### Engine selection

Current code supports SQLite for development/testing and contains MySQL-specific implementations for current integrity triggers. Laravel also exposes other drivers, but framework support alone does not certify them for production.

Before production selection, the chosen database must pass:

1. all migration and trigger/constraint tests;
2. concurrency tests including 100 simultaneous booking attempts;
3. backup/restore tests;
4. realistic data-volume and query-performance tests;
5. character-set tests for Arabic content.

No production engine is selected by this document while `Q-OPS-001` remains open.

## 7. Cache and Shared Runtime State

Cache may improve public catalog, provider search, rate limiting, locks, or other rebuildable read behavior, but it is not authoritative business storage.

Infrastructure requirements:

- cache loss must not lose bookings, cases, accepted terms, financial events, claims, permissions, or audit history;
- shared cache must be reachable by all application instances when cross-instance consistency is required;
- key namespaces must isolate environments;
- cache eviction and restart are expected failure modes;
- sensitive payloads should not be cached unless explicitly required and protected;
- distributed lock use must have bounded TTL and failure-safe behavior.

Redis is a possible Laravel-supported implementation but is not mandated by current source material.

## 8. Queue Store

The current example uses the relational database queue. This is acceptable as an initial V1 option if load testing confirms it does not interfere with transactional workload and queue-latency requirements.

A dedicated Redis/SQS/other queue may be adopted later without changing domain behavior if it provides:

- durable-enough delivery for required jobs;
- retry and failed-job handling;
- visibility into queue depth/age;
- secure authenticated access;
- environment isolation;
- operational restore/recovery behavior appropriate to the selected job semantics.

The infrastructure provider choice must not weaken application-level idempotency.

## 9. Private Evidence Storage

Clinical, identity, credential, financial, claim, and other protected evidence requires private object/file storage independent of public web assets.

Required capabilities:

- no anonymous/public object access;
- server-side encryption at rest;
- encrypted network transfer;
- opaque object identity;
- durable storage appropriate to retention requirements;
- SHA-256 metadata retained in the application database;
- quarantine state before malware-scanning approval where required;
- short-lived, freshly authorized download access of no more than the approved limit;
- access logging/auditing;
- lifecycle deletion only after retention/legal-hold checks;
- recovery/versioning strategy sufficient to prevent silent loss of required evidence.

The current local private disk is appropriate for development. Production may use private local/network storage or S3-compatible object storage only after the storage/scanning approach is approved under `Q-PLATFORM-003` / `Q-OPS-001`.

The public Laravel disk and `/storage` symbolic link must never be used for protected evidence.

## 10. External Provider Boundary

Infrastructure may eventually connect to approved providers for:

- patient OTP delivery;
- privileged MFA;
- malware scanning;
- email/SMS/push notifications;
- private object storage if externalized.

No concrete provider is currently contracted or documented. Therefore:

- provider credentials must not be invented;
- provider-specific infrastructure must not be treated as a V1 dependency yet;
- adapter failure must not corrupt authoritative domain state;
- provider calls must use explicit timeouts/retries/circuit-breaking or equivalent failure controls appropriate to the integration;
- provider secrets belong in deployment secret management;
- outbound data must be minimized to the provider's legitimate purpose.

There is deliberately no payment provider boundary in V1.

## 11. Network and Security Segmentation

Minimum production network posture:

- only the public HTTPS edge is internet-facing;
- database, queue, cache, and private storage endpoints are private/restricted where deployment technology permits;
- administrative infrastructure access is limited to authorized operators;
- database and infrastructure credentials use least privilege;
- development/test environments do not share production databases, buckets, queues, secrets, or cache namespaces;
- outbound network access from application/worker environments should be limited or governed where practical;
- security groups/firewall rules are documented and reviewed;
- secrets are encrypted at rest and in transit through the selected secret-management mechanism.

Application authorization remains mandatory even inside a trusted private network.

## 12. Environment Separation

Recommended logical environments:

| Environment | Purpose | Data rule | Catalog mode |
|---|---|---|---|
| Local | Developer workstation | Synthetic/local only | `evaluation` acceptable |
| Test / CI | Automated tests | Disposable synthetic fixtures | Controlled by test config |
| Staging | Production-like verification | Synthetic or explicitly approved sanitized data | `evaluation` unless performing approved production-readiness verification |
| Production | Live V1 | Real authorized data | `production` only |

Production secrets and real protected data must never be copied into developer environments as a convenience.

Staging should resemble production topology closely enough to validate database engine behavior, queue workers, scheduler, private storage, TLS, and deployment processes.

## 13. Deployment Model

The repository does not currently establish a provider-specific deployment mechanism. The required deployment process is:

1. build a versioned application release from a reviewed commit;
2. install production Composer dependencies without development packages;
3. build required frontend assets for Filament/Vite as applicable;
4. run automated quality gates before promotion;
5. inject environment configuration/secrets outside the repository;
6. enable maintenance/traffic-drain strategy when required by migration risk;
7. back up or verify recoverability before risky schema migrations;
8. execute migrations exactly once through a controlled deployment step;
9. clear/build Laravel production caches as appropriate;
10. start/reload web and worker processes gracefully;
11. run health/smoke verification;
12. monitor errors, latency, queue state, and database health after release;
13. roll back application release when safe, while treating database rollback as a separately planned operation rather than blindly reversing destructive migrations.

### Release principle

Database changes must use forward-compatible migrations whenever practical so application rollback does not require destructive data rollback.

## 14. Health Checks

Infrastructure must distinguish at least:

### Liveness

Confirms the runtime process can serve requests. It should not fail merely because a noncritical third-party notification provider is unavailable.

### Readiness

Confirms the instance can safely receive traffic, including required application bootstrap/configuration and primary database connectivity. Required shared dependencies may be included according to the selected topology.

### Domain readiness is separate

Infrastructure health must **not** report a dental service as medically production-ready. Service launch readiness is application/domain governance controlled by `ServiceDefinition` and launch gates.

## 15. Backup and Recovery

### Database

Required:

- automated backup/PITR strategy achieving RPO ≤ 15 minutes;
- encrypted backups;
- access restricted separately from normal application users;
- retention appropriate to legal/compliance review;
- restore runbook;
- quarterly restore test with recorded result;
- restoration to isolated environment before production cutover where feasible.

### Private evidence

Required:

- durable protection against accidental deletion/storage failure;
- encryption;
- recovery consistent with the applicable evidence retention/legal-hold policy;
- deletion lifecycle that does not reintroduce intentionally destroyed data after a compliant deletion event.

### Recovery objective

A recovery plan must target service restoration within RTO ≤ 4 hours for an approved disaster scenario.

`Q-PLATFORM-002` still governs final legal retention/deletion durations; backup retention must be reconciled with that decision before production.

## 16. High Availability and Scaling

The approved 99.5% availability target does not require active-active multi-region infrastructure.

A suitable V1 progression is:

### Initial production

- one production application service with fast restart/redeployment capability;
- independently supervised queue worker(s);
- one controlled scheduler;
- production relational database with automated backups;
- durable private evidence storage;
- health monitoring and alerting.

### Scale when measured demand requires it

- add multiple stateless Laravel web instances behind a load balancer;
- move session/cache/locks to shared runtime stores if needed;
- scale queue workers separately by queue age and workload;
- vertically or horizontally enhance database/read infrastructure only after query/index optimization and measured need;
- introduce dedicated search infrastructure only if relational/provider-search performance cannot satisfy p95 ≤ 1 second with the expected dataset.

Do not add microservices, Kubernetes, a dedicated search cluster, event-streaming infrastructure, or multi-region complexity solely for projected prestige or generic scalability assumptions.

## 17. Performance Controls

Infrastructure and application teams jointly own the performance NFRs.

Required controls include:

- PHP production optimization and opcode caching where supported;
- production Laravel config/route/view caching where compatible;
- database indexes from `ERD.md`;
- bounded database connection usage;
- request timeout values that fail predictably rather than hanging indefinitely;
- pagination/bounded result sizes when volume requires it;
- queue offloading for non-request-critical side effects;
- public catalog cache support already present;
- measured provider-search query plans before introducing new infrastructure;
- load tests using production-like database engine/topology.

## 18. Security Operations

Production infrastructure must support:

- TLS certificate renewal and expiry monitoring;
- operating-system/runtime/security patching;
- dependency security checks in the release pipeline;
- secret rotation procedures;
- least-privilege infrastructure identities;
- protected administrative access;
- centralized/safely retained logs without sensitive payload leakage;
- incident investigation through correlation IDs and immutable audit records;
- backup access auditing;
- evidence-storage access auditing;
- environment inventory and ownership.

Application `audit_events` are not a substitute for infrastructure access/security logs, and infrastructure logs are not a substitute for domain audit history.

## 19. Failure Modes and Required Behavior

| Failure | Required infrastructure/application behavior |
|---|---|
| Web instance failure | Remove unhealthy instance/restart; no business state depends on its local memory. |
| Queue worker failure | Committed domain state remains valid; jobs remain retryable/observable. |
| Scheduler failure | Alert operations; resume idempotently without duplicating actions. |
| Cache loss | Rebuild from authoritative data; no business history loss. |
| Database unavailable | Fail requests safely; do not accept writes that cannot commit authoritatively. |
| Private storage unavailable | Block evidence-dependent action/download; do not mark missing upload/scan as accepted. |
| OTP/notification provider unavailable | Do not fabricate delivery success; expose retry/operational state. |
| Malware scanner unavailable | Keep evidence quarantined/fail closed. |
| Clinical approval expires | Application readiness/eligibility fails closed regardless of infrastructure health. |
| Financial external record disputed | Infrastructure performs no money action; domain history records the dispute. |

## 20. CI/CD and Quality Gate Expectations

The current Composer project defines quality commands for linting, static analysis/type coverage, coverage, and Pest tests. The production pipeline should preserve the repository's verified quality gates rather than inventing a separate test path.

Before production promotion, the pipeline should include at minimum:

- dependency installation from lock files;
- formatting/lint verification;
- static/type checks required by the project;
- automated Pest test suite;
- migration verification against the target production database engine;
- production asset build;
- vulnerability/dependency checks already supported by project tooling;
- documentation/contract validation once `docs/scripts/validate_docs.py` is created in Phase 3.

Exact CI platform is not selected by current source material.

## 21. Infrastructure Decisions Still Open

| Item | Status | Blocking impact |
|---|---|---|
| Hosting/cloud/provider selection | `Q-OPS-001` Major | Blocks exact network, managed-service, deployment, and cost design. |
| Production relational database deployment | Part of `Q-OPS-001` | Must be selected and verified against current MySQL/SQLite-sensitive integrity behavior. |
| Production cache/queue technology | Part of `Q-OPS-001` | Database defaults are current baseline; dedicated technology remains optional. |
| Private evidence storage provider | `Q-PLATFORM-003` Major | Blocks concrete upload/download/storage integration contract. |
| Malware-scanning provider | `Q-PLATFORM-003` Major | Evidence must remain quarantined until resolved. |
| OTP/MFA provider | `Q-PLATFORM-003` Major | Blocks production contact verification/privileged MFA integration detail. |
| Notification provider | `Q-PLATFORM-003` Major | Business state remains independent of delivery provider. |
| Final retention/deletion validation | `Q-PLATFORM-002` Major | Backup/object lifecycle must be reconciled before production. |

## 22. Explicitly Unnecessary / Forbidden V1 Infrastructure

Unless a later authoritative product decision changes V1 scope, do not provision infrastructure whose purpose is:

- card/payment gateway processing;
- platform wallet ledger/balance processing;
- escrow or custody;
- payout/settlement;
- platform-funded protection;
- automated medical diagnosis or treatment recommendation service;
- microservices introduced without a concrete scaling/isolation requirement;
- blockchain/event-ledger infrastructure merely to represent append-only history.

Relational immutable/event tables and auditable Laravel application services are sufficient for the approved V1 architecture.

## 23. Implementation Readiness Checklist

Infrastructure is ready for production only when all applicable items are true:

- production provider/topology approved;
- production database selected and concurrency/migration tested;
- TLS and secure proxy configuration verified;
- `APP_DEBUG=false`;
- `UBERTIB_CATALOG_MODE=production`;
- `UBERTIB_FINANCIAL_MODE=record_only_non_funded`;
- private evidence storage is non-public;
- malware-scanning path approved before evidence becomes usable;
- queue workers and singleton-safe scheduler supervised;
- backups satisfy RPO and restore test evidence exists;
- RTO recovery runbook exists;
- logs/metrics/alerts are operational;
- secrets are externally managed;
- production clinical catalog/eligibility approvals are valid;
- no forbidden payment/funded-protection infrastructure path exists;
- deployment rollback and incident ownership are documented.

Until the unresolved items above are closed, this document is the provider-neutral infrastructure contract rather than a provider-specific deployment runbook.