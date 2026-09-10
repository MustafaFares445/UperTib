import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  cancellationPolicyNoFee,
  cancellationPolicyReasonRequired,
} from '../mocks/bookingRemaining';
import { findOption } from '../mocks/eligibility';
import { CancelBookingScreen } from './CancelBookingScreen';

const option = findOption('opt-1');
if (!option) throw new Error('Cancel booking stories require opt-1.');

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-006 Cancel booking',
  component: CancelBookingScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof CancelBookingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  option,
  onKeepBooking: () => {},
  onConfirmCancellation: () => {},
  onRefresh: () => {},
};

export const ConsequenceBeforeConfirmation: Story = { args: { ...base, policy: cancellationPolicyNoFee } };
export const PolicyRequiresReason: Story = { args: { ...base, policy: cancellationPolicyReasonRequired } };
export const PolicyConsequenceUnavailable: Story = {
  args: { ...base, policy: { ...cancellationPolicyNoFee, consequence: undefined } },
};
export const StalePolicyWithdrawsCancellation: Story = { args: { ...base, policy: cancellationPolicyNoFee, state: 'stale' } };
export const OfflinePolicyWithdrawsCancellation: Story = { args: { ...base, policy: cancellationPolicyNoFee, state: 'offline' } };
export const CommittingIdempotentCancellation: Story = { args: { ...base, policy: cancellationPolicyNoFee, state: 'committing' } };
export const CancellationCommitted: Story = { args: { ...base, policy: cancellationPolicyNoFee, state: 'committed' } };
export const PermissionDenied: Story = { args: { ...base, policy: cancellationPolicyNoFee, state: 'error-permission' } };
