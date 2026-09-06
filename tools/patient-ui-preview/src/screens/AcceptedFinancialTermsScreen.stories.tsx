import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { acceptedFinancialTerms, partialAcceptedFinancialTerms } from '../mocks/finance';
import { AcceptedFinancialTermsScreen } from './AcceptedFinancialTermsScreen';

const meta = {
  title: 'Patient/Screens/SCR-FINANCE-001 Accepted financial terms',
  component: AcceptedFinancialTermsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof AcceptedFinancialTermsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onOpenTimeline: () => {}, onBackToCase: () => {} };

export const Default: Story = { args: { snapshot: acceptedFinancialTerms, ...handlers } };
export const PartialLines: Story = { args: { snapshot: partialAcceptedFinancialTerms, ...handlers } };
