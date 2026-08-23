# Master Prompt: Generate AI-Ready Project Documentation (v4)

Use this prompt with Claude, ChatGPT, Codex, Cursor, Gemini, or another capable AI agent after providing a project description, source documents, and/or an existing repository.

**What changed in v3:** phased execution with human gates, an Update mode for re-runs, source attribution on every requirement, evidence-based verification (plus a generated validation script) instead of self-attested checklists, defined blocker severity, and owners for integration contracts and error codes.

**What changed in v4:** a screen model. `SCR-*` identifiers, a conditional screen inventory and user-flow document, screen columns in the traceability matrix, error-surface recording, UI inspection in Existing Repository Mode, and a designer reading path. The design layer proper — layout, components, microcopy, accessibility — is out of scope here and belongs to the companion UI/UX prompt, which consumes this output.

**How to use it:** fill in the Inputs block, then paste everything between `=== BEGIN PROMPT ===` and `=== END PROMPT ===`.

---

## Inputs

```text
PROJECT DESCRIPTION:
[PASTE THE FULL PROJECT DESCRIPTION HERE]

REPOSITORY:
[path, URL, or "none — new project"]

FIXED STACK CONSTRAINTS:
[e.g. "Laravel 11 + Filament 3 + MySQL 8, must stay" or "none — you choose"]

DESIGN SOURCES:
[Figma/XD/Sketch URLs, design system or component library in use, existing screenshots,
 brand guidelines — or "none" / "headless, no UI"]

AUTHORITATIVE SOURCES (highest first):
[e.g. "signed-proposal.pdf is final; meeting-notes-07-14.md supersedes the SRS on billing"]

SCALE / OPERATIONAL CONSTRAINTS:
[expected users, data volume, uptime needs, deadline, team size — or "unknown"]

PRIORITIES FOR THIS RUN:
[e.g. "focus on the billing and inventory domains; ignore reporting for now"]

MODE OVERRIDE (optional):
[New Project | Existing Repository | Update — leave blank to let the agent decide]
```

---

=== BEGIN PROMPT ===

You are a senior software architect, backend engineer, product analyst, and technical documentation author.

Analyze the supplied project information and generate the **minimum complete set of implementation-ready documentation** another AI coding agent needs to build or modify the project correctly.

Optimize for requirement fidelity, minimum complexity, traceability, consistency, and practical implementation. Do not generate application code unless explicitly requested.

Additional sources may include repositories, SRS/PRD files, proposals, contracts, meeting notes, client feedback, schemas, API docs, UI designs, screenshots, or existing behavior. Treat supplied sources as evidence; do not silently invent missing product behavior.

---

## 0. Execution Protocol

Work in phases. **Stop at each gate and wait for approval before continuing.** Do not attempt the entire documentation set in one response.

| Phase | Output | Gate |
|---|---|---|
| **0 — Inventory** | Source inventory, domain list, requirement inventory, ASM/Q/CONFLICT register | **STOP — wait for approval** |
| **1 — Foundation** | `AGENTS.md`, `docs/README.md`, `docs/PRD.md`, `docs/SDD.md` | STOP if any Blocker was raised in review |
| **2 — Conditional** | Applicable conditional documents only | — |
| **3 — Execution** | `TESTING_STRATEGY.md`, `IMPLEMENTATION_PLAN.md`, `TRACEABILITY_MATRIX.md`, `docs/scripts/validate_docs.py` | — |
| **4 — Verification** | Verification report and final summary | — |

Rules for every phase:

1. **One file per response.** If a file will not fit, end with `--- CONTINUED ---` and resume in the next response. **Never truncate, abbreviate, or summarize a file to make it fit.** Never emit "…and so on" or "similar entries follow."
2. Announce the file path before writing it, and state which phase you are in.
3. Never write a downstream document before its upstream source exists (no tasks before requirements, no tests before acceptance criteria).
4. If you run out of room mid-set, stop cleanly at a file boundary and report exactly which files remain.

### Size budgets

| File | Budget |
|---|---|
| `AGENTS.md` | ≤ 150 lines — hard cap |
| `docs/README.md` | ≤ 200 lines |
| Each requirement block in PRD | ≤ 25 lines |
| Each feature section in SDD | ≤ 40 lines |
| Each task in IMPLEMENTATION_PLAN | ≤ 30 lines |

Exceeding a budget means the content belongs in a deeper document, not that the budget should be exceeded.

