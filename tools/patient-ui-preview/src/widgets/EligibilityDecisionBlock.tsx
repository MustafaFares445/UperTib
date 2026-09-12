import { View } from 'react-native';
import { StateChip } from '../components/StateChip';
import { formatDateTime } from '../foundations/format';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import type { EligibilityExplanation } from '../mocks/eligibility';
import { borderWidth, color, radius, space } from '../theme/tokens';

const ELIGIBILITY_LABEL: Record<EligibilityExplanation['eligibility'], string> = {
  PENDING_EVALUATION: 'جاري التحقق من الإتاحة',
  ELIGIBLE: 'متاح للحجز لهذه الخدمة',
  SUSPENDED: 'غير متاح مؤقتًا',
  NOT_ELIGIBLE: 'غير متاح للحجز حاليًا',
};

/**
 * WGT-ELIG-002 — Eligibility decision block, Patient variant only in this preview.
 * It carries practical meaning and whether to wait or choose another option. It never exposes a
 * gate list, internal value, policy version, reviewer evidence, raw I, S/P/H mechanics or a rank.
 */
export function EligibilityDecisionBlock({ explanation }: { explanation: EligibilityExplanation }) {
  return (
    <View style={{ gap: space('stack-lg') }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space('inline-sm') }}>
        <StateChip
          machine="eligibility-outcome"
          status={explanation.eligibility}
          label={ELIGIBILITY_LABEL[explanation.eligibility]}
        />
        <BodyStrong>{explanation.serviceLabel}</BodyStrong>
      </View>

      <View
        style={{
          gap: space('stack-sm'),
          padding: space('inset-md'),
          borderRadius: radius('surface'),
          borderWidth: borderWidth('hairline'),
          borderColor: color('border.subtle'),
          backgroundColor: color('surface.subtle'),
        }}
      >
        <Heading4>ماذا تعني هذه الحالة لحجزك؟</Heading4>
        <Body>{explanation.reasonSummary}</Body>
      </View>

      <View style={{ gap: space('stack-xs') }}>
        <Heading4>ما الخطوة التالية؟</Heading4>
        <Body tone="secondary">{explanation.nextStep}</Body>
      </View>

      <View
        style={{
          gap: space('stack-xs'),
          paddingTop: space('stack-md'),
          borderTopWidth: borderWidth('hairline'),
          borderTopColor: color('border.subtle'),
        }}
      >
        <Helper>آخر تحديث لحالة الإتاحة لهذه الخدمة في هذا الفرع</Helper>
        <BodyStrong>{formatDateTime(explanation.assessedAtIso)}</BodyStrong>
        <Helper>قد تتغير الإتاحة لاحقًا بحسب توفر الخدمة وحالة الفرع، وسيظهر لك التحديث عند المتابعة.</Helper>
      </View>
    </View>
  );
}
