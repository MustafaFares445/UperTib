import { useMemo, useState } from 'react';
import {
  completedCleaningExperience,
  existingActiveReview,
  submitVerifiedReview,
  type PatientReviewProjection,
  type ReviewableExperienceProjection,
} from '../mocks/reviews';
import { MyReviewScreen } from '../screens/MyReviewScreen';
import { ReviewableExperiencesScreen } from '../screens/ReviewableExperiencesScreen';
import { SubmitReviewScreen } from '../screens/SubmitReviewScreen';

type Step = 'list' | 'submit' | 'review';

/** FLOW-REVIEWS-001 — local prototype of one verified review per completed experience. */
export function VerifiedReviewFlow() {
  const [step, setStep] = useState<Step>('list');
  const [reviews, setReviews] = useState<PatientReviewProjection[]>([existingActiveReview]);
  const [selectedExperience, setSelectedExperience] = useState<ReviewableExperienceProjection>(completedCleaningExperience);
  const [selectedReview, setSelectedReview] = useState<PatientReviewProjection>(existingActiveReview);

  const reviewable = useMemo(
    () => reviews.some((review) => review.experienceId === completedCleaningExperience.id && review.state === 'ACTIVE')
      ? []
      : [completedCleaningExperience],
    [reviews],
  );

  if (step === 'submit') {
    return (
      <SubmitReviewScreen
        experience={selectedExperience}
        initialRating={4}
        initialContent="كانت التجربة واضحة، وتم شرح خطوات الزيارة بشكل جيد."
        onSubmit={(draft) => {
          const result = submitVerifiedReview(selectedExperience, reviews, draft);
          if (!result.review || result.blockedBy) return;
          setReviews(result.reviews);
          setSelectedReview(result.review);
          setStep('review');
        }}
        onCancel={() => setStep('list')}
      />
    );
  }

  if (step === 'review') {
    return (
      <MyReviewScreen
        review={selectedReview}
        onBackToExperiences={() => setStep('list')}
      />
    );
  }

  return (
    <ReviewableExperiencesScreen
      reviewable={reviewable}
      existingReviews={reviews}
      onWriteReview={(experience) => {
        setSelectedExperience(experience);
        setStep('submit');
      }}
      onOpenReview={(review) => {
        setSelectedReview(review);
        setStep('review');
      }}
    />
  );
}
