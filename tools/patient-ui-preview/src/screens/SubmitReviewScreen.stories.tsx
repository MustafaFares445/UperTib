import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  completedCleaningExperience,
  expiredReviewExperience,
  unverifiedReviewExperience,
} from '../mocks/reviews';
import { SubmitReviewScreen } from './SubmitReviewScreen';

const meta = {
  title: 'Patient/Screens/SCR-REVIEWS-002 Submit review',
  component: SubmitReviewScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof SubmitReviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onSubmit: () => {}, onCancel: () => {}, onOpenExistingReview: () => {} };

export const Default: Story = {
  args: {
    experience: completedCleaningExperience,
    initialRating: 4,
    initialContent: 'كانت التجربة واضحة، وتم شرح خطوات الزيارة بشكل جيد.',
    ...handlers,
  },
};

export const RatingOnly: Story = {
  args: {
    experience: completedCleaningExperience,
    initialRating: 5,
    ...handlers,
  },
};

export const EmptyFields: Story = {
  args: { experience: completedCleaningExperience, ...handlers },
};

export const Submitting: Story = {
  args: {
    experience: completedCleaningExperience,
    state: 'submitting',
    initialRating: 4,
    initialContent: 'كانت التجربة واضحة، وتم شرح خطوات الزيارة بشكل جيد.',
    ...handlers,
  },
};

export const WindowExpired: Story = {
  // The screen derives this from the governed deadline rather than trusting a caller-supplied flag.
  args: { experience: expiredReviewExperience, ...handlers },
};

export const ActiveReviewExists: Story = {
  args: { experience: completedCleaningExperience, state: 'active-review-exists', ...handlers },
};

export const NotVerified: Story = {
  // The screen derives this from verified-completion context.
  args: { experience: unverifiedReviewExperience, ...handlers },
};
