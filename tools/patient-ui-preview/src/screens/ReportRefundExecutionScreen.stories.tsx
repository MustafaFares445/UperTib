import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  approvedRefundDecision,
  refundExecutionEvidenceIds,
  refundExecutionEvidenceSummary,
} from '../mocks/finance';
import { ReportRefundExecutionScreen } from './ReportRefundExecutionScreen';

const meta = {
  title: 'Patient/Screens/SCR-FINANCE-005 Report refund execution',
  component: ReportRefundExecutionScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ReportRefundExecutionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onSubmit: () => {}, onCancel: () => {}, onOpenTimeline: () => {} };
const ready = {
  decision: approvedRefundDecision,
  initialAmount: '20000',
  initialCurrency: 'SYP',
  initialOccurredAt: '2026-09-06T18:50:00+03:00',
  evidenceIds: refundExecutionEvidenceIds,
  evidenceSummary: refundExecutionEvidenceSummary,
  ...handlers,
};

export const Default: Story = { args: ready };
export const MissingOccurrenceTime: Story = {
  args: { ...ready, initialOccurredAt: '' },
};
export const DecisionMismatch: Story = {
  args: { ...ready, state: 'mismatch', initialAmount: '15000', initialCurrency: 'USD' },
};
export const Submitting: Story = { args: { ...ready, state: 'submitting' } };
export const Submitted: Story = { args: { ...ready, state: 'submitted' } };
export const NoApprovedDecision: Story = { args: { ...handlers } };
