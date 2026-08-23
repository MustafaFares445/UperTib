# UberTib Agent Instructions

## Scope

These instructions apply to the whole `MustafaFares445/UperTib` repository. More specific instructions in nested directories take precedence for files under those directories. In particular, read and follow `UberTip-Backend/AGENTS.md` before changing anything inside `UberTip-Backend/`.

UberTib is currently an existing-repository project with a meaningful Laravel backend slice but not a complete implemented platform. Do not infer platform readiness from the service-catalog slice.

## Required Reading Order

Before architecture, implementation, testing, or canonical-documentation work, read the applicable sources in this order:

1. `.spec/decisions/` — explicit Product Owner decisions.
2. `Docs/UberTib_SRS_Etkan_v1.1.pdf` — authoritative UberTib SRS v1.1.
3. Approved `.spec/` requirements and traceability artifacts.
4. Current verified repository behavior.
5. `UberTip-Backend/specs/` feature specifications and contracts.
6. Other project documents.
7. Clearly marked engineering inference.

Product Owner decisions may clarify the SRS but must not silently replace or contradict it. If sources conflict, preserve the conflict using a `CONFLICT-*` record. If a required decision is missing, use `Q-*` or `ASM-*` as appropriate instead of inventing behavior.

## Canonical Documentation

The canonical engineering documentation lives under `docs/`. Use the owning document instead of redefining the same rule elsewhere:

- Business behavior and acceptance criteria: `docs/PRD.md`
- Technical design: `docs/SDD.md`
- API contracts: `docs/api/API_CONTRACTS.md`
- Stable API errors: `docs/api/ERROR_CATALOG.md`
- Database model: `docs/database/ERD.md`
- Data flows: `docs/database/DFD.md`
- State transitions: `docs/domain/STATE_MACHINES.md`
- Authorization: `docs/domain/PERMISSIONS_MATRIX.md`
- Integration contracts, when applicable: `docs/integrations/INTEGRATION_CONTRACTS.md`
- Testing: `docs/TESTING_STRATEGY.md`
- Implementation order: `docs/IMPLEMENTATION_PLAN.md`
- Coverage and status: `docs/TRACEABILITY_MATRIX.md`
- Domain registry, aliases, glossary, and reading order: `docs/README.md`

Reference canonical IDs rather than duplicating behavior in multiple files.

## Identifier Policy

Use domain-based append-only identifiers:

- `FR-DOMAIN-###` — Functional Requirement
- `BR-DOMAIN-###` — Business Rule
- `NFR-DOMAIN-###` — Non-Functional Requirement
- `DR-DOMAIN-###` — Derived Technical Requirement
- `TD-DOMAIN-###` — Technical Decision
- `ASM-DOMAIN-###` — Assumption
- `Q-DOMAIN-###` — Open Question
- `CONFLICT-DOMAIN-###` — Conflict
- `API-DOMAIN-###` — API Contract
- `TC-DOMAIN-###` — Test Case
- `TASK-DOMAIN-###` — Implementation Task
- `ERR-DOMAIN-###` — Stable Error

Existing dotted IDs such as `FR.01.1.1` and SRS IDs such as `FR-003` are source aliases. Never discard, silently rename, renumber, reuse, or repurpose an existing identifier. The authoritative registry belongs in `docs/README.md`.

## Requirement Quality Rules

Every confirmed `FR-*`, `BR-*`, and `NFR-*` must have a precise source.

Every `FR-*` must have testable Given/When/Then acceptance criteria.

Every `NFR-*` must define a metric, threshold, and measurement method.

Every confirmed `FR-*` and `BR-*` must eventually trace to applicable design, API/data/state artifacts, at least one happy-path test, at least one failure-path test, and an implementation task.

Do not mark an item `Covered` unless implementation and automated-test evidence genuinely exist. Distinguish `Implemented`, `Partially Implemented`, `Planned`, `Blocked`, and `Production Governance` work.

Blocked requirements must not be scheduled as confirmed implementation work.

## Domain Registry

Use these canonical ownership domains unless `docs/README.md` records an approved append-only change:

