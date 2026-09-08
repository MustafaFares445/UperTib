# UberTib Patient UI — Cross-Slice UI/UX Remediation Implementation

Date: 2026-09-08

Implementation branch: `fix/patient-all-slices-ui-ux-remediation`

Baseline branch: `main`

Baseline HEAD used to create the remediation branch: `0e3d4e66475ff43848852d3b45c90d0d453e0b6c`

Authority: `ALL_SLICES_SENIOR_UI_UX_REVIEW.md`, the canonical Patient UX/spec contracts, and the approved cross-slice remediation plan.

Scope: `tools/patient-ui-preview/**` plus the Patient preview GitHub Actions workflow. No production backend, clinical engine, financial engine, ranking, eligibility, or native application behavior is changed here.

---

## 1. Baseline

The independent all-slices review recorded that the product implementation merge passed TypeScript and Storybook build but failed the Patient preview readiness smoke gate on a critical Slice 12 `aria-required-attr` issue: React Native Web checkbox-role controls did not expose checked-state semantics. The review also recorded that the standard CI evidence did not contain a complete current 320/390/414 visual capture set for the later slices because those capture suites were opt-in.

The remediation branch starts from the documentation-only main HEAD after that review so the review itself remains the comparison authority.

Baseline Patient workflow before this remediation:

- Node 24 / `npm ci` / dependency audit;
- Chromium install;
- TypeScript typecheck;
- Storybook production build;
- one 390px readiness smoke pass;
- artifact upload.

---

## 2. Product boundaries preserved

This remediation deliberately does not change the canonical business model:

- eligibility remains separate from ranking and hidden S/P/H/I mechanics;
- booking request, alternative proposal, and confirmation remain distinct lifecycle meanings;
- accepted treatment and financial snapshots remain immutable;
- `FAILED_RETRYABLE != REJECTED` and `UPLOADED != ACCEPTED` remain preserved by the existing evidence state components and projections;
- Patient finance continues to record external facts rather than collecting, holding, transferring, settling, or refunding money inside UberTib;
- reviews remain attached to verified experiences and remain independent from scientific eligibility;
- claims and appeals keep historical governing snapshots, decisions, and deadlines authoritative;
- representation consent, dependent legal-basis verification, active context, and revocation remain separate concepts.

The work changes composition, hierarchy, disclosure, copy density, state replacement, responsive verification, and accessibility semantics only.

---

## 3. Shared Patient composition foundation

Implemented shared primitives:

### `SelectionChoice`

A governed checkbox/radio choice that:

- emits explicit `aria-checked` for React Native Web;
- keeps `accessibilityState` in sync;
- exposes disabled state;
- uses the governed `check-circle` icon rather than a literal check glyph;
- preserves the minimum target size and focus-ring behavior.

This removes the Slice 12 accessibility blocker without weakening Axe or changing the control role.

### `ContextNote`

A lightweight icon + title/body treatment for one persistent governing fact. It replaces repeated safety/policy cards where the fact must stay visible but should not compete with the Patient's object or action.

### `DisclosureSection`

An accessible progressive-disclosure control with exposed expanded state. It is used for secondary/historical policy detail rather than forcing every term into the initial reading column.

### Shared foundation cleanup

`SubjectContextHeader` now uses the governed hairline token instead of a literal border width.

`AuthorizationGrantPanel` now supports a compact summary mode for overview/context-selection surfaces while retaining the complete scope, basis, period, attribution, and revocation history in full detail mode.

---

## 4. Slice implementation matrix

| Slice | Implementation | Status |
|---|---|---|
| 1 | Existing baseline `PriceDisplay` already keeps the amount/currency run atomic and allows surrounding qualifiers to wrap; no additional business or composition change was required. | PASS / retain reference composition |
| 2 | Existing service-first discovery, comparison, active filters, and progressive eligibility explanation remain intact. No ranking or winner behavior was introduced. | PASS / retain reference composition |
| 3 | Plan Acceptance is now a treatment-plan object plus one permanence consequence. Stale/incomplete/unauthorized states replace the normal acceptance composition while preserving the disabled irreversible action required by the current contract. Amendment delta remains explicit. | IMPLEMENTED |
| 4 | Existing evidence-state object vocabulary is preserved unchanged so transport failure, scanning, rejection, and acceptance retain distinct meanings. | PASS / preserve state composition |
| 5 | Accepted Financial Terms is now one accepted snapshot with compact line rows. Payment/cancellation/refund/protection terms use progressive disclosure, and governing references move to advanced detail. Incomplete snapshots still suppress totals. | IMPLEMENTED |
| 6 | External financial reporting/responding now uses one persistent external-record context and makes the original event the dominant object. Confirmation and dispute remain independent; dispute still requires a reason and appends rather than rewrites history. | IMPLEMENTED |
| 7 | Existing narrow external-refund record task and exact decision amount/currency behavior remain intact. No wallet/refund execution behavior was introduced. | PASS / retain disciplined task |
| 8 | Repeated eligibility disclaimer copy was reduced to one clear screen-level statement. The generic rating value field remains intentionally unchanged as a scale because the canonical rating scale is still undefined. | COPY REMEDIATION IMPLEMENTED; RATING CONTROL BLOCKED BY PRODUCT DECISION |
| 9 | Review Appeal is now original decision → compact contestable scope → independent-review context → deadline → grounds. Submitted/decided/projection-only and blocked states replace authoring instead of stacking beneath it. | IMPLEMENTED |
| 10 | Refund Request now begins with one entitlement object, uses structural blocked states, compact evidence readiness, and places the external-execution consequence directly before the commit action. | IMPLEMENTED |
| 11 | Protection Claim is staged as accepted protection → evidence readiness → request → pre-submit consequence. No-entitlement/unavailable/expired conditions withhold dead authoring. Claim Appeal is recomposed around original decision, historical policy/deadline, grounds, and append-only state. | IMPLEMENTED |
| 12 | Overview grant scope is compact, Create Grant is a progressive permission builder, Add Dependent is explicitly a verification request whose submitted state replaces the form, and Active Patient Context makes the represented Patient the primary object. Full authorization complexity remains in Grant Detail. | IMPLEMENTED |

