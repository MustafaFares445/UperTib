# Slice 9 — Review Appeal

## Canonical derivation

This slice implements the next Patient surface after verified review authoring/readback:

- `SCR-REVIEWS-004` — Review appeal
- `FLOW-REVIEWS-006` — Patient appeals a decision about their own review
- `FR-REVIEWS-002`
- `API-REVIEWS-002`
- `PO-UX-10`
- `TXT-STATE-REVIEWS-002`

The implementation is deliberately stacked on Slice 8 because the appeal starts from the patient's immutable review record and its governed retirement decision.

## Patient hierarchy

The screen keeps the Phase 4 order and does not make the patient write before learning what the action means:

1. the exact review decision being appealed and its recorded reason;
2. the appeal scope;
3. the independent-review guarantee;
4. the appeal deadline;
5. only then, the grounds field and optional supporting evidence summary;
6. the submit action.

The appeal-scope region is always visible before the grounds field. It states that the appeal may contest:

- eligibility;
- verification;
- policy compliance.

It also states explicitly that the appeal does **not** edit the rating or review text merely because the author dislikes the outcome.

## Independent decision

The Patient copy states that a Review Integrity Reviewer who did not make the original decision decides the appeal. `DECIDED` stays a neutral state; the outcome is communicated through the recorded reason rather than a success/failure colour.

## Append-only boundary

`API-REVIEWS-002` creates a new appeal/work-item fact. The local projection mirrors that contract:

- the original review state is not rewritten;
- the original rating is not rewritten;
- the original review content is not rewritten;
- the retirement decision and reason remain readable;
- scientific classification is not touched.

The appeal is added to the review projection as related history.

## Idempotency

The prototype helper uses a stable idempotency intent and an unambiguous structured payload fingerprint over:

- review ID;
- normalized appeal grounds;
- normalized evidence IDs.

Behavior:

- same key + same payload → reuse the existing appeal;
- same key + materially different payload → `IDEMPOTENCY_CONFLICT`;
- a different key when an appeal already exists → `ACTIVE_APPEAL_EXISTS`;
- a review projection that already contains an appeal cannot create another one.

This is preview evidence for the contract, not a production idempotency implementation.

## Evidence boundary

`API-REVIEWS-002` permits `evidence_ids`. This slice accepts already-known safe evidence references as optional supporting context, but it does not invent a second generic upload system. Evidence transfer remains governed by the provider-neutral evidence interaction already implemented in Slice 4.

## Governed blocked states

The authoring form is structurally withheld when:

- the original decision/reason cannot be read;
- the actor is not the authoring Patient/authorized Guardian;
- policy grants no appeal to that actor;
- the appeal window has expired;
- an appeal already exists.

These are not presented as a generic submission failure.

A retryable transport/submission failure preserves the entered grounds and exposes a retry action that represents the same submission intent.

## Implemented preview surfaces

- `src/screens/ReviewAppealScreen.tsx`
- `src/screens/ReviewAppealScreen.stories.tsx`
- `src/flows/ReviewAppealFlow.tsx`
- `src/flows/ReviewAppealFlow.stories.tsx`
- `src/mocks/reviewAppeals.ts`
- `playwright/slice9-review-appeal.spec.ts`
- `playwright/capture-slice9.spec.ts`

## Test coverage

Slice 9 is promoted into `test:smoke` and `verify` and covers:

- Arabic RTL and horizontal reflow;
- serious/critical Axe checks on high-risk states;
- decision and appeal scope appearing before the grounds field;
- allowed and prohibited appeal scope;
- independent reviewer copy;
- expired, unauthorized, no-policy and missing-decision structural recovery;
- retry preservation;
- optional evidence without a new free-upload surface;
- `SUBMITTED` versus `DECIDED` semantics;
- append-only preservation of the original review;
- identical-retry idempotency and materially different payload conflict;
- one-appeal uniqueness;
- clickable `FLOW-REVIEWS-006` from retired review to submitted appeal and back to immutable history.

## Verification

Pending the pull-request `Patient UI Preview` CI run.

## Deferred next slice

After this review-appeal slice, the next Patient family in the canonical screen specification is **Claims**, beginning with `SCR-CLAIMS-001 — My claims`.
