# UberTib Runtime Configuration

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-24  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/COMPONENT_DESIGN.md`, `docs/api/API_CONTRACTS.md`, `docs/database/ERD.md`, `docs/domain/STATE_MACHINES.md`  
**Repository source:** `UberTip-Backend/.env.example` and `UberTip-Backend/config/*.php`  
**Registry:** `docs/README.md`

## 1. Purpose

This document owns runtime and environment configuration guidance for UberTib V1. It records what is verified in the current Laravel repository, what values are environment-specific, and which product/security boundaries must be enforced by configuration without turning business policy into environment variables.

Configuration must not become a second policy engine. Clinical formulas, S/P/H/I weights and thresholds, eligibility rules, evidence rules, deadlines, cancellation rules, financial rules, and other historically reproducible business behavior belong in versioned domain policy records, not `.env` values.

`Q-PLATFORM-001` still blocks a claim of complete reconciliation with readable SRS v1.1. `Q-PLATFORM-003` and `Q-OPS-001` leave concrete production providers and hosting topology unresolved.

## 2. Configuration Principles

1. Secrets are injected at deployment/runtime and never committed to Git.
2. Production must fail closed when a safety-critical configuration is invalid or missing.
3. Environment variables configure infrastructure and runtime behavior; versioned business policy remains in authoritative domain data.
4. `APP_DEBUG` must be disabled outside controlled development environments.
5. Production financial mode is permanently record-only for V1.
6. Evaluation catalog data must never be exposed as production-ready content.
7. Private evidence must use private storage and must not be exposed through public filesystem paths.
8. Queue-backed side effects must not run before the authoritative transaction commits.
9. Logs must not contain OTP codes, credentials, signed URLs, protected clinical payloads, private evidence content, or unnecessary identity/financial data.
10. Configuration changes that affect production behavior are deployment changes and require verification and rollback capability.

## 3. Verified Current Environment Surface

The current `.env.example` contains these top-level runtime groups:

- application identity, environment, URL, locale, and maintenance;
- UberTib catalog and financial modes;
- password hashing;
- logging;
- database;
- sessions;
- broadcast, filesystem, queue, and cache;
- Redis/Memcached examples;
- mail;
- AWS/S3-compatible storage placeholders;
- frontend Vite application name.

The current repository does **not** contain production credentials for SMS/OTP, MFA, malware scanning, private-evidence storage, push notification, payment, or other external providers. No such provider should be inferred from framework examples.

## 4. Application Configuration

| Variable | Current example/default | Production rule | Notes |
|---|---|---|---|
| `APP_NAME` | `.env.example`: `Laravel` | Set to UberTib deployment name | User-facing sender/application name where applicable. |
| `APP_ENV` | `local` | Production deployment must use a non-development environment value | Used by Laravel/environment-sensitive behavior. |
| `APP_KEY` | empty | Required secret | Generate securely; do not commit. Rotation can invalidate encrypted application/session data and must be planned. |
| `APP_DEBUG` | `true` | **Must be `false` in production** | Prevents sensitive stack/config leakage. |
| `APP_URL` | `http://localhost:8000` | Canonical HTTPS deployment URL | Used by URL generation and mail/session-related defaults. |
| `APP_LOCALE` | `en` | Arabic-first behavior must be preserved where server localization is used | Product requires Arabic-first/RTL; client UI localization remains separate. |
| `APP_FALLBACK_LOCALE` | `en` | Keep an explicit safe fallback | Does not override Arabic-first product behavior. |
| `APP_FAKER_LOCALE` | `en_US` | Development/test only | No production business effect. |
| `APP_MAINTENANCE_DRIVER` | `file` | Deployment-specific | If multi-node deployment is selected, maintenance coordination must work consistently across nodes. |
| `BCRYPT_ROUNDS` | `12` | Security/performance tested value | Do not lower merely for production performance. |

### 4.1 Production Debug Boundary

A production deployment with `APP_DEBUG=true` is invalid. Error responses must use the stable safe error contract from `docs/api/ERROR_CATALOG.md`; diagnostic detail belongs in protected logs/monitoring, not client responses.

## 5. UberTib Product-Safety Configuration

Verified `config/ubertib.php` currently defines only:

```php
return [
    'catalog_mode' => env('UBERTIB_CATALOG_MODE', 'production'),
    'financial_mode' => env('UBERTIB_FINANCIAL_MODE', 'record_only_non_funded'),
];
```

### 5.1 `UBERTIB_CATALOG_MODE`

Supported current values:

- `evaluation`
- `production`

The repository's `.env.example` sets `UBERTIB_CATALOG_MODE=evaluation`, while `config/ubertib.php` defaults to `production` if the variable is absent.

This distinction is intentional from a safety perspective:

- `evaluation` permits the provisional seeded catalog to be inspected in evaluation environments;
- `production` must publish only definitions that satisfy production-readiness rules;
- the current production-mode tests confirm evaluation-only definitions are excluded;
- production must never switch to `evaluation` merely to make an empty catalog visible.

**Production rule:** `UBERTIB_CATALOG_MODE=production`.

If production has no clinically approved/launch-ready definitions, the correct result is an empty/not-ready production catalog rather than exposing provisional content.

### 5.2 `UBERTIB_FINANCIAL_MODE`

Current and required V1 value:

```text
record_only_non_funded
```

The current `ServiceDefinition` model rejects a different financial mode and rejects funded protection.

**Production and non-production rule:** V1 must remain `record_only_non_funded` for behavior that exercises business rules.

Do not introduce environment values such as:

- `payments_enabled`;
- `wallet_enabled`;
- `escrow_enabled`;
- `settlement_enabled`;
- `platform_refunds_enabled`;
- `funded_protection_enabled`.

Those capabilities are out of V1 scope and cannot be activated by configuration.

## 6. Database Configuration

The current default is SQLite:

```text
DB_CONNECTION=sqlite
```

Current Laravel configuration also includes MySQL, MariaDB, PostgreSQL, and SQL Server connection definitions. The verified UberTib migrations contain SQLite/MySQL-specific integrity trigger implementations for current catalog/governance tables.

### 6.1 Relevant Variables

| Variable | Purpose |
|---|---|
| `DB_CONNECTION` | Selected Laravel connection. |
| `DB_URL` | Optional full connection URL. |
| `DB_HOST` | Database host when applicable. |
| `DB_PORT` | Database port. |
| `DB_DATABASE` | Database/schema name or SQLite path. |
| `DB_USERNAME` | Database principal. |
| `DB_PASSWORD` | Database secret. |
| `DB_SOCKET` | Optional MySQL/MariaDB socket. |
| `DB_CHARSET` / `DB_COLLATION` | Character set/collation; current MySQL defaults are `utf8mb4` / `utf8mb4_unicode_ci`. |
| `MYSQL_ATTR_SSL_CA` | Optional MySQL TLS CA. |
| `DB_FOREIGN_KEYS` | SQLite foreign-key enforcement. |

### 6.2 Environment Rules

**Local/test**

- SQLite is supported by current migrations/tests.
- Foreign keys must stay enabled when tests rely on relational integrity.

**Production**

- The concrete managed/self-hosted database topology remains part of `Q-OPS-001`.
- Production must use a relational deployment that preserves all documented foreign keys, transactions, row locking, uniqueness rules, append-only constraints, and recovery objectives.
- Before deployment, all database-specific trigger/constraint behavior must be exercised against the chosen production database engine, not only SQLite test runs.
- Database credentials must use least privilege appropriate to runtime versus migration/deployment operations where the hosting setup supports separate principals.

### 6.3 Business Policy Must Not Live in DB Environment Variables

Do not create `.env` variables for:

- scientific grade bands;
- S weights;
- K/EU confidence thresholds;
- P price bands;
- H rules;
- I rules;
- booking/cancellation deadlines;
- claim/refund windows;
- evidence requirements;
- retention periods.

Those values require versioning, provenance, historical reproducibility, and in some cases clinical/legal approval. They belong in the policy/service-definition models described by `ERD.md`.

## 7. Cache Configuration

Current default:

```text
CACHE_STORE=database
```

Available framework stores include database, file, Redis, Memcached, DynamoDB, storage, and others. Availability in the framework does not mean a provider is approved for UberTib.

Relevant current variables include:

- `CACHE_STORE`
- `CACHE_PREFIX`
- `DB_CACHE_CONNECTION`
- `DB_CACHE_TABLE`
- `DB_CACHE_LOCK_CONNECTION`
- `DB_CACHE_LOCK_TABLE`
- Redis/Memcached variables when those stores are selected.

### 7.1 Cache Safety Rules

- Cache is never the authoritative source for eligibility, booking capacity, accepted terms, financial-event history, claims, or permissions.
- Booking confirmation must re-read/revalidate authoritative state and capacity transactionally.
- Cached eligible-provider/search data may be stale and must not bypass confirmation-time checks.
- Cache keys must not embed sensitive raw patient/evidence data.
- Shared production cache deployments must use a collision-safe application prefix.
- Clearing the cache must not destroy business state.

### 7.2 Current Public Catalog Cache

The existing catalog route applies public caching with a maximum age of 60 seconds and ETag behavior.

This is acceptable only because the endpoint exposes public catalog data. Private patient/case/evidence/financial responses must not inherit public caching behavior.

## 8. Queue Configuration

Current default:

```text
QUEUE_CONNECTION=database
```

Current configured drivers include sync, database, Beanstalkd, SQS, Redis, deferred, background, failover, and null/framework options.

### 8.1 Important Current Detail: `after_commit=false`

The current database, Beanstalkd, SQS, and Redis queue connection definitions use:

```php
'after_commit' => false
```

This does **not** satisfy the UberTib rule by itself that non-critical asynchronous side effects should be dispatched only after the authoritative business transaction commits.

Implementation must therefore do one of the following deliberately:

1. dispatch relevant domain jobs/notifications with Laravel's after-commit mechanism; or
2. adopt a reviewed connection-level `after_commit=true` strategy where appropriate.

Do not assume queue configuration automatically prevents pre-commit delivery.

### 8.2 Queue Use Cases

Queues are appropriate for:

- notification delivery;
- malware scanning orchestration;
- scheduled eligibility reevaluation;
- retryable recalculation;
- claim/deadline/escalation checks;
- follow-up reminders;
- rebuildable report/search projection refresh;
- retention/deletion processing after legal-hold checks.

### 8.3 Queue Safety Rules

- Jobs reload authoritative state before acting.
- Jobs are retry-safe/idempotent.
- A retry must not create duplicate financial events, bookings, accepted snapshots, or decisions.
- Failed/aged jobs must be observable under `NFR-PLATFORM-008`.
- Job payloads should carry identifiers and safe correlation metadata rather than unnecessary sensitive payloads.
- Queue failure cannot roll back a business transaction that already committed; it creates retry/operational work instead.

### 8.4 Queue Variables

Current relevant variables include:

- `QUEUE_CONNECTION`
- `QUEUE_FAILED_DRIVER`
- `DB_QUEUE_CONNECTION`
- `DB_QUEUE_TABLE`
- `DB_QUEUE`
- `DB_QUEUE_RETRY_AFTER`
- `REDIS_QUEUE_CONNECTION`
- `REDIS_QUEUE`
- `REDIS_QUEUE_RETRY_AFTER`
- SQS variables if that driver is explicitly selected later.

Concrete production queue/provider topology remains under `Q-OPS-001`.

## 9. Redis and Memcached Configuration

The repository contains standard Laravel Redis/Memcached configuration examples.

Current `.env.example` includes:

```text
MEMCACHED_HOST=127.0.0.1
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

Additional supported Redis variables in current `config/database.php` include username, database numbers, prefixes, cluster/persistence settings, and retry/backoff controls.

**Rule:** presence of these configuration entries does not mean Redis or Memcached is required or selected for production. Selection belongs to infrastructure design after `Q-OPS-001` is resolved.

## 10. Session Configuration

Current defaults:

```text
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
```

Current `config/session.php` additionally supports secure cookie, HttpOnly, SameSite, connection/table/store, expire-on-close, partitioning, and other Laravel session settings.

### 10.1 Production Session Rules

For browser/Filament sessions:

- use HTTPS in production;
- production cookies must be sent securely (`SESSION_SECURE_COOKIE=true` when served over HTTPS);
- keep HttpOnly enabled;
- select SameSite behavior intentionally based on the actual trusted deployment domains;
- session scope/domain must not unintentionally grant cookies to unrelated subdomains;
- privileged authentication must satisfy the non-SMS second-factor requirement from `NFR-IDENTITY-002` regardless of session driver.

`SESSION_ENCRYPT=false` is the framework/example default. Changing it is an implementation/security decision, but sensitive business payloads should not be stored unnecessarily in session state either way.

The exact mobile API authentication transport remains intentionally unresolved in `API_CONTRACTS.md`; do not infer that Laravel web sessions are the mobile API contract.

## 11. Filesystem and Private Evidence Configuration

Current default:

```text
FILESYSTEM_DISK=local
```

The current local disk points to:

```text
storage/app/private
```

The repository also defines a public local disk and an S3-compatible disk using AWS-style variables.

### 11.1 Evidence Storage Rules

Private UberTib evidence must:

- never use the `public` disk;
- remain inaccessible through `/storage` public links;
- use opaque object identity;
- be associated with SHA-256 and ownership/purpose metadata;
- remain quarantined until required file validation/malware scanning succeeds;
- be reauthorized for each download;
- use access valid for no more than the approved short-lived limit where signed access is used;
- have every sensitive download audited.

### 11.2 S3-Compatible Variables

Current framework configuration supports:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`
- `AWS_BUCKET`
- `AWS_URL`
- `AWS_ENDPOINT`
- `AWS_USE_PATH_STYLE_ENDPOINT`

These are generic framework/storage variables only. No AWS/S3 vendor is currently approved as the UberTib production evidence provider. `Q-PLATFORM-003` and `Q-OPS-001` remain unresolved.

Do not commit storage credentials or return raw bucket/object paths to clients.

## 12. Mail and Notification Configuration

Current default:

```text
MAIL_MAILER=log
```

The current repository supports standard Laravel mail transports, but `.env.example` is explicitly local/log oriented.

Relevant variables include:

- `MAIL_MAILER`
- `MAIL_SCHEME`
- `MAIL_URL`
- `MAIL_HOST`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_FROM_ADDRESS`
- `MAIL_FROM_NAME`
- `MAIL_EHLO_DOMAIN`
- `MAIL_LOG_CHANNEL`

### 12.1 Current Boundary

There is no approved concrete production email/SMS/push notification provider contract.

- `MAIL_MAILER=log` must not be mistaken for delivered production notifications.
- OTP delivery provider selection remains under `Q-PLATFORM-003`.
- Notification delivery is not authoritative business state; failed delivery creates retry/operational visibility rather than reverting a committed domain action.

## 13. OTP and Privileged MFA Configuration — Provider Blocked

`NFR-IDENTITY-002` defines product/security behavior independent of provider choice:

- OTP is six digits;
- expires after five minutes;
- stored hash-only;
- single use;
- maximum five verification attempts;
- maximum three sends per 15 minutes per phone/account/IP combination;
- resend invalidates the prior code without resetting accumulated failures;
- privileged roles require a non-SMS second factor.

These rules must **not** be hidden in provider-specific environment variables because they are security/business requirements that need tested application enforcement.

Provider credentials/endpoints may become environment variables after a provider is approved. Until then, do not invent names such as `TWILIO_*`, `FIREBASE_*`, or other vendor-specific settings.

## 14. Malware Scanning Configuration — Provider Blocked

The evidence pipeline requires malware scanning before protected business use where scanning is required, but no scanner/provider is selected.

Future runtime configuration may contain provider endpoint/credential/timeout values only after `Q-PLATFORM-003` is resolved. The application-level states and fail-closed behavior remain provider independent.

If scanning is unavailable in production, affected evidence must remain quarantined/unusable rather than automatically accepted.

## 15. Logging Configuration

Current default/example:

```text
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug
```

Current configured Laravel channels include single, daily, monthly, Slack, Papertrail-style syslog, stderr, syslog, errorlog, null, and emergency options.

### 15.1 Production Logging Rules

- Do not run production at a verbosity that unnecessarily records sensitive request bodies.
- Never log OTP values, passwords, credentials, authentication tokens, private signed links, evidence file contents, full protected clinical payloads, or unrestricted financial/identity payloads.
- Sensitive audit events belong in the governed audit/provenance model, not merely application logs.
- Application logs should include safe correlation identifiers so operational failures can be connected to audit/job/request context.
- Log aggregation destination remains part of `Q-OPS-001`; framework channel availability is not an infrastructure decision.

Relevant current variables include `LOG_CHANNEL`, `LOG_STACK`, `LOG_LEVEL`, deprecation options, and channel-specific provider variables only when those channels are intentionally selected.

## 16. Broadcasting

The current `.env.example` uses:

```text
BROADCAST_CONNECTION=log
```

No requirement currently establishes a production real-time broadcast provider. Do not select Pusher/WebSocket/vendor infrastructure merely because Laravel supports broadcasting.

If future implementation requires real-time delivery, it must remain a delivery mechanism rather than authoritative state and must receive an explicit architecture/infrastructure decision.

## 17. Production Configuration Profile

The following describes required **properties**, not a complete credential file:

```text
APP_ENV=<production environment>
APP_KEY=<secret injected by deployment>
APP_DEBUG=false
APP_URL=https://<approved-host>

UBERTIB_CATALOG_MODE=production
UBERTIB_FINANCIAL_MODE=record_only_non_funded

DB_CONNECTION=<approved production relational connection>
DB_HOST=<secret/config>
DB_DATABASE=<secret/config>
DB_USERNAME=<secret>
DB_PASSWORD=<secret>

SESSION_DRIVER=<approved shared/runtime-capable store>
SESSION_SECURE_COOKIE=true

FILESYSTEM_DISK=<approved private-capable default or explicit domain disk>
QUEUE_CONNECTION=<approved production queue backend>
CACHE_STORE=<approved production cache backend>

MAIL_MAILER=<approved provider only when configured>
LOG_CHANNEL=<approved operational logging channel>
```

This block intentionally omits vendor-specific OTP/MFA, malware-scanning, notification, storage, and hosting settings because those providers are not yet approved.

## 18. Local / Evaluation Configuration Profile

The current `.env.example` is suitable as a starting point for local evaluation, notably:

```text
APP_ENV=local
APP_DEBUG=true
UBERTIB_CATALOG_MODE=evaluation
UBERTIB_FINANCIAL_MODE=record_only_non_funded
DB_CONNECTION=sqlite
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=local
MAIL_MAILER=log
```

Local mode does not waive product invariants. In particular:

- funded protection remains forbidden;
- money movement remains forbidden;
- tests should preserve authorization/idempotency/immutability rules;
- provisional catalog content remains evaluation data.

## 19. Test Configuration Expectations

Automated tests may use isolated SQLite/database/cache/queue drivers for speed, but tests that verify engine-specific constraints or deployment behavior must also exercise the selected production stack.

Test environments should explicitly verify at least:

- evaluation versus production catalog visibility;
- `record_only_non_funded` enforcement;
- database constraint/trigger behavior on the production database engine;
- queue-after-commit behavior for side effects;
- cache staleness cannot bypass booking-time revalidation;
- session/auth isolation for privileged and scoped users;
- private evidence never lands on a public disk;
- logging/error output does not leak protected values.

## 20. Configuration Validation at Startup/Deployment

Before a production release is considered healthy, deployment verification should reject or alert on at least these conditions:

| Condition | Expected result |
|---|---|
| `APP_KEY` missing | Deployment fails. |
| `APP_DEBUG=true` in production | Deployment fails. |
| `UBERTIB_FINANCIAL_MODE != record_only_non_funded` | Application/business initialization fails closed. |
| `UBERTIB_CATALOG_MODE=evaluation` in production | Deployment fails or is blocked by release validation. |
| Database unavailable | Health/readiness fails; do not accept business writes. |
| Queue unavailable | Business writes may continue only where post-commit delivery is safely recoverable; operations must see degraded state. |
| Private evidence store unavailable | Evidence intake/download fails closed; no fallback to public storage. |
| Malware scanner unavailable where scan is mandatory | Evidence remains quarantined; do not mark clean. |
| Notification provider unavailable | Record delivery failure/retry; do not roll back committed business truth. |
| Cache unavailable | Fall back only where correctness remains intact; never infer authoritative eligibility/capacity from stale cache. |

The exact health-check endpoints and infrastructure orchestration belong to `docs/ops/INFRASTRUCTURE.md` and `docs/ops/MONITORING.md`.

## 21. Configuration Change Management

Production configuration changes should follow this sequence:

1. record the intended change and affected runtime capability;
2. verify it does not alter versioned business/clinical policy outside its governed workflow;
3. update deployment secret/config management, not committed `.env` files;
4. deploy using the documented environment profile;
5. run configuration and application health checks;
6. run targeted smoke tests for affected capability;
7. monitor errors, queues, readiness, and audit-visible consequences;
8. roll back configuration if safety/correctness checks fail.

For Laravel deployments using configuration caching, runtime secrets/environment values must be available **before** building/caching configuration. After environment changes, rebuild the configuration cache using the verified deployment process rather than assuming the running process rereads `.env` dynamically.

## 22. Secret Handling

The following classes of values are secrets and must not appear in Git, documentation examples with real values, application error bodies, telemetry attributes, or screenshots/log dumps shared broadly:

- `APP_KEY`;
- database passwords;
- Redis/Memcached credentials when configured;
- mail-provider credentials;
- object-storage access keys;
- future OTP/MFA/provider credentials;
- future malware-scanning credentials;
- signed/private evidence URLs;
- API/authentication tokens.

Where possible, production credentials should be injected from the hosting platform's secret-management mechanism. The exact system remains unresolved under `Q-OPS-001`.

## 23. Configuration vs Versioned Policy Ownership

| Concern | Runtime configuration? | Canonical owner |
|---|---|---|
| Application URL/environment/debug | Yes | Deployment configuration |
| Database/cache/queue/storage/log provider | Yes | Deployment/infrastructure configuration |
| Catalog evaluation vs production mode | Yes | `config/ubertib.php`, release environment |
| V1 record-only financial mode | Yes, invariant switch | `config/ubertib.php` + domain enforcement |
| Service definitions | No | Versioned service-definition records |
| S formula/weights/grade bands | No | Versioned clinically approved policy |
| P price bands | No | Versioned policy + source price facts |
| H protection rules | No | Versioned policy/accepted snapshots |
| I internal-risk rules | No | Versioned governed policy |
| Booking/provider-response/cancellation deadlines | No | Versioned policy/snapshot |
| Claim/refund/evidence/appeal windows | No | Versioned policy/snapshot |
| Retention periods | No | Approved legal/compliance policy; currently `Q-PLATFORM-002` |
| User/staff permissions | No static `.env` matrix | Role + scoped authorization records/policies |
| Payment/escrow/wallet capability | **Forbidden in V1** | Product scope, not a feature flag |

## 24. Known Gaps / Open Dependencies

- `Q-PLATFORM-001` — authoritative SRS v1.1 text remains unreadable for complete reconciliation.
- `Q-PLATFORM-002` — final retention/deletion periods require legal/compliance validation.
- `Q-PLATFORM-003` — OTP/MFA, malware scanning, private-evidence transfer/storage, and related provider selections remain unresolved.
- `Q-OPS-001` — production hosting/deployment/database/cache/queue/log aggregation topology/provider remains unresolved.
- Current `.env.example` is development-oriented and must not be deployed unchanged to production.
- Current queue connections use `after_commit=false`; domain implementation must explicitly guarantee post-commit dispatch for relevant side effects.
- The current mobile API authentication transport is not established and must not be inferred from Laravel's browser session configuration.

No new canonical IDs are allocated by this document.
