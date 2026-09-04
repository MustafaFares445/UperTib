import { Pressable, View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatTime } from '../foundations/format';
import { Body, Heading4, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { Slot } from '../mocks/booking';
import { color, radius, size, space } from '../theme/tokens';

interface SlotSelectorProps {
  slots: Slot[];
  selectedId: string | null;
  onSelect: (slot: Slot) => void;
}

function SlotControl({ slot, selected, onSelect }: { slot: Slot; selected: boolean; onSelect: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !slot.available }}
      accessibilityLabel={`${slot.dayLabel}، ${formatTime(slot.timeIso)}${slot.available ? '' : '، لم يعد متاحًا'}`}
      disabled={!slot.available}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onSelect}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        minWidth: 96,
        paddingHorizontal: space('inset-md'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius('control'),
        borderWidth: 1,
        borderColor: selected ? color('state.selected.border') : color('border.strong'),
        backgroundColor: !slot.available
          ? color('surface.subtle')
          : selected
            ? color('state.selected.surface')
            : color('surface.default'),
        opacity: !slot.available ? 0.6 : pressed ? 0.9 : 1,
        ...ring.ringStyle,
      })}
    >
      <Body>
        <Bdi>{formatTime(slot.timeIso)}</Bdi>
      </Body>
      {!slot.available ? <Helper>لم يعد متاحًا</Helper> : null}
    </Pressable>
  );
}

/**
 * WGT-BOOKING-001 — Slot and capacity selector. Availability here is advisory; capacity resolves
 * atomically only at commit (API-BOOKING-001). A slot that disappears between display and submit
 * is a designed path, never the patient's error, and is marked unavailable in place rather than
 * silently removed.
 */
export function SlotSelector({ slots, selectedId, onSelect }: SlotSelectorProps) {
  const days = Array.from(new Set(slots.map((s) => s.dayLabel)));
  return (
    <View style={{ gap: space('stack-md') }}>
      {days.map((day) => (
        <View key={day} style={{ gap: space('stack-xs') }}>
          <Heading4>{day}</Heading4>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-sm') }}>
            {slots
              .filter((s) => s.dayLabel === day)
              .map((slot) => (
                <SlotControl key={slot.id} slot={slot} selected={slot.id === selectedId} onSelect={() => onSelect(slot)} />
              ))}
          </View>
        </View>
      ))}
      <Helper>التوقيت المعروض إرشادي؛ يُحجز الوقت فعليًا عند إرسال الطلب.</Helper>
    </View>
  );
}
