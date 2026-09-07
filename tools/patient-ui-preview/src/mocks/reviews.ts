export type ReviewState = 'ACTIVE' | 'RETIRED';
export type ReviewAppealState = 'SUBMITTED' | 'DECIDED';
export type ReviewWindowState = 'running' | 'approaching' | 'lapsed';
export type ReviewSubmissionBlock =
  | 'INVALID_INPUT'
  | 'NOT_VERIFIED_COMPLETE'
  | 'ACTIVE_REVIEW_EXISTS'
  | 'WINDOW_EXPIRED';

export interface ReviewableExperienceProjection {
  id: string;
  caseId: string;
  serviceLabel: string;
  providerName: string;
  branchName: string;
  treatingDentist: string;
  completedAtIso: string;
  verifiedCompleted: boolean;
  reviewWindowEndsAtIso: string;
  reviewWindowState: ReviewWindowState;
}

export interface ReviewAppealProjection {
  state: ReviewAppealState;
  submittedAtIso: string;
  decisionReason?: string;
  decidedAtIso?: string;
}

export interface PatientReviewProjection {
  id: string;
  experienceId: string;
  caseId: string;
  serviceLabel: string;
  providerName: string;
  branchName: string;
  treatingDentist: string;
  state: ReviewState;
  /** Product-policy-owned rating value. The preview intentionally does not assume a numeric scale. */
  ratingValue: string;
  content: string;
  submittedAtIso: string;
  commandFingerprint?: string;
  retirement?: {
    reason: string;
    decidedAtIso: string;
    decidedByLabel: string;
  };
  appeal?: ReviewAppealProjection;
  appealPolicy?: {
    allowed: boolean;
    windowEndsAtIso?: string;
    windowState?: ReviewWindowState;
  };
}

export interface ReviewSubmissionDraft {
  ratingValue: string;
  content: string;
}

export interface ReviewSubmissionResult {
  reviews: PatientReviewProjection[];
  review?: PatientReviewProjection;
  blockedBy?: ReviewSubmissionBlock;
  reused?: boolean;
}

export const REVIEW_NOW_ISO = '2026-09-07T03:00:00+03:00';

export const completedCleaningExperience: ReviewableExperienceProjection = {
  id: 'experience-cleaning-002',
  caseId: 'case-cleaning-002',
  serviceLabel: 'تنظيف الأسنان',
  providerName: 'مركز الأمل لطب الأسنان',
  branchName: 'الفرع الرئيسي',
  treatingDentist: 'د. سامر حداد',
  completedAtIso: '2026-09-05T12:15:00+03:00',
  verifiedCompleted: true,
  reviewWindowEndsAtIso: '2026-09-14T23:59:59+03:00',
  reviewWindowState: 'running',
};

export const approachingReviewExperience: ReviewableExperienceProjection = {
  id: 'experience-exam-003',
  caseId: 'case-exam-003',
  serviceLabel: 'فحص أسنان دوري',
  providerName: 'عيادة النور السنية',
  branchName: 'فرع الفرقان',
  treatingDentist: 'د. مريم الخطيب',
  completedAtIso: '2026-08-30T10:20:00+03:00',
  verifiedCompleted: true,
  reviewWindowEndsAtIso: '2026-09-08T18:00:00+03:00',
  reviewWindowState: 'approaching',
};

export const expiredReviewExperience: ReviewableExperienceProjection = {
  ...completedCleaningExperience,
  id: 'experience-expired-004',
  caseId: 'case-expired-004',
  serviceLabel: 'إزالة جير الأسنان',
  completedAtIso: '2026-08-10T09:00:00+03:00',
  reviewWindowEndsAtIso: '2026-08-25T23:59:59+03:00',
  reviewWindowState: 'lapsed',
};

export const unverifiedReviewExperience: ReviewableExperienceProjection = {
  ...completedCleaningExperience,
  id: 'experience-unverified-005',
  caseId: 'case-unverified-005',
  serviceLabel: 'جلسة علاجية غير مكتملة التحقق',
  verifiedCompleted: false,
};