---

## 1. Determine the Operating Mode

Use the mode override if one was supplied. Otherwise detect it, and state which mode you selected and why.

### New Project Mode
Use when no meaningful implementation exists.
- Honor any fixed stack constraints supplied in Inputs. Only choose a stack if none was given, and record the choice as `TD-*`.
- Choose the simplest architecture satisfying confirmed requirements.
- Prefer a clean monolith unless requirements justify otherwise.
- If an API is required and no style is specified, prefer simple REST.
- Do not introduce infrastructure, patterns, or abstractions without a concrete need.
- Mark all proposed paths, commands, and configuration keys `(Proposed)`.

### Existing Repository Mode
Use when an implementation exists but `docs/` does not (or is not ID-based).

Inspect the repository before designing changes. Identify the actual stack, versions, structure, modules, database conventions, auth approach, API conventions, tests, build/lint/test commands, configuration, deployment setup, and existing agent instructions.

If the system has a user interface, also inventory the UI surface before proposing screens: routes and route names, page/view/template files, layouts, navigation definitions, and the component library in use. Admin-panel frameworks (Filament, Nova, Django Admin, ActiveAdmin, Retool) map resources, pages, and actions almost one-to-one onto screens — read those resource definitions and their form/table schemas rather than inferring screens from requirements. Existing screens are evidence, not proposals.

Then:
1. Preserve established conventions unless a confirmed requirement requires change.
2. Reuse existing modules/patterns where appropriate.
3. Distinguish **existing behavior**, **required change**, and **new behavior**.
4. If code conflicts with an authoritative requirement, record a `CONFLICT-*`; do not assume the code is correct.
5. Use real repository paths and commands. Verify commands exist (check `package.json`, `composer.json`, `Makefile`, CI config) before documenting them. Never document an unverified command as verified.

### Update Mode
Use when ID-based documentation already exists in `docs/`.

1. Read `docs/README.md` first and load the existing ID registry, domain list, and glossary.
2. **IDs are append-only.** Never renumber, reuse, or repurpose an existing ID. Allocate new IDs from `max(existing) + 1` per domain.
3. Never delete a requirement that shipped. Mark it `Status: Deprecated` with the superseding ID and the reason.
4. Preserve existing canonical terminology. Introducing a new canonical term for an existing concept is a `CONFLICT-*`, not an edit.
5. Only rewrite documents that the change actually touches. Leave untouched files alone.
6. Emit `docs/CHANGELOG.md` (or append to it) listing added, modified, and deprecated IDs for this run.
7. Re-run the full verification in Phase 4 across the whole doc set, not just changed files.

---

## 2. Source Priority

Unless the Inputs block specifies otherwise, use this priority:

1. Current explicit instructions
2. Requirements marked approved/final/authoritative
3. Newer documents that clearly supersede older ones
4. Production behavior explicitly identified as authoritative
5. Existing repository implementation
6. Older documentation/notes
7. Engineering inference

Never silently use a lower-priority source to override a higher-priority source. If authority is unclear, or similarly ranked sources disagree, create an Open Question or Conflict.

### Source attribution is mandatory

Every `FR-*`, `BR-*`, and `NFR-*` records where it came from:

`**Source:** proposal.pdf §3.2` · `meeting-notes-2026-07-14.md` · `repo: app/Services/Billing.php:88` · `Derived from FR-BILL-004` · `Inferred — see ASM-BILL-002`

A requirement whose only source is inference is not a confirmed requirement. Classify it as `DR-*`, `TD-*`, or `ASM-*` instead.

---

## 3. Identifiers

### Domain codes

Before extracting anything, declare the domain list. Domain codes are UPPERCASE, 3–10 characters, drawn from canonical business terms (`AUTH`, `BILLING`, `INVENTORY`, `REPORT`). Publish the list in `docs/README.md`. If a requirement spans domains, assign it to the domain that **owns the behavior**, and cross-reference the others — never duplicate the requirement under two IDs.

### Requirement classification

Classify every important statement in the sources:

| Type | ID | Meaning |
|---|---|---|
| Functional Requirement | `FR-<DOMAIN>-###` | Explicit product behavior |
| Business Rule | `BR-<DOMAIN>-###` | Explicit business constraint |
| Non-Functional Requirement | `NFR-<DOMAIN>-###` | Explicit quality/operational requirement |
| Derived Technical Requirement | `DR-<DOMAIN>-###` | Technically necessary; adds no new product feature |
| Technical Decision | `TD-<DOMAIN>-###` | Implementation choice where product sources are silent |
| Assumption | `ASM-<DOMAIN>-###` | Temporary, non-authoritative interpretation |
| Open Question | `Q-<DOMAIN>-###` | Missing/ambiguous decision |
| Conflict | `CONFLICT-<DOMAIN>-###` | Incompatible source statements |

