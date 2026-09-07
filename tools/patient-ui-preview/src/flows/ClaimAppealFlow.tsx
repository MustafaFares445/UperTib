import { useState } from 'react';
import {
  appealableProtectionDecisionClaim,
  defaultClaimAppealDraft,
  submitClaimAppeal,
  type ClaimAppealRecord,
} from '../mocks/claimAppeals';
import { ClaimAppealScreen } from '../screens/ClaimAppealScreen';
import { ClaimDetailScreen } from '../screens/ClaimDetailScreen';

type Step = 'detail' | 'appeal';

/** FLOW-CLAIMS-007 — Patient submits one append-only appeal against a readable claim decision. */
export function ClaimAppealFlow() {
  const [step, setStep] = useState<Step>('detail');
  const [appeal, setAppeal] = useState<ClaimAppealRecord>();
  const idempotencyKey = 'flow-claim-appeal:protection-decision-017:attempt-1';

  if (step === 'appeal') {
    return (
      <ClaimAppealScreen
        claim={appealableProtectionDecisionClaim}
        appeal={appeal}
        initialGrounds={defaultClaimAppealDraft.grounds}
        onSubmit={(draft) => {
          const result = submitClaimAppeal(appealableProtectionDecisionClaim, draft, {
            actorAuthorized: true,
            idempotencyKey,
            existingAppeal: appeal,
          });
          if (!result.appeal || result.blockedBy) return;
          setAppeal(result.appeal);
          setStep('detail');
        }}
        onBack={() => setStep('detail')}
      />
    );
  }

  return (
    <ClaimDetailScreen
      claim={appealableProtectionDecisionClaim}
      appeal={appeal}
      onAppeal={appeal ? undefined : () => setStep('appeal')}
      onBack={() => {}}
    />
  );
}
