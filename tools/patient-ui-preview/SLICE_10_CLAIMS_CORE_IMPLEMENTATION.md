# Slice 10 — Claims Core Implementation

## Scope

Slice 10 is intentionally the **core Patient claims reading + refund-request slice**. It does not attempt to implement the entire claims domain in one pass.

Implemented canonical surfaces:

- `SCR-CLAIMS-001` — My claims
- `SCR-CLAIMS-002` — Refund request
- `SCR-CLAIMS-004` — Claim detail
- `FLOW-CLAIMS-001` — Patient refund request
- `WGT-CLAIMS-001` — Claim evidence and deadline panel, Patient variant

Deferred to the next Claims slice:

- `SCR-CLAIMS-003` protection-claim authoring and its entitlement/evidence-transfer path
- claim-decision appeal authoring
- any clinic/admin claims work

## Canonical decisions preserved

### Deadline-first claims list

`SCR-CLAIMS-001` renders the effective deadline directly in every row because a lapsed claims deadline is unrecoverable. Refund requests and protection claims remain visibly distinct. A filtered-empty list is not presented as a genuinely empty claims history.

### Refund request is governed by the accepted financial snapshot

`SCR-CLAIMS-002` reads from the accepted financial terms that govern the case. If that snapshot cannot be read, authoring is withheld rather than guessing from current configuration.

Ineligibility, an expired request window, and incomplete evidence have separate recovery states. A retryable submission failure preserves Patient input and reuses the same idempotency intent.

### External-money boundary at submission

The refund-request form states before commit that an approval would record an amount due for **external execution between the parties**. UberTib does not collect, hold, transfer, settle, pay, or execute the refund.

A successful prototype submission creates only a `SUBMITTED` claim. It does not create a payment, a settled event, an approved refund, or a platform balance.

### Claim detail is append-only history

`SCR-CLAIMS-004` keeps the decision inside the claim detail because `API-CLAIMS-004` returns it as part of that projection.

The Patient can read:

- claim type and state;
- governing accepted snapshot context;
- requested amount/narrative where applicable;
- original deadline;
- effective deadline;
- appended pause/extension events that moved the deadline;
- each Patient-visible evidence requirement and its reason;
- reasoned decision and accountable reviewer;
- external-execution status where an approved refund exists.

The original deadline is never overwritten by the effective deadline.

### Evidence states remain distinct

The Patient variant of `WGT-CLAIMS-001` distinguishes:

- missing;
- rejected;
- expired;
- accepted.

Each state has its own label, icon and reason. A rejected item is not presented as a transport retry, and an unknown requirement is never silently counted as accepted.

An unknown effective deadline fails closed for evidence authoring: the UI does not treat missing deadline data as unlimited time.

## Prototype projection invariants

`submitRefundRequest` demonstrates `API-CLAIMS-001` semantics without adding production persistence:

- structured payload fingerprinting;
- identical retry with the same committed idempotency key reuses the committed request;
- materially different payload with that key is refused;
- committed retries still reconcile after the request window has subsequently closed;
- missing governing snapshot, ineligibility, expired window and incomplete evidence remain distinct;
- successful submission creates `SUBMITTED` only.

## UX boundaries

- Arabic-first and RTL-first.
- One primary reading column.
- Deadline and outstanding action are prioritized over historical detail.
- No raw internal record IDs, reviewer-only findings, S/P/H/I, risk or calibration mechanics are shown.
- No new generic upload mechanism is introduced in this slice.
- Protection is not described as insurance or guaranteed compensation.
- An approved refund is never presented as money already moved by UberTib.

## Verification coverage

`playwright/slice10-claims-core.spec.ts` covers:

- RTL, reflow and serious/critical Axe checks on high-risk surfaces;
- list deadline/type/evidence/appeal visibility;
- filtered-empty vs genuinely empty;
- financial external-execution boundary;
- distinct refund-request recovery states;
- incomplete evidence blocking;
- retryable input preservation;
- refund-request idempotency and policy boundaries;
- original/effective deadline preservation;
- all four claim evidence states with reasons;
- fail-closed unknown deadline behavior;
- reasoned decision + accountable reviewer;
- approved refund remaining an external obligation;
- clickable `FLOW-CLAIMS-001` from list → refund request → submitted claim detail → list.

`playwright/capture-slice10.spec.ts` remains opt-in with `CAPTURE=1` and is separate from the CI gate.

## Final verification

Pending the pull-request `Patient UI Preview` workflow on the final Slice 10 head.
