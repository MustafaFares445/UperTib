import { AppointmentObject } from '../components/AppointmentObject';
import type { ProviderOption } from '../components/ProviderDecisionCard';
import { RecoveryState } from '../components/RecoveryState';
import { SensitiveConfirmation } from '../components/SensitiveConfirmation';
import { StateSummary } from '../components/StateSummary';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Helper } from '../foundations/Text';
import type { CancellationPolicyProjection } from '../mocks/bookingRemaining';

export type CancelBookingScreenState = 'success' | 'committing' | 'committed' | 'stale' | 'offline' | 'error-fetch' | 'error-permission';

export interface CancelBookingScreenProps {
  policy: CancellationPolicyProjection;
  option: ProviderOption;
  state?: CancelBookingScreenState;
  subject?: string;
  authority?: string;
  onKeepBooking: () => void;
  onConfirmCancellation?: (reason?: string) => void;
  onRefresh?: () => void;
}

/** SCR-BOOKING-006 — confirmed-booking cancellation with policy consequence before destructive commit. */
export function CancelBookingScreen({
  policy,
  option,
  state = 'success',
  subject = 'إلغاء حجزك',
  authority,
  onKeepBooking,
  onConfirmCancellation,
  onRefresh,
}: CancelBookingScreenProps) {
  const permissionDenied = state === 'error-permission';
  const policyUnavailable = !policy.consequence || state === 'error-fetch';
  const staleOrOffline = state === 'stale' || state === 'offline';
  const committed = state === 'committed';

  return (
    <Screen>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`الحجز ${policy.bookingId}`}
          title="إلغاء الحجز"
          description="راجع الموعد والنتيجة التي تحددها شروط هذا الحجز قبل تنفيذ الإلغاء."
        />
        <SubjectContextHeader subject={subject} authority={authority} />

        {permissionDenied ? (
          <RecoveryState
            variant="permission-denied"
            whatFailed="لا يمكنك إلغاء هذا الحجز ضمن الصلاحية الحالية."
            guidance="إجراء الإلغاء غير موجود خارج نطاق المريض أو التمثيل المسموح."
          />
        ) : committed ? (
          <Stack gap="stack-md">
            <StateSummary
              machine="booking"
              status="CANCELLED"
              label="مُلغى"
              meaning="تم تسجيل إلغاء الحجز من الحالة الموثوقة."
              nextStep="ارجع إلى قائمة الحجوزات لرؤية السجل المحدث."
              variant="hero"
            />
            <Body tone="secondary">لا تعرض هذه الشاشة أي ادعاء بتنفيذ حركة مالية؛ الأثر المالي، إن وجد، يُقرأ من سجله المخصص.</Body>
          </Stack>
        ) : (
          <Stack gap="stack-md">
            <StateSummary
              machine="booking"
              status="CONFIRMED"
              label="مؤكَّد"
              meaning="هذا هو الحجز المؤكد الذي سيُنهى إذا أكدت الإلغاء."
              nextStep="اقرأ نتيجة السياسة أدناه، ثم احتفظ بالحجز أو نفذ الإلغاء."
              variant="hero"
            />
            <AppointmentObject iso={policy.appointmentIso} option={option} mode="confirmed" />

            {policyUnavailable ? (
              <RecoveryState
                variant="fetch-failure"
                whatFailed="تعذر قراءة نتيجة سياسة الإلغاء لهذا الحجز."
                stillTrue="الحجز يبقى مؤكَّدًا. لا نوفر زر الإلغاء من دون معرفة النتيجة التي ستطبق عليه."
                guidance="أعد قراءة شروط الحجز قبل الإلغاء."
                action={onRefresh ? {
                  key: 'refresh-policy',
                  label: 'إعادة قراءة السياسة',
                  role: 'secondary',
                  availability: { status: 'available' },
                  onPress: onRefresh,
                } : undefined}
              />
            ) : staleOrOffline ? (
              <RecoveryState
                variant="stale"
                whatFailed={state === 'offline' ? 'الاتصال غير متاح الآن.' : 'قد تكون نتيجة سياسة الإلغاء قديمة.'}
                stillTrue="الحجز يبقى مؤكَّدًا، والإلغاء مسحوب حتى تُقرأ النتيجة الحالية."
                guidance="حدّث الشروط قبل تنفيذ الإجراء."
                action={onRefresh ? {
                  key: 'refresh-policy',
                  label: 'تحديث الشروط',
                  role: 'secondary',
                  availability: { status: 'available' },
                  onPress: onRefresh,
                } : undefined}
              />
            ) : (
              <Stack gap="stack-sm">
                <BodyStrong>ما الذي سيحدث إذا ألغيت الآن؟</BodyStrong>
                <Body>{policy.consequence}</Body>
                <Helper>هذه النتيجة مأخوذة من شروط هذا الحجز، وليست نصًا ثابتًا لكل الحجوزات.</Helper>

                <SensitiveConfirmation
                  actionLabel="إلغاء الحجز"
                  effect={policy.consequence}
                  reversibility="بعد تنفيذ الإلغاء، لا يعود هذا الموعد حجزًا مؤكدًا. يمكنك لاحقًا إنشاء طلب جديد وفق الحالة المتاحة حينها."
                  subject={`${option.serviceLabel} · ${option.providerName} · ${option.branchName}`}
                  reasonRequired={policy.reasonRequired}
                  reasonLabel="سبب الإلغاء"
                  reasonGuidance="يُطلب السبب فقط لأن سياسة هذا الحجز تتطلب تسجيله مع قرار الإلغاء."
                  onCancel={onKeepBooking}
                  onConfirm={(reason) => onConfirmCancellation?.(reason)}
                  committing={state === 'committing'}
                />
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Screen>
  );
}