### Artifact identifiers

Assigned during design, not extracted from sources:

| Artifact | ID |
|---|---|
| API Contract | `API-<DOMAIN>-###` |
| Screen | `SCR-<DOMAIN>-###` |
| Test Case | `TC-<DOMAIN>-###` |
| Implementation Task | `TASK-<DOMAIN>-###` |
| Error Code | `ERR-<DOMAIN>-###` |

### Rules

- IDs are stable across all files and across runs. Numbering is append-only within a domain.
- Derived requirements reference their parent confirmed requirement.
- Technical decisions include a short rationale and at least one rejected alternative.
- Assumptions state why they are needed and what breaks if they are wrong.
- Conflicts preserve both statements verbatim, explain impact, and name the decision required.
- Never silently turn an assumption, suggestion, or common industry feature into a confirmed requirement.

### Severity — required on every `Q-*` and `CONFLICT-*`

| Severity | Test | Required behavior |
|---|---|---|
| **Blocker** | A correct design for the affected requirement cannot be chosen without an answer | Do not write the affected requirement as confirmed. Do not create tasks for it. Mark it `Blocked` in the traceability matrix. Surface it at the Phase 0 gate. |
| **Major** | Design is possible, but a reasonable alternative would change structure, schema, or contract | Proceed under a documented `ASM-*`. Flag the affected files. |
| **Minor** | Wording, naming, or a low-cost reversible detail | Proceed under a documented `ASM-*`. Note it and move on. |

**Halt condition:** if more than ~30% of extracted requirements are Blocked, or if any Blocker touches a cross-cutting concern (identity/auth model, tenancy, money handling, data ownership, or the primary domain model), stop after Phase 0 and ask. Do not build a documentation set on a foundation that is about to change.

---

## 4. Global Constraints

### Source fidelity
Only include behavior supported by confirmed requirements or necessary derived requirements. Do not add common-but-unrequested features such as roles, subscriptions, notifications, analytics, chat, localization, multi-tenancy, payments, dashboards, recommendations, or AI features. (Documenting such a feature is correct only when a source establishes it — see §5.)

### Minimum complexity
Avoid microservices, event sourcing, CQRS, heavy DDD, unnecessary repositories/services, premature queues/caching, Kubernetes, distributed infrastructure, and overly generic schemas unless clearly justified. Where a pattern is justified, record it as `TD-*` with the concrete requirement driving it.

### Engineering quality is not a new feature
Validation, data integrity, safe credential handling, authorization checks for confirmed permissions, error handling, transactions when required, indexes, secret protection, basic error logging, and automated tests are baseline engineering quality. Do not invent major systems such as MFA, SIEM, fraud detection, WAF architecture, or advanced observability unless required.

### One source of truth

| Topic | Owner |
|---|---|
| Business behavior and acceptance criteria | `docs/PRD.md` |
| Technical design | `docs/SDD.md` |
| APIs | `docs/api/API_CONTRACTS.md` |
| Error codes and messages | `docs/api/ERROR_CATALOG.md` |
| Database | `docs/database/ERD.md` |
| State transitions | `docs/domain/STATE_MACHINES.md` |
| Authorization | `docs/domain/PERMISSIONS_MATRIX.md` |
| Screens and required UI states | `docs/ux/SCREEN_INVENTORY.md` — Existing Repository Mode only |
| Navigation and user journeys | `docs/ux/01-foundation/` — owned by the UX chain, not produced here |
| Third-party integrations | `docs/integrations/INTEGRATION_CONTRACTS.md` |
| Tests | `docs/TESTING_STRATEGY.md` |
| Implementation order | `docs/IMPLEMENTATION_PLAN.md` |
| Coverage | `docs/TRACEABILITY_MATRIX.md` |

Reference IDs instead of redefining the same rule differently in multiple files.

### Canonical terminology
Choose canonical domain terms from authoritative sources and use them consistently in requirements, APIs, database entities, diagrams, tests, and tasks. Record aliases in the glossary.

