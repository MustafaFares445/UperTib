import { CaseEventTimeline } from '../components/CaseEventTimeline';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import type { PatientCase, PatientTimelineEvent } from '../mocks/clinical';

/** SCR-CLINICAL-005 — one ordered, role-safe, append-only history for the case. */
export function CaseTimelineScreen({
  item,
  events,
  subject = 'حالتك العلاجية',
  authority,
  hasOlder = true,
  scopeLimited = false,
  onLoadOlder,
  onOpenRecord,
}: {
  item: PatientCase;
  events: PatientTimelineEvent[];
  subject?: string;
  authority?: string;
  hasOlder?: boolean;
  scopeLimited?: boolean;
  onLoadOlder?: () => void;
  onOpenRecord?: (event: PatientTimelineEvent) => void;
}) {
  return (
    <Screen>
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow={`${item.serviceLabel} · ${item.providerName}`}
          title="ما الذي حدث في هذه الحالة؟"
          description="الأحداث تبقى بالترتيب. أي تصحيح يظهر كحدث لاحق بدل حذف ما سبقه."
        />
        <SubjectContextHeader subject={subject} authority={authority} />
        <CaseEventTimeline events={events} hasOlder={hasOlder} scopeLimited={scopeLimited} onLoadOlder={onLoadOlder} onOpenRecord={onOpenRecord} />
      </Stack>
    </Screen>
  );
}
