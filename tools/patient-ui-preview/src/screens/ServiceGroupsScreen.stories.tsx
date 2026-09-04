import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ServiceGroupsScreen } from './ServiceGroupsScreen';

const meta = {
  title: 'Patient/Screens/SCR-CATALOG-001 Service groups',
  component: ServiceGroupsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ServiceGroupsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onChooseFamily: () => {} } };
