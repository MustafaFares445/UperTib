import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  approachingReviewExperience,
  completedCleaningExperience,
  existingActiveReview,
  expiredReviewExperience,
  retiredPatientReview,
  unverifiedReviewExperience,
} from '../mocks/reviews';
import { ReviewableExperiencesScreen } from './ReviewableExperiencesScreen';

const meta = {
  title: 'Patient/Screens/SCR-REVIEWS-001 Reviewable experiences',
  component: ReviewableExperiencesScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ReviewableExperiencesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onWriteReview: () => {}, onOpenReview: () => {}, onBackToCase: () => {} };

export const Default: Story = {
  args: {
    // Invalid candidates are intentionally present in the input so the screen-level structural
    // filter is exercised: they must never become disabled/fake review opportunities.
    reviewable: [
      completedCleaningExperience,
      approachingReviewExperience,
      expiredReviewExperience,
      unverifiedReviewExperience,
    ],
    existingReviews: [],
    ...handlers,
  },
};

export const Empty: Story = {
  args: { reviewable: [], existingReviews: [], ...handlers },
};

export const ExistingReviews: Story = {
  args: {
    // approachingReviewExperience is also supplied as a candidate, but its ACTIVE review below
    // removes the duplicate write opportunity at the screen boundary.
    reviewable: [completedCleaningExperience, approachingReviewExperience],
    existingReviews: [existingActiveReview, retiredPatientReview],
    ...handlers,
  },
};
