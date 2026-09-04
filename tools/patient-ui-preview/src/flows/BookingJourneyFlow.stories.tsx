import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BookingJourneyFlow } from './BookingJourneyFlow';

const meta = {
  title: 'Patient/Flows/FLOW-BOOKING-001 Booking journey',
  component: BookingJourneyFlow,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof BookingJourneyFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The full Slice 1 clickable journey: entry -> identity verification -> service discovery ->
 * eligibility/provider selection -> slot -> request review -> booking detail (REQUESTED). Uses
 * the demo verification code 123456. Local state only — no production navigation library.
 */
export const Default: Story = {};
