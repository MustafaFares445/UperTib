import { useState } from 'react';
import { initialPatientClaims, type PatientClaimDetail } from '../mocks/claims';
import {
  acceptedProtectionEvidenceIds,
  defaultProtectionEntitlement,
  submitProtectionClaim,
  type ProtectionEntitlementProjection,
} from '../mocks/protectionClaims';
import { ClaimDetailScreen } from '../screens/ClaimDetailScreen';
import { MyClaimsScreen } from '../screens/MyClaimsScreen';
import { ProtectionClaimScreen } from '../screens/ProtectionClaimScreen';

type Step = 'list' | 'protection' | 'detail';

/** FLOW-CLAIMS-002 — entitlement-gated Patient protection claim. */
export function ProtectionClaimFlow({
  entitlement = defaultProtectionEntitlement,
}: {
  entitlement?: ProtectionEntitlementProjection;
}) {
  const [step, setStep] = useState<Step>('list');
  const [claims, setClaims] = useState<PatientClaimDetail[]>(initialPatientClaims);
  const [selectedClaim, setSelectedClaim] = useState<PatientClaimDetail>(initialPatientClaims[0]);
  const idempotencyKey = `flow-protection:${entitlement.caseId}:attempt-1`;
  const entryAllowed = entitlement.snapshotAvailable && entitlement.eligible && entitlement.activeProtection;

  if (step === 'protection') {
    return (
      <ProtectionClaimScreen
        entitlement={entitlement}
        initialRequestedRemedy="مراجعة الحاجة إلى متابعة إضافية ضمن الحماية المسجلة."
        initialNarrative="ظهرت حاجة إلى متابعة إضافية بعد الزيارة المسجلة، وأطلب مراجعة انطباق الحماية على هذه الوقائع."
        onSubmit={(draft) => {
          const existing = claims.find((claim) => claim.idempotencyKey === idempotencyKey);
          const result = submitProtectionClaim(entitlement, {
            ...draft,
            evidenceIds: acceptedProtectionEvidenceIds(entitlement),
          }, {
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
    return <ClaimDetailScreen claim={selectedClaim} onBack={() => setStep('list')} />;
  }

  return (
    <MyClaimsScreen
      claims={claims}
      onOpenClaim={(claim) => {
        setSelectedClaim(claim);
        setStep('detail');
      }}
      canRequestProtection={entryAllowed}
      protectionUnavailableReason="لا تظهر مطالبة الحماية لأن الشروط المقبولة لهذه الحالة لا تحتوي حماية فعّالة قابلة للاستخدام."
      onRequestProtection={() => setStep('protection')}
    />
  );
}
