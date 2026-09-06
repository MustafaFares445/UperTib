import { ActionBar } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import type { FinancialLedgerProjection } from '../mocks/finance';
import { ExternalFinancialLedger } from '../widgets/ExternalFinancialLedger';

/** SCR-FINANCE-002 — ordered external financial history for one case. */
export function FinancialTimelineScreen({
  ledger,
  subject = 'حالتك العلاجية',
  authority,
  onOpenTerms,
  onBackToCase,
}: {
  ledger: FinancialLedgerProjection;
  subject?: string;
  authority?: string;
  onOpenTerms: () => void;
  onBackToCase?: () => void;
}) {
  return (
    <Screen
      footer={(
        <ActionBar actions={[
          {
            key: 'terms',
            label: 'عرض الشروط المقبولة',
            role: 'primary',
            availability: { status: 'available' },
            onPress: onOpenTerms,
          },
          ...(onBackToCase ? [{
            key: 'case',
            label: 'العودة إلى الحالة',
            role: 'secondary' as const,
            availability: { status: 'available' as const },
            onPress: onBackToCase,
          }] : []),
        ]} />
      )}
    >
      <Stack gap="stack-lg">
        <ScreenHeader
          eyebrow="السجل المالي"
          title={ledger.snapshot.serviceLabel}
          description="هذا سجل لوقائع مالية حدثت خارج UberTib. ليس محفظة، ولا ينفّذ دفعًا أو استردادًا."
        />
        <SubjectContextHeader subject={subject} authority={authority} />
        <ExternalFinancialLedger ledger={ledger} />
      </Stack>
    </Screen>
  );
}
