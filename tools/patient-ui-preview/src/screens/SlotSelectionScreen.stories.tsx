import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SlotSelectionScreen } from './SlotSelectionScreen';
import { optionsFor } from '../mocks/eligibility';
import { slotsFor } from '../mocks/booking';

const meta = {
  title: 'Patient/Screens/SCR-BOOKING-001 Slot selection',
  component: SlotSelectionScreen,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof SlotSelectionScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    option: optionsFor('svc-filling')[0],
    slots: slotsFor('opt-1'),
    onContinue: () => {},
    onChangeOption: () => {},
  },
};