- `IDENTITY` — accounts, authentication, verification, guardianship/family access
- `CATALOG` — dental domains, service catalog, definitions, publication
- `ELIG` — eligibility, S/P/H/I, confidence, grade caps
- `BOOKING` — booking lifecycle, revalidation, cancellation/no-show, provider response
- `CLINICAL` — treatment plans, stages, evidence, follow-up, case timeline
- `FINANCE` — external financial-event records only
- `REVIEWS` — verified reviews and appeals
- `CLAIMS` — protection claims, evidence, human review, appeals
- `OPS` — operational queues, reporting, launch readiness
- `POLICY` — versioned policies/configuration and historical reproduction
- `AUDIT` — provenance, sensitive-decision audit, idempotency
- `PLATFORM` — cross-cutting performance, security, availability, accessibility, resilience, observability

A cross-domain requirement belongs to the domain that owns the behavior; cross-reference other domains instead of duplicating it.

## Medical and Clinical Safety Boundary

The initial operating scope is Aleppo with low thousands of expected users.

The 26 dental-service records are provisional evaluation records. They are not clinically approved production services and must never be presented as proof of production medical readiness.

S/P/H/I formulas, weights, thresholds, deadlines, defaults, and policy inputs must remain versioned and configurable. Provisional values are evaluation configuration, not permanent clinical truth.

Production medical behavior requires licensed clinical approval. When approval is missing, document the governance blocker; do not fabricate or promote clinical rules.

## Financial Boundary

V1 performs no electronic payment, wallet, escrow, settlement, custody, transfer, or money movement.

The system may record externally performed financial events, confirmations, disputes, refunds, evidence, and operational reviews. Do not model an external financial record as a platform-executed transaction.

Do not introduce payment-provider integrations unless a later authoritative decision explicitly changes this boundary.

## Backend Facts and Conventions

The current backend is under `UberTip-Backend/`. Its declared Composer constraints include PHP `^8.3`, Laravel `^13.17`, Filament `~5.0`, Pest `^4.7`, Spatie Permission `^8.3`, Activitylog `^5.0`, Media Library `^11.23`, and Laravel Data `^4.23`.

Verify installed versions before relying on version-specific APIs. Follow `UberTip-Backend/AGENTS.md` and applicable `.ai/rules` if present.

Verified Composer scripts include `composer lint`, `composer test:lint`, `composer test:types`, `composer test:type-coverage`, `composer test:coverage`, `composer test:unit`, `composer test:mysql`, and `composer test`. Do not claim a command was executed unless it actually was.

Preserve existing Laravel conventions and repository structure. Do not add dependencies, infrastructure, architectural patterns, or abstractions without a confirmed requirement or documented `TD-*` rationale.

## API and Error Rules

Treat feature specifications and OpenAPI files as contract evidence, not proof that routes are implemented. Verify current routes and behavior before marking coverage.

Use versioned REST conventions already established by the repository unless an authoritative requirement requires a change.

Stable client-relevant failures must receive `ERR-*` IDs and be documented in `docs/api/ERROR_CATALOG.md`, including HTTP status, machine code, condition, retryability, and where clients must surface the error.

## UI/UX Boundary

Engineering documentation may describe required capabilities, states, permissions, data, API behavior, and error surfaces, but must not invent wireframes, layouts, design tokens, Figma artifacts, component styling, or unimplemented navigation.

No business UI currently establishes authoritative screen behavior. Screen design and UX flows belong to the dedicated UX pipeline unless a later task explicitly changes scope.

## Current Documentation Run

For the engineering-documentation completion run defined by `prompts/ai_project_docs_generation_prompt_v4.md` and `prompts/ux_START_HERE.md`:

- Do not modify production application code.
- Preserve unrelated files.
- Produce one canonical file at a time.
- Do not begin `ux_00`, `ux_01`, or later UX phases.
- Do not lower testing or validation standards.
- Keep unresolved behavior as `ASM-*`, `Q-*`, or `CONFLICT-*` with severity.
- Run `docs/scripts/validate_docs.py` in the verification phase and correct mechanical failures before declaring documentation ready.