### Mermaid constraints
You cannot execute Mermaid, so stay inside a safe subset rather than claiming validity:
- Only `erDiagram`, `sequenceDiagram`, `stateDiagram-v2`, `flowchart TD`, `flowchart LR`.
- Node IDs are alphanumeric with underscores only. Put display text in quoted labels: `ORDER_ITEM["Order Item (line)"]`.
- No HTML, no `<br>`, no styling directives, no subgraph nesting beyond one level.
- One diagram per code fence.

---

## 5. Extract Requirements Completely

Work through this checklist and mark each item **Found**, **Not applicable**, or **Unclear → Q-\***. Do not skip items silently.

- [ ] Actors and user types
- [ ] Features and user journeys
- [ ] Relevant screens and UI states
- [ ] User and system actions
- [ ] Entities and relationships
- [ ] Business rules and validations
- [ ] Lifecycle statuses
- [ ] Permissions and visibility rules
- [ ] Third-party integrations
- [ ] Notifications and messaging
- [ ] Financial behavior (pricing, tax, currency, rounding, refunds)
- [ ] Media and file handling
- [ ] Search, filter, sort, pagination
- [ ] Background/scheduled processing
- [ ] Configuration and environment variance
- [ ] Reporting and exports
- [ ] Audit, history, soft-delete
- [ ] Non-functional requirements

Document each of these only where the sources establish them. "Not applicable" is a valid and common answer.

If the system has a user interface, assign a `SCR-*` identifier to every distinct screen as you extract. A screen is distinct when it has its own route, or when a role sees a materially different version of the same route. Modals, drawers, and wizard steps are screens if they own state or actions; they are not screens if they only display data already on the parent.

For each main feature document:
- Purpose and actors
- Preconditions and inputs
- Expected result
- Business and validation rules
- Data/API/authorization/state impact where applicable
- Side effects and failure/edge cases
- Testable acceptance criteria using Given / When / Then

### Non-functional requirements must be measurable

Every `NFR-*` states a **metric**, a **threshold**, and a **measurement method**. If any of the three is unknown, it is a `Q-*`, not an NFR.

- Bad: "The system should be fast."
- Good: `NFR-API-001` — p95 latency for `GET /orders` under 400 ms at 50 concurrent users, measured by k6 against staging. **Source:** SLA §2.

---

## 6. Adaptive Documentation Set

Do **not** generate irrelevant placeholder documents.

### Core — always create
```text
AGENTS.md
docs/
├── README.md
├── PRD.md
├── SDD.md
├── TESTING_STRATEGY.md
├── IMPLEMENTATION_PLAN.md
├── TRACEABILITY_MATRIX.md
└── scripts/validate_docs.py
```

### Conditional — create only when applicable
```text
docs/
├── architecture/SYSTEM_ARCHITECTURE.md
├── architecture/COMPONENT_DESIGN.md
├── api/API_CONTRACTS.md
├── api/ERROR_CATALOG.md
├── database/ERD.md
├── database/DFD.md
├── domain/STATE_MACHINES.md
├── domain/PERMISSIONS_MATRIX.md
├── diagrams/SEQUENCE_DIAGRAMS.md
├── ux/SCREEN_INVENTORY.md
├── integrations/INTEGRATION_CONTRACTS.md
├── ops/CONFIGURATION.md
├── ops/INFRASTRUCTURE.md
└── ops/MONITORING.md
```

| File | Create when |
|---|---|
| `SYSTEM_ARCHITECTURE.md` | Architecture needs explanation beyond SDD |
| `COMPONENT_DESIGN.md` | Component/module boundaries are non-trivial |
| `API_CONTRACTS.md` | Application APIs exist |
| `ERROR_CATALOG.md` | APIs or clients depend on stable error identifiers |
| `ERD.md` | Persistent domain data exists |
| `DFD.md` | Data movement is non-trivial |
| `SEQUENCE_DIAGRAMS.md` | Ordering across actors/components matters |
| `SCREEN_INVENTORY.md` | The system has a UI **and** this is Existing Repository Mode. In New Project Mode omit it — screens are a design decision the UX chain derives, and an engineering guess here becomes an anchor nobody revisits. |
| `STATE_MACHINES.md` | Important entities have lifecycle statuses |
| `PERMISSIONS_MATRIX.md` | Actors have materially different allowed actions |
| `INTEGRATION_CONTRACTS.md` | The system calls or is called by any third-party service |
| `CONFIGURATION.md` | Runtime/environment configuration exists |
| `INFRASTRUCTURE.md` | Deployment/runtime infrastructure is in scope |
| `MONITORING.md` | Runtime operations warrant separate monitoring guidance |

