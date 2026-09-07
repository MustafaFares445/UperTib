import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { acceptedTreatmentPlan, incompleteTreatmentPlan, proposedTreatmentPlan } from '../mocks/clinical';
import { TreatmentPlanReader } from './TreatmentPlanReader';

const meta = {
  title: 'Patient/Widgets/WGT-CLINICAL-002 Treatment plan reader',
  component: TreatmentPlanReader,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof TreatmentPlanReader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ProposedAmendment: Story = { args: { plan: proposedTreatmentPlan } };
export const AcceptedHistorical: Story = { args: { plan: acceptedTreatmentPlan } };
export const PartialNoTotal: Story = { args: { plan: incompleteTreatmentPlan } };
