import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { emptyFinancialLedger, financialLedger, partialFinancialLedger } from '../mocks/finance';
import { FinancialTimelineScreen } from './FinancialTimelineScreen';

const meta = {
  title: 'Patient/Screens/SCR-FINANCE-002 Financial timeline',
  component: FinancialTimelineScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof FinancialTimelineScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onOpenTerms: () => {}, onBackToCase: () => {} };

export const Default: Story = { args: { ledger: financialLedger, ...handlers } };
export const PartialHistory: Story = { args: { ledger: partialFinancialLedger, ...handlers } };
export const NoEventsYet: Story = { args: { ledger: emptyFinancialLedger, ...handlers } };
