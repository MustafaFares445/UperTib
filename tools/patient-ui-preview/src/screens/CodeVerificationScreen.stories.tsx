import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CodeVerificationScreen } from './CodeVerificationScreen';
import { requestChallenge } from '../mocks/identity';

const meta = {
  title: 'Patient/Screens/SCR-IDENTITY-003 Code verification',
  component: CodeVerificationScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof CodeVerificationScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phone: '0912345678',
    challenge: requestChallenge('0912345678'),
    onVerified: () => {},
    onChangeNumber: () => {},
  },
};

export const AttemptsExhausted: Story = {
  args: {
    phone: '0912345678',
    challenge: { ...requestChallenge('0912345678'), attemptsRemaining: 0 },
    onVerified: () => {},
    onChangeNumber: () => {},
  },
};
