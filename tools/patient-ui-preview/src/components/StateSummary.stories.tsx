import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { StateSummary } from './StateSummary';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-002 State summary',
  component: StateSummary,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof StateSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RequestedBooking: Story = {
  args: {
    machine: 'booking',
    status: 'REQUESTED',
    label: 'بانتظار تأكيد العيادة',
    meaning: 'وصل طلبك إلى العيادة، لكنه ليس موعدًا مؤكَّدًا بعد.',
    nextStep: 'لا يلزمك إجراء الآن. انتظر رد العيادة ضمن المهلة الظاهرة.',
  },
};

export const ConfirmedBooking: Story = {
  args: {
    machine: 'booking',
    status: 'CONFIRMED',
    label: 'الموعد مؤكَّد',
    meaning: 'وافقت العيادة وأصبح الموعد مثبتًا.',
    nextStep: 'احتفظ بموعدك أو اطلب تغييره إذا لم يعد مناسبًا.',
  },
};
