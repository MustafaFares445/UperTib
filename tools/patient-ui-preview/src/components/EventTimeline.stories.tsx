import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { EventTimeline } from './EventTimeline';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-008 Event timeline',
  component: EventTimeline,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof EventTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithEvents: Story = {
  args: {
    events: [
      { id: '1', atIso: '2026-09-03T09:00:00+03:00', description: 'تم إرسال طلب الحجز إلى العيادة.' },
      { id: '2', atIso: '2026-09-03T09:05:00+03:00', description: 'تم استلام الطلب من العيادة.' },
    ],
  },
};

export const Empty: Story = { args: { events: [] } };
