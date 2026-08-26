# UberTib Runtime Configuration

**Phase:** 2 — Conditional Engineering Documentation  
**Mode:** Existing Repository  
**Baseline:** 2026-08-26  
**Product source:** `docs/PRD.md`  
**Technical sources:** `docs/SDD.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/architecture/COMPONENT_DESIGN.md`, `docs/api/API_CONTRACTS.md`, `docs/database/ERD.md`, `docs/domain/STATE_MACHINES.md`  
**Repository source:** `UberTip-Backend/.env.example` and `UberTip-Backend/config/*.php`  
**Registry:** `docs/README.md`

## 1. Purpose and current dependency status

This document owns runtime and environment configuration guidance for UberTib V1. Environment variables configure deployment/infrastructure; historically reproducible clinical and commercial behavior belongs in governed domain data or versioned policy.

`Q-PLATFORM-001` still blocks a claim of complete reconciliation with readable SRS v1.1. `Q-PLATFORM-003` is **Resolved** by `PO-UX-17` for the provider-neutral evidence-transfer interaction contract. Concrete OTP/MFA, malware-scanning, private-evidence storage/transfer, notification, hosting, monitoring and related vendor selection is an infrastructure concern tracked by `Q-OPS-001`. The production relational engine itself is not open: the current approved baseline requires MySQL and point-in-time recovery.

## 2. Configuration principles

1. Secrets are injected at deployment/runtime and never committed.
2. Production fails closed when safety-critical configuration is invalid or missing.
3. Environment variables configure infrastructure/runtime, not versioned product policy.
4. `APP_DEBUG` is disabled outside controlled development.
5. V1 remains record-only for financial events and performs no money movement.
6. Evaluation catalog data never becomes production-ready through a configuration toggle alone.
7. Protected evidence uses private storage and never a public filesystem path.
8. Queue-backed side effects do not run before the authoritative transaction commits.
9. Logs exclude OTP values, credentials, signed evidence links and protected payloads.
10. Configuration changes require deployment verification and rollback capability.

## 3. Verified environment surface

The current `.env.example` covers application identity/environment, UberTib safety modes, logging, database, sessions, broadcast, filesystem, queue, cache, mail, generic S3-compatible placeholders and frontend application name. It does not establish a production OTP/MFA, malware scanner, private-evidence, push-notification or payment vendor.

## 4. Application configuration

| Variable | Current example | Production rule |
|---|---|---|
| `APP_ENV` | `local` | Use an approved production environment value. |
| `APP_KEY` | empty | Required secret; never commit. |
| `APP_DEBUG` | `true` | Must be `false` in production. |
| `APP_URL` | local URL | Approved HTTPS deployment URL. |
| `APP_LOCALE` | `en` | Server fallback must not override Arabic-first product behavior. |
| `APP_FALLBACK_LOCALE` | `en` | Explicit safe fallback. |
| `BCRYPT_ROUNDS` | `12` | Security/performance tested value. |

Production client errors use the stable safe error contract; diagnostic detail belongs in protected operational logging.

## 5. UberTib safety switches

Verified `config/ubertib.php` exposes the catalog audience and record-only financial mode.

### 5.1 Catalog mode

`UBERTIB_CATALOG_MODE` supports the current evaluation/production audience boundary. Production must use production mode. If no clinically approved launch-ready definitions exist, production shows no ready catalog rather than exposing evaluation content.

This is an audience safety switch, not a mechanism for publishing or clinically approving data.

### 5.2 Financial mode

V1 requires `UBERTIB_FINANCIAL_MODE=record_only_non_funded`. Do not introduce feature flags that activate platform payments, wallet, escrow, settlement, payout, platform refunds or funded protection. Those are product-scope changes, not deployment configuration.

## 6. Database configuration

Local/test may use SQLite where appropriate. The current V1 production engine is MySQL because the approved availability/recovery baseline requires MySQL point-in-time recovery and current integrity behavior must also be verified against MySQL.

Relevant deployment variables include `DB_CONNECTION`, `DB_URL`, host/port/database/user/password/socket, charset/collation and TLS settings.

Production requirements:

- effective connection resolves to MySQL;
- documented foreign keys, transactions, locking, uniqueness and append-only constraints are preserved;
- Arabic data uses the approved Unicode-capable configuration;
- engine-sensitive triggers/constraints/concurrency are tested against MySQL;
- credentials use least privilege where the deployment supports separate runtime/migration principals;
- the concrete managed/self-hosted product, network placement, HA and PITR implementation remain `Q-OPS-001`.

## 7. Business policy must not live in `.env` or code constants

Do not create environment variables, PHP literals, Filament literals, React Native constants or production-truth seeder values for operationally changeable policy such as:

