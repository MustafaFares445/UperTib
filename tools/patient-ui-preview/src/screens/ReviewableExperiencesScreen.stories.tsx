import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  approachingReviewExperience,
  completedCleaningExperience,
  existingActiveReview,
  retiredPatientReview,
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
    reviewable: [completedCleaningExperience, approachingReviewExperience],
    existingReviews: [],
    ...handlers,
  },
};

export const Empty: Story = {
  args: { reviewable: [], existingReviews: [], ...handlers },
};

export const ExistingReviews: Story = {
  args: {
    reviewable: [completedCleaningExperience],
    existingReviews: [existingActiveReview, retiredPatientReview],
    ...handlers,
  },
};
