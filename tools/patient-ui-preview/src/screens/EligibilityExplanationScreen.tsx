import { View } from 'react-native';
import { ActionBar } from '../components/ActionBar';
import { ProviderIdentity } from '../components/ProviderIdentity';
import { StateChip } from '../components/StateChip';
import { formatDateTime } from '../foundations/format';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import { Body, BodyStrong, Heading4, Helper } from '../foundations/Text';
import type { EligibilityExplanation } from '../mocks/eligibility';
import { borderWidth, color, radius, space } from '../theme/tokens';

export interface EligibilityExplanationScreenProps {
  explanation: EligibilityExplanation;
  onBack: () => void;
  onFindAlternatives: () => void;
}

const ELIGIBILITY_LABEL: Record<EligibilityExplanation['eligibility'], string> = {
  PENDING_EVALUATION: 'قيد التقييم',
  ELIGIBLE: 'مؤهّل لهذه الخدمة',
  SUSPENDED: 'معلَّق مؤقتًا',
  NOT_ELIGIBLE: 'غير مؤهَّل حاليًا',
};

/**
 * SCR-ELIG-004 — Patient-safe explanation of one provider/service/branch eligibility decision.
 * API-ELIG-002 deliberately excludes raw I, reviewer-only evidence and internal scoring. This
 * screen therefore explains only the practical current meaning, assessment time and next step.
 */
export function EligibilityExplanationScreen({
  explanation,
  onBack,
  onFindAlternatives,
}: EligibilityExplanationScreenProps) {
  const available = explanation.eligibility === 'ELIGIBLE';

  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            {
              key: 'back',
              label: available ? 'العودة إلى هذا الخيار' : 'العودة إلى الخيار',
              role: 'primary',
              availability: { status: 'available' },
              onPress: onBack,
            },
            {
              key: 'alternatives',
              label: 'عرض خيارات أخرى',
              role: 'secondary',
              availability: { status: 'available' },
              onPress: onFindAlternatives,
            },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="سبب إتاحة هذا الخيار"
          title="ماذا تعني حالة هذا الخيار؟"
          description="الشرح يخص هذه الخدمة وهذا الفرع فقط، ولا يمثل ترتيبًا عامًا للطبيب."
        />

        <Stack gap="stack-sm">
          <ProviderIdentity
            name={explanation.providerName}
            branch={explanation.branchName}
            area={explanation.areaLabel}
          />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space('inline-sm') }}>
            <StateChip
              machine="eligibility-outcome"
              status={explanation.eligibility}
              label={ELIGIBILITY_LABEL[explanation.eligibility]}
            />
            <BodyStrong>{explanation.serviceLabel}</BodyStrong>
          </View>
        </Stack>

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
          <Heading4>المعنى الآن</Heading4>
          <Body>{explanation.reasonSummary}</Body>
        </View>

        <View style={{ gap: space('stack-xs') }}>
          <Heading4>ماذا يمكنك أن تفعل؟</Heading4>
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
          <Helper>آخر تقييم لهذه الخدمة في هذا الفرع</Helper>
          <BodyStrong>{formatDateTime(explanation.assessedAtIso)}</BodyStrong>
          <Helper>لا يعرض UberTib هنا درجات المخاطر الداخلية أو تفاصيل المراجعة غير المخصصة للمريض.</Helper>
        </View>
      </Stack>
    </Screen>
  );
}
