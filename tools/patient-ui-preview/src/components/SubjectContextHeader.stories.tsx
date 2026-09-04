import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SubjectContextHeader } from './SubjectContextHeader';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-003 Subject context header',
  component: SubjectContextHeader,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof SubjectContextHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Self: Story = { args: { subject: 'مراجعة طلب الحجز', authority: 'لحسابك' } };
export const UnderGuardianGrant: Story = {
  args: { subject: 'حجز لـ سارة (12 سنة)', authority: 'بصفتك ولي الأمر — ضمن الصلاحية الممنوحة' },
};