---

## 5. Review finding disposition

| Finding | Disposition | Implementation evidence |
|---|---|---|
| `ALL-B01` checkbox checked-state semantics | FIXED IN CODE | `SelectionChoice.tsx`; Create Grant and Add Dependent no longer use custom literal-glyph checkbox code and expose `aria-checked`. |
| `ALL-B02` incomplete 320/390/414 evidence | FIXED IN VERIFICATION PIPELINE | `scripts/capture-all.mjs`, package scripts, and Patient UI Preview workflow now run all existing capture suites across `patient-320`, `patient-390`, and `patient-414` and upload the artifacts. |
| `ALL-M01` missing application-object vocabulary | REMEDIATED | Treatment plan, financial snapshot/event, claim/appeal, and representation compositions now lead with Patient-recognizable records/states. |
| `ALL-M02` repeated safety/business prose | REMEDIATED | `ContextNote` plus decision-adjacent consequences replace repeated cards while preserving controlling boundaries. |
| `ALL-M03` reading density on high-effort tasks | REMEDIATED | Protection, representation, claims, and appeal authoring use staged/progressive sections without inventing new canonical routes. |
| `ALL-M04` blocked states stacked with dead forms | REMEDIATED | Refund, claim appeal, review appeal, dependent verification, protection, and plan acceptance structurally withhold or replace unavailable authoring. |
| `ALL-M05` bordered surfaces as information architecture | REMEDIATED | Flat rows, typography, compact context, and disclosure replace many equal-weight cards. |
| `ALL-M06` undefined review rating scale | UPSTREAM BLOCKER REMAINS | No 1–5/star/smiley scale was invented. Product must define values/labels/meaning before a governed accessible rating selector can be implemented. |
| `ALL-M07` over-expanded representation | REMEDIATED | Summary-mode grant panels and compact patient-context objects; full scope remains in Grant Detail. |
| `ALL-N01` narrow-width currency run | SATISFIED BY BASELINE | Existing `PriceDisplay.CurrencyRun` is atomic and is included in the 320px capture suite. |
| `ALL-N02` literal selected check glyph | FIXED | Governed `check-circle` icon in `SelectionChoice`. |
| `ALL-N03` hardcoded shared border width | FIXED | `SubjectContextHeader` uses `borderWidth('hairline')`. |

---

## 6. Verification contract after remediation

The Patient preview workflow now performs, on pull requests touching the preview:

1. `npm ci` and dependency audit;
2. Chromium installation;
3. `npm run typecheck`;
4. `npm run storybook:build`;
5. the existing 390px readiness/slice smoke gate with serious/critical Axe assertions;
6. the complete Playwright Patient E2E suite across the configured 320/390/414 projects;
7. every existing deterministic `capture*.spec.ts` suite across 320/390/414;
8. upload of Playwright, visual-review, and audit artifacts.

The capture runner is cross-platform and may also be run locally with:

```bash
npm run capture:all
```

The workflow intentionally does not weaken Axe assertions or hide controls from accessibility APIs.

---

## 7. Rating-scale product decision still required

The cross-slice remediation can finish every presentation defect without inventing a rating policy, but Slice 8 cannot receive a final consumer-grade rating selector until product authority defines:

- allowed rating values;
- scale and labels;
- meaning of each value;
- whether partial values exist;
- whether the review has one overall rating or multiple dimensions.

Until that decision exists, the preview keeps the current generic `ratingValue` input and explicitly avoids implying a 5-star or other scale.

---

## 8. Native proof boundary

This React Native Web preview and browser CI still do not prove native-only behavior. The following remain explicit real-device verification items:

- VoiceOver;
- TalkBack;
- Dynamic Type / font scaling;
- native keyboard behavior;
- safe-area behavior;
- real-device gestures;
- production performance.

---

## 9. Final verification evidence

Pending the pull-request workflow for the final implementation head. The PR run must be green before this branch is treated as ready for merge. The uploaded CI artifact is the required source for the final 320/390/414 visual review.
