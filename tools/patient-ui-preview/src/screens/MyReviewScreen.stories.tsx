import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  existingActiveReview,
  retiredNoAppealReview,
  retiredPatientReview,
} from '../mocks/reviews';
import { MyReviewScreen } from './MyReviewScreen';

const meta = {
  title: 'Patient/Screens/SCR-REVIEWS-003 My review',
  component: MyReviewScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof MyReviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { review: existingActiveReview, onBackToExperiences: () => {} },
};

export const Retired: Story = {
  args: { review: retiredPatientReview, onBackToExperiences: () => {}, onAppeal: () => {} },
};

export const RetiredNoAppeal: Story = {
  args: { review: retiredNoAppealReview, onBackToExperiences: () => {} },
};

export const AppealSubmitted: Story = {
  args: {
    review: {
      ...retiredPatientReview,
      appeal: {
        state: 'SUBMITTED',
        submittedAtIso: '2026-09-06T20:30:00+03:00',
      },
    },
    onBackToExperiences: () => {},
  },
};

export const AppealDecided: Story = {
  args: {
    review: {
      ...retiredPatientReview,
      appeal: {
        state: 'DECIDED',
        submittedAtIso: '2026-09-01T10:00:00+03:00',
        decidedAtIso: '2026-09-04T13:00:00+03:00',
        decisionReason: 'صدر قرار مستقل بشأن الاعتراض، والسبب المسجّل ظاهر هنا دون تعديل نص التقييم الأصلي.',
      },
    },
    onBackToExperiences: () => {},
  },
};