export const existingActiveReview: PatientReviewProjection = {
  id: 'review-exam-003',
  experienceId: approachingReviewExperience.id,
  caseId: approachingReviewExperience.caseId,
  serviceLabel: approachingReviewExperience.serviceLabel,
  providerName: approachingReviewExperience.providerName,
  branchName: approachingReviewExperience.branchName,
  treatingDentist: approachingReviewExperience.treatingDentist,
  state: 'ACTIVE',
  ratingValue: '4',
  content: 'كانت التجربة واضحة ومنظمة، وتم شرح خطوات الزيارة بشكل جيد.',
  submittedAtIso: '2026-09-01T14:30:00+03:00',
};

export const retiredPatientReview: PatientReviewProjection = {
  ...existingActiveReview,
  id: 'review-retired-006',
  experienceId: 'experience-retired-006',
  caseId: 'case-retired-006',
  serviceLabel: 'زيارة متابعة',
  state: 'RETIRED',
  ratingValue: '3',
  content: 'كتبت هذا التقييم بعد الزيارة المسجّلة في الحالة.',
  submittedAtIso: '2026-08-22T11:10:00+03:00',
  retirement: {
    reason: 'تمت أرشفة التقييم بعد قرار نزاهة مسجّل بسبب عدم توافقه مع سياسة النشر المطبقة على هذه الحالة.',
    decidedAtIso: '2026-08-25T16:40:00+03:00',
    decidedByLabel: 'مراجع نزاهة مخوّل',
  },
  appealPolicy: {
    allowed: true,
    windowEndsAtIso: '2026-09-10T23:59:59+03:00',
    windowState: 'running',
  },
};

export const retiredNoAppealReview: PatientReviewProjection = {
  ...retiredPatientReview,
  id: 'review-retired-no-appeal-007',
  appealPolicy: { allowed: false },
};

function normalizedDraft(draft: ReviewSubmissionDraft): ReviewSubmissionDraft {
  return {
    ratingValue: draft.ratingValue.trim(),
    content: draft.content.trim(),
  };
}

function commandFingerprint(experienceId: string, draft: ReviewSubmissionDraft) {
  const normalized = normalizedDraft(draft);
  return encodeURIComponent([experienceId, normalized.ratingValue, normalized.content].join('|'));
}

/**
 * Prototype-only projection helper for API-REVIEWS-001.
 *
 * It demonstrates the documented invariants without choosing a production rating scale:
 * verified completion, an open review window, one active review per experience, and an idempotent
 * identical retry. A materially different second submission is refused by the active-review rule.
 */
export function submitVerifiedReview(
  experience: ReviewableExperienceProjection,
  reviews: PatientReviewProjection[],
  draft: ReviewSubmissionDraft,
  nowIso = REVIEW_NOW_ISO,
): ReviewSubmissionResult {
  const normalized = normalizedDraft(draft);
  if (!normalized.ratingValue || !normalized.content) {
    return { reviews, blockedBy: 'INVALID_INPUT' };
  }

  if (!experience.verifiedCompleted) {
    return { reviews, blockedBy: 'NOT_VERIFIED_COMPLETE' };
  }

  const fingerprint = commandFingerprint(experience.id, normalized);
  const activeReview = reviews.find((review) => review.experienceId === experience.id && review.state === 'ACTIVE');
  if (activeReview) {
    if (activeReview.commandFingerprint === fingerprint) {
      return { reviews, review: activeReview, reused: true };
    }
    return { reviews, review: activeReview, blockedBy: 'ACTIVE_REVIEW_EXISTS' };
  }

  if (new Date(experience.reviewWindowEndsAtIso).getTime() <= new Date(nowIso).getTime()) {
    return { reviews, blockedBy: 'WINDOW_EXPIRED' };
  }

  const review: PatientReviewProjection = {
    id: `review:${experience.id}`,
    experienceId: experience.id,
    caseId: experience.caseId,
    serviceLabel: experience.serviceLabel,
    providerName: experience.providerName,
    branchName: experience.branchName,
    treatingDentist: experience.treatingDentist,
    state: 'ACTIVE',
    ratingValue: normalized.ratingValue,
    content: normalized.content,
    submittedAtIso: nowIso,
    commandFingerprint: fingerprint,
  };

  return {
    reviews: [...reviews, review],
    review,
  };
}