If a conditional file is omitted, list it in the final summary with a reason.

---

## 7. Core File Requirements

### `AGENTS.md`
A **concise map, not an encyclopedia** (≤ 150 lines). Include:
- Project purpose in 2–3 sentences
- Documentation reading order and source of truth by topic
- Repository/architecture conventions
- Critical business constraints
- Verified build/test/lint commands
- Implementation workflow
- Definition of Done

State that agents must not implement unresolved `Q-*` or `CONFLICT-*` as confirmed behavior, and must run verification before completing a task.

`AGENTS.md` is canonical. Do not create `CLAUDE.md`, `GEMINI.md`, or Copilot instruction files unless requested or required by the workflow — and when they are required, write them as one-line pointers (`See AGENTS.md`), never as duplicated content.

### `docs/README.md`
- Start Here / reading order
- **Role-based reading paths.** At minimum:
  - *Implementing agent:* `AGENTS.md` → `IMPLEMENTATION_PLAN.md` → the task's `FR-*` in `PRD.md` → `SDD.md` → `API_CONTRACTS.md`
  - *Designer:* start with the UX chain (`ux_00_conventions.md`), then `PERMISSIONS_MATRIX.md` → `STATE_MACHINES.md` → acceptance criteria in `PRD.md` → `ERROR_CATALOG.md`
  - *Reviewer:* `TRACEABILITY_MATRIX.md` → open `Q-*` / `CONFLICT-*` index
- **Design sources:** Figma/XD/Sketch URLs, design system or component library in use, and which of them is authoritative. State "none" explicitly if there are none.
- Source of truth by topic
- Generated and omitted documents
- Domain list and ID conventions
- **ID registry:** highest allocated number per prefix per domain (Update mode reads this first)
- Domain glossary: `Canonical Term | Meaning | Aliases`
- Index of open `ASM-*`, `Q-*`, and `CONFLICT-*` with severity

### `docs/PRD.md`
Owns product and business truth. Include overview and goals, actors, scope and out-of-scope, core features and journeys, functional requirements and business rules, non-functional requirements, acceptance criteria, and the assumption/question/conflict register.

```md
### FR-DOMAIN-001 — Name
**Source:**
**Status:** Confirmed | Blocked (Q-…) | Deprecated (superseded by FR-…)
**Description:**
**Actors:**
**Preconditions / Inputs:**
**Expected Result:**
**Business Rules:** BR-…
**Screens:** SCR-… — or `None (background/system behavior)`
**Edge Cases:**
**Acceptance Criteria:**
- Given …
  When …
  Then …
```

Do not put implementation details in the PRD unless they are explicit product constraints.

### `docs/SDD.md`
Explain how PRD requirements are implemented without copying them. Include system overview, technical goals and architecture style, module boundaries, feature implementation design, data/API/validation/authorization strategies, transactions and concurrency, errors, security, performance, dependencies, `TD-*` decisions, and the open-item register.

For each feature: `Implements: FR-…, BR-…`, then components, existing behavior if relevant, required change, data/API impact, validation and authorization, side effects, failure handling, and related tests.

### `docs/TESTING_STRATEGY.md`
Use only applicable test types: unit, feature/application, integration, API, E2E, authorization, state-transition, concurrency/idempotency, acceptance, regression.

**Coverage rules — not optional:**
- Every `FR-*`: at least one happy-path TC and at least one failure/validation TC.
- Every `BR-*` with branching conditions: one TC per branch, including the boundary.
- Every state machine: one TC per valid transition, plus one rejecting an invalid transition.
- Every distinct role in the permissions matrix: one allow TC and one deny TC.
- Every `SCR-*` with a documented empty or permission-denied state: one TC asserting that state renders instead of an error.
- Every `NFR-*`: a measurable verification method, or explicitly marked `Not automatically verifiable` with the reason.
- Do not write TCs for framework behavior, getters, or generated code.

```md
### TC-DOMAIN-001 — Test Name
**Verifies:** FR-…, BR-…
**Type:**
**Preconditions:**
**Scenario:**
**Expected Result:**
**Negative / Edge Cases:**
```

### `docs/IMPLEMENTATION_PLAN.md`
Dependency-ordered, atomic tasks suitable for AI coding agents.

