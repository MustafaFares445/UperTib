import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { AppointmentObject } from '../components/AppointmentObject';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { RecoveryState } from '../components/RecoveryState';
import { StateChip } from '../components/StateChip';
import { StateSummary } from '../components/StateSummary';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, Heading3, Helper } from '../foundations/Text';
import type { RescheduleProjection } from '../mocks/bookingRemaining';
import { space } from '../theme/tokens';

export type RescheduleRequestScreenState = 'success' | 'stale' | 'offline' | 'error-fetch' | 'error-permission';

export interface RescheduleRequestScreenProps {
  projection: RescheduleProjection;
  option: ProviderOption;
  state?: RescheduleRequestScreenState;
  subject?: string;
  authority?: string;
  onCreateProposal?: () => void;
  onAcceptProposal?: () => void;
  onDeclineProposal?: () => void;
  onWithdrawProposal?: () => void;
  onRefresh?: () => void;
}

const PROPOSAL_LABEL: Record<NonNullable<RescheduleProjection['proposalState']>, string> = {
  PENDING: 'بانتظار الرد',
  ACCEPTED: 'تم القبول',
  DECLINED: 'مرفوض',
  EXPIRED: 'منتهي المهلة',
  WITHDRAWN: 'تم سحبه',
};

function proposalMeaning(projection: RescheduleProjection): string {
  switch (projection.proposalState) {
    case 'PENDING':
      return projection.proposalActor === 'clinic'
        ? 'اقترحت العيادة تغيير الموعد. موعدك الحالي يبقى مؤكَّدًا حتى تقبل الاقتراح ويُعتمد بعد إعادة التحقق.'
        : 'أرسلت اقتراحًا لتغيير الموعد. موعدك الحالي يبقى مؤكَّدًا حتى تقبله العيادة ويُعتمد.';
    case 'ACCEPTED':
      return 'تم قبول الموعد الجديد بعد إعادة التحقق من الأهلية والسعة والمهلة، وأصبح هو الموعد المؤكد.';
    case 'DECLINED':
      return 'تم رفض اقتراح تغيير الموعد. موعدك الأصلي لم يتأثر.';
    case 'EXPIRED':
      return 'انتهت مهلة الرد على اقتراح التغيير. موعدك الأصلي لم يتأثر.';
    case 'WITHDRAWN':
      return projection.proposalActor === 'patient'
        ? 'سحبت اقتراح تغيير الموعد. موعدك الأصلي لم يتأثر.'
        : 'سحبت العيادة اقتراح تغيير الموعد. موعدك الأصلي لم يتأثر.';
    default:
      return 'يمكنك اقتراح موعد بديل إذا كانت السياسة الحالية تسمح بذلك. موعدك المؤكد لا يتغير عند مجرد إنشاء اقتراح.';
  }
}

