# UberTib Patient UI Preview — Slice 5 Financial History

Date: 2026-09-06

Branch: `feat/patient-slice5-financial-history`

Base: `feat/patient-slice4-evidence`

Writable/product scope: `tools/patient-ui-preview/**` only. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice implements the next Patient preview slice after evidence: **external financial history**.

The implementation follows the repository authority chain, especially:

1. `docs/ux/PHASE_05_HANDOFF.md`
2. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
3. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_02.md`
4. `docs/ux/04-specs/WIDGET_SPECS_DOMAIN.md`
5. `docs/ux/03-system/CONTENT_GUIDE_STATES.md`
6. `docs/api/API_CONTRACTS.md`
7. `.claude/skills/patient-ui-preview/SKILL.md`

The slice does not invent payment execution, wallet behavior, balances, custody, settlement, or a refund engine.

## Implemented Patient screens

| SCR | Surface | Preview file |
|---|---|---|
| `SCR-FINANCE-001` | Accepted financial terms | `src/screens/AcceptedFinancialTermsScreen.tsx` |
| `SCR-FINANCE-002` | Financial timeline | `src/screens/FinancialTimelineScreen.tsx` |

## Implemented domain widget

`WGT-FINANCE-001` — External financial event ledger is implemented in `src/widgets/ExternalFinancialLedger.tsx` using the Patient stacked-ledger realization.

The ledger keeps the immutable agreed position first, then ordered external financial events, then the derived current position only when the history is complete.

## Six required financial meanings

The Patient timeline makes these six meanings visibly and audibly distinct:

1. agreed;
2. reported externally;
3. confirmed as a record;
4. disputed;
5. externally refunded / refund execution recorded;
6. pending external execution.

Only the canonical external-financial-event lifecycle statuses use `StateChip`:

- `REPORTED_UNCONFIRMED` → `مُبلَّغ عنه — غير مؤكَّد`
- `CONFIRMED` → `مؤكَّد`
- `DISPUTED` → `محل اعتراض`

Agreed, refunded, and pending-external-execution remain derived financial meanings rather than invented lifecycle statuses.

## Immutable accepted terms

`SCR-FINANCE-001` shows:

- accepted snapshot version and acceptance time;
- service-scoped accepted lines;
- the agreed amount in the original agreed currency;
- due, cancellation, refund, and protection summaries;
- the references that governed the accepted snapshot.

If any accepted line is missing, the screen suppresses the total rather than manufacturing a potentially wrong amount.

Historical amounts are never recomputed from a later exchange rate or currency-normalization policy.

## Append-only financial history

Each financial event shows:

- what was asserted;
- amount and currency;
- who reported it;
- when the external occurrence happened;
- when UberTib recorded it;
- its canonical record state;
- any later counterparty response as an appended response block.

There is no edit or delete affordance on any event.

## Partial-history safety

The derived position is shown only when the snapshot plus the ordered event set are complete.

When a history gap exists:

- already loaded events remain readable;
- the gap is named explicitly;
- the derived position is removed structurally.

This prevents a partial history from being mistaken for a complete balance or settlement state.

## Flow integration

The existing `Patient/Flows/FLOW-CLINICAL-008 Care reading` preview now exposes financial history only on a case whose `financialSnapshotAvailable` flag is true:

`My cases → Case summary → Accepted financial terms → Financial timeline`

The Patient can move back to the immutable terms or to the case without leaving the case scope.

## UX composition choices

The slice intentionally avoids a text-heavy accounting screen:

- one reading column;
- short event cards;
- amount adjacent to state;
- concise attribution and dates;
- a small response block for later confirmation/dispute;
- six compact current-position facts instead of one dense accounting table;
- no saturated full-screen warning surfaces;
- progressive explanation through labels and helper copy rather than long policy paragraphs.

## Preserved V1 boundary

This slice does **not**:

- collect, hold, transfer, capture, settle, or refund money;
- expose a wallet, stored balance, payment gateway, checkout, payout, or settlement UI;
- imply that a confirmed record means UberTib executed the underlying payment;
- treat an unconfirmed assertion as settled fact;
- edit or delete an existing financial event;
- recompute a historical agreed amount from a later exchange rate;
- present a claim/refund entitlement decision as completed external execution;
- implement `SCR-FINANCE-003+` write surfaces ahead of their own slice.

## Storybook and verification coverage

Added stories for:

- accepted terms — complete and partial;
- financial timeline — complete, partial-history, and no-events states;
- `WGT-FINANCE-001` — complete, partial-history, and no-events states;
- the existing case summary now has a story where financial history is available.

`playwright/slice5-finance.spec.ts` covers:

- RTL and horizontal reflow;
- serious/critical browser-level axe checks on the high-risk surfaces;
- immutable agreed-currency behavior;
- partial accepted terms suppressing the total;
- six distinct financial meanings;
- no payment/wallet execution affordance;
- partial financial history suppressing the derived position;
- empty history preserving the agreed snapshot;
- navigation from case summary through terms into the financial timeline.

`playwright/capture-slice5.spec.ts` provides opt-in deterministic screenshot evidence when run with `CAPTURE=1`.

`package.json` promotes the Slice 5 suite into `test:smoke` and `verify` alongside the previous Patient gates.

## Verification status

Measured on GitHub Actions **Patient UI Preview run #31** (`34051340109`) at head `27bcaead784b13c6e8196fd77dc4632cf74d9a27`:

- dependency install: passed;
- dependency audit: passed;
- Chromium install: passed;
- TypeScript typecheck: passed;
- Storybook production build: passed;
- readiness + Slice 2 + Slice 3 + Slice 4 + Slice 5 smoke suites: passed;
- serious/critical axe checks on the high-risk Slice 5 surfaces: passed;
- artifact upload: passed.

The first Slice 5 run correctly exposed one brittle Playwright strict-mode assertion because the canonical phrase `محل اعتراض` appears both as a lifecycle chip and as a derived-position label. The test was corrected to assert the first semantic occurrence instead of requiring the UI to contain only one copy. No accessibility, business-rule, or rendering gate was removed or waived.

The documentation-only commit that records this result triggers one final CI run; the pull request should be considered verified only when that final head is green as well.

## Deferred financial write surfaces

The next financial implementation slice may cover Patient reporting/responding surfaces such as `SCR-FINANCE-003` and related commands. Those write paths must preserve the same V1 boundary: they record assertions about externally performed financial activity; they never execute money movement inside UberTib.
