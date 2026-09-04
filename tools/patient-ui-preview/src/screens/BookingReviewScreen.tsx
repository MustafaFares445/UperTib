import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading2, Helper } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { SubmissionStateIndicator } from '../components/SubmissionStateIndicator';
import { formatDateTime } from '../foundations/format';
import { submitBooking, type BookingRecord, type Slot } from '../mocks/booking';

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
        <SubjectContextHeader subject="مراجعة طلب الحجز" authority="لحسابك" />
        <ProviderDecisionCard option={option} variant="chosen" />
        <Body>
          الوقت المختار: {slot.dayLabel} — {formatDateTime(slot.timeIso)}
        </Body>
        <Helper>
          بعد الإرسال، تحصل العيادة على مهلة للرد على الطلب. سيصلك إشعار فور صدور الرد، وتبقى قادرًا على متابعة حالة
          الطلب في أي وقت.
        </Helper>
      </Stack>
    </Screen>
  );
}