- service groups, patient-facing families or detailed procedures;
- names, descriptions, order, visibility or family/procedure mapping;
- `service_risk_level` or minimum/allowed scientific grade;
- credential, equipment, evidence, inclusion, exclusion, follow-up, completion or escalation requirements;
- provider actual price presentation modes;
- market observations, observation windows, sample/confidence thresholds or price-band boundaries;
- rejected spreadsheet A/B/C/D/F price multipliers;
- currency-normalization rates, source identity, effective periods or rounding rules;
- approved modifiers, material upgrades, third-party-cost categories or quantity rules;
- treatment-proposal validity periods;
- booking/cancellation/claim/refund/evidence deadlines;
- external financial method categories;
- S/P/H/I formulas or thresholds;
- retention periods.

These values require provenance, effective versions and—where applicable—clinical/commercial approval. Their canonical domain design is described in `docs/domain/CATALOG_PRICING_GOVERNANCE.md`, `docs/database/ERD.md` and the relevant policy/service-definition documents.

Three live code-level gaps remain in `app/Domain/Catalog/ServiceDefinitionPayload.php`: a positive-reference-price requirement, a pinned `SYP` currency literal and a pinned risk-tier literal set. They contradict the new governed-data direction and remain implementation work; this documentation change does not modify production code.

## 8. Cache

Cache is never authoritative for eligibility, booking capacity, accepted terms, financial-event history, claims or permissions. Booking confirmation re-reads authoritative state transactionally. Cache failure or clearing cannot destroy business state. Current framework driver availability does not select a production provider; concrete provider choice remains `Q-OPS-001`.

## 9. Queues

Queues may carry notification delivery, malware-scanning orchestration, scheduled eligibility reevaluation, retryable recalculation, claim/deadline checks, follow-up reminders, rebuildable projections and retention processing.

Current queue definitions commonly use `after_commit=false`; implementation must explicitly dispatch relevant side effects after commit or adopt a reviewed connection strategy. Jobs reload authoritative state, are retry-safe, avoid duplicate irreversible records and are observable when failed/aged. Concrete production queue topology is `Q-OPS-001`.

## 10. Sessions and privileged access

Production browser/Filament sessions use HTTPS, secure cookies, HttpOnly, intentional SameSite/domain scope and privileged authentication that satisfies the non-SMS second-factor requirement. The mobile API authentication transport is owned by the API contract and is not inferred from browser sessions.

## 11. Filesystem and evidence

Current development default is the private local disk. Protected evidence must:

- never use the public disk or `/storage` public links;
- use opaque object identity and integrity metadata;
- remain quarantined until required validation/scanning succeeds;
- be reauthorized for every protected download;
- use short-lived access when signed access is used;
- audit sensitive downloads;
- obey retention/legal-hold rules.

Generic S3-compatible environment variables in Laravel are framework capability only and do not select an UberTib vendor.

**Status:** `Q-PLATFORM-003` is Resolved for the provider-neutral interaction/session contract and its visible states. Concrete storage and malware-scanning vendor selection remains `Q-OPS-001`.

## 12. Mail, OTP, MFA and notifications

No concrete production email/SMS/push provider contract is approved. `MAIL_MAILER=log` is development behavior and must not be treated as successful production delivery.

OTP/MFA application requirements remain provider-neutral and are enforced by the application/security policy, not vendor environment variables. Provider credentials/endpoints may become deployment secrets after approval. Do not invent vendor-specific settings before selection.

Concrete OTP/MFA and notification-delivery vendor selection is `Q-OPS-001`; it does not reopen resolved `Q-PLATFORM-003`. Notification delivery never becomes authoritative business state: a delivery failure creates retry/operational visibility rather than reverting a committed domain action.

## 13. Evidence-transfer and scanning states

The provider-neutral evidence-transfer interaction contract is already fixed by `PO-UX-17` and is not blocked by vendor selection. The user-visible/session states are:

- `SELECTED`
- `UPLOADING`
- `PAUSED`
- `FAILED_RETRYABLE`
- `UPLOADED`
- `VALIDATING_SCANNING`
- `ACCEPTED`
- `REJECTED`

A missing scanner in production keeps affected evidence quarantined; it never converts failure into acceptance. Concrete scanner endpoint/credentials are configured only after a vendor is approved under `Q-OPS-001`.

## 14. Logging and monitoring

Production logs must not contain OTP values, passwords, credentials, auth tokens, private signed links, evidence contents or unrestricted protected clinical/financial/identity payloads. Sensitive audit events belong in the governed audit model, not merely logs. Log aggregation and APM/monitoring vendor selection remain `Q-OPS-001`.

## 15. Broadcasting

