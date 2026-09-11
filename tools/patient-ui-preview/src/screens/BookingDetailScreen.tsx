import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { AppointmentObject } from '../components/AppointmentObject';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import { EventTimeline } from '../components/EventTimeline';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { StateSummary } from '../components/StateSummary';
import { Icon } from '../foundations/Icon';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import { useFocusRing } from '../foundations/useFocusRing';
import type { BookingRecord } from '../mocks/booking';
import { borderWidth, color, radius, size, space } from '../theme/tokens';

export interface BookingDetailScreenProps {
  booking: BookingRecord;
  option: ProviderOption;
  onCancelled: () => void;
  onDone: () => void;
  onAcceptAlternative?: () => void;
  /** Canonical SCR-BOOKING-004 → SCR-BOOKING-005 route when the dedicated decision surface is wired. */
  onRespondAlternative?: () => void;
  onReschedule?: () => void;
  /** Canonical SCR-BOOKING-004 → SCR-BOOKING-006 route for confirmed-booking cancellation. */
  onCancelBooking?: () => void;
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
  ALTERNATIVE_PROPOSED: 'راجع الوقت البديل ثم اقبله أو ارفضه قبل انتهاء المهلة. الرفض ينهي هذا الطلب دون أي عقوبة، ويمكنك طلب موعد جديد.',
  CONFIRMED: 'احتفظ بموعدك، أو اطلب تغييره إذا لم يعد مناسبًا وكانت السياسة تسمح بذلك.',
  ELIGIBILITY_REVIEW: 'انتظر نتيجة المراجعة ولا تتوجه إلى الموعد حتى تعود الحالة إلى مؤكَّد.',
  REJECTED: 'يمكنك العودة إلى النتائج واختيار طبيب أو موعد آخر.',
  CANCELLED: 'يمكنك العودة إلى النتائج وبدء طلب جديد عندما ترغب.',
};

function AppointmentChange({ booking, option }: { booking: BookingRecord; option: ProviderOption }) {
  if (!booking.alternativeSlotIso) return null;

  return (
    <View accessibilityLabel="مقارنة الموعد الأصلي بالموعد البديل" style={{ gap: space('stack-md') }}>
      <AppointmentObject iso={booking.slotIso} option={option} mode="summary" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space('inline-sm') }}>
        <Icon name="arrows-right-left" color={color('action.primary')} scale="md" />
        <BodyStrong>من الموعد الأصلي إلى الموعد المقترح</BodyStrong>
      </View>
      <AppointmentObject iso={booking.alternativeSlotIso} option={option} mode="proposed" />
    </View>
  );
}

function QuietDestructiveAction({ label, onPress }: { label: string; onPress: () => void }) {
  const ring = useFocusRing();
  return (
    <Pressable
      accessibilityRole="button"
      onFocus={ring.onFocus}
      onBlur={ring.onBlur}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: size('target-primary'),
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: space('inset-md'),
        borderRadius: radius('control'),
        borderWidth: borderWidth('hairline'),
        borderColor: color('action.destructive'),
        backgroundColor: pressed ? color('action.destructive-subtle') : color('surface.default'),
        ...ring.ringStyle,
      })}
    >
      <Body style={{ color: color('action.destructive'), fontWeight: '600' }}>{label}</Body>
    </Pressable>
  );
}

/** SCR-BOOKING-004 — state-first booking detail with server-projected allowed actions. */
export function BookingDetailScreen({
  booking,
  option,
  onCancelled,
  onDone,
  onAcceptAlternative,
  onRespondAlternative,
  onReschedule,
  onCancelBooking,
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
    if (onRespondAlternative) {
      return [{
        key: 'review-alternative',
        label: 'مراجعة الموعد البديل',
        role: 'primary',
        availability: booking.alternativeResponseDeadlineIso
          ? { status: 'available' }
          : { status: 'absent', reason: 'تعذر تحديد مهلة الرد، لذلك لا يمكن اتخاذ قرار من هذه الحالة.' },
        onPress: onRespondAlternative,
      }];
    }

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

  function footerActions(): ActionSpec[] {
    if (confirmCancellation) return cancellationActions();
    if (state === 'REJECTED' || state === 'CANCELLED') return terminalActions();
    if (allowed.includes('respond-alternative')) return alternativeActions();
    if (allowed.includes('reschedule')) {
      return [{
        key: 'reschedule', label: 'طلب تغيير الموعد', role: 'secondary', onPress: onReschedule,
        availability: onReschedule ? { status: 'available' } : { status: 'absent', reason: 'تغيير الموعد غير متاح من هذه المعاينة.' },
      }];
    }
    if (state === 'ELIGIBILITY_REVIEW') {
      return [{ key: 'done', label: 'العودة إلى الخدمات', role: 'secondary', availability: { status: 'available' }, onPress: onDone }];
    }
    return [];
  }

  const actions = footerActions();
  const deadline =
    state === 'ALTERNATIVE_PROPOSED' ? booking.alternativeResponseDeadlineIso : state === 'REQUESTED' ? booking.responseDeadlineIso : undefined;
  const cancellable = allowed.includes('cancel') && !confirmCancellation;

  return (
    <Screen footer={actions.length ? <ActionBar actions={actions} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow={`طلب الحجز ${booking.id}`} title="تفاصيل الحجز" description={`${option.providerName} · ${option.serviceLabel}`} />
        <StateSummary
          machine="booking"
          status={state}
          label={BOOKING_LABEL[state]}
          meaning={BOOKING_MEANING[state]}
          nextStep={NEXT_STEP[state]}
          variant="hero"
        />
        {state === 'ALTERNATIVE_PROPOSED' ? (
          <AppointmentChange booking={booking} option={option} />
        ) : (
          <AppointmentObject iso={booking.slotIso} option={option} mode={state === 'CONFIRMED' ? 'confirmed' : 'summary'} />
        )}
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
        {cancellable ? (
          <View style={{ gap: space('stack-sm'), paddingTop: space('stack-sm') }}>
            <Helper>{state === 'CONFIRMED' ? 'إلغاء الحجز' : 'إلغاء الطلب'}</Helper>
            <Body tone="secondary">استخدم الإلغاء فقط إذا لم تعد تريد متابعة هذا الحجز.</Body>
            <QuietDestructiveAction
              label={state === 'CONFIRMED' ? 'إلغاء الحجز' : 'إلغاء الطلب'}
              onPress={onCancelBooking ?? (() => setConfirmCancellation(true))}
            />
          </View>
        ) : null}
      </Stack>
    </Screen>
  );
}
