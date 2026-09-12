import { ActionBar } from '../components/ActionBar';
import { ProviderIdentity } from '../components/ProviderIdentity';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import type { EligibilityExplanation } from '../mocks/eligibility';
import { EligibilityDecisionBlock } from '../widgets/EligibilityDecisionBlock';

export interface EligibilityExplanationScreenProps {
  explanation: EligibilityExplanation;
  onBack: () => void;
  onFindAlternatives: () => void;
}

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
              label: 'العودة إلى تفاصيل الطبيب',
              role: 'primary',
              availability: { status: 'available' },
              onPress: onBack,
            },
            {
              key: 'alternatives',
              label: 'العودة إلى نتائج البحث',
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
          eyebrow="تفاصيل الإتاحة"
          title={available ? 'لماذا هذا الطبيب متاح للحجز؟' : 'لماذا لا يمكن حجز هذا الطبيب الآن؟'}
          description={`هذه الحالة تخص ${explanation.serviceLabel} في ${explanation.branchName}. ستجد هنا معنى الحالة لحجزك والخطوة التالية.`}
        />

        <ProviderIdentity
          name={explanation.providerName}
          branch={explanation.branchName}
          area={explanation.areaLabel}
        />

        <EligibilityDecisionBlock explanation={explanation} />
      </Stack>
    </Screen>
  );
}
