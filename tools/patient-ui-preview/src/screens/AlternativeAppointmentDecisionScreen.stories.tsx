import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { alternativeAppointmentPending } from '../mocks/bookingRemaining';
import { findOption } from '../mocks/eligibility';
import { AlternativeAppointmentDecisionScreen } from './AlternativeAppointmentDecisionScreen';

const option = findOption('opt-1');
if (!option) throw new Error('Alternative appointment stories require opt-1.');

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-005 Alternative appointment decision',
  component: AlternativeAppointmentDecisionScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof AlternativeAppointmentDecisionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { option, onAccept: () => {}, onDecline: () => {}, onFreshRequest: () => {}, onRefresh: () => {} };
const state = (decisionState: typeof alternativeAppointmentPending.decisionState) => ({ ...alternativeAppointmentPending, decisionState });

export const PendingDecision: Story = { args: { ...base, proposal: alternativeAppointmentPending } };
export const AcceptedConfirmed: Story = { args: { ...base, proposal: state('accepted') } };
export const DeclinedClosedWithoutPenalty: Story = { args: { ...base, proposal: state('declined') } };
export const ExpiredClosedWithoutPenalty: Story = { args: { ...base, proposal: state('expired') } };
export const CapacityConflict: Story = { args: { ...base, proposal: state('capacity-conflict') } };
export const EligibilityConflict: Story = { args: { ...base, proposal: state('eligibility-conflict') } };
export const StaleDecisionWithdrawn: Story = { args: { ...base, proposal: alternativeAppointmentPending, state: 'stale' } };
export const OfflineDecisionWithdrawn: Story = { args: { ...base, proposal: alternativeAppointmentPending, state: 'offline' } };
export const OriginalRequestUnavailable: Story = {
  args: { ...base, proposal: { ...alternativeAppointmentPending, originalRequestReadable: false } },
};
export const PermissionDenied: Story = { args: { ...base, proposal: alternativeAppointmentPending, state: 'error-permission' } };
