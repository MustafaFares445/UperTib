# Implementation Plan

## Delivered architecture

1. `GET /api/v1/catalog/service-groups` invokes a thin controller.
2. `ListVisibleServiceGroups` resolves server mode, captures one immutable evaluation time, retrieves the highest applicable version, and fails closed on readiness.
3. Explicit resources expose only stable public catalog fields.
4. `RecordServiceLaunchGateDecision` locks the definition and appends a validated, status-aware, hash-bound decision; `RecordServiceLaunchGateApproval` is its approval-specific façade.
5. `PublishServiceDefinition` locks the service scope, validates the complete candidate, supersedes older production versions, and activates the new version transactionally.
6. Model events and SQLite/MySQL triggers protect stable identities and append-only/immutable records from both instance and bulk writes.

## Seed baseline

- Four SRS-derived groups and 26 provisional evaluation records.
- Useful non-diagnostic Arabic purpose copy.
- Active Evaluation definition version 1 with pending clinical data and non-funded protection.
- One initial Pending gate decision per type.
- Idempotent reruns preserve explicit operational deactivation.

## Verification strategy

- Contract: full ordered code map, Arabic purpose, response keys, no sensitive fields, mode isolation, throttle and cache middleware.
- Safety: complete-card gate, verified credential, successor revocation, hash binding, stale/rejected decisions, funded-protection rejection.
- Integrity: model and bulk-write immutability, append-only history, stable public identity, supersession, no older-version fallback.
- Quality: Pint, Rector, Larastan maximum level, type coverage, line coverage, Pest, Composer validation/audit.
- Deployment gate: a disposable MySQL 8.4 database passed `migrate:fresh --seed` plus 48 focused persistence/API tests on 2026-08-23; preserve this profile in CI before production release.

## Next slice

Implement staff authentication/scoped roles, private approval evidence, auditable Filament decision workflows, and product/clinical sign-off records. Do not expose generic CRUD over credential, gate, or activated-definition tables.
