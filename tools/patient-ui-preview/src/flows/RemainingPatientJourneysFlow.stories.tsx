import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { RemainingPatientJourneysFlow } from './RemainingPatientJourneysFlow';

const meta = {
  title: 'Patient/Flows/Remaining canonical Patient journeys',
  component: RemainingPatientJourneysFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof RemainingPatientJourneysFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AttentionNotificationReentry: Story = {
  args: { journey: 'attention-notification-reentry' },
};

export const BookingAlternativeCancellationAndReschedule: Story = {
  args: { journey: 'booking-change' },
};

export const ProfileToRepresentation: Story = {
  args: { journey: 'profile-representation' },
};

export const FollowUpToCase: Story = {
  args: { journey: 'follow-up-reentry' },
};
