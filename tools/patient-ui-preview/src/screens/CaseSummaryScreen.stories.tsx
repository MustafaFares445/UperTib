import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { patientCases } from '../mocks/clinical';
import { CaseSummaryScreen } from './CaseSummaryScreen';

const meta = {
  title: 'Patient/Screens/SCR-CLINICAL-002 Case summary',
  component: CaseSummaryScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof CaseSummaryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const handlers = { onOpenPlan: () => {}, onOpenTimeline: () => {}, onActOutstanding: () => {} };
export const OutstandingAction: Story = { args: { item: patientCases[0], ...handlers } };
export const UpToDate: Story = { args: { item: patientCases[1], onOpenPlan: () => {}, onOpenTimeline: () => {} } };
