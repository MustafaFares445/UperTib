# UberTib Slice 1.6 — continuation closure checkpoint

Date: 2026-09-06

Branch: `fix/patient-slice1-global-ux-remediation`

Continuation baseline: `409d6bff350603f230038058af972e56279017da`

Scope: `tools/patient-ui-preview/**` only. No Slice 2 work is included.

## Detected remaining work

The latest post-implementation review already closes every BLOCKER and MAJOR finding. The remaining implementation delta is narrow:

1. **PI-N01 — 320 px price wrapping.** Keep each formatted amount plus `ل.س.` together so the currency abbreviation and range punctuation cannot become visually orphaned.
2. **SCR-BOOKING-001 disclosure precision.** The canonical screen contract says availability is advisory and the selected time is held only at commit. The rendered copy stated the advisory part but did not explicitly state the commit/revalidation boundary.
3. **Verification after the delta.** Re-run the preview quality gate and regenerate/review narrow-width evidence before calling Slice 1.6 frozen.
4. **Fresh independent approval remains a separate gate.** The existing `POST_IMPLEMENTATION_UI_UX_REVIEW.md` explicitly says its PASS is not the fresh final independent approval requested by the continuation brief. This checkpoint does not relabel that historical review as independent approval.

## Already satisfied — do not reimplement

- Provider comparison is implemented as transient, same-service, attribute-oriented comparison with no winner/ranking.
- Results expose visible provider-detail navigation and immediate comparison-selection feedback.
- Provider detail, slot selection, request review, and `REQUESTED` / `ALTERNATIVE_PROPOSED` / `CONFIRMED` booking compositions were recomposed and reviewed at 320/390/414.
- The unresolved **service-less direct provider search** requirement is already formally recorded in `UX_REMEDIATION_REPORT.md`: `API-ELIG-001` requires `service_code`, so Patient search remains service-scoped until product/API authority supplies a canonical entry contract. Do not invent an endpoint or bypass that requirement in Slice 1.6.

## Continuation changes

- `src/components/PriceDisplay.tsx`
  - keeps each formatted currency amount as an atomic visual run;
  - allows `يبدأ من` or the second range half to wrap as separate units instead of splitting `amount + currency` internally;
  - preserves the governed price modes and existing bidi isolation.
- `src/screens/SlotSelectionScreen.tsx`
  - makes the advisory/commit boundary explicit before the Patient continues.
- `playwright/smoke.spec.ts`
  - adds a 320 px regression check that currency runs remain single-line without horizontal page overflow;
  - asserts the canonical slot commit-boundary copy.

## Verification gate

Required before final freeze:

```text
npm ci
npm audit --omit=dev --audit-level=high
npm run typecheck
npm run storybook:build
npm run test:smoke
npm run test:e2e
python ../../docs/ux/scripts/validate_ux_tokens.py
git diff --check
```

GitHub CI currently runs dependency audit, typecheck, Storybook build, and `test:smoke` on pull requests. The broader `test:e2e` and UX-token validator remain explicit local/final-gate checks unless the workflow is expanded by an authorized task.

## Freeze rule

Slice 1.6 may be considered implementation-complete only after the continuation delta passes verification and a fresh reviewer performs the required final independent visual approval. Until then, do not start Slice 2 under this closure task.
