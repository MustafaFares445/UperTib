import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { optionsFor } from '../mocks/eligibility';
import type { BookingRecord } from '../mocks/booking';
import { BookingDetailScreen } from './BookingDetailScreen';

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-004 Booking detail',
  component: BookingDetailScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof BookingDetailScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const responseDeadlineIso = new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString();
const alternativeResponseDeadlineIso = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

const requested: BookingRecord = {
  id: 'BK-1001',
  state: 'REQUESTED',
  optionId: 'opt-1',
  slotIso: '2026-09-05T11:00:00+03:00',
  requestedAtIso: '2026-09-03T09:00:00+03:00',
  responseDeadlineIso,
  allowedActions: ['cancel'],
  history: [{ id: 'evt-1', atIso: '2026-09-03T09:00:00+03:00', description: 'تم إرسال طلب الحجز إلى العيادة.' }],
};

const args = { option: optionsFor('svc-filling')[0], onCancelled: () => {}, onDone: () => {}, onAcceptAlternative: () => {}, onReschedule: () => {}, onFindAlternative: () => {} };

export const Requested: Story = { args: { ...args, booking: requested } };

export const AlternativeProposed: Story = {
  args: {
    ...args,
    booking: {
      ...requested,
      state: 'ALTERNATIVE_PROPOSED',
      alternativeSlotIso: '2026-09-06T09:30:00+03:00',
      alternativeResponseDeadlineIso,
      allowedActions: ['respond-alternative'],
      history: [...requested.history, { id: 'evt-2', atIso: '2026-09-03T12:00:00+03:00', description: 'اقترحت العيادة موعدًا بديلًا.' }],
    },
  },
};

export const Confirmed: Story = {
  args: { ...args, booking: { ...requested, state: 'CONFIRMED', allowedActions: ['cancel', 'reschedule'], history: [...requested.history, { id: 'evt-2', atIso: '2026-09-03T10:15:00+03:00', description: 'أكدت العيادة الموعد.' }] } },
};

export const EligibilityReview: Story = {
  args: { ...args, booking: { ...requested, state: 'ELIGIBILITY_REVIEW', allowedActions: [], stateReason: 'تراجع المنصة أهلية هذا الموعد مع العيادة. سيصلك تحديث عند اكتمال المراجعة.' } },
};

export const Rejected: Story = {
  args: { ...args, booking: { ...requested, state: 'REJECTED', allowedActions: [], stateReason: 'لم تتمكن العيادة من قبول الموعد المطلوب.' } },
};

export const Cancelled: Story = {
  args: { ...args, booking: { ...requested, state: 'CANCELLED', allowedActions: [], stateReason: 'أُغلق الطلب بناءً على إلغائه، دون أي دفعة أو غرامة.' } },
};
