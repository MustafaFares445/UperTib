import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { IdentityEntryScreen } from './IdentityEntryScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-001 Patient entry',
  component: IdentityEntryScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof IdentityEntryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onVerify: () => {}, onBrowse: () => {} } };
