import { useState } from 'react';
import { acceptedTreatmentPlan, caseTimeline, patientCases, proposedTreatmentPlan, type PatientCase } from '../mocks/clinical';
import {
  acceptedFinancialTerms,
  actionableFinancialLedger,
  appendPatientFinancialResponse,
  appendPatientPaymentReport,
  type FinancialEventProjection,
  type FinancialLedgerProjection,
} from '../mocks/finance';
import { reopenedPatientStage } from '../mocks/stages';
import { AcceptedFinancialTermsScreen } from '../screens/AcceptedFinancialTermsScreen';
import { CaseSummaryScreen } from '../screens/CaseSummaryScreen';
import { CaseTimelineScreen } from '../screens/CaseTimelineScreen';
import { FinancialEventResponseScreen, type FinancialEventResponseState } from '../screens/FinancialEventResponseScreen';
import { FinancialTimelineScreen } from '../screens/FinancialTimelineScreen';
import { MyCasesScreen } from '../screens/MyCasesScreen';
import { PlanAcceptanceScreen } from '../screens/PlanAcceptanceScreen';
import { ReportExternalPaymentScreen, type ReportExternalPaymentState } from '../screens/ReportExternalPaymentScreen';
import { StageDetailScreen } from '../screens/StageDetailScreen';
import { TreatmentPlanScreen } from '../screens/TreatmentPlanScreen';

type Step =
  | 'cases'
  | 'summary'
  | 'plan'
  | 'acceptance'
  | 'accepted-plan'
  | 'timeline'
  | 'stage'
  | 'financial-terms'
  | 'financial-timeline'
  | 'financial-report'
  | 'financial-response';

/**
 * FLOW-CLINICAL-008 plus the case-scoped Patient reading branches and the canonical
 * FLOW-FINANCE-002 / FLOW-FINANCE-004 prototype paths. Local navigation and projection state only.
 */
export function CareReadingFlow() {
  const [step, setStep] = useState<Step>('cases');
  const [selectedCase, setSelectedCase] = useState<PatientCase>(patientCases[0]);
  const [ledger, setLedger] = useState<FinancialLedgerProjection>(actionableFinancialLedger);
  const [selectedFinancialEvent, setSelectedFinancialEvent] = useState<FinancialEventProjection | null>(null);
  const [reportState, setReportState] = useState<ReportExternalPaymentState>('editing');
  const [responseState, setResponseState] = useState<FinancialEventResponseState>('ready');

  if (step === 'cases') {
    return (
      <MyCasesScreen
        cases={patientCases}
        onOpenCase={(item) => {
          setSelectedCase(item);
          setStep('summary');
        }}
      />
    );
  }

  if (step === 'summary') {
    return (
      <CaseSummaryScreen
        item={selectedCase}
        onOpenPlan={selectedCase.id === patientCases[0].id ? () => setStep('plan') : () => setStep('accepted-plan')}
        onOpenTimeline={() => setStep('timeline')}
        onActOutstanding={selectedCase.outstandingAction ? () => setStep('plan') : undefined}
        onOpenFinance={selectedCase.financialSnapshotAvailable ? () => setStep('financial-terms') : undefined}
      />
    );
  }

  if (step === 'plan') {
    return (
      <TreatmentPlanScreen
        plan={proposedTreatmentPlan}
        onReviewAcceptance={() => setStep('acceptance')}
        onBackToCase={() => setStep('summary')}
      />
    );
  }

  if (step === 'acceptance') {
    return (
      <PlanAcceptanceScreen
        plan={proposedTreatmentPlan}
        onReviewPlan={() => setStep('plan')}
        onAccept={() => setStep('accepted-plan')}
      />
    );
  }

  if (step === 'accepted-plan') {
    const acceptedCurrentVersion = {
      ...proposedTreatmentPlan,
      state: 'ACCEPTED' as const,
      expiresAtIso: undefined,
    };
    return (
      <TreatmentPlanScreen
        plan={selectedCase.id === patientCases[0].id ? acceptedCurrentVersion : acceptedTreatmentPlan}
        onBackToCase={() => setStep('summary')}
      />
    );
  }

  if (step === 'stage') {
    return <StageDetailScreen stage={reopenedPatientStage} onBackToTimeline={() => setStep('timeline')} />;
  }

  if (step === 'financial-terms') {
    return (
      <AcceptedFinancialTermsScreen
        snapshot={acceptedFinancialTerms}
        onOpenTimeline={() => setStep('financial-timeline')}
        onBackToCase={() => setStep('summary')}
      />
    );
  }

  if (step === 'financial-report') {
    return (
      <ReportExternalPaymentScreen
        snapshot={acceptedFinancialTerms}
        state={reportState}
        initialAmount="20000"
        initialCurrency="SYP"
        initialMethod="نقدًا خارج المنصة"
        initialOccurredAt="2026-09-06T17:20:00+03:00"
        onSubmit={(draft) => {
          setLedger((current) => appendPatientPaymentReport(current, draft));
          setReportState('submitted');
        }}
        onCancel={() => {
          setReportState('editing');
          setStep('financial-timeline');
        }}
        onOpenTimeline={() => {
          setReportState('editing');
          setStep('financial-timeline');
        }}
      />
    );
  }

  if (step === 'financial-response' && selectedFinancialEvent) {
    return (
      <FinancialEventResponseScreen
        event={selectedFinancialEvent}
        state={responseState}
        onConfirm={() => {
          setLedger((current) => appendPatientFinancialResponse(current, selectedFinancialEvent.id, 'confirm'));
          setResponseState('responded-confirmed');
        }}
        onDispute={(reason) => {
          setLedger((current) => appendPatientFinancialResponse(current, selectedFinancialEvent.id, 'dispute', reason));
          setResponseState('responded-disputed');
        }}
        onBackToTimeline={() => {
          setSelectedFinancialEvent(null);
          setResponseState('ready');
          setStep('financial-timeline');
        }}
      />
    );
  }

  if (step === 'financial-timeline') {
    return (
      <FinancialTimelineScreen
        ledger={ledger}
        onOpenTerms={() => setStep('financial-terms')}
        onBackToCase={() => setStep('summary')}
        onReportPayment={() => {
          setReportState('editing');
          setStep('financial-report');
        }}
        onRespondToEvent={(event) => {
          setSelectedFinancialEvent(event);
          setResponseState('ready');
          setStep('financial-response');
        }}
      />
    );
  }

  return (
    <CaseTimelineScreen
      item={selectedCase}
      events={caseTimeline}
      hasOlder
      onLoadOlder={() => {}}
      onOpenRecord={(event) => {
        if (event.id === 'evt-plan-v2') setStep('plan');
        if (event.id === 'evt-stage-complete' || event.id === 'evt-stage-reopened') setStep('stage');
      }}
    />
  );
}
