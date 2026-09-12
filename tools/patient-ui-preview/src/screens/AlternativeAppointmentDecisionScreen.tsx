import { View } from 'react-native';
import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { AppointmentObject } from '../components/AppointmentObject';
import { DeadlineIndicator } from '../components/DeadlineIndicator';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { RecoveryState } from '../components/RecoveryState';
import { StateSummary } from '../components/StateSummary';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { AlternativeAppointmentProjection } from '../mocks/bookingRemaining';
import { space } from '../theme/tokens';

export type AlternativeDecisionScreenState = 'success' | 'stale' | 'offline' | 'error-fetch' | 'error-permission';

export interface AlternativeAppointmentDecisionScreenProps {
  proposal: AlternativeAppointmentProjection;
  option: ProviderOption;
  state?: AlternativeDecisionScreenState;
  subject?: string;
  authority?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onFreshRequest?: () => void;
  onRefresh?: () => void;
}

function OutcomeSummary({ proposal }: { proposal: AlternativeAppointmentProjection }) {
  switch (proposal.decisionState) {
    case 'accepted':
      return (
        <StateSummary
          machine="booking"
          status="CONFIRMED"
          label="مؤكَّد"
          meaning="تم قبول الموعد البديل بعد إعادة التحقق، وأصبح هو الموعد المؤكد."
          nextStep="راجع تفاصيل الحجز المحدثة قبل الحضور."
          variant="hero"
        />
      );
    case 'declined':
      return (
        <StateSummary
          machine="booking"
          status="CANCELLED"
          label="لم يُؤكَّد الحجز"
          meaning="رفضت الموعد البديل، لذلك أُغلق طلب الحجز دون موعد مؤكد."
          nextStep="يمكنك إرسال طلب جديد عندما يناسبك. لا توجد صياغة عقوبة على رفض الاقتراح."
          variant="hero"
        />
      );
    case 'expired':
      return (
        <StateSummary
          machine="booking"
          status="CANCELLED"
          label="لم يُؤكَّد الحجز"
          meaning="انتهت مهلة الرد على الاقتراح قبل تأكيد موعد بديل."
          nextStep="يمكنك بدء طلب جديد من الحجوزات أو البحث عن موعد آخر."
          variant="hero"
        />
      );
    default:
      return (
        <StateSummary
          machine="booking"
          status="ALTERNATIVE_PROPOSED"
          label="عُرض موعد بديل"
          meaning="العيادة اقترحت وقتًا مختلفًا عن طلبك الأصلي. الاقتراح ليس موعدًا مؤكَّدًا بعد."
          nextStep="راجع الطلب الأصلي والموعد المقترح ثم اقبل أو ارفض قبل المهلة."
          variant="hero"
        />
      );
  }
}

