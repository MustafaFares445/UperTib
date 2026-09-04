import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { SlotSelector } from './SlotSelector';
import { slotsFor, type Slot } from '../mocks/booking';

const meta = {
  title: 'Patient/Widgets/WGT-BOOKING-001 Slot selector',
  component: SlotSelector,
  parameters: { a11y: { test: 'error' } },
} satisfies Meta<typeof SlotSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { slots: slotsFor('opt-1'), selectedId: null, onSelect: () => {} },
  render: () => {
    const [selected, setSelected] = useState<Slot | null>(null);
    return <SlotSelector slots={slotsFor('opt-1')} selectedId={selected?.id ?? null} onSelect={setSelected} />;
  },
};
