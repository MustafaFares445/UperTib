import { useState } from 'react';
import { View } from 'react-native';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Bdi } from '../foundations/Bdi';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { PriceDisplay } from '../components/PriceDisplay';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { formatDateTime } from '../foundations/format';
import { submitBooking, type BookingRecord, type Slot } from '../mocks/booking';
import { color, radius, space } from '../theme/tokens';

export interface BookingReviewScreenProps {
  option: ProviderOption;
  slot: Slot;
  onSubmitted: (booking: BookingRecord) => void;
  onChangeTime: () => void;
  onChangeOption: () => void;
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
              {
                key: 'time',
                label: 'تغيير الوقت',
                role: 'secondary',
                availability: submitting ? { status: 'absent', reason: 'لا يمكن التعديل أثناء الإرسال.' } : { status: 'available' },
                onPress: onChangeTime,
              },
              {
                key: 'option',
                label: 'تغيير الخيار',
                role: 'secondary',
                availability: submitting ? { status: 'absent', reason: 'لا يمكن التعديل أثناء الإرسال.' } : { status: 'available' },
                onPress: onChangeOption,
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
        <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
          <Helper>الموعد المطلوب</Helper>
          <Heading4>{slot.dayLabel}</Heading4>
          <BodyStrong><Bdi>{formatDateTime(slot.timeIso)}</Bdi></BodyStrong>
        </View>
        <View style={{ gap: space('stack-xs') }}>
          <Helper>مقدّم الخدمة</Helper>
          <Heading4>{option.providerName}</Heading4>
          <Body tone="secondary">{option.branchName} · {option.serviceLabel}</Body>
          <PriceDisplay price={option.price} compact />
        </View>
        <Helper>بعد الإرسال، تراجع العيادة الطلب ضمن المهلة. سيصلك إشعار عند الرد ويمكنك متابعة الحالة من تفاصيل الحجز.</Helper>
      </Stack>
    </Screen>
  );
}
