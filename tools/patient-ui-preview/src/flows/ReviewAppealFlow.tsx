import { useState } from 'react';
import {
  defaultAppealDraft,
  submitReviewAppeal,
  type ReviewAppealRecord,
} from '../mocks/reviewAppeals';
import { retiredPatientReview, type PatientReviewProjection } from '../mocks/reviews';
import { MyReviewScreen } from '../screens/MyReviewScreen';
import { ReviewAppealScreen } from '../screens/ReviewAppealScreen';

type Step = 'review' | 'appeal';

const APPEAL_IDEMPOTENCY_KEY = 'review-appeal:review-retired-006:attempt-1';

/** FLOW-REVIEWS-006 — Patient appeals a governed decision about their own review. */
export function ReviewAppealFlow() {
  const [step, setStep] = useState<Step>('review');
  const [review, setReview] = useState<PatientReviewProjection>(retiredPatientReview);
  const [appeal, setAppeal] = useState<ReviewAppealRecord | undefined>();

  if (step === 'appeal') {
    return (
      <ReviewAppealScreen
        review={review}
        appealRecord={appeal}
        initialGrounds={appeal?.grounds ?? defaultAppealDraft.grounds}
        onSubmit={(draft) => {
          const result = submitReviewAppeal(review, draft, {
            actorAuthorized: true,
            idempotencyKey: APPEAL_IDEMPOTENCY_KEY,
            existingAppeal: appeal,
          });

          if (!result.appeal || result.blockedBy) return;
          setReview(result.review);
          setAppeal(result.appeal);
        }}
        onBackToReview={() => setStep('review')}
      />
    );
  }

  return (
    <MyReviewScreen
      review={review}
      onBackToExperiences={() => {}}
      onAppeal={review.appeal ? undefined : () => setStep('appeal')}
    />
  );
}