/** SCR-BOOKING-005 — original request first, provider alternative second, one-step decline, guarded accept. */
export function AlternativeAppointmentDecisionScreen({
  proposal,
  option,
  state = 'success',
  subject = 'قرار الموعد البديل',
  authority,
  onAccept,
  onDecline,
  onFreshRequest,
  onRefresh,
}: AlternativeAppointmentDecisionScreenProps) {
  const permissionDenied = state === 'error-permission';
  const staleOrOffline = state === 'stale' || state === 'offline';
  const unreadableOriginal = !proposal.originalRequestReadable;
  const pending = proposal.decisionState === 'pending';
  const conflict = proposal.decisionState === 'capacity-conflict' || proposal.decisionState === 'eligibility-conflict';

  const actions: ActionSpec[] = [];
  if (pending && !permissionDenied && !staleOrOffline && !unreadableOriginal) {
    actions.push({
      key: 'accept',
      label: 'قبول الموعد البديل',
      role: 'primary',
      availability: onAccept ? { status: 'available' } : { status: 'absent', reason: 'القبول غير متاح في هذه المعاينة.' },
      onPress: onAccept,
    });
    actions.push({
      key: 'decline',
      label: 'رفض الموعد البديل',
      role: 'secondary',
      availability: onDecline ? { status: 'available' } : { status: 'absent', reason: 'الرفض غير متاح في هذه المعاينة.' },
      onPress: onDecline,
    });
  }
  if ((proposal.decisionState === 'declined' || proposal.decisionState === 'expired' || conflict) && onFreshRequest) {
    actions.push({ key: 'fresh-request', label: 'طلب موعد جديد', role: 'primary', availability: { status: 'available' }, onPress: onFreshRequest });
  }
  if ((staleOrOffline || state === 'error-fetch') && onRefresh) {
    actions.push({ key: 'refresh', label: 'تحديث', role: 'secondary', availability: { status: 'available' }, onPress: onRefresh });
  }

  return (
    <Screen footer={actions.length ? <ActionBar actions={actions} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`طلب الحجز ${proposal.bookingId}`}
          title="القرار بشأن الموعد البديل"
          description="الطلب الأصلي يبقى واضحًا أولًا. لا يصبح الوقت البديل موعدًا مؤكدًا إلا بعد قبولك وإعادة التحقق من المهلة والتوفر والأهلية."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك اتخاذ قرار لهذا الطلب ضمن الصلاحية الحالية."
            guidance="أُزيلت إجراءات القبول والرفض بدل إبقائها كأزرار غير صالحة."
          />
        ) : unreadableOriginal ? (
          <RecoveryState
            variant="fetch-failure"
            whatFailed="تعذر قراءة طلب الموعد الأصلي."
            stillTrue="لن نعرض قرارًا على اقتراح لا يمكن مقارنته بالطلب الذي بُني عليه."
            guidance="حدّث الطلب قبل اتخاذ أي قرار."
            action={onRefresh ? { key: 'refresh', label: 'إعادة القراءة', role: 'secondary', availability: { status: 'available' }, onPress: onRefresh } : undefined}
          />
        ) : (
          <Stack gap="stack-md">
            <OutcomeSummary proposal={proposal} />

            {staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'الاتصال غير متاح الآن.' : 'قد لا تكون حالة الاقتراح أو المهلة محدثة.'}
                stillTrue="يمكنك قراءة الطلب، لكن القبول والرفض مسحوبان حتى تُقرأ الحالة الحالية."
                guidance="أعد الاتصال ثم حدّث قبل اتخاذ القرار."
              />
            ) : state === 'error-fetch' ? (
              <RecoveryState
                variant="fetch-failure"
                whatFailed="تعذر تحديث حالة الاقتراح."
                stillTrue="لا نفترض أن المهلة أو التوفر ما زالا كما كانا."
                guidance="أعد القراءة قبل القبول أو الرفض."
              />
            ) : null}

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>طلبك الأصلي</Heading3>
              <AppointmentObject iso={proposal.originalSlotIso} option={option} mode="summary" />
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>الموعد الذي اقترحته العيادة</Heading3>
              <AppointmentObject iso={proposal.proposedSlotIso} option={option} mode="proposed" />
              <DeadlineIndicator
                deadlineIso={proposal.responseDeadlineIso}
                obligation="مهلة الرد على الموعد البديل"
                state={proposal.decisionState === 'expired' ? 'lapsed' : undefined}
              />
            </View>

            {pending ? (
              <View style={{ gap: space('stack-xs') }}>
                <BodyStrong>إذا رفضت الاقتراح</BodyStrong>
                <Body tone="secondary">سيُغلق هذا الطلب دون موعد مؤكَّد، ويمكنك طلب موعد جديد. الرفض لا يحتاج تأكيدًا ثانيًا.</Body>
              </View>
            ) : null}

            {proposal.decisionState === 'capacity-conflict' ? (
              <RecoveryState
                variant="not-retryable"
                whatFailed="لم يعد الموعد المقترح متاحًا عند محاولة القبول."
                stillTrue="لم نؤكد موعدًا ولم ننشئ قبولًا افتراضيًا."
                guidance="اطلب موعدًا جديدًا من الحالة المحدثة."
              />
            ) : proposal.decisionState === 'eligibility-conflict' ? (
              <RecoveryState
                variant="not-retryable"
                whatFailed="تغيّرت أهلية هذا الخيار قبل إتمام القبول."
                stillTrue="لم يصبح الاقتراح موعدًا مؤكدًا."
                guidance="ارجع إلى الخيارات المتاحة حاليًا لبدء طلب جديد."
              />
            ) : null}

            {pending ? <Helper>عند إعادة محاولة قبول فشل نقل استجابته، تُستخدم نية القبول الأصلية نفسها بدل إنشاء أمر جديد.</Helper> : null}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
