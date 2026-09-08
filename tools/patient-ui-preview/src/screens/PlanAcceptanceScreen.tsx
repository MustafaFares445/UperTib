import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { AmendmentDelta } from '../components/AmendmentDelta';
import { ContextNote } from '../components/ContextNote';
import { PriceDisplay } from '../components/PriceDisplay';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { TreatmentPlanProjection } from '../mocks/clinical';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type PlanAcceptanceState = 'ready' | 'submitting' | 'accepted' | 'stale';

/** SCR-CLINICAL-004 — permanence and amendment disclosure precede the acceptance action. */
export function PlanAcceptanceScreen({ plan, state = 'ready', canAccept = true, onAccept, onReviewPlan }: {
  plan: TreatmentPlanProjection; state?: PlanAcceptanceState; canAccept?: boolean; onAccept: () => void; onReviewPlan: () => void;
}) {
  const blocked = state === 'stale' || !plan.complete || !canAccept;
  const accepted = state === 'accepted';
  const blockedReason = state === 'stale' ? 'تحتاج الخطة إلى تحديث من العيادة.' : !plan.complete ? 'الخطة غير مكتملة، ولا يمكن الموافقة عليها.' : 'لا تملك صلاحية الموافقة على هذه الخطة.';
  const disabledActionReason = state === 'stale' ? 'لا يمكن الموافقة قبل تحديث الخطة.' : !plan.complete ? 'أكمل الخطة قبل الموافقة.' : 'هذا الحساب غير مخوّل بالموافقة.';

  return (
    <Screen footer={accepted ? (
      <ActionBar actions={[{ key: 'review', label: 'فتح الخطة المقبولة', role: 'primary', availability: { status: 'available' }, onPress: onReviewPlan }]} />
    ) : (
      <ActionBar actions={[
        { key: 'accept', label: 'أوافق على هذه الخطة', role: 'primary', availability: state === 'submitting' ? { status: 'loading' } : blocked ? { status: 'disabled', reason: disabledActionReason } : { status: 'available' }, onPress: onAccept },
        { key: 'review', label: 'مراجعة الخطة مرة أخرى', role: 'secondary', availability: { status: 'available' }, onPress: onReviewPlan },
      ]} />
    )}>
      <Stack gap="stack-lg">
        <ScreenHeader eyebrow="موافقة على الخطة" title={accepted ? 'تم تسجيل موافقتك' : blocked ? 'هذه الخطة تحتاج إجراء قبل الموافقة' : 'تأكد مما ستوافق عليه'} description={accepted ? 'أصبحت هذه النسخة هي السجل المقبول للحالة.' : undefined} />

        {accepted ? (
          <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('tone.success.border'), backgroundColor: color('tone.success.fill') }}>
            <BodyStrong>تم إنشاء السجل المقبول بنجاح.</BodyStrong><Body>تبقى هذه النسخة محفوظة كما قُبلت، وتظهر أي تغييرات مستقبلية في نسخة جديدة بدل تعديلها.</Body>
          </View>
        ) : blocked ? (
          <View accessibilityRole="alert" style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), backgroundColor: color('surface.subtle') }}>
            <BodyStrong>{blockedReason}</BodyStrong>
            <Body>{state === 'stale' ? 'لا يمكنك تجاوز هذا التعارض أو الموافقة على نسخة لم تعد الحالية.' : !plan.complete ? 'عد إلى الخطة لمعرفة الجزء الناقص قبل أي قرار.' : 'يمكنك قراءة الخطة، لكن لا يمكن لهذا الحساب تثبيت الموافقة.'}</Body>
          </View>
        ) : (
          <>
            {plan.amendment ? <AmendmentDelta amendment={plan.amendment} currency={plan.currency} /> : null}
            <View style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('border.subtle'), backgroundColor: color('surface.default') }}>
              <Helper>الخطة التي ستوافق عليها</Helper>
              <Heading3>{plan.versionLabel} · {plan.serviceFamily}</Heading3>
              <Helper>كتبها: {plan.authorName}</Helper>
              <PriceDisplay price={{ mode: 'fixed', amount: plan.total, currency: plan.currency }} compact />
            </View>
            <ContextNote icon="document-check" title="ما الذي تثبته الموافقة؟" body="تُسجَّل هذه النسخة كسجل علاجي ومالي مقبول لا يُعدَّل لاحقًا. أي تغيير جوهري يحتاج نسخة جديدة وشرحًا جديدًا وموافقة جديدة." />
          </>
        )}
      </Stack>
    </Screen>
  );
}