import { View } from 'react-native';
import { AmendmentDelta } from '../components/AmendmentDelta';
import { PriceDisplay } from '../components/PriceDisplay';
import { StateChip } from '../components/StateChip';
import { TreatmentLine } from '../components/TreatmentLine';
import { Body, BodyStrong, Heading3, Helper } from '../foundations/Text';
import type { TreatmentPlanProjection } from '../mocks/clinical';
import { borderWidth, color, radius, space } from '../theme/tokens';

const PLAN_LABEL: Record<TreatmentPlanProjection['state'], string> = {
  PROPOSED: 'خطة مقترحة',
  ACCEPTED: 'خطة مقبولة',
};

/** WGT-CLINICAL-002 — Patient treatment-plan reader. Never authors, edits or diagnoses. */
export function TreatmentPlanReader({ plan }: { plan: TreatmentPlanProjection }) {
  return (
    <View style={{ gap: space('stack-lg') }}>
      <View style={{ gap: space('stack-sm') }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space('inline-sm') }}>
          <StateChip machine="treatment-plan" status={plan.state} label={PLAN_LABEL[plan.state]} />
          <BodyStrong>{plan.versionLabel}</BodyStrong>
        </View>
        <View style={{ gap: space('stack-xs') }}>
          <Helper>كتب هذه الخطة</Helper>
          <BodyStrong>{plan.authorName}</BodyStrong>
          <Helper>{plan.serviceFamily}</Helper>
        </View>
      </View>

      {plan.amendment ? <AmendmentDelta amendment={plan.amendment} currency={plan.currency} /> : null}

      <View style={{ gap: space('stack-sm') }}>
        <Heading3>بنود الخطة</Heading3>
        {plan.lines.map((line) => (
          <TreatmentLine key={line.id} line={line} currency={plan.currency} />
        ))}
      </View>

      {plan.complete ? (
        <View
          accessible
          accessibilityLabel={`إجمالي الخطة ${plan.total} ${plan.currency}`}
          style={{
            gap: space('stack-xs'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('border.strong'),
            backgroundColor: color('surface.subtle'),
          }}
        >
          <BodyStrong>إجمالي الخطة</BodyStrong>
          <PriceDisplay price={{ mode: 'fixed', amount: plan.total, currency: plan.currency }} compact />
          <Helper>الإجمالي ناتج عن البنود الظاهرة أعلاه، وليس مبلغ دفع داخل UberTib.</Helper>
        </View>
      ) : (
        <View
          accessibilityRole="alert"
          style={{
            gap: space('stack-xs'),
            padding: space('inset-md'),
            borderRadius: radius('surface'),
            borderWidth: borderWidth('hairline'),
            borderColor: color('tone.warning.border'),
            backgroundColor: color('tone.warning.fill'),
          }}
        >
          <BodyStrong>الخطة غير مكتملة للعرض</BodyStrong>
          <Body>تعذر تحميل كل البنود أو الشروط، لذلك لا نعرض إجماليًا قد يكون ناقصًا.</Body>
        </View>
      )}

      <View style={{ gap: space('stack-sm') }}>
        <Heading3>ما الذي تشمله الخطة؟</Heading3>
        {plan.inclusions.map((item) => (
          <Body key={item}>• {item}</Body>
        ))}
        {plan.exclusions.length ? (
          <View style={{ gap: space('stack-xs') }}>
            <Helper>لا تشمل</Helper>
            {plan.exclusions.map((item) => (
              <Body key={item} tone="secondary">• {item}</Body>
            ))}
          </View>
        ) : null}
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <Heading3>الشروط والمعنى</Heading3>
        <Body>{plan.termsSummary}</Body>
        <Body tone="secondary">{plan.protectionSummary}</Body>
      </View>
    </View>
  );
}
