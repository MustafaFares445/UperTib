import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PriceDisplay } from './PriceDisplay';

const meta = {
  title: 'Patient/Components/CMP-ELIG-002 Price display',
  component: PriceDisplay,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof PriceDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllGovernedModes: Story = {
  args: { price: { mode: 'fixed', amount: 60000, currency: 'SYP' } },
  render: () => (
    <View style={{ gap: 16, padding: 24 }}>
      <PriceDisplay price={{ mode: 'fixed', amount: 60000, currency: 'SYP' }} />
      <PriceDisplay price={{ mode: 'from', amount_min: 45000, currency: 'SYP' }} />
      <PriceDisplay price={{ mode: 'range', amount_min: 40000, amount_max: 80000, currency: 'SYP' }} />
      <PriceDisplay price={{ mode: 'free', currency: 'SYP' }} />
      <PriceDisplay price={{ mode: 'requires-plan', currency: 'SYP' }} />
    </View>
  ),
};
