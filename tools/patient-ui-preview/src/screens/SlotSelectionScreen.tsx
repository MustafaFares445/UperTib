import { useState } from 'react';
import { View } from 'react-native';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2, Heading4 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { PriceDisplay } from '../components/PriceDisplay';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { SlotSelector } from '../widgets/SlotSelector';
import type { Slot } from '../mocks/booking';
import { color, radius, space } from '../theme/tokens';

export interface SlotSelectionScreenProps {
  option: ProviderOption;
  slots: Slot[];
  onContinue: (slot: Slot) => void;
  onChangeOption: () => void;
}

/**
 * The chosen option is context here, not the task: name, service and price are the three facts
 * that still bear on picking a time. Everything else in the full echo (branch/area, eligibility,
 * protection, rating, assessed-at) stays reachable one tap away via the footer's details toggle —
 * accessible, not deleted — so the slot grid gets the viewport this screen's task actually needs.
 */
function ChosenOptionSummary({ option }: { option: ProviderOption }) {
  return (
    <View
      style={{
        gap: space('stack-xs'),
        padding: space('inset-sm'),
        borderRadius: radius('surface'),
        borderWidth: 1,
        borderColor: color('border.subtle'),
        backgroundColor: color('surface.subtle'),
      }}
    >
      <Heading4>{option.providerName}</Heading4>
      <Body tone="secondary">{option.serviceLabel}</Body>
      <PriceDisplay price={option.price} />
    </View>
  );
}

/**
 * SCR-BOOKING-001 — Slot selection. Lets the patient choose a time for the option they picked.
 * Availability here is advisory; the time is held atomically only at commit (WGT-BOOKING-001).
 */
export function SlotSelectionScreen({ option, slots, onContinue, onChangeOption }: SlotSelectionScreenProps) {
  const [selected, setSelected] = useState<Slot | null>(null);
  const [showFullOption, setShowFullOption] = useState(false);

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
            {
              key: 'details',
              label: showFullOption ? 'إخفاء تفاصيل الخيار' : 'عرض تفاصيل الخيار الكاملة',
              role: 'secondary',
              availability: { status: 'available' },
              onPress: () => setShowFullOption((v) => !v),
            },
            { key: 'change', label: 'تغيير الخيار', role: 'secondary', availability: { status: 'available' }, onPress: onChangeOption },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <Heading2>اختيار الموعد</Heading2>
        {showFullOption ? <ProviderDecisionCard option={option} variant="chosen" /> : <ChosenOptionSummary option={option} />}
        <SlotSelector slots={slots} selectedId={selected?.id ?? null} onSelect={setSelected} />
      </Stack>
    </Screen>
  );
}
