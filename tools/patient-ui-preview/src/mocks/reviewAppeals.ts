import {
  REVIEW_NOW_ISO,
  retiredPatientReview,
  type PatientReviewProjection,
  type ReviewAppealProjection,
} from './reviews';

export type ReviewAppealBlock =
  | 'INVALID_INPUT'
  | 'DECISION_UNAVAILABLE'
  | 'NOT_AUTHORIZED'
  | 'WINDOW_EXPIRED'
  | 'ACTIVE_APPEAL_EXISTS'
  | 'IDEMPOTENCY_CONFLICT';

export interface ReviewAppealDraft {
  grounds: string;
  evidenceIds?: string[];
}

export interface ReviewAppealRecord extends ReviewAppealProjection {
  id: string;
  reviewId: string;
  grounds: string;
  evidenceIds: string[];
  idempotencyKey: string;
  payloadFingerprint: string;
  windowEndsAtIso: string;
}

export interface ReviewAppealSubmissionResult {
  review: PatientReviewProjection;
  appeal?: ReviewAppealRecord;
  blockedBy?: ReviewAppealBlock;
  reused?: boolean;
}

export interface ReviewAppealSubmissionOptions {
  actorAuthorized: boolean;
  idempotencyKey: string;
  existingAppeal?: ReviewAppealRecord;
  nowIso?: string;
}

export const defaultAppealDraft: ReviewAppealDraft = {
  grounds: 'أعترض على تطبيق سياسة النشر على هذه الحالة، وأطلب مراجعة ما إذا كان القرار استند إلى التحقق والسياسة الصحيحة.',
  evidenceIds: [],
};

function normalizeAppealDraft(draft: ReviewAppealDraft): Required<ReviewAppealDraft> {
  return {
    grounds: draft.grounds.trim(),
    evidenceIds: [...new Set(draft.evidenceIds ?? [])].sort(),
  };
}

export function reviewAppealPayloadFingerprint(reviewId: string, draft: ReviewAppealDraft): string {
  const normalized = normalizeAppealDraft(draft);
  return encodeURIComponent(JSON.stringify([reviewId, normalized.grounds, normalized.evidenceIds]));
}

/**
 * Prototype-only projection helper for API-REVIEWS-002.
 *
 * It demonstrates that an appeal is a new append-only record. It never edits the original rating,
 * text, retirement decision, or scientific classification. Identical retries with the same
 * idempotency key reuse the committed appeal; materially different payloads with that key are
 * refused rather than silently creating a second intent.
 */
export function submitReviewAppeal(
  review: PatientReviewProjection,
  draft: ReviewAppealDraft,
  options: ReviewAppealSubmissionOptions,
): ReviewAppealSubmissionResult {
  const normalized = normalizeAppealDraft(draft);
  const nowIso = options.nowIso ?? REVIEW_NOW_ISO;

  if (!normalized.grounds) {
    return { review, blockedBy: 'INVALID_INPUT' };
  }

  if (review.state !== 'RETIRED' || !review.retirement) {
    return { review, blockedBy: 'DECISION_UNAVAILABLE' };
  }

  if (!options.actorAuthorized || !review.appealPolicy?.allowed) {
    return { review, blockedBy: 'NOT_AUTHORIZED' };
  }

  const windowEndsAtIso = review.appealPolicy.windowEndsAtIso;
  if (!windowEndsAtIso || new Date(windowEndsAtIso).getTime() <= new Date(nowIso).getTime()) {
    return { review, blockedBy: 'WINDOW_EXPIRED' };
  }

  const payloadFingerprint = reviewAppealPayloadFingerprint(review.id, normalized);
  const existingAppeal = options.existingAppeal;

  if (existingAppeal) {
    if (existingAppeal.idempotencyKey === options.idempotencyKey) {
      if (existingAppeal.payloadFingerprint === payloadFingerprint) {
        return { review: { ...review, appeal: existingAppeal }, appeal: existingAppeal, reused: true };
      }
      return { review, appeal: existingAppeal, blockedBy: 'IDEMPOTENCY_CONFLICT' };
    }

    return { review, appeal: existingAppeal, blockedBy: 'ACTIVE_APPEAL_EXISTS' };
  }

  const appeal: ReviewAppealRecord = {
    id: `review-appeal:${review.id}`,
    reviewId: review.id,
    state: 'SUBMITTED',
    submittedAtIso: nowIso,
    grounds: normalized.grounds,
    evidenceIds: normalized.evidenceIds,
    idempotencyKey: options.idempotencyKey,
    payloadFingerprint,
    windowEndsAtIso,
  };

  return {
    review: { ...review, appeal },
    appeal,
  };
}

export const submittedReviewAppeal: ReviewAppealRecord = {
  id: 'review-appeal:review-retired-006',
  reviewId: retiredPatientReview.id,
  state: 'SUBMITTED',
  submittedAtIso: '2026-09-06T20:30:00+03:00',
  grounds: defaultAppealDraft.grounds,
  evidenceIds: [],
  idempotencyKey: 'review-appeal:review-retired-006:attempt-1',
  payloadFingerprint: reviewAppealPayloadFingerprint(retiredPatientReview.id, defaultAppealDraft),
  windowEndsAtIso: '2026-09-10T23:59:59+03:00',
};

export const decidedReviewAppeal: ReviewAppealRecord = {
  ...submittedReviewAppeal,
  state: 'DECIDED',
  submittedAtIso: '2026-09-01T10:00:00+03:00',
  decidedAtIso: '2026-09-04T13:00:00+03:00',
  decidedByLabel: 'مراجع نزاهة مستقل',
  decisionReason: 'تمت مراجعة أساس القرار من مراجع مستقل، وثبت أن قرار الأرشفة يطابق سياسة النشر المطبقة على الحالة.',
};

export const retiredReviewWithSubmittedAppeal: PatientReviewProjection = {
  ...retiredPatientReview,
  appeal: submittedReviewAppeal,
};

export const retiredReviewWithDecidedAppeal: PatientReviewProjection = {
  ...retiredPatientReview,
  appeal: decidedReviewAppeal,
};

export const retiredReviewWithExpiredAppealWindow: PatientReviewProjection = {
  ...retiredPatientReview,
  id: 'review-retired-expired-008',
  appealPolicy: {
    allowed: true,
    windowEndsAtIso: '2026-09-01T23:59:59+03:00',
    windowState: 'lapsed',
  },
};

export const retiredReviewWithoutReadableDecision: PatientReviewProjection = {
  ...retiredPatientReview,
  id: 'review-retired-missing-decision-009',
  retirement: undefined,
};