/** SCR-BOOKING-016 — rescheduling is a separate governed proposal; the confirmed booking is never edited in place. */
export function RescheduleRequestScreen({
  projection,
  option,
  state = 'success',
  subject = 'تغيير موعد الحجز',
  authority,
  onCreateProposal,
  onAcceptProposal,
  onDeclineProposal,
  onWithdrawProposal,
  onRefresh,
}: RescheduleRequestScreenProps) {
  const permissionDenied = state === 'error-permission';
  const staleOrOffline = state === 'stale' || state === 'offline';
  const hasProposal = Boolean(projection.proposalState);
  const accepted = projection.proposalState === 'ACCEPTED';
  const pending = projection.proposalState === 'PENDING';
  const originalIsAuthoritative = !accepted;

  const actions: ActionSpec[] = [];
  if (!permissionDenied && !staleOrOffline && projection.policyAllowsProposal) {
    if (!hasProposal && projection.proposedSlotIso && onCreateProposal) {
      actions.push({ key: 'create-proposal', label: 'إرسال اقتراح تغيير الموعد', role: 'primary', availability: { status: 'available' }, onPress: onCreateProposal });
    } else if (pending && projection.canRespond) {
      actions.push({
        key: 'accept-proposal',
        label: 'قبول الموعد المقترح',
        role: 'primary',
        availability: onAcceptProposal ? { status: 'available' } : { status: 'absent', reason: 'القبول غير متاح من هذه المعاينة.' },
        onPress: onAcceptProposal,
      });
      actions.push({
        key: 'decline-proposal',
        label: 'رفض الاقتراح',
        role: 'secondary',
        availability: onDeclineProposal ? { status: 'available' } : { status: 'absent', reason: 'الرفض غير متاح من هذه المعاينة.' },
        onPress: onDeclineProposal,
      });
    } else if (pending && projection.canWithdraw) {
      actions.push({
        key: 'withdraw-proposal',
        label: 'سحب اقتراح التغيير',
        role: 'secondary',
        availability: onWithdrawProposal ? { status: 'available' } : { status: 'absent', reason: 'السحب غير متاح من هذه المعاينة.' },
        onPress: onWithdrawProposal,
      });
    }
  }
  if ((staleOrOffline || state === 'error-fetch') && onRefresh) {
    actions.push({ key: 'refresh', label: 'تحديث', role: 'secondary', availability: { status: 'available' }, onPress: onRefresh });
  }

  return (
    <Screen footer={actions.length ? <ActionBar actions={actions} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`الحجز ${projection.bookingId}`}
          title="طلب تغيير الموعد"
          description="تغيير الموعد يتم باقتراح مستقل. الموعد المؤكد لا يُستبدل ما دام الاقتراح بانتظار القرار."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك إنشاء أو الرد على اقتراح تغيير لهذا الحجز ضمن الصلاحية الحالية."
            guidance="الصلاحية تُقرأ من الخادم، وتبديل الشخص المعروض لا يضيف قدرة جديدة."
          />
        ) : !projection.policyAllowsProposal ? (
          <RecoveryState
            variant="not-retryable"
            whatFailed="تغيير الموعد غير متاح لهذا الحجز وفق السياسة الحالية."
            stillTrue="موعدك المؤكد يبقى كما هو."
            guidance="راجع تفاصيل الحجز لمعرفة الإجراءات المتاحة حاليًا."
          />
        ) : state === 'error-fetch' ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر قراءة حالة اقتراح تغيير الموعد."
            stillTrue="لا نفترض أن الموعد تغيّر؛ الموعد المؤكد يبقى مرجعًا حتى يظهر قبول ملتزم من السجل الموثوق."
            guidance="أعد القراءة قبل إنشاء اقتراح أو الرد على اقتراح موجود."
            action={onRefresh ? { key: 'refresh', label: 'إعادة القراءة', role: 'secondary', availability: { status: 'available' }, onPress: onRefresh } : undefined}
          />
        ) : (
          <Stack gap="stack-md">
            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'الاتصال غير متاح الآن.' : 'قد تكون حالة الاقتراح قديمة.'}
                stillTrue="نعرض آخر حالة آمنة، لكن إجراءات الإنشاء والقبول والرفض والسحب مسحوبة حتى التحديث."
                guidance="أعد الاتصال وحدّث السجل قبل أي التزام."
              />
            ) : null}

            {accepted && projection.proposedSlotIso ? (
              <StateSummary
                machine="booking"
                status="CONFIRMED"
                label="الموعد الجديد مؤكَّد"
                meaning="تم اعتماد الموعد الجديد بعد قبول الاقتراح وإعادة التحقق."
                nextStep="راجع الموعد المؤكد الجديد أدناه."
                variant="hero"
              />
            ) : (
              <StateSummary
                machine="booking"
                status="CONFIRMED"
                label="موعدك الحالي مؤكَّد"
                meaning="هذا الموعد هو المرجع الفعلي ما لم يظهر اقتراح مقبول وملتزم."
                nextStep={pending ? 'راجع الاقتراح أدناه دون التخلي عن موعدك الحالي.' : 'أنشئ اقتراحًا فقط إذا أردت تغيير الموعد والسياسة تسمح.'}
                variant="hero"
              />
            )}

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>{originalIsAuthoritative ? 'موعدك المؤكد الحالي' : 'الموعد السابق'}</Heading3>
              <AppointmentObject iso={projection.originalConfirmedSlotIso} option={option} mode={originalIsAuthoritative ? 'confirmed' : 'summary'} />
              {!originalIsAuthoritative ? <Helper>هذا الموعد أصبح جزءًا من السجل بعد اعتماد الموعد الجديد.</Helper> : null}
            </View>

            {projection.proposedSlotIso ? (
              <View style={{ gap: space('stack-sm') }}>
                <Heading3>{accepted ? 'موعدك المؤكد الجديد' : hasProposal ? 'اقتراح تغيير الموعد' : 'الموعد الذي تريد اقتراحه'}</Heading3>
                <AppointmentObject iso={projection.proposedSlotIso} option={option} mode={accepted ? 'confirmed' : 'proposed'} />
                {projection.proposalState ? (
                  <StateChip
                    machine="reschedule-proposal"
                    status={projection.proposalState}
                    label={PROPOSAL_LABEL[projection.proposalState]}
                  />
                ) : null}
                <Body>{proposalMeaning(projection)}</Body>
                {pending && projection.responseDeadlineIso ? (
                  <DeadlineIndicator deadlineIso={projection.responseDeadlineIso} obligation="مهلة الرد على اقتراح تغيير الموعد" />
                ) : null}
              </View>
            ) : (
              <RecoveryState
                variant="fetch-failure"
                whatFailed="لا يوجد موعد مقترح صالح للعرض."
                stillTrue="موعدك المؤكد الحالي لم يتغير."
                guidance="ارجع لاختيار موعد مقترح قبل إنشاء طلب تغيير."
              />
            )}

            {pending && projection.proposalActor === 'clinic' ? (
              <Helper>القبول يعيد التحقق من المهلة والسعة والأهلية ضمن الالتزام نفسه؛ لا توجد خطوة قبول مؤقتة.</Helper>
            ) : pending && projection.proposalActor === 'patient' ? (
              <Helper>أنت بانتظار رد العيادة. لا يوجد حجز جديد موازٍ، وموعدك الأصلي يبقى مؤكَّدًا.</Helper>
            ) : null}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
