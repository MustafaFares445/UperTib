# UberTib Patient UI Preview — Slice 7 External Refund Execution

Date: 2026-09-06

Branch: `feat/patient-slice7-refund-execution`

Base: `feat/patient-slice6-financial-actions`

Writable/product scope: `tools/patient-ui-preview/**` only. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice implements the next Patient financial surface after external payment reporting and counterparty response:

- `SCR-FINANCE-005` — Report refund execution
- the existing state-aware action on `SCR-FINANCE-002` — Financial timeline
- `FLOW-FINANCE-006` — Report an externally executed approved refund
- subsequent confirmation/dispute continues to use the already implemented `FLOW-FINANCE-004` / `SCR-FINANCE-004` contract rather than inventing a second response model

Primary authority remains the repository documentation chain, especially:

1. `.spec/decisions/`
2. `docs/ux/PHASE_05_HANDOFF.md`
3. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
4. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_02.md`
5. `docs/ux/01-foundation/USER_FLOWS.md`
6. `docs/ux/01-foundation/INFORMATION_ARCHITECTURE.md`
7. `docs/api/API_CONTRACTS.md`
8. `docs/ux/03-system/CONTENT_GUIDE_ERRORS.md`
9. `.claude/skills/patient-ui-preview/SKILL.md`

## Why this is a record surface, not a refund surface

The canonical flow separates three meanings:

1. refund entitlement / claim outcome;
2. approved refund decision;
3. execution by the parties outside UberTib.

`SCR-FINANCE-005` records only the third meaning after an approved decision exists. UberTib V1 does not execute the refund, transfer the money, hold the money, or settle the parties.

The Patient-facing composition therefore says before the action that:

- an approved decision is a prerequisite;
- the exact approved amount and currency govern the execution assertion;
- the Patient is reporting what happened externally;
- the resulting event remains `REPORTED_UNCONFIRMED` until the counterparty responds.

## SCR-FINANCE-005 — Report refund execution

Implemented in:

`src/screens/ReportRefundExecutionScreen.tsx`

The screen follows the canonical hierarchy:

1. approved refund decision context;
2. required assertion input;
3. validation and consequence;
4. record action.

### Approved decision context

Before entering or committing the execution record, the Patient sees:

- the approved decision source;
- approval time;
- exact approved amount;
- exact approved currency;
- a concise explanation that execution still occurs outside UberTib.

A missing approved decision removes the record action structurally. The screen does not present an empty form that would later fail after submission.

### Exact amount and currency

The form carries:

- execution amount;
- execution currency;
- external occurrence time.

The amount and currency must match the approved decision exactly. A mismatch is treated as a record-validation problem, never as:

- a failed refund;
- a rejected transfer;
- a partial refund performed by UberTib.

The mismatch recovery uses the canonical `ERR-FINANCE-001` Patient-visible message:

`لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة.`

The entered values remain visible for correction.

### Submitted state

A successful prototype submission becomes:

`REPORTED_UNCONFIRMED` → `مُبلَّغ عنه — غير مؤكَّد`

The copy explicitly says that the event waits for the other party to confirm or dispute its accuracy. No “refunded”, “completed payment”, wallet, settlement, or platform-transfer success language replaces that lifecycle state.

## Prototype projection integrity

`src/mocks/finance.ts` now defines:

- `ApprovedRefundDecisionProjection`
- `ExternalRefundExecutionDraft`
- a case-scoped approved-refund decision mock
- pre-existing evidence-reference mocks
- `appendPatientRefundExecution()`

The helper is prototype-only evidence for the documented API semantics. It is not a production backend implementation.

It enforces:

- the approved decision belongs to the same case as the ledger;
- amount matches exactly;
- currency matches exactly;
- occurrence time exists;
- one approved refund decision can own only one execution assertion;
- retries and changed duplicate attempts do not append a second execution against the same approved decision.

On a valid append, the event remains `REPORTED_UNCONFIRMED` and references its approved decision.

The derived preview position moves the amount from `pendingExternalExecution` to the externally reported/refund-recorded projection. This remains a derived record position, not a wallet balance.

## Evidence transfer boundary

`API-FINANCE-004` carries evidence references, while the binary transfer mechanism remains governed upstream by the existing evidence-transfer decision boundary.

This slice therefore does not add:

- a new upload library;
- a new financial attachment picker;
- a new file-transfer protocol;
- a parallel evidence lifecycle.

The preview can receive existing evidence IDs and show a concise read-only statement that an evidence reference is already linked. The actual transfer mechanism remains outside this slice.

## Financial timeline integration

`SCR-FINANCE-002` now exposes `تسجيل تنفيذ استرداد خارجي` only when the flow supplies an approved-refund-decision route.

It remains a **secondary** action.

The existing dominant-action rules stay intact:

- a pending counterparty response remains the primary action;
- otherwise external-payment reporting can remain primary;
- refund-execution reporting does not compete as a second primary action;
- accepted terms and case navigation remain supporting actions.

## Flow integration

The existing Patient care-reading prototype now supports:

`My cases → Case summary → Accepted financial terms → Financial timeline → Report refund execution → Financial timeline`

The flow keeps the approved decision, case, immutable terms snapshot, and financial ledger in one local prototype scope.

A submitted refund execution appears back in the append-only financial ledger as an external, unconfirmed assertion.

## Storybook coverage

Added `SCR-FINANCE-005` stories for:

- ready / exact decision match;
- missing occurrence time;
- decision amount/currency mismatch;
- submitting;
- submitted / unconfirmed;
- no approved refund decision.

Extended `SCR-FINANCE-002` with a refund-execution-available state.

## Playwright coverage

`playwright/slice7-refund-execution.spec.ts` verifies:

- Arabic RTL rendering;
- horizontal reflow safety;
- serious/critical Axe checks on the high-risk stories;
- approved amount and currency visible before action;
- no wallet, transfer, or “refund now” execution affordance;
- exact amount/currency mismatch blocks the action;
- mismatch never reads as a failed or partial platform refund;
- missing approved decision removes the record action;
- submitted state remains `REPORTED_UNCONFIRMED`;
- projection rejects amount/currency mismatches;
- projection prevents multiple execution assertions against the same approved decision;
- timeline keeps refund execution as a supporting action;
- the integrated Patient flow returns the appended refund-execution assertion to the ledger.

`playwright/capture-slice7.spec.ts` provides opt-in deterministic visual evidence with `CAPTURE=1`.

`package.json` promotes the Slice 7 suite into `test:smoke` and `verify` alongside the preceding Patient slices.

## Preserved V1 boundaries

This slice does **not**:

- execute a refund;
- collect or hold funds;
- transfer funds;
- settle funds;
- create a wallet or balance;
- create a payment/refund provider integration;
- turn an approved claim into proof that external execution already happened;
- treat an unconfirmed execution assertion as jointly confirmed fact;
- allow a different amount/currency to masquerade as partial execution;
- edit or delete financial history;
- invent a new evidence transfer mechanism;
- implement production API, auth, authorization, persistence, or server idempotency.

## Verification status

Pending the pull-request `Patient UI Preview` CI run. Update this section only from measured GitHub Actions evidence.
