import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProviderDecisionScreen } from './ProviderDecisionScreen';
import { optionsFor } from '../mocks/eligibility';

const meta = {
  title: 'Patient/Screens/SCR-ELIG-003 Provider decision card',
  component: ProviderDecisionScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProviderDecisionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { option: optionsFor('svc-filling')[0], onBook: () => {}, onBackToResults: () => {} },
};

export const NoLongerEligible: Story = {
  args: {
    option: { ...optionsFor('svc-filling')[0], eligibility: 'SUSPENDED' },
    onBook: () => {},
    onBackToResults: () => {},
  },
};
