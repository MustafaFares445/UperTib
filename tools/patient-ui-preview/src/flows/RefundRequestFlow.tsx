import { useState } from 'react';
import {
  defaultRefundEntitlement,
  initialPatientClaims,
  submitRefundRequest,
  type PatientClaimDetail,
} from '../mocks/claims';
import { ClaimDetailScreen } from '../screens/ClaimDetailScreen';
import { MyClaimsScreen } from '../screens/MyClaimsScreen';
import { RefundRequestScreen } from '../screens/RefundRequestScreen';

type Step = 'list' | 'refund' | 'detail';

/** FLOW-CLAIMS-001 — Patient requests a refund, then reads the resulting authoritative claim. */
export function RefundRequestFlow() {
  const [step, setStep] = useState<Step>('list');
  const [claims, setClaims] = useState<PatientClaimDetail[]>(initialPatientClaims);
  const [selectedClaim, setSelectedClaim] = useState<PatientClaimDetail>(initialPatientClaims[0]);
  const idempotencyKey = 'flow-refund-request:case-cleaning-002:attempt-1';

  if (step === 'refund') {
    return (
      <RefundRequestScreen
        entitlement={defaultRefundEntitlement}
        initialRequestedAmount="50000"
        initialReason="أطلب مراجعة استرداد مرتبط بالزيارة المسجلة في هذه الحالة."
        onSubmit={(draft) => {
          const existing = claims.find((claim) => claim.idempotencyKey === idempotencyKey);
          const result = submitRefundRequest(defaultRefundEntitlement, draft, {
            idempotencyKey,
            existingClaim: existing,
          });
          if (!result.claim || result.blockedBy) return;

          setClaims((current) => current.some((claim) => claim.id === result.claim?.id)
            ? current
            : [...current, result.claim as PatientClaimDetail]);
          setSelectedClaim(result.claim);
          setStep('detail');
        }}
        onCancel={() => setStep('list')}
      />
    );
  }

  if (step === 'detail') {
    return (
      <ClaimDetailScreen
        claim={selectedClaim}
        onBack={() => setStep('list')}
      />
    );
  }

  return (
    <MyClaimsScreen
      claims={claims}
      onOpenClaim={(claim) => {
        setSelectedClaim(claim);
        setStep('detail');
      }}
      onRequestRefund={() => setStep('refund')}
    />
  );
}
