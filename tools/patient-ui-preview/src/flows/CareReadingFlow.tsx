import { useState } from 'react';
import { acceptedTreatmentPlan, caseTimeline, patientCases, proposedTreatmentPlan, type PatientCase } from '../mocks/clinical';
import { CaseSummaryScreen } from '../screens/CaseSummaryScreen';
import { CaseTimelineScreen } from '../screens/CaseTimelineScreen';
import { MyCasesScreen } from '../screens/MyCasesScreen';
import { PlanAcceptanceScreen } from '../screens/PlanAcceptanceScreen';
import { TreatmentPlanScreen } from '../screens/TreatmentPlanScreen';

type Step = 'cases' | 'summary' | 'plan' | 'acceptance' | 'accepted-plan' | 'timeline';

/** FLOW-CLINICAL-008 plus the case-scoped plan-reading branch. Local navigation state only. */
export function CareReadingFlow() {
  const [step, setStep] = useState<Step>('cases');
  const [selectedCase, setSelectedCase] = useState<PatientCase>(patientCases[0]);

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
    return (
      <TreatmentPlanScreen
        plan={{ ...acceptedTreatmentPlan, versionLabel: proposedTreatmentPlan.versionLabel, total: proposedTreatmentPlan.total, lines: proposedTreatmentPlan.lines }}
        onBackToCase={() => setStep('summary')}
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
      }}
    />
  );
}
