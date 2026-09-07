import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { emptyFinancialLedger, financialLedger, partialFinancialLedger } from '../mocks/finance';
import { ExternalFinancialLedger } from './ExternalFinancialLedger';

const meta = {
  title: 'Patient/Widgets/WGT-FINANCE-001 External financial event ledger',
  component: ExternalFinancialLedger,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ExternalFinancialLedger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PatientLedger: Story = { args: { ledger: financialLedger } };
export const PartialHistory: Story = { args: { ledger: partialFinancialLedger } };
export const NoEventsYet: Story = { args: { ledger: emptyFinancialLedger } };
