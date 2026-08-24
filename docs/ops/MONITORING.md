# UberTib Monitoring and Observability

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/COMPONENT_DESIGN.md`  
**Operational sources:** `docs/ops/CONFIGURATION.md`, `docs/ops/INFRASTRUCTURE.md`  
**Domain sources:** `docs/domain/STATE_MACHINES.md`, `docs/domain/PERMISSIONS_MATRIX.md`  
**Primary quality requirement:** `NFR-PLATFORM-008` (`NFR.12`)  
**Registry:** `docs/README.md`

## 1. Purpose and Boundary

This document defines the observability and operational monitoring required for UberTib V1. It covers privacy-safe logs, metrics, traces/correlation, queue health, backup/recovery signals, operational alerts, business-consistency monitors, dashboards, incident escalation, and operator recovery workflows.

The monitoring system must make it possible to distinguish:

- a business outcome that committed successfully;
- an asynchronous follow-up that is delayed;
- an asynchronous follow-up that failed;
- a request that was safely rejected by a domain rule;
- a system/infrastructure failure;
- a data-integrity or provenance inconsistency requiring human investigation.

Monitoring is not a replacement for authoritative business records. Logs, metrics, traces, dashboards, and alerting systems are operational views and must never become the source of truth for eligibility, bookings, treatment cases, accepted terms, external financial events, claims, reviews, or policy decisions.

`Q-OPS-001` remains **Major** because the concrete production infrastructure and monitoring provider are not selected. `Q-PLATFORM-003` remains **Major** because external OTP/MFA, malware-scanning, private-evidence, and notification providers are not selected. This document therefore defines required signals and behavior without mandating a vendor.

`Q-PLATFORM-001` still blocks a claim of complete end-to-end reconciliation with readable SRS v1.1 text.

## 2. Governing Requirements

The primary requirement is `NFR-PLATFORM-008` / `NFR.12 — Observability and Queue Operations`:

- every request and asynchronous job carries a correlation identifier without logging protected payloads;
- queue age, retry count, failure count, deadline breach, scan backlog, notification failure, eligibility-recalculation delay, and backup status have operational thresholds and alerts;
- operators can distinguish delayed background work from completed business outcomes and retry or escalate through an audited workflow.

Related requirements materially affecting monitoring include:

- `NFR-PLATFORM-001` — performance and scale;
- `NFR-PLATFORM-002` — availability, backup, and recovery;
- `NFR-IDENTITY-001` — authorization and tenant/scope isolation;
- `NFR-PLATFORM-003` — private evidence security;
- `NFR-PLATFORM-004` — privacy, retention, and deletion;
- `NFR-AUDIT-001` — audit and provenance integrity;
- `NFR-AUDIT-002` — concurrency and idempotency;
- `NFR-FINANCE-001` — zero money movement;
- `NFR-AUDIT-003` — immutable snapshots and event integrity.

## 3. Observability Principles

1. **Correlation everywhere.** Every HTTP request, queued job, scheduled execution, and provider interaction must carry a correlation identifier.
2. **No protected payload logging.** Observability stores may contain identifiers and safe metadata, not full clinical, evidence, identity, financial, OTP, credential, or secret payloads.
3. **Committed business state is explicit.** A successful transaction is recorded separately from later notification/scan/recalculation delivery status.
4. **Domain rejection is not infrastructure failure.** Expected 4xx/domain-rule rejections must be counted and diagnosable without being treated as server incidents by default.
5. **Fail-closed conditions are visible.** Clinical-readiness, eligibility, authorization, evidence-scan, or integrity failures that block a workflow should be observable without leaking sensitive reasons to unauthorized users.
6. **Derived views are rebuildable.** Monitoring must never be the only place where a business transition is known.
7. **Alerts are actionable.** Every production alert must identify owner, severity, signal, likely impact, and a recovery/runbook path.
8. **Low-cardinality metrics.** Patient IDs, case IDs, phone numbers, evidence IDs, free-text reasons, and other high-cardinality/sensitive values must not become metric labels.
9. **Clock/time discipline.** Runtime nodes, database, workers, scheduler, and monitoring systems require synchronized clocks because deadlines, expiry, audit chronology, and trace ordering depend on time.
10. **V1 financial boundary is monitored as an invariant.** Any configuration/code/runtime behavior indicating payment capture, wallet, escrow, settlement, payout, custody, or platform-funded protection is a release/production safety incident.

## 4. Current Repository Evidence

Verified current Laravel configuration provides:

- standard Laravel logging channels;
- file/stdout/syslog-compatible logging options;
- database-backed failed jobs by default;
- database-backed queues by `.env.example` default;
- Laravel cache, session, filesystem, and mail configuration;
- application-level catalog and financial safety modes;
- Pest-based automated testing.

The repository does **not** currently establish a production monitoring vendor, centralized log stack, metrics backend, APM/tracing product, pager/on-call platform, or production dashboards.

Accordingly, all production observability infrastructure described below is **Required/Proposed**.

## 5. Correlation Model

### 5.1 Correlation Identifier

Every inbound request must have one server-trusted correlation identifier.

Recommended behavior:

- accept a client-supplied correlation/request identifier only after validating its format and length, or generate a new opaque identifier;
- return the effective identifier in the response metadata/header where appropriate;
- store it in safe application logs;
- propagate it into application actions, queued jobs, scheduled follow-up work, audit events, and provider adapter logs;
- preserve parent-child correlation where one request dispatches multiple jobs.

The stable API error envelope defined in `docs/api/ERROR_CATALOG.md` includes `correlation_id` for safe support/debugging.

### 5.2 Job Correlation

Every queued job must record/emit at least:

- job type;
- queue name;
- safe job identifier;
- correlation identifier;
- attempt number;
- queued time;
- start time;
- completion/failure time;
- safe target type/public reference where operationally necessary and authorized.

Job payloads must not duplicate unnecessary protected business data solely for observability.

## 6. Logging Standard

### 6.1 Required Structured Fields

Where structured logging is available, application logs should include:

| Field | Purpose |
|---|---|
| `timestamp` | Event chronology. |
| `level` | Standard severity. |
| `environment` | Environment isolation. |
| `service` | UberTib runtime/component. |
| `correlation_id` | Cross-request/job investigation. |
| `request_id` / `job_id` | Local execution identity when applicable. |
| `actor_type` | Safe actor category, not identity payload. |
| `action` | Stable technical/domain action name. |
| `target_type` | Resource category where needed. |
| `outcome` | success / rejected / failed / retrying / delayed. |
| `error_code` | Stable application error code where applicable. |
| `duration_ms` | Performance timing for requests/jobs. |
| `safe_metadata` | Explicitly reviewed, non-sensitive metadata only. |

### 6.2 Data That Must Not Be Logged

Do not log:

- OTP plaintext;
- passwords or password hashes;
- access tokens, refresh tokens, session secrets, API keys, or provider credentials;
- signed evidence download URLs;
- private filesystem/object-storage paths if they expose protected location information;
- full identity documents or registration numbers;
- full clinical evidence or treatment notes;
- uploaded evidence contents;
- raw internal risk `I` data in general-purpose logs;
- full payment/refund/claim evidence payloads;
- arbitrary request/response bodies containing protected data;
- database connection passwords or environment secrets;
- malware-scan file content.

Identifiers should be minimized and pseudonymized/hashed where investigation does not require a stable application public identifier.

### 6.3 Expected Domain Rejections

The following are normal business-control outcomes and should usually be logged at an informational/warning operational level rather than as unhandled errors:

- unauthenticated/unauthorized access denial;
- invalid workflow transition;
- eligibility not met or pending evaluation;
- booking slot no longer available;
- provider response deadline expired;
- treatment-plan acceptance blocked by missing required data;
- claim/review eligibility failure;
- idempotency-key conflict;
- validation failure.

Repeated abnormal patterns may still trigger security/abuse alerts.

### 6.4 Unexpected Failures

Unexpected application exceptions, database failures, queue crashes, provider timeouts, integrity mismatches, or failed infrastructure dependencies must include the correlation identifier and safe technical context while the client receives only the stable safe error response.

## 7. Metrics Model

Metrics should be grouped into four categories.

### 7.1 Runtime / Infrastructure Metrics

Required signals include:

- request rate;
- response status distribution;
- request latency histograms;
- PHP/process CPU and memory where available;
- application instance health/restarts;
- database connection saturation;
- query latency and slow-query rate;
- database storage consumption;
- cache availability/hit ratio where used;
- queue depth and oldest-job age;
- worker availability and restarts;
- scheduler heartbeat;
- filesystem/object-storage errors;
- provider request success/failure/latency after providers are selected.

### 7.2 Application / Workflow Metrics

Required aggregate counters/gauges include:

- catalog requests and safe error rate;
- eligibility evaluations by result (`ELIGIBLE`, `NOT_ELIGIBLE`, `PENDING_EVALUATION`, `SUSPENDED`);
- eligibility recalculation queued/completed/failed/delayed;
- booking requests/confirmations/rejections/cancellations/no-shows;
- slot-capacity conflicts;
- idempotent replay count and idempotency conflicts;
- treatment-plan acceptance failures due to missing mandatory inputs;
- treatment-stage completion blocked/completed;
- external financial-event assertions, confirmations, disputes, corrections/reversals by event category;
- reviews submitted/rejected/appealed;
- claims opened/awaiting evidence/under review/decided/appealed;
- work-item queue counts by type/state/priority;
- notification intents queued/succeeded/failed;
- evidence uploads awaiting scan/accepted/rejected/failed;
- policy/service publication attempts/successes/rejections;
- launch gate expiry/revocation impact count.

Metrics must use aggregate labels only. Do not label metrics with individual patient, provider, case, booking, claim, or evidence identifiers.

### 7.3 Security Metrics

Aggregate security signals include:

- authentication failures;
- OTP send throttles and verification failures;
- privileged MFA failures;
- authorization denials by capability/resource category;
- repeated denied private-evidence access;
- unusual signed-download generation failures;
- permission/scope-grant changes;
- rate-limit events;
- suspicious repeated idempotency conflicts;
- malware-scan detections/failures after provider implementation.

These metrics are signals for investigation, not proof of malicious intent.

### 7.4 Integrity and Governance Metrics

Monitor:

- historical-decision reproduction mismatch count;
- immutable snapshot/hash mismatch count;
- missing provenance link count detected by integrity jobs/tests;
- publication attempts blocked by incomplete/expired launch gates;
- active production definition count by service;
- evaluation-only definition exposure attempts in production mode;
- scopes suspended because a credential/evidence/policy dependency expired or was revoked;
- any attempted write violating append-only/immutable constraints;
- any detected configuration value violating the V1 record-only/non-funded financial boundary.

## 8. Tracing / Execution Spans

A vendor-neutral trace model should cover high-value flows once tracing/APM is implemented.

Recommended spans:

```text
HTTP request
  -> authentication / authorization
  -> application action/query
  -> database transaction/query
  -> idempotency resolution
  -> domain computation/revalidation
  -> audit/event persistence
  -> commit
  -> after-commit job dispatch
      -> worker execution
      -> external provider adapter (if applicable)
