# Feature Specification: Service Catalog and Launch Readiness

**Feature ID:** 001-service-catalog-launch-readiness  
**Status:** Evaluation catalog and service-publication core implemented and verified; governed staff UI/API remains partial  
**Date:** 2026-08-23  
**Requirements:** partial FR.12.2.1, partial FR.14.2.1, partial FR.13.1.1, NFR.03, NFR.09, NFR.11, NFR.13, NFR.14

## Objective

Provide the first production-shaped UberTib vertical slice: an Arabic-first dental catalog that exposes the SRS-derived provisional G01-G04 evaluation baseline while failing closed for real-patient production publication until a complete versioned service card and four evidence-bound approvals exist.

The SRS page 10 terms are examples, not an authoritative set of 26 permanent service identities. The current 26 codes are a product-owner-approved evaluation decomposition. Their names, boundaries, defaults, and future production status remain subject to explicit product and licensed clinical review.

## User Stories and Acceptance

### US1 - Browse the evaluation baseline

As a product evaluator, I can retrieve G01-G04 and the provisional example decomposition with useful Arabic purposes and explicit pending clinical state.

- Groups and provisional services are returned in stable display order.
- Each service has an Arabic name and non-diagnostic practical-purpose description.
- Every seeded definition is Evaluation, clinically Pending, non-funded, and not production-ready.
- Reseeding does not reactivate an entry disabled by operations.

### US2 - Fail-closed production publication

As a product owner, I need an incomplete, stale, or unverified service policy to remain invisible in production.

- Production excludes all evaluation definitions.
- The highest applicable production version is authoritative; an unready higher version never falls back to an older version.
- Publication requires a complete approved service-card payload and Medical, Legal, Operational, and Technical approval decisions bound to its SHA-256 content hash.
- Medical approval requires a current independently verified dentistry credential snapshot with evidence; a later revocation snapshot invalidates it.
- Every approval has an accountable role, actor, evidence reference, reason, decision time, and future expiry.

### US3 - Preserve audit and policy history

As an auditor, I need public identities, service cards, credentials, and gate decisions protected from silent rewriting.

- Group codes and service code/slug/group identity are immutable at both model and database-trigger boundaries.
- Activated definitions reject protected bulk updates and non-draft deletion.
- Gate decisions and credential snapshots are append-only.
- Publishing a higher production version supersedes the prior version in one transaction.
- The API exposes no database IDs, reviewer identity, decision reason, evidence location, credential data, or full clinical payload.

## Scope

Included:

- SRS-derived G01-G04 provisional evaluation baseline and 26 provisional records.
- Read-only `GET /api/v1/catalog/service-groups` with explicit resources, throttling, and bounded public cache headers.
- Complete-card validation, verified clinical credential snapshots, append-only readiness decisions, publication/supersession actions, and immutability controls.
- Server-only Evaluation versus Production mode; Evaluation is forbidden when `APP_ENV=production`.
- Explicit V1 `record_only_non_funded` financial mode.

Deferred:

- Authentication and staff authorization endpoints for issuing credentials or recording approvals.
- Filament approval/evidence workflow and private evidence bytes.
- Final clinical approval of each provisional service card, production reference prices, risk values, and service granularity.
- Provider/branch/geographic launch scopes, eligibility, booking, and mobile UI.
- Any payment execution, wallet, balance, settlement, payout, or platform-funded protection.

## Business Invariants

- The platform records external financial facts only and never moves money.
- Funded protection is forbidden in V1 in every definition state.
- No empty or `pending_clinical_review` card can become production-ready.
- All approvals refer to exactly one immutable definition hash.
- A credential assertion is not enough; medical approval needs a current verified dental credential snapshot.
- Revocation and reapproval add records; they never overwrite history.