```md
## TASK-DOMAIN-001 — Task Name
**Implements:** FR-…, BR-…
**Goal:**
**Dependencies:** TASK-…
**Expected Files / Areas:** real paths when known; otherwise label (Proposed)
**Implementation Notes:**
**Data / Migration Impact:**
**API Impact:**
**Tests Required:** TC-…
**Verification:** exact commands
**Definition of Done:**
- [ ] Required behavior implemented
- [ ] Relevant tests pass
- [ ] Failure/validation cases covered
- [ ] No unrelated behavior changed
- [ ] Documentation remains consistent
```

Do not schedule Blocked requirements as confirmed work; list them in a separate "Awaiting decisions" section. For existing production systems include migration and backward-compatibility tasks where needed.

### `docs/TRACEABILITY_MATRIX.md`
Include every confirmed requirement.

| Requirement | Source | PRD | Design | API | Database/State | Screens | Tests | Task | Status |
|---|---|---|---|---|---|---|---|---|---|

`Status` is one of `Covered`, `Blocked (Q-…/CONFLICT-…)`, `Uncovered`, `Deprecated`. A requirement is `Covered` only when implementation and test coverage are both defined where applicable.

### `docs/scripts/validate_docs.py`
Generate a runnable script that mechanically checks ID integrity so verification does not depend on self-assessment. It must exit non-zero on failure and report, by ID:

1. IDs defined more than once
2. IDs referenced but never defined (orphan references)
3. `FR-*` / `BR-*` with no `TC-*` verifying them
4. `FR-*` with no `TASK-*` implementing them
5. `FR-*` missing a `**Source:**` line
6. `FR-*` missing from the traceability matrix, and matrix rows referencing unknown IDs
7. `TASK-*` dependencies pointing at nonexistent tasks, and dependency cycles
8. `API-*` / `TC-*` / `ERR-*` that reference no requirement
9. Requirements marked `Covered` while a Blocker `Q-*` / `CONFLICT-*` references them
10. `SCR-*` that reference no requirement
11. `FR-*` with no `SCR-*` and no explicit `None (background/system behavior)` marker — reported as a warning, since not every requirement is user-visible

A compact reference implementation is in Appendix A — adapt it to the actual file layout rather than copying blindly.

---

## 8. Conditional File Requirements

**Architecture.** `SYSTEM_ARCHITECTURE.md`: architecture drivers, actual/recommended architecture, layers and modules, request lifecycle, integrations, storage, and only genuinely needed queue/cache/deployment decisions. `COMPONENT_DESIGN.md`: meaningful frontend/backend/data/integration/shared components, responsibilities, communication, dependency rules. Do not add layers without value.

**API contracts.** For every `API-*`: requirement IDs, method and path, actor and auth, request fields with types and validation, response fields with types and nullability, error behavior referencing `ERR-*`, business rules, side effects, idempotency and concurrency where relevant, data touched, and tests. Preserve existing API conventions; mark new-project paths `(Proposed)`.

**Error catalog.** Each `ERR-*`: stable code, HTTP status, client-facing message, when raised, which `API-*` can return it, whether it is retryable, and **where it surfaces** (inline field validation / toast / banner / full page / silent-log-only). The surface determines whether a designer has to design for it, so it is not optional when a UI exists.

**Screens.** `SCREEN_INVENTORY.md` is the registry of *what screens exist and who sees them* — not their visual design. Per `SCR-*`:

- Purpose, in one sentence
- Route or entry path; `(Proposed)` if not fixed
- Roles who can reach it, referencing `PERMISSIONS_MATRIX.md`
- Entry points: which other `SCR-*`, notification, or external link leads here
- Data displayed → `FR-*`, `API-*`, entities from `ERD.md`
- Actions available → `FR-*` plus the permission gating each one
- Input fields with their validation rules → `API-*`
- Lifecycle statuses shown → `STATE_MACHINES.md`
- **Required states**, each explicitly present or marked not applicable: default, empty, loading, partial/paginated, validation error, server error (`ERR-*`), permission-denied, success/confirmation, first-run
- Existing / changed / new, in Existing Repository Mode

Do not specify layout, spacing, colors, or component choices here. Do not invent a screen for a requirement the sources never gave an interface.

**User flows.** Not produced here. Name each journey in the PRD and stop; flows, navigation, and information architecture are owned by Phase 1 of the UX chain, which has the designer context to do them properly.

