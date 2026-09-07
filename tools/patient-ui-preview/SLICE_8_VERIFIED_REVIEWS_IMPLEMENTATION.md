# UberTib Patient UI Preview — Slice 8 Verified Reviews

Date: 2026-09-07

Branch: `feat/patient-slice8-verified-reviews`

Base: `feat/patient-slice7-refund-execution`

Writable/product scope: `tools/patient-ui-preview/**` only. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice implements the Patient authoring/read portion of the verified-review lifecycle:

- `SCR-REVIEWS-001` — Reviewable experiences
- `SCR-REVIEWS-002` — Submit review
- `SCR-REVIEWS-003` — My review
- `FLOW-REVIEWS-001` — Submit a verified review
- the existing `SCR-CLINICAL-002` case summary receives the canonical entry route

`SCR-REVIEWS-004` — the Patient appeal authoring surface — is deliberately deferred. This slice may show whether the policy grants an appeal and its window, but does not invent the appeal form or its evidence contract.

Primary authority remains the repository documentation chain, especially:

1. `.spec/decisions/`
2. `.spec/functional-requirements/FR.08.1.1-single-verified-review.md`
3. `docs/ux/PHASE_05_HANDOFF.md`
4. `docs/ux/05-build/IMPLEMENTATION_CONTRACTS.md`
5. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_02.md`
6. `docs/ux/04-specs/SCREEN_SPECS_PATIENT_03.md`
7. `docs/ux/01-foundation/USER_FLOWS.md`
8. `docs/api/API_CONTRACTS.md`
9. `docs/ux/03-system/CONTENT_GUIDE_STATES.md`
10. `.claude/skills/patient-ui-preview/SKILL.md`

## Business invariants preserved

The canonical review requirement is not a generic provider-rating feature. A review is anchored to a verified completed experience.

The preview therefore enforces:

- only a verified completed experience may become reviewable;
- the applicable review window must still be open;
- only one active review exists for one eligible experience;
- a duplicate opportunity is removed structurally rather than rendered as a disabled second-review row;
- an identical retry may reuse the same locally projected review;
- a materially different later attempt against an already active review is refused;
- the review retains its verified-experience linkage;
- review rating `R` remains separate from scientific eligibility/classification and never changes `S`, `P`, `H`, or internal `I`;
- retirement does not delete the review; the historical review and governed reason remain readable.

## Rating-scale boundary

The canonical `API-REVIEWS-001` contract does **not** define a concrete rating scale. It says the request carries:

`Review rating/content fields defined by product policy`

No approved source inspected by this slice defines a fixed one-to-five-star scale.

The preview therefore does not silently create one.

`ratingValue` is kept as a product-policy-owned string in the local projection. Fixture value `"4"` is mock content only; it is **not** a declaration that production uses 1–5 stars. Patient copy explicitly says the value follows product policy and the preview does not assume a numeric scale.

This is intentional source fidelity, not an omitted implementation detail.

## SCR-REVIEWS-001 — Reviewable experiences

Implemented in:

`src/screens/ReviewableExperiencesScreen.tsx`

The screen lists only currently reviewable verified experiences. Each opportunity shows:

- service;
- provider and branch;
- treating dentist;
- verified completion time;
- remaining review window before the action;
- one clear `اكتب تقييمًا` action.

Experiences that are unverified, expired, or already own an active review are not shown as fake disabled opportunities.

Existing reviews appear separately and route to `SCR-REVIEWS-003`.

The empty state reads as ordinary no-data:

`لا توجد تجربة متاحة للتقييم الآن.`

It does not imply a server failure.

## SCR-REVIEWS-002 — Submit review

Implemented in:

`src/screens/SubmitReviewScreen.tsx`

The screen hierarchy is:

1. verified-experience context;
2. review-window context;
3. required rating/content fields;
4. consequence before submit;
5. one dominant submit action.

The consequence copy states before submission that the review is tied to the verified experience and does not alter scientific eligibility.

The preview distinguishes the important non-submit conditions:

- review window expired;
- verified completion missing;
- an active review already exists.

An expired window is explicitly not described as a retryable transmission failure. A duplicate active review routes back to the existing review instead of offering a second submission.

The shared `ValidationField` gained backwards-compatible multiline support so review text can use the existing governed labelled-field treatment rather than introducing a separate textarea component.

## SCR-REVIEWS-003 — My review

Implemented in:

`src/screens/MyReviewScreen.tsx`

The screen uses canonical state copy:

- `ACTIVE` → `منشور`
- `RETIRED` → `مؤرشَف`

Review content is read-only. No edit or delete action is introduced.

A retired review remains visible with:

- the original rating value and text;
- the retirement reason;
- decision attribution and time where available.

Where policy grants a Patient appeal, the surface can show the appeal window and an appeal action callback. Where policy does not grant it, the action is structurally absent. The actual `SCR-REVIEWS-004` authoring flow remains outside this slice.

Existing appeal read projection uses canonical states:

- `SUBMITTED` → `مُقدَّم`
- `DECIDED` → `صدر القرار`

## Local projection integrity

`src/mocks/reviews.ts` adds prototype-only models for reviewable experiences, reviews, review windows and review submission.

`submitVerifiedReview()` demonstrates the documented `API-REVIEWS-001` invariants without pretending to be the production backend:

- empty required content is rejected;
- unverified completion is rejected;
- expired review window is rejected;
- an existing active review blocks a second materially different review;
- an identical retry reuses the existing locally projected review;
- a valid submission appends one `ACTIVE` review linked to the exact experience.

The helper intentionally does not decide the rating scale.

## Flow integration

A dedicated prototype implements:

`FLOW-REVIEWS-001`:

`Reviewable experiences → Submit review → My review → Reviewable experiences`

After submission, the reviewed experience disappears from the new-review opportunities and appears under existing reviews.

The broader `CareReadingFlow` also receives the case-scoped route:

`My cases → Case summary → تقييم التجربة → Reviewable experiences → Submit review → My review`

The entry is supplied only for the mock case that owns the verified completed experience.

## State and icon governance

The preview continues to consume canonical state triples through `StateChip`.

The existing governed Heroicons vocabulary subset was extended only with names already required by canonical review state tokens:

- `eye`
- `archive-box`
- `inbox-arrow-down`
- `scale`

No new icon system or ad-hoc lifecycle colour was introduced.

## Storybook coverage

Added states for:

### `SCR-REVIEWS-001`
- default reviewable experiences;
- empty no-data;
- existing active/retired reviews.

### `SCR-REVIEWS-002`
- ready/default;
- empty fields;
- submitting;
- expired window;
- active review already exists;
- not verified.

### `SCR-REVIEWS-003`
- active;
- retired with appeal available;
- retired with no policy-granted appeal;
- appeal submitted read state;
- appeal decided read state.

### `FLOW-REVIEWS-001`
- clickable end-to-end local prototype.

## Playwright coverage

`playwright/slice8-reviews.spec.ts` verifies:

- Arabic RTL rendering and reflow;
- serious/critical Axe checks on high-risk Slice 8 stories;
- verified completion and remaining review window appear before review effort;
- expired/unverified entries are not rendered as review opportunities;
- empty reviewability is no-data, not failure;
- verified-experience linkage and scientific-classification independence are stated before submission;
- no fixed 1–5/star scale is invented;
- expired, unverified and duplicate-active-review conditions have distinct recovery;
- local projection enforces verified completion, window, uniqueness and identical-retry idempotency;
- retirement preserves the review and governed reason;
- review edit/delete controls do not exist;
- Patient appeal action is absent where policy grants none;
- the dedicated verified-review flow creates one active review and removes the second-write opportunity;
- the case-scoped care-reading flow reaches the verified-review path.

`playwright/capture-slice8.spec.ts` provides opt-in deterministic visual evidence with `CAPTURE=1` and remains outside the ordinary CI gate.

`package.json` promotes Slice 8 into `test:smoke` and `verify` alongside preceding Patient slices.

## Preserved boundaries

This slice does **not**:

- invent a production review rating scale;
- allow an unverified experience to be reviewed;
- allow two active reviews for one eligible experience;
- let `R` affect scientific eligibility or classification;
- expose raw `S`, `P`, `H`, internal `I`, or formulas;
- allow the clinic to edit Patient review content;
- silently delete a retired review;
- invent the Patient appeal authoring form or evidence-transfer behavior;
- implement production API, authorization, persistence or database uniqueness.

## Verification status

Pending the pull-request `Patient UI Preview` CI run. Update this section only from measured GitHub Actions evidence.
