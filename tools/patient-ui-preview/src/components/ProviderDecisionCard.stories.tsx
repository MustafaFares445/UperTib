import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ProviderDecisionCard } from './ProviderDecisionCard';
import { optionsFor } from '../mocks/eligibility';

const options = optionsFor('svc-filling');

const meta = {
  title: 'Patient/Components/CMP-ELIG-001 Provider decision card',
  component: ProviderDecisionCard,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProviderDecisionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = { args: { option: options[0], variant: 'row' } };
export const Card: Story = { args: { option: options[0], variant: 'card' } };
export const Chosen: Story = { args: { option: options[0], variant: 'chosen' } };

export const PriceModes: Story = {
  args: { option: options[0], variant: 'row' },
  render: () => (
    <View style={{ gap: 12, padding: 24 }}>
      {options.map((option) => (
        <ProviderDecisionCard key={option.id} option={option} variant="row" />
      ))}
    </View>
  ),
};

export const NotCurrentlyEligible: Story = {
  args: {
    option: { ...options[0], id: 'opt-not-eligible', eligibility: 'SUSPENDED' },
    variant: 'card',
  },
};
