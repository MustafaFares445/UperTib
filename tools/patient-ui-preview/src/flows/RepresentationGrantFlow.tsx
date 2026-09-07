import { useState } from 'react';
import {
  createConsentGrant,
  initialRepresentationGrants,
  representationActionOptions,
  representationDataScopeOptions,
  revokeRepresentationGrant,
  type ConsentGrantDraft,
  type RepresentationGrantProjection,
} from '../mocks/representation';
import { CreateGrantScreen } from '../screens/CreateGrantScreen';
import { FamilyRepresentationScreen } from '../screens/FamilyRepresentationScreen';
import { GrantDetailScreen } from '../screens/GrantDetailScreen';

type Step = 'family' | 'create' | 'detail';

/** FLOW-IDENTITY-002 + FLOW-IDENTITY-004 — consent grant creation and unconditional revocation. */
export function RepresentationGrantFlow() {
  const [step, setStep] = useState<Step>('family');
  const [grants, setGrants] = useState<RepresentationGrantProjection[]>(initialRepresentationGrants);
  const [selectedGrant, setSelectedGrant] = useState<RepresentationGrantProjection>(initialRepresentationGrants[0]);
  const createKey = 'representation-consent:mustafa:sara:attempt-1';

  if (step === 'create') {
    return (
      <CreateGrantScreen
        subjectPatientName="مصطفى فارس"
        initialGranteeName="ريم فارس"
        initialPurpose="المساعدة في متابعة المواعيد والخطة العلاجية أثناء فترة سفر قصيرة."
        initialActions={[representationActionOptions[0].label, representationActionOptions[1].label]}
        initialDataScope={[representationDataScopeOptions[0].label, representationDataScopeOptions[1].label]}
        initialPeriodMode="BOUNDED"
        onCreate={(draft: ConsentGrantDraft) => {
          const existing = grants.find((grant) => grant.idempotencyKey === createKey);
          const result = createConsentGrant(draft, {
            idempotencyKey: createKey,
            actorIsGrantor: true,
            existingGrant: existing,
          });
          if (!result.grant || result.blockedBy) return;
          setGrants((current) => current.some((grant) => grant.id === result.grant?.id)
            ? current
            : [...current, result.grant as RepresentationGrantProjection]);
          setSelectedGrant(result.grant);
          setStep('detail');
        }}
        onCancel={() => setStep('family')}
      />
    );
  }

  if (step === 'detail') {
    return (
      <GrantDetailScreen
        grant={selectedGrant}
        onRevoke={(reason) => {
          const result = revokeRepresentationGrant(selectedGrant, {
            actorAuthorized: true,
            reason,
            downstreamRecordState: 'CONFIRMED_BOOKING_AND_ACTIVE_CASE',
          });
          if (result.blockedBy) return;
          setSelectedGrant(result.grant);
          setGrants((current) => current.map((grant) => grant.id === result.grant.id ? result.grant : grant));
          setStep('family');
        }}
        onBack={() => setStep('family')}
      />
    );
  }

  return (
    <FamilyRepresentationScreen
      patientName="مصطفى فارس"
      grants={grants}
      onCreateGrant={() => setStep('create')}
      onOpenGrant={(grant) => {
        setSelectedGrant(grant);
        setStep('detail');
      }}
    />
  );
}
