import { useState } from 'react';
import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { EventTimeline } from '../components/EventTimeline';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { StateSummary } from '../components/StateSummary';
import { Bdi } from '../foundations/Bdi';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import type { BookingRecord } from '../mocks/booking';
import { borderWidth, color, radius, space } from '../theme/tokens';

export interface BookingDetailScreenProps {
  booking: BookingRecord;
  option: ProviderOption;
  onCancelled: () => void;
  onDone: () => void;
  onAcceptAlternative?: () => void;
  onReschedule?: () => void;
  onFindAlternative?: () => void;
}

const BOOKING_LABEL: Record<BookingRecord['state'], string> = {
  REQUESTED: 'بانتظار تأكيد العيادة',
  ALTERNATIVE_PROPOSED: 'عرضت العيادة موعدًا بديلًا',
  CONFIRMED: 'الموعد مؤكَّد',
  ELIGIBILITY_REVIEW: 'الموعد قيد مراجعة الأهلية',
  REJECTED: 'لم توافق العيادة على الطلب',
  CANCELLED: 'لم يتم تأكيد الحجز',
};

const BOOKING_MEANING: Record<BookingRecord['state'], string> = {
  REQUESTED: 'وصل طلبك إلى العيادة، لكنه ليس موعدًا مؤكَّدًا بعد.',
  ALTERNATIVE_PROPOSED: 'الموعد الأصلي ما زال مرجع الطلب، والعيادة اقترحت وقتًا بديلًا لتراجعه.',
  CONFIRMED: 'وافقت العيادة وأصبح الموعد مثبتًا.',
  ELIGIBILITY_REVIEW: 'تجري مراجعة إضافية قبل إمكان الحضور. هذا ليس اتهامًا ولا إلغاءً تلقائيًا.',
  REJECTED: 'أغلقت العيادة هذا الطلب دون تأكيد الموعد.',
  CANCELLED: 'أُغلق الطلب دون موعد مؤكَّد، ولا يعني ذلك وجود غرامة أو دفعة مستحقة.',
};

const NEXT_STEP: Record<BookingRecord['state'], string> = {
  REQUESTED: 'لا يلزمك إجراء الآن. انتظر رد العيادة ضمن المهلة الظاهرة أدناه.',
  ALTERNATIVE_PROPOSED: 'راجع الوقت البديل ثم اقبله أو ارفضه قبل انتهاء المهلة. الرفض لا يفرض عقوبة.',
  CONFIRMED: 'احتفظ بموعدك، أو اطلب تغييره إذا لم يعد مناسبًا وكانت السياسة تسمح بذلك.',
  ELIGIBILITY_REVIEW: 'انتظر نتيجة المراجعة ولا تتوجه إلى الموعد حتى تعود الحالة إلى مؤكَّد.',
  REJECTED: 'يمكنك العودة إلى النتائج واختيار طبيب أو موعد آخر.',
  CANCELLED: 'يمكنك العودة إلى النتائج وبدء طلب جديد عندما ترغب.',
};

function AppointmentSummary({ booking, option }: { booking: BookingRecord; option: ProviderOption }) {
  return (
    <View
      style={{
        gap: space('stack-sm'),
        paddingVertical: space('stack-md'),
        borderTopWidth: borderWidth('hairline'),
        borderBottomWidth: borderWidth('hairline'),
        borderColor: color('border.subtle'),
      }}
    >
      <Helper>الموعد المطلوب</Helper>
      <BodyStrong><Bdi>{formatDateTime(booking.slotIso)}</Bdi></BodyStrong>
      <Heading4>{option.providerName}</Heading4>
      <Body tone="secondary">{option.branchName} · {option.areaLabel}</Body>
      <Helper>{option.serviceLabel}</Helper>
    </View>
  );
}

function AlternativeProposal({ booking }: { booking: BookingRecord }) {
  if (!booking.alternativeSlotIso) return null;
  return (
    <View
      style={{
        gap: space('stack-xs'),
        padding: space('inset-md'),
        borderRadius: radius('surface'),
        backgroundColor: color('action.primary-subtle'),
      }}
    >
      <Helper>الموعد البديل المقترح</Helper>
      <BodyStrong><Bdi>{formatDateTime(booking.alternativeSlotIso)}</Bdi></BodyStrong>
      <Body tone="secondary">لن يحل هذا الوقت محل طلبك الأصلي إلا بعد قبولك وإعادة التحقق من التوفر.</Body>
    </View>
  );
}