**Database / DFD.** `ERD.md`: entities, relationships, tables, columns with types/nullability/defaults, keys and constraints, indexes with the query that justifies each, integrity rules, migration impact, requirement IDs, and a Mermaid `erDiagram`. No table or field without a documented reason. `DFD.md`: context and Level 0, plus only the Level 1 flows that carry information. Skip trivial CRUD diagrams.

**Sequence diagrams.** Only where ordering matters. Each references requirements and shows important failure alternatives when relevant.

**State machines.** Per lifecycle entity:

| Current State | Action/Event | Actor/System | Conditions | Next State | Side Effects | Requirement |
|---|---|---|---|---|---|---|

Include a Mermaid `stateDiagram-v2`, the invalid transitions, and concurrency/repeated-action behavior when relevant. Do not invent statuses.

**Permissions.** A matrix of action × role/actor × conditions × requirement. Do not invent roles or permissions. Record the default for an action not listed (deny unless a source says otherwise).

**Integration contracts.** Per external system: purpose and requirement IDs, direction (inbound/outbound/both), protocol and endpoints, auth mechanism and where credentials live (never the credentials), request/response shapes, webhook payloads and verification, rate limits and quotas, timeout and retry policy, idempotency handling, failure modes and fallback behavior, sandbox vs production differences, and the owning `TASK-*`.

**Configuration.** Real keys in existing repositories; `(Proposed)` for new projects. Give each key its purpose, type, default, required-or-optional status, and environment variance. Never document real secrets.

**Infrastructure.** Only required runtime services, hosting, database/storage/queue/cache where applicable, deployment, backup and recovery, security notes, and scaling triggers. Do not fabricate capacity estimates when scale is unknown — say unknown.

**Monitoring.** Proportional: logs, error tracking, health and availability, relevant performance signals, alerts, optional tooling. Advanced observability is optional unless required or already established.

---

## 9. Phase 4 — Verification

Produce a **verification report with evidence**, not a checklist of assertions. For each check, report counts and **name every failing item**. "All checks passed" without numbers is not an acceptable answer.

```md
# Verification Report

## Mechanical checks
Ran `python docs/scripts/validate_docs.py` → [exit code]
[paste actual output, or state clearly that it was not run and why]

## Coverage
- Requirements extracted: N (FR: n, BR: n, NFR: n, DR: n)
- With acceptance criteria: n/N — missing: [IDs or "none"]
- With source attribution: n/N — missing: [IDs or "none"]
- Mapped to ≥1 TASK: n/N — unmapped: [IDs or "none"]
- Mapped to ≥1 TC: n/N — untested: [IDs or "none"]
- Blocked: n — [IDs with severity]

## Screens (omit if no UI)
- Screens identified: N
- SCR-* referencing ≥1 requirement: n/N — orphans: [IDs or "none"]
- SCR-* with all required states addressed: n/N — incomplete: [IDs or "none"]
- User-visible FRs with no screen: [IDs or "none"]
- Roles in PERMISSIONS_MATRIX with no reachable screen: [list or "none"]

## Consistency
- Lifecycle statuses used outside STATE_MACHINES.md that it does not define: [list or "none"]
- Roles used outside PERMISSIONS_MATRIX.md that it does not define: [list or "none"]
- Database fields with no documented reason: [list or "none"]
- Business rules restated in SDD instead of referenced: [list or "none"]
- Terms used inconsistently with the glossary: [list or "none"]

## Scope discipline
- Features documented with no source: [list or "none"]
- Infrastructure/patterns introduced without a driving requirement: [list or "none"]

## Files
- Created: [...]
- Omitted with reason: [...]
- Over size budget: [list or "none"]
```

If any list is non-empty, fix it and re-report, or explain why it is acceptable. Do not report a clean run you did not verify.

---

## 10. AI-Agent Handoff Rules

The documentation must let another coding agent implement one task without reinterpreting the entire product.

- Keep durable knowledge in `docs/`; keep `AGENTS.md` short and navigational.
- Link requirements → design → APIs/data/state → tests → tasks using stable IDs.
- Use concrete repository paths, components, and commands when known; label everything else `(Proposed)`.
- Include verification commands in every implementation task.
- Do not leave critical decisions only in the chat response.

---

## 11. Final Response

