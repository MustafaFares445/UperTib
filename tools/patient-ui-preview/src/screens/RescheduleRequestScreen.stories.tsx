import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import {
  rescheduleAccepted,
  rescheduleClinicPending,
  rescheduleCreateProjection,
  rescheduleDeclined,
  rescheduleExpired,
  reschedulePatientPending,
  rescheduleWithdrawn,
} from '../mocks/bookingRemaining';
import { findOption } from '../mocks/eligibility';
import { RescheduleRequestScreen } from './RescheduleRequestScreen';

const option = findOption('opt-1');
if (!option) throw new Error('Reschedule stories require opt-1.');

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-016 Reschedule request',
  component: RescheduleRequestScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RescheduleRequestScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = {
  option,
  onCreateProposal: () => {},
  onAcceptProposal: () => {},
  onDeclineProposal: () => {},
  onWithdrawProposal: () => {},
  onRefresh: () => {},
};

export const CreateProposal: Story = { args: { ...base, projection: rescheduleCreateProjection } };
export const PatientOriginatedPending: Story = { args: { ...base, projection: reschedulePatientPending } };
export const ClinicOriginatedPendingNeedsPatient: Story = { args: { ...base, projection: rescheduleClinicPending } };
export const AcceptedMovesBooking: Story = { args: { ...base, projection: rescheduleAccepted } };
export const DeclinedKeepsOriginal: Story = { args: { ...base, projection: rescheduleDeclined } };
export const ExpiredKeepsOriginal: Story = { args: { ...base, projection: rescheduleExpired } };
export const WithdrawnKeepsOriginal: Story = { args: { ...base, projection: rescheduleWithdrawn } };
export const StaleActionsWithdrawn: Story = { args: { ...base, projection: rescheduleClinicPending, state: 'stale' } };
export const OfflineActionsWithdrawn: Story = { args: { ...base, projection: rescheduleClinicPending, state: 'offline' } };
export const PolicyDisallowsProposal: Story = {
  args: { ...base, projection: { ...rescheduleCreateProjection, policyAllowsProposal: false } },
};
export const PermissionDenied: Story = { args: { ...base, projection: rescheduleClinicPending, state: 'error-permission' } };
