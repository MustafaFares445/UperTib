import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { patientBookingSummaries } from '../mocks/bookingRemaining';
import { PLATFORM_AS_OF_ISO } from '../mocks/platform';
import { MyBookingsScreen } from './MyBookingsScreen';

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-003 My bookings',
  component: MyBookingsScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof MyBookingsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { onOpenBooking: () => {}, onRefresh: () => {} };

export const AllBookingStates: Story = { args: { ...base, bookings: patientBookingSummaries } };
export const ActionRequiredFirst: Story = { args: { ...base, bookings: patientBookingSummaries.slice(0, 2) } };
export const FilteredBookings: Story = { args: { ...base, bookings: patientBookingSummaries, initialQuery: 'مؤكَّد' } };
export const EmptyNoData: Story = { args: { ...base, bookings: [], state: 'empty-no-data' } };
export const StaleKnownData: Story = { args: { ...base, bookings: patientBookingSummaries, state: 'stale', asOfIso: PLATFORM_AS_OF_ISO } };
export const OfflineKnownData: Story = { args: { ...base, bookings: patientBookingSummaries, state: 'offline', asOfIso: PLATFORM_AS_OF_ISO } };
export const FetchFailure: Story = { args: { ...base, bookings: [], state: 'error-fetch' } };
export const PermissionDenied: Story = { args: { ...base, bookings: [], state: 'error-permission' } };
export const GuardianBookings: Story = {
  args: {
    ...base,
    bookings: patientBookingSummaries.map((booking) => ({ ...booking, subjectLabel: 'لين' })),
    subject: 'حجوزات لين',
    authority: 'أنت تتصرف نيابة عن لين ضمن صلاحية تمثيل فعّالة',
  },
};
