import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { AppointmentObject } from '../components/AppointmentObject';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { useFocusRing } from '../foundations/useFocusRing';
import { submitBooking, type BookingRecord, type Slot } from '../mocks/booking';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export interface BookingReviewScreenProps {
  option: ProviderOption;
  slot: Slot;
  onSubmitted: (booking: BookingRecord) => void;
  onChangeTime: () => void;
  onChangeOption: () => void;
}

function EditControl({ label, onPress }: { label: string; onPress: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="button"
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        // These are the only way to correct a wrong date or doctor before submitting, so they get
        // the comfortable patient target, not the 24px absolute floor. Without vertical padding the
        // height was purely line-box driven and measured 30px at every width.
        minHeight: size('target-primary'),
        flexGrow: 1,
        flexBasis: 132,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: space('inset-sm'),
        paddingVertical: space('inset-sm'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('action.secondary-border'),
        backgroundColor: pressed ? color('action.secondary-hover') : color('action.secondary-surface'),
        ...ring.ringStyle,
      })}
    >
      <Body tone="link">{label}</Body>
    </Pressable>
  );
}

/**
 * SCR-BOOKING-002 — Request review and submit. Lets the patient confirm exactly what they are
 * requesting and submit it. Success is a committed booking request in REQUESTED with its response
 * deadline visible — never shown as submitted before the server commits (API-BOOKING-001).
 */
export function BookingReviewScreen({ option, slot, onSubmitted, onChangeTime, onChangeOption }: BookingReviewScreenProps) {
  const [idempotencyKey] = useState(() => `idem-${option.id}-${slot.id}`);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit() {
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      onSubmitted(submitBooking(option.id, slot.timeIso, idempotencyKey));
    }, 500);
  }

  return (
    <Screen
      footer={
        <Stack gap="stack-sm">
          {submitting ? <SubmissionStateIndicator status="pending" /> : null}
          <ActionBar
            actions={[
              {
                key: 'submit',
                label: 'إرسال طلب الحجز',
                role: 'primary',
                availability: submitting ? { status: 'disabled', reason: 'جارٍ إرسال الطلب…' } : { status: 'available' },
                onPress: handleSubmit,
              },
            ]}
          />
        </Stack>
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="الخطوة الأخيرة"
          title="راجع طلب الحجز"
          description="تأكد من الطبيب والفرع والموعد قبل الإرسال. إرسال الطلب لا يعني أن الموعد تأكد بعد."
        />
        <AppointmentObject iso={slot.timeIso} option={option} mode="request" dayLabel={slot.dayLabel} showPrice />
        <View accessibilityLabel="تعديل تفاصيل الطلب" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space('inline-sm') }}>
          <EditControl label="تعديل الموعد" onPress={onChangeTime} />
          <EditControl label="تغيير الطبيب" onPress={onChangeOption} />
        </View>
        <View style={{ gap: space('stack-xs'), padding: space('inset-sm'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <Helper>ماذا يحدث بعد الإرسال؟</Helper>
          <Body tone="secondary">تراجع العيادة الطلب ضمن المهلة. سيصلك إشعار عند الرد ويمكنك متابعة الحالة من تفاصيل الحجز.</Body>
        </View>
      </Stack>
    </Screen>
  );
}
