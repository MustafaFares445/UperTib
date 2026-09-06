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
