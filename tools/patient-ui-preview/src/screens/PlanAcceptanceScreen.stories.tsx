import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { proposedTreatmentPlan } from '../mocks/clinical';
import { PlanAcceptanceScreen } from './PlanAcceptanceScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-004 Plan acceptance',
  component: PlanAcceptanceScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof PlanAcceptanceScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onAccept: () => {}, onReviewPlan: () => {} };
export const Ready: Story = { args: { plan: proposedTreatmentPlan, ...handlers } };
export const Stale: Story = { args: { plan: proposedTreatmentPlan, state: 'stale', ...handlers } };
export const Accepted: Story = { args: { plan: proposedTreatmentPlan, state: 'accepted', ...handlers } };
