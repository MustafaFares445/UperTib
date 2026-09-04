import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Heading2 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { SlotSelector } from '../widgets/SlotSelector';
import type { Slot } from '../mocks/booking';

export interface SlotSelectionScreenProps {
  option: ProviderOption;
  slots: Slot[];
  onContinue: (slot: Slot) => void;
  onChangeOption: () => void;
}

/**
 * SCR-BOOKING-001 — Slot selection. Lets the patient choose a time for the option they picked.
 * Availability here is advisory; the time is held atomically only at commit (WGT-BOOKING-001).
 */
export function SlotSelectionScreen({ option, slots, onContinue, onChangeOption }: SlotSelectionScreenProps) {
  const [selected, setSelected] = useState<Slot | null>(null);

  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            {
              key: 'continue',
              label: 'متابعة إلى المراجعة',
              role: 'primary',
              availability: selected ? { status: 'available' } : { status: 'disabled', reason: 'اختر وقتًا للمتابعة.' },
              onPress: () => selected && onContinue(selected),
            },
            { key: 'change', label: 'تغيير الخيار', role: 'secondary', availability: { status: 'available' }, onPress: onChangeOption },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <Heading2>اختيار الموعد</Heading2>
        <ProviderDecisionCard option={option} variant="chosen" />
        <SlotSelector slots={slots} selectedId={selected?.id ?? null} onSelect={setSelected} />
      </Stack>
    </Screen>
  );
}
