import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { acceptedFinancialTerms, partialAcceptedFinancialTerms } from '../mocks/finance';
import { ReportExternalPaymentScreen } from './ReportExternalPaymentScreen';

const meta = {
  title: 'Patient/Screens/SCR-FINANCE-003 Report external payment',
  component: ReportExternalPaymentScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ReportExternalPaymentScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onSubmit: () => {}, onCancel: () => {}, onOpenTimeline: () => {} };
const filled = {
  snapshot: acceptedFinancialTerms,
  initialAmount: '20000',
  initialCurrency: 'SYP',
  initialMethod: 'نقدًا خارج المنصة',
  initialOccurredAt: '2026-09-06T17:20:00+03:00',
  ...handlers,
};

export const Default: Story = { args: filled };
export const EmptyFields: Story = { args: { snapshot: acceptedFinancialTerms, ...handlers } };
export const IncompleteTerms: Story = { args: { ...filled, snapshot: partialAcceptedFinancialTerms } };
export const Submitting: Story = { args: { ...filled, state: 'submitting' } };
export const Submitted: Story = { args: { ...filled, state: 'submitted' } };
export const TermsMismatch: Story = { args: { ...filled, state: 'mismatch', initialCurrency: 'USD' } };