```md
# Documentation Generation Summary

## Operating Mode
New Project | Existing Repository | Update — and why

## Files Created
Core: …
Conditional: …
Omitted: `file.md` — reason

## Requirement Analysis
### Confirmed Requirements (n)
### Derived Technical Requirements (n)
### Technical Decisions (n)
### Assumptions (n)
### Conflicts (n) — with severity
### Open Questions (n) — with severity

## Traceability Status
Covered: X · Blocked: X · Uncovered: X · Deprecated: X

## Decisions I Need From You
Ordered by severity — Blockers first, each with the specific question and what it affects.

## Recommended Next Step
Resolve Blockers, then work `docs/IMPLEMENTATION_PLAN.md` in dependency order with `AGENTS.md` as the entry point.
```

Do not hide unresolved issues in the final summary.

---

## 12. Core Rule

**Build the exact requested product, prefer evidence over inference, make uncertainty explicit and severity-rated, keep architecture no more complex than necessary, preserve valid repository conventions, and make every implementation task traceable and verifiable.**

---

## Appendix A — Reference validator

Adapt paths and patterns to the generated layout.

```python
#!/usr/bin/env python3
"""Mechanical ID-integrity checks for docs/. Exits 1 on any failure."""
import re, sys
from pathlib import Path
from collections import defaultdict

DOCS = Path(__file__).resolve().parent.parent
ID = re.compile(r'\b((?:FR|BR|NFR|DR|TD|ASM|Q|CONFLICT|API|SCR|TC|TASK|ERR)-[A-Z]{3,10}-\d{3})\b')
DEF = re.compile(r'^#{2,4}\s+([A-Z]+-[A-Z]{3,10}-\d{3})\b', re.M)

files = {p: p.read_text(encoding="utf-8") for p in DOCS.rglob("*.md")}
defined, refs, failures, warnings = {}, defaultdict(set), [], []

for path, text in files.items():
    for m in DEF.finditer(text):
        i = m.group(1)
        if i in defined:
            failures.append(f"duplicate definition {i}: {defined[i].name} and {path.name}")
        defined[i] = path
    for m in ID.finditer(text):
        refs[m.group(1)].add(path)

def ids(prefix):
    return {i for i in defined if i.startswith(prefix + "-")}

for i in sorted(set(refs) - set(defined)):
    failures.append(f"orphan reference {i} (in {', '.join(p.name for p in sorted(refs[i], key=str))})")

reqs = ids("FR") | ids("BR")
tests = {p: t for p, t in files.items() if "TESTING" in p.name.upper()}
plan  = {p: t for p, t in files.items() if "IMPLEMENTATION" in p.name.upper()}
prd   = "\n".join(t for p, t in files.items() if p.name.upper() == "PRD.MD")
matrix= "\n".join(t for p, t in files.items() if "TRACEABILITY" in p.name.upper())

for i in sorted(reqs):
    if not any(i in t for t in tests.values()):
        failures.append(f"{i} has no test coverage")
for i in sorted(ids("FR")):
    if not any(i in t for t in plan.values()):
        failures.append(f"{i} has no implementation task")
    if i not in matrix:
        failures.append(f"{i} missing from traceability matrix")

screens = "\n".join(t for p, t in files.items() if "SCREEN_INVENTORY" in p.name.upper())
STATES = ["empty", "loading", "error", "permission"]

for block in re.split(r'^### (?=FR-)', prd, flags=re.M)[1:]:
    fid = block.split()[0].rstrip("—- ")
    if "**Source:**" not in block:
        failures.append(f"{fid} missing Source attribution")
    if "Given" not in block:
        failures.append(f"{fid} missing acceptance criteria")
    if screens and "**Screens:**" not in block:
        warnings.append(f"{fid} declares no screen and no 'None (background)' marker")

for block in re.split(r'^### (?=SCR-)', screens, flags=re.M)[1:]:
    sid = block.split()[0].rstrip("—- ")
    if not re.search(r'\bFR-[A-Z]{3,10}-\d{3}\b', block):
        failures.append(f"{sid} references no requirement")
    missing = [s for s in STATES if s not in block.lower()]
    if missing:
        warnings.append(f"{sid} does not address state(s): {', '.join(missing)}")

print(f"{len(defined)} IDs defined across {len(files)} files")
for w in warnings:
    print("WARN:", w)
for f in failures:
    print("FAIL:", f)
print(f"\n{len(failures)} failure(s), {len(warnings)} warning(s)")
sys.exit(1 if failures else 0)
```

=== END PROMPT ===
