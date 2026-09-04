import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { PhoneEntryScreen } from './PhoneEntryScreen';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-002 Phone entry',
  component: PhoneEntryScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof PhoneEntryScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { onCodeRequested: () => {}, onBack: () => {} } };