```

Trace attributes must follow the same privacy rules as logs and metrics. Do not attach request bodies, evidence contents, OTPs, clinical payloads, or sensitive financial narratives to spans.

## 9. Service-Level Monitoring Targets

The approved NFR baseline provides these measurable targets:

| Signal | Target / Alert Basis | Source |
|---|---|---|
| Normal read latency | p95 ≤ 500 ms | `NFR-PLATFORM-001` |
| Normal write latency | p95 ≤ 800 ms | `NFR-PLATFORM-001` |
| Provider search latency | p95 ≤ 1 s | `NFR-PLATFORM-001` |
| Performance-test error rate | < 1% over approved 30-minute test | `NFR-PLATFORM-001` |
| Availability | ≥ 99.5% | `NFR-PLATFORM-002` |
| Recovery point | RPO ≤ 15 min | `NFR-PLATFORM-002` |
| Recovery time | RTO ≤ 4 h | `NFR-PLATFORM-002` |
| Restore verification | At least quarterly | `NFR-PLATFORM-002` |
| Booking safety | 100 concurrent attempts must not overbook | `NFR-PLATFORM-001`, `NFR-AUDIT-002` |

Production dashboards should report both current-window performance and rolling trends against these targets.

## 10. Queue Monitoring

### 10.1 Required Per-Queue Signals

For every operational queue or job class, monitor:

- ready depth;
- oldest ready-job age;
- in-progress count where available;
- retry count;
- failure count;
- processing duration;
- success rate;
- worker count/heartbeat;
- dead-letter/failed-job count where supported.

### 10.2 Queue Categories

At minimum, separate or distinguish logically:

- `notifications`;
- `evidence_scan`;
- `eligibility_recalculation`;
- `deadline_and_escalation`;
- `follow_up_reminders`;
- `report_projection`;
- `retention_cleanup`;
- default/general application work.

Physical queues may be combined at first if metrics can still distinguish job classes and priority/workload behavior.

### 10.3 Initial Operational Alert Thresholds

The source requirement mandates defined thresholds but does not prescribe numeric values for each queue. The following are **initial engineering operational defaults**, not business-policy deadlines. They must be validated against production workload and tightened/relaxed without changing domain policy.

| Signal | Warning | Critical | Operator Action |
|---|---:|---:|---|
| General oldest queued job | > 5 min | > 15 min | Check worker health, DB/queue availability, retry storm. |
| Eligibility recalculation oldest job | > 2 min | > 5 min | Investigate dependency-change backlog; confirm affected scopes fail safe. |
| Notification oldest job | > 5 min | > 15 min | Check provider/worker; business outcome remains committed independently. |
| Evidence scan oldest item | > 10 min | > 30 min | Check scanner/provider; evidence remains quarantined. |
| Deadline/escalation scheduler heartbeat | missed 1 expected run | missed 2 expected runs | Restore scheduler; identify deadlines needing replay/review. |
| Failed jobs | ≥ 1 high-impact job or > 5 low-impact jobs / 15 min | repeated/high-impact unresolved > 15 min | Inspect, retry safely, or escalate through audited work item. |
| Job retries | ≥ 3 attempts on one job | exhausted configured retries | Inspect cause; avoid blind retry loops. |

These values are operational-response thresholds only. A business deadline defined by a versioned policy always remains authoritative even if monitoring thresholds change.

### 10.4 Delayed Job vs Completed Business Outcome

Dashboards and operational tooling must explicitly show this distinction.

Example:

```text
Booking confirmation transaction: COMMITTED
Notification intent: QUEUED
Notification delivery: DELAYED
```

The booking is confirmed. Notification delay must not revert the booking.

Likewise:

```text
External payment report: RECORDED
Counterparty notification: FAILED
```

The financial assertion remains recorded; operator action concerns delivery only.

## 11. Deadline and Work-Queue Monitoring

Operational work items must expose aggregate monitoring for:

- items due within configured windows;
- overdue items;
- oldest unassigned item;
- oldest assigned-but-unresolved item;
- breached claim/review/verification deadlines;
- unresolved high-priority exceptions;
- assignment backlog by workflow type;
- reopened work-item rate.

Alerting must be based on the actual versioned deadline attached to the case/workflow rather than a global hardcoded deadline where domain policy controls the due time.

Operators must be able to see the difference between:

- domain deadline not yet reached;
- domain deadline reached/breached;
- reminder/escalation job delayed;
- decision blocked by missing evidence;
- decision awaiting human reviewer.

## 12. Eligibility Monitoring

Eligibility is safety-critical because new bookings must use current provider-service-branch eligibility.

Monitor:

- evaluation/recalculation throughput;
- oldest pending recalculation age;
- failures by safe reason category;
- number of scopes in `PENDING_EVALUATION`;
- number of scopes `SUSPENDED` because an influential condition became invalid;
- number of booking attempts rejected because eligibility changed between discovery and booking/confirmation;
- dependency-change events with no corresponding reevaluation completion within the operational threshold;
- integrity/reproduction mismatch for stored decision snapshots.

If recalculation is delayed after a revocation/expiry that should make a scope unsafe, the system must fail closed for new bookings rather than continue relying on known-stale eligibility.

## 13. Evidence and Malware-Scan Monitoring

Once private evidence intake is implemented, monitor:

- upload intake count/size aggregate;
- validation rejection count by safe category;
- items in quarantine;
- oldest quarantine age;
- scanner request failures/timeouts;
- malware detections;
- scan-provider availability;
- evidence items referenced by workflows before allowed scan state — target **zero**;
- private download authorization failures;
- signed/temporary access generation errors;
- retention/deletion backlog;
- legal-hold deletion blocks.

A scanner outage must keep evidence quarantined. It must never automatically mark evidence safe.

## 14. Notification Monitoring

Monitor notification intent and delivery independently.

Signals:

- intents created;
- queued delivery attempts;
- accepted/delivered state where provider semantics support it;
- retrying;
- terminal failure;
- oldest unsent intent;
- provider latency/errors;
- recipient/channel category aggregates.

Do not treat provider “accepted” as proof that the human recipient read the message unless a future provider contract explicitly supplies a reliable read semantic.

OTP delivery must be monitored separately from ordinary notifications because authentication throttling/security rules apply.

## 15. Database Monitoring

Required database signals include:

- availability/connection failures;
- connection utilization;
- transaction latency;
- query p95/p99 and slow-query count;
- deadlocks/lock-wait timeouts;
- storage consumption/growth;
- replication/recovery-point lag if the selected topology uses replication;
- backup/recovery-point freshness;
- migration failures;
- constraint/trigger violations by safe category.

### 15.1 Booking Concurrency Signal

Monitor slot-capacity conflicts and lock/deadlock behavior, but never weaken transactional safety merely to reduce conflict metrics.

A conflict resulting in one request being safely rejected is preferable to overbooking.

### 15.2 Integrity Constraint Signals

Repeated violations of immutable/append-only database triggers or constraints should alert engineering because they may indicate a code path attempting forbidden mutation.

## 16. Backup and Recovery Monitoring

`NFR-PLATFORM-002` requires `RPO ≤ 15 minutes`, `RTO ≤ 4 hours`, and quarterly restore verification.

Required monitoring:

| Signal | Warning | Critical |
|---|---:|---:|
| Latest recoverable DB point age | > 10 min | > 15 min |
| Backup job failure | first failure | failure unresolved beyond next expected recovery point |
| Evidence durability/versioning protection | degraded | unavailable/unprotected required evidence |
| Restore-test age | approaching quarterly due date | quarterly verification overdue |
| Recovery drill result | partial/manual defect | failed restore or RTO/RPO not met |

A backup file existing is not sufficient. Restore success must be periodically demonstrated.

Restore tests should verify, at minimum:

- relational integrity;
- immutable historical records;
- Arabic text correctness;
- evidence metadata/object consistency for the tested scope;
- ability to resume queue/scheduler operations without duplicating committed domain outcomes.

## 17. Availability and Health Checks

### 17.1 Liveness

Liveness answers whether a runtime process is alive enough to be restarted/routed.

It should avoid expensive dependency chains that cause mass restart loops during a downstream outage.

### 17.2 Readiness

Readiness answers whether the application instance can safely serve traffic.

Depending on final topology, readiness should verify critical local/runtime requirements such as:

- application boot/config validity;
- database connectivity when required for serving business requests;
- migration/schema compatibility;
- mandatory production safety configuration.

A queue or notification-provider outage should not necessarily remove all web instances from service if committed user actions can still be accepted safely and the follow-up can be queued/retried. Safety-critical dependency failures should fail only the affected workflow where possible.

### 17.3 Synthetic Checks

Provider-neutral synthetic checks should cover:

- public catalog endpoint availability;
- safe authenticated health workflow after auth is implemented;
- database-backed write/read in a non-business synthetic scope where appropriate;
- queue worker/scheduler heartbeat;
- private storage access health without using real protected evidence.

Synthetic tests must never create real clinical/financial outcomes or send money.

## 18. Production Safety Monitors

The following conditions should produce high-severity alerts or block release/startup as appropriate:

1. `APP_DEBUG=true` in production.
2. `UBERTIB_CATALOG_MODE=evaluation` in production.
3. `UBERTIB_FINANCIAL_MODE` differs from `record_only_non_funded`.
4. funded protection is detected in an effective V1 service definition.
5. evaluation-only/unready service content is exposed through production catalog selection.
6. a private evidence workflow uses a public filesystem/object URL.
7. authorization/scope checks are bypassed on a protected route/action.
8. an immutable snapshot/event is mutated or hash verification fails.
9. a known-invalid provider-service-branch scope remains bookable.
10. any payment authorization/capture/wallet/escrow/custody/settlement/payout/platform-refund execution path becomes enabled in V1.

These are product-safety invariants, not ordinary performance warnings.

## 19. Alert Severity Model

A concrete paging platform is not selected, but alert semantics should follow a stable operational severity model.

### Critical

Immediate operator/engineering attention because there is active or imminent safety, integrity, security, or major availability impact.

Examples:

- production database unavailable;
- RPO > 15 minutes;
- unsafe catalog/evaluation exposure in production;
- financial-mode invariant violation;
- authorization isolation failure;
- evidence exposed publicly;
- booking over-capacity invariant violated;
- immutable-history integrity mismatch affecting production truth;
- scheduler failure causing imminent/actual high-impact deadline breaches.

### High

Prompt response required; core system may remain available.

Examples:

- sustained API error/latency breach;
- eligibility recalculation critical backlog;
- evidence-scan critical backlog;
- high-impact queue job exhausted retries;
- notification/OTP provider widespread failure;
- restore/backup job failure before RPO is breached.

### Medium

Operational degradation requiring work during the active support window.

Examples:

- growing general queue backlog;
- repeated retry spikes;
- work-item SLA trend deterioration;
- storage capacity approaching limit;
- increased authorization denial anomaly requiring review.

### Low / Informational

Trend, maintenance, or expected-control signals that do not require immediate intervention.

## 20. Dashboard Set

A production monitoring implementation should provide at least these dashboard views.

### 20.1 System Health

- availability;
- request rate/error/latency;
- runtime instance health;
- DB/cache/queue health;
- storage capacity;
- scheduler heartbeat.

### 20.2 Queue and Async Operations

- depth and oldest age by queue/job type;
- retries/failures;
- worker health;
- notifications;
- scans;
- eligibility recalculation;
- deadline/reminder jobs.

### 20.3 Business Operations

Aggregate, privacy-safe:

- bookings by state;
- cases/stages/follow-ups by state;
- operational work items and breached deadlines;
- claims/reviews/appeals by state;
- external financial records by assertion/confirmation/dispute state.

### 20.4 Governance and Safety

- service publication/readiness status;
- launch-gate expiry/revocation trends;
- eligibility suspended/pending scopes;
- integrity exceptions;
- authorization/security anomalies;
- backup/recovery state;
- production-safety invariant status.

Dashboard access itself must follow `docs/domain/PERMISSIONS_MATRIX.md`. Aggregate monitoring access does not imply permission to drill into protected case/evidence data.

## 21. Operator Investigation Workflow

When an alert fires:

1. identify environment, service, severity, and correlation/job identifier;
2. determine whether authoritative business state committed;
3. distinguish domain rejection from technical failure;
4. determine affected population/scope using safe aggregate data;
5. inspect logs/traces using correlation identifiers without copying protected payloads into tickets/chat;
6. identify whether retry is safe and idempotent;
7. retry or replay through an approved operational mechanism;
8. if automated recovery is unsafe, create/escalate an audited work item;
9. verify resulting authoritative state directly from the application/database through an authorized path;
10. record incident resolution and follow-up action.

Operators must not “fix” incidents by manually editing computed eligibility, immutable snapshots, financial history, or sensitive claim decisions.

## 22. Retry and Replay Controls

Operational retry must respect domain idempotency and current state.

Safe examples:

- retry notification delivery;
- retry malware-scan request;
- retry a failed eligibility recalculation after reloading current dependencies;
- rerun a projection rebuild;
- replay a reminder/escalation check.

Unsafe examples without a dedicated idempotent domain command:

- inserting another booking confirmation;
- duplicating an external financial event;
- generating another accepted terms snapshot;
- repeating a human claim decision;
- editing historical records to match an expected result.

Retries must be auditable when they can affect user-visible or regulated/sensitive workflow behavior.

## 23. Incident and Audit Separation

Application audit and operational logs serve different purposes.

**Audit record** answers questions such as:

- who performed a sensitive action;
- what resource/scope was affected;
- what decision/outcome was committed;
- under which policy/authorization context;
- when it occurred.

**Operational logs/traces** answer:

- which runtime processed it;
- how long it took;
- whether dependencies failed;
- why a technical retry occurred.

Do not rely on deletable/rotating application logs as the sole audit record for sensitive decisions.

## 24. Retention of Observability Data

Final legal/compliance retention periods remain governed by `Q-PLATFORM-002`.

Until approved:

- observability retention must be minimized to operational need;
- logs must not duplicate protected source records merely to extend retention;
- security/audit records that require longer retention belong in the authoritative audit model, not general debug logs;
- log rotation and deletion must not delete required domain/audit history;
- legal hold applies to authoritative records according to the data-retention design, not automatically to every transient metric/trace unless explicitly required.

## 25. Monitoring Provider Requirements

When a concrete monitoring/log/APM provider is selected, it must support or be configured to support:

- environment isolation;
- role-based access;
- encrypted transport and storage;
- data-region/privacy requirements once confirmed;
- log redaction/filtering;
- metric dashboards;
- alert routing;
- correlation search;
- retention controls;
- export or incident evidence needed by operations;
- least-privilege service credentials;
- provider outage behavior that does not block safe core business transactions unnecessarily.

Provider selection must not require sending protected medical/evidence payloads to the observability vendor by default.

## 26. Implementation Expectations

Implementation should establish:

- request correlation middleware;
- job correlation propagation;
- structured safe logging conventions;
- stable domain/technical error categorization;
- metrics instrumentation for HTTP, database, queue, scheduler, and required workflows;
- health/readiness endpoints appropriate to the final topology;
- queue/scheduler heartbeat monitoring;
- production safety checks;
- backup freshness and restore-test reporting;
- alert rules and dashboard definitions in provider-specific infrastructure only after provider selection;
- audited operational retry/escalation mechanisms for sensitive workflows.

Monitoring code must remain separate from business-decision logic. Failure to emit a metric must not alter a clinical, eligibility, booking, financial, or claim outcome.

## 27. Verification Checklist

Before production launch, verify all of the following:

- [ ] every HTTP request has a correlation identifier;
- [ ] every queued job preserves correlation context;
- [ ] safe error responses expose correlation without stack traces;
- [ ] logs contain no OTPs/secrets/protected payloads in representative failure tests;
- [ ] read/write/search latency dashboards match NFR thresholds;
- [ ] availability measurement is defined against the 99.5% target;
- [ ] queue depth, age, retries, failures, scheduler heartbeat, scan backlog, notification failure, eligibility delay, deadline breach, and backup freshness alerts exist;
- [ ] delayed async work is visibly distinct from committed business state;
- [ ] operators have an audited safe retry/escalation path;
- [ ] RPO > 15 minutes produces a critical alert;
- [ ] quarterly restore verification is tracked;
- [ ] evidence remains quarantined during scanner failure;
- [ ] booking concurrency invariant is monitored/tested;
- [ ] production configuration prevents evaluation catalog exposure;
- [ ] record-only non-funded financial mode is continuously enforced;
- [ ] no monitoring dashboard grants unauthorized protected-data access;
- [ ] integrity mismatches generate visible operational exceptions and are not silently repaired.

## 28. Open Items

| ID | Severity | Monitoring Impact |
|---|---|---|
| `Q-OPS-001` | Major | Monitoring/log/APM/alert infrastructure cannot be bound to a concrete topology/provider yet. |
| `Q-PLATFORM-003` | Major | OTP/MFA, malware scan, evidence storage, and notification provider-specific health metrics remain undefined. |
| `Q-PLATFORM-002` | Major | Final observability retention/deletion requirements require legal/compliance validation. |
| `Q-PLATFORM-001` | Blocker | Complete SRS v1.1 reconciliation cannot be claimed until readable authoritative content is available. |

No new `Q-*`, `DR-*`, `TD-*`, or `ASM-*` identifier is introduced by this document.

## 29. Documentation Integration Status

The applicable Phase 2 engineering documentation set remains complete:

- architecture;
- component design;
- API/error contracts;
- ERD/DFD;
- state machines;
- permissions;
- sequence diagrams;
- configuration;
- infrastructure;
- monitoring.

`docs/integrations/INTEGRATION_CONTRACTS.md` remains intentionally omitted because no concrete third-party provider contract is currently approved. `docs/ux/SCREEN_INVENTORY.md` remains intentionally omitted because no authoritative business UI exists and UX work is deferred to the separate UX pipeline.

Phase 3 testing, implementation planning, traceability, and documentation-validation artifacts are complete and current. This document is now maintained under Phase 4 evidence/consistency verification. A clean documentation validator does not mean monitoring infrastructure or V1 feature implementation is complete.