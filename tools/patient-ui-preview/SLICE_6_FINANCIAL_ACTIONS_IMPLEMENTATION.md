# UberTib Patient UI Preview — Slice 6 Financial Actions

Date: 2026-09-06

Branch: `feat/patient-slice6-financial-actions`

Base: `feat/patient-slice5-financial-history`

Writable/product scope: `tools/patient-ui-preview/**` only. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice implements the next Patient financial write surfaces after Slice 5's read-only financial history:

- `SCR-FINANCE-003` — Report external payment
- `SCR-FINANCE-004` — Financial event response
- the state-aware actions already owned by `SCR-FINANCE-002` — Financial timeline
- `FLOW-FINANCE-002` — Patient records an external payment fact
- `FLOW-FINANCE-004` — Patient confirms or disputes a clinic assertion

The implementation follows the repository authority chain, especially:

1. `.spec/decisions/`
2. `docs/ux/PHASE_05_HANDOFF.md`
3. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
4. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_02.md`
5. `docs/ux/04-specs/WIDGET_SPECS_DOMAIN.md`
6. `docs/ux/03-system/CONTENT_GUIDE_STATES.md`
7. `docs/ux/03-system/CONTENT_GUIDE_ERRORS.md`
8. `docs/api/API_CONTRACTS.md`
9. `.claude/skills/patient-ui-preview/SKILL.md`

## Preserved financial boundary

The implementation keeps the V1 financial boundary explicit in every action surface:

- UberTib does not collect money.
- UberTib does not hold money.
- UberTib does not transfer or capture money.
- UberTib does not settle money.
- UberTib does not execute refunds.
- A Patient action records or responds to a fact that occurred outside the platform.

No wallet, checkout, payment gateway, payout, escrow, platform balance or settlement surface was added.

## SCR-FINANCE-003 — Report external payment

`src/screens/ReportExternalPaymentScreen.tsx` implements the canonical hierarchy:

1. case / governing accepted-terms context;
2. required input;
3. validation and consequence;
4. action.

The Patient sees the accepted service/version and the accepted total before entering a new external event.

Required input in the preview maps directly to `API-FINANCE-002`:

- amount;
- currency;
- external method category;
- occurrence time.

Payer identity is deliberately absent from the form because the canonical contract derives it from authenticated context.

The action is labelled as recording a fact rather than paying. The post-submit state is canonical `REPORTED_UNCONFIRMED` with the Patient-facing label `مُبلَّغ عنه — غير مؤكَّد`.

### Terms/history mismatch

The mismatch story uses the canonical `TXT-ERR-FINANCE-001` message:

`لا يمكن تسجيل هذا الحدث المالي وفق الشروط والسجل الحاليين للحالة.`

The entered values remain visible. The recovery text states that no payment was attempted inside UberTib, so a governing-terms mismatch can never read as a declined or failed payment.

### Idempotency projection

`appendPatientPaymentReport()` is a prototype-only local projection helper for `API-FINANCE-002`. It uses one deterministic simulated event id so an identical repeated prototype command does not append a second event.

This is not production API implementation evidence. It exists only to make the Storybook flow represent the documented exactly-once/idempotency behavior rather than duplicate a record during local navigation simulation.

## SCR-FINANCE-004 — Financial event response

`src/screens/FinancialEventResponseScreen.tsx` shows the original clinic assertion first and keeps it readable after the Patient responds.

The two canonical actions remain distinct:

- `تأكيد دقة الواقعة` — primary;
- `الاعتراض على الواقعة` — destructive.

A dispute cannot commit until a reason is present. The consequence is visible before the destructive action: the dispute creates a later response record and routes the disagreement into the appropriate finance-review path. It does not delete the assertion and does not execute a refund.

After response, the screen renders two separate historical facts:

1. the original `REPORTED_UNCONFIRMED` assertion;
2. the appended Patient response with derived `CONFIRMED` or `DISPUTED` state.

`appendPatientFinancialResponse()` is the prototype-only projection helper for this append-only behavior.

## SCR-FINANCE-002 — state-aware action

`FinancialTimelineScreen` now resolves one dominant financial action at a time:

- when an event is waiting for this Patient as counterparty, `مراجعة الواقعة والرد` is primary;
- otherwise, where reporting is available, `تسجيل دفعة تمت خارج المنصة` is primary;
- read-only stories with no write callbacks preserve `عرض الشروط المقبولة` as the primary navigation action.

This follows the existing `CMP-PLATFORM-004` rule that a surface has exactly one primary action rather than presenting competing primaries simultaneously.

The pending response is intentionally handled before exposing another report action in the prototype flow. Once the Patient responds, the timeline exposes external-payment reporting.

## Evidence attachment boundary

`API-FINANCE-002` and `API-FINANCE-003` allow optional `evidence_ids`, but the Patient screen specification explicitly says evidence attachment on the reporting surface is bounded by the vendor decision in `Q-OPS-001` and stops at the transfer boundary.

This slice therefore does **not** invent a new financial evidence uploader, upload package, or attachment workflow.

## Flow integration

The existing care-reading prototype now supports:

`My cases → Case summary → Accepted financial terms → Financial timeline`

and from the timeline:

`Financial timeline → Financial event response → Financial timeline`

then, once no Patient response is pending:

`Financial timeline → Report external payment → Financial timeline`

The local prototype keeps the case and accepted snapshot in scope throughout.

## Storybook coverage

Added screen stories for:

- report external payment — filled default;
- report external payment — empty fields;
- report external payment — submitting;
- report external payment — submitted;
- report external payment — governing-terms mismatch;
- financial response — ready;
- financial response — ready with dispute reason;
- financial response — submitting confirmation;
- financial response — confirmed;
- financial response — disputed;
- financial timeline — report-payment available;
- financial timeline — Patient response required.

## Playwright coverage

`playwright/slice6-finance-actions.spec.ts` covers:

- RTL and horizontal reflow;
- serious/critical Axe checks on high-risk Slice 6 stories;
- report-only language and absence of payment/wallet affordances;
- absence of a payer-identity field;
- mismatch copy that never reads as failed payment;
- submitted state remaining `REPORTED_UNCONFIRMED`;
- dispute-reason requirement;
- original assertion remaining readable after dispute;
- one state-aware primary action on the timeline;
- end-to-end prototype path from pending response to external payment reporting.

`playwright/capture-slice6.spec.ts` provides deterministic opt-in screenshot evidence when run with `CAPTURE=1`.

`package.json` promotes the Slice 6 suite into `test:smoke` and `verify` alongside the previous Patient gates.

## Explicitly deferred

This slice does not implement:

- `SCR-FINANCE-005` report refund execution;
- claim/refund request UX;
- external-refund execution confirmation flows beyond the existing read-only history projection;
- evidence transfer beyond already approved evidence-transfer contracts;
- any production API, backend, persistence, auth or authorization behavior.

## Verification status

Pending the pull-request `Patient UI Preview` CI run. This section must be updated only from measured GitHub Actions evidence.
