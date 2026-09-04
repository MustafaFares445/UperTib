import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StateChip } from './StateChip';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-001 State chip',
  component: StateChip,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof StateChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PendingEvaluationVsNotEligible: Story = {
  args: { machine: 'eligibility-outcome', status: 'ELIGIBLE', label: 'مؤهَّل' },
  render: () => (
    <View style={{ gap: 12, padding: 24 }}>
      <StateChip machine="eligibility-outcome" status="PENDING_EVALUATION" label="قيد التقييم" />
      <StateChip machine="eligibility-outcome" status="ELIGIBLE" label="مؤهَّل" />
      <StateChip machine="eligibility-outcome" status="SUSPENDED" label="معلَّق مؤقتًا" />
      <StateChip machine="eligibility-outcome" status="NOT_ELIGIBLE" label="غير مؤهَّل حاليًا" />
    </View>
  ),
};

export const BookingStates: Story = {
  args: { machine: 'booking', status: 'REQUESTED', label: 'بانتظار تأكيد العيادة' },
  render: () => (
    <View style={{ gap: 12, padding: 24 }}>
      <StateChip machine="booking" status="REQUESTED" label="بانتظار تأكيد العيادة" />
      <StateChip machine="booking" status="ALTERNATIVE_PROPOSED" label="عُرض موعد بديل" />
      <StateChip machine="booking" status="CONFIRMED" label="مؤكَّد" />
      <StateChip machine="booking" status="ELIGIBILITY_REVIEW" label="قيد مراجعة الأهلية" />
      <StateChip machine="booking" status="REJECTED" label="مرفوض" />
      <StateChip machine="booking" status="CANCELLED" label="لم يُؤكَّد الحجز" />
    </View>
  ),
};
