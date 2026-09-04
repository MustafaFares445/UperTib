import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { BookingReviewScreen } from './BookingReviewScreen';
import { optionsFor } from '../mocks/eligibility';
import { slotsFor } from '../mocks/booking';

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-002 Request review and submit',
  component: BookingReviewScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof BookingReviewScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    option: optionsFor('svc-filling')[0],
    slot: slotsFor('opt-1')[0],
    onSubmitted: () => {},
    onChangeTime: () => {},
    onChangeOption: () => {},
  },
};
