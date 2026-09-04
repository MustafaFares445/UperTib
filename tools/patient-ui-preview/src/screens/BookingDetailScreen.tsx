import { useState } from 'react';
import { Screen, Stack } from '../foundations/Screen';
import { Body, Heading4 } from '../foundations/Text';
import { ActionBar } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { EventTimeline } from '../components/EventTimeline';
import { ProviderDecisionCard, type ProviderOption } from '../components/ProviderDecisionCard';
import { StateChip } from '../components/StateChip';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import type { BookingRecord } from '../mocks/booking';

export interface BookingDetailScreenProps {
  booking: BookingRecord;
  option: ProviderOption;
  onCancelled: () => void;
  onDone: () => void;
}

const BOOKING_LABEL: Record<BookingRecord['state'], string> = {
  REQUESTED: 'بانتظار تأكيد العيادة',
  ALTERNATIVE_PROPOSED: 'عُرض موعد بديل',
  CONFIRMED: 'مؤكَّد',
  ELIGIBILITY_REVIEW: 'قيد مراجعة الأهلية',
  REJECTED: 'مرفوض',
  CANCELLED: 'لم يُؤكَّد الحجز',
};

const BOOKING_MEANING: Record<BookingRecord['state'], string> = {
  REQUESTED: 'تم إرسال طلب الحجز وهو بانتظار رد العيادة ضمن المهلة المحددة.',
  ALTERNATIVE_PROPOSED: 'اقترحت العيادة موعدًا بديلًا؛ الموعد الأصلي يبقى هو المرجع حتى القبول أو الرفض أو انتهاء المهلة.',
  CONFIRMED: 'الموعد مؤكَّد.',
  ELIGIBILITY_REVIEW: 'الموعد قيد مراجعة إضافية للأهلية. هذا ليس اتهامًا ولا تعليمات بالحضور — لا حاجة لأي إجراء من طرفك حتى تنتهي المراجعة.',
  REJECTED: 'لم تتم الموافقة على طلب الحجز هذا.',
  CANCELLED: 'تم إلغاء طلب الحجز.',
};

/**
 * SCR-BOOKING-004 — Booking detail. Shows one booking authoritatively and offers only the actions
 * its current state and policy permit. This is the Slice 1 terminal screen: a booking request
 * submitted and awaiting the clinic's response is REQUESTED, not CONFIRMED — the clinic-side
 * accept/reject/propose-alternative flows (FLOW-BOOKING-003/004/005) are out of Patient-platform
 * scope and are not simulated here.
 */
export function BookingDetailScreen({ booking, option, onCancelled, onDone }: BookingDetailScreenProps) {
  const [cancelled, setCancelled] = useState(false);
  const state = cancelled ? 'CANCELLED' : booking.state;

  return (
    <Screen
      footer={
        <ActionBar
          actions={
            cancelled
              ? [{ key: 'done', label: 'إنهاء', role: 'primary', availability: { status: 'available' }, onPress: onDone }]
              : [
                  {
                    key: 'cancel',
                    label: 'إلغاء الطلب',
                    role: 'destructive',
                    availability: { status: 'available' },
                    onPress: () => {
                      setCancelled(true);
                      onCancelled();
                    },
                  },
                  {
                    key: 'reschedule',
                    label: 'طلب تغيير الموعد',
                    role: 'secondary',
                    availability: { status: 'absent', reason: 'يتاح طلب تغيير الموعد بعد تأكيد الحجز من العيادة.' },
                  },
                  { key: 'done', label: 'تم', role: 'secondary', availability: { status: 'available' }, onPress: onDone },
                ]
          }
        />
      }
    >
      <Stack gap="stack-lg">
        <SubjectContextHeader subject="تفاصيل الحجز" authority="لحسابك" />
        <StateChip machine="booking" status={state} label={BOOKING_LABEL[state]} />
        <Body>{BOOKING_MEANING[state]}</Body>

        <ProviderDecisionCard option={option} variant="chosen" />

        {!cancelled ? <DeadlineIndicator deadlineIso={booking.responseDeadlineIso} obligation="الرد على طلب الحجز" /> : null}

        <Stack gap="stack-xs">
          <Heading4>سجل الطلب</Heading4>
          <EventTimeline events={booking.history} />
        </Stack>
      </Stack>
    </Screen>
  );
}
