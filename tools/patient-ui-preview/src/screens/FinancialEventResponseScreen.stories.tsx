import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { awaitingPatientResponseEvent } from '../mocks/finance';
import { FinancialEventResponseScreen } from './FinancialEventResponseScreen';

const meta = {
  title: 'Patient/Screens/SCR-FINANCE-004 Financial event response',
  component: FinancialEventResponseScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof FinancialEventResponseScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onConfirm: () => {}, onDispute: () => {}, onBackToTimeline: () => {} };

export const Ready: Story = { args: { event: awaitingPatientResponseEvent, ...handlers } };
export const ReadyForDispute: Story = {
  args: { event: awaitingPatientResponseEvent, initialReason: 'المبلغ المسجّل لا يطابق ما دفعته للعيادة.', ...handlers },
};
export const SubmittingConfirm: Story = { args: { event: awaitingPatientResponseEvent, state: 'submitting-confirm', ...handlers } };
export const Confirmed: Story = { args: { event: awaitingPatientResponseEvent, state: 'responded-confirmed', ...handlers } };
export const Disputed: Story = {
  args: {
    event: awaitingPatientResponseEvent,
    state: 'responded-disputed',
    initialReason: 'المبلغ المسجّل لا يطابق ما دفعته للعيادة.',
    ...handlers,
  },
};
