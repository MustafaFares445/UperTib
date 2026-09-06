import { useState } from 'react';
import { acceptedTreatmentPlan, caseTimeline, patientCases, proposedTreatmentPlan, type PatientCase } from '../mocks/clinical';
import { reopenedPatientStage } from '../mocks/stages';
import { CaseSummaryScreen } from '../screens/CaseSummaryScreen';
import { CaseTimelineScreen } from '../screens/CaseTimelineScreen';
import { MyCasesScreen } from '../screens/MyCasesScreen';
import { PlanAcceptanceScreen } from '../screens/PlanAcceptanceScreen';
import { StageDetailScreen } from '../screens/StageDetailScreen';
import { TreatmentPlanScreen } from '../screens/TreatmentPlanScreen';

type Step = 'cases' | 'summary' | 'plan' | 'acceptance' | 'accepted-plan' | 'timeline' | 'stage';

/** FLOW-CLINICAL-008 plus the case-scoped plan and stage-reading branches. Local navigation state only. */
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