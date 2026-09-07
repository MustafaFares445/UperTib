import { ActionBar } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import type { PatientStageProjection } from '../mocks/stages';
import { StageExecutionPanel } from '../widgets/StageExecutionPanel';

/** SCR-CLINICAL-006 — patient-safe, read-only treatment-stage detail. */
export function StageDetailScreen({
  stage,
  subject = 'حالتك العلاجية',
  authority,
  onBackToTimeline,
}: {
  stage: PatientStageProjection;
  subject?: string;
  authority?: string;
  onBackToTimeline?: () => void;
}) {
  return (
    <Screen
      footer={
        <ActionBar
          actions={[
            {
              key: 'back-timeline',
              label: 'العودة إلى سجل الحالة',
              role: 'secondary',
              availability: { status: 'available' },
              onPress: onBackToTimeline,
            },
          ]}
        />
      }
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="تفاصيل المرحلة العلاجية"
          title="أين وصلت هذه المرحلة؟"
          description="يعرض هذا السجل ما تم تسجيله لك بألفاظ آمنة للمريض، مع إبقاء أي تصحيح لاحق واضحًا في التاريخ."
        />
        <SubjectContextHeader subject={subject} authority={authority} />
        <StageExecutionPanel stage={stage} />
      </Stack>
    </Screen>
  );
}
