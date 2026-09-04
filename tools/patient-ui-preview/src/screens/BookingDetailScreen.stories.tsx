import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BookingDetailScreen } from './BookingDetailScreen';
import { optionsFor } from '../mocks/eligibility';
import type { BookingRecord } from '../mocks/booking';

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-004 Booking detail',
  component: BookingDetailScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof BookingDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const requested: BookingRecord = {
  id: 'BK-1001',
  state: 'REQUESTED',
  optionId: 'opt-1',
  slotIso: '2026-09-05T11:00:00+03:00',
  requestedAtIso: '2026-09-03T09:00:00+03:00',
  responseDeadlineIso: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
  history: [{ id: 'evt-1', atIso: '2026-09-03T09:00:00+03:00', description: 'تم إرسال طلب الحجز إلى العيادة.' }],
};

export const Requested: Story = {
  args: { booking: requested, option: optionsFor('svc-filling')[0], onCancelled: () => {}, onDone: () => {} },
};

export const EligibilityReview: Story = {
  args: {
    booking: { ...requested, state: 'ELIGIBILITY_REVIEW' },
    option: optionsFor('svc-filling')[0],
    onCancelled: () => {},
    onDone: () => {},
  },
};
