import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ServiceDetailScreen } from './ServiceDetailScreen';
import { findFamily } from '../mocks/catalog';

const meta = {
  title: 'Patient/Screens/SCR-CATALOG-002 Service detail',
  component: ServiceDetailScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ServiceDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { family: findFamily('svc-filling')!, onFindProviders: () => {}, onBack: () => {} },
};
