import { ActionBar } from '../components/ActionBar';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Helper } from '../foundations/Text';
import type { TreatmentPlanProjection } from '../mocks/clinical';
import { TreatmentPlanReader } from '../widgets/TreatmentPlanReader';

/** SCR-CLINICAL-003 — one reader for proposed and accepted plan states. */
export function TreatmentPlanScreen({
  plan,
  canAccept = true,
  onReviewAcceptance,
  onOpenFinance,
  onBackToCase,
}: {
  plan: TreatmentPlanProjection;
  canAccept?: boolean;
  onReviewAcceptance?: () => void;
  onOpenFinance?: () => void;
  onBackToCase?: () => void;
}) {
  const proposed = plan.state === 'PROPOSED';
  const actions = proposed
    ? [
        {
          key: 'accept-review',
          label: 'مراجعة الموافقة على الخطة',
          role: 'primary' as const,
          availability: canAccept && plan.complete
            ? ({ status: 'available' } as const)
            : ({ status: 'disabled', reason: plan.complete ? 'لا تملك صلاحية الموافقة على هذه الخطة.' : 'يجب أن تعرض العيادة الخطة كاملة قبل الموافقة.' } as const),
          onPress: onReviewAcceptance,
        },
        ...(onBackToCase ? [{ key: 'back', label: 'العودة إلى الحالة', role: 'secondary' as const, availability: { status: 'available' as const }, onPress: onBackToCase }] : []),
      ]
    : [
        ...(onOpenFinance ? [{ key: 'finance', label: 'فتح الشروط المالية', role: 'secondary' as const, availability: { status: 'available' as const }, onPress: onOpenFinance }] : []),
        ...(onBackToCase ? [{ key: 'back', label: 'العودة إلى الحالة', role: 'secondary' as const, availability: { status: 'available' as const }, onPress: onBackToCase }] : []),
      ];

  return (
    <Screen footer={actions.length ? <ActionBar actions={actions} /> : undefined}>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="الخطة العلاجية"
          title={proposed ? 'راجع ما اقترحه طبيبك' : 'الخطة المقبولة'}
          description={proposed ? 'اقرأ البنود والتغييرات قبل الانتقال إلى الموافقة.' : 'هذه نسخة مقبولة محفوظة للقراءة، ولا يمكن تعديلها من هنا.'}
        />
        {proposed && plan.expiresAtIso ? <Helper>الخطة المقترحة متاحة للمراجعة حتى {formatDateTime(plan.expiresAtIso)}.</Helper> : null}
        <TreatmentPlanReader plan={plan} />
      </Stack>
    </Screen>
  );
}
