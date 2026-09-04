import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { DeadlineIndicator } from './DeadlineIndicator';

const meta = {
  title: 'Patient/Components/CMP-PLATFORM-005 Deadline indicator',
  component: DeadlineIndicator,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof DeadlineIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: {
    obligation: 'الرد على طلب الحجز',
    deadlineIso: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
  },
};

export const Approaching: Story = {
  args: {
    obligation: 'الرد على طلب الحجز',
    deadlineIso: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    state: 'approaching',
  },
};

export const Lapsed: Story = {
  args: {
    obligation: 'الرد على طلب الحجز',
    deadlineIso: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
};
