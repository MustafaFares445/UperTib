import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ProviderSearchScreen } from './ProviderSearchScreen';
import { findFamily } from '../mocks/catalog';

const meta = {
  title: 'Patient/Screens/SCR-ELIG-001 Provider search',
  component: ProviderSearchScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ProviderSearchScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { family: findFamily('svc-filling')!, onSearch: () => {}, onChangeService: () => {} },
};
