import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  decidedReviewAppeal,
  defaultAppealDraft,
  retiredReviewWithDecidedAppeal,
  retiredReviewWithExpiredAppealWindow,
  retiredReviewWithSubmittedAppeal,
  retiredReviewWithoutReadableDecision,
  submittedReviewAppeal,
} from '../mocks/reviewAppeals';
import { retiredNoAppealReview, retiredPatientReview } from '../mocks/reviews';
import { ReviewAppealScreen } from './ReviewAppealScreen';

const meta = {
  title: 'Patient/Screens/SCR-REVIEWS-004 Review appeal',
  component: ReviewAppealScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ReviewAppealScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = {
  onSubmit: () => {},
  onBackToReview: () => {},
  onRetryDecision: () => {},
};

export const Default: Story = {
  args: {
    review: retiredPatientReview,
    initialGrounds: defaultAppealDraft.grounds,
    ...handlers,
  },
};

export const EmptyGrounds: Story = {
  args: {
    review: retiredPatientReview,
    ...handlers,
  },
};

export const RetryableFailure: Story = {
  args: {
    review: retiredPatientReview,
    submitState: 'retryable-failure',
    initialGrounds: defaultAppealDraft.grounds,
    ...handlers,
  },
};

export const WithSupportingEvidence: Story = {
  args: {
    review: retiredPatientReview,
    initialGrounds: defaultAppealDraft.grounds,
    supportingEvidence: [
      { id: 'evidence-policy-copy-001', label: 'نسخة من الإشعار المرتبط بقرار الأرشفة' },
    ],
    ...handlers,
  },
};

export const WindowExpired: Story = {
  args: {
    review: retiredReviewWithExpiredAppealWindow,
    initialGrounds: defaultAppealDraft.grounds,
    ...handlers,
  },
};

export const NotAuthorized: Story = {
  args: {
    review: retiredPatientReview,
    actorAuthorized: false,
    initialGrounds: defaultAppealDraft.grounds,
    ...handlers,
  },
};

export const PolicyNoAppeal: Story = {
  args: {
    review: retiredNoAppealReview,
    initialGrounds: defaultAppealDraft.grounds,
    ...handlers,
  },
};

export const DecisionUnavailable: Story = {
  args: {
    review: retiredReviewWithoutReadableDecision,
    initialGrounds: defaultAppealDraft.grounds,
    ...handlers,
  },
};

export const Submitted: Story = {
  args: {
    review: retiredReviewWithSubmittedAppeal,
    appealRecord: submittedReviewAppeal,
    ...handlers,
  },
};

export const Decided: Story = {
  args: {
    review: retiredReviewWithDecidedAppeal,
    appealRecord: decidedReviewAppeal,
    ...handlers,
  },
};
