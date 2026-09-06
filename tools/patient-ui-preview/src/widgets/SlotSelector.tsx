import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bdi } from '../foundations/Bdi';
import { formatTime } from '../foundations/format';
import { Body, Heading4, Helper } from '../foundations/Text';
import { Icon } from '../foundations/Icon';
import { useFocusRing } from '../foundations/useFocusRing';
import { webRadioKeyboardProps } from '../foundations/webKeyboardActivation';
import type { Slot } from '../mocks/booking';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

interface SlotSelectorProps {
  slots: Slot[];
  selectedId: string | null;
  onSelect: (slot: Slot) => void;
  onClearSelection?: () => void;
}

interface RadioControlProps {
  label: string;
  detail?: string;
  selected: boolean;
  disabled?: boolean;
  tabbable: boolean;
  onSelect: () => void;
}

function availabilityCountLabel(count: number) {
  if (count === 0) return 'لا أوقات متاحة';
  if (count === 1) return 'وقت واحد متاح';
  if (count === 2) return 'وقتان متاحان';
  return `${count} أوقات متاحة`;
}

function RadioControl({ label, detail, selected, disabled = false, tabbable, onSelect }: RadioControlProps) {
  const ring = useFocusRing();

  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      accessibilityState={{ selected, disabled }}
      // Mirror exactly what is rendered: one reason, never two. A day that already says
      // "لا أوقات متاحة" in `detail` must not also have "غير متاح" appended, which is what made a
      // screen reader announce the same fact twice.
      accessibilityLabel={`${label}${detail ? `، ${detail}` : disabled ? '، غير متاح' : ''}`}
      disabled={disabled}
      {...webRadioKeyboardProps(onSelect, tabbable)}
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onSelect}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        // A fixed two-up track. With `flexGrow: 1` and a min width, adding the selection icon grew
        // the chosen control past the two-up threshold, so tapping a date reflowed the whole grid
        // at 320 and every other date jumped to a new position under the patient's finger.
        flexGrow: 0,
        flexBasis: '48%',
        minWidth: size('target-primary') * 2,
        paddingHorizontal: space('inset-md'),
        paddingVertical: space('inset-sm'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius('control'),
        borderWidth: borderWidth(selected ? 'emphasis' : 'hairline'),
        borderColor: selected ? color('state.selected.border') : color('border.strong'),
        backgroundColor: disabled
          ? color('surface.subtle')
          : selected
            ? color('state.selected.surface')
            : color('surface.default'),
        // Dimming the whole control also dimmed the unavailability reason, which is the only
        // non-colour carrier of the disabled meaning. The surface and border carry the dimming;
        // the text stays at full strength.
        opacity: pressed && !disabled ? 0.9 : 1,
        ...ring.ringStyle,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space('inline-xs') }}>
        {selected ? <Icon name="check-circle" color={color('action.primary')} scale="sm" /> : null}
        {disabled ? <Icon name="minus-circle" color={color('text.secondary')} scale="sm" /> : null}
        <Body tone={selected ? 'link' : 'primary'}>
          <Bdi>{label}</Bdi>
        </Body>
      </View>
      {/* One reason, never two. A day with no times already says so in `detail`. */}
      {detail ? <Helper>{detail}</Helper> : null}
      {disabled && !detail ? <Helper>غير متاح</Helper> : null}
    </Pressable>
  );
}

/**
 * WGT-BOOKING-001 — Slot and capacity selector. Availability here is advisory; capacity resolves
 * atomically only at commit (API-BOOKING-001). A slot that disappears between display and submit
 * is a designed path, never the patient's error, and is marked unavailable in place rather than
 * silently removed.
 */
export function SlotSelector({ slots, selectedId, onSelect, onClearSelection }: SlotSelectorProps) {
  const days = Array.from(new Set(slots.map((s) => s.dayLabel)));
  const selectedSlot = slots.find((slot) => slot.id === selectedId);
  const [activeDay, setActiveDay] = useState<string | null>(selectedSlot?.dayLabel ?? null);
  const activeSlots = activeDay ? slots.filter((slot) => slot.dayLabel === activeDay) : [];
  const firstAvailableDay = days.find((day) => slots.some((slot) => slot.dayLabel === day && slot.available));
  const firstAvailableSlot = activeSlots.find((slot) => slot.available);

  function selectDay(day: string) {
    if (day !== activeDay && selectedSlot?.dayLabel !== day) {
      onClearSelection?.();
    }
    setActiveDay(day);
  }

  return (
    <View style={{ gap: space('stack-lg') }}>
      <View accessibilityRole="radiogroup" accessibilityLabel="اختر التاريخ" style={{ gap: space('stack-sm') }}>
        <Heading4>اختر التاريخ</Heading4>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-sm') }}>
          {days.map((day) => {
            const availableCount = slots.filter((slot) => slot.dayLabel === day && slot.available).length;
            return (
              <RadioControl
                key={day}
                label={day}
                detail={availabilityCountLabel(availableCount)}
                selected={activeDay === day}
                disabled={availableCount === 0}
                tabbable={activeDay === day || (!activeDay && day === firstAvailableDay)}
                onSelect={() => selectDay(day)}
              />
            );
          })}
        </View>
      </View>

      {activeDay ? (
        <View accessibilityRole="radiogroup" accessibilityLabel={`اختر الوقت في ${activeDay}`} style={{ gap: space('stack-sm') }}>
          <View style={{ gap: space('stack-xs') }}>
            <Heading4>اختر الوقت</Heading4>
            <Helper>{activeDay}</Helper>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-sm') }}>
            {activeSlots.map((slot) => (
              <RadioControl
                key={slot.id}
                label={formatTime(slot.timeIso)}
                selected={slot.id === selectedId}
                disabled={!slot.available}
                tabbable={slot.id === selectedId || (!selectedId && slot.id === firstAvailableSlot?.id)}
                onSelect={() => onSelect(slot)}
              />
            ))}
          </View>
          <Helper>الأوقات المعروضة إرشادية. يُثبَّت التوفر عند إرسال الطلب.</Helper>
        </View>
      ) : (
        <View
          accessible
          accessibilityLabel="اختر التاريخ أولًا لعرض الأوقات"
          style={{
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('border.subtle'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <Body tone="secondary">اختر التاريخ أولًا، ثم اختر الوقت المناسب.</Body>
        </View>
      )}
    </View>
  );
}
