# Research and Decisions

## Verified Project Context

- Laravel 13, PHP 8.4, Filament 5, Pest 4, Scramble, and the existing Spatie packages are used without adding a dependency.
- The first adapter is an anonymous read-only API; no protected approval write route exists yet.
- SQLite is the default automated test profile. The preserved `composer test:mysql` profile runs the same suite against a separately provisioned MySQL test database. A disposable local MySQL 8.4 database passed fresh migration, seeding, trigger, model-integrity, and catalog API verification on 2026-08-23.

## SRS Extraction

SRS page 10 names four groups and example terms within them:

- G01: surgery, periodontics, implants, and related examples.
- G02: fixed prosthodontics and aesthetic examples.
- G03: endodontics/root-canal examples.
- G04: general-dentistry examples.

The source explicitly implies a more detailed list within each group and does not define 26 stable production service identities. The implementation therefore treats the 26 records as a provisional evaluation decomposition of those examples. Product and licensed clinical reviewers must approve future service boundaries and full cards before publication.

## Decisions

### Evaluation isolation

The server configuration selects Evaluation or Production. Clients cannot override it. Evaluation mode is rejected in the production application environment.

### Complete service card

A production candidate requires schema version 1; Arabic purpose; approved clinical state; resolved risk tier; non-empty doctor, branch, evidence, follow-up, completion, and escalation rules; a positive integer-minor-unit SYP reference price with source; a product decision reference; and explicitly non-funded protection.

The production test card is a test fixture only. It is not seeded as medical or commercial policy.

### Clinical credential evidence

Medical approval is bound to an independently verified dentistry credential snapshot containing an issuing authority, registration hash, verification evidence reference, verification time, and expiry. Credential state changes are append-only snapshots; a successor revocation invalidates the prior verified snapshot.

### Append-only launch decisions

Each gate type has sequenced immutable decisions. Readiness uses the latest sequence, so Rejected, Revoked, or Expired decisions block publication without deleting history. Approved decisions are bound to the service-definition content hash.

### Version selection

The highest applicable active version is selected before readiness evaluation. If it is not ready, the service is excluded instead of searching older versions. Publication locks the service scope, requires a higher version, supersedes older active production definitions, and activates the candidate atomically.

### Non-financial boundary

`UBERTIB_FINANCIAL_MODE=record_only_non_funded` is mandatory. V1 rejects `protection.funded=true`; there is no payment, wallet, balance, settlement, or payout route.

## Remaining Governed Work

- Authenticate staff and authorize each accountable approval role.
- Implement the Filament evidence and decision workflow over the safe domain actions.
- Attach private evidence records and audit events to approvals.
- Obtain explicit product and licensed clinical approval for the production catalog and default values.
- Wire the preserved `composer test:mysql` profile into CI before deployment.
