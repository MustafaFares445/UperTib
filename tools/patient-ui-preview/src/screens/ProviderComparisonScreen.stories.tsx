import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { optionsFor } from '../mocks/eligibility';
import { ProviderComparisonScreen } from './ProviderComparisonScreen';

const meta = {
  title: 'Patient/Screens/SCR-ELIG-005 Provider comparison',
  component: ProviderComparisonScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProviderComparisonScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoOptions: Story = {
  args: {
    options: optionsFor('svc-filling').slice(0, 2),
    onBook: () => {},
    onOpen: () => {},
    onBack: () => {},
  },
};

export const ThreeOptions: Story = {
  args: {
    options: optionsFor('svc-filling'),
    onBook: () => {},
    onOpen: () => {},
    onBack: () => {},
  },
};