Current framework broadcasting support does not establish a production real-time provider requirement. Any future real-time delivery remains a delivery mechanism, never authoritative business state, and requires explicit architecture/infrastructure approval.

## 16. Production profile

A production deployment must establish these properties without committing credentials:

```text
APP_ENV=<production>
APP_KEY=<injected secret>
APP_DEBUG=false
APP_URL=https://<approved host>
UBERTIB_CATALOG_MODE=production
UBERTIB_FINANCIAL_MODE=record_only_non_funded
DB_CONNECTION=mysql
SESSION_SECURE_COOKIE=true
FILESYSTEM_DISK=<approved private-capable implementation>
QUEUE_CONNECTION=<approved production backend>
CACHE_STORE=<approved production backend>
MAIL_MAILER=<approved provider only when configured>
LOG_CHANNEL=<approved operational channel>
```

The exact hosts, credentials and vendors remain `Q-OPS-001`.

## 17. Local/evaluation profile

Local evaluation may use the existing development-oriented defaults such as evaluation catalog mode, record-only financial mode, SQLite, database session/queue/cache, local private filesystem and log mailer. Local mode does not waive authorization, idempotency, immutability, evidence or zero-money-movement rules.

## 18. Test expectations

Automated verification should cover:

- evaluation versus production catalog visibility;
- record-only financial mode;
- MySQL-specific integrity and concurrency behavior;
- queue-after-commit behavior;
- cache staleness cannot bypass booking revalidation;
- session/auth scope and privileged MFA behavior;
- private evidence never uses a public disk;
- provider-neutral evidence session transitions including retryable failure versus rejection;
- logging/error output does not leak protected values.

## 19. Deployment validation

A production release fails or remains not-ready when safety-critical conditions are violated, including missing `APP_KEY`, debug enabled, wrong financial/catalog mode, non-MySQL production connection, unavailable required MySQL recovery capability, public evidence fallback or mandatory malware scanning being bypassed.

Queue/notification/cache degradation is handled according to documented fail-safe behavior and observable retry; it must not silently rewrite authoritative business state.

## 20. Change management and secrets

Production runtime changes are recorded, checked against product-policy ownership, applied through deployment secret/config management, smoke tested, monitored and rolled back when safety/correctness checks fail. Configuration caching must be rebuilt through the verified deployment process after environment changes.

Secrets include application/database credentials, cache/queue credentials when present, mail/OTP/MFA credentials, object-storage keys, malware-scanner credentials, signed/private evidence URLs and API/authentication tokens.

## 21. Runtime configuration vs versioned policy

| Concern | Runtime configuration? | Owner |
|---|---|---|
| App environment, URL, secrets, debug | Yes | Deployment |
| Production database engine | Yes; MySQL in current baseline | NFR + deployment |
| Hosting, MySQL product/topology, cache/queue/storage/log vendors | Yes | `Q-OPS-001` |
| Catalog evaluation/production audience switch | Yes | release configuration |
| V1 record-only financial mode | Yes; invariant switch | domain + release configuration |
| Service families/procedures/mapping/visibility | No | governed catalog data |
| Clinical procedure definitions and risk/grade/evidence requirements | No | versioned clinical data + clinical approval |
| Provider actual prices and price display mode | No | effective price facts/commercial data |
| Market observations and P price-band calibration | No | market observations + versioned policy |
| Currency normalization and rounding | No | versioned currency policy |
| Treatment proposal validity | No | versioned policy |
| Modifiers/upgrades/third-party cost/quantity rules | No | governed commercial options |
| S/P/H/I rules | No | versioned governed policy |
| Booking/claims/refund deadlines | No | versioned policy/snapshot |
| Retention periods | No | legal/compliance policy (`Q-PLATFORM-002`) |
| Payment/wallet/escrow activation | Forbidden in V1 | product scope, not feature flag |

## 22. Known gaps / open dependencies

- `Q-PLATFORM-001` — readable authoritative SRS v1.1 remains required for a claim of complete source reconciliation.
- `Q-PLATFORM-002` — final retention/deletion periods require legal/compliance validation.
- `Q-OPS-001` — production hosting/deployment topology and concrete MySQL service/HA/PITR, cache, queue, storage, malware-scanning, OTP/MFA, notification and monitoring vendors remain unresolved.
- `Q-PLATFORM-003` — **Resolved** by `PO-UX-17`; the provider-neutral evidence-transfer interaction contract is fixed. It is not a current open dependency.
- Current `.env.example` remains development-oriented and must not be deployed unchanged.
- The three `ServiceDefinitionPayload.php` hard-codings listed in section 7 remain implementation gaps.
- Current queue connection defaults require deliberate after-commit handling.
- Mobile API authentication transport is not inferred from Laravel browser-session configuration.

No new canonical IDs are allocated by this document.
