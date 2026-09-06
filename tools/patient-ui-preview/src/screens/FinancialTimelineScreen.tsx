import { ActionBar, type ActionSpec } from '../components/ActionBar';
import { SubjectContextHeader } from '../components/SubjectContextHeader';
import { Screen, ScreenHeader, Stack } from '../foundations/Screen';
import type { FinancialEventProjection, FinancialLedgerProjection } from '../mocks/finance';
import { ExternalFinancialLedger } from '../widgets/ExternalFinancialLedger';

/** SCR-FINANCE-002 — ordered external financial history for one case. */
export function FinancialTimelineScreen({
  ledger,
  subject = 'حالتك العلاجية',
  authority,
  onOpenTerms,
  onBackToCase,
  onReportPayment,
  onRespondToEvent,
  onReportRefundExecution,
}: {
  ledger: FinancialLedgerProjection;
  subject?: string;
  authority?: string;
  onOpenTerms: () => void;
  onBackToCase?: () => void;
  onReportPayment?: () => void;
  onRespondToEvent?: (event: FinancialEventProjection) => void;
  /** Secondary only and supplied only when an approved refund decision is actually available. */
  onReportRefundExecution?: () => void;
}) {
  const awaitingResponse = ledger.events.find(
    (event) => event.awaitingResponseByPatient && event.status === 'REPORTED_UNCONFIRMED' && !event.response,
  );

  let primary: ActionSpec;
  if (awaitingResponse && onRespondToEvent) {
    primary = {
      key: 'respond',
      label: 'مراجعة الواقعة والرد',
      role: 'primary',
      availability: { status: 'available' },
      onPress: () => onRespondToEvent(awaitingResponse),
    };
  } else if (onReportPayment) {
    primary = {
      key: 'report-payment',
      label: 'تسجيل دفعة تمت خارج المنصة',
      role: 'primary',
      availability: ledger.snapshot.complete
        ? { status: 'available' }
        : { status: 'disabled', reason: 'بيانات الشروط المقبولة غير مكتملة، لذلك لا يمكن ربط واقعة جديدة بها الآن.' },
      onPress: onReportPayment,
    };
  } else {
    primary = {
      key: 'terms',
      label: 'عرض الشروط المقبولة',
      role: 'primary',
      availability: { status: 'available' },
      onPress: onOpenTerms,
    };
  }

  const supporting: ActionSpec[] = [];
  if (primary.key !== 'terms') {
    supporting.push({
      key: 'terms',
      label: 'عرض الشروط المقبولة',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: onOpenTerms,
    });
  }
  if (onReportRefundExecution) {
    supporting.push({
      key: 'report-refund-execution',
      label: 'تسجيل تنفيذ استرداد خارجي',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: onReportRefundExecution,
    });
  }
  if (onBackToCase) {
    supporting.push({
      key: 'case',
      label: 'العودة إلى الحالة',
      role: 'secondary',
      availability: { status: 'available' },
      onPress: onBackToCase,
    });
  }

  return (
    <Screen footer={<ActionBar actions={[primary, ...supporting]} />}>
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
