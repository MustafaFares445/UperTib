import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ActionBar } from './ActionBar';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-004 Action bar',
  component: ActionBar,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryAndSecondary: Story = {
  args: {
    actions: [
      { key: 'p', label: 'إرسال الطلب', role: 'primary', availability: { status: 'available' } },
      { key: 's', label: 'رجوع', role: 'secondary', availability: { status: 'available' } },
    ],
  },
};

export const DisabledWithReason: Story = {
  args: {
    actions: [
      { key: 'p', label: 'طلب رمز التحقق', role: 'primary', availability: { status: 'disabled', reason: 'يمكن طلب رمز جديد خلال 30 ثانية.' } },
    ],
  },
};

export const AbsentWithReason: Story = {
  args: {
    actions: [
      { key: 'p', label: 'حجز هذا الخيار', role: 'primary', availability: { status: 'absent', reason: 'هذا الخيار لم يعد متاحًا للحجز حاليًا.' } },
      { key: 's', label: 'رجوع إلى النتائج', role: 'secondary', availability: { status: 'available' } },
    ],
  },
};

export const DestructiveNeverPrimary: Story = {
  args: {
    actions: [
      { key: 'd', label: 'إلغاء الطلب', role: 'destructive', availability: { status: 'available' } },
      { key: 's', label: 'تم', role: 'secondary', availability: { status: 'available' } },
    ],
  },
};

export const Loading: Story = {
  args: {
    actions: [{ key: 'p', label: 'إرسال الطلب', role: 'primary', availability: { status: 'loading' } }],
  },
};
