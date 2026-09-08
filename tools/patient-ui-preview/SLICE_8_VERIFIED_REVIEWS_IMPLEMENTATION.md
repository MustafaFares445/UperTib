# UberTib Patient UI Preview — Slice 8 Verified Reviews

Date: 2026-09-08

Current rating-policy implementation branch: `feat/patient-review-five-star-rating`

Scope: Patient verified-review UI/projection under `tools/patient-ui-preview/**`, plus the authoritative Product Owner clarification in `.spec/decisions/PO-2026-09-08-review-rating-scale.md`. This remains a non-production React Native Web / Storybook preview.

## Canonical derivation

This slice implements the Patient authoring/read portion of the verified-review lifecycle:

- `SCR-REVIEWS-001` — Reviewable experiences
- `SCR-REVIEWS-002` — Submit review
- `SCR-REVIEWS-003` — My review
- `FLOW-REVIEWS-001` — Submit a verified review
- the existing `SCR-CLINICAL-002` case summary entry route

Primary authority for the rating behavior is now:

1. `.spec/decisions/PO-2026-09-08-review-rating-scale.md` (`PO-UX-19`)
2. `.spec/functional-requirements/FR.08.1.1-single-verified-review.md`
3. the existing Patient UX/spec/API contracts

## Business invariants preserved

The review remains anchored to one verified completed Patient experience. The preview enforces:

- verified completion before review authoring;
- an open review window;
- at most one active review per eligible experience;
- structurally removing duplicate review opportunities;
- idempotent reuse of an identical retry;
- refusal of a materially different later attempt once an active review exists;
- immutable historical review projection and retirement reason;
- review rating `R` remains separate from scientific eligibility/classification and never changes `S`, `P`, `H`, internal `I`, eligibility state, grade, or any scientific decision.

## Rating scale — resolved by PO-UX-19

The former open rating-scale question is closed.

UberTib V1 uses one required **overall Patient-experience rating** with whole-number values:

| Value | Patient label |
|---:|---|
| 1 | سيئة جدًا |
| 2 | سيئة |
| 3 | مقبولة |
| 4 | جيدة |
| 5 | ممتازة |

Patient question:

> **كيف كانت تجربتك في هذه الزيارة؟**

Rules implemented in the preview:

- the rating is required;
- only integer values `1..5` are valid;
- no half-stars, decimals, smileys, or multi-dimension score are introduced in V1;
- written feedback is optional;
- the rating measures experience of the visit, not medical competence, diagnosis accuracy, treatment outcome, or scientific eligibility;
- the Patient-facing control is one accessible `radiogroup` with five `radio` choices and explicit checked state;
- the star shape is a visual rating affordance only and is never the sole carrier of meaning.

## SCR-REVIEWS-001 — Reviewable experiences

`src/screens/ReviewableExperiencesScreen.tsx` still lists only currently reviewable verified experiences. Unverified, expired, or already-reviewed experiences are not rendered as fake disabled opportunities.

## SCR-REVIEWS-002 — Submit review

Implemented in `src/screens/SubmitReviewScreen.tsx` with `src/components/ExperienceRatingField.tsx`.

Hierarchy:

1. verified-experience context;
2. review-window context;
3. required five-star experience rating;
4. optional written feedback;
5. one dominant submit action.

The screen now asks `كيف كانت تجربتك في هذه الزيارة؟` and presents five touch/keyboard/assistive-technology selectable radio options. Each option has a complete accessible label such as `4 من 5، جيدة`.

The submit action is available once a valid rating exists. Written feedback is explicitly labelled optional and may be omitted.

Expired, unverified, and duplicate-active-review conditions still replace the authoring surface rather than stacking a dead form beneath an error.

## SCR-REVIEWS-003 — My review

`src/screens/MyReviewScreen.tsx` renders the immutable submitted rating using `ExperienceRatingReadout` and keeps written feedback optional.

A review without text says that no written notes were added. A retired review preserves the original rating, optional text, retirement reason, attribution, time, and appeal behavior.

## Local projection integrity

`src/mocks/reviews.ts` now models `ratingValue` as the governed numeric review rating and validates the API-boundary-shaped draft at runtime.

`submitVerifiedReview()` demonstrates:

- rating `1..5` integer accepted;
- `0`, `6`, decimals, missing/non-valid values rejected as `INVALID_INPUT`;
- empty written feedback accepted when the rating is valid;
- unverified completion rejected;
- expired review window rejected;
- one active review enforced;
- identical retry idempotency preserved;
- a valid submission appends one `ACTIVE` review linked to the exact experience.

## Public verified-review aggregate

`src/reviews/rating.ts` owns the shared Patient-safe aggregate rules introduced by PO-UX-19.

- fewer than 5 active verified reviews → no public numeric/star aggregate;
- 5 or more → compact display may be `★ 4.7 · 126 تقييمًا`;
- average is formatted to one decimal place when needed;
- a full accessible label states the average is out of 5 and states the verified-review count;
- retired/non-published reviews are excluded by the upstream aggregate contract defined by PO-UX-19.

Provider decision/comparison mock projections now carry a structured `verifiedRating` aggregate instead of a preformatted arbitrary rating string. A deterministic fixture with only 3 reviews verifies that the UI withholds its average.

## Flow integration

`FLOW-REVIEWS-001` remains:

`Reviewable experiences → Submit review → My review → Reviewable experiences`

The broader `CareReadingFlow` remains:

`My cases → Case summary → تقييم التجربة → Reviewable experiences → Submit review → My review`

Both flows now use numeric governed ratings rather than string placeholders.

## Storybook coverage

`SCR-REVIEWS-002` covers:

- default selected rating;
- rating-only submission with no written feedback;
- empty fields/no selected rating;
- submitting;
- expired window;
- active review already exists;
- not verified.

Existing Reviewable Experiences and My Review states remain covered.

## Playwright coverage

`playwright/slice8-reviews.spec.ts` now verifies:

- RTL/reflow safety and serious/critical Axe checks;
- a five-option rating `radiogroup` with explicit checked state;
- correct 1/4/5 accessible labels;
- changing the selected rating;
- rating-only submission with optional text omitted;
- numeric 1..5 projection validation and rejection of 0/6/decimal values;
- scientific-eligibility independence;
- aggregate suppression below five reviews and compact display at the threshold;
- verified completion, review-window, uniqueness, idempotency, retirement, appeal, and end-to-end flow invariants.

## Preserved boundaries

This work does **not**:

- make reviews a scientific/medical-quality score;
- let `R` affect `S`, `P`, `H`, internal `I`, eligibility, grade, or clinical decisions;
- introduce half-star or multi-dimension review semantics;
- allow unverified or duplicate active reviews;
- allow the clinic to edit Patient review content;
- delete retired review history;
- implement production API, authorization, persistence, or database uniqueness.

## Verification status

Pending the Patient UI Preview workflow for the final pull-request head. The branch is not considered ready until typecheck, Storybook build, readiness/Axe smoke, full Patient E2E, and 320/390/414 capture are green.
