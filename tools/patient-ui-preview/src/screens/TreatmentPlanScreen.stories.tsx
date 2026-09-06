import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { acceptedTreatmentPlan, incompleteTreatmentPlan, proposedTreatmentPlan } from '../mocks/clinical';
import { TreatmentPlanScreen } from './TreatmentPlanScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-003 Treatment plan',
  component: TreatmentPlanScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof TreatmentPlanScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onReviewAcceptance: () => {}, onOpenFinance: () => {}, onBackToCase: () => {} };
export const ProposedAmendment: Story = { args: { plan: proposedTreatmentPlan, ...handlers } };
export const Accepted: Story = { args: { plan: acceptedTreatmentPlan, ...handlers } };
export const Incomplete: Story = { args: { plan: incompleteTreatmentPlan, ...handlers } };