/** SCR-BOOKING-004 — state-first booking detail with server-projected allowed actions. */
export function BookingDetailScreen({
  booking,
  option,
  onCancelled,
  onDone,
  onAcceptAlternative,
  onReschedule,
  onFindAlternative,
}: BookingDetailScreenProps) {
  const [cancelled, setCancelled] = useState(false);
  const [confirmCancellation, setConfirmCancellation] = useState(false);
  const state: BookingRecord['state'] = cancelled ? 'CANCELLED' : booking.state;
  const allowed = cancelled ? [] : booking.allowedActions;

  function completeCancellation() {
    setCancelled(true);
    setConfirmCancellation(false);
    onCancelled();
  }

  function cancellationActions(): ActionSpec[] {
    return [
      { key: 'keep', label: 'الاحتفاظ بالطلب', role: 'secondary', availability: { status: 'available' }, onPress: () => setConfirmCancellation(false) },
      { key: 'confirm-cancel', label: 'تأكيد إلغاء الطلب', role: 'destructive', availability: { status: 'available' }, onPress: completeCancellation },
    ];
  }

  function terminalActions(): ActionSpec[] {
    return [{
      key: 'alternative', label: 'البحث عن خيار آخر', role: 'primary',
      availability: { status: 'available' }, onPress: onFindAlternative ?? onDone,
    }];
  }

  function alternativeActions(): ActionSpec[] {
    const acceptAvailability: ActionSpec['availability'] = !booking.alternativeResponseDeadlineIso
      ? { status: 'absent', reason: 'تعذر تحديد مهلة الرد، لذلك لا يمكن قبول الموعد من هذه الحالة.' }
      : onAcceptAlternative
        ? { status: 'available' }
        : { status: 'absent', reason: 'قبول الموعد البديل غير متاح من هذه المعاينة.' };
    return [
      {
        key: 'accept-alternative', label: 'قبول الموعد البديل', role: 'primary', onPress: onAcceptAlternative,
        availability: acceptAvailability,
      },
      { key: 'decline-alternative', label: 'رفض الموعد البديل', role: 'secondary', availability: { status: 'available' }, onPress: completeCancellation },
    ];
  }

  function projectedActions(): ActionSpec[] {
    if (confirmCancellation) return cancellationActions();
    if (state === 'REJECTED' || state === 'CANCELLED') return terminalActions();
    if (allowed.includes('respond-alternative')) return alternativeActions();

    const actionList: ActionSpec[] = allowed.includes('reschedule')
      ? [{
          key: 'reschedule', label: 'طلب تغيير الموعد', role: 'secondary', onPress: onReschedule,
          availability: onReschedule ? { status: 'available' } : { status: 'absent', reason: 'تغيير الموعد غير متاح من هذه المعاينة.' },
        }]
      : [{ key: 'done', label: 'العودة إلى الخدمات', role: 'secondary', availability: { status: 'available' }, onPress: onDone }];
    if (allowed.includes('cancel')) {
      actionList.push({
        key: 'cancel', label: state === 'CONFIRMED' ? 'إلغاء الحجز' : 'إلغاء الطلب', role: 'destructive',
        availability: { status: 'available' }, onPress: () => setConfirmCancellation(true),
      });
    }
    return actionList;
  }

  const deadline =
    state === 'ALTERNATIVE_PROPOSED' ? booking.alternativeResponseDeadlineIso : state === 'REQUESTED' ? booking.responseDeadlineIso : undefined;

  return (
    <Screen footer={<ActionBar actions={projectedActions()} />}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow={`طلب الحجز ${booking.id}`} title="تفاصيل الحجز" description={`${option.providerName} · ${option.serviceLabel}`} />
        <StateSummary machine="booking" status={state} label={BOOKING_LABEL[state]} meaning={BOOKING_MEANING[state]} nextStep={NEXT_STEP[state]} />
        <AppointmentSummary booking={booking} option={option} />
        {state === 'ALTERNATIVE_PROPOSED' ? <AlternativeProposal booking={booking} /> : null}
        {deadline ? (
          <DeadlineIndicator
            deadlineIso={deadline}
            obligation={state === 'ALTERNATIVE_PROPOSED' ? 'مهلة الرد على الموعد البديل' : 'مهلة رد العيادة على الطلب'}
          />
        ) : null}
        {booking.stateReason ? <Helper>{booking.stateReason}</Helper> : null}
        {confirmCancellation ? (
          <View style={{ gap: space('stack-xs'), padding: space('inset-sm'), borderRadius: radius('surface'), backgroundColor: color('action.destructive-subtle') }}>
            <BodyStrong>هل تريد إلغاء الطلب؟</BodyStrong>
            <Helper>سيُغلق هذا الطلب. لا تعني هذه الخطوة دفع رسوم أو فرض عقوبة.</Helper>
          </View>
        ) : null}
        <EventTimeline events={booking.history} />
      </Stack>
    </Screen>
      );
}
