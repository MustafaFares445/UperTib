import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { AmendmentDelta } from '../components/AmendmentDelta';
import { PriceDisplay } from '../components/PriceDisplay';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { TreatmentPlanProjection } from '../mocks/clinical';
import { borderWidth, color, radius, space } from '../theme/tokens';

export type PlanAcceptanceState = 'ready' | 'submitting' | 'accepted' | 'stale';

/** SCR-CLINICAL-004 — permanence and amendment disclosure precede the acceptance action. */
export function PlanAcceptanceScreen({
  plan,
  state = 'ready',
  canAccept = true,
  onAccept,
  onReviewPlan,
}: {
  plan: TreatmentPlanProjection;
  state?: PlanAcceptanceState;
  canAccept?: boolean;
  onAccept: () => void;
  onReviewPlan: () => void;
}) {
  const blocked = state === 'stale' || !plan.complete || !canAccept;
  const accepted = state === 'accepted';

  return (
    <Screen
      footer={accepted ? (
        <ActionBar actions={[{ key: 'review', label: 'فتح الخطة المقبولة', role: 'primary', availability: { status: 'available' }, onPress: onReviewPlan }]} />
      ) : (
        <ActionBar actions={[
          {
            key: 'accept',
            label: 'أوافق على هذه الخطة',
            role: 'primary',
            availability: state === 'submitting'
              ? { status: 'loading' }
              : blocked
                ? { status: 'disabled', reason: state === 'stale' ? 'تحتاج العيادة إلى تحديث الخطة قبل أن تتمكن من الموافقة.' : !plan.complete ? 'الخطة غير مكتملة، ولا يمكن الموافقة عليها.' : 'لا تملك صلاحية الموافقة على هذه الخطة.' }
                : { status: 'available' },
            onPress: onAccept,
          },
          { key: 'review', label: 'مراجعة الخطة مرة أخرى', role: 'secondary', availability: { status: 'available' }, onPress: onReviewPlan },
        ]} />
      )}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="موافقة على الخطة"
          title={accepted ? 'تم تسجيل موافقتك' : 'تأكد مما ستوافق عليه'}
          description={accepted ? 'أصبحت هذه النسخة هي السجل المقبول للحالة.' : 'هذه الخطوة تثبّت نسخة الخطة كما قرأتها الآن.'}
        />

        {accepted ? (
          <View accessibilityLiveRegion="polite" style={{ gap: space('stack-sm'), padding: space('inset-md'), borderRadius: radius('surface'), borderWidth: borderWidth('hairline'), borderColor: color('tone.success.border'), backgroundColor: color('tone.success.fill') }}>
            <BodyStrong>تم إنشاء السجل المقبول بنجاح.</BodyStrong>
            <Body>تبقى هذه النسخة محفوظة كما قُبلت، وتظهر أي تغييرات مستقبلية في نسخة جديدة بدل تعديلها.</Body>
          </View>
        ) : (
          <>
            {plan.amendment ? <AmendmentDelta amendment={plan.amendment} currency={plan.currency} /> : null}

            <View
              style={{
                gap: space('stack-sm'),
                padding: space('inset-md'),
                borderRadius: radius('surface'),
                borderWidth: borderWidth('hairline'),
                borderColor: color('tone.warning.border'),
                backgroundColor: color('tone.warning.fill'),
              }}
            >
              <Heading3>ما الذي يحدث عند الموافقة؟</Heading3>
              <BodyStrong>تُسجَّل هذه النسخة كسجل علاجي ومالي مقبول لا يُعدَّل لاحقًا.</BodyStrong>
              <Body>إذا احتاج الطبيب إلى تغيير جوهري بعد ذلك، يجب إنشاء نسخة جديدة وشرح الفرق ثم طلب موافقتك عليها.</Body>
              <Helper>لا تنفذ هذه الخطوة أي دفع إلكتروني أو تحويل أموال داخل UberTib.</Helper>
            </View>

            <View style={{ gap: space('stack-sm') }}>
              <Heading3>النسخة التي ستوافق عليها</Heading3>
              <BodyStrong>{plan.versionLabel} · {plan.serviceFamily}</BodyStrong>
              <Helper>كتبها: {plan.authorName}</Helper>
              {plan.complete ? (
                <View style={{ gap: space('stack-xs') }}>
                  <Helper>الإجمالي المسجّل في الخطة</Helper>
                  <PriceDisplay price={{ mode: 'fixed', amount: plan.total, currency: plan.currency }} compact />
                </View>
              ) : <Body>الخطة غير مكتملة، لذلك لا يظهر إجمالي.</Body>}
            </View>

            {state === 'stale' ? (
              <View accessibilityRole="alert" style={{ gap: space('stack-xs') }}>
                <BodyStrong>تحتاج الخطة إلى تحديث من العيادة.</BodyStrong>
                <Body tone="secondary">لا يمكنك تجاوز هذا التعارض أو الموافقة على نسخة لم تعد الحالية.</Body>
              </View>
            ) : null}
          </>
        )}
      </Stack>
    </Screen>
  );
}
