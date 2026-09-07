import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { EligibilityDecisionBlock } from './EligibilityDecisionBlock';
import { explanationFor, optionsFor } from '../mocks/eligibility';

const meta = {
  title: 'Patient/Widgets/WGT-ELIG-002 Eligibility decision block',
  component: EligibilityDecisionBlock,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof EligibilityDecisionBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

const option = optionsFor('svc-filling')[0];

export const Eligible: Story = { args: { explanation: explanationFor(option) } };
export const PendingEvaluation: Story = {
  args: { explanation: explanationFor({ ...option, eligibility: 'PENDING_EVALUATION' }) },
};
export const Suspended: Story = {
  args: { explanation: explanationFor({ ...option, eligibility: 'SUSPENDED' }) },
};
export const NotEligible: Story = {
  args: { explanation: explanationFor({ ...option, eligibility: 'NOT_ELIGIBLE' }) },
};
